// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

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
export class TpPythonNotebook extends TpNotebook {
	public override connectedCallback(): void {
		if (!this.hasAttribute("language")) this.setAttribute("language", "python");
		super.connectedCallback();
	}
}
if (!customElements.get("tp-python-notebook"))
	customElements.define("tp-python-notebook", TpPythonNotebook);
declare global {
	interface HTMLElementTagNameMap {
		"tp-python-notebook": TpPythonNotebook;
	}
}
