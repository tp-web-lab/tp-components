/**
 * @module components/dragdrop
 * @summary Generic drag-and-drop controller for content.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
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
export declare class TpDragdrop extends TpBase {
    /** Optional owning-component integration; standalone selector behavior is unchanged. */
    private integration;
    /** Returns the component-owned pointer adapter, if configured. */
    get adapter(): TpDragDropAdapter | null;
    /** Installs a pointer adapter; the owner retains item attributes and keyboard handling. */
    set adapter(value: TpDragDropAdapter | null);
    /**
     * Shared stylesheet identifier.
     *
     * @summary Identifies the component's shared stylesheet.
     * @internal
     */
    private static readonly styleId;
    /**
     * Observed root element.
     *
     * @summary References the observed root.
     * @internal
     */
    private rootEl;
    /**
     * Source element of the current drag.
     *
     * @summary References the dragged source.
     * @internal
     */
    private sourceEl;
    /**
     * Current target element.
     *
     * @summary References the current drop target.
     * @internal
     */
    private targetEl;
    /**
     * Current drop position.
     *
     * @summary Stores the computed logical drop position.
     * @internal
     */
    private position;
    /** Live region used for keyboard drag-and-drop announcements. */
    private statusEl;
    /**
     * Declares the observed attributes.
     *
     * @summary Lists the observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * CSS selector for the observed root.
     *
     * @attr root
     */
    get root(): string;
    /** Sets the observed-root selector, or removes it when empty. */
    set root(value: string);
    /**
     * CSS selector for draggable items and drop targets.
     *
     * @attr items
     */
    get items(): string;
    /** Sets the item selector, or removes it when empty. */
    set items(value: string);
    /**
     * Optional CSS selector for a drag handle.
     *
     * @attr handle
     */
    get handle(): string;
    /** Sets the optional drag-handle selector, or removes it when empty. */
    set handle(value: string);
    /**
     * Initializes the component.
     *
     * @summary Prepares the observed root and event listeners.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Handles attribute changes.
     *
     * @summary Reconfigures the observed root.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Cleans up the disconnected component.
     *
     * @summary Removes event listeners and clears drag state.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Binds the observed root.
     *
     * @summary Resolves the configured root and attaches event listeners.
     * @internal
     */
    private bindRoot;
    /**
     * Removes event listeners from the observed root.
     *
     * @summary Cleans up the observed root.
     * @internal
     */
    private unbindRoot;
    /**
     * Updates the items' `draggable` attributes.
     *
     * @summary Prepares the configured draggable elements.
     * @internal
     */
    private updateItems;
    /** Creates the polite live region next to the managed items. */
    private ensureStatus;
    /** Returns the item itself or its configured keyboard handle. */
    private getKeyboardTarget;
    /** Returns all currently configured draggable items. */
    private getItems;
    /** Returns a concise item name for live announcements. */
    private getItemName;
    /** Updates the keyboard workflow announcement. */
    private announce;
    /**
     * Resolves a managed item from an event.
     *
     * @summary Returns the element matching the `items` selector.
     * @param event Native event.
     * @returns Resolved element or `null`.
     * @internal
     */
    private getItemFromEvent;
    /**
     * Checks whether the current event can start a drag.
     *
     * @summary Checks the optional drag handle.
     * @param event Native dragstart event.
     * @returns `true` when dragging is allowed.
     * @internal
     */
    private canStartFromEvent;
    /**
     * Calculates the drop position relative to the hovered item.
     *
     * @summary Determines whether the position is `before`, `inside` or `after`.
     * @param event Native dragover event.
     * @param item Target element.
     * @returns Logical drop position.
     * @internal
     */
    private getDropPosition;
    /**
     * Handles the start of a drag.
     *
     * @summary Emits the drag-start event.
     * @param event Native event.
     * @internal
     */
    private readonly handleDragStart;
    /**
     * Handles entry into a drop target.
     *
     * @summary Updates the drop target and position.
     * @param event Native event.
     * @internal
     */
    private readonly handleDragEnter;
    /**
     * Handles dragging over a target.
     *
     * @summary Updates the current target and drop position.
     * @param event Native event.
     * @internal
     */
    private readonly handleDragOver;
    /**
     * Handles the final drop.
     *
     * @summary Emits the application drop event.
     * @param event Native event.
     * @internal
     */
    private readonly handleDrop;
    /**
     * Handles the end of a drag.
     *
     * @summary Ends the current drag.
     * @internal
     */
    private readonly handleDragEnd;
    /** Implements the keyboard equivalent of the pointer drag workflow. */
    private readonly handleKeyDown;
    /**
     * Emits the drag-over event.
     *
     * @summary Notifies consumers of the current target and position.
     * @internal
     */
    private emitOver;
    /**
     * Resets the internal state.
     *
     * @summary Clears the current source, target and position.
     * @internal
     */
    private clearState;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-dragdrop": TpDragdrop;
    }
}
