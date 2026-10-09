/** @module components/csv-table */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
// tp-docgen:dependencies:end

import tableStyle from "../../utilities/content-table.css?inline";
import { createContentTable } from "../../utilities/content-table.js";
import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import { TpBase } from "../base/base.js";
import "../callout/callout.js";
import { parseCsv } from "./csv.js";

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
export class TpCsvTable extends TpBase {
	/** Preserves CSV source across rerenders and reconnection. */
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/csv-table", "tp/csv", "tp/txt"],
		textContentFallback: true,
		ignoreSelector: "[data-tp-table-output]",
	});
	/** Scheduled work, delayed until declarative children have arrived. */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** Prevents old asynchronous responses from replacing newer content. */
	private revision = 0;
	/** Cancels an obsolete fetch. */
	private request: AbortController | null = null;
	/** Attributes that update the generated table. */
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "src", "separator", "heading"];
	}
	/** External CSV URL, empty for inline input. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	/** Sets the external source URL. */
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Field separator, defaulting to comma for an absent or empty attribute. */
	public get separator(): string {
		return this.getAttribute("separator") || ",";
	}
	/** Sets the CSV field separator. */
	public set separator(value: string) {
		this.setAttribute("separator", value);
	}
	/** Whether the first row contains column headings. */
	public get heading(): boolean {
		return this.hasAttribute("heading");
	}
	/** Promotes or demotes the first row using boolean presence. */
	public set heading(value: boolean) {
		this.toggleAttribute("heading", value);
	}
	/** Installs shared table layout and observes late author content. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-content-table-styles", tableStyle);
		this.source.observe(() => this.schedule());
		this.schedule();
	}
	/** Cancels pending work without discarding the captured CSV. */
	public disconnectedCallback(): void {
		this.revision++;
		this.request?.abort();
		this.source.disconnect();
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
		this.removeAttribute("aria-busy");
	}
	/** Refreshes connected tables after attribute changes. */
	protected override attributeChangedCallback(): void {
		if (this.isConnected) this.schedule();
	}
	/** Coalesces attribute changes and invalidates older fetches immediately. */
	private schedule(): void {
		this.revision++;
		this.request?.abort();
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.timer = null;
			void this.render();
		}, 0);
	}
	/** Loads and parses CSV, then replaces only the current output. */
	private async render(): Promise<void> {
		const revision = this.revision;
		this.source.capture();
		this.request = new AbortController();
		this.setAttribute("aria-busy", "true");
		try {
			const text = await this.source.read({ signal: this.request.signal });
			if (revision !== this.revision || !this.isConnected) return;
			const rows = parseCsv(
				text,
				this.separator === "\\t" ? "\t" : this.separator,
			);
			if (!rows.length)
				throw new Error(
					"Provide CSV content or a CSV file to display a table.",
				);
			const table = createContentTable(
				rows.map((row) =>
					row.map((cell) => [this.ownerDocument.createTextNode(cell)]),
				),
				this.heading,
				this.ownerDocument,
			);
			table.setAttribute("data-tp-table-output", "");
			this.replaceChildren(table);
		} catch (error: unknown) {
			if (revision !== this.revision || !this.isConnected) return;
			const warning = document.createElement("tp-callout");
			warning.setAttribute("variant", "warning");
			warning.setAttribute("data-tp-table-output", "");
			warning.textContent =
				error instanceof Error
					? error.message
					: "Unable to load the CSV table.";
			this.replaceChildren(warning);
		} finally {
			if (revision === this.revision) this.removeAttribute("aria-busy");
		}
	}
}
if (!customElements.get("tp-csv-table"))
	customElements.define("tp-csv-table", TpCsvTable);
declare global {
	interface HTMLElementTagNameMap {
		"tp-csv-table": TpCsvTable;
	}
}
