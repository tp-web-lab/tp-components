import { t as e } from "../../chunks/playground.js";
import { a as t, n, s as r, t as i } from "../../chunks/playground-build-utils.js";
import { buildBrowserTestDocument as a } from "../playground/browser-test-document.js";
import { TpJavascriptProject as o } from "./javascript-project.js";
//#region src/components/javascript-playground/javascript-playground.ts
function s(e) {
	return e === void 0 ? "" : `
<script type="importmap">
${JSON.stringify(e, null, 2)}
<\/script>
`;
}
function c(e) {
	let t = e.findFile("/index.html") ?? e.findFile("/index.htm");
	return t === void 0 ? "<main id=\"app\"></main>" : t.content;
}
var l = class extends e {
	get supportsTestExecution() {
		return !0;
	}
	applyImportmap(e) {
		this.syncProjectFromFilesystem();
		let t = this.getProject();
		this.setProject(new o({
			name: t.name,
			entry: t.entry,
			test: t.test,
			files: t.files,
			importmap: e
		})), this.run();
	}
	createEmptyProject() {
		return new o({
			name: "JavaScript project",
			entry: "/main.js",
			files: [{
				path: "/index.html",
				language: "html",
				content: "<main id=\"app\"></main>"
			}, {
				path: "/main.js",
				language: "javascript",
				content: "const app = document.querySelector('#app');\n\nif (app instanceof HTMLElement) {\n  app.innerHTML = '<h1>Hello JavaScript playground</h1>';\n}\n\nconsole.log('Hello from JavaScript');"
			}]
		});
	}
	createNewProject() {
		return this.createEmptyProject();
	}
	createClearProject() {
		return new o({
			name: "Untitled project",
			files: []
		});
	}
	normalizeProject(e) {
		let t = e.clone();
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path.endsWith(".js"))?.path ?? t.files[0]?.path), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path.endsWith(".js"))?.path ?? null;
	}
	getPlaygroundKind() {
		return "javascript";
	}
	getLanguageIconName() {
		return "file_type_javascript";
	}
	getLanguageHelp() {
		return "\n      <h2>JavaScript</h2>\n      <p>JavaScript adds behavior to web pages.</p>\n      <ul>\n        <li><a href=\"https://developer.mozilla.org/docs/Web/JavaScript\" target=\"_blank\" rel=\"noreferrer\">MDN JavaScript</a></li>\n        <li><a href=\"https://tc39.es/ecma262/\" target=\"_blank\" rel=\"noreferrer\">ECMAScript specification</a></li>\n      </ul>\n    ";
	}
	createProjectFromExample(e, t) {
		return new o({
			name: e.name ?? e.label ?? e.id ?? "JavaScript project",
			entry: e.entry ?? "/main.js",
			test: e.test,
			importmap: e.importmap,
			files: t
		});
	}
	async buildExecutionDocument(e) {
		let a = this.resolveEntry(e);
		if (a === null) throw Error("No JavaScript entry file found.");
		let o = r(e.files), l = await t(e.files, o, e.importmap), u = l.get(a);
		if (u === void 0) throw Error(`JavaScript module not built: ${a}`);
		let d = this.getAttribute("execution-scope") ?? "";
		return {
			html: `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  ${s(e.importmap)}
</head>
<body>
  ${c(e)}
  ${i()}
  ${n()}
  <script type="module">
    const entryUrl = ${JSON.stringify(u)};
    const executionScope = ${JSON.stringify(d)};
    if (executionScope === '') {
      await import(entryUrl);
    } else {
      const owner = window.parent !== window ? window.parent : window;
      owner.__tpJavascriptNotebookRealms ??= new Map();
      let realm = owner.__tpJavascriptNotebookRealms.get(executionScope);
      if (!realm) {
        realm = owner.document.createElement('iframe');
        realm.hidden = true;
        owner.document.body.append(realm);
        owner.__tpJavascriptNotebookRealms.set(executionScope, realm);
      }
      realm.contentWindow.console = console;
      const source = (await (await fetch(entryUrl)).text())
        .replace(/(^|\\n)(\\s*)(?:let|const)(\\s+)/g, '$1$2var$3')
        .replace(/^\\s*export\\s*\\{\\s*\\};?\\s*$/gm, '');
      if (/^\\s*(?:import|export)\\b/m.test(source)) await import(entryUrl);
      else realm.contentWindow.eval(source);
    }
  <\/script>
</body>
</html>
`,
			cleanup: () => {
				for (let e of o.values()) URL.revokeObjectURL(e);
				for (let e of l.values()) URL.revokeObjectURL(e);
			}
		};
	}
	async buildTestDocument(e) {
		return a(e, {
			kind: "javascript",
			defaultTest: "/main.test.js",
			importmap: e.importmap
		});
	}
	getAdditionalToolbarMenuItems() {
		return "\n      <li>\n        Import map\n        <ul>\n          <li data-tp-playground-action=\"javascript-importmap-lit\">Lit</li>\n          <li data-tp-playground-action=\"javascript-importmap-shoelace\">Shoelace</li>\n          <li data-tp-playground-action=\"javascript-importmap-none\">None</li>\n        </ul>\n      </li>\n    ";
	}
	handleAdditionalToolbarAction(e) {
		switch (e) {
			case "javascript-importmap-lit": return this.applyImportmap({ imports: { lit: "https://cdn.jsdelivr.net/npm/lit@3/+esm" } }), !0;
			case "javascript-importmap-shoelace": return this.applyImportmap({ imports: { "@shoelace-style/shoelace": "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2/+esm" } }), !0;
			case "javascript-importmap-none": return this.applyImportmap(void 0), !0;
			default: return !1;
		}
	}
};
customElements.get("tp-javascript-playground") || customElements.define("tp-javascript-playground", l);
//#endregion
export { l as TpJavascriptPlayground, o as TpJavascriptProject };

//# sourceMappingURL=javascript-playground.js.map