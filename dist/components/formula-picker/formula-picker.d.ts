/** @module components/formula-picker */
import { TpBase } from "../base/base.js";
export declare const spreadsheetFormulaNames: string[];
export declare function spreadsheetFormulaSignature(name: string): string;
/** Selects an Excel-compatible Formula.js function.  * @tagname tp-formula-picker
 * @example
 * <tp-formula-picker></tp-formula-picker>
 * @event tp-formula-picker-select Emitted when a spreadsheet function is selected. formula contains the leading = and argument placeholders; selectionStart and selectionEnd are zero-based string offsets delimiting the arguments to select.
 * @eventdetail tp-formula-picker-select { name: string; formula: string; selectionStart: number; selectionEnd: number }
 */
export declare class TpFormulaPicker extends TpBase {
    private static readonly styleId;
    protected connectedCallback(): void;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-formula-picker": TpFormulaPicker;
    }
}
