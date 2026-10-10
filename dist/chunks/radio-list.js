import { Ku as e } from "./lib/typescript/typescript.js";
import { n as t, r as n, t as r } from "./choice-label.js";
//#region src/components/radio-list/radio-list.css?inline
var i = "tp-radio-list{--tp-radio-list-marker-gap:.5em;--tp-radio-list-marker-width:2ch;margin-bottom:1em;display:block}tp-radio-list>ul,tp-radio-list>ol{margin:.5em 0;padding-inline-start:.5em}tp-radio-list>ul{list-style:none}tp-radio-list>ol{counter-reset:tp-radio-list-counter}tp-radio-list[orientation=vertical]>ul>li,tp-radio-list[orientation=vertical]>ol>li{align-items:start;column-gap:var(--tp-radio-list-marker-gap);grid-template-columns:var(--tp-radio-list-marker-width) minmax(0, 1fr);margin:0;padding:0;list-style:none;display:grid}tp-radio-list[orientation=vertical]>ul>li+li,tp-radio-list[orientation=vertical]>ol>li+li{margin-block-start:.25em}tp-radio-list[orientation=vertical]>ul>li:before{content:\"\";text-align:end}tp-radio-list[orientation=vertical]>ol>li{counter-increment:tp-radio-list-counter}tp-radio-list[orientation=vertical]>ol>li:before{content:counter(tp-radio-list-counter) \".\";text-align:end}tp-radio-list[orientation=vertical]>ol[data-tp-radio-list-counter-style=lower-alpha]>li:before{content:counter(tp-radio-list-counter, lower-alpha) \".\"}tp-radio-list[orientation=vertical]>ol[data-tp-radio-list-counter-style=upper-alpha]>li:before{content:counter(tp-radio-list-counter, upper-alpha) \".\"}tp-radio-list[orientation=vertical]>ol[data-tp-radio-list-counter-style=lower-roman]>li:before{content:counter(tp-radio-list-counter, lower-roman) \".\"}tp-radio-list[orientation=vertical]>ol[data-tp-radio-list-counter-style=upper-roman]>li:before{content:counter(tp-radio-list-counter, upper-roman) \".\"}tp-radio-list[orientation=vertical]>ul>li>label[data-tp-radio-list-label],tp-radio-list[orientation=vertical]>ol>li>label[data-tp-radio-list-label]{grid-column:2;grid-template-columns:auto minmax(0,1fr);align-items:start;column-gap:.5em;display:grid}tp-radio-list[orientation=horizontal]>ul,tp-radio-list[orientation=horizontal]>ol{flex-wrap:wrap;align-items:center;gap:1em;display:flex}tp-radio-list[orientation=horizontal]>ul>li,tp-radio-list[orientation=horizontal]>ol>li{align-items:center;column-gap:var(--tp-radio-list-marker-gap);grid-template-columns:var(--tp-radio-list-marker-width) minmax(0, 1fr);margin:0;padding:0;list-style:none;display:grid}tp-radio-list[orientation=horizontal]>ul>li:before{content:\"\";text-align:end}tp-radio-list[orientation=horizontal]>ol>li{counter-increment:tp-radio-list-counter}tp-radio-list[orientation=horizontal]>ol>li:before{content:counter(tp-radio-list-counter) \".\";text-align:end}tp-radio-list[orientation=horizontal]>ol[data-tp-radio-list-counter-style=lower-alpha]>li:before{content:counter(tp-radio-list-counter, lower-alpha) \".\"}tp-radio-list[orientation=horizontal]>ol[data-tp-radio-list-counter-style=upper-alpha]>li:before{content:counter(tp-radio-list-counter, upper-alpha) \".\"}tp-radio-list[orientation=horizontal]>ol[data-tp-radio-list-counter-style=lower-roman]>li:before{content:counter(tp-radio-list-counter, lower-roman) \".\"}tp-radio-list[orientation=horizontal]>ol[data-tp-radio-list-counter-style=upper-roman]>li:before{content:counter(tp-radio-list-counter, upper-roman) \".\"}tp-radio-list[orientation=horizontal]>ul>li>label[data-tp-radio-list-label],tp-radio-list[orientation=horizontal]>ol>li>label[data-tp-radio-list-label]{grid-column:2}tp-radio-list label[data-tp-radio-list-label]{vertical-align:middle;line-height:1.4}tp-radio-list[orientation=vertical]>ul>li>label[data-tp-radio-list-label]>:not(input[type=radio][data-tp-radio-list-input]),tp-radio-list[orientation=vertical]>ol>li>label[data-tp-radio-list-label]>:not(input[type=radio][data-tp-radio-list-input]){grid-column:2;margin-inline-start:0}tp-radio-list label[data-tp-radio-list-label] :where(ul,ol){margin-inline-start:0;padding-inline-start:1.25em}tp-radio-list label[data-tp-radio-list-label] :where(address,article,aside,blockquote,details,div,dl,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hr,main,nav,ol,p,pre,section,table,ul){margin-block:0 .5em}tp-radio-list input[type=radio][data-tp-radio-list-input]{-webkit-appearance:radio;appearance:auto;background:revert;border:revert;border-radius:revert;block-size:1em;inline-size:1em;accent-color:var(--tp-brand-seed);vertical-align:middle;flex:none;margin:0;margin-inline-end:.5em}tp-radio-list label[data-tp-radio-list-label]>p:last-child{margin-block-end:0}tp-radio-list[orientation=vertical]>ul>li>label[data-tp-radio-list-label]>input[type=radio][data-tp-radio-list-input],tp-radio-list[orientation=vertical]>ol>li>label[data-tp-radio-list-label]>input[type=radio][data-tp-radio-list-input]{margin-inline-end:0;margin-top:.2em}";
//#endregion
//#region src/components/radio-list/radio-list.ts
function a(e) {
	return e === "horizontal" || e === "vertical";
}
function o(e) {
	return e === "decimal" || e === "lower-alpha" || e === "upper-alpha" || e === "lower-roman" || e === "upper-roman" ? e : null;
}
var s = class s extends e {
	static styleId = "tp-radio-list-styles";
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
		return e === "" ? (this.generatedGroupName === null && (s.nextGroupId += 1, this.generatedGroupName = `tp-radio-list-${String(s.nextGroupId)}`), this.generatedGroupName) : e;
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
		let t = this.value;
		this.setValueAttribute(e.trim()), this.syncSelectionFromValue(), this.emitValueChangeIfNeeded(t);
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
				if (this.transformList(), e === "value") {
					if (!this.isSyncingValue) {
						let e = t ?? "";
						this.syncSelectionFromValue(), this.emitValueChangeIfNeeded(e);
					}
					return;
				}
				this.syncSelectionFromValue();
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
		let t = Array.from(e.children).filter((e) => e instanceof HTMLLIElement);
		if (t.length < 2) {
			e.textContent = "";
			let t = document.createElement("li"), n = document.createElement("div");
			n.setAttribute("style", "color: red; font-weight: bold;"), n.textContent = "ERROR: tp-radio-list requires at least 2 items in the list.", t.append(n), e.append(t);
			return;
		}
		this.syncListAttributes(e);
		let n = this.name;
		for (let e of t) {
			let t = e.querySelector(":scope > label[data-tp-radio-list-label] > input[type=\"radio\"][data-tp-radio-list-input]");
			if (t instanceof HTMLInputElement) {
				t.name = n;
				continue;
			}
			let r = document.createDocumentFragment();
			for (; e.firstChild !== null;) r.append(e.firstChild);
			let i = document.createElement("label");
			i.setAttribute("data-tp-radio-list-label", "");
			let a = document.createElement("input");
			a.setAttribute("data-tp-radio-list-input", ""), a.type = "radio", a.name = n, e.hasAttribute("checked") && (a.checked = !0), e.hasAttribute("disabled") && (a.disabled = !0), i.append(a, r), e.append(i);
		}
	}
	handleInputChange = (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.type !== "radio" || !t.hasAttribute("data-tp-radio-list-input")) return;
		let n = this.getListElement();
		if (!(n instanceof HTMLUListElement || n instanceof HTMLOListElement)) return;
		let r = this.getRadioInputs(n).findIndex((e) => e.checked), i = this.value;
		this.setValueAttribute(r >= 0 ? String(r + 1) : ""), this.syncSelectionFromValue(), this.emitValueChangeIfNeeded(i);
	};
	getRadioInputs(e) {
		let t = Array.from(e.children).filter((e) => e instanceof HTMLLIElement), n = [];
		for (let e of t) {
			let t = e.querySelector(":scope > label[data-tp-radio-list-label] > input[type=\"radio\"][data-tp-radio-list-input]");
			t instanceof HTMLInputElement && n.push(t);
		}
		return n;
	}
	syncSelectionFromValue() {
		let e = this.getListElement();
		if (!(e instanceof HTMLUListElement || e instanceof HTMLOListElement)) return;
		let t = this.getRadioInputs(e), n = this.value;
		if (n === "") {
			for (let e of t) e.checked = !1;
			this.syncCheckedItemAttributes(e, t);
			return;
		}
		let r = Number.parseInt(n, 10);
		if (!(Number.isInteger(r) && String(r) === n && r >= 1 && r <= t.length)) {
			for (let e of t) e.checked = !1;
			this.setValueAttribute(""), this.syncCheckedItemAttributes(e, t);
			return;
		}
		for (let [e, n] of t.entries()) n.checked = e + 1 === r;
		this.syncCheckedItemAttributes(e, t);
	}
	initializeValueAttribute() {
		if (this.hasAttribute("value")) return;
		let e = this.getListElement();
		if (!(e instanceof HTMLUListElement || e instanceof HTMLOListElement)) return;
		let t = this.getRadioInputs(e).findIndex((e) => e.checked);
		this.setValueAttribute(t >= 0 ? String(t + 1) : "");
	}
	syncCheckedItemAttributes(e, t) {
		let n = Array.from(e.children).filter((e) => e instanceof HTMLLIElement);
		for (let [e, r] of n.entries()) t[e]?.checked ? r.setAttribute("checked", "") : r.removeAttribute("checked");
	}
	setValueAttribute(e) {
		this.value !== e && (this.isSyncingValue = !0, this.setAttribute("value", e), this.isSyncingValue = !1);
	}
	emitValueChangeIfNeeded(e) {
		e !== this.value && this.dispatchEvent(new CustomEvent("tp-radio-list-change", {
			detail: {
				value: this.value,
				label: this.resolveSelectedLabel()
			},
			bubbles: !0,
			composed: !0
		}));
	}
	resolveSelectedLabel() {
		let e = this.getListElement();
		if (!(e instanceof HTMLUListElement || e instanceof HTMLOListElement)) return "";
		let t = this.getRadioInputs(e), n = t.findIndex((e) => e.checked);
		if (n < 0) return "";
		let r = t[n];
		if (!(r instanceof HTMLInputElement)) return "";
		let i = r.closest("label[data-tp-radio-list-label]");
		return i instanceof HTMLLabelElement ? i.textContent?.replace(/\s+/g, " ").trim() ?? "" : "";
	}
	syncListAttributes(e) {
		if (e instanceof HTMLOListElement) {
			let t = this.resolveCounterStyle(e);
			e.setAttribute("data-tp-radio-list-counter-style", t);
			return;
		}
		e.removeAttribute("data-tp-radio-list-counter-style");
	}
	resolveCounterStyle(e) {
		let t = o(e.style.listStyleType.trim().toLowerCase());
		if (t !== null) return t;
		let n = e.getAttribute("type");
		return n === "a" ? "lower-alpha" : n === "A" ? "upper-alpha" : n === "i" ? "lower-roman" : n === "I" ? "upper-roman" : n === "1" ? "decimal" : o(window.getComputedStyle(e).listStyleType.trim().toLowerCase()) ?? "decimal";
	}
};
customElements.get("tp-radio-list") || customElements.define("tp-radio-list", s);
//#endregion
export { s as t };

//# sourceMappingURL=radio-list.js.map