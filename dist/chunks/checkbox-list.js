import { qu as e } from "./lib/typescript/typescript.js";
import { n as t, r as n, t as r } from "./choice-label.js";
//#region src/components/checkbox-list/checkbox-list.css?inline
var i = "tp-checkbox-list{--tp-checkbox-list-marker-gap:.5em;--tp-checkbox-list-marker-width:2ch;margin-bottom:1em;display:block}tp-checkbox-list>ul,tp-checkbox-list>ol{margin:.5em 0;padding-inline-start:.5em}tp-checkbox-list>ul{list-style:none}tp-checkbox-list>ol{counter-reset:tp-checkbox-list-counter}tp-checkbox-list[orientation=vertical]>ul>li,tp-checkbox-list[orientation=vertical]>ol>li{align-items:start;column-gap:var(--tp-checkbox-list-marker-gap);grid-template-columns:var(--tp-checkbox-list-marker-width) minmax(0, 1fr);margin:0;padding:0;list-style:none;display:grid}tp-checkbox-list[orientation=vertical]>ul>li+li,tp-checkbox-list[orientation=vertical]>ol>li+li{margin-block-start:.25em}tp-checkbox-list[orientation=vertical]>ul>li:before{content:\"\";text-align:end}tp-checkbox-list[orientation=vertical]>ol>li{counter-increment:tp-checkbox-list-counter}tp-checkbox-list[orientation=vertical]>ol>li:before{content:counter(tp-checkbox-list-counter) \".\";text-align:end}tp-checkbox-list[orientation=vertical]>ol[data-tp-checkbox-list-counter-style=lower-alpha]>li:before{content:counter(tp-checkbox-list-counter, lower-alpha) \".\"}tp-checkbox-list[orientation=vertical]>ol[data-tp-checkbox-list-counter-style=upper-alpha]>li:before{content:counter(tp-checkbox-list-counter, upper-alpha) \".\"}tp-checkbox-list[orientation=vertical]>ol[data-tp-checkbox-list-counter-style=lower-roman]>li:before{content:counter(tp-checkbox-list-counter, lower-roman) \".\"}tp-checkbox-list[orientation=vertical]>ol[data-tp-checkbox-list-counter-style=upper-roman]>li:before{content:counter(tp-checkbox-list-counter, upper-roman) \".\"}tp-checkbox-list[orientation=vertical]>ul>li>label[data-tp-checkbox-list-label],tp-checkbox-list[orientation=vertical]>ol>li>label[data-tp-checkbox-list-label]{grid-column:2;grid-template-columns:auto minmax(0,1fr);align-items:start;column-gap:.5em;display:grid}tp-checkbox-list[orientation=horizontal]>ul,tp-checkbox-list[orientation=horizontal]>ol{flex-wrap:wrap;align-items:center;gap:1em;display:flex}tp-checkbox-list[orientation=horizontal]>ul>li,tp-checkbox-list[orientation=horizontal]>ol>li{align-items:center;column-gap:var(--tp-checkbox-list-marker-gap);grid-template-columns:var(--tp-checkbox-list-marker-width) minmax(0, 1fr);margin:0;padding:0;list-style:none;display:grid}tp-checkbox-list[orientation=horizontal]>ul>li:before{content:\"\";text-align:end}tp-checkbox-list[orientation=horizontal]>ol>li{counter-increment:tp-checkbox-list-counter}tp-checkbox-list[orientation=horizontal]>ol>li:before{content:counter(tp-checkbox-list-counter) \".\";text-align:end}tp-checkbox-list[orientation=horizontal]>ol[data-tp-checkbox-list-counter-style=lower-alpha]>li:before{content:counter(tp-checkbox-list-counter, lower-alpha) \".\"}tp-checkbox-list[orientation=horizontal]>ol[data-tp-checkbox-list-counter-style=upper-alpha]>li:before{content:counter(tp-checkbox-list-counter, upper-alpha) \".\"}tp-checkbox-list[orientation=horizontal]>ol[data-tp-checkbox-list-counter-style=lower-roman]>li:before{content:counter(tp-checkbox-list-counter, lower-roman) \".\"}tp-checkbox-list[orientation=horizontal]>ol[data-tp-checkbox-list-counter-style=upper-roman]>li:before{content:counter(tp-checkbox-list-counter, upper-roman) \".\"}tp-checkbox-list[orientation=horizontal]>ul>li>label[data-tp-checkbox-list-label],tp-checkbox-list[orientation=horizontal]>ol>li>label[data-tp-checkbox-list-label]{grid-column:2}tp-checkbox-list label[data-tp-checkbox-list-label]{vertical-align:middle;line-height:1.4}tp-checkbox-list[orientation=vertical]>ul>li>label[data-tp-checkbox-list-label]>:not(input[type=checkbox][data-tp-checkbox-list-input]),tp-checkbox-list[orientation=vertical]>ol>li>label[data-tp-checkbox-list-label]>:not(input[type=checkbox][data-tp-checkbox-list-input]){grid-column:2;margin-inline-start:0}tp-checkbox-list label[data-tp-checkbox-list-label] :where(ul,ol){margin-inline-start:0;padding-inline-start:1.25em}tp-checkbox-list label[data-tp-checkbox-list-label] :where(address,article,aside,blockquote,details,div,dl,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hr,main,nav,ol,p,pre,section,table,ul){margin-block-end:.5em}tp-checkbox-list input[type=checkbox][data-tp-checkbox-list-input]{-webkit-appearance:checkbox;appearance:auto;background:revert;border:revert;border-radius:revert;block-size:1em;inline-size:1em;accent-color:var(--tp-brand-seed);vertical-align:middle;margin:0;margin-inline-end:.5em}tp-checkbox-list[orientation=vertical]>ul>li>label[data-tp-checkbox-list-label]>input[type=checkbox][data-tp-checkbox-list-input],tp-checkbox-list[orientation=vertical]>ol>li>label[data-tp-checkbox-list-label]>input[type=checkbox][data-tp-checkbox-list-input]{margin-inline-end:0;margin-top:.2em}";
//#endregion
//#region src/components/checkbox-list/checkbox-list.ts
function a(e) {
	return e === "horizontal" || e === "vertical";
}
function o(e) {
	return e === "decimal" || e === "lower-alpha" || e === "upper-alpha" || e === "lower-roman" || e === "upper-roman" ? e : null;
}
var s = class s extends e {
	static styleId = "tp-checkbox-list-styles";
	static nextGroupId = 0;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"name",
			"orientation",
			"value",
			"label",
			"label-position"
		];
	}
	generatedGroupName = null;
	isSyncingValue = !1;
	initialValue = null;
	choiceLabel = new r(this);
	get label() {
		return this.getStringAttribute("label");
	}
	set label(e) {
		this.setStringAttribute("label", e);
	}
	get labelPosition() {
		return t(this);
	}
	set labelPosition(e) {
		this.setStringAttribute("label-position", e);
	}
	get name() {
		let e = this.getAttribute("name")?.trim() ?? "";
		return e === "" ? (this.generatedGroupName === null && (s.nextGroupId += 1, this.generatedGroupName = `tp-checkbox-list-${String(s.nextGroupId)}`), this.generatedGroupName) : e;
	}
	set name(e) {
		let t = e.trim();
		this.setStringAttribute("name", t), t !== "" && (this.generatedGroupName = null);
	}
	get orientation() {
		let e = this.getAttribute("orientation");
		return e !== null && a(e) ? e : "vertical";
	}
	set orientation(e) {
		this.setStringAttribute("orientation", e);
	}
	get value() {
		return this.getAttribute("value") ?? "";
	}
	set value(e) {
		let t = this.value, n = this.normalizeValueString(e);
		this.setValueAttribute(n), this.syncSelectionFromValue(), this.emitValueChangeIfNeeded(t);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-choice-label-styles", n), this.ensureGlobalStyle(s.styleId, i), this.normalizeOrientationAttribute(), this.addEventListener("change", this.handleInputChange), queueMicrotask(() => {
			this.isConnected && (this.transformList(), this.choiceLabel.sync(), this.initializeValueAttribute(), this.syncSelectionFromValue(), this.initialValue === null && (this.initialValue = this.value));
		});
	}
	attributeChangedCallback(e, t, n) {
		if (!(!this.isConnected || t === n)) {
			if (e === "label" || e === "label-position") {
				this.choiceLabel.sync();
				return;
			}
			if (e === "orientation" && this.normalizeOrientationAttribute(), !(this.initialValue === null || this.getListElement() === null)) {
				if (e === "value") {
					let e = t ?? "", n = this.normalizeValueString(this.value);
					n !== this.value && this.setValueAttribute(n), this.isSyncingValue || (this.syncSelectionFromValue(), this.emitValueChangeIfNeeded(e));
					return;
				}
				this.transformList(), this.syncSelectionFromValue();
			}
		}
	}
	disconnectedCallback() {
		this.removeEventListener("change", this.handleInputChange);
	}
	reset() {
		let e = this.value, t = this.initialValue ?? "";
		this.setValueAttribute(t), this.syncSelectionFromValue(), this.emitValueChangeIfNeeded(e);
	}
	normalizeOrientationAttribute() {
		this.setAttribute("orientation", this.orientation);
	}
	getListElement() {
		return this.queryElement(":scope > ul, :scope > ol");
	}
	transformList() {
		let e = this.getListElement();
		if (!(e instanceof HTMLUListElement || e instanceof HTMLOListElement)) return;
		this.syncListAttributes(e);
		let t = this.name, n = Array.from(e.children).filter((e) => e instanceof HTMLLIElement);
		for (let e of n) {
			let n = e.querySelector(":scope > label[data-tp-checkbox-list-label] > input[type=\"checkbox\"][data-tp-checkbox-list-input]");
			if (n instanceof HTMLInputElement) {
				n.name = t, e.hasAttribute("disabled") && (n.disabled = !0);
				continue;
			}
			let r = document.createDocumentFragment();
			for (; e.firstChild !== null;) r.append(e.firstChild);
			let i = document.createElement("label");
			i.setAttribute("data-tp-checkbox-list-label", "");
			let a = document.createElement("input");
			a.setAttribute("data-tp-checkbox-list-input", ""), a.type = "checkbox", a.name = t, e.hasAttribute("checked") && (a.checked = !0), e.hasAttribute("disabled") && (a.disabled = !0), i.append(a, r), e.append(i);
		}
	}
	handleInputChange = (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.type !== "checkbox" || !t.hasAttribute("data-tp-checkbox-list-input")) return;
		let n = this.getListElement();
		if (!(n instanceof HTMLUListElement || n instanceof HTMLOListElement)) return;
		let r = this.value, i = this.getCheckboxInputs(n).flatMap((e, t) => e.checked ? [String(t + 1)] : []);
		this.setValueAttribute(i.join(",")), this.syncSelectionFromValue(), this.emitValueChangeIfNeeded(r);
	};
	getCheckboxInputs(e) {
		let t = Array.from(e.children).filter((e) => e instanceof HTMLLIElement), n = [];
		for (let e of t) {
			let t = e.querySelector(":scope > label[data-tp-checkbox-list-label] > input[type=\"checkbox\"][data-tp-checkbox-list-input]");
			t instanceof HTMLInputElement && n.push(t);
		}
		return n;
	}
	syncSelectionFromValue() {
		let e = this.getListElement();
		if (!(e instanceof HTMLUListElement || e instanceof HTMLOListElement)) return;
		let t = this.getCheckboxInputs(e), n = this.parseValueIndexes(this.value, t.length);
		for (let [e, r] of t.entries()) r.checked = n.has(e + 1);
		this.syncCheckedItemAttributes(e, t);
		let r = this.joinCheckedIndexes(t);
		r !== this.value && this.setValueAttribute(r);
	}
	initializeValueAttribute() {
		if (this.hasAttribute("value")) return;
		let e = this.getListElement();
		if (!(e instanceof HTMLUListElement || e instanceof HTMLOListElement)) return;
		let t = this.getCheckboxInputs(e);
		this.setValueAttribute(this.joinCheckedIndexes(t));
	}
	syncCheckedItemAttributes(e, t) {
		let n = Array.from(e.children).filter((e) => e instanceof HTMLLIElement);
		for (let [e, r] of n.entries()) t[e]?.checked ? r.setAttribute("checked", "") : r.removeAttribute("checked");
	}
	normalizeValueString(e) {
		let t = this.getListElement();
		if (!(t instanceof HTMLUListElement || t instanceof HTMLOListElement)) return e.trim();
		let n = this.getCheckboxInputs(t).length;
		return [...this.parseValueIndexes(e, n)].sort((e, t) => e - t).map(String).join(",");
	}
	parseValueIndexes(e, t) {
		let n = e.split(",").map((e) => e.trim()).filter((e) => e !== ""), r = /* @__PURE__ */ new Set();
		for (let e of n) {
			let n = Number.parseInt(e, 10);
			Number.isInteger(n) && String(n) === e && n >= 1 && n <= t && r.add(n);
		}
		return r;
	}
	joinCheckedIndexes(e) {
		return e.flatMap((e, t) => e.checked ? [String(t + 1)] : []).join(",");
	}
	setValueAttribute(e) {
		this.value !== e && (this.isSyncingValue = !0, this.setAttribute("value", e), this.isSyncingValue = !1);
	}
	emitValueChangeIfNeeded(e) {
		e !== this.value && this.dispatchEvent(new CustomEvent("tp-checkbox-list-change", {
			detail: {
				value: this.value,
				label: this.resolveSelectedLabels()
			},
			bubbles: !0,
			composed: !0
		}));
	}
	resolveSelectedLabels() {
		let e = this.getListElement();
		return e instanceof HTMLUListElement || e instanceof HTMLOListElement ? this.getCheckboxInputs(e).flatMap((e) => {
			if (!e.checked) return [];
			let t = e.closest("label[data-tp-checkbox-list-label]");
			return t instanceof HTMLLabelElement ? [t.textContent?.replace(/\s+/g, " ").trim() ?? ""] : [];
		}).join(", ") : "";
	}
	syncListAttributes(e) {
		if (e instanceof HTMLOListElement) {
			let t = this.resolveCounterStyle(e);
			e.setAttribute("data-tp-checkbox-list-counter-style", t);
			return;
		}
		e.removeAttribute("data-tp-checkbox-list-counter-style");
	}
	resolveCounterStyle(e) {
		let t = o(e.style.listStyleType.trim().toLowerCase());
		if (t !== null) return t;
		let n = e.getAttribute("type");
		return n === "a" ? "lower-alpha" : n === "A" ? "upper-alpha" : n === "i" ? "lower-roman" : n === "I" ? "upper-roman" : n === "1" ? "decimal" : o(window.getComputedStyle(e).listStyleType.trim().toLowerCase()) ?? "decimal";
	}
};
customElements.get("tp-checkbox-list") || customElements.define("tp-checkbox-list", s);
//#endregion
export { s as t };

//# sourceMappingURL=checkbox-list.js.map