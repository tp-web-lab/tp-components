import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/biblio/biblio.css?inline
var t = "tp-biblio{display:none!important}", n = class extends e {
	get ref() {
		return this.getAttribute("ref") ?? "";
	}
	set ref(e) {
		this.setAttribute("ref", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-biblio-styles", t);
	}
};
customElements.get("tp-biblio") || customElements.define("tp-biblio", n);
//#endregion
export { n as t };

//# sourceMappingURL=biblio.js.map