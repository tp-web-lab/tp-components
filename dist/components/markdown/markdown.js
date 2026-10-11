import { dedent as e } from "../../utilities/code.js";
import { t } from "../../chunks/base.js";
import { resolveComponentSourceUrl as n } from "../../utilities/source-url.js";
import { labelMathSvg as r } from "../../utilities/math-accessibility.js";
import { t as i } from "../../chunks/markdown.js";
import { resolveMarkdownIncludes as a } from "../../utilities/markdown-includes.js";
import { i as o } from "../../chunks/markdown2.js";
import { createTpMarkdownParser as s, parseMarkdownToTokens as c, renderMarkdownToHtml as l, renderProtectedMarkdown as u } from "../../utilities/markdown-source.js";
//#region src/components/markdown/markdown.ts
var d = "tp-markdown-styles", f = Promise.resolve();
function p(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
async function m(e, t, n = "/index.md") {
	let r = s(n), i = await h(r, e);
	t.replaceChildren(i), await v(r, t);
}
async function h(e, t) {
	let n = document.createElement("template");
	return n.innerHTML = await u(e, t), n.content.querySelector("[data-mathjax-tex], [data-mathjax-asciimath]") && (await e.renderRuntime(n.content, { only: ["math"] }), r(n.content)), n.content;
}
async function g(e, t = "/index.md") {
	await v(s(t), e);
}
var _ = class extends t {
	static get observedAttributes() {
		return ["src"];
	}
	outputElement = document.createElement("div");
	renderToken = 0;
	inlineSourceSnapshot = "";
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-markdown"), this.outputElement.className = "tp-markdown-output", this.inlineSourceSnapshot = this.readInlineSource(), this.ensureGlobalStyle(d, i), this.replaceChildren(this.outputElement), this.renderMarkdown();
	}
	attributeChangedCallback() {
		this.isConnected && this.renderMarkdown();
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		if (e.trim() === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	async renderMarkdown() {
		let e = ++this.renderToken;
		this.removeAttribute("data-tp-markdown-rendered");
		try {
			let { source: t, currentUrl: n } = await this.getMarkdownSource(), r = await this.resolveIncludes(t, n);
			if (e !== this.renderToken) return;
			this.setAttribute("data-tp-markdown-source", n.pathname);
			let i = s(this.src.trim() || "/index.md"), a = await h(i, r);
			if (e !== this.renderToken) return;
			this.outputElement.replaceChildren(a), this.renderMarkdownRuntime(i).then(() => {
				e === this.renderToken && (this.setAttribute("data-tp-markdown-rendered", ""), this.dispatchEvent(new CustomEvent("tp-markdown-rendered", { bubbles: !0 })));
			}).catch((e) => {
				console.error("Unable to run markdown runtime extensions", e);
			});
		} catch (t) {
			if (e !== this.renderToken) return;
			let n = t instanceof Error ? t.message : String(t);
			this.outputElement.innerHTML = `<pre class="tp-markdown-error" role="alert"><code>${p(n)}</code></pre>`, this.setAttribute("data-tp-markdown-rendered", ""), this.dispatchEvent(new CustomEvent("tp-markdown-rendered", { bubbles: !0 }));
		}
	}
	async getMarkdownSource() {
		let e = this.src.trim();
		if (e !== "") {
			let t = this.resolveSourceUrl(e), n = await fetch(t.href, { cache: "no-store" });
			if (!n.ok) throw Error(`Unable to load Markdown file: ${t.pathname} (${String(n.status)})`);
			return {
				source: await n.text(),
				currentUrl: t
			};
		}
		return {
			source: this.inlineSourceSnapshot,
			currentUrl: new URL(window.location.href, document.baseURI)
		};
	}
	resolveSourceUrl(e) {
		return n(this, e);
	}
	readInlineSource() {
		let t = this.querySelector(":scope > script[type=\"tp/markdown\"]");
		if (t instanceof HTMLScriptElement && t.textContent !== null) return e(t.textContent);
		let n = this.querySelector(":scope > pre > code");
		return n instanceof HTMLElement && n.textContent !== null ? e(n.textContent) : this.innerHTML.trim();
	}
	async renderMarkdownRuntime(e) {
		await v(e, this.outputElement);
	}
	resolveIncludes(e, t, n = 0) {
		return a(e, t, n);
	}
};
customElements.get("tp-markdown") || customElements.define("tp-markdown", _);
async function v(e, t, n) {
	await y(async () => {
		await e.renderRuntime(t, n), t instanceof HTMLElement && t.isConnected && !n?.only && o(t);
	});
}
async function y(e) {
	let t = f.then(e);
	f = t.catch(() => {}), await t;
}
//#endregion
export { _ as TpMarkdown, s as createTpMarkdownParser, c as parseMarkdownToTokens, m as renderMarkdownInto, g as renderMarkdownRuntimeIn, l as renderMarkdownToHtml };

//# sourceMappingURL=markdown.js.map