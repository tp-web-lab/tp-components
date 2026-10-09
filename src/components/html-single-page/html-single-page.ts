/** @module components/html-single-page @summary Single-page native HTML renderer. */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
// tp-docgen:dependencies:end

import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from '../markup-single-page/markup-single-page.js';

/** @tagname tp-html-single-page @summary Inserts one HTML document using the browser renderer. * @example
 * <tp-html-single-page></tp-html-single-page>
 */
export class TpHtmlSinglePage extends TpMarkupSinglePage {
  protected override get fixedLanguage(): TpMarkupSinglePageLanguage { return 'html'; }
}

if (!customElements.get('tp-html-single-page')) customElements.define('tp-html-single-page', TpHtmlSinglePage);

declare global { interface HTMLElementTagNameMap { 'tp-html-single-page': TpHtmlSinglePage } }
