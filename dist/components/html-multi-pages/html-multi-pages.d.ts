/** @module components/html-multi-pages @summary Multi-page native HTML documentation shell. */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
import { TpMarkupMultiPages, type TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
/** @tagname tp-html-multi-pages @summary Renders a navigable repository as native browser HTML. * @example
 * <tp-html-multi-pages></tp-html-multi-pages>
 */
export declare class TpHtmlMultiPages extends TpMarkupMultiPages {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-html-multi-pages": TpHtmlMultiPages;
    }
}
