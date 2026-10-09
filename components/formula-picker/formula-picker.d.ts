/** @module components/formula-picker */
import { TpBase } from '../base/base.js';
export declare const spreadsheetFormulaNames: string[];
export declare function spreadsheetFormulaSignature(name: string): string;
/** Selects an Excel-compatible Formula.js function.  * @tagname tp-formula-picker
 * @example
 * <tp-formula-picker></tp-formula-picker>
 */
export declare class TpFormulaPicker extends TpBase {
    private static readonly styleId;
    protected connectedCallback(): void;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-formula-picker': TpFormulaPicker;
    }
}
