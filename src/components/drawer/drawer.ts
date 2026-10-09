/**
 * @module components/drawer
 * @summary Drawer overlay component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./drawer.css?inline";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import { TpOverlayElement } from "../overlay/overlay.js";

type TpDrawerPlacement = "top" | "end" | "bottom" | "start";

function isPlacement(value: string): value is TpDrawerPlacement {
	return (
		value === "top" ||
		value === "end" ||
		value === "bottom" ||
		value === "start"
	);
}

/**
 * Drawer overlay component.
 *
 * Displays a sliding panel from one edge of the viewport or containing element.
 *
 * @summary Displays a sliding drawer panel.
 * @tagname tp-drawer
 *
 * @attr {"top" | "end" | "bottom" | "start"} placement = "end" - Edge from which the drawer appears.
 * @attr {boolean} open = false - Opens the drawer.
 * @attr {boolean} contained = false - Keeps the drawer and backdrop inside the parent element.
 * @attr {string} label = "" - Text displayed in the drawer header.
 * @attr {string} width = "min(24rem, 100vw)" - Drawer width when opened from the start or end edge. When absent, uses the --tp-drawer-size CSS default.
 * @attr {boolean} outside-click = false - Closes the drawer when the user clicks outside it.
 * @attr {boolean} backdrop = false - Displays a backdrop behind the drawer.
 *
 *
 * @event tp-drawer-toggle Emitted when the drawer open state changes.
 * @eventdetail tp-drawer-toggle { backdrop: boolean; open: boolean; outsideClick: boolean; contained: boolean; placement: "top" | "end" | "bottom" | "start" }
 *
 * @cssprop --tp-drawer-size Drawer size on the sliding axis.
 * @cssprop --tp-drawer-duration Drawer transition duration.
 * @keyboard {ArrowLeft / ArrowRight} Moves the focused resize edge by 10 pixels; hold Shift for 50 pixels.
 * @keyboard {Home / End} Sets the focused resize edge to the minimum or maximum drawer width.
 * @example
 * <tp-drawer></tp-drawer>
 */
export class TpDrawer extends TpOverlayElement {
	/** Apply the outside-click setting to the backdrop as well. */
	protected override get closesOnBackdropClick(): boolean {
		return this.outsideClick;
	}

	/** Viewport drawers escape ancestor stacking contexts; contained drawers stay local. */
	protected override get usesTopLayer(): boolean {
		return !this.contained;
	}

	protected readonly overlayName = "tp-drawer";
	protected readonly backdropTagName = "tp-drawer-backdrop";
	protected readonly toggleEventName = "tp-drawer-toggle";

	private static readonly styleId = "tp-drawer-styles";
	private static readonly collapsedWidth = "24rem";
	private static readonly expandedWidth = "100vw";

	private closeButtonEl: HTMLElement | null = null;
	private contentEl: HTMLDivElement | null = null;
	private collapseButtonEl: HTMLElement | null = null;
	private expandButtonEl: HTMLElement | null = null;
	private headerEl: HTMLDivElement | null = null;
	private titleEl: HTMLParagraphElement | null = null;
	/** Accessible handle on the free edge of a side drawer. */
	private resizeHandle: HTMLElement | null = null;
	/** Removes temporary pointer listeners when resizing ends or the drawer disconnects. */
	private resizeAbort: AbortController | null = null;

	/**
	 * Attributes observed by `<tp-drawer>`.
	 *
	 * @summary Observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return [
			"placement",
			"open",
			"contained",
			"label",
			"width",
			"outside-click",
			"backdrop",
		];
	}

	/**
	 * Edge from which the drawer appears.
	 *
	 * @attr placement
	 */
	public get placement(): TpDrawerPlacement {
		const value = this.getAttribute("placement");
		return value !== null && isPlacement(value) ? value : "end";
	}

	public set placement(value: TpDrawerPlacement) {
		this.setAttribute("placement", value);
	}

	/**
	 * Keeps the drawer and backdrop inside the parent element.
	 *
	 * @attr contained
	 */
	public get contained(): boolean {
		return this.hasAttribute("contained");
	}

	public set contained(value: boolean) {
		if (value) {
			this.setAttribute("contained", "");
			return;
		}

		this.removeAttribute("contained");
	}

	/**
	 * Text displayed in the drawer header.
	 *
	 * @attr label
	 */
	public get label(): string {
		return this.getAttribute("label") ?? "";
	}

