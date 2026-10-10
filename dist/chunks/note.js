import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/note/note.css?inline
var t = "tp-note{display:none!important}", n = class extends e {
	get ref() {
		return this.getAttribute("ref") ?? "";
	}
	set ref(e) {
		this.setAttribute("ref", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-note-styles", t);
	}
};
customElements.get("tp-note") || customElements.define("tp-note", n);
//#endregion
export { n as t };

//# sourceMappingURL=note.js.map