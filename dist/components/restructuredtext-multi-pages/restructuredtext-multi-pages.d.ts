/** @module components/restructuredtext-multi-pages @summary Multi-page reStructuredText documentation shell. */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
import { TpMarkupMultiPages, type TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
/**
 * The custom `<tp-restructuredtext-multi-pages>` element presents reStructuredText documents with navigation between pages.
 *
 * @summary Presents reStructuredText documents with navigation between pages.
 * @tagname tp-restructuredtext-multi-pages
 * @example
 * <tp-box style="position: relative; contain: layout; block-size: 32rem; padding: 0;">
 *   <tp-restructuredtext-multi-pages repository="/docs/components/_shared/intro-documents/restructuredtext" label="A small guide" menu=""></tp-restructuredtext-multi-pages>
 * </tp-box>
 */
export declare class TpRestructuredTextMultiPages extends TpMarkupMultiPages {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-restructuredtext-multi-pages": TpRestructuredTextMultiPages;
    }
}
