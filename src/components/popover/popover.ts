/**
 * @module components/popover
 * @summary Popover overlay component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './popover.css?inline';
import { TpOverlayElement } from '../overlay/overlay.js';

type TpPopoverPlacement = 'top' | 'end' | 'bottom' | 'start';

function isPlacement(value: string): value is TpPopoverPlacement {
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
export class TpPopover extends TpOverlayElement {
  protected readonly overlayName = 'tp-popover';
  protected readonly backdropTagName = 'tp-popover-backdrop';
  protected readonly toggleEventName = 'tp-popover-toggle';

  protected override get usesTopLayer(): boolean {
    return true;
  }

  private static readonly styleId = 'tp-popover-styles';

  private resizeObserver: ResizeObserver | null = null;

  private readonly handleViewportChange = (): void => {
    this.positionPopover();
  };

  protected readonly handlePointerDownOutside = (event: PointerEvent): void => {
    if (!this.open || !this.outsideClick) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    const anchor = this.getAnchorElement();

    if (this.contains(target)) {
      return;
    }

    if (anchor?.contains(target)) {
      return;
    }

    this.hide();
  };

  protected override isInsideInteractiveBoundary(target: Node): boolean {
    if (this.contains(target)) {
      return true;
    }

    const anchor = this.getAnchorElement();
    return anchor?.contains(target) ?? false;
  }

  /**
   * Attributes observed by `<tp-popover>`.
   *
   * @summary Observed attributes.
   * @internal
   */
  public static get observedAttributes(): string[] {
    return ['anchor', 'placement', 'offset', 'open', 'backdrop', 'outside-click'];
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
   * Closes the popover when the user clicks outside it.
   *
   * @attr outside-click
   */
  public get outsideClick(): boolean {
    return this.hasAttribute('outside-click');
  }

  public set outsideClick(value: boolean) {
    if (value) {
      this.setAttribute('outside-click', '');
      return;
    }

    this.removeAttribute('outside-click');
  }

  /**
   * Popover placement relative to the anchor.
   *
   * @attr placement
   */
  public get placement(): TpPopoverPlacement {
    const value = this.getAttribute('placement');
    return value !== null && isPlacement(value) ? value : 'bottom';
  }

  public set placement(value: TpPopoverPlacement) {
    this.setAttribute('placement', value);
  }

  /**
   * Distance between the anchor and the popover.
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
   * Connects the popover to the document.
   *
   * @summary Connects the popover to the document.
   * @internal
   */
  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureStyles();
    this.observeLayout();
    this.positionPopover();
    window.addEventListener('resize', this.handleViewportChange);
    window.addEventListener('scroll', this.handleViewportChange, true);
    document.addEventListener('pointerdown', this.handlePointerDownOutside);
  }

  /**
   * Updates the popover when an observed attribute changes.
   *
   * @summary Handles attribute changes.
   * @internal
   */
  protected attributeChangedCallback(): void {
    if (!this.isConnected) {
      return;
    }

    this.updateOverlayState();
    this.positionPopover();
  }

  /**
   * Disconnects the popover from the document.
   *
   * @summary Disconnects the popover from the document.
   * @internal
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('scroll', this.handleViewportChange, true);
    document.removeEventListener('pointerdown', this.handlePointerDownOutside);
  }

  /**
   * Toggles the popover open state.
   *
   * @summary Toggles the popover.
   */
  public toggle(): void {
    this.open = !this.open;
  }

  protected getBackdropParent(): HTMLElement | null {
    return document.body;
  }

  protected isBackdropContained(): boolean {
    return false;
  }

  protected getToggleEventDetail(): Record<string, unknown> {
    return {
      anchor: this.anchor,
      placement: this.placement,
      outsideClick: this.outsideClick,
    };
  }

  protected override afterOverlayUpdate(): void {
    this.positionPopover();
  }

  private ensureStyles(): void {
    if (document.getElementById(TpPopover.styleId)) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = TpPopover.styleId;
    styleEl.textContent = style;
    document.head.append(styleEl);
  }

  private observeLayout(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.positionPopover();
    });

    this.resizeObserver.observe(this);

    const anchor = this.getAnchorElement();
    if (anchor !== null) {
      this.resizeObserver.observe(anchor);
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

  private positionPopover(): void {
    if (!this.open) {
      return;
    }

    const anchor = this.getAnchorElement();
    if (anchor === null) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const popoverRect = this.getBoundingClientRect();
    const offset = this.getOffsetInPixels();

    let left = 0;
    let top = 0;

    if (this.placement === 'bottom') {
      left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;
      top = anchorRect.bottom + offset;
    }

    if (this.placement === 'top') {
      left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;
      top = anchorRect.top - popoverRect.height - offset;
    }

    if (this.placement === 'start') {
      left = anchorRect.left - popoverRect.width - offset;
      top = anchorRect.top + (anchorRect.height - popoverRect.height) / 2;
    }

    if (this.placement === 'end') {
      left = anchorRect.right + offset;
      top = anchorRect.top + (anchorRect.height - popoverRect.height) / 2;
    }

    const clampedLeft = Math.max(
      8,
      Math.min(left, window.innerWidth - popoverRect.width - 8),
    );
    const clampedTop = Math.max(
      8,
      Math.min(top, window.innerHeight - popoverRect.height - 8),
    );

    this.style.left = `${String(Math.round(clampedLeft))}px`;
    this.style.top = `${String(Math.round(clampedTop))}px`;
  }

}

if (!customElements.get('tp-popover')) {
  customElements.define('tp-popover', TpPopover);
}
