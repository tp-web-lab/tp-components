/**
 * @module components/box
 * @summary Simple box layout component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./box.css?inline";

/**
 * Simple box layout component, without Shadow DOM.
 *
 * @summary Wraps content in a configurable bordered box.
 * @tagname tp-box
 *
 * @attr {string} border-width = "1px" - Border width applied to the box. When absent, uses --tp-box-border-width with a 1px fallback.
 * @attr {string} border-radius = "0px" - Border radius applied to the box. When absent, uses --tp-box-border-radius with a 0px fallback.
 * @attr {boolean} invert = false - Uses an inverted surface with contrasting text.
 * @attr {string} padding = "1rem" - Padding applied inside the box. When absent, uses --tp-box-padding with a 1rem fallback.
 *
 *
 * @cssprop --tp-box-background Default box background.
 * @cssprop --tp-box-border-radius Default border radius.
 * @cssprop --tp-box-border-width Default border width.
 * @cssprop --tp-box-color Default box text color.
 * @cssprop --tp-box-padding Default inner padding.
 * @example
 * <tp-box>
 *   The custom HTML element <code>&lt;tp-box&gt;</code> wraps its content in various ways.
 * </tp-box>
 */
export class TpBox extends TpBase {
	/**
	 * Identifier of the global stylesheet injected once.
	 */
	private static readonly styleId = "tp-box-styles";

	/**
	 * List of observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["padding", "border-width", "border-radius", "invert"];
	}

	/**
	 * Value of the `padding` attribute.
	 *
	 * Returns an empty string if absent; CSS supplies --tp-box-padding (1rem by default).
	 */
	public get padding(): string {
		return this.getAttribute("padding") ?? "";
	}

	public set padding(value: string) {
		if (value === "") {
			this.removeAttribute("padding");
			return;
		}

		this.setAttribute("padding", value);
	}

	/**
	 * Value of the `border-width` attribute.
	 *
	 * Returns an empty string if absent; CSS supplies --tp-box-border-width (1px by default).
	 */
	public get borderWidth(): string {
		return this.getAttribute("border-width") ?? "";
	}

	public set borderWidth(value: string) {
		if (value === "") {
			this.removeAttribute("border-width");
			return;
		}

		this.setAttribute("border-width", value);
	}

	/**
	 * Value of the `border-radius` attribute.
	 *
	 * Returns an empty string if absent; CSS supplies --tp-box-border-radius (0px by default).
	 */
	public get borderRadius(): string {
		return this.getAttribute("border-radius") ?? "";
	}

	public set borderRadius(value: string) {
		if (value === "") {
			this.removeAttribute("border-radius");
			return;
		}

		this.setAttribute("border-radius", value);
	}

	/**
	 * Indicates whether the box uses an inverted surface.
	 */
	public get invert(): boolean {
		return this.hasAttribute("invert");
	}

	public set invert(value: boolean) {
		if (value) {
			this.setAttribute("invert", "");
			return;
		}

		this.removeAttribute("invert");
	}

	/**
	 * Injects the global styles and applies the reactive styles
	 * when the element is connected to the document.
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
	 * Injects the global stylesheet once.
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpBox.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpBox.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	/**
	 * Updates the instance CSS variables.
	 *
	 * If an attribute is absent, the corresponding CSS variable is removed
	 * so the default value defined in the stylesheet can apply.
	 */
	private updateStyles(): void {
		if (this.padding === "") {
			this.style.removeProperty("--tp-box-padding");
		} else {
			this.style.setProperty("--tp-box-padding", this.padding);
		}

		if (this.borderWidth === "") {
			this.style.removeProperty("--tp-box-border-width");
		} else {
			this.style.setProperty("--tp-box-border-width", this.borderWidth);
		}

		if (this.borderRadius === "") {
			this.style.removeProperty("--tp-box-border-radius");
		} else {
			this.style.setProperty("--tp-box-border-radius", this.borderRadius);
		}
	}
}

if (!customElements.get("tp-box")) {
	customElements.define("tp-box", TpBox);
}
