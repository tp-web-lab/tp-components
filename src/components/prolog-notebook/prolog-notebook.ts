// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

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
export class TpPrologNotebook extends TpNotebook {
	public override connectedCallback(): void {
		if (!this.hasAttribute("language")) this.setAttribute("language", "prolog");
		super.connectedCallback();
	}
}
if (!customElements.get("tp-prolog-notebook"))
	customElements.define("tp-prolog-notebook", TpPrologNotebook);
declare global {
	interface HTMLElementTagNameMap {
		"tp-prolog-notebook": TpPrologNotebook;
	}
}
