import { prologLibraryExamples } from "./prolog-library-examples.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium, firefox, webkit } from "@playwright/test";
const base = process.env.TP_EXAMPLES_URL ?? "http://127.0.0.1:4173";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
try {
	const page = await browser.newPage();
	page.setDefaultTimeout(20000);
	page.on("pageerror", (error) => console.error(error));
	if (process.env.SWIPL_DIST)
		await page.route(
			"https://cdn.jsdelivr.net/npm/swipl-wasm@8.3.1/dist/swipl/*",
			async (route) => {
				const name = new URL(route.request().url()).pathname.split("/").at(-1);
				await route.fulfill({
					body: await readFile(`${process.env.SWIPL_DIST}/${name}`),
					contentType: name.endsWith(".js")
						? "application/javascript"
						: name.endsWith(".wasm")
							? "application/wasm"
							: "application/octet-stream",
					headers: { "access-control-allow-origin": "*" },
				});
			},
		);
	await page.route("**/__prolog-test", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async text => { window.prologCopiedText = text; } } });
	});
	for (const example of prologLibraryExamples) {
		console.log("Checking", example.library);
		await page.goto(base + "/__prolog-test");
		await page.evaluate(async label => {
			await import("/src/components/prolog/prolog.js");
			const html = await (await fetch("/docs/components/prolog/examples/examples.html")).text();
			const documentSource = new DOMParser().parseFromString(html, "text/html");
			const source = [...documentSource.querySelector("template").content.querySelectorAll('[role="example"]')].find(element => element.getAttribute("label") === label);
			if (!source) throw new Error(`Missing example: ${label}`);
			document.body.replaceChildren(document.importNode(source, true));
		}, example.label);
		const host = page.locator("tp-prolog");
		const queryPreview = page.locator('tp-textfield[label="Query"][readonly][copy-code]');
		assert.equal(await queryPreview.locator("input").inputValue(), example.query);
		assert.equal(await queryPreview.locator("input").getAttribute("readonly"), "");
		await queryPreview.hover();
		await queryPreview.locator("tp-copy-code").click();
		assert.equal(await page.evaluate(() => window.prologCopiedText), example.query);

		if (example.loading === "menu") {
			// In a fresh session these exact queries must fail before explicit loading.
			await host.evaluate((element, query) => element.run(query), example.query);
			assert.match(await host.locator(".tp-prolog-output").textContent(), /ERROR:/, example.library);
			await host.locator('[data-action="clear"]').click();
			await host.locator("[data-prolog-libraries-trigger]").click();
			await host.locator(`[data-prolog-library="${example.library}"]`).click();
			await page.waitForFunction(name => document.querySelector(`[data-prolog-library="${name}"]`)?.hasAttribute("data-loaded"), example.library);
		}

		const input = host.locator(".tp-prolog-prompt input");
		await input.click();
		assert.equal(await input.inputValue(), example.query, "Prefilled query");
		await input.fill(example.query + " ");
		await host.locator(".tp-prolog-prompt tp-textfield").hover();
		await host.locator(".tp-prolog-prompt tp-copy-code").click();
		assert.equal(await page.evaluate(() => window.prologCopiedText), example.query + " ");
		await input.fill(example.query);

		await host.locator('[data-action="run"]').click();
		await page.waitForFunction(() => document.querySelector("tp-prolog").getAttribute("aria-busy") === "false");
		const transcript = await host.locator(".tp-prolog-output").textContent();
		assert.equal(await host.locator(`[data-prolog-library="${example.library}"]`).getAttribute("data-loaded"), "", example.library + " loaded status");
		assert.doesNotMatch(transcript, /ERROR:/, example.library + "\n" + transcript);
		const answer = transcript.slice(transcript.lastIndexOf(`?- ${example.query}\n`) + example.query.length + 4).trim();
		if (example.library === "random") assert.match(answer, /^Die = [1-6]$/, answer);
		else assert.ok(answer.includes(example.expected), `${example.library}: expected ${example.expected}\n${answer}`);
		if (example.library === "plunit") {
			await host.evaluate(async element => {
				await element.toggleSource();
				element.querySelector("tp-code-editor").value = element.value.replace("double(2, 4)", "double(2, 5)");
				await element.applySource();
				await element.run("run_tests(arithmetic).");
			});
			assert.match(await host.locator(".tp-prolog-output").textContent(), /failed|false\./i);
		}
		console.log(example.library, "passed");
	}
	console.log("All 15 library examples passed; the DOM example is covered by check-prolog-browser.mjs.");
} finally {
	await browser.close();
}
