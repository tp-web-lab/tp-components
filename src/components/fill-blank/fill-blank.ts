/**
 * @module components/fill-blank
 * @summary manages inline fields and rich blanks in the content.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-blank
 * @summary displays a text, SVG or image answer in a focusable blank.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../blank/blank.js";
import { isTpBlank } from "../blank/blank.js";
import { type BlankField, getBlankFields } from "./fields.js";
import style from "./fill-blank.css?inline";

/**
 * Native inputs, selects and rich blanks supported by the component.
 *
 * @summary Supported input types for blanks.
 */
type TpFillBlankInput = BlankField;

/**
 * Serializable value payload emitted by `tp-fill-blank-change`.
 *
 * @summary JSON-serializable blank values keyed by field name.
 */
type TpFillBlankSerializableValue = Record<string, string>;

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
export class TpFillBlank extends TpBase {
	/**
	 * Global stylesheet identifier for the component.
	 *
	 * @summary Identifier of the fill-blank stylesheet.
	 * @internal
	 */
	private static readonly styleId = "tp-fill-blank-styles";

	/**
	 * Incremental counter used to generate fallback field names.
	 *
	 * @summary Counter for generated blank names.
	 * @internal
	 */
	private static nextBlankId = 0;

	/**
	 * Initial blank values snapshot used by `reset()`.
	 *
	 * @summary Stores initial values for reset.
	 * @internal
	 */
	private initialValues = new Map<string, string>();

	/**
	 * Connects the component and initializes blanks.
	 *
	 * @summary Initializes fill-blank behavior.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpFillBlank.styleId, style);
		this.initializeBlanks();
		this.captureInitialValues();
		this.addEventListener("input", this.handleBlankChange);
		this.addEventListener("change", this.handleBlankChange);
	}

	/**
	 * Removes event listeners when the component disconnects.
	 *
	 * @summary Cleans up blank change listeners.
	 */
	public disconnectedCallback(): void {
		this.removeEventListener("input", this.handleBlankChange);
		this.removeEventListener("change", this.handleBlankChange);
	}

	/**
	 * Handles input/change events from blanks and emits `tp-fill-blank-change`.
	 *
	 * @summary Dispatches change event with current FormData snapshot.
	 * @param event Originating DOM event.
	 * @internal
	 */
	private handleBlankChange = (event: Event): void => {
		const target = event.target;
		const isBlank =
			target instanceof HTMLInputElement ||
			target instanceof HTMLSelectElement ||
			(target instanceof Element && isTpBlank(target));
		if (!isBlank) {
			return;
		}

		const formData = this.value;
		this.dispatchEvent(
			new CustomEvent("tp-fill-blank-change", {
				detail: {
					value: this.toSerializableValue(formData),
					formData,
				},
				bubbles: true,
				composed: true,
			}),
		);
	};

	/**
	 * Returns a new snapshot of current blank values, keyed by field name.
	 * Duplicate names are preserved as multiple entries. Modifying the returned
	 * FormData does not update the fields until it is assigned back to `value`.
	 * This JavaScript property is not reflected to an HTML attribute.
	 *
	 * @summary Reads blank values as FormData.
	 * @returns A new FormData containing the named blanks in document order.
	 */
	public get value(): FormData {
		const data = new FormData();

		for (const blank of this.getBlanks()) {
			const name = blank.name.trim();
			if (name === "") {
				continue;
			}

			data.append(name, this.readBlankValue(blank));
		}

		return data;
	}

	/**
	 * Applies the first string entry for each name from `FormData`; file entries
	 * are ignored. Fields whose names are missing are cleared. A select value
	 * without a matching option leaves the select with no selection.
	 * Assignment does not dispatch input, change or tp-fill-blank-change events.
	 *
	 * @summary Writes blank values from FormData.
	 * @param data FormData to apply.
	 */
	public set value(data: FormData) {
		const valuesByName = new Map<string, string>();
		for (const [name, rawValue] of data.entries()) {
			if (typeof rawValue === "string" && !valuesByName.has(name)) {
				valuesByName.set(name, rawValue);
			}
		}

		for (const blank of this.getBlanks()) {
			const nextValue = valuesByName.get(blank.name) ?? "";
			this.writeBlankValue(blank, nextValue);
		}
	}

