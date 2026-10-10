/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * @module components/menu
 * @summary Accessible menu component.
 */
type TpMenuOrientation = "horizontal" | "vertical";
/**
 * Turns a nested list into a keyboard-accessible menu.
 *
 * Expected structure:
 *
 * ```html
 * <tp-menu>
 *   <ul>
 *     <li>Item</li>
 *     <li>
 *       Parent
 *       <ul>
 *         <li>Child 1</li>
 *         <li>Child 2</li>
 *       </ul>
 *     </li>
 *   </ul>
 * </tp-menu>
 * ```
 *
 * Conventions:
 * - The first `<ul>` becomes the root menu.
 * - Each direct `<li>` becomes a menu item.
 * - A `<ul>` nested inside an item becomes that item's submenu.
 *
 * @summary Turns a nested list into a keyboard-accessible menu.
 * @tagname tp-menu
 *
 * @attr {string} orientation = "vertical" - Root menu orientation (`horizontal` or `vertical`).
 *
 *
 * @event tp-menu-item-select Emitted when a menu item without submenu is selected.
 * @eventdetail tp-menu-item-select { item: HTMLLIElement }
 *
 * @cssprop --tp-menu-gap Gap between root menu items.
 * @example
 * ```html
 * <tp-menu>
 *   <ul>
 *     <li><a href="/#/components/button/index.md">Buttons</a></li>
 *     <li><a href="/#/components/tabs/index.md">Tabs</a></li>
 *     <li><a href="/#/components/tree/index.md">Trees</a></li>
 *   </ul>
 * </tp-menu>
 * <script src="/docs/components/menu/examples/navigation.js"></script>
 * ```
 */
export declare class TpMenu extends TpBase {
    private static readonly styleId;
    static get observedAttributes(): string[];
    /**
     * Orientation of the root menu.
     *
     * Submenus always remain vertical.
     */
    get orientation(): TpMenuOrientation;
    set orientation(value: TpMenuOrientation);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Closes every open submenu.
     *
     * @summary Closes all expanded submenu items.
     */
    closeAll(): void;
    /**
     * Rebuilds menu roles, submenu metadata, and keyboard handlers.
     *
     * @summary Refreshes the menu structure after content changes.
     */
    refresh(): void;
    private ensureStyles;
    private getRootMenu;
    private getDirectMenuItems;
    private getMenuItems;
    private getSubmenu;
    private readonly handleDocumentPointerDown;
    private updateMenu;
    private decorateMenu;
    private closeSiblingSubmenus;
    private handleKey;
    private focusItem;
}
export {};
