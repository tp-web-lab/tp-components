import { At as e, Jt as t, ft as n, gt as r, kt as i, pt as a, vt as o, z as s } from "../../chunks/lib/typescript/typescript.js";
import { TpHtmlProject as c } from "./html-project.js";
//#region src/components/html-playground/html-playground.ts
function l(e) {
	return e === void 0 ? "" : `<script type="importmap">${JSON.stringify(e, null, 2)}<\/script>`;
}
function u(e, t) {
	if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("#") || t.startsWith("/")) return t;
	let n = e.split("/").filter(Boolean);
	n.pop();
	let r = [...n];
	for (let e of t.split("/")) if (!(e === "" || e === ".")) {
		if (e === "..") {
			r.pop();
			continue;
		}
		r.push(e);
	}
	return `/${r.join("/")}`;
}
function d(e, t, n) {
	return e.replace(/\b(src|href)=["']([^"']+)["']/g, (e, r, i) => {
		let a = u(t, i), o = n.get(a);
		return o === void 0 ? e : `${r}="${o}"`;
	});
}
var f = class extends t {
	get supportsTestExecution() {
		return !0;
	}
	getPlaygroundKind() {
		return "html";
	}
	createProjectFromExample(e, t) {
		return new c({
			name: e.name ?? e.label ?? e.id ?? "HTML project",
			entry: e.entry ?? "/index.html",
			test: e.test,
			importmap: e.importmap,
			files: t
		});
	}
	createNewProject() {
		return new c({
			name: "HTML project",
			entry: "/index.html",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: "\n<link rel=\"stylesheet\" href=\"/styles.css\">\n<script type=\"module\" src=\"/main.js\"><\/script>\n\n<h1>Hello HTML playground</h1>\n"
				},
				{
					path: "/style.css",
					language: "css",
					content: "body { font-family: system-ui, sans-serif; }"
				},
				{
					path: "/main.js",
					language: "javascript",
					content: "console.log(\"Hello\");"
				}
			]
		});
	}
	createClearProject() {
		return new c({
			name: "Untitled project",
			files: []
		});
	}
	getLanguageIconName() {
		return "file_type_html";
	}
	getLanguageHelp() {
		return "\n      <h2>HTML</h2>\n      <p>HTML structures the document.</p>\n      <ul>\n        <li><a href=\"https://developer.mozilla.org/docs/Web/HTML\" target=\"_blank\" rel=\"noreferrer\">MDN HTML</a></li>\n        <li><a href=\"https://html.spec.whatwg.org/\" target=\"_blank\" rel=\"noreferrer\">HTML Living Standard</a></li>\n      </ul>\n    ";
	}
	getAdditionalToolbarMenuItems() {
		return "\n      <li>\n        Import maps\n        <ul>\n          <li data-tp-playground-action=\"html-importmap-lit\">Lit</li>\n          <li data-tp-playground-action=\"html-importmap-none\">None</li>\n        </ul>\n      </li>\n    ";
	}
	createEmptyProject() {
		return new c({
			name: "HTML project",
			entry: "/index.html",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: "\n<link rel=\"stylesheet\" href=\"/styles.css\">\n<script type=\"module\" src=\"/main.js\"><\/script>\n\n<h1>Hello HTML playground</h1>\n"
				},
				{
					path: "/styles.css",
					language: "css",
					content: "body { font-family: system-ui, sans-serif; }"
				},
				{
					path: "/main.js",
					language: "javascript",
					content: "console.log(\"Hello from tp-html-playground\");"
				}
			]
		});
	}
	normalizeProject(e) {
		let t = e.clone();
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path.endsWith(".html"))?.path ?? t.files[0]?.path), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path.endsWith(".html"))?.path ?? e.files[0]?.path ?? null;
	}
	async buildExecutionDocument(t) {
		let s = this.resolveEntry(t);
		if (s === null) throw Error("No HTML entry file found.");
		let c = t.findFile(s);
		if (c === void 0) throw Error(`HTML entry file not found: ${s}`);
		let u = o(t.files), f = await r(t.files, u, t.importmap), p = () => {
			for (let e of u.values()) URL.revokeObjectURL(e);
			for (let e of f.values()) URL.revokeObjectURL(e);
		}, m = new Map([...u, ...f]), h = d(c.content, s, m);
		return t.importmap !== void 0 && (h = e(h, l(t.importmap))), h = i(h, `
${n()}
${a()}
`), {
			html: h,
			cleanup: p
		};
	}
	async buildTestDocument(e) {
		return s(e, {
			kind: "javascript",
			defaultTest: "/main.test.js",
			importmap: e.importmap
		});
	}
};
customElements.get("tp-html-playground") || customElements.define("tp-html-playground", f);
//#endregion
export { f as TpHtmlPlayground, c as TpHtmlProject };

//# sourceMappingURL=html-playground.js.map