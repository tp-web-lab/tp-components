import { Zu as e } from "./lib/typescript/typescript.js";
//#region src/components/sidebar/sidebar.css?inline
var t = "tp-sidebar{gap:var(--tp-sidebar-gap,1rem);flex-wrap:wrap;display:flex}tp-sidebar:not([right-sidebar])>:first-child{flex-basis:var(--tp-sidebar-side-width,auto);flex-grow:1}tp-sidebar:not([right-sidebar])>:last-child,tp-sidebar[right-sidebar]>:first-child{min-inline-size:var(--tp-sidebar-content-width,50%);flex-grow:999;flex-basis:0}tp-sidebar[right-sidebar]>:last-child{flex-basis:var(--tp-sidebar-side-width,auto);flex-grow:1}";
//#endregion
//#region src/components/sidebar/sidebar.ts
function n(e) {
	if (!/^(?:\d+|\d*\.\d+)%$/.test(e)) return !1;
	let t = Number.parseFloat(e);
	return t > 0 && t <= 100;
}
var r = class r extends e {
	static styleId = "tp-sidebar-styles";
	static get observedAttributes() {
		return [
			"side-width",
			"content-width",
			"gap",
			"right-sidebar"
		];
	}
	get sideWidth() {
		return this.getAttribute("side-width") ?? "";
	}
	set sideWidth(e) {
		if (e === "") {
			this.removeAttribute("side-width");
			return;
		}
		this.setAttribute("side-width", e);
	}
	get contentWidth() {
		let e = this.getAttribute("content-width") ?? "";
		return n(e) ? e : "";
	}
	set contentWidth(e) {
		if (e === "") {
			this.removeAttribute("content-width");
			return;
		}
		if (!n(e)) throw TypeError("The \"content-width\" attribute must be a percentage string like \"50%\" or \"65.5%\".");
		this.setAttribute("content-width", e);
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
	get rightSidebar() {
		return this.hasAttribute("right-sidebar");
	}
	set rightSidebar(e) {
		if (e) {
			this.setAttribute("right-sidebar", "");
			return;
		}
		this.removeAttribute("right-sidebar");
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.updateStyles();
	}
	attributeChangedCallback(e, t, n) {
		super.attributeChangedCallback(e, t, n), this.updateStyles();
	}
	disconnectedCallback() {}
	ensureStyles() {
		if (document.getElementById(r.styleId)) return;
		let e = document.createElement("style");
		e.id = r.styleId, e.textContent = t, document.head.append(e);
	}
	updateStyles() {
		this.sideWidth === "" ? this.style.removeProperty("--tp-sidebar-side-width") : this.style.setProperty("--tp-sidebar-side-width", this.sideWidth), this.contentWidth === "" ? this.style.removeProperty("--tp-sidebar-content-width") : this.style.setProperty("--tp-sidebar-content-width", this.contentWidth), this.style.gap = this.gap;
	}
};
customElements.get("tp-sidebar") || customElements.define("tp-sidebar", r);
//#endregion
export { r as t };

//# sourceMappingURL=sidebar.js.map