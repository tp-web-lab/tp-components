/**
 * @module components/dropdown
 * @summary Dropdown menu component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './dropdown.css?inline';
import { TpOverlayElement } from '../overlay/overlay.js';

type TpDropdownPlacement = 'top' | 'end' | 'bottom' | 'start';

function isPlacement(value: string): value is TpDropdownPlacement {
  return (
    value === 'top' ||
    value === 'end' ||
    value === 'bottom' ||
    value === 'start'
  );
}

function isCssLength(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed === '') {
    return false;
  }

  if (/^(calc|min|max|clamp)\(/.test(trimmed)) {
    return true;
  }

  return /^-?\d*\.?\d+(px|rem|em|%|ch|vw|vh|vmin|vmax)$/.test(trimmed);
}

/**
 * `<tp-dropdown>` affiche un menu déroulant ancré à un élément cible,
 * sans utiliser de Shadow DOM.
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
 * <tp-dropdown></tp-dropdown>
 */
export class TpDropdown extends TpOverlayElement {
  protected readonly overlayName = 'tp-dropdown';
  protected readonly backdropTagName = 'tp-dropdown-backdrop';
  protected readonly toggleEventName = 'tp-dropdown-toggle';

  protected override get usesTopLayer(): boolean {
    return true;
  }

  private static readonly styleId = 'tp-dropdown-styles';

  private resizeObserver: ResizeObserver | null = null;
  private anchorEl: HTMLElement | null = null;

  private readonly handleViewportChange = (event?: Event): void => {
    const target = event?.target;

    if (target instanceof Node && this.contains(target)) {
      return;
    }

    this.positionDropdown();
  };

  private readonly handleDropdownWheel = (event: WheelEvent): void => {
    if (!this.open || this.scrollHeight <= this.clientHeight) {
      return;
    }

    const canScrollUp = this.scrollTop > 0;
    const canScrollDown = this.scrollTop + this.clientHeight < this.scrollHeight;
    const shouldScrollDropdown =
      (event.deltaY < 0 && canScrollUp) || (event.deltaY > 0 && canScrollDown);

    if (!shouldScrollDropdown) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.scrollTop += event.deltaY;
  };

  /**
   * Attributes observed by `<tp-dropdown>`.
   *
   * @summary Observed attributes.
   * @internal
   */
  public static get observedAttributes(): string[] {
    return [
      'anchor',
      'placement',
      'offset',
      'open',
      'outside-click',
    ];
  }

  /**
   * CSS selector of the anchor element.
   *
   * @attr anchor
   */
  public get anchor(): string {
    return this.getAttribute('anchor') ?? '';
  }

  public set anchor(value: string) {
    if (value === '') {
      this.removeAttribute('anchor');
      return;
    }

    this.setAttribute('anchor', value);
  }

  /**
   * Dropdown placement relative to the anchor.
   *
   * @attr placement
   */
  public get placement(): TpDropdownPlacement {
    const value = this.getAttribute('placement');
    return value !== null && isPlacement(value) ? value : 'bottom';
  }

  public set placement(value: TpDropdownPlacement) {
    this.setAttribute('placement', value);
  }

  /**
   * Distance between the anchor and the dropdown.
   *
   * @attr offset
   */
  public get offset(): string {
    const value = this.getAttribute('offset');
    return value !== null && isCssLength(value) ? value : '8px';
  }

  public set offset(value: string) {
    if (!isCssLength(value)) {
      throw new TypeError(
        'The "offset" attribute must be a valid CSS length like "8px" or "0.5rem".',
      );
    }

    this.setAttribute('offset', value);
  }

