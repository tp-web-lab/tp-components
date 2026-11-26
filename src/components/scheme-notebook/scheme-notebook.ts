// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-scheme-notebook>` element combines written explanations and executable Scheme code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable Scheme code in an interactive notebook.
 * @tagname tp-scheme-notebook
 * @summary Interactive Scheme notebook with markup and code cells.
 * @keyboard {Shift+Enter} Reload changed source and execute the current cell query, or render the current markup cell.
 * @example
 * <tp-scheme-notebook>
 *   <script type="tp/markdown"># Scheme functions
 *
 * Run all cells in order. The second cell uses the function defined by the first.</script>
 *   <script type="tp/scheme" filename="functions.scm" query="(square 3)">
 *     (define (square x) (* x x))
 *   </script>
 *   <script type="tp/markdown">## Use the function
 *
 * This cell uses the definition from the preceding cell.</script>
 *   <script type="tp/scheme" filename="example.scm" query="(square 7)">
 *   </script>
 * </tp-scheme-notebook>
 */
export class TpSchemeNotebook extends TpNotebook {
	public override connectedCallback(): void {
		if (!this.hasAttribute("language")) this.setAttribute("language", "scheme");
		super.connectedCallback();
	}
}
if (!customElements.get("tp-scheme-notebook"))
	customElements.define("tp-scheme-notebook", TpSchemeNotebook);
declare global {
	interface HTMLElementTagNameMap {
		"tp-scheme-notebook": TpSchemeNotebook;
	}
}
