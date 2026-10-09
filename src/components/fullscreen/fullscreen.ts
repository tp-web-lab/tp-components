/**
 * @module components/fullscreen
 * @summary Fullscreen controller button.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./fullscreen.css?inline";

import "../icon-button/icon-button.js";

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";

const STYLE_ID = "tp-fullscreen-styles";
const CONTAINER_TAGS = new Set([
	"TP-TOOLBAR",
	"TP-MENU",
	"TP-DROPDOWN",
	"TP-BUTTON-GROUP",
	"TP-CONTEXTMENU",
	"P",
]);

function isCustomElement(element: HTMLElement): boolean {
	return element.tagName.includes("-");
}

/**
 * `<tp-fullscreen>` toggles fullscreen mode for an anchored or containing element.
 *
 * @summary Fullscreen controller button.
 * @tagname tp-fullscreen
 * @attr {string} anchor = "" - CSS selector of the element to toggle fullscreen.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the fullscreen trigger.
 *
 * @event tp-fullscreen-change Emitted when the fullscreen state of the controlled target changes.
 * @eventdetail tp-fullscreen-change { fullscreen: boolean; anchor: string; target: HTMLElement }
 * @example
 * <tp-fullscreen></tp-fullscreen>
 */
export class TpFullscreen extends TpBase {
	private static readonly changeEventName = "tp-fullscreen-change";

	public static get observedAttributes(): string[] {
		return ["anchor", "variant", "size", "disabled"];
	}

	private controlEl: HTMLElement | null = null;
	private fullscreenTarget: HTMLElement | null = null;
	private addedThemeClass: "tp-light" | "tp-dark" | null = null;
	private lastFullscreenTarget: HTMLElement | null = null;
	private lastFullscreenState: boolean | null = null;

	public get anchor(): string {
		return this.getAttribute("anchor") ?? "";
	}

	public set anchor(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("anchor");
			return;
		}

