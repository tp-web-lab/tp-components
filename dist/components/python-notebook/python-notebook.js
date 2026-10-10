import { a as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/python-notebook/python-notebook.ts
var t = class extends e {
	connectedCallback() {
		this.hasAttribute("language") || this.setAttribute("language", "python"), super.connectedCallback();
	}
};
customElements.get("tp-python-notebook") || customElements.define("tp-python-notebook", t);
//#endregion
export { t as TpPythonNotebook };

//# sourceMappingURL=python-notebook.js.map