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
 * @tagname tp-python-notebook
 * @summary Interactive Python notebook with markup and code cells.
 * @example
 * <tp-python-notebook></tp-python-notebook>
 */
export class TpPythonNotebook extends TpNotebook {
  public override connectedCallback(): void { if (!this.hasAttribute('language')) this.setAttribute('language', 'python'); super.connectedCallback(); }
}
if (!customElements.get('tp-python-notebook')) customElements.define('tp-python-notebook', TpPythonNotebook);
declare global { interface HTMLElementTagNameMap { 'tp-python-notebook': TpPythonNotebook } }
