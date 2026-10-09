/**
 * @module components/spreadsheet-editor
 * @summary Editable spreadsheet with Excel-style formulas powered by Formula.js.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-formula-picker
 * @summary Selects an Excel-compatible Formula.js function.  *
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit Formula.js https://formulajs.info/
 * @summary Excel-compatible formula functions.
 */
/**
 * @credit SheetJS https://sheetjs.com/
 * @summary XLSX workbook import and export.
 */
// tp-docgen:dependencies:end

import * as FormulaJs from "@formulajs/formulajs";
import * as XLSX from "xlsx";
import { TpBase } from "../base/base.js";
import "../color/color.js";
import "../dropdown/dropdown.js";
import "../formula-picker/formula-picker.js";
import "../fullscreen/fullscreen.js";
import "../icon-button/icon-button.js";
import "../menu/menu.js";
import "../theme/theme.js";
import "../toolbar/toolbar.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import style from "./spreadsheet-editor.css?inline";

type CellValue = string | number | boolean | Date;
type Token = {
	type: "number" | "string" | "identifier" | "operator" | "punctuation";
	value: string;
};

const formulaFunctions = FormulaJs as unknown as Record<
	string,
	(...args: unknown[]) => unknown
>;

export type TpSpreadsheetFileFormat = "csv" | "json" | "xlsx";
export type TpSpreadsheetExportMode = "formulas" | "values";
type TpSpreadsheetCellFormat =
	| "general"
	| "number"
	| "currency"
	| "percent"
	| "date";
type TpSpreadsheetCellStyle = "bold" | "italic" | "underline" | "strikethrough";

export function parseSpreadsheetCsv(source: string): string[][] {
	const rows: string[][] = [[]];
	let value = "";
	let quoted = false;
	for (let index = 0; index < source.length; index += 1) {
		const character = source[index] ?? "";
		if (quoted) {
			if (character === '"' && source[index + 1] === '"') {
				value += '"';
				index += 1;
			} else if (character === '"') quoted = false;
			else value += character;
		} else if (character === '"') quoted = true;
		else if (character === ",") {
			rows.at(-1)?.push(value);
			value = "";
		} else if (character === "\n") {
			rows.at(-1)?.push(value);
			rows.push([]);
			value = "";
		} else if (character !== "\r") value += character;
	}
	rows.at(-1)?.push(value);
	if (rows.length > 1 && rows.at(-1)?.length === 1 && rows.at(-1)?.[0] === "")
		rows.pop();
	return rows;
}

export function serializeSpreadsheetCsv(
	data: readonly (readonly unknown[])[],
): string {
	return data
		.map((row) =>
			row
				.map((cell) => {
					const value = String(cell ?? "");
					return /[",\r\n]/.test(value)
						? `"${value.replaceAll('"', '""')}"`
						: value;
				})
				.join(","),
		)
		.join("\r\n");
}

export function columnName(index: number): string {
	let value = index + 1;
	let name = "";
	while (value > 0) {
		value -= 1;
		name = String.fromCharCode(65 + (value % 26)) + name;
		value = Math.floor(value / 26);
	}
	return name;
}

export function cellCoordinates(reference: string): [number, number] | null {
	const match = reference.toUpperCase().match(/^\$?([A-Z]+)\$?([1-9]\d*)$/);
	if (match === null || match[1] === undefined || match[2] === undefined)
		return null;
	let column = 0;
	for (const character of match[1])
		column = column * 26 + character.charCodeAt(0) - 64;
	return [Number(match[2]) - 1, column - 1];
}

export function translateSpreadsheetFormula(
	source: string,
	rows: number,
	columns: number,
): string {
	if (!source.startsWith("=")) return source;
	return source.replace(
		/"(?:[^"]|"")*"|[A-Z_$][A-Z0-9_.$]*/gi,
		(token, offset: number) => {
			if (
				token.startsWith('"') ||
				/[A-Z0-9_.$]/i.test(source[offset - 1] ?? "") ||
				/^\s*\(/.test(source.slice(offset + token.length))
			)
				return token;
			const match = token.match(/^(\$?)([A-Z]+)(\$?)([1-9]\d*)$/i);
			const coordinates = cellCoordinates(token);
			if (!match || !coordinates) return token;
			const row = coordinates[0] + (match[3] ? 0 : rows);
			const column = coordinates[1] + (match[1] ? 0 : columns);
			if (row < 0 || column < 0) return "#REF!";
			return `${match[1]}${columnName(column)}${match[3]}${row + 1}`;
		},
	);
}

function tokenize(source: string): Token[] {
	const tokens: Token[] = [];
	let index = 0;
	while (index < source.length) {
		const rest = source.slice(index);
		if (rest.startsWith("#REF!")) throw new Error("#REF!");
		const whitespace = rest.match(/^\s+/);
		if (whitespace !== null) {
			index += whitespace[0].length;
			continue;
		}
		const string = rest.match(/^"(?:[^"]|"")*"/);
		if (string !== null) {
			tokens.push({
				type: "string",
				value: string[0].slice(1, -1).replaceAll('""', '"'),
			});
			index += string[0].length;
			continue;
		}
		const number = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:E[+-]?\d+)?/i);
		if (number !== null) {
			tokens.push({ type: "number", value: number[0] });
			index += number[0].length;
			continue;
		}
		const identifier = rest.match(/^[A-Z_$][A-Z0-9_.$]*/i);
		if (identifier !== null) {
			tokens.push({ type: "identifier", value: identifier[0] });
			index += identifier[0].length;
			continue;
		}
		const operator = rest.match(/^(?:<=|>=|<>|=|<|>|\+|-|\*|\/|\^|&)/);
		if (operator !== null) {
			tokens.push({ type: "operator", value: operator[0] });
			index += operator[0].length;
			continue;
		}
		if ("(),;:".includes(source[index] ?? "")) {
			tokens.push({ type: "punctuation", value: source[index] ?? "" });
			index += 1;
			continue;
		}
		throw new Error(`#ERROR! Unexpected ${source[index] ?? ""}`);
	}
	return tokens;
}

