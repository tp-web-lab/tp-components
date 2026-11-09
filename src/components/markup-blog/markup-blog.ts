/** @module components/markup-blog @summary Paginated markup articles with category and tag filters. */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
// tp-docgen:dependencies:end

import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../radio-list/radio-list.js";
import style from "./markup-blog.css?inline";

export type TpBlogLanguage =
	| "html"
	| "markdown"
	| "asciidoc"
	| "restructuredtext";
interface BlogArticle {
	id: string;
	title: string;
	date: string;
	summary: string;
	categories: string[];
	tags: string[];
	src: string;
	language: TpBlogLanguage;
	content: DocumentFragment;
}
const languages: TpBlogLanguage[] = [
	"html",
	"markdown",
	"asciidoc",
	"restructuredtext",
];
const aliases: Record<string, TpBlogLanguage> = {
	html: "html",
	htm: "html",
	md: "markdown",
	markdown: "markdown",
	adoc: "asciidoc",
	asciidoc: "asciidoc",
	rst: "restructuredtext",
	restructuredtext: "restructuredtext",
};
function languageOf(path: string): TpBlogLanguage | undefined {
	return aliases[path.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase() ?? ""];
}
/** Render through the same native parsers as the documentation components. */
async function renderMarkup(
	source: string,
	language: TpBlogLanguage,
	root: HTMLElement,
	base: string,
): Promise<void> {
	if (language === "html") root.innerHTML = source;
	else if (language === "markdown")
		await (await import("../markdown/markdown.js")).renderMarkdownInto(
			source,
			root,
			base,
		);
	else if (language === "asciidoc")
		await (await import("../asciidoc/asciidoc.js")).renderAsciidocInto(
			source,
			root,
		);
	else
		await (
			await import("../restructuredtext/restructuredtext.js")
		).renderRestructuredTextInto(source, root);
	// Preserve the source file's directory when articles are moved into the reader.
	for (const element of root.querySelectorAll("[href], [src]")) {
		for (const name of ["href", "src"]) {
			const value = element.getAttribute(name);
			if (value && !value.startsWith("#"))
				element.setAttribute(name, new URL(value, base).href);
		}
	}
}
/**
 * The custom `<tp-markup-blog>` element lists dated articles with summaries, category and tag filters, pagination and a reader.
 *
 * @tagname tp-markup-blog
 * @summary Lists dated articles with summaries, category and tag filters, pagination and a reader.
 * @attr {string} src = "" - URL of the markup index; relative article paths resolve against this file.
 * @attr {string} value = "" - Inline markup index, used when src is absent; takes precedence over the internal script.
 * @attr {"html"|"markdown"|"asciidoc"|"restructuredtext"} language = "markdown" - Index language when neither a fixed-language variant, source extension nor script type selects it.
 * @attr {number} page-size = 5 - Maximum articles per list page; positive integers only, otherwise five.
 * @attr {string} category = "" - Exact category filter; empty includes every category.
 * @attr {string} tag = "" - Exact tag filter; combined with the category filter.
 * @attr {number} page = 1 - One-based list page, clamped to the filtered page count.
 * @attr {string} article = "" - Article identifier to open; empty shows the filtered list.
 * @event tp-markup-blog-load Emitted after the index is parsed successfully; count is the number of articles.
 * @eventdetail tp-markup-blog-load { count: number }
 * @event tp-markup-blog-open Emitted after an article is displayed; id identifies the article.
 * @eventdetail tp-markup-blog-open { id: string }
 * @event tp-markup-blog-error Emitted when loading or parsing fails; message describes the failure.
 * @eventdetail tp-markup-blog-error { message: string }
 * @see tp-html-blog - Browse and read articles written in html.
 * @see tp-markdown-blog - Browse and read articles written in markdown.
 * @see tp-asciidoc-blog - Browse and read articles written in asciidoc.
 * @see tp-restructuredtext-blog - Browse and read articles written in restructuredtext.
 * @example
 * <tp-markup-blog page-size="2">
 *   <script type="tp/markdown">
 *     ## A small garden
 *
 *     Id
 *     : garden
 *
 *     Date
 *     : 2026-06-03
 *
 *     Summary
 *     : Three ideas for a greener balcony.
 *
 *     Categories
 *     : Life
 *
 *     Tags
 *     : plants, outdoors
 *
 *     Start with herbs, choose a sunny spot, and water regularly.
 *
 *     ## Learning together
 *
 *     Id
 *     : learning
 *
 *     Date
 *     : 2026-06-02
 *
 *     Summary
 *     : Notes from our first workshop.
 *
 *     Categories
 *     : Learning
 *
 *     Tags
 *     : community, ideas
 *
 *     A short shared exercise makes a good starting point for discussion.
 *
 *     ## Welcome
 *
 *     Id
 *     : welcome
 *
 *     Date
 *     : 2026-06-01
 *
 *     Summary
 *     : What you will find in this blog.
 *
 *     Categories
 *     : Life
 *
 *     Tags
 *     : community
 *
 *     We share practical ideas and small discoveries. Come back for the next article.
 *   </script>
 * </tp-markup-blog>
 */
