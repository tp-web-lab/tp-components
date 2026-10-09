/**
 * @module components/asciidoc-multi-slides
 * @summary AsciiDoc slide presentation shell.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
/**
 * @tp-dependency tp-markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
// tp-docgen:dependencies:end

import type { TpMarkupMultiPagesLanguage } from "../markup-multi-pages/markup-multi-pages.js";
import { TpMarkupMultiSlides } from "../markup-multi-slides/markup-multi-slides.js";

/**
 * @tagname tp-asciidoc-multi-slides
 * @summary presents a navigable repository of AsciiDoc slides.
 * @example
 * <tp-asciidoc-multi-slides></tp-asciidoc-multi-slides>
 */
export class TpAsciidocMultiSlides extends TpMarkupMultiSlides {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "asciidoc";
	}
}

if (!customElements.get("tp-asciidoc-multi-slides")) {
	customElements.define("tp-asciidoc-multi-slides", TpAsciidocMultiSlides);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-asciidoc-multi-slides": TpAsciidocMultiSlides;
	}
}
