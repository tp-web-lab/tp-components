import { xlsxTableLayout } from "./table-source-xlsx-layout.js";
/** Converts spreadsheet files to the same inert HTML table used by markup imports. */
export async function spreadsheetTable(
	source: string | ArrayBuffer,
	extension: string,
): Promise<HTMLTableElement> {
	let matrix: unknown;
	const XLSX = await import("xlsx");
	if (extension === "xlsx") {
		if (typeof source === "string")
			throw new Error("XLSX requires binary data.");
		const workbook = XLSX.read(source, {
			type: "array",
			cellHTML: false,
			cellStyles: true,
		});
		const name = workbook.SheetNames[0];
		const sheet = name ? workbook.Sheets[name] : undefined;
		if (!sheet?.["!ref"])
			throw new Error("The workbook contains no nonempty first worksheet.");
		const range = XLSX.utils.decode_range(sheet["!ref"]);
		if (range.e.r - range.s.r >= 100 || range.e.c - range.s.c >= 30)
			throw new Error("A table supports at most 100 rows and 30 columns.");
		const parsed = new DOMParser().parseFromString(
			XLSX.utils.sheet_to_html(sheet),
			"text/html",
		);
		const table = parsed.querySelector("table");
		if (!table?.textContent?.trim())
			throw new Error("The worksheet must contain a nonempty table.");
		xlsxTableLayout(table, sheet, source, XLSX);
		return table;
	}
	if (typeof source !== "string")
		throw new Error("CSV and JSON files must contain text.");
	if (extension === "csv") {
		const { parseSpreadsheetCsv } = await import(
			"../spreadsheet-editor/spreadsheet-editor.js"
		);
		matrix = parseSpreadsheetCsv(source.replace(/^\uFEFF/, ""));
	} else {
		const parsed: unknown = JSON.parse(source.replace(/^\uFEFF/, ""));
		matrix =
			parsed && typeof parsed === "object" && "data" in parsed
				? parsed.data
				: parsed;
	}
	if (
		!Array.isArray(matrix) ||
		!matrix.length ||
		matrix.length > 100 ||
		matrix.some(
			(row) =>
				!Array.isArray(row) ||
				!row.length ||
				row.length > 30 ||
				row.some(
					(value) =>
						value !== null &&
						!["string", "number", "boolean"].includes(typeof value),
				),
		)
	)
		throw new Error(
			"The file must contain a nonempty array of rows (at most 100 rows and 30 columns) with text, numbers, booleans or null cells.",
		);
	const rows = matrix as (string | number | boolean | null)[][];
	const columns = Math.max(...rows.map((row) => row.length));
	const table = document.createElement("table");
	for (const [r, row] of rows.entries()) {
		const tr = table.insertRow();
		for (let c = 0; c < columns; c++) {
			const cell = document.createElement(r === 0 ? "th" : "td");
			cell.textContent = String(row[c] ?? "");
			if (r > 0 && typeof row[c] === "number") cell.dataset.type = "number";
			tr.append(cell);
		}
	}
	if (!table.textContent?.trim())
		throw new Error("The file must contain a nonempty table.");
	return table;
}
