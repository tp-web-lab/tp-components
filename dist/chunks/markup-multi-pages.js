import { nr as e, qu as t } from "./lib/typescript/typescript.js";
import "./calculator.js";
import "./color.js";
import { TpPostItEditor as n } from "../components/post-it-editor/post-it-editor.js";
import "./clock.js";
import "./lang.js";
import "./source.js";
import { resolveTextDirection as r } from "../utilities/text-direction.js";
//#region src/components/markup-multi-pages/markup-multi-pages.css?inline
var i = ".tp-markup-single-page-toolbar .tp-markup-single-page-toolbar-label,.tp-markup-multi-pages-toolbar .tp-markup-multi-pages-toolbar-label{text-overflow:ellipsis;white-space:nowrap;min-inline-size:0;font-size:1.5rem;font-weight:600;display:block;overflow:hidden}@media (width<=48rem){.tp-markup-single-page-toolbar .tp-markup-single-page-toolbar-label,.tp-markup-multi-pages-toolbar .tp-markup-multi-pages-toolbar-label{font-size:1rem}}tp-markup-multi-pages,[tp-markup-multi-pages-host],.tp-markup-multi-pages-host{box-sizing:border-box;block-size:auto;inline-size:auto;display:block;position:fixed;inset-block:0;inset-inline:.5rem;overflow:hidden}.tp-markup-multi-pages-root{box-sizing:border-box;border-radius:.75rem;grid-template-rows:auto minmax(0,1fr);block-size:100%;min-block-size:0;inline-size:100%;display:grid;overflow:hidden}.tp-markup-multi-pages-toolbar{--tp-toolbar-size:auto;box-sizing:border-box;border:0;border-bottom:1px solid var(--tp-brand-stroke-soft);background:var(--tp-brand-fill-softer);min-block-size:3rem;inline-size:100%;max-inline-size:100%;color:var(--tp-text-body);background:var(--tp-paper-color);border-radius:.75rem .75rem 0 0;flex-wrap:wrap}.tp-markup-multi-pages-toolbar>[data-toolbar-start],.tp-markup-multi-pages-toolbar>[data-toolbar-center],.tp-markup-multi-pages-toolbar>[data-toolbar-end]{min-inline-size:0}.tp-markup-multi-pages-toolbar>tp-lang[hidden]{display:none!important}.tp-markup-multi-pages-toolbar>[data-toolbar-end]{flex-wrap:wrap;flex:0 auto;justify-content:flex-end}.tp-markup-multi-pages-toolbar tp-icon-button:not(:where([data-personal-annotation] *))>button{color:inherit;border:1px solid var(--tp-brand-stroke-mid);border-radius:var(--tp-border-radius-circle)}.tp-markup-multi-pages-toolbar tp-icon-button:not(:where([data-personal-annotation] *))>button:hover{background:var(--tp-brand-fill-soft);color:var(--tp-brand-text-on-soft)}.tp-markup-multi-pages{--tp-markup-multi-pages-sidebar-width:var(--tp-markup-multi-pages-sidebar-width,12rem);--tp-splitter-divider-size:.625rem;box-sizing:border-box;border:0;border-radius:0 0 .75rem .75rem;block-size:100%;min-block-size:0;inline-size:100%;position:relative;overflow:hidden}.tp-markup-multi-pages:not([sidebar-open])>dl{grid-template-columns:0 0 minmax(0,1fr)}.tp-markup-multi-pages:not([sidebar-open]) [data-tp-splitter-divider]{display:none}.tp-markup-multi-pages>dl,.tp-markup-multi-pages-sidebar-panel,.tp-markup-multi-pages-content-panel{block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;overflow:hidden}.tp-markup-multi-pages-sidebar{box-sizing:border-box;background:var(--tp-paper-color);block-size:100%;min-block-size:0;inline-size:100%;color:var(--tp-text-body);padding:.75rem;overflow:auto}.tp-markup-multi-pages:not([sidebar-open]) .tp-markup-multi-pages-sidebar{display:none}.tp-markup-multi-pages-sidebar a[aria-current=page]{color:var(--tp-brand-text-colorful);font-weight:700}.tp-markup-multi-pages-sidebar a{text-decoration:none}.tp-markup-multi-pages-sidebar-controls{justify-content:flex-end;align-items:center;gap:.25rem;margin-block-end:.5rem;display:flex}.tp-markup-multi-pages-sidebar-controls tp-icon-button>button{border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:var(--tp-border-radius-circle)}.tp-markup-multi-pages-sidebar-tree{inline-size:100%}.tp-markup-multi-pages-sidebar ul,.tp-markup-multi-pages-sidebar ol{padding-inline-start:0;list-style:none}.tp-markup-multi-pages-sidebar li{list-style:none}.tp-markup-multi-pages-sidebar a{align-items:center;min-block-size:1.5rem;display:inline-flex}.tp-markup-multi-pages-sidebar li::marker{content:\"\"}.tp-markup-multi-pages-content{box-sizing:border-box;background:var(--tp-paper-color);block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;color:var(--tp-text-body);padding:1rem;overflow:auto}.tp-markup-multi-pages-content .hljs-section,.tp-markup-multi-pages-content .hljs-meta{color:var(--tp-syntax-token-keyword,#569cd6)}.tp-markup-multi-pages-content .hljs-code{color:var(--tp-syntax-token-string,#ce9178)}.tp-markup-multi-pages-content .hljs-strong{color:var(--tp-syntax-token-type,#4ec9b0)}.tp-markup-multi-pages-page-nav{clear:both;border-block-start:1px solid var(--tp-brand-stroke-soft);grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:.75rem;margin-block-start:2rem;padding-block-start:1rem;display:grid}.tp-markup-multi-pages-page-nav-item{min-inline-size:0}.tp-markup-multi-pages-page-nav-next{text-align:end}.tp-markup-multi-pages-page-nav-top{text-align:center}.tp-markup-multi-pages-page-nav-link{box-sizing:border-box;border:1px solid var(--tp-brand-stroke-soft);max-inline-size:100%;color:inherit;background:var(--tp-brand-fill-softer);border-radius:.5rem;flex-direction:column;gap:.2rem;padding:.65rem .75rem;text-decoration:none;display:inline-flex}.tp-markup-multi-pages-page-nav-link:is(button){cursor:pointer;font:inherit}.tp-markup-multi-pages-page-nav-link:hover{border-color:var(--tp-brand-stroke-mid);background:var(--tp-brand-fill-soft)}.tp-markup-multi-pages-page-nav-meta{color:var(--tp-text-muted);font-size:.8rem;line-height:1.2}.tp-markup-multi-pages-page-nav-title{text-overflow:ellipsis;white-space:nowrap;color:var(--tp-brand-text-colorful);font-weight:700;line-height:1.3;overflow:hidden}.tp-markup-multi-pages-source pre{background:var(--tp-neutral-fill-loud);color:var(--tp-neutral-text-on-loud);border-radius:.5rem;margin:0;padding:.75rem;overflow:auto}.tp-markup-multi-pages-results{border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-paper-color);max-block-size:50vh;inline-size:min(34rem,100% - 1.5rem);box-shadow:var(--tp-shadow-loud);z-index:5;border-radius:.5rem;padding:.5rem;position:absolute;inset-block-start:3rem;inset-inline-start:.75rem;overflow:auto}.tp-markup-multi-pages-result{color:inherit;border-radius:.4rem;padding:.55rem;text-decoration:none;display:block}.tp-markup-multi-pages-result:hover{background:var(--tp-brand-fill-softer)}.tp-markup-multi-pages-result-title{margin-bottom:.15rem;font-weight:600}.tp-markup-multi-pages-result-excerpt{color:var(--tp-text-muted);font-size:.9rem}@media (width<=48rem){.tp-markup-multi-pages-toolbar{row-gap:.25rem}.tp-markup-multi-pages-toolbar>[data-toolbar-start]{order:1}.tp-markup-multi-pages-toolbar>[data-toolbar-end]{order:2;max-inline-size:calc(100% - 6rem)}.tp-markup-multi-pages-toolbar>[data-toolbar-center]{border-inline-start:0;flex:1 0 100%;order:3;justify-content:flex-start;margin-inline-start:0;padding-inline-start:0}.tp-markup-multi-pages-page-nav{gap:.4rem}.tp-markup-multi-pages-page-nav-link{padding:.5rem}.tp-markup-multi-pages-page-nav-meta{font-size:.75rem}.tp-markup-multi-pages-page-nav-title{font-size:.9rem}}@media (width<=24rem){.tp-markup-multi-pages-page-nav{grid-template-columns:minmax(0,1fr)}.tp-markup-multi-pages-page-nav-top,.tp-markup-multi-pages-page-nav-next{text-align:start}.tp-markup-multi-pages,.tp-markup-multi-pages>dl{display:block}.tp-markup-multi-pages [data-tp-splitter-divider],.tp-markup-multi-pages:not([sidebar-open]) [data-tp-splitter-divider]{display:none}.tp-markup-multi-pages .tp-markup-multi-pages-sidebar-panel,.tp-markup-multi-pages .tp-markup-multi-pages-content-panel{margin:0;padding:0;display:block}.tp-markup-multi-pages .tp-markup-multi-pages-sidebar-panel{display:none}.tp-markup-multi-pages[sidebar-open] .tp-markup-multi-pages-sidebar-panel{z-index:2;pointer-events:none;display:block;position:absolute;inset:0}.tp-markup-multi-pages .tp-markup-multi-pages-content-panel{block-size:100%}.tp-markup-multi-pages .tp-markup-multi-pages-sidebar{inline-size:min(var(--tp-markup-multi-pages-sidebar-width), 85%);border-inline-end:0;border-bottom:1px solid var(--tp-brand-stroke-soft);box-shadow:var(--tp-shadow-loud);pointer-events:auto;display:none;position:absolute;inset-block:0;inset-inline-start:0}.tp-markup-multi-pages[sidebar-open] .tp-markup-multi-pages-sidebar{border-inline-end:1px solid var(--tp-brand-stroke-soft);display:block}}@media (width<=32rem){.tp-markup-multi-pages-toolbar tp-clock{display:none}}", a = "tp-markup-multi-pages-styles";
function o(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function s(e, t) {
	let n = (e.match(/`{3,}/g) ?? []).reduce((e, t) => Math.max(e, t.length), 2), r = "`".repeat(n + 1);
	return `${r}${t}\n${e}\n${r}`;
}
function c(e) {
	return o(e).replace(/^([^\n]+)\n([=~^+-]{3,})$/gm, "<span class=\"hljs-section\">$1\n$2</span>").replace(/^(\s*\.\.\s+[^\n]+)$/gm, "<span class=\"hljs-meta\">$1</span>").replace(/(\*\*[^*\n]+\*\*)/g, "<span class=\"hljs-strong\">$1</span>").replace(/(``[^`\n]+``)/g, "<span class=\"hljs-code\">$1</span>").replace(/^(\s*\d+\.\s+)/gm, "<span class=\"hljs-bullet\">$1</span>");
}
var l = class extends t {
	static get observedAttributes() {
		return [
			"repository",
			"label",
			"git",
			"menu",
			"langs"
		];
	}
	sidebarElement = null;
	contentElement = null;
	currentHref = "";
	annotations = null;
	calculatorDrawer = null;
	currentSource = "";
	navigatingHref = "";
	sourceMode = !1;
	pageLinks = [];
	pageNavigationElement = null;
	shellRendered = !1;
	get fixedLanguage() {
		return null;
	}
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-markup-multi-pages-host"), this.style.display = "block", this.style.position = "fixed", this.style.insetBlock = "0", this.style.insetInline = "0.5rem", this.style.width = "auto", this.style.height = "auto", this.style.boxSizing = "border-box", this.style.overflow = "hidden", this.ensureGlobalStyle(a, i), this.shellRendered ||= (this.renderShell(), !0), !this.annotations && this.contentElement && (this.annotations = new n(), this.annotations.setAttribute("section", "start"), this.annotations.setTarget(this.contentElement), this.querySelector("[data-action=\"calculator\"]")?.after(this.annotations)), this.initialize(), window.addEventListener("hashchange", this.handleHashChange);
	}
	disconnectedCallback() {
		this.annotations?.dispose(), this.annotations = null, this.contentElement?.removeEventListener("click", this.handleContentClick), window.removeEventListener("hashchange", this.handleHashChange);
	}
	attributeChangedCallback(e) {
		if (this.isConnected) {
			if (e === "brand") {
				this.applyBrand();
				return;
			}
			if (e === "theme") {
				this.applyTheme();
				return;
			}
			e === "repository" && this.initialize(), e === "label" && this.applyLabel(), e === "menu" && this.applyMenuState(), e === "langs" && this.applyLangs();
		}
	}
	get repository() {
		return this.getAttribute("repository") ?? "/docs";
	}
	set repository(e) {
		this.setAttribute("repository", e);
	}
	get theme() {
		let e = this.getAttribute("theme");
		return e === "dark" || e === "auto" ? e : "light";
	}
	set theme(e) {
		this.setAttribute("theme", e);
	}
	get brand() {
		return this.getAttribute("brand") ?? "tp-default";
	}
	set brand(e) {
		this.setAttribute("brand", e);
	}
	get label() {
		return this.getAttribute("label") ?? "";
	}
	set label(e) {
		this.setAttribute("label", e);
	}
	get git() {
		return this.getAttribute("git") ?? "";
	}
	set git(e) {
		this.setAttribute("git", e);
	}
	get langs() {
		return this.getAttribute("langs") ?? "en,fr";
	}
	set langs(e) {
		this.setAttribute("langs", e);
	}
	get menu() {
		return this.hasAttribute("menu");
	}
	set menu(e) {
		this.toggleAttribute("menu", e);
	}
	applyLabel() {
		let e = this.label, t = this.querySelector(".tp-markup-multi-pages-toolbar-label");
		t && (t.textContent = e);
	}
	applyLangs() {
		let e = this.querySelector("tp-lang");
		e instanceof HTMLElement && e.setAttribute("langs", this.langs), this.applyDocumentLocale();
	}
	applyDocumentLocale() {
		let e = this.resolveCurrentLang(), t = r(e);
		for (let n of [this.sidebarElement, this.contentElement]) n?.setAttribute("lang", e), n?.setAttribute("dir", t);
	}
	resolveCurrentLang() {
		let e = this.langs.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e !== ""), t = e[0] ?? "en", n = this.repository.split(/[?#]/, 1)[0]?.split("/").filter((e) => e !== "").at(-1)?.toLowerCase();
		return n !== void 0 && n !== t && e.includes(n) ? n : t;
	}
	async initialize() {
		this.applyDocumentLocale(), await this.updateLanguageVisibility(), await this.loadSidebar();
		let e = this.ownerDocument.defaultView, t = this.hasAttribute("repository") && e?.frameElement !== null ? null : this.readCurrentHref();
		if (t === null || t === "") {
			await this.navigate(await this.resolveSpecialPageHref("cover") ?? this.coverHref);
			return;
		}
		await this.navigate(t);
	}
	async updateLanguageVisibility() {
		let e = this.querySelector("tp-lang");
		if (e === null) return;
		let t = this.langs.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e !== ""), n = t[0], r = t.slice(1);
		if (n === void 0 || r.length === 0) {
			e.hidden = !0;
			return;
		}
		let i = this.normalizeHref(this.repository).split("/").filter(Boolean);
		r.includes(i.at(-1) ?? "") && i.pop();
		let a = i.length === 0 ? "/" : `/${i.join("/")}/`, o = [
			"md",
			"html",
			"adoc",
			"asciidoc",
			"rst",
			"rest"
		], s = r.flatMap((e) => o.flatMap((t) => [`${a}${e}/sidebar.${t}`, `${a}${e}/cover.${t}`]));
		for (let t of s) if (await this.fetchText(t) !== null) {
			e.hidden = !1;
			return;
		}
		e.hidden = !0;
	}
	renderShell() {
		this.innerHTML = `
      <div class="tp-markup-multi-pages-root">
        <tp-toolbar class="tp-markup-multi-pages-toolbar" orientation="horizontal" placement="top">
          <tp-icon-button section="start" color="currentColor" data-action="home" name="home" label="Home"></tp-icon-button>
          <tp-icon-button section="start" color="currentColor" data-action="menu" name="menu" label="Menu"></tp-icon-button>
          <tp-source section="start" url="${o(this.git)}"></tp-source>
          <tp-icon-button section="start" color="currentColor" data-action="code" name="code" label="Code"></tp-icon-button>
          <tp-icon-button section="start" color="currentColor" data-action="calculator" name="calculator" library="components" label="Calculator"></tp-icon-button>
          <span class="tp-markup-multi-pages-toolbar-label" section="center">${o(this.label)}</span>
          <tp-clock section="end"></tp-clock>
          <tp-lang section="end" langs="${o(this.langs)}"></tp-lang>
          <tp-color section="end" data-role="brand"></tp-color>
          <tp-theme section="end"></tp-theme>
          <tp-fullscreen section="end"></tp-fullscreen>
        </tp-toolbar>
        <tp-splitter class="tp-markup-multi-pages" axis="horizontal" position="20%" storage-key="tp-markup-multi-pages-sidebar">
          <dl>
            <dt>start</dt>
            <dd class="tp-markup-multi-pages-sidebar-panel">
              <aside class="tp-markup-multi-pages-sidebar" data-role="sidebar"></aside>
            </dd>
            <dt>end</dt>
            <dd class="tp-markup-multi-pages-content-panel">
              <main class="tp-markup-multi-pages-content" data-role="content" tabindex="0" aria-label="Document content"></main>
            </dd>
          </dl>
        </tp-splitter>
      </div>
    `, this.querySelector("[data-action=\"calculator\"]")?.addEventListener("click", () => this.toggleCalculator()), this.sidebarElement = this.querySelector("[data-role=\"sidebar\"]"), this.contentElement = this.querySelector("[data-role=\"content\"]"), this.applyDocumentLocale(), this.applyInitialSidebarState(), this.contentElement?.addEventListener("click", this.handleContentClick), this.querySelector("[data-action=\"home\"]")?.addEventListener("click", () => {
			this.goToCover();
		}), this.querySelector("[data-action=\"menu\"]")?.addEventListener("click", () => {
			this.menu = !this.menu, this.applyMenuState();
		}), this.querySelector("[data-action=\"code\"]")?.addEventListener("click", () => {
			this.toggleSourceMode();
		});
	}
	toggleCalculator() {
		if (!this.calculatorDrawer) {
			let t = new e();
			t.setAttribute("label", "Calculator"), t.setAttribute("placement", "end"), t.setAttribute("width", "min(52rem, 100vw)"), t.dataset.role = "calculator-drawer", t.setContent(document.createElement("tp-calculator")), this.append(t), this.calculatorDrawer = t;
		}
		this.calculatorDrawer.hasAttribute("open") ? this.calculatorDrawer.hide() : this.calculatorDrawer.show();
	}
	applyInitialSidebarState() {
		this.applyMenuState();
	}
	applyMenuState() {
		let e = this.querySelector(".tp-markup-multi-pages");
		e !== null && e.toggleAttribute("sidebar-open", this.menu);
	}
	async loadSidebar() {
		if (this.sidebarElement === null) return;
		let e = await this.fetchSpecialPage("sidebar");
		if (e === null) {
			this.sidebarElement.innerHTML = "<p>Sidebar not found.</p>", this.pageLinks = [];
			return;
		}
		let { href: t, source: n } = e;
		this.pageLinks = this.extractSidebarPageLinksFromMarkdown(n), this.sidebarElement.innerHTML = await this.renderSourceToHtml(n, t), this.pageLinks.length === 0 && (this.pageLinks = this.extractSidebarPageLinks(this.sidebarElement)), this.wrapSidebarListWithTree(this.sidebarElement), this.rewriteSidebarLinks(this.sidebarElement);
	}
	wrapSidebarListWithTree(e) {
		let t = e, n = Array.from(t.children).filter((e) => e instanceof HTMLUListElement || e instanceof HTMLOListElement);
		if (n.length === 0) {
			let r = e.querySelector("ul, ol");
			r?.parentElement instanceof HTMLElement && (t = r.parentElement, n = Array.from(t.children).filter((e) => e instanceof HTMLUListElement || e instanceof HTMLOListElement));
		}
		let r = n[0];
		if (!(r instanceof HTMLUListElement) && !(r instanceof HTMLOListElement)) return;
		let i = r, a = document.createElement("tp-tree");
		a.className = "tp-markup-multi-pages-sidebar-tree", a.setAttribute("guides", ""), a.setAttribute("level", "2"), this.configureSidebarTree(a);
		for (let e of n) a.append(e);
		let o = this.createSidebarTreeControls(a), s = i instanceof Element && i.parentElement === t ? i : null;
		t.insertBefore(o, s), t.insertBefore(a, s);
	}
	createSidebarTreeControls(e) {
		let t = document.createElement("div"), n = this.createSidebarTreeButton("arrow-expand-vertical", "Expand all", () => {
			e.expandAll();
		}), r = this.createSidebarTreeButton("arrow-collapse-vertical", "Collapse all", () => {
			e.collapseAll();
		});
		return t.className = "tp-markup-multi-pages-sidebar-controls", t.append(n, r), t;
	}
	createSidebarTreeButton(e, t, n) {
		let r = document.createElement("tp-icon-button");
		return r.setAttribute("name", e), r.setAttribute("label", t), r.addEventListener("click", n), r;
	}
	configureSidebarTree(e) {
		e.setContextMenuConfig({
			globalActions: [],
			getNodeActions: (e) => e.hasChildren ? [{
				id: "expand",
				label: "Expand",
				disabled: e.expanded
			}, {
				id: "collapse",
				label: "Collapse",
				disabled: !e.expanded
			}] : []
		});
	}
	async navigate(e, t = !1) {
		let n = this.contentElement;
		if (n === null) return;
		let { href: r, fragment: i } = this.splitHrefFragment(this.resolveDocumentHref(e));
		if (!t && this.currentHref === r && !this.sourceMode) {
			this.scrollToFragment(i);
			return;
		}
		if (this.navigatingHref !== r) {
			this.navigatingHref = r, this.annotations?.setPage("");
			try {
				let e = await this.fetchText(r);
				if (e === null) {
					await this.renderNotFoundPage(r);
					return;
				}
				this.currentHref = r, this.currentSource = e, this.sourceMode = !1, await this.ensureLanguageRenderer(this.detectLanguage(r)), this.updateDocumentMetadata(r, e), n.replaceChildren(this.createMarkupViewer(r, e)), this.annotations?.setPage(new URL(r, this.ownerDocument.baseURI).href), this.renderPageNavigation(r), this.scrollToFragmentAfterRender(i), this.updateCurrentLink(r);
			} finally {
				this.navigatingHref === r && (this.navigatingHref = "");
			}
		}
	}
	async renderNotFoundPage(e) {
		let t = this.contentElement;
		if (t === null) return;
		let n = await this.fetchSpecialPage("page-not-found"), r = n?.source.replaceAll("{{ href }}", e) ?? this.createDefaultNotFoundSource(e), i = n?.href ?? this.notFoundHref;
		this.currentHref = e, this.currentSource = r, this.sourceMode = !1, await this.ensureLanguageRenderer(this.detectLanguage(i)), this.updateDocumentMetadata(e, r), t.replaceChildren(this.createInlineMarkupViewer(i, r)), this.updateCurrentLink(e);
	}
	async toggleSourceMode() {
		let e = this.contentElement;
		if (!(e === null || this.currentHref === "")) {
			if (this.sourceMode = !this.sourceMode, this.annotations?.setPage(""), this.sourceMode) {
				this.currentSource === "" && (this.currentSource = await this.fetchText(this.currentHref) ?? "");
				let t = document.createElement("tp-markdown"), n = document.createElement("script");
				n.type = "tp/markdown", n.textContent = s(this.currentSource, this.getSourceLanguage(this.currentHref)), t.append(n), this.detectLanguage(this.currentHref) === "restructuredtext" && t.addEventListener("tp-markdown-rendered", () => {
					let e = t.querySelector("pre code");
					e !== null && (e.innerHTML = c(this.currentSource), e.classList.remove("language-plaintext"), e.classList.add("hljs", "language-restructuredtext"), e.dataset.highlightRendered = "true");
				}, { once: !0 }), e.replaceChildren(t);
				return;
			}
			e.replaceChildren(this.createMarkupViewer(this.currentHref, this.currentSource)), this.renderPageNavigation(this.currentHref), this.annotations?.setPage(new URL(this.currentHref, this.ownerDocument.baseURI).href);
		}
	}
	createMarkupViewer(e, t) {
		let n = this.detectLanguage(e);
		if (n === "html") {
			let e = document.createElement("div");
			return e.className = "tp-markup-multi-pages-html-output", e.innerHTML = t ?? "", e.setAttribute("data-tp-markup-multi-pages-rendered", ""), e;
		}
		let r = document.createElement(this.getViewerTagName(n));
		return r.setAttribute("src", e), r;
	}
	createInlineMarkupViewer(e, t) {
		let n = this.detectLanguage(e);
		if (n === "html") {
			let e = document.createElement("div");
			return e.className = "tp-markup-multi-pages-html-output", e.innerHTML = t, e.setAttribute("data-tp-markup-multi-pages-rendered", ""), e;
		}
		let r = document.createElement(this.getViewerTagName(n)), i = document.createElement("script");
		return i.type = this.getInlineScriptType(n), i.textContent = t, r.append(i), r;
	}
	async renderSourceToHtml(e, t) {
		let n = this.detectLanguage(t);
		if (n === "html") return e;
		if (n === "asciidoc") {
			let { renderAsciidocToHtml: t } = await import("../components/asciidoc/asciidoc.js");
			return t(e);
		}
		if (n === "restructuredtext") {
			let { renderRestructuredTextToHtml: t } = await import("../components/restructuredtext/restructuredtext.js");
			return t(e);
		}
		let { renderMarkdownToHtml: r } = await import("../components/markdown/markdown.js");
		return r(e, t);
	}
	async ensureLanguageRenderer(e) {
		if (e !== "html") {
			if (e === "asciidoc") {
				await import("../components/asciidoc/asciidoc.js");
				return;
			}
			if (e === "restructuredtext") {
				await import("../components/restructuredtext/restructuredtext.js");
				return;
			}
			await import("../components/markdown/markdown.js");
		}
	}
	updateDocumentMetadata(e, t) {
		if (this.isConnected && this.ownerDocument.querySelector("tp-markup-multi-pages") !== this) return;
		let n = this.extractDocumentTitle(e, t), r = this.label.trim();
		this.ownerDocument.title = r !== "" && n !== r ? `${n} · ${r}` : n, this.setDocumentMeta("description", this.extractDocumentDescription(t, n));
	}
	setDocumentMeta(e, t) {
		let n = this.ownerDocument.head.querySelector(`meta[name="${e}"]`);
		n === null && (n = this.ownerDocument.createElement("meta"), n.name = e, n.dataset.tpMarkupMultiPages = "", this.ownerDocument.head.append(n)), n.content = t;
	}
	extractDocumentTitle(e, t) {
		let n = this.detectLanguage(e);
		if (n === "html") {
			let e = new DOMParser().parseFromString(t, "text/html"), n = e.querySelector("h1")?.textContent?.trim() || e.querySelector("title")?.textContent?.trim();
			if (n) return n;
		} else if (n === "asciidoc") {
			let e = /^=\s+(.+)$/m.exec(t)?.[1]?.trim();
			if (e) return this.cleanDocumentTitle(e);
		} else if (n === "restructuredtext") {
			let e = t.split(/\r?\n/), n = e.findIndex((e, t) => t > 0 && /^[=\-~^+]{3,}\s*$/.test(e)), r = n > 0 ? e[n - 1]?.trim() : "";
			if (r) return this.cleanDocumentTitle(r);
		} else {
			let e = /^#\s+(.+)$/m.exec(t)?.[1]?.trim();
			if (e) return this.cleanDocumentTitle(e);
		}
		return (e.split(/[?#]/, 1)[0]?.split("/").filter(Boolean).at(-1) ?? "").replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " ").trim() || this.label.trim() || "Documentation";
	}
	cleanDocumentTitle(e) {
		return (new DOMParser().parseFromString(e, "text/html").body.textContent ?? e).replace(/!\[[^\]]*]\([^)]+\)/g, " ").replace(/\[([^\]]+)]\([^)]+\)/g, "$1").replace(/[*_~`]/g, "").replace(/\s+/g, " ").trim();
	}
	extractDocumentDescription(e, t) {
		let n = e.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/^\s*(?:[#=*`>|:+\-.]+|\.\.\s+\w+::).*$/gm, " ").replace(/\[([^\]]+)]\([^)]+\)/g, "$1").replace(/[*_~`]/g, "").replace(/\s+/g, " ").trim(), r = n === "" ? t : n;
		return r.length > 160 ? `${r.slice(0, 157).trimEnd()}…` : r;
	}
	detectLanguage(e) {
		if (this.fixedLanguage !== null) return this.fixedLanguage;
		let t = e.split(/[?#]/, 1)[0]?.toLowerCase() ?? "";
		return t.endsWith(".html") || t.endsWith(".htm") ? "html" : t.endsWith(".adoc") || t.endsWith(".asciidoc") ? "asciidoc" : t.endsWith(".rst") || t.endsWith(".rest") ? "restructuredtext" : "markdown";
	}
	getViewerTagName(e) {
		return e === "asciidoc" ? "tp-asciidoc" : e === "restructuredtext" ? "tp-restructuredtext" : "tp-markdown";
	}
	getInlineScriptType(e) {
		return e === "asciidoc" ? "tp/asciidoc" : e === "restructuredtext" ? "tp/restructuredtext" : "tp/markdown";
	}
	getRenderedAttribute(e) {
		return e === "asciidoc" ? "data-tp-asciidoc-rendered" : e === "restructuredtext" ? "data-tp-restructuredtext-rendered" : e === "html" ? "data-tp-markup-multi-pages-rendered" : "data-tp-markdown-rendered";
	}
	getRenderedEvent(e) {
		return e === "asciidoc" ? "tp-asciidoc-rendered" : e === "restructuredtext" ? "tp-restructuredtext-rendered" : e === "html" ? "tp-markup-multi-pages-rendered" : "tp-markdown-rendered";
	}
	getOutputSelector(e) {
		return e === "asciidoc" ? ":scope > .tp-asciidoc-output" : e === "restructuredtext" ? ":scope > .tp-restructuredtext-output" : e === "html" ? ":scope" : ":scope > .tp-markdown-output";
	}
	getSourceLanguage(e) {
		let t = this.detectLanguage(e);
		return t === "restructuredtext" ? "plaintext" : t === "asciidoc" ? "asciidoc" : t === "html" ? "html" : "markdown";
	}
	extractSidebarPageLinks(e) {
		let t = [], n = /* @__PURE__ */ new Set();
		for (let r of e.querySelectorAll("a[href]")) {
			let e = r.getAttribute("href") ?? "";
			if (!this.shouldHandleDocumentHref(e)) continue;
			let { href: i } = this.splitHrefFragment(this.resolveDocumentHref(e, this.repositoryBasePath));
			if (n.has(i)) continue;
			let a = r.textContent?.replace(/\s+/g, " ").trim() ?? "";
			a !== "" && (n.add(i), t.push({
				href: i,
				level: this.readSidebarLinkLevel(r),
				title: a
			}));
		}
		return t;
	}
	extractSidebarPageLinksFromMarkdown(e) {
		let t = [], n = /* @__PURE__ */ new Set(), r = /\[([^\]]+)\]\(([^)]+)\)/g;
		for (let i of e.split(/\r?\n/)) for (let e of i.matchAll(r)) {
			let r = e[1] ?? "", a = e[2] ?? "";
			if (!this.shouldHandleDocumentHref(a)) continue;
			let { href: o } = this.splitHrefFragment(this.resolveDocumentHref(a, this.repositoryBasePath));
			if (n.has(o)) continue;
			let s = this.cleanSidebarMarkdownLabel(r);
			s !== "" && (n.add(o), t.push({
				href: o,
				level: this.readSidebarMarkdownLevel(i),
				title: s
			}));
		}
		return t;
	}
	cleanSidebarMarkdownLabel(e) {
		return e.replace(/[*_~`]/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
	}
	readSidebarMarkdownLevel(e) {
		let t = e.match(/^\s*/)?.[0].length ?? 0;
		return Math.floor(t / 2) + 1;
	}
	readSidebarLinkLevel(e) {
		let t = 0, n = e;
		for (; n !== null && n !== this.sidebarElement;) (n instanceof HTMLUListElement || n instanceof HTMLOListElement) && (t += 1), n = n.parentElement;
		return Math.max(t, 1);
	}
	renderPageNavigation(e) {
		this.pageNavigationElement?.remove(), this.pageNavigationElement = null;
		let t = this.createPageNavigation(e);
		if (t === null) return;
		this.pageNavigationElement = t;
		let n = this.contentElement?.querySelector("tp-markdown, tp-asciidoc, tp-restructuredtext, .tp-markup-multi-pages-html-output");
		if (!(n instanceof HTMLElement)) {
			this.contentElement?.append(t);
			return;
		}
		let r = this.detectLanguage(this.currentHref);
		if (n.hasAttribute(this.getRenderedAttribute(r))) {
			this.appendPageNavigationToMultiPages(n, t, r);
			return;
		}
		n.addEventListener(this.getRenderedEvent(r), () => {
			this.appendPageNavigationToMultiPages(n, t, r);
		}, { once: !0 });
	}
	appendPageNavigationToMultiPages(e, t, n = this.detectLanguage(this.currentHref)) {
		let r = e.querySelector(this.getOutputSelector(n));
		if (r instanceof HTMLElement) {
			r.append(t);
			return;
		}
		e.append(t);
	}
	createPageNavigation(e) {
		let { href: t } = this.splitHrefFragment(this.resolveDocumentHref(e)), n = this.pageLinks.findIndex((e) => e.href === t);
		if (n === -1) return null;
		let r = this.pageLinks[n - 1] ?? null, i = this.pageLinks[n] ?? null, a = this.pageLinks[n + 1] ?? null;
		if (i === null || r === null && a === null) return null;
		let o = document.createElement("nav");
		return o.className = "tp-markup-multi-pages-page-nav", o.setAttribute("aria-label", "Page navigation"), o.append(this.createPageNavigationLink(r, "previous"), this.createPageNavigationTopButton(i), this.createPageNavigationLink(a, "next")), o;
	}
	createPageNavigationTopButton(e) {
		let t = document.createElement("span");
		t.className = "tp-markup-multi-pages-page-nav-item tp-markup-multi-pages-page-nav-top";
		let n = document.createElement("button");
		n.type = "button", n.className = "tp-markup-multi-pages-page-nav-link", n.dataset.direction = "top", n.addEventListener("click", () => {
			this.contentElement?.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		});
		let r = document.createElement("span");
		r.className = "tp-markup-multi-pages-page-nav-meta", r.textContent = "Top";
		let i = document.createElement("span");
		return i.className = "tp-markup-multi-pages-page-nav-title", i.textContent = e.title, n.append(r, i), t.append(n), t;
	}
	createPageNavigationLink(e, t) {
		let n = document.createElement("span");
		if (n.className = `tp-markup-multi-pages-page-nav-item tp-markup-multi-pages-page-nav-${t}`, e === null) return n.setAttribute("aria-hidden", "true"), n;
		let r = document.createElement("a");
		r.href = `#/${this.stripRepository(e.href)}`, r.className = "tp-markup-multi-pages-page-nav-link", r.dataset.direction = t;
		let i = document.createElement("span");
		i.className = "tp-markup-multi-pages-page-nav-meta", i.textContent = t === "previous" ? "Previous" : "Next";
		let a = document.createElement("span");
		return a.className = "tp-markup-multi-pages-page-nav-title", a.textContent = e.title, r.append(i, a), n.append(r), n;
	}
	rewriteSidebarLinks(e) {
		for (let t of e.querySelectorAll("a[href]")) {
			let e = t.getAttribute("href") ?? "";
			if (e === "" || !this.shouldHandleDocumentHref(e)) continue;
			let n = this.resolveDocumentHref(e, this.repositoryBasePath);
			t.setAttribute("href", `#/${this.stripRepository(n)}`), t.addEventListener("click", (e) => {
				e.preventDefault(), this.goTo(n, this.repositoryBasePath);
			});
		}
	}
	updateCurrentLink(e) {
		let t = this.resolveDocumentHref(e);
		for (let e of this.querySelectorAll(".tp-markup-multi-pages-sidebar a[href]")) this.resolveDocumentHref(e.getAttribute("href") ?? "") === t ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current");
	}
	goTo(e, t = this.currentHref) {
		let n = this.resolveDocumentHref(e, t), r = `#/${this.stripRepository(n)}`;
		if (window.location.hash === r) {
			this.navigate(n, !0);
			return;
		}
		window.location.hash = r;
	}
	goToCurrentFragment(e) {
		let t = this.currentHref === "" ? this.readCurrentHref() : this.currentHref;
		if (t === null || t === "") return;
		let { href: n } = this.splitHrefFragment(t), r = `#/${this.stripRepository(n)}${e}`;
		if (window.location.hash === r) {
			this.scrollToFragment(e);
			return;
		}
		window.location.hash = r;
	}
	handleHashChange = () => {
		let e = this.readCurrentHref();
		if (e === null || e === "") {
			this.navigateToCover();
			return;
		}
		this.navigate(e);
	};
	async navigateToCover() {
		await this.navigate(await this.resolveSpecialPageHref("cover") ?? this.coverHref);
	}
	async goToCover() {
		this.goTo(await this.resolveSpecialPageHref("cover") ?? this.coverHref);
	}
	handleContentClick = (e) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("a[href]");
		if (n === null || this.contentElement === null || !this.contentElement.contains(n)) return;
		let r = n.getAttribute("href") ?? "";
		if (this.isHashOnlyHref(r)) {
			e.preventDefault(), this.goToCurrentFragment(r);
			return;
		}
		this.shouldHandleDocumentLink(n, r) && (e.preventDefault(), this.goTo(r, this.currentHref));
	};
	readCurrentHref() {
		return window.location.hash.startsWith("#/") ? this.normalizeHref(window.location.hash.slice(2)) : null;
	}
	resolveDocumentHref(e, t = this.repositoryBasePath) {
		let n = this.resolveRelativeHref(e, t), { href: r, fragment: i } = this.splitHrefFragment(n), a = this.normalizeHref(r), o = this.normalizeHref(this.repositoryBasePath);
		return e.startsWith("/") && !this.isRepositoryHref(e) ? n : a === o ? `${this.repositoryBasePath}${i}` : a.startsWith(`${o}/`) ? `/${a}${i}` : `${this.repositoryBasePath}${a}${i}`;
	}
	stripRepository(e) {
		let { href: t, fragment: n } = this.splitHrefFragment(e), r = this.normalizeHref(t), i = this.normalizeHref(this.repositoryBasePath);
		return r === i ? n === "" ? "" : n : r.startsWith(`${i}/`) ? `${r.slice(i.length + 1)}${n}` : `${r}${n}`;
	}
	normalizeHref(e) {
		return e.replace(/^#\//, "").replace(/^\.\//, "").replace(/^\/+/, "").replace(/\/+$/, "");
	}
	async fetchText(e) {
		try {
			let t = await fetch(e, { cache: "no-store" });
			if (!t.ok) return null;
			let n = await t.text();
			return this.isHtmlFallbackResponse(e, t, n) ? null : n;
		} catch {
			return null;
		}
	}
	isHtmlFallbackResponse(e, t, n) {
		let r = (e.split(/[?#]/, 1)[0] ?? e).toLowerCase();
		return !(t.headers?.get("content-type") ?? "").toLowerCase().includes("text/html") || !/<(?:!doctype\s+html|html|head|body)\b/i.test(n) ? !1 : r.endsWith(".md") || r.endsWith(".adoc") || r.endsWith(".asciidoc") || r.endsWith(".rst") || r.endsWith(".rest") ? !0 : !r.endsWith(".html") && !r.endsWith(".htm") ? !1 : this.isLikelyApplicationShell(n);
	}
	isLikelyApplicationShell(e) {
		return /<script\b[^>]+src=["'][^"']*(?:tp-loader|\/src\/)/i.test(e) || /\bimport\s*\(?\s*["'][^"']*(?:tp-loader|\/src\/)/i.test(e) || /<tp-(?:markup|markdown|asciidoc|restructuredtext|html)-multi-pages\b/i.test(e);
	}
	isExternalHref(e) {
		return /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(e) || /^[a-z][a-z\d+.-]*:/i.test(e);
	}
	shouldHandleDocumentLink(e, t) {
		if (!this.shouldHandleDocumentHref(t) || e.hasAttribute("download")) return !1;
		let n = e.getAttribute("target");
		return n === null || n === "" || n === "_self";
	}
	shouldHandleDocumentHref(e) {
		return e === "" || this.isHashOnlyHref(e) || this.isExternalHref(e) ? !1 : !e.startsWith("/") || this.isRepositoryHref(e);
	}
	isHashOnlyHref(e) {
		return e.startsWith("#") && !e.startsWith("#/");
	}
	resolveRelativeHref(e, t) {
		if (e.startsWith("/") || e.startsWith("#/") || this.isHashOnlyHref(e) || this.isExternalHref(e)) return e;
		let n = t.split(/[?#]/, 1)[0] ?? this.repositoryBasePath, r = new URL(e, `https://tp.local${n}`);
		return `${r.pathname}${r.search}${r.hash}`;
	}
	splitHrefFragment(e) {
		let t = e.indexOf("#", e.startsWith("#/") ? 2 : 0);
		return t === -1 ? {
			href: e,
			fragment: ""
		} : {
			href: e.slice(0, t),
			fragment: e.slice(t)
		};
	}
	scrollToFragmentAfterRender(e) {
		if (e === "") return;
		let t = this.contentElement?.querySelector("tp-markdown, tp-asciidoc, tp-restructuredtext, .tp-markup-multi-pages-html-output");
		if (!(t instanceof HTMLElement)) {
			this.scrollToFragment(e);
			return;
		}
		let n = this.detectLanguage(this.currentHref);
		if (t.hasAttribute(this.getRenderedAttribute(n))) {
			this.scrollToFragment(e);
			return;
		}
		t.addEventListener(this.getRenderedEvent(n), () => {
			this.scrollToFragment(e);
		}, { once: !0 });
	}
	scrollToFragment(e) {
		if (e === "") return;
		let t = decodeURIComponent(e.slice(1));
		(this.contentElement?.querySelector(`#${this.escapeCssIdentifier(t)}`))?.scrollIntoView?.({ block: "start" });
	}
	escapeCssIdentifier(e) {
		return typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
	}
	isRepositoryHref(e) {
		let t = this.normalizeHref(e), n = this.normalizeHref(this.repositoryBasePath);
		return t === n || t.startsWith(`${n}/`);
	}
	applyTheme() {
		let e = this.theme;
		this.getAttribute("theme") !== e && this.setAttribute("theme", e);
		let t = this.querySelector(".tp-markup-multi-pages");
		t !== null && (t.dataset.theme = e);
	}
	applyBrand() {
		this.style.setProperty("--tp-markup-multi-pages-brand", this.brand);
		let e = this.querySelector("[data-role=\"brand\"]");
		e !== null && (e.value = this.brand);
	}
	get repositoryBasePath() {
		let e = this.normalizeHref(this.repository);
		return e === "" ? "/" : `/${e}/`;
	}
	get coverHref() {
		return `${this.repositoryBasePath}cover.${this.preferredExtension}`;
	}
	get notFoundHref() {
		return `${this.repositoryBasePath}page-not-found.${this.preferredExtension}`;
	}
	get preferredExtension() {
		return this.fixedLanguage === "html" ? "html" : this.fixedLanguage === "asciidoc" ? "adoc" : this.fixedLanguage === "restructuredtext" ? "rst" : "md";
	}
	createDefaultNotFoundSource(e) {
		let t = this.fixedLanguage ?? this.detectLanguage(this.notFoundHref);
		return t === "html" ? `<h1>Page not found</h1><p>The requested page could not be loaded: <code>${o(e)}</code></p>` : t === "asciidoc" ? `= Page not found\n\nThe requested page could not be loaded: \`${e}\`` : t === "restructuredtext" ? `Page not found\n==============\n\nThe requested page could not be loaded: \`${e}\`` : `# Page not found\n\nThe requested page could not be loaded \`${e}\``;
	}
	async fetchSpecialPage(e) {
		for (let t of this.getSpecialPageHrefs(e)) {
			let e = await this.fetchText(t);
			if (e !== null) return {
				href: t,
				source: e
			};
		}
		return null;
	}
	async resolveSpecialPageHref(e) {
		return (await this.fetchSpecialPage(e))?.href ?? null;
	}
	getSpecialPageHrefs(e) {
		return (this.fixedLanguage === "html" ? ["html", "htm"] : this.fixedLanguage === "asciidoc" ? ["adoc", "asciidoc"] : this.fixedLanguage === "restructuredtext" ? ["rst", "rest"] : this.fixedLanguage === "markdown" ? ["md", "markdown"] : [
			"md",
			"html",
			"adoc",
			"asciidoc",
			"rst",
			"rest"
		]).map((t) => `${this.repositoryBasePath}${e}.${t}`);
	}
};
customElements.get("tp-markup-multi-pages") || customElements.define("tp-markup-multi-pages", l);
//#endregion
export { l as t };

//# sourceMappingURL=markup-multi-pages.js.map