/**
 * Accordion web component built from light-DOM `<dl>` markup, with ARIA semantics
 * and keyboard navigation.
 *
 * @module components/accordion
 * @summary Collapsible multi-panels element.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./accordion.css?inline";

export type TpAccordionAppearance = "default" | "outlined" | "filled";

/**
 * Parses a whitespace-separated list of open item indexes, for example `"0 2 4"`.
 *
 * Invalid values are ignored and the result is de-duplicated/sorted.
 *
 * @param value Raw `open-indexes` attribute value.
 * @returns Normalized ascending list of non-negative integer indexes.
 */
function parseOpenIndexes(value: string | null): number[] {
	if (value === null || value.trim() === "") {
		return [];
	}

	const parsed = value
		.trim()
		.split(/\s+/)
		.map((item) => Number(item))
		.filter((item) => Number.isInteger(item) && item >= 0);

	return [...new Set(parsed)].sort((a, b) => a - b);
}

/**
 * Monotonic counter used to generate stable per-instance IDs.
 */
let instanceCount = 0;

/**
 * Accessible accordion web component based on light-DOM `<dl>` markup.
 *
 * Expected structure:
 *
 * ```html
 * <tp-accordion>
 *   <dl>
 *     <dt>Summary 1</dt>
 *     <dd>Content 1</dd>
 *
 *     <dt>Summary 2</dt>
 *     <dd>Content 2</dd>
 *   </dl>
 * </tp-accordion>
 * ```
 *
 * Mapping rules:
 * - `<dt>` nodes are treated as accordion headers
 * - `<dd>` nodes are treated as accordion panels
 * - headers/panels are paired by index order
 *
 * Reactive attributes:
 * - `multiple`: allows multiple expanded items
 * - `open-indexes`: space-separated list of expanded item indexes
 * - `appearance`: visual treatment (`default`, `outlined`, or `filled`)
 *
 * @tagname tp-accordion
 * @attr {TpAccordionAppearance} appearance = "default" - Visual treatment of accordion items.
 * @cssprop --tp-accordion-content-gap Gap between an accordion heading and its content.
 * @cssprop --tp-accordion-item-gap Gap between consecutive accordion items.
 * @accessibility Connects each header and panel with `aria-controls` and `aria-labelledby`.
 * @accessibility Exposes expanded state with `aria-expanded` and hides collapsed panels.
 * @accessibilityresponsibility Provide concise, unique text for every accordion header.
 * @keyboard {ArrowDown} Moves focus to the next header.
 * @keyboard {ArrowUp} Moves focus to the previous header.
 * @keyboard {Home} Moves focus to the first header.
 * @keyboard {End} Moves focus to the last header.
 * @keyboard {Enter / Space} Expands or collapses the focused section.
 * @example
 * <tp-accordion open-indexes="1">
 *   <dl>
 *     <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
 *     <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
 *     <dt>What is Javascript?</dt><dd>The language used to define the behaviour of web pages.</dd>
 *   </dl>
 * </tp-accordion>
 */
export class TpAccordion extends TpBase {
	/**
	 * Global style element ID injected once in `document.head`.
	 */
	private static readonly accordionStyleId = "tp-accordion-styles";

	/**
	 * Unique ID assigned to this accordion instance.
	 */
	private instanceId = "";

	/**
	 * Source `<dl>` element used as accordion data model.
	 */
	private dlEl: HTMLDListElement | null = null;

	/**
	 * List of observed attributes that trigger rerendering.
	 */
	public static get observedAttributes(): string[] {
		return ["appearance", "multiple", "open-indexes"];
	}

	/**
	 * Visual treatment applied to all accordion items.
	 *
	 * Invalid or missing values resolve to `default`.
	 *
	 * @attr {TpAccordionAppearance} appearance Visual treatment of accordion items.
	 */
	public get appearance(): TpAccordionAppearance {
		const value = this.getAttribute("appearance");
		return value === "outlined" || value === "filled" ? value : "default";
	}

	public set appearance(value: TpAccordionAppearance) {
		if (value === "default") {
			this.removeAttribute("appearance");
			return;
		}

		this.setAttribute("appearance", value);
	}

	/**
	 * Whether multiple sections can stay open simultaneously.
	 *
	 * @attr {boolean} multiple Allows several sections to remain open simultaneously.
	 */
	public get multiple(): boolean {
		return this.hasAttribute("multiple");
	}

	public set multiple(value: boolean) {
		if (value) {
			this.setAttribute("multiple", "");
			return;
		}

		this.removeAttribute("multiple");
	}

	/**
	 * Normalized list of currently open section indexes.
	 *
	 * @attr {string} open-indexes Space-separated, zero-based indexes of the open sections.
	 */
	public get openIndexes(): number[] {
		return parseOpenIndexes(this.getAttribute("open-indexes"));
	}

	public set openIndexes(value: number[]) {
		const normalized = [...new Set(value)]
			.filter((item) => Number.isInteger(item) && item >= 0)
			.sort((a, b) => a - b);

		if (normalized.length === 0) {
			this.removeAttribute("open-indexes");
			return;
		}

		this.setAttribute("open-indexes", normalized.join(" "));
	}

