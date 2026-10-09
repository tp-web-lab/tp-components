/**
 * @module components/toc
 * @summary Table of contents component rendered with `<tp-tree>`.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-tree
 * @summary Generic tree component for interactive hierarchical editing.
 */
// tp-docgen:dependencies:end

import style from "./toc.css?inline";

import "../tree/tree.js";
import { TpBase } from "../base/base.js";

type TpTocPosition = "start" | "end" | "center";

interface TocHeading {
	level: number;
	id: string;
	title: string;
}

interface TocTreeItem extends TocHeading {
	children: TocTreeItem[];
}

interface TpTreeElement extends HTMLElement {
	expandAll(): void;
}

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";

function isTpTocPosition(value: string): value is TpTocPosition {
	return value === "start" || value === "end" || value === "center";
}

function isTpTreeElement(value: Element): value is TpTreeElement {
	return typeof (value as Partial<TpTreeElement>).expandAll === "function";
}

/**
 * `<tp-toc>` renders the current page table of contents as a `<tp-tree>`.
 *
 * @summary Table of contents generated from page headings.
 * @tagname tp-toc
 * @attr {string} label = "Contents" - Visible summary label.
 * @attr {string} position = "center" - Placement (`start`, `end`, `center`).
 * @attr {boolean} open = false - Opens the table of contents panel.
 * @attr {boolean} expand-all = false - Expands every table of contents subtree.
 * @attr {boolean} brand = false - Uses the soft brand background and contrasting brand text colors.
 * @cssprop --tp-toc-background Panel background color.
 * @cssprop --tp-toc-border-color Panel border color.
 * @cssprop --tp-toc-color Panel text color.
 * @example
 * <tp-box data-tp-toc-scope>
 *   <tp-toc label="On this page" open expand-all></tp-toc>
 *   <h2>Getting started</h2>
 *   <p>Choose a heading in the table of contents to jump to its section.</p>
 *   <h3>Installation</h3><p>Install the library in your project.</p>
 *   <h3>First component</h3><p>Add your first interactive component.</p>
 * </tp-box>
 */
export class TpToc extends TpBase {
	private static readonly styleId = "tp-toc-styles";
	private observer: MutationObserver | null = null;
	private observedScope: HTMLElement | null = null;
	private renderQueued = false;

	public static get observedAttributes(): string[] {
		return ["brand", "expand-all", "label", "open", "position"];
	}

	public get brand(): boolean {
		return this.hasAttribute("brand");
	}

	public set brand(value: boolean) {
		this.toggleAttribute("brand", value);
	}

	public get label(): string {
		return this.getAttribute("label") ?? "Contents";
	}

	public set label(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("label");
			return;
		}

