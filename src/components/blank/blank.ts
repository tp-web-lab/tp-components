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

import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import style from "./blank.css?inline";

/**
 * @summary displays a text, SVG or image answer in a focusable blank.
 * @tagname tp-blank
 * @attr {string} name = "" - Name used by tp-fill-blank form data.
 * @attr {string} placeholder = "…" - Text displayed while the blank is empty.
 * @attr {boolean} disabled = false - Disables interaction.
 * @event input - Emitted when an answer is assigned or cleared.
 * @example
 * <tp-blank name="result" aria-label="Expected result"></tp-blank>
 */
export class TpBlank extends TpBase {
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
			...TpBase.observedAttributes,
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
	/** Blanks never permit free text editing; retained for field-controller compatibility. */
	public get readOnly(): boolean {
		return true;
	}
	public set readOnly(_value: boolean) {
		/* A blank is always selection-only. */
	}
	/** Answer identity (one-based source-list rank in a closed question). */
	public get value(): string {
		return this.currentValue;
	}
	public set value(value: string) {
		this.currentValue = value;
		this.render();
	}
	/** Assigns an identity and clones its visual content without moving the source. */
	public setAnswer(value: string, content: Node): void {
		if (this.disabled) return;
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
		this.addEventListener("keydown", this.onKeyDown);
	}
	/** Removes the standalone clearing shortcut on disconnect. */
	public disconnectedCallback(): void {
		this.removeEventListener("keydown", this.onKeyDown);
	}
	/** Reflects attributes without losing assigned content. */
	protected override attributeChangedCallback(): void {
		if (this.isConnected) this.render();
	}
	/** Supports clearing a standalone focused blank. */
	private readonly onKeyDown = (event: KeyboardEvent): void => {
		if (!["Delete", "Backspace"].includes(event.key)) return;
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
			this.tools.append(this.clearButton/*, marker*/);
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
