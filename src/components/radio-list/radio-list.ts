/**
 * @module components/radio-list
 * @summary Transforms a list into a group of radio buttons.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import {
	choiceLabelPosition,
	choiceLabelStyle,
	TpChoiceLabel,
	type TpChoiceLabelPosition,
} from "../../utilities/choice-label.js";

import { TpBase } from "../base/base.js";
import style from "./radio-list.css?inline";

/**
 * Supported layout orientations for `<tp-radio-list>`.
 *
 * @summary Available orientation values.
 */
type TpRadioListOrientation = "horizontal" | "vertical";

/**
 * Supported ordered-list counter styles mirrored by the component.
 *
 * @summary Available ordered-list marker styles.
 */
type TpRadioListCounterStyle =
	| "decimal"
	| "lower-alpha"
	| "upper-alpha"
	| "lower-roman"
	| "upper-roman";

/**
 * Checks whether a string is a supported radio-list orientation.
 *
 * @summary Orientation type guard.
 * @param value Candidate orientation.
 * @returns `true` when value is `horizontal` or `vertical`.
 */
function isTpRadioListOrientation(
	value: string,
): value is TpRadioListOrientation {
	return value === "horizontal" || value === "vertical";
}

/**
 * Normalizes a counter-style token to the supported subset.
 *
 * @summary Counter-style parser.
 * @param value Raw CSS/list-style token.
 * @returns Matching counter style or `null`.
 */
function toCounterStyle(value: string): TpRadioListCounterStyle | null {
	if (
		value === "decimal" ||
		value === "lower-alpha" ||
		value === "upper-alpha" ||
		value === "lower-roman" ||
		value === "upper-roman"
	) {
		return value;
	}

	return null;
}

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
export class TpRadioList extends TpBase {
	/**
	 * Global stylesheet identifier for the component.
	 *
	 * @summary Identifier of the radio-list stylesheet.
	 * @internal
	 */
	private static readonly styleId = "tp-radio-list-styles";

	/**
	 * Incremental counter used to generate fallback radio group names.
	 *
	 * @summary Counter for generated group names.
	 * @internal
	 */
	private static nextGroupId = 0;

	/**
	 * Returns observed attributes for this component.
	 *
	 * @summary Declares observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"name",
			"orientation",
			"value",
			"label",
			"label-position",
		];
	}

	/**
	 * Cached generated group name used when no `name` attribute is provided.
	 *
	 * @summary Stores the generated fallback group name.
	 * @internal
	 */
	private generatedGroupName: string | null = null;
	private isSyncingValue = false;
	private initialValue: string | null = null;

	/** Shared visible-label controller; leaves the author's list and inputs in place. */
	private readonly choiceLabel = new TpChoiceLabel(this);

	/** Visible label naming the whole group. */
	public get label(): string {
		return this.getStringAttribute("label");
	}

	/** Set or remove the visible group label. */
	public set label(value: string) {
		this.setStringAttribute("label", value);
	}

	/** Logical label position, defaulting to top for absent or unsupported values. */
	public get labelPosition(): TpChoiceLabelPosition {
		return choiceLabelPosition(this);
	}

	/** Place the label above, below, or beside the choices. */
	public set labelPosition(value: TpChoiceLabelPosition) {
		this.setStringAttribute("label-position", value);
	}

	/**
	 * Returns the radio group name.
	 *
	 * @summary Reads the configured radio group name.
	 */
	public get name(): string {
		const value = this.getAttribute("name")?.trim() ?? "";
		if (value !== "") {
			return value;
		}

		if (this.generatedGroupName === null) {
			TpRadioList.nextGroupId += 1;
			this.generatedGroupName = `tp-radio-list-${String(TpRadioList.nextGroupId)}`;
		}

		return this.generatedGroupName;
	}

	/**
	 * Updates the radio group name.
	 *
	 * @summary Writes the configured radio group name.
	 * @param value New group name.
	 */
	public set name(value: string) {
		const trimmed = value.trim();
		this.setStringAttribute("name", trimmed);
		if (trimmed !== "") {
			this.generatedGroupName = null;
		}
	}

