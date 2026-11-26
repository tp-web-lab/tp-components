import { applyTableBorders, tableCellBorders } from "@tp/tp-utilities";
import { expect, it } from "vitest";
import { serializeTable } from "../components/table-editor/table-markup.js";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

const base = "http://localhost:4173/";
const html = `<table><thead><tr><th style="border-bottom:2px dashed #123456">A</th><th>B</th></tr></thead><tbody><tr><td rowspan="2" style="border-left:3pt double red;border-top:none;border-bottom:1px solid var(--tp-brand-stroke-strong)">C</td><td style="border-right-width:4px;border-right-style:dotted;border-right-color:rgb(10, 20, 30)">D</td></tr><tr><td>E</td></tr></tbody></table>`;
function borders(html: string) {
	const root = document.createElement("div");
	root.innerHTML = html;
	return [...root.querySelectorAll("th,td")].map((cell) => {
		const style = (cell as HTMLElement).style;
		return Object.fromEntries(
			["top", "right", "bottom", "left"].flatMap((side) =>
				["width", "style", "color"].map((kind) => {
					const name = `border-${side}-${kind}`;
					return [name, style.getPropertyValue(name)];
				}),
			),
		);
	});
}
it.each(["markdown", "asciidoc"] as const)(
	"preserves native borders through %s and the other targets",
	async (language) => {
		const code = htmlToMarkup(html, language);
		expect(code).toContain("cell-borders");
		expect(code).not.toMatch(/::: table|\[table,/);
		const rendered = await markupToHtml(code, language, base);
		expect(borders(rendered), code).toEqual(borders(html));
		for (const target of ["markdown", "asciidoc"] as const) {
			const next = htmlToMarkup(rendered, target);
			expect(borders(await markupToHtml(next, target, base)), next).toEqual(
				borders(html),
			);
		}
		const rst = htmlToMarkup(rendered, "restructuredtext");
		expect(rst).toContain(":cell-borders:");
		expect(rst).toContain(".. table::");
		expect(rst).not.toContain(".. html-table::");
	},
);
it("keeps explicit borders alongside absolute column widths", async () => {
	const source = html.replace(
		"<thead>",
		'<colgroup><col style="width:120px"><col style="width:8em"></colgroup><thead>',
	);
	for (const language of ["markdown", "asciidoc"] as const) {
		const code = htmlToMarkup(source, language);
		expect(code).toContain("column-widths");
		const rendered = await markupToHtml(code, language, base);
		expect(borders(rendered), code).toEqual(borders(html));
		expect(rendered).toContain('data-tp-column-width="120px"');
	}
});
it("exports editor workbook borders using native tables", () => {
	for (const format of ["markdown", "asciidoc", "restructuredtext"] as const) {
		const source = serializeTable(
			{
				cells: [["A"], ["B"]],
				header: true,
				caption: "",
				alignments: ["left"],
				cellBorders: [
					[{ bottom: { style: "double", color: "FF123456" } }],
					[{}],
				],
			},
			format,
		);
		expect(source).toContain("cell-borders");
		expect(source).not.toMatch(/::: table|\[table,|\.\. html-table::/);
	}
});
it("rejects malformed declarations, duplicate edges and invalid coordinates", () => {
	for (const value of [
		"0,1/border=none",
		"1,1/background=red",
		"1,1/border=url(x)",
		'1,1/border=red" onclick="x',
		"1,1/border=none;1,1/border=solid",
		"1,1/border=1px solid red;display:none",
	])
		expect(() => tableCellBorders(value)).toThrow();
	for (const value of ["2,1/border=none", "1,2/border=none"])
		expect(() =>
			applyTableBorders(
				`<table data-tp-cell-borders="${value}"><tr><td colspan="2">A</td></tr></table>`,
			),
		).toThrow();
});
it("does not leak borders into nested tables or escaped literal HTML", () => {
	const source =
		'<table data-tp-cell-borders="1,1/border-bottom=2px solid red"><tr><td>Outer<table><tr><td>Inner</td></tr></table>&lt;td&gt;</td></tr></table>';
	const output = applyTableBorders(source);
	expect(output.match(/border-bottom/g)).toHaveLength(1);
	expect(output).toContain('<td style="border-bottom:2px solid red;">Outer');
	expect(output).toContain("<td>Inner</td>");
});

it("preserves borders around a cell spanning rows and columns", async () => {
	const original =
		'<table><tbody><tr><td rowspan="2" colspan="2" style="border:2px double blue">Merged</td><td>A</td></tr><tr><td style="border-bottom:3px dashed red">B</td></tr></tbody></table>';
	for (const language of ["markdown", "asciidoc"] as const) {
		const code = htmlToMarkup(original, language);
		expect(code).toContain("2,3/border");
		expect(borders(await markupToHtml(code, language, base)), code).toEqual(
			borders(original),
		);
	}
});
it("preserves workbook borders and column widths together", async () => {
	for (const language of ["markdown", "asciidoc"] as const) {
		const code = serializeTable(
			{
				cells: [["cell-borders"], ["B"]],
				header: true,
				caption: "",
				alignments: ["left"],
				columnWidths: [160],
				cellBorders: [
					[{ bottom: { style: "double", color: "FF123456" } }],
					[{}],
				],
			},
			language,
		);
		if (language === "asciidoc")
			expect(code.match(/cell-borders=/g)).toHaveLength(1);
		else expect(code).toContain("min-width:");
		const rendered = await markupToHtml(code, language, base);
		expect(borders(rendered)[0]?.["border-bottom-style"]).toBe("double");
	}
});
