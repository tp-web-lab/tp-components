/**
 * @module components/textfield
 * @summary Single-line and automatically growing multiline text field.
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

import { initializeFieldName } from "../../utilities/field-name.js";
import style from "./textfield.css?inline";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";

export type TpTextfieldType =
	| "text"
	| "email"
	| "password"
	| "search"
	| "tel"
	| "url";
export type TpTextfieldLabelPosition = "top" | "bottom" | "start" | "end";

const TEXTFIELD_TYPES = new Set<TpTextfieldType>([
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url",
]);
const LABEL_POSITIONS = new Set<TpTextfieldLabelPosition>([
	"top",
	"bottom",
	"start",
	"end",
]);

type TextControl = HTMLInputElement | HTMLTextAreaElement;

/**
 * @summary Single-line and automatically growing multiline text field.
 * @tagname tp-textfield
 * @attr {string} type = "text" - Input type (`text`, `email`, `password`, `search`, `tel`, or `url`).
 * @attr {boolean} multiline = false - Uses an automatically growing textarea instead of an input.
 * @attr {string} label = "" - Visible label associated with the native input or textarea.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} value = "" - Current field value.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} placeholder = "" - Placeholder shown while the field is empty.
 * @attr {string} autocomplete = "" - Native autocomplete hint.
 * @attr {number} rows = 3 - Minimum number of rows in multiline mode.
 * @attr {boolean} required = false - Marks the field as required.
 * @attr {boolean} readonly = false - Prevents value editing.
 * @attr {boolean} disabled = false - Disables the field and its clear button.
 * @attr {boolean} clearable = false - Shows the clear button; it is disabled when empty, readonly or disabled.
 * @attr {string} icon = "" - Prefix icon name.
 * @attr {string} icon-library = "tp" - Prefix icon library.
 * @event input Emitted when the value changes while editing.
 * @event change Emitted when the edited value is committed.
 * @event tp-clear Emitted after the embedded button clears the value.
 * @cssprop [--tp-textfield-background=var(--tp-paper-color)] Field background.
 * @cssprop [--tp-textfield-border-color=var(--tp-neutral-stroke-soft)] Field border color.
 * @cssprop [--tp-textfield-focus-color=var(--tp-brand-text-colorful)] Focus border color.
 * @cssprop [--tp-textfield-inline-size=20ch] Width of a single-line text field.
 * @cssprop [--tp-textfield-label-gap=0.35em] Space between the label and its field.
 * @cssprop [--tp-textfield-label-font-weight=500] Label font weight.
 * @cssprop [--tp-textfield-radius=var(--tp-border-radius-sm)] Field border radius.
 * @cssprop [--tp-textfield-required-color=var(--tp-danger-text-colorful)] Required marker color.
 * @cssprop [--tp-textfield-padding-block=0.6em] Vertical field padding.
 * @cssprop [--tp-textfield-padding-inline=0.75em] Horizontal field padding.
 * @cssprop [--tp-textfield-value-font-weight=400] Entered value and placeholder font weight.
 * @example
 * <tp-textfield label="Single line" placeholder="Type some text..." clearable></tp-textfield>
 *
 *     <tp-textfield label="Multiline" multiline placeholder="Type some text..." clearable value="An example of text that has already been entered in the field"></tp-textfield>
 */
export class TpTextfield extends TpBase {
	private static readonly textfieldStyleId = "tp-textfield-styles";
	private field: TextControl | null = null;
	private prefixIcon: HTMLElement | null = null;
	private clearButton: HTMLElement | null = null;

	public static get observedAttributes(): string[] {
		return [
			"type",
			"multiline",
			"label",
			"label-position",
			"value",
			"name",
			"placeholder",
			"autocomplete",
			"rows",
			"required",
			"readonly",
			"disabled",
			"clearable",
			"icon",
			"icon-library",
			"aria-label",
		];
	}

	/** Native input type used in single-line mode. */
	public get type(): TpTextfieldType {
		const value = this.getAttribute("type") as TpTextfieldType | null;
		return value !== null && TEXTFIELD_TYPES.has(value) ? value : "text";
	}

	public set type(value: TpTextfieldType) {
		this.setStringAttribute("type", value);
	}

