/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
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
export declare class TpDialog extends TpBase {
    private dialogEl;
    private headerEl;
    private bodyEl;
    private confirmButtonEl;
    private cancelButtonEl;
    /**
     * Connects the dialog to the document.
     *
     * @summary Connects the dialog to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Replaces the dialog title, body, and button labels.
     *
     * @summary Replaces the dialog content.
     */
    setContent(options: {
        title?: string;
        body?: Node[];
        confirmText?: string;
        cancelText?: string;
    }): void;
    /**
     * Opens the dialog as a modal dialog.
     *
     * @summary Opens the dialog.
     */
    show(): void;
    /**
     * Closes the dialog and emits `tp-dialog-close`.
     *
     * @summary Closes the dialog.
     */
    close(action?: 'confirm' | 'cancel'): void;
    private setButtonText;
    private ensureStyles;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-dialog': TpDialog;
    }
    interface HTMLElementEventMap {
        'tp-dialog-close': CustomEvent<TpDialogCloseDetail>;
    }
}