export class TpMarkupBlog extends TpBase {
	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"src",
			"value",
			"language",
			"page-size",
			"category",
			"tag",
			"page",
			"article",
		];
	}
	protected get fixedLanguage(): TpBlogLanguage | null {
		return null;
	}
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: Object.keys(aliases).map((name) => `tp/${name}`),
		ignoreSelector: "[data-blog-ui]",
	});
	private readonly ui = document.createElement("div");
	private articles: BlogArticle[] = [];
	private scriptLanguage: TpBlogLanguage | undefined;
	private base = "";
	private revision = 0;
	private viewRevision = 0;
	private controller: AbortController | null = null;
	private reflecting = false;
	private lastArticle = "";
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-markup-blog");
		this.ensureGlobalStyle("tp-markup-blog-styles", style);
		this.captureLanguage();
		this.source.observe(() => {
			this.captureLanguage();
			void this.load();
		});
		this.ui.dataset.blogUi = "";
		this.append(this.ui);
		void this.load();
	}
	/** @internal Releases pending loads and source observers. */
	public disconnectedCallback(): void {
		this.controller?.abort();
		this.source.disconnect();
		this.revision++;
		this.viewRevision++;
	}
	private captureLanguage(): void {
		const type = this.querySelector<HTMLScriptElement>(
			":scope > script",
		)?.type.replace("tp/", "");
		this.scriptLanguage = aliases[type ?? ""] ?? this.scriptLanguage;
	}
	protected attributeChangedCallback(
		name: string,
		previous: string | null,
		value: string | null,
	): void {
		if (!this.isConnected || previous === value || this.reflecting) return;
		if (["src", "value", "language"].includes(name)) {
			void this.load();
			return;
		}
		if (["category", "tag", "page-size"].includes(name)) {
			this.reflect("page", "1");
			this.reflect("article", "");
		}
		void this.render();
	}
	private reflect(name: string, value: string): void {
		this.reflecting = true;
		if (value) this.setAttribute(name, value);
		else this.removeAttribute(name);
		this.reflecting = false;
	}
	private get indexLanguage(): TpBlogLanguage {
		return (
			this.fixedLanguage ??
			languageOf(this.getAttribute("src") ?? "") ??
			this.scriptLanguage ??
			aliases[this.getAttribute("language") ?? ""] ??
			"markdown"
		);
	}
	private async load(): Promise<void> {
		const revision = ++this.revision;
		this.viewRevision++;
		this.articles = [];
		this.controller?.abort();
		this.controller = new AbortController();
		this.ui.setAttribute("aria-busy", "true");
		this.ui.textContent = "Loading articles…";
		try {
			const source = await this.source.read({ signal: this.controller.signal });
			this.base = resolveComponentSourceUrl(
				this,
				this.getAttribute("src") || ".",
			).href;
			const root = document.createElement("div");
			await renderMarkup(source, this.indexLanguage, root, this.base);
			if (revision !== this.revision || !this.isConnected) return;
			this.articles = this.parseArticles(root);
			this.ui.removeAttribute("aria-busy");
			await this.render();
			this.dispatchEvent(
				new CustomEvent(`${this.localName}-load`, {
					bubbles: true,
					detail: { count: this.articles.length },
				}),
			);
		} catch (error) {
			if (revision === this.revision && this.isConnected) this.showError(error);
		}
	}
	private parseArticles(root: HTMLElement): BlogArticle[] {
		const headings = Array.from(root.querySelectorAll("h2"));
		if (!headings.length && root.textContent?.trim())
			throw new Error("Each blog article must start with a level-two heading.");
		const used = new Set<string>();
		return headings
			.map((heading, index) => {
				const range = document.createRange();
				range.setStartAfter(heading);
				const next = headings[index + 1];
				if (next) range.setEndBefore(next);
				else range.setEnd(root, root.childNodes.length);
				const content = range.cloneContents();
				const metadata = content.querySelector("dl");
				const fields = new Map<string, string>();
				for (const term of metadata?.querySelectorAll("dt") ?? []) {
					const definition = term.nextElementSibling;
					if (definition?.localName === "dd")
						fields.set(
							term.textContent?.trim().toLowerCase() ?? "",
							definition.textContent?.trim() ?? "",
						);
				}
				metadata?.remove();
				const title = heading.textContent?.trim() || `Article ${index + 1}`;
				const id = fields.get("id") || heading.id || `article-${index + 1}`;
				if (used.has(id))
					throw new Error(`Duplicate article identifier: ${id}`);
				used.add(id);
				const date = fields.get("date") ?? "";
				if (
					!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
					!Number.isFinite(Date.parse(date)) ||
					new Date(date).toISOString().slice(0, 10) !== date
				)
					throw new Error(
						`Article “${title}” needs a valid Date in YYYY-MM-DD format.`,
					);
				const split = (name: string) => [
					...new Set(
						(fields.get(name) ?? "")
							.split(",")
							.map((value) => value.trim())
							.filter(Boolean),
					),
				];
				const path =
					fields.get("source") ||
					heading.querySelector("a")?.getAttribute("href") ||
					"";
				const src = path ? new URL(path, this.base).href : "";
				const requested = fields.get("language");
				if (requested && !languages.includes(requested as TpBlogLanguage))
					throw new Error(`Unsupported article language: ${requested}`);
				return {
					id,
					title,
					date,
					summary:
						fields.get("summary") ||
						content.querySelector("p")?.textContent ||
						"",
					categories: split("categories"),
					tags: split("tags"),
					src,
					language:
						this.fixedLanguage ??
						(requested as TpBlogLanguage | undefined) ??
						languageOf(src) ??
						this.indexLanguage,
					content,
				};
			})
			.sort((a, b) => b.date.localeCompare(a.date));
	}
	private button(
		label: string,
		description: string,
		action: () => void,
	): HTMLElement {
		const button = document.createElement("tp-button");
		button.textContent = label;
		button.setAttribute("variant", "brand");
		button.setAttribute("outlined", "");
		button.dataset.helpDescription = description;
		button.addEventListener("click", action);
		return button;
	}
	private filter(
		label: string,
		attribute: string,
		values: string[],
	): HTMLElement {
		const group = document.createElement("tp-radio-list");
		group.setAttribute("label", label);
		group.setAttribute("orientation", "horizontal");
		const options = ["", ...values];
		const selected = this.getAttribute(attribute) ?? "";
		if (selected && !options.includes(selected)) options.push(selected);
		group.setAttribute("value", String(options.indexOf(selected) + 1));
		const list = document.createElement("ul");
		for (const value of options) {
			const item = document.createElement("li");
			item.textContent = value || "All";
			list.append(item);
		}
		group.append(list);
		group.addEventListener("tp-radio-list-change", (event) => {
			const index =
				Number((event as CustomEvent<{ value: string }>).detail.value) - 1;
			this.setAttribute(attribute, options[index] ?? "");
			this.ui
				.querySelector<HTMLElement>(
					`tp-radio-list[label="${label}"] input:checked`,
				)
				?.focus({ preventScroll: true });
		});
		return group;
	}
	private async render(): Promise<void> {
		const revision = ++this.viewRevision;
		const id = this.getAttribute("article") ?? "";
		this.ui.replaceChildren();
		if (id) {
			const article = this.articles.find((item) => item.id === id);
			this.ui.append(
				this.button(
					"Back to articles",
					"Return to the filtered article list and its current page.",
					() => this.removeAttribute("article"),
				),
			);
			if (!article) {
				this.showError(new Error(`Unknown article: ${id}`), false);
				return;
			}
			this.lastArticle = id;
			const heading = document.createElement("h2");
			heading.textContent = article.title;
			heading.tabIndex = -1;
			const time = document.createElement("time");
			time.dateTime = article.date;
			time.textContent = article.date;
			const content = document.createElement("div");
			content.className = "tp-blog-content";
			this.ui.append(heading, time, content);
			heading.focus({ preventScroll: true });
			try {
				if (article.src) {
					content.textContent = "Loading article…";
					const response = await fetch(article.src, {
						signal: this.controller?.signal,
					});
					if (!response.ok)
						throw new Error(`Unable to load article (${response.status}).`);
					const root = document.createElement("div");
					await renderMarkup(
						await response.text(),
						article.language,
						root,
						article.src,
					);
					if (revision !== this.viewRevision) return;
					content.replaceChildren(...root.childNodes);
				} else content.append(article.content.cloneNode(true));
				if (revision === this.viewRevision)
					this.dispatchEvent(
						new CustomEvent(`${this.localName}-open`, {
							bubbles: true,
							detail: { id },
						}),
					);
			} catch (error) {
				if (revision === this.viewRevision) {
					content.replaceChildren();
					this.showError(error, false);
				}
			}
			return;
		}
		const controls = document.createElement("div");
		controls.className = "tp-blog-filters";
		for (const [label, attribute, key] of [
			["Categories", "category", "categories"],
			["Tags", "tag", "tags"],
		] as const) {
			const values = [
				...new Set(this.articles.flatMap((item) => item[key])),
			].sort();
			if (values.length) controls.append(this.filter(label, attribute, values));
		}
		this.ui.append(controls);
		const filtered = this.articles.filter(
			(item) =>
				(!this.getAttribute("category") ||
					item.categories.includes(this.getAttribute("category") ?? "")) &&
				(!this.getAttribute("tag") ||
					item.tags.includes(this.getAttribute("tag") ?? "")),
		);
		const sizeValue = Number(this.getAttribute("page-size") ?? 5);
		const size = Number.isInteger(sizeValue) && sizeValue > 0 ? sizeValue : 5;
		const count = Math.max(1, Math.ceil(filtered.length / size));
		const requested = Number(this.getAttribute("page") ?? 1);
		const page = Math.min(
			count,
			Math.max(1, Number.isFinite(requested) ? Math.floor(requested) : 1),
		);
		this.reflect("page", String(page));
		const list = document.createElement("div");
		list.className = "tp-blog-list";
		for (const item of filtered.slice((page - 1) * size, page * size)) {
			const card = document.createElement("article");
			const heading = document.createElement("h3");
			const button = this.button(
				item.title,
				"Open this article in the blog reader.",
				() => this.setAttribute("article", item.id),
			);
			button.dataset.blogArticle = item.id;
			heading.append(button);
			const time = document.createElement("time");
			time.dateTime = item.date;
			time.textContent = item.date;
			const summary = document.createElement("p");
			summary.textContent = item.summary;
			const labels = document.createElement("p");
			labels.className = "tp-blog-labels";
			labels.textContent = [
				...item.categories,
				...item.tags.map((tag) => `#${tag}`),
			].join(" · ");
			card.append(heading, time, summary, labels);
			list.append(card);
		}
		if (!filtered.length) {
			const empty = document.createElement("p");
			empty.setAttribute("role", "status");
			empty.textContent = this.articles.length
				? "No articles match these filters."
				: "No articles yet.";
			list.append(empty);
		}
		this.ui.append(list);
		const nav = document.createElement("nav");
		nav.setAttribute("aria-label", "Article pages");
		const previous = this.button(
			"Previous",
			"Show the previous page of articles.",
			() => this.setAttribute("page", String(page - 1)),
		);
		const next = this.button("Next", "Show the next page of articles.", () =>
			this.setAttribute("page", String(page + 1)),
		);
		previous.toggleAttribute("disabled", page <= 1);
		next.toggleAttribute("disabled", page >= count);
		const status = document.createElement("span");
		status.setAttribute("role", "status");
		status.textContent = `Page ${page} of ${count} · ${filtered.length} ${filtered.length === 1 ? "article" : "articles"}`;
		nav.append(previous, status, next);
		this.ui.append(nav);
		if (this.lastArticle) {
			Array.from(list.querySelectorAll<HTMLElement>("[data-blog-article]"))
				.find((button) => button.dataset.blogArticle === this.lastArticle)
				?.querySelector<HTMLElement>("button")
				?.focus({ preventScroll: true });
			this.lastArticle = "";
		}
	}
	private showError(error: unknown, replace = true): void {
		this.ui.removeAttribute("aria-busy");
		const message = error instanceof Error ? error.message : String(error);
		const alert = document.createElement("p");
		alert.setAttribute("role", "alert");
		alert.textContent = message;
		if (replace) this.ui.replaceChildren(alert);
		else this.ui.append(alert);
		this.dispatchEvent(
			new CustomEvent(`${this.localName}-error`, {
				bubbles: true,
				detail: { message },
			}),
		);
	}
}
if (!customElements.get("tp-markup-blog"))
	customElements.define("tp-markup-blog", TpMarkupBlog);
declare global {
	interface HTMLElementTagNameMap {
		"tp-markup-blog": TpMarkupBlog;
	}
}
