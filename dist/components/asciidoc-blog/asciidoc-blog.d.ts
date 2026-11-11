/** @module components/asciidoc-blog @summary Paginated asciidoc blog with article filters and a reader. */
/**
 * @tp-dependency tp-markup-blog
 * @summary Paginated markup articles with category and tag filters.
 */
import { type TpBlogLanguage, TpMarkupBlog } from "../markup-blog/markup-blog.js";
/**
 * The custom `<tp-asciidoc-blog>` element lists dated articles with summaries, category and tag filters, pagination and a reader.
 *
 * @tagname tp-asciidoc-blog
 * @summary Lists dated articles with summaries, category and tag filters, pagination and a reader.
 * @attr {string} src = "" - URL of the markup index; relative article paths resolve against this file.
 * @attr {string} value = "" - Inline markup index, used when src is absent; takes precedence over the internal script.
 * @attr {number} page-size = 5 - Maximum articles per list page; positive integers only, otherwise five.
 * @attr {string} category = "" - Exact category filter; empty includes every category.
 * @attr {string} tag = "" - Exact tag filter; combined with the category filter.
 * @attr {number} page = 1 - One-based list page, clamped to the filtered page count.
 * @attr {string} article = "" - Article identifier to open; empty shows the filtered list.
 * @event tp-asciidoc-blog-load Emitted after the index is parsed successfully; count is the number of articles.
 * @eventdetail tp-asciidoc-blog-load { count: number }
 * @event tp-asciidoc-blog-open Emitted after an article is displayed; id identifies the article.
 * @eventdetail tp-asciidoc-blog-open { id: string }
 * @event tp-asciidoc-blog-error Emitted when loading or parsing fails; message describes the failure.
 * @eventdetail tp-asciidoc-blog-error { message: string }
 * @see tp-markup-blog - Mix article languages and share the blog index format.
 * @example
 * <tp-asciidoc-blog page-size="2">
 *   <script type="tp/asciidoc">
 *     == A small garden
 *
 *     Id:: garden
 *     Date:: 2026-06-03
 *     Summary:: Three ideas for a greener balcony.
 *     Categories:: Life
 *     Tags:: plants, outdoors
 *
 *     Start with herbs, choose a sunny spot, and water regularly.
 *
 *     == Learning together
 *
 *     Id:: learning
 *     Date:: 2026-06-02
 *     Summary:: Notes from our first workshop.
 *     Categories:: Learning
 *     Tags:: community, ideas
 *
 *     A short shared exercise makes a good starting point for discussion.
 *
 *     == Welcome
 *
 *     Id:: welcome
 *     Date:: 2026-06-01
 *     Summary:: What you will find in this blog.
 *     Categories:: Life
 *     Tags:: community
 *
 *     We share practical ideas and small discoveries. Come back for the next article.
 *   </script>
 * </tp-asciidoc-blog>
 */
export declare class TpAsciidocBlog extends TpMarkupBlog {
    protected get fixedLanguage(): TpBlogLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-asciidoc-blog": TpAsciidocBlog;
    }
}
