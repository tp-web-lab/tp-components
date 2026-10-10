/**
 * @module components/modal
 * @summary Modal overlay component.
 */
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
export declare class TpModal extends TpOverlayElement {
    protected readonly overlayName = "tp-modal";
    protected readonly backdropTagName = "tp-modal-backdrop";
    protected readonly toggleEventName = "tp-modal-toggle";
    private static readonly styleId;
    private previouslyFocusedElement;
    private readonly inertedElements;
    private modalStateInitialized;
    private temporaryTabIndex;
    private readonly handleModalKeydown;
    private readonly handleDocumentFocus;
    /**
     * Attributes observed by `<tp-modal>`.
     *
     * @summary Observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Allows the modal to ignore the default containment constraints.
     *
     * @attr breakout
     */
    get breakout(): boolean;
    set breakout(value: boolean);
    /**
     * Margin used when the modal is contained by the viewport.
     *
     * @attr margin
     */
    get margin(): string;
    set margin(value: string);
    /**
     * Positions the modal relative to the viewport.
     *
     * @attr fixed
     */
    get fixed(): boolean;
    set fixed(value: boolean);
    /**
     * Connects the modal to the document.
     *
     * @summary Connects the modal to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Updates the modal when an observed attribute changes.
     *
     * @summary Handles attribute changes.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Disconnects the modal from the document.
     *
     * @summary Disconnects the modal from the document.
     * @internal
     */
    disconnectedCallback(): void;
    protected getBackdropParent(): HTMLElement | null;
    protected isBackdropContained(): boolean;
    protected getToggleEventDetail(): Record<string, unknown>;
    protected afterOverlayUpdate(): void;
    private getFocusableElements;
    private focusInitialElement;
    private makeBackgroundInert;
    private restoreBackground;
    private restoreTemporaryTabIndex;
    private ensureStyles;
}
