/**
 * @tp-dependency tp-notebook
 * @summary Interactive notebook combining markup and executable code cells.
 */
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
 * <tp-prolog-notebook>
 *       <script type="tp/markdown">
 *         # Family relations
 *
 *         Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.
 *       </script>
 *       <script type="tp/prolog" filename="program.pl">
 *         parent(ada, byron).
 *         parent(byron, charles).
 *
 *         grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
 *       </script>
 *       <script type="tp/prolog" filename="query.pl">
 *         grandparent(ada, Grandchild).
 *       </script>
 *   </tp-prolog-notebook>
 */
export declare class TpPrologNotebook extends TpNotebook {
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-prolog-notebook": TpPrologNotebook;
    }
}
