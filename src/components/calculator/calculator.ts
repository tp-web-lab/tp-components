/** @module components/calculator */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../icon-button/icon-button.js";
import "../textfield/textfield.js";
import type { TpTextfield } from "../textfield/textfield.js";
import style from "./calculator.css?inline";
import { calculate } from "./calculator-engine.js";

/**
 * @summary Scientific calculator with an editable expression and degree/radian modes.
 * @tagname tp-calculator
 * @attr {"horizontal" | "vertical"} orientation = "horizontal" - Arrangement of the scientific and numeric keypads.
 * @event tp-calculator-result Emitted after a successful calculation.
 * @eventdetail tp-calculator-result { expression: string; result: number }
 * @keyboard {Enter / =} Evaluates the expression while its field is focused.
 * @keyboard {Escape} Clears the expression while its field is focused.
 * @example
 * <tp-calculator></tp-calculator>
 */
export class TpCalculator extends TpBase {
	private field: TpTextfield | null = null;
	private status: HTMLElement | null = null;
	private degreeButton: HTMLElement | null = null;
	private orientationButton: HTMLElement | null = null;
	private degrees = true;
	private start = 0;
	private end = 0;
	private evaluated = false;
	public static get observedAttributes(): string[] {
		return ["orientation"];
	}
	/** Keypad arrangement. @attr orientation */
	public get orientation(): "horizontal" | "vertical" {
		return this.getAttribute("orientation") === "vertical"
			? "vertical"
			: "horizontal";
	}
	public set orientation(value: "horizontal" | "vertical") {
		this.setAttribute("orientation", value);
	}
	protected attributeChangedCallback(): void {
		this.syncOrientation();
	}
	private syncOrientation(): void {
		this.dataset.orientation = this.orientation;
		const target =
			this.orientation === "horizontal" ? "vertical" : "horizontal";
		this.orientationButton?.setAttribute("name", `arrow-expand-${target}`);
		this.orientationButton?.setAttribute(
			"label",
			`Switch to ${target} orientation`,
		);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-calculator-style", style);
		this.dataset.orientation = this.orientation;
		if (this.field) return;
		const title = document.createElement("h3");
		title.textContent = "Calculator";
		const header = document.createElement("div");
		header.className = "tp-calculator-header";
		this.orientationButton = document.createElement("tp-icon-button");
		this.orientationButton.setAttribute("type", "button");
		this.orientationButton.addEventListener("click", () => {
			this.orientation =
				this.orientation === "horizontal" ? "vertical" : "horizontal";
		});
		this.syncOrientation();
		header.append(title, this.orientationButton);
		this.field = document.createElement("tp-textfield");
		this.field.setAttribute("label", "Expression");
		this.field.setAttribute("label-position", "top");
		this.field.setAttribute("placeholder", "0");
		this.field.addEventListener("input", () => {
			this.evaluated = false;
			this.clearStatus();
			this.rememberSelection();
		});
		this.field.addEventListener("keyup", () => this.rememberSelection());
		this.field.addEventListener("click", () => this.rememberSelection());
		this.field.addEventListener("focusout", () => this.rememberSelection());
		this.field.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === "=") {
				event.preventDefault();
				this.equals();
			} else if (event.key === "Escape") {
				event.preventDefault();
				this.clear();
			}
		});
		this.status = document.createElement("p");
		this.status.className = "tp-calculator-status";
		this.status.setAttribute("role", "status");
		const pads = document.createElement("div");
		pads.className = "tp-calculator-pads";
		const scientific = document.createElement("div");
		scientific.className = "tp-calculator-scientific";
		const numeric = document.createElement("div");
		numeric.className = "tp-calculator-numeric";
		const key = (
			parent: HTMLElement,
			label: string,
			action: () => void,
			description = label,
		) => {
			const button = document.createElement("tp-button");
			const caption = document.createElement("span");
			caption.dataset.calculatorKey = "";
			caption.textContent = label;
			button.append(caption);
			button.setAttribute("type", "button");
			button.setAttribute("aria-label", description);
			button.addEventListener("pointerdown", (e) => e.preventDefault());
			button.addEventListener("click", action);
			parent.append(button);
			return button;
		};
		this.degreeButton = key(
			scientific,
			"Deg",
			() => {
				this.degrees = !this.degrees;
				if (this.degreeButton) {
					const caption = this.degreeButton.querySelector(
						"[data-calculator-key]",
					);
					if (caption) caption.textContent = this.degrees ? "Deg" : "Rad";
					this.degreeButton.setAttribute(
						"aria-label",
						this.degrees
							? "Degrees; switch to radians"
							: "Radians; switch to degrees",
					);
				}
			},
			"Degrees; switch to radians",
		);
		key(scientific, "(", () => this.insert("("));
		key(scientific, ")", () => this.insert(")"));
		key(scientific, "%", () => this.insert("%"));
		for (const [label, prefix, suffix] of [
			["x²", "(", ")^2"],
			["xⁿ", "(", ")^"],
			["eˣ", "exp(", ")"],
			["10ⁿ", "10^(", ")"],
			["1/x", "1/(", ")"],
			["√x", "sqrt(", ")"],
			["ʸ√x", "sqrt(", ",)"],
			["n!", "(", ")!"],
		])
			key(scientific, label ?? "", () => this.wrap(prefix ?? "", suffix ?? ""));
		for (const name of [
			"ln",
			"log",
			"sin",
			"cos",
			"tan",
			"sinh",
			"cosh",
			"tanh",
		])
			key(scientific, name, () => this.wrap(`${name}(`, ")"));
		key(scientific, "e", () => this.insert("e"));
		key(scientific, "π", () => this.insert("pi"), "Pi");
		key(
			scientific,
			"Rand",
			() => this.insert(String(Math.random())),
			"Random number",
		);
		key(scientific, ",", () => this.insert(","));
		for (const label of [
			"AC",
			"⌫",
			"±",
			"/",
			"7",
			"8",
			"9",
			"*",
			"4",
			"5",
			"6",
			"-",
			"1",
			"2",
			"3",
			"+",
			"0",
			".",
			"=",
			"",
		]) {
			if (!label) continue;
			key(
				numeric,
				label,
				() => {
					if (label === "AC") this.clear();
					else if (label === "⌫") this.backspace();
					else if (label === "±") this.wrap("-(", ")");
					else if (label === "=") this.equals();
					else this.insert(label);
				},
				label === "⌫"
					? "Delete previous character"
					: label === "AC"
						? "Clear all"
						: label,
			);
		}
		pads.append(scientific, numeric);
		this.replaceChildren(header, this.field, this.status, pads);
	}
	private rememberSelection(): void {
		const input = this.field?.querySelector("input");
		if (input) {
			this.start = input.selectionStart ?? 0;
			this.end = input.selectionEnd ?? this.start;
		}
	}
	private clearStatus(): void {
		if (this.status) this.status.textContent = "";
		this.field?.removeAttribute("aria-invalid");
	}
	private write(value: string, caret = value.length): void {
		if (!this.field) return;
		this.field.value = value;
		this.start = caret;
		this.end = caret;
		const input = this.field.querySelector("input");
		input?.focus();
		input?.setSelectionRange(caret, caret);
		this.clearStatus();
	}
	private insert(text: string): void {
		let value = this.field?.value ?? "";
		if (this.evaluated && !/^[+*/^%!-]$/.test(text)) {
			value = "";
			this.start = 0;
			this.end = 0;
		}
		this.evaluated = false;
		this.write(
			value.slice(0, this.start) + text + value.slice(this.end),
			this.start + text.length,
		);
	}
	private wrap(prefix: string, suffix: string): void {
		const value = this.field?.value ?? "";
		const selected = value.slice(this.start, this.end);
		const all = this.start === this.end && value.length > 0;
		const inner = all ? value : selected;
		const before = all ? "" : value.slice(0, this.start);
		const after = all ? "" : value.slice(this.end);
		this.evaluated = false;
		const result = before + prefix + inner + suffix + after;
		const caret =
			suffix === ",)"
				? before.length + prefix.length + inner.length + 1
				: inner
					? result.length - after.length
					: before.length + prefix.length;
		this.write(result, caret);
	}
	private backspace(): void {
		const value = this.field?.value ?? "";
		const start =
			this.start === this.end ? Math.max(0, this.start - 1) : this.start;
		this.evaluated = false;
		this.write(value.slice(0, start) + value.slice(this.end), start);
	}
	private clear(): void {
		this.evaluated = false;
		this.write("");
	}
	private equals(): void {
		const expression = this.field?.value ?? "";
		try {
			const result = calculate(expression, this.degrees);
			this.write(String(result));
			this.evaluated = true;
			if (this.status) this.status.textContent = `${expression} = ${result}`;
			this.dispatchEvent(
				new CustomEvent("tp-calculator-result", {
					bubbles: true,
					detail: { expression, result },
				}),
			);
		} catch (error) {
			if (this.status)
				this.status.textContent =
					error instanceof Error ? error.message : String(error);
			this.field?.setAttribute("aria-invalid", "true");
		}
	}
}
if (!customElements.get("tp-calculator"))
	customElements.define("tp-calculator", TpCalculator);
declare global {
	interface HTMLElementTagNameMap {
		"tp-calculator": TpCalculator;
	}
}
