/**
 * @module components/theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../dropdown/dropdown.js";
import "../divider/divider.js";
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
type TpThemeMode = "light" | "dark" | "auto";
/**
 * `<tp-theme>` controls the visual theme of its parent element.
 *
 * It applies either `.tp-light` or `.tp-dark` on the parent that contains
 * `<tp-theme>`. In `auto` mode, it follows the system color scheme.
 *
 * This makes it possible to set:
 * - a global theme when `<tp-theme>` is a direct child of `<body>`
 * - a local override by placing another `<tp-theme>` inside a nested container
 *
 * @summary Parent-scoped theme switcher.
 * @tagname tp-theme
 * @attr {string} mode = "auto" - Theme mode (`light`, `dark`, `auto`)
 * @attr {string} anchor = "" - CSS selector used as the explicit element that receives the selected theme.
 * @attr {string} ui-anchor = "" - CSS selector used only to anchor the dropdown UI.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the theme trigger.
 *
 * @event tp-theme-change Emitted when the effective theme applied to a target changes.
 * @eventdetail tp-theme-change { mode: "light" | "dark" | "auto"; theme: "light" | "dark"; anchor: string; target: HTMLElement }
 * @example
 * <tp-theme></tp-theme>
 */
export declare class TpTheme extends TpBase {
    private static readonly styleId;
    private static readonly refreshEventName;
    private static readonly changeEventName;
    private static nextControlId;
    /**
     * Returns the list of attributes observed by the component.
     *
     * @summary Returns the observed attributes.
     */
    static get observedAttributes(): string[];
    private targetElement;
    private controlEl;
    private dropdownEl;
    private mediaQueryList;
    private isSyncing;
    private hasAppliedTheme;
    private readonly onMediaQueryChange;
    private readonly onThemeRefresh;
    /**
     * Returns the selected theme mode.
     *
     * @summary Returns the configured theme mode.
     */
    get mode(): TpThemeMode;
    /**
     * Updates the selected theme mode.
     *
     * @summary Sets the configured theme mode.
     * @param value Theme mode to apply.
     */
    set mode(value: TpThemeMode);
    get anchor(): string;
    set anchor(value: string);
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    get size(): TpSizeType;
    set size(value: TpSizeType);
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * Initializes the theme controller when connected.
     *
     * @summary Connects the theme controller.
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
     * Removes listeners and restores the original target classes.
     *
     * @summary Disconnects the theme controller.
     */
    protected disconnectedCallback(): void;
    /**
     * Creates and caches the embedded theme control UI.
     *
     * @summary Ensures the internal theme UI exists.
     */
    private ensureControl;
    /**
     * Returns a stable identifier for the trigger element.
     *
     * @summary Ensures a stable trigger identifier.
     * @param control Trigger element to identify.
     * @returns Existing or generated trigger identifier.
     */
    private ensureControlId;
    /**
     * Synchronizes this controller to a mode received from a sibling controller.
     *
     * @summary Synchronizes the mode from another controller.
     * @param mode Theme mode to apply.
     */
    syncToMode(mode: TpThemeMode): void;
    /**
     * Resolves the dropdown anchor reference.
     *
     * @summary Returns the dropdown anchor selector.
     * @param controlId Trigger identifier used as the default anchor.
     * @returns Dropdown anchor selector.
     */
    private getDropdownAnchor;
    /**
     * Toggles the theme dropdown when the trigger is clicked.
     *
     * @summary Handles trigger clicks.
     */
    private readonly onControlClick;
    /**
     * Refreshes the trigger and dropdown state.
     *
     * @summary Updates the theme control UI.
     */
    private updateControl;
    /**
     * Applies the effective theme to the resolved target element.
     *
     * @summary Applies the current theme mode to the target.
     * @param options Theme application options.
     */
    private applyTheme;
    private emitChange;
    /**
     * Resolves the element controlled by the current instance.
     *
     * Skips container elements (toolbar, menu, dropdown, button-group, contextmenu)
     * to find the actual target. Checks for explicit scope markers first.
     *
     * @summary Returns the current theme target.
     * @returns Controlled target element, or `null`.
     */
    private resolveThemeTarget;
    /**
     * Resolves an explicit theme target from the `anchor` attribute.
     *
     * @summary Returns the anchored theme target when present.
     * @returns Anchored element, or `null`.
     */
    private resolveAnchoredThemeTarget;
    /**
     * Skips over container elements that should not be considered as scoping targets.
     *
     * Containers like toolbars, menus, dropdowns, and paragraphs are transparent to scope resolution,
     * so this method traverses upward until it finds a non-container parent.
     *
     * @summary Returns the first non-container parent.
     * @returns Parent element, skipping containers, or `null` if none exist.
     */
    private getEffectiveParent;
    /**
     * Resolves the effective light or dark theme for a mode.
     *
     * @summary Resolves the effective theme mode.
     * @param mode Theme mode to resolve.
     * @returns Effective `light` or `dark` mode.
     */
    private resolveEffectiveMode;
    /**
     * Returns the cached media query used for auto mode.
     *
     * @summary Returns the auto-mode media query.
     * @returns Cached media query list, or `null` when unavailable.
     */
    private getMediaQuery;
    /**
     * Starts listening to system color-scheme changes.
     *
     * @summary Sets up auto-mode media query listeners.
     */
    private setupMediaQuery;
    /**
     * Stops listening to system color-scheme changes.
     *
     * @summary Tears down auto-mode media query listeners.
     */
    private teardownMediaQuery;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-theme": TpTheme;
    }
}
export {};
