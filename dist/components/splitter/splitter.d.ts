/**
 * @module components/splitter
 * @summary Splitter component with two resizable panels.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * @summary API documentation summary.
 */
type TpSplitterAxis = "horizontal" | "vertical";
/**
 * @summary Splitter layout with two resizable panels.
 * @tagname tp-splitter
 * @attr {string} axis = "horizontal" - Split direction (`horizontal` or `vertical`).
 * @attr {string} position = "50%" - Divider position as a percentage.
 * @attr {string} storage-key = "" - Optional localStorage key used to save and restore the divider position. Empty by default: persistence is disabled. Use a distinct key for each independent splitter.
 * @cssprop [--tp-splitter-position=50%] Divider position.
 * @cssprop [--tp-splitter-divider-color=var(--tp-brand-fill-mid, #2563eb)] Divider handle color.
 * @cssprop [--tp-splitter-divider-size=0.75rem] Divider hit area size.
 * @event tp-splitter-change Emitted when the divider position changes.
 * @eventdetail tp-splitter-change { axis: "horizontal" | "vertical"; position: string; storageKey: string }
 * @accessibility Exposes the divider as an adjustable ARIA separator with its current numeric value.
 * @accessibility Supports equivalent pointer and keyboard resizing.
 * @accessibilityresponsibility Give the surrounding content headings or labels that identify both panels.
 * @keyboard {Arrow keys} Moves the divider by 1%, or by 10% while Shift is held.
 * @keyboard {Home / End} Moves the divider to its minimum or maximum position.
 * @example
 * ```html
 * <tp-splitter position="40%">
 *   <dl>
 *     <dt>start</dt><dd><tp-box>Drag the divider to resize this panel.</tp-box></dd>
 *     <dt>end</dt><dd><tp-box>This panel uses the remaining space.</tp-box></dd>
 *   </dl>
 * </tp-splitter>
 * ```
 */
export declare class TpSplitter extends TpBase {
    /**
     * @summary Component global style ID.
     * @internal
     */
    private static readonly styleId;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private dlEl;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private dividerEl;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private initialPosition;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private instanceId;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private readonly handlePointerMove;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private readonly handlePointerUp;
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary Split direction.
     * @attr axis
     * @default horizontal
     */
    get axis(): TpSplitterAxis;
    /**
     * @summary Divider position as a percentage.
     * @param value Parameter.
     */
    set axis(value: TpSplitterAxis);
    /**
     * @summary Divider position as a percentage.
     * @attr position
     * @default 50%
     */
    get position(): string;
    /**
     * @summary Sets the divider position as a percentage.
     * @param value Parameter.
     */
    set position(value: string);
    /**
     * @summary Optional localStorage key; an empty value disables position persistence.
     * @attr storage-key
     * @default ""
     */
    get storageKey(): string;
    /**
     * @summary Sets the local storage key used to persist the divider position.
     * @param value Parameter.
     */
    set storageKey(value: string);
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @param name Parameter.
     * @internal
     */
    protected attributeChangedCallback(name: string): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary Restores the divider to its initial position.
     */
    reset(): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureStyles;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureInstanceId;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureStructure;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private beginDrag;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private endDrag;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private update;
    /**
     * @summary Normalizes `axis` to a valid value and reflects default when omitted.
     * @returns True when normalization changed the attribute.
     * @internal
     */
    private normalizeAxisAttribute;
    /**
     * @summary API documentation summary.
     * @param event Parameter.
     * @internal
     */
    private updatePositionFromPointer;
    /**
     * @summary Updates the divider position from a keyboard command.
     * @param event Keyboard event emitted by the divider.
     * @internal
     */
    private updatePositionFromKeyboard;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     * @returns Return value.
     * @internal
     */
    private clampPercentage;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private loadPosition;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private savePosition;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private dispatchChangeEvent;
}
/**
 * @summary API documentation summary.
 * @internal
 */
declare global {
    interface HTMLElementTagNameMap {
        "tp-splitter": TpSplitter;
    }
}
export {};
