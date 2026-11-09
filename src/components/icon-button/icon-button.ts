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
import type { TpButtonLoadingMode } from "../button/button.js";

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
 * The custom `<tp-icon-button>` element provides an icon action button with an accessible text label.
 *
 * @summary Provides an icon action button with an accessible text label.
 * @tagname tp-icon-button
 * @attr {boolean} outlined = false - Uses an outlined appearance instead of a filled background.
 * @attr {boolean} pill = false - Rounds the button ends to form a pill.
 * @attr {boolean} loading = false - Displays a loading spinner and prevents activation while present.
 * @attr {TpButtonLoadingMode} loading-mode = replace - Spinner layout while loading: replace hides the label; inline keeps the label beside the spinner.
 * @attr {string} href = "" - Destination URL. A nonempty value renders a link instead of a native button.
 * @attr {string} target = "" - Browsing context for href, such as _self, _blank or a named frame; ignored in native button mode.
 * @attr {string} rel = "" - Space-separated relationship tokens forwarded to the link, for example noopener noreferrer; applies only with href.
 * @attr {string} download = "" - Suggested download filename when href is set. A nonempty value requests a download; browser and server rules determine whether it is honored.
 * @attr {string} name = "" - Identifier of the icon displayed inside the button, resolved in library.
 * @attr {string} src = "" - Image or SVG URL forwarded to the icon; takes precedence over name.
 * @attr {string} library = "" - Icon registry used to resolve name, for example tp, components, languages or a custom registered library.
 * @attr {string} label = "" - Accessible button name and hover title. Provide the action, such as Close or Search, because the control has no visible text label.
 * @attr {string} type = "button" - Native button action: button, submit or reset; ignored when href is set.
 * @attr {string} variant = "neutral" - Color variant: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Button and icon size preset: xxs, xs, s, m, l, xl or xxl.
 * @attr {string} color = "" - Color forwarded to the internal `<tp-icon>`.
 * @attr {number} scale = 1 - Scale forwarded to the internal `<tp-icon>`.
 * @attr {string} rotate = "0deg" - Rotation forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-h = false - Horizontal flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-v = false - Vertical flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} spin = false - Continuous spin forwarded to the internal `<tp-icon>`.
 * @attr {boolean} disabled = false - Prevents activation, including link navigation, and marks the control as disabled.
 *
 * @accessibility Uses a native button or link and hides the decorative icon from the accessible name.
 * @accessibilityresponsibility Set `label` to a concise name that describes the action.
 * @keyboard {Enter / Space} Uses native button activation; links activate with Enter.
 * @example
 * <tp-icon-button></tp-icon-button>
 * @cssprop [--tp-icon-button-focus-ring=currentColor] Color of the outline shown when the button receives keyboard focus.
 * @cssprop [--tp-icon-button-hover-background=color-mix( in srgb, currentColor 10%, transparent )] Background color of the button on hover.
 * @cssprop [--tp-icon-button-icon-size=1em] Width and height of the icon inside the button; distinct from the clickable area.
 * @cssprop [--tp-icon-button-radius=999rem] Corner radius of the clickable button.
 * @cssprop [--tp-icon-button-size=1.75em] Minimum width and height of the clickable button; size presets also update this value.
 * @event click Native click event bubbling from the inner button when activated by pointer or keyboard; disabled controls suppress activation. This is not a CustomEvent, so there is no custom detail payload.
 * @eventdetail click void
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
	private buttonEl: HTMLButtonElement | HTMLAnchorElement | null = null;

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
			"outlined",
			"pill",
			"loading",
			"loading-mode",
			"href",
			"target",
			"rel",
			"download",
			"title",
			"name",
			"src",
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
	 * @summary Uses an outlined appearance instead of a filled background.
	 * @attr outlined
	 */
	public get outlined(): boolean {
		return this.getBooleanAttribute("outlined");
	}

	public set outlined(value: boolean) {
		this.setBooleanAttribute("outlined", value);
	}

	/**
	 * @summary Rounds the button ends to form a pill.
	 * @attr pill
	 */
	public get pill(): boolean {
		return this.getBooleanAttribute("pill");
	}

	public set pill(value: boolean) {
		this.setBooleanAttribute("pill", value);
	}

	/**
	 * @summary Displays a loading spinner and prevents activation while present.
	 * @attr loading
	 */
	public get loading(): boolean {
		return this.getBooleanAttribute("loading");
	}

	public set loading(value: boolean) {
		this.setBooleanAttribute("loading", value);
	}

	/**
	 * @summary Spinner layout while loading: replace hides the label; inline keeps the label beside the spinner.
	 * @attr loading-mode
	 * @default replace
	 */
	public get loadingMode(): TpButtonLoadingMode {
		const value = this.getAttribute("loading-mode");
		return value === "replace" || value === "inline" ? value : "replace";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set loadingMode(value: TpButtonLoadingMode) {
		this.setStringAttribute("loading-mode", value);
	}

	/**
	 * @summary Destination URL. A nonempty value renders a link instead of a native button.
	 * @attr href
	 */
	public get href(): string {
		return this.getStringAttribute("href");
	}

	public set href(value: string) {
		this.setStringAttribute("href", value);
	}

	/**
	 * @summary Browsing context for href, such as _self, _blank or a named frame; ignored in native button mode.
	 * @attr target
	 */
	public get target(): string {
		return this.getStringAttribute("target");
	}

	public set target(value: string) {
		this.setStringAttribute("target", value);
	}

	/**
	 * @summary Space-separated relationship tokens forwarded to the link, for example noopener noreferrer; applies only with href.
	 * @attr rel
	 */
	public get rel(): string {
		return this.getStringAttribute("rel");
	}

	public set rel(value: string) {
		this.setStringAttribute("rel", value);
	}

	/**
	 * @summary Suggested download filename when href is set. A nonempty value requests a download; browser and server rules determine whether it is honored.
	 * @attr download
	 */
	public get download(): string {
		return this.getStringAttribute("download");
	}

	public set download(value: string) {
		this.setStringAttribute("download", value);
	}

	/** Image or SVG source displayed by the button. */
	public get src(): string {
		return this.getStringAttribute("src");
	}
	public set src(value: string) {
		this.setStringAttribute("src", value);
	}

	/**
	 * @summary Identifier of the icon displayed inside the button, resolved in library.
	 * @attr name
	 */
	public get name(): string {
		return this.getStringAttribute("name");
	}

	public set name(value: string) {
		this.setStringAttribute("name", value);
	}

	/**
	 * @summary Icon registry used to resolve name, for example tp, components, languages or a custom registered library.
	 * @attr library
	 */
	public get library(): string {
		return this.getStringAttribute("library");
	}

	public set library(value: string) {
		this.setStringAttribute("library", value);
	}

	/**
	 * @summary Accessible button name and hover title. Provide the action, such as Close or Search, because the control has no visible text label.
	 * @attr label
	 */
	public get label(): string {
		return this.getStringAttribute("label");
	}

	public set label(value: string) {
		this.setStringAttribute("label", value);
	}

	/**
	 * @summary Native button action: button, submit or reset; ignored when href is set.
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
	 * @summary Color variant: neutral, brand, success, danger, warning or info.
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
	 * @summary Button and icon size preset: xxs, xs, s, m, l, xl or xxl.
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
	 * @summary Prevents activation, including link navigation, and marks the control as disabled.
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
	 * @summary Moves keyboard focus to the internal native button, when it exists.
	 */
	public override focus(): void {
		this.buttonEl?.focus();
	}

	/**
	 * @summary Ensures the structure internal.
	 * @internal
	 */
	private ensureButton(): void {
		const isLink = this.href !== "";
		let button = this.querySelector<HTMLButtonElement | HTMLAnchorElement>(
			":scope > button, :scope > a",
		);
		if (!button || button.tagName !== (isLink ? "A" : "BUTTON")) {
			const previousIcon = this.iconEl;
			button = isLink
				? document.createElement("a")
				: document.createElement("button");
			button.addEventListener("click", (event) => {
				if (this.disabled || this.loading) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});
			this.replaceChildren(button);
			if (previousIcon) button.append(previousIcon);
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

		const control = this.buttonEl;
		if (!control) return;
		const blocked = this.disabled || this.loading;
		this.setAttribute("loading-mode", this.loadingMode);
		control.setAttribute("aria-disabled", String(blocked));
		control.setAttribute("aria-busy", String(this.loading));
		if (control instanceof HTMLButtonElement) {
			control.type = this.type;
			control.disabled = blocked;
		} else {
			if (blocked) {
				control.removeAttribute("href");
				control.tabIndex = -1;
			} else {
				control.setAttribute("href", this.href);
				control.removeAttribute("tabindex");
			}
			for (const name of ["target", "rel", "download"] as const) {
				if (this[name]) control.setAttribute(name, this[name]);
				else control.removeAttribute(name);
			}
		}

		const accessibleLabel =
			this.label || this.title || this.name || "Icon button";
		control.setAttribute("aria-label", accessibleLabel);
		control.title = accessibleLabel;

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
			forwardString("src", this.src);
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
