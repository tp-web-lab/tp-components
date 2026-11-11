/** @module components/markup-blog @summary Paginated markup articles with category and tag filters. */
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
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../radio-list/radio-list.js";
export type TpBlogLanguage = "html" | "markdown" | "asciidoc" | "restructuredtext";
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
export declare class TpMarkupBlog extends TpBase {
    static get observedAttributes(): string[];
    protected get fixedLanguage(): TpBlogLanguage | null;
    private readonly source;
    private readonly ui;
    private articles;
    private scriptLanguage;
    private base;
    private revision;
    private viewRevision;
    private controller;
    private reflecting;
    private lastArticle;
    protected connectedCallback(): void;
    /** @internal Releases pending loads and source observers. */
    disconnectedCallback(): void;
    private captureLanguage;
    protected attributeChangedCallback(name: string, previous: string | null, value: string | null): void;
    private reflect;
    private get indexLanguage();
    private load;
    private parseArticles;
    private button;
    private filter;
    private render;
    private showError;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-markup-blog": TpMarkupBlog;
    }
}