		this.setAttribute("label", value);
	}

	public get position(): TpTocPosition {
		const value = this.getAttribute("position") ?? "center";
		return isTpTocPosition(value) ? value : "center";
	}

	public set position(value: string) {
		if (!isTpTocPosition(value)) {
			this.setAttribute("position", "center");
			return;
		}

		this.setAttribute("position", value);
	}

	public get open(): boolean {
		return this.hasAttribute("open");
	}

	public set open(value: boolean) {
		this.toggleAttribute("open", value);
	}

	public get expandAll(): boolean {
		return this.hasAttribute("expand-all");
	}

	public set expandAll(value: boolean) {
		this.toggleAttribute("expand-all", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpToc.styleId, style);
		this.syncPositionAttribute();
		this.render();
		this.observeScope();
		this.addEventListener("click", this.handleClick);
	}

	public disconnectedCallback(): void {
		this.observer?.disconnect();
		this.observer = null;
		this.observedScope = null;
		this.removeEventListener("click", this.handleClick);
	}

	protected attributeChangedCallback(): void {
		if (!this.isConnected) return;
		this.syncPositionAttribute();
		this.render();
	}

	private syncPositionAttribute(): void {
		const position = this.position;
		if (this.getAttribute("position") !== position) {
			this.setAttribute("position", position);
		}
		this.setAttribute("data-position", position);
	}

	private observeScope(): void {
		const scope = this.getTocScope();
		if (scope === this.observedScope) {
			return;
		}

		this.observer?.disconnect();
		this.observedScope = scope;
		this.observer = new MutationObserver((mutations) => {
			const hasExternalMutation = mutations.some((mutation) => {
				return (
					!this.contains(mutation.target) &&
					isGlobalMutationTarget(mutation.target, scope)
				);
			});

			if (hasExternalMutation) {
				this.scheduleRender();
			}
		});
		this.observer.observe(scope, {
			attributes: true,
			attributeFilter: ["id"],
			characterData: true,
			childList: true,
			subtree: true,
		});
	}

	private scheduleRender(): void {
		if (this.renderQueued) {
			return;
		}

		this.renderQueued = true;
		queueMicrotask(() => {
			this.renderQueued = false;
			if (!this.isConnected) return;
			this.render();
		});
	}

	private render(): void {
		this.observer?.disconnect();
		this.observer = null;
		this.observedScope = null;

		const headings = this.collectHeadings();
		const panel = document.createElement("details");
		panel.setAttribute("data-tp-toc-panel", "");
		panel.open = this.open;

		const summary = document.createElement("summary");
		summary.setAttribute("data-tp-toc-label", "");
		summary.textContent = this.label;
		panel.append(summary);

		const nav = document.createElement("nav");
		nav.setAttribute("aria-label", this.label);

		const tree = document.createElement("tp-tree");
		tree.setAttribute("guides", "");
		tree.append(this.renderTreeList(buildTocTree(headings)));
		nav.append(tree);
		panel.append(nav);

		this.replaceChildren(panel);
		if (this.expandAll && isTpTreeElement(tree)) {
			tree.expandAll();
		}
		this.observeScope();
	}

	private collectHeadings(): TocHeading[] {
		const scope = this.getTocScope();
		const generatedIds = new Set<string>();
		const headings: TocHeading[] = [];

		for (const heading of scope.querySelectorAll(HEADING_SELECTOR)) {
			if (
				!(heading instanceof HTMLHeadingElement) ||
				this.contains(heading) ||
				!isGlobalHeading(heading, scope)
			) {
				continue;
			}

			const title = heading.textContent?.trim() ?? "";
			if (title === "") {
				continue;
			}

			const level = Number(heading.tagName.slice(1));
			const id = this.ensureHeadingId(heading, title, generatedIds);

			headings.push({
				level,
				id,
				title,
			});
		}

		return headings;
	}

	private ensureHeadingId(
		heading: HTMLHeadingElement,
		title: string,
		generatedIds: Set<string>,
	): string {
		const existingId = heading.id.trim();
		if (existingId !== "") {
			generatedIds.add(existingId);
			return existingId;
		}

		const baseId = slugify(title) || "section";
		let id = baseId;
		let index = 2;

		while (document.getElementById(id) !== null || generatedIds.has(id)) {
			id = `${baseId}-${String(index)}`;
			index += 1;
		}

		heading.id = id;
		generatedIds.add(id);
		return id;
	}

	private renderTreeList(items: readonly TocTreeItem[]): HTMLUListElement {
		const list = document.createElement("ul");

		for (const item of items) {
			const node = document.createElement("li");
			node.setAttribute("data-node-id", item.id);
			node.setAttribute("data-kind", `h${String(item.level)}`);
			node.setAttribute("data-label", item.title);

			const link = document.createElement("a");
			link.href = this.createHeadingHref(item.id);
			link.textContent = item.title;
			node.append(link);

			if (item.children.length > 0) {
				node.setAttribute("data-expanded", "");
				node.append(this.renderTreeList(item.children));
			}

			list.append(node);
		}

		return list;
	}

	private createHeadingHref(id: string): string {
		const route = getCurrentHashRoute();
		return `${route}#${encodeURIComponent(id)}`;
	}

	private getTocScope(): HTMLElement {
		const scope = this.closest<HTMLElement>(
			"[data-tp-toc-scope], .tp-html-viewer-output, .tp-asciidoc-output, .tp-md-mdviewer-output, .tp-markdown-output, .tp-restructuredtext-output, article, main",
		);
		return scope ?? this.parentElement ?? document.body;
	}

	private readonly handleClick = (event: MouseEvent): void => {
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
		if (link === null || !this.contains(link)) return;

		const href = link.getAttribute("href") ?? "";
		const anchor = parseInternalAnchorHref(href);
		if (anchor === null) return;

		const currentRoute = getCurrentHashRoute();
		if (anchor.route !== "" && anchor.route !== currentRoute) {
			return;
		}

		const heading = document.getElementById(anchor.id);
		if (heading === null) return;

		event.preventDefault();
		window.location.hash =
			anchor.route === "" ? `#${anchor.id}` : `${anchor.route}#${anchor.id}`;
		heading.scrollIntoView?.({ block: "start" });
	};
}

