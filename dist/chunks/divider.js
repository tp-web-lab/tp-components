import { t as e } from "./base.js";
//#region src/components/divider/divider.css?inline
var t = "tp-divider{--tp-divider-color:var(--tp-neutral-stroke-soft,#d1d5db);--tp-divider-thickness:1px;box-sizing:border-box;color:inherit;flex:none;display:block}tp-divider[orientation=horizontal]{border-block-start:var(--tp-divider-thickness) solid var(--tp-divider-color);block-size:0;inline-size:100%;margin-block:var(--tp-divider-margin-block,.125rem);margin-inline:var(--tp-divider-margin-inline,0)}tp-divider[orientation=vertical]{border-inline-start:var(--tp-divider-thickness) solid var(--tp-divider-color);block-size:auto;inline-size:0;margin-block:var(--tp-divider-margin-block,0);margin-inline:var(--tp-divider-margin-inline,.25rem);align-self:stretch;min-block-size:1em}";
//#endregion
//#region src/components/divider/divider.ts
function n(e) {
	return e === "horizontal" || e === "vertical";
}
var r = class r extends e {
	static styleId = "tp-divider-styles";
	static get observedAttributes() {
		return ["orientation"];
	}
	get orientation() {
		let e = this.getAttribute("orientation") ?? "horizontal";
		return n(e) ? e : "horizontal";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(r.styleId, t), this.updateDivider();
	}
	attributeChangedCallback() {
		this.isConnected && this.updateDivider();
	}
	updateDivider() {
		let e = this.orientation;
		this.getAttribute("orientation") !== e && this.setAttribute("orientation", e), this.setAttribute("role", "separator"), this.setAttribute("aria-orientation", e);
	}
};
customElements.get("tp-divider") || customElements.define("tp-divider", r);
//#endregion
export { r as t };

//# sourceMappingURL=divider.js.map