	public set label(value: string) {
		if (value === "") {
			this.removeAttribute("label");
			return;
		}

		this.setAttribute("label", value);
	}

	/**
	 * Drawer width when opened from the start or end edge.
	 *
	 * Returns an empty string when absent; CSS supplies min(24rem, 100vw).
	 *
	 * @attr width
	 */
	public get width(): string {
		return this.getAttribute("width") ?? "";
	}

	public set width(value: string) {
		if (value === "") {
			this.removeAttribute("width");
			return;
		}

		this.setAttribute("width", value);
	}

	/**
	 * Replaces the drawer body content.
	 *
	 * @summary Replaces the drawer body content.
	 */
	public setContent(content: string | Node | readonly Node[]): void {
		this.ensureDom();

		if (this.contentEl === null) {
			return;
		}

		this.contentEl.replaceChildren();

		if (typeof content === "string") {
			this.contentEl.innerHTML = content;
			return;
		}

		if (content instanceof Node) {
			this.contentEl.append(content);
			return;
		}

		this.contentEl.append(...content);
	}

	/**
	 * Connects the drawer to the document.
	 *
	 * @summary Connects the drawer to the document.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureDom();
		this.updateOverlayState();
	}

	/**
	 * Updates the drawer when an observed attribute changes.
	 *
	 * @summary Handles attribute changes.
	 * @internal
	 */
	protected attributeChangedCallback(): void {
		this.updateOverlayState();
	}

	/**
	 * Disconnects the drawer from the document.
	 *
	 * @summary Disconnects the drawer from the document.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.resizeAbort?.abort();
		super.disconnectedCallback();
	}

	protected getBackdropParent(): HTMLElement | null {
		return this.contained ? this.parentElement : document.body;
	}

	protected isBackdropContained(): boolean {
		return this.contained;
	}

	protected getToggleEventDetail(): Record<string, unknown> {
		return {
			contained: this.contained,
			placement: this.placement,
		};
	}

	protected override afterOverlayUpdate(): void {
		this.setAttribute("data-placement", this.placement);
		this.updateWidth();
		if (this.resizeHandle) {
			this.resizeHandle.hidden =
				this.placement === "top" || this.placement === "bottom";
			this.updateResizeAria();
		}
		if (!this.open) this.resizeAbort?.abort();

		if (this.titleEl !== null) {
			this.titleEl.textContent = this.label;
			this.titleEl.hidden = this.label === "";
		}
	}

	private ensureStyles(): void {
		if (document.getElementById(TpDrawer.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpDrawer.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	private ensureDom(): void {
		if (
			this.headerEl !== null &&
			this.titleEl !== null &&
			this.expandButtonEl !== null &&
			this.collapseButtonEl !== null &&
			this.closeButtonEl !== null &&
			this.contentEl !== null
		) {
			return;
		}

		const existingChildren = Array.from(this.childNodes);
		this.textContent = "";

		const header = document.createElement("div");
		header.setAttribute("data-tp-drawer-header", "");
		header.setAttribute("data-tp-drawer-role", "header");

		const expandButton = document.createElement("tp-icon-button");
		expandButton.setAttribute("name", "arrow-expand-horizontal");
		expandButton.setAttribute("label", "Expand drawer");
		expandButton.setAttribute("data-tp-drawer-expand", "");
		expandButton.setAttribute("data-tp-drawer-role", "expand-button");
		expandButton.addEventListener("click", () => {
			this.width = TpDrawer.expandedWidth;
		});

		const collapseButton = document.createElement("tp-icon-button");
		collapseButton.setAttribute("name", "arrow-collapse-horizontal");
		collapseButton.setAttribute("label", "Collapse drawer");
		collapseButton.setAttribute("data-tp-drawer-collapse", "");
		collapseButton.setAttribute("data-tp-drawer-role", "collapse-button");
		collapseButton.addEventListener("click", () => {
			this.width = TpDrawer.collapsedWidth;
		});

		const title = document.createElement("p");
		title.setAttribute("data-tp-drawer-title", "");
		title.setAttribute("data-tp-drawer-role", "title");

		const endActions = document.createElement("div");
		endActions.setAttribute("data-tp-drawer-actions", "end");

		const closeButton = document.createElement("tp-icon-button");
		closeButton.setAttribute("name", "close");
		closeButton.setAttribute("label", "Close drawer");
		closeButton.setAttribute("data-tp-drawer-close", "");
		closeButton.setAttribute("data-tp-drawer-role", "close-button");
		closeButton.addEventListener("click", () => {
			this.hide();
		});

		endActions.append(expandButton, collapseButton, closeButton);
		header.append(title, endActions);

		const content = document.createElement("div");
		content.setAttribute("data-tp-drawer-content", "");
		content.setAttribute("data-tp-drawer-role", "content");

		for (const node of existingChildren) {
			content.append(node);
		}

		this.append(header, content);

		this.headerEl = header;
		this.titleEl = title;
		this.expandButtonEl = expandButton;
		this.collapseButtonEl = collapseButton;
		this.closeButtonEl = closeButton;
		this.contentEl = content;
		const handle = document.createElement("tp-divider");
		handle.setAttribute("orientation", "vertical");
		handle.setAttribute("data-tp-drawer-resize", "");
		handle.setAttribute("role", "separator");
		handle.setAttribute("aria-orientation", "vertical");
		handle.setAttribute("aria-label", "Resize drawer");
		handle.tabIndex = 0;
		handle.addEventListener("pointerdown", (event) => this.startResize(event));
		handle.addEventListener("keydown", (event) => {
			if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
				return;
			event.preventDefault();
			event.stopPropagation();
			const maximum = this.maximumWidth();
			const current = this.getBoundingClientRect().width;
			const step = event.shiftKey ? 50 : 10;
			const next =
				event.key === "Home"
					? 0
					: event.key === "End"
						? maximum
						: current +
							(event.key === "ArrowRight" ? step : -step) *
								this.resizeDirection();
			this.setResizedWidth(next);
		});
		this.resizeHandle = handle;
		this.append(handle);
	}

	/** Maximum available width, bounded by the containing element when requested. */
	private maximumWidth(): number {
		return this.contained
			? this.parentElement?.clientWidth || window.innerWidth
			: window.innerWidth;
	}

