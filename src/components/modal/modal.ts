/**
 * @module components/modal
 * @summary Modal overlay component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './modal.css?inline';
import { TpOverlayElement } from '../overlay/overlay.js';

/**
 * Modal overlay component.
 *
 * Displays centered content above the page, with optional backdrop and outside-click closing.
 *
 * @summary Displays modal content above the page.
 * @tagname tp-modal
 *
 * @attr {boolean} open = false - Opens the modal.
 * @attr {boolean} breakout = false - Allows the modal to ignore the default containment constraints.
 * @attr {string} margin = "" - Margin used when the modal is contained by the viewport.
 * @attr {boolean} fixed = false - Positions the modal relative to the viewport.
 * @attr {boolean} backdrop = false - Displays a backdrop behind the modal.
 * @attr {boolean} outside-click = false - Closes the modal when the user clicks outside it.
 *
 *
 * @event tp-modal-toggle Emitted when the modal open state changes.
 * @eventdetail tp-modal-toggle { backdrop: boolean; open: boolean; outsideClick: boolean; breakout: boolean; fixed: boolean }
 *
 * @cssprop --tp-modal-margin Margin used by the contained modal layout.
 * @accessibility Exposes modal dialog semantics through `role="dialog"` and `aria-modal="true"`.
 * @accessibility Moves focus inside on opening, keeps focus inside, and restores focus on closing.
 * @accessibility Makes content outside the modal inert while the modal is open.
 * @accessibilityresponsibility Provide an accessible name with `aria-label` or `aria-labelledby`.
 * @accessibilityresponsibility Provide a visible, clearly labeled control that closes the modal.
 * @keyboard {Tab} Moves to the next focusable control and wraps inside the modal.
 * @keyboard {Shift+Tab} Moves to the previous focusable control and wraps inside the modal.
 * @keyboard {Escape} Closes the modal.
 * @example
 * <tp-modal></tp-modal>
 */
export class TpModal extends TpOverlayElement {
  protected readonly overlayName = 'tp-modal';
  protected readonly backdropTagName = 'tp-modal-backdrop';
  protected readonly toggleEventName = 'tp-modal-toggle';

  private static readonly styleId = 'tp-modal-styles';
  private previouslyFocusedElement: HTMLElement | null = null;
  private readonly inertedElements = new Map<HTMLElement, boolean>();
  private modalStateInitialized = false;
  private temporaryTabIndex = false;

