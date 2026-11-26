import { expect } from "@playwright/test";
import { prologLibraryExamples } from "./prolog-library-examples.mjs";
import { viewerSource } from "./component-basic-examples.mjs";
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
	for (const [language, extension] of [["html", "html"], ["asciidoc", "adoc"], ["latex", "tex"], ["markdown", "md"], ["restructuredtext", "rst"]]) {
		console.log("Checking real viewer", language);
		await page.goto(base + "/__prolog-test");
		const fixture = await readFile(new URL(`../public/docs/components/prolog/examples/examples.${extension}`, import.meta.url), "utf8");
		const source = extension === "tex" ? fixture : viewerSource(extension, fixture);
		await page.evaluate(async ({language,source}) => {
			await import(`/src/components/${language}-viewer/${language}-viewer.js`);
			const viewer = document.createElement(`tp-${language}-viewer`);
			viewer.setAttribute("allow-script", "");
			if (language === "html") {
				viewer.setAttribute("preserve-source", "");
				const template = document.createElement("template");
				template.innerHTML = source;
				viewer.append(template);
			} else {
				const script = document.createElement("script");
				script.type = `tp/${language}`;
				script.textContent = source;
				viewer.append(script);
			}
			document.body.replaceChildren(viewer);
		}, {language,source});
		const viewer = page.locator(`tp-${language}-viewer`).first();
		const chooser = viewer.locator('select[aria-label="Example"]').first();
		await chooser.selectOption({label:"DOM elements and click events"}, {timeout:60000});
		const frame = viewer.frameLocator("iframe").first();
		const host = frame.locator("tp-prolog");
		await host.locator("[data-prolog-libraries-trigger]").waitFor({timeout:60000});
		const input = host.locator(".tp-prolog-prompt input");
		await expect(input).toHaveValue("setup_dom.", {timeout:30000});
		await expect(frame.locator('tp-textfield[label="Query"][readonly][copy-code] input')).toHaveValue("setup_dom.", {timeout:30000});
		const queryPreview = frame.locator('tp-textfield[label="Query"][readonly][copy-code]');
		const geometry = await queryPreview.evaluate(field => {
			const label = field.querySelector('[data-tp-textfield-label-text]').getBoundingClientRect();
			const control = field.querySelector('[data-tp-textfield-control]').getBoundingClientRect();
			const bounds = field.getBoundingClientRect();
			const parent = field.parentElement;
			const style = getComputedStyle(parent);
			return { centerGap: Math.abs(label.y + label.height / 2 - control.y - control.height / 2), rightGap: Math.abs(bounds.right - control.right), width: bounds.width, available: parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) };
		});
		assert.ok(geometry.centerGap < 2 && geometry.rightGap < 2 && Math.abs(geometry.width - geometry.available) < 3, language + JSON.stringify(geometry));


		await input.click();
		await expect(input).toHaveValue("setup_dom.", {timeout:30000});
		await host.locator('[data-action="run"]').click();
		await frame.locator("#prolog-dom-demo tp-button button").waitFor();
		await host.locator('[data-prolog-library="dom"][data-loaded]').waitFor({state:"attached"});
		await frame.locator("#prolog-dom-demo tp-button button").click();
		assert.equal(await frame.locator("#prolog-dom-demo p").textContent(), "The click was handled by Prolog!");
		await host.locator('[data-action="reset"]').click();
		await expect(input).toHaveValue("setup_dom.", {timeout:30000});
		for (const example of prologLibraryExamples.filter(item => ["clpfd", "dcg/basics", "wasm"].includes(item.library))) {
			await chooser.selectOption({label: example.label});
			await expect(input).toHaveValue(example.query, {timeout:30000});
		}
		console.log(language, "DOM click and prefilled queries passed");
	}
} finally {
	await browser.close();
}
