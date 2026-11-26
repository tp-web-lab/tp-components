import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium, firefox, webkit } from "@playwright/test";
const baseUrl = process.env.TP_EXAMPLES_URL ?? "http://127.0.0.1:4173";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
try {
	const page = await browser.newPage({
		viewport: { width: 1100, height: 850 },
	});
	const checkEngine = async (selector) => {
		const info = page.locator(selector).first();
		await info.waitFor({ state: "visible" });
		assert.equal(await info.textContent(), "Engine: SWI-Prolog 10.1.21 · WASM: swipl-wasm 8.3.1");
		assert.deepEqual(await info.locator("a").evaluateAll(links => links.map(link => link.href)), [
			"https://www.swi-prolog.org/pldoc/refman/",
			"https://github.com/SWI-Prolog/npm-swipl-wasm",
		]);
	};
	page.setDefaultTimeout(60000);
	page.on("requestfailed", (r) =>
		console.error("request failed", r.url(), r.failure()?.errorText),
	);
	page.on("pageerror", (error) => console.error(error.stack));
	if (process.env.SWIPL_DIST)
		await page.route(
			"https://cdn.jsdelivr.net/npm/swipl-wasm@8.3.1/dist/swipl/*",
			async (route) => {
				const name = new URL(route.request().url()).pathname.split("/").at(-1);
				await route.fulfill({
					contentType: name.endsWith(".js")
						? "application/javascript"
						: name.endsWith(".wasm")
							? "application/wasm"
							: "application/octet-stream",
					body: await readFile(process.env.SWIPL_DIST + "/" + name),
					headers: { "access-control-allow-origin": "*" },
				});
			},
		);
	await page.route("**/__swipl-components", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await page.goto(`${baseUrl}/__swipl-components`);
	for (const tag of ["prolog-viewer", "prolog-playground"]) {
		console.log("Mounting", tag);
		await page.goto(`${baseUrl}/__swipl-components`);
		await page.evaluate(async (tag) => {
			await import(`/src/components/${tag}/${tag}.js`);
			document.body.replaceChildren();
			const e = document.createElement("tp-" + tag);
			e.setAttribute(
				"repository",
				"/examples/playgrounds/prolog-playground/06-swipl-dom-constraints",
			);
			document.body.append(e);
		}, tag);
		console.log("Waiting for source", tag);
		await page.waitForFunction(
			(tag) =>
				document
					.querySelector("tp-" + tag)
					?.getProject()
					.findFile("/program.pl")
					?.content.includes("setup_dom"),
			tag,
		);
		await checkEngine(`tp-${tag} [data-tp-prolog-engine]`);
		console.log("Running", tag);
		await page.evaluate(
			(tag) => document.querySelector("tp-" + tag).run(),
			tag,
		);
		const native = page.locator(`tp-${tag} tp-iframe iframe`).first();
		const frame = await (await native.elementHandle()).contentFrame();
		console.log("Frame", frame.url());
		await frame
			.waitForFunction(
				() =>
					document
						.querySelector("[data-tp-prolog-output]")
						?.textContent.includes("X = 3"),
				null,
				{ timeout: 15000 },
			)
			.catch(async (error) => {
				console.error(await frame.locator("body").innerText());
				throw error;
			});
		await frame.locator("#solve").click();
		await frame.waitForFunction(
			() =>
				document.querySelector("#solutions")?.textContent ===
				"Solutions: [1,2,3]",
		);
		const wide = (await native.boundingBox()).width;
		await page.setViewportSize({ width: 620, height: 850 });
		await page.waitForFunction(
			({ selector, wide }) =>
				document.querySelector(selector).getBoundingClientRect().width <
				wide - 100,
			{ selector: `tp-${tag} tp-iframe iframe`, wide },
		);
		await frame.locator("#solve").click();
		assert.equal(
			await frame.locator("#solutions").textContent(),
			"Solutions: [1,2,3]",
		);
		await page.setViewportSize({ width: 1100, height: 850 });
		const baseline = (await native.boundingBox()).height;
		await frame.evaluate(() => {
			const block = document.createElement("div");
			block.id = "height-probe";
			block.style.height = "450px";
			document.body.append(block);
		});
		await page.waitForFunction(
			(selector) =>
				document.querySelector(selector).getBoundingClientRect().height > 500,
			`tp-${tag} tp-iframe iframe`,
		);
		const grown = (await native.boundingBox()).height;
		assert.ok(grown > baseline + 300);
		await frame.locator("#height-probe").evaluate((node) => node.remove());
		await page.waitForFunction(
			({ selector, grown }) =>
				document.querySelector(selector).getBoundingClientRect().height <
				grown - 300,
			{ selector: `tp-${tag} tp-iframe iframe`, grown },
		);
		console.log(
			tag,
			"native DOM events, CLP(FD), growing/shrinking iframe passed",
		);
	}
	for (const tag of ["prolog-playground-question", "prolog-viewer-question"]) {
		await page.goto(`${baseUrl}/__swipl-components`);
		await page.evaluate(async (tag) => {
			await import(`/src/components/${tag}/${tag}.js`);
			document.body.replaceChildren();
			const e = document.createElement("tp-" + tag);
			e.setAttribute("open", "");
			e.setAttribute(
				"src",
				"/docs/components/playground-question/examples/prolog/double.pl",
			);
			e.setAttribute(
				"test",
				"/docs/components/playground-question/examples/prolog/double.test.pl",
			);
			e.innerHTML =
				"<dl><dt>Title</dt><dd>Double a number</dd><dt>Prompt</dt><dd>Complete double.</dd></dl>";
			document.body.append(e);
		}, tag);
		await page.waitForFunction(
			(tag) => document.querySelector("tp-" + tag)?.ready,
			tag,
		);
		await checkEngine(`tp-${tag} [data-tp-prolog-engine]`);
		await page.evaluate((tag) => {
			const control = document.querySelector("tp-" + tag).control;
			const project = control.getProject();
			project.findFile(project.entry).content = "double(X,Y) :- Y is X.";
			control.setProject(project);
		}, tag);
		await page.locator(`tp-${tag} [data-action="submit"]`).click();
		await page.waitForFunction(() =>
			[...document.querySelectorAll("iframe")].some((e) =>
				e.contentDocument
					?.querySelector("[data-tp-prolog-test-output]")
					?.textContent.includes("PlUnit: failed"),
			),
		);
		await page.evaluate((tag) => {
			const e = document.querySelector("tp-" + tag);
			const control = e.control;
			const project = control.getProject();
			project.findFile(project.entry).content = "double(X,Y) :- Y is X*2.";
			control.setProject(project);
		}, tag);
		await page.locator(`tp-${tag} [data-action="submit"]`).click();
		await page.waitForFunction(() =>
			[...document.querySelectorAll("iframe")].some((e) =>
				e.contentDocument
					?.querySelector("[data-tp-prolog-test-output]")
					?.textContent.includes("PlUnit: passed"),
			),
		);
		console.log(tag, "PlUnit failure then success passed");
	}
	await page.goto(`${baseUrl}/__swipl-components`);
	await page.evaluate(async () => {
		await import("/src/components/prolog-notebook/prolog-notebook.js");
		const html = await (
			await fetch("/docs/components/prolog-notebook/examples/examples.html")
		).text();
		const doc = new DOMParser().parseFromString(html, "text/html");
		const template = doc.querySelector("template");
		const example = template.content.querySelector(
			'[label="Constraints and PlUnit"] tp-prolog-notebook',
		);
		if (!example) throw new Error("Missing documented constraints notebook");
		document.body.replaceChildren(document.importNode(example, true));
	});
	await checkEngine("tp-prolog-notebook > [data-tp-notebook-root] > [data-tp-prolog-engine]");
	console.log("Running notebook");
	await page.waitForFunction(
		() =>
			document.querySelectorAll("tp-prolog-notebook [data-tp-playground-run]")
				.length === 3,
	);
	await page.locator('tp-prolog-notebook [data-action="run-all"]').click();
	await page
		.waitForFunction(
			() =>
				[...document.querySelectorAll("iframe")].some((e) =>
					e.contentDocument
						?.querySelector("[data-tp-prolog-output]")
						?.textContent.includes("X = 2, Y = 3"),
				),
			null,
			{ timeout: 20000 },
		)
		.catch(async (error) => {
			console.error(
				await page.evaluate(() => ({
					cells: document.querySelector("tp-prolog-notebook")?.cells,
					frames: [...document.querySelectorAll("iframe")].map(
						(e) => e.contentDocument?.body?.innerText,
					),
				})),
			);
			throw error;
		});
	await page.waitForFunction(
		() =>
			[...document.querySelectorAll("iframe")].some((e) => {
				const text =
					e.contentDocument?.querySelector("[data-tp-prolog-output]")
						?.textContent ?? "";
				return (
					[
						"pairs:solutions",
						"pairs:equal_values",
						"pairs:outside_domain",
					].every((name) => text.includes(name)) &&
					(text.match(/passed \(/g) ?? []).length === 3 &&
					text.trimEnd().endsWith("true.")
				);
			}),
		null,
		{ timeout: 30000 },
	);
	console.log("Notebook completed, exporting");
	const exported = await page.evaluate(() =>
		document.querySelector("tp-prolog-notebook").standaloneHtml(),
	);
	await page.route("**/__swipl-export", (route) =>
		route.fulfill({ contentType: "text/html", body: exported }),
	);
	await page.goto(`${baseUrl}/__swipl-export`);
	await checkEngine("body > [data-tp-prolog-engine]");
	await page.locator("[data-tp-notebook-export-run]:not([disabled])").click();
	await page
		.waitForFunction(
			() =>
				[...document.querySelectorAll("iframe")].some((e) =>
					e.contentDocument
						?.querySelector("[data-tp-prolog-output]")
						?.textContent.includes("X = 2, Y = 3"),
				),
			null,
			{ timeout: 20000 },
		)
		.catch(async (error) => {
			console.error(
				await page.evaluate(() => ({
					cells: document.querySelector("tp-prolog-notebook")?.cells,
					frames: [...document.querySelectorAll("iframe")].map(
						(e) => e.contentDocument?.body?.innerText,
					),
				})),
			);
			throw error;
		});
	await page.waitForFunction(
		() =>
			[...document.querySelectorAll("iframe")].some((e) => {
				const text =
					e.contentDocument?.querySelector("[data-tp-prolog-output]")
						?.textContent ?? "";
				return (
					[
						"pairs:solutions",
						"pairs:equal_values",
						"pairs:outside_domain",
					].every((name) => text.includes(name)) &&
					(text.match(/passed \(/g) ?? []).length === 3 &&
					text.trimEnd().endsWith("true.")
				);
			}),
		null,
		{ timeout: 30000 },
	);
	console.log(
		"Documented notebook and exported HTML: CLP(FD) solutions and three PlUnit tests passed",
	);
} finally {
	await browser.close();
}
