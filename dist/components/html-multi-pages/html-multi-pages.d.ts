/** @module components/html-multi-pages @summary Multi-page native HTML documentation shell. */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
import { TpMarkupMultiPages, type TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
/**
 * The custom `<tp-html-multi-pages>` element presents HTML documents with navigation between pages.
 *
 * @summary Presents HTML documents with navigation between pages.
 * @tagname tp-html-multi-pages
 * @example
 * <tp-box style="position: relative; contain: layout; block-size: 32rem; padding: 0;">
 *   <tp-html-multi-pages repository="/docs/components/_shared/intro-documents/html" label="A small guide" menu=""></tp-html-multi-pages>
 * </tp-box>
 */
export declare class TpHtmlMultiPages extends TpMarkupMultiPages {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-html-multi-pages": TpHtmlMultiPages;
    }
}
