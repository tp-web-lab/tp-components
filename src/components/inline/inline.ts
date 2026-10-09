/**
 * @module components/inline
 * @summary Inline flex layout component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./inline.css?inline";

/**
 * `<tp-inline>` aligne ses enfants sur une seule ligne, sans retour à la ligne,
 * sans utiliser de Shadow DOM.
 *
 * Base styles:
 * - `display: flex`
 * - `flex-wrap: nowrap`
 * - `gap: var(--tp-inline-gap, 0.5rem)`
 * - `justify-content: flex-start`
 * - `align-items: center`
 *
 * Reactive attributes:
 * - `gap` : espace entre les enfants
 * - `justify` : valeur de `justify-content`
 * - `align` : valeur de `align-items`
 * - `stretch` : permet aux enfants de s'étirer (`flex: 1 1 0`)
 * @tagname tp-inline
 * @attr {"normal" | "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end" | "baseline" | "first baseline" | "last baseline"} align = "center" - Cross-axis alignment applied to align-items.
 * @attr {string} gap = "0.5rem" - Gap between children. When absent, uses the --tp-inline-gap CSS default.
 * @attr {"normal" | "start" | "end" | "flex-start" | "flex-end" | "center" | "left" | "right" | "space-between" | "space-around" | "space-evenly" | "stretch"} justify = "flex-start" - Main-axis alignment applied to justify-content.
 * @example
 * <tp-inline></tp-inline>
 */
export class TpInline extends TpBase {
	/**
	 * Identifier of the global stylesheet injected once.
	 */
	private static readonly styleId = "tp-inline-styles";

	/**
	 * List of observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["gap", "justify", "align", "stretch"];
	}

	/**
	 * Value of the `gap` attribute.
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

	/**
	 * Value of the `justify` attribute.
	 */
	public get justify(): string {
		return this.getAttribute("justify") ?? "";
	}

	public set justify(value: string) {
		if (value === "") {
			this.removeAttribute("justify");
			return;
		}

		this.setAttribute("justify", value);
	}

	/**
	 * Value of the `align` attribute.
	 */
	public get align(): string {
		return this.getAttribute("align") ?? "";
	}

	public set align(value: string) {
		if (value === "") {
			this.removeAttribute("align");
			return;
		}

		this.setAttribute("align", value);
	}

	/**
	 * Indicates whether children can stretch.
	 */
	public get stretch(): boolean {
		return this.hasAttribute("stretch");
	}

	public set stretch(value: boolean) {
		if (value) {
			this.setAttribute("stretch", "");
			return;
		}

		this.removeAttribute("stretch");
	}

	/**
	 * Initializes the component.
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.updateStyles();
	}

	/**
	 * Reacts to changes in the observed attributes.
	 */
	protected attributeChangedCallback(): void {
		this.updateStyles();
	}

	/**
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
	}

	/**
	 * Injects the global stylesheet once.
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpInline.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpInline.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	/**
	 * Updates the instance inline styles.
	 */
	private updateStyles(): void {
		if (this.gap === "") {
			this.style.removeProperty("--tp-inline-gap");
		} else {
			this.style.setProperty("--tp-inline-gap", this.gap);
		}

		this.style.justifyContent = this.justify || "flex-start";
		this.style.alignItems = this.align || "center";
	}
}

if (!customElements.get("tp-inline")) {
	customElements.define("tp-inline", TpInline);
}
