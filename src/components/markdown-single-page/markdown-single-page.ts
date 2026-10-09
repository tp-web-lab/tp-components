/** @module components/markdown-single-page @summary Single-page Markdown renderer. */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
// tp-docgen:dependencies:end

import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from '../markup-single-page/markup-single-page.js';

/** @tagname tp-markdown-single-page @summary Renders one document with tp-markdown. * @example
 * <tp-markdown-single-page></tp-markdown-single-page>
 */
export class TpMarkdownSinglePage extends TpMarkupSinglePage {
  protected override get fixedLanguage(): TpMarkupSinglePageLanguage { return 'markdown'; }
}

if (!customElements.get('tp-markdown-single-page')) customElements.define('tp-markdown-single-page', TpMarkdownSinglePage);

declare global { interface HTMLElementTagNameMap { 'tp-markdown-single-page': TpMarkdownSinglePage } }
