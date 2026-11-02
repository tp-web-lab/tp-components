/** @module components/html-single-page @summary Single-page native HTML renderer. */
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from "../markup-single-page/markup-single-page.js";
/** @tagname tp-html-single-page @summary Inserts one HTML document using the browser renderer. * @example
 * <tp-html-single-page></tp-html-single-page>
 * @event tp-html-single-page-rendered Emitted after this page finishes rendering, immediately after tp-markup-single-page-rendered. language identifies the renderer and src is the resolved source used for this render.
 * @eventdetail tp-html-single-page-rendered { language: "html" | "markdown" | "asciidoc" | "restructuredtext"; src: string }
 */
export declare class TpHtmlSinglePage extends TpMarkupSinglePage {
    protected get fixedLanguage(): TpMarkupSinglePageLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-html-single-page": TpHtmlSinglePage;
    }
}
