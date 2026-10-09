/** @module components/post-it */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-box
 * @summary Simple box layout component.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { TpColor } from "../color/color.js";
import "../box/box.js";
import "../icon-button/icon-button.js";
import style from "./post-it.css?inline";

/** Supported paper colors from the shared palette. */
export type TpPostItColor =
	(typeof TpColor.presets)[number] extends `tp-${infer Color}` ? Color : never;
/** Palette classes are applied to the paper, never invented as new global colors. */
const colors: readonly TpPostItColor[] = TpColor.presets.map(
	(preset) => preset.slice(3) as TpPostItColor,
);

/**
 * @summary displays a movable floating paper note that folds into a pushpin.
 * @tagname tp-post-it
 * @attr {"default"|"red"|"orange"|"amber"|"yellow"|"lime"|"green"|"emerald"|"teal"|"glaz"|"cyan"|"sky"|"blue"|"indigo"|"violet"|"purple"|"fuchsia"|"pink"|"rose"|"zinc"|"ivory"|"stone"} color = "yellow" - Shared tp-color palette name without the tp- prefix; invalid values fall back to yellow.
 * @attr {string} heading = "" - Optional plain-text heading above the preserved content.
 * @attr {boolean} lite = false - Folds the note into its pushpin; click the pin to expand or fold it again.
 * @attr {number} opacity = 1 - Opacity of the whole note, including its pin, clamped from 0 to 1; invalid or empty values use 1.
 * @attr {number} rotation = 0 - Paper rotation in degrees, clamped from -12 to 12; invalid values use 0.
 * @cssprop --tp-post-it-width = 20rem Preferred note width, limited by the available space.
 * @cssprop --tp-post-it-padding = 0.75rem Inner paper padding.
 * @event tp-post-it-toggle Emitted after the pin changes the folded state.
 * @eventdetail tp-post-it-toggle { lite: boolean }
 * @event tp-post-it-move Emitted after a pointer or keyboard move, or a position reset; attachment exposes the target and offsets.
 * @keyboard Tab / Shift+Tab - Move between the pin, reset, header and interactive content; only the pin remains in lite mode.
 * @keyboard Enter / Space - Activate the focused reset or pin button.
 * @keyboard Arrow keys / Shift+Arrow keys - Move the focused header, or lite pin, by 10 / 1 pixels.
 * @keyboard Escape - Cancel the current pointer drag and restore its starting position.
 * @accessibility The persistent pin exposes aria-expanded and aria-controls; folded content is hidden without being destroyed.
 * @accessibilityresponsibility Do not use color alone to communicate meaning; provide a descriptive heading for the note.
 * @example
 * <tp-box style="min-block-size: 20rem">
 *   <p>Drag the note by its header to move it over the page. The pin folds and opens it.</p>
 *   <tp-post-it heading="Remember">
 *     <p>Keep examples <strong>simple and meaningful</strong>.</p>
 *     <ul>
 *       <li>Show a useful result.</li>
 *       <li>Try the keyboard controls.</li>
 *     </ul>
 *   </tp-post-it>
 * </tp-box>
 */
