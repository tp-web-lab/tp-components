/**
 * @module components/markdown-multi-slides
 * @summary Markdown slide presentation shell.
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
 * @tagname tp-markdown-multi-slides
 * @summary presents a navigable repository of Markdown slides.
 * @example
 * <tp-markdown-multi-slides></tp-markdown-multi-slides>
 */
export declare class TpMarkdownMultiSlides extends TpMarkupMultiSlides {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-markdown-multi-slides": TpMarkdownMultiSlides;
    }
}
