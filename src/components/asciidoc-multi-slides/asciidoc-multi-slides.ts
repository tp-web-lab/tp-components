/**
 * @module components/asciidoc-multi-slides
 * @summary AsciiDoc slide presentation shell.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
// tp-docgen:dependencies:end

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