	/**
	 * Returns the item layout orientation.
	 *
	 * @summary Reads the configured item orientation.
	 */
	public get orientation(): TpRadioListOrientation {
		const value = this.getAttribute("orientation");
		return value !== null && isTpRadioListOrientation(value)
			? value
			: "vertical";
	}

	/**
	 * Updates the item layout orientation.
	 *
	 * @summary Writes the configured item orientation.
	 * @param value New orientation.
	 */
	public set orientation(value: TpRadioListOrientation) {
		this.setStringAttribute("orientation", value);
	}

	/**
	 * Returns the selected item index as a 1-based string.
	 *
	 * @summary Reads the selected item index.
	 */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}

	/**
	 * Updates the selected item index as a 1-based string.
	 *
	 * @summary Writes the selected item index.
	 * @param value Selected item index, or `""` for no selection.
	 */
	public set value(value: string) {
		const previousValue = this.value;
		this.setValueAttribute(value.trim());
		this.syncSelectionFromValue();
		this.emitValueChangeIfNeeded(previousValue);
	}

	/**
	 * Connects the component and transforms the contained list.
	 *
	 * @summary Initializes the radio-list component.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-choice-label-styles", choiceLabelStyle);
		this.ensureGlobalStyle(TpRadioList.styleId, style);
		this.normalizeOrientationAttribute();
		this.addEventListener("change", this.handleInputChange);
		queueMicrotask(() => {
			if (!this.isConnected) {
				return;
			}
			this.transformList();
			this.choiceLabel.sync();
			this.initializeValueAttribute();
			this.syncSelectionFromValue();
			if (this.initialValue === null) {
				this.initialValue = this.value;
			}
		});
	}

	/**
	 * Reacts to observed attribute changes.
	 *
	 * @summary Handles observed attribute updates.
	 * @param _name Updated attribute name.
	 * @param oldValue Previous value.
	 * @param newValue New value.
	 */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (!this.isConnected || oldValue === newValue) {
			return;
		}

		if (name === "label" || name === "label-position") {
			this.choiceLabel.sync();
			return;
		}

		if (name === "orientation") {
			this.normalizeOrientationAttribute();
		}

		if (this.initialValue === null || this.getListElement() === null) {
			return;
		}

		this.transformList();

		if (name === "value") {
			if (!this.isSyncingValue) {
				const previousValue = oldValue ?? "";
				this.syncSelectionFromValue();
				this.emitValueChangeIfNeeded(previousValue);
			}
			return;
		}

		this.syncSelectionFromValue();
	}

	/**
	 * Removes runtime listeners.
	 *
	 * @summary Cleans up event listeners on disconnect.
	 */
	public disconnectedCallback(): void {
		this.removeEventListener("change", this.handleInputChange);
	}

	/**
	 * Restores the component selection to its initialization state.
	 *
	 * @summary Resets selected item to the initial value.
	 */
	public reset(): void {
		const previousValue = this.value;
		const fallbackValue = this.initialValue ?? "";
		this.setValueAttribute(fallbackValue);
		this.syncSelectionFromValue();
		this.emitValueChangeIfNeeded(previousValue);
	}

	/**
	 * Normalizes `orientation` to a supported value.
	 *
	 * @summary Keeps orientation attribute constrained to supported values.
	 * @internal
	 */
	private normalizeOrientationAttribute(): void {
		this.setAttribute("orientation", this.orientation);
	}

	/**
	 * Returns the first direct `<ul>` or `<ol>` child.
	 *
	 * @summary Resolves the list element to transform.
	 * @returns Direct list child or `null`.
	 * @internal
	 */
	private getListElement(): HTMLUListElement | HTMLOListElement | null {
		return this.queryElement<HTMLUListElement | HTMLOListElement>(
			":scope > ul, :scope > ol",
		);
	}

	/**
	 * Transforms each list item into a radio option.
	 *
	 * Existing transformed items are reused and only synchronized.
	 *
	 * @summary Applies the list-to-radio transformation.
	 * @internal
	 */
	private transformList(): void {
		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return;
		}

		const items = Array.from(list.children).filter(
			(child): child is HTMLLIElement => child instanceof HTMLLIElement,
		);

		// Validate that list has at least 2 items
		if (items.length < 2) {
			// Clear the list and show error in an li element
			list.textContent = "";
			const li = document.createElement("li");
			const error = document.createElement("div");
			error.setAttribute("style", "color: red; font-weight: bold;");
			error.textContent =
				"ERROR: tp-radio-list requires at least 2 items in the list.";
			li.append(error);
			list.append(li);
			return;
		}

		this.syncListAttributes(list);

		const groupName = this.name;

		for (const item of items) {
			const existingInput = item.querySelector<HTMLInputElement>(
				':scope > label[data-tp-radio-list-label] > input[type="radio"][data-tp-radio-list-input]',
			);

			if (existingInput instanceof HTMLInputElement) {
				existingInput.name = groupName;
				continue;
			}

			const content = document.createDocumentFragment();
			while (item.firstChild !== null) {
				content.append(item.firstChild);
			}

			const label = document.createElement("label");
			label.setAttribute("data-tp-radio-list-label", "");

			const input = document.createElement("input");
			input.setAttribute("data-tp-radio-list-input", "");
			input.type = "radio";
			input.name = groupName;

			if (item.hasAttribute("checked")) {
				input.checked = true;
			}
			if (item.hasAttribute("disabled")) {
				input.disabled = true;
			}

			label.append(input, content);
			item.append(label);
		}
	}

	/**
	 * Handles radio selection updates coming from user interaction.
	 *
	 * @summary Syncs `value` when radios change.
	 * @param event Change event.
	 * @internal
	 */
	private readonly handleInputChange = (event: Event): void => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) {
			return;
		}
		if (target.type !== "radio") {
			return;
		}
		if (!target.hasAttribute("data-tp-radio-list-input")) {
			return;
		}

		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return;
		}

		const inputs = this.getRadioInputs(list);
		const selectedIndex = inputs.findIndex((input) => input.checked);

		const previousValue = this.value;
		this.setValueAttribute(selectedIndex >= 0 ? String(selectedIndex + 1) : "");
		this.syncSelectionFromValue();
		this.emitValueChangeIfNeeded(previousValue);
	};

	/**
	 * Returns direct-list radio inputs ordered by item position.
	 *
	 * @summary Collects transformed radio inputs.
	 * @param list Direct child list.
	 * @returns Ordered radio inputs.
	 * @internal
	 */
	private getRadioInputs(
		list: HTMLUListElement | HTMLOListElement,
	): HTMLInputElement[] {
		const items = Array.from(list.children).filter(
			(child): child is HTMLLIElement => child instanceof HTMLLIElement,
		);

		const inputs: HTMLInputElement[] = [];
		for (const item of items) {
			const input = item.querySelector<HTMLInputElement>(
				':scope > label[data-tp-radio-list-label] > input[type="radio"][data-tp-radio-list-input]',
			);
			if (input instanceof HTMLInputElement) {
				inputs.push(input);
			}
		}

		return inputs;
	}

	/**
	 * Applies the current `value` attribute to radio checked states.
	 *
	 * @summary Synchronizes UI selection from `value`.
	 * @internal
	 */
	private syncSelectionFromValue(): void {
		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return;
		}

		const inputs = this.getRadioInputs(list);
		const rawValue = this.value;

		if (rawValue === "") {
			for (const input of inputs) {
				input.checked = false;
			}
			this.syncCheckedItemAttributes(list, inputs);
			return;
		}

		const parsedIndex = Number.parseInt(rawValue, 10);
		const isValidIndex =
			Number.isInteger(parsedIndex) &&
			String(parsedIndex) === rawValue &&
			parsedIndex >= 1 &&
			parsedIndex <= inputs.length;

		if (!isValidIndex) {
			for (const input of inputs) {
				input.checked = false;
			}
			this.setValueAttribute("");
			this.syncCheckedItemAttributes(list, inputs);
			return;
		}

		for (const [index, input] of inputs.entries()) {
			input.checked = index + 1 === parsedIndex;
		}
		this.syncCheckedItemAttributes(list, inputs);
	}

	/**
	 * Initializes `value` from current checked state when absent.
	 *
	 * @summary Derives initial value from transformed radios.
	 * @internal
	 */
	private initializeValueAttribute(): void {
		if (this.hasAttribute("value")) {
			return;
		}

		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return;
		}

		const inputs = this.getRadioInputs(list);
		const checkedIndex = inputs.findIndex((input) => input.checked);
		this.setValueAttribute(checkedIndex >= 0 ? String(checkedIndex + 1) : "");
	}

	/**
	 * Reflects checked state back to source list items.
	 *
	 * @summary Keeps `checked` list-item attributes synchronized.
	 * @param list Direct child list.
	 * @param inputs Ordered inputs.
	 * @internal
	 */
	private syncCheckedItemAttributes(
		list: HTMLUListElement | HTMLOListElement,
		inputs: HTMLInputElement[],
	): void {
		const items = Array.from(list.children).filter(
			(child): child is HTMLLIElement => child instanceof HTMLLIElement,
		);

		for (const [index, item] of items.entries()) {
			const input = inputs[index];
			if (input?.checked) {
				item.setAttribute("checked", "");
			} else {
				item.removeAttribute("checked");
			}
		}
	}

	/**
	 * Sets the `value` attribute without infinite feedback.
	 *
	 * @summary Writes `value` with re-entrancy guard.
	 * @param value Normalized value.
	 * @internal
	 */
	private setValueAttribute(value: string): void {
		if (this.value === value) {
			return;
		}

		this.isSyncingValue = true;
		this.setAttribute("value", value);
		this.isSyncingValue = false;
	}

	/**
	 * Emits `tp-radio-list-change` when value effectively changed.
	 *
	 * @summary Notifies value changes with value and associated label.
	 * @param previousValue Previous value snapshot.
	 * @internal
	 */
	private emitValueChangeIfNeeded(previousValue: string): void {
		if (previousValue === this.value) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent("tp-radio-list-change", {
				detail: {
					value: this.value,
					label: this.resolveSelectedLabel(),
				},
				bubbles: true,
				composed: true,
			}),
		);
	}

	/**
	 * Resolves the label text associated with the current value.
	 *
	 * @summary Returns selected item label text.
	 * @returns Trimmed selected label text, or empty string.
	 * @internal
	 */
	private resolveSelectedLabel(): string {
		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return "";
		}

		const inputs = this.getRadioInputs(list);
		const selectedIndex = inputs.findIndex((input) => input.checked);
		if (selectedIndex < 0) {
			return "";
		}

		const selectedInput = inputs[selectedIndex];
		if (!(selectedInput instanceof HTMLInputElement)) {
			return "";
		}

		const label = selectedInput.closest("label[data-tp-radio-list-label]");
		if (!(label instanceof HTMLLabelElement)) {
			return "";
		}

		return label.textContent?.replace(/\s+/g, " ").trim() ?? "";
	}

	/**
	 * Synchronizes list-level metadata used by CSS rendering.
	 *
	 * @summary Preserves list semantics and marker styles.
	 * @param list Direct child list being transformed.
	 * @internal
	 */
	private syncListAttributes(list: HTMLUListElement | HTMLOListElement): void {
		if (list instanceof HTMLOListElement) {
			const style = this.resolveCounterStyle(list);
			list.setAttribute("data-tp-radio-list-counter-style", style);
			return;
		}

		list.removeAttribute("data-tp-radio-list-counter-style");
	}

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
	private resolveCounterStyle(list: HTMLOListElement): TpRadioListCounterStyle {
		const inlineStyle = toCounterStyle(
			list.style.listStyleType.trim().toLowerCase(),
		);
		if (inlineStyle !== null) {
			return inlineStyle;
		}

		const type = list.getAttribute("type");
		if (type === "a") {
			return "lower-alpha";
		}
		if (type === "A") {
			return "upper-alpha";
		}
		if (type === "i") {
			return "lower-roman";
		}
		if (type === "I") {
			return "upper-roman";
		}
		if (type === "1") {
			return "decimal";
		}

		const computed = toCounterStyle(
			window.getComputedStyle(list).listStyleType.trim().toLowerCase(),
		);
		return computed ?? "decimal";
	}
}

if (!customElements.get("tp-radio-list")) {
	customElements.define("tp-radio-list", TpRadioList);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-radio-list": TpRadioList;
	}
}
