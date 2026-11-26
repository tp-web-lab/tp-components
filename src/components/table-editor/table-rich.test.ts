import { afterEach, expect, it, vi } from "vitest";
import "../prose-editor/prose-editor.js";
import type { TpProseEditor } from "../prose-editor/prose-editor.js";
import { TpTableEditor } from "./table-editor.js";
import {
	serializeTable,
	type TableData,
	tableSpreadsheetCells,
} from "./table-markup.js";
import { parseTableSource } from "./table-source.js";

afterEach(() => document.body.replaceChildren());
const rich =
	'<p>Hello <strong>world</strong></p><img src="/example.png" alt="Example"><tp-markdown><script type="tp/markdown">## Heading</script></tp-markdown>';
function create() {
	const editor = new TpTableEditor();
	editor.innerHTML = `<table><tr><td data-type="rich">${rich}</td><td>Text &amp; &lt;literal&gt;</td></tr></table>`;
	document.body.append(editor);
	return editor;
}
it("edits rich HTML and preserves content through undo/redo", () => {
	const editor = create();
	expect(editor.getCellType(0, 0)).toBe("rich");
	const field = editor.querySelector<TpProseEditor>("tp-prose-editor");
	if (!field) throw new Error("Missing rich editor");
	expect(field.value).toContain("<strong>world</strong>");
	const next = "<p>Edited <em>cell</em></p>";
	field.value = next;
	field.dispatchEvent(
		new CustomEvent("tp-prose-editor-input", {
			bubbles: true,
			detail: { value: next },
		}),
	);
	expect(editor.getData().cells[0]?.[0]).toBe(next);
	expect(editor.getMarkup("html")).toContain(next);
	editor.undo();
	expect(editor.getData().cells[0]?.[0]).toBe(rich);
	editor.redo();
	expect(editor.getData().cells[0]?.[0]).toBe(next);
});
it("converts literal text safely and restores rich content after changing type", () => {
	const editor = create();
	editor.setCellType(0, 1, "rich");
	expect(editor.getData().cells[0]?.[1]).toBe("Text &amp; &lt;literal&gt;");
	editor.setCellType(0, 0, "text");
	expect(editor.getData().cells[0]?.[0]).toContain("Hello world");
	expect(editor.getData().cells[0]?.[0]).not.toContain("<strong>");
	editor.undo();
	expect(editor.getCellType(0, 0)).toBe("rich");
	expect(editor.getData().cells[0]?.[0]).toBe(rich);
});
it("makes rich cells readonly and ignores edits", () => {
	const editor = create();
	editor.readonly = true;
	const field = editor.querySelector("tp-prose-editor");
	expect(field?.hasAttribute("readonly")).toBe(true);
	field?.dispatchEvent(
		new CustomEvent("tp-prose-editor-input", {
			bubbles: true,
			detail: { value: "Changed" },
		}),
	);
	expect(editor.getData().cells[0]?.[0]).toBe(rich);
});
it("preserves HTML markup and supplies readable text for spreadsheet exports", () => {
	const data: TableData = {
		cells: [[rich]],
		header: false,
		caption: "",
		alignments: ["left"],
		cellTypes: [["rich"]],
	};
	expect(serializeTable(data, "html")).toContain(rich);
	expect(serializeTable(data, "markdown")).toContain("tp-markdown");
	expect(serializeTable(data, "restructuredtext")).toContain("tp-markdown");
	expect(serializeTable(data, "asciidoc")).toContain("tp-markdown");
	expect(serializeTable(data, "latex")).not.toContain("<strong>");
	expect(tableSpreadsheetCells(data)[0]?.[0]).toContain("Hello world");
	expect(tableSpreadsheetCells(data)[0]?.[0]).toContain("Example");
});
it("reimports rich HTML without flattening cells", async () => {
	const editor = create();
	const table = await parseTableSource(
		editor.getMarkup("html"),
		new URL("https://example.org/table.html"),
		new AbortController().signal,
	);
	const imported = new TpTableEditor();
	imported.append(table);
	document.body.append(imported);
	expect(imported.getCellType(0, 0)).toBe("rich");
	expect(imported.getData().cells[0]?.[0]).toContain("<strong>world</strong>");
});

it("preserves formatted text and media in the AsciiDoc renderer", async () => {
	const editor = create();
	const table = await parseTableSource(
		editor.getMarkup("asciidoc"),
		new URL("https://example.org/table.adoc"),
		new AbortController().signal,
	);
	expect(table.querySelector("strong")?.textContent).toBe("world");
	expect(table.querySelector("img")?.getAttribute("src")).toBe("/example.png");
	expect(table.querySelector("tp-markdown")).not.toBeNull();
});

