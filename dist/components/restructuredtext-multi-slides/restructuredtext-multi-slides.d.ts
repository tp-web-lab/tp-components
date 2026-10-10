/**
 * @module components/restructuredtext-multi-slides
 * @summary reStructuredText slide presentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
/**
 * @tp-dependency tp-markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
import type { TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
import { TpMarkupMultiSlides } from "../markup-multi-slides/markup-multi-slides.js";
/**
 * @tagname tp-restructuredtext-multi-slides
 * @summary presents a navigable repository of reStructuredText slides.
 * @example
 * <tp-restructuredtext-multi-slides></tp-restructuredtext-multi-slides>
 */
export declare class TpRestructuredTextMultiSlides extends TpMarkupMultiSlides {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-restructuredtext-multi-slides": TpRestructuredTextMultiSlides;
    }
}
