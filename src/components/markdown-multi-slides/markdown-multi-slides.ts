/**
 * @module components/markdown-multi-slides
 * @summary Markdown slide presentation shell.
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
 * The custom `<tp-markdown-multi-slides>` element presents Markdown documents as a slide deck.
 *
 * @tagname tp-markdown-multi-slides
 * @summary Presents Markdown documents as a slide deck.
 * @example
 * <tp-markdown-multi-slides repository="/docs/components/markdown-multi-pages/docs"></tp-markdown-multi-slides>
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
