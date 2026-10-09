/**
 * @module components/icon-button
 * @summary Accessible icon button component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
// tp-docgen:dependencies:end

import style from "./icon-button.css?inline";

import "../icon/icon.js";

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";

/**
 * @summary API documentation summary.
 */
export type TpIconButtonNativeType = "button" | "submit" | "reset";

/**
 * @summary API documentation summary.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isIconButtonNativeType(
	value: string,
): value is TpIconButtonNativeType {
	return value === "button" || value === "submit" || value === "reset";
}

/**
 * @summary Button icon accessible.
 * @tagname tp-icon-button
 * @attr {string} name = "" - Attribute `name`.
 * @attr {string} library = "" - Attribute `library`.
 * @attr {string} label = "" - Attribute `label`.
 * @attr {string} type = "button" - Attribute `type`.
 * @attr {string} variant = "neutral" - Attribute `variant`.
 * @attr {string} size = "m" - Attribute `size`.
 * @attr {string} color = "" - Color forwarded to the internal `<tp-icon>`.
 * @attr {number} scale = 1 - Scale forwarded to the internal `<tp-icon>`.
 * @attr {string} rotate = "0deg" - Rotation forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-h = false - Horizontal flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-v = false - Vertical flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} spin = false - Continuous spin forwarded to the internal `<tp-icon>`.
 * @attr {boolean} disabled = false - Attribute `disabled`.
 * @event click Event.
 * @cssprop [--tp-icon-button-size=1.75rem] CSS custom property.
 * @cssprop [--tp-icon-button-icon-size=1rem] CSS custom property.
 * @cssprop [--tp-icon-button-radius=999rem] CSS custom property.
 * @cssprop [--tp-icon-button-hover-background=color-mix(in srgb, currentColor 10%, transparent)] CSS custom property.
 * @cssprop [--tp-icon-button-focus-ring=currentColor] CSS custom property.
 * @accessibility Uses a native button and hides the decorative icon from the accessible name.
 * @accessibilityresponsibility Set `label` to a concise name that describes the action.
 * @keyboard {Enter / Space} Uses the browser's native button activation behavior.
 * @example
 * <tp-icon-button></tp-icon-button>
 */
export class TpIconButton extends TpBase {
	/**
	 * @summary Global style ID.
	 * @internal
	 */
	private static readonly iconButtonStyleId = "tp-icon-button-styles";

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private buttonEl: HTMLButtonElement | null = null;

	/**
	 * @summary Reference to `<tp-icon>`.
	 * @internal
	 */
	private iconEl: HTMLElement | null = null;

	/**
	 * @summary Declares reactive attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return [
			"name",
			"library",
			"label",
			"type",
			"variant",
			"size",
			"color",
			"scale",
			"rotate",
			"flip-h",
			"flip-v",
			"spin",
			"disabled",
		];
	}

	/**
	 * @summary API documentation summary.
	 * @attr name
	 */
	public get name(): string {
		return this.getStringAttribute("name");
	}

