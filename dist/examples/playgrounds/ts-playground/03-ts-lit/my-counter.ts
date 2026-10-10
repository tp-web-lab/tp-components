import { LitElement, html, css } from 'lit';

export class MyCounter extends LitElement {
  static styles = css`
    button {
      font-size: 1.2rem;
    }
  `;

  private count = 0;

  private increment(): void {
    this.count += 1;
    this.requestUpdate();
  }

  render() {
    return html`
      <button @click=${this.increment}>
        Count: ${this.count}
      </button>
    `;
  }
}

customElements.define('my-counter', MyCounter);