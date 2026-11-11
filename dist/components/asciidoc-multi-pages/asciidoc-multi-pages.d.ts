/** @module components/asciidoc-multi-pages
 * @summary Multi-page AsciiDoc documentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
import { TpMarkupMultiPages, type TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
/**
 * The custom `<tp-asciidoc-multi-pages>` element presents AsciiDoc documents with navigation between pages.
 *
 * @summary Presents AsciiDoc documents with navigation between pages.
 * @tagname tp-asciidoc-multi-pages
 * @example
 * <tp-box style="position: relative; contain: layout; block-size: 32rem; padding: 0;">
 *   <tp-asciidoc-multi-pages repository="/docs/components/_shared/intro-documents/asciidoc" label="A small guide" menu=""></tp-asciidoc-multi-pages>
 * </tp-box>
 */
export declare class TpAsciidocMultiPages extends TpMarkupMultiPages {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-asciidoc-multi-pages": TpAsciidocMultiPages;
    }
}
