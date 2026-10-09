import { describe, expect, it } from '@tp/test';
import './my-counter.js';

describe('<my-counter>', () => {
  it('renders the initial count', async () => {
    const counter = document.createElement('my-counter');
    document.body.append(counter);

    await customElements.whenDefined('my-counter');
    await (counter as HTMLElement & { updateComplete?: Promise<boolean> }).updateComplete;

    const button = counter.shadowRoot?.querySelector('button');

    expect(button?.textContent?.trim()).to.equal('Count: 0');

    counter.remove();
  });

  it('increments on click', async () => {
    const counter = document.createElement('my-counter');
    document.body.append(counter);

    await customElements.whenDefined('my-counter');
    await (counter as HTMLElement & { updateComplete?: Promise<boolean> }).updateComplete;

    const button = counter.shadowRoot?.querySelector('button');
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await (counter as HTMLElement & { updateComplete?: Promise<boolean> }).updateComplete;

    expect(button?.textContent?.trim()).to.equal('Count: 1');

    counter.remove();
  });
});