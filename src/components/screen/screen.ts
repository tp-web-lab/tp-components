/** @module components/screen
 * @summary Responsive page preview in selectable device viewports.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-modal
 * @summary Modal overlay component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";
import "../icon-button/icon-button.js";
import "../button/button.js";
import "../menu/menu.js";
import "../modal/modal.js";
import "../iframe/iframe.js";
import type { TpIframe } from "../iframe/iframe.js";
import type { TpModal } from "../modal/modal.js";
import style from "./screen.css?inline";

export type TpScreenDevice =
	| "phone-portrait"
	| "phone-landscape"
	| "tablet-portrait"
	| "tablet-landscape"
	| "laptop"
	| "desktop"
	| "default"
	| "16:9"
	| "3:2"
	| "4:3"
	| "1:1"
	| "3:4"
	| "2:3"
	| "9:16";
const deviceIcons: Partial<Record<TpScreenDevice, string>> = {
	"phone-portrait": "cellphone-v",
	"phone-landscape": "cellphone-h",
	"tablet-portrait": "tablet-v",
	"tablet-landscape": "tablet-h",
	laptop: "laptop",
	desktop: "desktop",
};
export const TP_SCREEN_DEVICES = {
	"phone-portrait": { label: "Phone portrait", width: 390, height: 844 },
	"phone-landscape": { label: "Phone landscape", width: 844, height: 390 },
	"tablet-portrait": { label: "Tablet portrait", width: 768, height: 1024 },
	"tablet-landscape": { label: "Tablet landscape", width: 1024, height: 768 },
	laptop: { label: "Laptop", width: 1366, height: 768 },
	desktop: { label: "Desktop", width: 1920, height: 1080 },
	default: { label: "default", width: 0, height: 0 },
	"16:9": { label: "16:9", width: 16, height: 9 },
	"3:2": { label: "3:2", width: 3, height: 2 },
	"4:3": { label: "4:3", width: 4, height: 3 },
	"1:1": { label: "1:1", width: 1, height: 1 },
	"3:4": { label: "3:4", width: 3, height: 4 },
	"2:3": { label: "2:3", width: 2, height: 3 },
	"9:16": { label: "9:16", width: 9, height: 16 },
} as const;

/**
 * The custom `<tp-screen>` element previews and applies absolute device sizes or relative aspect ratios to the page.
 *
 * @tagname tp-screen
 * @summary Previews and applies absolute device sizes or relative aspect ratios to the page.
 * @attr {TpScreenDevice} device = "default" - Device preset in CSS pixels, or a ratio fitted to the available preview area.
 * @attr {string} src = "" - Page URL to preview; empty uses the current document URL, including its route.
 * @attr {boolean} disabled = false - Disables and closes the preview.
 * @attr {TpVariantType} variant = "neutral" - Trigger color variant.
 * @attr {TpSizeType} size = "m" - Trigger size.
 * @event tp-screen-confirm Emitted after OK applies the selected format.
 * @eventdetail tp-screen-confirm { device: string }
 * @event tp-screen-change Emitted when the preview opens or its viewport changes.
 * @eventdetail tp-screen-change { device: string; width: number; height: number }
 * @keyboard {Enter / Space} Opens the focused preview button or selects a focused device.
 * @keyboard {Escape} Cancels the chooser; from an applied page, restores the original window.
 * @example
 * <tp-screen src="/docs/components/screen/examples/responsive.html"></tp-screen>
 */
