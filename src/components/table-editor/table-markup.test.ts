import { renderLatexToFragment } from "@tp/tp-latex";
import { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";
import { describe, expect, it } from "vitest";
import asciidocStyle from "../asciidoc/asciidoc.css?inline";
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
		expect(fragment.querySelector("caption")?.textContent?.trim()).toBe(
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

it.each(["top", "middle", "bottom"] as const)(
	"preserves %s alignment in HTML, including merged cells",
	(alignment) => {
		const table: TableData = {
			cells: [
				["One\nTwo\nThree", "42", "2026-11-15", "12:30"],
				["Next", "", "", ""],
			],
			header: false,
			caption: "",
			alignments: ["left", "right", "left", "left"],
			cellTypes: [["text", "number", "date", "time"]],
			cellVerticalAlignments: [["top", alignment, alignment, alignment]],
			merges: [{ row: 0, column: 1, rowspan: 2, colspan: 1 }],
		};
		const doc = new DOMParser().parseFromString(
			serializeTable(table, "html"),
			"text/html",
		);
		const row = doc.querySelector("tr");
		for (const cell of Array.from(row?.querySelectorAll("td") ?? []).slice(1)) {
			expect(cell.style.verticalAlign).toBe(alignment);
		}
		expect(row?.querySelectorAll("td")[1]?.rowSpan).toBe(2);
		expect(row?.querySelectorAll("td")[1]?.style.textAlign).toBe("right");
	},
);

const multilineData: TableData = {
	cells: [
		["Text", "Number"],
		["First\nSecond\nThird", "42"],
	],
	header: true,
	caption: "Multiline",
	alignments: ["left", "right"],
	cellTypes: [
		["text", "text"],
		["text", "number"],
	],
	cellVerticalAlignments: [
		["top", "top"],
		["top", "bottom"],
	],
};
it("renders AsciiDoc multiline cells and vertical alignment", async () => {
	const doc = new DOMParser().parseFromString(
		await renderAsciidocToHtml(serializeTable(multilineData, "asciidoc")),
		"text/html",
	);
	expect(
		doc.querySelectorAll("tbody td")[0]?.querySelectorAll("br"),
	).toHaveLength(2);
	expect(
		doc.querySelectorAll("tbody td")[1]?.classList.contains("valign-bottom"),
	).toBe(true);
});
it("renders native tabularray multiline cells and vertical alignment", () => {
	const source = serializeTable(multilineData, "latex");
	expect(source).toContain("\\usepackage{tabularray}");
	expect(source).toContain("\\begin{tblr}");
	expect(source).not.toContain("\\wc");
	const fragment = renderLatexToFragment(
		serializeTable(multilineData, "latex"),
	);
	const cells = fragment.querySelectorAll("td");
	expect(cells[0]?.querySelectorAll("br")).toHaveLength(2);
	expect(cells[1]?.style.verticalAlign).toBe("bottom");
});
it("exports RST line blocks in native list-table cells", () => {
	const source = serializeTable(multilineData, "restructuredtext");
	expect(source).toContain(".. list-table::");
	expect(source).toContain("| First\n       | Second\n       | Third");
	expect(source).toContain("2,2=right/bottom");
});

it.each(["left", "center", "right"] as const)(
	"renders AsciiDoc numeric cells with %s horizontal alignment",
	async (alignment) => {
		const style = document.createElement("style");
		style.textContent = asciidocStyle;
		const output = document.createElement("div");
		output.className = "tp-asciidoc-output";
		output.innerHTML = await renderAsciidocToHtml(
			serializeTable(
				{
					...multilineData,
					alignments: ["left", alignment],
				},
				"asciidoc",
			),
		);
		document.head.append(style);
		document.body.append(output);
		try {
			const cell = output.querySelectorAll("tbody td")[1];
			if (!cell) throw new Error("Missing numeric cell");
			expect(cell.classList.contains(`halign-${alignment}`)).toBe(true);
			expect(getComputedStyle(cell).textAlign).toBe(alignment);
			expect(getComputedStyle(cell).verticalAlign).toBe("bottom");
		} finally {
			output.remove();
			style.remove();
		}
	},
);

it.each(["top", "middle", "bottom"] as const)(
	"preserves Markdown %s vertical alignment, merged cells and formulas",
	async (alignment) => {
		const data: TableData = {
			cells: [
				["Text", "Number", "Formula"],
				["First\n\nThird", "42", "x^2"],
				["Other", "", "y"],
			],
			header: true,
			caption: "Workshop",
			alignments: ["left", "right", "center"],
			cellTypes: [
				["text", "text", "text"],
				["text", "number", "math"],
				["text", "number", "math"],
			],
			cellVerticalAlignments: [
				["top", "top", "top"],
				["top", alignment, "top"],
				["top", alignment, "top"],
			],
			merges: [{ row: 1, column: 1, rowspan: 2, colspan: 1 }],
		};
		const source = serializeTable(data, "markdown");

		expect(source).not.toContain("::: table");
		expect(source).toContain(
			`[${alignment === "bottom" ? "v" : alignment === "middle" ? "=" : "^"}] 42`,
		);
		expect(source).toContain("[Workshop]");
		const html = await new TpMarkdownParser().renderAsync(source);
		const doc = new DOMParser().parseFromString(html, "text/html");
		const number = doc.querySelector<HTMLElement>('td[rowspan="2"]');
		expect(number?.textContent?.trim()).toBe("42");
		expect(number?.style.verticalAlign).toBe(alignment);
		expect(number?.style.textAlign).toBe("right");
		expect(doc.querySelector("caption")?.textContent?.trim()).toBe("Workshop");
		expect(doc.querySelectorAll("tbody tr")).toHaveLength(2);
		expect(doc.querySelectorAll("tbody td")).toHaveLength(5);
		expect(
			doc.querySelectorAll("tbody td")[0]?.querySelectorAll("br"),
		).toHaveLength(2);
		expect(doc.querySelector("tp-math")?.textContent).toBe("x^2");
	},
);

it("keeps literal Markdown alignment markers as cell text", async () => {
	const data: TableData = {
		cells: [["Text"], ["[v] literal"], ["[=] middle?"]],
		header: true,
		caption: "",
		alignments: ["left"],
		cellVerticalAlignments: [["top"], ["bottom"], ["middle"]],
	};
	const html = await new TpMarkdownParser().renderAsync(
		serializeTable(data, "markdown"),
	);
	const root = new DOMParser().parseFromString(html, "text/html");
	expect(readCells(root)).toEqual(data.cells);
	expect(root.querySelector("td")?.style.verticalAlign).toBe("bottom");
});

it.each(["top", "middle", "bottom"] as const)(
	"preserves %s text and math alignment in every markup export",
	async (alignment) => {
		const table: TableData = {
			cells: [
				["Text", "Math"],
				["First\nSecond", "x^2"],
			],
			header: true,
			caption: "",
			alignments: ["left", "left"],
			cellTypes: [
				["text", "text"],
				["text", "math"],
			],
			cellVerticalAlignments: [
				["top", "top"],
				[alignment, alignment],
			],
		};
		const html = new DOMParser().parseFromString(
			serializeTable(table, "html"),
			"text/html",
		);
		const markdown = new DOMParser().parseFromString(
			await new TpMarkdownParser().renderAsync(
				serializeTable(table, "markdown"),
			),
			"text/html",
		);
		const latex = renderLatexToFragment(serializeTable(table, "latex"));
		for (const root of [html, markdown, latex]) {
			const cells = root.querySelectorAll("td");
			expect(cells).toHaveLength(2);
			for (const cell of cells)
				expect(cell.style.verticalAlign).toBe(alignment);
		}
		const adoc = new DOMParser().parseFromString(
			await renderAsciidocToHtml(serializeTable(table, "asciidoc")),
			"text/html",
		);
		for (const cell of adoc.querySelectorAll("tbody td"))
			expect(cell.classList.contains(`valign-${alignment}`)).toBe(true);
		const source = serializeTable(table, "restructuredtext");
		expect(source).toContain(".. list-table::");
		expect(source).not.toContain(".. html-table::");
		if (alignment === "top") expect(source).not.toContain(":cell-alignments:");
		else {
			expect(source).toContain(`2,1=left/${alignment}`);
			expect(source).toContain(`2,2=left/${alignment}`);
		}
	},
);

it("preserves resized widths in HTML, Markdown, RST, AsciiDoc and LaTeX", async () => {
	const resized: TableData = { ...data, columnWidths: [180, 300] };
	const html = new DOMParser().parseFromString(
		serializeTable(resized, "html"),
		"text/html",
	);
	expect(
		[...html.querySelectorAll("col")].map((col) => col.style.width),
	).toEqual(["180px", "300px"]);
	const markdown = new DOMParser().parseFromString(
		await new TpMarkdownParser().renderAsync(
			serializeTable(resized, "markdown"),
		),
		"text/html",
	);
	expect(
		[...markdown.querySelectorAll("col")].map((col) => col.style.width),
	).toEqual(["180px", "300px"]);
	const rst = serializeTable(resized, "restructuredtext");
	expect(rst).toContain("width:180px");
	expect(rst).toContain("width:300px");
	expect(serializeTable(resized, "asciidoc")).toContain('cols="<180,>300"');
	const latex = renderLatexToFragment(serializeTable(resized, "latex"));
	expect(
		[...latex.querySelectorAll("col")].map((col) => col.style.width),
	).toEqual(["135pt", "225pt"]);
});

it("keeps literal Markdown punctuation and pipe characters in rich pipe-table cells", () => {
	const source = serializeTable(
		{
			cells: [["Heading"], ["<p>*literal* A | B &amp; C</p>"]],
			header: true,
			caption: "",
			alignments: ["left"],
			cellTypes: [["text"], ["rich"]],
		},
		"markdown",
	);
	expect(source).not.toMatch(/^:{3,}/m);
	expect(source).toContain("&#124;");
	expect(source).toContain("&#42;literal&#42;");
});
it("retains directive fallback for complex rich blocks and styled images", () => {
	for (const value of [
		"<ul><li>Item</li></ul>",
		'<img src="image.svg" style="border:1px solid red">',
	]) {
		const source = serializeTable(
			{
				cells: [[value]],
				header: false,
				caption: "",
				alignments: ["left"],
				cellTypes: [["rich"]],
			},
			"markdown",
		);
		expect(source).toMatch(/^:{3,} table/m);
	}
});
