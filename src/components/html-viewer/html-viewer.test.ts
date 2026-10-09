import { afterEach, expect, it, vi } from "vitest";
import { openViewerSource } from "../../test-helpers/viewer-source.js";
import { buildIframeDocument } from "./html-viewer.js";

afterEach(() => document.body.replaceChildren());
it.each([
	"<tp-box>Preview</tp-box>",
	"<html><body><tp-box>Preview</tp-box></body></html>",
	"<!doctype html><html><head></head><body><tp-box>Preview</tp-box></body></html>",
	"<!doctype html><tp-box>Preview</tp-box>",
])("provides inner spacing for shared viewer documents: %s", (source) => {
	for (const loadComponents of [true, false]) {
		const preview = new DOMParser().parseFromString(
			buildIframeDocument(source, null, loadComponents),
			"text/html",
		);
		expect(preview.querySelectorAll("[data-tp-viewer-spacing]")).toHaveLength(
			1,
		);
		expect(
			preview.querySelector("[data-tp-viewer-spacing]")?.textContent,
		).toContain("padding: 0.5rem");
		expect(preview.querySelector("tp-box")?.textContent).toBe("Preview");
	}
});
it.each([
	"<tp-question><dl><dt>Solution</dt><dd>Secret</dd></dl></tp-question>",
	"<html><body><tp-question>Secret</tp-question></body></html>",
	"<!doctype html><html><head></head><body><tp-question>Secret</tp-question></body></html>",
	"<!doctype html><tp-question>Secret</tp-question>",
])(
	"hides unupgraded components before the first iframe paint: %s",
	(source) => {
		const html = buildIframeDocument(source, null);
		expect(html).toContain(
			":not(:defined):not(mjx-container):not(mjx-container *) { display: none !important; }",
		);
		expect(html.indexOf("data-tp-viewer-pending-components")).toBeLessThan(
			html.indexOf("<tp-question"),
		);
		expect(buildIframeDocument(source, null, false)).not.toContain(
			"data-tp-viewer-pending-components",
		);
	},
);
it("renders editable HTML and its output", async () => {
	const element = document.createElement("tp-html-viewer");
	element.innerHTML = "<template><h1>Hello</h1></template>";
	document.body.append(element);
	await openViewerSource(element);
	await vi.waitFor(() =>
		expect(element.querySelector("tp-code-editor")).not.toBeNull(),
	);
	expect(element.querySelector<HTMLIFrameElement>("iframe")?.srcdoc).toContain(
		"<h1>Hello</h1>",
	);
});

it("covers document construction and all viewer output modes", async () => {
	const withComponent = buildIframeDocument(
		"<tp-card></tp-card>",
		"https://example.test/docs/page.html",
	);
	expect(withComponent).toContain("tp-loader");
	expect(withComponent).toContain(
		'<base href="https://example.test/docs/page.html"',
	);
	const imported = buildIframeDocument(
		'<script type="module">import "/components/card/card.js";</script><tp-card></tp-card>',
		null,
	);
	expect(imported).toContain("tp-loader");
	expect(imported).not.toContain("/dist/components/");
	expect(
		buildIframeDocument(
			"<!doctype html><html><head></head><body>Full</body></html>",
			"https://example.test/",
		),
	).toContain("<base");
	expect(
		buildIframeDocument(
			"<html><body>Full</body></html>",
			"https://example.test/",
		),
	).toContain("<head>");
	expect(buildIframeDocument("<tp-card></tp-card>", null, false)).not.toContain(
		"tp-loader",
	);

	const element = document.createElement("tp-html-viewer");
	const api = element as unknown as {
		readInlineSource(): { source: string };
		createExternalContext(url: URL): { baseHref: string };
		renderOutput(
			source: string,
			mode: "render" | "dom",
			container: HTMLElement,
			context: { baseHref: string | null },
		): Promise<void>;
	};
	element.innerHTML = '<script type="tp/html"><p>Script</p></script>';
	expect(api.readInlineSource().source).toContain("Script");
	element.innerHTML = "<template><p>Template</p></template>";
	expect(api.readInlineSource().source).toContain("Template");
	element.innerHTML = "<p>Host</p>";
	expect(api.readInlineSource().source).toContain("Host");
	expect(
		api.createExternalContext(
			new URL("https://example.test/a/b/example.html?x=1"),
		).baseHref,
	).toBe("https://example.test/a/b/?x=1");

	const output = document.createElement("div");
	await api.renderOutput(
		'<p data-value="x"> Text <!-- ignored --> </p>',
		"dom",
		output,
		{ baseHref: null },
	);
	expect(output.querySelector("tp-object-tree")).not.toBeNull();
	await api.renderOutput("   ", "render", output, { baseHref: null });
	expect(output.childElementCount).toBe(0);
	element.setAttribute("allow-script", "");
	element.setAttribute("no-loader", "");
	await api.renderOutput("<button>Speak</button>", "render", output, {
		baseHref: null,
	});
	expect(output.querySelector("iframe")?.allow).toBe("autoplay");
	expect(output.querySelector("iframe")?.srcdoc).not.toContain("tp-loader");
});

