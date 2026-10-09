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
 * @event tp-spreadsheet-editor-error Emitted when loading src fails; detail contains src and error.
 * @attr {string} value = "" - JSON-encoded two-dimensional array of raw cell values.
 * @event tp-spreadsheet-editor-input Emitted whenever a cell changes.
 * @event tp-spreadsheet-editor-import Emitted after a file is imported.
 * @event tp-spreadsheet-editor-export Emitted after a file is exported.
 * @event tp-spreadsheet-editor-structure Emitted after rows or columns change.
 * @example
 * <tp-spreadsheet-editor src="/tp-components/docs/components/spreadsheet-editor/examples/budget.csv"></tp-spreadsheet-editor>
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
    getData(): string[][];
    setData(value: readonly (readonly unknown[])[]): void;
    importFile(file: File): Promise<void>;
    private parseFile;
    private applyImport;
    exportFile(format: TpSpreadsheetFileFormat, filename?: string, mode?: TpSpreadsheetExportMode): void;
    insertRow(position?: "before" | "after"): void;
    deleteRow(): void;
    insertColumn(position?: "before" | "after"): void;
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
