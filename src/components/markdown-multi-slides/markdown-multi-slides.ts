/**
 * @module components/markdown-multi-slides
 * @summary Markdown slide presentation shell.
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
 * @tagname tp-markdown-multi-slides
 * @summary presents a navigable repository of Markdown slides.
 * @example
 * <tp-markdown-multi-slides></tp-markdown-multi-slides>
 */
export class TpMarkdownMultiSlides extends TpMarkupMultiSlides {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "markdown";
	}
}

if (!customElements.get("tp-markdown-multi-slides")) {
	customElements.define("tp-markdown-multi-slides", TpMarkdownMultiSlides);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-markdown-multi-slides": TpMarkdownMultiSlides;
	}
}
