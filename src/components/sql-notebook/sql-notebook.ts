// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

import "../notebook/notebook.js";
import { TpNotebook } from "../notebook/notebook.js";
/**
 * The custom `<tp-sql-notebook>` element combines written explanations and executable SQL code in an interactive notebook.
 *
 * @tp-dependency tp-notebook
 * @summary Combines written explanations and executable SQL code in an interactive notebook.
 * @tagname tp-sql-notebook
 * @summary Interactive SQL notebook with markup and code cells.
 * @example
 * <tp-sql-notebook>
 *     <script type="tp/markdown"># Interactive SQL
 *
 * Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
 *     <script type="tp/sql" filename="tables.sql">CREATE TABLE language (name TEXT);
 * INSERT INTO language VALUES ('SQL');</script>
 *     <script type="tp/sql" filename="query.sql">SELECT * FROM language;</script>
 *   </tp-sql-notebook>
 */
export class TpSqlNotebook extends TpNotebook {
	public override connectedCallback(): void {
		if (!this.hasAttribute("language")) this.setAttribute("language", "sql");
		super.connectedCallback();
	}
}
if (!customElements.get("tp-sql-notebook"))
	customElements.define("tp-sql-notebook", TpSqlNotebook);
declare global {
	interface HTMLElementTagNameMap {
		"tp-sql-notebook": TpSqlNotebook;
	}
}
