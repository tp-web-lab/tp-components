/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-javascript-notebook>` element combines written explanations and executable JavaScript code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable JavaScript code in an interactive notebook.
 * @tagname tp-javascript-notebook
 * @summary Interactive JavaScript notebook with markup and code cells.
 * @example
 * <tp-javascript-notebook>
 *     <script type="tp/markdown"># Interactive JavaScript
 *
 * Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
 *     <script type="tp/javascript">console.log('Hello from JavaScript');</script>
 *   </tp-javascript-notebook>
 */
export declare class TpJavascriptNotebook extends TpNotebook {
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-javascript-notebook": TpJavascriptNotebook;
    }
}
