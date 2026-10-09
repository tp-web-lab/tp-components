/**
 * @module components/numberfield
 * @summary Numeric field with an optional native range slider.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import {
	choiceLabelPosition,
	type TpChoiceLabelPosition,
} from "../../utilities/choice-label.js";
import { initializeFieldName } from "../../utilities/field-name.js";
import fieldStyle from "../textfield/textfield.css?inline";
import style from "./numberfield.css?inline";

/** Logical positions of the visible number-field label. */
export type TpNumberfieldLabelPosition = TpChoiceLabelPosition;

/**
 * @summary numeric field with an optional native range slider.
 * @tagname tp-numberfield
 * @attr {string} label = "" - Visible label associated with the native input.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} aria-label = "" - Accessible name when a visible label is not supplied.
 * @attr {string} value = "" - Numeric value; range mode normalizes it to a nonempty value within its limits.
 * @attr {string} min = "" - Lower bound; native range inputs default to 0.
 * @attr {string} max = "" - Upper bound; native range inputs default to 100.
 * @attr {string} step = "1" - Positive numeric increment, or `any` for unrestricted fractional values.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} list = "" - ID of an external datalist supplying numeric suggestions or slider tick marks.
 * @attr {string} placeholder = "" - Hint shown by the empty number input; ignored in range mode.
 * @attr {boolean} range = false - Uses input type range instead of input type number.
 * @attr {boolean} required = false - Requires a value in number mode; ignored by native range inputs.
 * @attr {boolean} readonly = false - Prevents editing; a readonly slider is disabled with a hidden submission mirror.
 * @attr {boolean} disabled = false - Disables editing, clearing and form submission.
 * @attr {boolean} clearable = false - Shows a button that empties a number or resets a slider to its native midpoint.
 * @event input Emitted when the value changes during editing or clearing.
 * @event change Emitted when the value is committed or cleared.
 * @event tp-clear Emitted after clearing a number or resetting the slider.
 * @cssprop [--tp-numberfield-inline-size=20ch] Width of the field.
 * @cssprop [--tp-numberfield-background=var(--tp-paper-color)] Field background.
 * @cssprop [--tp-numberfield-border-color=var(--tp-neutral-stroke-soft)] Field border color.
 * @cssprop [--tp-numberfield-focus-color=var(--tp-brand-text-colorful)] Focus indicator color.
 * @example
 * <tp-numberfield label="Quantity" value="3" min="0" max="10" clearable></tp-numberfield>
 */
export class TpNumberfield extends TpBase {
	/** Native editor, retained when labels and modes change. */
	private readonly field = document.createElement("input");
	/** Existing library control used for clearing and resetting. */
	private readonly clearButton = document.createElement("tp-icon-button");
	/** Visible current slider value, redundant with the slider's accessible value. */
	private readonly readout = document.createElement("span");
	/** Submit readonly slider values without enabling the disabled native slider. */
	private readonly submission = document.createElement("input");
	/** Prevent recursive synchronization when native normalization changes value. */
	private syncing = false;

