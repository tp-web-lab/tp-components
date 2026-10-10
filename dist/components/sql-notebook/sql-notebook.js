import { a as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/sql-notebook/sql-notebook.ts
var t = class extends e {
	connectedCallback() {
		this.hasAttribute("language") || this.setAttribute("language", "sql"), super.connectedCallback();
	}
};
customElements.get("tp-sql-notebook") || customElements.define("tp-sql-notebook", t);
//#endregion
export { t as TpSqlNotebook };

//# sourceMappingURL=sql-notebook.js.map