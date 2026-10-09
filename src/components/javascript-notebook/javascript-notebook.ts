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
 * @tagname tp-javascript-notebook
 * @summary Interactive JavaScript notebook with markup and code cells.
 * @example
 * <tp-javascript-notebook></tp-javascript-notebook>
 */
export class TpJavascriptNotebook extends TpNotebook {
  public override connectedCallback(): void { if (!this.hasAttribute('language')) this.setAttribute('language', 'javascript'); super.connectedCallback(); }
}
if (!customElements.get('tp-javascript-notebook')) customElements.define('tp-javascript-notebook', TpJavascriptNotebook);
declare global { interface HTMLElementTagNameMap { 'tp-javascript-notebook': TpJavascriptNotebook } }
