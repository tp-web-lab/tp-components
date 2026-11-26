import { afterEach, describe, expect, it, vi } from "vitest";
import { loadTableSource, parseTableSource } from "./table-source.js";

// Docutils runs in Pyodide in the browser; isolate that runtime in unit tests.
vi.mock("../restructuredtext/restructuredtext.js", () => ({
	renderRestructuredTextToHtml: vi.fn(
		async () => "<table><tr><th>Item</th></tr><tr><td>Books</td></tr></table>",
	),
}));
afterEach(() => vi.unstubAllGlobals());
const parse = (source: string, extension: string) =>
	parseTableSource(
		source,
		new URL(`https://example.org/table.${extension}?v=1`),
		new AbortController().signal,
	);
describe("table source", () => {
	it.each([
		[
			"html",
			"<table><caption>Stock</caption><tr><th>Item</th></tr><tr><td>Books</td></tr></table>",
		],
		["MD", "| Item |\n| --- |\n| Books |\n[Stock]"],
		["adoc", ".Stock\n|===\n|Item\n\n|Books\n|==="],
		[
			"tex",
			"\\begin{table}\\begin{tabular}{l}Item\\\\ Books\\end{tabular}\\caption{Stock}\\end{table}",
		],
		["rst", ".. list-table:: Stock\n\n   * - Item\n   * - Books"],
	])("imports %s tables", async (extension, source) => {
		const table = await parse(source, extension);
		expect(table.rows).toHaveLength(2);
		expect(table.textContent).toContain("Books");
	});
	it.each([
		"<p>Not a table</p>",
		"<table></table>",
		"<table><tr><td>A</td></tr></table><table><tr><td>B</td></tr></table>",
		"<p>Introduction</p><table><tr><td>A</td></tr></table>",
		"<table><tr><td><table><tr><td>A</td></tr></table></td></tr></table>",
	])("rejects invalid table documents", async (source) => {
		await expect(parse(source, "html")).rejects.toThrow(/table/);
	});
	it("rejects unknown extensions before fetching", async () => {
		const fetch = vi.fn();
		vi.stubGlobal("fetch", fetch);
		await expect(
			loadTableSource(
				new URL("https://example.org/table.pdf"),
				new AbortController().signal,
			),
		).rejects.toThrow(/extension/);
		expect(fetch).not.toHaveBeenCalled();
	});
	it("reports HTTP errors", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("missing", { status: 404 })),
		);
		await expect(
			loadTableSource(
				new URL("https://example.org/table.html"),
				new AbortController().signal,
			),
		).rejects.toThrow("404");
	});
});

it("imports quoted CSV and JSON rows", async () => {
	const csv = await parse(
		'\uFEFFItem,Count\n"First, second\nthird",2\n',
		"csv",
	);
	expect(csv.rows[1]?.cells[0]?.textContent).toBe("First, second\nthird");
	const json = await parse(
		JSON.stringify({
			data: [
				["Item", "Count"],
				["Books", 2],
				[null, true],
			],
		}),
		"json",
	);
	expect(json.rows[1]?.cells[1]?.dataset.type).toBe("number");
	expect(json.rows[2]?.cells[0]?.textContent).toBe("");
});
it.each(["{}", "[]", "[1,2]", '[[{"bad":1}]]', '[[""]]'])(
	"rejects non-tabular JSON %s",
	async (source) => {
		await expect(parse(source, "json")).rejects.toThrow();
	},
);
it("imports only the first XLSX sheet and preserves merged cells", async () => {
	const XLSX = await import("xlsx");
	const sheet = XLSX.utils.aoa_to_sheet([
		["Item", "Count"],
		["Books", 2],
		["Merged", ""],
	]);
	sheet["!merges"] = [{ s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }];
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, sheet, "First");
	XLSX.utils.book_append_sheet(
		workbook,
		XLSX.utils.aoa_to_sheet([["Ignored"]]),
		"Second",
	);
	const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
	const table = await parseTableSource(
		data,
		new URL("https://example.org/table.xlsx"),
		new AbortController().signal,
	);
	expect(table.rows).toHaveLength(3);
	expect(table.rows[2]?.cells[0]?.colSpan).toBe(2);
	expect(table.textContent).not.toContain("Ignored");
});
it("preserves an imported math cell's source and notation", async () => {
	const table = await parse(
		'<table><tr><td><tp-math value="sqrt(x)" mode="asciimath"></tp-math></td></tr></table>',
		"html",
	);
	expect(table.rows[0]?.cells[0]?.dataset.type).toBe("math");
	expect(table.rows[0]?.cells[0]?.dataset.mathMode).toBe("asciimath");
	expect(table.rows[0]?.cells[0]?.textContent).toBe("sqrt(x)");
});
