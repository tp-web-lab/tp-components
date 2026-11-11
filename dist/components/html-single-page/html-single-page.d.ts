/** @module components/html-single-page @summary Single-page native HTML renderer. */
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from "../markup-single-page/markup-single-page.js";
/**
 * The custom `<tp-html-single-page>` element displays a single HTML document.
 *
 * @summary Displays a single HTML document.
 * @tagname tp-html-single-page
 * @event tp-html-single-page-rendered Emitted after this page finishes rendering, immediately after tp-markup-single-page-rendered. language identifies the renderer and src is the resolved source used for this render.
 * @eventdetail tp-html-single-page-rendered { language: "html" | "markdown" | "asciidoc" | "restructuredtext"; src: string }
 * @example
 * <tp-html-single-page>
 *   <script type="tp/html">
 * <h2>A short guide</h2>
 * <p>This document is rendered as a single page.</p>
 * <h3>Getting started</h3>
 * <ul><li>Read the introduction</li><li>Try a component</li></ul>
 *   </script>
 * </tp-html-single-page>
 */
export declare class TpHtmlSinglePage extends TpMarkupSinglePage {
    protected get fixedLanguage(): TpMarkupSinglePageLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-html-single-page": TpHtmlSinglePage;
    }
}
