/**
 * @module components/tooltip
 * @summary Tooltip component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpOverlayElement } from "../overlay/overlay.js";
type TpTooltipPlacement = "top" | "end" | "bottom" | "start";
/**
 * The custom `<tp-tooltip>` element displays anchored tooltip content.
 *
 * Exemple :
 *
 * ```html
 * <button id="save-button">Save</button>
 * <tp-tooltip anchor="#save-button">Save the current document</tp-tooltip>
 * ```
 *
 * Attributs réactifs :
 * - `anchor`
 * - `placement`
 * - `offset`
 * - `open`
 *
 * Événement :
 * - `tp-tooltip-toggle`
 *
 * @summary Displays anchored tooltip content.
 * @tagname tp-tooltip
 *
 * @attr {string} anchor = "" - CSS selector of the anchor element.
 * @attr {"top" | "end" | "bottom" | "start"} placement = "top" - Tooltip placement relative to the anchor.
 * @attr {string} offset = "8px" - Distance between the anchor and the tooltip.
 * @attr {boolean} open = false - Opens the tooltip.
 * @attr {boolean} outside-click = false - Keeps outside-click state in the emitted toggle detail.
 *
 *
 * @event tp-tooltip-toggle Emitted when the tooltip open state changes.
 * @eventdetail tp-tooltip-toggle { backdrop: boolean; open: boolean; outsideClick: boolean; anchor: string; placement: "top" | "end" | "bottom" | "start" }
 * @accessibility Exposes `role="tooltip"` and connects the anchor with `aria-describedby`.
 * @accessibility Shows the tooltip when its anchor receives pointer hover or keyboard focus.
 * @accessibilityresponsibility Keep tooltip content brief and do not place interactive controls inside it.
 * @accessibilityresponsibility Ensure the anchor remains understandable without the tooltip.
 * @keyboard {Escape} Closes the tooltip.
 * @example
 * <tp-box data-intro-action="tooltip" data-allow-script="">
 *   <tp-button id="intro-tooltip-trigger" data-demo-trigger="">Hover or focus for help</tp-button>
 *   <tp-tooltip anchor="#intro-tooltip-trigger">This help also appears when the trigger receives keyboard focus.</tp-tooltip>
 *   <p data-demo-status="" role="status">Try the tooltip using its trigger.</p>
 *   <script src="/docs/components/_shared/introduction-actions.js"></script>
 * </tp-box>
 */
export declare class TpTooltip extends TpOverlayElement {
    protected readonly overlayName = "tp-tooltip";
    protected readonly backdropTagName = "tp-tooltip-backdrop";
    protected readonly toggleEventName = "tp-tooltip-toggle";
    protected get usesTopLayer(): boolean;
    private static readonly styleId;
    private resizeObserver;
    private anchorEl;
    private readonly handleViewportChange;
    private readonly handleAnchorMouseEnter;
    private readonly handleAnchorMouseLeave;
    private readonly handleAnchorFocus;
    private readonly handleAnchorBlur;
    /**
     * Attributes observed by `<tp-tooltip>`.
     *
     * @summary Observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * CSS selector of the anchor element.
     *
     * @attr anchor
     */
    get anchor(): string;
    set anchor(value: string);
    /**
     * Tooltip placement relative to the anchor.
     *
     * @attr placement
     */
    get placement(): TpTooltipPlacement;
    set placement(value: TpTooltipPlacement);
    /**
     * Distance between the anchor and the tooltip.
     *
     * @attr offset
     */
    get offset(): string;
    set offset(value: string);
    /**
     * Connects the tooltip to the document.
     *
     * @summary Connects the tooltip to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Updates the tooltip when an observed attribute changes.
     *
     * @summary Handles attribute changes.
     * @internal
     */
    protected attributeChangedCallback(name: string): void;
    /**
     * Disconnects the tooltip from the document.
     *
     * @summary Disconnects the tooltip from the document.
     * @internal
     */
    disconnectedCallback(): void;
    protected getBackdropParent(): HTMLElement | null;
    protected isBackdropContained(): boolean;
    protected getToggleEventDetail(): Record<string, unknown>;
    protected isInsideInteractiveBoundary(target: Node): boolean;
    protected afterOverlayUpdate(): void;
    private ensureStyles;
    private syncAnchor;
    private unbindAnchorEvents;
    private observeLayout;
    private getAnchorElement;
    private updateAria;
    private getOffsetInPixels;
    private positionTooltip;
}
export {};
