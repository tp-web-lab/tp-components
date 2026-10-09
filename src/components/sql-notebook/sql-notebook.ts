// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
// tp-docgen:dependencies:end

import '../notebook/notebook.js';
import { TpNotebook } from '../notebook/notebook.js';
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 * @tagname tp-sql-notebook
 * @summary Interactive SQL notebook with markup and code cells.
 * @example
 * <tp-sql-notebook></tp-sql-notebook>
 */
export class TpSqlNotebook extends TpNotebook {
  public override connectedCallback(): void { if (!this.hasAttribute('language')) this.setAttribute('language', 'sql'); super.connectedCallback(); }
}
if (!customElements.get('tp-sql-notebook')) customElements.define('tp-sql-notebook', TpSqlNotebook);
declare global { interface HTMLElementTagNameMap { 'tp-sql-notebook': TpSqlNotebook } }
