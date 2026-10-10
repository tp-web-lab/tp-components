/** @module components/csv-table */
import { TpBase } from "../base/base.js";
import "../callout/callout.js";
/**
 * @summary creates an HTML table from CSV text or a CSV file.
 * @tagname tp-csv-table
 * @attr {string} src = "" - CSV file URL; takes precedence over inline source.
 * @attr {string} separator = "," - One-character field separator; use \t for a tab.
 * @attr {boolean} heading = false - Uses the first row as column headings.
 * @accessibility Uses native table structure and th scope="col" for the optional heading row.
 * @accessibilityresponsibility Provide meaningful column headings and surrounding context for the data.
 * @example
 * <tp-csv-table heading>
 * <script type="tp/csv-table">
 * Country,Capital
 * Estonia,Tallinn
 * Latvia,Riga
 * Lithuania,Vilnius
 * </script>
 * </tp-csv-table>
 */
export declare class TpCsvTable extends TpBase {
    /** Preserves CSV source across rerenders and reconnection. */
    private readonly source;
    /** Scheduled work, delayed until declarative children have arrived. */
    private timer;
    /** Prevents old asynchronous responses from replacing newer content. */
    private revision;
    /** Cancels an obsolete fetch. */
    private request;
    /** Attributes that update the generated table. */
    static get observedAttributes(): string[];
    /** External CSV URL, empty for inline input. */
    get src(): string;
    /** Sets the external source URL. */
    set src(value: string);
    /** Field separator, defaulting to comma for an absent or empty attribute. */
    get separator(): string;
    /** Sets the CSV field separator. */
    set separator(value: string);
    /** Whether the first row contains column headings. */
    get heading(): boolean;
    /** Promotes or demotes the first row using boolean presence. */
    set heading(value: boolean);
    /** Installs shared table layout and observes late author content. */
    protected connectedCallback(): void;
    /** Cancels pending work without discarding the captured CSV. */
    disconnectedCallback(): void;
    /** Refreshes connected tables after attribute changes. */
    protected attributeChangedCallback(): void;
    /** Coalesces attribute changes and invalidates older fetches immediately. */
    private schedule;
    /** Loads and parses CSV, then replaces only the current output. */
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-csv-table": TpCsvTable;
    }
}
