// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-datefield
 * @summary Native date field with labels, constraints, picker access, and clearing.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-mathfield
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @tp-dependency tp-timefield
 * @summary Native time field with labels, constraints, picker access, and clearing.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import { TpDatefield } from "../datefield/datefield.js";
import { TpMathfield } from "../mathfield/mathfield.js";
import { TpNumberfield } from "../numberfield/numberfield.js";
import { TpTextfield } from "../textfield/textfield.js";
import { TpTimefield } from "../timefield/timefield.js";
import style from "./blank.css?inline";

const fieldClasses = {
	text: TpTextfield,
	number: TpNumberfield,
	math: TpMathfield,
	date: TpDatefield,
	time: TpTimefield,
};
type BlankType = keyof typeof fieldClasses;
type OpenField =
	| TpTextfield
	| TpNumberfield
	| TpMathfield
	| TpDatefield
	| TpTimefield;

/**
 * @summary displays a text, SVG or image answer in a focusable blank.
 * @tagname tp-blank
 * @attr {string} aria-label = "" - Accessible name forwarded to the editing control; use it when the field has no visible label.
 * @attr {boolean} closed = false - Uses an answer-bank destination unless the question overrides the mode.
 * @attr {string} type = "text" - Open field type: text, number, math, date, or time.
 * @attr {string} name = "" - Name used by tp-fill-blank form data.
 * @attr {string} placeholder = "…" - Text displayed while the blank is empty.
 * @attr {boolean} disabled = false - Disables interaction.

 * @example
 * <tp-blank name="result" aria-label="Expected result"></tp-blank>
 * @cssprop [--tp-blank-filled-border-color=var(--tp-brand-stroke-mid)] Bottom border color of a blank after an answer has been filled in.
 * @event input Emitted when an answer is assigned or cleared; read the updated answer from value.
 * @eventdetail input void
 * @event tp-blank-mode-change Emitted when closed or type changes while connected, after the blank has been rendered in its new mode.
 * @eventdetail tp-blank-mode-change void
 * @accessibility Editable blanks delegate to the field matching their type and forward accessible naming attributes; closed blanks expose a named focusable group with aria-disabled reflecting availability.
 * @accessibility Delete and Backspace clear an enabled focused closed blank; its clear control is disabled when clearing is unavailable.
 * @accessibilityresponsibility Supply a descriptive label or aria-label for each answer location and text alternatives for image or SVG answers; do not rely on answer color or position alone.
 */
export class TpBlank extends TpBase {
	private editor: OpenField | null = null;
	private renderedType: BlankType | null = null;
	private renderedClosed: boolean | null = null;
	private readonly questionObserver = new MutationObserver(() =>
		this.syncMode(),
	);
	private readonly forwarded = new Set<string>();

	public get closed(): boolean {
		return this.hasAttribute("closed");
	}
	public set closed(value: boolean) {
		this.toggleAttribute("closed", value);
	}
	public get type(): BlankType {
		const value = this.getAttribute("type") ?? "text";
		return Object.hasOwn(fieldClasses, value) ? (value as BlankType) : "text";
	}
	public set type(value: BlankType) {
		this.setAttribute("type", value);
	}
	public get effectiveClosed(): boolean {
		const policy = this.closest(
			"[data-tp-question], tp-question, tp-fill-blank-question",
		)?.getAttribute("mode");
		return policy === "closed" || (policy !== "opened" && this.closed);
	}
	/** Reconciles the local control with the nearest question without changing author attributes. */
	public syncMode(): void {
		this.render();
	}

