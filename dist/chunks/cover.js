import { qu as e } from "./lib/typescript/typescript.js";
//#region src/components/cover/cover.css?inline
var t = "tp-cover{min-block-size:var(--tp-cover-min-height,100vh);padding:var(--tp-cover-padding,1rem);flex-direction:column;display:flex}tp-cover>*{margin-block:var(--tp-cover-gap,1rem)}", n = 0;
function r(e) {
	let t = e.trim();
	return t === "" || /[,\s>+~:]/.test(t) ? !1 : /^[a-zA-Z][\w-]*$/.test(t) || /^\.[\w-]+$/.test(t) || /^#[\w-]+$/.test(t) || /^\[[\w-]+(?:="[^"]*")?\]$/.test(t);
}
var i = class i extends e {
	static styleId = "tp-cover-styles";
	headingStyleEl = null;
	instanceId = null;
	static get observedAttributes() {
		return [
			"heading",
			"min-height",
			"gap",
			"padding"
		];
	}
	get heading() {
		let e = this.getAttribute("heading") ?? "";
		return r(e) ? e : "";
	}
	set heading(e) {
		if (e === "") {
			this.removeAttribute("heading");
			return;
		}
		if (!r(e)) throw TypeError("The \"heading\" attribute must be a simple selector like \"h1\", \".hero\", \"#title\" or \"[data-role=\\\"hero\\\"]\".");
		this.setAttribute("heading", e);
	}
	get minHeight() {
		return this.getAttribute("min-height") ?? "";
	}
	set minHeight(e) {
		if (e === "") {
			this.removeAttribute("min-height");
			return;
		}
		this.setAttribute("min-height", e);
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
	get padding() {
		return this.getAttribute("padding") ?? "";
	}
	set padding(e) {
		if (e === "") {
			this.removeAttribute("padding");
			return;
		}
		this.setAttribute("padding", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureInstanceId(), this.updateStyles(), this.updateHeadingStyle();
	}
	attributeChangedCallback(e) {
		this.updateStyles(), e === "heading" && this.updateHeadingStyle();
	}
	disconnectedCallback() {
		super.connectedCallback(), this.removeHeadingStyle();
	}
	ensureStyles() {
		if (document.getElementById(i.styleId)) return;
		let e = document.createElement("style");
		e.id = i.styleId, e.textContent = t, document.head.append(e);
	}
	ensureInstanceId() {
		this.instanceId === null && (n += 1, this.instanceId = `tp-cover-${n}`, this.setAttribute("data-tp-cover-id", this.instanceId));
	}
	updateStyles() {
		this.minHeight === "" ? this.style.removeProperty("--tp-cover-min-height") : this.style.setProperty("--tp-cover-min-height", this.minHeight), this.gap === "" ? this.style.removeProperty("--tp-cover-gap") : this.style.setProperty("--tp-cover-gap", this.gap), this.padding === "" ? this.style.removeProperty("--tp-cover-padding") : this.style.setProperty("--tp-cover-padding", this.padding);
	}
	updateHeadingStyle() {
		if (this.removeHeadingStyle(), !this.isConnected) return;
		let e = this.heading;
		if (e === "") return;
		this.ensureInstanceId();
		let t = `tp-cover[data-tp-cover-id="${this.instanceId}"]`, n = document.createElement("style");
		n.textContent = `${t} > :first-child:not(${e}) {margin-block-start: 0;}${t} > :last-child:not(${e}) {margin-block-end: 0;}${t} > ${e} {margin-block: auto;}`, document.head.append(n), this.headingStyleEl = n;
	}
	removeHeadingStyle() {
		this.headingStyleEl?.remove(), this.headingStyleEl = null;
	}
};
customElements.get("tp-cover") || customElements.define("tp-cover", i);
//#endregion
export { i as t };

//# sourceMappingURL=cover.js.map