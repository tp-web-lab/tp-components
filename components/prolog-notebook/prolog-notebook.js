import { a as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/prolog-notebook/prolog-notebook.ts
var t = class extends e {
	connectedCallback() {
		this.hasAttribute("language") || this.setAttribute("language", "prolog"), super.connectedCallback();
	}
};
customElements.get("tp-prolog-notebook") || customElements.define("tp-prolog-notebook", t);
//#endregion
export { t as TpPrologNotebook };

