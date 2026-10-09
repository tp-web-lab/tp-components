import { Jt as e } from "../../chunks/lib/typescript/typescript.js";
import { getMarkupExtensionIdFromAction as t, isMarkupExtensionAction as n, renderMarkupExtensionMenu as r, syncMarkupExtensionMenuChecks as i } from "../markup-playground/markup-extension-menu.js";
import { createMarkupExtensionMenuItems as a, toMarkupRuntimeExtensions as o, toggleMarkupExtensionId as s } from "../markup-playground/markup-extension-registry.js";
import { buildRestructuredTextExecutionDocument as c } from "./restructuredtext-execution-document.js";
import { TpRestructuredTextProject as l } from "./restructuredtext-project.js";
//#region src/components/restructuredtext-playground/restructuredtext-playground.ts
var u = class extends e {
	createEmptyProject() {
		return new l({
			name: "reStructuredText project",
			entry: "/index.rst",
			files: [{
				path: "/index.rst",
				language: "restructuredtext",
				content: "reStructuredText playground\n===========================\n.. tp-callout::\n   :variant: info\n   :heading: About this playground\n\n   This `reStructuredText <https://docutils.sourceforge.io/rst.html>`_ document is rendered in the browser with `Pyodide <https://pyodide.org/>`_ and `docutils <https://docutils.sourceforge.io/>`_.\n\n.. contents:: Contents\n   :depth: 2\n   :local:\n\n\nLists\n-----\n\nUnordered list\n^^^^^^^^^^^^^^\n\n- HTML\n- CSS\n- JavaScript\n\n  - DOM\n  - Events\n  - Fetch API\n\nOrdered list\n^^^^^^^^^^^^\n\n1. Install dependencies\n2. Start the dev server\n3. Open the browser\n\nDefinition list\n^^^^^^^^^^^^^^^\n\nHTML\n  Structures the document.\n\nCSS\n  Styles the document.\n\nJavaScript\n  Adds behavior to the document.\n\n\n\nTables\n------\n\nSimple table\n^^^^^^^^^^^^\n\n=========  ===========\nLanguage   Role\n=========  ===========\nHTML       Structure\nCSS        Style\nPython     Rendering\n=========  ===========\n\nList table\n^^^^^^^^^^\n\n.. list-table:: Languages\n   :header-rows: 1\n\n   * - Language\n     - Role\n   * - HTML\n     - Structure\n   * - CSS\n     - Style\n\nCSV table\n^^^^^^^^^\n\n.. csv-table:: Languages\n   :header: \"Language\", \"Role\"\n\n   \"HTML\", \"Structure\"\n   \"CSS\", \"Style\"\n   \"Python\", \"Runtime\"\n\n\nCodes\n-----\n\nLoad the highlight.js extension to add syntax highlighting to code blocks.\n\nLiteral block\n^^^^^^^^^^^^^\n\n::\n\n  print(\"Hello reStructuredText\")\n\n\nJavascript\n^^^^^^^^^^\n\n.. code-block:: javascript\n\n   function greet(name) {\n       console.log(`Hello ${name}`);\n   }\n\n   greet('world');\n\n\nPython\n^^^^^^\n\n.. code-block:: python\n\n   def greet(name: str) -> None:\n       print(f\"Hello {name}\")\n\n   greet(\"world\")\n\nHTML\n^^^^\n\n.. code-block:: html\n\n   <section class=\"card\">\n     <h2>Hello</h2>\n   </section>\n\n\nBash\n^^^^\n\n.. code-block:: bash\n\n   pnpm install\n   pnpm dev"
			}]
		});
	}
	createNewProject() {
		return this.createEmptyProject();
	}
	createClearProject() {
		return new l({
			name: "Untitled project",
			files: []
		});
	}
	normalizeProject(e) {
		let t = e.clone();
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path.endsWith(".rst"))?.path ?? t.files.find((e) => e.path.endsWith(".rest"))?.path ?? t.files[0]?.path), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path === "/index.rst")?.path ?? e.files.find((e) => e.path === "/main.rst")?.path ?? e.files.find((e) => e.path.endsWith(".rst"))?.path ?? e.files.find((e) => e.path.endsWith(".rest"))?.path ?? null;
	}
	getPlaygroundKind() {
		return "restructuredtext";
	}
	getLanguageIconName() {
		return "file_type_restructuredtext";
	}
	getLanguageHelp() {
		return "\n      <h2>reStructuredText</h2>\n      <p>reStructuredText est rendu avec docutils dans Pyodide.</p>\n      <ul>\n        <li><a href=\"https://docutils.sourceforge.io/rst.html\" target=\"_blank\" rel=\"noreferrer\">reStructuredText</a></li>\n        <li><a href=\"https://docutils.sourceforge.io/\" target=\"_blank\" rel=\"noreferrer\">docutils</a></li>\n        <li><a href=\"https://pyodide.org/\" target=\"_blank\" rel=\"noreferrer\">Pyodide</a></li>\n      </ul>\n    ";
	}
	createProjectFromExample(e, t) {
		let n = e;
		return new l({
			name: e.name ?? e.label ?? e.id ?? "reStructuredText project",
			entry: e.entry ?? "/index.rst",
			test: e.test,
			libs: Array.isArray(n.libs) ? n.libs.filter((e) => typeof e == "string") : void 0,
			extensions: Array.isArray(n.extensions) ? n.extensions.filter((e) => typeof e == "object" && !!e && typeof e.id == "string" && typeof e.label == "string" && typeof e.url == "string") : void 0,
			files: t
		});
	}
	async buildExecutionDocument(e) {
		return c(e, {
			entry: this.resolveEntry(e) ?? void 0,
			libs: e.libs
		});
	}
	getAdditionalToolbarMenuItems() {
		return r(a("restructuredtext", this.getActiveMarkupExtensionIds()));
	}
	handleAdditionalToolbarAction(e) {
		if (!n(e)) return !1;
		let r = t(e);
		if (r === null) return !1;
		let i = s(this.getActiveMarkupExtensionIds(), r);
		return this.applyMarkupExtensions(i), !0;
	}
	getActiveMarkupExtensionIds() {
		return new Set(this.getProject().extensions?.map((e) => e.id) ?? []);
	}
	applyMarkupExtensions(e) {
		this.toolbarStartMenuEl?.closeAll?.(), this.syncProjectFromFilesystem();
		let t = this.getProject();
		this.setProject(new l({
			name: t.name,
			entry: t.entry,
			test: t.test,
			libs: t.libs,
			files: t.files,
			extensions: o("restructuredtext", e)
		})), queueMicrotask(() => {
			this.syncToolbarExtensionChecks(), this.run();
		});
	}
	syncToolbarExtensionChecks() {
		i(this, this.getActiveMarkupExtensionIds());
	}
	get exampleCategory() {
		return "playgrounds";
	}
	get exampleGroup() {
		return "restructuredtext";
	}
	afterProjectLoaded() {
		queueMicrotask(() => {
			this.syncToolbarExtensionChecks();
		});
	}
};
customElements.get("tp-restructuredtext-playground") || customElements.define("tp-restructuredtext-playground", u);
//#endregion
export { u as TpRestructuredTextPlayground, l as TpRestructuredTextProject };

