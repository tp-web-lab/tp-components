import { afterEach, describe, expect, it } from 'vitest';
import './cryptarithm.js';
import { TpCryptarithm } from './cryptarithm.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-cryptarithm>', () => {
  it('is registered and reports a missing definition', () => {
    const element = document.createElement('tp-cryptarithm');
    document.body.append(element);
    expect(element).toBeInstanceOf(TpCryptarithm);
    expect(element.textContent).toContain('Empty cryptarithm puzzle');
  });

  it('renders an attribute-authored equation with accessible controls', () => {
    document.body.innerHTML = `
      <tp-cryptarithm equation="UN + UN + NEUF = ONZE" solution="81 + 81 + 1987 = 2149"></tp-cryptarithm>`;
    const element = document.querySelector('tp-cryptarithm') as HTMLElement;
    expect(element.querySelector('.tp-cryptarithm-board')).not.toBeNull();
    expect(element.querySelector('select')?.getAttribute('aria-label')).toBe('Assistance actions');
  });

  it('accepts a definition list and rejects more than ten letters', () => {
    document.body.innerHTML = `
      <tp-cryptarithm><dl><dt>equation</dt><dd>UN + UN + NEUF = ONZE</dd>
      <dt>solution</dt><dd>81 + 81 + 1987 = 2149</dd></dl></tp-cryptarithm>
      <tp-cryptarithm equation="ABCDEFGHIJK" solution="12345678901"></tp-cryptarithm>`;
    const games = document.querySelectorAll('tp-cryptarithm');
    expect(games[0]?.querySelector('.tp-cryptarithm-board')).not.toBeNull();
    expect(games[1]?.textContent).toContain('at most 10 distinct letters');
  });

  it('executes board focus, history, and every assistance action', () => {
    document.body.innerHTML = `
      <tp-cryptarithm equation="UN + UN + NEUF = ONZE" solution="81 + 81 + 1987 = 2149"></tp-cryptarithm>`;
    const element = document.querySelector('tp-cryptarithm') as HTMLElement;
    element.querySelector<HTMLElement>('.tp-cryptarithm-char')?.click();
    element.querySelector<HTMLButtonElement>('.tp-cryptarithm-undo')?.dispatchEvent(new Event('click'));
    element.querySelector<HTMLButtonElement>('.tp-cryptarithm-redo')?.dispatchEvent(new Event('click'));
    const select = element.querySelector<HTMLSelectElement>('.tp-cryptarithm-assist');
    for (const action of ['reset-game', 'show-incorrect', 'clear-incorrect', 'show-letter', 'show-solution', '']) {
      if (select === null) break;
      select.value = action;
      select.dispatchEvent(new Event('change'));
    }
    const undo = element.querySelector<HTMLButtonElement>('.tp-cryptarithm-undo');
    expect(undo?.dispatchEvent(new MouseEvent('mousedown', { cancelable: true }))).toBe(false);
    expect(element.querySelector('.tp-cryptarithm-status')?.textContent).toBeTruthy();
  });

  it.each([
    [{ isSolved: true }, false, 0, 0, 'Solved'],
    [{ isSolved: false, hasDuplicateDigits: true, hasLeadingZero: true, isComplete: true, equationMatches: false }, true, 2, 0, 'duplicate digits'],
    [{ isSolved: false, hasDuplicateDigits: false, hasLeadingZero: false, isComplete: false, equationMatches: false }, false, 0, 1, '1 empty letter'],
  ])('renders constraint status', (validation, showing, incorrect, empty, expected) => {
    document.body.innerHTML = `<tp-cryptarithm equation="UN + UN + NEUF = ONZE" solution="81 + 81 + 1987 = 2149"></tp-cryptarithm>`;
    const element = document.querySelector('tp-cryptarithm') as HTMLElement & { engine: unknown; updateStatus(): void };
    element.engine = {
      getValidation: () => validation, canUndo: () => true, canRedo: () => false,
      countEmptyLetters: () => empty, countIncorrectLetters: () => incorrect,
      isShowingIncorrectAssignments: () => showing,
    };
    element.updateStatus();
    expect(element.querySelector('.tp-cryptarithm-status')?.textContent).toContain(expected);
  });
});
