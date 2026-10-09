import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/inline/inline.css?inline
var t = "tp-inline{align-items:center;gap:var(--tp-inline-gap,.5rem);flex-wrap:nowrap;justify-content:flex-start;min-inline-size:0;display:flex}tp-inline>*{min-inline-size:0}tp-inline[stretch]>*{flex:1 1 0}", n = class n extends e {
	static styleId = "tp-inline-styles";
	static get observedAttributes() {
		return [
			"gap",
			"justify",
			"align",
			"stretch"
		];
	}
	get gap() {
		return this.getAttribute("gap") ?? "";
	}
	set gap(e) {
		if (e === "") {
			this.removeAttribute("gap");
			return;
		}
		this.setAttribute("gap", e);
	}
	get justify() {
		return this.getAttribute("justify") ?? "";
	}
	set justify(e) {
		if (e === "") {
			this.removeAttribute("justify");
			return;
		}
		this.setAttribute("justify", e);
	}
	get align() {
		return this.getAttribute("align") ?? "";
	}
	set align(e) {
		if (e === "") {
			this.removeAttribute("align");
			return;
		}
		this.setAttribute("align", e);
	}
	get stretch() {
		return this.hasAttribute("stretch");
	}
	set stretch(e) {
		if (e) {
			this.setAttribute("stretch", "");
			return;
		}
		this.removeAttribute("stretch");
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.updateStyles();
	}
	attributeChangedCallback() {
		this.updateStyles();
	}
	disconnectedCallback() {
		super.connectedCallback();
	}
	ensureStyles() {
		if (document.getElementById(n.styleId)) return;
		let e = document.createElement("style");
		e.id = n.styleId, e.textContent = t, document.head.append(e);
	}
	updateStyles() {
		this.gap === "" ? this.style.removeProperty("--tp-inline-gap") : this.style.setProperty("--tp-inline-gap", this.gap), this.style.justifyContent = this.justify || "flex-start", this.style.alignItems = this.align || "center";
	}
};
customElements.get("tp-inline") || customElements.define("tp-inline", n);
//#endregion
export { n as t };

