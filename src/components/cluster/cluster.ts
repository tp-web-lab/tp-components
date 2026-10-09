/**
 * @module components/cluster
 * @summary Flexible cluster layout component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./cluster.css?inline";

/**
 * Flexible cluster layout component, without Shadow DOM.
 *
 * @summary Groups child elements in a wrapping flex row with configurable alignment and gap.
 * @tagname tp-cluster
 *
 * @attr {"normal" | "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end" | "baseline" | "first baseline" | "last baseline"} align = "center" - Cross-axis alignment applied to `align-items`.
 * @attr {string} gap = "1rem" - Gap between clustered items. When absent, uses the --tp-cluster-gap CSS default.
 * @attr {"normal" | "start" | "end" | "flex-start" | "flex-end" | "center" | "left" | "right" | "space-between" | "space-around" | "space-evenly" | "stretch"} justify = "flex-start" - Main-axis alignment applied to `justify-content`.
 *
 *
 * @cssprop --tp-cluster-gap Default gap between clustered items.
 * @example
 * <tp-box>
 *   <tp-cluster justify="center" gap="0.5rem">
 *     <tp-button>Alpha</tp-button>
 *     <tp-button>Beta</tp-button>
 *     <tp-button>Gamma</tp-button>
 *   </tp-cluster>
 * </tp-box>
 */
export class TpCluster extends TpBase {
	/**
	 * Identifier of the global stylesheet injected once.
	 */
	private static readonly styleId = "tp-cluster-styles";

	/**
	 * List of observed attributes for the custom element.
	 */
	public static get observedAttributes(): string[] {
		return ["justify", "align", "gap"];
	}

	/**
	 * Explicit main-axis alignment, or an empty string to use the CSS default.
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
	 * Explicit cross-axis alignment, or an empty string to use the CSS default.
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
	 * Explicit gap, or an empty string to use the CSS custom property default.
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
	 * Injects the shared stylesheet and applies reactive styles on connection.
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
	 * Cleans up the cluster instance.
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
	}

	/**
	 * Ensures a single global stylesheet is present in the document.
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpCluster.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpCluster.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	/**
	 * Updates the instance inline styles from the reactive attributes.
	 */
	private updateStyles(): void {
		this.style.justifyContent = this.justify || "flex-start";
		this.style.alignItems = this.align || "center";
		this.style.gap = this.gap || "var(--tp-cluster-gap, 1rem)";
	}
}

if (!customElements.get("tp-cluster")) {
	customElements.define("tp-cluster", TpCluster);
}
