/**
 * @module components/dragdrop
 * @summary Generic drag-and-drop controller for content.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./dragdrop.css?inline";

/**
 * Logical drop position relative to a target.
 *
 * @summary Represents the insertion position of a drop.
 */
export type TpDragDropPosition = "before" | "inside" | "after";

/** Programmatic integration for components that own their items and keyboard behavior. */
export interface TpDragDropAdapter {
	/** Local event root, without requiring a document-wide selector or ID. */
	root: HTMLElement;
	/** Resolves an event to an item owned by this integration. */
	getItem(event: Event): HTMLElement | null;
	/** Checks application-specific source permissions and native drag prerequisites. */
	canStart(event: DragEvent): boolean;
	/** Checks application-specific target permissions. */
	canDrop(target: HTMLElement): boolean;
	/** Computes the application's insertion zones. */
	getPosition(event: DragEvent, target: HTMLElement): TpDragDropPosition;
	/** Supplies the native text/plain drag payload. */
	getData(source: HTMLElement): string;
}

/**
 * Drag-start event detail.
 *
 * @summary Describes the source element of a drag.
 */
export interface TpDragDropStartDetail {
	/**
	 * Source element being moved.
	 */
	source: HTMLElement;
}

/**
 * Drag-over event detail.
 *
 * @summary Describes the current drop target.
 */
export interface TpDragDropOverDetail {
	/**
	 * Source element being moved.
	 */
	source: HTMLElement;

	/**
	 * Target element currently under the pointer.
	 */
	target: HTMLElement | null;

	/**
	 * Logical drop position.
	 */
	position: TpDragDropPosition | null;
}

/**
 * Final drop event detail.
 *
 * @summary Describes the completed drop.
 */
export interface TpDragDropDropDetail {
	/**
	 * Source element being moved.
	 */
	source: HTMLElement;

	/**
	 * Drop target element.
	 */
	target: HTMLElement | null;

	/**
	 * Logical drop position.
	 */
	position: TpDragDropPosition | null;
}

/**
 * `<tp-dragdrop>` centralizes native drag-and-drop handling
 * using CSS selectors.
 *
 * The component does not move application content itself:
 * it only emits structured events.
 *
 * @summary provides a generic drag-and-drop controller.
 * @tagname tp-dragdrop
 *
 * @attr {string} root = "" - CSS selector for the observed root. Required to enable interaction.
 * @attr {string} items = "" - CSS selector for draggable items and drop targets within the root.
 * @attr {string} handle = "" - Optional CSS selector for a drag handle.
 *
 * @event tp-dragdrop-start Emitted when a drag starts.
 * @event tp-dragdrop-over Emitted when the drop target or position changes.
 * @event tp-dragdrop-drop Emitted when an item is dropped; consumers decide how to move it.
 * @event tp-dragdrop-end Emitted when a drag ends or a keyboard drag is cancelled.
 * @accessibility Adds a keyboard grab, navigation, drop and cancellation workflow to the configured items.
 * @accessibility Announces keyboard drag-and-drop state changes through a polite live region.
 * @accessibilityresponsibility Give each draggable item a concise accessible name.
 * @keyboard {Enter / Space} Grabs the focused item, then drops it at the selected position.
 * @keyboard {Arrow keys} Selects the previous or next item as the drop target.
 * @keyboard {Escape} Cancels the current keyboard drag.
 * @example
 * <tp-box id="dragdrop-board" data-dragdrop-demo data-allow-script>
 *   <p>Drag a task to <strong>To do</strong> or <strong>Done</strong>, including an empty column. The Move button sends a task to the other column without dragging.</p>
 *   <p>Keyboard: focus a card, press Enter, use the arrow keys to choose another card, then press Enter to drop before or after it. Escape cancels.</p>
 *   <tp-grid min-width="16rem" gap="1rem">
 *     <tp-box data-zone="To do" role="group" aria-label="To do" style="min-height: 12rem;">
 *       <h3>To do</h3>
 *       <tp-stack gap="0.5rem" data-tasks>
 *         <tp-box data-task aria-label="Write the introduction"><p>Write the introduction</p><tp-button data-move size="s" aria-label="Move Write the introduction to the other column">Move</tp-button></tp-box>
 *         <tp-box data-task aria-label="Review the examples"><p>Review the examples</p><tp-button data-move size="s" aria-label="Move Review the examples to the other column">Move</tp-button></tp-box>
 *       </tp-stack>
 *     </tp-box>
 *     <tp-box data-zone="Done" role="group" aria-label="Done" style="min-height: 12rem;">
 *       <h3>Done</h3>
 *       <tp-stack gap="0.5rem" data-tasks>
 *         <tp-box data-task aria-label="Choose a title"><p>Choose a title</p><tp-button data-move size="s" aria-label="Move Choose a title to the other column">Move</tp-button></tp-box>
 *       </tp-stack>
 *     </tp-box>
 *   </tp-grid>
 *   <p data-demo-status role="status" aria-live="polite">Move a task to change its column.</p>
 *   <tp-dragdrop root="#dragdrop-board" items="[data-task]"></tp-dragdrop>
 *   <script src="/docs/components/dragdrop/examples/task-board.js"></script>
 * </tp-box>
 */
