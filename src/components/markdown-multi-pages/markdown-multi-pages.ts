/**
 * @module components/markdown-multi-pages
 * @summary Multi-page Markdown documentation.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
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
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
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
import "../icon-button/icon-button.js";
import "../clock/clock.js";
import "../color/color.js";
import "../lang/lang.js";
import "../source/source.js";
import "../fullscreen/fullscreen.js";
import "../theme/theme.js";
import "../tree/tree.js";
import "../splitter/splitter.js";
import "../markdown/markdown.js";
import { resolveTextDirection } from "../../utilities/text-direction.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import type { TpTree } from "../tree/tree.js";
import style from "./markdown-multi-pages.css?inline";
import type {
	TpMarkdownMultiPagesPageLink,
	TpMarkdownMultiPagesTheme,
} from "./markdown-multi-pages.types.js";

const STYLE_ID = "tp-markdown-multi-pages-styles";

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function wrapAsMarkdownCodeBlock(source: string): string {
	const fenceRuns = source.match(/`{3,}/g) ?? [];
	const longestFence = fenceRuns.reduce(
		(max, run) => Math.max(max, run.length),
		2,
	);
	const fence = "`".repeat(longestFence + 1);
	return `${fence}markdown\n${source}\n${fence}`;
}

/**
 * @summary Multi-page Markdown documentation.
 * @tagname tp-markdown-multi-pages
 * @example
 * <tp-markdown-multi-pages></tp-markdown-multi-pages>
 */
