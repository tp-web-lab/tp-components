/** @module components/restructuredtext-multi-pages @summary Multi-page reStructuredText documentation shell. */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
import { TpMarkupMultiPages, type TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
/** @tagname tp-restructuredtext-multi-pages @summary Renders a navigable repository with tp-restructuredtext. * @example
 * <tp-restructuredtext-multi-pages></tp-restructuredtext-multi-pages>
 */
export declare class TpRestructuredTextMultiPages extends TpMarkupMultiPages {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-restructuredtext-multi-pages": TpRestructuredTextMultiPages;
    }
}