	/** Converts physical pointer movement to width changes for placement and direction. */
	private resizeDirection(): number {
		return (
			(this.placement === "start" ? 1 : -1) *
			(getComputedStyle(this).direction === "rtl" ? -1 : 1)
		);
	}

	/** Applies a bounded width while keeping the public attribute synchronized. */
	private setResizedWidth(width: number): void {
		const maximum = this.maximumWidth();
		this.width = `${Math.round(Math.min(maximum, Math.max(Math.min(160, maximum), width)))}px`;
		this.updateResizeAria();
	}

	/** Exposes the resize range and current width to assistive technology. */
	private updateResizeAria(): void {
		const maximum = this.maximumWidth();
		this.resizeHandle?.setAttribute(
			"aria-valuemin",
			String(Math.min(160, maximum)),
		);
		this.resizeHandle?.setAttribute("aria-valuemax", String(maximum));
		this.resizeHandle?.setAttribute(
			"aria-valuenow",
			String(Math.round(this.getBoundingClientRect().width)),
		);
	}

	/** Starts a pointer resize without selecting content or triggering outside-close. */
	private startResize(event: PointerEvent): void {
		if (
			event.button !== 0 ||
			!this.open ||
			this.placement === "top" ||
			this.placement === "bottom"
		)
			return;
		event.preventDefault();
		event.stopPropagation();
		this.resizeAbort?.abort();
		const controller = new AbortController();
		this.resizeAbort = controller;
		window.addEventListener("blur", () => controller.abort(), {
			signal: controller.signal,
		});
		const width = this.getBoundingClientRect().width;
		const start = event.clientX;
		const direction = this.resizeDirection();
		const handle = this.resizeHandle;
		handle?.focus();
		handle?.setPointerCapture?.(event.pointerId);
		document.addEventListener(
			"pointermove",
			(move) => {
				if (move.pointerId === event.pointerId)
					this.setResizedWidth(width + (move.clientX - start) * direction);
			},
			{ signal: controller.signal },
		);
		const finish = (end: PointerEvent): void => {
			if (end.pointerId !== event.pointerId) return;
			if (handle?.hasPointerCapture?.(event.pointerId))
				handle.releasePointerCapture(event.pointerId);
			controller.abort();
		};
		document.addEventListener("pointerup", finish, {
			signal: controller.signal,
		});
		document.addEventListener("pointercancel", finish, {
			signal: controller.signal,
		});
	}

	private updateWidth(): void {
		if (this.width === "") {
			this.style.removeProperty("--tp-drawer-size");
			return;
		}

		this.style.setProperty("--tp-drawer-size", this.width);
	}
}

if (!customElements.get("tp-drawer")) {
	customElements.define("tp-drawer", TpDrawer);
}
