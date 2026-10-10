import styles from './tabs.css' with { type: 'css' };

class TpDemoTabs extends HTMLElement {
  constructor() {
    super();

    this.selected = 0;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  get items() {
    const list = this.querySelector('dl');

    if (!(list instanceof HTMLDListElement)) {
      return [];
    }

    const terms = Array.from(list.querySelectorAll(':scope > dt'));
    const descriptions = Array.from(list.querySelectorAll(':scope > dd'));

    return terms.map((term, index) => ({
      label: term.innerHTML,
      content: descriptions[index]?.innerHTML ?? '',
    }));
  }

  select(index) {
    this.selected = index;
    this.render();
  }

  render() {
    const items = this.items;

    this.shadowRoot.adoptedStyleSheets = [styles];

    this.shadowRoot.innerHTML = `
      <slot hidden></slot>

      <section class="tabs">
        <div class="tab-list" role="tablist">
          ${items
            .map(
              (item, index) => `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${String(index === this.selected)}"
                  data-index="${String(index)}"
                >
                  ${item.label}
                </button>
              `,
            )
            .join('')}
        </div>

        <div class="tab-panel" role="tabpanel">
          ${items[this.selected]?.content ?? ''}
        </div>
      </section>
    `;

    for (const button of this.shadowRoot.querySelectorAll('button[data-index]')) {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-index'));

        if (Number.isInteger(index)) {
          this.select(index);
        }
      });
    }
  }
}

if (!customElements.get('tp-demo-tabs')) {
  customElements.define('tp-demo-tabs', TpDemoTabs);
}