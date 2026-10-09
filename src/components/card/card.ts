/**
 * @module components/card
 * @summary Structured card component using a definition list as source.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './card.css?inline';
import { TpBase } from '../base/base.js';

type CardSection = 'header' | 'main' | 'footer';

const CARD_SECTIONS: CardSection[] = ['header', 'main', 'footer'];

/**
 * Displays structured header, main, and footer content as a card.
 *
 * The source is a definition list whose terms are `header`, `main`, and `footer`.
 * Section order in the source does not affect the rendered card order.
 *
 * @summary Displays a structured card.
 * @tagname tp-card
 *
 * @cssprop --tp-card-background Card background.
 * @cssprop --tp-card-border-color Card border color.
 * @cssprop --tp-card-border-radius Card border radius.
 * @cssprop --tp-card-footer-background Footer background.
 * @cssprop --tp-card-header-background Header background.
 * @cssprop --tp-card-padding Section padding.
 * @example
 * <tp-card style="width:300px;">
 * <dl>
 * <dt>header</dt>
 * <dd>content header</dd>
 * <dt>footer</dt>
 * <dd>content footer</dd>
 * <dt>main</dt>
 * <dd>content body</dd>
 * </dl>
 * </tp-card>
 */
export class TpCard extends TpBase {
  private static readonly styleId = 'tp-card-styles';

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpCard.styleId, style);
    this.classList.add('tp-card');

    if (this.dataset.tpCardRendered === 'true') {
      return;
    }

    this.renderFromDefinitionList();
  }

  private renderFromDefinitionList(): void {
    const definitionList = Array.from(this.children).find(
      (child): child is HTMLDListElement => child.tagName === 'DL',
    );

    if (!definitionList) {
      this.renderError('tp-card requires a definition list');
      return;
    }

    const content = new Map<CardSection, Node[]>();
    let currentSection: CardSection | null = null;

    for (const child of Array.from(definitionList.children)) {
      if (child.tagName === 'DT') {
        const key = child.textContent?.trim().toLowerCase() ?? '';
        currentSection = CARD_SECTIONS.includes(key as CardSection)
          ? key as CardSection
          : null;
        continue;
      }

      if (child.tagName === 'DD' && currentSection) {
        const nodes = content.get(currentSection) ?? [];
        nodes.push(...Array.from(child.childNodes));
        content.set(currentSection, nodes);
      }
    }

    const fragment = document.createDocumentFragment();
    for (const section of CARD_SECTIONS) {
      const nodes = content.get(section);
      if (!nodes || nodes.length === 0) {
        continue;
      }

      const element = document.createElement(section === 'main' ? 'div' : section);
      element.className = `tp-card-${section}`;
      const media = section === 'main'
        && !content.has('header')
        && !content.has('footer')
        ? this.findOnlyMedia(nodes)
        : null;
      element.append(...(media ? [media] : nodes));

      if (media) {
        element.classList.add('tp-card-main-media');
        this.classList.add('tp-card-media-only');
      }

      fragment.append(element);
    }

    if (!fragment.hasChildNodes()) {
      this.renderError('tp-card requires header, main, or footer content');
      return;
    }

    this.replaceChildren(fragment);
    this.dataset.tpCardRendered = 'true';
  }

  private findOnlyMedia(nodes: Node[]): Element | null {
    const significantNodes = nodes.filter(
      (node) => node.nodeType !== Node.COMMENT_NODE
        && !(node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()),
    );
    if (significantNodes.length !== 1) {
      return null;
    }

    const candidate = significantNodes[0];
    if (!(candidate instanceof Element)) {
      return null;
    }
    if (['img', 'svg'].includes(candidate.localName)) {
      return candidate;
    }
    if (!['figure', 'p', 'span'].includes(candidate.localName)) {
      return null;
    }

    return this.findOnlyMedia(Array.from(candidate.childNodes));
  }

  private renderError(message: string): void {
    const error = document.createElement('div');
    error.className = 'tp-card-error';
    error.textContent = `Error: ${message}`;
    this.replaceChildren(error);
  }
}

if (!customElements.get('tp-card')) {
  customElements.define('tp-card', TpCard);
}
