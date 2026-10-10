/**
 * @module components/asciidoc-multi-slides
 * @summary AsciiDoc slide presentation shell.
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
 * @tagname tp-asciidoc-multi-slides
 * @summary presents a navigable repository of AsciiDoc slides.
 * @example
 * <tp-asciidoc-multi-slides></tp-asciidoc-multi-slides>
 */
export declare class TpAsciidocMultiSlides extends TpMarkupMultiSlides {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-asciidoc-multi-slides": TpAsciidocMultiSlides;
    }
}