export class TpDragdrop extends TpBase {
	/** Optional owning-component integration; standalone selector behavior is unchanged. */
	private integration: TpDragDropAdapter | null = null;

	/** Returns the component-owned pointer adapter, if configured. */
	public get adapter(): TpDragDropAdapter | null {
		return this.integration;
	}

	/** Installs a pointer adapter; the owner retains item attributes and keyboard handling. */
	public set adapter(value: TpDragDropAdapter | null) {
		this.clearState();
		this.integration = value;
		if (this.isConnected) {
			this.bindRoot();
			this.updateItems();
		}
	}
	/**
	 * Shared stylesheet identifier.
	 *
	 * @summary Identifies the component's shared stylesheet.
	 * @internal
	 */
	private static readonly styleId = "tp-dragdrop-styles";

	/**
	 * Observed root element.
	 *
	 * @summary References the observed root.
	 * @internal
	 */
	private rootEl: HTMLElement | null = null;

	/**
	 * Source element of the current drag.
	 *
	 * @summary References the dragged source.
	 * @internal
	 */
	private sourceEl: HTMLElement | null = null;

	/**
	 * Current target element.
	 *
	 * @summary References the current drop target.
	 * @internal
	 */
	private targetEl: HTMLElement | null = null;

	/**
	 * Current drop position.
	 *
	 * @summary Stores the computed logical drop position.
	 * @internal
	 */
	private position: TpDragDropPosition | null = null;

	/** Live region used for keyboard drag-and-drop announcements. */
	private statusEl: HTMLSpanElement | null = null;

	/**
	 * Declares the observed attributes.
	 *
	 * @summary Lists the observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["root", "items", "handle"];
	}

	/**
	 * CSS selector for the observed root.
	 *
	 * @attr root
	 */
	public get root(): string {
		return this.getAttribute("root") ?? "";
	}

	/** Sets the observed-root selector, or removes it when empty. */
	public set root(value: string) {
		if (value === "") {
			this.removeAttribute("root");
			return;
		}

		this.setAttribute("root", value);
	}

	/**
	 * CSS selector for draggable items and drop targets.
	 *
	 * @attr items
	 */
	public get items(): string {
		return this.getAttribute("items") ?? "";
	}

	/** Sets the item selector, or removes it when empty. */
	public set items(value: string) {
		if (value === "") {
			this.removeAttribute("items");
			return;
		}

		this.setAttribute("items", value);
	}

	/**
	 * Optional CSS selector for a drag handle.
	 *
	 * @attr handle
	 */
	public get handle(): string {
		return this.getAttribute("handle") ?? "";
	}

	/** Sets the optional drag-handle selector, or removes it when empty. */
	public set handle(value: string) {
		if (value === "") {
			this.removeAttribute("handle");
			return;
		}

		this.setAttribute("handle", value);
	}

	/**
	 * Initializes the component.
	 *
	 * @summary Prepares the observed root and event listeners.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpDragdrop.styleId, style);
		this.bindRoot();
		this.updateItems();
	}

	/**
	 * Handles attribute changes.
	 *
	 * @summary Reconfigures the observed root.
	 * @internal
	 */
	protected attributeChangedCallback(): void {
		if (!this.isConnected) {
			return;
		}

		this.bindRoot();
		this.updateItems();
	}

