import { dedent as e } from "../../utilities/code.js";
import { TpPrologProject as t } from "../prolog-playground/prolog-project.js";
import { TpPrologPlayground as n } from "../prolog-playground/prolog-playground.js";
//#region src/components/prolog-viewer/prolog-viewer.ts
var r = class extends n {
	get viewerMode() {
		return !0;
	}
	get usesViewerEditorTabs() {
		return !0;
	}
	createInitialProject() {
		let n = super.createInitialProject(), r = Array.from(this.querySelectorAll(":scope > script:is([type=\"tp/prolog\"], [type=\"tp/prolog-viewer\"])"));
		if (r.length > 0 && r.every((e) => e.hasAttribute("filename"))) {
			let n = r.flatMap((t) => {
				let n = t.getAttribute("filename")?.trim() ?? "";
				return n === "" ? [] : [{
					path: n.startsWith("/") ? n : `/${n}`,
					language: "prolog",
					content: e(t.textContent ?? "")
				}];
			});
			return new t({
				name: "Prolog viewer project",
				entry: n.find((e) => e.path === "/program.pl")?.path,
				query: n.find((e) => e.path === "/query.pl")?.path,
				files: n
			});
		}
		if (r.length === 0) {
			let e = n.entry ?? "/program.pl", t = n.query ?? "/query.pl";
			n.entry = e, n.query = t;
			for (let r of [e, t]) {
				let e = n.findFile(r);
				e === void 0 ? n.files.push({
					path: r,
					language: "prolog",
					content: ""
				}) : e.content = "";
			}
		} else if (r.length === 1 && !r[0]?.hasAttribute("filename")) {
			let e = n.query ?? "/query.pl";
			n.query = e;
			let t = n.findFile(e);
			t === void 0 ? n.files.push({
				path: e,
				language: "prolog",
				content: ""
			}) : t.content = "";
		}
		return n;
	}
	getViewerAdditionalFilePaths(e) {
		return e.query === void 0 ? [] : [e.query];
	}
	resolveViewerPrimaryFile(e) {
		return super.resolveViewerPrimaryFile(e) ?? (e.query !== void 0 && e.findFile(e.query) !== void 0 ? e.query : null);
	}
};
customElements.get("tp-prolog-viewer") || customElements.define("tp-prolog-viewer", r);
//#endregion
export { r as TpPrologViewer };

//# sourceMappingURL=prolog-viewer.js.map