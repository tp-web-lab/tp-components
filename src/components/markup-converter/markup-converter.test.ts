import { afterEach, describe, expect, it, vi } from "vitest";
import {
	htmlToMarkup,
	markupLanguageFromPath,
	markupToHtml,
} from "../../utilities/markup-conversion.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import "./markup-converter.js";
import type { TpHtmlViewer } from "../html-viewer/html-viewer.js";

async function viewerOf(element: HTMLElement) {
	const viewer = element.querySelector<TpHtmlViewer>("[data-converter-viewer]");
	if (!viewer) throw new Error("Missing language viewer");
	await vi.waitFor(() =>
		expect(viewer.hasAttribute("data-tp-viewer-ready")).toBe(true),
	);
	return viewer;
}

vi.mock("@tp/tp-markdown/markdown/renderers/highlight", () => ({
	default: { render: vi.fn() },
}));
vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(),
	saveBlob: vi.fn(),
}));
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
function create(source: string, language = "html") {
	const element = document.createElement("tp-markup-converter");
	element.setSource(source, language);
	document.body.append(element);
	return element;
}
describe("tp-markup-converter", () => {
	it("converts HTML to native formats and selects the source tab", async () => {
		const element = create(
			"<h1>Workshop</h1><p>A <strong>practical</strong> introduction.</p><ul><li>Compare</li></ul>",
		);
		expect(await element.getMarkup("md")).toContain("**practical**");
		expect(await element.getMarkup("adoc")).toContain("*practical*");
		expect(await element.getMarkup("adoc")).toContain("= Workshop");
		expect(await element.getMarkup("rst")).toContain("Workshop\n========");
		expect(await element.getMarkup("rst")).toContain("**practical**");
		expect(await element.getMarkup("tex")).toContain("\\textbf{practical}");
		expect(
			element
				.querySelector("[data-converter-formats]")
				?.getAttribute("selected"),
		).toBe("0");
		expect(element.querySelectorAll("[data-converter-format]")).toHaveLength(5);
	});
	it("shows the comparison source in the center and updates it on conversion and reset", async () => {
		const element = create("<p>Workshop</p>");
		await element.getMarkup();
		const label = element.querySelector("[data-converter-source]");
		expect(label?.getAttribute("section")).toBe("center");
		expect(
			label?.querySelector("[data-converter-source-name]")?.textContent,
		).toBe("HTML");
		expect(label?.querySelector("tp-icon")?.getAttribute("name")).toBe(
			"file_type_html",
		);
		await element.convert("markdown");
		expect(
			label?.querySelector("[data-converter-source-name]")?.textContent,
		).toBe("tp-markdown");
		expect(label?.querySelector("tp-icon")?.getAttribute("name")).toBe(
			"file_type_markdown",
		);
		(await viewerOf(element)).reset();
		expect(
			label?.querySelector("[data-converter-source-name]")?.textContent,
		).toBe("HTML");
		expect(label?.querySelector("tp-icon")?.getAttribute("name")).toBe(
			"file_type_html",
		);
	});
	it("uses inline script language and preserves original whitespace", async () => {
		const element = document.createElement("tp-markup-converter");
		const script = document.createElement("script");
		script.type = "tp/md";
		script.textContent = "# Workshop\n\nHello **world**.\n";
		element.append(script);
		document.body.append(element);
		expect(await element.getMarkup("md")).toBe(
			"# Workshop\n\nHello **world**.",
		);
		expect(await element.getMarkup("html")).toContain("<strong>world</strong>");
		expect(
			element
				.querySelector("[data-converter-formats]")
				?.getAttribute("selected"),
		).toBe("3");
	});
	it("allows an empty value to override script content and updates attributes", async () => {
		const element = create("<p>Old</p>");
		await element.getMarkup("html");
		element.value = "";
		expect(await element.getMarkup("html")).toBe("");
		element.setSource("== Changed\n\n*Bold*", "adoc");
		expect(await element.getMarkup("html")).toContain("<strong>Bold</strong>");
		expect(
			element
				.querySelector("[data-converter-formats]")
				?.getAttribute("selected"),
		).toBe("1");
	});
	it("infers src language, gives it precedence and resolves relative media", async () => {
		const fetcher = vi.fn().mockResolvedValue({
			ok: true,
			text: async () => '<p><img src="image.png"></p>',
		});
		vi.stubGlobal("fetch", fetcher);
		const element = document.createElement("tp-markup-converter");
		element.value = "ignored";
		element.src = "https://example.com/docs/page.html?version=2";
		document.body.append(element);
		expect(await element.getMarkup("html")).toContain('src="image.png"');
		expect(await element.getMarkup("md")).toContain(
			"https://example.com/docs/image.png",
		);
		expect(fetcher).toHaveBeenCalledTimes(1);
	});
	it("discards stale loads", async () => {
		let release: (value: { ok: boolean; text: () => Promise<string> }) => void =
			() => {};
		vi.stubGlobal(
			"fetch",
			vi.fn(
				() =>
					new Promise((resolve) => {
						release = resolve;
					}),
			),
		);
		const element = document.createElement("tp-markup-converter");
		element.src = "/old.html";
		document.body.append(element);
		element.setSource("<p>New</p>", "html");
		await element.getMarkup("html");
		release({ ok: true, text: async () => "<p>Old</p>" });
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(await element.getMarkup("html")).toBe("<p>New</p>");
	});
	it("reports unknown formats and fetch failures without stale output", async () => {
		expect(() => markupLanguageFromPath("data.xlsx")).toThrow("Unsupported");
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 404 }),
		);
		const element = create("<p>Original</p>");
		await element.getMarkup("html");
		element.src = "/missing.md";
		await expect(element.getMarkup("md")).rejects.toThrow("404");
		expect(element.querySelector('[role="alert"]')?.textContent).toContain(
			"404",
		);
	});
	it("opens the global Files dropdown and offers all five import and export formats", async () => {
		const element = create("<p>Workshop</p>");
		await element.getMarkup();
		element.querySelector<HTMLElement>('[label="Files"]')?.click();
		expect(element.querySelector("tp-dropdown")?.hasAttribute("open")).toBe(
			true,
		);
		expect(element.querySelectorAll("[data-import]")).toHaveLength(5);
		expect(element.querySelectorAll("tp-dropdown [data-save]")).toHaveLength(5);
	});
	it("saves the requested code with the chosen filename", async () => {
		vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "workshop.md" });
		const element = create("<p><strong>Workshop</strong></p>");
		await element.getMarkup("md");
		element
			.querySelector<HTMLElement>('tp-dropdown [data-save="markdown"]')
			?.click();
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalled());
		expect(chooseSaveTarget).toHaveBeenCalledWith(
			expect.objectContaining({ extension: ".md" }),
		);
		expect(saveBlob).toHaveBeenCalledWith(expect.any(Blob), {
			filename: "workshop.md",
		});
	});
	it("resolves HTML preview assets against the loaded file", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response('<img src="shapes.svg" alt="Shapes">')),
		);
		const element = document.createElement("tp-markup-converter");
		element.src = "https://example.org/examples/images.html";
		document.body.append(element);
		await element.getMarkup("html");
		const viewer = await viewerOf(element);
		expect(await viewer.createRenderedDocument()).toContain(
			'<base href="https://example.org/examples/"',
		);
	});
	it("uses a lite viewer for each language instead of nested tabs", async () => {
		const element = create("<p><strong>Workshop</strong></p>");
		await element.getMarkup();
		const viewer = await viewerOf(element);
		expect(await viewer.createRenderedDocument()).toContain(
			"<strong>Workshop</strong>",
		);
		expect(element.querySelector("[data-converter-views]")).toBeNull();
		for (const language of [
			"html",
			"asciidoc",
			"latex",
			"markdown",
			"restructuredtext",
		]) {
			expect(
				element.querySelector(`tp-${language}-viewer[lite]`),
			).not.toBeNull();
		}
	});
	it("converts edited code without replacing the active editor and updates the other formats", async () => {
		const element = create("<p>Before</p>");
		await element.getMarkup();
		const viewer = await viewerOf(element);
		const editor = viewer;
		expect(editor).not.toBeNull();
		if (!editor) return;
		editor.setValue("<p><strong>After</strong></p>");
		viewer.querySelector<HTMLElement>('[data-role="run"]')?.click();
		await vi.waitFor(() => expect(element.value).toContain("After"));
		expect(element.querySelector("[data-converter-viewer]")).toBe(editor);
		expect(await element.getMarkup("md")).toContain("**After**");
		expect(element.value).toBe("<p><strong>After</strong></p>");
	});
	it("restores the original loaded document after conversion and replaces the baseline on a new load", async () => {
		const element = create("<p>Original</p>");
		await element.getMarkup();
		const viewer = await viewerOf(element);
		const editor = viewer;
		editor?.setValue("<p>Converted</p>");
		await element.convert("html");
		expect(await viewer.createRenderedDocument()).toContain("Converted");
		editor?.setValue("<p>Draft</p>");
		viewer.reset();
		expect(editor?.getValue()).toBe("<p>Original</p>");
		expect(await viewer.createRenderedDocument()).toContain("Original");
		expect(await element.getMarkup("html")).toBe("<p>Original</p>");
		expect(await element.getMarkup("markdown")).toContain("Original");
		expect(element.value).toBe("<p>Original</p>");
		expect(
			viewer.querySelector('[data-role="reset"]')?.getAttribute("name"),
		).toBe("refresh");
		element.setSource("<p>New document</p>", "html");
		await element.getMarkup();
		const nextViewer = await viewerOf(element);
		await nextViewer.setValue("<p>Modified</p>");
		await element.convert("html");
		nextViewer.reset();
		expect(nextViewer.getValue()).toBe("<p>New document</p>");
	});
	it("keeps the global toolbar and lite viewers without redundant local tools", async () => {
		const element = create("<p>Document</p>");
		await element.getMarkup();
		expect(
			element
				.querySelector('tp-toolbar [label="Files"]')
				?.getAttribute("section"),
		).toBe("start");
		for (const tag of ["tp-color", "tp-theme", "tp-fullscreen"])
			expect(
				element.querySelector(`tp-toolbar ${tag}`)?.getAttribute("section"),
			).toBe("end");
		expect(
			element.querySelectorAll("[data-converter-viewer][lite]"),
		).toHaveLength(5);
		expect(element.querySelectorAll("tp-screen, tp-save-image")).toHaveLength(
			0,
		);
		expect(
			element.querySelectorAll("[data-converter-format] [data-save]"),
		).toHaveLength(0);
		expect(element.querySelectorAll("tp-dropdown [data-save]")).toHaveLength(5);
	});

	it("round-trips native LaTeX headings, bold and lists", async () => {
		const source = htmlToMarkup(
			"<h1>Workshop</h1><p><strong>Practical</strong></p><ul><li>Compare</li></ul>",
			"latex",
		);
		const html = await markupToHtml(source, "latex", document.baseURI);
		expect(html).toContain("<strong>Practical</strong>");
		expect(html).toContain("Compare");
		expect(html).toContain("Workshop");
	});
});
