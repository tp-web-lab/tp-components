import { describe, expect, it } from 'vitest';

import './flip-card.js';

function createFlipCard(): HTMLElement {
  const element = document.createElement('tp-flip-card');
  element.innerHTML = `
    <dl>
      <dt>recto</dt><dd><strong>content recto</strong></dd>
      <dt>verso</dt><dd>content verso</dd>
    </dl>
  `;
  document.body.append(element);
  return element;
}

describe('<tp-flip-card>', () => {
  it('renders and flips both faces', () => {
    const element = createFlipCard();
    const button = element.querySelector<HTMLElement>('.tp-flip-card-button');

    expect(element.querySelector('.tp-flip-card-recto strong')?.textContent).toBe('content recto');
    expect(element.querySelector('.tp-flip-card-verso')?.textContent).toBe('content verso');
    expect(button?.dataset.block).toBe('bottom');
    expect(button?.dataset.inline).toBe('end');

    button?.click();

    expect(element.hasAttribute('flipped')).toBe(true);
    expect(button?.tagName).toBe('TP-ICON-BUTTON');
    expect(button?.getAttribute('name')).toBe('card-flip');
    expect(button?.getAttribute('label')).toBe('Show recto');
  });

  it('positions the overlaid button', () => {
    const element = createFlipCard();
    element.setAttribute('button-position', 'top center');
    const button = element.querySelector<HTMLElement>('.tp-flip-card-button');

    expect(button?.dataset.block).toBe('top');
    expect(button?.dataset.inline).toBe('center');
  });

  it('hides the button and flips from the card surface when position is none', () => {
    const element = createFlipCard();
    element.setAttribute('button-position', 'none');
    const button = element.querySelector<HTMLElement>('.tp-flip-card-button');
    const scene = element.querySelector<HTMLElement>('.tp-flip-card-scene');

    expect(button?.hidden).toBe(true);
    expect(scene?.getAttribute('role')).toBe('button');
    scene?.click();
    expect(element.hasAttribute('flipped')).toBe(true);
    scene?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(element.hasAttribute('flipped')).toBe(false);
  });

  it('does not flip when disabled', () => {
    const element = createFlipCard();
    element.setAttribute('disabled', '');
    const button = element.querySelector<HTMLElement>('.tp-flip-card-button');
    let changeCount = 0;
    element.addEventListener('tp-flip-card-change', () => changeCount++);

    button?.click();
    (element as HTMLElement & { flip: () => boolean }).flip();

    expect(button?.hasAttribute('disabled')).toBe(true);
    expect(element.hasAttribute('flipped')).toBe(false);
    expect(changeCount).toBe(0);
  });

  it.each([32, 52])('supports a deck of %i independent cards', (size) => {
    const deck = Array.from({ length: size }, () => createFlipCard());
    deck[31]?.querySelector<HTMLElement>('.tp-flip-card-button')?.click();

    expect(deck).toHaveLength(size);
    expect(deck[31]?.hasAttribute('flipped')).toBe(true);
    expect(deck.filter((card) => card.hasAttribute('flipped'))).toHaveLength(1);
  });

  it('renders an error when a face is missing', () => {
    const element = document.createElement('tp-flip-card');
    element.innerHTML = '<dl><dt>recto</dt><dd>recto</dd></dl>';
    document.body.append(element);

    expect(element.querySelector('.tp-flip-card-error')?.textContent).toContain(
      'requires recto and verso content',
    );
  });

  it('renders an error when the definition list is missing', () => {
    const element = document.createElement('tp-flip-card');
    element.textContent = 'invalid';
    document.body.append(element);
    expect(element.querySelector('.tp-flip-card-error')?.textContent).toContain(
      'requires a definition list',
    );
  });

  it('reflects its public state properties', () => {
    const element = createFlipCard() as HTMLElement & {
      buttonPosition: string;
      disabled: boolean;
      flipped: boolean;
    };
    element.disabled = true;
    element.flipped = true;
    element.buttonPosition = 'top start';
    expect(element.disabled).toBe(true);
    expect(element.flipped).toBe(true);
    expect(element.buttonPosition).toBe('top start');
    element.disabled = false;
    element.flipped = false;
    expect(element.hasAttribute('disabled')).toBe(false);
    expect(element.hasAttribute('flipped')).toBe(false);
  });
});
