/** @module components/html-single-page @summary Single-page native HTML renderer. */
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from '../markup-single-page/markup-single-page.js';
/** @tagname tp-html-single-page @summary Inserts one HTML document using the browser renderer. * @example
 * <tp-html-single-page></tp-html-single-page>
 */
export declare class TpHtmlSinglePage extends TpMarkupSinglePage {
    protected get fixedLanguage(): TpMarkupSinglePageLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-html-single-page': TpHtmlSinglePage;
    }
}
