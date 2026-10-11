import { t as e } from "../../chunks/playground.js";
import { buildPythonExecutionDocument as t } from "./python-execution-document.js";
import { TpPythonProject as n } from "./python-project.js";
import { buildPythonTestDocument as r } from "./python-test-document.js";
//#region src/components/python-playground/python-playground.ts
var i = class i extends e {
	static nextExecutionScope = 0;
	defaultExecutionScope = `tp-python-${++i.nextExecutionScope}`;
	get supportsTestExecution() {
		return !0;
	}
	createEmptyProject() {
		return new n({
			name: "Python project",
			entry: "/main.py",
			files: [{
				path: "/index.html",
				language: "html",
				content: "<main id=\"app\"></main>"
			}, {
				path: "/main.py",
				language: "python",
				content: "from js import document\n\nprint(\"Hello from Python\")\n\nmessage = \"Hello Python playground\"\ndocument.getElementById(\"app\").textContent = message\nprint(message)"
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
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path.endsWith(".py"))?.path ?? t.files[0]?.path), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path.endsWith(".py"))?.path ?? null;
	}
	getPlaygroundKind() {
		return "python";
	}
	getLanguageIconName() {
		return "file_type_python";
	}
	getLanguageHelp() {
		return "\n      <h2>Python</h2>\n      <p>Python est exécuté dans le navigateur avec Pyodide.</p>\n      <ul>\n        <li><a href=\"https://docs.python.org/3/\" target=\"_blank\" rel=\"noreferrer\">Python documentation</a></li>\n        <li><a href=\"https://pyodide.org/en/stable/\" target=\"_blank\" rel=\"noreferrer\">Pyodide documentation</a></li>\n        <li><a href=\"https://docs.python.org/3/library/unittest.html\" target=\"_blank\" rel=\"noreferrer\">unittest</a></li>\n      </ul>\n    ";
	}
	getAdditionalToolbarMenuItems() {
		return "\n      <li>\n        Python libs\n        <ul>\n          <li data-tp-playground-action=\"python-libs-none\">None</li>\n          <li data-tp-playground-action=\"python-libs-numpy\">NumPy</li>\n          <li data-tp-playground-action=\"python-libs-pandas\">Pandas</li>\n          <li data-tp-playground-action=\"python-libs-matplotlib\">Matplotlib</li>\n        </ul>\n      </li>\n    ";
	}
	handleAdditionalToolbarAction(e) {
		switch (e) {
			case "python-libs-none": return this.applyLibs(void 0), !0;
			case "python-libs-numpy": return this.applyLibs(["numpy"]), !0;
			case "python-libs-pandas": return this.applyLibs(["pandas"]), !0;
			case "python-libs-matplotlib": return this.applyLibs(["matplotlib"]), !0;
			default: return !1;
		}
	}
	createProjectFromExample(e, t) {
		let r = e;
		return new n({
			name: e.name ?? e.label ?? e.id ?? "Python project",
			entry: e.entry ?? "/main.py",
			test: e.test,
			libs: Array.isArray(r.libs) ? r.libs.filter((e) => typeof e == "string") : void 0,
			files: t
		});
	}
	async buildExecutionDocument(e) {
		return t(e, {
			entry: this.resolveEntry(e) ?? void 0,
			libs: e.libs,
			scope: this.getAttribute("execution-scope") ?? this.defaultExecutionScope
		});
	}
	async buildTestDocument(e) {
		return r(e, {
			defaultTest: "/main.test.py",
			libs: e.libs
		});
	}
	applyLibs(e) {
		this.syncProjectFromFilesystem();
		let t = this.getProject();
		this.setProject(new n({
			name: t.name,
			entry: t.entry,
			test: t.test,
			files: t.files,
			libs: e
		})), this.run();
	}
};
customElements.get("tp-python-playground") || customElements.define("tp-python-playground", i);
//#endregion
export { i as TpPythonPlayground, n as TpPythonProject };

//# sourceMappingURL=python-playground.js.map