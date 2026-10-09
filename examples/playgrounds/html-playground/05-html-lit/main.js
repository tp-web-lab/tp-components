import { LitElement, html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { unsafeHTML } from 'https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js/+esm';
import styles from './tabs.css' with { type: 'css' };

class TpDemoTabs extends LitElement {
  static styles = styles;

  static properties = {
    selected: { type: Number },
  };

  constructor() {
    super();
    this.selected = 0;
  }

  get items() {
    const list = this.querySelector('dl');

    if (!(list instanceof HTMLDListElement)) {
      return [];
    }

    const terms = Array.from(list.querySelectorAll(':scope > dt'));
    const descriptions = Array.from(list.querySelectorAll(':scope > dd'));

    return terms.map((term, index) => ({
      label: term.innerHTML ?? '',
      content: descriptions[index]?.innerHTML ?? '',
    }));
  }

  select(index) {
    this.selected = index;
  }

  render() {
    const items = this.items;

    return html`
      <section class="tabs">
        <div class="tab-list" role="tablist">
          ${items.map(
            (item, index) => html`
              <button
                type="button"
                role="tab"
                aria-selected=${index === this.selected}
                @click=${() => this.select(index)}
              >
                ${unsafeHTML(item.label)}
              </button>
            `,
          )}
        </div>
        <div class="tab-panel" role="tabpanel">
          ${unsafeHTML(items[this.selected]?.content ?? '')}
        </div>
      </section>
    `;
  }
}

if (!customElements.get('tp-demo-tabs')) {
  customElements.define('tp-demo-tabs', TpDemoTabs);
}