	/** Whether the control uses an automatically growing textarea. */
	public get multiline(): boolean {
		return this.getBooleanAttribute("multiline");
	}
	public set multiline(value: boolean) {
		this.setBooleanAttribute("multiline", value);
	}

	/** Visible label associated with the native input or textarea. */
	public get label(): string {
		return this.getStringAttribute("label");
	}
	public set label(value: string) {
		this.setStringAttribute("label", value);
	}

	/** Position of the visible label around its field. */
	public get labelPosition(): TpTextfieldLabelPosition {
		const value = this.getAttribute(
			"label-position",
		) as TpTextfieldLabelPosition | null;
		return value !== null && LABEL_POSITIONS.has(value) ? value : "top";
	}
	public set labelPosition(value: TpTextfieldLabelPosition) {
		this.setStringAttribute("label-position", value);
	}

	/** Current field value. */
	public get value(): string {
		return this.field?.value ?? this.getStringAttribute("value");
	}
	public set value(value: string) {
		this.setStringAttribute("value", value);
	}

	/** Name submitted with the containing form; defaults to the initial inline content when omitted. */
	public get name(): string {
		return this.getStringAttribute("name");
	}
	public set name(value: string) {
		this.setStringAttribute("name", value);
	}

	/** Placeholder shown while the field is empty. */
	public get placeholder(): string {
		return this.getStringAttribute("placeholder");
	}
	public set placeholder(value: string) {
		this.setStringAttribute("placeholder", value);
	}

	/** Native autocomplete hint. */
	public get autocomplete(): string {
		return this.getStringAttribute("autocomplete");
	}
	public set autocomplete(value: string) {
		this.setStringAttribute("autocomplete", value);
	}

	/** Minimum number of rows used in multiline mode. */
	public get rows(): number {
		const value = Number(this.getAttribute("rows") ?? "3");
		return Number.isInteger(value) && value > 0 ? value : 3;
	}

	public set rows(value: number) {
		this.setStringAttribute("rows", String(value));
	}

	/** Whether a value is required for native form validation. */
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

	/** Whether the complete field is disabled. */
	public get disabled(): boolean {
		return this.getBooleanAttribute("disabled");
	}
	public set disabled(value: boolean) {
		this.setBooleanAttribute("disabled", value);
	}

	/** Whether the embedded clear button is displayed. */
	public get clearable(): boolean {
		return this.getBooleanAttribute("clearable");
	}
	public set clearable(value: boolean) {
		this.setBooleanAttribute("clearable", value);
	}

	/** Prefix icon name. */
	public get icon(): string {
		return this.getStringAttribute("icon");
	}
	public set icon(value: string) {
		this.setStringAttribute("icon", value);
	}

	/** Prefix icon library. */
	public get iconLibrary(): string {
		return this.getAttribute("icon-library") ?? "tp";
	}
	public set iconLibrary(value: string) {
		this.setStringAttribute("icon-library", value);
	}

