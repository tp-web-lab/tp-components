import { qu as e } from "./lib/typescript/typescript.js";
import { initializeFieldName as t } from "../utilities/field-name.js";
//#region src/components/datefield/datefield.css?inline
var n = "tp-datefield{inline-size:var(--tp-datefield-inline-size,12.5em);vertical-align:middle;min-inline-size:0;max-inline-size:100%;display:inline-block}tp-datefield [data-tp-datefield-label]{box-sizing:border-box;gap:var(--tp-datefield-label-gap,.35em);inline-size:100%;max-inline-size:none;max-width:none;grid-template-columns:minmax(0,100%);grid-template-areas:\"label\"\"control\";min-inline-size:0;display:grid}tp-datefield [data-tp-datefield-label-text]{font-weight:var(--tp-datefield-label-font-weight,500);grid-area:label}tp-datefield[required] [data-tp-datefield-label-text]:after{content:\" *\";color:var(--tp-datefield-required-color,var(--tp-danger-text-colorful))}tp-datefield[required]:not([label]) [data-tp-datefield-control]:before{z-index:1;color:var(--tp-datefield-required-color,var(--tp-danger-text-colorful));content:\"*\";pointer-events:none;font-weight:600;line-height:1;position:absolute;inset-block-start:.2em;inset-inline-start:.3em}tp-datefield [data-tp-datefield-label]>[data-tp-datefield-control]{grid-area:control}tp-datefield[label-position=bottom] [data-tp-datefield-label]{grid-template-areas:\"control\"\"label\"}tp-datefield[label-position=start] [data-tp-datefield-label],tp-datefield[label-position=end] [data-tp-datefield-label]{grid-template-columns:max-content minmax(0,1fr);align-items:center}tp-datefield[label-position=start] [data-tp-datefield-label]{grid-template-areas:\"label control\"}tp-datefield[label-position=end] [data-tp-datefield-label]{grid-template-columns:minmax(0,1fr) max-content;grid-template-areas:\"control label\"}tp-datefield [data-tp-datefield-control]{box-sizing:border-box;border:1px solid var(--tp-datefield-border-color,var(--tp-neutral-stroke-soft));border-radius:var(--tp-datefield-radius,var(--tp-border-radius-sm));background:var(--tp-datefield-background,var(--tp-paper-color));grid-template-columns:minmax(0,1fr) max-content max-content;align-items:center;inline-size:100%;min-inline-size:0;display:grid;position:relative;overflow:hidden}tp-datefield [data-tp-datefield-control]:focus-within{border-color:var(--tp-datefield-focus-color,var(--tp-brand-text-colorful));outline:2px solid color-mix(in srgb, var(--tp-datefield-focus-color,var(--tp-brand-text-colorful)) 25%, transparent);outline-offset:1px}tp-datefield [data-tp-datefield-input]{-webkit-appearance:none;box-sizing:border-box;min-block-size:2.5rem;inline-size:100%;min-inline-size:0;padding:var(--tp-datefield-padding-block,.6em) var(--tp-datefield-padding-inline,.75em);color:inherit;font:inherit;font-weight:var(--tp-datefield-value-font-weight,400);background:0 0;border:0;outline:0;margin:0;display:block}tp-datefield input::-webkit-calendar-picker-indicator{display:none}tp-datefield [data-tp-datefield-clear][hidden]{display:none}tp-datefield[data-disabled] [data-tp-datefield-control]{cursor:not-allowed;opacity:.6}", r = /* @__PURE__ */ new Set([
	"top",
	"bottom",
	"start",
	"end"
]), i = class i extends e {
	static styleId = "tp-datefield-styles";
	field = null;
	clearButton = null;
	pickerButton = null;
	static get observedAttributes() {
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
		let e = this.getAttribute("label-position");
		return e !== null && r.has(e) ? e : "top";
	}
	set labelPosition(e) {
		this.setStringAttribute("label-position", e);
	}
	get value() {
		return this.field?.value ?? this.getStringAttribute("value");
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
		let e = Number(this.getAttribute("step") ?? "1");
		return Number.isFinite(e) && e > 0 ? e : 1;
	}
	set step(e) {
		this.setStringAttribute("step", String(e));
	}
	get placeholder() {
		return this.getStringAttribute("placeholder");
	}
	set placeholder(e) {
		this.setStringAttribute("placeholder", e);
	}
	get name() {
		return this.getStringAttribute("name");
	}
	set name(e) {
		this.setStringAttribute("name", e);
	}
	get autocomplete() {
		return this.getStringAttribute("autocomplete");
	}
	set autocomplete(e) {
		this.setStringAttribute("autocomplete", e);
	}
	get required() {
		return this.getBooleanAttribute("required");
	}
	set required(e) {
		this.setBooleanAttribute("required", e);
	}
	get readOnly() {
		return this.getBooleanAttribute("readonly");
	}
	set readOnly(e) {
		this.setBooleanAttribute("readonly", e);
	}
	get disabled() {
		return this.getBooleanAttribute("disabled");
	}
	set disabled(e) {
		this.setBooleanAttribute("disabled", e);
	}
	get clearable() {
		return this.getBooleanAttribute("clearable");
	}
	set clearable(e) {
		this.setBooleanAttribute("clearable", e);
	}
	connectedCallback() {
		t(this), super.connectedCallback(), this.ensureGlobalStyle(i.styleId, n), this.render();
	}
	attributeChangedCallback(e, t, n) {
		t === n || !this.isConnected || (e === "label" ? this.render() : this.sync());
	}
	focus(e) {
		this.field?.focus(e);
	}
	showPicker() {
		if (!(this.disabled || this.readOnly)) try {
			this.field?.showPicker();
		} catch {
			this.field?.focus();
		}
	}
	clear() {
		this.disabled || this.readOnly || this.value === "" || (this.setValue("", !0), this.focus(), this.dispatchEvent(new CustomEvent("tp-clear", {
			bubbles: !0,
			composed: !0
		})));
	}
	render() {
		let e = document.createElement("span");
		if (e.setAttribute("data-tp-datefield-control", ""), this.field = document.createElement("input"), this.field.type = "date", this.field.setAttribute("data-tp-datefield-input", ""), this.field.addEventListener("input", this.handleInput), this.field.addEventListener("change", this.handleChange), this.clearButton = this.createButton("close", "Clear date", "clear"), this.clearButton.addEventListener("click", this.handleClear), this.pickerButton = this.createButton("calendar-clock-outline", "Open date picker", "picker"), this.pickerButton.addEventListener("click", this.handlePicker), e.append(this.field, this.clearButton, this.pickerButton), this.label === "") this.replaceChildren(e);
		else {
			let t = document.createElement("label");
			t.setAttribute("data-tp-datefield-label", "");
			let n = document.createElement("span");
			n.setAttribute("data-tp-datefield-label-text", ""), n.textContent = this.label, t.append(n, e), this.replaceChildren(t);
		}
		this.sync();
	}
	createButton(e, t, n) {
		let r = document.createElement("tp-icon-button");
		return r.setAttribute(`data-tp-datefield-${n}`, ""), r.setAttribute("name", e), r.setAttribute("label", t), r.setAttribute("size", "s"), r;
	}
	sync() {
		if (this.field === null || this.clearButton === null || this.pickerButton === null) return;
		let e = this.getStringAttribute("value");
		this.field.value !== e && (this.field.value = e), this.field.min = this.min, this.field.max = this.max, this.field.step = String(this.step), this.field.name = this.name, this.field.placeholder = this.placeholder, this.autocomplete === "" ? this.field.removeAttribute("autocomplete") : this.field.setAttribute("autocomplete", this.autocomplete), this.field.required = this.required, this.field.readOnly = this.readOnly, this.field.disabled = this.disabled, this.clearButton.toggleAttribute("hidden", !this.clearable || this.field.value === ""), this.clearButton.toggleAttribute("disabled", this.disabled || this.readOnly), this.pickerButton.toggleAttribute("disabled", this.disabled || this.readOnly), this.toggleAttribute("data-disabled", this.disabled);
	}
	handleInput = (e) => {
		e.stopPropagation(), this.field !== null && (this.setStringAttribute("value", this.field.value), this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})));
	};
	handleChange = (e) => {
		e.stopPropagation(), this.dispatchEvent(new Event("change", {
			bubbles: !0,
			composed: !0
		}));
	};
	handleClear = () => {
		this.clear();
	};
	handlePicker = () => {
		this.showPicker();
	};
	setValue(e, t) {
		this.setStringAttribute("value", e), this.field !== null && (this.field.value = e), this.sync(), t && (this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new Event("change", {
			bubbles: !0,
			composed: !0
		})));
	}
};
customElements.get("tp-datefield") || customElements.define("tp-datefield", i);
//#endregion
export { i as t };

//# sourceMappingURL=datefield.js.map