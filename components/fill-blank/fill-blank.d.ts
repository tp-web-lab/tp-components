/**
 * @module components/fill-blank
 * @summary manages inline fields and rich blanks in the content.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-blank
 * @summary displays a text, SVG or image answer in a focusable blank.
 */
import { TpBase } from "../base/base.js";
import "../blank/blank.js";
/**
 * `<tp-fill-blank>` manages blanks embedded in text content.
 *
 * Supported blanks:
 * - `<tp-textfield>` and other library fields exposing a light DOM `<input>`
 * - `<input>` and `<select>`
 * - `<tp-blank>` for text, SVG or image answers
 *
 * Each blank receives a generated name when none is supplied. Connecting the
 * component clears the blanks and adds an empty select option when necessary.
 * `reset()` restores this initialized state, not the author's prefilled values.
 *
 * The JavaScript `value` property reads or writes blank values as `FormData`.
 * It is not an HTML attribute: `value="..."` on `<tp-fill-blank>` has no effect.
 * This component collects values; it does not grade answers.
 *
 * @summary manages inline fields and rich blanks and exposes their values as `FormData`.
 * @tagname tp-fill-blank
 * @event tp-fill-blank-change Fired in response to an input or change event from a blank; bubbles and crosses shadow boundaries. The detail contains a plain object of values and a FormData snapshot. For duplicate names, the object keeps the last value while FormData preserves all entries.
 * @eventdetail tp-fill-blank-change { value: Record<string, string>; formData: FormData }
 * @example
 * <tp-fill-blank>
 *   <p>The capital of France is <tp-textfield name="capital" placeholder="City name" aria-label="Capital of France" clearable></tp-textfield>.</p>
 * </tp-fill-blank>
 */
export declare class TpFillBlank extends TpBase {
    /**
     * Global stylesheet identifier for the component.
     *
     * @summary Identifier of the fill-blank stylesheet.
     * @internal
     */
    private static readonly styleId;
    /**
     * Incremental counter used to generate fallback field names.
     *
     * @summary Counter for generated blank names.
     * @internal
     */
    private static nextBlankId;
    /**
     * Initial blank values snapshot used by `reset()`.
     *
     * @summary Stores initial values for reset.
     * @internal
     */
    private initialValues;
    /**
     * Connects the component and initializes blanks.
     *
     * @summary Initializes fill-blank behavior.
     */
    protected connectedCallback(): void;
    /**
     * Removes event listeners when the component disconnects.
     *
     * @summary Cleans up blank change listeners.
     */
    disconnectedCallback(): void;
    /**
     * Handles input/change events from blanks and emits `tp-fill-blank-change`.
     *
     * @summary Dispatches change event with current FormData snapshot.
     * @param event Originating DOM event.
     * @internal
     */
    private handleBlankChange;
    /**
     * Returns a new snapshot of current blank values, keyed by field name.
     * Duplicate names are preserved as multiple entries. Modifying the returned
     * FormData does not update the fields until it is assigned back to `value`.
     * This JavaScript property is not reflected to an HTML attribute.
     *
     * @summary Reads blank values as FormData.
     * @returns A new FormData containing the named blanks in document order.
     */
    get value(): FormData;
    /**
     * Applies the first string entry for each name from `FormData`; file entries
     * are ignored. Fields whose names are missing are cleared. A select value
     * without a matching option leaves the select with no selection.
     * Assignment does not dispatch input, change or tp-fill-blank-change events.
     *
     * @summary Writes blank values from FormData.
     * @param data FormData to apply.
     */
    set value(data: FormData);
    /**
     * Restores the cleared state captured when the component connected, including
     * the empty placeholder option of selects. Does not restore authored prefilled
     * values or dispatch change events.
     *
     * @summary Resets all blanks to initial values.
     */
    reset(): void;
    /**
     * Initializes blank fields:
     * - ensures each blank has a name
     * - clears initial values according to component rules
     *
     * @summary Normalizes and resets blanks on connect.
     * @internal
     */
    private initializeBlanks;
    /**
     * Captures initial values after initialization.
     *
     * @summary Stores initial values for reset support.
     * @internal
     */
    private captureInitialValues;
    /**
     * Returns all blanks managed by the component.
     *
     * @summary Finds blank fields in the component subtree.
     * @returns Ordered list of blanks.
     * @internal
     */
    private getBlanks;
    /**
     * Reads the current value for a blank field.
     *
     * @summary Gets blank value as string.
     * @param blank Blank field.
     * @returns Current string value.
     * @internal
     */
    private readBlankValue;
    /**
     * Normalizes a select blank before it is reset or read.
     *
     * @summary Ensures select blanks have a placeholder and explicit option values.
     * @param blank Select blank to normalize.
     * @internal
     */
    private normalizeSelect;
    /**
     * Converts FormData to a JSON-serializable object.
     *
     * @summary Builds a plain object payload from FormData.
     * @param data FormData snapshot to convert.
     * @returns Plain object keyed by blank name.
     * @internal
     */
    private toSerializableValue;
    /**
     * Writes a value to a blank field.
     *
     * @summary Sets blank value.
     * @param blank Blank field.
     * @param value Value to apply.
     * @internal
     */
    private writeBlankValue;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-fill-blank": TpFillBlank;
    }
}
