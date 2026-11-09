/**
 * @module components/restructuredtext-multi-slides
 * @summary reStructuredText slide presentation shell.
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
 * The custom `<tp-restructuredtext-multi-slides>` element presents reStructuredText documents as a slide deck.
 *
 * @tagname tp-restructuredtext-multi-slides
 * @summary Presents reStructuredText documents as a slide deck.
 * @example
 * <tp-restructuredtext-multi-slides></tp-restructuredtext-multi-slides>
 */
export class TpRestructuredTextMultiSlides extends TpMarkupMultiSlides {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "restructuredtext";
	}
}

if (!customElements.get("tp-restructuredtext-multi-slides")) {
	customElements.define(
		"tp-restructuredtext-multi-slides",
		TpRestructuredTextMultiSlides,
	);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-restructuredtext-multi-slides": TpRestructuredTextMultiSlides;
	}
}