export class TpPostIt extends TpBase {
	/** Available paper colors, derived from the shared color controller palette. */
	public static readonly colors = colors;
	/** Returns a copy of the current pin attachment for annotation persistence. */
	public get attachment(): { element: Element; x: number; y: number } | null {
		return this.anchor ? { ...this.anchor } : null;
	}
	/** Restores a pin attachment using pixel offsets from the target's top-left corner. */
	public attachTo(
		element: Element,
		x: number,
		y: number,
		initial = false,
	): void {
		if (
			!Number.isFinite(x) ||
			!Number.isFinite(y) ||
			element.ownerDocument !== this.ownerDocument
		)
			return;
		this.float();
		this.anchor = { element, x, y };
		if (initial) this.initialAnchor = { ...this.anchor };
		this.followAnchor();
	}
	/** Unique identifiers connect each pin with its own content. */
	private static nextId = 0;
	/** Stable target for the pin's aria-controls relationship. */
	private readonly contentId = `tp-post-it-content-${++TpPostIt.nextId}`;
	/** Current viewport coordinates, adjusted with the underlying document's scrolling. */
	private position: { x: number; y: number } | null = null;
	/** Original document position, captured once before the note leaves author layout. */
	private initialPosition: { x: number; y: number } | null = null;
	/** Element-relative pin attachment, independent of sidebar and viewport layout. */
	private anchor: { element: Element; x: number; y: number } | null = null;
	/** Initial attachment used by Reset. */
	private initialAnchor: typeof this.anchor = null;
	/** Frame tracking also detects translations that do not resize the target. */
	private layoutFrame: number | null = null;
	/** Last cumulative scroll offset of the window and author containers. */
	private scrollOffset = { x: 0, y: 0 };
	/** Deferred promotion lets author layout settle before capturing the initial position. */
	private floatingTimer: ReturnType<typeof setTimeout> | null = null;
	/** Prevents the synthetic click following a pin drag from opening the note. */
	private suppressPinClick = false;
	/** Active gesture, including the original position used by Escape. */
	private drag: {
		id: number;
		clientX: number;
		clientY: number;
		x: number;
		y: number;
		handle: HTMLElement;
		moved: boolean;
	} | null = null;
	/** Paper container reused across attribute changes. */
	private paper: HTMLElement | null = null;
	/** Preserves author nodes, event handlers and nested component state. */
	private content: HTMLElement | null = null;
	/** Moves content inserted after custom-element connection into the paper. */
	private readonly observer = new MutationObserver(() => this.arrange());
	/** Presentation attributes, including the shared base attributes. */
	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"color",
			"heading",
			"lite",
			"opacity",
			"rotation",
		];
	}
	/** Resolved shared palette color. */
	public get color(): TpPostItColor {
		const value = this.getAttribute("color") ?? "yellow";
		return colors.find((color) => color === value) ?? "yellow";
	}
	/** Changes the paper color. */
	public set color(value: TpPostItColor) {
		this.setAttribute("color", value);
	}
	/** Optional heading, rendered as text rather than markup. */
	public get heading(): string {
		return this.getAttribute("heading") ?? "";
	}
	/** Changes the heading without rebuilding author content. */
	public set heading(value: string) {
		this.setAttribute("heading", value);
	}
	/** Whether only the pin is displayed; presence alone enables the folded state. */
	public get lite(): boolean {
		return this.hasAttribute("lite");
	}
	/** Folds or expands the note while preserving its content. */
	public set lite(value: boolean) {
		this.toggleAttribute("lite", value);
	}
	/** Opacity of the paper and its controls, including the folded pin. */
	public get opacity(): number {
		const raw = this.getAttribute("opacity");
		const value = raw?.trim() ? Number(raw) : 1;
		return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1;
	}
	/** Changes transparency without replacing author content. */
	public set opacity(value: number) {
		this.setAttribute("opacity", String(value));
	}
	/** Rotation bounded to keep the paper readable. */
	public get rotation(): number {
		const value = Number(this.getAttribute("rotation") ?? 0);
		return Number.isFinite(value) ? Math.max(-12, Math.min(12, value)) : 0;
	}
	/** Changes the paper angle in degrees. */
	public set rotation(value: number) {
		this.setAttribute("rotation", String(value));
	}
	/** Initializes the note and installs each stylesheet only once through the base class. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-post-it-styles", style);
		if (!this.hasAttribute("role")) this.setAttribute("role", "note");
		this.arrange();
		this.observer.observe(this, { childList: true });
		this.scrollOffset = this.getScrollOffset();
		this.ownerDocument.defaultView?.addEventListener(
			"scroll",
			this.followScroll,
			true,
		);
		this.ownerDocument.defaultView?.addEventListener(
			"resize",
			this.keepVisible,
		);
		this.floatingTimer = setTimeout(() => {
			this.floatingTimer = null;
			this.float();
		}, 0);
	}
	/** Stops watching detached elements while retaining their content for reconnection. */
	public disconnectedCallback(): void {
		this.observer.disconnect();
		if (this.floatingTimer !== null) clearTimeout(this.floatingTimer);
		this.floatingTimer = null;
		this.finishDrag();
		if (this.layoutFrame !== null)
			this.ownerDocument.defaultView?.cancelAnimationFrame(this.layoutFrame);
		this.layoutFrame = null;
		this.ownerDocument.defaultView?.removeEventListener(
			"scroll",
			this.followScroll,
			true,
		);
		this.ownerDocument.defaultView?.removeEventListener(
			"resize",
			this.keepVisible,
		);
	}
	/** Refreshes only local presentation attributes. */
	protected override attributeChangedCallback(name: string): void {
		if (
			this.isConnected &&
			["color", "heading", "lite", "opacity", "rotation"].includes(name)
		)
			this.update();
	}
	/** Creates library-based chrome once and moves, rather than clones, all author nodes. */
	private arrange(): void {
		if (!this.paper || this.paper.parentElement !== this) {
			this.paper = this.ownerDocument.createElement("tp-box");
			this.paper.setAttribute("data-post-it-paper", "");
			this.paper.innerHTML =
				'<div data-post-it-header tabindex="0" role="group" aria-label="Move note with arrow keys"><tp-icon-button data-post-it-pin name="pin" library="components" label="Fold note"></tp-icon-button><strong data-post-it-heading></strong><tp-icon-button data-post-it-reset name="refresh" label="Reset position"></tp-icon-button></div><div data-post-it-content></div>';
			this.paper
				.querySelector("[data-post-it-reset]")
				?.addEventListener("click", () => this.resetPosition());
			const header = this.paper.querySelector<HTMLElement>(
				"[data-post-it-header]",
			);
			header?.addEventListener("pointerdown", this.startDrag);
			header?.addEventListener("keydown", this.moveWithKeyboard);
			this.content = this.paper.querySelector("[data-post-it-content]");
			if (this.content) this.content.id = this.contentId;
			const pin = this.paper.querySelector<HTMLElement>("[data-post-it-pin]");
			pin?.addEventListener("pointerdown", this.startDrag);
			pin?.addEventListener("keydown", this.moveWithKeyboard);
			pin?.addEventListener("click", (event) => {
				if (this.suppressPinClick && event.detail !== 0) {
					this.suppressPinClick = false;
					event.preventDefault();
					return;
				}
				this.toggle();
			});
			this.append(this.paper);
		}
		Array.from(this.childNodes).forEach((node) => {
			if (node !== this.paper) this.content?.append(node);
		});
		this.update();
	}
	/** Applies theme tokens and disclosure state without replacing the focused pin or content. */
	private update(): void {
		if (!this.paper) return;
		this.paper.style.opacity = String(this.opacity);
		this.paper.classList.remove(...colors.map((color) => `tp-${color}`));
		this.paper.classList.add(`tp-${this.color}`);
		this.paper.style.setProperty(
			"--tp-post-it-rotation",
			`${this.rotation}deg`,
		);
		const heading = this.paper.querySelector<HTMLElement>(
			"[data-post-it-heading]",
		);
		if (heading) {
			heading.textContent = this.heading;
			heading.hidden = this.lite || !this.heading.trim();
		}
		const pin = this.paper.querySelector<HTMLElement>("[data-post-it-pin]");
		pin?.setAttribute(
			"label",
			`${this.lite ? "Open" : "Fold"} note${this.heading.trim() ? `: ${this.heading}` : ""}`,
		);
		const button = pin?.querySelector("button");
		this.paper
			.querySelectorAll<HTMLElement>("[data-post-it-reset]")
			.forEach((control) => {
				if (this.lite && control.contains(this.ownerDocument.activeElement))
					button?.focus();
				control.hidden = this.lite;
			});
		const header = this.paper.querySelector<HTMLElement>(
			"[data-post-it-header]",
		);
		if (header) header.tabIndex = this.lite ? -1 : 0;
		if (this.lite && this.ownerDocument.activeElement === header)
			button?.focus();
		if (this.lite && this.drag?.handle.hasAttribute("data-post-it-header"))
			this.finishDrag(true);
		button?.setAttribute("aria-expanded", String(!this.lite));
		button?.setAttribute("aria-controls", this.contentId);
		if (this.content) {
			if (this.lite && this.content.contains(this.ownerDocument.activeElement))
				button?.focus();
			this.content.hidden = this.lite;
		}
		this.keepVisible();
	}
	/** Promotes the note above stacking contexts without reparenting author nodes or blocking the page. */
	private float(): void {
		if (!this.isConnected) return;
		// Snapshot sibling notes before any leaves normal flow, preserving their distinct starting positions.
		this.ownerDocument.querySelectorAll("tp-post-it").forEach((note) => {
			const rect = note.getBoundingClientRect();
			if (!note.initialPosition) {
				const offset = note.getScrollOffset();
				note.initialPosition = {
					x: rect.left + offset.x,
					y: rect.top + offset.y,
				};
			}
			if (!note.position) note.position = { x: rect.left, y: rect.top };
		});
		const bounds = this.getBoundingClientRect();
		const initial = this.position ?? { x: bounds.left, y: bounds.top };
		this.setAttribute("data-post-it-floating", "");
		if (typeof this.showPopover === "function") {
			this.setAttribute("popover", "manual");
			this.showPopover();
		}
		this.position = initial;
		this.keepVisible();
		if (!this.anchor) {
			this.attach(this.parentElement);
			this.initialAnchor ??= this.anchor;
		}
		if (this.layoutFrame === null) this.trackLayout();
	}
	/** Attaches the pin to the element beneath it, ignoring all floating notes. */
	private attach(fallback: Element | null = null): void {
		const pin =
			this.querySelector("[data-post-it-pin]")?.getBoundingClientRect();
		if (!pin?.width || !pin.height) return;
		const x = pin.left + pin.width / 2;
		const y = pin.top + pin.height / 2;
		const element =
			fallback ??
			this.ownerDocument
				.elementsFromPoint(x, y)
				.find((candidate) => !candidate.closest("tp-post-it"));
		if (!element) return;
		const rect = element.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		this.anchor = { element, x: x - rect.left, y: y - rect.top };
	}
	/** Aligns the pin with its target after scrolling, resizing, reflow or folding. */
	private followAnchor(): void {
		if (!this.anchor || this.drag || !this.position) return;
		if (!this.anchor.element.isConnected) {
			this.anchor = null;
			return;
		}
		const target = this.anchor.element.getBoundingClientRect();
		const pin =
			this.querySelector("[data-post-it-pin]")?.getBoundingClientRect();
		if (!pin || !target.width || !pin.width) return;
		const bounds = this.getBoundingClientRect();
		const viewportWidth =
			this.ownerDocument.defaultView?.innerWidth ?? bounds.right;
		const desiredLeft =
			this.position.x +
			target.left +
			this.anchor.x -
			(pin.left + pin.width / 2);
		// Retain the stored attachment while fitting the paper into a narrower viewport.
		const fittedLeft = Math.max(
			8,
			Math.min(desiredLeft, viewportWidth - bounds.width - 8),
		);
		const x = fittedLeft - this.position.x;
		const y = target.top + this.anchor.y - (pin.top + pin.height / 2);
		if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) return;
		this.position.x += x;
		this.position.y += y;
		this.keepVisible();
	}
	/** Watches geometry only while connected, including animated sidebar transitions. */
	private readonly trackLayout = (): void => {
		if (!this.isConnected) {
			this.layoutFrame = null;
			return;
		}
		this.followAnchor();
		this.layoutFrame =
			this.ownerDocument.defaultView?.requestAnimationFrame(this.trackLayout) ??
			null;
	};
	/** Restores the loading position in the document without changing content or folded state. */
	public resetPosition(): void {
		if (!this.initialPosition) this.float();
		if (!this.initialPosition) return;
		this.finishDrag();
		this.scrollOffset = this.getScrollOffset();
		this.position = {
			x: this.initialPosition.x - this.scrollOffset.x,
			y: this.initialPosition.y - this.scrollOffset.y,
		};
		this.keepVisible();
		this.anchor = this.initialAnchor;
		this.followAnchor();
		this.dispatchEvent(new CustomEvent("tp-post-it-move", { bubbles: true }));
	}
	/** Places the note in viewport pixels and attaches its pin to the underlying element. */
	public moveTo(x: number, y: number): void {
		if (!Number.isFinite(x) || !Number.isFinite(y)) return;
		const viewport = this.ownerDocument.defaultView;
		if (!viewport) return;
		const bounds = this.getBoundingClientRect();
		this.position = {
			x: Math.max(8, Math.min(x, viewport.innerWidth - bounds.width - 8)),
			y: Math.max(8, Math.min(y, viewport.innerHeight - bounds.height - 8)),
		};
		this.keepVisible();
		if (!this.drag) this.attach();
	}
	/** Paints the position without pulling an offscreen note back into the viewport. */
	private readonly keepVisible = (): void => {
		if (!this.position) return;
		this.style.setProperty("--tp-post-it-x", `${this.position.x}px`);
		this.style.setProperty("--tp-post-it-y", `${this.position.y}px`);
	};
	/** Includes nested scrolling regions, without counting the document scroller twice. */
	private getScrollOffset(): { x: number; y: number } {
		const viewport = this.ownerDocument.defaultView;
		const offset = { x: viewport?.scrollX ?? 0, y: viewport?.scrollY ?? 0 };
		let ancestor = this.parentElement;
		while (ancestor) {
			if (ancestor !== this.ownerDocument.scrollingElement) {
				offset.x += ancestor.scrollLeft;
				offset.y += ancestor.scrollTop;
			}
			ancestor = ancestor.parentElement;
		}
		return offset;
	}
	/** Keeps the dropped note aligned with author content, including inside scrollable panels. */
	private readonly followScroll = (): void => {
		const offset = this.getScrollOffset();
		const x = this.scrollOffset.x - offset.x;
		const y = this.scrollOffset.y - offset.y;
		this.scrollOffset = offset;
		if (this.anchor && !this.drag) {
			this.followAnchor();
			return;
		}
		if (this.position) {
			this.position.x += x;
			this.position.y += y;
			if (this.drag) {
				this.drag.x += x;
				this.drag.y += y;
			}
			this.keepVisible();
		}
	};
	/** Drags the header surface or lite pin without intercepting header buttons. */
	private readonly startDrag = (event: PointerEvent): void => {
		const handle = event.currentTarget;
		if (!(handle instanceof HTMLElement) || event.button !== 0 || this.drag)
			return;
		const isPin = handle.hasAttribute("data-post-it-pin");
		if (
			!isPin &&
			event.target instanceof Element &&
			event.target.closest("tp-icon-button, button, a, input")
		)
			return;
		this.suppressPinClick = false;
		if (this.lite !== isPin) return;
		event.preventDefault();
		if (typeof this.hidePopover === "function" && this.matches(":popover-open"))
			this.hidePopover();
		this.float();
		if (!this.position) return;
		if (isPin) handle.querySelector("button")?.focus();
		else handle.focus();
		this.drag = {
			id: event.pointerId,
			clientX: event.clientX,
			clientY: event.clientY,
			...this.position,
			handle,
			moved: false,
		};
		handle.setPointerCapture?.(event.pointerId);
		this.setAttribute("data-post-it-dragging", "");
		this.ownerDocument.addEventListener("pointermove", this.moveDrag);
		this.ownerDocument.addEventListener("pointerup", this.endDrag);
		this.ownerDocument.addEventListener("pointercancel", this.cancelDrag);
		this.ownerDocument.addEventListener("keydown", this.cancelWithEscape);
		this.ownerDocument.defaultView?.addEventListener("blur", this.cancelOnBlur);
	};
	/** Updates continuous mouse, pen or touch movement in viewport coordinates. */
	private readonly moveDrag = (event: PointerEvent): void => {
		if (!this.drag || event.pointerId !== this.drag.id) return;
		if (
			!this.drag.moved &&
			this.drag.handle.hasAttribute("data-post-it-pin") &&
			Math.hypot(
				event.clientX - this.drag.clientX,
				event.clientY - this.drag.clientY,
			) < 4
		)
			return;
		this.drag.moved = true;
		this.moveTo(
			this.drag.x + event.clientX - this.drag.clientX,
			this.drag.y + event.clientY - this.drag.clientY,
		);
	};
	/** Commits the active pointer movement. */
	private readonly endDrag = (event: PointerEvent): void => {
		if (event.pointerId === this.drag?.id) this.finishDrag();
	};
	/** Cancels an interrupted pointer gesture and restores its starting position. */
	private readonly cancelDrag = (event: PointerEvent): void => {
		if (event.pointerId === this.drag?.id) this.finishDrag(true);
	};
	/** Escape is a drag cancellation, not a dismissal of the note. */
	private readonly cancelWithEscape = (event: KeyboardEvent): void => {
		if (event.key === "Escape") {
			event.preventDefault();
			this.finishDrag(true);
		}
	};
	/** Losing the browser window cancels a gesture rather than leaving drag listeners active. */
	private readonly cancelOnBlur = (): void => this.finishDrag(true);
	/** Releases pointer capture and all document-level listeners. */
	private finishDrag(cancel = false): void {
		const drag = this.drag;
		this.drag = null;
		if (drag) {
			if (drag.handle.hasAttribute("data-post-it-pin"))
				this.suppressPinClick = drag.moved || cancel;
			if (cancel) {
				this.position = { x: drag.x, y: drag.y };
				this.keepVisible();
			}
			if (drag.handle.hasPointerCapture?.(drag.id))
				drag.handle.releasePointerCapture(drag.id);
			if (!cancel && drag.moved && this.isConnected) {
				this.attach();
				this.dispatchEvent(
					new CustomEvent("tp-post-it-move", { bubbles: true }),
				);
			}
		}
		this.removeAttribute("data-post-it-dragging");
		this.ownerDocument.removeEventListener("pointermove", this.moveDrag);
		this.ownerDocument.removeEventListener("pointerup", this.endDrag);
		this.ownerDocument.removeEventListener("pointercancel", this.cancelDrag);
		this.ownerDocument.removeEventListener("keydown", this.cancelWithEscape);
		this.ownerDocument.defaultView?.removeEventListener(
			"blur",
			this.cancelOnBlur,
		);
	}
	/** Arrow keys move a focused header or lite pin; Shift enables fine positioning. */
	private readonly moveWithKeyboard = (event: KeyboardEvent): void => {
		const handle = event.currentTarget;
		if (
			handle instanceof HTMLElement &&
			handle.hasAttribute("data-post-it-header") &&
			event.target !== handle
		)
			return;
		if (
			!(handle instanceof HTMLElement) ||
			this.lite !== handle.hasAttribute("data-post-it-pin")
		)
			return;
		const directions: Record<string, [number, number]> = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, -1],
			ArrowDown: [0, 1],
		};
		const direction = directions[event.key];
		if (!direction || event.altKey || event.ctrlKey || event.metaKey) return;
		event.preventDefault();
		this.float();
		if (!this.position) return;
		const step = event.shiftKey ? 1 : 10;
		this.moveTo(
			this.position.x + direction[0] * step,
			this.position.y + direction[1] * step,
		);
		this.dispatchEvent(new CustomEvent("tp-post-it-move", { bubbles: true }));
	};
	/** Toggles the reflected lite attribute; the pin remains available in both states. */
	public toggle(): void {
		this.lite = !this.lite;
		this.dispatchEvent(
			new CustomEvent("tp-post-it-toggle", {
				bubbles: true,
				detail: { lite: this.lite },
			}),
		);
	}
}

if (!customElements.get("tp-post-it"))
	customElements.define("tp-post-it", TpPostIt);

declare global {
	interface HTMLElementTagNameMap {
		"tp-post-it": TpPostIt;
	}
}
