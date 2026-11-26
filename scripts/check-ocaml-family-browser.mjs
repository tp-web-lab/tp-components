import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium, firefox, webkit, expect } from "@playwright/test";
const base = "http://127.0.0.1:4175";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
const page = await browser.newPage();
await page.addInitScript((root) => {
	globalThis.__tpTestRoot = root;
}, process.env.TP_OCAML_MODULE_ROOT ?? "/src");
// Generated API/manifests can trigger Vite reloads while fixtures are running.
// Keep this browser fixture independent from the development HMR connection.
await page.routeWebSocket("**", () => {});
try {
	page.setDefaultTimeout(60000);
	page.on("pageerror", (e) => console.error(e));
	await page.route("**/__ocaml-family", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	for (const tag of ["ocaml-playground", "ocaml-viewer"]) {
		await page.goto(base + "/__ocaml-family");
		await page.evaluate(async (tag) => {
			await import(`${globalThis.__tpTestRoot}/components/${tag}/${tag}.js`);
			const el = document.createElement(`tp-${tag}`);
			el.src = "/docs/components/_shared/intro-projects/ocaml.json";
			document.body.append(el);
		}, tag);
		await page.waitForFunction(
			(tag) =>
				document
					.querySelector(`tp-${tag}`)
					?.getProject()
					?.findFile("/main.ml")
					?.content.includes("square"),
			tag,
		);
		const host = page.locator(`tp-${tag}`);
		await host.evaluate((el) => el.run());
		const frame = host.frameLocator("iframe").first();
		await expect(frame.locator("#ocaml-message")).toHaveCount(0);
		await expect(frame.locator("[data-ocaml-output]")).toContainText(
			"[1; 4; 9]",
		);
		await expect(frame.locator("[data-ocaml-output]")).toContainText("49");
		// Observe native iframe and panel adapting to asynchronous growth and shrinkage.
		const dimensions = await host.evaluate(async (el) => {
			const frame = el.querySelector("iframe");
			const wait = () => new Promise((r) => setTimeout(r, 500));
			const before = frame.getBoundingClientRect().height;
			const extra = frame.contentDocument.createElement("div");
			extra.style.height = "600px";
			frame.contentDocument.body.append(extra);
			await wait();
			const large = frame.getBoundingClientRect().height;
			extra.remove();
			await wait();
			const shrunk = frame.getBoundingClientRect().height;
			return { before, large, shrunk };
		});
		assert.ok(
			dimensions.large > dimensions.before + 300 &&
				dimensions.shrunk < dimensions.large - 300,
			JSON.stringify(dimensions),
		);
		await host.evaluate((el) => {
			const p = el.getProject();
			p.files.push({
				path: "/helpers.ml",
				language: "ocaml",
				content: "let triple x = x * 3;;",
			});
			p.findFile("/main.ml").content = '#use "helpers.ml";; triple 7;;';
			el.setProject(p);
			return el.run();
		});
		await expect(
			host.frameLocator("iframe").first().locator("[data-ocaml-output]"),
		).toContainText("- : int = 21", { timeout: 60000 });
		console.log(
			tag,
			"project DOM, local files, standard library and iframe resizing passed",
		);
	}
	for (const tag of ["ocaml-playground-question", "ocaml-viewer-question"]) {
		await page.goto(base + "/__ocaml-family");
		const intro = await readFile(
			new URL(
				`../public/docs/components/${tag}/examples/introduction.html`,
				import.meta.url,
			),
			"utf8",
		);
		await page.evaluate(
			async ({ tag, intro }) => {
				await import(`${globalThis.__tpTestRoot}/components/${tag}/${tag}.js`);
				document.body.innerHTML = intro;
			},
			{ tag, intro },
		);
		await page.waitForFunction(
			(tag) => document.querySelector(`tp-${tag}`)?.ready,
			tag,
		);
		await page.locator(`tp-${tag} [data-action="submit"] button`).click();
		await page.waitForFunction(
			() =>
				[...document.querySelectorAll("iframe")].some((f) =>
					f.contentDocument?.querySelector('[data-ocaml-test-status="failed"]'),
				),
			null,
			{ timeout: 60000 },
		);
		await page.locator(`tp-${tag}`).evaluate((el) => {
			const c = el.control;
			const p = c.getProject();
			p.findFile(p.entry).content = "let double x = x * 2;;";
			c.setProject(p);
		});
		await page.locator(`tp-${tag} [data-action="submit"] button`).click();
		await page.waitForFunction(
			() =>
				[...document.querySelectorAll("iframe")].some((f) =>
					f.contentDocument?.querySelector('[data-ocaml-test-status="passed"]'),
				),
			null,
			{ timeout: 60000 },
		);
		console.log(tag, "failed then passing assertions verified");
	}
	await page.goto(base + "/__ocaml-family");
	const intro = await readFile(
		new URL(
			"../public/docs/components/ocaml-notebook/examples/introduction.html",
			import.meta.url,
		),
		"utf8",
	);
	await page.evaluate(async (intro) => {
		await import(
			`${globalThis.__tpTestRoot}/components/ocaml-notebook/ocaml-notebook.js`
		);
		document.body.innerHTML = intro;
	}, intro);
	const notebook = page.locator("tp-ocaml-notebook");
	await expect(notebook.locator("tp-ocaml-viewer")).toHaveCount(2);
	await notebook.locator('[data-action="run-all"] button').click();
	await expect(
		notebook
			.locator("tp-ocaml-viewer")
			.nth(1)
			.frameLocator("iframe")
			.first()
			.locator("[data-ocaml-output]"),
	).toContainText("49", { timeout: 60000 });
	const html = await notebook.evaluate(async (el) =>
		(await el.htmlBlob()).text(),
	);
	await page.route("**/__ocaml-export", (route) =>
		route.fulfill({ contentType: "text/html", body: html }),
	);
	await page.goto(base + "/__ocaml-export");
	const runAll = page.locator("[data-tp-notebook-export-run]");
	await expect(runAll).not.toHaveAttribute("disabled", { timeout: 60000 });
	await runAll.click();
	await expect(
		page
			.locator("tp-ocaml-viewer")
			.nth(1)
			.frameLocator("iframe")
			.first()
			.locator("[data-ocaml-output]"),
	).toContainText("49", { timeout: 60000 });
	await page.locator("[data-tp-notebook-export-reset]").click();
	await runAll.click();
	await expect(
		page
			.locator("tp-ocaml-viewer")
			.nth(1)
			.frameLocator("iframe")
			.first()
			.locator("[data-ocaml-output]"),
	).toContainText("49", { timeout: 60000 });
	console.log(
		"OCaml notebook, shared cells, standalone HTML and reset/run passed",
	);
} catch (error) {
	console.error(
		await page.evaluate(() => ({
			text: document.body.innerText,
			frames: [...document.querySelectorAll("iframe")].map(
				(f) => f.contentDocument?.body?.innerText,
			),
		})),
	);
	throw error;
} finally {
	await browser.close();
}
