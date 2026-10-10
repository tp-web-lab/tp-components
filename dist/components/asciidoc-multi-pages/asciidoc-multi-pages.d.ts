/** @module components/asciidoc-multi-pages
 * @summary Multi-page AsciiDoc documentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
import { TpMarkupMultiPages, type TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
/** @tagname tp-asciidoc-multi-pages @summary Renders a navigable repository with tp-asciidoc. * @example
 * <tp-asciidoc-multi-pages></tp-asciidoc-multi-pages>
 */
export declare class TpAsciidocMultiPages extends TpMarkupMultiPages {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-asciidoc-multi-pages": TpAsciidocMultiPages;
    }
}
