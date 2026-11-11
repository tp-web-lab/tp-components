/**
 * @module components/markdown-multi-slides
 * @summary Markdown slide presentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
import type { TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
import { TpMarkupMultiSlides } from "../markup-multi-slides/markup-multi-slides.js";
/**
 * The custom `<tp-markdown-multi-slides>` element presents Markdown documents as a slide deck.
 *
 * @tagname tp-markdown-multi-slides
 * @summary Presents Markdown documents as a slide deck.
 * @example
 * <tp-markdown-multi-slides repository="/docs/components/markdown-multi-pages/docs"></tp-markdown-multi-slides>
 */
export declare class TpMarkdownMultiSlides extends TpMarkupMultiSlides {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-markdown-multi-slides": TpMarkdownMultiSlides;
    }
}
