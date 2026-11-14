/** @module components/table-editor */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-contextmenu
 * @summary Accessible context menu built from a nested list.
 */
/**
 * @tp-dependency tp-datefield
 * @summary Native date field with labels, constraints, picker access, and clearing.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-mathfield
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-save-image
 * @summary Downloads an anchored image as SVG, PNG or WebP.
 */
/**
 * @tp-dependency tp-screen
 * @summary Responsive page preview in selectable device viewports.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-timefield
 * @summary Native time field with labels, constraints, picker access, and clearing.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit SheetJS https://sheetjs.com/
 * @summary XLSX workbook import and export.
 */
// tp-docgen:dependencies:end

import "../button/button.js";
import "../checkbox-list/checkbox-list.js";
import "../divider/divider.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import "../tabs/tabs.js";
import type { TpTabs } from "../tabs/tabs.js";
import "../textfield/textfield.js";
import {
	TpContextmenu,
	type TpContextmenuSelectDetail,
} from "../contextmenu/contextmenu.js";
import "../numberfield/numberfield.js";
import "../datefield/datefield.js";
import "../timefield/timefield.js";
import "../mathfield/mathfield.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import type { TpMathfield } from "../mathfield/mathfield.js";
import type { TableCellType } from "./table-markup.js";
import "../menu/menu.js";
import "../save-image/save-image.js";
import "../screen/screen.js";
import { TpBase } from "../base/base.js";
import type { TpScreen } from "../screen/screen.js";
import { escapeTableHtml } from "./table-markup.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../toolbar/toolbar.js";
import "../color/color.js";
import "../theme/theme.js";
import "../fullscreen/fullscreen.js";
import type { TpTextfield } from "../textfield/textfield.js";
import style from "./table-editor.css?inline";
import {
	serializeTable,
	type TableAlignment,
	type TableData,
	type TableFormat,
	type TableMerge,
	tableCellCovered,
	tableFileExtensions,
	tableFormats,
	tableMergeAt,
	tableText,
} from "./table-markup.js";
import previewStyle from "./table-preview.css?inline";

const markupTabFormats: TableFormat[] = [
	"asciidoc",
	"html",
	"latex",
	"markdown",
	"restructuredtext",
];
const markupTabLabels = [
	"tp-asciidoc",
	"html",
	"tp-latex",
	"tp-markdown",
	"tp-restructuredtext",
];

const commandDescriptions: Record<string, string> = {
	reset: "Restore the initial table.",
	undo: "Undo the last table edit.",
	redo: "Reapply the last undone edit.",
	"add-row": "Insert an empty row after the selected row.",
	"add-column": "Insert an empty column after the selected column.",
	"delete-row": "Remove the selected row.",
	"delete-column": "Remove the selected column.",
};

const fieldSymbols: Record<TableCellType, [string, string]> = {
	text: ["textfield-mark", "components"],
	number: ["numberfield-mark", "components"],
	math: ["mathfield-mark", "components"],
	date: ["calendar-clock-outline", "tp"],
	time: ["clock-outline", "tp"],
};
function fieldSymbol(type: TableCellType): string {
	const [name, library] = fieldSymbols[type];
	return `<tp-icon name="${name}" library="${library}" aria-hidden="true"></tp-icon>`;
}
const cellTypes: TableCellType[] = ["text", "number", "date", "time", "math"];

const formatLabels: Record<TableFormat, string> = {
	html: "HTML",
	markdown: "Markdown",
	asciidoc: "AsciiDoc",
	restructuredtext: "reStructuredText",
	latex: "LaTeX",
};

/**
 * The custom `<tp-table-editor>` element builds and edits tables and exports them as markup, spreadsheet data or images.
 *
 * @summary Builds and edits tables and exports them as markup, spreadsheet data or images.
 * @tagname tp-table-editor
 * @attr {number} rows = 3 - Number of rows, including the optional header; between 1 and 100.
 * @attr {number} columns = 3 - Number of columns; between 1 and 30.
 * @attr {boolean} no-header = false - Treats the first row as ordinary data instead of column headings.
 * @attr {string} caption = "" - Table caption included in exports.
 * @attr {"html" | "markdown" | "asciidoc" | "restructuredtext" | "latex"} format = "markdown" - Selected export format.
 * @attr {boolean} readonly = false - Prevents interactive edits while keeping exports available.
 * @event tp-table-editor-change Emitted after a table edit, reset, undo or redo.
 * @eventdetail tp-table-editor-change { data: TableData, markup: string }
 * @keyboard {Shift+F10 / ContextMenu} Open the focused cell menu.
 * @keyboard {Tab / Shift+Tab} Move between cell fields and controls.
 * @keyboard {Ctrl+Z / Cmd+Z} Undo a table edit.
 * @keyboard {Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y} Redo a table edit.
 * @see tp-prose-editor - Edits tables as part of rich-text documents.
 * @see tp-spreadsheet-editor - Edits spreadsheet data and formulas.
 * @example
 * <tp-table-editor caption="Workshop schedule">
 *   <table>
 *     <thead><tr><th>Session</th><th>Duration (min)</th><th>Date</th><th>Formula</th></tr></thead>
 *     <tbody>
 *       <tr><td>Introduction</td><td data-type="number">20</td><td data-type="date">2026-11-14</td><td data-type="math">x^2 + y^2</td></tr>
 *       <tr><td>Practice</td><td data-type="number">40</td><td data-type="date">2026-11-15</td><td data-type="math">E = mc^2</td></tr>
 *     </tbody>
 *   </table>
 * </tp-table-editor>
 */
