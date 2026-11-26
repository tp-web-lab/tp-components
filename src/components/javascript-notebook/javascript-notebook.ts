// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-javascript-notebook>` element combines written explanations and executable JavaScript code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable JavaScript code in an interactive notebook.
 * @tagname tp-javascript-notebook
 * @summary Interactive JavaScript notebook with markup and code cells.
 * @keyboard {Shift+Enter} Reload changed source and execute the current cell query, or render the current markup cell.
 * @example
 * <tp-javascript-notebook>
 *     <script type="tp/markdown"># Interactive JavaScript
 *
 * Select **Run all cells** to execute the program. Edit the program directly in each cell; its query is prefilled.</script>
 *     <script type="tp/javascript" query="message">const message = 'Hello from JavaScript';</script>
 *   </tp-javascript-notebook>
 */
export class TpJavascriptNotebook extends TpNotebook {
	public override connectedCallback(): void {
		if (!this.hasAttribute("language"))
			this.setAttribute("language", "javascript");
		super.connectedCallback();
	}
}
if (!customElements.get("tp-javascript-notebook"))
	customElements.define("tp-javascript-notebook", TpJavascriptNotebook);
declare global {
	interface HTMLElementTagNameMap {
		"tp-javascript-notebook": TpJavascriptNotebook;
	}
}
