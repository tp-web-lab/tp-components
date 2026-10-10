import { Fr as e, Xu as t, nr as n, qu as r } from "./lib/typescript/typescript.js";
import "./calculator.js";
import "./color.js";
import { TpPostItEditor as i } from "../components/post-it-editor/post-it-editor.js";
import "./clock.js";
import "./lang.js";
import "./source.js";
//#region src/components/markup-single-page/markup-single-page.css?inline
var a = ".tp-markup-single-page-toolbar .tp-markup-single-page-toolbar-label,.tp-markup-multi-pages-toolbar .tp-markup-multi-pages-toolbar-label{text-overflow:ellipsis;white-space:nowrap;min-inline-size:0;font-size:1.5rem;font-weight:600;display:block;overflow:hidden}@media (width<=48rem){.tp-markup-single-page-toolbar .tp-markup-single-page-toolbar-label,.tp-markup-multi-pages-toolbar .tp-markup-multi-pages-toolbar-label{font-size:1rem}}.tp-markup-single-page{display:block}.tp-markup-single-page-output{min-inline-size:0}.tp-markup-single-page-error{color:#8a1c2c;background:#fff3f5;border:1px solid #f1b7bf;border-radius:.5rem;margin:0;padding:.9rem;overflow:auto}.tp-markup-single-page-toolbar tp-lang[hidden]{display:none}.tp-markup-single-page:fullscreen{background:var(--tp-paper-color,#fff);overflow:auto}.tp-markup-single-page-toolbar>[data-toolbar-center]{min-inline-size:0}.tp-markup-single-page-toolbar tp-icon-button:is([data-action=code],[data-action=calc]){--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.15rem}.tp-markup-single-page-toolbar tp-icon-button:is([data-action=code],[data-action=calc])>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}.tp-markup-single-page-toolbar tp-icon-button:is([data-action=code],[data-action=calc])>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}", o = "tp-markup-single-page-styles", s = /* @__PURE__ */ new Map([
	["tp/html", "html"],
	["tp/htm", "html"],
	["tp/markdown", "markdown"],
	["tp/md", "markdown"],
	["tp/asciidoc", "asciidoc"],
	["tp/adoc", "asciidoc"],
	["tp/restructuredtext", "restructuredtext"],
	["tp/rst", "restructuredtext"]
]), c = {
	html: "tp/html",
	markdown: "tp/markdown",
	asciidoc: "tp/asciidoc",
	restructuredtext: "tp/restructuredtext"
};
function l(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function u(e) {
	let t = e.split(/[?#]/, 1)[0]?.toLowerCase() ?? "";
	return t.endsWith(".html") || t.endsWith(".htm") ? "html" : t.endsWith(".md") || t.endsWith(".markdown") ? "markdown" : t.endsWith(".adoc") || t.endsWith(".asciidoc") ? "asciidoc" : t.endsWith(".rst") || t.endsWith(".rest") ? "restructuredtext" : null;
}
function d(e) {
	return e === "markdown" ? "tp-markdown" : e === "asciidoc" ? "tp-asciidoc" : e === "restructuredtext" ? "tp-restructuredtext" : null;
}
function f(e) {
	return e === "markdown" ? "tp-markdown-rendered" : e === "asciidoc" ? "tp-asciidoc-rendered" : e === "restructuredtext" ? "tp-restructuredtext-rendered" : "tp-markup-single-page-rendered";
}
var p = class extends r {
	static get observedAttributes() {
		return [
			"src",
			"toolbar",
			"langs",
			"label",
			"git"
		];
	}
	outputElement = document.createElement("div");
	renderToken = 0;
	toolbarElement = null;
	calculatorDrawer = null;
	sourceDrawer = null;
	sourceToken = 0;
	pageUrl = "";
	languageToken = 0;
	languageSources = /* @__PURE__ */ new Map();
	currentDocumentLanguage = "";
	get langs() {
		return this.getAttribute("langs") ?? "en";
	}
	set langs(e) {
		this.setAttribute("langs", e);
	}
	get documentLanguage() {
		return this.currentDocumentLanguage;
	}
	setDocumentLanguage(e) {
		let t = this.languageSources.get(e);
		t && (this.src = t);
	}
	inlineSourceSnapshot = null;
	annotations = null;
	get fixedLanguage() {
		return null;
	}
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-markup-single-page"), this.outputElement.className = "tp-markup-single-page-output", this.inlineSourceSnapshot ??= this.readInlineSource(), this.ensureGlobalStyle(o, a), this.replaceChildren(this.outputElement), this.renderToolbar(), this.renderSinglePage();
	}
	disconnectedCallback() {
		this.disposeToolbar(), this.renderToken++;
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "toolbar" ? this.renderToolbar() : e === "git" ? this.updateGit() : e === "label" ? this.updateLabel() : (e === "langs" || this.renderSinglePage(), this.updateLanguages()));
	}
	get toolbar() {
		return this.getAttribute("toolbar");
	}
	set toolbar(e) {
		e === null ? this.removeAttribute("toolbar") : this.setAttribute("toolbar", e);
	}
	get git() {
		return this.getAttribute("git") ?? "";
	}
	set git(e) {
		this.setAttribute("git", e);
	}
	updateGit() {
		let e = this.toolbarElement;
		if (!e) return;
		let t = e.querySelector("tp-source[data-action='git']");
		if (!this.git.trim()) {
			t?.remove();
			return;
		}
		t ? t.url = this.git : (t = document.createElement("tp-source"), t.setAttribute("section", "start"), t.dataset.action = "git", t.url = this.git, (e.querySelector("[data-toolbar-start]") ?? e).prepend(t));
	}
	get label() {
		return this.getAttribute("label") ?? "";
	}
	set label(e) {
		this.setAttribute("label", e);
	}
	updateLabel() {
		let e = this.toolbarElement?.querySelector(".tp-markup-single-page-toolbar-label");
		e && (e.textContent = this.label);
	}
	disposeToolbar() {
		this.sourceToken++, this.languageToken++, this.annotations?.dispose(), this.annotations = null, this.toolbarElement?.remove(), this.toolbarElement = null;
		for (let e of [this.sourceDrawer, this.calculatorDrawer]) e?.hide(), e?.remove();
		this.sourceDrawer = null, this.calculatorDrawer = null;
	}
	renderToolbar() {
		this.disposeToolbar();
		let e = this.toolbar;
		if (e === null) return;
		let t = [
			"code",
			"calc",
			"postit",
			"clock",
			"lang",
			"color",
			"theme",
			"fullscreen"
		], n = new Set(e.trim() === "" ? t : e.split(",").map((e) => e.trim().toLowerCase())), r = document.createElement("tp-toolbar");
		r.className = "tp-markup-single-page-toolbar", r.setAttribute("orientation", "horizontal"), this.toolbarElement = r, this.updateGit();
		for (let e of t) {
			if (!n.has(e)) continue;
			let t;
			e === "code" || e === "calc" ? (t = document.createElement("tp-icon-button"), t.setAttribute("name", e === "calc" ? "calculator" : "code"), t.setAttribute("label", e === "calc" ? "Calculator" : "Code"), t.setAttribute("color", "currentColor"), e === "calc" && t.setAttribute("library", "components"), t.addEventListener("click", () => {
				e === "calc" ? this.toggleCalculator() : this.toggleSource();
			})) : e === "postit" ? (this.annotations = new i(), this.annotations.setTarget(this.outputElement), this.annotations.setPage(this.pageUrl), t = this.annotations) : t = document.createElement(`tp-${e}`), e === "lang" && (t.hidden = !0), t.dataset.action = e, t.setAttribute("section", [
				"code",
				"calc",
				"postit"
			].includes(e) ? "start" : "end"), r.append(t);
		}
		let a = document.createElement("span");
		a.className = "tp-markup-single-page-toolbar-label", a.setAttribute("section", "center"), a.textContent = this.label, r.append(a), this.prepend(r), this.updateLanguages();
	}
	async updateLanguages() {
		let t = ++this.languageToken, n = this.toolbarElement?.querySelector("tp-lang");
		if (this.languageSources.clear(), !n) return;
		n.hidden = !0;
		let r = [...new Set(this.langs.split(",").map((e) => e.trim().toLowerCase()).filter((e) => /^[a-z]{2,3}(?:-[a-z0-9]+)*$/.test(e)))], i = r[0];
		if (!i || r.length < 2 || !this.src.trim()) return;
		let a = e(this, this.src), o = new URL(".", a), s = o.pathname.split("/").filter(Boolean).at(-1) ?? "", c = s !== i && r.includes(s), l = c ? new URL("../", o) : o, d = a.pathname.split("/").at(-1) ?? "";
		this.currentDocumentLanguage = c ? s : i;
		let f = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = new URL(`${e === i ? "" : `${e}/`}${d}`, l);
			if (n.search = a.search, n.hash = a.hash, e === this.currentDocumentLanguage) f.set(e, a.href);
			else try {
				let r = await fetch(n.href, { method: "HEAD" });
				if (t !== this.languageToken) return;
				let i = u(a.pathname) !== "html" && r.headers.get("content-type")?.includes("text/html");
				r.ok && !r.redirected && !i && f.set(e, n.href);
			} catch {}
			if (t !== this.languageToken) return;
		}
		this.languageSources = f, n.langs = [...f.keys()].join(","), n.hidden = f.size < 2;
	}
	toggleCalculator() {
		if (!this.calculatorDrawer) {
			let e = new n();
			e.setAttribute("label", "Calculator"), e.setAttribute("placement", "end"), e.setAttribute("width", "min(52rem, 100vw)"), e.dataset.role = "calculator-drawer", e.setContent(document.createElement("tp-calculator")), this.append(e), this.calculatorDrawer = e;
		}
		this.calculatorDrawer.hasAttribute("open") ? this.calculatorDrawer.hide() : this.calculatorDrawer.show();
	}
	async toggleSource() {
		if (this.sourceDrawer?.hasAttribute("open")) {
			this.sourceToken++, this.sourceDrawer.hide();
			return;
		}
		this.sourceDrawer || (this.sourceDrawer = new n(), this.sourceDrawer.setAttribute("label", "Source code"), this.sourceDrawer.setAttribute("placement", "end"), this.sourceDrawer.setAttribute("width", "min(60rem, 100vw)"), this.sourceDrawer.dataset.role = "source-drawer", this.append(this.sourceDrawer));
		let r = this.sourceDrawer, i = ++this.sourceToken, a = document.createElement("pre"), o = document.createElement("code");
		a.append(o), o.textContent = "Loading…", r.setContent(a), r.show();
		try {
			let n = t(this.inlineSourceSnapshot?.source ?? ""), r = this.getAttribute("data-tp-original-src")?.trim() || this.src.trim();
			if (r) {
				let t = await fetch(e(this, r).href);
				if (!t.ok) throw Error(`Unable to load source (${t.status}).`);
				n = await t.text();
			}
			i === this.sourceToken && (o.textContent = n);
		} catch (e) {
			i === this.sourceToken && (a.setAttribute("role", "alert"), o.textContent = e instanceof Error ? e.message : String(e));
		}
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		e.trim() === "" ? this.removeAttribute("src") : this.setAttribute("src", e);
	}
	async renderSinglePage() {
		let e = ++this.renderToken;
		this.sourceToken++, this.sourceDrawer?.hide(), this.pageUrl = "", this.annotations?.setPage(""), this.removeAttribute("data-tp-markup-single-page-rendered"), this.outputElement.replaceChildren();
		try {
			let t = this.src.trim();
			t === "" ? await this.renderInlineSource(e) : await this.renderExternalSource(t, e);
		} catch (t) {
			if (e !== this.renderToken) return;
			let n = t instanceof Error ? t.message : String(t);
			this.outputElement.innerHTML = `<pre class="tp-markup-single-page-error" role="alert"><code>${l(n)}</code></pre>`, this.finishRender("html", "");
		}
	}
	async renderExternalSource(t, n) {
		let r = this.fixedLanguage ?? u(t);
		if (r === null) throw Error(`Unsupported single-page source extension: ${t}`);
		if (this.setAttribute("data-tp-markup-single-page-language", r), this.setAttribute("data-tp-markup-single-page-source", e(this, t).pathname), r === "html") {
			let i = e(this, t), a = await fetch(i.href, { cache: "no-store" });
			if (!a.ok) throw Error(`Unable to load HTML file: ${i.pathname} (${String(a.status)})`);
			if (n !== this.renderToken) return;
			let o = await a.text();
			if (n !== this.renderToken) return;
			this.outputElement.innerHTML = o, this.finishRender(r, t);
			return;
		}
		await this.renderMarkupElement(r, n, t);
	}
	async renderInlineSource(e) {
		let n = this.inlineSourceSnapshot;
		if (n === null) throw Error("Missing single-page source. Provide a supported `src` file or a direct `<script type=\"tp/...\">` child.");
		if (this.setAttribute("data-tp-markup-single-page-language", n.language), this.removeAttribute("data-tp-markup-single-page-source"), n.language === "html") {
			this.outputElement.innerHTML = t(n.source), this.finishRender(n.language, "");
			return;
		}
		await this.renderMarkupElement(n.language, e, "", n.source);
	}
	renderMarkupElement(e, t, n = "", r = "") {
		let i = d(e);
		if (i === null) throw Error(`Unsupported single-page language: ${e}`);
		return new Promise((a) => {
			let o = document.createElement(i), s = f(e);
			if (o.addEventListener(s, () => {
				t === this.renderToken && this.finishRender(e, n), a();
			}, { once: !0 }), n.trim() !== "") o.setAttribute("src", n);
			else {
				let t = document.createElement("script");
				t.type = c[e], t.textContent = r, o.append(t);
			}
			this.outputElement.replaceChildren(o);
		});
	}
	finishRender(t, n) {
		this.setAttribute("data-tp-markup-single-page-rendered", "");
		let r = this.getAttribute("data-tp-original-src")?.trim() || n, i = r ? e(this, r).href : `${this.ownerDocument.location.href.split("#")[0]}#${this.id || `${this.localName}-${Array.from(this.ownerDocument.querySelectorAll(this.localName)).indexOf(this)}`}`;
		this.pageUrl = i, this.annotations?.setPage(i);
		let a = {
			language: t,
			src: n
		};
		this.dispatchEvent(new CustomEvent("tp-markup-single-page-rendered", {
			bubbles: !0,
			detail: a
		})), this.localName !== "tp-markup-single-page" && this.dispatchEvent(new CustomEvent(`${this.localName}-rendered`, {
			bubbles: !0,
			detail: a
		}));
	}
	readInlineSource() {
		let e = Array.from(this.querySelectorAll(":scope > script[type^=\"tp/\"]"));
		for (let t of e) {
			if (!(t instanceof HTMLScriptElement)) continue;
			let e = s.get(t.type.trim().toLowerCase());
			if (!(e === void 0 || t.textContent === null) && !(this.fixedLanguage !== null && e !== this.fixedLanguage)) return {
				language: e,
				source: t.textContent
			};
		}
		return null;
	}
};
customElements.get("tp-markup-single-page") || customElements.define("tp-markup-single-page", p);
//#endregion
export { p as t };

//# sourceMappingURL=markup-single-page.js.map