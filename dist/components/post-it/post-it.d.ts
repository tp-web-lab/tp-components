/** @module components/post-it */
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
import { TpBase } from "../base/base.js";
import { TpColor } from "../color/color.js";
import "../box/box.js";
import "../icon-button/icon-button.js";
/** Supported paper colors from the shared palette. */
export type TpPostItColor = (typeof TpColor.presets)[number] extends `tp-${infer Color}` ? Color : never;
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
export declare class TpPostIt extends TpBase {
    /** Available paper colors, derived from the shared color controller palette. */
    static readonly colors: readonly ("default" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "glaz" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "zinc" | "ivory" | "stone")[];
    /** Returns a copy of the current pin attachment for annotation persistence. */
    get attachment(): {
        element: Element;
        x: number;
        y: number;
    } | null;
    /** Restores a pin attachment using pixel offsets from the target's top-left corner. */
    attachTo(element: Element, x: number, y: number, initial?: boolean): void;
    /** Unique identifiers connect each pin with its own content. */
    private static nextId;
    /** Stable target for the pin's aria-controls relationship. */
    private readonly contentId;
    /** Current viewport coordinates, adjusted with the underlying document's scrolling. */
    private position;
    /** Original document position, captured once before the note leaves author layout. */
    private initialPosition;
    /** Element-relative pin attachment, independent of sidebar and viewport layout. */
    private anchor;
    /** Initial attachment used by Reset. */
    private initialAnchor;
    /** Frame tracking also detects translations that do not resize the target. */
    private layoutFrame;
    /** Last cumulative scroll offset of the window and author containers. */
    private scrollOffset;
    /** Deferred promotion lets author layout settle before capturing the initial position. */
    private floatingTimer;
    /** Prevents the synthetic click following a pin drag from opening the note. */
    private suppressPinClick;
    /** Active gesture, including the original position used by Escape. */
    private drag;
    /** Paper container reused across attribute changes. */
    private paper;
    /** Preserves author nodes, event handlers and nested component state. */
    private content;
    /** Moves content inserted after custom-element connection into the paper. */
    private readonly observer;
    /** Presentation attributes, including the shared base attributes. */
    static get observedAttributes(): string[];
    /** Resolved shared palette color. */
    get color(): TpPostItColor;
    /** Changes the paper color. */
    set color(value: TpPostItColor);
    /** Optional heading, rendered as text rather than markup. */
    get heading(): string;
    /** Changes the heading without rebuilding author content. */
    set heading(value: string);
    /** Whether only the pin is displayed; presence alone enables the folded state. */
    get lite(): boolean;
    /** Folds or expands the note while preserving its content. */
    set lite(value: boolean);
    /** Opacity of the paper and its controls, including the folded pin. */
    get opacity(): number;
    /** Changes transparency without replacing author content. */
    set opacity(value: number);
    /** Rotation bounded to keep the paper readable. */
    get rotation(): number;
    /** Changes the paper angle in degrees. */
    set rotation(value: number);
    /** Initializes the note and installs each stylesheet only once through the base class. */
    protected connectedCallback(): void;
    /** Stops watching detached elements while retaining their content for reconnection. */
    disconnectedCallback(): void;
    /** Refreshes only local presentation attributes. */
    protected attributeChangedCallback(name: string): void;
    /** Creates library-based chrome once and moves, rather than clones, all author nodes. */
    private arrange;
    /** Applies theme tokens and disclosure state without replacing the focused pin or content. */
    private update;
    /** Promotes the note above stacking contexts without reparenting author nodes or blocking the page. */
    private float;
    /** Attaches the pin to the element beneath it, ignoring all floating notes. */
    private attach;
    /** Aligns the pin with its target after scrolling, resizing, reflow or folding. */
    private followAnchor;
    /** Watches geometry only while connected, including animated sidebar transitions. */
    private readonly trackLayout;
    /** Restores the loading position in the document without changing content or folded state. */
    resetPosition(): void;
    /** Places the note in viewport pixels and attaches its pin to the underlying element. */
    moveTo(x: number, y: number): void;
    /** Paints the position without pulling an offscreen note back into the viewport. */
    private readonly keepVisible;
    /** Includes nested scrolling regions, without counting the document scroller twice. */
    private getScrollOffset;
    /** Keeps the dropped note aligned with author content, including inside scrollable panels. */
    private readonly followScroll;
    /** Drags the header surface or lite pin without intercepting header buttons. */
    private readonly startDrag;
    /** Updates continuous mouse, pen or touch movement in viewport coordinates. */
    private readonly moveDrag;
    /** Commits the active pointer movement. */
    private readonly endDrag;
    /** Cancels an interrupted pointer gesture and restores its starting position. */
    private readonly cancelDrag;
    /** Escape is a drag cancellation, not a dismissal of the note. */
    private readonly cancelWithEscape;
    /** Losing the browser window cancels a gesture rather than leaving drag listeners active. */
    private readonly cancelOnBlur;
    /** Releases pointer capture and all document-level listeners. */
    private finishDrag;
    /** Arrow keys move a focused header or lite pin; Shift enables fine positioning. */
    private readonly moveWithKeyboard;
    /** Toggles the reflected lite attribute; the pin remains available in both states. */
    toggle(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-post-it": TpPostIt;
    }
}
