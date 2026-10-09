/**
 * @module components/badge
 * @summary Badge component for compact status labels.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";
import style from "./badge.css?inline";

/**
 * @summary Compact status label.
 * Colors are derived from the shared `tp.css` semantic tokens.
 * @tagname tp-badge
 * @attr {string} variant = "neutral" - Visual variant (`success`, `danger`, `warning`, `info`, `neutral`, or `brand`).
 * @attr {string} size = "m" - Badge size (`xxs`, `xs`, `s`, `m`, `l`, `xl`, or `xxl`).
 * @attr {boolean} outlined = false - Removes the filled background and uses the accent color for the border and text.
 * @attr {boolean} pill = false - Uses a fully rounded badge shape.
 * @attr {boolean} pulse = false - Makes the badge pulse to attract attention.
 * @cssprop --tp-badge-accent Accent color.
 * @cssprop --tp-badge-background Background color.
 * @cssprop --tp-badge-foreground Text color.
 * @cssprop --tp-badge-border-color Border color.
 * @cssprop --tp-badge-radius Border radius.
 * @cssprop --tp-badge-font-size Font size.
 * @cssprop --tp-badge-padding-block Block padding.
 * @cssprop --tp-badge-padding-inline Inline padding.
 * @example
 * <p>
 *   Build status: <tp-badge variant="success" pulse>Ready</tp-badge>
 *   <tp-badge outlined><tp-icon name="file_type_vite" library="languages"></tp-icon> Vite<tp-divider orientation="vertical"></tp-divider>8.1.5</tp-badge>
 * </p>
 */
export class TpBadge extends TpBase {
	/**
	 * @summary Component global style ID.
	 * @internal
	 */
	private static readonly badgeStyleId = "tp-badge-styles";

	/**
	 * @summary Declares observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["variant", "size", "outlined", "pill", "pulse"];
	}

	/**
	 * @summary Visual variant.
	 * @attr variant
	 * @default neutral
	 */
	public get variant(): TpVariantType {
		const value = this.getAttribute("variant");
		return value !== null && isTpVariantType(value) ? value : "neutral";
	}

	/**
	 * @summary Sets the visual variant.
	 * @param value Visual variant.
	 */
	public set variant(value: TpVariantType) {
		this.setStringAttribute("variant", value);
	}

	/**
	 * @summary Badge size.
	 * @attr size
	 * @default m
	 */
	public get size(): TpSizeType {
		const value = this.getAttribute("size");
		return value !== null && isTpSizeType(value) ? value : "m";
	}

	/**
	 * @summary Sets the badge size.
	 * @param value Badge size.
	 */
	public set size(value: TpSizeType) {
		this.setStringAttribute("size", value);
	}

	/**
	 * @summary Whether the badge is outlined.
	 * @attr outlined
	 * @default false
	 */
	public get outlined(): boolean {
		return this.getBooleanAttribute("outlined");
	}

	/**
	 * @summary Sets the outlined state.
	 * @param value Outlined state.
	 */
	public set outlined(value: boolean) {
		this.setBooleanAttribute("outlined", value);
	}

	/**
	 * @summary Whether the badge uses a pill shape.
	 * @attr pill
	 * @default false
	 */
	public get pill(): boolean {
		return this.getBooleanAttribute("pill");
	}

	/**
	 * @summary Sets the pill shape.
	 * @param value Pill state.
	 */
	public set pill(value: boolean) {
		this.setBooleanAttribute("pill", value);
	}

	/**
	 * @summary Whether the badge pulses to attract attention.
	 * @attr pulse
	 * @default false
	 */
	public get pulse(): boolean {
		return this.getBooleanAttribute("pulse");
	}

	/**
	 * @summary Sets the pulse animation state.
	 * @param value Pulse state.
	 */
	public set pulse(value: boolean) {
		this.setBooleanAttribute("pulse", value);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpBadge.badgeStyleId, style);
		this.updateBadge();
	}

	/**
	 * @summary API documentation summary.
	 * @param _name Parameter.
	 * @param oldValue Parameter.
	 * @param newValue Parameter.
	 * @internal
	 */
	protected attributeChangedCallback(
		_name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue !== newValue) {
			this.updateBadge();
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private updateBadge(): void {
		this.setAttribute("variant", this.variant);
		this.setAttribute("size", this.size);
	}
}

if (!customElements.get("tp-badge")) {
	customElements.define("tp-badge", TpBadge);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-badge": TpBadge;
	}
}
