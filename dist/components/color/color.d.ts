/**
 * @module components/color
 * @summary Brand color preset controller scoped to the containing element.
 */
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../dropdown/dropdown.js";
import "../divider/divider.js";
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * Built-in color presets exposed by the component.
 *
 * @summary Lists the available color preset class names.
 * @internal
 */
declare const TP_COLOR_PRESETS: readonly ["tp-default", "tp-red", "tp-orange", "tp-amber", "tp-yellow", "tp-lime", "tp-green", "tp-emerald", "tp-teal", "tp-glaz", "tp-cyan", "tp-sky", "tp-blue", "tp-indigo", "tp-violet", "tp-purple", "tp-fuchsia", "tp-pink", "tp-rose", "tp-zinc", "tp-ivory", "tp-stone"];
type TpColorPreset = (typeof TP_COLOR_PRESETS)[number];
/**
 * `<tp-color>` lets users pick one of the built-in brand presets from `tp.css`
 * and applies it to the containing element.
 *
 * @summary Preset-based color controller.
 * @tagname tp-color
 * @attr {string} preset = "tp-default" - Preset class name (e.g. `tp-default`, `tp-red`)
 * @attr {string} anchor = "" - CSS selector used as the explicit element that receives the selected preset.
 * @attr {string} ui-anchor = "" - CSS selector used only to anchor the dropdown UI.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the color trigger.
 *
 * @event tp-color-change Emitted when the selected brand preset is applied to a target.
 * @eventdetail tp-color-change { preset: string; brand: string; anchor: string; target: HTMLElement }
 * @example
 * <section>
 * <tp-color></tp-color>
 * <p>The selected brand color is scoped to this section.</p>
 * <p><code>Inline code</code> is displayed in the brand colour.</p>
 * </section>
 */
export declare class TpColor extends TpBase {
    private static readonly styleId;
    private static readonly changeEventName;
    /**
     * Exposes the ordered list of built-in color presets.
     *
     * @summary Returns the available color presets.
     */
    static readonly presets: readonly ["tp-default", "tp-red", "tp-orange", "tp-amber", "tp-yellow", "tp-lime", "tp-green", "tp-emerald", "tp-teal", "tp-glaz", "tp-cyan", "tp-sky", "tp-blue", "tp-indigo", "tp-violet", "tp-purple", "tp-fuchsia", "tp-pink", "tp-rose", "tp-zinc", "tp-ivory", "tp-stone"];
    /**
     * Returns the list of attributes observed by the component.
     *
     * @summary Returns the observed attributes.
     */
    static get observedAttributes(): string[];
    private targetElement;
    private triggerEl;
    private dropdownEl;
    private isSyncing;
    private hasAppliedPreset;
    /**
     * Returns the selected preset class name.
     *
     * @summary Returns the configured preset.
     */
    get preset(): TpColorPreset;
    /**
     * Updates the selected preset class name.
     *
     * @summary Sets the configured preset.
     * @param value Preset value to apply.
     */
    set preset(value: TpColorPreset);
    get anchor(): string;
    set anchor(value: string);
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    get size(): TpSizeType;
    set size(value: TpSizeType);
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * Initializes the color controller when connected.
     *
     * @summary Connects the color controller.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     *
     * @summary Handles observed attribute changes.
     * @param name Updated attribute name.
     * @param oldValue Previous attribute value.
     * @param newValue New attribute value.
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Restores the original preset classes when the controller is disconnected.
     *
     * @summary Disconnects the color controller.
     */
    protected disconnectedCallback(): void;
    /**
     * Creates and caches the embedded preset picker UI.
     *
     * @summary Ensures the internal color UI exists.
     */
    private ensureControl;
    /**
     * Returns a stable identifier for the trigger element.
     *
     * @summary Ensures a stable trigger identifier.
     * @returns Existing or generated controller identifier.
     */
    private getControlId;
    /**
     * Resolves the dropdown anchor reference.
     *
     * @summary Returns the dropdown anchor selector.
     * @param controlId Trigger identifier used as the default anchor.
     * @returns Dropdown anchor selector.
     */
    private getDropdownAnchor;
    /**
     * Synchronizes this controller to a preset received from a sibling controller.
     *
     * @summary Synchronizes the preset from another controller.
     * @param preset Preset to apply.
     */
    syncToPreset(preset: TpColorPreset): void;
    /**
     * Toggles the color dropdown when the trigger is clicked.
     *
     * @summary Handles trigger clicks.
     */
    private readonly onTriggerClick;
    /**
     * Refreshes trigger state and dropdown selection.
     *
     * @summary Updates the color control UI.
     */
    private updateControl;
    /**
     * Applies the current preset to the resolved target element.
     *
     * @summary Applies the selected preset to the target.
     */
    private applyPreset;
    private emitChange;
    /**
     * Resolves the element controlled by the current instance.
     *
     * Skips container elements (toolbar, menu, dropdown, button-group, contextmenu)
     * to find the actual target. Checks for explicit scope markers first.
     *
     * @summary Returns the current color target.
     * @returns Controlled target element, or `null`.
     */
    private resolveColorTarget;
    /**
     * Resolves an explicit color target from the `anchor` attribute.
     *
     * The selector points directly to the element that receives the selected
     * preset. Use `ui-anchor` when only the dropdown placement must be moved.
     *
     * @summary Returns the anchored color scope target, when present.
     * @returns Anchored scope element, or `null`.
     */
    private resolveAnchoredColorTarget;
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
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-color": TpColor;
    }
}
export {};
