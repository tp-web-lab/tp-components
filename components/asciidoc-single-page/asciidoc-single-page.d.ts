/** @module components/asciidoc-single-page @summary Single-page AsciiDoc renderer. */
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from '../markup-single-page/markup-single-page.js';
/** @tagname tp-asciidoc-single-page @summary Renders one document with tp-asciidoc. * @example
 * <tp-asciidoc-single-page></tp-asciidoc-single-page>
 */
export declare class TpAsciidocSinglePage extends TpMarkupSinglePage {
    protected get fixedLanguage(): TpMarkupSinglePageLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-asciidoc-single-page': TpAsciidocSinglePage;
    }
}
