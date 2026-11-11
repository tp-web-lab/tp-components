/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-prolog-notebook>` element combines written explanations and executable Prolog code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable Prolog code in an interactive notebook.
 * @tagname tp-prolog-notebook
 * @summary Interactive Prolog notebook with markup and code cells.
 * @example
 * <tp-prolog-notebook></tp-prolog-notebook>
 */
export declare class TpPrologNotebook extends TpNotebook {
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-prolog-notebook": TpPrologNotebook;
    }
}
