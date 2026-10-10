import { describe, expect, it } from '@tp/test';
import { getTitleText, setupButton } from './main.js';

describe('HTML document', () => {
  it('has a title', () => {
    expect(getTitleText()).to.equal('Hello HTML');
  });

  it('updates button text on click', () => {
    setupButton();

    const button = document.querySelector('#button');
    button?.click();

    expect(button?.textContent).to.equal('Clicked');
  });
});
