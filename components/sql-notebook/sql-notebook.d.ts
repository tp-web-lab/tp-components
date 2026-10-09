/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
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
export declare class TpSqlNotebook extends TpNotebook {
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-sql-notebook': TpSqlNotebook;
    }
}