it("reports an external HTML loading failure", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => ({ ok: false, status: 503 })),
	);
	const element = document.createElement("tp-html-viewer");
	element.setAttribute("src", "/missing.html");
	document.body.append(element);
	await vi.waitFor(() =>
		expect(
			element.querySelector(".tp-markup-viewer-error")?.textContent,
		).toContain("503"),
	);
	vi.unstubAllGlobals();
});

it("does not inject tp-loader when no-loader is present", async () => {
	const element = document.createElement("tp-html-viewer");
	element.setAttribute("no-loader", "");
	element.innerHTML =
		"<template><tp-tutorial-demo></tp-tutorial-demo></template>";
	document.body.append(element);
	expect(document.querySelector("tp-tutorial-demo")).toBeNull();
	await vi.waitFor(() =>
		expect(element.querySelector("iframe")).not.toBeNull(),
	);
	expect(
		element.querySelector<HTMLIFrameElement>("iframe")?.srcdoc,
	).not.toContain("tp-loader");
});

it("removes generated runtime markup while preserving authored HTML", async () => {
	const source = `
    <div role="example" label="Sanitized">
      <!-- comment -->
      <span class="tp-color-option">generated</span>
      <div data-tp-internal="true">internal</div>
      <p style="broken; color: red">kept</p>
      <tp-accordion><dl><dt id="manual" title="kept">Title</dt><dd id="manual-content">Body</dd></dl></tp-accordion>
      <tp-dropdown data-source="items"><button role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false">Open</button></tp-dropdown>
      <tp-dropdown><button tabindex="0" aria-haspopup="menu" aria-expanded="false">Open</button></tp-dropdown>
    </div>`;
	const element = document.createElement("tp-html-viewer") as HTMLElement & {
		setSource(
			source: string,
			baseHref?: string | null,
			resetSource?: string,
		): void;
	};
	element.setSource(source, "https://example.test/examples/", "<p>reset</p>");
	document.body.append(element);
	await openViewerSource(element);
	await vi.waitFor(() =>
		expect(element.querySelector("tp-code-editor")).not.toBeNull(),
	);
	const editor = element.querySelector("tp-code-editor") as unknown as {
		getValue(): string;
	};
	const value = editor.getValue();
	expect(value).toContain("color: red");
	expect(value).toContain('title="kept"');
	expect(value).not.toContain("generated");
	expect(value).not.toContain("data-tp-internal");
});

it("preserves author reference scopes and their definitions", async () => {
	const viewer = document.createElement("tp-html-viewer");
	viewer.innerHTML =
		'<template><div data-tp-reference-scope><p>Text <tp-ref href="^note"></tp-ref></p><tp-note ref="note"><p>Note content</p></tp-note><tp-listof selector="tp-note"></tp-listof></div></template>';
	document.body.append(viewer);
	await vi.waitFor(() =>
		expect(viewer.querySelector("iframe")?.srcdoc).toContain("Note content"),
	);
	const source = viewer.querySelector("iframe")?.srcdoc ?? "";
	expect(source).toContain("data-tp-reference-scope");
	expect(source).toContain('href="^note"');
	expect(source).toContain('selector="tp-note"');
});