/**
 * Checks whether a heading belongs to the document represented by the current TOC scope.
 *
 * Headings rendered inside another component or nested document scope describe that embedded
 * content, not the surrounding documentation page. Regular HTML section wrappers remain part of
 * the global outline.
 */
function isGlobalHeading(
	heading: HTMLHeadingElement,
	scope: HTMLElement,
): boolean {
	return isGlobalElement(heading, scope);
}

/** Checks whether a mutation target belongs to the document represented by the TOC scope. */
function isGlobalMutationTarget(target: Node, scope: HTMLElement): boolean {
	const element = target instanceof Element ? target : target.parentElement;
	return element !== null && isGlobalElement(element, scope);
}

/** Checks whether an element is outside nested component and document scopes. */
function isGlobalElement(element: Element, scope: HTMLElement): boolean {
	let ancestor: Element | null = element;

	while (ancestor !== null && ancestor !== scope) {
		if (
			ancestor.localName.includes("-") ||
			ancestor.matches("[data-tp-toc-scope], article, main")
		) {
			return false;
		}
		ancestor = ancestor.parentElement;
	}

	return ancestor === scope;
}

function buildTocTree(headings: readonly TocHeading[]): TocTreeItem[] {
	const root: TocTreeItem[] = [];
	const stack: Array<{ level: number; children: TocTreeItem[] }> = [
		{ level: 0, children: root },
	];

	for (const heading of headings) {
		const item: TocTreeItem = {
			...heading,
			children: [],
		};

		while (stack.length > 1 && heading.level <= (stack.at(-1)?.level ?? 0)) {
			stack.pop();
		}

		(stack.at(-1)?.children ?? root).push(item);
		stack.push(item);
	}

	return root;
}

function getCurrentHashRoute(): string {
	const hash = window.location.hash;
	if (!hash.startsWith("#/")) {
		return "";
	}

	const fragmentIndex = hash.indexOf("#", 2);
	return fragmentIndex === -1 ? hash : hash.slice(0, fragmentIndex);
}

function parseInternalAnchorHref(
	href: string,
): { route: string; id: string } | null {
	if (!href.startsWith("#")) {
		return null;
	}

	const fragmentIndex = href.indexOf("#", href.startsWith("#/") ? 2 : 1);
	const rawId =
		fragmentIndex === -1 ? href.slice(1) : href.slice(fragmentIndex + 1);
	if (rawId === "") {
		return null;
	}

	return {
		route: fragmentIndex === -1 ? "" : href.slice(0, fragmentIndex),
		id: decodeURIComponent(rawId),
	};
}

function slugify(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

if (!customElements.get("tp-toc")) {
	customElements.define("tp-toc", TpToc);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-toc": TpToc;
	}
}
