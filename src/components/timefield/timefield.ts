/**
 * @module components/timefield
 * @summary Native time field with labels, constraints, picker access, and clearing.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { initializeFieldName } from "../../utilities/field-name.js";
import style from "./timefield.css?inline";
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";

export type TpTimefieldLabelPosition = "top" | "bottom" | "start" | "end";
const LABEL_POSITIONS = new Set<TpTimefieldLabelPosition>([
	"top",
	"bottom",
	"start",
	"end",
]);

/**
 * @summary Native time field with labels, constraints, picker access, and clearing.
 * @tagname tp-timefield
 * @attr {string} label = "" - Visible label associated with the native time input.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} value = "" - Selected time in `HH:mm` or `HH:mm:ss` format.
 * @attr {string} min = "" - Earliest selectable time.
 * @attr {string} max = "" - Latest selectable time.
 * @attr {number} step = 60 - Time interval in seconds.
 * @attr {string} placeholder = "" - Hint forwarded to the native input; browsers may ignore it for date and time controls.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} autocomplete = "" - Native autocomplete hint.
 * @attr {boolean} required = false - Marks the field as required.
 * @attr {boolean} readonly = false - Prevents value editing.
 * @attr {boolean} disabled = false - Disables the field and its action buttons.
 * @attr {boolean} clearable = false - Shows an embedded clear button while the field has a value.
 * @event input Emitted when the selected time changes while editing.
 * @event change Emitted when the selected time is committed.
 * @event tp-clear Emitted after the embedded button clears the value.
 * @cssprop [--tp-timefield-background=var(--tp-paper-color)] Field background.
 * @cssprop [--tp-timefield-border-color=var(--tp-neutral-stroke-soft)] Field border color.
 * @cssprop [--tp-timefield-focus-color=var(--tp-brand-text-colorful)] Focus border color.
 * @cssprop [--tp-timefield-inline-size=10.5em] Field width.
 * @cssprop [--tp-timefield-label-font-weight=500] Label font weight.
 * @cssprop [--tp-timefield-label-gap=0.35em] Space between the label and its field.
 * @cssprop [--tp-timefield-padding-block=0.6em] Vertical field padding.
 * @cssprop [--tp-timefield-padding-inline=0.75em] Horizontal field padding.
 * @cssprop [--tp-timefield-radius=var(--tp-border-radius-sm)] Field border radius.
 * @cssprop [--tp-timefield-required-color=var(--tp-danger-text-colorful)] Required marker color.
 * @cssprop [--tp-timefield-value-font-weight=400] Selected value font weight.
 * @example
 * <tp-timefield label="Time" value="14:30" clearable></tp-timefield>
 */
export class TpTimefield extends TpBase {
	private static readonly styleId = "tp-timefield-styles";
	private field: HTMLInputElement | null = null;
	private clearButton: HTMLElement | null = null;
	private pickerButton: HTMLElement | null = null;

	public static get observedAttributes(): string[] {
		return [
			"label",
			"label-position",
			"value",
			"min",
			"max",
			"step",
			"name",
			"autocomplete",
			"placeholder",
			"required",
			"readonly",
			"disabled",
			"clearable",
		];
	}

	/** Visible label associated with the native time input. */
	public get label(): string {
		return this.getStringAttribute("label");
	}
	public set label(value: string) {
		this.setStringAttribute("label", value);
	}
	/** Position of the visible label around its field. */
	public get labelPosition(): TpTimefieldLabelPosition {
		const value = this.getAttribute(
			"label-position",
		) as TpTimefieldLabelPosition | null;
		return value !== null && LABEL_POSITIONS.has(value) ? value : "top";
	}
	public set labelPosition(value: TpTimefieldLabelPosition) {
		this.setStringAttribute("label-position", value);
	}
	/** Selected time in `HH:mm` or `HH:mm:ss` format. */
	public get value(): string {
		return this.field?.value ?? this.getStringAttribute("value");
	}
	public set value(value: string) {
		this.setStringAttribute("value", value);
	}
	/** Earliest selectable time. */
	public get min(): string {
		return this.getStringAttribute("min");
	}
	public set min(value: string) {
		this.setStringAttribute("min", value);
	}
	/** Latest selectable time. */
	public get max(): string {
		return this.getStringAttribute("max");
	}
	public set max(value: string) {
		this.setStringAttribute("max", value);
	}
	/** Time interval in seconds. */
	public get step(): number {
		const value = Number(this.getAttribute("step") ?? "60");
		return Number.isFinite(value) && value > 0 ? value : 60;
	}
	public set step(value: number) {
		this.setStringAttribute("step", String(value));
	}
	/** Hint forwarded to the native input; browser support depends on input type. */
	public get placeholder(): string {
		return this.getStringAttribute("placeholder");
	}
	public set placeholder(value: string) {
		this.setStringAttribute("placeholder", value);
	}

