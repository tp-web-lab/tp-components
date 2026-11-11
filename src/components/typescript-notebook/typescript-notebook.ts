/**
 * @module components/typescript-notebook
 * @summary Interactive TypeScript notebook component combining markup and executable code cells.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-typescript-notebook>` element combines written explanations and executable TypeScript code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable TypeScript code in an interactive notebook.
 * @tagname tp-typescript-notebook
 * @summary Interactive TypeScript notebook with markup and code cells.
 * @example
 * <tp-typescript-notebook>
 *     <script type="tp/markdown"># Interactive TypeScript
 *
 * Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
 *     <script type="tp/typescript">const language: string = 'TypeScript';
 * console.log(`Hello from ${language}`);</script>
 *   </tp-typescript-notebook>
 */
export class TpTypescriptNotebook extends TpNotebook {
	public override connectedCallback(): void {
		if (!this.hasAttribute("language"))
			this.setAttribute("language", "typescript");
		super.connectedCallback();
	}
}
if (!customElements.get("tp-typescript-notebook"))
	customElements.define("tp-typescript-notebook", TpTypescriptNotebook);
declare global {
	interface HTMLElementTagNameMap {
		"tp-typescript-notebook": TpTypescriptNotebook;
	}
}
