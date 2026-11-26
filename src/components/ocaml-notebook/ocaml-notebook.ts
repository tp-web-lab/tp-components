// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-ocaml-notebook>` element combines written explanations and executable OCaml code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable OCaml code in an interactive notebook.
 * @tagname tp-ocaml-notebook
 * @summary Interactive OCaml notebook with markup and code cells.
 * @keyboard {Shift+Enter} Reload changed source and execute the current cell query, or render the current markup cell.
 * @example
 * <tp-ocaml-notebook>
 *   <script type="tp/markdown"># OCaml functions
 *
 * Run all cells in order. The second cell uses the function defined by the first.</script>
 *   <script type="tp/ocaml" filename="functions.ml" query="square 3;;">
 *     let square x = x * x;;
 *   </script>
 *   <script type="tp/markdown">## Use the function
 *
 * This cell uses the definition from the preceding cell.</script>
 *   <script type="tp/ocaml" filename="example.ml" query="square 7;;">
 *   </script>
 * </tp-ocaml-notebook>
 */
export class TpOCamlNotebook extends TpNotebook {
	public override connectedCallback(): void {
		if (!this.hasAttribute("language")) this.setAttribute("language", "ocaml");
		super.connectedCallback();
	}
}
if (!customElements.get("tp-ocaml-notebook"))
	customElements.define("tp-ocaml-notebook", TpOCamlNotebook);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ocaml-notebook": TpOCamlNotebook;
	}
}
