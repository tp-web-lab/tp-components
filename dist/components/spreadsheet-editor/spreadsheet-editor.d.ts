/**
 * @module components/spreadsheet-editor
 * @summary Editable spreadsheet with Excel-style formulas powered by Formula.js.
 */
import { TpBase } from "../base/base.js";
import "../color/color.js";
import "../dropdown/dropdown.js";
import "../formula-picker/formula-picker.js";
import "../fullscreen/fullscreen.js";
import "../icon-button/icon-button.js";
import "../menu/menu.js";
import "../theme/theme.js";
import "../toolbar/toolbar.js";
export type TpSpreadsheetFileFormat = "csv" | "json" | "xlsx";
export type TpSpreadsheetExportMode = "formulas" | "values";
export declare function parseSpreadsheetCsv(source: string): string[][];
export declare function serializeSpreadsheetCsv(data: readonly (readonly unknown[])[]): string;
export declare function columnName(index: number): string;
export declare function cellCoordinates(reference: string): [number, number] | null;
export declare function translateSpreadsheetFormula(source: string, rows: number, columns: number): string;
/**
 * `<tp-spreadsheet-editor>` provides an editable grid with Excel-style formulas.
 * @tagname tp-spreadsheet-editor
 * @attr {number} rows = 20 - Number of rows (`20` by default).
 * @attr {number} columns = 10 - Number of columns (`10` by default).
 * @attr {string} src = "" - CSV, JSON or XLSX file URL loaded on connection and whenever it changes.

 * @attr {string} value = "" - JSON-encoded two-dimensional array of raw cell values.




 * @example
 * <tp-spreadsheet-editor src="/docs/components/spreadsheet-editor/examples/budget.csv"></tp-spreadsheet-editor>
 * @event tp-spreadsheet-editor-clipboard-error Emitted when a clipboard command fails; command identifies copy, cut or paste.
 * @eventdetail tp-spreadsheet-editor-clipboard-error { command: "copy" | "cut" | "paste" }
 * @event tp-spreadsheet-editor-error Emitted when fetching or parsing src fails, except for aborted requests; src is the requested URL and error is the caught failure.
 * @eventdetail tp-spreadsheet-editor-error { src: string; error: unknown }
 * @event tp-spreadsheet-editor-export Emitted after a CSV, JSON or XLSX download is prepared; filename includes the extension.
 * @eventdetail tp-spreadsheet-editor-export { format: "csv" | "json" | "xlsx"; filename: string }
 * @event tp-spreadsheet-editor-import Emitted after an imported file replaces the sheet; format is the detected filename extension and file is the selected File object.
 * @eventdetail tp-spreadsheet-editor-import { format: string; file: File }
 * @event tp-spreadsheet-editor-input Emitted for each edited or cleared cell. cell is its A1 reference, raw is the stored input or formula, and value is the evaluated result.
 * @eventdetail tp-spreadsheet-editor-input { cell: string; raw: string; value: string | number | boolean | Date }
 * @event tp-spreadsheet-editor-structure Emitted after inserting or deleting a row or column. index is zero-based; rows and columns are the resulting dimensions.
 * @eventdetail tp-spreadsheet-editor-structure { action: "insert-row" | "delete-row" | "insert-column" | "delete-column"; index: number; rows: number; columns: number }
 */
export declare class TpSpreadsheetEditor extends TpBase {
    private static readonly styleId;
    private static nextId;
    private static copiedCell;
    private data;
    private readonly formats;
    private readonly cellStyles;
    private readonly undoStack;
    private readonly redoStack;
    private colorPreset;
    private themeMode;
    private formulaInput;
    private nameOutput;
    private activeReference;
    private readonly columnWidths;
    private selectionAnchor;
    private sourceRequest;
    static get observedAttributes(): string[];
    get src(): string;
    set src(value: string);
    get rows(): number;
    set rows(value: number);
    get columns(): number;
    set columns(value: number);
    get value(): string;
    set value(value: string);
    /**
     * @summary Returns a row-by-row copy of raw cell strings, including formulas rather than calculated results.
     */
    getData(): string[][];
    /**
     * @summary Replaces the matrix, converts values to strings and pads missing cells with empty strings. Updates rows, columns and value, retaining at least one row and column.
     */
    setData(value: readonly (readonly unknown[])[]): void;
    /**
     * @summary Loads CSV, JSON or the first XLSX sheet into the editor, records undo state and emits tp-spreadsheet-editor-import. Resolves after application; unsupported or invalid files reject.
     */
    importFile(file: File): Promise<void>;
    private parseFile;
    private applyImport;
    /**
     * @summary Downloads CSV, JSON or XLSX using filename plus the extension. The formulas mode preserves raw formulas; values exports calculated cell results.
     */
    exportFile(format: TpSpreadsheetFileFormat, filename?: string, mode?: TpSpreadsheetExportMode): void;
    /**
     * @summary Inserts an empty row before or after the active cell, selects it, clears cell formatting and emits a structure-change event. Does nothing without a valid active cell.
     */
    insertRow(position?: "before" | "after"): void;
    /**
     * @summary Deletes the active row, adjusts selection, clears cell formatting and emits a structure-change event. Preserves the last remaining row.
     */
    deleteRow(): void;
    /**
     * @summary Inserts an empty column before or after the active cell, selects it, clears cell formatting and emits a structure-change event. Does nothing without a valid active cell.
     */
    insertColumn(position?: "before" | "after"): void;
    /**
     * @summary Deletes the active column, adjusts selection, clears cell formatting and emits a structure-change event. Preserves the last remaining column.
     */
    deleteColumn(): void;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    private loadSource;
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    private ensureId;
    private readValue;
    private render;
    private createToolbar;
    private selectedReferences;
    private clearSelection;
    private select;
    private commit;
    private displayValue;
    private rememberState;
    private restoreState;
    private emitStructureChange;
    private undo;
    private redo;
    private applyFormat;
    private toggleCellStyle;
    private clearActiveFormatting;
    private runToolbarCommand;
    private search;
    private evaluate;
    private range;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-spreadsheet-editor": TpSpreadsheetEditor;
    }
}
