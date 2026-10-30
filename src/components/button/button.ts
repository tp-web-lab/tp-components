/**
 * @module components/button
 * @summary Button component that supports native button and link rendering.
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
import style from "./button.css?inline";

/**
 * @summary API documentation summary.
 */
export type TpButtonNativeType = "button" | "submit" | "reset";

/**
 * @summary API documentation summary.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isButtonNativeType(value: string): value is TpButtonNativeType {
	return value === "button" || value === "submit" || value === "reset";
}

/**
 * @summary API documentation summary.
 */
export type TpButtonLoadingMode = "replace" | "inline";

/**
 * @summary Checks a mode for loading.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isButtonLoadingMode(value: string): value is TpButtonLoadingMode {
	return value === "replace" || value === "inline";
}

/**
 * @summary Escapes a value for use in an HTML attribute.
 * @param value Raw attribute value.
 * @returns Escaped attribute value.
 * @internal
 */
function escapeButtonAttribute(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

/**
 * @summary an action button or navigation link with shared sizes, variants and loading states.
 * @tagname tp-button
 * @attr {TpButtonLoadingMode} loading-mode = replace - Spinner layout while loading: replace hides the label; inline keeps the label beside the spinner.
 * @attr {string} variant = "neutral" - Color variant: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Button size preset: xxs, xs, s, m, l, xl or xxl; controls text size and padding.
 * @attr {string} type = "button" - Native button action: button, submit or reset; ignored when href makes the control a link.
 * @attr {boolean} outlined = false - Uses an outlined appearance instead of a filled background.
 * @attr {boolean} pill = false - Rounds the button ends to form a pill.
 * @attr {boolean} disabled = false - Prevents activation, including link navigation, and marks the control as disabled.
 * @attr {boolean} loading = false - Displays a loading spinner and prevents activation while present.
 * @attr {string} href = "" - Destination URL. A nonempty value renders a link instead of a native button.
 * @attr {string} target = "" - Browsing context for href, such as _self, _blank or a named frame; ignored in native button mode.
 * @attr {string} rel = "" - Space-separated relationship tokens forwarded to the link, for example noopener noreferrer; applies only with href.
 * @attr {string} download = "" - Suggested download filename when href is set. A nonempty value requests a download; browser and server rules determine whether it is honored.

 * @accessibility Uses a native `button` or `a` element according to the configured action.
 * @accessibility Exposes disabled and loading states to assistive technology.
 * @accessibilityresponsibility Provide visible text that describes the action or destination.
 * @keyboard {Enter / Space} Uses the browser's native button activation behavior.
 * @example
 * <tp-button href="/#/components/button/index.md#usage">Read the usage guide</tp-button>
 * @cssprop [--tp-button-accent=var(--tp-neutral-text-colorful)] Accent color used for outlined text and borders, and for the hover border; depends on variant.
 * @cssprop [--tp-button-background=var(--tp-neutral-fill-loud)] Background color of the button or link; variant and outlined can change it.
 * @cssprop [--tp-button-border-color=var(--tp-neutral-stroke-mid)] Border color of the button or link in its resting state.
 * @cssprop [--tp-button-focus-ring-color=var(--tp-focus-color)] Color of the outer ring shown on keyboard focus and hover.
 * @cssprop [--tp-button-font-size=0.875em] Font size of the button label; size presets also update this value.
 * @cssprop [--tp-button-foreground=var(--tp-neutral-text-on-loud)] Text and icon color of the button or link.
 * @cssprop [--tp-button-outline-background=var(--tp-neutral-fill-softer)] Background color of an enabled outlined button on hover.
 * @cssprop [--tp-button-padding-block=0.35em] Inner spacing above and below the button content.
 * @cssprop [--tp-button-padding-inline=0.7em] Inner spacing before and after the button content.
 * @cssprop [--tp-button-radius=0.5em] Corner radius of the button or link; pill uses a fully rounded radius.
 * @cssprop [--tp-button-spinner-border-width=2px] Stroke thickness of the circular loading indicator.
 * @cssprop [--tp-button-spinner-size=1em] Width and height of the circular loading indicator.
 * @event click Native click event bubbling from the inner button or link when activated by pointer or keyboard; disabled controls suppress activation. This is not a CustomEvent, so there is no custom detail payload.
 * @eventdetail click void
 */
export class TpButton extends TpBase {
	/**
	 * @summary Global style ID.
	 * @internal
	 */
	private static readonly buttonStyleId = "tp-button-styles";

	/**
	 * @summary Reference to the element interactif internal.
	 * @internal
	 */
	private controlEl: HTMLButtonElement | HTMLAnchorElement | null = null;

	/**
	 * @summary Reference to the content container.
	 * @internal
	 */
	private contentEl: HTMLSpanElement | null = null;

	/**
	 * @summary Observes late children added while the HTML parser is still running.
	 * @internal
	 */
	private childObserver: MutationObserver | null = null;

	/**
	 * @summary Prevents observer feedback while moving nodes into the internal control.
	 * @internal
	 */
	private isSyncingLightDomContent = false;

	/**
	 * @summary Reference to the indicateur for loading.
	 * @internal
	 */
	// private spinnerEl: HTMLSpanElement | null = null;

	/**
	 * @summary Declares observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return [
			"variant",
			"size",
			"type",
			"outlined",
			"pill",
			"disabled",
			"loading",
			"loading-mode",
			"href",
			"target",
			"rel",
			"download",
		];
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
	 * @summary Button size preset: xxs, xs, s, m, l, xl or xxl; controls text size and padding.
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

	/**
	 * @summary Native button action: button, submit or reset; ignored when href makes the control a link.
	 * @attr type
	 * @default button
	 */
	public get type(): TpButtonNativeType {
		const value = this.getAttribute("type");
		return value !== null && isButtonNativeType(value) ? value : "button";
	}

	public set type(value: TpButtonNativeType) {
		this.setStringAttribute("type", value);
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
		return value !== null && isButtonLoadingMode(value) ? value : "replace";
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

	/**
	 * @summary API documentation summary.
	 * @returns Return value.
	 * @internal
	 */
	private get isLink(): boolean {
		return this.href !== "";
	}

	/**
	 * @summary Regroup `disabled` and `loading`.
	 * @returns Return value.
	 * @internal
	 */
	private get isBlocked(): boolean {
		return this.disabled || this.loading;
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpButton.buttonStyleId, style);
		this.observeLightDomContent();
		queueMicrotask(() => {
			if (!this.isConnected) {
				return;
			}

			this.ensureControl();
			this.updateButton();
			this.syncLightDomContent();
			this.updateHelpSource();
		});
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
		if (this.isConnected && oldValue !== newValue) {
			this.ensureControl();
			this.updateButton();
			this.syncLightDomContent();
			this.updateHelpSource();
		}
	}

	/**
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.childObserver?.disconnect();
		this.childObserver = null;
	}

	/**
	 * @summary Observes direct children added after the internal control has been created.
	 * @internal
	 */
	private observeLightDomContent(): void {
		if (
			this.childObserver !== null ||
			typeof MutationObserver === "undefined"
		) {
			return;
		}

		this.childObserver = new MutationObserver(() => {
			if (this.isSyncingLightDomContent) {
				return;
			}

			this.syncLightDomContent();
		});

		this.childObserver.observe(this, { childList: true });
	}

	/**
	 * @summary Moves late content into the rendered native control.
	 * @internal
	 */
	private syncLightDomContent(): void {
		if (
			this.controlEl === null ||
			this.contentEl === null ||
			this.isSyncingLightDomContent
		) {
			return;
		}

		const lateContent = Array.from(this.childNodes).filter(
			(node) => node !== this.controlEl,
		);

		if (lateContent.length === 0) {
			return;
		}

		this.isSyncingLightDomContent = true;

		for (const node of lateContent) {
			this.contentEl.append(node);
		}

		this.isSyncingLightDomContent = false;
		this.updateHelpSource();
	}

	/**
	 * @summary Updates the user-facing source used by help and HTML viewer.
	 * @internal
	 */
	private updateHelpSource(): void {
		if (this.contentEl === null) {
			return;
		}

		const attributes = Array.from(this.attributes).flatMap((attribute) => {
			if (
				attribute.name === "data-source" ||
				attribute.name === "data-tp-base-host" ||
				(attribute.name === "variant" && attribute.value === "neutral") ||
				(attribute.name === "size" && attribute.value === "m") ||
				(attribute.name === "loading-mode" && attribute.value === "replace")
			) {
				return [];
			}
			return [
				attribute.value === ""
					? attribute.name
					: `${attribute.name}="${escapeButtonAttribute(attribute.value)}"`,
			];
		});
		const openTag = ["tp-button", ...attributes].join(" ");
		const content = this.contentEl.innerHTML.trim();
		this.setAttribute("data-source", `<${openTag}>${content}</tp-button>`);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureControl(): void {
		const expectedTagName = this.isLink ? "A" : "BUTTON";
		const existing = this.querySelector(":scope > a, :scope > button");

		if (
			existing instanceof HTMLElement &&
			existing.tagName === expectedTagName
		) {
			if (
				existing instanceof HTMLAnchorElement ||
				existing instanceof HTMLButtonElement
			) {
				this.controlEl = existing;
				this.ensureInnerStructure();
				return;
			}
		}

		const nextControl = this.isLink
			? document.createElement("a")
			: document.createElement("button");

		this.replaceControl(nextControl);
	}

	/**
	 * @summary Replaces the element interactif internal.
	 * @param nextControl Parameter.
	 * @internal
	 */
	private replaceControl(
		nextControl: HTMLButtonElement | HTMLAnchorElement,
	): void {
		const fragment = document.createDocumentFragment();
		const previousControl = this.querySelector(":scope > a, :scope > button");

		if (
			previousControl instanceof HTMLAnchorElement ||
			previousControl instanceof HTMLButtonElement
		) {
			const previousContent = previousControl.querySelector(
				":scope > [data-tp-button-content]",
			);

			if (previousContent instanceof HTMLElement) {
				while (previousContent.firstChild !== null) {
					fragment.append(previousContent.firstChild);
				}
			} else {
				while (previousControl.firstChild !== null) {
					fragment.append(previousControl.firstChild);
				}
			}

			previousControl.remove();
		} else {
			while (this.firstChild !== null) {
				fragment.append(this.firstChild);
			}
		}

		this.append(nextControl);
		this.controlEl = nextControl;
		this.ensureInnerStructure();

		if (this.contentEl !== null) {
			this.contentEl.replaceChildren(fragment);
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureInnerStructure(): void {
		if (
			!(this.controlEl instanceof HTMLButtonElement) &&
			!(this.controlEl instanceof HTMLAnchorElement)
		) {
			return;
		}

		let spinner = this.controlEl.querySelector<HTMLSpanElement>(
			":scope > [data-tp-button-spinner]",
		);

		let content = this.controlEl.querySelector<HTMLSpanElement>(
			":scope > [data-tp-button-content]",
		);

		if (!(spinner instanceof HTMLSpanElement)) {
			spinner = document.createElement("span");
			spinner.setAttribute("data-tp-button-spinner", "");
			spinner.setAttribute("aria-hidden", "true");
			this.controlEl.prepend(spinner);
		}

		if (!(content instanceof HTMLSpanElement)) {
			content = document.createElement("span");
			content.setAttribute("data-tp-button-content", "");

			const movableNodes = Array.from(this.controlEl.childNodes).filter(
				(node) => node !== spinner,
			);

			for (const node of movableNodes) {
				content.append(node);
			}

			this.controlEl.append(content);
		}

		this.contentEl = content;
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private updateButton(): void {
		this.ensureControl();
		this.setAttribute("variant", this.variant);
		this.setAttribute("size", this.size);
		this.setAttribute("type", this.type);
		this.setAttribute("loading-mode", this.loadingMode);

		if (this.controlEl instanceof HTMLButtonElement) {
			this.updateNativeButton(this.controlEl);
			this.updateLoadingState(this.controlEl);
			return;
		}

		if (this.controlEl instanceof HTMLAnchorElement) {
			this.updateNativeLink(this.controlEl);
			this.updateLoadingState(this.controlEl);
		}
	}

	/**
	 * @summary API documentation summary.
	 * @param button Parameter.
	 * @internal
	 */
	private updateNativeButton(button: HTMLButtonElement): void {
		button.type = this.type;
		button.disabled = this.isBlocked;
		button.setAttribute("aria-disabled", String(this.isBlocked));

		button.removeAttribute("href");
		button.removeAttribute("target");
		button.removeAttribute("rel");
		button.removeAttribute("download");
	}

	/**
	 * @summary API documentation summary.
	 * @param anchor Parameter.
	 * @internal
	 */
	private updateNativeLink(anchor: HTMLAnchorElement): void {
		if (this.isBlocked) {
			anchor.removeAttribute("href");
			anchor.setAttribute("aria-disabled", "true");
			anchor.tabIndex = -1;
		} else {
			anchor.href = this.href;
			anchor.setAttribute("aria-disabled", "false");
			anchor.removeAttribute("tabindex");
		}

		if (this.target === "") {
			anchor.removeAttribute("target");
		} else {
			anchor.target = this.target;
		}

		if (this.rel === "") {
			anchor.removeAttribute("rel");
		} else {
			anchor.rel = this.rel;
		}

		if (this.download === "") {
			anchor.removeAttribute("download");
		} else {
			anchor.setAttribute("download", this.download);
		}
	}

	/**
	 * @summary API documentation summary.
	 * @param control Parameter.
	 * @internal
	 */
	private updateLoadingState(
		control: HTMLButtonElement | HTMLAnchorElement,
	): void {
		this.ensureInnerStructure();

		if (this.loading) {
			control.setAttribute("aria-busy", "true");
			this.setAttribute("data-loading", "");
			return;
		}

		control.setAttribute("aria-busy", "false");
		this.removeAttribute("data-loading");
	}
}

if (!customElements.get("tp-button")) {
	customElements.define("tp-button", TpButton);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-button": TpButton;
	}
}
