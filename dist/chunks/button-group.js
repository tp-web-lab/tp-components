import { t as e } from "./base.js";
import "./button.js";
//#region src/components/button-group/button-group.css?inline
var t = "tp-button-group{--tp-button-group-gap:0;align-items:center;gap:var(--tp-button-group-gap);vertical-align:middle;display:inline-flex}tp-button-group[orientation=vertical]{flex-direction:column;align-items:stretch}tp-button-group[stretch]{inline-size:100%;display:flex}tp-button-group>tp-button[hidden]{display:none!important}tp-button-group[stretch]>tp-button{flex:1 1 0}tp-button-group[attached]{--tp-button-group-gap:0}tp-button-group[attached]>tp-button[data-tp-button-group-single-visible]>:is(button,a){border-radius:999rem}tp-button-group[attached]>tp-button+tp-button{margin-inline-start:-1px}tp-button-group[attached][data-single-visible]>tp-button:not([hidden])>:is(button,a){border-radius:inherit}tp-button-group[attached]>tp-button:not(:first-child):not(:only-child)>:is(button,a){border-start-start-radius:0;border-end-start-radius:0}tp-button-group[attached]>tp-button:not(:last-child):not(:only-child)>:is(button,a){border-start-end-radius:0;border-end-end-radius:0}tp-button-group[attached][orientation=vertical]>tp-button+tp-button{margin-block-start:-1px;margin-inline-start:0}tp-button-group[attached][orientation=vertical]>tp-button:not(:first-child):not(:only-child)>:is(button,a){border-start-start-radius:0;border-start-end-radius:0}tp-button-group[attached][orientation=vertical]>tp-button:not(:last-child):not(:only-child)>:is(button,a){border-end-end-radius:0;border-end-start-radius:0}";
//#endregion
//#region src/components/button-group/button-group.ts
function n(e) {
	return e === "horizontal" || e === "vertical";
}
var r = class r extends e {
	static buttonGroupStyleId = "tp-button-group-styles";
	static get observedAttributes() {
		return [
			"orientation",
			"attached",
			"stretch"
		];
	}
	get orientation() {
		let e = this.getAttribute("orientation");
		return e !== null && n(e) ? e : "horizontal";
	}
	set orientation(e) {
		this.setStringAttribute("orientation", e);
	}
	get attached() {
		return this.getBooleanAttribute("attached");
	}
	set attached(e) {
		this.setBooleanAttribute("attached", e);
	}
	get stretch() {
		return this.getBooleanAttribute("stretch");
	}
	set stretch(e) {
		this.setBooleanAttribute("stretch", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(r.buttonGroupStyleId, t), this.updateButtonGroup();
	}
	attributeChangedCallback(e, t, n) {
		t !== n && this.updateButtonGroup();
	}
	disconnectedCallback() {}
	updateButtonGroup() {
		this.setAttribute("orientation", this.orientation);
	}
};
customElements.get("tp-button-group") || customElements.define("tp-button-group", r);
//#endregion
export { r as t };

//# sourceMappingURL=button-group.js.map