import { Ku as e } from "./lib/typescript/typescript.js";
import { initializeFieldName as t } from "../utilities/field-name.js";
import { t as n } from "./textfield.js";
import { n as r } from "./choice-label.js";
//#region src/components/numberfield/numberfield.css?inline
var i = "tp-numberfield:not([icon]) [data-tp-numberfield-control]{grid-template-columns:minmax(0,1fr) max-content max-content;gap:.25em}tp-numberfield [data-tp-numberfield-input]{appearance:auto;grid-area:1/1;padding-inline-end:.5em}tp-numberfield [data-tp-numberfield-clear],tp-numberfield [data-tp-numberfield-type]{grid-row:1;position:static;transform:none}tp-numberfield [data-tp-numberfield-clear]{grid-column:2}tp-numberfield [data-tp-numberfield-type]{margin:0}tp-numberfield [data-tp-numberfield-suffix]{white-space:nowrap;grid-area:1/3;align-items:center;margin-inline-end:.4em;display:inline-flex}tp-numberfield[range] [data-tp-numberfield-input]{appearance:auto;accent-color:var(--tp-brand-text-colorful);inline-size:calc(100% - 1em);margin:.5em;padding:0}tp-numberfield[range] [data-tp-numberfield-control]{border:0}tp-numberfield[range] input[list]::-webkit-slider-runnable-track{all:revert}tp-numberfield[range] input[list]::-webkit-slider-thumb{all:revert}tp-numberfield[range] input[list]::-moz-range-track{all:revert}tp-numberfield[range] input[list]::-moz-range-thumb{all:revert}tp-numberfield[range] input[list]::-moz-range-progress{all:revert}tp-numberfield [data-tp-numberfield-value]{font-variant-numeric:tabular-nums}tp-numberfield [data-tp-numberfield-value][hidden]{display:none}tp-numberfield[range][required] [data-tp-numberfield-label-text]:after,tp-numberfield[range][required]:not([label]) [data-tp-numberfield-control]:before{content:none}", a = class extends e {
	field = document.createElement("input");
	clearButton = document.createElement("tp-icon-button");
	readout = document.createElement("span");
	submission = document.createElement("input");
	syncing = !1;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
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
			"clearable"
		];
	}
	get label() {
		return this.getStringAttribute("label");
	}
	set label(e) {
		this.setStringAttribute("label", e);
	}
	get labelPosition() {
		return r(this);
	}
	set labelPosition(e) {
		this.setStringAttribute("label-position", e);
	}
	get value() {
		return this.getStringAttribute("value");
	}
	set value(e) {
		this.setStringAttribute("value", e);
	}
	get min() {
		return this.getStringAttribute("min");
	}
	set min(e) {
		this.setStringAttribute("min", e);
	}
	get max() {
		return this.getStringAttribute("max");
	}
	set max(e) {
		this.setStringAttribute("max", e);
	}
	get step() {
		let e = this.getStringAttribute("step");
		return e === "any" || Number.isFinite(Number(e)) && Number(e) > 0 ? e : "1";
	}
	set step(e) {
		this.setStringAttribute("step", e);
	}
	get name() {
		return this.getStringAttribute("name");
	}
	set name(e) {
		this.setStringAttribute("name", e);
	}
	get list() {
		return this.getStringAttribute("list");
	}
	set list(e) {
		this.setStringAttribute("list", e);
	}
	get placeholder() {
		return this.getStringAttribute("placeholder");
	}
	set placeholder(e) {
		this.setStringAttribute("placeholder", e);
	}
	get range() {
		return this.hasAttribute("range");
	}
	set range(e) {
		this.toggleAttribute("range", e);
	}
	get required() {
		return this.hasAttribute("required");
	}
	set required(e) {
		this.toggleAttribute("required", e);
	}
	get readOnly() {
		return this.hasAttribute("readonly");
	}
	set readOnly(e) {
		this.toggleAttribute("readonly", e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", e);
	}
	get clearable() {
		return this.hasAttribute("clearable");
	}
	set clearable(e) {
		this.toggleAttribute("clearable", e);
	}
	connectedCallback() {
		t(this), super.connectedCallback(), this.ensureGlobalStyle("tp-numberfield-styles", n.replaceAll("tp-textfield", "tp-numberfield") + i), this.field.addEventListener("input", this.handleInput), this.field.addEventListener("change", this.handleChange), this.clearButton.addEventListener("click", this.handleClear), this.render();
	}
	disconnectedCallback() {
		this.field.removeEventListener("input", this.handleInput), this.field.removeEventListener("change", this.handleChange), this.clearButton.removeEventListener("click", this.handleClear);
	}
	attributeChangedCallback(e, t, n) {
		!this.isConnected || t === n || (e === "label" ? this.render() : this.sync());
	}
	focus(e) {
		this.field.focus(e);
	}
	clear() {
		this.disabled || this.readOnly || !this.range && this.value === "" || (this.value = "", this.sync(), this.focus(), this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new Event("change", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new CustomEvent("tp-clear", {
			bubbles: !0,
			composed: !0
		})));
	}
	render() {
		let e = document.createElement("span");
		e.setAttribute("data-tp-numberfield-control", ""), this.field.setAttribute("data-tp-numberfield-input", ""), this.clearButton.setAttribute("data-tp-numberfield-clear", ""), this.clearButton.setAttribute("name", "close"), this.clearButton.setAttribute("size", "s");
		let t = document.createElement("tp-icon");
		t.setAttribute("data-tp-numberfield-type", ""), t.setAttribute("name", "numberfield-mark"), t.setAttribute("library", "components"), t.setAttribute("size", "1.25em"), t.setAttribute("aria-hidden", "true"), this.readout.setAttribute("data-tp-numberfield-value", ""), this.readout.setAttribute("aria-hidden", "true");
		let n = document.createElement("span");
		if (n.setAttribute("data-tp-numberfield-suffix", ""), n.append(t, this.readout), this.submission.type = "hidden", this.submission.setAttribute("data-tp-numberfield-submission", ""), e.append(this.field, this.clearButton, n, this.submission), this.label) {
			let t = document.createElement("label");
			t.setAttribute("data-tp-numberfield-label", "");
			let n = document.createElement("span");
			n.setAttribute("data-tp-numberfield-label-text", ""), n.textContent = this.label, t.append(n, e), this.replaceChildren(t);
		} else this.replaceChildren(e);
		this.sync();
	}
	sync() {
		if (!this.syncing) {
			this.syncing = !0;
			try {
				let e = this.value;
				this.field.type = this.range ? "range" : "number", this.field.min = this.min, this.field.max = this.max, this.field.step = this.step, this.field.name = this.name, this.list ? this.field.setAttribute("list", this.list) : this.field.removeAttribute("list"), this.field.placeholder = this.placeholder, this.field.required = this.required && !this.range, this.field.readOnly = this.readOnly, this.field.disabled = this.disabled || this.range && this.readOnly;
				let t = this.getAttribute("aria-label");
				t === null ? this.field.removeAttribute("aria-label") : this.field.setAttribute("aria-label", t), this.field.value !== e && (this.field.value = e), this.value !== this.field.value && (this.value = this.field.value), this.readout.textContent = this.field.value, this.readout.hidden = !this.range, this.clearButton.hidden = !this.clearable, this.clearButton.disabled = this.disabled || this.readOnly || !this.range && this.value === "", this.clearButton.label = this.range ? "Reset value" : "Clear number", this.submission.disabled = !(this.range && this.readOnly && !this.disabled), this.submission.name = this.name, this.submission.value = this.value, this.toggleAttribute("data-disabled", this.disabled);
			} finally {
				this.syncing = !1;
			}
		}
	}
	handleInput = (e) => {
		if (e.stopPropagation(), this.disabled || this.readOnly) {
			this.sync();
			return;
		}
		this.value = this.field.value, this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		}));
	};
	handleChange = (e) => {
		if (e.stopPropagation(), this.disabled || this.readOnly) {
			this.sync();
			return;
		}
		this.value = this.field.value, this.dispatchEvent(new Event("change", {
			bubbles: !0,
			composed: !0
		}));
	};
	handleClear = () => {
		this.clear();
	};
};
customElements.get("tp-numberfield") || customElements.define("tp-numberfield", a);
//#endregion
export { a as t };

