/**
 * @module components/html-multi-slides
 * @summary Native HTML slide presentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
import type { TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
import { TpMarkupMultiSlides } from "../markup-multi-slides/markup-multi-slides.js";
/**
 * The custom `<tp-html-multi-slides>` element presents HTML documents as a slide deck.
 *
 * @tagname tp-html-multi-slides
 * @summary Presents HTML documents as a slide deck.
 * @example
 * <tp-html-multi-slides repository="/docs/components/html-multi-pages/docs"></tp-html-multi-slides>
 */
export declare class TpHtmlMultiSlides extends TpMarkupMultiSlides {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-html-multi-slides": TpHtmlMultiSlides;
    }
}
