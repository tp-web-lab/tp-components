/** @module components/asciidoc-single-page @summary Single-page AsciiDoc renderer. */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
// tp-docgen:dependencies:end

import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from '../markup-single-page/markup-single-page.js';

/** @tagname tp-asciidoc-single-page @summary Renders one document with tp-asciidoc. * @example
 * <tp-asciidoc-single-page></tp-asciidoc-single-page>
 */
export class TpAsciidocSinglePage extends TpMarkupSinglePage {
  protected override get fixedLanguage(): TpMarkupSinglePageLanguage { return 'asciidoc'; }
}

if (!customElements.get('tp-asciidoc-single-page')) customElements.define('tp-asciidoc-single-page', TpAsciidocSinglePage);

declare global { interface HTMLElementTagNameMap { 'tp-asciidoc-single-page': TpAsciidocSinglePage } }