	public set name(value: string) {
		this.setStringAttribute("name", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr library
	 */
	public get library(): string {
		return this.getStringAttribute("library");
	}

	public set library(value: string) {
		this.setStringAttribute("library", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr label
	 */
	public get label(): string {
		return this.getStringAttribute("label");
	}

	public set label(value: string) {
		this.setStringAttribute("label", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr type
	 * @default button
	 */
	public get type(): TpIconButtonNativeType {
		const value = this.getAttribute("type");
		return value !== null && isIconButtonNativeType(value) ? value : "button";
	}

	public set type(value: TpIconButtonNativeType) {
		this.setStringAttribute("type", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr variant
	 * @default neutral
	 */
	public get variant(): TpVariantType {
		const value = this.getAttribute("variant");
		return value !== null && isTpVariantType(value) ? value : "neutral";
	}

	public set variant(value: TpVariantType) {
		this.setStringAttribute("variant", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr size
	 * @default m
	 */
	public get size(): TpSizeType {
		const value = this.getAttribute("size");
		return value !== null && isTpSizeType(value) ? value : "m";
	}

	public set size(value: TpSizeType) {
		this.setStringAttribute("size", value);
	}

	public get color(): string {
		return this.getStringAttribute("color");
	}

	public set color(value: string) {
		this.setStringAttribute("color", value);
	}

	public get scale(): number {
		const value = Number(this.getAttribute("scale") ?? "1");
		return Number.isFinite(value) && value > 0 ? value : 1;
	}

	public set scale(value: number) {
		this.setStringAttribute("scale", String(value));
	}

	public get rotate(): string {
		return this.getStringAttribute("rotate", "0deg");
	}

	public set rotate(value: string) {
		this.setStringAttribute("rotate", value);
	}

	public get flipH(): boolean {
		return this.getBooleanAttribute("flip-h");
	}

	public set flipH(value: boolean) {
		this.setBooleanAttribute("flip-h", value);
	}

	public get flipV(): boolean {
		return this.getBooleanAttribute("flip-v");
	}

	public set flipV(value: boolean) {
		this.setBooleanAttribute("flip-v", value);
	}

	public get spin(): boolean {
		return this.getBooleanAttribute("spin");
	}

	public set spin(value: boolean) {
		this.setBooleanAttribute("spin", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr disabled
	 */
	public get disabled(): boolean {
		return this.getBooleanAttribute("disabled");
	}

	public set disabled(value: boolean) {
		this.setBooleanAttribute("disabled", value);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpIconButton.iconButtonStyleId, style);
		this.ensureButton();
		this.updateIconButton();
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
		if (oldValue === newValue) {
			return;
		}

		this.ensureButton();
		this.updateIconButton();
	}

	/**
	 * @summary Cleans the component.
	 * @internal
	 */
	public disconnectedCallback(): void {}

	/**
	 * @summary API documentation summary.
	 */
	public override focus(): void {
		this.buttonEl?.focus();
	}

	/**
	 * @summary Ensures the structure internal.
	 * @internal
	 */
	private ensureButton(): void {
		let button = this.querySelector(
			":scope > button",
		) as HTMLButtonElement | null;

		if (!(button instanceof HTMLButtonElement)) {
			button = document.createElement("button");

			while (this.firstChild !== null) {
				this.firstChild.remove();
			}

			this.append(button);
		}

		let icon = button.querySelector(":scope > tp-icon") as HTMLElement | null;

		if (!(icon instanceof HTMLElement)) {
			icon = document.createElement("tp-icon");
			icon.setAttribute("aria-hidden", "true");
			button.append(icon);
		}

		this.buttonEl = button;
		this.iconEl = icon;
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private updateIconButton(): void {
		this.setAttribute("variant", this.variant);
		this.setAttribute("size", this.size);

		if (!(this.buttonEl instanceof HTMLButtonElement)) {
			return;
		}

		this.buttonEl.type = this.type;
		this.buttonEl.disabled = this.disabled;
		this.buttonEl.setAttribute("aria-disabled", String(this.disabled));

		const accessibleLabel = this.label || this.name || "Icon button";
		this.buttonEl.setAttribute("aria-label", accessibleLabel);
		this.buttonEl.title = accessibleLabel;

		if (this.iconEl instanceof HTMLElement) {
			if (this.name === "") {
				this.iconEl.removeAttribute("name");
			} else {
				this.iconEl.setAttribute("name", this.name);
			}

			if (this.library === "") {
				this.iconEl.removeAttribute("library");
			} else {
				this.iconEl.setAttribute("library", this.library);
			}

			const forwardString = (name: string, value: string): void => {
				if (value === "") this.iconEl?.removeAttribute(name);
				else this.iconEl?.setAttribute(name, value);
			};
			forwardString("color", this.color);
			forwardString("scale", String(this.scale));
			forwardString("rotate", this.rotate);
			this.iconEl.toggleAttribute("flip-h", this.flipH);
			this.iconEl.toggleAttribute("flip-v", this.flipV);
			this.iconEl.toggleAttribute("spin", this.spin);
		}
	}
}

if (!customElements.get("tp-icon-button")) {
	customElements.define("tp-icon-button", TpIconButton);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-icon-button": TpIconButton;
	}
}
