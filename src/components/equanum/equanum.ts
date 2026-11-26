// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-equanum>` element associates an equation with its number and reference previews.
 *
 * @summary Associates an equation with its number and reference previews.
 * @tagname tp-equanum
 * @attr {string} ref = "" - Equation identifier within the current reference scope.
 * @attr {string} number = "" - Explicit equation number, displayed in parentheses.
 * @attr {string} target = "" - Optional ID selector of an existing numbered equation; no extra number is displayed.
 * @see tp-ref - Displays an equation preview for an equals-prefixed reference.
 * @see tp-math - Renders the mathematical expression.
 * @example
 * <div data-tp-reference-scope="">
 *   <tp-equanum ref="energy" number="2.1">
 *     <tp-math displaystyle value="E = mc^2"></tp-math>
 *   </tp-equanum>
 *   <p>See equation <tp-ref href="=energy"></tp-ref>.</p>
 * </div>
 */
export class TpEquanum extends TpBase {
	private output: HTMLSpanElement | null = null;
	static get observedAttributes(): string[] {
		return ["number", "target"];
	}
	get ref(): string {
		return this.getAttribute("ref") ?? "";
	}
	set ref(value: string) {
		this.setAttribute("ref", value);
	}
	get number(): string {
		return this.getAttribute("number") ?? "";
	}
	set number(value: string) {
		this.setAttribute("number", value);
	}
	get target(): string {
		return this.getAttribute("target") ?? "";
	}
	set target(value: string) {
		this.setAttribute("target", value);
	}
	protected connectedCallback(): void {
		super.connectedCallback();
		this.render();
	}
	protected attributeChangedCallback(): void {
		if (this.isConnected) this.render();
	}
	private render(): void {
		if (!this.output) {
			this.output = document.createElement("span");
			this.output.setAttribute("data-tp-equanum-generated", "");
		}
		const label = this.number ? `(${this.number})` : "";
		if (this.output.textContent !== label) this.output.textContent = label;
		if (this.target) {
			this.output.remove();
			return;
		}
		if (this.output.parentElement !== this) this.append(this.output);
	}
}
if (!customElements.get("tp-equanum"))
	customElements.define("tp-equanum", TpEquanum);
declare global {
	interface HTMLElementTagNameMap {
		"tp-equanum": TpEquanum;
	}
}
