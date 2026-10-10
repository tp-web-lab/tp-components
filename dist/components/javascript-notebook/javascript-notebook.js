import { a as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/javascript-notebook/javascript-notebook.ts
var t = class extends e {
	connectedCallback() {
		this.hasAttribute("language") || this.setAttribute("language", "javascript"), super.connectedCallback();
	}
};
customElements.get("tp-javascript-notebook") || customElements.define("tp-javascript-notebook", t);
//#endregion
export { t as TpJavascriptNotebook };

//# sourceMappingURL=javascript-notebook.js.map