	/** Name submitted with the containing form; defaults to the initial inline content when omitted. */
	public get name(): string {
		return this.getStringAttribute("name");
	}
	public set name(value: string) {
		this.setStringAttribute("name", value);
	}
	/** Native autocomplete hint. */
	public get autocomplete(): string {
		return this.getStringAttribute("autocomplete");
	}
	public set autocomplete(value: string) {
		this.setStringAttribute("autocomplete", value);
	}
	/** Whether a value is required. */
	public get required(): boolean {
		return this.getBooleanAttribute("required");
	}
	public set required(value: boolean) {
		this.setBooleanAttribute("required", value);
	}
	/** Whether the value cannot be edited. */
	public get readOnly(): boolean {
		return this.getBooleanAttribute("readonly");
	}
	public set readOnly(value: boolean) {
		this.setBooleanAttribute("readonly", value);
	}
	/** Whether the field is disabled. */
	public get disabled(): boolean {
		return this.getBooleanAttribute("disabled");
	}
	public set disabled(value: boolean) {
		this.setBooleanAttribute("disabled", value);
	}
	/** Whether the embedded clear button can be displayed. */
	public get clearable(): boolean {
		return this.getBooleanAttribute("clearable");
	}
	public set clearable(value: boolean) {
		this.setBooleanAttribute("clearable", value);
	}

	protected override connectedCallback(): void {
		initializeFieldName(this);
		super.connectedCallback();
		this.ensureGlobalStyle(TpTimefield.styleId, style);
		this.render();
	}

	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue || !this.isConnected) return;
		if (name === "label") this.render();
		else this.sync();
	}

	/** Focuses the native time input. */
	public override focus(options?: FocusOptions): void {
		this.field?.focus(options);
	}
	/** Opens the native time picker when supported by the browser. */
	public showPicker(): void {
		if (this.disabled || this.readOnly) return;
		try {
			this.field?.showPicker();
		} catch {
			this.field?.focus();
		}
	}
	/** Clears the selected time and emits `input`, `change`, and `tp-clear`. */
	public clear(): void {
		if (this.disabled || this.readOnly || this.value === "") return;
		this.setValue("", true);
		this.focus();
		this.dispatchEvent(
			new CustomEvent("tp-clear", { bubbles: true, composed: true }),
		);
	}

	private render(): void {
		const wrapper = document.createElement("span");
		wrapper.setAttribute("data-tp-timefield-control", "");
		this.field = document.createElement("input");
		this.field.type = "time";
		this.field.setAttribute("data-tp-timefield-input", "");
		this.field.addEventListener("input", this.handleInput);
		this.field.addEventListener("change", this.handleChange);
		this.clearButton = this.createButton("close", "Clear time", "clear");
		this.clearButton.addEventListener("click", this.handleClear);
		this.pickerButton = this.createButton(
			"clock-outline",
			"Open time picker",
			"picker",
		);
		this.pickerButton.addEventListener("click", this.handlePicker);
		wrapper.append(this.field, this.clearButton, this.pickerButton);
		if (this.label === "") this.replaceChildren(wrapper);
		else {
			const label = document.createElement("label");
			label.setAttribute("data-tp-timefield-label", "");
			const text = document.createElement("span");
			text.setAttribute("data-tp-timefield-label-text", "");
			text.textContent = this.label;
			label.append(text, wrapper);
			this.replaceChildren(label);
		}
		this.sync();
	}

	private createButton(name: string, label: string, role: string): HTMLElement {
		const button = document.createElement("tp-icon-button");
		button.setAttribute(`data-tp-timefield-${role}`, "");
		button.setAttribute("name", name);
		button.setAttribute("label", label);
		button.setAttribute("size", "s");
		return button;
	}

	private sync(): void {
		if (
			this.field === null ||
			this.clearButton === null ||
			this.pickerButton === null
		)
			return;
		const value = this.getStringAttribute("value");
		if (this.field.value !== value) this.field.value = value;
		this.field.min = this.min;
		this.field.max = this.max;
		this.field.step = String(this.step);
		this.field.name = this.name;
		this.field.placeholder = this.placeholder;
		if (this.autocomplete === "") this.field.removeAttribute("autocomplete");
		else this.field.setAttribute("autocomplete", this.autocomplete);
		this.field.required = this.required;
		this.field.readOnly = this.readOnly;
		this.field.disabled = this.disabled;
		this.clearButton.toggleAttribute(
			"hidden",
			!this.clearable || this.field.value === "",
		);
		this.clearButton.toggleAttribute(
			"disabled",
			this.disabled || this.readOnly,
		);
		this.pickerButton.toggleAttribute(
			"disabled",
			this.disabled || this.readOnly,
		);
		this.toggleAttribute("data-disabled", this.disabled);
	}

	private readonly handleInput = (event: Event): void => {
		event.stopPropagation();
		if (this.field === null) return;
		this.setStringAttribute("value", this.field.value);
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	};
	private readonly handleChange = (event: Event): void => {
		event.stopPropagation();
		this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
	};
	private readonly handleClear = (): void => {
		this.clear();
	};
	private readonly handlePicker = (): void => {
		this.showPicker();
	};
	private setValue(value: string, emit: boolean): void {
		this.setStringAttribute("value", value);
		if (this.field !== null) this.field.value = value;
		this.sync();
		if (!emit) return;
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
		this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
	}
}

if (!customElements.get("tp-timefield"))
	customElements.define("tp-timefield", TpTimefield);

declare global {
	interface HTMLElementTagNameMap {
		"tp-timefield": TpTimefield;
	}
}