export class TpMarkdownMultiPages extends TpBase {
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
	private currentSource = "";
	private navigatingHref = "";
	private sourceMode = false;
	private pageLinks: TpMarkdownMultiPagesPageLink[] = [];
	private pageNavigationElement: HTMLElement | null = null;

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-markdown-multi-pages-host");
		this.style.display = "block";
		this.style.position = "fixed";
		this.style.insetBlock = "0";
		this.style.insetInline = "0.5rem";
		this.style.width = "auto";
		this.style.height = "auto";
		this.style.boxSizing = "border-box";
		this.style.overflow = "hidden";
		this.ensureGlobalStyle(STYLE_ID, style);
		this.renderShell();
		// this.applyBrand();
		// this.applyTheme();
		void this.initialize();
		window.addEventListener("hashchange", this.handleHashChange);
	}

	public disconnectedCallback(): void {
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

	public get theme(): TpMarkdownMultiPagesTheme {
		const value = this.getAttribute("theme");
		if (value === "dark" || value === "auto") return value;
		return "light";
	}

	public set theme(value: TpMarkdownMultiPagesTheme) {
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
			".tp-markdown-multi-pages-toolbar-label",
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
		await this.loadSidebar();

		const initialHref = this.readCurrentHref();
		if (initialHref === null || initialHref === "") {
			await this.navigate(this.coverHref);
			return;
		}

		await this.navigate(initialHref);
	}

	private renderShell(): void {
		this.innerHTML = `
      <div class="tp-markdown-multi-pages-root">
        <tp-toolbar class="tp-markdown-multi-pages-toolbar" orientation="horizontal" placement="top">
          <tp-icon-button section="start" color="currentColor" data-action="home" name="home" label="Home"></tp-icon-button>
          <tp-icon-button section="start" color="currentColor" data-action="menu" name="menu" label="Menu"></tp-icon-button>
          <tp-source section="start" url="${escapeHtml(this.git)}"></tp-source>
          <tp-icon-button section="start" color="currentColor" data-action="code" name="code" label="Code"></tp-icon-button>
          <span class="tp-markdown-multi-pages-toolbar-label" section="center">${escapeHtml(this.label)}</span>
          <tp-clock section="end"></tp-clock>
          <tp-lang section="end" langs="${escapeHtml(this.langs)}"></tp-lang>
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
    `;

		this.sidebarElement = this.querySelector('[data-role="sidebar"]');
		this.contentElement = this.querySelector('[data-role="content"]');
		this.applyDocumentLocale();
		this.applyInitialSidebarState();
		this.contentElement?.addEventListener("click", this.handleContentClick);

		this.querySelector('[data-action="home"]')?.addEventListener(
			"click",
			() => {
				this.goTo(this.coverHref);
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

	private applyInitialSidebarState(): void {
		this.applyMenuState();
	}

	private applyMenuState(): void {
		const layout = this.querySelector(".tp-markdown-multi-pages");
		if (layout === null) return;

		layout.toggleAttribute("sidebar-open", this.menu);
	}

	private async loadSidebar(): Promise<void> {
		if (this.sidebarElement === null) return;

		const source = await this.fetchText(this.sidebarHref);
		if (source === null) {
			this.sidebarElement.innerHTML = "<p>Sidebar not found.</p>";
			this.pageLinks = [];
			return;
		}

		this.pageLinks = this.extractSidebarPageLinksFromMarkdown(source);
		this.sidebarElement.innerHTML = await renderMarkdownToHtml(
			source,
			"/sidebar.md",
		);
		if (this.pageLinks.length === 0) {
			this.pageLinks = this.extractSidebarPageLinks(this.sidebarElement);
		}
		this.wrapSidebarListWithTree(this.sidebarElement);
		this.rewriteSidebarLinks(this.sidebarElement);
	}

	private wrapSidebarListWithTree(root: HTMLElement): void {
		const topLevelLists = Array.from(root.children).filter((child) => {
			return (
				child instanceof HTMLUListElement || child instanceof HTMLOListElement
			);
		});

		const firstList = topLevelLists[0];
		if (
			!(firstList instanceof HTMLUListElement) &&
			!(firstList instanceof HTMLOListElement)
		)
			return;
		const insertionAnchor = firstList;

		const tree = document.createElement("tp-tree");
		tree.className = "tp-markdown-multi-pages-sidebar-tree";
		tree.setAttribute("guides", "");
		tree.setAttribute("level", "2");
		this.configureSidebarTree(tree);
		for (const list of topLevelLists) {
			tree.append(list);
		}

		const controls = this.createSidebarTreeControls(tree);
		const insertionPoint =
			insertionAnchor instanceof Element &&
			insertionAnchor.parentElement === root
				? insertionAnchor
				: null;
		root.insertBefore(controls, insertionPoint);
		root.insertBefore(tree, insertionPoint);
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
		const sortButton = this.createSidebarTreeButton(
			"sort-alphabetical-ascending",
			"Sort",
			() => {
				tree.sortAll();
			},
		);

		controls.className = "tp-markdown-multi-pages-sidebar-controls";
		controls.append(expandButton, collapseButton, sortButton);
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
					{
						id: "sort",
						label: "Sort",
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
		try {
			const source = await this.fetchText(documentHref);

			if (source === null) {
				await this.renderNotFoundPage(documentHref);
				return;
			}

			this.currentHref = documentHref;
			this.currentSource = source;
			this.sourceMode = false;

			content.replaceChildren(this.createMarkdownViewer(documentHref));
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

		const template = await this.fetchText(this.notFoundHref);
		const source =
			template?.replaceAll("{{ href }}", href) ??
			`# Page not found\n\nThe requested page could not be loaded \`${href}\``;

		this.currentHref = href;
		this.currentSource = source;
		this.sourceMode = false;

		const markdownViewer = document.createElement("tp-markdown");
		const inlineScript = document.createElement("script");
		inlineScript.type = "tp/markdown";
		inlineScript.textContent = source;
		markdownViewer.append(inlineScript);
		content.replaceChildren(markdownViewer);
		this.updateCurrentLink(href);
	}

	private async toggleSourceMode(): Promise<void> {
		const content = this.contentElement;
		if (content === null || this.currentHref === "") return;

		this.sourceMode = !this.sourceMode;

		if (this.sourceMode) {
			if (this.currentSource === "") {
				this.currentSource = (await this.fetchText(this.currentHref)) ?? "";
			}
			const markdownViewer = document.createElement("tp-markdown");
			const inlineScript = document.createElement("script");
			inlineScript.type = "tp/markdown";
			inlineScript.textContent = wrapAsMarkdownCodeBlock(this.currentSource);
			markdownViewer.append(inlineScript);
			content.replaceChildren(markdownViewer);
			return;
		}

		content.replaceChildren(this.createMarkdownViewer(this.currentHref));
		this.renderPageNavigation(this.currentHref);
	}

	private createMarkdownViewer(href: string): HTMLElement {
		const markdownViewer = document.createElement("tp-markdown");
		markdownViewer.setAttribute("src", href);
		return markdownViewer;
	}

	private extractSidebarPageLinks(
		root: ParentNode,
	): TpMarkdownMultiPagesPageLink[] {
		const links: TpMarkdownMultiPagesPageLink[] = [];
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
	): TpMarkdownMultiPagesPageLink[] {
		const links: TpMarkdownMultiPagesPageLink[] = [];
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

		const markdown = this.contentElement?.querySelector("tp-markdown");
		if (!(markdown instanceof HTMLElement)) {
			this.contentElement?.append(navigation);
			return;
		}

		if (markdown.hasAttribute("data-tp-markdown-rendered")) {
			this.appendPageNavigationToMarkdown(markdown, navigation);
			return;
		}

		markdown.addEventListener(
			"tp-markdown-rendered",
			() => {
				this.appendPageNavigationToMarkdown(markdown, navigation);
			},
			{ once: true },
		);
	}

	private appendPageNavigationToMarkdown(
		markdown: HTMLElement,
		navigation: HTMLElement,
	): void {
		const output = markdown.querySelector<HTMLElement>(
			":scope > .tp-markdown-output",
		);
		if (output instanceof HTMLElement) {
			output.append(navigation);
			return;
		}

		markdown.append(navigation);
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
		nav.className = "tp-markdown-multi-pages-page-nav";
		nav.setAttribute("aria-label", "Page navigation");

		nav.append(
			this.createPageNavigationLink(previous, "previous"),
			this.createPageNavigationTopButton(current),
			this.createPageNavigationLink(next, "next"),
		);

		return nav;
	}

	private createPageNavigationTopButton(
		page: TpMarkdownMultiPagesPageLink,
	): HTMLElement {
		const wrapper = document.createElement("span");
		wrapper.className =
			"tp-markdown-multi-pages-page-nav-item tp-markdown-multi-pages-page-nav-top";

		const button = document.createElement("button");
		button.type = "button";
		button.className = "tp-markdown-multi-pages-page-nav-link";
		button.dataset.direction = "top";
		button.addEventListener("click", () => {
			this.contentElement?.scrollTo({ top: 0, behavior: "smooth" });
		});

		const meta = document.createElement("span");
		meta.className = "tp-markdown-multi-pages-page-nav-meta";
		meta.textContent = "Top";

		const title = document.createElement("span");
		title.className = "tp-markdown-multi-pages-page-nav-title";
		title.textContent = page.title;

		button.append(meta, title);
		wrapper.append(button);
		return wrapper;
	}

	private createPageNavigationLink(
		page: TpMarkdownMultiPagesPageLink | null,
		direction: "previous" | "next",
	): HTMLElement {
		const wrapper = document.createElement("span");
		wrapper.className = `tp-markdown-multi-pages-page-nav-item tp-markdown-multi-pages-page-nav-${direction}`;

		if (page === null) {
			wrapper.setAttribute("aria-hidden", "true");
			return wrapper;
		}

		const link = document.createElement("a");
		link.href = `#/${this.stripRepository(page.href)}`;
		link.className = "tp-markdown-multi-pages-page-nav-link";
		link.dataset.direction = direction;

		const meta = document.createElement("span");
		meta.className = "tp-markdown-multi-pages-page-nav-meta";
		meta.textContent = direction === "previous" ? "Previous" : "Next";

		const title = document.createElement("span");
		title.className = "tp-markdown-multi-pages-page-nav-title";
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
			".tp-markdown-multi-pages-sidebar a[href]",
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
			void this.navigate(this.coverHref);
			return;
		}
		void this.navigate(href);
	};

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
		const markdownHref = href.replace(/\.html(?=($|[#?]))/i, ".md");
		const relativeHref = this.resolveRelativeHref(markdownHref, baseHref);
		const { href: relativePath, fragment } =
			this.splitHrefFragment(relativeHref);
		const normalizedHref = this.normalizeHref(relativePath);
		const repository = this.normalizeHref(this.repositoryBasePath);

		if (markdownHref.startsWith("/") && !this.isRepositoryHref(markdownHref)) {
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
		if (!path.toLowerCase().endsWith(".md")) return false;

		const contentType = response.headers?.get("content-type") ?? "";
		if (!contentType.toLowerCase().includes("text/html")) return false;

		return /<(?:!doctype\s+html|html|head|body)\b/i.test(source);
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

		const markdown = this.contentElement?.querySelector("tp-markdown");
		if (!(markdown instanceof HTMLElement)) {
			this.scrollToFragment(fragment);
			return;
		}

		markdown.addEventListener(
			"tp-markdown-rendered",
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

		const root = this.querySelector<HTMLElement>(".tp-markdown-multi-pages");
		if (root !== null) {
			root.dataset.theme = theme;
		}
	}

	private applyBrand(): void {
		this.style.setProperty("--tp-markdown-multi-pages-brand", this.brand);
		const input = this.querySelector<HTMLInputElement>('[data-role="brand"]');
		if (input !== null) {
			input.value = this.brand;
		}
	}

	private get repositoryBasePath(): string {
		const normalizedRepository = this.normalizeHref(this.repository);
		return normalizedRepository === "" ? "/" : `/${normalizedRepository}/`;
	}

	private get sidebarHref(): string {
		return `${this.repositoryBasePath}sidebar.md`;
	}

	private get coverHref(): string {
		return `${this.repositoryBasePath}cover.md`;
	}

	private get notFoundHref(): string {
		return `${this.repositoryBasePath}page-not-found.md`;
	}
}

if (!customElements.get("tp-markdown-multi-pages")) {
	customElements.define("tp-markdown-multi-pages", TpMarkdownMultiPages);
}
