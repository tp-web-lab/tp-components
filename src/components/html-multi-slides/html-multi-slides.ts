/**
 * @module components/html-multi-slides
 * @summary Native HTML slide presentation shell.
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
 * The custom `<tp-html-multi-slides>` element presents HTML documents as a slide deck.
 *
 * @tagname tp-html-multi-slides
 * @summary Presents HTML documents as a slide deck.
 * @example
 * <tp-html-multi-slides></tp-html-multi-slides>
 */
export class TpHtmlMultiSlides extends TpMarkupMultiSlides {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "html";
	}
}

if (!customElements.get("tp-html-multi-slides")) {
	customElements.define("tp-html-multi-slides", TpHtmlMultiSlides);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-html-multi-slides": TpHtmlMultiSlides;
	}
}
