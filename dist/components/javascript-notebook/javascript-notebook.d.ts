/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
import '../notebook/notebook.js';
import { TpNotebook } from '../notebook/notebook.js';
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 * @tagname tp-javascript-notebook
 * @summary Interactive JavaScript notebook with markup and code cells.
 * @example
 * <tp-javascript-notebook></tp-javascript-notebook>
 */
export declare class TpJavascriptNotebook extends TpNotebook {
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-javascript-notebook': TpJavascriptNotebook;
    }
}
