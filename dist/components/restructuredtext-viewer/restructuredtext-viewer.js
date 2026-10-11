import { getComponentSourceBaseUrl as e } from "../../utilities/source-url.js";
import "../../chunks/object-tree.js";
import { i as t, o as n, r, s as i } from "../../chunks/restructuredtext.js";
import { formatHtmlForDisplay as a } from "../../utilities/html-code.js";
import { t as o } from "../../chunks/markup-viewer.js";
import { n as s } from "../../chunks/html-viewer.js";
//#region src/components/restructuredtext-viewer/restructuredtext-viewer.ts
var c = [
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
], l = class extends o {
	static get observedAttributes() {
		return [...o.observedAttributes, "doctest"];
	}
	sourceLanguage = "restructuredtext";
	outputModes = c;
	viewerClassName = "tp-restructuredtext-viewer";
	get doctest() {
		return this.hasAttribute("doctest");
	}
	set doctest(e) {
		this.toggleAttribute("doctest", e);
	}
	readInlineSource() {
		let t = this.querySelector(":scope > script:is([type=\"tp/restructuredtext\"], [type=\"tp/restructuredtext-viewer\"])");
		if (t instanceof HTMLScriptElement && t.textContent !== null) return {
			label: "Example",
			source: r(t.textContent),
			context: new URL(e(this))
		};
		let n = this.querySelector(":scope > template");
		return {
			label: "Example",
			source: r(n instanceof HTMLTemplateElement ? n.innerHTML : this.textContent ?? ""),
			context: new URL(e(this))
		};
	}
	extractExamples(e) {
		return /^\.\.\s+example::/m.test(e.source) ? i(e.source).map((t) => ({
			...t,
			context: e.context
		})) : [e];
	}
	createExternalContext(e) {
		return e;
	}
	async renderOutput(e, r, i, o) {
		if (i.setAttribute("data-tp-source", o.href), r === "render") {
			if (i.classList.add("tp-restructuredtext-output"), this.doctest) {
				let t = document.createElement("tp-restructuredtext");
				t.setAttribute("doctest", "");
				let n = document.createElement("script");
				n.type = "tp/restructuredtext", n.textContent = e, t.append(n);
				let r = new Promise((e) => {
					t.addEventListener("tp-restructuredtext-rendered", () => e(), { once: !0 });
				});
				i.replaceChildren(t), await r;
				let a = t.querySelector(":scope > .tp-restructuredtext-output");
				a !== null && i.replaceChildren(...a.childNodes);
				return;
			}
			let t = document.createElement("iframe");
			t.title = "reStructuredText preview", t.srcdoc = s(/:(?:math|latexmath|asciimath):|\.\.\s+(?:math|latexmath|asciimath)::|\.\.\s+role::[^\n]*\((?:math|latexmath|asciimath)\)/i.test(e) ? `<tp-restructuredtext><script type="tp/restructuredtext">${e.replace(/<\/script/gi, "<\\/script")}<\/script></tp-restructuredtext>` : await n(e), o.href), i.replaceChildren(t);
			return;
		}
		if (r === "ast") {
			let n = document.createElement("tp-object-tree");
			n.setValue(await t(e)), i.replaceChildren(n);
			return;
		}
		let c = document.createElement("tp-code-editor");
		c.language = "html", c.lineNumbers = !1, c.wordWrap = !0, c.readonly = !0, c.setValue(a(await n(e))), i.replaceChildren(c), this.resyncEditorHeight(c);
	}
};
customElements.get("tp-restructuredtext-viewer") || customElements.define("tp-restructuredtext-viewer", l);
//#endregion
export { l as TpRestructuredTextViewer };

//# sourceMappingURL=restructuredtext-viewer.js.map