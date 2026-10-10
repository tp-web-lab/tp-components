import { Jt as e } from "../../chunks/lib/typescript/typescript.js";
import { getMarkupExtensionIdFromAction as t, isMarkupExtensionAction as n, renderMarkupExtensionMenu as r, syncMarkupExtensionMenuChecks as i } from "../markup-playground/markup-extension-menu.js";
import { createMarkupExtensionMenuItems as a, toMarkupRuntimeExtensions as o, toggleMarkupExtensionId as s } from "../markup-playground/markup-extension-registry.js";
import { buildMarkdownExecutionDocument as c } from "./markdown-execution-document.js";
import { TpMarkdownProject as l } from "./markdown-project.js";
//#region src/components/markdown-playground/markdown-playground.ts
var u = class extends e {
	createEmptyProject() {
		return new l({
			name: "Markdown project",
			entry: "/index.md",
			files: [{
				path: "/index.md",
				language: "markdown",
				content: "---\nsectionNumbering:\n  enabled: true\n  maxLevel: 3\n---\n# Hello Markdown\n\nMarkdown is rendered with **@tp/tp-markdown**.\n\n## Included default extensions\n\n==Marked text==\n\nH~2~O\n\nx^2^\n\nHTML\n: HyperText Markup Language\n\nCSS\n: Cascading Style Sheets\n\nA footnote example.[^1]\n\n[^1]: Footnote text."
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
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path.endsWith(".md"))?.path ?? t.files.find((e) => e.path.endsWith(".markdown"))?.path ?? t.files[0]?.path), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path === "/index.md")?.path ?? e.files.find((e) => e.path === "/main.md")?.path ?? e.files.find((e) => e.path.endsWith(".md"))?.path ?? e.files.find((e) => e.path.endsWith(".markdown"))?.path ?? null;
	}
	getPlaygroundKind() {
		return "markdown";
	}
	getLanguageIconName() {
		return "file_type_markdown";
	}
	getLanguageHelp() {
		return "\n      <h2>Markdown</h2>\n      <p>Markdown est rendu avec @tp/tp-markdown.</p>\n      <ul>\n        <li><a href=\"https://github.com/tp-web-lab/tp-markdown\" target=\"_blank\" rel=\"noreferrer\">@tp/tp-markdown</a></li>\n        <li><a href=\"https://spec.commonmark.org/\" target=\"_blank\" rel=\"noreferrer\">CommonMark</a></li>\n      </ul>\n    ";
	}
	getAdditionalToolbarMenuItems() {
		return r(a("markdown", this.getActiveMarkupExtensionIds()));
	}
	handleAdditionalToolbarAction(e) {
		if (!n(e)) return !1;
		let r = t(e);
		if (r === null) return !1;
		let i = s(this.getActiveMarkupExtensionIds(), r);
		return this.applyMarkupExtensions(i), !0;
	}
	createProjectFromExample(e, t) {
		let n = e;
		return new l({
			name: e.name ?? e.label ?? e.id ?? "Markdown project",
			entry: e.entry ?? "/index.md",
			test: e.test,
			extensions: Array.isArray(n.extensions) ? n.extensions.filter((e) => typeof e == "object" && !!e && typeof e.id == "string" && typeof e.label == "string" && typeof e.url == "string") : void 0,
			files: t
		});
	}
	async buildExecutionDocument(e) {
		return c(e, { entry: this.resolveEntry(e) ?? void 0 });
	}
	get exampleCategory() {
		return "playgrounds";
	}
	get exampleGroup() {
		return "markdown";
	}
	afterProjectLoaded() {
		queueMicrotask(() => {
			this.syncToolbarExtensionChecks();
		});
	}
	getActiveMarkupExtensionIds() {
		let e = [];
		for (let t of this.getProject().extensions ?? []) e.push(t.id);
		return new Set(e);
	}
	applyMarkupExtensions(e) {
		this.toolbarStartMenuEl?.closeAll?.(), this.syncProjectFromFilesystem();
		let t = this.getProject();
		this.setProject(new l({
			name: t.name,
			entry: t.entry,
			test: t.test,
			files: t.files,
			extensions: o("markdown", e)
		})), queueMicrotask(() => {
			this.syncToolbarExtensionChecks(), this.run();
		});
	}
	syncToolbarExtensionChecks() {
		i(this, this.getActiveMarkupExtensionIds());
	}
};
customElements.get("tp-markdown-playground") || customElements.define("tp-markdown-playground", u);
//#endregion
export { u as TpMarkdownPlayground, l as TpMarkdownProject };

//# sourceMappingURL=markdown-playground.js.map