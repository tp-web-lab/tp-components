/**
 * @module components/callout
 * @summary Callout component for highlighted contextual content.
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
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { isTpVariantType, type TpVariantType } from "../base/base.types.js";
import style from "./callout.css?inline";
import "../icon/icon.js";
import "../icon-button/icon-button.js";

/**
 * Highlighted contextual content block.
 * @summary Highlighted contextual content block.
 * @tagname tp-callout
 * @attr {string} variant = "neutral" - Visual variant (`success`, `danger`, `warning`, `info`, `neutral`, or `brand`).
 * @attr {string} heading = "" - Optional heading displayed above the content.
 * @attr {string} icon = "" - Optional icon displayed before the heading.
 * @attr {string} library = "" - Optional icon library used by `icon`.
 * @attr {boolean} closable = false - Shows a close button.
 * @attr {boolean} outlined = false - Removes the filled background.
 * @attr {string} title = "" - Native title text observed for authored callouts.
 * @method toast Displays the callout as a temporary toast notification in the top-right corner of the viewport.
 * @example
 * <tp-callout variant="info" heading="Information">
 *  The workshop starts at 9:00.
 * </tp-callout>
 * @cssprop [--tp-callout-accent=var(--tp-neutral-text-colorful)] Color of the leading emphasis border; depends on variant.
 * @cssprop [--tp-callout-background=var(--tp-neutral-fill-softer)] Background color of the callout; depends on variant and appearance.
 * @cssprop [--tp-callout-border-color=var(--tp-neutral-stroke-soft)] Color of the thin outer border, excluding the leading emphasis border.
 * @cssprop [--tp-callout-border-width=4px] Thickness of the leading emphasis border.
 * @cssprop [--tp-callout-foreground=var(--tp-text-body)] Text color of the heading and body.
 * @cssprop [--tp-callout-heading-font-size=1rem] Font size of the callout heading.
 * @cssprop [--tp-callout-heading-gap=0.625rem] Space between the heading and body.
 * @cssprop [--tp-callout-padding-block=0.875rem] Inner spacing above and below the callout content.
 * @cssprop [--tp-callout-padding-inline=1rem] Inner spacing before and after the callout content.
 * @cssprop [--tp-callout-radius=0.75rem] Corner radius of the callout panel.
 */
export class TpCallout extends TpBase {
	/**
	 * @summary Component global style ID.
	 * @internal
	 */
	private static readonly calloutStyleId = "tp-callout-styles";

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private headingEl: HTMLDivElement | null = null;

	/**
	 * @summary Current toast timeout identifier.
	 * @internal
	 */
	private toastTimeoutId: number | null = null;

	/**
	 * @summary Handles close button activation.
	 * @internal
	 */
	private readonly handleCloseClick = (): void => {
		this.closeCallout();
	};

	/**
	 * @summary Declares observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return [
			"variant",
			"heading",
			"icon",
			"library",
			"closable",
			"outlined",
			"title",
		];
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
	 * @summary Backward-compatible alias for `heading`.
	 */
	public get title(): string {
		return this.getStringAttribute("heading");
	}

	/**
	 * @summary Sets the heading through the `title` alias.
	 * @param value Heading text.
	 */
	public set title(value: string) {
		this.setStringAttribute("heading", value);
	}

	/**
	 * @summary Optional heading displayed above the content.
	 * @attr heading
	 * @default ""
	 */
	public get heading(): string {
		return this.getStringAttribute("heading");
	}

	/**
	 * @summary Sets the optional heading.
	 * @param value Heading text.
	 */
	public set heading(value: string) {
		this.setStringAttribute("heading", value);
	}

	/**
	 * @summary Optional icon displayed before the heading.
	 * @attr icon
	 * @default ""
	 */
	public get icon(): string {
		return this.getStringAttribute("icon");
	}

	/**
	 * @summary Sets the optional icon.
	 * @param value Icon name.
	 */
	public set icon(value: string) {
		this.setStringAttribute("icon", value);
	}

	/**
	 * @summary Optional icon library used by `icon`.
	 * @attr library
	 * @default ""
	 */
	public get library(): string {
		return this.getStringAttribute("library");
	}

	/**
	 * @summary Sets the optional icon library.
	 * @param value Icon library name.
	 */
	public set library(value: string) {
		this.setStringAttribute("library", value);
	}

	/**
	 * @summary Whether the callout has a close button.
	 * @attr closable
	 * @default false
	 */
	public get closable(): boolean {
		return this.getBooleanAttribute("closable");
	}

