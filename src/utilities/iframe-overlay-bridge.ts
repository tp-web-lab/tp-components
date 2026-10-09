const OPEN_OVERLAY_SELECTOR =
  'tp-dropdown[open], tp-tooltip[open], tp-popover[open], tp-contextmenu[open], tp-menu li[aria-expanded="true"]';

/**
 * Lets same-origin iframe overlays use the top layer of the outer document.
 *
 * An element in an iframe can never paint outside that iframe. Instead of
 * cloning or moving the interactive overlay, this bridge temporarily places
 * the iframe itself in the outer document's top layer while preserving a
 * placeholder at its original position.
 */
export class IframeOverlayBridge {
  private mutationObserver: MutationObserver | null = null;
  private placeholder: HTMLElement | null = null;
  private transparencyStyle: HTMLStyleElement | null = null;
  private originalStyle: string | null = null;
  private promoted = false;

  private readonly handleLoad = (): void => this.observeDocument();
  private readonly handleViewportChange = (): void => this.updatePlacement();

  public constructor(private readonly iframe: HTMLIFrameElement) {}

  public connect(): void {
    this.iframe.addEventListener('load', this.handleLoad);
    this.observeDocument();
  }

  public disconnect(): void {
    this.iframe.removeEventListener('load', this.handleLoad);
    this.mutationObserver?.disconnect();
    this.mutationObserver = null;
    this.restore();
  }

  private observeDocument(): void {
    this.mutationObserver?.disconnect();
    this.mutationObserver = null;

    let documentNode: Document | null = null;
    try {
      documentNode = this.iframe.contentDocument;
    } catch {
      return;
    }
    if (documentNode === null || documentNode.documentElement === null || documentNode.body === null) return;

    const Observer = documentNode.defaultView?.MutationObserver ?? MutationObserver;
    this.mutationObserver = new Observer(() => this.sync());
    this.mutationObserver.observe(documentNode.documentElement, {
      attributes: true,
      attributeFilter: ['open', 'aria-expanded'],
      childList: true,
      subtree: true,
    });
    this.sync();
  }

  private sync(): void {
    let overlay: HTMLElement | null = null;
    try {
      overlay = this.iframe.contentDocument?.querySelector<HTMLElement>(OPEN_OVERLAY_SELECTOR) ?? null;
    } catch {
      return;
    }

    if (overlay === null) {
      this.restore();
      return;
    }

    this.promote();
    this.updatePlacement();
    requestAnimationFrame(() => this.updatePlacement());
  }

  private promote(): void {
    if (this.promoted || typeof this.iframe.showPopover !== 'function') return;

    const rect = this.iframe.getBoundingClientRect();
    const placeholder = document.createElement('span');
    placeholder.setAttribute('data-tp-iframe-overlay-placeholder', '');
    placeholder.style.display = 'block';
    placeholder.style.flex = '1 1 auto';
    placeholder.style.inlineSize = `${String(rect.width)}px`;
    placeholder.style.blockSize = `${String(rect.height)}px`;
    this.iframe.before(placeholder);

    this.placeholder = placeholder;
    this.originalStyle = this.iframe.getAttribute('style');
    this.prepareTransparentExtension(rect.height);
    this.iframe.setAttribute('popover', 'manual');
    this.promoted = true;

    this.updatePlacement();
    try {
      this.iframe.showPopover();
    } catch {
      this.restore();
      return;
    }

    window.addEventListener('resize', this.handleViewportChange);
    window.addEventListener('scroll', this.handleViewportChange, true);
  }

  private updatePlacement(): void {
    if (!this.promoted || this.placeholder === null) return;

    const rect = this.placeholder.getBoundingClientRect();
    const requiredHeight = this.measureRequiredHeight(rect.height);
    Object.assign(this.iframe.style, {
      blockSize: `${String(requiredHeight)}px`,
      background: 'transparent',
      border: '0',
      bottom: 'auto',
      inlineSize: `${String(rect.width)}px`,
      left: `${String(rect.left)}px`,
      margin: '0',
      maxBlockSize: 'none',
      maxInlineSize: 'none',
      padding: '0',
      position: 'fixed',
      right: 'auto',
      top: `${String(rect.top)}px`,
    });
  }