	/**
	 * Cleans up the disconnected component.
	 *
	 * @summary Removes event listeners and clears drag state.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.unbindRoot();
		this.clearState();
	}

	/**
	 * Binds the observed root.
	 *
	 * @summary Resolves the configured root and attaches event listeners.
	 * @internal
	 */
	private bindRoot(): void {
		this.unbindRoot();

		if (this.integration === null && this.root === "") {
			return;
		}

		const root = this.integration?.root ?? document.querySelector(this.root);
		if (!(root instanceof HTMLElement)) {
			return;
		}

		this.rootEl = root;
		this.rootEl.addEventListener("dragstart", this.handleDragStart);
		this.rootEl.addEventListener("dragenter", this.handleDragEnter);
		this.rootEl.addEventListener("dragover", this.handleDragOver);
		this.rootEl.addEventListener("drop", this.handleDrop);
		this.rootEl.addEventListener("dragend", this.handleDragEnd);
		this.rootEl.addEventListener("keydown", this.handleKeyDown);
		if (this.integration === null) this.ensureStatus();
	}

	/**
	 * Removes event listeners from the observed root.
	 *
	 * @summary Cleans up the observed root.
	 * @internal
	 */
	private unbindRoot(): void {
		if (!(this.rootEl instanceof HTMLElement)) {
			return;
		}

		this.rootEl.removeEventListener("dragstart", this.handleDragStart);
		this.rootEl.removeEventListener("dragenter", this.handleDragEnter);
		this.rootEl.removeEventListener("dragover", this.handleDragOver);
		this.rootEl.removeEventListener("drop", this.handleDrop);
		this.rootEl.removeEventListener("dragend", this.handleDragEnd);
		this.rootEl.removeEventListener("keydown", this.handleKeyDown);
		this.statusEl?.remove();
		this.statusEl = null;
		this.rootEl = null;
	}

	/**
	 * Updates the items' `draggable` attributes.
	 *
	 * @summary Prepares the configured draggable elements.
	 * @internal
	 */
	private updateItems(): void {
		if (this.integration !== null) return;
		if (!(this.rootEl instanceof HTMLElement) || this.items === "") {
			return;
		}

		const items = Array.from(this.rootEl.querySelectorAll(this.items)).filter(
			(element): element is HTMLElement => element instanceof HTMLElement,
		);

		for (const item of items) {
			item.setAttribute("draggable", "true");
			const focusTarget = this.getKeyboardTarget(item);
			if (!focusTarget.hasAttribute("tabindex") && focusTarget.tabIndex < 0) {
				focusTarget.tabIndex = 0;
			}
		}
	}

	/** Creates the polite live region next to the managed items. */
	private ensureStatus(): void {
		if (this.rootEl === null || this.statusEl !== null) return;

		const status = document.createElement("span");
		status.className = "tp-dragdrop-status";
		status.setAttribute("role", "status");
		status.setAttribute("aria-live", "polite");
		status.setAttribute("aria-atomic", "true");
		this.rootEl.append(status);
		this.statusEl = status;
	}

	/** Returns the item itself or its configured keyboard handle. */
	private getKeyboardTarget(item: HTMLElement): HTMLElement {
		if (this.handle === "") return item;
		return item.querySelector<HTMLElement>(this.handle) ?? item;
	}

	/** Returns all currently configured draggable items. */
	private getItems(): HTMLElement[] {
		if (this.rootEl === null || this.items === "") return [];
		return Array.from(this.rootEl.querySelectorAll(this.items)).filter(
			(element): element is HTMLElement => element instanceof HTMLElement,
		);
	}

	/** Returns a concise item name for live announcements. */
	private getItemName(item: HTMLElement): string {
		return (
			item.getAttribute("aria-label") ?? item.textContent?.trim() ?? "item"
		);
	}

	/** Updates the keyboard workflow announcement. */
	private announce(message: string): void {
		if (this.statusEl !== null) this.statusEl.textContent = message;
	}