export class TpTableEditor extends TpBase {
	private static nextId = 0;
	private readonly controlId =
		`tp-table-editor-controls-${++TpTableEditor.nextId}`;
	private data: TableData = {
		cells: [],
		header: true,
		caption: "",
		alignments: [],
	};
	private initial: TableData | null = null;
	private initialized = false;
	private reflecting = false;
	private row = 0;
	private column = 0;
	private selectionEnd: { row: number; column: number } | null = null;
	private undoStack: TableData[] = [];
	private redoStack: TableData[] = [];
	private surface: HTMLDivElement | null = null;
	private cellMenu: TpContextmenu | null = null;
	private output: HTMLDivElement | null = null;
	private codeKey = "";
	private spreadsheetKey = "";
	private spreadsheetRevision = 0;
	private previewKey = "";
	private previewRevision = 0;
	private captionField: TpTextfield | null = null;
	private status: HTMLOutputElement | null = null;

	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"rows",
			"columns",
			"no-header",
			"caption",
			"format",
			"readonly",
		];
	}
	/** Current number of rows, including the header. @attr rows */
	public get rows(): number {
		return this.initialized
			? this.data.cells.length
			: this.dimension("rows", 100);
	}
	public set rows(value: number) {
		this.setAttribute("rows", String(value));
	}
	/** Current number of columns. @attr columns */
	public get columns(): number {
		return this.initialized
			? this.data.alignments.length
			: this.dimension("columns", 30);
	}
	public set columns(value: number) {
		this.setAttribute("columns", String(value));
	}
	/** Current export format. @attr format */
	public get format():
		| "html"
		| "markdown"
		| "asciidoc"
		| "restructuredtext"
		| "latex" {
		const value = this.getAttribute("format");
		return tableFormats.find((format) => format === value) ?? "markdown";
	}
	public set format(value: TableFormat) {
		this.setAttribute("format", value);
	}
	/** Caption included in the table and exports. @attr caption */
	public get caption(): string {
		return this.getAttribute("caption") ?? "";
	}
	public set caption(value: string) {
		this.setAttribute("caption", tableText(value));
	}
	/** Whether the first row contains ordinary data. @attr no-header */
	public get noHeader(): boolean {
		return this.hasAttribute("no-header");
	}
	public set noHeader(value: boolean) {
		this.toggleAttribute("no-header", value);
	}
	/** Prevents interactive changes. @attr readonly */
	public get readonly(): boolean {
		return this.hasAttribute("readonly");
	}
	public set readonly(value: boolean) {
		this.toggleAttribute("readonly", value);
	}
	private dimension(name: string, max: number): number {
		const value = Number(this.getAttribute(name) ?? 3);
		return Number.isFinite(value)
			? Math.min(max, Math.max(1, Math.floor(value)))
			: 3;
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-table-editor-styles", style);
		this.ensureGlobalStyle("tp-table-editor-preview-styles", previewStyle);
		if (!this.initialized) {
			const source = this.querySelector("table");
			const sourceCells: (HTMLTableCellElement | undefined)[][] = [];
			const merges: TableMerge[] = [];
			if (source?.rows.length) {
				const occupied = new Set<string>();
				Array.from(source.rows).forEach((row, r) => {
					sourceCells[r] ??= [];
					let column = 0;
					for (const cell of Array.from(row.cells)) {
						while (occupied.has(`${r}:${column}`)) column++;
						const rowCells = sourceCells[r];
						if (rowCells) rowCells[column] = cell;
						const rowspan = Math.min(
							cell.rowSpan || source.rows.length - r,
							source.rows.length - r,
						);
						const colspan = cell.colSpan;
						for (let y = r; y < r + rowspan; y++)
							for (let x = column; x < column + colspan; x++)
								occupied.add(`${y}:${x}`);
						if (rowspan * colspan > 1)
							merges.push({ row: r, column, rowspan, colspan });
						column += colspan;
					}
				});
			}
			const width = Math.max(
				1,
				...sourceCells.map((row) => row.length),
				...merges.map((m) => m.column + m.colspan),
			);
			const cells = source?.rows.length
				? Array.from({ length: source.rows.length }, (_, r) =>
						Array.from({ length: width }, (_, c) =>
							tableText(sourceCells[r]?.[c]?.textContent?.trim() ?? ""),
						),
					)
				: Array.from({ length: this.rows }, () =>
						Array<string>(this.columns).fill(""),
					);
			this.data = this.normalizeData(cells);
			if (source?.querySelector("[data-type]"))
				this.data.cellTypes = cells.map((row, r) =>
					row.map((value, c) => {
						const type = sourceCells[r]?.[c]?.getAttribute(
							"data-type",
						) as TableCellType;
						return cellTypes.includes(type) && this.acceptsType(value, type)
							? type
							: "text";
					}),
				);
			if (source?.querySelector('[data-math-mode="asciimath"]'))
				this.data.cellMathModes = cells.map((row, r) =>
					row.map((_, c) =>
						sourceCells[r]?.[c]?.getAttribute("data-math-mode") === "asciimath"
							? "asciimath"
							: "latexmath",
					),
				);
			this.data.header = this.hasAttribute("no-header")
				? false
				: source?.rows.length
					? !!source.rows[0]?.querySelector("th")
					: true;
			if (merges.length)
				this.data.merges = merges.filter(
					(m) => !(this.data.header && m.row === 0 && m.rowspan > 1),
				);
			this.data.caption =
				this.caption || tableText(source?.caption?.textContent ?? "");
			this.data.explicitAlignments = this.data.alignments.map((_, index) =>
				["left", "center", "right"].includes(
					sourceCells[0]?.[index]?.style.textAlign ?? "",
				),
			);
			this.data.alignments = this.data.alignments.map((_, index) => {
				const alignment = sourceCells[0]?.[index]?.style.textAlign;
				return alignment === "right" || alignment === "center"
					? alignment
					: "left";
			});
			this.updateAutomaticAlignments();
			this.initialized = true;
		}
		this.initial ??= this.getData();
		this.reflect();
		this.render();
	}
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (!this.initialized || this.reflecting || oldValue === newValue) return;
		if (name === "format") {
			this.refresh();
			return;
		}
		if (name === "readonly") {
			this.render();
			return;
		}
		if (!["rows", "columns", "caption", "no-header"].includes(name)) return;
		this.remember();
		if (name === "caption") this.data.caption = tableText(this.caption);
		if (name === "no-header") this.data.header = !this.noHeader;
		if (name === "rows" || name === "columns") {
			const rows =
				name === "rows" ? this.dimension("rows", 100) : this.rows || 3;
			const columns =
				name === "columns" ? this.dimension("columns", 30) : this.columns || 3;
			this.data.cells = Array.from({ length: rows }, (_, r) =>
				Array.from(
					{ length: columns },
					(_, c) => this.data.cells[r]?.[c] ?? "",
				),
			);
			if (this.data.cellTypes)
				this.data.cellTypes = Array.from({ length: rows }, (_, r) =>
					Array.from(
						{ length: columns },
						(_, c) => this.data.cellTypes?.[r]?.[c] ?? "text",
					),
				);
			if (this.data.cellMathModes)
				this.data.cellMathModes = Array.from({ length: rows }, (_, r) =>
					Array.from(
						{ length: columns },
						(_, c) => this.data.cellMathModes?.[r]?.[c] ?? "latexmath",
					),
				);
			if (this.data.columnWidths)
				this.data.columnWidths = Array.from(
					{ length: columns },
					(_, c) => this.data.columnWidths?.[c] ?? 160,
				);
			if (this.data.explicitAlignments)
				this.data.explicitAlignments = Array.from(
					{ length: columns },
					(_, c) => this.data.explicitAlignments?.[c] ?? false,
				);
			this.data.alignments = Array.from(
				{ length: columns },
				(_, c) => this.data.alignments[c] ?? "left",
			);
		}
		this.changed();
	}
	/** Returns an independent snapshot of the table. */
	public getData(): TableData {
		return structuredClone(this.data);
	}
	/** Replaces the table with rectangular, single-line text cells; short rows are padded. */
	public setData(cells: string[][]): void {
		const next = this.normalizeData(cells);
		if (this.initialized) this.remember();
		this.data = { ...next, caption: this.caption, header: !this.noHeader };
		this.initialized = true;
		this.changed();
	}
	/** Returns the current table in the selected or supplied markup format. */
	public getMarkup(format: TableFormat = this.format): string {
		if (!tableFormats.includes(format))
			throw new TypeError("Unsupported table format");
		return this.data.cells.length ? serializeTable(this.getData(), format) : "";
	}
	/** Creates a table only when the editor is empty; returns whether it was inserted. */
	public insertTable(rows = 3, columns = 3): boolean {
		if (this.data.cells.length) return false;
		if (
			!Number.isInteger(rows) ||
			rows < 1 ||
			rows > 100 ||
			!Number.isInteger(columns) ||
			columns < 1 ||
			columns > 30
		)
			throw new RangeError("Provide 1–100 rows and 1–30 columns.");
		this.setData(
			Array.from({ length: rows }, () => Array<string>(columns).fill("")),
		);
		return true;
	}
	/** Removes the complete table; Undo restores its cells and settings. */
	public deleteTable(): void {
		if (!this.data.cells.length) return;
		this.remember();
		this.data = { cells: [], alignments: [], header: true, caption: "" };
		this.changed();
	}
	/** Merges an inclusive rectangle (zero-based coordinates), preserving all underlying contents and field types. */
	public mergeCells(
		startRow = this.row,
		startColumn = this.column,
		endRow = this.selectionEnd?.row ?? startRow,
		endColumn = this.selectionEnd?.column ?? startColumn,
	): boolean {
		const range = this.mergeRange(startRow, startColumn, endRow, endColumn);
		if (!range || !this.canMerge(range)) return false;
		this.remember();
		this.data.merges = (this.data.merges ?? []).filter(
			(m) => !this.intersects(m, range),
		);
		this.data.merges.push(range);
		this.row = range.row;
		this.column = range.column;
		this.changed(true);
		return true;
	}
	/** Separates the merged region containing this cell; previously covered contents and types reappear. */
	public splitCell(row = this.row, column = this.column): boolean {
		const merge = tableMergeAt(this.data, row, column);
		if (!merge) return false;
		this.remember();
		this.data.merges = this.data.merges?.filter((m) => m !== merge);
		this.row = merge.row;
		this.column = merge.column;
		this.changed(true);
		return true;
	}
	private intersects(a: TableMerge, b: TableMerge): boolean {
		return (
			a.row < b.row + b.rowspan &&
			b.row < a.row + a.rowspan &&
			a.column < b.column + b.colspan &&
			b.column < a.column + a.colspan
		);
	}
	private mergeRange(
		r1 = this.row,
		c1 = this.column,
		r2 = this.selectionEnd?.row ?? r1,
		c2 = this.selectionEnd?.column ?? c1,
	): TableMerge | null {
		if (
			![r1, c1, r2, c2].every(Number.isInteger) ||
			Math.min(r1, r2, c1, c2) < 0 ||
			Math.max(r1, r2) >= this.rows ||
			Math.max(c1, c2) >= this.columns
		)
			return null;
		let top = Math.min(r1, r2),
			left = Math.min(c1, c2),
			bottom = Math.max(r1, r2),
			right = Math.max(c1, c2);
		let expanded = true;
		while (expanded) {
			expanded = false;
			for (const merge of this.data.merges ?? []) {
				if (
					!this.intersects(merge, {
						row: top,
						column: left,
						rowspan: bottom - top + 1,
						colspan: right - left + 1,
					})
				)
					continue;
				const next = [
					Math.min(top, merge.row),
					Math.min(left, merge.column),
					Math.max(bottom, merge.row + merge.rowspan - 1),
					Math.max(right, merge.column + merge.colspan - 1),
				];
				if (
					next[0] !== top ||
					next[1] !== left ||
					next[2] !== bottom ||
					next[3] !== right
				) {
					[top, left, bottom, right] = next as [number, number, number, number];
					expanded = true;
				}
			}
		}
		return {
			row: top,
			column: left,
			rowspan: bottom - top + 1,
			colspan: right - left + 1,
		};
	}
	private canMerge(range = this.mergeRange()): boolean {
		return (
			!!range &&
			range.rowspan * range.colspan > 1 &&
			!(this.data.header && range.row === 0 && range.rowspan > 1) &&
			!(this.data.merges ?? []).some(
				(m) =>
					m.row === range.row &&
					m.column === range.column &&
					m.rowspan === range.rowspan &&
					m.colspan === range.colspan,
			)
		);
	}
	private adjustMerges(
		axis: "row" | "column",
		index: number,
		insert: boolean,
	): void {
		const size = axis === "row" ? "rowspan" : "colspan";
		for (const merge of this.data.merges ?? []) {
			if (insert) {
				if (index <= merge[axis]) merge[axis]++;
				else if (index < merge[axis] + merge[size]) merge[size]++;
			} else if (index < merge[axis]) merge[axis]--;
			else if (index < merge[axis] + merge[size]) merge[size]--;
		}
	}
	private updateMergeControls(): void {
		const range = this.mergeRange();
		for (const item of this.querySelectorAll<HTMLElement>(
			'[data-choice="merge-cells"], [data-action="merge-cells"], [data-choice="split-cell"], [data-action="split-cell"]',
		)) {
			const merge =
				(item.dataset.choice ?? item.dataset.action) === "merge-cells";
			item.setAttribute(
				"aria-disabled",
				String(
					this.readonly ||
						(merge
							? !this.canMerge(range)
							: !tableMergeAt(this.data, this.row, this.column)),
				),
			);
		}
		for (const cell of this.surface?.querySelectorAll<HTMLElement>(
			"[data-grid-row]",
		) ?? []) {
			const row = Number(cell.dataset.gridRow),
				column = Number(cell.dataset.gridColumn);
			cell.toggleAttribute(
				"data-range-selected",
				!!this.selectionEnd &&
					!!range &&
					row >= range.row &&
					row < range.row + range.rowspan &&
					column >= range.column &&
					column < range.column + range.colspan,
			);
		}
	}
	/** Inserts an empty text row before or after the selected row; at most 100 rows. */
	public addRow(position: "before" | "after" = "after"): void {
		if (position !== "before" && position !== "after")
			throw new TypeError("Expected before or after.");
		if (!this.rows || this.rows >= 100) return;
		this.remember();
		this.adjustMerges("row", this.row + (position === "after" ? 1 : 0), true);
		this.data.cells.splice(
			this.row + (position === "after" ? 1 : 0),
			0,
			Array<string>(this.columns).fill(""),
		);
		if (this.data.cellTypes)
			this.data.cellTypes.splice(
				this.row + (position === "after" ? 1 : 0),
				0,
				Array<TableCellType>(this.columns).fill("text"),
			);
		this.data.cellMathModes?.splice(
			this.row + (position === "after" ? 1 : 0),
			0,
			Array(this.columns).fill("latexmath"),
		);
		if (position === "after") this.row++;
		this.changed(true);
	}
	/** Inserts an empty text column before or after the selected column; at most 30 columns. */
	public addColumn(position: "before" | "after" = "after"): void {
		if (position !== "before" && position !== "after")
			throw new TypeError("Expected before or after.");
		if (!this.columns || this.columns >= 30) return;
		this.remember();
		const index = this.column + (position === "after" ? 1 : 0);
		this.adjustMerges("column", index, true);
		for (const row of this.data.cells) row.splice(index, 0, "");
		for (const row of this.data.cellTypes ?? []) row.splice(index, 0, "text");
		for (const row of this.data.cellMathModes ?? [])
			row.splice(index, 0, "latexmath");
		this.data.alignments.splice(index, 0, "left");
		this.data.columnWidths?.splice(index, 0, 160);
		this.data.explicitAlignments?.splice(index, 0, false);
		if (position === "after") this.column++;
		this.changed(true);
	}
	/** Removes the selected row, preserving at least one row. */
	public deleteRow(): void {
		if (this.rows <= 1) return;
		this.remember();
		this.adjustMerges("row", this.row, false);
		this.data.cells.splice(this.row, 1);
		this.data.cellTypes?.splice(this.row, 1);
		this.data.cellMathModes?.splice(this.row, 1);
		this.changed(true);
	}
	/** Removes the selected column, preserving at least one column. */
	public deleteColumn(): void {
		if (this.columns <= 1) return;
		this.remember();
		this.adjustMerges("column", this.column, false);
		for (const row of this.data.cells) row.splice(this.column, 1);
		for (const row of this.data.cellTypes ?? []) row.splice(this.column, 1);
		for (const row of this.data.cellMathModes ?? []) row.splice(this.column, 1);
		this.data.alignments.splice(this.column, 1);
		this.data.columnWidths?.splice(this.column, 1);
		this.data.explicitAlignments?.splice(this.column, 1);
		this.changed(true);
	}
	/** Returns a cell's field type; row and column indexes are zero-based. */
	public getCellType(row: number, column: number): TableCellType {
		if (
			!Number.isInteger(row) ||
			!Number.isInteger(column) ||
			row < 0 ||
			column < 0 ||
			row >= this.rows ||
			column >= this.columns
		)
			throw new RangeError("Cell is outside the table.");
		return this.data.cellTypes?.[row]?.[column] ?? "text";
	}
	/** Changes the editor field. Incompatible values are cleared; undo restores both value and type. */
	public setCellType(
		row: number,
		column: number,
		type: TableCellType,
	): boolean {
		const current = this.getCellType(row, column);
		if (!cellTypes.includes(type))
			throw new TypeError("Unsupported cell type.");
		if (current === type) return true;
		this.remember();
		const cleared = !this.acceptsType(
			this.data.cells[row]?.[column] ?? "",
			type,
		);
		if (cleared) this.data.cells[row]?.splice(column, 1, "");
		this.data.cellTypes ??= this.data.cells.map((values) =>
			values.map(() => "text"),
		);
		this.data.cellTypes[row]?.splice(column, 1, type);
		this.row = row;
		this.column = column;
		this.changed(true);
		if (cleared)
			this.announce(
				`Cell changed to tp-${type}field. The incompatible value was cleared; Undo restores it.`,
			);
		return true;
	}
	private acceptsType(value: string, type: TableCellType): boolean {
		if (!value || type === "text" || type === "math") return true;
		const input = this.ownerDocument.createElement("input");
		input.type = type;
		input.value = value;
		return input.value === value;
	}
	private setColumnAlignment(alignment: TableAlignment): void {
		this.remember();
		this.data.alignments[this.column] = alignment;
		this.data.explicitAlignments ??= this.data.alignments.map(() => false);
		this.data.explicitAlignments[this.column] = true;
		this.changed();
	}
	private createCellMenu(): void {
		const menu = new TpContextmenu();
		menu.dataset.helpGroup = "Cell menu";
		menu.innerHTML = `<ul>
          <li data-action="row-before"><tp-icon name="table-row-plus-before" aria-hidden="true"></tp-icon>Insert row before</li><li data-action="row-after"><tp-icon name="table-row-plus-after" aria-hidden="true"></tp-icon>Insert row after</li>
          <li data-action="column-before"><tp-icon name="table-column-plus-before" aria-hidden="true"></tp-icon>Insert column before</li><li data-action="column-after"><tp-icon name="table-column-plus-after" aria-hidden="true"></tp-icon>Insert column after</li>
          <tp-divider></tp-divider>
          <li data-action="remove-row"><tp-icon name="table-row-remove" aria-hidden="true"></tp-icon>Delete row</li><li data-action="remove-column"><tp-icon name="table-column-remove" aria-hidden="true"></tp-icon>Delete column</li>
          <tp-divider></tp-divider>
          <li data-action="merge-cells"><tp-icon name="table-merge-cells" aria-hidden="true"></tp-icon>Merge cells</li><li data-action="split-cell"><tp-icon name="table-split-cell" aria-hidden="true"></tp-icon>Split cell</li>
          <tp-divider></tp-divider>
          ${(["left", "center", "right"] as const).map((alignment) => `<li data-action="align-${alignment}"><tp-icon data-check name="check" aria-hidden="true"></tp-icon><tp-icon name="format-align-${alignment}" aria-hidden="true"></tp-icon>Align ${alignment}</li>`).join("")}
          <tp-divider></tp-divider>
          <li aria-label="Cell type"><tp-icon name="symbol" aria-hidden="true"></tp-icon>Cell type<ul>${cellTypes.map((type) => `<li data-action="type-${type}"><tp-icon data-check name="check" aria-hidden="true"></tp-icon>${fieldSymbol(type)}tp-${type}field</li>`).join("")}</ul></li>
        </ul>`;
		menu.addEventListener("tp-contextmenu-select", (event) => {
			if (this.readonly) return;
			const action = (event as CustomEvent<TpContextmenuSelectDetail>).detail
				.action;
			if (action === "row-before" || action === "row-after")
				this.addRow(action === "row-before" ? "before" : "after");
			else if (action === "column-before" || action === "column-after")
				this.addColumn(action === "column-before" ? "before" : "after");
			else if (action === "remove-row") this.deleteRow();
			else if (action === "remove-column") this.deleteColumn();
			else if (action === "merge-cells") this.mergeCells();
			else if (action === "split-cell") this.splitCell();
			else if (action.startsWith("align-"))
				this.setColumnAlignment(action.slice(6) as TableAlignment);
			else if (action.startsWith("type-"))
				this.setCellType(
					this.row,
					this.column,
					action.slice(5) as TableCellType,
				);
		});
		this.append(menu);
		this.cellMenu = menu;
	}
	private openCellMenu(
		row: number,
		column: number,
		x: number,
		y: number,
	): void {
		if (this.readonly || !this.cellMenu) return;
		const range = this.mergeRange();
		if (
			!this.selectionEnd ||
			!range ||
			row < range.row ||
			row >= range.row + range.rowspan ||
			column < range.column ||
			column >= range.column + range.colspan
		) {
			this.row = row;
			this.column = column;
			this.selectionEnd = null;
		}
		this.refresh();
		for (const item of this.cellMenu.querySelectorAll<HTMLElement>(
			"[data-action]",
		)) {
			const action = item.dataset.action ?? "";
			const disabled =
				(action.startsWith("row-") && this.rows >= 100) ||
				(action.startsWith("column-") && this.columns >= 30) ||
				(action === "remove-row" && this.rows <= 1) ||
				(action === "remove-column" && this.columns <= 1);
			item.setAttribute("aria-disabled", String(disabled));
			item.setAttribute(
				"aria-current",
				String(
					action === `type-${this.getCellType(row, column)}` ||
						action === `align-${this.data.alignments[column]}`,
				),
			);
		}
		this.updateMergeControls();
		this.cellMenu.showAt(x, y);
		const rect = this.cellMenu.getBoundingClientRect();
		const width = this.ownerDocument.defaultView?.innerWidth ?? 1024;
		this.cellMenu.dataset.submenuSide =
			rect.right + rect.width < width
				? "right"
				: rect.left >= rect.width
					? "left"
					: "overlay";
		this.cellMenu.querySelector<HTMLElement>('li[role="menuitem"]')?.focus();
	}

	/** Undoes the last table edit. */
	public undo(): void {
		const previous = this.undoStack.pop();
		if (!previous) return;
		this.redoStack.push(this.getData());
		this.data = previous;
		this.changed(true);
	}
	/** Reapplies the last undone table edit. */
	public redo(): void {
		const next = this.redoStack.pop();
		if (!next) return;
		this.undoStack.push(this.getData());
		this.data = next;
		this.changed(true);
	}
	/** Restores the initial table; the reset can be undone. */
	public reset(): void {
		if (!this.initial) return;
		this.remember();
		this.data = structuredClone(this.initial);
		this.changed();
	}
	/** Copies the selected markup; returns false if clipboard access fails. */
	public async copy(): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(this.getMarkup());
			this.announce("Markup copied.");
			return true;
		} catch {
			this.announce(
				"Copy unavailable. Select the markup and copy it manually.",
			);
			return false;
		}
	}
	/** Saves the current markup after choosing a filename; cancellation leaves files unchanged. */
	public async download(): Promise<void> {
		if (!this.rows) return;
		const format = this.format;
		const source = this.getMarkup(format);
		const extension = tableFileExtensions[format];
		const target = await chooseSaveTarget({
			suggestedName: `table.${extension}`,
			extension: `.${extension}`,
			mimeType: "text/plain",
			description: formatLabels[format],
		});
		if (target)
			await saveBlob(
				new Blob([source], { type: "text/plain;charset=utf-8" }),
				target,
			);
	}
	/** Saves cell strings (including headings) as CSV, JSON or XLSX after choosing a filename. */
	public async downloadSpreadsheet(
		format: "csv" | "json" | "xlsx",
	): Promise<void> {
		if (!["csv", "json", "xlsx"].includes(format))
			throw new TypeError(`Unsupported spreadsheet format: ${format}`);
		if (!this.rows) return;
		const cells = this.getData().cells;
		const mimeType =
			format === "csv"
				? "text/csv"
				: format === "json"
					? "application/json"
					: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		// Ask before loading XLSX so the native picker retains the user activation.
		const target = await chooseSaveTarget({
			suggestedName: `table.${format}`,
			extension: `.${format}`,
			mimeType,
			description: format.toUpperCase(),
		});
		if (!target) return;
		let blob: Blob;
		if (format === "json")
			blob = new Blob([JSON.stringify(cells, null, 2)], { type: mimeType });
		else {
			const XLSX = await import("xlsx");
			const sheet = XLSX.utils.aoa_to_sheet(cells);
			if (format === "xlsx")
				sheet["!merges"] = this.data.merges?.map((m) => ({
					s: { r: m.row, c: m.column },
					e: { r: m.row + m.rowspan - 1, c: m.column + m.colspan - 1 },
				}));
			if (format === "csv")
				blob = new Blob(["\ufeff", XLSX.utils.sheet_to_csv(sheet)], {
					type: `${mimeType};charset=utf-8`,
				});
			else {
				const workbook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workbook, sheet, "Table");
				blob = new Blob(
					[XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
					{ type: mimeType },
				);
			}
		}
		await saveBlob(blob, target);
	}
	/** Returns a standalone SVG of the table, using its current theme and column alignments. */
	public exportSvg(): string {
		if (!this.rows) throw new Error("No table to export.");
		const context = this.ownerDocument.createElement("canvas").getContext("2d");
		if (!context) throw new Error("Text measurement is unavailable.");
		context.font = "bold 14px sans-serif";
		const widths = this.data.alignments.map((_, column) =>
			Math.max(
				80,
				...this.data.cells.map(
					(row) => context.measureText(row[column] ?? "").width + 24,
				),
			),
		);
		let width = widths.reduce((sum, value) => sum + value, 0);
		if (this.data.caption) {
			const extra = Math.max(
				0,
				context.measureText(this.data.caption).width + 24 - width,
			);
			widths[widths.length - 1] = (widths.at(-1) ?? 80) + extra;
			width += extra;
		}
		const height = this.rows * 36 + (this.data.caption ? 40 : 0);
		const style = getComputedStyle(this);
		const header = this.surface?.querySelector("th");
		const background = style.backgroundColor;
		const foreground = style.color;
		const stroke = this.surface?.querySelector("td,th");
		const border = stroke
			? getComputedStyle(stroke).borderTopColor
			: foreground;
		const parts = [
			`<svg xmlns="http://www.w3.org/2000/svg" width="${width + 2}" height="${height + 2}" viewBox="-1 -1 ${width + 2} ${height + 2}"><rect x="-1" y="-1" width="${width + 2}" height="${height + 2}" fill="${escapeTableHtml(background)}"/>`,
		];
		this.data.cells.forEach((row, index) => {
			let x = 0;
			row.forEach((value, column) => {
				const columnWidth = widths[column] ?? 80;
				if (tableCellCovered(this.data, index, column)) {
					x += columnWidth;
					return;
				}
				const merge = tableMergeAt(this.data, index, column);
				const w = widths
					.slice(column, column + (merge?.colspan ?? 1))
					.reduce((sum, width) => sum + width, 0);
				const h = (merge?.rowspan ?? 1) * 36;
				const alignment = this.data.alignments[column];
				const tx =
					x +
					(alignment === "right"
						? w - 12
						: alignment === "center"
							? w / 2
							: 12);
				const anchor =
					alignment === "right"
						? "end"
						: alignment === "center"
							? "middle"
							: "start";
				const fill =
					index === 0 && this.data.header && header
						? getComputedStyle(header).backgroundColor
						: background;
				parts.push(
					`<rect x="${x}" y="${index * 36}" width="${w}" height="${h}" fill="${escapeTableHtml(fill)}" stroke="${escapeTableHtml(border)}"/><text x="${tx}" y="${index * 36 + h / 2 + 5}" text-anchor="${anchor}" font-family="sans-serif" font-size="14" font-weight="${index === 0 && this.data.header ? 700 : 400}" fill="${escapeTableHtml(foreground)}">${escapeTableHtml(value)}</text>`,
				);
				x += columnWidth;
			});
		});
		if (this.data.caption)
			parts.push(
				`<text x="${width / 2}" y="${height - 12}" text-anchor="middle" font-family="sans-serif" font-size="14" fill="${escapeTableHtml(foreground)}">${escapeTableHtml(this.data.caption)}</text>`,
			);
		return `${parts.join("")}</svg>`;
	}

	private normalizeData(cells: string[][]): TableData {
		if (
			!Array.isArray(cells) ||
			cells.length < 1 ||
			cells.length > 100 ||
			cells.some(
				(row) =>
					!Array.isArray(row) || row.some((cell) => typeof cell !== "string"),
			)
		)
			throw new TypeError("Provide 1–100 rows of text cells.");
		const columns = Math.max(1, ...cells.map((row) => row.length));
		if (columns > 30)
			throw new RangeError("A table supports at most 30 columns.");
		return {
			cells: cells.map((row) =>
				Array.from({ length: columns }, (_, c) => tableText(row[c] ?? "")),
			),
			header: true,
			caption: "",
			alignments: Array<TableAlignment>(columns).fill("left"),
		};
	}
	private remember(): void {
		this.undoStack.push(this.getData());
		if (this.undoStack.length > 100) this.undoStack.shift();
		this.redoStack = [];
	}
	private reflect(): void {
		this.reflecting = true;
		this.rows = this.rows;
		this.columns = this.columns;
		this.caption = this.data.caption;
		this.noHeader = !this.data.header;
		this.reflecting = false;
	}
	private updateAutomaticAlignments(): void {
		this.data.alignments = this.data.alignments.map((alignment, column) =>
			this.data.explicitAlignments?.[column]
				? alignment
				: this.data.cellTypes?.some(
							(row, index) =>
								(!this.data.header || index > 0) && row[column] === "number",
						)
					? "right"
					: "left",
		);
	}
	private changed(focus = false): void {
		this.selectionEnd = null;
		if (this.data.merges)
			this.data.merges = this.data.merges
				.map((m) => ({
					...m,
					rowspan: Math.min(m.rowspan, this.rows - m.row),
					colspan: Math.min(m.colspan, this.columns - m.column),
				}))
				.filter(
					(m) =>
						m.rowspan > 0 &&
						m.colspan > 0 &&
						m.rowspan * m.colspan > 1 &&
						!(this.data.header && m.row === 0 && m.rowspan > 1),
				);
		this.updateAutomaticAlignments();
		this.row = Math.max(0, Math.min(this.row, this.rows - 1));
		this.column = Math.max(0, Math.min(this.column, this.columns - 1));
		const owner = tableMergeAt(this.data, this.row, this.column);
		if (owner) {
			this.row = owner.row;
			this.column = owner.column;
		}
		this.reflect();
		if (this.isConnected) this.renderGrid();
		this.refresh();
		if (focus)
			this.surface
				?.querySelector<TpTextfield>(
					`[data-row="${this.row}"][data-column="${this.column}"]`,
				)
				?.querySelector<HTMLElement>("input, textarea, math-field")
				?.focus();
		this.dispatchEvent(
			new CustomEvent("tp-table-editor-change", {
				bubbles: true,
				detail: { data: this.getData(), markup: this.getMarkup() },
			}),
		);
	}
	private announce(message: string): void {
		if (this.status) this.status.textContent = message;
	}
	private render(): void {
		if (!this.isConnected) return;
		const dropdown = (
			key: string,
			label: string,
			choices: [string, string][],
		): string =>
			`<div ${key === "align" || key === "type" ? 'section="end"' : ""} class="tp-table-editor-choice">${key === "align" ? `<tp-icon-button id="${this.controlId}-${key}" data-trigger="${key}" label="Column alignment" aria-haspopup="menu" aria-expanded="false" data-help-description="Align the selected column left, center or right." pill></tp-icon-button>` : key === "type" ? `<tp-icon-button id="${this.controlId}-${key}" data-trigger="${key}" label="Cell type" aria-haspopup="menu" aria-expanded="false" data-help-description="Choose the selected cell’s field type." pill></tp-icon-button>` : `<tp-button id="${this.controlId}-${key}" data-trigger="${key}" aria-haspopup="menu" aria-expanded="false" outlined>${label}</tp-button>`}<tp-dropdown data-menu="${key}" anchor="#${this.controlId}-${key}" placement="bottom" outside-click><tp-menu><ul>${choices.map(([value, text]) => `<li data-choice="${value}"><tp-icon data-check name="check" aria-hidden="true"></tp-icon>${key === "type" ? fieldSymbol(value as TableCellType) : key === "align" ? `<tp-icon name="format-align-${value}" aria-hidden="true"></tp-icon>` : ""}<span>${text}</span></li>`).join("")}</ul></tp-menu></tp-dropdown></div>`;
		const button = (action: string, icon: string, label: string): string =>
			`<tp-icon-button section="end" name="${icon}" label="${label}" data-action="${action}" data-help-description="${commandDescriptions[action] ?? label}" pill></tp-icon-button>`;
		this.innerHTML = `<tp-toolbar data-help-group="Table editing">
   <span section="start" class="tp-table-editor-title"><tp-icon name="table-editor" library="components"></tp-icon> Table editor</span>
   ${button("reset", "refresh", "Reset")}${button("undo", "undo", "Undo")}${button("redo", "redo", "Redo")}
   <div section="end" class="tp-table-editor-choice">
    <tp-icon-button id="${this.controlId}-structure" data-trigger="structure" name="plus-minus" label="Insert or delete" aria-haspopup="menu" aria-expanded="false" data-help-description="Create or delete the table, or insert or delete rows and columns." pill></tp-icon-button>
    <tp-dropdown data-menu="structure" anchor="#${this.controlId}-structure" placement="bottom" outside-click><tp-menu><ul>
     <li data-table-picker data-choice="insert-table" id="${this.controlId}-table-picker" aria-haspopup="menu" aria-expanded="false"><span data-table-picker-label><tp-icon name="table-settings" aria-hidden="true"></tp-icon>Insert table</span></li>
     <li data-choice="delete-table"><tp-icon name="table-remove" aria-hidden="true"></tp-icon>Delete table</li>
     <tp-divider></tp-divider>
     <li data-choice="add-row-before"><tp-icon name="table-row-plus-before" aria-hidden="true"></tp-icon>Insert row before</li>
     <li data-choice="add-row-after"><tp-icon name="table-row-plus-after" aria-hidden="true"></tp-icon>Insert row after</li>
     <li data-choice="add-column-before"><tp-icon name="table-column-plus-before" aria-hidden="true"></tp-icon>Insert column before</li>
     <li data-choice="add-column-after"><tp-icon name="table-column-plus-after" aria-hidden="true"></tp-icon>Insert column after</li>
     <tp-divider></tp-divider>
     <li data-choice="delete-row"><tp-icon name="table-row-remove" aria-hidden="true"></tp-icon>Delete row</li>
     <li data-choice="delete-column"><tp-icon name="table-column-remove" aria-hidden="true"></tp-icon>Delete column</li><tp-divider></tp-divider><li data-choice="merge-cells"><tp-icon name="table-merge-cells" aria-hidden="true"></tp-icon>Merge cells</li><li data-choice="split-cell"><tp-icon name="table-split-cell" aria-hidden="true"></tp-icon>Split cell</li>
    </ul></tp-menu><tp-dropdown data-table-picker-overlay anchor="#${this.controlId}-table-picker" placement="end" outside-click><div data-table-picker-panel><output data-table-picker-size>3 × 3</output><div data-table-picker-grid aria-label="Table size">${Array.from({ length: 36 }, (_, i) => `<button type="button" data-table-grid-cell ${Math.floor(i / 6) < 3 && i % 6 < 3 ? "data-selected" : ""} data-table-rows="${Math.floor(i / 6) + 1}" data-table-columns="${(i % 6) + 1}" aria-label="Insert ${Math.floor(i / 6) + 1} by ${(i % 6) + 1} table"></button>`).join("")}</div></div></tp-dropdown></tp-dropdown>
   </div>
   ${dropdown("align", "Column alignment", [
			["left", "Left"],
			["center", "Center"],
			["right", "Right"],
		])}
   ${dropdown(
			"type",
			"Type",
			cellTypes.map((type) => [type, `tp-${type}field`]),
		)}
   <span section="end" class="tp-table-editor-image"><tp-save-image anchor="[data-table-export-id='${this.controlId}']" filename="table"></tp-save-image></span>
   <tp-divider section="end" orientation="vertical"></tp-divider>
   <tp-color section="end"></tp-color><tp-theme section="end"></tp-theme><tp-fullscreen section="end"></tp-fullscreen>
  </tp-toolbar>
  <div class="tp-table-editor-settings" data-help-group="Table settings">
   <tp-textfield data-caption label="Caption" clearable></tp-textfield>
   <tp-checkbox-list data-heading orientation="horizontal"><ul><li>Heading</li></ul></tp-checkbox-list>

  </div>
  <div class="tp-table-editor-surface" tabindex="0" role="region" aria-label="Editable table"></div>
  <output class="tp-table-editor-status" role="status" aria-live="polite"></output>
  <p class="tp-table-editor-format-note"></p>
  <tp-tabs data-format-tabs selected="${markupTabFormats.indexOf(this.format)}"><dl>
   ${markupTabFormats
			.map(
				(
					format,
					index,
				) => `<dt>${markupTabLabels[index]}</dt><dd data-format-panel="${format}"><tp-tabs data-markup-tabs><dl>
    <dt>Code</dt><dd><div class="tp-table-editor-code-tools"><tp-icon-button data-save-markup="${format}" name="file-upload" label="Save ${formatLabels[format]} as" data-help-description="Choose a filename and save this markup source." pill></tp-icon-button></div><div data-markup aria-label="${formatLabels[format]} code"></div></dd>
    <dt>Render</dt><dd><div class="tp-table-editor-preview-tools"><tp-screen data-table-screen disabled></tp-screen></div><div class="tp-table-editor-preview" data-markup-preview></div></dd>
   </dl></tp-tabs></dd>`,
			)
			.join("")}
  </dl></tp-tabs>
  <details data-spreadsheet-details><summary>Spreadsheet</summary><tp-tabs data-spreadsheet-tabs><dl>
   ${["csv", "json", "xlsx"].map((format) => `<dt>${format}</dt><dd data-spreadsheet-panel="${format}"><div class="tp-table-editor-code-tools"><tp-icon-button data-save-spreadsheet="${format}" name="file-upload" label="Save ${format.toUpperCase()} as" data-help-description="Choose a filename and save the spreadsheet data." pill></tp-icon-button></div>${format === "xlsx" ? "<p>xl/worksheets/sheet1.xml — Save downloads the complete XLSX workbook.</p>" : ""}<div data-spreadsheet-code aria-label="${format.toUpperCase()} code"></div></dd>`).join("")}
  </dl></tp-tabs></details>
`;
		this.surface = this.querySelector(".tp-table-editor-surface");
		this.captionField = this.querySelector("[data-caption]");
		this.codeKey = "";
		this.previewKey = "";
		this.previewRevision++;
		this.spreadsheetKey = "";
		this.spreadsheetRevision++;
		const formats = this.querySelector<TpTabs>("[data-format-tabs]");
		formats?.addEventListener("tp-tabs-select", (event) => {
			if (event.target === formats)
				this.format = markupTabFormats[formats.selected] ?? "markdown";
		});
		for (const tabs of this.querySelectorAll<TpTabs>("[data-markup-tabs]")) {
			tabs.addEventListener("tp-tabs-select", (event) => {
				if (event.target === tabs) void this.refreshPreview();
			});
		}
		this.querySelector("[data-spreadsheet-details]")?.addEventListener(
			"toggle",
			() => {
				void this.refreshSpreadsheet();
			},
		);
		const spreadsheets = this.querySelector<TpTabs>("[data-spreadsheet-tabs]");
		spreadsheets?.addEventListener("tp-tabs-select", (event) => {
			if (event.target === spreadsheets) void this.refreshSpreadsheet();
		});
		for (const button of this.querySelectorAll<HTMLElement>(
			"[data-save-markup], [data-save-spreadsheet]",
		)) {
			button.addEventListener("click", () => {
				if (!this.rows) return;
				const format = button.dataset.saveMarkup;
				if (format) this.format = format as TableFormat;
				void (
					format
						? this.download()
						: this.downloadSpreadsheet(
								button.dataset.saveSpreadsheet as "csv" | "json" | "xlsx",
							)
				).catch(() => this.announce("Saving failed. Please try again."));
			});
		}
		this.status = this.querySelector(".tp-table-editor-status");
		this.querySelector("tp-save-image")?.addEventListener(
			"tp-save-image-error",
			() => this.announce("Image export failed. Please try again."),
		);
		this.captionField?.addEventListener("input", () => {
			if (this.readonly || !this.captionField) return;
			this.remember();
			this.data.caption = tableText(this.captionField.value);
			this.reflect();
			this.refresh();
			this.emitEdit();
		});
		this.querySelector("[data-heading]")?.addEventListener(
			"change",
			(event) => {
				if (
					this.readonly ||
					!this.rows ||
					!(event.target instanceof HTMLInputElement)
				)
					return;
				this.noHeader = !event.target.checked;
			},
		);

		this.dataset.tableExportId = this.controlId;
		for (const dropdown of this.querySelectorAll<TpDropdown>(
			"tp-dropdown[data-menu]",
		)) {
			const key = dropdown.dataset.menu;
			const trigger = this.querySelector<HTMLElement>(
				`[data-trigger="${key}"]`,
			);
			trigger?.addEventListener("click", () => {
				if (trigger.hasAttribute("disabled")) return;
				dropdown.setAttribute("anchor", `#${trigger.id}`);
				for (const other of this.querySelectorAll<TpDropdown>(
					"tp-dropdown[data-menu]",
				))
					if (other !== dropdown) other.hide();
				dropdown.toggle();
			});
			dropdown.addEventListener("tp-dropdown-toggle", () =>
				trigger?.setAttribute("aria-expanded", String(dropdown.open)),
			);
			dropdown.addEventListener("tp-menu-item-select", (event) => {
				const value = (event as CustomEvent<{ item: HTMLElement }>).detail.item
					.dataset.choice;
				if (
					!value ||
					(
						event as CustomEvent<{ item: HTMLElement }>
					).detail.item.getAttribute("aria-disabled") === "true"
				)
					return;
				if (key === "structure" && value === "insert-table") {
					this.querySelector<TpDropdown>(
						"[data-table-picker-overlay]",
					)?.toggle();
					return;
				}
				dropdown.hide();
				if (!this.readonly && key === "structure") {
					if (value === "add-row-before" || value === "add-row-after")
						this.addRow(value === "add-row-before" ? "before" : "after");
					else if (
						value === "add-column-before" ||
						value === "add-column-after"
					)
						this.addColumn(value === "add-column-before" ? "before" : "after");
					else if (value === "delete-table") this.deleteTable();
					else if (value === "delete-row") this.deleteRow();
					else if (value === "delete-column") this.deleteColumn();
					else if (value === "merge-cells") this.mergeCells();
					else if (value === "split-cell") this.splitCell();
				} else if (!this.readonly && key === "type")
					this.setCellType(this.row, this.column, value as TableCellType);
				else if (!this.readonly && key === "align") {
					this.setColumnAlignment(value as TableAlignment);
				}
			});
		}
		const pickerOverlay = this.querySelector<TpDropdown>(
			"[data-table-picker-overlay]",
		);
		const pickerItem = this.querySelector<HTMLElement>("[data-table-picker]");
		const structureMenu = this.querySelector<TpDropdown>(
			'[data-menu="structure"]',
		);
		pickerOverlay?.addEventListener("tp-dropdown-toggle", (event) => {
			event.stopPropagation();
			pickerItem?.setAttribute("aria-expanded", String(pickerOverlay.open));
			if (pickerOverlay.open)
				pickerOverlay
					.querySelector<HTMLButtonElement>("[data-table-grid-cell]")
					?.focus();
		});
		structureMenu?.addEventListener("tp-dropdown-toggle", () => {
			if (!structureMenu.open) pickerOverlay?.hide();
		});
		pickerItem?.addEventListener("keydown", (event) => {
			if (event.key !== "ArrowRight" || this.readonly || this.rows) return;
			event.preventDefault();
			pickerOverlay?.show();
		});

		for (const cell of this.querySelectorAll<HTMLButtonElement>(
			"[data-table-grid-cell]",
		)) {
			const rows = Number(cell.dataset.tableRows);
			const columns = Number(cell.dataset.tableColumns);
			const preview = () => {
				const output = this.querySelector("[data-table-picker-size]");
				if (output) output.textContent = `${rows} × ${columns}`;
				for (const other of this.querySelectorAll<HTMLElement>(
					"[data-table-grid-cell]",
				))
					other.toggleAttribute(
						"data-selected",
						Number(other.dataset.tableRows) <= rows &&
							Number(other.dataset.tableColumns) <= columns,
					);
			};
			cell.addEventListener("pointerover", preview);
			cell.addEventListener("focus", preview);
			cell.addEventListener("click", (event) => {
				event.stopPropagation();
				if (this.readonly || !this.insertTable(rows, columns)) return;
				this.querySelector<TpDropdown>('[data-menu="structure"]')?.hide();
			});
		}

		for (const control of this.querySelectorAll<HTMLElement>(
			"tp-icon-button[data-action]",
		))
			control.addEventListener("click", () => {
				const action = control.dataset.action;
				if (this.readonly) return;
				switch (action) {
					case "reset":
						this.reset();
						break;
					case "undo":
						this.undo();
						break;
					case "redo":
						this.redo();
						break;
					case "add-row":
						this.addRow();
						break;
					case "add-column":
						this.addColumn();
						break;
					case "delete-row":
						this.deleteRow();
						break;
					case "delete-column":
						this.deleteColumn();
						break;
				}
			});
		this.onkeydown = (event) => {
			if (this.readonly || !(event.ctrlKey || event.metaKey) || event.altKey)
				return;
			const key = event.key.toLowerCase();
			if (key !== "z" && key !== "y") return;
			event.preventDefault();
			if (key === "y" || event.shiftKey) this.redo();
			else this.undo();
		};
		this.createCellMenu();
		this.renderGrid();
		this.refresh();
	}
	private emitEdit(): void {
		this.dispatchEvent(
			new CustomEvent("tp-table-editor-change", {
				bubbles: true,
				detail: { data: this.getData(), markup: this.getMarkup() },
			}),
		);
	}
	private renderGrid(): void {
		if (!this.surface) return;
		if (!this.rows) {
			this.surface.textContent =
				"No table. Choose Insert table in the +/− menu.";
			return;
		}
		const table = this.ownerDocument.createElement("table");
		if (this.data.caption) {
			const caption = table.createCaption();
			caption.textContent = this.data.caption;
		}
		const body = table.createTBody();
		this.data.cells.forEach((row, r) => {
			const tr = this.ownerDocument.createElement("tr");
			row.forEach((value, c) => {
				if (tableCellCovered(this.data, r, c)) return;
				const merge = tableMergeAt(this.data, r, c);
				const cell = this.ownerDocument.createElement(
					this.data.header && r === 0 ? "th" : "td",
				);
				if (cell.tagName === "TH") cell.setAttribute("scope", "col");
				cell.dataset.gridRow = String(r);
				cell.dataset.gridColumn = String(c);
				if (merge) {
					cell.rowSpan = merge.rowspan;
					cell.colSpan = merge.colspan;
				}
				cell.addEventListener("mousedown", (event) => {
					if (this.readonly) return;
					if (event.button === 2 && this.selectionEnd) {
						event.preventDefault();
						return;
					}
					if (event.button !== 0) return;
					if (event.shiftKey) {
						event.preventDefault();
						this.selectionEnd = { row: r, column: c };
					} else {
						this.row = r;
						this.column = c;
						this.selectionEnd = null;
					}
					this.refresh();
				});
				const field = this.ownerDocument.createElement(
					`tp-${this.getCellType(r, c)}field`,
				);
				field.dataset.row = String(r);
				field.dataset.column = String(c);
				field.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}`);
				if (this.getCellType(r, c) === "math") {
					field.setAttribute(
						"mode",
						this.data.cellMathModes?.[r]?.[c] ?? "latexmath",
					);
					field.addEventListener("change", () => {
						const mode = (field as TpMathfield).mode;
						if (
							this.readonly ||
							mode === (this.data.cellMathModes?.[r]?.[c] ?? "latexmath")
						)
							return;
						this.remember();
						this.data.cellMathModes ??= this.data.cells.map((row) =>
							row.map(() => "latexmath"),
						);
						this.data.cellMathModes[r]?.splice(c, 1, mode);
						this.refresh();
						this.emitEdit();
					});
				}
				field.value = value;
				field.readOnly = this.readonly;
				field.style.setProperty(
					"--tp-table-cell-align",
					this.data.alignments[c] ?? "left",
				);
				field.addEventListener("focusin", () => {
					if (this.row !== r || this.column !== c) this.selectionEnd = null;
					this.row = r;
					this.column = c;
					this.refresh();
				});
				field.addEventListener("input", () => {
					if (
						this.readonly ||
						this.data.cells[r]?.[c] === tableText(field.value)
					)
						return;
					this.remember();
					this.data.cells[r]?.splice(c, 1, tableText(field.value));
					this.refresh();
					this.emitEdit();
				});
				cell.addEventListener("contextmenu", (event) => {
					if (this.readonly) return;
					event.preventDefault();
					event.stopPropagation();
					this.openCellMenu(r, c, event.clientX, event.clientY);
				});
				cell.addEventListener("keydown", (event) => {
					if (
						!this.readonly &&
						event.altKey &&
						event.shiftKey &&
						["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
							event.key,
						)
					) {
						event.preventDefault();
						const end = this.selectionEnd ?? { row: r, column: c };
						this.selectionEnd = {
							row: Math.max(
								0,
								Math.min(
									this.rows - 1,
									end.row +
										(event.key === "ArrowDown"
											? 1
											: event.key === "ArrowUp"
												? -1
												: 0),
								),
							),
							column: Math.max(
								0,
								Math.min(
									this.columns - 1,
									end.column +
										(event.key === "ArrowRight"
											? 1
											: event.key === "ArrowLeft"
												? -1
												: 0),
								),
							),
						};
						this.refresh();
						return;
					}
					if (
						this.readonly ||
						!(
							event.key === "ContextMenu" ||
							(event.shiftKey && event.key === "F10")
						)
					)
						return;
					event.preventDefault();
					event.stopPropagation();
					const rect = cell.getBoundingClientRect();
					this.openCellMenu(r, c, rect.left, rect.bottom);
				});
				cell.append(field);
				tr.append(cell);
			});
			body.append(tr);
		});
		this.surface.replaceChildren(table);
		this.installColumnResize(table);
	}
	private installColumnResize(table: HTMLTableElement): void {
		const cells = Array.from(table.rows[0]?.cells ?? []);
		const group = this.ownerDocument.createElement("colgroup");
		for (let column = 0; column < this.columns; column++)
			group.append(this.ownerDocument.createElement("col"));
		table.insertBefore(group, table.tBodies[0] ?? null);
		const widths = (): number[] =>
			this.data.columnWidths ??
			Array.from({ length: this.columns }, (_, column) => {
				const cell = cells.find(
					(cell) =>
						Number(cell.dataset.gridColumn) <= column &&
						Number(cell.dataset.gridColumn) + cell.colSpan > column,
				);
				return Math.max(
					128,
					Math.round(
						(cell?.getBoundingClientRect().width ?? 0) / (cell?.colSpan ?? 1),
					) || 160,
				);
			});
		const apply = (): void => {
			if (!this.data.columnWidths) return;
			this.data.columnWidths.forEach((width, column) => {
				(group.children[column] as HTMLElement).style.width = `${width}px`;
				cells[column]
					?.querySelector("[data-column-resize]")
					?.setAttribute("aria-valuenow", String(width));
			});
			table.style.tableLayout = "fixed";
			table.style.maxInlineSize = "none";
			table.style.maxWidth = "none";
			table.style.width = `${this.data.columnWidths.reduce((sum, width) => sum + width, 0)}px`;
		};
		apply();
		if (this.readonly) return;
		cells.forEach((cell) => {
			const column = Number(cell.dataset.gridColumn) + cell.colSpan - 1;
			const handle = this.ownerDocument.createElement("span");
			handle.dataset.columnResize = String(column);
			handle.tabIndex = 0;
			handle.setAttribute("role", "separator");
			handle.setAttribute("aria-orientation", "vertical");
			handle.setAttribute("aria-label", `Resize column ${column + 1}`);
			handle.setAttribute("aria-valuemin", "128");
			handle.setAttribute("aria-valuenow", String(widths()[column]));
			let drag: {
				id: number;
				x: number;
				width: number;
				changed: boolean;
			} | null = null;
			const resize = (width: number): boolean => {
				const current = widths();
				const next = Math.max(128, Math.round(width));
				if (next === current[column]) return false;
				if (!drag?.changed) this.remember();
				if (drag) drag.changed = true;
				current[column] = next;
				this.data.columnWidths = current;
				apply();
				return true;
			};
			const finish = (): void => {
				const changed = drag?.changed;
				drag = null;
				if (changed) {
					this.refresh();
					this.emitEdit();
				}
			};
			handle.addEventListener("pointerdown", (event) => {
				if (event.button !== 0) return;
				event.preventDefault();
				event.stopPropagation();
				drag = {
					id: event.pointerId,
					x: event.clientX,
					width: widths()[column] ?? 160,
					changed: false,
				};
				handle.setPointerCapture(event.pointerId);
				handle.focus();
			});
			handle.addEventListener("pointermove", (event) => {
				if (drag?.id !== event.pointerId) return;
				const direction = getComputedStyle(table).direction === "rtl" ? -1 : 1;
				resize(drag.width + direction * (event.clientX - drag.x));
			});
			handle.addEventListener("pointerup", finish);
			handle.addEventListener("pointercancel", finish);
			handle.addEventListener("lostpointercapture", finish);
			handle.addEventListener("dblclick", () => {
				if (resize(160)) {
					this.refresh();
					this.emitEdit();
				}
			});
			handle.addEventListener("keydown", (event) => {
				if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
				event.preventDefault();
				const direction = getComputedStyle(table).direction === "rtl" ? -1 : 1;
				if (
					resize(
						(widths()[column] ?? 160) +
							direction * (event.key === "ArrowRight" ? 8 : -8),
					)
				) {
					this.refresh();
					this.emitEdit();
				}
			});
			cell.append(handle);
		});
	}
	private async refreshPreview(): Promise<void> {
		const panel = this.querySelector(`[data-format-panel="${this.format}"]`);
		const tabs = panel?.querySelector<TpTabs>("[data-markup-tabs]");
		const target = panel?.querySelector<HTMLElement>("[data-markup-preview]");
		if (!target || tabs?.selected !== 1) return;
		target.toggleAttribute("data-heading", this.data.header);
		const format = this.format;
		const source = this.getMarkup(format);
		const key = `${format}:${source}`;
		if (key === this.previewKey) return;
		this.previewKey = key;
		const revision = ++this.previewRevision;
		target.textContent = "Loading preview…";
		panel
			?.querySelector<TpScreen>("tp-screen[data-table-screen]")
			?.setAttribute("disabled", "");
		try {
			switch (format) {
				case "markdown":
					await import("../markdown/markdown.js");
					break;
				case "asciidoc":
					await import("../asciidoc/asciidoc.js");
					break;
				case "restructuredtext":
					await import("../restructuredtext/restructuredtext.js");
					break;
				case "latex":
					await import("../latex/latex.js");
					break;
			}
			const { buildIframeDocument } = await import(
				"../html-viewer/html-viewer.js"
			);
			if (revision !== this.previewRevision || !target.isConnected) return;
			const screen = panel?.querySelector<TpScreen>(
				"tp-screen[data-table-screen]",
			);
			if (screen) {
				// JSON preserves literal script delimiters in cell content without ending this script.
				const literal = JSON.stringify(source).replaceAll("<", "\\u003c");
				const content =
					format === "html"
						? source
						: `<script type="module">const renderer = document.createElement("tp-${format}"); const source = document.createElement("script"); source.type = "tp/${format}"; source.textContent = ${literal}; renderer.append(source); document.querySelector("[data-markup-preview]").append(renderer);</script>`;
				screen.srcdoc = buildIframeDocument(
					`<style>${previewStyle}</style><div class="tp-table-editor-preview" data-markup-preview ${this.data.header ? "data-heading" : ""}>${content}</div>` +
						'<script type="module">import "/tp-loader.js";</script>',
					this.baseURI,
				);
				screen.disabled = !this.rows;
			}
			if (format === "html") {
				target.innerHTML = source;
			} else {
				const renderer = document.createElement(`tp-${format}`);
				const script = document.createElement("script");
				script.type = `tp/${format}`;
				script.textContent = source;
				renderer.append(script);
				target.replaceChildren(renderer);
			}
		} catch {
			if (revision !== this.previewRevision || !target.isConnected) return;
			this.previewKey = "";
			target.textContent =
				"Unable to load the markup preview. Select Render to try again.";
		}
	}
	private async refreshSpreadsheet(): Promise<void> {
		const details = this.querySelector<HTMLDetailsElement>(
			"[data-spreadsheet-details]",
		);
		if (!details?.open) return;
		const tabs = details.querySelector<TpTabs>("[data-spreadsheet-tabs]");
		const format = ["csv", "json", "xlsx"][tabs?.selected ?? 0] ?? "csv";
		const target = details.querySelector<HTMLElement>(
			`[data-spreadsheet-panel="${format}"] [data-spreadsheet-code]`,
		);
		if (!target) return;
		const cells = this.getData().cells;
		const key = `${format}:${JSON.stringify(cells)}:${JSON.stringify(this.data.merges)}`;
		if (key === this.spreadsheetKey) return;
		this.spreadsheetKey = key;
		const revision = ++this.spreadsheetRevision;
		target.textContent = "Loading source…";
		try {
			let source = "";
			if (cells.length) {
				if (format === "json") source = JSON.stringify(cells, null, 2);
				else {
					const XLSX = await import("xlsx");
					const sheet = XLSX.utils.aoa_to_sheet(cells);
					if (format === "xlsx")
						sheet["!merges"] = this.data.merges?.map((m) => ({
							s: { r: m.row, c: m.column },
							e: { r: m.row + m.rowspan - 1, c: m.column + m.colspan - 1 },
						}));
					if (format === "csv") source = XLSX.utils.sheet_to_csv(sheet);
					else {
						const workbook = XLSX.utils.book_new();
						XLSX.utils.book_append_sheet(workbook, sheet, "Table");
						const bytes = XLSX.write(workbook, {
							bookType: "xlsx",
							type: "array",
						});
						const archive = XLSX.read(bytes, {
							type: "array",
							bookFiles: true,
						}) as ReturnType<typeof XLSX.read> & {
							files?: Record<string, { content: Uint8Array }>;
						};
						const entry = archive.files?.["xl/worksheets/sheet1.xml"];
						if (!entry) throw new Error("Missing worksheet XML");
						source = new TextDecoder()
							.decode(entry.content)
							.replaceAll("><", ">\n<");
					}
				}
			}
			if (revision !== this.spreadsheetRevision || !target.isConnected) return;
			const pre = document.createElement("pre");
			pre.setAttribute("theme", "dark");
			const code = document.createElement("code");
			code.className = `language-${format === "xlsx" ? "xml" : format === "csv" ? "plaintext" : "json"}`;
			code.textContent = source;
			pre.append(code);
			target.replaceChildren(pre);
			const { default: renderer } = await import(
				"@tp/tp-markdown/markdown/renderers/highlight"
			);
			if (revision === this.spreadsheetRevision)
				await renderer.render(target, { theme: "dark" });
		} catch {
			if (revision !== this.spreadsheetRevision || !target.isConnected) return;
			this.spreadsheetKey = "";
			target.textContent =
				"Unable to load the source. Select the tab to try again.";
		}
	}
	private refresh(): void {
		if (!this.isConnected) return;
		const formats = this.querySelector<TpTabs>("[data-format-tabs]");
		const index = markupTabFormats.indexOf(this.format);
		if (formats && formats.selected !== index) formats.selected = index;
		this.output = this.querySelector(
			`[data-format-panel="${this.format}"] [data-markup]`,
		);
		for (const button of this.querySelectorAll(
			"[data-save-markup], [data-save-spreadsheet]",
		))
			button.toggleAttribute("disabled", !this.rows);
		void this.refreshSpreadsheet();
		if (this.output) {
			const source = this.getMarkup();
			const key = `${this.format}:${source}`;
			if (key !== this.codeKey) {
				this.codeKey = key;
				const pre = document.createElement("pre");
				pre.setAttribute("theme", "dark");
				const code = document.createElement("code");
				code.className = `language-${this.format === "restructuredtext" ? "rst" : this.format}`;
				code.textContent = source;
				pre.append(code);
				this.output.replaceChildren(pre);
				const root = this.output;
				void import("@tp/tp-markdown/markdown/renderers/highlight")
					.then(({ default: renderer }) =>
						renderer.render(root, { theme: "dark" }),
					)
					.catch(() => {
						/* Plain source remains readable if highlighting cannot load. */
					});
			}
		}
		void this.refreshPreview();
		if (this.captionField) {
			if (this.captionField.value !== this.data.caption)
				this.captionField.value = this.data.caption;
			this.captionField.readOnly = this.readonly || !this.rows;
		}
		const heading = this.querySelector("[data-heading]");
		heading?.setAttribute("value", this.rows && this.data.header ? "1" : "");
		heading
			?.querySelector("li")
			?.toggleAttribute("disabled", this.readonly || !this.rows);
		const headingInput = heading?.querySelector<HTMLInputElement>(
			'input[type="checkbox"]',
		);
		if (headingInput) headingInput.disabled = this.readonly || !this.rows;

		const alignment = this.data.alignments[this.column] ?? "left";
		const alignmentTrigger = this.querySelector('[data-trigger="align"]');
		alignmentTrigger?.setAttribute("name", `format-align-${alignment}`);
		alignmentTrigger?.setAttribute("label", `Column alignment: ${alignment}`);
		const selectedType = this.rows
			? this.getCellType(this.row, this.column)
			: "text";
		const typeTrigger = this.querySelector('[data-trigger="type"]');
		const [typeIcon, typeLibrary] = fieldSymbols[selectedType];
		typeTrigger?.setAttribute("name", typeIcon);
		typeTrigger?.setAttribute("library", typeLibrary);
		typeTrigger?.setAttribute("label", `Cell type: tp-${selectedType}field`);
		for (const [key, value] of [
			["align", this.data.alignments[this.column] ?? "left"],
			["type", selectedType],
		]) {
			this.querySelector(`[data-trigger="${key}"]`)?.toggleAttribute(
				"disabled",
				!this.rows || this.readonly,
			);
			for (const item of this.querySelectorAll<HTMLElement>(
				`[data-menu="${key}"] [data-choice]`,
			))
				item.setAttribute(
					"aria-current",
					String(item.dataset.choice === value),
				);
		}
		for (const button of this.querySelectorAll<HTMLElement>(
			"tp-icon-button[data-action]",
		)) {
			const action = button.dataset.action;
			const disabled =
				this.readonly ||
				(action === "undo" && !this.undoStack.length) ||
				(action === "redo" && !this.redoStack.length) ||
				(action === "delete-row" && this.rows === 1) ||
				(action === "delete-column" && this.columns === 1) ||
				(action === "add-row" && this.rows === 100) ||
				(action === "add-column" && this.columns === 30);
			button.toggleAttribute("disabled", disabled);
		}
		this.querySelector('[data-trigger="structure"]')?.toggleAttribute(
			"disabled",
			this.readonly,
		);
		for (const item of this.querySelectorAll<HTMLElement>(
			'[data-menu="structure"] [data-choice]',
		)) {
			const action = item.dataset.choice;
			item.setAttribute(
				"aria-disabled",
				String(
					this.readonly ||
						!this.rows ||
						(action?.startsWith("add-row-") && this.rows >= 100) ||
						(action?.startsWith("add-column-") && this.columns >= 30) ||
						(action === "delete-row" && this.rows <= 1) ||
						(action === "delete-column" && this.columns <= 1),
				),
			);
		}
		if (!this.rows)
			for (const screen of this.querySelectorAll<TpScreen>(
				"[data-table-screen]",
			))
				screen.disabled = true;
		this.updateMergeControls();
		const cannotInsert = this.readonly || this.rows > 0;
		this.querySelector("[data-table-picker]")?.setAttribute(
			"aria-disabled",
			String(cannotInsert),
		);
		for (const cell of this.querySelectorAll<HTMLButtonElement>(
			"[data-table-grid-cell]",
		))
			cell.disabled = cannotInsert;
		this.querySelector("tp-save-image")?.toggleAttribute(
			"disabled",
			!this.rows,
		);

		const table = this.surface?.querySelector("table");
		if (table) {
			if (this.data.caption)
				table.createCaption().textContent = this.data.caption;
			else table.deleteCaption();
		}
		const note = this.querySelector(".tp-table-editor-format-note");
		if (note)
			note.textContent =
				this.format === "restructuredtext"
					? "reStructuredText preserves text and headings, without per-column alignment. Merged cells use a grid table."
					: this.format === "latex" && this.data.merges?.length
						? "Merged tables use tp-latex element commands with rowspan and colspan."
						: this.format === "markdown" && !this.data.header
							? "Markdown pipe tables require a heading row: an empty heading is added above your data."
							: "Math cells use mathematical markup; other cells remain literal text. Captions use native table syntax.";
		const selection = this.mergeRange();
		this.announce(
			this.rows
				? this.selectionEnd && selection
					? `${this.rows} rows × ${this.columns} columns · Selected: rows ${selection.row + 1}–${selection.row + selection.rowspan}, columns ${selection.column + 1}–${selection.column + selection.colspan}`
					: `${this.rows} rows × ${this.columns} columns · Selected: row ${this.row + 1}, column ${this.column + 1}`
				: "No table.",
		);
	}
}
if (!customElements.get("tp-table-editor"))
	customElements.define("tp-table-editor", TpTableEditor);
declare global {
	interface HTMLElementTagNameMap {
		"tp-table-editor": TpTableEditor;
	}
}
