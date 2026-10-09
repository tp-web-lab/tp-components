/**
 * @module components/markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-calculator
 * @summary Scientific calculator with an editable expression and degree/radian modes.
 */
/**
 * @tp-dependency tp-clock
 * @summary Live clock component with digital or analogic display and date tooltip.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Drawer overlay component.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-lang
 * @summary Documentation language selector.
 */
/**
 * @tp-dependency tp-post-it-editor
 * @summary creates and edits persistent personal annotations attached to document elements.
 */
/**
 * @tp-dependency tp-source
 * @summary Source repository link button.
 */
/**
 * @tp-dependency tp-splitter
 * @summary Splitter component with two resizable panels.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @tp-dependency tp-tree
 * @summary Generic tree component for interactive hierarchical editing.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../toolbar/toolbar.js";
import "../calculator/calculator.js";
import { TpDrawer } from "../drawer/drawer.js";
import { TpPostItEditor } from "../post-it-editor/post-it-editor.js";
import "../icon-button/icon-button.js";
import "../clock/clock.js";
import "../color/color.js";
import "../lang/lang.js";
import "../source/source.js";
import "../fullscreen/fullscreen.js";
import "../theme/theme.js";
import "../tree/tree.js";
import "../splitter/splitter.js";
import { resolveTextDirection } from "../../utilities/text-direction.js";
import type { TpTree } from "../tree/tree.js";
import style from "./markup-multi-pages.css?inline";
import type {
	TpMarkupMultiPagesPageLink,
	TpMarkupMultiPagesTheme,
} from "./markup-multi-pages.types.js";

const STYLE_ID = "tp-markup-multi-pages-styles";

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export type TpMarkupMultiPagesLanguage =
	| "html"
	| "markdown"
	| "asciidoc"
	| "restructuredtext";

function wrapAsSourceCodeBlock(source: string, language: string): string {
	const fenceRuns = source.match(/`{3,}/g) ?? [];
	const longestFence = fenceRuns.reduce(
		(max, run) => Math.max(max, run.length),
		2,
	);
	const fence = "`".repeat(longestFence + 1);
	return `${fence}${language}\n${source}\n${fence}`;
}

function highlightRestructuredTextSource(source: string): string {
	return escapeHtml(source)
		.replace(
			/^([^\n]+)\n([=~^+-]{3,})$/gm,
			'<span class="hljs-section">$1\n$2</span>',
		)
		.replace(/^(\s*\.\.\s+[^\n]+)$/gm, '<span class="hljs-meta">$1</span>')
		.replace(/(\*\*[^*\n]+\*\*)/g, '<span class="hljs-strong">$1</span>')
		.replace(/(``[^`\n]+``)/g, '<span class="hljs-code">$1</span>')
		.replace(/^(\s*\d+\.\s+)/gm, '<span class="hljs-bullet">$1</span>');
}

/**
 * @summary Multi-page documentation with support for multiple markup languages.
 * @tagname tp-markup-multi-pages
 * @example
 * <tp-markup-multi-pages></tp-markup-multi-pages>
 */
export class TpMarkupMultiPages extends TpBase {
	public static get observedAttributes(): string[] {
		return [
			"repository",
			/*'theme', 'brand',*/ "label",
			"git",
			"menu",
			"langs",
		];
	}

	private sidebarElement: HTMLElement | null = null;
	private contentElement: HTMLElement | null = null;
	private currentHref = "";
	/** Shared page-scoped personal annotation editor. */
	private annotations: TpPostItEditor | null = null;
	private calculatorDrawer: TpDrawer | null = null;
	private currentSource = "";
	private navigatingHref = "";
	private sourceMode = false;
	private pageLinks: TpMarkupMultiPagesPageLink[] = [];
	private pageNavigationElement: HTMLElement | null = null;
	private shellRendered = false;

	/** Language imposed by a format-specific subclass, or automatic detection. */
	protected get fixedLanguage(): TpMarkupMultiPagesLanguage | null {
		return null;
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-markup-multi-pages-host");
		this.style.display = "block";
		this.style.position = "fixed";
		this.style.insetBlock = "0";
		this.style.insetInline = "0.5rem";
		this.style.width = "auto";
		this.style.height = "auto";
		this.style.boxSizing = "border-box";
		this.style.overflow = "hidden";
		this.ensureGlobalStyle(STYLE_ID, style);
		if (!this.shellRendered) {
			this.renderShell();
			this.shellRendered = true;
		}
		// this.applyBrand();
		if (!this.annotations && this.contentElement) {
			this.annotations = new TpPostItEditor();
			this.annotations.setAttribute("section", "start");
			this.annotations.setTarget(this.contentElement);
			this.querySelector('[data-action="calculator"]')?.after(this.annotations);
		}
		// this.applyTheme();
		void this.initialize();
		window.addEventListener("hashchange", this.handleHashChange);
	}

