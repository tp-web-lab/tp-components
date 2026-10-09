/**
 * @module components/center
 * @summary Centered content layout component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./center.css?inline";

/**
 * Centered content layout component, without Shadow DOM.
 *
 * The component constrains its own inline size and centers itself in the
 * available horizontal space. It can also center text, add inline gutters, or
 * switch to intrinsic child sizing.
 *
 * @summary Centers content within a configurable maximum inline size.
 * @tagname tp-center
 *
 * @attr {boolean} center-text = false - Centers inline text content with `text-align: center`.
 * @attr {boolean} intrinsic = false - Sizes children intrinsically by centering them in a column flex layout.
 * @attr {string} max-inline-size = "60ch" - Maximum inline size applied to the centered container. When absent, uses the --tp-center-width CSS default.
 * @attr {string} padding-inline = "0px" - Symmetric inline padding applied to the centered container.
 *
 *
 * @cssprop --tp-center-width Default maximum inline size when `max-inline-size` is not set.
 * @example
 * <tp-center intrinsic>
 * <tp-box>Centered content</tp-box>
 * </tp-center>
 */
export class TpCenter extends TpBase {
	/**
	 * Identifier of the global stylesheet injected once for all center instances.
	 *
	 * @summary Global style element identifier.
	 * @internal
	 */
	private static readonly styleId = "tp-center-styles";

	/**
	 * Attributes observed by `<tp-center>`.
	 *
	 * @summary Observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["max-inline-size", "center-text", "padding-inline", "intrinsic"];
	}

	/**
	 * Maximum inline size applied to the centered container.
	 *
	 * @attr max-inline-size
	 */
	public get maxInlineSize(): string {
		return this.getAttribute("max-inline-size") ?? "";
	}

	public set maxInlineSize(value: string) {
		if (value === "") {
			this.removeAttribute("max-inline-size");
			return;
		}

		this.setAttribute("max-inline-size", value);
	}

	/**
	 * Centers inline text content.
	 *
	 * @attr center-text
	 */
	public get centerText(): boolean {
		return this.hasAttribute("center-text");
	}

	public set centerText(value: boolean) {
		if (value) {
			this.setAttribute("center-text", "");
			return;
		}

		this.removeAttribute("center-text");
	}

	/**
	 * Symmetric inline padding applied to the centered container.
	 *
	 * @attr padding-inline
	 */
	public get paddingInline(): string {
		return this.getAttribute("padding-inline") ?? "";
	}

	public set paddingInline(value: string) {
		if (value === "") {
			this.removeAttribute("padding-inline");
			return;
		}

		this.setAttribute("padding-inline", value);
	}

	/**
	 * Centers children with intrinsic sizing in a column flex layout.
	 *
	 * @attr intrinsic
	 */
	public get intrinsic(): boolean {
		return this.hasAttribute("intrinsic");
	}

	public set intrinsic(value: boolean) {
		if (value) {
			this.setAttribute("intrinsic", "");
			return;
		}

		this.removeAttribute("intrinsic");
	}

	/**
	 * Initializes the center instance.
	 *
	 * @summary Connects the center to the document.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.updateStyles();
	}

	/**
	 * Reacts to observed attribute changes.
	 *
	 * @summary Updates inline styles after attribute changes.
	 * @internal
	 */
	protected attributeChangedCallback(): void {
		this.updateStyles();
	}

	/**
	 * Cleans up the center instance.
	 *
	 * @summary Disconnects the center from the document.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
	}

	private ensureStyles(): void {
		if (document.getElementById(TpCenter.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpCenter.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	private updateStyles(): void {
		this.style.maxInlineSize = this.maxInlineSize;
		this.style.textAlign = this.centerText ? "center" : "";

		const paddingInline = this.paddingInline;
		this.style.paddingInlineStart = paddingInline;
		this.style.paddingInlineEnd = paddingInline;
	}
}

if (!customElements.get("tp-center")) {
	customElements.define("tp-center", TpCenter);
}
