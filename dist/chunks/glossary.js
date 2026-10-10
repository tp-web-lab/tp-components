import { Zu as e } from "./lib/typescript/typescript.js";
//#region src/components/glossary/glossary.css?inline
var t = "tp-glossary{display:none!important}", n = class extends e {
	get ref() {
		return this.getAttribute("ref") ?? "";
	}
	set ref(e) {
		this.setAttribute("ref", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-glossary-styles", t);
	}
};
customElements.get("tp-glossary") || customElements.define("tp-glossary", n);
//#endregion
export { n as t };

//# sourceMappingURL=glossary.js.map