		this.setAttribute("anchor", value);
	}

	public get variant(): TpVariantType {
		const value = this.getAttribute("variant") ?? "neutral";
		return isTpVariantType(value) ? value : "neutral";
	}

	public set variant(value: TpVariantType) {
		this.setAttribute("variant", value);
	}

	public get size(): TpSizeType {
		const value = this.getAttribute("size") ?? "m";
		return isTpSizeType(value) ? value : "m";
	}

	public set size(value: TpSizeType) {
		this.setAttribute("size", value);
	}

	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}

	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(STYLE_ID, style);
		this.ensureControl();
		this.updateControl();
		this.ownerDocument.addEventListener(
			"fullscreenchange",
			this.handleFullscreenChange,
		);
	}

	protected disconnectedCallback(): void {
		this.ownerDocument.removeEventListener(
			"fullscreenchange",
			this.handleFullscreenChange,
		);
		this.cleanupFullscreenTarget();
	}

	protected attributeChangedCallback(): void {
		if (!this.isConnected) return;
		this.updateControl();
	}

	private ensureControl(): void {
		let control = this.querySelector<HTMLElement>(":scope > tp-icon-button");
		if (!(control instanceof HTMLElement)) {
			control = document.createElement("tp-icon-button");
			this.replaceChildren(control);
		}

		control.setAttribute("variant", this.variant);
		control.setAttribute("size", this.size);
		control.toggleAttribute("disabled", this.disabled);
		control.removeEventListener("click", this.handleControlClick);
		control.addEventListener("click", this.handleControlClick);
		this.controlEl = control;
	}

	private updateControl(): void {
		this.ensureControl();

		if (!(this.controlEl instanceof HTMLElement)) {
			return;
		}

		const target = this.resolveFullscreenTarget();
		const isFullscreen =
			target !== null && this.ownerDocument.fullscreenElement === target;
		const label = isFullscreen ? "Exit fullscreen" : "Fullscreen";

		this.controlEl.setAttribute(
			"name",
			isFullscreen ? "fullscreen-exit" : "fullscreen",
		);
		this.controlEl.setAttribute("label", label);
		this.controlEl.setAttribute("title", label);
		this.controlEl.setAttribute("aria-pressed", String(isFullscreen));
	}

	private async toggleFullscreen(): Promise<void> {
		const target = this.resolveFullscreenTarget();
		if (target === null) {
			return;
		}

		if (this.ownerDocument.fullscreenElement === target) {
			await this.ownerDocument.exitFullscreen();
			this.updateControl();
			return;
		}

		this.prepareFullscreenTarget(target);

		try {
			await target.requestFullscreen();
			this.updateControl();
		} catch (error) {
			this.cleanupFullscreenTarget();
			throw error;
		}
	}

	private resolveFullscreenTarget(): HTMLElement | null {
		const anchoredTarget = this.resolveAnchoredTarget();
		if (anchoredTarget instanceof HTMLElement) {
			return anchoredTarget;
		}

		return this.resolveContainingTarget();
	}

	private resolveAnchoredTarget(): HTMLElement | null {
		const anchor = this.anchor.trim();
		if (anchor === "") {
			return null;
		}

		const target = this.ownerDocument.querySelector(anchor);
		return target instanceof HTMLElement ? target : null;
	}

	private resolveContainingTarget(): HTMLElement | null {
		let current = this.parentElement;

		while (current instanceof HTMLElement) {
			const tagName = current.tagName.toUpperCase();
			if (CONTAINER_TAGS.has(tagName)) {
				current = current.parentElement;
				continue;
			}

			if (current.parentElement instanceof HTMLElement) {
				const parentTagName = current.parentElement.tagName.toUpperCase();
				if (CONTAINER_TAGS.has(parentTagName)) {
					current = current.parentElement.parentElement;
					continue;
				}
			}

			if (isCustomElement(current)) {
				return current;
			}

			const customParent =
				current.parentElement?.closest<HTMLElement>(":defined");
			if (
				customParent instanceof HTMLElement &&
				isCustomElement(customParent)
			) {
				return customParent;
			}

			return current;
		}

		return null;
	}

	private handleControlClick = (): void => {
		if (this.disabled) {
			return;
		}

		void this.toggleFullscreen();
	};

	private handleFullscreenChange = (): void => {
		const previousTarget =
			this.fullscreenTarget ??
			this.lastFullscreenTarget ??
			this.resolveFullscreenTarget();
		if (
			this.fullscreenTarget !== null &&
			this.ownerDocument.fullscreenElement !== this.fullscreenTarget
		) {
			this.cleanupFullscreenTarget();
		}

		this.updateControl();
		const target = this.fullscreenTarget ?? previousTarget;
		if (target instanceof HTMLElement) {
			this.emitChange(target, this.ownerDocument.fullscreenElement === target);
		}
	};

	private prepareFullscreenTarget(target: HTMLElement): void {
		this.cleanupFullscreenTarget();
		this.fullscreenTarget = target;
		this.lastFullscreenTarget = target;
		target.setAttribute("data-tp-fullscreen-target", "");

		if (
			target.classList.contains("tp-light") ||
			target.classList.contains("tp-dark")
		) {
			return;
		}

		const theme = this.resolveEffectiveTheme(target);
		if (theme === null) {
			return;
		}

		target.classList.add(theme);
		this.addedThemeClass = theme;
	}

	private cleanupFullscreenTarget(): void {
		const target = this.fullscreenTarget;
		if (target === null) {
			return;
		}

		target.removeAttribute("data-tp-fullscreen-target");
		if (this.addedThemeClass !== null) {
			target.classList.remove(this.addedThemeClass);
			this.addedThemeClass = null;
		}

		this.fullscreenTarget = null;
	}

	private emitChange(target: HTMLElement, fullscreen: boolean): void {
		if (
			this.lastFullscreenState === fullscreen &&
			this.lastFullscreenTarget === target
		) {
			return;
		}

		this.lastFullscreenState = fullscreen;
		this.lastFullscreenTarget = target;
		this.dispatchEvent(
			new CustomEvent(TpFullscreen.changeEventName, {
				bubbles: true,
				composed: true,
				detail: {
					fullscreen,
					anchor: this.anchor,
					target,
				},
			}),
		);
	}

	private resolveEffectiveTheme(
		target: HTMLElement,
	): "tp-light" | "tp-dark" | null {
		const themedAncestor = target.closest<HTMLElement>(".tp-light, .tp-dark");
		if (themedAncestor instanceof HTMLElement) {
			return themedAncestor.classList.contains("tp-dark")
				? "tp-dark"
				: "tp-light";
		}

		if (this.ownerDocument.body.classList.contains("tp-dark")) {
			return "tp-dark";
		}

		if (this.ownerDocument.body.classList.contains("tp-light")) {
			return "tp-light";
		}

		if (this.ownerDocument.documentElement.classList.contains("tp-dark")) {
			return "tp-dark";
		}

		if (this.ownerDocument.documentElement.classList.contains("tp-light")) {
			return "tp-light";
		}

		return null;
	}
}

if (!customElements.get("tp-fullscreen")) {
	customElements.define("tp-fullscreen", TpFullscreen);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-fullscreen": TpFullscreen;
	}
}