class FormulaParser {
	private index = 0;
	public constructor(
		private readonly tokens: Token[],
		private readonly resolveCell: (reference: string) => CellValue,
		private readonly resolveRange: (
			start: string,
			end: string,
		) => CellValue[][],
	) {}

	public parse(): CellValue {
		const value = this.comparison();
		if (this.peek() !== undefined) throw new Error("#ERROR! Invalid formula");
		return value;
	}

	private comparison(): CellValue {
		let left = this.concatenation();
		while (
			["=", "<>", "<", ">", "<=", ">="].includes(this.peek()?.value ?? "")
		) {
			const operator = this.next()?.value;
			const right = this.concatenation();
			if (operator === "=") left = left === right;
			else if (operator === "<>") left = left !== right;
			else if (operator === "<") left = left < right;
			else if (operator === ">") left = left > right;
			else if (operator === "<=") left = left <= right;
			else left = left >= right;
		}
		return left;
	}

	private concatenation(): CellValue {
		let value = this.addition();
		while (this.peek()?.value === "&") {
			this.next();
			value = `${String(value)}${String(this.addition())}`;
		}
		return value;
	}

	private addition(): CellValue {
		let value = this.multiplication();
		while (this.peek()?.value === "+" || this.peek()?.value === "-") {
			const operator = this.next()?.value;
			const right = Number(this.multiplication());
			value = operator === "+" ? Number(value) + right : Number(value) - right;
		}
		return value;
	}

	private multiplication(): CellValue {
		let value = this.power();
		while (this.peek()?.value === "*" || this.peek()?.value === "/") {
			const operator = this.next()?.value;
			const right = Number(this.power());
			value = operator === "*" ? Number(value) * right : Number(value) / right;
		}
		return value;
	}

	private power(): CellValue {
		let value = this.unary();
		if (this.peek()?.value === "^") {
			this.next();
			value = Number(value) ** Number(this.power());
		}
		return value;
	}

	private unary(): CellValue {
		if (this.peek()?.value === "+") {
			this.next();
			return Number(this.unary());
		}
		if (this.peek()?.value === "-") {
			this.next();
			return -Number(this.unary());
		}
		return this.primary();
	}

	private primary(): CellValue {
		const token = this.next();
		if (token === undefined) throw new Error("#ERROR! Missing value");
		if (token.type === "number") return Number(token.value);
		if (token.type === "string") return token.value;
		if (token.value === "(") {
			const value = this.comparison();
			this.expect(")");
			return value;
		}
		if (token.type !== "identifier") throw new Error("#ERROR! Invalid value");
		const name = token.value.toUpperCase();
		if (name === "TRUE") return true;
		if (name === "FALSE") return false;
		if (this.peek()?.value === "(") {
			this.next();
			const args: unknown[] = [];
			while (this.peek()?.value !== ")") {
				args.push(this.comparison());
				if (this.peek()?.value === "," || this.peek()?.value === ";")
					this.next();
				else break;
			}
			this.expect(")");
			const fn = formulaFunctions[name];
			if (typeof fn !== "function") throw new Error("#NAME?");
			const result = fn(...args);
			if (result instanceof Error) throw result;
			return result as CellValue;
		}
		if (cellCoordinates(name) === null) throw new Error("#NAME?");
		if (this.peek()?.value === ":") {
			this.next();
			const end = this.next();
			if (end?.type !== "identifier" || cellCoordinates(end.value) === null)
				throw new Error("#REF!");
			return this.resolveRange(name, end.value) as unknown as CellValue;
		}
		return this.resolveCell(name);
	}

	private peek(): Token | undefined {
		return this.tokens[this.index];
	}
	private next(): Token | undefined {
		const token = this.tokens[this.index];
		this.index += 1;
		return token;
	}
	private expect(value: string): void {
		if (this.next()?.value !== value)
			throw new Error(`#ERROR! Expected ${value}`);
	}
}

/**
 * `<tp-spreadsheet-editor>` provides an editable grid with Excel-style formulas.
 * @tagname tp-spreadsheet-editor
 * @attr {number} rows = 20 - Number of rows (`20` by default).
 * @attr {number} columns = 10 - Number of columns (`10` by default).
 * @attr {string} src = "" - CSV, JSON or XLSX file URL loaded on connection and whenever it changes.
 * @event tp-spreadsheet-editor-error Emitted when loading src fails; detail contains src and error.
 * @attr {string} value = "" - JSON-encoded two-dimensional array of raw cell values.
 * @event tp-spreadsheet-editor-input Emitted whenever a cell changes.
 * @event tp-spreadsheet-editor-import Emitted after a file is imported.
 * @event tp-spreadsheet-editor-export Emitted after a file is exported.
 * @event tp-spreadsheet-editor-structure Emitted after rows or columns change.
 * @example
 * <tp-spreadsheet-editor src="/docs/components/spreadsheet-editor/examples/budget.csv"></tp-spreadsheet-editor>
 */
export class TpSpreadsheetEditor extends TpBase {
	private static readonly styleId = "tp-spreadsheet-editor-styles";
	private static nextId = 0;
	private static copiedCell: {
		raw: string;
		row: number;
		column: number;
		cut: boolean;
	} | null = null;
	private data: string[][] = [];
	private readonly formats = new Map<string, TpSpreadsheetCellFormat>();
	private readonly cellStyles = new Map<string, Set<TpSpreadsheetCellStyle>>();
	private readonly undoStack: string[][][] = [];
	private readonly redoStack: string[][][] = [];
	private colorPreset = "tp-default";
	private themeMode = "auto";
	private formulaInput: HTMLInputElement | null = null;
	private nameOutput: HTMLOutputElement | null = null;
	private activeReference = "A1";
	private readonly columnWidths = new Map<number, number>();
	private selectionAnchor = "A1";
	private sourceRequest: AbortController | null = null;

