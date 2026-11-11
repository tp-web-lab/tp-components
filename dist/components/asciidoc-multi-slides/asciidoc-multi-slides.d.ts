/**
 * @module components/asciidoc-multi-slides
 * @summary AsciiDoc slide presentation shell.
 */
/**
 * @tp-dependency tp-markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
import type { TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
import { TpMarkupMultiSlides } from "../markup-multi-slides/markup-multi-slides.js";
/**
 * The custom `<tp-asciidoc-multi-slides>` element presents AsciiDoc documents as a slide deck.
 *
 * @tagname tp-asciidoc-multi-slides
 * @summary Presents AsciiDoc documents as a slide deck.
 * @example
 * <tp-asciidoc-multi-slides repository="/docs/components/asciidoc-multi-pages/docs"></tp-asciidoc-multi-slides>
 */
export declare class TpAsciidocMultiSlides extends TpMarkupMultiSlides {
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-asciidoc-multi-slides": TpAsciidocMultiSlides;
    }
}
