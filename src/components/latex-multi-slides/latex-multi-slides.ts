/**
 * @module components/latex-multi-slides
 * @summary LaTeX slide presentation shell.
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
 * The custom `<tp-latex-multi-slides>` element presents LaTeX documents as a slide deck.
 *
 * @tagname tp-latex-multi-slides
 * @summary Presents LaTeX documents as a slide deck.
 * @example
 * <tp-latex-multi-slides repository="/docs/components/_shared/intro-documents/latex" label="A small guide"></tp-latex-multi-slides>
 */
export class TpLatexMultiSlides extends TpMarkupMultiSlides {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "latex";
	}
}

if (!customElements.get("tp-latex-multi-slides")) {
	customElements.define("tp-latex-multi-slides", TpLatexMultiSlides);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-latex-multi-slides": TpLatexMultiSlides;
	}
}