	/**
	 * Initializes the component when connected to the DOM.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpAccordion.accordionStyleId, style);
		this.ensureInstanceId();
		this.ensureDl();
		this.update();
	}

	/**
	 * Reacts to observed attribute changes.
	 */
	protected attributeChangedCallback(): void {
		if (!this.isConnected) {
			return;
		}

		this.ensureDl();
		this.update();
	}

	/**
	 * Opens a section by index.
	 *
	 * In single mode, this replaces the current open section.
	 *
	 * @param index Target section index.
	 */
	public open(index: number): void {
		if (!Number.isInteger(index) || index < 0) {
			return;
		}

		if (this.multiple) {
			this.openIndexes = [...this.openIndexes, index];
			return;
		}

		this.openIndexes = [index];
	}

	/**
	 * Closes a section by index.
	 *
	 * @param index Target section index.
	 */
	public close(index: number): void {
		if (!Number.isInteger(index) || index < 0) {
			return;
		}

		this.openIndexes = this.openIndexes.filter((item) => item !== index);
	}

	/**
	 * Toggles open/closed state for a section by index.
	 *
	 * @param index Target section index.
	 */
	public toggle(index: number): void {
		if (!Number.isInteger(index) || index < 0) {
			return;
		}

		if (this.openIndexes.includes(index)) {
			this.close(index);
			return;
		}

		this.open(index);
	}

	/**
	 * Ensures this instance has a stable unique ID.
	 */
	private ensureInstanceId(): void {
		if (this.instanceId !== "") {
			return;
		}

		instanceCount += 1;
		this.instanceId = `tp-accordion-${String(instanceCount)}`;
		this.setAttribute("data-tp-accordion-id", this.instanceId);
	}

	/**
	 * Finds and stores the first `<dl>` child used as data source.
	 */
	private ensureDl(): void {
		const dl = this.querySelector("dl");

		if (!(dl instanceof HTMLDListElement)) {
			this.dlEl = null;
			return;
		}

		this.dlEl = dl;
		this.dlEl.setAttribute("role", "presentation");
	}

	/**
	 * Returns direct `<dt>` children from the source `<dl>`.
	 *
	 * @returns Header elements in source order.
	 */
	private getSummaries(): HTMLElement[] {
		if (this.dlEl === null) {
			return [];
		}

		return Array.from(this.dlEl.children).filter(
			(element): element is HTMLElement =>
				element instanceof HTMLElement && element.tagName === "DT",
		);
	}

	/**
	 * Returns direct `<dd>` children from the source `<dl>`.
	 *
	 * @returns Panel elements in source order.
	 */
	private getContents(): HTMLElement[] {
		if (this.dlEl === null) {
			return [];
		}

		return Array.from(this.dlEl.children).filter(
			(element): element is HTMLElement =>
				element instanceof HTMLElement && element.tagName === "DD",
		);
	}

	/**
	 * Recomputes ARIA roles, states, IDs, handlers, and panel visibility.
	 */
	private update(): void {
		if (this.dlEl === null) {
			return;
		}

		const summaries = this.getSummaries();
		const contents = this.getContents();
		const openIndexes = this.multiple
			? this.openIndexes
			: this.openIndexes.slice(0, 1);

		for (const [index, summary] of summaries.entries()) {
			const content = contents[index];
			const isOpen = openIndexes.includes(index);

			summary.setAttribute("role", "button");
			summary.setAttribute("tabindex", "0");
			summary.setAttribute("aria-expanded", String(isOpen));

			if (content !== undefined) {
				const summaryId = `${this.instanceId}-summary-${String(index)}`;
				const contentId = `${this.instanceId}-content-${String(index)}`;

				summary.id = summaryId;
				content.id = contentId;

				summary.setAttribute("aria-controls", contentId);
				content.setAttribute("aria-labelledby", summaryId);
				content.hidden = !isOpen;
			}

			summary.onclick = () => {
				this.toggle(index);
			};

			summary.onkeydown = (event) => {
				this.handleKey(event, index, summaries);
			};
		}

		for (const content of contents) {
			content.setAttribute("role", "region");
		}
	}

	/**
	 * Handles keyboard navigation and activation on accordion headers.
	 *
	 * Supported keys:
	 * - ArrowUp / ArrowDown: move focus between headers
	 * - Home / End: jump to first/last header
	 * - Enter / Space: toggle current section
	 *
	 * @param event Keyboard event.
	 * @param index Current header index.
	 * @param summaries Ordered list of header elements.
	 */
	private handleKey(
		event: KeyboardEvent,
		index: number,
		summaries: HTMLElement[],
	): void {
		if (summaries.length === 0) {
			return;
		}

		let next = index;

		if (event.key === "ArrowDown") {
			next = (index + 1) % summaries.length;
		}

		if (event.key === "ArrowUp") {
			next = (index - 1 + summaries.length) % summaries.length;
		}

		if (event.key === "Home") {
			next = 0;
		}

		if (event.key === "End") {
			next = summaries.length - 1;
		}

		if (next !== index) {
			const nextSummary = summaries[next];
			if (nextSummary !== undefined) {
				nextSummary.focus();
			}

			event.preventDefault();
			return;
		}

		if (event.key === "Enter" || event.key === " ") {
			this.toggle(index);
			event.preventDefault();
		}
	}
}

if (!customElements.get("tp-accordion")) {
	customElements.define("tp-accordion", TpAccordion);
}
