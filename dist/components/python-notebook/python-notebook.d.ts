/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-python-notebook>` element combines written explanations and executable Python code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable Python code in an interactive notebook.
 * @tagname tp-python-notebook
 * @summary Interactive Python notebook with markup and code cells.
 * @example
 * <tp-python-notebook>
 *     <script type="tp/markdown"># Interactive Python
 *
 * Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
 *     <script type="tp/python">print("Hello from Python")</script>
 *   </tp-python-notebook>
 */
export declare class TpPythonNotebook extends TpNotebook {
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-python-notebook": TpPythonNotebook;
    }
}
