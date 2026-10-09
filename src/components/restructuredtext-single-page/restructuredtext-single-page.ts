/** @module components/restructuredtext-single-page @summary Single-page reStructuredText renderer. */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
// tp-docgen:dependencies:end

import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from '../markup-single-page/markup-single-page.js';

/** @tagname tp-restructuredtext-single-page @summary Renders one document with tp-restructuredtext. * @example
 * <tp-restructuredtext-single-page></tp-restructuredtext-single-page>
 */
export class TpRestructuredTextSinglePage extends TpMarkupSinglePage {
  protected override get fixedLanguage(): TpMarkupSinglePageLanguage { return 'restructuredtext'; }
}

if (!customElements.get('tp-restructuredtext-single-page')) customElements.define('tp-restructuredtext-single-page', TpRestructuredTextSinglePage);

declare global { interface HTMLElementTagNameMap { 'tp-restructuredtext-single-page': TpRestructuredTextSinglePage } }
