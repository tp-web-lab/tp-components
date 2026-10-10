class MyCounter extends HTMLElement {
  #count = 0;

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <button id="counter">Count: ${this.#count}</button>
      <button type="reset">Reset</button>
    `;

    const button = this.querySelector('#counter');
    const resetButton = this.querySelector('button[type="reset"]');

    button?.addEventListener('click', () => {
      this.#count += 1;
      this.render();
      console.log(`count = ${this.#count}`);
    });

    resetButton?.addEventListener('click', () => {
      this.#count = 0;
      this.render();
      console.clear();
    });
  }
}

if (!customElements.get('my-counter')) {
  customElements.define('my-counter', MyCounter);
}