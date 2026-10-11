import { TpSqlPlayground as e } from "../sql-playground/sql-playground.js";
//#region src/components/sql-viewer/sql-viewer.ts
var t = class extends e {
	get viewerMode() {
		return !0;
	}
	get usesViewerEditorTabs() {
		return !0;
	}
	createInitialProject() {
		let e = super.createInitialProject(), t = Array.from(this.querySelectorAll(":scope > script:is([type=\"tp/sql\"], [type=\"tp/sql-viewer\"])"));
		if (t.length === 1 && !t[0]?.hasAttribute("filename")) {
			let t = e.setup ?? "/tables.sql", n = e.entry ?? "/query.sql", r = e.findFile(n), i = e.findFile(t), a = r?.content ?? "";
			e.setup = t, e.entry = n, i === void 0 ? e.files.push({
				path: t,
				language: "sql",
				content: a
			}) : i.content = a, r === void 0 ? e.files.push({
				path: n,
				language: "sql",
				content: ""
			}) : r.content = "";
		}
		return e;
	}
	getViewerAdditionalFilePaths(e) {
		return e.entry === void 0 ? [] : [e.entry];
	}
	resolveViewerPrimaryFile(e) {
		return e.setup !== void 0 && e.findFile(e.setup) !== void 0 ? e.setup : super.resolveViewerPrimaryFile(e);
	}
};
customElements.get("tp-sql-viewer") || customElements.define("tp-sql-viewer", t);
//#endregion
export { t as TpSqlViewer };

//# sourceMappingURL=sql-viewer.js.map