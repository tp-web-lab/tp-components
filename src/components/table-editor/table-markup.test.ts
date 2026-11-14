import { renderLatexToFragment } from "@tp/tp-latex";
import { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";
import { describe, expect, it } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { serializeTable, type TableData } from "./table-markup.js";

const cells = [
	["Session", "Room"],
	["Research & development", "A | B"],
	["*literal* _text_ {name}", "50% of $20 #1 \\ end"],
];
const data: TableData = {
	cells,
	header: true,
	caption: "Workshop & test",
	alignments: ["left", "right"],
};
function readCells(root: ParentNode): string[][] {
	return Array.from(root.querySelectorAll("tr"), (row) =>
		Array.from(
			row.querySelectorAll("th,td"),
			(cell) => cell.textContent?.replaceAll("\u200b", "").trim() ?? "",
		),
	);
}
describe("table exports rendered by TP parsers", () => {
	it("round trips Markdown text without invoking formatting or expressions", async () => {
		const html = await new TpMarkdownParser().renderAsync(
			serializeTable(data, "markdown"),
		);
		const doc = new DOMParser().parseFromString(html, "text/html");
		expect(readCells(doc)).toEqual(cells);
		expect(doc.querySelector("caption")?.textContent?.trim()).toBe(
			data.caption,
		);
	});
	it("round trips AsciiDoc text and cell separators", async () => {
		const html = await renderAsciidocToHtml(serializeTable(data, "asciidoc"));
		const doc = new DOMParser().parseFromString(html, "text/html");
		expect(readCells(doc)).toEqual(cells);
	});
	it("round trips LaTeX tabular with special characters", () => {
		const fragment = renderLatexToFragment(serializeTable(data, "latex"));
		expect(readCells(fragment)).toEqual(cells);
		expect(fragment.querySelector("figcaption")?.textContent?.trim()).toBe(
			data.caption,
		);
	});
});

it("exports math cells through each markup's mathematical syntax", async () => {
	const formula = String.raw`\frac{\left|x_1\right|}{2} + y^2`;
	const mathData: TableData = {
		cells: [["Formula"], [formula]],
		cellTypes: [["text"], ["math"]],
		header: true,
		caption: "",
		alignments: ["left"],
	};
	const html = new DOMParser().parseFromString(
		serializeTable(mathData, "html"),
		"text/html",
	);
	expect(html.querySelector("tp-math")?.getAttribute("value")).toBe(formula);
	const markdownHtml = await new TpMarkdownParser().renderAsync(
		serializeTable(mathData, "markdown"),
	);
	const md = new DOMParser().parseFromString(markdownHtml, "text/html");
	expect(md.querySelector("tp-math")?.textContent).toBe(formula);
	const adoc = await renderAsciidocToHtml(serializeTable(mathData, "asciidoc"));
	expect(
		new DOMParser().parseFromString(adoc, "text/html").querySelector("td")
			?.textContent,
	).toBe(`\\(${formula}\\)`);
	expect(serializeTable(mathData, "restructuredtext")).toContain(
		`:math:\`${formula}\``,
	);
	expect(serializeTable(mathData, "latex")).toContain(`\\(${formula}\\)`);
	const fragment = renderLatexToFragment(serializeTable(mathData, "latex"));
	expect(fragment.querySelector("tp-math")).not.toBeNull();
});

it("preserves AsciiMath notation in exports", async () => {
	const data: TableData = {
		cells: [["sqrt(x)"]],
		cellTypes: [["math"]],
		cellMathModes: [["asciimath"]],
		header: false,
		caption: "",
		alignments: ["left"],
	};
	expect(serializeTable(data, "asciidoc")).toContain("asciimath:[sqrt(x)]");
	expect(serializeTable(data, "restructuredtext")).toContain(
		":asciimath:`sqrt(x)`",
	);
	const fragment = renderLatexToFragment(serializeTable(data, "latex"));
	expect(fragment.querySelector("tp-math")?.getAttribute("mode")).toBe(
		"asciimath",
	);
	expect(fragment.querySelector("tp-math script")?.textContent).toBe("sqrt(x)");
});

const mergedData: TableData = {
	cells: [
		["A", "B", "C"],
		["Merged <text>", "hidden 1", "Right"],
		["hidden 2", "hidden 3", "Bottom"],
	],
	header: true,
	caption: "Spans",
	alignments: ["left", "center", "right"],
	merges: [{ row: 1, column: 0, rowspan: 2, colspan: 2 }],
};
it.each(["html", "markdown", "asciidoc", "latex"] as const)(
	"preserves rectangular merges when rendering %s",
	async (format) => {
		const source = serializeTable(mergedData, format);
		const root =
			format === "latex"
				? renderLatexToFragment(source)
				: new DOMParser().parseFromString(
						format === "markdown"
							? await new TpMarkdownParser().renderAsync(source)
							: format === "asciidoc"
								? await renderAsciidocToHtml(source)
								: source,
						"text/html",
					);
		const merged = root.querySelector('[rowspan="2"][colspan="2"]');
		expect(merged?.textContent?.trim()).toBe("Merged <text>");
		expect(root.querySelectorAll("th,td")).toHaveLength(6);
		expect(
			root.textContent ?? root.querySelector("body")?.textContent,
		).not.toContain("hidden 1");
	},
);
it("uses a native RST grid for merged cells", () => {
	const source = serializeTable(mergedData, "restructuredtext");
	expect(source).toContain(".. table:: Spans");
	expect(source).not.toContain("hidden 1");
	expect(source).toContain("=");
	expect(source).not.toContain("raw::");
});