	/** Stored answer identity, independent of the displayed markup. */
	private currentValue = "";
	/** Previously assigned content allows form-data restoration without losing SVG. */
	private readonly answers = new Map<string, Node>();
	/** Stable trailing controls, kept outside the rich answer content. */
	private tools: HTMLElement | null = null;
	/** Built-in clear control reused across renders. */
	private clearButton: HTMLElement | null = null;
	/** Attributes whose changes affect the visible control. */
	public static override get observedAttributes(): string[] {
		return [
			...new Set(
				Object.values(fieldClasses).flatMap(
					(field) => field.observedAttributes,
				),
			),
			...TpBase.observedAttributes,
			"closed",
			"type",
			"name",
			"placeholder",
			"disabled",
			"aria-label",
		];
	}
	/** Field name included in form data. */
	public get name(): string {
		return this.getAttribute("name") ?? "";
	}
	public set name(value: string) {
		this.setAttribute("name", value);
	}
	/** Whether the destination is unavailable. */
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}
	/** Closed blanks are readonly; open fields follow the author readonly setting. */
	public get readOnly(): boolean {
		return this.effectiveClosed || this.hasAttribute("readonly");
	}
	public set readOnly(_value: boolean) {
		/* The author readonly setting belongs to the blank, not the bank. */
	}
	/** Answer identity (one-based source-list rank in a closed question). */
	public get value(): string {
		return this.editor?.value ?? this.currentValue;
	}
	public set value(value: string) {
		this.currentValue = value;
		if (this.editor) this.editor.value = value;
		else this.render();
	}
	/** Assigns an identity and clones its visual content without moving the source. */
	public setAnswer(value: string, content: Node): void {
		if (this.disabled || !this.effectiveClosed) return;
		this.answers.set(value, content.cloneNode(true));
		this.value = value;
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	}
	/** Empties the blank and notifies its form. */
	public clear(): void {
		if (this.disabled) return;
		this.value = "";
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	}
	/** Installs shared styles and makes the destination itself keyboard-focusable. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-blank-styles", style);
		this.render();
		const question = this.closest(
			"[data-tp-question], tp-question, tp-fill-blank-question",
		);
		if (question)
			this.questionObserver.observe(question, {
				attributes: true,
				attributeFilter: ["mode"],
			});
		this.addEventListener("keydown", this.onKeyDown);
	}
	/** Removes the standalone clearing shortcut on disconnect. */
	public disconnectedCallback(): void {
		this.removeEventListener("keydown", this.onKeyDown);
		this.questionObserver.disconnect();
	}
	/** Reflects attributes without losing assigned content. */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue || !this.isConnected) return;
		this.render();
		if (name === "closed" || name === "type")
			this.dispatchEvent(new Event("tp-blank-mode-change", { bubbles: true }));
	}
	/** Supports clearing a standalone focused blank. */
	private readonly onKeyDown = (event: KeyboardEvent): void => {
		if (
			!this.effectiveClosed ||
			event.target !== this ||
			!["Delete", "Backspace"].includes(event.key)
		)
			return;
		event.preventDefault();
		this.clear();
	};
	/** Clears without treating the close click as a new answer assignment. */
	private readonly onClearClick = (event: Event): void => {
		event.stopPropagation();
		this.clear();
		if (!this.disabled) this.focus();
	};
	/** Places answer nodes directly in the host, preserving SVG semantics and host focus. */
	private render(): void {
		if (!this.isConnected) return;
		const closed = this.effectiveClosed;
		if (this.renderedClosed !== null && this.renderedClosed !== closed)
			this.currentValue = "";
		if (this.editor && !closed) this.currentValue = this.editor.value;
		this.renderedClosed = closed;
		this.toggleAttribute("data-tp-blank-open", !closed);
		if (!closed) {
			this.tabIndex = -1;
			this.setAttribute("aria-disabled", String(this.disabled));
			this.removeAttribute("data-tp-blank-filled");
			if (!this.editor || this.renderedType !== this.type) {
				this.editor = document.createElement(
					`tp-${this.type}field`,
				) as OpenField;
				this.renderedType = this.type;
				this.replaceChildren(this.editor);
			}
			const allowed = fieldClasses[this.type].observedAttributes;
			for (const name of this.forwarded)
				if (!this.hasAttribute(name)) this.editor.removeAttribute(name);
			this.forwarded.clear();
			for (const { name, value } of this.attributes) {
				if (
					[
						"closed",
						"type",
						"value",
						"id",
						"class",
						"style",
						"tabindex",
					].includes(name)
				)
					continue;
				if (allowed.includes(name) || name.startsWith("aria-")) {
					this.editor.setAttribute(name, value);
					this.forwarded.add(name);
				}
			}
			if (
				!this.editor.hasAttribute("label") &&
				!this.editor.hasAttribute("aria-label")
			)
				this.editor.setAttribute("aria-label", this.name || "Answer");
			this.editor.setAttribute("clearable", "");
			this.editor.value = this.currentValue;
			return;
		}
		this.editor = null;
		this.renderedType = null;
		this.tabIndex = this.disabled ? -1 : 0;
		this.setAttribute("role", "group");
		this.setAttribute("aria-disabled", String(this.disabled));
		if (!this.hasAttribute("aria-label"))
			this.setAttribute("aria-label", this.name || "Answer");
		this.toggleAttribute("data-tp-blank-filled", this.value !== "");
		if (!this.tools) {
			this.tools = document.createElement("span");
			this.tools.setAttribute("data-tp-blank-tools", "");
			this.clearButton = document.createElement("tp-icon-button");
			this.clearButton.setAttribute("data-tp-blank-clear", "");
			this.clearButton.setAttribute("name", "close");
			this.clearButton.setAttribute("label", "Clear answer");
			this.clearButton.setAttribute("size", "s");
			this.clearButton.addEventListener("click", this.onClearClick);
			// const marker = document.createElement("span");
			// marker.setAttribute("aria-hidden", "true");
			// marker.textContent = "…";
			this.tools.append(this.clearButton /*, marker*/);
		}
		this.clearButton?.toggleAttribute(
			"disabled",
			this.disabled || this.value === "",
		);
		const content = this.answers.get(this.value);
		if (this.value && content)
			this.replaceChildren(content.cloneNode(true), this.tools);
		else
			this.replaceChildren(
				document.createTextNode(
					this.value || this.getAttribute("placeholder") || "",
				),
				this.tools,
			);
	}
}

if (!customElements.get("tp-blank")) customElements.define("tp-blank", TpBlank);

/** Recognizes registered blanks even when hot reload creates a new module constructor. */
export function isTpBlank(element: Element): element is TpBlank {
	return (
		element.localName === "tp-blank" &&
		"setAnswer" in element &&
		typeof element.setAnswer === "function"
	);
}
declare global {
	interface HTMLElementTagNameMap {
		"tp-blank": TpBlank;
	}
}
