import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/grid/grid.css?inline
var t = "tp-grid{gap:var(--tp-grid-gap,1rem);display:grid}@supports (width:min(var(--tp-grid-min-width, 250px), 100%)){tp-grid{grid-template-columns:repeat(auto-fit, minmax(min(var(--tp-grid-min-width,250px), 100%), 1fr))}}";
//#endregion
//#region src/components/grid/grid.ts
function n(e) {
	let t = e.trim();
	return t === "" ? !1 : /^(min|max|clamp)\(/.test(t) ? !0 : /^-?\d*\.?\d+(px|rem|em|%|ch|vw|vh|vmin|vmax)$/.test(t);
}
var r = class r extends e {
	static styleId = "tp-grid-styles";
	static get observedAttributes() {
		return ["min-width", "gap"];
	}
	get minWidth() {
		let e = this.getAttribute("min-width") ?? "";
		return n(e) ? e : "";
	}
	set minWidth(e) {
		if (e === "") {
			this.removeAttribute("min-width");
			return;
		}
		if (!n(e)) throw TypeError("The \"min-width\" attribute must be a valid CSS length like \"250px\", \"20rem\" or \"50%\".");
		this.setAttribute("min-width", e);
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
		if (document.getElementById(r.styleId)) return;
		let e = document.createElement("style");
		e.id = r.styleId, e.textContent = t, document.head.append(e);
	}
	updateStyles() {
		this.minWidth === "" ? this.style.removeProperty("--tp-grid-min-width") : this.style.setProperty("--tp-grid-min-width", this.minWidth), this.gap === "" ? this.style.removeProperty("--tp-grid-gap") : this.style.setProperty("--tp-grid-gap", this.gap);
	}
};
customElements.get("tp-grid") || customElements.define("tp-grid", r);
//#endregion
export { r as t };

//# sourceMappingURL=grid.js.map