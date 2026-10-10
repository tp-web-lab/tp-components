/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
import '../notebook/notebook.js';
import { TpNotebook } from '../notebook/notebook.js';
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 * @tagname tp-python-notebook
 * @summary Interactive Python notebook with markup and code cells.
 * @example
 * <tp-python-notebook></tp-python-notebook>
 */
export declare class TpPythonNotebook extends TpNotebook {
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-python-notebook': TpPythonNotebook;
    }
}
