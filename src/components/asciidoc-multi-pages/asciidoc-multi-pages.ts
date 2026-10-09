/** @module components/asciidoc-multi-pages 
 * @summary Multi-page AsciiDoc documentation shell. 
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
// tp-docgen:dependencies:end

import {
	TpMarkupMultiPages,
	type TpMarkupMultiPagesLanguage,
} from "../markup-multi-pages/markup-multi-pages.js";

/** @tagname tp-asciidoc-multi-pages @summary Renders a navigable repository with tp-asciidoc. * @example
 * <tp-asciidoc-multi-pages></tp-asciidoc-multi-pages>
 */
export class TpAsciidocMultiPages extends TpMarkupMultiPages {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "asciidoc";
	}
}

if (!customElements.get("tp-asciidoc-multi-pages"))
	customElements.define("tp-asciidoc-multi-pages", TpAsciidocMultiPages);

declare global {
	interface HTMLElementTagNameMap {
		"tp-asciidoc-multi-pages": TpAsciidocMultiPages;
	}
}
