/** @module components/markdown-single-page @summary Single-page Markdown renderer. */
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from "../markup-single-page/markup-single-page.js";
/**
 * The custom `<tp-markdown-single-page>` element displays a single Markdown document.
 *
 * @summary Displays a single Markdown document.
 * @tagname tp-markdown-single-page
 * @event tp-markdown-single-page-rendered Emitted after this page finishes rendering, immediately after tp-markup-single-page-rendered. language identifies the renderer and src is the resolved source used for this render.
 * @eventdetail tp-markdown-single-page-rendered { language: "html" | "markdown" | "asciidoc" | "restructuredtext"; src: string }
 * @example
 * <tp-markdown-single-page>
 *   <script type="tp/markdown">
 * ## A short guide
 *
 * This document is rendered as a single page.
 *
 * ### Getting started
 *
 * - Read the introduction
 * - Try a component
 *   </script>
 * </tp-markdown-single-page>
 */
export declare class TpMarkdownSinglePage extends TpMarkupSinglePage {
    protected get fixedLanguage(): TpMarkupSinglePageLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-markdown-single-page": TpMarkdownSinglePage;
    }
}