	/**
	 * Resolves a managed item from an event.
	 *
	 * @summary Returns the element matching the `items` selector.
	 * @param event Native event.
	 * @returns Resolved element or `null`.
	 * @internal
	 */
	private getItemFromEvent(event: Event): HTMLElement | null {
		if (this.integration !== null) return this.integration.getItem(event);
		if (this.items === "") {
			return null;
		}

		const target = event.target;
		if (!(target instanceof Element)) {
			return null;
		}

		const item = target.closest(this.items);
		if (!(item instanceof HTMLElement)) {
			return null;
		}

		if (!(this.rootEl instanceof HTMLElement) || !this.rootEl.contains(item)) {
			return null;
		}

		return item;
	}

	/**
	 * Checks whether the current event can start a drag.
	 *
	 * @summary Checks the optional drag handle.
	 * @param event Native dragstart event.
	 * @returns `true` when dragging is allowed.
	 * @internal
	 */
	private canStartFromEvent(event: DragEvent): boolean {
		if (this.integration !== null) return this.integration.canStart(event);
		if (this.handle === "") {
			return true;
		}

		const target = event.target;
		return target instanceof Element && target.closest(this.handle) !== null;
	}

	/**
	 * Calculates the drop position relative to the hovered item.
	 *
	 * @summary Determines whether the position is `before`, `inside` or `after`.
	 * @param event Native dragover event.
	 * @param item Target element.
	 * @returns Logical drop position.
	 * @internal
	 */
	private getDropPosition(
		event: DragEvent,
		item: HTMLElement,
	): TpDragDropPosition {
		if (this.integration !== null)
			return this.integration.getPosition(event, item);
		const rect = item.getBoundingClientRect();
		const offsetY = event.clientY - rect.top;
		const ratio = rect.height > 0 ? offsetY / rect.height : 0.5;

		if (ratio < 0.25) {
			return "before";
		}

		if (ratio > 0.75) {
			return "after";
		}

		return "inside";
	}

	/**
	 * Handles the start of a drag.
	 *
	 * @summary Emits the drag-start event.
	 * @param event Native event.
	 * @internal
	 */
	private readonly handleDragStart = (event: DragEvent): void => {
		// An owning component must not cancel drags belonging to nested components.
		if (this.integration !== null && this.getItemFromEvent(event) === null)
			return;
		if (!this.canStartFromEvent(event)) {
			event.preventDefault();
			return;
		}

		const source = this.getItemFromEvent(event);
		if (!(source instanceof HTMLElement)) {
			return;
		}

		this.sourceEl = source;

		if (event.dataTransfer !== null) {
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData(
				"text/plain",
				this.integration?.getData(source) ?? "",
			);
		}

		this.dispatchEvent(
			new CustomEvent<TpDragDropStartDetail>("tp-dragdrop-start", {
				bubbles: true,
				detail: {
					source,
				},
			}),
		);
	};

	/**
	 * Handles entry into a drop target.
	 *
	 * @summary Updates the drop target and position.
	 * @param event Native event.
	 * @internal
	 */
	private readonly handleDragEnter = (event: DragEvent): void => {
		if (!(this.sourceEl instanceof HTMLElement)) {
			return;
		}

		const target = this.getItemFromEvent(event);
		if (
			!(target instanceof HTMLElement) ||
			this.integration?.canDrop(target) === false
		) {
			return;
		}

		event.preventDefault();

		this.targetEl = target;
		this.position = this.getDropPosition(event, target);
		this.emitOver();
	};

	/**
	 * Handles dragging over a target.
	 *
	 * @summary Updates the current target and drop position.
	 * @param event Native event.
	 * @internal
	 */
	private readonly handleDragOver = (event: DragEvent): void => {
		if (!(this.sourceEl instanceof HTMLElement)) {
			return;
		}

		const target = this.getItemFromEvent(event);
		if (
			!(target instanceof HTMLElement) ||
			this.integration?.canDrop(target) === false
		) {
			return;
		}

		event.preventDefault();

		if (event.dataTransfer !== null) {
			event.dataTransfer.dropEffect = "move";
		}

		this.targetEl = target;
		this.position = this.getDropPosition(event, target);
		this.emitOver();
	};