  /** Keeps the original preview area opaque while the extra overlay area is transparent. */
  private prepareTransparentExtension(originalHeight: number): void {
    const documentNode = this.iframe.contentDocument;
    if (documentNode === null || documentNode.head === null || documentNode.body === null) return;

    const view = documentNode.defaultView;
    const bodyColor = view?.getComputedStyle(documentNode.body).backgroundColor ?? '';
    const rootColor = view?.getComputedStyle(documentNode.documentElement).backgroundColor ?? '';
    const isTransparent = (value: string): boolean =>
      value === '' || value === 'transparent' || value === 'rgba(0, 0, 0, 0)';
    const background = !isTransparent(bodyColor)
      ? bodyColor
      : !isTransparent(rootColor) ? rootColor : 'Canvas';

    const style = documentNode.createElement('style');
    style.setAttribute('data-tp-iframe-overlay-transparency', '');
    style.textContent = `
      html {
        background: transparent !important;
        overflow: hidden !important;
      }
      body {
        background: linear-gradient(
          to bottom,
          ${background} 0,
          ${background} ${String(originalHeight)}px,
          transparent ${String(originalHeight)}px,
          transparent 100%
        ) no-repeat !important;
        overflow: hidden !important;
      }
    `;
    documentNode.head.append(style);
    this.transparencyStyle = style;
  }

  private measureRequiredHeight(minimumHeight: number): number {
    const documentNode = this.iframe.contentDocument;
    if (documentNode === null) return minimumHeight;

    let requiredHeight = minimumHeight;
    for (const overlay of documentNode.querySelectorAll<HTMLElement>(OPEN_OVERLAY_SELECTOR)) {
      const floatingElement = overlay.matches('tp-menu li[aria-expanded="true"]')
        ? overlay.querySelector<HTMLElement>(':scope > ul') ?? overlay
        : overlay;
      const rect = floatingElement.getBoundingClientRect();
      const height = Math.max(rect.height, floatingElement.scrollHeight);
      requiredHeight = Math.max(requiredHeight, rect.top + height + 8);

      const selector = overlay.getAttribute('anchor')?.trim() ?? '';
      if (selector === '') continue;
      let anchor: Element | null = null;
      try {
        anchor = documentNode.querySelector(selector);
      } catch {
        // Invalid selectors are handled by the overlay component.
      }
      if (anchor === null) continue;

      const anchorRect = anchor.getBoundingClientRect();
      const offset = Number.parseFloat(overlay.getAttribute('offset') ?? '8') || 8;
      const placement = overlay.getAttribute('placement') ?? 'bottom';
      const bottom = placement === 'bottom'
        ? anchorRect.bottom + offset + height
        : anchorRect.top + (anchorRect.height + height) / 2;
      requiredHeight = Math.max(requiredHeight, bottom + 8);
    }
    return Math.ceil(requiredHeight);
  }

  private restore(): void {
    if (!this.promoted) return;

    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('scroll', this.handleViewportChange, true);
    if (typeof this.iframe.hidePopover === 'function') {
      try {
        this.iframe.hidePopover();
      } catch {
        // The iframe may already have left the top layer.
      }
    }

    if (this.originalStyle === null) this.iframe.removeAttribute('style');
    else this.iframe.setAttribute('style', this.originalStyle);
    this.iframe.removeAttribute('popover');
    this.placeholder?.remove();
    this.transparencyStyle?.remove();
    this.placeholder = null;
    this.transparencyStyle = null;
    this.originalStyle = null;
    this.promoted = false;
  }
}
