import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

async function openDocument(page: Page, src: string): Promise<void> {
	// Keep authored content in the response if Vite reloads after optimizing a
	// newly requested dependency; a reload must not turn the fixture into blank HTML.
	await page.route("**/accessibility-test.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Document loading</title></head><body class="tp-light"><main id="fixture"><tp-markup-single-page src="${src}"></tp-markup-single-page></main><script type="module" src="/src/tp-loader.ts"></script></body></html>`,
		}),
	);
	await page.goto("/accessibility-test.html");
}

test("a single page loads only its selected markup engine and can switch languages", async ({
	page,
}) => {
	const requests: string[] = [];
	page.on("request", (request) => requests.push(request.url()));
	await page.route("**/lazy-document.md", (route) =>
		route.fulfill({ body: "# Markdown on demand" }),
	);
	await page.route("**/lazy-document.adoc", (route) =>
		route.fulfill({ body: "== AsciiDoc on demand\n\nLoaded on demand." }),
	);
	await openDocument(page, "/lazy-document.md");
	const document = page.locator("tp-markup-single-page");
	await expect(document.locator("h1")).toHaveText("Markdown on demand");
	expect(
		requests.filter((url) =>
			/components\/(asciidoc|restructuredtext|calculator|clock|post-it-editor)\/|pyodide/.test(
				url,
			),
		),
	).toEqual([]);
	await document.evaluate((element) =>
		element.setAttribute("src", "/lazy-document.adoc"),
	);
	await expect(document.locator("h2")).toHaveText("AsciiDoc on demand");
	await document.evaluate((element) =>
		element.setAttribute("src", "/lazy-document.md"),
	);
	await expect(document.locator("h1")).toHaveText("Markdown on demand");
});

test("documentation defers hidden runtimes and keeps mobile controls accessible", async ({
	page,
}) => {
	const runtimes: string[] = [];
	page.on("request", (request) => {
		if (/pyodide|python_stdlib|docutils|pygments/.test(request.url()))
			runtimes.push(request.url());
	});
	await page.setViewportSize({ width: 393, height: 851 });
	await openDocument(page, "/docs/components/code-editor/index.md");
	const viewer = page.locator("tp-html-viewer");
	await page
		.locator('tp-include[src*="examples/examples.html"]')
		.scrollIntoViewIfNeeded();
	await expect(viewer.locator("select").first()).toBeAttached();
	await viewer.scrollIntoViewIfNeeded();
	await expect(
		viewer.getByRole("button", { name: "Show code", exact: true }),
	).toBeVisible();
	const result = await new AxeBuilder({ page })
		.withRules(["color-contrast", "target-size"])
		.analyze();
	expect(result.violations).toEqual([]);
	expect(runtimes).toEqual([]);
	const tabs = viewer.locator("xpath=ancestor::tp-tabs[1]");
	await tabs
		.locator(':scope > [data-tp-tablist] > [role="tab"]')
		.nth(3)
		.click();
	const rst = page.locator("tp-restructuredtext-viewer");
	await expect(rst.locator("select").first()).toBeVisible();
	await rst.scrollIntoViewIfNeeded();
	await expect(
		rst.frameLocator("iframe").locator("tp-code-editor"),
	).toBeVisible();
	expect(runtimes.length).toBeGreaterThan(0);
});

test("optional toolbar loading can be cancelled and restarted without replacing the document", async ({
	page,
}) => {
	let release: (() => void) | undefined;
	const pending = new Promise<void>((resolve) => {
		release = resolve;
	});
	let requested = false;
	await page.route("**/toolbar-components.ts*", async (route) => {
		requested = true;
		await pending;
		await route.continue();
	});
	await page.route("**/toolbar-document.md", (route) =>
		route.fulfill({ body: "# A document without controls" }),
	);
	await openDocument(page, "/toolbar-document.md");
	const document = page.locator("tp-markup-single-page");
	await expect(document.locator("h1")).toHaveText(
		"A document without controls",
	);
	expect(requested).toBe(false);
	await document.evaluate((element) =>
		element.setAttribute("toolbar", "clock,theme"),
	);
	await expect.poll(() => requested).toBe(true);
	await document.evaluate((element) => element.removeAttribute("toolbar"));
	release?.();
	await page.evaluate(() => customElements.whenDefined("tp-toolbar"));
	await expect(document.locator("tp-toolbar")).toHaveCount(0);
	await document.evaluate((element) =>
		element.setAttribute("toolbar", "clock,theme"),
	);
	await expect(document.locator("tp-toolbar tp-theme")).toBeVisible();
	await expect(document.locator("tp-toolbar tp-clock")).toBeVisible();
	await expect(document.locator("h1")).toHaveText(
		"A document without controls",
	);
});

