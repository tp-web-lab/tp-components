import { Jt as e } from "../../chunks/lib/typescript/typescript.js";
import { buildAsciidocExecutionDocument as t } from "./asciidoc-execution-document.js";
import { TpAsciidocProject as n } from "./asciidoc-project.js";
//#region src/components/asciidoc-playground/asciidoc-playground.ts
var r = [{
	id: "asciidoctor-glossary",
	label: "asciidoctor-glossary",
	url: "/tp-components/extensions/asciidoc/asciidoctor-glossary/glossary.js",
	enabled: !0
}], i = class extends e {
	get exampleCategory() {
		return "playgrounds";
	}
	get exampleGroup() {
		return "asciidoc";
	}
	createEmptyProject() {
		return new n({
			name: "AsciiDoc project",
			entry: "/index.adoc",
			files: [{
				path: "/index.adoc",
				language: "asciidoc",
				content: "= Hello AsciiDoc\n\nThis document is rendered with Asciidoctor.js.\n\ninclude::partials/details.adoc[]"
			}, {
				path: "/partials/details.adoc",
				language: "asciidoc",
				content: "== Included section\n\nThis section comes from another project file."
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
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path.endsWith(".adoc"))?.path ?? t.files.find((e) => e.path.endsWith(".asciidoc"))?.path ?? t.files[0]?.path), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path === "/index.adoc")?.path ?? e.files.find((e) => e.path === "/main.adoc")?.path ?? e.files.find((e) => e.path.endsWith(".adoc"))?.path ?? e.files.find((e) => e.path.endsWith(".asciidoc"))?.path ?? null;
	}
	getPlaygroundKind() {
		return "asciidoc";
	}
	getLanguageIconName() {
		return "file_type_asciidoc";
	}
	getLanguageHelp() {
		return "\n      <h2>AsciiDoc</h2>\n      <p>AsciiDoc est rendu dans le navigateur avec Asciidoctor.js.</p>\n      <ul>\n        <li><a href=\"https://docs.asciidoctor.org/asciidoc/latest/\" target=\"_blank\" rel=\"noreferrer\">AsciiDoc syntax</a></li>\n        <li><a href=\"https://docs.asciidoctor.org/asciidoctor.js/latest/\" target=\"_blank\" rel=\"noreferrer\">Asciidoctor.js</a></li>\n        <li><a href=\"https://docs.asciidoctor.org/asciidoctor/latest/extensions/\" target=\"_blank\" rel=\"noreferrer\">Extensions</a></li>\n      </ul>\n    ";
	}
	getAdditionalToolbarMenuItems() {
		return `
      <li>
        Extensions
        <ul>
          ${r.map((e) => `
              <li data-tp-playground-action="asciidoc-extension-${e.id}">
                ${e.label}
              </li>
            `).join("")}
          <li data-tp-playground-action="asciidoc-extension-none">None</li>
        </ul>
      </li>
    `;
	}
	handleAdditionalToolbarAction(e) {
		if (e === "asciidoc-extension-none") return this.applyExtensions(void 0), !0;
		if (!e.startsWith("asciidoc-extension-")) return !1;
		let t = e.slice(19), n = r.find((e) => e.id === t);
		return n === void 0 ? !1 : (this.applyExtensions([{
			...n,
			enabled: !0
		}]), !0);
	}
	createProjectFromExample(e, t) {
		let r = e;
		return new n({
			name: e.name ?? e.label ?? e.id ?? "AsciiDoc project",
			entry: e.entry ?? "/index.adoc",
			test: e.test,
			attributes: typeof r.attributes == "object" && r.attributes !== null ? r.attributes : void 0,
			extensions: Array.isArray(r.extensions) ? r.extensions.filter((e) => typeof e == "object" && !!e && typeof e.id == "string" && typeof e.label == "string" && typeof e.url == "string") : void 0,
			files: t
		});
	}
	async buildExecutionDocument(e) {
		return t(e, { entry: this.resolveEntry(e) ?? void 0 });
	}
	applyExtensions(e) {
		this.syncProjectFromFilesystem();
		let t = this.getProject();
		this.setProject(new n({
			name: t.name,
			entry: t.entry,
			test: t.test,
			files: t.files,
			attributes: t.attributes,
			extensions: e
		})), this.run();
	}
};
customElements.get("tp-asciidoc-playground") || customElements.define("tp-asciidoc-playground", i);
//#endregion
export { i as TpAsciidocPlayground, n as TpAsciidocProject };