	/**
	 * Handles the final drop.
	 *
	 * @summary Emits the application drop event.
	 * @param event Native event.
	 * @internal
	 */
	private readonly handleDrop = (event: DragEvent): void => {
		event.preventDefault();

		if (!(this.sourceEl instanceof HTMLElement)) {
			this.clearState();
			return;
		}

		const target = this.getItemFromEvent(event);
		if (target !== null && this.integration?.canDrop(target) === false) {
			this.handleDragEnd();
			return;
		}
		const position =
			target instanceof HTMLElement
				? this.integration !== null
					? (this.position ?? this.getDropPosition(event, target))
					: this.getDropPosition(event, target)
				: null;

		this.dispatchEvent(
			new CustomEvent<TpDragDropDropDetail>("tp-dragdrop-drop", {
				bubbles: true,
				detail: {
					source: this.sourceEl,
					target,
					position,
				},
			}),
		);

		this.clearState();
	};

	/**
	 * Handles the end of a drag.
	 *
	 * @summary Ends the current drag.
	 * @internal
	 */
	private readonly handleDragEnd = (): void => {
		this.dispatchEvent(
			new CustomEvent("tp-dragdrop-end", {
				bubbles: true,
			}),
		);

		this.clearState();
	};

	/** Implements the keyboard equivalent of the pointer drag workflow. */
	private readonly handleKeyDown = (event: KeyboardEvent): void => {
		if (this.integration !== null) return;
		const item = this.getItemFromEvent(event);
		if (item === null) return;

		if (event.key === "Escape" && this.sourceEl !== null) {
			event.preventDefault();
			this.announce(`Move cancelled for ${this.getItemName(this.sourceEl)}.`);
			this.dispatchEvent(new CustomEvent("tp-dragdrop-end", { bubbles: true }));
			this.clearState();
			return;
		}

		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			if (this.sourceEl === null) {
				this.sourceEl = item;
				item.setAttribute("data-tp-dragdrop-keyboard-source", "");
				this.announce(
					`${this.getItemName(item)} grabbed. Use arrow keys to choose a position, then press Enter or Space to drop.`,
				);
				this.dispatchEvent(
					new CustomEvent<TpDragDropStartDetail>("tp-dragdrop-start", {
						bubbles: true,
						detail: { source: item },
					}),
				);
				return;
			}

			if (this.targetEl === null || this.position === null) return;
			const source = this.sourceEl;
			const target = this.targetEl;
			const position = this.position;
			this.dispatchEvent(
				new CustomEvent<TpDragDropDropDetail>("tp-dragdrop-drop", {
					bubbles: true,
					detail: { source, target, position },
				}),
			);
			this.announce(
				`${this.getItemName(source)} dropped ${position} ${this.getItemName(target)}.`,
			);
			this.dispatchEvent(new CustomEvent("tp-dragdrop-end", { bubbles: true }));
			this.clearState();
			return;
		}

		if (
			this.sourceEl === null ||
			!["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(event.key)
		) {
			return;
		}

		event.preventDefault();
		const items = this.getItems();
		const current = this.targetEl ?? this.sourceEl;
		const currentIndex = items.indexOf(current);
		const forwards = event.key === "ArrowDown" || event.key === "ArrowRight";
		const targetIndex = Math.min(
			items.length - 1,
			Math.max(0, currentIndex + (forwards ? 1 : -1)),
		);
		const target = items[targetIndex];
		if (target === undefined || target === this.sourceEl) return;

		this.targetEl = target;
		this.position = forwards ? "after" : "before";
		this.getKeyboardTarget(target).focus();
		this.announce(
			`Drop ${this.getItemName(this.sourceEl)} ${this.position} ${this.getItemName(target)}.`,
		);
		this.emitOver();
	};

	/**
	 * Emits the drag-over event.
	 *
	 * @summary Notifies consumers of the current target and position.
	 * @internal
	 */
	private emitOver(): void {
		if (!(this.sourceEl instanceof HTMLElement)) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<TpDragDropOverDetail>("tp-dragdrop-over", {
				bubbles: true,
				detail: {
					source: this.sourceEl,
					target: this.targetEl,
					position: this.position,
				},
			}),
		);
	}

	/**
	 * Resets the internal state.
	 *
	 * @summary Clears the current source, target and position.
	 * @internal
	 */
	private clearState(): void {
		this.sourceEl?.removeAttribute("data-tp-dragdrop-keyboard-source");
		this.sourceEl = null;
		this.targetEl = null;
		this.position = null;
	}
}

if (!customElements.get("tp-dragdrop")) {
	customElements.define("tp-dragdrop", TpDragdrop);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-dragdrop": TpDragdrop;
	}
}
