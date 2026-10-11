import { i as e, r as t, s as n } from "../../chunks/asciidoc.js";
import "../../chunks/object-tree.js";
import { formatHtmlForDisplay as r } from "../../utilities/html-code.js";
import { t as i } from "../../chunks/markup-viewer.js";
import { n as a } from "../../chunks/html-viewer.js";
//#region src/components/asciidoc-viewer/asciidoc-viewer.ts
var o = [
	{
		value: "render",
		label: "Rendered HTML"
	},
	{
		value: "html",
		label: "HTML code"
	},
	{
		value: "ast",
		label: "AST JSON"
	}
];
function s(e) {
	let t = e.split("\n"), n = [], r = 0;
	for (; r < t.length;) {
		let e = (t[r] ?? "").match(/^\.([^.]\S.*)$/)?.[1]?.trim(), i = t[r + 1]?.trim() ?? "";
		if (e === void 0 || !/^={4,}$/.test(i)) {
			r += 1;
			continue;
		}
		r += 2;
		let a = [];
		for (; r < t.length && (t[r] ?? "").trim() !== i;) a.push(t[r] ?? ""), r += 1;
		r < t.length && (n.push({
			label: e,
			source: a.join("\n"),
			context: void 0
		}), r += 1);
	}
	return n;
}
var c = class extends i {
	sourceLanguage = "asciidoc";
	outputModes = o;
	viewerClassName = "tp-asciidoc-viewer";
	readInlineSource() {
		let e = this.querySelector(":scope > script:is([type=\"tp/asciidoc\"], [type=\"tp/asciidoc-viewer\"])");
		if (e instanceof HTMLScriptElement && e.textContent !== null) return {
			label: "Example",
			source: t(e.textContent),
			context: void 0
		};
		let n = this.querySelector(":scope > template");
		return {
			label: "Example",
			source: t(n instanceof HTMLTemplateElement ? n.innerHTML : this.textContent ?? ""),
			context: void 0
		};
	}
	extractExamples(e) {
		let t = s(e.source);
		return t.length > 0 ? t : [e];
	}
	createExternalContext(e) {}
	async renderOutput(t, i, o) {
		if (i === "render") {
			o.classList.add("tp-asciidoc-output");
			let e = document.createElement("iframe");
			e.title = "AsciiDoc preview", e.srcdoc = a(/(?:stem:|latexmath:|\[stem(?:,|\]))/i.test(t) ? `<tp-asciidoc><script type="tp/asciidoc">${t.replace(/<\/script/gi, "<\\/script")}<\/script></tp-asciidoc>` : await n(t), document.baseURI), o.replaceChildren(e);
			return;
		}
		if (i === "ast") {
			let n = document.createElement("tp-object-tree");
			n.setValue(await e(t)), o.replaceChildren(n);
			return;
		}
		let s = document.createElement("tp-code-editor");
		s.language = "html", s.lineNumbers = !1, s.wordWrap = !0, s.readonly = !0, s.setValue(r(await n(t))), o.replaceChildren(s), this.resyncEditorHeight(s);
	}
};
customElements.get("tp-asciidoc-viewer") || customElements.define("tp-asciidoc-viewer", c);
//#endregion
export { c as TpAsciidocViewer };

//# sourceMappingURL=asciidoc-viewer.js.map