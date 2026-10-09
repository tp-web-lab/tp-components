/** @module components/restructuredtext-multi-pages @summary Multi-page reStructuredText documentation shell. */
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

/** @tagname tp-restructuredtext-multi-pages @summary Renders a navigable repository with tp-restructuredtext. * @example
 * <tp-restructuredtext-multi-pages></tp-restructuredtext-multi-pages>
 */
export class TpRestructuredTextMultiPages extends TpMarkupMultiPages {
	protected override get fixedLanguage(): TpMarkupMultiPagesLanguage {
		return "restructuredtext";
	}
}

if (!customElements.get("tp-restructuredtext-multi-pages"))
	customElements.define(
		"tp-restructuredtext-multi-pages",
		TpRestructuredTextMultiPages,
	);

declare global {
	interface HTMLElementTagNameMap {
		"tp-restructuredtext-multi-pages": TpRestructuredTextMultiPages;
	}
}
