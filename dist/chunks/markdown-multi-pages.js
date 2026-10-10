import { Zu as e, st as t } from "./lib/typescript/typescript.js";
import "./color.js";
import "./clock.js";
import "./lang.js";
import "./source.js";
import { resolveTextDirection as n } from "../utilities/text-direction.js";
//#region src/components/markdown-multi-pages/markdown-multi-pages.css?inline
var r = "tp-markdown-multi-pages,[tp-markdown-multi-pages-host],.tp-markdown-multi-pages-host{box-sizing:border-box;block-size:auto;inline-size:auto;display:block;position:fixed;inset-block:0;inset-inline:.5rem;overflow:hidden}.tp-markdown-multi-pages-root{box-sizing:border-box;border-radius:.75rem;grid-template-rows:auto minmax(0,1fr);block-size:100%;min-block-size:0;inline-size:100%;display:grid;overflow:hidden}.tp-markdown-multi-pages-toolbar{--tp-toolbar-size:auto;box-sizing:border-box;border:0;border-bottom:1px solid var(--tp-brand-stroke-soft);background:var(--tp-brand-fill-softer);min-block-size:3rem;inline-size:100%;max-inline-size:100%;color:var(--tp-text-body);background:var(--tp-paper-color);border-radius:.75rem .75rem 0 0;flex-wrap:wrap}.tp-markdown-multi-pages-toolbar>[data-toolbar-start],.tp-markdown-multi-pages-toolbar>[data-toolbar-center],.tp-markdown-multi-pages-toolbar>[data-toolbar-end]{min-inline-size:0}.tp-markdown-multi-pages-toolbar>[data-toolbar-end]{flex-wrap:wrap;flex:0 auto;justify-content:flex-end}.tp-markdown-multi-pages-toolbar .tp-markdown-multi-pages-toolbar-label{text-overflow:ellipsis;white-space:nowrap;min-inline-size:0;font-size:1.5rem;font-weight:600;display:block;overflow:hidden}.tp-markdown-multi-pages-toolbar tp-icon-button>button{color:inherit;border:1px solid var(--tp-brand-stroke-mid);border-radius:var(--tp-border-radius-circle)}.tp-markdown-multi-pages-toolbar tp-icon-button>button:hover{background:var(--tp-brand-fill-soft);color:var(--tp-brand-text-on-soft)}.tp-markdown-multi-pages{--tp-markdown-multi-pages-sidebar-width:12rem;--tp-splitter-divider-size:.625rem;box-sizing:border-box;border:0;border-radius:0 0 .75rem .75rem;block-size:100%;min-block-size:0;inline-size:100%;position:relative;overflow:hidden}.tp-markdown-multi-pages:not([sidebar-open])>dl{grid-template-columns:0 0 minmax(0,1fr)}.tp-markdown-multi-pages:not([sidebar-open]) [data-tp-splitter-divider]{display:none}.tp-markdown-multi-pages>dl,.tp-markdown-multi-pages-sidebar-panel,.tp-markdown-multi-pages-content-panel{block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;overflow:hidden}.tp-markdown-multi-pages-sidebar{box-sizing:border-box;background:var(--tp-paper-color);block-size:100%;min-block-size:0;inline-size:100%;color:var(--tp-text-body);padding:.75rem;overflow:auto}.tp-markdown-multi-pages:not([sidebar-open]) .tp-markdown-multi-pages-sidebar{display:none}.tp-markdown-multi-pages-sidebar a[aria-current=page]{color:var(--tp-brand-text-colorful);font-weight:700}.tp-markdown-multi-pages-sidebar a{text-decoration:none}.tp-markdown-multi-pages-sidebar-controls{justify-content:flex-end;align-items:center;gap:.25rem;margin-block-end:.5rem;display:flex}.tp-markdown-multi-pages-sidebar-controls tp-icon-button>button{border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:var(--tp-border-radius-circle)}.tp-markdown-multi-pages-sidebar-tree{inline-size:100%}.tp-markdown-multi-pages-sidebar ul,.tp-markdown-multi-pages-sidebar ol{padding-inline-start:0;list-style:none}.tp-markdown-multi-pages-sidebar li{list-style:none}.tp-markdown-multi-pages-sidebar li::marker{content:\"\"}.tp-markdown-multi-pages-content{box-sizing:border-box;background:var(--tp-paper-color);block-size:100%;min-block-size:0;inline-size:100%;min-inline-size:0;color:var(--tp-text-body);padding:1rem;overflow:auto}.tp-markdown-multi-pages-page-nav{border-block-start:1px solid var(--tp-brand-stroke-soft);grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:.75rem;margin-block-start:2rem;padding-block-start:1rem;display:grid}.tp-markdown-multi-pages-page-nav-item{min-inline-size:0}.tp-markdown-multi-pages-page-nav-next{text-align:end}.tp-markdown-multi-pages-page-nav-top{text-align:center}.tp-markdown-multi-pages-page-nav-link{box-sizing:border-box;border:1px solid var(--tp-brand-stroke-soft);max-inline-size:100%;color:inherit;background:var(--tp-brand-fill-softer);border-radius:.5rem;flex-direction:column;gap:.2rem;padding:.65rem .75rem;text-decoration:none;display:inline-flex}.tp-markdown-multi-pages-page-nav-link:is(button){cursor:pointer;font:inherit}.tp-markdown-multi-pages-page-nav-link:hover{border-color:var(--tp-brand-stroke-mid);background:var(--tp-brand-fill-soft)}.tp-markdown-multi-pages-page-nav-meta{color:var(--tp-text-muted);font-size:.8rem;line-height:1.2}.tp-markdown-multi-pages-page-nav-title{text-overflow:ellipsis;white-space:nowrap;color:var(--tp-brand-text-colorful);font-weight:700;line-height:1.3;overflow:hidden}.tp-markdown-multi-pages-source pre{background:var(--tp-neutral-fill-loud);color:var(--tp-neutral-text-on-loud);border-radius:.5rem;margin:0;padding:.75rem;overflow:auto}.tp-markdown-multi-pages-results{border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-paper-color);max-block-size:50vh;inline-size:min(34rem,100% - 1.5rem);box-shadow:var(--tp-shadow-loud);z-index:5;border-radius:.5rem;padding:.5rem;position:absolute;inset-block-start:3rem;inset-inline-start:.75rem;overflow:auto}.tp-markdown-multi-pages-result{color:inherit;border-radius:.4rem;padding:.55rem;text-decoration:none;display:block}.tp-markdown-multi-pages-result:hover{background:var(--tp-brand-fill-softer)}.tp-markdown-multi-pages-result-title{margin-bottom:.15rem;font-weight:600}.tp-markdown-multi-pages-result-excerpt{color:var(--tp-text-muted);font-size:.9rem}@media (width<=48rem){.tp-markdown-multi-pages-toolbar{row-gap:.25rem}.tp-markdown-multi-pages-toolbar>[data-toolbar-start]{order:1}.tp-markdown-multi-pages-toolbar>[data-toolbar-end]{order:2;max-inline-size:calc(100% - 6rem)}.tp-markdown-multi-pages-toolbar>[data-toolbar-center]{border-inline-start:0;flex:1 0 100%;order:3;justify-content:flex-start;margin-inline-start:0;padding-inline-start:0}.tp-markdown-multi-pages-toolbar .tp-markdown-multi-pages-toolbar-label{font-size:1rem}.tp-markdown-multi-pages-page-nav{gap:.4rem}.tp-markdown-multi-pages-page-nav-link{padding:.5rem}.tp-markdown-multi-pages-page-nav-meta{font-size:.75rem}.tp-markdown-multi-pages-page-nav-title{font-size:.9rem}}@media (width<=24rem){.tp-markdown-multi-pages-page-nav{grid-template-columns:minmax(0,1fr)}.tp-markdown-multi-pages-page-nav-top,.tp-markdown-multi-pages-page-nav-next{text-align:start}.tp-markdown-multi-pages,.tp-markdown-multi-pages>dl{display:block}.tp-markdown-multi-pages [data-tp-splitter-divider],.tp-markdown-multi-pages:not([sidebar-open]) [data-tp-splitter-divider]{display:none}.tp-markdown-multi-pages .tp-markdown-multi-pages-sidebar-panel,.tp-markdown-multi-pages .tp-markdown-multi-pages-content-panel{margin:0;padding:0;display:block}.tp-markdown-multi-pages .tp-markdown-multi-pages-sidebar-panel{display:none}.tp-markdown-multi-pages[sidebar-open] .tp-markdown-multi-pages-sidebar-panel{z-index:2;pointer-events:none;display:block;position:absolute;inset:0}.tp-markdown-multi-pages .tp-markdown-multi-pages-content-panel{block-size:100%}.tp-markdown-multi-pages .tp-markdown-multi-pages-sidebar{inline-size:min(var(--tp-markdown-multi-pages-sidebar-width), 85%);border-inline-end:0;border-bottom:1px solid var(--tp-brand-stroke-soft);box-shadow:var(--tp-shadow-loud);pointer-events:auto;display:none;position:absolute;inset-block:0;inset-inline-start:0}.tp-markdown-multi-pages[sidebar-open] .tp-markdown-multi-pages-sidebar{border-inline-end:1px solid var(--tp-brand-stroke-soft);display:block}}@media (width<=32rem){.tp-markdown-multi-pages-toolbar tp-clock{display:none}}", i = "tp-markdown-multi-pages-styles";
function a(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function o(e) {
	let t = (e.match(/`{3,}/g) ?? []).reduce((e, t) => Math.max(e, t.length), 2), n = "`".repeat(t + 1);
	return `${n}markdown\n${e}\n${n}`;
}
var s = class extends e {
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
	currentSource = "";
	navigatingHref = "";
	sourceMode = !1;
	pageLinks = [];
	pageNavigationElement = null;
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-markdown-multi-pages-host"), this.style.display = "block", this.style.position = "fixed", this.style.insetBlock = "0", this.style.insetInline = "0.5rem", this.style.width = "auto", this.style.height = "auto", this.style.boxSizing = "border-box", this.style.overflow = "hidden", this.ensureGlobalStyle(i, r), this.renderShell(), this.initialize(), window.addEventListener("hashchange", this.handleHashChange);
	}
	disconnectedCallback() {
		this.contentElement?.removeEventListener("click", this.handleContentClick), window.removeEventListener("hashchange", this.handleHashChange);
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
		let e = this.label, t = this.querySelector(".tp-markdown-multi-pages-toolbar-label");
		t && (t.textContent = e);
	}
	applyLangs() {
		let e = this.querySelector("tp-lang");
		e instanceof HTMLElement && e.setAttribute("langs", this.langs), this.applyDocumentLocale();
	}
	applyDocumentLocale() {
		let e = this.resolveCurrentLang(), t = n(e);
		for (let n of [this.sidebarElement, this.contentElement]) n?.setAttribute("lang", e), n?.setAttribute("dir", t);
	}
	resolveCurrentLang() {
		let e = this.langs.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e !== ""), t = e[0] ?? "en", n = this.repository.split(/[?#]/, 1)[0]?.split("/").filter((e) => e !== "").at(-1)?.toLowerCase();
		return n !== void 0 && n !== t && e.includes(n) ? n : t;
	}
	async initialize() {
		this.applyDocumentLocale(), await this.loadSidebar();
		let e = this.readCurrentHref();
		if (e === null || e === "") {
			await this.navigate(this.coverHref);
			return;
		}
		await this.navigate(e);
	}
	renderShell() {
		this.innerHTML = `
      <div class="tp-markdown-multi-pages-root">
        <tp-toolbar class="tp-markdown-multi-pages-toolbar" orientation="horizontal" placement="top">
          <tp-icon-button section="start" color="currentColor" data-action="home" name="home" label="Home"></tp-icon-button>
          <tp-icon-button section="start" color="currentColor" data-action="menu" name="menu" label="Menu"></tp-icon-button>
          <tp-source section="start" url="${a(this.git)}"></tp-source>
          <tp-icon-button section="start" color="currentColor" data-action="code" name="code" label="Code"></tp-icon-button>
          <span class="tp-markdown-multi-pages-toolbar-label" section="center">${a(this.label)}</span>
          <tp-clock section="end"></tp-clock>
          <tp-lang section="end" langs="${a(this.langs)}"></tp-lang>
          <tp-color section="end" data-role="brand"></tp-color>
          <tp-theme section="end"></tp-theme>
          <tp-fullscreen section="end"></tp-fullscreen>
        </tp-toolbar>
        <tp-splitter class="tp-markdown-multi-pages" axis="horizontal" position="20%" storage-key="tp-markdown-multi-pages-sidebar">
          <dl>
            <dt>start</dt>
            <dd class="tp-markdown-multi-pages-sidebar-panel">
              <aside class="tp-markdown-multi-pages-sidebar" data-role="sidebar"></aside>
            </dd>
            <dt>end</dt>
            <dd class="tp-markdown-multi-pages-content-panel">
              <main class="tp-markdown-multi-pages-content" data-role="content" tabindex="0" aria-label="Document content"></main>
            </dd>
          </dl>
        </tp-splitter>
      </div>
    `, this.sidebarElement = this.querySelector("[data-role=\"sidebar\"]"), this.contentElement = this.querySelector("[data-role=\"content\"]"), this.applyDocumentLocale(), this.applyInitialSidebarState(), this.contentElement?.addEventListener("click", this.handleContentClick), this.querySelector("[data-action=\"home\"]")?.addEventListener("click", () => {
			this.goTo(this.coverHref);
		}), this.querySelector("[data-action=\"menu\"]")?.addEventListener("click", () => {
			this.menu = !this.menu, this.applyMenuState();
		}), this.querySelector("[data-action=\"code\"]")?.addEventListener("click", () => {
			this.toggleSourceMode();
		});
	}
	applyInitialSidebarState() {
		this.applyMenuState();
	}
	applyMenuState() {
		let e = this.querySelector(".tp-markdown-multi-pages");
		e !== null && e.toggleAttribute("sidebar-open", this.menu);
	}
	async loadSidebar() {
		if (this.sidebarElement === null) return;
		let e = await this.fetchText(this.sidebarHref);
		if (e === null) {
			this.sidebarElement.innerHTML = "<p>Sidebar not found.</p>", this.pageLinks = [];
			return;
		}
		this.pageLinks = this.extractSidebarPageLinksFromMarkdown(e), this.sidebarElement.innerHTML = await t(e, "/sidebar.md"), this.pageLinks.length === 0 && (this.pageLinks = this.extractSidebarPageLinks(this.sidebarElement)), this.wrapSidebarListWithTree(this.sidebarElement), this.rewriteSidebarLinks(this.sidebarElement);
	}
	wrapSidebarListWithTree(e) {
		let t = Array.from(e.children).filter((e) => e instanceof HTMLUListElement || e instanceof HTMLOListElement), n = t[0];
		if (!(n instanceof HTMLUListElement) && !(n instanceof HTMLOListElement)) return;
		let r = n, i = document.createElement("tp-tree");
		i.className = "tp-markdown-multi-pages-sidebar-tree", i.setAttribute("guides", ""), i.setAttribute("level", "2"), this.configureSidebarTree(i);
		for (let e of t) i.append(e);
		let a = this.createSidebarTreeControls(i), o = r instanceof Element && r.parentElement === e ? r : null;
		e.insertBefore(a, o), e.insertBefore(i, o);
	}
	createSidebarTreeControls(e) {
		let t = document.createElement("div"), n = this.createSidebarTreeButton("arrow-expand-vertical", "Expand all", () => {
			e.expandAll();
		}), r = this.createSidebarTreeButton("arrow-collapse-vertical", "Collapse all", () => {
			e.collapseAll();
		}), i = this.createSidebarTreeButton("sort-alphabetical-ascending", "Sort", () => {
			e.sortAll();
		});
		return t.className = "tp-markdown-multi-pages-sidebar-controls", t.append(n, r, i), t;
	}
	createSidebarTreeButton(e, t, n) {
		let r = document.createElement("tp-icon-button");
		return r.setAttribute("name", e), r.setAttribute("label", t), r.addEventListener("click", n), r;
	}
	configureSidebarTree(e) {
		e.setContextMenuConfig({
			globalActions: [],
			getNodeActions: (e) => e.hasChildren ? [
				{
					id: "expand",
					label: "Expand",
					disabled: e.expanded
				},
				{
					id: "collapse",
					label: "Collapse",
					disabled: !e.expanded
				},
				{
					id: "sort",
					label: "Sort"
				}
			] : []
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
			this.navigatingHref = r;
			try {
				let e = await this.fetchText(r);
				if (e === null) {
					await this.renderNotFoundPage(r);
					return;
				}
				this.currentHref = r, this.currentSource = e, this.sourceMode = !1, n.replaceChildren(this.createMarkdownViewer(r)), this.renderPageNavigation(r), this.scrollToFragmentAfterRender(i), this.updateCurrentLink(r);
			} finally {
				this.navigatingHref === r && (this.navigatingHref = "");
			}
		}
	}
	async renderNotFoundPage(e) {
		let t = this.contentElement;
		if (t === null) return;
		let n = (await this.fetchText(this.notFoundHref))?.replaceAll("{{ href }}", e) ?? `# Page not found\n\nThe requested page could not be loaded \`${e}\``;
		this.currentHref = e, this.currentSource = n, this.sourceMode = !1;
		let r = document.createElement("tp-markdown"), i = document.createElement("script");
		i.type = "tp/markdown", i.textContent = n, r.append(i), t.replaceChildren(r), this.updateCurrentLink(e);
	}
	async toggleSourceMode() {
		let e = this.contentElement;
		if (!(e === null || this.currentHref === "")) {
			if (this.sourceMode = !this.sourceMode, this.sourceMode) {
				this.currentSource === "" && (this.currentSource = await this.fetchText(this.currentHref) ?? "");
				let t = document.createElement("tp-markdown"), n = document.createElement("script");
				n.type = "tp/markdown", n.textContent = o(this.currentSource), t.append(n), e.replaceChildren(t);
				return;
			}
			e.replaceChildren(this.createMarkdownViewer(this.currentHref)), this.renderPageNavigation(this.currentHref);
		}
	}
	createMarkdownViewer(e) {
		let t = document.createElement("tp-markdown");
		return t.setAttribute("src", e), t;
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
		let n = this.contentElement?.querySelector("tp-markdown");
		if (!(n instanceof HTMLElement)) {
			this.contentElement?.append(t);
			return;
		}
		if (n.hasAttribute("data-tp-markdown-rendered")) {
			this.appendPageNavigationToMarkdown(n, t);
			return;
		}
		n.addEventListener("tp-markdown-rendered", () => {
			this.appendPageNavigationToMarkdown(n, t);
		}, { once: !0 });
	}
	appendPageNavigationToMarkdown(e, t) {
		let n = e.querySelector(":scope > .tp-markdown-output");
		if (n instanceof HTMLElement) {
			n.append(t);
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
		return o.className = "tp-markdown-multi-pages-page-nav", o.setAttribute("aria-label", "Page navigation"), o.append(this.createPageNavigationLink(r, "previous"), this.createPageNavigationTopButton(i), this.createPageNavigationLink(a, "next")), o;
	}
	createPageNavigationTopButton(e) {
		let t = document.createElement("span");
		t.className = "tp-markdown-multi-pages-page-nav-item tp-markdown-multi-pages-page-nav-top";
		let n = document.createElement("button");
		n.type = "button", n.className = "tp-markdown-multi-pages-page-nav-link", n.dataset.direction = "top", n.addEventListener("click", () => {
			this.contentElement?.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		});
		let r = document.createElement("span");
		r.className = "tp-markdown-multi-pages-page-nav-meta", r.textContent = "Top";
		let i = document.createElement("span");
		return i.className = "tp-markdown-multi-pages-page-nav-title", i.textContent = e.title, n.append(r, i), t.append(n), t;
	}
	createPageNavigationLink(e, t) {
		let n = document.createElement("span");
		if (n.className = `tp-markdown-multi-pages-page-nav-item tp-markdown-multi-pages-page-nav-${t}`, e === null) return n.setAttribute("aria-hidden", "true"), n;
		let r = document.createElement("a");
		r.href = `#/${this.stripRepository(e.href)}`, r.className = "tp-markdown-multi-pages-page-nav-link", r.dataset.direction = t;
		let i = document.createElement("span");
		i.className = "tp-markdown-multi-pages-page-nav-meta", i.textContent = t === "previous" ? "Previous" : "Next";
		let a = document.createElement("span");
		return a.className = "tp-markdown-multi-pages-page-nav-title", a.textContent = e.title, r.append(i, a), n.append(r), n;
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
		for (let e of this.querySelectorAll(".tp-markdown-multi-pages-sidebar a[href]")) this.resolveDocumentHref(e.getAttribute("href") ?? "") === t ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current");
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
			this.navigate(this.coverHref);
			return;
		}
		this.navigate(e);
	};
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
		let n = e.replace(/\.html(?=($|[#?]))/i, ".md"), r = this.resolveRelativeHref(n, t), { href: i, fragment: a } = this.splitHrefFragment(r), o = this.normalizeHref(i), s = this.normalizeHref(this.repositoryBasePath);
		return n.startsWith("/") && !this.isRepositoryHref(n) ? r : o === s ? `${this.repositoryBasePath}${a}` : o.startsWith(`${s}/`) ? `/${o}${a}` : `${this.repositoryBasePath}${o}${a}`;
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
		return !(e.split(/[?#]/, 1)[0] ?? e).toLowerCase().endsWith(".md") || !(t.headers?.get("content-type") ?? "").toLowerCase().includes("text/html") ? !1 : /<(?:!doctype\s+html|html|head|body)\b/i.test(n);
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
		let t = this.contentElement?.querySelector("tp-markdown");
		if (!(t instanceof HTMLElement)) {
			this.scrollToFragment(e);
			return;
		}
		t.addEventListener("tp-markdown-rendered", () => {
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
		let t = this.querySelector(".tp-markdown-multi-pages");
		t !== null && (t.dataset.theme = e);
	}
	applyBrand() {
		this.style.setProperty("--tp-markdown-multi-pages-brand", this.brand);
		let e = this.querySelector("[data-role=\"brand\"]");
		e !== null && (e.value = this.brand);
	}
	get repositoryBasePath() {
		let e = this.normalizeHref(this.repository);
		return e === "" ? "/" : `/${e}/`;
	}
	get sidebarHref() {
		return `${this.repositoryBasePath}sidebar.md`;
	}
	get coverHref() {
		return `${this.repositoryBasePath}cover.md`;
	}
	get notFoundHref() {
		return `${this.repositoryBasePath}page-not-found.md`;
	}
};
customElements.get("tp-markdown-multi-pages") || customElements.define("tp-markdown-multi-pages", s);
//#endregion
export { s as t };

//# sourceMappingURL=markdown-multi-pages.js.map