import { TpBase } from "../base/base";
/**
 * Detail emitted when `<tp-dialog>` closes.
 *
 * @summary Dialog close event detail.
 */
export interface TpDialogCloseDetail {
    /**
     * Action used to close the dialog.
     */
    action: "confirm" | "cancel";
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
     * @summary Replaces the title, body nodes and button labels. Supplied nodes are moved into the dialog; omitted title/body become empty and button labels default to Confirm/Cancel.
     */
    setContent(options: {
        title?: string;
        body?: Node[];
        confirmText?: string;
        cancelText?: string;
    }): void;
    /**
     * @summary Opens the internal native dialog in modal mode, blocking interaction with the rest of the page.
     */
    show(): void;
    /**
     * @summary Closes the dialog with action confirm or cancel and emits tp-dialog-close carrying that action; defaults to cancel.
     */
    close(action?: "confirm" | "cancel"): void;
    private setButtonText;
    private ensureStyles;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-dialog": TpDialog;
    }
    interface HTMLElementEventMap {
        "tp-dialog-close": CustomEvent<TpDialogCloseDetail>;
    }
}
