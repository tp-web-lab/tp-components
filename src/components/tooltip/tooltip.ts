/**
 * @module components/tooltip
 * @summary Tooltip component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './tooltip.css?inline';
import { TpOverlayElement } from '../overlay/overlay.js';

type TpTooltipPlacement = 'top' | 'end' | 'bottom' | 'start';

function isPlacement(value: string): value is TpTooltipPlacement {
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
 * `<tp-tooltip>` affiche un texte d'aide flottant ancré à un élément cible,
 * sans utiliser de Shadow DOM.
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
 * <tp-tooltip></tp-tooltip>
 */
export class TpTooltip extends TpOverlayElement {
  protected readonly overlayName = 'tp-tooltip';
  protected readonly backdropTagName = 'tp-tooltip-backdrop';
  protected readonly toggleEventName = 'tp-tooltip-toggle';

  protected override get usesTopLayer(): boolean {
    return true;
  }

  private static readonly styleId = 'tp-tooltip-styles';

  private resizeObserver: ResizeObserver | null = null;
  private anchorEl: HTMLElement | null = null;

  private readonly handleViewportChange = (): void => {
    this.positionTooltip();
  };

  private readonly handleAnchorMouseEnter = (): void => {
    this.show();
  };

  private readonly handleAnchorMouseLeave = (): void => {
    this.hide();
  };

  private readonly handleAnchorFocus = (): void => {
    this.show();
  };

  private readonly handleAnchorBlur = (): void => {
    this.hide();
  };

  /**
   * Attributes observed by `<tp-tooltip>`.
   *
   * @summary Observed attributes.
   * @internal
   */
  public static get observedAttributes(): string[] {
    return ['anchor', 'placement', 'offset', 'open', 'outside-click'];
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
   * Tooltip placement relative to the anchor.
   *
   * @attr placement
   */
  public get placement(): TpTooltipPlacement {
    const value = this.getAttribute('placement');
    return value !== null && isPlacement(value) ? value : 'top';
  }

  public set placement(value: TpTooltipPlacement) {
    this.setAttribute('placement', value);
  }

  /**
   * Distance between the anchor and the tooltip.
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
   * Connects the tooltip to the document.
   *
   * @summary Connects the tooltip to the document.
   * @internal
   */
  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureStyles();
    this.syncAnchor();
    this.observeLayout();
    this.positionTooltip();
    window.addEventListener('resize', this.handleViewportChange);
    window.addEventListener('scroll', this.handleViewportChange, true);
  }

  /**
   * Updates the tooltip when an observed attribute changes.
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
    this.positionTooltip();
  }

  /**
   * Disconnects the tooltip from the document.
   *
   * @summary Disconnects the tooltip from the document.
   * @internal
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unbindAnchorEvents();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('scroll', this.handleViewportChange, true);
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
    this.positionTooltip();
    this.updateAria();
  }

  private ensureStyles(): void {
    if (document.getElementById(TpTooltip.styleId)) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = TpTooltip.styleId;
    styleEl.textContent = style;
    document.head.append(styleEl);
  }

  private syncAnchor(): void {
    this.unbindAnchorEvents();

    const anchor = this.getAnchorElement();
    this.anchorEl = anchor;

    if (anchor === null) {
      return;
    }

    anchor.addEventListener('mouseenter', this.handleAnchorMouseEnter);
    anchor.addEventListener('mouseleave', this.handleAnchorMouseLeave);
    anchor.addEventListener('focus', this.handleAnchorFocus);
    anchor.addEventListener('blur', this.handleAnchorBlur);

    this.updateAria();
  }

  private unbindAnchorEvents(): void {
    if (this.anchorEl === null) {
      return;
    }

    this.anchorEl.removeEventListener('mouseenter', this.handleAnchorMouseEnter);
    this.anchorEl.removeEventListener('mouseleave', this.handleAnchorMouseLeave);
    this.anchorEl.removeEventListener('focus', this.handleAnchorFocus);
    this.anchorEl.removeEventListener('blur', this.handleAnchorBlur);
    this.anchorEl.removeAttribute('aria-describedby');

    this.anchorEl = null;
  }

  private observeLayout(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.positionTooltip();
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

  private updateAria(): void {
    if (this.id === '') {
      this.id = `${this.overlayName}-content-${Math.random().toString(36).slice(2, 10)}`;
    }

    if (this.anchorEl === null) {
      return;
    }

    this.setAttribute('role', 'tooltip');
    this.anchorEl.setAttribute('aria-describedby', this.id);
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

  private positionTooltip(): void {
    if (!this.open) {
      return;
    }

    const anchor = this.anchorEl;
    if (anchor === null) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = this.getBoundingClientRect();
    const offset = this.getOffsetInPixels();

    let left = 0;
    let top = 0;

    if (this.placement === 'bottom') {
      left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
      top = anchorRect.bottom + offset;
    }

    if (this.placement === 'top') {
      left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
      top = anchorRect.top - tooltipRect.height - offset;
    }

    if (this.placement === 'start') {
      left = anchorRect.left - tooltipRect.width - offset;
      top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
    }

    if (this.placement === 'end') {
      left = anchorRect.right + offset;
      top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
    }

    const clampedLeft = Math.max(
      8,
      Math.min(left, window.innerWidth - tooltipRect.width - 8),
    );
    const clampedTop = Math.max(
      8,
      Math.min(top, window.innerHeight - tooltipRect.height - 8),
    );

    this.style.left = `${String(Math.round(clampedLeft))}px`;
    this.style.top = `${String(Math.round(clampedTop))}px`;
  }

}

if (!customElements.get('tp-tooltip')) {
  customElements.define('tp-tooltip', TpTooltip);
}
