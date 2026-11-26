import {
	applyTableWidths,
	tableWidthMarkup,
	tableWidthSpec,
} from "@tp/tp-utilities";
import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

const languageNames = ["html", "markdown", "asciidoc", "latex"] as const;
const base = "http://localhost:4173/";
function read(html: string) {
	const root = document.createElement("div");
	root.innerHTML = html;
	return {
		width: root.querySelector("table")?.style.width,
		widths: [...root.querySelectorAll("col")].map(
			(col) =>
				col.getAttribute("data-tp-column-width") ||
				col.style.width ||
				col.getAttribute("width"),
		),
		text: [...root.querySelectorAll("td")].map((cell) =>
			cell.textContent?.trim(),
		),
	};
}
for (const widths of ["120px 240px", "9em auto", "120px 2* *", "25% 8rem *"]) {
	it.each(languageNames)(
		`round-trips ${widths} through %s and every other language`,
		async (sourceLanguage) => {
			const html = applyTableWidths(
				`<table column-widths="${widths}" table-width="100%" table-layout="fixed"><tbody><tr><td>A</td><td>B</td>${widths.split(" ").length === 3 ? "<td>C</td>" : ""}</tr></tbody></table>`,
			);
			const first = htmlToMarkup(html, sourceLanguage);
			expect(first).not.toMatch(/::: table|\[table,|\\wcTable/);
			const rendered = await markupToHtml(first, sourceLanguage, base);
			const expected = read(html);
			expected.widths = expected.widths.map((width) =>
				width === "*" ? "1*" : width,
			);
			for (const target of languageNames) {
				const code = htmlToMarkup(rendered, target);
				expect(code, target).not.toMatch(/::: table|\[table,|\\wcTable/);
				const actual = read(await markupToHtml(code, target, base));
				actual.widths = actual.widths.map((width) =>
					width === "*" ? "1*" : width,
				);
				expect(actual, `${sourceLanguage} → ${target}\n${code}`).toEqual(
					expected,
				);
			}
		},
	);
}
it("rejects malformed widths rather than injecting styles", () => {
	for (const value of [
		"12px;display:none",
		"-1px",
		"0*",
		"NaNpx",
		"calc(100%)",
		"1fr",
		"",
	])
		expect(() => tableWidthSpec(value)).toThrow();
	expect(() => tableWidthMarkup("10px", "100%;color:red")).toThrow();
	expect(() => tableWidthMarkup("10px", "100%", "anything")).toThrow();
});

it("preserves an explicit automatic table layout through LaTeX", async () => {
	const source = htmlToMarkup(
		'<table style="width:600px;table-layout:auto"><colgroup><col style="width:120px"><col style="width:auto"></colgroup><tbody><tr><td>A</td><td>B</td></tr></tbody></table>',
		"latex",
	);
	const root = document.createElement("div");
	root.innerHTML = await markupToHtml(source, "latex", base);
	expect(root.querySelector("table")?.style.tableLayout).toBe("auto");
	expect(root.querySelector("table")?.style.width).toBe("600px");
});
