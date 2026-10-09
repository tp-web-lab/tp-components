/** @module components/restructuredtext-single-page @summary Single-page reStructuredText renderer. */
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from '../markup-single-page/markup-single-page.js';
/** @tagname tp-restructuredtext-single-page @summary Renders one document with tp-restructuredtext. * @example
 * <tp-restructuredtext-single-page></tp-restructuredtext-single-page>
 */
export declare class TpRestructuredTextSinglePage extends TpMarkupSinglePage {
    protected get fixedLanguage(): TpMarkupSinglePageLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-restructuredtext-single-page': TpRestructuredTextSinglePage;
    }
}
