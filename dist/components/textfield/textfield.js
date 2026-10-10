import { qu as e } from "../../chunks/lib/typescript/typescript.js";
import { initializeFieldName as t } from "../../utilities/field-name.js";
import { t as n } from "../../chunks/textfield.js";
//#region src/components/textfield/textfield.ts
var r = /* @__PURE__ */ new Set([
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
]), i = /* @__PURE__ */ new Set([
	"top",
	"bottom",
	"start",
	"end"
]), a = class a extends e {
	static textfieldStyleId = "tp-textfield-styles";
	field = null;
	prefixIcon = null;
	clearButton = null;
	static get observedAttributes() {
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
			"aria-label"
		];
	}
	get type() {
		let e = this.getAttribute("type");
		return e !== null && r.has(e) ? e : "text";
	}
	set type(e) {
		this.setStringAttribute("type", e);
	}
	get multiline() {
		return this.getBooleanAttribute("multiline");
	}
	set multiline(e) {
		this.setBooleanAttribute("multiline", e);
	}
	get label() {
		return this.getStringAttribute("label");
	}
	set label(e) {
		this.setStringAttribute("label", e);
	}
	get labelPosition() {
		let e = this.getAttribute("label-position");
		return e !== null && i.has(e) ? e : "top";
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
	get name() {
		return this.getStringAttribute("name");
	}
	set name(e) {
		this.setStringAttribute("name", e);
	}
	get placeholder() {
		return this.getStringAttribute("placeholder");
	}
	set placeholder(e) {
		this.setStringAttribute("placeholder", e);
	}
	get autocomplete() {
		return this.getStringAttribute("autocomplete");
	}
	set autocomplete(e) {
		this.setStringAttribute("autocomplete", e);
	}
	get rows() {
		let e = Number(this.getAttribute("rows") ?? "3");
		return Number.isInteger(e) && e > 0 ? e : 3;
	}
	set rows(e) {
		this.setStringAttribute("rows", String(e));
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
	get icon() {
		return this.getStringAttribute("icon");
	}
	set icon(e) {
		this.setStringAttribute("icon", e);
	}
	get iconLibrary() {
		return this.getAttribute("icon-library") ?? "tp";
	}
	set iconLibrary(e) {
		this.setStringAttribute("icon-library", e);
	}
	connectedCallback() {
		t(this), super.connectedCallback(), this.ensureGlobalStyle(a.textfieldStyleId, n), this.render();
	}
	attributeChangedCallback(e, t, n) {
		t === n || !this.isConnected || (e === "multiline" || e === "label" ? this.render() : this.sync());
	}
	focus(e) {
		this.field?.focus(e);
	}
	select() {
		this.field?.select();
	}
	clear() {
		this.disabled || this.readOnly || this.value === "" || (this.setValue("", !0), this.focus(), this.dispatchEvent(new CustomEvent("tp-clear", {
			bubbles: !0,
			composed: !0
		})));
	}
	render() {
		let e = this.value, t = document.createElement("span");
		t.setAttribute("data-tp-textfield-control", ""), this.prefixIcon = document.createElement("tp-icon"), this.prefixIcon.setAttribute("data-tp-textfield-prefix", ""), this.prefixIcon.setAttribute("size", "1.25em"), this.prefixIcon.setAttribute("aria-hidden", "true"), this.field = this.multiline ? document.createElement("textarea") : document.createElement("input"), this.field.setAttribute("data-tp-textfield-input", ""), this.field.addEventListener("input", this.handleInput), this.field.addEventListener("change", this.handleChange), this.clearButton = document.createElement("tp-icon-button"), this.clearButton.setAttribute("data-tp-textfield-clear", ""), this.clearButton.setAttribute("name", "close"), this.clearButton.setAttribute("label", "Clear"), this.clearButton.setAttribute("size", "s"), this.clearButton.addEventListener("click", this.handleClear);
		let n = document.createElement("tp-icon");
		if (n.setAttribute("data-tp-textfield-type", ""), n.setAttribute("name", this.closest("tp-mathfield") ? "mathfield-mark" : "textfield-mark"), n.setAttribute("library", "components"), n.setAttribute("size", "1.25em"), n.setAttribute("aria-hidden", "true"), t.append(this.prefixIcon, this.field, this.clearButton, n), this.label === "") this.replaceChildren(t);
		else {
			let e = document.createElement("label");
			e.setAttribute("data-tp-textfield-label", "");
			let n = document.createElement("span");
			n.setAttribute("data-tp-textfield-label-text", ""), n.textContent = this.label, e.append(n, t), this.replaceChildren(e);
		}
		this.field.value = e, this.sync(), requestAnimationFrame(() => this.resizeTextarea());
	}
	sync() {
		if (this.field === null || this.prefixIcon === null || this.clearButton === null) return;
		this.field.value !== this.getStringAttribute("value") && (this.field.value = this.getStringAttribute("value")), this.field instanceof HTMLInputElement && (this.field.type = this.type), this.field instanceof HTMLTextAreaElement && (this.field.rows = this.rows), this.field.name = this.name, this.field.placeholder = this.placeholder;
		let e = this.getAttribute("aria-label");
		e === null ? this.field.removeAttribute("aria-label") : this.field.setAttribute("aria-label", e), this.autocomplete === "" ? this.field.removeAttribute("autocomplete") : this.field.setAttribute("autocomplete", this.autocomplete), this.field.required = this.required, this.field.readOnly = this.readOnly, this.field.disabled = this.disabled, this.prefixIcon.setAttribute("name", this.icon), this.prefixIcon.setAttribute("library", this.iconLibrary), this.prefixIcon.toggleAttribute("hidden", this.icon === ""), this.clearButton.toggleAttribute("hidden", !this.clearable), this.clearButton.toggleAttribute("disabled", this.disabled || this.readOnly || this.field.value === ""), this.toggleAttribute("data-disabled", this.disabled), this.resizeTextarea();
	}
	handleInput = (e) => {
		e.stopPropagation(), this.field !== null && (this.setStringAttribute("value", this.field.value), this.resizeTextarea(), this.dispatchEvent(new Event("input", {
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
	setValue(e, t) {
		this.setStringAttribute("value", e), this.field !== null && (this.field.value = e), this.sync(), t && (this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new Event("change", {
			bubbles: !0,
			composed: !0
		})));
	}
	resizeTextarea() {
		if (!(this.field instanceof HTMLTextAreaElement)) return;
		this.field.style.height = "auto";
		let e = this.field.scrollHeight;
		e > 0 ? this.field.style.height = `${String(e)}px` : this.field.style.removeProperty("height");
	}
};
customElements.get("tp-textfield") || customElements.define("tp-textfield", a);
//#endregion
export { a as TpTextfield };

//# sourceMappingURL=textfield.js.map