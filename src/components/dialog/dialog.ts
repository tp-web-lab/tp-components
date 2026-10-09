// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
// tp-docgen:dependencies:end

import style from './dialog.css?inline';
import type { TpButton } from '../button/button.js';
import { TpBase } from '../base/base';

/**
 * Detail emitted when `<tp-dialog>` closes.
 *
 * @summary Dialog close event detail.
 */
export interface TpDialogCloseDetail {
  /**
   * Action used to close the dialog.
   */
  action: 'confirm' | 'cancel';
}

/**
 * Dialog component.
 *
 * Wraps a native `<dialog>` element and provides confirm/cancel controls.
 *
 * @summary Displays a confirm/cancel dialog.
 * @tagname tp-dialog
 *
 * @event tp-dialog-close Emitted when the dialog is closed from one of its actions.
 * @eventdetail tp-dialog-close { action: "confirm" | "cancel" }
 * @example
 * <tp-dialog></tp-dialog>
 */
export class TpDialog extends TpBase {
  private dialogEl: HTMLDialogElement | null = null;
  private headerEl: HTMLElement | null = null;
  private bodyEl: HTMLElement | null = null;
  private confirmButtonEl: TpButton | null = null;
  private cancelButtonEl: TpButton | null = null;

  /**
   * Connects the dialog to the document.
   *
   * @summary Connects the dialog to the document.
   * @internal
   */
  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureStyles();
    this.render();
  }

  /**
   * Replaces the dialog title, body, and button labels.
   *
   * @summary Replaces the dialog content.
   */
  public setContent(options: {
    title?: string;
    body?: Node[];
    confirmText?: string;
    cancelText?: string;
  }): void {
    this.render();

    if (this.headerEl !== null) {
      this.headerEl.textContent = options.title ?? '';
    }

    if (this.bodyEl !== null) {
      this.bodyEl.replaceChildren(...(options.body ?? []));
    }

    if (this.confirmButtonEl !== null) {
      this.setButtonText(this.confirmButtonEl, options.confirmText ?? 'Confirm');
    }

    if (this.cancelButtonEl !== null) {
      this.setButtonText(this.cancelButtonEl, options.cancelText ?? 'Cancel');
    }
  }

  /**
   * Opens the dialog as a modal dialog.
   *
   * @summary Opens the dialog.
   */
  public show(): void {
    this.render();
    this.dialogEl?.showModal();
  }

  /**
   * Closes the dialog and emits `tp-dialog-close`.
   *
   * @summary Closes the dialog.
   */
  public close(action: 'confirm' | 'cancel' = 'cancel'): void {
    this.dialogEl?.close(action);

    this.dispatchEvent(
      new CustomEvent<TpDialogCloseDetail>('tp-dialog-close', {
        bubbles: true,
        detail: { action },
      }),
    );
  }

  private setButtonText(button: TpButton | null, text: string): void {
    if (button === null) {
      return;
    }

    const content = button.querySelector('[data-tp-button-content]');

    if (content instanceof HTMLElement) {
      content.textContent = text;
      return;
    }

    button.textContent = text;
  }

  private ensureStyles(): void {
    if (document.getElementById('tp-dialog-styles')) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = 'tp-dialog-styles';
    styleEl.textContent = style;
    document.head.append(styleEl);
  }

 private render(): void {
  if (this.dialogEl !== null) {
    return;
  }

  const dialog = document.createElement('dialog');
  dialog.setAttribute('data-tp-dialog', '');

  const panel = document.createElement('form');
  panel.setAttribute('method', 'dialog');
  panel.setAttribute('data-tp-dialog-panel', '');

  const header = document.createElement('header');
  header.setAttribute('data-tp-dialog-header', '');

  const body = document.createElement('section');
  body.setAttribute('data-tp-dialog-body', '');

  const footer = document.createElement('footer');
  footer.setAttribute('data-tp-dialog-footer', '');

  const cancelBtn = document.createElement('tp-button');
  cancelBtn.setAttribute('variant', 'neutral');
  cancelBtn.setAttribute('type', 'button');
  cancelBtn.setAttribute('size', 'xs');
  cancelBtn.setAttribute('pill', '');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    this.close('cancel');
  });

  const confirmBtn = document.createElement('tp-button');
  confirmBtn.setAttribute('variant', 'danger');
  confirmBtn.setAttribute('type', 'button');
  confirmBtn.setAttribute('size', 'xs');
  confirmBtn.setAttribute('pill', '');
  confirmBtn.textContent = 'Delete';
  confirmBtn.style.cursor = 'pointer';
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    this.close('confirm');
  });
  this.cancelButtonEl = cancelBtn;
  this.confirmButtonEl = confirmBtn;
  footer.append(cancelBtn, confirmBtn);

  panel.append(header, body, footer);
  dialog.append(panel);
  this.append(dialog);

  this.dialogEl = dialog;

  // 👉 garder une référence pour injecter le contenu
  this.headerEl = header;
  this.bodyEl = body;
}
}

if (!customElements.get('tp-dialog')) {
  customElements.define('tp-dialog', TpDialog);
}

declare global {
  interface HTMLElementTagNameMap {
    'tp-dialog': TpDialog;
  }

  interface HTMLElementEventMap {
    'tp-dialog-close': CustomEvent<TpDialogCloseDetail>;
  }
}
