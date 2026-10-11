import { dedent as e } from "../../utilities/code.js";
import "../../chunks/object-tree.js";
import { parseMarkdownToTokens as t, renderMarkdownToHtml as n } from "../../utilities/markdown-source.js";
import "../markdown/markdown.js";
import { formatHtmlForDisplay as r } from "../../utilities/html-code.js";
import { t as i } from "../../chunks/markup-viewer.js";
import { n as a } from "../../chunks/html-viewer.js";
//#region src/components/markdown-viewer/markdown-viewer.ts
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
		let e = (t[r] ?? "").match(/^(`{3,}|~{3,})\s*(\S+)?\s*(.*)$/);
		if (e === null) {
			r += 1;
			continue;
		}
		let i = e[1] ?? "```", a = (e[2] ?? "").trim().toLowerCase(), o = (e[3] ?? "").match(/(?:^|[\s{])label\s*=\s*("[^"]*"|'[^']*'|[^\s}]+)/)?.[1]?.replace(/^["']|["']$/g, "") || `Example ${String(n.length + 1)}`;
		r += 1;
		let s = [];
		for (; r < t.length && (t[r] ?? "").trim() !== i;) s.push(t[r] ?? ""), r += 1;
		a === "example" && n.push({
			label: o,
			source: s.join("\n"),
			context: void 0
		}), r += 1;
	}
	return n;
}
var c = class extends i {
	sourceLanguage = "markdown";
	outputModes = o;
	viewerClassName = "tp-markdown-viewer";
	readInlineSource() {
		let t = this.querySelector(":scope > script:is([type=\"tp/markdown\"], [type=\"tp/markdown-viewer\"])");
		if (t instanceof HTMLScriptElement && t.textContent !== null) return {
			label: "Example",
			source: e(t.textContent),
			context: void 0
		};
		let n = this.querySelector(":scope > template");
		return {
			label: "Example",
			source: e(n instanceof HTMLTemplateElement ? n.innerHTML : this.textContent ?? ""),
			context: void 0
		};
	}
	extractExamples(e) {
		let t = s(e.source);
		return t.length > 0 ? t : [e];
	}
	createExternalContext(e) {}
	async renderOutput(e, i, o) {
		if (i === "render") {
			o.classList.add("tp-markdown-output");
			let t = document.createElement("iframe");
			t.title = "Markdown preview", t.srcdoc = a(/^---[\s\S]*?^extensions:\s*[\s\S]*?^---/m.test(e) ? `<tp-markdown><script type="tp/markdown">${e.replace(/<\/script/gi, "<\\/script")}<\/script></tp-markdown>` : await n(e), document.baseURI), o.replaceChildren(t);
			return;
		}
		if (i === "ast") {
			let n = document.createElement("tp-object-tree");
			n.setValue(await t(e)), o.replaceChildren(n);
			return;
		}
		let s = document.createElement("tp-code-editor");
		s.language = "html", s.lineNumbers = !1, s.wordWrap = !0, s.readonly = !0, s.setValue(r(await n(e))), o.replaceChildren(s), this.resyncEditorHeight(s);
	}
};
customElements.get("tp-markdown-viewer") || customElements.define("tp-markdown-viewer", c);
//#endregion
export { c as TpMarkdownViewer };

//# sourceMappingURL=markdown-viewer.js.map