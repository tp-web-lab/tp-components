import { Ku as e, Pr as t, Yu as n } from "./lib/typescript/typescript.js";
import { TpPostItEditor as r } from "../components/post-it-editor/post-it-editor.js";
//#region src/components/markup-single-page/markup-single-page.css?inline
var i = ".tp-markup-single-page{display:block}.tp-markup-single-page-output{min-inline-size:0}.tp-markup-single-page-error{color:#8a1c2c;background:#fff3f5;border:1px solid #f1b7bf;border-radius:.5rem;margin:0;padding:.9rem;overflow:auto}", a = "tp-markup-single-page-styles", o = /* @__PURE__ */ new Map([
	["tp/html", "html"],
	["tp/htm", "html"],
	["tp/markdown", "markdown"],
	["tp/md", "markdown"],
	["tp/asciidoc", "asciidoc"],
	["tp/adoc", "asciidoc"],
	["tp/restructuredtext", "restructuredtext"],
	["tp/rst", "restructuredtext"]
]), s = {
	html: "tp/html",
	markdown: "tp/markdown",
	asciidoc: "tp/asciidoc",
	restructuredtext: "tp/restructuredtext"
};
function c(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function l(e) {
	let t = e.split(/[?#]/, 1)[0]?.toLowerCase() ?? "";
	return t.endsWith(".html") || t.endsWith(".htm") ? "html" : t.endsWith(".md") || t.endsWith(".markdown") ? "markdown" : t.endsWith(".adoc") || t.endsWith(".asciidoc") ? "asciidoc" : t.endsWith(".rst") || t.endsWith(".rest") ? "restructuredtext" : null;
}
function u(e) {
	return e === "markdown" ? "tp-markdown" : e === "asciidoc" ? "tp-asciidoc" : e === "restructuredtext" ? "tp-restructuredtext" : null;
}
function d(e) {
	return e === "markdown" ? "tp-markdown-rendered" : e === "asciidoc" ? "tp-asciidoc-rendered" : e === "restructuredtext" ? "tp-restructuredtext-rendered" : "tp-markup-single-page-rendered";
}
var f = class extends e {
	static get observedAttributes() {
		return ["src"];
	}
	outputElement = document.createElement("div");
	renderToken = 0;
	inlineSourceSnapshot = null;
	annotations = null;
	get fixedLanguage() {
		return null;
	}
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-markup-single-page"), this.outputElement.className = "tp-markup-single-page-output", this.inlineSourceSnapshot ??= this.readInlineSource(), this.ensureGlobalStyle(a, i), this.replaceChildren(this.outputElement), this.annotations?.dispose(), this.annotations = new r(), this.annotations.setAttribute("section", "start"), this.annotations.setTarget(this.outputElement);
		let e = document.createElement("tp-toolbar");
		e.append(this.annotations), this.prepend(e), this.renderSinglePage();
	}
	disconnectedCallback() {
		this.annotations?.dispose(), this.annotations = null, this.renderToken++;
	}
	attributeChangedCallback() {
		this.isConnected && this.renderSinglePage();
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		e.trim() === "" ? this.removeAttribute("src") : this.setAttribute("src", e);
	}
	async renderSinglePage() {
		let e = ++this.renderToken;
		this.annotations?.setPage(""), this.removeAttribute("data-tp-markup-single-page-rendered"), this.outputElement.replaceChildren();
		try {
			let t = this.src.trim();
			t === "" ? await this.renderInlineSource(e) : await this.renderExternalSource(t, e);
		} catch (t) {
			if (e !== this.renderToken) return;
			let n = t instanceof Error ? t.message : String(t);
			this.outputElement.innerHTML = `<pre class="tp-markup-single-page-error" role="alert"><code>${c(n)}</code></pre>`, this.finishRender("html", "");
		}
	}
	async renderExternalSource(e, n) {
		let r = this.fixedLanguage ?? l(e);
		if (r === null) throw Error(`Unsupported single-page source extension: ${e}`);
		if (this.setAttribute("data-tp-markup-single-page-language", r), this.setAttribute("data-tp-markup-single-page-source", t(this, e).pathname), r === "html") {
			let i = t(this, e), a = await fetch(i.href, { cache: "no-store" });
			if (!a.ok) throw Error(`Unable to load HTML file: ${i.pathname} (${String(a.status)})`);
			if (n !== this.renderToken) return;
			this.outputElement.innerHTML = await a.text(), this.finishRender(r, e);
			return;
		}
		await this.renderMarkupElement(r, n, e);
	}
	async renderInlineSource(e) {
		let t = this.inlineSourceSnapshot;
		if (t === null) throw Error("Missing single-page source. Provide a supported `src` file or a direct `<script type=\"tp/...\">` child.");
		if (this.setAttribute("data-tp-markup-single-page-language", t.language), this.removeAttribute("data-tp-markup-single-page-source"), t.language === "html") {
			this.outputElement.innerHTML = n(t.source), this.finishRender(t.language, "");
			return;
		}
		await this.renderMarkupElement(t.language, e, "", t.source);
	}
	renderMarkupElement(e, t, n = "", r = "") {
		let i = u(e);
		if (i === null) throw Error(`Unsupported single-page language: ${e}`);
		return new Promise((a) => {
			let o = document.createElement(i), c = d(e);
			if (o.addEventListener(c, () => {
				t === this.renderToken && this.finishRender(e, n), a();
			}, { once: !0 }), n.trim() !== "") o.setAttribute("src", n);
			else {
				let t = document.createElement("script");
				t.type = s[e], t.textContent = r, o.append(t);
			}
			this.outputElement.replaceChildren(o);
		});
	}
	finishRender(e, n) {
		this.setAttribute("data-tp-markup-single-page-rendered", "");
		let r = n ? t(this, n).href : `${this.ownerDocument.location.href.split("#")[0]}#${this.id || `${this.localName}-${Array.from(this.ownerDocument.querySelectorAll(this.localName)).indexOf(this)}`}`;
		this.annotations?.setPage(r);
		let i = {
			language: e,
			src: n
		};
		this.dispatchEvent(new CustomEvent("tp-markup-single-page-rendered", {
			bubbles: !0,
			detail: i
		})), this.localName !== "tp-markup-single-page" && this.dispatchEvent(new CustomEvent(`${this.localName}-rendered`, {
			bubbles: !0,
			detail: i
		}));
	}
	readInlineSource() {
		let e = Array.from(this.querySelectorAll(":scope > script[type^=\"tp/\"]"));
		for (let t of e) {
			if (!(t instanceof HTMLScriptElement)) continue;
			let e = o.get(t.type.trim().toLowerCase());
			if (!(e === void 0 || t.textContent === null) && !(this.fixedLanguage !== null && e !== this.fixedLanguage)) return {
				language: e,
				source: t.textContent
			};
		}
		return null;
	}
};
customElements.get("tp-markup-single-page") || customElements.define("tp-markup-single-page", f);
//#endregion
export { f as t };

