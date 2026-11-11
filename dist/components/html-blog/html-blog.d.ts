/** @module components/html-blog @summary Paginated html blog with article filters and a reader. */
/**
 * @tp-dependency tp-markup-blog
 * @summary Paginated markup articles with category and tag filters.
 */
import { type TpBlogLanguage, TpMarkupBlog } from "../markup-blog/markup-blog.js";
/**
 * The custom `<tp-html-blog>` element lists dated articles with summaries, category and tag filters, pagination and a reader.
 *
 * @tagname tp-html-blog
 * @summary Lists dated articles with summaries, category and tag filters, pagination and a reader.
 * @attr {string} src = "" - URL of the markup index; relative article paths resolve against this file.
 * @attr {string} value = "" - Inline markup index, used when src is absent; takes precedence over the internal script.
 * @attr {number} page-size = 5 - Maximum articles per list page; positive integers only, otherwise five.
 * @attr {string} category = "" - Exact category filter; empty includes every category.
 * @attr {string} tag = "" - Exact tag filter; combined with the category filter.
 * @attr {number} page = 1 - One-based list page, clamped to the filtered page count.
 * @attr {string} article = "" - Article identifier to open; empty shows the filtered list.
 * @event tp-html-blog-load Emitted after the index is parsed successfully; count is the number of articles.
 * @eventdetail tp-html-blog-load { count: number }
 * @event tp-html-blog-open Emitted after an article is displayed; id identifies the article.
 * @eventdetail tp-html-blog-open { id: string }
 * @event tp-html-blog-error Emitted when loading or parsing fails; message describes the failure.
 * @eventdetail tp-html-blog-error { message: string }
 * @see tp-markup-blog - Mix article languages and share the blog index format.
 * @example
 * <tp-html-blog page-size="2">
 *   <script type="tp/html">
 *     <h2>A small garden</h2>
 *     <dl>
 *       <dt>Id</dt><dd>garden</dd>
 *       <dt>Date</dt><dd>2026-06-03</dd>
 *       <dt>Summary</dt><dd>Three ideas for a greener balcony.</dd>
 *       <dt>Categories</dt><dd>Life</dd>
 *       <dt>Tags</dt><dd>plants, outdoors</dd>
 *     </dl>
 *     <p>Start with herbs, choose a sunny spot, and water regularly.</p>
 *
 *     <h2>Learning together</h2>
 *     <dl>
 *       <dt>Id</dt><dd>learning</dd>
 *       <dt>Date</dt><dd>2026-06-02</dd>
 *       <dt>Summary</dt><dd>Notes from our first workshop.</dd>
 *       <dt>Categories</dt><dd>Learning</dd>
 *       <dt>Tags</dt><dd>community, ideas</dd>
 *     </dl>
 *     <p>A short shared exercise makes a good starting point for discussion.</p>
 *
 *     <h2>Welcome</h2>
 *     <dl>
 *       <dt>Id</dt><dd>welcome</dd>
 *       <dt>Date</dt><dd>2026-06-01</dd>
 *       <dt>Summary</dt><dd>What you will find in this blog.</dd>
 *       <dt>Categories</dt><dd>Life</dd>
 *       <dt>Tags</dt><dd>community</dd>
 *     </dl>
 *     <p>We share practical ideas and small discoveries. Come back for the next article.</p>
 *   </script>
 * </tp-html-blog>
 */
export declare class TpHtmlBlog extends TpMarkupBlog {
    protected get fixedLanguage(): TpBlogLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-html-blog": TpHtmlBlog;
    }
}
