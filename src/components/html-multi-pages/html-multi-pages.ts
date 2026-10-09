/** @module components/html-multi-pages @summary Multi-page native HTML documentation shell. */
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

/** @tagname tp-html-multi-pages @summary Renders a navigable repository as native browser HTML. * @example
 * <tp-html-multi-pages></tp-html-multi-pages>
 */
export class TpHtmlMultiPages extends TpMarkupMultiPages {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "html";
	}
}

if (!customElements.get("tp-html-multi-pages"))
	customElements.define("tp-html-multi-pages", TpHtmlMultiPages);

declare global {
	interface HTMLElementTagNameMap {
		"tp-html-multi-pages": TpHtmlMultiPages;
	}
}