  /**
   * Connects the dropdown to the document.
   *
   * @summary Connects the dropdown to the document.
   * @internal
   */
  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureStyles();
    this.syncAnchor();
    this.observeLayout();
    this.updateMenu();
    this.positionDropdown();
    this.addEventListener('wheel', this.handleDropdownWheel, { passive: false });
    window.addEventListener('resize', this.handleViewportChange);
    window.addEventListener('scroll', this.handleViewportChange, true);
  }

  /**
   * Updates the dropdown when an observed attribute changes.
   *
   * @summary Handles attribute changes.
   * @internal
   */
  protected attributeChangedCallback(name: string): void {
    if (!this.isConnected) {
      return;
    }

    if (name === 'anchor') {
      this.syncAnchor();
    }

    this.updateOverlayState();
    this.updateMenu();
    this.positionDropdown();
  }

  /**
   * Disconnects the dropdown from the document.
   *
   * @summary Disconnects the dropdown from the document.
   * @internal
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.removeEventListener('wheel', this.handleDropdownWheel);
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('scroll', this.handleViewportChange, true);
  }

  /**
   * Toggles the dropdown open state.
   *
   * @summary Toggles the dropdown.
   */
  public toggle(): void {
    this.open = !this.open;
  }

  public override show(): void {
    this.scrollTop = 0;
    super.show();
  }

  /**
   * Closes every nested submenu.
   *
   * @summary Closes all submenus.
   */
  public closeAll(): void {
    const items = this.getMenuItems();

    for (const item of items) {
      if (this.getSubmenu(item) !== null) {
        item.setAttribute('aria-expanded', 'false');
      }
    }
  }

  protected getBackdropParent(): HTMLElement | null {
    return null;
  }

  protected isBackdropContained(): boolean {
    return false;
  }

  protected getToggleEventDetail(): Record<string, unknown> {
    return {
      anchor: this.anchor,
      placement: this.placement,
    };
  }

  protected override isInsideInteractiveBoundary(target: Node): boolean {
    if (this.contains(target)) {
      return true;
    }

    return this.anchorEl?.contains(target) ?? false;
  }

  protected override afterOverlayUpdate(): void {
    if (!this.open) {
      this.closeAll();
    }

    this.positionDropdown();
  }

  private ensureStyles(): void {
    if (document.getElementById(TpDropdown.styleId)) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = TpDropdown.styleId;
    styleEl.textContent = style;
    document.head.append(styleEl);
  }

  private syncAnchor(): void {
    const anchor = this.getAnchorElement();
    this.anchorEl = anchor;
  }

  private observeLayout(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.positionDropdown();
    });

    this.resizeObserver.observe(this);

    if (this.anchorEl !== null) {
      this.resizeObserver.observe(this.anchorEl);
    }
  }

  private getAnchorElement(): HTMLElement | null {
    if (this.anchor === '') {
      return null;
    }

    const element = document.querySelector(this.anchor);
    return element instanceof HTMLElement ? element : null;
  }

  private getOffsetInPixels(): number {
    const raw = this.offset.trim();

    if (raw.endsWith('px')) {
      return Number(raw.slice(0, -2));
    }

    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.inlineSize = raw;
    document.body.append(temp);

    const value = temp.getBoundingClientRect().width;
    temp.remove();

    return Number.isFinite(value) ? value : 8;
  }

  private getRootMenu(): HTMLUListElement | null {
    const element = this.querySelector(':scope > ul');
    return element instanceof HTMLUListElement ? element : null;
  }

  private getDirectMenuItems(menu: HTMLUListElement): HTMLLIElement[] {
    return Array.from(menu.children).filter(
      (element): element is HTMLLIElement => element instanceof HTMLLIElement,
    );
  }

  private getMenuItems(): HTMLLIElement[] {
    return Array.from(this.querySelectorAll('li')).filter(
      (element): element is HTMLLIElement => element instanceof HTMLLIElement,
    );
  }

  private getSubmenu(item: HTMLLIElement): HTMLUListElement | null {
    const submenu = Array.from(item.children).find(
      (child): child is HTMLUListElement => child instanceof HTMLUListElement,
    );

    return submenu ?? null;
  }

  private updateMenu(): void {
    const rootMenu = this.getRootMenu();
    if (rootMenu === null) {
      return;
    }

    rootMenu.setAttribute('role', 'menu');
    this.decorateMenu(rootMenu);
  }

  private decorateMenu(menu: HTMLUListElement): void {
    menu.setAttribute('role', 'menu');

    const items = this.getDirectMenuItems(menu);

    for (const [index, item] of items.entries()) {
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');

      const submenu = this.getSubmenu(item);

      if (submenu !== null) {
        item.setAttribute('aria-haspopup', 'menu');

        if (!item.hasAttribute('aria-expanded')) {
          item.setAttribute('aria-expanded', 'false');
        }

        this.decorateMenu(submenu);
      }

      item.onclick = () => {
        if (submenu !== null) {
          const expanded = item.getAttribute('aria-expanded') === 'true';
          item.setAttribute('aria-expanded', String(!expanded));
          return;
        }

        this.hide();
      };

      item.onkeydown = (event) => {
        this.handleKey(event, item, items);
      };
    }
  }

  private handleKey(
    event: KeyboardEvent,
    item: HTMLLIElement,
    siblings: HTMLLIElement[],
  ): void {
    const index = siblings.indexOf(item);
    if (index < 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      this.focusItem(siblings[(index + 1) % siblings.length]);
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowUp') {
      this.focusItem(siblings[(index - 1 + siblings.length) % siblings.length]);
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowRight') {
      const submenu = this.getSubmenu(item);
      if (submenu !== null) {
        item.setAttribute('aria-expanded', 'true');
        this.focusItem(this.getDirectMenuItems(submenu)[0]);
      }
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowLeft') {
      const parentItem = item.parentElement?.closest('li');
      if (parentItem instanceof HTMLLIElement) {
        parentItem.setAttribute('aria-expanded', 'false');
        this.focusItem(parentItem);
      }
      event.preventDefault();
      return;
    }

    if (event.key === 'Home') {
      this.focusItem(siblings[0]);
      event.preventDefault();
      return;
    }

    if (event.key === 'End') {
      this.focusItem(siblings[siblings.length - 1]);
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const submenu = this.getSubmenu(item);

      if (submenu !== null) {
        const expanded = item.getAttribute('aria-expanded') === 'true';
        item.setAttribute('aria-expanded', String(!expanded));

        if (!expanded) {
          this.focusItem(this.getDirectMenuItems(submenu)[0]);
        }
      } else {
        this.hide();
      }

      event.preventDefault();
      return;
    }

    if (event.key === 'Escape') {
      this.hide();
      event.preventDefault();
    }
  }

  private focusItem(item: HTMLLIElement | undefined): void {
    if (item === undefined) {
      return;
    }

    const menu = item.parentElement;
    if (!(menu instanceof HTMLUListElement)) {
      return;
    }

    const siblings = this.getDirectMenuItems(menu);

    for (const sibling of siblings) {
      sibling.setAttribute('tabindex', sibling === item ? '0' : '-1');
    }

    item.focus();
  }

  private positionDropdown(): void {
    if (!this.open) {
      return;
    }

    const anchor = this.anchorEl;
    if (anchor === null) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    this.resetScrollableConstraints();
    const dropdownRect = this.getBoundingClientRect();
    const contentHeight = Math.max(dropdownRect.height, this.scrollHeight);
    const offset = this.getOffsetInPixels();

    let left = 0;
    let top = 0;

    const horizontalAlign = this.getAttribute('data-tp-dropdown-align');

    if (this.placement === 'bottom') {
      left =
        horizontalAlign === 'end'
          ? anchorRect.right - dropdownRect.width
          : anchorRect.left;
      top = anchorRect.bottom + offset;
    }

    if (this.placement === 'top') {
      left =
        horizontalAlign === 'end'
          ? anchorRect.right - dropdownRect.width
          : anchorRect.left;
      top = anchorRect.top - dropdownRect.height - offset;
    }

    if (this.placement === 'start') {
      left = anchorRect.left - dropdownRect.width - offset;
      top = anchorRect.top;
    }

    if (this.placement === 'end') {
      left = anchorRect.right + offset;
      top = anchorRect.top;
    }

    const minViewportPadding = 8;
    const minVisibleHeight = 120;
    const clampedLeft = Math.max(
      8,
      Math.min(left, window.innerWidth - dropdownRect.width - minViewportPadding),
    );
    const maxTopForScrollableDropdown =
      window.innerHeight - minVisibleHeight - minViewportPadding;
    const clampedTop = Math.max(
      minViewportPadding,
      Math.min(top, maxTopForScrollableDropdown),
    );

    this.style.left = `${String(Math.round(clampedLeft))}px`;
    this.style.top = `${String(Math.round(clampedTop))}px`;

    this.applyScrollableConstraints(clampedTop, contentHeight);
  }

  private applyScrollableConstraints(clampedTop: number, contentHeight: number): void {
    const viewportPadding = 8;
    const availableHeight = Math.max(
      120,
      Math.floor(window.innerHeight - clampedTop - viewportPadding),
    );
    const heightValue = `${String(availableHeight)}px`;
    const needsScroll = contentHeight > availableHeight;

    this.style.maxHeight = heightValue;
    this.style.maxBlockSize = heightValue;
    this.style.height = needsScroll ? heightValue : 'auto';
    this.style.overflowY = needsScroll ? 'auto' : 'visible';
    this.style.overscrollBehavior = 'contain';
  }

  private resetScrollableConstraints(): void {
    this.style.removeProperty('height');
    this.style.removeProperty('max-height');
    this.style.removeProperty('max-block-size');
    this.style.removeProperty('overflow-y');
    this.style.removeProperty('overscroll-behavior');
  }

}

if (!customElements.get('tp-dropdown')) {
  customElements.define('tp-dropdown', TpDropdown);
}
