/**
 * @module components/checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { type TpChoiceLabelPosition } from "../../utilities/choice-label.js";
import { TpBase } from "../base/base.js";
/**
 * Supported layout orientations for `<tp-checkbox-list>`.
 *
 * @summary Available orientation values.
 */
type TpCheckboxListOrientation = "horizontal" | "vertical";
/**
 * `<tp-checkbox-list>` turns a plain `<ul>` or `<ol>` into a checkbox list.
 *
 * @summary Transforms list items into checkbox options.
 * @tagname tp-checkbox-list
 * @attr {string} name = "" - Checkbox group name used on generated inputs.
 * @attr {string} orientation = "vertical" - Item layout direction (`vertical` or `horizontal`).
 * @attr {string} label = "" - Visible accessible group label; no fieldset is created.
 * @attr {string} label-position = "top" - Group label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} value = "" - Comma-separated 1-based indexes of checked items (e.g. `"2,4"`).
 * @event tp-checkbox-list-change Emitted when selection changes (`detail: { value, label }`).
 * @example
 * <tp-checkbox-list value="1,3">
 * <ul>
 * <li>HTML</li>
 * <li>CSS</li>
 * <li>JavaScript</li>
 * </ul>
 * </tp-checkbox-list>
 */
export declare class TpCheckboxList extends TpBase {
    /**
     * Global stylesheet identifier for the component.
     *
     * @summary Identifier of the checkbox-list stylesheet.
     * @internal
     */
    private static readonly styleId;
    /**
     * Incremental counter used to generate fallback checkbox group names.
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
     * Returns the checkbox group name.
     *
     * @summary Reads the configured checkbox group name.
     */
    get name(): string;
    /**
     * Updates the checkbox group name.
     *
     * @summary Writes the configured checkbox group name.
     * @param value New group name.
     */
    set name(value: string);
    /**
     * Returns the item layout orientation.
     *
     * @summary Reads the configured item orientation.
     */
    get orientation(): TpCheckboxListOrientation;
    /**
     * Updates the item layout orientation.
     *
     * @summary Writes the configured item orientation.
     * @param value New orientation.
     */
    set orientation(value: TpCheckboxListOrientation);
    /**
     * Returns the selected item indexes as a comma-separated 1-based string.
     *
     * @summary Reads selected item indexes.
     */
    get value(): string;
    /**
     * Updates selected item indexes as a comma-separated 1-based string.
     *
     * @summary Writes selected item indexes.
     * @param value Comma-separated indexes, or `""` for no selection.
     */
    set value(value: string);
    /**
     * Connects the component and transforms the contained list.
     *
     * @summary Initializes the checkbox-list component.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     *
     * @summary Handles observed attribute updates.
     * @param name Updated attribute name.
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
     * @summary Resets checked items to the initial value.
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
     * Transforms each list item into a checkbox option.
     *
     * Existing transformed items are reused and only synchronized.
     *
     * @summary Applies the list-to-checkbox transformation.
     * @internal
     */
    private transformList;
    /**
     * Handles checkbox updates coming from user interaction.
     *
     * @summary Syncs `value` when checkboxes change.
     * @param event Change event.
     * @internal
     */
    private readonly handleInputChange;
    /**
     * Returns direct-list checkbox inputs ordered by item position.
     *
     * @summary Collects transformed checkbox inputs.
     * @param list Direct child list.
     * @returns Ordered checkbox inputs.
     * @internal
     */
    private getCheckboxInputs;
    /**
     * Applies the current `value` attribute to checkbox checked states.
     *
     * @summary Synchronizes UI selection from `value`.
     * @internal
     */
    private syncSelectionFromValue;
    /**
     * Initializes `value` from current checked state when absent.
     *
     * @summary Derives initial value from transformed checkboxes.
     * @internal
     */
    private initializeValueAttribute;
    /**
     * Reflects checked state back to source list items.
     *
     * @summary Keeps `checked` list-item attributes synchronized.
     * @param list Direct child list.
     * @param inputs Ordered checkbox inputs.
     * @internal
     */
    private syncCheckedItemAttributes;
    /**
     * Normalizes a value string to ordered comma-separated indexes.
     *
     * @summary Value normalization helper.
     * @param value Raw value string.
     * @returns Canonical value representation.
     * @internal
     */
    private normalizeValueString;
    /**
     * Parses value indexes and keeps only valid unique 1-based integers.
     *
     * @summary Value index parser.
     * @param value Raw value string.
     * @param maxIndex Maximum accepted index.
     * @returns Valid selected indexes.
     * @internal
     */
    private parseValueIndexes;
    /**
     * Joins checked checkbox indexes to canonical value form.
     *
     * @summary Builds value string from checked state.
     * @param inputs Ordered checkbox inputs.
     * @returns Comma-separated selected indexes.
     * @internal
     */
    private joinCheckedIndexes;
    /**
     * Sets the `value` attribute without infinite feedback.
     *
     * @summary Writes `value` with re-entrancy guard.
     * @param value Normalized value.
     * @internal
     */
    private setValueAttribute;
    /**
     * Emits `tp-checkbox-list-change` when value effectively changed.
     *
     * @summary Notifies value changes with value and associated labels.
     * @param previousValue Previous value snapshot.
     * @internal
     */
    private emitValueChangeIfNeeded;
    /**
     * Resolves label text associated with current checked values.
     *
     * @summary Returns selected labels as a comma-separated string.
     * @returns Selected labels, or empty string.
     * @internal
     */
    private resolveSelectedLabels;
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
        "tp-checkbox-list": TpCheckboxList;
    }
}
export {};
