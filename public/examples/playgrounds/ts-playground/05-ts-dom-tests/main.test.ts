import { describe, expect, it } from '@tp/test';
import { getTitleText, setupButtons } from './main.js';

describe('DOM helpers', () => {
  it('reads the title text', () => {
    expect(getTitleText()).to.equal('DOM tests');
  });

  it('updates the button text on click', () => {
    setupButtons();

    const button = document.querySelector('#button') as HTMLButtonElement;
    button?.click();

    expect(button?.textContent).to.equal('Clicked');
  });
});