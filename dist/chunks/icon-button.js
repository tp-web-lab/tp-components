import { t as e } from "./base.js";
import "./icon.js";
import { isTpSizeType as t, isTpVariantType as n } from "../components/base/base.types.js";
//#region src/components/icon-button/icon-button.css?inline
var r = "tp-icon-button{--tp-icon-button-size:1.75em;--tp-icon-button-icon-size:1em;--tp-icon-button-radius:999rem;--tp-icon-button-hover-background:color-mix(in srgb, currentColor 10%, transparent);--tp-icon-button-focus-ring:currentColor;vertical-align:middle;line-height:1;display:inline-flex}tp-icon-button[size=xxs]{--tp-icon-button-size:max(1.5rem, 1.25em);--tp-icon-button-icon-size:.75em}tp-icon-button[size=xs]{--tp-icon-button-size:max(1.5rem, 1.5em);--tp-icon-button-icon-size:.875em}tp-icon-button[size=s]{--tp-icon-button-size:1.75em;--tp-icon-button-icon-size:1em}tp-icon-button[size=m]{--tp-icon-button-size:2em;--tp-icon-button-icon-size:1.125em}tp-icon-button[size=l]{--tp-icon-button-size:2.25em;--tp-icon-button-icon-size:1.25em}tp-icon-button[size=xl]{--tp-icon-button-size:2.75em;--tp-icon-button-icon-size:1.5em}tp-icon-button[size=xxl]{--tp-icon-button-size:3.25em;--tp-icon-button-icon-size:1.75em}tp-icon-button>button{appearance:none;border-radius:var(--tp-icon-button-radius);color:currentColor;cursor:pointer;font:inherit;min-block-size:var(--tp-icon-button-size);min-inline-size:var(--tp-icon-button-size);background:0 0;border:0;justify-content:center;align-items:center;margin:0;padding:0;display:inline-flex}tp-icon-button>button:hover{background:var(--tp-icon-button-hover-background)}tp-icon-button>button:focus-visible{outline:2px solid var(--tp-icon-button-focus-ring);outline-offset:2px}tp-icon-button>button:disabled{cursor:not-allowed;opacity:.45}tp-icon-button>button:disabled:hover{background:0 0}tp-icon-button tp-icon{--tp-icon-size:var(--tp-icon-button-icon-size)}tp-icon-button[variant=brand]{color:var(--tp-button-brand,#7c3aed)}tp-icon-button[variant=success]{color:var(--tp-button-success,#15803d)}tp-icon-button[variant=danger]{color:var(--tp-button-danger,#b91c1c)}tp-icon-button[variant=warning]{color:var(--tp-button-warning,#c2410c)}tp-icon-button[variant=info]{color:var(--tp-button-info,#1d4ed8)}tp-icon-button[variant=neutral]{color:var(--tp-button-neutral,currentColor)}";
//#endregion
//#region src/components/icon-button/icon-button.ts
function i(e) {
	return e === "button" || e === "submit" || e === "reset";
}
var a = class a extends e {
	static iconButtonStyleId = "tp-icon-button-styles";
	buttonEl = null;
	iconEl = null;
	static get observedAttributes() {
		return [
			"name",
			"library",
			"label",
			"type",
			"variant",
			"size",
			"color",
			"scale",
			"rotate",
			"flip-h",
			"flip-v",
			"spin",
			"disabled"
		];
	}
	get name() {
		return this.getStringAttribute("name");
	}
	set name(e) {
		this.setStringAttribute("name", e);
	}
	get library() {
		return this.getStringAttribute("library");
	}
	set library(e) {
		this.setStringAttribute("library", e);
	}
	get label() {
		return this.getStringAttribute("label");
	}
	set label(e) {
		this.setStringAttribute("label", e);
	}
	get type() {
		let e = this.getAttribute("type");
		return e !== null && i(e) ? e : "button";
	}
	set type(e) {
		this.setStringAttribute("type", e);
	}
	get variant() {
		let e = this.getAttribute("variant");
		return e !== null && n(e) ? e : "neutral";
	}
	set variant(e) {
		this.setStringAttribute("variant", e);
	}
	get size() {
		let e = this.getAttribute("size");
		return e !== null && t(e) ? e : "m";
	}
	set size(e) {
		this.setStringAttribute("size", e);
	}
	get color() {
		return this.getStringAttribute("color");
	}
	set color(e) {
		this.setStringAttribute("color", e);
	}
	get scale() {
		let e = Number(this.getAttribute("scale") ?? "1");
		return Number.isFinite(e) && e > 0 ? e : 1;
	}
	set scale(e) {
		this.setStringAttribute("scale", String(e));
	}
	get rotate() {
		return this.getStringAttribute("rotate", "0deg");
	}
	set rotate(e) {
		this.setStringAttribute("rotate", e);
	}
	get flipH() {
		return this.getBooleanAttribute("flip-h");
	}
	set flipH(e) {
		this.setBooleanAttribute("flip-h", e);
	}
	get flipV() {
		return this.getBooleanAttribute("flip-v");
	}
	set flipV(e) {
		this.setBooleanAttribute("flip-v", e);
	}
	get spin() {
		return this.getBooleanAttribute("spin");
	}
	set spin(e) {
		this.setBooleanAttribute("spin", e);
	}
	get disabled() {
		return this.getBooleanAttribute("disabled");
	}
	set disabled(e) {
		this.setBooleanAttribute("disabled", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(a.iconButtonStyleId, r), this.ensureButton(), this.updateIconButton();
	}
	attributeChangedCallback(e, t, n) {
		t !== n && (this.ensureButton(), this.updateIconButton());
	}
	disconnectedCallback() {}
	focus() {
		this.buttonEl?.focus();
	}
	ensureButton() {
		let e = this.querySelector(":scope > button");
		if (!(e instanceof HTMLButtonElement)) {
			for (e = document.createElement("button"); this.firstChild !== null;) this.firstChild.remove();
			this.append(e);
		}
		let t = e.querySelector(":scope > tp-icon");
		t instanceof HTMLElement || (t = document.createElement("tp-icon"), t.setAttribute("aria-hidden", "true"), e.append(t)), this.buttonEl = e, this.iconEl = t;
	}
	updateIconButton() {
		if (this.setAttribute("variant", this.variant), this.setAttribute("size", this.size), !(this.buttonEl instanceof HTMLButtonElement)) return;
		this.buttonEl.type = this.type, this.buttonEl.disabled = this.disabled, this.buttonEl.setAttribute("aria-disabled", String(this.disabled));
		let e = this.label || this.name || "Icon button";
		if (this.buttonEl.setAttribute("aria-label", e), this.buttonEl.title = e, this.iconEl instanceof HTMLElement) {
			this.name === "" ? this.iconEl.removeAttribute("name") : this.iconEl.setAttribute("name", this.name), this.library === "" ? this.iconEl.removeAttribute("library") : this.iconEl.setAttribute("library", this.library);
			let e = (e, t) => {
				t === "" ? this.iconEl?.removeAttribute(e) : this.iconEl?.setAttribute(e, t);
			};
			e("color", this.color), e("scale", String(this.scale)), e("rotate", this.rotate), this.iconEl.toggleAttribute("flip-h", this.flipH), this.iconEl.toggleAttribute("flip-v", this.flipV), this.iconEl.toggleAttribute("spin", this.spin);
		}
	}
};
customElements.get("tp-icon-button") || customElements.define("tp-icon-button", a);
//#endregion
export { a as t };

//# sourceMappingURL=icon-button.js.map