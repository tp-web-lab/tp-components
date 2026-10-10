/**
 * @module components/dir
 * @summary Reading-direction controller (`ltr`/`rtl`/`auto`) with embedded UI.
 */
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../dropdown/dropdown.js";
import "../divider/divider.js";
import { TpBase } from "../base/base.js";
import { type TpDirType, type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * `<tp-dir>` controls the reading direction of its parent element.
 *
 * It applies the `dir` attribute (`ltr` or `rtl`) to the parent that contains
 * `<tp-dir>`. In `auto` mode, it follows the document direction by observing
 * the root `<html>` `dir` and `lang` attributes. RTL detection supports both
 * language tags such as `ar` or `he` and documentation region codes such as
 * `ma`.
 *
 * Multiple `<tp-dir>` controllers on the same parent stay synchronized.
 *
 * @summary Parent-scoped reading-direction switcher.
 * @tagname tp-dir
 * @attr {string} mode = "auto" - Reading-direction mode (`ltr`, `rtl`, `auto`). In `auto`, RTL is inferred from language or supported region codes.
 * @attr {string} anchor = "" - CSS selector used as the explicit element that receives the selected direction.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the direction trigger.
 *
 * @event tp-dir-change Emitted when the reading direction applied to a target changes.
 * @eventdetail tp-dir-change { mode: "ltr" | "rtl" | "auto"; dir: "ltr" | "rtl"; anchor: string; target: HTMLElement }
 * @example
 * <p>The reading direction of this section can be changed.</p>
 *     <p>اس حصے کی پڑھنے کی سمت تبدیل کی جا سکتی ہے۔</p>
 *     <tp-dir></tp-dir>
 */
export declare class TpDir extends TpBase {
    private static readonly styleId;
    private static readonly changeEventName;
    private static nextControlId;
    static get observedAttributes(): string[];
    private targetElement;
    private controlEl;
    private dropdownEl;
    private documentObserver;
    private isSyncing;
    private hasAppliedDir;
    /**
     * Returns the selected direction mode.
     *
     * @summary Returns the configured direction mode.
     */
    get mode(): TpDirType;
    /**
     * Updates the selected direction mode.
     *
     * @summary Sets the configured direction mode.
     * @param value Direction mode to apply.
     */
    set mode(value: TpDirType);
    /**
     * Returns the explicit direction target selector.
     *
     * @summary Returns the configured target selector.
     */
    get anchor(): string;
    /**
     * Updates the explicit direction target selector.
     *
     * @summary Sets the configured target selector.
     * @param value CSS selector for the target element.
     */
    set anchor(value: string);
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    get size(): TpSizeType;
    set size(value: TpSizeType);
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * Initializes the direction controller when connected to the document.
     *
     * @summary Connects the direction controller.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to changes on observed attributes.
     *
     * @summary Handles observed attribute changes.
     * @param name Updated attribute name.
     * @param oldValue Previous attribute value.
     * @param newValue New attribute value.
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Restores the original direction and removes active observers.
     *
     * @summary Disconnects the controller and restores target state.
     */
    protected disconnectedCallback(): void;
    /**
     * Synchronizes this controller to a specific mode when updated by a peer.
     *
     * @summary Synchronizes the mode from a peer controller.
     * @param mode New mode to apply.
     * @internal
     */
    syncToMode(mode: TpDirType): void;
    /**
     * Creates and caches the embedded control UI.
     *
     * @summary Ensures that the direction control UI exists.
     */
    private ensureControl;
    /**
     * Returns a stable element identifier for the trigger button.
     *
     * @summary Ensures a stable trigger identifier.
     * @param control Trigger element to identify.
     * @returns Existing or generated trigger identifier.
     */
    private ensureControlId;
    /**
     * Toggles the direction dropdown when the trigger is clicked.
     *
     * @summary Handles trigger clicks.
     */
    private readonly onControlClick;
    /**
     * Refreshes trigger metadata and dropdown selection state.
     *
     * @summary Updates the direction control UI.
     */
    private updateControl;
    /**
     * Applies the effective direction to the resolved target element.
     *
     * @summary Applies the current direction mode to the target.
     */
    private applyDir;
    private emitChange;
    /**
     * Resolves the element controlled by the current instance.
     *
     * Skips container elements (toolbar, menu, dropdown, button-group, contextmenu)
     * to find the actual target.
     *
     * @summary Returns the current direction target.
     * @returns Parent element used as direction target, or `null`.
     */
    private resolveTarget;
    /**
     * Resolves an explicit direction target from the `anchor` attribute.
     *
     * @summary Returns the anchored direction target when present.
     * @returns Anchored element, or `null`.
     */
    private resolveAnchoredTarget;
    /**
     * Skips over container elements that should not be considered as scoping targets.
     *
     * Containers like toolbars, menus, and dropdowns are transparent to scope resolution,
     * so this method traverses upward until it finds a non-container parent.
     *
     * @summary Returns the first non-container parent.
     * @returns Parent element, skipping containers, or `null` if none exist.
     */
    private getEffectiveParent;
    /**
     * Resolves the effective `ltr` or `rtl` direction for a mode.
     *
     * @summary Resolves the effective direction for a mode.
     * @param mode Direction mode to resolve.
     * @returns Effective `ltr` or `rtl` direction.
     */
    private resolveEffectiveDir;
    /**
     * Starts observing the document root for `dir` and `lang` changes.
     *
     * @summary Sets up automatic document-direction observation.
     */
    private setupDocumentObserver;
    /**
     * Stops observing the document root for direction changes.
     *
     * @summary Tears down automatic document-direction observation.
     */
    private teardownDocumentObserver;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-dir": TpDir;
    }
}