test("document geometry is ready at insertion and delayed icons do not move the text", async ({
	page,
}) => {
	await page.setViewportSize({ width: 393, height: 851 });
	let release: (() => void) | undefined;
	const pending = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route("**/slow-document-icon.svg", async (route) => {
		await pending;
		await route.fulfill({
			contentType: "image/svg+xml",
			body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
		});
	});
	await page.route("**/stable-document.md", (route) =>
		route.fulfill({
			body: '# <tp-icon src="/slow-document-icon.svg" size="2em"></tp-icon> Stable title\n\n<tp-toc position="end" open expand-all></tp-toc>\n\n<tp-code-editor language="javascript">\n<script type="tp/javascript">\nconst value = 42;\nconsole.log(value);\n</script>\n</tp-code-editor>\n\n## Reading\n\n<p id="following-text">This text stays in place.</p>',
		}),
	);
	await page.addInitScript(() => {
		new MutationObserver((_records, observer) => {
			const text = document.getElementById("following-text");
			if (!text) return;
			text.dataset.layoutReady = String(
				["tp-toc"].every((tag) => Boolean(customElements.get(tag))),
			);
			observer.disconnect();
		}).observe(document, { childList: true, subtree: true });
	});
	await openDocument(page, "/stable-document.md");
	const text = page.locator("#following-text");
	await expect(text).toHaveAttribute("data-layout-ready", "true");
	await expect(page.locator("tp-code-editor .cm-content")).toContainText(
		"const value = 42",
	);
	const before = await text.boundingBox();
	release?.();
	await expect(page.locator("h1 tp-icon svg")).toBeVisible();
	const after = await text.boundingBox();
	expect(before).not.toBeNull();
	expect(after).not.toBeNull();
	expect(Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeLessThan(1);
});

test("offscreen inclusions and source editors load only when needed", async ({
	page,
}) => {
	const requested: string[] = [];
	page.on("request", (request) => requested.push(request.url()));
	await page.route("**/deferred-document.md", (route) =>
		route.fulfill({
			body: '# Deferred examples\n\n<div style="height:3000px"></div>\n\n::include{/deferred-example.html}\n\n::include{/deferred-example.md loading=lazy}\n\n<tp-asciidoc hidden>Never render this.</tp-asciidoc>',
		}),
	);
	await page.route("**/deferred-example.html", (route) =>
		route.fulfill({
			body: '<tp-html-viewer><script type="tp/html"><p>Deferred preview</p></script></tp-html-viewer>',
		}),
	);
	await page.route("**/deferred-example.md", (route) =>
		route.fulfill({ body: "Deferred Markdown inclusion." }),
	);
	await openDocument(page, "/deferred-document.md");
	await expect(page.locator("h1")).toHaveText("Deferred examples");
	await expect(page.locator("tp-include")).toBeAttached();
	expect(
		requested.filter((url) =>
			/deferred-example\.|code-editor\.ts|tp-asciidoc.*(?:deps|node_modules)|asciidoctor/.test(
				url,
			),
		),
	).toEqual([]);
	await page.locator("tp-include").scrollIntoViewIfNeeded();
	const viewer = page.locator("tp-html-viewer");
	await expect(viewer).toHaveAttribute("data-tp-viewer-ready", "");
	await expect(
		page.locator("tp-markdown[data-tp-defer-visibility]"),
	).toContainText("Deferred Markdown inclusion.");
	expect(requested.filter((url) => /code-editor\.ts/.test(url))).toEqual([]);
	await expect(viewer.locator("tp-code-editor")).toHaveCount(0);
	await viewer.getByRole("button", { name: "Show code", exact: true }).click();
	await expect(viewer.locator("tp-code-editor .cm-content")).toBeVisible();
	expect(requested.some((url) => /code-editor\.ts/.test(url))).toBe(true);
});

test("text paints before the editor module arrives without moving following content", async ({
	page,
}) => {
	let release: (() => void) | undefined;
	const pending = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route("**/code-editor.ts*", async (route) => {
		await pending;
		await route.continue();
	});
	await page.route("**/early-text.md", (route) =>
		route.fulfill({
			body: '# Early reading\n\n<p id="intro">Read this while the editor loads.</p>\n\n<tp-code-editor language="javascript" line-numbers><script type="tp/javascript">const value = 42;\nconsole.log(value);</script></tp-code-editor>\n\n<p id="after-editor">Following text</p>',
		}),
	);
	await page.setViewportSize({ width: 393, height: 851 });
	await openDocument(page, "/early-text.md");
	await expect(page.locator("#intro")).toBeVisible();
	await expect(page.locator("[data-tp-editor-preview]")).toContainText(
		"const value = 42;",
	);
	expect(
		await page.evaluate(() => Boolean(customElements.get("tp-code-editor"))),
	).toBe(false);
	const before = await page.locator("#after-editor").boundingBox();
	release?.();
	await expect(page.locator("tp-code-editor .cm-content")).toContainText(
		"console.log(value);",
	);
	await expect(page.locator("[data-tp-editor-preview]")).toHaveCount(0);
	await expect
		.poll(async () => (await page.locator("#after-editor").boundingBox())?.y)
		.toBeCloseTo(before?.y ?? 0, 0);
});

for (const [library, name, module] of [
	["languages", "file_type_python", "icon-library-languages"],
	["components", "alarm", "icon-component-source"],
]) {
	test(`offscreen ${library} icons keep their space and load on approach`, async ({
		page,
	}) => {
		const requested: string[] = [];
		page.on("request", (request) => requested.push(request.url()));
		await page.route("**/deferred-icons.md", (route) =>
			route.fulfill({
				body: `# Deferred icons\n\n<div style="height:3000px"></div>\n\n<tp-icon id="deferred-icon" library="${library}" name="${name}" size="2em"></tp-icon>\n\n<p id="after-icon">Following text</p>`,
			}),
		);
		await openDocument(page, "/deferred-icons.md");
		await page.evaluate(() => customElements.whenDefined("tp-icon"));
		const icon = page.locator("#deferred-icon");
		await expect(icon).toHaveCSS("--tp-icon-size", "2em");
		expect(requested.some((url) => url.includes(`${module}.ts`))).toBe(false);
		const before = await icon.boundingBox();
		await icon.scrollIntoViewIfNeeded();
		await expect(icon.locator("svg")).toBeVisible();
		expect(requested.some((url) => url.includes(`${module}.ts`))).toBe(true);
		const after = await icon.boundingBox();
		expect(after?.height).toBeCloseTo(before?.height ?? 0, 0);
		expect(after?.width).toBeCloseTo(before?.width ?? 0, 0);
	});
}
