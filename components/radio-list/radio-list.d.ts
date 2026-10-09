/**
 * @module components/radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { type TpChoiceLabelPosition } from "../../utilities/choice-label.js";
import { TpBase } from "../base/base.js";
/**
 * Supported layout orientations for `<tp-radio-list>`.
 *
 * @summary Available orientation values.
 */
type TpRadioListOrientation = "horizontal" | "vertical";
/**
 * `<tp-radio-list>` turns a plain `<ul>` or `<ol>` into a radio list.
 *
 * @summary Transforms list items into grouped radio options.
 * @tagname tp-radio-list
 * @attr {string} name = "" - Radio group name used on generated inputs.
 * @attr {string} orientation = "vertical" - Item layout direction (`vertical` or `horizontal`).
 * @attr {string} label = "" - Visible accessible group label; no fieldset is created.
 * @attr {string} label-position = "top" - Group label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} value = "" - 1-based index of the checked item (`""` for no selection).
 * @event tp-radio-list-change Emitted when selected value changes (`detail: { value, label }`).
 * @example
 * <tp-radio-list></tp-radio-list>
 */
export declare class TpRadioList extends TpBase {
    /**
     * Global stylesheet identifier for the component.
     *
     * @summary Identifier of the radio-list stylesheet.
     * @internal
     */
    private static readonly styleId;
    /**
     * Incremental counter used to generate fallback radio group names.
     *
     * @summary Counter for generated group names.
     * @internal
     */
    private static nextGroupId;
    /**
     * Returns observed attributes for this component.
     *
     * @summary Declares observed attributes.
     */
    static get observedAttributes(): string[];
    /**
     * Cached generated group name used when no `name` attribute is provided.
     *
     * @summary Stores the generated fallback group name.
     * @internal
     */
    private generatedGroupName;
    private isSyncingValue;
    private initialValue;
    /** Shared visible-label controller; leaves the author's list and inputs in place. */
    private readonly choiceLabel;
    /** Visible label naming the whole group. */
    get label(): string;
    /** Set or remove the visible group label. */
    set label(value: string);
    /** Logical label position, defaulting to top for absent or unsupported values. */
    get labelPosition(): TpChoiceLabelPosition;
    /** Place the label above, below, or beside the choices. */
    set labelPosition(value: TpChoiceLabelPosition);
    /**
     * Returns the radio group name.
     *
     * @summary Reads the configured radio group name.
     */
    get name(): string;
    /**
     * Updates the radio group name.
     *
     * @summary Writes the configured radio group name.
     * @param value New group name.
     */
    set name(value: string);
    /**
     * Returns the item layout orientation.
     *
     * @summary Reads the configured item orientation.
     */
    get orientation(): TpRadioListOrientation;
    /**
     * Updates the item layout orientation.
     *
     * @summary Writes the configured item orientation.
     * @param value New orientation.
     */
    set orientation(value: TpRadioListOrientation);
    /**
     * Returns the selected item index as a 1-based string.
     *
     * @summary Reads the selected item index.
     */
    get value(): string;
    /**
     * Updates the selected item index as a 1-based string.
     *
     * @summary Writes the selected item index.
     * @param value Selected item index, or `""` for no selection.
     */
    set value(value: string);
    /**
     * Connects the component and transforms the contained list.
     *
     * @summary Initializes the radio-list component.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     *
     * @summary Handles observed attribute updates.
     * @param _name Updated attribute name.
     * @param oldValue Previous value.
     * @param newValue New value.
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Removes runtime listeners.
     *
     * @summary Cleans up event listeners on disconnect.
     */
    disconnectedCallback(): void;
    /**
     * Restores the component selection to its initialization state.
     *
     * @summary Resets selected item to the initial value.
     */
    reset(): void;
    /**
     * Normalizes `orientation` to a supported value.
     *
     * @summary Keeps orientation attribute constrained to supported values.
     * @internal
     */
    private normalizeOrientationAttribute;
    /**
     * Returns the first direct `<ul>` or `<ol>` child.
     *
     * @summary Resolves the list element to transform.
     * @returns Direct list child or `null`.
     * @internal
     */
    private getListElement;
    /**
     * Transforms each list item into a radio option.
     *
     * Existing transformed items are reused and only synchronized.
     *
     * @summary Applies the list-to-radio transformation.
     * @internal
     */
    private transformList;
    /**
     * Handles radio selection updates coming from user interaction.
     *
     * @summary Syncs `value` when radios change.
     * @param event Change event.
     * @internal
     */
    private readonly handleInputChange;
    /**
     * Returns direct-list radio inputs ordered by item position.
     *
     * @summary Collects transformed radio inputs.
     * @param list Direct child list.
     * @returns Ordered radio inputs.
     * @internal
     */
    private getRadioInputs;
    /**
     * Applies the current `value` attribute to radio checked states.
     *
     * @summary Synchronizes UI selection from `value`.
     * @internal
     */
    private syncSelectionFromValue;
    /**
     * Initializes `value` from current checked state when absent.
     *
     * @summary Derives initial value from transformed radios.
     * @internal
     */
    private initializeValueAttribute;
    /**
     * Reflects checked state back to source list items.
     *
     * @summary Keeps `checked` list-item attributes synchronized.
     * @param list Direct child list.
     * @param inputs Ordered inputs.
     * @internal
     */
    private syncCheckedItemAttributes;
    /**
     * Sets the `value` attribute without infinite feedback.
     *
     * @summary Writes `value` with re-entrancy guard.
     * @param value Normalized value.
     * @internal
     */
    private setValueAttribute;
    /**
     * Emits `tp-radio-list-change` when value effectively changed.
     *
     * @summary Notifies value changes with value and associated label.
     * @param previousValue Previous value snapshot.
     * @internal
     */
    private emitValueChangeIfNeeded;
    /**
     * Resolves the label text associated with the current value.
     *
     * @summary Returns selected item label text.
     * @returns Trimmed selected label text, or empty string.
     * @internal
     */
    private resolveSelectedLabel;
    /**
     * Synchronizes list-level metadata used by CSS rendering.
     *
     * @summary Preserves list semantics and marker styles.
     * @param list Direct child list being transformed.
     * @internal
     */
    private syncListAttributes;
    /**
     * Resolves the counter style for ordered lists.
     *
     * Supports inline `style`, `type`, then computed style.
     *
     * @summary Resolves ordered-list marker style.
     * @param list Ordered list element.
     * @returns Supported counter style.
     * @internal
     */
    private resolveCounterStyle;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-radio-list": TpRadioList;
    }
}
export {};
