/**
 * @module components/restructuredtext-multi-slides
 * @summary reStructuredText slide presentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
import type { TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
import { TpMarkupMultiSlides } from "../markup-multi-slides/markup-multi-slides.js";
/**
 * The custom `<tp-restructuredtext-multi-slides>` element presents reStructuredText documents as a slide deck.
 *
 * @tagname tp-restructuredtext-multi-slides
 * @summary Presents reStructuredText documents as a slide deck.
 * @example
 * <tp-restructuredtext-multi-slides repository="/docs/components/restructuredtext-multi-pages/docs"></tp-restructuredtext-multi-slides>
 */
export declare class TpRestructuredTextMultiSlides extends TpMarkupMultiSlides {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-restructuredtext-multi-slides": TpRestructuredTextMultiSlides;
    }
}