	public static get observedAttributes(): string[] {
		return ["rows", "columns", "value", "src"];
	}
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	public get rows(): number {
		const value = Number(this.getAttribute("rows") ?? "20");
		return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 20;
	}
	public set rows(value: number) {
		this.setAttribute("rows", String(Math.max(1, Math.floor(value))));
	}
	public get columns(): number {
		const value = Number(this.getAttribute("columns") ?? "10");
		return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 10;
	}
	public set columns(value: number) {
		this.setAttribute("columns", String(Math.max(1, Math.floor(value))));
	}
	public get value(): string {
		return JSON.stringify(this.data);
	}
	public set value(value: string) {
		this.setAttribute("value", value);
	}
	public getData(): string[][] {
		return this.data.map((row) => [...row]);
	}
	public setData(value: readonly (readonly unknown[])[]): void {
		const rows = Math.max(1, value.length);
		const columns = Math.max(1, ...value.map((row) => row.length));
		this.setAttribute("rows", String(rows));
		this.setAttribute("columns", String(columns));
		this.data = Array.from({ length: rows }, (_, row) =>
			Array.from({ length: columns }, (_, column) =>
				String(value[row]?.[column] ?? ""),
			),
		);
		this.setAttribute("value", JSON.stringify(this.data));
	}

	public async importFile(file: File): Promise<void> {
		this.sourceRequest?.abort();
		this.applyImport(file, await this.parseFile(file));
	}

