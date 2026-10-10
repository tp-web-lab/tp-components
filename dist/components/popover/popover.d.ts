/**
 * @module components/popover
 * @summary Popover overlay component.
 */
import { TpOverlayElement } from '../overlay/overlay.js';
type TpPopoverPlacement = 'top' | 'end' | 'bottom' | 'start';
/**
 * `<tp-popover>` affiche un contenu flottant ancré à un élément cible,
 * sans utiliser de Shadow DOM.
 *
 * Exemple :
 *
 * ```html
 * <button id="help">Help</button>
 * <tp-popover anchor="#help" placement="bottom">
 *   <p>Popover</p>
 * </tp-popover>
 * ```
 *
 * Attributs réactifs :
 * - `anchor`
 * - `placement`
 * - `offset`
 * - `open`
 * - `backdrop`
 *
 * Événement :
 * - `tp-popover-toggle`
 *
 * @summary Displays anchored popover content.
 * @tagname tp-popover
 *
 * @attr {string} anchor = "" - CSS selector of the anchor element.
 * @attr {"top" | "end" | "bottom" | "start"} placement = "bottom" - Popover placement relative to the anchor.
 * @attr {string} offset = "8px" - Distance between the anchor and the popover.
 * @attr {boolean} open = false - Opens the popover.
 * @attr {boolean} backdrop = false - Displays a transparent backdrop behind the popover.
 * @attr {boolean} outside-click = false - Closes the popover when the user clicks outside it.
 *
 *
 * @event tp-popover-toggle Emitted when the popover open state changes.
 * @eventdetail tp-popover-toggle { backdrop: boolean; open: boolean; outsideClick: boolean; anchor: string; placement: "top" | "end" | "bottom" | "start" }
 * @example
 * <tp-popover></tp-popover>
 */
export declare class TpPopover extends TpOverlayElement {
    protected readonly overlayName = "tp-popover";
    protected readonly backdropTagName = "tp-popover-backdrop";
    protected readonly toggleEventName = "tp-popover-toggle";
    protected get usesTopLayer(): boolean;
    private static readonly styleId;
    private resizeObserver;
    private readonly handleViewportChange;
    protected readonly handlePointerDownOutside: (event: PointerEvent) => void;
    protected isInsideInteractiveBoundary(target: Node): boolean;
    /**
     * Attributes observed by `<tp-popover>`.
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
     * Closes the popover when the user clicks outside it.
     *
     * @attr outside-click
     */
    get outsideClick(): boolean;
    set outsideClick(value: boolean);
    /**
     * Popover placement relative to the anchor.
     *
     * @attr placement
     */
    get placement(): TpPopoverPlacement;
    set placement(value: TpPopoverPlacement);
    /**
     * Distance between the anchor and the popover.
     *
     * @attr offset
     */
    get offset(): string;
    set offset(value: string);
    /**
     * Connects the popover to the document.
     *
     * @summary Connects the popover to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Updates the popover when an observed attribute changes.
     *
     * @summary Handles attribute changes.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Disconnects the popover from the document.
     *
     * @summary Disconnects the popover from the document.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Toggles the popover open state.
     *
     * @summary Toggles the popover.
     */
    toggle(): void;
    protected getBackdropParent(): HTMLElement | null;
    protected isBackdropContained(): boolean;
    protected getToggleEventDetail(): Record<string, unknown>;
    protected afterOverlayUpdate(): void;
    private ensureStyles;
    private observeLayout;
    private getAnchorElement;
    private getOffsetInPixels;
    private positionPopover;
}
export {};
