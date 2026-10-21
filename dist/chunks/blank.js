import { t as e } from "./base.js";
import "./icon-button.js";
import { TpTextfield as t } from "../components/textfield/textfield.js";
import { t as n } from "./numberfield.js";
import { t as r } from "./datefield.js";
import { t as i } from "./mathfield.js";
import { t as a } from "./timefield.js";
//#region src/components/blank/blank.css?inline
var o = "tp-blank{vertical-align:baseline;border-bottom:2px dashed var(--tp-neutral-stroke-soft);min-block-size:1em;min-inline-size:5ch;padding:.6em 2.25rem 0 .5em;display:inline-block;position:relative}tp-blank[data-tp-blank-filled]{border-bottom-color:var(--tp-blank-filled-border-color,var(--tp-brand-stroke-mid))}tp-blank [data-tp-blank-tools]{color:var(--tp-text-muted);align-items:center;gap:.25em;display:inline-flex;position:absolute;inset-block-start:50%;inset-inline-end:0;transform:translateY(-50%)}tp-blank:focus-visible{outline:3px solid var(--tp-focus-color,var(--tp-brand-text-colorful));outline-offset:2px}tp-blank>:is(svg,img){vertical-align:middle;max-inline-size:100%}tp-blank[data-tp-blank-open]{border:0;max-inline-size:100%;padding:0}", s = {
	text: t,
	number: n,
	math: i,
	date: r,
	time: a
}, c = class extends e {
	editor = null;
	renderedType = null;
	renderedClosed = null;
	questionObserver = new MutationObserver(() => this.syncMode());
	forwarded = /* @__PURE__ */ new Set();
	get closed() {
		return this.hasAttribute("closed");
	}
	set closed(e) {
		this.toggleAttribute("closed", e);
	}
	get type() {
		let e = this.getAttribute("type") ?? "text";
		return Object.hasOwn(s, e) ? e : "text";
	}
	set type(e) {
		this.setAttribute("type", e);
	}
	get effectiveClosed() {
		let e = this.closest("[data-tp-question], tp-question, tp-fill-blank-question")?.getAttribute("mode");
		return e === "closed" || e !== "opened" && this.closed;
	}
	syncMode() {
		this.render();
	}
	currentValue = "";
	answers = /* @__PURE__ */ new Map();
	tools = null;
	clearButton = null;
	static get observedAttributes() {
		return [
			...new Set(Object.values(s).flatMap((e) => e.observedAttributes)),
			...e.observedAttributes,
			"closed",
			"type",
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
		return this.effectiveClosed || this.hasAttribute("readonly");
	}
	set readOnly(e) {}
	get value() {
		return this.editor?.value ?? this.currentValue;
	}
	set value(e) {
		this.currentValue = e, this.editor ? this.editor.value = e : this.render();
	}
	setAnswer(e, t) {
		this.disabled || !this.effectiveClosed || (this.answers.set(e, t.cloneNode(!0)), this.value = e, this.dispatchEvent(new Event("input", {
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
		super.connectedCallback(), this.ensureGlobalStyle("tp-blank-styles", o), this.render();
		let e = this.closest("[data-tp-question], tp-question, tp-fill-blank-question");
		e && this.questionObserver.observe(e, {
			attributes: !0,
			attributeFilter: ["mode"]
		}), this.addEventListener("keydown", this.onKeyDown);
	}
	disconnectedCallback() {
		this.removeEventListener("keydown", this.onKeyDown), this.questionObserver.disconnect();
	}
	attributeChangedCallback(e, t, n) {
		t === n || !this.isConnected || (this.render(), (e === "closed" || e === "type") && this.dispatchEvent(new Event("tp-blank-mode-change", { bubbles: !0 })));
	}
	onKeyDown = (e) => {
		!this.effectiveClosed || e.target !== this || !["Delete", "Backspace"].includes(e.key) || (e.preventDefault(), this.clear());
	};
	onClearClick = (e) => {
		e.stopPropagation(), this.clear(), this.disabled || this.focus();
	};
	render() {
		if (!this.isConnected) return;
		let e = this.effectiveClosed;
		if (this.renderedClosed !== null && this.renderedClosed !== e && (this.currentValue = ""), this.editor && !e && (this.currentValue = this.editor.value), this.renderedClosed = e, this.toggleAttribute("data-tp-blank-open", !e), !e) {
			this.tabIndex = -1, this.setAttribute("aria-disabled", String(this.disabled)), this.removeAttribute("data-tp-blank-filled"), (!this.editor || this.renderedType !== this.type) && (this.editor = document.createElement(`tp-${this.type}field`), this.renderedType = this.type, this.replaceChildren(this.editor));
			let e = s[this.type].observedAttributes;
			for (let e of this.forwarded) this.hasAttribute(e) || this.editor.removeAttribute(e);
			this.forwarded.clear();
			for (let { name: t, value: n } of this.attributes) [
				"closed",
				"type",
				"value",
				"id",
				"class",
				"style",
				"tabindex"
			].includes(t) || (e.includes(t) || t.startsWith("aria-")) && (this.editor.setAttribute(t, n), this.forwarded.add(t));
			!this.editor.hasAttribute("label") && !this.editor.hasAttribute("aria-label") && this.editor.setAttribute("aria-label", this.name || "Answer"), this.editor.setAttribute("clearable", ""), this.editor.value = this.currentValue;
			return;
		}
		this.editor = null, this.renderedType = null, this.tabIndex = this.disabled ? -1 : 0, this.setAttribute("role", "group"), this.setAttribute("aria-disabled", String(this.disabled)), this.hasAttribute("aria-label") || this.setAttribute("aria-label", this.name || "Answer"), this.toggleAttribute("data-tp-blank-filled", this.value !== ""), this.tools || (this.tools = document.createElement("span"), this.tools.setAttribute("data-tp-blank-tools", ""), this.clearButton = document.createElement("tp-icon-button"), this.clearButton.setAttribute("data-tp-blank-clear", ""), this.clearButton.setAttribute("name", "close"), this.clearButton.setAttribute("label", "Clear answer"), this.clearButton.setAttribute("size", "s"), this.clearButton.addEventListener("click", this.onClearClick), this.tools.append(this.clearButton)), this.clearButton?.toggleAttribute("disabled", this.disabled || this.value === "");
		let t = this.answers.get(this.value);
		this.value && t ? this.replaceChildren(t.cloneNode(!0), this.tools) : this.replaceChildren(document.createTextNode(this.value || this.getAttribute("placeholder") || ""), this.tools);
	}
};
customElements.get("tp-blank") || customElements.define("tp-blank", c);
function l(e) {
	return e.localName === "tp-blank" && "setAnswer" in e && typeof e.setAnswer == "function";
}
//#endregion
export { l as n, c as t };

//# sourceMappingURL=blank.js.map