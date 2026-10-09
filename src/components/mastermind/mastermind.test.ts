import { afterEach, describe, expect, it, vi } from 'vitest';

import './mastermind.js';

function createMastermind(): HTMLElement {
  const element = document.createElement('tp-mastermind');
  element.setAttribute('solution', 'red blue green yellow');
  element.setAttribute('attempts', '6');
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('<tp-mastermind> timing and reset', () => {
  it('times the game from the first peg until the solution is found', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T10:00:00'));
    const element = createMastermind();
    const display = element.querySelector<HTMLElement>('[data-tp-chronometer-display]');

    vi.advanceTimersByTime(1000);
    expect(display?.textContent).toBe('00:00.00');
    for (const color of ['red', 'blue', 'green', 'yellow']) {
      element.querySelector<HTMLButtonElement>(`.tp-mastermind-color[data-color="${color}"]`)?.click();
    }
    vi.advanceTimersByTime(1250);
    element.querySelector<HTMLButtonElement>('.tp-mastermind-check')?.click();
    const finalTime = display?.textContent;
    vi.advanceTimersByTime(1000);

    expect(finalTime).toMatch(/^00:01\.\d{2}$/);
    expect(display?.textContent).toBe(finalTime);
  });

  it('keeps the code on reset game and changes it with refresh', () => {
    const element = createMastermind();
    const original = element.getAttribute('solution');
    element.querySelector<HTMLElement>('[data-assist="reset-game"]')?.click();
    expect(element.getAttribute('solution')).toBe(original);

    element.querySelector<HTMLElement>('.tp-mastermind-new-game')?.click();
    expect(element.getAttribute('solution')).not.toBe(original);
  });

  it.each([
    ['', 'red blue', 'solution cannot be empty'],
    ['red', 'red blue', 'between 2 and 8'],
    ['red black', 'red blue', 'Unknown Mastermind color'],
    ['red blue', 'red', 'at least two available colors'],
    ['red blue', 'red green', 'included in the available colors'],
  ])('reports invalid solution %j and colors %j', (solution, colors, message) => {
    const element = document.createElement('tp-mastermind');
    element.setAttribute('solution', solution);
    element.setAttribute('colors', colors);
    document.body.append(element);
    expect(element.textContent).toContain(message);
  });

  it.each(['0', '21', 'bad'])('rejects invalid attempts %j', (attempts) => {
    const element = document.createElement('tp-mastermind');
    element.setAttribute('solution', 'red blue');
    element.setAttribute('attempts', attempts);
    document.body.append(element);
    expect(element.textContent).toContain('attempts must be an integer');
  });

  it('requires a complete guess, then scores misplaced colors and supports undo/redo', () => {
    const element = createMastermind();
    element.querySelector<HTMLButtonElement>('.tp-mastermind-check')?.click();
    expect(element.querySelector('.tp-mastermind-status')?.textContent).toContain('Complete');

    for (const color of ['blue', 'red', 'yellow', 'green']) {
      element.querySelector<HTMLButtonElement>(`.tp-mastermind-color[data-color="${color}"]`)?.click();
    }
    element.querySelector<HTMLButtonElement>('.tp-mastermind-check')?.click();
    expect(element.querySelector('.tp-mastermind-feedback-exact')?.textContent).toContain('0');
    expect(element.querySelector('.tp-mastermind-feedback-misplaced')?.textContent).toContain('4');
    element.querySelector<HTMLElement>('.tp-mastermind-undo')?.click();
    element.querySelector<HTMLElement>('.tp-mastermind-redo')?.click();
    expect(element.querySelector('.tp-mastermind-status')?.textContent).toContain('Attempt 2');
  });

  it('loses after the configured final attempt', () => {
    const element = document.createElement('tp-mastermind');
    element.setAttribute('solution', 'red blue');
    element.setAttribute('attempts', '1');
    document.body.append(element);
    element.querySelector<HTMLButtonElement>('.tp-mastermind-color[data-color="blue"]')?.click();
    element.querySelector<HTMLButtonElement>('.tp-mastermind-color[data-color="red"]')?.click();
    element.querySelector<HTMLButtonElement>('.tp-mastermind-check')?.click();
    expect(element.querySelector('.tp-mastermind-status')?.textContent).toContain('No attempts left');
  });

  it('opens assistance and applies show peg and show solution', () => {
    const element = createMastermind();
    element.querySelector<HTMLElement>('.tp-mastermind-assist-trigger')?.click();
    element.querySelector<HTMLElement>('[data-assist="show-peg"]')?.click();
    expect(element.querySelectorAll('.tp-mastermind-peg.filled')).toHaveLength(1);
    element.querySelector<HTMLElement>('[data-assist="show-solution"]')?.click();
    expect(element.querySelectorAll('.tp-mastermind-peg.filled')).toHaveLength(4);
    element.querySelector<HTMLButtonElement>('.tp-mastermind-check')?.click();
    expect(element.querySelector('.tp-mastermind-status')?.textContent).toContain('Code cracked');
    element.querySelector<HTMLElement>('[data-assist="show-peg"]')?.click();
  });

  it('replaces a peg after a row is full and ignores clicks on past rows', () => {
    const element = createMastermind();
    for (const color of ['red', 'blue', 'green', 'yellow']) {
      element.querySelector<HTMLButtonElement>(`.tp-mastermind-color[data-color="${color}"]`)?.click();
    }
    element.querySelector<HTMLButtonElement>('.tp-mastermind-color[data-color="purple"]')?.click();
    element.querySelector<HTMLButtonElement>('.tp-mastermind-peg[data-row="0"][data-col="0"]')?.click();
    expect(element.querySelectorAll('.tp-mastermind-peg.filled')).toHaveLength(4);
  });

  it('ignores unavailable history and assistance targets', () => {
    const element = createMastermind();
    element.querySelector<HTMLElement>('.tp-mastermind-undo')?.click();
    element.querySelector<HTMLElement>('.tp-mastermind-redo')?.click();
    element.querySelector<HTMLElement>('.tp-mastermind-assist')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    const item = element.querySelector<HTMLElement>('[data-assist="show-peg"]');
    item?.setAttribute('data-assist', 'unknown');
    item?.click();
    expect(element.querySelector('.tp-mastermind-status')?.textContent).toContain('Attempt 1');
  });
});