	public disconnectedCallback(): void {
		this.annotations?.dispose();
		this.annotations = null;
		this.contentElement?.removeEventListener("click", this.handleContentClick);
		window.removeEventListener("hashchange", this.handleHashChange);
	}

	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) return;

		if (name === "brand") {
			this.applyBrand();
			return;
		}

		if (name === "theme") {
			this.applyTheme();
			return;
		}

		if (name === "repository") {
			void this.initialize();
		}

		if (name === "label") {
			this.applyLabel();
		}

		if (name === "menu") {
			this.applyMenuState();
		}

		if (name === "langs") {
			this.applyLangs();
		}
	}

	public get repository(): string {
		return this.getAttribute("repository") ?? "/docs";
	}

	public set repository(value: string) {
		this.setAttribute("repository", value);
	}

	public get theme(): TpMarkupMultiPagesTheme {
		const value = this.getAttribute("theme");
		if (value === "dark" || value === "auto") return value;
		return "light";
	}

	public set theme(value: TpMarkupMultiPagesTheme) {
		this.setAttribute("theme", value);
	}

	public get brand(): string {
		return this.getAttribute("brand") ?? "tp-default";
	}

	public set brand(value: string) {
		this.setAttribute("brand", value);
	}

	public get label(): string {
		return this.getAttribute("label") ?? "";
	}

	public set label(value: string) {
		this.setAttribute("label", value);
	}

	public get git(): string {
		return this.getAttribute("git") ?? "";
	}

	public set git(value: string) {
		this.setAttribute("git", value);
	}

	public get langs(): string {
		return this.getAttribute("langs") ?? "en,fr";
	}

	public set langs(value: string) {
		this.setAttribute("langs", value);
	}

	public get menu(): boolean {
		return this.hasAttribute("menu");
	}

	public set menu(value: boolean) {
		this.toggleAttribute("menu", value);
	}

	private applyLabel(): void {
		const label = this.label;
		const labelElement = this.querySelector(
			".tp-markup-multi-pages-toolbar-label",
		);
		if (labelElement) {
			labelElement.textContent = label;
		}
	}

	private applyLangs(): void {
		const langElement = this.querySelector("tp-lang");
		if (langElement instanceof HTMLElement) {
			langElement.setAttribute("langs", this.langs);
		}
		this.applyDocumentLocale();
	}

	private applyDocumentLocale(): void {
		const lang = this.resolveCurrentLang();
		const dir = resolveTextDirection(lang);

		for (const element of [this.sidebarElement, this.contentElement]) {
			element?.setAttribute("lang", lang);
			element?.setAttribute("dir", dir);
		}
	}

	private resolveCurrentLang(): string {
		const langs = this.langs
			.split(",")
			.map((lang) => lang.trim().toLowerCase())
			.filter((lang) => lang !== "");
		const defaultLang = langs[0] ?? "en";
		const repositoryLang = this.repository
			.split(/[?#]/, 1)[0]
			?.split("/")
			.filter((segment) => segment !== "")
			.at(-1)
			?.toLowerCase();

		if (
			repositoryLang !== undefined &&
			repositoryLang !== defaultLang &&
			langs.includes(repositoryLang)
		) {
			return repositoryLang;
		}

		return defaultLang;
	}

	private async initialize(): Promise<void> {
		this.applyDocumentLocale();
		await this.updateLanguageVisibility();
		await this.loadSidebar();

		const view = this.ownerDocument.defaultView;
		const ignoresInheritedRoute =
			this.hasAttribute("repository") && view?.frameElement !== null;
		const initialHref = ignoresInheritedRoute ? null : this.readCurrentHref();
		if (initialHref === null || initialHref === "") {
			await this.navigate(
				(await this.resolveSpecialPageHref("cover")) ?? this.coverHref,
			);
			return;
		}

		await this.navigate(initialHref);
	}

	private async updateLanguageVisibility(): Promise<void> {
		const langElement = this.querySelector<HTMLElement>("tp-lang");
		if (langElement === null) return;

		const langs = this.langs
			.split(",")
			.map((lang) => lang.trim().toLowerCase())
			.filter((lang) => lang !== "");
		const defaultLang = langs[0];
		const alternateLangs = langs.slice(1);
		if (defaultLang === undefined || alternateLangs.length === 0) {
			langElement.hidden = true;
			return;
		}

		const repositorySegments = this.normalizeHref(this.repository)
			.split("/")
			.filter(Boolean);
		if (alternateLangs.includes(repositorySegments.at(-1) ?? ""))
			repositorySegments.pop();
		const repositoryBase =
			repositorySegments.length === 0
				? "/"
				: `/${repositorySegments.join("/")}/`;
		const extensions = ["md", "html", "adoc", "asciidoc", "rst", "rest"];
		const probes = alternateLangs.flatMap((lang) =>
			extensions.flatMap((extension) => [
				`${repositoryBase}${lang}/sidebar.${extension}`,
				`${repositoryBase}${lang}/cover.${extension}`,
			]),
		);
		// Only one translated entry page is needed. Do not request every
		// alternate format after a valid translation has already been found.
		for (const href of probes) {
			if ((await this.fetchText(href)) !== null) {
				langElement.hidden = false;
				return;
			}
		}
		langElement.hidden = true;
	}

	private renderShell(): void {
		this.innerHTML = `
      <div class="tp-markup-multi-pages-root">
        <tp-toolbar class="tp-markup-multi-pages-toolbar" orientation="horizontal" placement="top">
          <tp-icon-button section="start" color="currentColor" data-action="home" name="home" label="Home"></tp-icon-button>
          <tp-icon-button section="start" color="currentColor" data-action="menu" name="menu" label="Menu"></tp-icon-button>
          <tp-source section="start" url="${escapeHtml(this.git)}"></tp-source>
          <tp-icon-button section="start" color="currentColor" data-action="code" name="code" label="Code"></tp-icon-button>
          <tp-icon-button section="start" color="currentColor" data-action="calculator" name="calculator" library="components" label="Calculator"></tp-icon-button>
          <span class="tp-markup-multi-pages-toolbar-label" section="center">${escapeHtml(this.label)}</span>
          <tp-clock section="end"></tp-clock>
          <tp-lang section="end" langs="${escapeHtml(this.langs)}"></tp-lang>
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
    `;

		this.querySelector('[data-action="calculator"]')?.addEventListener(
			"click",
			() => this.toggleCalculator(),
		);

		this.sidebarElement = this.querySelector('[data-role="sidebar"]');
		this.contentElement = this.querySelector('[data-role="content"]');
		this.applyDocumentLocale();
		this.applyInitialSidebarState();
		this.contentElement?.addEventListener("click", this.handleContentClick);

		this.querySelector('[data-action="home"]')?.addEventListener(
			"click",
			() => {
				void this.goToCover();
			},
		);
		this.querySelector('[data-action="menu"]')?.addEventListener(
			"click",
			() => {
				this.menu = !this.menu;
				this.applyMenuState();
			},
		);
		this.querySelector('[data-action="code"]')?.addEventListener(
			"click",
			() => {
				void this.toggleSourceMode();
			},
		);
	}

	private toggleCalculator(): void {
		if (!this.calculatorDrawer) {
			const drawer = new TpDrawer();
			drawer.setAttribute("label", "Calculator");
			drawer.setAttribute("placement", "end");
			drawer.setAttribute("width", "min(52rem, 100vw)");
			drawer.dataset.role = "calculator-drawer";
			drawer.setContent(document.createElement("tp-calculator"));
			this.append(drawer);
			this.calculatorDrawer = drawer;
		}
		if (this.calculatorDrawer.hasAttribute("open"))
			this.calculatorDrawer.hide();
		else this.calculatorDrawer.show();
	}

	private applyInitialSidebarState(): void {
		this.applyMenuState();
	}

	private applyMenuState(): void {
		const layout = this.querySelector(".tp-markup-multi-pages");
		if (layout === null) return;

		layout.toggleAttribute("sidebar-open", this.menu);
	}

	private async loadSidebar(): Promise<void> {
		if (this.sidebarElement === null) return;

		const sidebar = await this.fetchSpecialPage("sidebar");
		if (sidebar === null) {
			this.sidebarElement.innerHTML = "<p>Sidebar not found.</p>";
			this.pageLinks = [];
			return;
		}

		const { href, source } = sidebar;
		this.pageLinks = this.extractSidebarPageLinksFromMarkdown(source);
		this.sidebarElement.innerHTML = await this.renderSourceToHtml(source, href);
		if (this.pageLinks.length === 0) {
			this.pageLinks = this.extractSidebarPageLinks(this.sidebarElement);
		}
		this.wrapSidebarListWithTree(this.sidebarElement);
		this.rewriteSidebarLinks(this.sidebarElement);
	}

	private wrapSidebarListWithTree(root: HTMLElement): void {
		let container: HTMLElement = root;
		let topLevelLists = Array.from(container.children).filter((child) => {
			return (
				child instanceof HTMLUListElement || child instanceof HTMLOListElement
			);
		});

		if (topLevelLists.length === 0) {
			const nestedList = root.querySelector("ul, ol");
			if (nestedList?.parentElement instanceof HTMLElement) {
				container = nestedList.parentElement;
				topLevelLists = Array.from(container.children).filter((child) => {
					return (
						child instanceof HTMLUListElement ||
						child instanceof HTMLOListElement
					);
				});
			}
		}

		const firstList = topLevelLists[0];
		if (
			!(firstList instanceof HTMLUListElement) &&
			!(firstList instanceof HTMLOListElement)
		)
			return;
		const insertionAnchor = firstList;

		const tree = document.createElement("tp-tree");
		tree.className = "tp-markup-multi-pages-sidebar-tree";
		tree.setAttribute("guides", "");
		tree.setAttribute("level", "2");
		this.configureSidebarTree(tree);
		for (const list of topLevelLists) {
			tree.append(list);
		}

		const controls = this.createSidebarTreeControls(tree);
		const insertionPoint =
			insertionAnchor instanceof Element &&
			insertionAnchor.parentElement === container
				? insertionAnchor
				: null;
		container.insertBefore(controls, insertionPoint);
		container.insertBefore(tree, insertionPoint);
	}

	private createSidebarTreeControls(tree: TpTree): HTMLElement {
		const controls = document.createElement("div");
		const expandButton = this.createSidebarTreeButton(
			"arrow-expand-vertical",
			"Expand all",
			() => {
				tree.expandAll();
			},
		);
		const collapseButton = this.createSidebarTreeButton(
			"arrow-collapse-vertical",
			"Collapse all",
			() => {
				tree.collapseAll();
			},
		);
		controls.className = "tp-markup-multi-pages-sidebar-controls";
		controls.append(expandButton, collapseButton);
		return controls;
	}

	private createSidebarTreeButton(
		name: string,
		label: string,
		onClick: () => void,
	): HTMLElement {
		const button = document.createElement("tp-icon-button");
		button.setAttribute("name", name);
		button.setAttribute("label", label);
		button.addEventListener("click", onClick);
		return button;
	}

	private configureSidebarTree(tree: TpTree): void {
		tree.setContextMenuConfig({
			globalActions: [],
			getNodeActions: (target) => {
				if (!target.hasChildren) {
					return [];
				}

				return [
					{
						id: "expand",
						label: "Expand",
						disabled: target.expanded,
					},
					{
						id: "collapse",
						label: "Collapse",
						disabled: !target.expanded,
					},
				];
			},
		});
	}

	private async navigate(href: string, force = false): Promise<void> {
		const content = this.contentElement;
		if (content === null) return;

		const { href: documentHref, fragment } = this.splitHrefFragment(
			this.resolveDocumentHref(href),
		);
		if (!force && this.currentHref === documentHref && !this.sourceMode) {
			this.scrollToFragment(fragment);
			return;
		}
		if (this.navigatingHref === documentHref) return;

		this.navigatingHref = documentHref;
		this.annotations?.setPage("");
		try {
			const source = await this.fetchText(documentHref);

			if (source === null) {
				await this.renderNotFoundPage(documentHref);
				return;
			}

			this.currentHref = documentHref;
			this.currentSource = source;
			this.sourceMode = false;

			await this.ensureLanguageRenderer(this.detectLanguage(documentHref));
			this.updateDocumentMetadata(documentHref, source);
			content.replaceChildren(this.createMarkupViewer(documentHref, source));
			this.annotations?.setPage(
				new URL(documentHref, this.ownerDocument.baseURI).href,
			);
			this.renderPageNavigation(documentHref);
			this.scrollToFragmentAfterRender(fragment);
			this.updateCurrentLink(documentHref);
		} finally {
			if (this.navigatingHref === documentHref) {
				this.navigatingHref = "";
			}
		}
	}

	private async renderNotFoundPage(href: string): Promise<void> {
		const content = this.contentElement;
		if (content === null) return;

		const template = await this.fetchSpecialPage("page-not-found");
		const source =
			template?.source.replaceAll("{{ href }}", href) ??
			this.createDefaultNotFoundSource(href);
		const templateHref = template?.href ?? this.notFoundHref;

		this.currentHref = href;
		this.currentSource = source;
		this.sourceMode = false;

		await this.ensureLanguageRenderer(this.detectLanguage(templateHref));
		this.updateDocumentMetadata(href, source);
		content.replaceChildren(
			this.createInlineMarkupViewer(templateHref, source),
		);
		this.updateCurrentLink(href);
	}

	private async toggleSourceMode(): Promise<void> {
		const content = this.contentElement;
		if (content === null || this.currentHref === "") return;

		this.sourceMode = !this.sourceMode;
		this.annotations?.setPage("");

		if (this.sourceMode) {
			if (this.currentSource === "") {
				this.currentSource = (await this.fetchText(this.currentHref)) ?? "";
			}
			const markdownViewer = document.createElement("tp-markdown");
			const inlineScript = document.createElement("script");
			inlineScript.type = "tp/markdown";
			inlineScript.textContent = wrapAsSourceCodeBlock(
				this.currentSource,
				this.getSourceLanguage(this.currentHref),
			);
			markdownViewer.append(inlineScript);
			if (this.detectLanguage(this.currentHref) === "restructuredtext") {
				markdownViewer.addEventListener(
					"tp-markdown-rendered",
					() => {
						const code = markdownViewer.querySelector<HTMLElement>("pre code");
						if (code === null) return;
						code.innerHTML = highlightRestructuredTextSource(
							this.currentSource,
						);
						code.classList.remove("language-plaintext");
						code.classList.add("hljs", "language-restructuredtext");
						code.dataset.highlightRendered = "true";
					},
					{ once: true },
				);
			}
			content.replaceChildren(markdownViewer);
			return;
		}

		content.replaceChildren(
			this.createMarkupViewer(this.currentHref, this.currentSource),
		);
		this.renderPageNavigation(this.currentHref);
		this.annotations?.setPage(
			new URL(this.currentHref, this.ownerDocument.baseURI).href,
		);
	}

	private createMarkupViewer(href: string, source?: string): HTMLElement {
		const language = this.detectLanguage(href);

		if (language === "html") {
			const htmlViewer = document.createElement("div");
			htmlViewer.className = "tp-markup-multi-pages-html-output";
			htmlViewer.innerHTML = source ?? "";
			htmlViewer.setAttribute("data-tp-markup-multi-pages-rendered", "");
			return htmlViewer;
		}

		const viewer = document.createElement(this.getViewerTagName(language));
		viewer.setAttribute("src", href);
		return viewer;
	}

	private createInlineMarkupViewer(href: string, source: string): HTMLElement {
		const language = this.detectLanguage(href);

		if (language === "html") {
			const htmlViewer = document.createElement("div");
			htmlViewer.className = "tp-markup-multi-pages-html-output";
			htmlViewer.innerHTML = source;
			htmlViewer.setAttribute("data-tp-markup-multi-pages-rendered", "");
			return htmlViewer;
		}

		const viewer = document.createElement(this.getViewerTagName(language));
		const inlineScript = document.createElement("script");
		inlineScript.type = this.getInlineScriptType(language);
		inlineScript.textContent = source;
		viewer.append(inlineScript);
		return viewer;
	}

	private async renderSourceToHtml(
		source: string,
		href: string,
	): Promise<string> {
		const language = this.detectLanguage(href);

		if (language === "html") return source;
		if (language === "asciidoc") {
			const { renderAsciidocToHtml } = await import("../asciidoc/asciidoc.js");
			return renderAsciidocToHtml(source);
		}
		if (language === "restructuredtext") {
			const { renderRestructuredTextToHtml } = await import(
				"../restructuredtext/restructuredtext.js"
			);
			return renderRestructuredTextToHtml(source);
		}
		const { renderMarkdownToHtml } = await import("../markdown/markdown.js");
		return renderMarkdownToHtml(source, href);
	}

	private async ensureLanguageRenderer(
		language: TpMarkupMultiPagesLanguage,
	): Promise<void> {
		if (language === "html") return;
		if (language === "asciidoc") {
			await import("../asciidoc/asciidoc.js");
			return;
		}
		if (language === "restructuredtext") {
			await import("../restructuredtext/restructuredtext.js");
			return;
		}
		await import("../markdown/markdown.js");
	}

	private updateDocumentMetadata(href: string, source: string): void {
		if (
			this.isConnected &&
			this.ownerDocument.querySelector("tp-markup-multi-pages") !== this
		)
			return;

		const title = this.extractDocumentTitle(href, source);
		const siteLabel = this.label.trim();
		this.ownerDocument.title =
			siteLabel !== "" && title !== siteLabel
				? `${title} · ${siteLabel}`
				: title;

		this.setDocumentMeta(
			"description",
			this.extractDocumentDescription(source, title),
		);
	}

	private setDocumentMeta(name: string, content: string): void {
		let meta = this.ownerDocument.head.querySelector<HTMLMetaElement>(
			`meta[name="${name}"]`,
		);
		if (meta === null) {
			meta = this.ownerDocument.createElement("meta");
			meta.name = name;
			meta.dataset.tpMarkupMultiPages = "";
			this.ownerDocument.head.append(meta);
		}
		meta.content = content;
	}

	private extractDocumentTitle(href: string, source: string): string {
		const language = this.detectLanguage(href);
		if (language === "html") {
			const document = new DOMParser().parseFromString(source, "text/html");
			const title =
				document.querySelector("h1")?.textContent?.trim() ||
				document.querySelector("title")?.textContent?.trim();
			if (title) return title;
		} else if (language === "asciidoc") {
			const title = /^=\s+(.+)$/m.exec(source)?.[1]?.trim();
			if (title) return this.cleanDocumentTitle(title);
		} else if (language === "restructuredtext") {
			const lines = source.split(/\r?\n/);
			const index = lines.findIndex(
				(line, position) => position > 0 && /^[=\-~^+]{3,}\s*$/.test(line),
			);
			const title = index > 0 ? lines[index - 1]?.trim() : "";
			if (title) return this.cleanDocumentTitle(title);
		} else {
			const title = /^#\s+(.+)$/m.exec(source)?.[1]?.trim();
			if (title) return this.cleanDocumentTitle(title);
		}

		const filename =
			href.split(/[?#]/, 1)[0]?.split("/").filter(Boolean).at(-1) ?? "";
		return (
			filename
				.replace(/\.[^.]+$/, "")
				.replaceAll(/[-_]+/g, " ")
				.trim() ||
			this.label.trim() ||
			"Documentation"
		);
	}

	private cleanDocumentTitle(value: string): string {
		const parsed = new DOMParser().parseFromString(value, "text/html");
		return (parsed.body.textContent ?? value)
			.replace(/!\[[^\]]*]\([^)]+\)/g, " ")
			.replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
			.replace(/[*_~`]/g, "")
			.replace(/\s+/g, " ")
			.trim();
	}

	private extractDocumentDescription(source: string, title: string): string {
		const text = source
			.replace(/<script\b[\s\S]*?<\/script>/gi, " ")
			.replace(/<style\b[\s\S]*?<\/style>/gi, " ")
			.replace(/<[^>]+>/g, " ")
			.replace(/^\s*(?:[#=*`>|:+\-.]+|\.\.\s+\w+::).*$/gm, " ")
			.replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
			.replace(/[*_~`]/g, "")
			.replace(/\s+/g, " ")
			.trim();
		const description = text === "" ? title : text;
		return description.length > 160
			? `${description.slice(0, 157).trimEnd()}…`
			: description;
	}

	private detectLanguage(href: string): TpMarkupMultiPagesLanguage {
		if (this.fixedLanguage !== null) return this.fixedLanguage;
		const path = href.split(/[?#]/, 1)[0]?.toLowerCase() ?? "";

		if (path.endsWith(".html") || path.endsWith(".htm")) return "html";
		if (path.endsWith(".adoc") || path.endsWith(".asciidoc")) return "asciidoc";
		if (path.endsWith(".rst") || path.endsWith(".rest"))
			return "restructuredtext";
		return "markdown";
	}

	private getViewerTagName(language: TpMarkupMultiPagesLanguage): string {
		if (language === "asciidoc") return "tp-asciidoc";
		if (language === "restructuredtext") return "tp-restructuredtext";
		return "tp-markdown";
	}

	private getInlineScriptType(language: TpMarkupMultiPagesLanguage): string {
		if (language === "asciidoc") return "tp/asciidoc";
		if (language === "restructuredtext") return "tp/restructuredtext";
		return "tp/markdown";
	}

	private getRenderedAttribute(language: TpMarkupMultiPagesLanguage): string {
		if (language === "asciidoc") return "data-tp-asciidoc-rendered";
		if (language === "restructuredtext")
			return "data-tp-restructuredtext-rendered";
		if (language === "html") return "data-tp-markup-multi-pages-rendered";
		return "data-tp-markdown-rendered";
	}

	private getRenderedEvent(language: TpMarkupMultiPagesLanguage): string {
		if (language === "asciidoc") return "tp-asciidoc-rendered";
		if (language === "restructuredtext") return "tp-restructuredtext-rendered";
		if (language === "html") return "tp-markup-multi-pages-rendered";
		return "tp-markdown-rendered";
	}

	private getOutputSelector(language: TpMarkupMultiPagesLanguage): string {
		if (language === "asciidoc") return ":scope > .tp-asciidoc-output";
		if (language === "restructuredtext")
			return ":scope > .tp-restructuredtext-output";
		if (language === "html") return ":scope";
		return ":scope > .tp-markdown-output";
	}

	private getSourceLanguage(href: string): string {
		const language = this.detectLanguage(href);
		if (language === "restructuredtext") return "plaintext";
		if (language === "asciidoc") return "asciidoc";
		if (language === "html") return "html";
		return "markdown";
	}

	private extractSidebarPageLinks(
		root: ParentNode,
	): TpMarkupMultiPagesPageLink[] {
		const links: TpMarkupMultiPagesPageLink[] = [];
		const seen = new Set<string>();

		for (const link of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
			const href = link.getAttribute("href") ?? "";
			if (!this.shouldHandleDocumentHref(href)) continue;

			const { href: resolvedHref } = this.splitHrefFragment(
				this.resolveDocumentHref(href, this.repositoryBasePath),
			);
			if (seen.has(resolvedHref)) continue;

			const title = link.textContent?.replace(/\s+/g, " ").trim() ?? "";
			if (title === "") continue;

			seen.add(resolvedHref);
			links.push({
				href: resolvedHref,
				level: this.readSidebarLinkLevel(link),
				title,
			});
		}

		return links;
	}

	private extractSidebarPageLinksFromMarkdown(
		source: string,
	): TpMarkupMultiPagesPageLink[] {
		const links: TpMarkupMultiPagesPageLink[] = [];
		const seen = new Set<string>();
		const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

		for (const line of source.split(/\r?\n/)) {
			for (const match of line.matchAll(linkPattern)) {
				const rawTitle = match[1] ?? "";
				const rawHref = match[2] ?? "";
				if (!this.shouldHandleDocumentHref(rawHref)) continue;

				const { href: resolvedHref } = this.splitHrefFragment(
					this.resolveDocumentHref(rawHref, this.repositoryBasePath),
				);
				if (seen.has(resolvedHref)) continue;

				const title = this.cleanSidebarMarkdownLabel(rawTitle);
				if (title === "") continue;

				seen.add(resolvedHref);
				links.push({
					href: resolvedHref,
					level: this.readSidebarMarkdownLevel(line),
					title,
				});
			}
		}

		return links;
	}

	private cleanSidebarMarkdownLabel(label: string): string {
		return label
			.replace(/[*_~`]/g, "")
			.replace(/<[^>]+>/g, "")
			.replace(/\s+/g, " ")
			.trim();
	}

	private readSidebarMarkdownLevel(line: string): number {
		const indent = line.match(/^\s*/)?.[0].length ?? 0;
		return Math.floor(indent / 2) + 1;
	}

	private readSidebarLinkLevel(link: HTMLAnchorElement): number {
		let level = 0;
		let current: Element | null = link;

		while (current !== null && current !== this.sidebarElement) {
			if (
				current instanceof HTMLUListElement ||
				current instanceof HTMLOListElement
			) {
				level += 1;
			}
			current = current.parentElement;
		}

		return Math.max(level, 1);
	}

	private renderPageNavigation(href: string): void {
		this.pageNavigationElement?.remove();
		this.pageNavigationElement = null;

		const navigation = this.createPageNavigation(href);
		if (navigation === null) {
			return;
		}

		this.pageNavigationElement = navigation;

		const viewer = this.contentElement?.querySelector<HTMLElement>(
			"tp-markdown, tp-asciidoc, tp-restructuredtext, .tp-markup-multi-pages-html-output",
		);
		if (!(viewer instanceof HTMLElement)) {
			this.contentElement?.append(navigation);
			return;
		}

		const language = this.detectLanguage(this.currentHref);
		if (viewer.hasAttribute(this.getRenderedAttribute(language))) {
			this.appendPageNavigationToMultiPages(viewer, navigation, language);
			return;
		}

		viewer.addEventListener(
			this.getRenderedEvent(language),
			() => {
				this.appendPageNavigationToMultiPages(viewer, navigation, language);
			},
			{ once: true },
		);
	}

	private appendPageNavigationToMultiPages(
		viewer: HTMLElement,
		navigation: HTMLElement,
		language = this.detectLanguage(this.currentHref),
	): void {
		const output = viewer.querySelector<HTMLElement>(
			this.getOutputSelector(language),
		);
		if (output instanceof HTMLElement) {
			output.append(navigation);
			return;
		}

		viewer.append(navigation);
	}

	private createPageNavigation(href: string): HTMLElement | null {
		const { href: currentPageHref } = this.splitHrefFragment(
			this.resolveDocumentHref(href),
		);
		const index = this.pageLinks.findIndex(
			(link) => link.href === currentPageHref,
		);
		if (index === -1) {
			return null;
		}

		const previous = this.pageLinks[index - 1] ?? null;
		const current = this.pageLinks[index] ?? null;
		const next = this.pageLinks[index + 1] ?? null;
		if (current === null || (previous === null && next === null)) {
			return null;
		}

		const nav = document.createElement("nav");
		nav.className = "tp-markup-multi-pages-page-nav";
		nav.setAttribute("aria-label", "Page navigation");

		nav.append(
			this.createPageNavigationLink(previous, "previous"),
			this.createPageNavigationTopButton(current),
			this.createPageNavigationLink(next, "next"),
		);

		return nav;
	}

	private createPageNavigationTopButton(
		page: TpMarkupMultiPagesPageLink,
	): HTMLElement {
		const wrapper = document.createElement("span");
		wrapper.className =
			"tp-markup-multi-pages-page-nav-item tp-markup-multi-pages-page-nav-top";

		const button = document.createElement("button");
		button.type = "button";
		button.className = "tp-markup-multi-pages-page-nav-link";
		button.dataset.direction = "top";
		button.addEventListener("click", () => {
			this.contentElement?.scrollTo({ top: 0, behavior: "smooth" });
		});

		const meta = document.createElement("span");
		meta.className = "tp-markup-multi-pages-page-nav-meta";
		meta.textContent = "Top";

		const title = document.createElement("span");
		title.className = "tp-markup-multi-pages-page-nav-title";
		title.textContent = page.title;

		button.append(meta, title);
		wrapper.append(button);
		return wrapper;
	}

	private createPageNavigationLink(
		page: TpMarkupMultiPagesPageLink | null,
		direction: "previous" | "next",
	): HTMLElement {
		const wrapper = document.createElement("span");
		wrapper.className = `tp-markup-multi-pages-page-nav-item tp-markup-multi-pages-page-nav-${direction}`;

		if (page === null) {
			wrapper.setAttribute("aria-hidden", "true");
			return wrapper;
		}

		const link = document.createElement("a");
		link.href = `#/${this.stripRepository(page.href)}`;
		link.className = "tp-markup-multi-pages-page-nav-link";
		link.dataset.direction = direction;

		const meta = document.createElement("span");
		meta.className = "tp-markup-multi-pages-page-nav-meta";
		meta.textContent = direction === "previous" ? "Previous" : "Next";

		const title = document.createElement("span");
		title.className = "tp-markup-multi-pages-page-nav-title";
		title.textContent = page.title;

		link.append(meta, title);
		wrapper.append(link);
		return wrapper;
	}

	private rewriteSidebarLinks(root: ParentNode): void {
		for (const link of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
			const href = link.getAttribute("href") ?? "";
			if (href === "" || !this.shouldHandleDocumentHref(href)) continue;
			const resolved = this.resolveDocumentHref(href, this.repositoryBasePath);
			link.setAttribute("href", `#/${this.stripRepository(resolved)}`);

			link.addEventListener("click", (event) => {
				event.preventDefault();
				this.goTo(resolved, this.repositoryBasePath);
			});
		}
	}

	private updateCurrentLink(href: string): void {
		const normalized = this.resolveDocumentHref(href);
		for (const link of this.querySelectorAll<HTMLAnchorElement>(
			".tp-markup-multi-pages-sidebar a[href]",
		)) {
			const linkHref = this.resolveDocumentHref(
				link.getAttribute("href") ?? "",
			);
			if (linkHref === normalized) {
				link.setAttribute("aria-current", "page");
			} else {
				link.removeAttribute("aria-current");
			}
		}
	}

	private goTo(href: string, baseHref = this.currentHref): void {
		const resolved = this.resolveDocumentHref(href, baseHref);
		const hash = `#/${this.stripRepository(resolved)}`;

		if (window.location.hash === hash) {
			void this.navigate(resolved, true);
			return;
		}

		window.location.hash = hash;
	}

	private goToCurrentFragment(fragment: string): void {
		const currentHref =
			this.currentHref !== "" ? this.currentHref : this.readCurrentHref();
		if (currentHref === null || currentHref === "") {
			return;
		}

		const { href } = this.splitHrefFragment(currentHref);
		const hash = `#/${this.stripRepository(href)}${fragment}`;

		if (window.location.hash === hash) {
			this.scrollToFragment(fragment);
			return;
		}

		window.location.hash = hash;
	}

	private handleHashChange = (): void => {
		const href = this.readCurrentHref();
		if (href === null || href === "") {
			void this.navigateToCover();
			return;
		}
		void this.navigate(href);
	};

	private async navigateToCover(): Promise<void> {
		await this.navigate(
			(await this.resolveSpecialPageHref("cover")) ?? this.coverHref,
		);
	}

	private async goToCover(): Promise<void> {
		this.goTo((await this.resolveSpecialPageHref("cover")) ?? this.coverHref);
	}

	private handleContentClick = (event: MouseEvent): void => {
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		const target = event.target;
		if (!(target instanceof Element)) return;

		const link = target.closest<HTMLAnchorElement>("a[href]");
		if (
			link === null ||
			this.contentElement === null ||
			!this.contentElement.contains(link)
		) {
			return;
		}

		const href = link.getAttribute("href") ?? "";
		if (this.isHashOnlyHref(href)) {
			event.preventDefault();
			this.goToCurrentFragment(href);
			return;
		}

		if (!this.shouldHandleDocumentLink(link, href)) return;

		event.preventDefault();
		this.goTo(href, this.currentHref);
	};

	private readCurrentHref(): string | null {
		if (!window.location.hash.startsWith("#/")) return null;
		return this.normalizeHref(window.location.hash.slice(2));
	}

	private resolveDocumentHref(
		href: string,
		baseHref = this.repositoryBasePath,
	): string {
		const relativeHref = this.resolveRelativeHref(href, baseHref);
		const { href: relativePath, fragment } =
			this.splitHrefFragment(relativeHref);
		const normalizedHref = this.normalizeHref(relativePath);
		const repository = this.normalizeHref(this.repositoryBasePath);

		if (href.startsWith("/") && !this.isRepositoryHref(href)) {
			return relativeHref;
		}

		if (normalizedHref === repository)
			return `${this.repositoryBasePath}${fragment}`;
		if (normalizedHref.startsWith(`${repository}/`))
			return `/${normalizedHref}${fragment}`;

		return `${this.repositoryBasePath}${normalizedHref}${fragment}`;
	}

	private stripRepository(href: string): string {
		const { href: path, fragment } = this.splitHrefFragment(href);
		const normalizedHref = this.normalizeHref(path);
		const repository = this.normalizeHref(this.repositoryBasePath);

		if (normalizedHref === repository) return fragment === "" ? "" : fragment;
		if (normalizedHref.startsWith(`${repository}/`)) {
			return `${normalizedHref.slice(repository.length + 1)}${fragment}`;
		}
		return `${normalizedHref}${fragment}`;
	}

	private normalizeHref(href: string): string {
		return href
			.replace(/^#\//, "")
			.replace(/^\.\//, "")
			.replace(/^\/+/, "")
			.replace(/\/+$/, "");
	}

	private async fetchText(href: string): Promise<string | null> {
		try {
			const response = await fetch(href, { cache: "no-store" });
			if (!response.ok) return null;
			const source = await response.text();
			if (this.isHtmlFallbackResponse(href, response, source)) return null;
			return source;
		} catch {
			return null;
		}
	}

	private isHtmlFallbackResponse(
		href: string,
		response: Response,
		source: string,
	): boolean {
		const path = href.split(/[?#]/, 1)[0] ?? href;
		const lowerPath = path.toLowerCase();

		const contentType = response.headers?.get("content-type") ?? "";
		if (!contentType.toLowerCase().includes("text/html")) return false;

		const isHtmlDocument = /<(?:!doctype\s+html|html|head|body)\b/i.test(
			source,
		);
		if (!isHtmlDocument) return false;

		if (
			lowerPath.endsWith(".md") ||
			lowerPath.endsWith(".adoc") ||
			lowerPath.endsWith(".asciidoc") ||
			lowerPath.endsWith(".rst") ||
			lowerPath.endsWith(".rest")
		) {
			return true;
		}

		if (!lowerPath.endsWith(".html") && !lowerPath.endsWith(".htm")) {
			return false;
		}

		return this.isLikelyApplicationShell(source);
	}

	private isLikelyApplicationShell(source: string): boolean {
		return (
			/<script\b[^>]+src=["'][^"']*(?:tp-loader|\/src\/)/i.test(source) ||
			/\bimport\s*\(?\s*["'][^"']*(?:tp-loader|\/src\/)/i.test(source) ||
			/<tp-(?:markup|markdown|asciidoc|restructuredtext|html)-multi-pages\b/i.test(
				source,
			)
		);
	}

	private isExternalHref(href: string): boolean {
		return (
			/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(href) ||
			/^[a-z][a-z\d+.-]*:/i.test(href)
		);
	}

	private shouldHandleDocumentLink(
		link: HTMLAnchorElement,
		href: string,
	): boolean {
		if (!this.shouldHandleDocumentHref(href)) return false;

		if (link.hasAttribute("download")) return false;

		const target = link.getAttribute("target");
		return target === null || target === "" || target === "_self";
	}

	private shouldHandleDocumentHref(href: string): boolean {
		if (href === "" || this.isHashOnlyHref(href) || this.isExternalHref(href)) {
			return false;
		}

		return !href.startsWith("/") || this.isRepositoryHref(href);
	}

	private isHashOnlyHref(href: string): boolean {
		return href.startsWith("#") && !href.startsWith("#/");
	}

	private resolveRelativeHref(href: string, baseHref: string): string {
		if (
			href.startsWith("/") ||
			href.startsWith("#/") ||
			this.isHashOnlyHref(href) ||
			this.isExternalHref(href)
		) {
			return href;
		}

		const basePath = baseHref.split(/[?#]/, 1)[0] ?? this.repositoryBasePath;
		const url = new URL(href, `https://tp.local${basePath}`);

		return `${url.pathname}${url.search}${url.hash}`;
	}

	private splitHrefFragment(href: string): { href: string; fragment: string } {
		const index = href.indexOf("#", href.startsWith("#/") ? 2 : 0);
		if (index === -1) {
			return { href, fragment: "" };
		}

		return {
			href: href.slice(0, index),
			fragment: href.slice(index),
		};
	}

	private scrollToFragmentAfterRender(fragment: string): void {
		if (fragment === "") return;

		const viewer = this.contentElement?.querySelector<HTMLElement>(
			"tp-markdown, tp-asciidoc, tp-restructuredtext, .tp-markup-multi-pages-html-output",
		);
		if (!(viewer instanceof HTMLElement)) {
			this.scrollToFragment(fragment);
			return;
		}

		const language = this.detectLanguage(this.currentHref);
		if (viewer.hasAttribute(this.getRenderedAttribute(language))) {
			this.scrollToFragment(fragment);
			return;
		}

		viewer.addEventListener(
			this.getRenderedEvent(language),
			() => {
				this.scrollToFragment(fragment);
			},
			{ once: true },
		);
	}

	private scrollToFragment(fragment: string): void {
		if (fragment === "") return;

		const id = decodeURIComponent(fragment.slice(1));
		const target = this.contentElement?.querySelector<HTMLElement>(
			`#${this.escapeCssIdentifier(id)}`,
		);
		target?.scrollIntoView?.({ block: "start" });
	}

	private escapeCssIdentifier(value: string): string {
		return typeof CSS !== "undefined" && typeof CSS.escape === "function"
			? CSS.escape(value)
			: value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
	}

	private isRepositoryHref(href: string): boolean {
		const normalizedHref = this.normalizeHref(href);
		const repository = this.normalizeHref(this.repositoryBasePath);

		return (
			normalizedHref === repository ||
			normalizedHref.startsWith(`${repository}/`)
		);
	}

	private applyTheme(): void {
		const theme = this.theme;

		if (this.getAttribute("theme") !== theme) {
			this.setAttribute("theme", theme);
		}

		const root = this.querySelector<HTMLElement>(".tp-markup-multi-pages");
		if (root !== null) {
			root.dataset.theme = theme;
		}
	}

	private applyBrand(): void {
		this.style.setProperty("--tp-markup-multi-pages-brand", this.brand);
		const input = this.querySelector<HTMLInputElement>('[data-role="brand"]');
		if (input !== null) {
			input.value = this.brand;
		}
	}

	private get repositoryBasePath(): string {
		const normalizedRepository = this.normalizeHref(this.repository);
		return normalizedRepository === "" ? "/" : `/${normalizedRepository}/`;
	}

	private get coverHref(): string {
		return `${this.repositoryBasePath}cover.${this.preferredExtension}`;
	}

	private get notFoundHref(): string {
		return `${this.repositoryBasePath}page-not-found.${this.preferredExtension}`;
	}

	private get preferredExtension(): string {
		if (this.fixedLanguage === "html") return "html";
		if (this.fixedLanguage === "asciidoc") return "adoc";
		if (this.fixedLanguage === "restructuredtext") return "rst";
		return "md";
	}

	private createDefaultNotFoundSource(href: string): string {
		const language =
			this.fixedLanguage ?? this.detectLanguage(this.notFoundHref);
		if (language === "html")
			return `<h1>Page not found</h1><p>The requested page could not be loaded: <code>${escapeHtml(href)}</code></p>`;
		if (language === "asciidoc")
			return `= Page not found\n\nThe requested page could not be loaded: \`${href}\``;
		if (language === "restructuredtext")
			return `Page not found\n==============\n\nThe requested page could not be loaded: \`${href}\``;
		return `# Page not found\n\nThe requested page could not be loaded \`${href}\``;
	}

	private async fetchSpecialPage(
		name: "cover" | "sidebar" | "page-not-found",
	): Promise<{ href: string; source: string } | null> {
		for (const href of this.getSpecialPageHrefs(name)) {
			const source = await this.fetchText(href);
			if (source !== null) return { href, source };
		}

		return null;
	}

	private async resolveSpecialPageHref(
		name: "cover" | "sidebar" | "page-not-found",
	): Promise<string | null> {
		return (await this.fetchSpecialPage(name))?.href ?? null;
	}

	private getSpecialPageHrefs(
		name: "cover" | "sidebar" | "page-not-found",
	): string[] {
		const extensions =
			this.fixedLanguage === "html"
				? ["html", "htm"]
				: this.fixedLanguage === "asciidoc"
					? ["adoc", "asciidoc"]
					: this.fixedLanguage === "restructuredtext"
						? ["rst", "rest"]
						: this.fixedLanguage === "markdown"
							? ["md", "markdown"]
							: ["md", "html", "adoc", "asciidoc", "rst", "rest"];
		return extensions.map((extension) => {
			return `${this.repositoryBasePath}${name}.${extension}`;
		});
	}
}

if (!customElements.get("tp-markup-multi-pages")) {
	customElements.define("tp-markup-multi-pages", TpMarkupMultiPages);
}
