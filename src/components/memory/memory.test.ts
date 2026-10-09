import { afterEach, describe, expect, it, vi } from 'vitest';

import './memory.js';

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

function createMemory(): HTMLElement {
  const element = document.createElement('tp-memory');
  element.innerHTML = `
    <ol>
      <li><img src="hearts/hk.svg" alt="King of hearts"></li>
      <li><strong>Queen of spades</strong></li>
      <li>Ace of clubs</li>
    </ol>
  `;
  document.body.append(element);
  return element;
}

describe('<tp-memory>', () => {
  it('uses a 1000 ms mismatch delay by default', () => {
    const element = document.createElement('tp-memory') as HTMLElement & {
      mismatchDelay: number;
    };
    element.innerHTML = '<ol><li>One</li></ol>';
    document.body.append(element);

    expect(element.mismatchDelay).toBe(1000);
  });

  it('creates two flip cards per list item in a switcher', () => {
    const element = createMemory();
    const board = element.querySelector(':scope > tp-switcher');
    expect(board).not.toBeNull();
    expect(element.querySelector('.tp-memory-title')?.textContent).toBe('Memory');
    expect(element.querySelector('.tp-memory-controls > tp-chronometer')).not.toBeNull();
    expect(element.querySelector('.tp-memory-reset')?.getAttribute('name')).toBe('refresh');
    expect(
      element.querySelector('.tp-memory-reset')?.nextElementSibling?.classList.contains(
        'tp-memory-chronometer',
      ),
    ).toBe(true);
    expect(board?.querySelectorAll(':scope > tp-flip-card')).toHaveLength(6);
    expect(element.querySelectorAll('tp-flip-card[data-pair="0"]')).toHaveLength(2);
    expect(element.querySelectorAll('.tp-flip-card-verso img[alt="King of hearts"]')).toHaveLength(
      2,
    );
    expect(element.querySelectorAll('tp-flip-card[fit-content]')).toHaveLength(6);
    expect(element.querySelectorAll('.tp-flip-card-sizer')).toHaveLength(6);
    expect(element.querySelector('ol')).toBeNull();
  });

  it('resets the cards and chronometer with the refresh button', () => {
    vi.useFakeTimers();
    const element = createMemory();
    const card = element.querySelector<HTMLElement>('tp-flip-card');
    const display = element.querySelector<HTMLElement>('[data-tp-chronometer-display]');
    card?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    vi.advanceTimersByTime(1200);

    element.querySelector<HTMLElement>('.tp-memory-reset')?.click();

    expect(element.querySelectorAll('tp-flip-card[flipped]')).toHaveLength(0);
    expect(element.querySelectorAll('tp-flip-card[disabled]')).toHaveLength(0);
    expect(display?.textContent).toBe('00:00.00');
    vi.useRealTimers();
  });

  it('starts on the first card and pauses when every pair is matched', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T10:00:00'));
    const element = document.createElement('tp-memory');
    element.innerHTML = '<ol><li>One</li></ol>';
    document.body.append(element);
    const pair = element.querySelectorAll<HTMLElement>('tp-flip-card');
    const display = element.querySelector<HTMLElement>('[data-tp-chronometer-display]');

    vi.advanceTimersByTime(1000);
    expect(display?.textContent).toBe('00:00.00');
    pair[0]?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    vi.advanceTimersByTime(1250);
    pair[1]?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    const finalTime = display?.textContent;
    vi.advanceTimersByTime(1000);

    expect(finalTime).toMatch(/^00:01\.\d{2}$/);
    expect(display?.textContent).toBe(finalTime);
    expect(element.querySelectorAll('tp-chronometer > tp-icon-button')).toHaveLength(3);
    vi.useRealTimers();
  });

  it('provides the blue and red OpenDecks backs', () => {
    const blue = createMemory();
    const red = document.createElement('tp-memory');
    red.setAttribute('back', 'red');
    red.innerHTML = '<ul><li>One</li></ul>';
    document.body.append(red);

    expect(blue.querySelector<HTMLImageElement>('.tp-memory-card-back')?.src).toContain(
      'back-blue.svg',
    );
    expect(red.querySelector<HTMLImageElement>('.tp-memory-card-back')?.src).toContain(
      'back-red.svg',
    );
  });

  it('keeps a matching pair visible and disabled', () => {
    const element = createMemory();
    const pair = element.querySelectorAll<HTMLElement>('tp-flip-card[data-pair="1"]');
    pair[0]?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    pair[1]?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    expect(Array.from(pair).every((card) => card.hasAttribute('flipped'))).toBe(true);
    expect(Array.from(pair).every((card) => card.hasAttribute('disabled'))).toBe(true);
    expect(Array.from(pair).every((card) => card.dataset.matched === 'true')).toBe(true);
  });

  it('prevents two consecutive clicks on the same card', () => {
    const element = createMemory();
    const card = element.querySelector<HTMLElement>('tp-flip-card');
    const scene = card?.querySelector<HTMLElement>('.tp-flip-card-scene');

    scene?.click();
    scene?.click();

    expect(card?.hasAttribute('flipped')).toBe(true);
    expect(card?.hasAttribute('disabled')).toBe(true);
    expect(element.querySelectorAll('tp-flip-card[flipped]')).toHaveLength(1);
  });

  it('turns a mismatched pair back after the configured delay', () => {
    vi.useFakeTimers();
    const element = createMemory();
    element.setAttribute('mismatch-delay', '10');
    const first = element.querySelector<HTMLElement>('tp-flip-card[data-pair="0"]');
    const second = element.querySelector<HTMLElement>('tp-flip-card[data-pair="1"]');
    first?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    second?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    vi.advanceTimersByTime(10);
    expect(first?.hasAttribute('flipped')).toBe(false);
    expect(second?.hasAttribute('flipped')).toBe(false);
    vi.useRealTimers();
  });

  it('renders an error when the list is missing', () => {
    const element = document.createElement('tp-memory');
    document.body.append(element);
    expect(element.querySelector('.tp-memory-error')?.textContent).toContain(
      'requires an ol or ul list',
    );
  });

  it('renders an error for an empty list', () => {
    document.body.innerHTML = '<tp-memory><ol><span>Not a card</span></ol></tp-memory>';
    expect(document.querySelector('.tp-memory-error')?.textContent).toContain(
      'requires at least one list item',
    );
  });

  it('supports custom backs and normalizes public properties', () => {
    const element = document.createElement('tp-memory') as HTMLElement & {
      back: string; mismatchDelay: number;
    };
    element.back = '/custom-back.svg';
    element.mismatchDelay = -10;
    element.innerHTML = '<ol><li>One</li></ol>';
    document.body.append(element);
    expect(element.querySelector<HTMLImageElement>('.tp-memory-card-back')?.src).toContain('custom-back.svg');
    expect(element.mismatchDelay).toBe(0);
    element.back = '';
    expect(element.back).toContain('back-blue.svg');
    element.setAttribute('mismatch-delay', 'invalid');
    expect(element.mismatchDelay).toBe(1000);
  });

  it('ignores card changes while resolving a mismatch and clears the timer on disconnect', () => {
    vi.useFakeTimers();
    const element = createMemory();
    const first = element.querySelector<HTMLElement>('tp-flip-card[data-pair="0"]');
    const second = element.querySelector<HTMLElement>('tp-flip-card[data-pair="1"]');
    const third = element.querySelector<HTMLElement>('tp-flip-card[data-pair="2"]');
    first?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    second?.querySelector<HTMLElement>('.tp-flip-card-scene')?.click();
    third?.dispatchEvent(new CustomEvent('tp-flip-card-change'));
    expect(third?.hasAttribute('flipped')).toBe(false);
    element.remove();
    expect(vi.getTimerCount()).toBeGreaterThanOrEqual(0);
  });
});