	/**
	 * @summary Sets the close button visibility.
	 * @param value Close button state.
	 */
	public set closable(value: boolean) {
		this.setBooleanAttribute("closable", value);
	}

	/**
	 * @summary Whether the callout is outlined.
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
	 * @summary API documentation summary.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpCallout.calloutStyleId, style);
		this.migrateNativeTitleAttribute();
		this.ensureHeadingElement();
		this.updateCallout();
	}

	/**
	 * @summary API documentation summary.
	 * @param name Parameter.
	 * @param oldValue Parameter.
	 * @param newValue Parameter.
	 * @internal
	 */
	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue) {
			return;
		}

		if (name === "title") {
			this.migrateNativeTitleAttribute();
		}

		this.ensureHeadingElement();
		this.updateCallout();
	}

	/**
	 * @summary Cleans pending toast timers.
	 * @internal
	 */
	protected disconnectedCallback(): void {
		this.clearToastTimeout();
	}

	/**
	 * @summary Shows the callout as a status toast and closes it after delay milliseconds. A zero or negative delay keeps it open; calling again replaces the previous timeout.
	 */
	public toast(delay = 3000): void {
		this.clearToastTimeout();
		this.hidden = false;
		this.setAttribute("data-tp-callout-toast", "");
		this.setAttribute("role", "status");

		if (delay > 0) {
			this.toastTimeoutId = window.setTimeout(() => {
				this.closeCallout();
			}, delay);
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private migrateNativeTitleAttribute(): void {
		const nativeTitle = this.getAttribute("title");

		if (nativeTitle === null) {
			return;
		}

		if (!this.hasAttribute("heading")) {
			this.setAttribute("heading", nativeTitle);
		}

		this.removeAttribute("title");
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureHeadingElement(): void {
		const existing = this.querySelector(":scope > [data-tp-callout-heading]");

		if (existing instanceof HTMLDivElement) {
			this.headingEl = existing;
			return;
		}

		const heading = document.createElement("div");
		heading.setAttribute("data-tp-callout-heading", "");
		this.prepend(heading);
		this.headingEl = heading;
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private updateCallout(): void {
		this.setAttribute("variant", this.variant);
		this.syncHeading();
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private syncHeading(): void {
		if (!(this.headingEl instanceof HTMLDivElement)) {
			return;
		}

		const heading = this.heading.trim();
		const iconName = this.icon.trim();
		const iconLibrary = this.library.trim();

		if (heading === "" && iconName === "" && !this.closable) {
			this.headingEl.hidden = true;
			this.headingEl.replaceChildren();
			return;
		}

		this.headingEl.hidden = false;
		this.headingEl.replaceChildren();

		if (iconName !== "") {
			const icon = document.createElement("tp-icon");
			icon.setAttribute("size", "1.75em");
			icon.setAttribute("name", iconName);
			icon.setAttribute("aria-hidden", "true");

			if (iconLibrary !== "") {
				icon.setAttribute("library", iconLibrary);
			}

			this.headingEl.append(icon);
		}

		if (heading !== "") {
			const text = document.createElement("span");
			text.setAttribute("data-tp-callout-heading-text", "");
			text.textContent = heading;
			this.headingEl.append(text);
		}

		if (this.closable) {
			const closeButton = document.createElement("tp-icon-button");
			closeButton.setAttribute("name", "close");
			closeButton.setAttribute("size", "xs");
			closeButton.setAttribute("variant", "neutral");
			closeButton.setAttribute("label", "Close callout");
			closeButton.setAttribute("data-tp-callout-close", "");
			closeButton.addEventListener("click", this.handleCloseClick);
			this.headingEl.append(closeButton);
		}
	}

	/**
	 * @summary Clears the active toast timeout.
	 * @internal
	 */
	private clearToastTimeout(): void {
		if (this.toastTimeoutId === null) {
			return;
		}

		window.clearTimeout(this.toastTimeoutId);
		this.toastTimeoutId = null;
	}

	/**
	 * @summary Hides the callout.
	 * @internal
	 */
	private closeCallout(): void {
		const wasToast = this.hasAttribute("data-tp-callout-toast");

		this.clearToastTimeout();
		this.hidden = true;
		this.removeAttribute("data-tp-callout-toast");

		if (wasToast && this.getAttribute("role") === "status") {
			this.removeAttribute("role");
		}
	}
}

/**
 * @summary Registers the custom element `tp-callout`.
 * @internal
 */
if (!customElements.get("tp-callout")) {
	customElements.define("tp-callout", TpCallout);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-callout": TpCallout;
	}
}
