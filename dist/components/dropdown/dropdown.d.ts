/**
 * @module components/dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpOverlayElement } from "../overlay/overlay.js";
type TpDropdownPlacement = "top" | "end" | "bottom" | "start";
/**
 * The custom `<tp-dropdown>` element displays an anchored dropdown menu.
 *
 * Structure attendue :
 *
 * ```html
 * <button id="actions-button">Actions</button>
 *
 * <tp-dropdown anchor="#actions-button">
 *   <ul>
 *     <li>Rename</li>
 *     <li>
 *       Export
 *       <ul>
 *         <li>HTML</li>
 *         <li>Markdown</li>
 *       </ul>
 *     </li>
 *   </ul>
 * </tp-dropdown>
 * ```
 *
 * Attributs réactifs :
 * - `anchor`
 * - `placement`
 * - `offset`
 * - `open`
 * - `outside-click`
 *
 * Événement :
 * - `tp-dropdown-toggle`
 *
 * @summary Displays an anchored dropdown menu.
 * @tagname tp-dropdown
 *
 * @attr {string} anchor = "" - CSS selector of the anchor element.
 * @attr {"top" | "end" | "bottom" | "start"} placement = "bottom" - Dropdown placement relative to the anchor.
 * @attr {string} offset = "8px" - Distance between the anchor and the dropdown.
 * @attr {boolean} open = false - Opens the dropdown.
 * @attr {boolean} outside-click = false - Closes the dropdown when the user clicks outside it.
 *
 *
 * @event tp-dropdown-toggle Emitted when the dropdown open state changes.
 * @eventdetail tp-dropdown-toggle { backdrop: boolean; open: boolean; outsideClick: boolean; anchor: string; placement: "top" | "end" | "bottom" | "start" }
 *
 * @cssprop --tp-dropdown-gap Gap between menu items.
 * @cssprop --tp-dropdown-padding Padding around menus.
 * @accessibility Implements menu and menuitem roles, roving tabindex, and expanded submenu states.
 * @accessibilityresponsibility Use the component for application actions; use ordinary navigation links for site navigation.
 * @accessibilityresponsibility Give the anchor an accessible name and expose its expanded state when toggling the menu.
 * @keyboard {ArrowDown / ArrowUp} Moves focus between menu items.
 * @keyboard {ArrowRight / ArrowLeft} Opens or closes a submenu and moves focus appropriately.
 * @keyboard {Home / End} Moves focus to the first or last item.
 * @keyboard {Enter / Space} Activates an item or toggles its submenu.
 * @keyboard {Escape} Closes the menu.
 * @example
 * <tp-box data-intro-action="dropdown" data-allow-script="">
 *   <tp-button id="intro-dropdown-trigger" data-demo-trigger="">Open the menu</tp-button>
 *   <tp-dropdown anchor="#intro-dropdown-trigger" outside-click=""><ul><li><a href="/#/components/button/index.md">Buttons</a></li><li><a href="/#/components/tree/index.md">Trees</a></li></ul></tp-dropdown>
 *   <p data-demo-status="" role="status">Try the dropdown using its trigger.</p>
 *   <script src="/docs/components/_shared/introduction-actions.js"></script>
 * </tp-box>
 */
export declare class TpDropdown extends TpOverlayElement {
    protected readonly overlayName = "tp-dropdown";
    protected readonly backdropTagName = "tp-dropdown-backdrop";
    protected readonly toggleEventName = "tp-dropdown-toggle";
    protected get usesTopLayer(): boolean;
    private static readonly styleId;
    private resizeObserver;
    private anchorEl;
    private readonly handleViewportChange;
    private readonly handleDropdownWheel;
    /**
     * Attributes observed by `<tp-dropdown>`.
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
     * Dropdown placement relative to the anchor.
     *
     * @attr placement
     */
    get placement(): TpDropdownPlacement;
    set placement(value: TpDropdownPlacement);
    /**
     * Distance between the anchor and the dropdown.
     *
     * @attr offset
     */
    get offset(): string;
    set offset(value: string);
    /**
     * Connects the dropdown to the document.
     *
     * @summary Connects the dropdown to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Updates the dropdown when an observed attribute changes.
     *
     * @summary Handles attribute changes.
     * @internal
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Disconnects the dropdown from the document.
     *
     * @summary Disconnects the dropdown from the document.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Toggles the dropdown open state.
     *
     * @summary Toggles the dropdown.
     */
    toggle(): void;
    /**
     * @summary Opens the dropdown by setting its open state and positioning it relative to its anchor.
     */
    show(): void;
    /**
     * Closes every nested submenu.
     *
     * @summary Closes all submenus.
     */
    closeAll(): void;
    protected getBackdropParent(): HTMLElement | null;
    protected isBackdropContained(): boolean;
    protected getToggleEventDetail(): Record<string, unknown>;
    protected isInsideInteractiveBoundary(target: Node): boolean;
    protected afterOverlayUpdate(): void;
    private ensureStyles;
    private syncAnchor;
    private observeLayout;
    private getAnchorElement;
    private getOffsetInPixels;
    private getRootMenu;
    private getDirectMenuItems;
    private getMenuItems;
    private getSubmenu;
    private updateMenu;
    private decorateMenu;
    private handleKey;
    private focusItem;
    /** Repositions an open menu after its anchor moves without resizing. */
    reposition(): void;
    private positionDropdown;
    private applyScrollableConstraints;
    private resetScrollableConstraints;
}
export {};
