/** @module components/list-table */

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
import {
	type ContentTableRows,
	createContentTable,
} from "../../utilities/content-table.js";
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
export class TpListTable extends TpBase {
	/** Original cell nodes, retained for heading changes without cloning content. */
	private rows: ContentTableRows | null = null;
	/** Batches streaming parser mutations before capturing list structure. */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** Watches author lists until a complete nonempty structure can be captured. */
	private readonly observer = new MutationObserver((records) => {
		if (
			records.some(
				(record) =>
					[...record.addedNodes].some(
						(node) => node instanceof Element && node.matches("ul, ol, li"),
					) ||
					(record.target instanceof Element && record.target.closest("ul, ol")),
			)
		)
			this.schedule();
	});
	/** Attributes that update the generated table. */
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "heading"];
	}
	/** Whether the first row contains column headings. */
	public get heading(): boolean {
		return this.hasAttribute("heading");
	}
	/** Promotes or demotes the first row using boolean presence. */
	public set heading(value: boolean) {
		this.toggleAttribute("heading", value);
	}
	/** Installs shared table layout and waits for author list content. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-content-table-styles", tableStyle);
		if (!this.rows)
			this.observer.observe(this, { childList: true, subtree: true });
		this.schedule();
	}
	/** Stops deferred work and observation while preserving cell nodes. */
	public disconnectedCallback(): void {
		this.observer.disconnect();
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
	}
	/** Updates header semantics without changing author content. */
	protected override attributeChangedCallback(): void {
		if (this.isConnected) this.schedule();
	}
	/** Defers capture until synchronous parser insertions have completed. */
	private schedule(): void {
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.timer = null;
			this.render();
		}, 0);
	}
	/** Converts outer list items to rows and inner list items to cells. */
	private render(): void {
		if (!this.rows) {
			const lists = this.querySelectorAll(":scope > ul, :scope > ol");
			const list = lists[0];
			const items = list
				? [...list.children].filter((node) => node.tagName === "LI")
				: [];
			if (lists.length !== 1 || !items.length) {
				this.warn("Provide one nonempty ul or ol list to display a table.");
				return;
			}
			const rows: ContentTableRows = [];
			for (const item of items) {
				const nested = item.querySelectorAll(":scope > ul, :scope > ol");
				if (
					nested.length > 1 ||
					(nested.length === 1 &&
						[...item.childNodes].some(
							(node) => node !== nested[0] && node.textContent?.trim(),
						))
				) {
					this.warn(
						"Each row must contain only one cell list, or a single cell of content.",
					);
					return;
				}
				const cells = nested[0]
					? [...nested[0].children].filter((node) => node.tagName === "LI")
					: [item];
				if (!cells.length) {
					this.warn("Each table row must contain at least one cell.");
					return;
				}
				rows.push(cells.map((cell) => [...cell.childNodes]));
			}
			this.rows = rows;
			this.observer.disconnect();
		}
		const table = createContentTable(
			this.rows,
			this.heading,
			this.ownerDocument,
		);
		this.replaceChildren(table);
	}
	/** Shows a single warning while keeping invalid author lists available for correction. */
	private warn(message: string): void {
		let warning = this.querySelector(
			":scope > tp-callout[data-tp-table-error]",
		);
		if (!warning) {
			warning = document.createElement("tp-callout");
			warning.setAttribute("data-tp-table-error", "");
			warning.setAttribute("variant", "warning");
			this.append(warning);
		}
		warning.textContent = message;
	}
}
if (!customElements.get("tp-list-table"))
	customElements.define("tp-list-table", TpListTable);
declare global {
	interface HTMLElementTagNameMap {
		"tp-list-table": TpListTable;
	}
}
