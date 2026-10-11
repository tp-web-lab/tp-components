import { t as e } from "../../chunks/notebook.js";
//#region src/components/typescript-notebook/typescript-notebook.ts
var t = class extends e {
	connectedCallback() {
		this.hasAttribute("language") || this.setAttribute("language", "typescript"), super.connectedCallback();
	}
};
customElements.get("tp-typescript-notebook") || customElements.define("tp-typescript-notebook", t);
//#endregion
export { t as TpTypescriptNotebook };

//# sourceMappingURL=typescript-notebook.js.map