	private async parseFile(file: File): Promise<unknown[][]> {
		const extension = file.name.split(".").at(-1)?.toLowerCase();
		let matrix: unknown;
		if (extension === "csv") matrix = parseSpreadsheetCsv(await file.text());
		else if (extension === "json") {
			const parsed: unknown = JSON.parse(await file.text());
			matrix =
				typeof parsed === "object" && parsed !== null && "data" in parsed
					? (parsed as { data: unknown }).data
					: parsed;
		} else if (extension === "xlsx") {
			const workbook = XLSX.read(await file.arrayBuffer(), {
				type: "array",
				cellFormula: true,
			});
			const sheetName = workbook.SheetNames[0];
			if (sheetName === undefined)
				throw new Error("The XLSX workbook contains no worksheet.");
			const sheet = workbook.Sheets[sheetName];
			if (sheet === undefined)
				throw new Error("The XLSX worksheet cannot be read.");
			const values = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
				header: 1,
				raw: false,
				defval: "",
			});
			matrix = values.map((row, rowIndex) =>
				row.map((value, column) => {
					const cell =
						sheet[XLSX.utils.encode_cell({ r: rowIndex, c: column })];
					return cell?.f !== undefined ? `=${cell.f}` : value;
				}),
			);
		} else throw new Error("Supported import formats are CSV, JSON and XLSX.");
		if (!Array.isArray(matrix) || matrix.some((row) => !Array.isArray(row)))
			throw new Error("The imported data must be a two-dimensional array.");
		return matrix as unknown[][];
	}

	private applyImport(file: File, matrix: unknown[][]): void {
		const extension = file.name.split(".").at(-1)?.toLowerCase();
		this.rememberState();
		this.setData(matrix);
		this.dispatchEvent(
			new CustomEvent("tp-spreadsheet-editor-import", {
				bubbles: true,
				composed: true,
				detail: { format: extension, file },
			}),
		);
	}

	public exportFile(
		format: TpSpreadsheetFileFormat,
		filename = "spreadsheet",
		mode: TpSpreadsheetExportMode = "formulas",
	): void {
		const data =
			mode === "values"
				? this.data.map((row, r) =>
						row.map((_, c) =>
							this.evaluate(`${columnName(c)}${r + 1}`, new Set()),
						),
					)
				: this.data;
		if (format === "xlsx") {
			const sheet: XLSX.WorkSheet = {};
			data.forEach((row, rowIndex) => {
				row.forEach((raw, columnIndex) => {
					const address = XLSX.utils.encode_cell({
						r: rowIndex,
						c: columnIndex,
					});
					if (
						mode === "formulas" &&
						typeof raw === "string" &&
						raw.startsWith("=")
					)
						sheet[address] = { t: "n", f: raw.slice(1) };
					else if (raw instanceof Date) sheet[address] = { t: "d", v: raw };
					else if (typeof raw === "boolean")
						sheet[address] = { t: "b", v: raw };
					else if (raw !== "" && Number.isFinite(Number(raw)))
						sheet[address] = { t: "n", v: Number(raw) };
					else sheet[address] = { t: "s", v: String(raw) };
				});
			});
			sheet["!ref"] = XLSX.utils.encode_range({
				s: { r: 0, c: 0 },
				e: { r: this.rows - 1, c: this.columns - 1 },
			});
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
			XLSX.writeFileXLSX(workbook, `${filename}.xlsx`);
		} else {
			const contents =
				format === "csv"
					? serializeSpreadsheetCsv(
							data.map((row) =>
								row.map((value) =>
									value instanceof Date ? value.toISOString() : value,
								),
							),
						)
					: JSON.stringify(data, null, 2);
			const blob = new Blob([contents], {
				type: format === "csv" ? "text/csv;charset=utf-8" : "application/json",
			});
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = `${filename}.${format}`;
			anchor.click();
			URL.revokeObjectURL(url);
		}
		this.dispatchEvent(
			new CustomEvent("tp-spreadsheet-editor-export", {
				bubbles: true,
				composed: true,
				detail: { format, filename: `${filename}.${format}` },
			}),
		);
	}

	public insertRow(position: "before" | "after" = "after"): void {
		const coordinates = cellCoordinates(this.activeReference);
		if (coordinates === null) return;
		const index = coordinates[0] + (position === "after" ? 1 : 0);
		this.rememberState();
		const matrix = this.getData();
		matrix.splice(
			index,
			0,
			Array.from({ length: this.columns }, () => ""),
		);
		this.activeReference = `${columnName(coordinates[1])}${String(index + 1)}`;
		this.formats.clear();
		this.cellStyles.clear();
		this.restoreState(matrix);
		this.emitStructureChange("insert-row", index);
	}

	public deleteRow(): void {
		if (this.rows <= 1) return;
		const coordinates = cellCoordinates(this.activeReference);
		if (coordinates === null) return;
		this.rememberState();
		const matrix = this.getData();
		matrix.splice(coordinates[0], 1);
		const row = Math.min(coordinates[0], matrix.length - 1);
		this.activeReference = `${columnName(coordinates[1])}${String(row + 1)}`;
		this.formats.clear();
		this.cellStyles.clear();
		this.restoreState(matrix);
		this.emitStructureChange("delete-row", coordinates[0]);
	}

	public insertColumn(position: "before" | "after" = "after"): void {
		const coordinates = cellCoordinates(this.activeReference);
		if (coordinates === null) return;
		const index = coordinates[1] + (position === "after" ? 1 : 0);
		this.rememberState();
		const matrix = this.getData();
		for (const row of matrix) row.splice(index, 0, "");
		this.activeReference = `${columnName(index)}${String(coordinates[0] + 1)}`;
		this.formats.clear();
		this.cellStyles.clear();
		this.restoreState(matrix);
		this.emitStructureChange("insert-column", index);
	}

	public deleteColumn(): void {
		if (this.columns <= 1) return;
		const coordinates = cellCoordinates(this.activeReference);
		if (coordinates === null) return;
		this.rememberState();
		const matrix = this.getData();
		for (const row of matrix) row.splice(coordinates[1], 1);
		const column = Math.min(coordinates[1], this.columns - 2);
		this.activeReference = `${columnName(column)}${String(coordinates[0] + 1)}`;
		this.formats.clear();
		this.cellStyles.clear();
		this.restoreState(matrix);
		this.emitStructureChange("delete-column", coordinates[1]);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureId();
		this.ensureGlobalStyle(TpSpreadsheetEditor.styleId, style);
		this.readValue();
		this.render();
		void this.loadSource();
	}

	protected disconnectedCallback(): void {
		this.sourceRequest?.abort();
	}

	private async loadSource(): Promise<void> {
		this.sourceRequest?.abort();
		const src = this.src.trim();
		if (!src) return;
		const request = new AbortController();
		this.sourceRequest = request;
		try {
			const url = new URL(src, this.baseURI);
			const response = await fetch(url.href, { signal: request.signal });
			if (!response.ok)
				throw new Error(`Unable to load spreadsheet (${response.status}).`);
			const file = new File(
				[await response.arrayBuffer()],
				decodeURIComponent(url.pathname.split("/").at(-1) ?? ""),
			);
			const matrix = await this.parseFile(file);
			if (!request.signal.aborted && this.isConnected)
				this.applyImport(file, matrix);
		} catch (error) {
			if (!request.signal.aborted)
				this.dispatchEvent(
					new CustomEvent("tp-spreadsheet-editor-error", {
						bubbles: true,
						composed: true,
						detail: { src, error },
					}),
				);
		}
	}

	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue) return;
		if (name === "src") {
			if (this.isConnected) void this.loadSource();
			return;
		}
		if (!this.isConnected) return;
		this.ensureId();
		this.readValue();
		this.render();
	}

	private ensureId(): void {
		this.dataset.tpColorScope = "";
		this.dataset.tpThemeScope = "";
		if (this.id !== "") return;
		TpSpreadsheetEditor.nextId += 1;
		this.id = `tp-spreadsheet-editor-${String(TpSpreadsheetEditor.nextId)}`;
	}

	private readValue(): void {
		let source: unknown = [];
		try {
			source = JSON.parse(this.getAttribute("value") ?? "[]");
		} catch {
			source = [];
		}
		const matrix = Array.isArray(source) ? source : [];
		this.data = Array.from({ length: this.rows }, (_, row) =>
			Array.from({ length: this.columns }, (_, column) => {
				const sourceRow = matrix[row];
				return String(
					Array.isArray(sourceRow) ? (sourceRow[column] ?? "") : "",
				);
			}),
		);
	}

	private render(): void {
		this.colorPreset =
			this.querySelector("tp-color")?.getAttribute("preset") ??
			this.colorPreset;
		this.themeMode =
			this.querySelector("tp-theme")?.getAttribute("mode") ?? this.themeMode;
		const toolbar = this.createToolbar();
		const formulaBar = document.createElement("div");
		formulaBar.dataset.tpSpreadsheetEditorFormulaBar = "";
		const picker = document.createElement("tp-formula-picker");
		picker.addEventListener("tp-formula-picker-select", (event) => {
			const detail = (
				event as CustomEvent<{
					formula: string;
					selectionStart: number;
					selectionEnd: number;
				}>
			).detail;
			const formula = detail.formula;
			if (this.formulaInput === null) return;
			this.formulaInput.value = formula;
			this.formulaInput.focus();
			this.formulaInput.setSelectionRange(
				detail.selectionStart,
				detail.selectionEnd,
			);
		});
		const name = document.createElement("output");
		name.textContent = this.activeReference;
		const formula = document.createElement("input");
		formula.type = "text";
		formula.setAttribute("aria-label", "Cell value or formula");
		formula.addEventListener("change", () =>
			this.commit(this.activeReference, formula.value),
		);
		formulaBar.append(picker, name, formula);

		const table = document.createElement("table");
		const colgroup = document.createElement("colgroup");
		const rowHeading = document.createElement("col");
		rowHeading.style.width = "48px";
		colgroup.append(rowHeading);
		for (let column = 0; column < this.columns; column++) {
			const col = document.createElement("col");
			col.style.width = `${this.columnWidths.get(column) ?? 112}px`;
			colgroup.append(col);
		}
		table.append(colgroup);
		let totalWidth =
			48 +
			Array.from(
				{ length: this.columns },
				(_, index) => this.columnWidths.get(index) ?? 112,
			).reduce((sum, width) => sum + width, 0);
		const updateWidth = (): void => {
			table.style.width = `${totalWidth}px`;
		};
		updateWidth();
		const head = table.createTHead().insertRow();
		head.append(document.createElement("th"));
		for (let column = 0; column < this.columns; column += 1) {
			const cell = document.createElement("th");
			cell.scope = "col";
			cell.textContent = columnName(column);
			const handle = document.createElement("span");
			handle.dataset.columnResize = String(column);
			handle.tabIndex = 0;
			handle.setAttribute("role", "separator");
			handle.setAttribute("aria-orientation", "vertical");
			handle.setAttribute("aria-label", `Resize column ${columnName(column)}`);
			handle.setAttribute("aria-valuemin", "48");
			handle.setAttribute(
				"aria-valuenow",
				String(this.columnWidths.get(column) ?? 112),
			);
			const resize = (width: number): void => {
				const next = Math.max(48, Math.round(width));
				const previous = this.columnWidths.get(column) ?? 112;
				if (next === previous) return;
				totalWidth += next - previous;
				this.columnWidths.set(column, next);
				const col = colgroup.children[column + 1] as HTMLElement;
				col.style.width = `${next}px`;
				handle.setAttribute("aria-valuenow", String(next));
				updateWidth();
			};
			let drag: { id: number; x: number; width: number } | null = null;
			let frame = 0;
			let pendingWidth: number | null = null;
			const flush = (): void => {
				frame = 0;
				if (pendingWidth !== null && table.isConnected) resize(pendingWidth);
				pendingWidth = null;
			};
			handle.addEventListener("pointerdown", (event) => {
				if (event.button !== 0) return;
				event.preventDefault();
				drag = {
					id: event.pointerId,
					x: event.clientX,
					width: this.columnWidths.get(column) ?? 112,
				};
				handle.setPointerCapture(event.pointerId);
				handle.focus();
			});
			handle.addEventListener("pointermove", (event) => {
				if (drag?.id !== event.pointerId) return;
				pendingWidth = drag.width + event.clientX - drag.x;
				if (!frame) frame = requestAnimationFrame(flush);
			});
			const stop = (): void => {
				if (frame) cancelAnimationFrame(frame);
				flush();
				drag = null;
			};
			handle.addEventListener("pointerup", stop);
			handle.addEventListener("pointercancel", stop);
			handle.addEventListener("lostpointercapture", stop);
			handle.addEventListener("dblclick", () => resize(112));
			handle.addEventListener("keydown", (event) => {
				if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
				event.preventDefault();
				resize(
					(this.columnWidths.get(column) ?? 112) +
						(event.key === "ArrowRight" ? 8 : -8),
				);
			});
			cell.append(handle);
			head.append(cell);
		}
		const body = table.createTBody();
		for (let row = 0; row < this.rows; row += 1) {
			const tr = body.insertRow();
			const heading = document.createElement("th");
			heading.scope = "row";
			heading.textContent = String(row + 1);
			tr.append(heading);
			for (let column = 0; column < this.columns; column += 1) {
				const reference = `${columnName(column)}${String(row + 1)}`;
				const td = tr.insertCell();
				const input = document.createElement("input");
				input.dataset.cell = reference;
				input.dataset.format = this.formats.get(reference) ?? "general";
				input.dataset.style = [...(this.cellStyles.get(reference) ?? [])].join(
					" ",
				);
				input.setAttribute("aria-label", reference);
				input.value = this.displayValue(reference);
				input.addEventListener("focus", () => {
					this.select(reference, input.hasAttribute("data-selected"));
				});
				input.addEventListener("pointerdown", (event) => {
					if (event.button !== 0) return;
					if (event.shiftKey) event.preventDefault();
					this.select(reference, event.shiftKey);
				});
				input.addEventListener("keydown", (event) => {
					if (
						(event.ctrlKey || event.metaKey) &&
						!event.altKey &&
						["c", "x", "v"].includes(event.key.toLowerCase())
					) {
						event.preventDefault();
						void this.runToolbarCommand(
							event.key.toLowerCase() === "c"
								? "copy"
								: event.key.toLowerCase() === "x"
									? "cut"
									: "paste",
							toolbar,
						);
						return;
					}
					if (
						event.shiftKey &&
						["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
							event.key,
						)
					) {
						event.preventDefault();
						const [row, column] = cellCoordinates(this.activeReference) ?? [
							0, 0,
						];
						const nextRow = Math.max(
							0,
							Math.min(
								this.rows - 1,
								row +
									(event.key === "ArrowDown"
										? 1
										: event.key === "ArrowUp"
											? -1
											: 0),
							),
						);
						const nextColumn = Math.max(
							0,
							Math.min(
								this.columns - 1,
								column +
									(event.key === "ArrowRight"
										? 1
										: event.key === "ArrowLeft"
											? -1
											: 0),
							),
						);
						this.select(`${columnName(nextColumn)}${nextRow + 1}`, true);
					} else if (
						(event.key === "Delete" || event.key === "Backspace") &&
						this.selectedReferences().length > 1
					) {
						event.preventDefault();
						this.clearSelection();
					} else if (event.key === "Escape") this.select(reference);
				});
				input.addEventListener("change", () =>
					this.commit(reference, input.value),
				);
				td.append(input);
			}
		}
		const viewport = document.createElement("div");
		viewport.dataset.tpSpreadsheetEditorViewport = "";
		viewport.append(table);
		this.replaceChildren(toolbar, formulaBar, viewport);
		this.formulaInput = formula;
		this.nameOutput = name;
		this.select(this.activeReference, true);
	}

	private createToolbar(): HTMLElement {
		this.ensureId();
		const toolbar = document.createElement("tp-toolbar");
		toolbar.dataset.tpSpreadsheetEditorToolbar = "";
		const fileButtonId = `${this.id}-files`;
		const formatButtonId = `${this.id}-format`;
		const styleButtonId = `${this.id}-cell-style`;
		const tableButtonId = `${this.id}-table`;
		toolbar.innerHTML = `
      <tp-icon-button section="start" id="${fileButtonId}" name="file" label="Files" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-file-dropdown anchor="#${fileButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-file-action="import"><tp-icon name="file-import"></tp-icon><span>Import CSV, JSON or XLSX</span></li>
          <li data-tp-menu-divider aria-disabled="true"></li>
          <li data-file-action="csv" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export CSV — formulas</span></li>
          <li data-file-action="csv" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export CSV — values</span></li>
          <li data-file-action="json" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export JSON — formulas</span></li>
          <li data-file-action="json" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export JSON — values</span></li>
          <li data-file-action="xlsx" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export XLSX — formulas</span></li>
          <li data-file-action="xlsx" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export XLSX — values</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <input type="file" accept=".csv,.json,.xlsx,text/csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-spreadsheet-file hidden />
      <tp-icon-button section="start" id="${formatButtonId}" name="letter-f" label="Format" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-format-dropdown anchor="#${formatButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-format="general">General</li><li data-format="number">Number</li>
          <li data-format="currency">Currency</li><li data-format="percent">Percent</li><li data-format="date">Date</li>
        </ul></tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${styleButtonId}" name="format-text" label="Cell style" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-style-dropdown anchor="#${styleButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-cell-style="bold"><tp-icon name="format-bold"></tp-icon><span>Bold</span></li>
          <li data-cell-style="italic"><tp-icon name="format-italic"></tp-icon><span>Italic</span></li>
          <li data-cell-style="underline"><tp-icon name="format-underline"></tp-icon><span>Underline</span></li>
          <li data-cell-style="strikethrough"><tp-icon name="format-strikethrough"></tp-icon><span>Strikethrough</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${tableButtonId}" name="table" label="Table" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-table-dropdown anchor="#${tableButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-table-action="insert-row-before"><tp-icon name="table-row-plus-before"></tp-icon><span>Insert row before</span></li>
          <li data-table-action="insert-row-after"><tp-icon name="table-row-plus-after"></tp-icon><span>Insert row after</span></li>
          <li data-table-action="insert-column-before"><tp-icon name="table-column-plus-before"></tp-icon><span>Insert column before</span></li>
          <li data-table-action="insert-column-after"><tp-icon name="table-column-plus-after"></tp-icon><span>Insert column after</span></li>
          <li data-tp-menu-divider aria-disabled="true"></li>
          <li data-table-action="delete-row"><tp-icon name="table-row-remove"></tp-icon><span>Delete row</span></li>
          <li data-table-action="delete-column"><tp-icon name="table-column-remove"></tp-icon><span>Delete column</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <span section="center" data-tp-spreadsheet-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="undo" label="Undo" data-command="undo"></tp-icon-button>
      <tp-icon-button section="center" name="redo" label="Redo" data-command="redo"></tp-icon-button>
      <tp-icon-button section="center" name="copy" label="Copy" data-command="copy"></tp-icon-button>
      <tp-icon-button section="center" name="cut" label="Cut" data-command="cut"></tp-icon-button>
      <tp-icon-button section="center" name="paste" label="Paste" data-command="paste"></tp-icon-button>
      <tp-icon-button section="center" name="close" label="Clear selected cells" data-command="clear-cells"></tp-icon-button>
      <tp-icon-button section="center" name="format-clear" label="Clear formatting" data-command="unformat"></tp-icon-button>
      <span section="center" data-tp-spreadsheet-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="end" name="search" label="Search" data-command="search"></tp-icon-button>
      <span section="end" data-tp-spreadsheet-editor-search hidden><input type="search" aria-label="Search cells" /><tp-icon-button name="close" size="xs" label="Close search" data-command="close-search"></tp-icon-button></span>
      <tp-fullscreen section="end" anchor="#${this.id}"></tp-fullscreen>
      <tp-color section="end" anchor="#${this.id}" preset="${this.colorPreset}"></tp-color>
      <tp-theme section="end" anchor="#${this.id}" mode="${this.themeMode}"></tp-theme>
    `;
		const fileButton = toolbar.querySelector<HTMLElement>(`#${fileButtonId}`);
		const formatButton = toolbar.querySelector<HTMLElement>(
			`#${formatButtonId}`,
		);
		const styleButton = toolbar.querySelector<HTMLElement>(`#${styleButtonId}`);
		const tableButton = toolbar.querySelector<HTMLElement>(`#${tableButtonId}`);
		const fileDropdown = toolbar.querySelector<TpDropdown>(
			"[data-spreadsheet-file-dropdown]",
		);
		const formatDropdown = toolbar.querySelector<TpDropdown>(
			"[data-spreadsheet-format-dropdown]",
		);
		const styleDropdown = toolbar.querySelector<TpDropdown>(
			"[data-spreadsheet-style-dropdown]",
		);
		const tableDropdown = toolbar.querySelector<TpDropdown>(
			"[data-spreadsheet-table-dropdown]",
		);
		const dropdowns = [
			fileDropdown,
			formatDropdown,
			styleDropdown,
			tableDropdown,
		];
		const bindDropdown = (
			button: HTMLElement | null,
			dropdown: TpDropdown | null,
		): void => {
			button?.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (dropdown === null) return;
				if (!dropdown.open) {
					for (const candidate of dropdowns)
						if (candidate !== dropdown) candidate?.hide();
				}
				dropdown.toggle();
				button.setAttribute("aria-expanded", String(dropdown.open));
			});
			dropdown?.addEventListener("tp-dropdown-toggle", () =>
				button?.setAttribute("aria-expanded", String(dropdown.open)),
			);
		};
		bindDropdown(fileButton, fileDropdown);
		bindDropdown(formatButton, formatDropdown);
		bindDropdown(styleButton, styleDropdown);
		bindDropdown(tableButton, tableDropdown);
		toolbar
			.querySelector("tp-color")
			?.addEventListener("tp-color-change", (event) => {
				this.colorPreset = (
					event as CustomEvent<{ preset: string }>
				).detail.preset;
			});
		toolbar
			.querySelector("tp-theme")
			?.addEventListener("tp-theme-change", (event) => {
				this.themeMode = (event as CustomEvent<{ mode: string }>).detail.mode;
			});
		const fileInput = toolbar.querySelector<HTMLInputElement>(
			"[data-spreadsheet-file]",
		);
		fileInput?.addEventListener("change", () => {
			const file = fileInput.files?.[0];
			if (file !== undefined) void this.importFile(file);
			fileInput.value = "";
		});
		toolbar.addEventListener("tp-menu-item-select", (event) => {
			const item =
				(event as CustomEvent<{ item?: HTMLElement }>).detail?.item ??
				(event.target as HTMLElement);
			const action =
				item.closest<HTMLElement>("[data-file-action]")?.dataset.fileAction;
			if (action === "import") fileInput?.click();
			else if (action === "csv" || action === "json" || action === "xlsx")
				this.exportFile(
					action,
					"spreadsheet",
					item.closest<HTMLElement>("[data-export-mode]")?.dataset
						.exportMode === "values"
						? "values"
						: "formulas",
				);
			const format = item.closest<HTMLElement>("[data-format]")?.dataset.format;
			if (format !== undefined)
				this.applyFormat(format as TpSpreadsheetCellFormat);
			const cellStyle =
				item.closest<HTMLElement>("[data-cell-style]")?.dataset.cellStyle;
			if (cellStyle !== undefined)
				this.toggleCellStyle(cellStyle as TpSpreadsheetCellStyle);
			const tableAction = item.closest<HTMLElement>("[data-table-action]")
				?.dataset.tableAction;
			if (tableAction === "insert-row-before") this.insertRow("before");
			else if (tableAction === "insert-row-after") this.insertRow("after");
			else if (tableAction === "insert-column-before")
				this.insertColumn("before");
			else if (tableAction === "insert-column-after")
				this.insertColumn("after");
			else if (tableAction === "delete-row") this.deleteRow();
			else if (tableAction === "delete-column") this.deleteColumn();
		});
		toolbar.addEventListener("click", (event) => {
			const command = (event.target as HTMLElement).closest<HTMLElement>(
				"[data-command]",
			)?.dataset.command;
			if (command !== undefined) void this.runToolbarCommand(command, toolbar);
		});
		toolbar
			.querySelector<HTMLInputElement>('[type="search"]')
			?.addEventListener("input", (event) =>
				this.search((event.target as HTMLInputElement).value),
			);
		return toolbar;
	}

	private selectedReferences(): string[] {
		const [row, column] = cellCoordinates(this.activeReference) ?? [0, 0];
		const [anchorRow, anchorColumn] = cellCoordinates(this.selectionAnchor) ?? [
			row,
			column,
		];
		const references: string[] = [];
		for (
			let r = Math.min(row, anchorRow);
			r <= Math.min(this.rows - 1, Math.max(row, anchorRow));
			r++
		) {
			for (
				let c = Math.min(column, anchorColumn);
				c <= Math.min(this.columns - 1, Math.max(column, anchorColumn));
				c++
			)
				references.push(`${columnName(c)}${r + 1}`);
		}
		return references;
	}

	private clearSelection(): void {
		const changed = this.selectedReferences().filter((reference) => {
			const [row, column] = cellCoordinates(reference) ?? [0, 0];
			return (this.data[row]?.[column] ?? "") !== "";
		});
		if (!changed.length) return;
		this.rememberState();
		for (const reference of changed) {
			const [row, column] = cellCoordinates(reference) ?? [0, 0];
			const values = this.data[row];
			if (values) values[column] = "";
		}
		this.setAttribute("value", JSON.stringify(this.data));
		this.querySelector<HTMLInputElement>(
			`[data-cell="${this.activeReference}"]`,
		)?.focus();
		for (const cell of changed)
			this.dispatchEvent(
				new CustomEvent("tp-spreadsheet-editor-input", {
					bubbles: true,
					composed: true,
					detail: { cell, raw: "", value: "" },
				}),
			);
	}

	private select(reference: string, extend = false): void {
		this.activeReference = reference;
		if (!extend) this.selectionAnchor = reference;
		const selected = new Set(this.selectedReferences());
		for (const input of this.querySelectorAll<HTMLInputElement>(
			"[data-cell]",
		)) {
			input.toggleAttribute(
				"data-selected",
				selected.has(input.dataset.cell ?? ""),
			);
		}
		if (this.nameOutput !== null) this.nameOutput.textContent = reference;
		const coordinates = cellCoordinates(reference);
		if (coordinates !== null && this.formulaInput !== null)
			this.formulaInput.value =
				this.data[coordinates[0]]?.[coordinates[1]] ?? "";
	}

	private commit(reference: string, raw: string): void {
		const coordinates = cellCoordinates(reference);
		if (coordinates === null) return;
		const [row, column] = coordinates;
		if (this.data[row] === undefined) return;
		if (this.data[row][column] === raw) return;
		this.rememberState();
		this.data[row][column] = raw;
		this.setAttribute("value", JSON.stringify(this.data));
		this.dispatchEvent(
			new CustomEvent("tp-spreadsheet-editor-input", {
				bubbles: true,
				composed: true,
				detail: {
					cell: reference,
					raw,
					value: this.evaluate(reference, new Set()),
				},
			}),
		);
	}

	private displayValue(reference: string): string {
		const value = this.evaluate(reference, new Set());
		const format = this.formats.get(reference) ?? "general";
		if (format === "number" && Number.isFinite(Number(value)))
			return Number(value).toLocaleString();
		if (format === "currency" && Number.isFinite(Number(value)))
			return Number(value).toLocaleString(undefined, {
				style: "currency",
				currency: "EUR",
			});
		if (format === "percent" && Number.isFinite(Number(value)))
			return Number(value).toLocaleString(undefined, { style: "percent" });
		if (format === "date") {
			const date = value instanceof Date ? value : new Date(String(value));
			if (!Number.isNaN(date.getTime())) return date.toLocaleDateString();
		}
		if (value instanceof Date) return value.toLocaleDateString();
		return String(value);
	}

	private rememberState(): void {
		this.undoStack.push(this.getData());
		if (this.undoStack.length > 100) this.undoStack.shift();
		this.redoStack.length = 0;
	}

	private restoreState(state: string[][]): void {
		this.setAttribute("rows", String(Math.max(1, state.length)));
		this.setAttribute(
			"columns",
			String(Math.max(1, ...state.map((row) => row.length))),
		);
		this.setAttribute("value", JSON.stringify(state));
	}

	private emitStructureChange(action: string, index: number): void {
		this.dispatchEvent(
			new CustomEvent("tp-spreadsheet-editor-structure", {
				bubbles: true,
				composed: true,
				detail: { action, index, rows: this.rows, columns: this.columns },
			}),
		);
	}

	private undo(): void {
		const state = this.undoStack.pop();
		if (state === undefined) return;
		this.redoStack.push(this.getData());
		this.restoreState(state);
	}

	private redo(): void {
		const state = this.redoStack.pop();
		if (state === undefined) return;
		this.undoStack.push(this.getData());
		this.restoreState(state);
	}

	private applyFormat(format: TpSpreadsheetCellFormat): void {
		if (format === "general") this.formats.delete(this.activeReference);
		else this.formats.set(this.activeReference, format);
		this.render();
		this.querySelector<HTMLInputElement>(
			`[data-cell="${this.activeReference}"]`,
		)?.focus();
	}

	private toggleCellStyle(styleName: TpSpreadsheetCellStyle): void {
		const styles = new Set(this.cellStyles.get(this.activeReference) ?? []);
		if (styles.has(styleName)) styles.delete(styleName);
		else styles.add(styleName);
		if (styles.size === 0) this.cellStyles.delete(this.activeReference);
		else this.cellStyles.set(this.activeReference, styles);
		this.render();
		this.querySelector<HTMLInputElement>(
			`[data-cell="${this.activeReference}"]`,
		)?.focus();
	}

	private clearActiveFormatting(): void {
		this.formats.delete(this.activeReference);
		this.cellStyles.delete(this.activeReference);
		this.render();
		this.querySelector<HTMLInputElement>(
			`[data-cell="${this.activeReference}"]`,
		)?.focus();
	}

	private async runToolbarCommand(
		command: string,
		toolbar: HTMLElement,
	): Promise<void> {
		if (command === "clear-cells") {
			this.clearSelection();
			return;
		}
		if (command === "undo") {
			this.undo();
			return;
		}
		if (command === "redo") {
			this.redo();
			return;
		}
		if (command === "unformat") {
			this.clearActiveFormatting();
			return;
		}
		const searchControl = toolbar.querySelector<HTMLElement>(
			"[data-tp-spreadsheet-editor-search]",
		);
		const searchInput = searchControl?.querySelector<HTMLInputElement>("input");
		if (command === "search") {
			if (searchControl !== null && searchControl !== undefined)
				searchControl.hidden = false;
			searchInput?.focus();
			return;
		}
		if (command === "close-search") {
			if (searchInput !== null && searchInput !== undefined)
				searchInput.value = "";
			this.search("");
			if (searchControl !== null && searchControl !== undefined)
				searchControl.hidden = true;
			return;
		}
		const coordinates = cellCoordinates(this.activeReference);
		if (coordinates === null) return;
		const raw = this.data[coordinates[0]]?.[coordinates[1]] ?? "";
		const reference = this.activeReference;
		try {
			if (command === "copy" || command === "cut") {
				await navigator.clipboard.writeText(raw);
				TpSpreadsheetEditor.copiedCell = {
					raw,
					row: coordinates[0],
					column: coordinates[1],
					cut: command === "cut",
				};
				if (command === "cut") this.commit(reference, "");
			} else if (command === "paste") {
				const text = await navigator.clipboard.readText();
				const copied = TpSpreadsheetEditor.copiedCell;
				const translated =
					copied && !copied.cut && copied.raw === text
						? translateSpreadsheetFormula(
								text,
								coordinates[0] - copied.row,
								coordinates[1] - copied.column,
							)
						: text;
				if (copied && copied.raw !== text)
					TpSpreadsheetEditor.copiedCell = null;
				this.commit(reference, translated);
			}
		} catch {
			this.dispatchEvent(
				new CustomEvent("tp-spreadsheet-editor-clipboard-error", {
					bubbles: true,
					composed: true,
					detail: { command },
				}),
			);
		}
	}

	private search(query: string): void {
		const normalized = query.trim().toLocaleLowerCase();
		for (const input of this.querySelectorAll<HTMLInputElement>(
			"[data-cell]",
		)) {
			const match =
				normalized !== "" &&
				input.value.toLocaleLowerCase().includes(normalized);
			input.toggleAttribute("data-search-match", match);
		}
	}

	private evaluate(reference: string, stack: Set<string>): CellValue {
		const coordinates = cellCoordinates(reference);
		if (coordinates === null) return "#REF!";
		reference = `${columnName(coordinates[1])}${coordinates[0] + 1}`;
		if (stack.has(reference)) return "#CYCLE!";
		const raw = this.data[coordinates[0]]?.[coordinates[1]] ?? "";
		if (!raw.startsWith("="))
			return raw !== "" && Number.isFinite(Number(raw)) ? Number(raw) : raw;
		stack.add(reference);
		try {
			const parser = new FormulaParser(
				tokenize(raw.slice(1)),
				(cell) => this.evaluate(cell.toUpperCase(), new Set(stack)),
				(start, end) => this.range(start, end, stack),
			);
			return parser.parse();
		} catch (error) {
			return error instanceof Error && error.message.startsWith("#")
				? error.message
				: "#ERROR!";
		}
	}

	private range(start: string, end: string, stack: Set<string>): CellValue[][] {
		const first = cellCoordinates(start);
		const last = cellCoordinates(end);
		if (first === null || last === null) return [["#REF!"]];
		const rows: CellValue[][] = [];
		for (
			let row = Math.min(first[0], last[0]);
			row <= Math.max(first[0], last[0]);
			row += 1
		) {
			const values: CellValue[] = [];
			for (
				let column = Math.min(first[1], last[1]);
				column <= Math.max(first[1], last[1]);
				column += 1
			) {
				values.push(
					this.evaluate(
						`${columnName(column)}${String(row + 1)}`,
						new Set(stack),
					),
				);
			}
			rows.push(values);
		}
		return rows;
	}
}

if (!customElements.get("tp-spreadsheet-editor"))
	customElements.define("tp-spreadsheet-editor", TpSpreadsheetEditor);

declare global {
	interface HTMLElementTagNameMap {
		"tp-spreadsheet-editor": TpSpreadsheetEditor;
	}
}