	/** Attributes synchronized with the native input. */
	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"label",
			"label-position",
			"aria-label",
			"value",
			"min",
			"max",
			"step",
			"name",
			"list",
			"placeholder",
			"range",
			"required",
			"readonly",
			"disabled",
			"clearable",
		];
	}

	/** Visible field label. */
	public get label(): string {
		return this.getStringAttribute("label");
	}
	/** Update the visible label. */
	public set label(value: string) {
		this.setStringAttribute("label", value);
	}
	/** Logical label position, defaulting to top. */
	public get labelPosition(): TpNumberfieldLabelPosition {
		return choiceLabelPosition(this);
	}
	/** Position the label around the native input. */
	public set labelPosition(value: TpNumberfieldLabelPosition) {
		this.setStringAttribute("label-position", value);
	}
	/** Current numeric string; empty is supported only in number mode. */
	public get value(): string {
		return this.getStringAttribute("value");
	}
	/** Assign a value, using native sanitization once connected. */
	public set value(value: string) {
		this.setStringAttribute("value", value);
	}
	/** Lower bound, or an empty string for the native default. */
	public get min(): string {
		return this.getStringAttribute("min");
	}
	/** Set the lower bound. */
	public set min(value: string) {
		this.setStringAttribute("min", value);
	}
	/** Upper bound, or an empty string for the native default. */
	public get max(): string {
		return this.getStringAttribute("max");
	}
	/** Set the upper bound. */
	public set max(value: string) {
		this.setStringAttribute("max", value);
	}
	/** Positive increment or any; invalid values fall back to 1. */
	public get step(): string {
		const value = this.getStringAttribute("step");
		return value === "any" ||
			(Number.isFinite(Number(value)) && Number(value) > 0)
			? value
			: "1";
	}
	/** Set the increment or allow any fractional value. */
	public set step(value: string) {
		this.setStringAttribute("step", value);
	}
	/** Field name used in form data. */
	public get name(): string {
		return this.getStringAttribute("name");
	}
	/** Set the submitted field name. */
	public set name(value: string) {
		this.setStringAttribute("name", value);
	}
	/** Identifier of the external datalist used by the native editor. */
	public get list(): string {
		return this.getStringAttribute("list");
	}
	/** Associate a datalist with the native editor. */
	public set list(value: string) {
		this.setStringAttribute("list", value);
	}
	/** Empty-number input hint. */
	public get placeholder(): string {
		return this.getStringAttribute("placeholder");
	}
	/** Set the empty-number input hint. */
	public set placeholder(value: string) {
		this.setStringAttribute("placeholder", value);
	}
	/** Whether the native editor is a slider. */
	public get range(): boolean {
		return this.hasAttribute("range");
	}
	/** Switch between number input and slider. */
	public set range(value: boolean) {
		this.toggleAttribute("range", value);
	}
	/** Whether number mode requires a value. */
	public get required(): boolean {
		return this.hasAttribute("required");
	}
	/** Enable or disable native required validation. */
	public set required(value: boolean) {
		this.toggleAttribute("required", value);
	}
	/** Whether editing is prevented while preserving submission. */
	public get readOnly(): boolean {
		return this.hasAttribute("readonly");
	}
	/** Prevent or allow editing. */
	public set readOnly(value: boolean) {
		this.toggleAttribute("readonly", value);
	}
	/** Whether editing and submission are disabled. */
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	/** Disable or enable the field and its clear action. */
	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}
	/** Whether the embedded clear/reset control is shown. */
	public get clearable(): boolean {
		return this.hasAttribute("clearable");
	}
	/** Show or hide the clear/reset control. */
	public set clearable(value: boolean) {
		this.toggleAttribute("clearable", value);
	}

	/** Reuse the established field styling and library buttons once connected. */
	protected override connectedCallback(): void {
		initializeFieldName(this);
		super.connectedCallback();
		this.ensureGlobalStyle(
			"tp-numberfield-styles",
			fieldStyle.replaceAll("tp-textfield", "tp-numberfield") + style,
		);
		this.field.addEventListener("input", this.handleInput);
		this.field.addEventListener("change", this.handleChange);
		this.clearButton.addEventListener("click", this.handleClear);
		this.render();
	}

	/** Release listeners; reconnecting installs them once without duplicating DOM. */
	public disconnectedCallback(): void {
		this.field.removeEventListener("input", this.handleInput);
		this.field.removeEventListener("change", this.handleChange);
		this.clearButton.removeEventListener("click", this.handleClear);
	}

	/** Update presentation without replacing the native editor. */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (!this.isConnected || oldValue === newValue) return;
		if (name === "label") this.render();
		else this.sync();
	}

	/** Focus the native number input or slider. */
	public override focus(options?: FocusOptions): void {
		this.field.focus(options);
	}

	/** Empty a number or reset a slider to its native midpoint and notify consumers. */
	public clear(): void {
		if (this.disabled || this.readOnly || (!this.range && this.value === ""))
			return;
		this.value = "";
		this.sync();
		this.focus();
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
		this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
		this.dispatchEvent(
			new CustomEvent("tp-clear", { bubbles: true, composed: true }),
		);
	}

	/** Build the familiar field shell using shared styles and existing icon components. */
	private render(): void {
		const wrapper = document.createElement("span");
		wrapper.setAttribute("data-tp-numberfield-control", "");
		this.field.setAttribute("data-tp-numberfield-input", "");
		this.clearButton.setAttribute("data-tp-numberfield-clear", "");
		this.clearButton.setAttribute("name", "close");
		this.clearButton.setAttribute("size", "s");
		const marker = document.createElement("tp-icon");
		marker.setAttribute("data-tp-numberfield-type", "");
		marker.setAttribute("name", "numberfield-mark");
		marker.setAttribute("library", "components");
		marker.setAttribute("size", "1.25em");
		marker.setAttribute("aria-hidden", "true");
		this.readout.setAttribute("data-tp-numberfield-value", "");
		this.readout.setAttribute("aria-hidden", "true");
		const suffix = document.createElement("span");
		suffix.setAttribute("data-tp-numberfield-suffix", "");
		suffix.append(marker, this.readout);
		this.submission.type = "hidden";
		this.submission.setAttribute("data-tp-numberfield-submission", "");
		wrapper.append(this.field, this.clearButton, suffix, this.submission);
		if (this.label) {
			const label = document.createElement("label");
			label.setAttribute("data-tp-numberfield-label", "");
			const text = document.createElement("span");
			text.setAttribute("data-tp-numberfield-label-text", "");
			text.textContent = this.label;
			label.append(text, wrapper);
			this.replaceChildren(label);
		} else this.replaceChildren(wrapper);
		this.sync();
	}

	/** Apply native number/range rules and reflect the sanitized value. */
	private sync(): void {
		if (this.syncing) return;
		this.syncing = true;
		try {
			const value = this.value;
			this.field.type = this.range ? "range" : "number";
			this.field.min = this.min;
			this.field.max = this.max;
			this.field.step = this.step;
			this.field.name = this.name;
			if (this.list) this.field.setAttribute("list", this.list);
			else this.field.removeAttribute("list");
			this.field.placeholder = this.placeholder;
			this.field.required = this.required && !this.range;
			this.field.readOnly = this.readOnly;
			this.field.disabled = this.disabled || (this.range && this.readOnly);
			const accessibleName = this.getAttribute("aria-label");
			if (accessibleName === null) this.field.removeAttribute("aria-label");
			else this.field.setAttribute("aria-label", accessibleName);
			if (this.field.value !== value) this.field.value = value;
			if (this.value !== this.field.value) this.value = this.field.value;
			this.readout.textContent = this.field.value;
			this.readout.hidden = !this.range;
			this.clearButton.hidden = !this.clearable;
			this.clearButton.disabled =
				this.disabled || this.readOnly || (!this.range && this.value === "");
			this.clearButton.label = this.range ? "Reset value" : "Clear number";
			this.submission.disabled = !(
				this.range &&
				this.readOnly &&
				!this.disabled
			);
			this.submission.name = this.name;
			this.submission.value = this.value;
			this.toggleAttribute("data-disabled", this.disabled);
		} finally {
			this.syncing = false;
		}
	}

	/** Forward one editing event after reflecting the native value. */
	private readonly handleInput = (event: Event): void => {
		event.stopPropagation();
		if (this.disabled || this.readOnly) {
			this.sync();
			return;
		}
		this.value = this.field.value;
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	};
	/** Reflect edits even when a browser commits without a preceding input event. */
	private readonly handleChange = (event: Event): void => {
		event.stopPropagation();
		if (this.disabled || this.readOnly) {
			this.sync();
			return;
		}
		this.value = this.field.value;
		this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
	};
	/** Delegate activation of the shared clear button to the public action. */
	private readonly handleClear = (): void => {
		this.clear();
	};
}

// Idempotent registration for lazy loading and direct imports.
if (!customElements.get("tp-numberfield"))
	customElements.define("tp-numberfield", TpNumberfield);

declare global {
	/** Typed DOM creation for the public numberfield tag. */
	interface HTMLElementTagNameMap {
		"tp-numberfield": TpNumberfield;
	}
}
