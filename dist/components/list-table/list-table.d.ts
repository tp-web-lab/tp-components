/** @module components/list-table */
import { TpBase } from "../base/base.js";
import "../callout/callout.js";
/**
 * @summary creates an HTML table from ordered or unordered lists while preserving cell content.
 * @tagname tp-list-table
 * @attr {boolean} heading = false - Uses the first row as column headings.
 * @accessibility Uses native table structure and th scope="col" for the optional heading row; embedded controls keep their own interactions.
 * @accessibilityresponsibility Provide meaningful column headings and accessible names for rich cell content.
 * @example
 * <tp-list-table heading>
 *   <ul>
 *     <li><ul><li>Country</li><li>Capital</li></ul></li>
 *     <li><ul><li>Estonia</li><li>Tallinn</li></ul></li>
 *     <li><ul><li>Latvia</li><li>Riga</li></ul></li>
 *     <li><ul><li>Lithuania</li><li>Vilnius</li></ul></li>
 *   </ul>
 * </tp-list-table>
 */
export declare class TpListTable extends TpBase {
    /** Original cell nodes, retained for heading changes without cloning content. */
    private rows;
    /** Batches streaming parser mutations before capturing list structure. */
    private timer;
    /** Watches author lists until a complete nonempty structure can be captured. */
    private readonly observer;
    /** Attributes that update the generated table. */
    static get observedAttributes(): string[];
    /** Whether the first row contains column headings. */
    get heading(): boolean;
    /** Promotes or demotes the first row using boolean presence. */
    set heading(value: boolean);
    /** Installs shared table layout and waits for author list content. */
    protected connectedCallback(): void;
    /** Stops deferred work and observation while preserving cell nodes. */
    disconnectedCallback(): void;
    /** Updates header semantics without changing author content. */
    protected attributeChangedCallback(): void;
    /** Defers capture until synchronous parser insertions have completed. */
    private schedule;
    /** Converts outer list items to rows and inner list items to cells. */
    private render;
    /** Shows a single warning while keeping invalid author lists available for correction. */
    private warn;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-list-table": TpListTable;
    }
}
