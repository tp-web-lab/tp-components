/**
 * @module components/grid
 * @summary Responsive grid layout component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./grid.css?inline";

/**
 * Checks whether a value looks like a simple CSS length.
 *
 * Accepté :
 * - px, rem, em, %, ch, vw, vh…
 * - fonctions CSS simples (min, max, clamp…)
 */
function isCssLength(value: string): boolean {
	const trimmed = value.trim();

	if (trimmed === "") {
		return false;
	}

	if (/^(min|max|clamp)\(/.test(trimmed)) {
		return true;
	}

	return /^-?\d*\.?\d+(px|rem|em|%|ch|vw|vh|vmin|vmax)$/.test(trimmed);
}

/**
 * Responsive grid layout component, without Shadow DOM.
 *
 * @summary Creates an auto-fit responsive grid with configurable minimum column width and gap.
 * @tagname tp-grid
 *
 * @attr {string} gap = "1rem" - Gap between grid cells. When absent, uses the --tp-grid-gap CSS default.
 * @attr {string} min-width = "250px" - Minimum column width used by the responsive grid template, limited to the available container width. When absent, uses the --tp-grid-min-width CSS default.
 *
 *
 * @cssprop --tp-grid-gap Default gap between grid cells.
 * @cssprop --tp-grid-min-width Default minimum column width.
 * @example
 * <tp-grid></tp-grid>
 */
export class TpGrid extends TpBase {
	private static readonly styleId = "tp-grid-styles";

	public static get observedAttributes(): string[] {
		return ["min-width", "gap"];
	}

	/**
	 * Minimum column width.
	 */
	public get minWidth(): string {
		const value = this.getAttribute("min-width") ?? "";
		return isCssLength(value) ? value : "";
	}

	public set minWidth(value: string) {
		if (value === "") {
			this.removeAttribute("min-width");
			return;
		}

		if (!isCssLength(value)) {
			throw new TypeError(
				'The "min-width" attribute must be a valid CSS length like "250px", "20rem" or "50%".',
			);
		}

		this.setAttribute("min-width", value);
	}

	/**
	 * Gap between cells.
	 */
	public get gap(): string {
		return this.getAttribute("gap") ?? "";
	}

	public set gap(value: string) {
		if (value === "") {
			this.removeAttribute("gap");
			return;
		}

		this.setAttribute("gap", value);
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.updateStyles();
	}

	protected attributeChangedCallback(): void {
		this.updateStyles();
	}

	public disconnectedCallback(): void {
		super.connectedCallback();
	}

	private ensureStyles(): void {
		if (document.getElementById(TpGrid.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpGrid.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	private updateStyles(): void {
		if (this.minWidth === "") {
			this.style.removeProperty("--tp-grid-min-width");
		} else {
			this.style.setProperty("--tp-grid-min-width", this.minWidth);
		}

		if (this.gap === "") {
			this.style.removeProperty("--tp-grid-gap");
		} else {
			this.style.setProperty("--tp-grid-gap", this.gap);
		}
	}
}

if (!customElements.get("tp-grid")) {
	customElements.define("tp-grid", TpGrid);
}
