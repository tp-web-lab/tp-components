/** @module components/latex-multi-pages
 * @summary Multi-page LaTeX documentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
import { TpMarkupMultiPages, type TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
/**
 * The custom `<tp-latex-multi-pages>` element presents LaTeX documents with navigation between pages.
 *
 * @summary Presents LaTeX documents with navigation between pages.
 * @tagname tp-latex-multi-pages
 * @example
 * <tp-latex-multi-pages repository="/docs/components/_shared/intro-documents/latex" label="A small guide" menu=""></tp-latex-multi-pages>
 */
export declare class TpLatexMultiPages extends TpMarkupMultiPages {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-latex-multi-pages": TpLatexMultiPages;
    }
}