it("initializes the real prose editor with rich media and embedded markup", async () => {
	const editor = create();
	const field = editor.querySelector<TpProseEditor>("tp-prose-editor");
	if (!field) throw new Error("Missing prose editor");
	await vi.waitFor(() =>
		expect(field.querySelector(".ProseMirror")).not.toBeNull(),
	);
	expect(field.getHTML()).toContain("<strong>world</strong>");
	expect(field.getHTML()).toContain("example.png");
	expect(field.getHTML()).toContain("Heading");
});

it("exports multimedia commands and renders videos and audio inside LaTeX cells", async () => {
	const { renderLatexToFragment } = await import("@tp/tp-latex");
	const data: TableData = {
		cells: [
			[
				'<p><strong>Watch</strong></p><video controls loop width="240" poster="poster_test.png" src="clips/my_clip.mp4"></video><audio controls><source src="sound.wav" type="audio/wav"></audio>',
			],
		],
		header: false,
		caption: "Media",
		alignments: ["left"],
		cellTypes: [["rich"]],
	};
	const source = serializeTable(data, "latex");
	expect(source).toContain("\\usepackage{multimedia}");
	expect(source).toContain("\\movie[");
	expect(source).toContain("\\sound[");
	expect(source).toContain("\\textbf{Watch}");
	const root = renderLatexToFragment(source);
	const video = root.querySelector("td video");
	expect(video?.getAttribute("src")).toBe("clips/my_clip.mp4");
	expect(video?.getAttribute("poster")).toBe("poster_test.png");
	expect(video?.hasAttribute("controls")).toBe(true);
	expect(video?.hasAttribute("loop")).toBe(true);
	const audio = root.querySelector("td audio");
	expect(audio?.hasAttribute("controls")).toBe(true);
	expect(audio?.hasAttribute("src")).toBe(false);
	expect(audio?.querySelector(":scope > source")?.getAttribute("src")).toBe(
		"sound.wav",
	);
	expect(audio?.querySelector(":scope > source")?.getAttribute("type")).toBe(
		"audio/wav",
	);
});

it.each([
	'<audio controls src="sound.wav"></audio>',
	'<audio controls><source src="sound.wav" type="audio/wav"></audio>',
	'<audio controls loop><source src="sound.ogg" type="audio/ogg"><source src="sound.wav" type="audio/wav"></audio>',
])(
	"preserves audio source structure through table HTML/LaTeX returns: %s",
	async (audio) => {
		const { htmlToMarkup, markupToHtml } = await import(
			"../../utilities/markup-conversion.js"
		);
		const original = `<table><tbody><tr><td>${audio}</td></tr></tbody></table>`;
		const inspect = (html: string) => {
			const root = new DOMParser().parseFromString(html, "text/html");
			const element = root.querySelector("td audio");
			expect(element).not.toBeNull();
			const path = (value: string | null) =>
				value ? new URL(value, document.baseURI).pathname : null;
			return {
				src: path(element?.getAttribute("src") ?? null),
				controls: element?.hasAttribute("controls"),
				loop: element?.hasAttribute("loop"),
				sources: [...(element?.querySelectorAll(":scope > source") ?? [])].map(
					(s) => ({
						src: path(s.getAttribute("src")),
						type: s.getAttribute("type"),
					}),
				),
			};
		};
		const latex = htmlToMarkup(original, "latex");
		expect(latex).toContain("\\sound[");
		expect(latex).not.toContain("\\wcAudio");
		const rendered = await markupToHtml(latex, "latex", document.baseURI);
		expect(inspect(rendered)).toEqual(inspect(original));
		const back = await markupToHtml(
			htmlToMarkup(rendered, "latex"),
			"latex",
			document.baseURI,
		);
		expect(inspect(back)).toEqual(inspect(original));
	},
);

it("keeps a headerless AsciiDoc audio row as a body cell", async () => {
	const { htmlToMarkup, markupToHtml } = await import(
		"../../utilities/markup-conversion.js"
	);
	const source = htmlToMarkup(
		'<table><tbody><tr><td><audio controls src="sound.wav"></audio></td></tr></tbody></table>',
		"asciidoc",
	);
	expect(source).toContain("noheader");
	const html = await markupToHtml(source, "asciidoc", document.baseURI);
	const root = new DOMParser().parseFromString(html, "text/html");
	expect(root.querySelector("th")).toBeNull();
	expect(root.querySelector("td audio")?.getAttribute("src")).toMatch(
		/sound\.wav$/,
	);
	const latex = htmlToMarkup(html, "latex");
	expect(latex).toContain("\\sound[");
	expect(latex).not.toContain("audio::");
});
