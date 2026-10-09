import { Ku as e } from "./lib/typescript/typescript.js";
import { n as t } from "./blank.js";
import { getBlankFields as n } from "../components/fill-blank/fields.js";
//#region src/components/fill-blank/fill-blank.css?inline
var r = "tp-fill-blank{margin-bottom:1rem;display:block}tp-fill-blank input,tp-fill-blank select{width:auto;min-height:1.8em;margin-inline:.25rem;padding-block:.1em;display:inline-block}", i = class i extends e {
	static styleId = "tp-fill-blank-styles";
	static nextBlankId = 0;
	initialValues = /* @__PURE__ */ new Map();
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(i.styleId, r), this.initializeBlanks(), this.captureInitialValues(), this.addEventListener("input", this.handleBlankChange), this.addEventListener("change", this.handleBlankChange);
	}
	disconnectedCallback() {
		this.removeEventListener("input", this.handleBlankChange), this.removeEventListener("change", this.handleBlankChange);
	}
	handleBlankChange = (e) => {
		let n = e.target;
		if (!(n instanceof HTMLInputElement || n instanceof HTMLSelectElement || n instanceof Element && t(n))) return;
		let r = this.value;
		this.dispatchEvent(new CustomEvent("tp-fill-blank-change", {
			detail: {
				value: this.toSerializableValue(r),
				formData: r
			},
			bubbles: !0,
			composed: !0
		}));
	};
	get value() {
		let e = new FormData();
		for (let t of this.getBlanks()) {
			let n = t.name.trim();
			n !== "" && e.append(n, this.readBlankValue(t));
		}
		return e;
	}
	set value(e) {
		let t = /* @__PURE__ */ new Map();
		for (let [n, r] of e.entries()) typeof r == "string" && !t.has(n) && t.set(n, r);
		for (let e of this.getBlanks()) {
			let n = t.get(e.name) ?? "";
			this.writeBlankValue(e, n);
		}
	}
	reset() {
		for (let e of this.getBlanks()) {
			let t = this.initialValues.get(e.name) ?? "";
			this.writeBlankValue(e, t);
		}
	}
	initializeBlanks() {
		for (let e of this.getBlanks()) {
			if (e.name.trim() === "" && (i.nextBlankId += 1, e.name = `blank-${String(i.nextBlankId)}`), e instanceof HTMLInputElement || t(e)) {
				e.value = "";
				continue;
			}
			this.normalizeSelect(e), e.value = "";
		}
	}
	captureInitialValues() {
		this.initialValues = /* @__PURE__ */ new Map();
		for (let e of this.getBlanks()) this.initialValues.set(e.name, this.readBlankValue(e));
	}
	getBlanks() {
		return n(this);
	}
	readBlankValue(e) {
		return e.value;
	}
	normalizeSelect(e) {
		let t = e.options.item(0);
		if (t?.value !== "") {
			let n = document.createElement("option");
			n.value = "", n.textContent = "choose an option", e.insertBefore(n, t);
		}
		for (let t of Array.from(e.options)) t.value !== "" && (t.hasAttribute("value") || (t.value = t.textContent?.trim() ?? ""));
	}
	toSerializableValue(e) {
		let t = {};
		for (let [n, r] of e.entries()) typeof r == "string" && (t[n] = r);
		return t;
	}
	writeBlankValue(e, n) {
		if (e instanceof HTMLInputElement || t(e)) {
			e.value = n;
			return;
		}
		if (e.value = n, e.value !== n) {
			if (n === "") {
				Array.from(e.options).find((e) => e.value === "") instanceof HTMLOptionElement ? e.value = "" : e.selectedIndex = -1;
				return;
			}
			e.selectedIndex = -1;
		}
	}
};
customElements.get("tp-fill-blank") || customElements.define("tp-fill-blank", i);
//#endregion
export { i as t };