	protected override connectedCallback(): void {
		initializeFieldName(this);
		super.connectedCallback();
		this.ensureGlobalStyle(TpTextfield.textfieldStyleId, style);
		this.render();
	}

	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue || !this.isConnected) return;
		if (name === "multiline" || name === "label") this.render();
		else this.sync();
	}

	/** Focuses the native input or textarea. */
	public override focus(options?: FocusOptions): void {
		this.field?.focus(options);
	}

	/** Selects the complete field value. */
	public select(): void {
		this.field?.select();
	}

	/** Clears the field and emits `input`, `change`, and `tp-clear`. */
	public clear(): void {
		if (this.disabled || this.readOnly || this.value === "") return;
		this.setValue("", true);
		this.focus();
		this.dispatchEvent(
			new CustomEvent("tp-clear", { bubbles: true, composed: true }),
		);
	}

	private render(): void {
		const currentValue = this.value;
		const wrapper = document.createElement("span");
		wrapper.setAttribute("data-tp-textfield-control", "");

		this.prefixIcon = document.createElement("tp-icon");
		this.prefixIcon.setAttribute("data-tp-textfield-prefix", "");
		this.prefixIcon.setAttribute("size", "1.25em");
		this.prefixIcon.setAttribute("aria-hidden", "true");

		this.field = this.multiline
			? document.createElement("textarea")
			: document.createElement("input");
		this.field.setAttribute("data-tp-textfield-input", "");
		this.field.addEventListener("input", this.handleInput);
		this.field.addEventListener("change", this.handleChange);

		this.clearButton = document.createElement("tp-icon-button");
		this.clearButton.setAttribute("data-tp-textfield-clear", "");
		this.clearButton.setAttribute("name", "close");
		this.clearButton.setAttribute("label", "Clear");
		this.clearButton.setAttribute("size", "s");
		this.clearButton.addEventListener("click", this.handleClear);

		const typeMarker = document.createElement("tp-icon");
		typeMarker.setAttribute("data-tp-textfield-type", "");
		typeMarker.setAttribute(
			"name",
			this.closest("tp-mathfield") ? "mathfield-mark" : "textfield-mark",
		);
		typeMarker.setAttribute("library", "components");
		typeMarker.setAttribute("size", "1.25em");
		typeMarker.setAttribute("aria-hidden", "true");
		wrapper.append(this.prefixIcon, this.field, this.clearButton, typeMarker);
		if (this.label === "") this.replaceChildren(wrapper);
		else {
			const label = document.createElement("label");
			label.setAttribute("data-tp-textfield-label", "");
			const labelText = document.createElement("span");
			labelText.setAttribute("data-tp-textfield-label-text", "");
			labelText.textContent = this.label;
			label.append(labelText, wrapper);
			this.replaceChildren(label);
		}
		this.field.value = currentValue;
		this.sync();
		requestAnimationFrame(() => this.resizeTextarea());
	}

	private sync(): void {
		if (
			this.field === null ||
			this.prefixIcon === null ||
			this.clearButton === null
		)
			return;
		if (this.field.value !== this.getStringAttribute("value"))
			this.field.value = this.getStringAttribute("value");

		if (this.field instanceof HTMLInputElement) this.field.type = this.type;
		if (this.field instanceof HTMLTextAreaElement) this.field.rows = this.rows;
		this.field.name = this.name;
		this.field.placeholder = this.placeholder;
		const accessibleLabel = this.getAttribute("aria-label");
		if (accessibleLabel === null) this.field.removeAttribute("aria-label");
		else this.field.setAttribute("aria-label", accessibleLabel);
		if (this.autocomplete === "") this.field.removeAttribute("autocomplete");
		else this.field.setAttribute("autocomplete", this.autocomplete);
		this.field.required = this.required;
		this.field.readOnly = this.readOnly;
		this.field.disabled = this.disabled;

		this.prefixIcon.setAttribute("name", this.icon);
		this.prefixIcon.setAttribute("library", this.iconLibrary);
		this.prefixIcon.toggleAttribute("hidden", this.icon === "");
		this.clearButton.toggleAttribute("hidden", !this.clearable);
		this.clearButton.toggleAttribute(
			"disabled",
			this.disabled || this.readOnly || this.field.value === "",
		);
		this.toggleAttribute("data-disabled", this.disabled);
		this.resizeTextarea();
	}

	private readonly handleInput = (event: Event): void => {
		event.stopPropagation();
		if (this.field === null) return;
		this.setStringAttribute("value", this.field.value);
		this.resizeTextarea();
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	};

	private readonly handleChange = (event: Event): void => {
		event.stopPropagation();
		this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
	};

	private readonly handleClear = (): void => {
		this.clear();
	};

	private setValue(value: string, emit: boolean): void {
		this.setStringAttribute("value", value);
		if (this.field !== null) this.field.value = value;
		this.sync();
		if (emit) {
			this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
			this.dispatchEvent(
				new Event("change", { bubbles: true, composed: true }),
			);
		}
	}

	private resizeTextarea(): void {
		if (!(this.field instanceof HTMLTextAreaElement)) return;
		this.field.style.height = "auto";
		const height = this.field.scrollHeight;
		if (height > 0) this.field.style.height = `${String(height)}px`;
		else this.field.style.removeProperty("height");
	}
}

if (!customElements.get("tp-textfield"))
	customElements.define("tp-textfield", TpTextfield);

declare global {
	interface HTMLElementTagNameMap {
		"tp-textfield": TpTextfield;
	}
}