	/**
	 * Restores the cleared state captured when the component connected, including
	 * the empty placeholder option of selects. Does not restore authored prefilled
	 * values or dispatch change events.
	 *
	 * @summary Resets all blanks to initial values.
	 */
	public reset(): void {
		for (const blank of this.getBlanks()) {
			const initialValue = this.initialValues.get(blank.name) ?? "";
			this.writeBlankValue(blank, initialValue);
		}
	}

	/**
	 * Initializes blank fields:
	 * - ensures each blank has a name
	 * - clears initial values according to component rules
	 *
	 * @summary Normalizes and resets blanks on connect.
	 * @internal
	 */
	private initializeBlanks(): void {
		for (const blank of this.getBlanks()) {
			if (blank.name.trim() === "") {
				TpFillBlank.nextBlankId += 1;
				blank.name = `blank-${String(TpFillBlank.nextBlankId)}`;
			}

			if (blank instanceof HTMLInputElement || isTpBlank(blank)) {
				blank.value = "";
				continue;
			}

			this.normalizeSelect(blank);
			blank.value = "";
		}
	}

	/**
	 * Captures initial values after initialization.
	 *
	 * @summary Stores initial values for reset support.
	 * @internal
	 */
	private captureInitialValues(): void {
		this.initialValues = new Map<string, string>();
		for (const blank of this.getBlanks()) {
			this.initialValues.set(blank.name, this.readBlankValue(blank));
		}
	}

	/**
	 * Returns all blanks managed by the component.
	 *
	 * @summary Finds blank fields in the component subtree.
	 * @returns Ordered list of blanks.
	 * @internal
	 */
	private getBlanks(): TpFillBlankInput[] {
		return getBlankFields(this);
	}

	/**
	 * Reads the current value for a blank field.
	 *
	 * @summary Gets blank value as string.
	 * @param blank Blank field.
	 * @returns Current string value.
	 * @internal
	 */
	private readBlankValue(blank: TpFillBlankInput): string {
		return blank.value;
	}

	/**
	 * Normalizes a select blank before it is reset or read.
	 *
	 * @summary Ensures select blanks have a placeholder and explicit option values.
	 * @param blank Select blank to normalize.
	 * @internal
	 */
	private normalizeSelect(blank: HTMLSelectElement): void {
		const firstOption = blank.options.item(0);
		if (firstOption?.value !== "") {
			const placeholder = document.createElement("option");
			placeholder.value = "";
			placeholder.textContent = "choose an option";
			blank.insertBefore(placeholder, firstOption);
		}

		for (const option of Array.from(blank.options)) {
			if (option.value === "") {
				continue;
			}
			if (option.hasAttribute("value")) {
				continue;
			}
			option.value = option.textContent?.trim() ?? "";
		}
	}

	/**
	 * Converts FormData to a JSON-serializable object.
	 *
	 * @summary Builds a plain object payload from FormData.
	 * @param data FormData snapshot to convert.
	 * @returns Plain object keyed by blank name.
	 * @internal
	 */
	private toSerializableValue(data: FormData): TpFillBlankSerializableValue {
		const serialized: TpFillBlankSerializableValue = {};
		for (const [name, rawValue] of data.entries()) {
			if (typeof rawValue === "string") {
				serialized[name] = rawValue;
			}
		}
		return serialized;
	}

	/**
	 * Writes a value to a blank field.
	 *
	 * @summary Sets blank value.
	 * @param blank Blank field.
	 * @param value Value to apply.
	 * @internal
	 */
	private writeBlankValue(blank: TpFillBlankInput, value: string): void {
		if (blank instanceof HTMLInputElement || isTpBlank(blank)) {
			blank.value = value;
			return;
		}

		blank.value = value;
		if (blank.value === value) {
			return;
		}

		if (value === "") {
			const placeholderOption = Array.from(blank.options).find(
				(option) => option.value === "",
			);
			if (placeholderOption instanceof HTMLOptionElement) {
				blank.value = "";
			} else {
				blank.selectedIndex = -1;
			}
			return;
		}

		blank.selectedIndex = -1;
	}
}

if (!customElements.get("tp-fill-blank")) {
	customElements.define("tp-fill-blank", TpFillBlank);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-fill-blank": TpFillBlank;
	}
}
