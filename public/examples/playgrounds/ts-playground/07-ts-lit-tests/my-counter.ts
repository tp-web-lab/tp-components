import { LitElement, css, html } from 'lit';

export class MyCounter extends LitElement {
  static styles = css`
    button {
      font: inherit;
      padding: 0.4rem 0.7rem;
    }
  `;

  private count = 0;

  private increment(): void {
    this.count += 1;
    this.requestUpdate();
  }

  render() {
    return html`
      <button type="button" @click=${this.increment}>
        Count: ${this.count}
      </button>
    `;
  }
}

customElements.define('my-counter', MyCounter);