export class TpScreen extends TpBase {
	public static get observedAttributes(): string[] {
		return ["device", "src", "disabled", "variant", "size"];
	}
	public get device(): TpScreenDevice {
		const value = this.getAttribute("device") ?? "default";
		return Object.hasOwn(TP_SCREEN_DEVICES, value)
			? (value as TpScreenDevice)
			: "default";
	}
	public set device(value: TpScreenDevice) {
		this.setAttribute("device", value);
	}
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
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
	private modal: TpModal | null = null;
	private frame: TpIframe | null = null;
	private stage: HTMLElement | null = null;
	private viewport: HTMLElement | null = null;
	private status: HTMLElement | null = null;
	private observer: ResizeObserver | null = null;
	private previewDocument: Document | null = null;
	private nested = false;
	private sourceError = false;
	private draftDevice: TpScreenDevice = "default";
	private appliedDevice: TpScreenDevice = "default";
	private editing = false;
	private confirmed = false;
	private frameElement: Element | null = null;

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-screen-styles", style);
		try {
			this.nested = Boolean(
				this.ownerDocument.defaultView?.frameElement?.hasAttribute(
					"data-tp-screen-preview",
				),
			);
		} catch {
			this.nested = false;
		}
		if (this.nested) {
			this.frameElement = this.ownerDocument.defaultView?.frameElement ?? null;
			this.hidden = !this.frameElement?.hasAttribute("data-tp-screen-applied");
			this.frameElement?.addEventListener(
				"tp-screen-mode",
				this.syncNestedMode,
			);
			this.frameElement?.dispatchEvent(new CustomEvent("tp-screen-ready"));
		}
		this.renderTrigger();
		this.ownerDocument.defaultView?.addEventListener(
			"resize",
			this.updateWindowTitle,
		);
		this.addEventListener("pointerenter", this.updateWindowTitle);
	}
	protected override attributeChangedCallback(name: string): void {
		if (!this.isConnected || this.nested) return;
		this.renderTrigger();
		if (this.disabled) this.reset();
		else if (this.modal?.open) {
			if (name === "src") this.loadPage();
			if (name === "device") {
				this.draftDevice = this.device;
				this.updateDevice();
			}
		}
	}
	private renderTrigger(): void {
		let trigger = this.querySelector(":scope > tp-icon-button");
		if (!trigger) {
			trigger = this.ownerDocument.createElement("tp-icon-button");
			trigger.addEventListener("click", () => this.show());
			this.prepend(trigger);
		}
		trigger.setAttribute("name", "screen");
		trigger.setAttribute("library", "components");

		trigger.setAttribute("variant", this.variant);
		trigger.setAttribute("size", this.size);
		trigger.setAttribute("aria-haspopup", "dialog");
		trigger.toggleAttribute("disabled", this.disabled);
		this.updateWindowTitle();
	}
	private readonly updateWindowTitle = (): void => {
		const view = this.ownerDocument.defaultView;
		if (!view) return;
		const format = this.nested
			? (this.frameElement?.getAttribute("data-tp-screen-applied") ?? "default")
			: this.appliedDevice;
		const label = Object.hasOwn(TP_SCREEN_DEVICES, format)
			? TP_SCREEN_DEVICES[format as TpScreenDevice].label
			: "default";
		const title = `Screen preview · Format: ${label} · Window: ${view.innerWidth} × ${view.innerHeight} CSS px`;
		const trigger = this.querySelector(":scope > tp-icon-button");
		trigger?.setAttribute("label", title);
		trigger?.setAttribute("title", title);
	};
	private readonly syncNestedMode = (): void => {
		this.hidden = !this.frameElement?.hasAttribute("data-tp-screen-applied");
		this.updateWindowTitle();
	};
	/** Opens the format chooser, keeping the current applied page alive. */
	public show(): void {
		if (this.disabled || !this.isConnected) return;
		if (this.nested) {
			this.frameElement?.dispatchEvent(new CustomEvent("tp-screen-edit"));
			return;
		}
		if (this.editing) return;
		this.draftDevice = this.confirmed ? this.appliedDevice : this.device;
		this.editing = true;
		this.createPreview();
		const parent =
			this.ownerDocument.fullscreenElement ?? this.ownerDocument.body;
		if (this.modal && this.modal.parentElement !== parent)
			parent.append(this.modal);
		this.modal?.classList.remove("tp-screen-applied");
		const native = this.frame?.querySelector("iframe");
		native?.removeAttribute("data-tp-screen-applied");
		native?.dispatchEvent(new CustomEvent("tp-screen-mode"));
		if (!this.frame) this.loadPage();
		if (this.modal) this.modal.open = true;
		this.updateDevice();
		if (typeof ResizeObserver !== "undefined" && this.stage && !this.observer) {
			this.observer = new ResizeObserver(this.fitPreview);
			this.observer.observe(this.stage);
		}
		this.ownerDocument.defaultView?.addEventListener("resize", this.fitPreview);
		this.fitPreview();
		this.modal?.querySelector<HTMLElement>('[aria-current="true"]')?.focus();
	}
	/** Cancels the tentative choice and restores the last confirmed format. */
	public close(): void {
		if (this.confirmed && this.appliedDevice !== "default") {
			this.draftDevice = this.appliedDevice;
			this.showApplied();
		} else this.reset();
	}
	/** Confirms the tentative format, or restores the original page for default. */
	public confirm(): void {
		if (!this.editing || this.sourceError) return;
		this.appliedDevice = this.draftDevice;
		this.confirmed = true;
		this.device = this.draftDevice;
		if (this.appliedDevice === "default") this.reset();
		else this.showApplied();
		this.dispatchEvent(
			new CustomEvent("tp-screen-confirm", {
				bubbles: true,
				composed: true,
				detail: { device: this.device },
			}),
		);
	}
	private showApplied(): void {
		this.editing = false;
		this.modal?.classList.add("tp-screen-applied");
		if (this.modal) this.modal.open = true;
		this.updateDevice();
		const native = this.frame?.querySelector("iframe");
		native?.setAttribute("data-tp-screen-applied", this.appliedDevice);
		this.updateWindowTitle();
		native?.dispatchEvent(new CustomEvent("tp-screen-mode"));
		native?.focus();
	}
	private reset(): void {
		this.editing = false;
		this.confirmed = false;
		this.appliedDevice = "default";
		this.updateWindowTitle();
		if (this.modal?.open) this.modal.open = false;
		this.disposeFrame();
	}
	private createPreview(): void {
		if (this.modal) return;
		const modal = this.ownerDocument.createElement("tp-modal") as TpModal;
		modal.className = "tp-screen-dialog";
		for (const attribute of ["fixed", "backdrop", "breakout"])
			modal.setAttribute(attribute, "");
		modal.setAttribute("aria-label", "Screen preview");
		const header = this.ownerDocument.createElement("div");
		header.className = "tp-screen-header";
		const menus = this.ownerDocument.createElement("div");
		menus.className = "tp-screen-menus";
		for (const relative of [false, true]) {
			const menu = this.ownerDocument.createElement("tp-menu");
			menu.setAttribute("orientation", "horizontal");
			menu.setAttribute(
				"aria-label",
				relative ? "Relative formats" : "Absolute formats",
			);
			const list = this.ownerDocument.createElement("ul");
			for (const [device, preset] of Object.entries(TP_SCREEN_DEVICES)) {
				if ((device === "default" || device.includes(":")) !== relative)
					continue;
				const item = this.ownerDocument.createElement("li");
				item.dataset.device = device;
				const iconName = deviceIcons[device as TpScreenDevice];
				if (iconName) {
					item.setAttribute("aria-label", preset.label);
					item.title = preset.label;
					const button = this.ownerDocument.createElement("tp-icon-button");
					button.setAttribute("name", iconName);
					button.setAttribute("library", "screens");
					button.setAttribute("label", preset.label);
					item.append(button);
				} else item.textContent = preset.label;
				list.append(item);
			}
			menu.append(list);
			menu.addEventListener("tp-menu-item-select", (event) => {
				const device = (event as CustomEvent<{ item: HTMLElement }>).detail.item
					.dataset.device;
				if (device && Object.hasOwn(TP_SCREEN_DEVICES, device)) {
					this.draftDevice = device as TpScreenDevice;
					this.updateDevice();
				}
			});
			menus.append(menu);
		}
		const close = this.ownerDocument.createElement("tp-icon-button");
		close.setAttribute("name", "close");
		close.setAttribute("label", "Close preview");
		close.addEventListener("click", () => this.close());
		header.append(menus, close);
		this.status = this.ownerDocument.createElement("p");
		this.status.className = "tp-screen-status";
		this.status.setAttribute("role", "status");
		this.stage = this.ownerDocument.createElement("div");
		this.stage.className = "tp-screen-stage";
		this.viewport = this.ownerDocument.createElement("div");
		this.viewport.className = "tp-screen-viewport";
		this.stage.append(this.viewport);
		const footer = this.ownerDocument.createElement("div");
		footer.className = "tp-screen-actions";
		const cancel = this.ownerDocument.createElement("tp-button");
		cancel.textContent = "Cancel";
		cancel.addEventListener("click", () => this.close());
		const ok = this.ownerDocument.createElement("tp-button");
		ok.textContent = "OK";
		ok.setAttribute("variant", "brand");
		ok.addEventListener("click", () => this.confirm());
		footer.append(cancel, ok);
		const edit = this.ownerDocument.createElement("tp-icon-button");
		edit.className = "tp-screen-edit-control";
		edit.setAttribute("name", "screen");
		edit.setAttribute("library", "components");
		edit.setAttribute("label", "Screen formats");
		edit.addEventListener("click", () => this.show());
		modal.append(header, this.status, this.stage, footer, edit);
		modal.addEventListener("tp-modal-toggle", () => {
			if (!modal.open) {
				if (this.editing && this.confirmed) this.close();
				else this.reset();
			}
		});
		this.modal = modal;
		(this.ownerDocument.fullscreenElement ?? this.ownerDocument.body).append(
			modal,
		);
	}
	private loadPage(): void {
		this.modal?.removeAttribute("data-page-screen");
		this.previewDocument?.removeEventListener("keydown", this.escapePreview);
		this.previewDocument = null;
		let url: URL | null = null;
		try {
			url = new URL(this.src || this.ownerDocument.URL, this.baseURI);
		} catch {
			/* Invalid source is reported in the preview. */
		}
		this.sourceError =
			!url || !["http:", "https:", "file:"].includes(url.protocol);
		if (this.sourceError || !url) {
			this.frame?.remove();
			this.frame = null;
			if (this.status)
				this.status.textContent =
					"Choose an HTTP, HTTPS or local file page to preview.";
			return;
		}
		if (!this.frame) {
			this.frame = this.ownerDocument.createElement("tp-iframe");
			this.frame.setAttribute("title", "Responsive page preview");
			this.frame.addEventListener("tp-iframe-load", () => {
				this.previewDocument?.removeEventListener(
					"keydown",
					this.escapePreview,
				);
				try {
					this.previewDocument =
						this.frame?.querySelector("iframe")?.contentDocument ?? null;
				} catch {
					this.previewDocument = null;
				}
				this.previewDocument?.addEventListener("keydown", this.escapePreview);
				this.modal?.toggleAttribute(
					"data-page-screen",
					Boolean(this.previewDocument?.querySelector("tp-screen")),
				);
				this.fitPreview();
			});
			this.viewport?.replaceChildren(this.frame);
			const native = this.frame.querySelector("iframe");
			native?.setAttribute("data-tp-screen-preview", "");
			native?.addEventListener("tp-screen-edit", () => this.show());
			native?.addEventListener("tp-screen-ready", () =>
				this.modal?.setAttribute("data-page-screen", ""),
			);
		}
		this.frame.src = url.href;
	}
	private readonly escapePreview = (event: KeyboardEvent): void => {
		if (event.key === "Escape") {
			event.preventDefault();
			if (this.editing) this.close();
			else this.reset();
		}
	};
	private updateDevice(): void {
		const preset = TP_SCREEN_DEVICES[this.draftDevice];
		if (!this.viewport) return;
		this.viewport.style.width = `${preset.width}px`;
		this.viewport.style.height = `${preset.height}px`;
		for (const item of this.modal?.querySelectorAll<HTMLElement>(
			"[data-device]",
		) ?? []) {
			if (item.dataset.device === this.draftDevice)
				item.setAttribute("aria-current", "true");
			else item.removeAttribute("aria-current");
		}
		for (const button of this.modal?.querySelectorAll(
			"[data-device] tp-icon-button",
		) ?? []) {
			const selected =
				button.parentElement?.dataset.device === this.draftDevice;
			button.setAttribute("variant", selected ? "brand" : "neutral");
			// The menu owns roving keyboard focus; nested buttons remain clickable.
			button.querySelector("button")?.setAttribute("tabindex", "-1");
		}
		this.fitPreview();
		this.dispatchEvent(
			new CustomEvent("tp-screen-change", {
				bubbles: true,
				composed: true,
				detail: {
					device: this.draftDevice,
					width: Number.parseFloat(this.viewport.style.width),
					height: Number.parseFloat(this.viewport.style.height),
				},
			}),
		);
	}
	private readonly fitPreview = (): void => {
		if (!this.stage || !this.viewport || !this.modal?.open) return;
		let { width, height } = TP_SCREEN_DEVICES[this.draftDevice] as {
			width: number;
			height: number;
		};
		const { label } = TP_SCREEN_DEVICES[this.draftDevice];
		const bounds = this.stage.getBoundingClientRect();
		if (bounds.width <= 0 || bounds.height <= 0) return;
		const relative =
			this.draftDevice === "default" || this.draftDevice.includes(":");
		if (this.draftDevice === "default") {
			width = this.ownerDocument.defaultView?.innerWidth ?? bounds.width;
			height = this.ownerDocument.defaultView?.innerHeight ?? bounds.height;
		}
		if (relative) {
			const ratio = width / height;
			width = Math.min(bounds.width, bounds.height * ratio);
			height = width / ratio;
			this.viewport.style.width = `${width}px`;
			this.viewport.style.height = `${height}px`;
		}
		const scale = relative
			? 1
			: Math.min(1, bounds.width / width, bounds.height / height);
		this.viewport.style.transform = `translate(-50%, -50%) scale(${scale})`;
		if (this.status && !this.sourceError)
			this.status.textContent = `${label} · ${Math.round(width)} × ${Math.round(height)} CSS px · ${Math.round(scale * 100)}%`;
	};
	private disposeFrame(): void {
		this.observer?.disconnect();
		this.observer = null;
		this.ownerDocument.defaultView?.removeEventListener(
			"resize",
			this.fitPreview,
		);
		this.previewDocument?.removeEventListener("keydown", this.escapePreview);
		this.previewDocument = null;
		this.frame?.remove();
		this.frame = null;
	}
	public disconnectedCallback(): void {
		this.ownerDocument.defaultView?.removeEventListener(
			"resize",
			this.updateWindowTitle,
		);
		this.removeEventListener("pointerenter", this.updateWindowTitle);
		this.frameElement?.removeEventListener(
			"tp-screen-mode",
			this.syncNestedMode,
		);
		this.reset();
		this.modal?.remove();
		this.modal = null;
	}
}
if (!customElements.get("tp-screen"))
	customElements.define("tp-screen", TpScreen);
declare global {
	interface HTMLElementTagNameMap {
		"tp-screen": TpScreen;
	}
}
