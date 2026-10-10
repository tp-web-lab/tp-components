import { qu as e } from "./lib/typescript/typescript.js";
//#region src/components/blank/blank.css?inline
var t = "tp-blank{vertical-align:baseline;border-bottom:2px dashed var(--tp-neutral-stroke-soft);min-block-size:1em;min-inline-size:5ch;padding:.6em 2.25rem 0 .5em;display:inline-block;position:relative}tp-blank[data-tp-blank-filled]{border-bottom-color:var(--tp-blank-filled-border-color,var(--tp-brand-stroke-mid))}tp-blank [data-tp-blank-tools]{color:var(--tp-text-muted);align-items:center;gap:.25em;display:inline-flex;position:absolute;inset-block-start:50%;inset-inline-end:0;transform:translateY(-50%)}tp-blank:focus-visible{outline:3px solid var(--tp-focus-color,var(--tp-brand-text-colorful));outline-offset:2px}tp-blank>:is(svg,img){vertical-align:middle;max-inline-size:100%}", n = class extends e {
	currentValue = "";
	answers = /* @__PURE__ */ new Map();
	tools = null;
	clearButton = null;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"name",
			"placeholder",
			"disabled",
			"aria-label"
		];
	}
	get name() {
		return this.getAttribute("name") ?? "";
	}
	set name(e) {
		this.setAttribute("name", e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", e);
	}
	get readOnly() {
		return !0;
	}
	set readOnly(e) {}
	get value() {
		return this.currentValue;
	}
	set value(e) {
		this.currentValue = e, this.render();
	}
	setAnswer(e, t) {
		this.disabled || (this.answers.set(e, t.cloneNode(!0)), this.value = e, this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})));
	}
	clear() {
		this.disabled || (this.value = "", this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-blank-styles", t), this.render(), this.addEventListener("keydown", this.onKeyDown);
	}
	disconnectedCallback() {
		this.removeEventListener("keydown", this.onKeyDown);
	}
	attributeChangedCallback() {
		this.isConnected && this.render();
	}
	onKeyDown = (e) => {
		["Delete", "Backspace"].includes(e.key) && (e.preventDefault(), this.clear());
	};
	onClearClick = (e) => {
		e.stopPropagation(), this.clear(), this.disabled || this.focus();
	};
	render() {
		if (!this.isConnected) return;
		this.tabIndex = this.disabled ? -1 : 0, this.setAttribute("role", "group"), this.setAttribute("aria-disabled", String(this.disabled)), this.hasAttribute("aria-label") || this.setAttribute("aria-label", this.name || "Answer"), this.toggleAttribute("data-tp-blank-filled", this.value !== ""), this.tools || (this.tools = document.createElement("span"), this.tools.setAttribute("data-tp-blank-tools", ""), this.clearButton = document.createElement("tp-icon-button"), this.clearButton.setAttribute("data-tp-blank-clear", ""), this.clearButton.setAttribute("name", "close"), this.clearButton.setAttribute("label", "Clear answer"), this.clearButton.setAttribute("size", "s"), this.clearButton.addEventListener("click", this.onClearClick), this.tools.append(this.clearButton)), this.clearButton?.toggleAttribute("disabled", this.disabled || this.value === "");
		let e = this.answers.get(this.value);
		this.value && e ? this.replaceChildren(e.cloneNode(!0), this.tools) : this.replaceChildren(document.createTextNode(this.value || this.getAttribute("placeholder") || ""), this.tools);
	}
};
customElements.get("tp-blank") || customElements.define("tp-blank", n);
function r(e) {
	return e.localName === "tp-blank" && "setAnswer" in e && typeof e.setAnswer == "function";
}
//#endregion
export { r as n, n as t };

//# sourceMappingURL=blank.js.map