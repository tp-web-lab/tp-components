import { t as e } from "../../chunks/playground.js";
import { buildPrologExecutionDocument as t } from "./prolog-execution-document.js";
import { TpPrologProject as n } from "./prolog-project.js";
import { buildPrologTestDocument as r } from "./prolog-test-document.js";
//#region src/components/prolog-playground/prolog-playground.ts
var i = class extends e {
	get supportsTestExecution() {
		return !0;
	}
	createEmptyProject() {
		return new n({
			name: "Prolog project",
			entry: "/program.pl",
			query: "/query.pl",
			files: [{
				path: "/program.pl",
				language: "prolog",
				content: "parent(ada, byron).\nparent(ada, charles).\nparent(byron, diana).\n\ngrandparent(Grandparent, Grandchild) :-\n  parent(Grandparent, Parent),\n  parent(Parent, Grandchild)."
			}, {
				path: "/query.pl",
				language: "prolog",
				content: "grandparent(ada, Grandchild)."
			}]
		});
	}
	createNewProject() {
		return this.createEmptyProject();
	}
	createClearProject() {
		return new n({
			name: "Untitled project",
			files: []
		});
	}
	normalizeProject(e) {
		let t = e.clone();
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path === "/program.pl")?.path ?? t.files.find((e) => e.path.endsWith(".pl") && e.path !== t.query)?.path), (t.query === void 0 || t.query === "") && (t.query = t.files.find((e) => e.path === "/query.pl")?.path ?? t.files.find((e) => e.path.endsWith(".query.pl"))?.path), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path === "/program.pl")?.path ?? e.files.find((t) => t.path.endsWith(".pl") && t.path !== e.query)?.path ?? null;
	}
	getPlaygroundKind() {
		return "prolog";
	}
	getLanguageIconName() {
		return "file_type_prolog";
	}
	getLanguageHelp() {
		return "\n      <h2>Prolog</h2>\n      <p>Ce playground exécute Prolog avec Scryer Prolog et prend en charge les contraintes CLP(Z).</p>\n      <ul>\n        <li><a href=\"https://www.scryer.pl/\" target=\"_blank\" rel=\"noreferrer\">Scryer Prolog</a></li>\n        <li><a href=\"https://github.com/guregu/scryer-js\" target=\"_blank\" rel=\"noreferrer\">scryer-js</a></li>\n      </ul>\n    ";
	}
	createProjectFromExample(e, t) {
		let r = e;
		return new n({
			name: e.name ?? e.label ?? e.id ?? "Prolog project",
			entry: e.entry ?? "/program.pl",
			test: e.test,
			query: typeof r.query == "string" ? r.query : "/query.pl",
			files: t
		});
	}
	createProjectFromRepository(e, t) {
		return this.createProjectFromExample(e, t);
	}
	async buildExecutionDocument(e) {
		return t(e, {
			entry: this.resolveEntry(e) ?? void 0,
			query: e.query,
			scope: this.getAttribute("execution-scope") ?? void 0,
			index: Number(this.getAttribute("execution-index") ?? "0")
		});
	}
	async buildTestDocument(e) {
		return r(e, { defaultTest: "/test.pl" });
	}
};
customElements.get("tp-prolog-playground") || customElements.define("tp-prolog-playground", i);
//#endregion
export { i as TpPrologPlayground, n as TpPrologProject };

//# sourceMappingURL=prolog-playground.js.map