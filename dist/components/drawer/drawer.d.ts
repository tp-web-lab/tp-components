/**
 * @module components/drawer
 * @summary Drawer overlay component.
 */
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import { TpOverlayElement } from "../overlay/overlay.js";
type TpDrawerPlacement = "top" | "end" | "bottom" | "start";
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
export declare class TpDrawer extends TpOverlayElement {
    /** Apply the outside-click setting to the backdrop as well. */
    protected get closesOnBackdropClick(): boolean;
    /** Viewport drawers escape ancestor stacking contexts; contained drawers stay local. */
    protected get usesTopLayer(): boolean;
    protected readonly overlayName = "tp-drawer";
    protected readonly backdropTagName = "tp-drawer-backdrop";
    protected readonly toggleEventName = "tp-drawer-toggle";
    private static readonly styleId;
    private static readonly collapsedWidth;
    private static readonly expandedWidth;
    private closeButtonEl;
    private contentEl;
    private collapseButtonEl;
    private expandButtonEl;
    private headerEl;
    private titleEl;
    /** Accessible handle on the free edge of a side drawer. */
    private resizeHandle;
    /** Removes temporary pointer listeners when resizing ends or the drawer disconnects. */
    private resizeAbort;
    /**
     * Attributes observed by `<tp-drawer>`.
     *
     * @summary Observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Edge from which the drawer appears.
     *
     * @attr placement
     */
    get placement(): TpDrawerPlacement;
    set placement(value: TpDrawerPlacement);
    /**
     * Keeps the drawer and backdrop inside the parent element.
     *
     * @attr contained
     */
    get contained(): boolean;
    set contained(value: boolean);
    /**
     * Text displayed in the drawer header.
     *
     * @attr label
     */
    get label(): string;
    set label(value: string);
    /**
     * Drawer width when opened from the start or end edge.
     *
     * Returns an empty string when absent; CSS supplies min(24rem, 100vw).
     *
     * @attr width
     */
    get width(): string;
    set width(value: string);
    /**
     * Replaces the drawer body content.
     *
     * @summary Replaces the drawer body content.
     */
    setContent(content: string | Node | readonly Node[]): void;
    /**
     * Connects the drawer to the document.
     *
     * @summary Connects the drawer to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Updates the drawer when an observed attribute changes.
     *
     * @summary Handles attribute changes.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Disconnects the drawer from the document.
     *
     * @summary Disconnects the drawer from the document.
     * @internal
     */
    disconnectedCallback(): void;
    protected getBackdropParent(): HTMLElement | null;
    protected isBackdropContained(): boolean;
    protected getToggleEventDetail(): Record<string, unknown>;
    protected afterOverlayUpdate(): void;
    private ensureStyles;
    private ensureDom;
    /** Maximum available width, bounded by the containing element when requested. */
    private maximumWidth;
    /** Converts physical pointer movement to width changes for placement and direction. */
    private resizeDirection;
    /** Applies a bounded width while keeping the public attribute synchronized. */
    private setResizedWidth;
    /** Exposes the resize range and current width to assistive technology. */
    private updateResizeAria;
    /** Starts a pointer resize without selecting content or triggering outside-close. */
    private startResize;
    private updateWidth;
}
export {};
