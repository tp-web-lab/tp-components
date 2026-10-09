/**
 * @module components/checkbox-list
 * @summary Transforms a list into a group of checkboxes.
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
import style from "./checkbox-list.css?inline";

/**
 * Supported layout orientations for `<tp-checkbox-list>`.
 *
 * @summary Available orientation values.
 */
type TpCheckboxListOrientation = "horizontal" | "vertical";

/**
 * Supported ordered-list counter styles mirrored by the component.
 *
 * @summary Available ordered-list marker styles.
 */
type TpCheckboxListCounterStyle =
	| "decimal"
	| "lower-alpha"
	| "upper-alpha"
	| "lower-roman"
	| "upper-roman";

/**
 * Checks whether a string is a supported checkbox-list orientation.
 *
 * @summary Orientation type guard.
 * @param value Candidate orientation.
 * @returns `true` when value is `horizontal` or `vertical`.
 */
function isTpCheckboxListOrientation(
	value: string,
): value is TpCheckboxListOrientation {
	return value === "horizontal" || value === "vertical";
}

/**
 * Normalizes a counter-style token to the supported subset.
 *
 * @summary Counter-style parser.
 * @param value Raw CSS/list-style token.
 * @returns Matching counter style or `null`.
 */
function toCounterStyle(value: string): TpCheckboxListCounterStyle | null {
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
export class TpCheckboxList extends TpBase {
	/**
	 * Global stylesheet identifier for the component.
	 *
	 * @summary Identifier of the checkbox-list stylesheet.
	 * @internal
	 */
	private static readonly styleId = "tp-checkbox-list-styles";

	/**
	 * Incremental counter used to generate fallback checkbox group names.
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
	 * Returns the checkbox group name.
	 *
	 * @summary Reads the configured checkbox group name.
	 */
	public get name(): string {
		const value = this.getAttribute("name")?.trim() ?? "";
		if (value !== "") {
			return value;
		}

		if (this.generatedGroupName === null) {
			TpCheckboxList.nextGroupId += 1;
			this.generatedGroupName = `tp-checkbox-list-${String(TpCheckboxList.nextGroupId)}`;
		}

		return this.generatedGroupName;
	}

	/**
	 * Updates the checkbox group name.
	 *
	 * @summary Writes the configured checkbox group name.
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
	public get orientation(): TpCheckboxListOrientation {
		const value = this.getAttribute("orientation");
		return value !== null && isTpCheckboxListOrientation(value)
			? value
			: "vertical";
	}

	/**
	 * Updates the item layout orientation.
	 *
	 * @summary Writes the configured item orientation.
	 * @param value New orientation.
	 */
	public set orientation(value: TpCheckboxListOrientation) {
		this.setStringAttribute("orientation", value);
	}

	/**
	 * Returns the selected item indexes as a comma-separated 1-based string.
	 *
	 * @summary Reads selected item indexes.
	 */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}

	/**
	 * Updates selected item indexes as a comma-separated 1-based string.
	 *
	 * @summary Writes selected item indexes.
	 * @param value Comma-separated indexes, or `""` for no selection.
	 */
	public set value(value: string) {
		const previousValue = this.value;
		const normalizedValue = this.normalizeValueString(value);
		this.setValueAttribute(normalizedValue);
		this.syncSelectionFromValue();
		this.emitValueChangeIfNeeded(previousValue);
	}

	/**
	 * Connects the component and transforms the contained list.
	 *
	 * @summary Initializes the checkbox-list component.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-choice-label-styles", choiceLabelStyle);
		this.ensureGlobalStyle(TpCheckboxList.styleId, style);
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
	 * @param name Updated attribute name.
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

		if (name === "value") {
			const previousValue = oldValue ?? "";
			const normalizedValue = this.normalizeValueString(this.value);

			if (normalizedValue !== this.value) {
				this.setValueAttribute(normalizedValue);
			}

			if (!this.isSyncingValue) {
				this.syncSelectionFromValue();
				this.emitValueChangeIfNeeded(previousValue);
			}
			return;
		}

		this.transformList();
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
	 * @summary Resets checked items to the initial value.
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
	 * Transforms each list item into a checkbox option.
	 *
	 * Existing transformed items are reused and only synchronized.
	 *
	 * @summary Applies the list-to-checkbox transformation.
	 * @internal
	 */
	private transformList(): void {
		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return;
		}

		this.syncListAttributes(list);

		const groupName = this.name;
		const items = Array.from(list.children).filter(
			(child): child is HTMLLIElement => child instanceof HTMLLIElement,
		);

		for (const item of items) {
			const existingInput = item.querySelector<HTMLInputElement>(
				':scope > label[data-tp-checkbox-list-label] > input[type="checkbox"][data-tp-checkbox-list-input]',
			);

			if (existingInput instanceof HTMLInputElement) {
				existingInput.name = groupName;
				if (item.hasAttribute("disabled")) {
					existingInput.disabled = true;
				}
				continue;
			}

			const content = document.createDocumentFragment();
			while (item.firstChild !== null) {
				content.append(item.firstChild);
			}

			const label = document.createElement("label");
			label.setAttribute("data-tp-checkbox-list-label", "");

			const input = document.createElement("input");
			input.setAttribute("data-tp-checkbox-list-input", "");
			input.type = "checkbox";
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
	 * Handles checkbox updates coming from user interaction.
	 *
	 * @summary Syncs `value` when checkboxes change.
	 * @param event Change event.
	 * @internal
	 */
	private readonly handleInputChange = (event: Event): void => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) {
			return;
		}
		if (target.type !== "checkbox") {
			return;
		}
		if (!target.hasAttribute("data-tp-checkbox-list-input")) {
			return;
		}

		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return;
		}

		const previousValue = this.value;
		const inputs = this.getCheckboxInputs(list);
		const checkedIndexes = inputs.flatMap((input, index) =>
			input.checked ? [String(index + 1)] : [],
		);
		this.setValueAttribute(checkedIndexes.join(","));
		this.syncSelectionFromValue();
		this.emitValueChangeIfNeeded(previousValue);
	};

	/**
	 * Returns direct-list checkbox inputs ordered by item position.
	 *
	 * @summary Collects transformed checkbox inputs.
	 * @param list Direct child list.
	 * @returns Ordered checkbox inputs.
	 * @internal
	 */
	private getCheckboxInputs(
		list: HTMLUListElement | HTMLOListElement,
	): HTMLInputElement[] {
		const items = Array.from(list.children).filter(
			(child): child is HTMLLIElement => child instanceof HTMLLIElement,
		);

		const inputs: HTMLInputElement[] = [];
		for (const item of items) {
			const input = item.querySelector<HTMLInputElement>(
				':scope > label[data-tp-checkbox-list-label] > input[type="checkbox"][data-tp-checkbox-list-input]',
			);
			if (input instanceof HTMLInputElement) {
				inputs.push(input);
			}
		}

		return inputs;
	}

	/**
	 * Applies the current `value` attribute to checkbox checked states.
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

		const inputs = this.getCheckboxInputs(list);
		const selectedIndexes = this.parseValueIndexes(this.value, inputs.length);

		for (const [index, input] of inputs.entries()) {
			input.checked = selectedIndexes.has(index + 1);
		}

		this.syncCheckedItemAttributes(list, inputs);

		const normalizedValue = this.joinCheckedIndexes(inputs);
		if (normalizedValue !== this.value) {
			this.setValueAttribute(normalizedValue);
		}
	}

	/**
	 * Initializes `value` from current checked state when absent.
	 *
	 * @summary Derives initial value from transformed checkboxes.
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

		const inputs = this.getCheckboxInputs(list);
		this.setValueAttribute(this.joinCheckedIndexes(inputs));
	}

	/**
	 * Reflects checked state back to source list items.
	 *
	 * @summary Keeps `checked` list-item attributes synchronized.
	 * @param list Direct child list.
	 * @param inputs Ordered checkbox inputs.
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
	 * Normalizes a value string to ordered comma-separated indexes.
	 *
	 * @summary Value normalization helper.
	 * @param value Raw value string.
	 * @returns Canonical value representation.
	 * @internal
	 */
	private normalizeValueString(value: string): string {
		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return value.trim();
		}

		const maxIndex = this.getCheckboxInputs(list).length;
		const selectedIndexes = this.parseValueIndexes(value, maxIndex);
		return [...selectedIndexes]
			.sort((left, right) => left - right)
			.map(String)
			.join(",");
	}

	/**
	 * Parses value indexes and keeps only valid unique 1-based integers.
	 *
	 * @summary Value index parser.
	 * @param value Raw value string.
	 * @param maxIndex Maximum accepted index.
	 * @returns Valid selected indexes.
	 * @internal
	 */
	private parseValueIndexes(value: string, maxIndex: number): Set<number> {
		const tokens = value
			.split(",")
			.map((token) => token.trim())
			.filter((token) => token !== "");

		const selectedIndexes = new Set<number>();
		for (const token of tokens) {
			const parsedIndex = Number.parseInt(token, 10);
			const isValidIndex =
				Number.isInteger(parsedIndex) &&
				String(parsedIndex) === token &&
				parsedIndex >= 1 &&
				parsedIndex <= maxIndex;

			if (isValidIndex) {
				selectedIndexes.add(parsedIndex);
			}
		}

		return selectedIndexes;
	}

	/**
	 * Joins checked checkbox indexes to canonical value form.
	 *
	 * @summary Builds value string from checked state.
	 * @param inputs Ordered checkbox inputs.
	 * @returns Comma-separated selected indexes.
	 * @internal
	 */
	private joinCheckedIndexes(inputs: HTMLInputElement[]): string {
		return inputs
			.flatMap((input, index) => (input.checked ? [String(index + 1)] : []))
			.join(",");
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
	 * Emits `tp-checkbox-list-change` when value effectively changed.
	 *
	 * @summary Notifies value changes with value and associated labels.
	 * @param previousValue Previous value snapshot.
	 * @internal
	 */
	private emitValueChangeIfNeeded(previousValue: string): void {
		if (previousValue === this.value) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent("tp-checkbox-list-change", {
				detail: {
					value: this.value,
					label: this.resolveSelectedLabels(),
				},
				bubbles: true,
				composed: true,
			}),
		);
	}

	/**
	 * Resolves label text associated with current checked values.
	 *
	 * @summary Returns selected labels as a comma-separated string.
	 * @returns Selected labels, or empty string.
	 * @internal
	 */
	private resolveSelectedLabels(): string {
		const list = this.getListElement();
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return "";
		}

		const inputs = this.getCheckboxInputs(list);
		const labels = inputs.flatMap((input) => {
			if (!input.checked) {
				return [];
			}

			const label = input.closest("label[data-tp-checkbox-list-label]");
			if (!(label instanceof HTMLLabelElement)) {
				return [];
			}

			return [label.textContent?.replace(/\s+/g, " ").trim() ?? ""];
		});

		return labels.join(", ");
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
			const styleValue = this.resolveCounterStyle(list);
			list.setAttribute("data-tp-checkbox-list-counter-style", styleValue);
			return;
		}

		list.removeAttribute("data-tp-checkbox-list-counter-style");
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
	private resolveCounterStyle(
		list: HTMLOListElement,
	): TpCheckboxListCounterStyle {
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

if (!customElements.get("tp-checkbox-list")) {
	customElements.define("tp-checkbox-list", TpCheckboxList);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-checkbox-list": TpCheckboxList;
	}
}