  private readonly handleModalKeydown = (event: KeyboardEvent): void => {
    if (!this.open || event.key !== 'Tab') {
      return;
    }

    const focusableElements = this.getFocusableElements();

    if (focusableElements.length === 0) {
      event.preventDefault();
      this.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements.at(-1);
    const activeElement = this.ownerDocument.activeElement;

    if (event.shiftKey && (activeElement === first || !this.contains(activeElement))) {
      event.preventDefault();
      last?.focus();
      return;
    }

    if (!event.shiftKey && (activeElement === last || !this.contains(activeElement))) {
      event.preventDefault();
      first?.focus();
    }
  };

  private readonly handleDocumentFocus = (event: FocusEvent): void => {
    if (
      !this.open
      || (event.target instanceof Node && this.contains(event.target))
    ) {
      return;
    }

    this.focusInitialElement();
  };

  /**
   * Attributes observed by `<tp-modal>`.
   *
   * @summary Observed attributes.
   * @internal
   */
  public static get observedAttributes(): string[] {
    return ['open', 'breakout', 'margin', 'fixed', 'backdrop', 'outside-click'];
  }

  /**
   * Allows the modal to ignore the default containment constraints.
   *
   * @attr breakout
   */
  public get breakout(): boolean {
    return this.hasAttribute('breakout');
  }

  public set breakout(value: boolean) {
    if (value) {
      this.setAttribute('breakout', '');
      return;
    }

    this.removeAttribute('breakout');
  }

  /**
   * Margin used when the modal is contained by the viewport.
   *
   * @attr margin
   */
  public get margin(): string {
    return this.getAttribute('margin') ?? '';
  }

  public set margin(value: string) {
    if (value === '') {
      this.removeAttribute('margin');
      return;
    }

    this.setAttribute('margin', value);
  }

  /**
   * Positions the modal relative to the viewport.
   *
   * @attr fixed
   */
  public get fixed(): boolean {
    return this.hasAttribute('fixed');
  }

  public set fixed(value: boolean) {
    if (value) {
      this.setAttribute('fixed', '');
      return;
    }

    this.removeAttribute('fixed');
  }

  /**
   * Connects the modal to the document.
   *
   * @summary Connects the modal to the document.
   * @internal
   */
  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureStyles();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'dialog');
    }
    this.setAttribute('aria-modal', 'true');
    this.addEventListener('keydown', this.handleModalKeydown);
    this.ownerDocument.addEventListener('focusin', this.handleDocumentFocus);
    this.updateOverlayState();
  }

  /**
   * Updates the modal when an observed attribute changes.
   *
   * @summary Handles attribute changes.
   * @internal
   */
  protected attributeChangedCallback(): void {
    this.updateOverlayState();
  }

  /**
   * Disconnects the modal from the document.
   *
   * @summary Disconnects the modal from the document.
   * @internal
   */
  public disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleModalKeydown);
    this.ownerDocument.removeEventListener('focusin', this.handleDocumentFocus);
    this.restoreBackground();
    this.restoreTemporaryTabIndex();
    this.modalStateInitialized = false;
    super.disconnectedCallback();
  }

  protected getBackdropParent(): HTMLElement | null {
    return this.fixed ? document.body : this.parentElement;
  }

  protected isBackdropContained(): boolean {
    return !this.fixed;
  }

  protected getToggleEventDetail(): Record<string, unknown> {
    return {
      breakout: this.breakout,
      fixed: this.fixed,
    };
  }

  protected override afterOverlayUpdate(): void {
    this.classList.toggle('contain', !this.breakout);

    if (this.margin === '') {
      this.style.removeProperty('--tp-modal-margin');
    } else {
      this.style.setProperty('--tp-modal-margin', this.margin);
    }

    if (!this.isConnected || this.modalStateInitialized === this.open) {
      return;
    }

    this.modalStateInitialized = this.open;

    if (this.open) {
      const activeElement = this.ownerDocument.activeElement;
      this.previouslyFocusedElement = activeElement instanceof HTMLElement
        ? activeElement
        : null;
      this.makeBackgroundInert();
      queueMicrotask(() => {
        if (this.open && this.isConnected) {
          this.focusInitialElement();
        }
      });
      return;
    }

    this.restoreBackground();
    this.restoreTemporaryTabIndex();

    const elementToRestore = this.previouslyFocusedElement;
    this.previouslyFocusedElement = null;
    queueMicrotask(() => {
      if (elementToRestore?.isConnected) {
        elementToRestore.focus();
      }
    });
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'area[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'iframe',
      'audio[controls]',
      'video[controls]',
      '[contenteditable]:not([contenteditable="false"])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(this.querySelectorAll<HTMLElement>(selector)).filter(
      (element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true',
    );
  }

  private focusInitialElement(): void {
    const target = this.querySelector<HTMLElement>('[autofocus]')
      ?? this.getFocusableElements()[0];

    if (target !== undefined && target !== null) {
      target.focus();
      return;
    }

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = -1;
      this.temporaryTabIndex = true;
    }

    this.focus();
  }

  private makeBackgroundInert(): void {
    let branch: HTMLElement = this;
    let parent = branch.parentElement;

    while (parent !== null) {
      for (const sibling of Array.from(parent.children)) {
        if (
          sibling instanceof HTMLElement
          && sibling !== branch
          && sibling.tagName !== 'TP-MODAL-BACKDROP'
        ) {
          this.inertedElements.set(sibling, sibling.hasAttribute('inert'));
          sibling.inert = true;
        }
      }

      branch = parent;
      parent = parent.parentElement;
    }
  }

  private restoreBackground(): void {
    for (const [element, wasInert] of this.inertedElements) {
      element.inert = wasInert;
    }

    this.inertedElements.clear();
  }

  private restoreTemporaryTabIndex(): void {
    if (this.temporaryTabIndex) {
      this.removeAttribute('tabindex');
      this.temporaryTabIndex = false;
    }
  }

  private ensureStyles(): void {
    if (document.getElementById(TpModal.styleId)) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = TpModal.styleId;
    styleEl.textContent = style;
    document.head.append(styleEl);
  }

}

if (!customElements.get('tp-modal')) {
  customElements.define('tp-modal', TpModal);
}
