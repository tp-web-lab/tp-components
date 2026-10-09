/**
 * @module components/typescript-notebook
 * @summary Interactive TypeScript notebook component combining markup and executable code cells.
 */

import '../notebook/notebook.js';
import { TpNotebook } from '../notebook/notebook.js';
/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 * @tagname tp-typescript-notebook
 * @summary Interactive TypeScript notebook with markup and code cells.
 * @example
 * <tp-typescript-notebook></tp-typescript-notebook>
 */
export class TpTypescriptNotebook extends TpNotebook {
  public override connectedCallback(): void { if (!this.hasAttribute('language')) this.setAttribute('language', 'typescript'); super.connectedCallback(); }
}
if (!customElements.get('tp-typescript-notebook')) customElements.define('tp-typescript-notebook', TpTypescriptNotebook);
declare global { interface HTMLElementTagNameMap { 'tp-typescript-notebook': TpTypescriptNotebook } }
