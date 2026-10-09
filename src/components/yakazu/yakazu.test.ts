import { afterEach, describe, expect, it } from 'vitest';
import './yakazu.js';
import { TpYakazu } from './yakazu.js';

afterEach(() => document.body.replaceChildren());

const rows = ['25431#9#4!', '1#1524673', '#13!2#12#2', '2#563274!1', '12674385!#', '34!21!5#1!2#', '#1#412563', '2!31#2!#312', '1#21#2431'];

describe('<tp-yakazu>', () => {
  it('is registered and reports an empty puzzle', () => {
    const element = document.createElement('tp-yakazu');
    document.body.append(element);
    expect(element).toBeInstanceOf(TpYakazu);
    expect(element.textContent).toContain('Empty yakazu puzzle');
  });

  it('renders a data-authored grid with labelled controls', () => {
    const element = document.createElement('tp-yakazu');
    element.dataset.yakazuPuzzle = rows.join('\n');
    document.body.append(element);
    expect(element.querySelector('.tp-yakazu-grid')).not.toBeNull();
    expect(element.querySelector('select')?.getAttribute('aria-label')).toBe('Assistance actions');
  });

  it('accepts list-authored rows', () => {
    document.body.innerHTML = `<tp-yakazu><ol>${rows.map((row) => `<li>${row}</li>`).join('')}</ol></tp-yakazu>`;
    expect(document.querySelector('tp-yakazu .tp-yakazu-grid')).not.toBeNull();
  });

  it('rejects empty list rows and invalid puzzle data', () => {
    document.body.innerHTML = '<tp-yakazu><ul><span>ignored</span><li> </li></ul></tp-yakazu>';
    expect(document.querySelector('.tp-yakazu-error')?.textContent).toContain('Empty');
    document.body.innerHTML = '<tp-yakazu data-yakazu-puzzle="invalid"></tp-yakazu>';
    expect(document.querySelector('.tp-yakazu-error')?.textContent).toContain('Error');
  });

  it('executes mode, focus, history, and every assistance action', () => {
    const element = document.createElement('tp-yakazu');
    element.dataset.yakazuPuzzle = rows.join('\n');
    document.body.append(element);
    element.querySelector<HTMLButtonElement>('.tp-yakazu-mode')?.click();
    element.querySelector<HTMLInputElement>('.tp-yakazu-grid input')?.focus();
    element.querySelector<HTMLButtonElement>('.tp-yakazu-undo')?.dispatchEvent(new Event('click'));
    element.querySelector<HTMLButtonElement>('.tp-yakazu-redo')?.dispatchEvent(new Event('click'));
    const select = element.querySelector<HTMLSelectElement>('.tp-yakazu-assist');
    for (const action of ['show-cell', 'show-incorrect', 'clear-incorrect', 'reset-game', 'show-solution', '']) {
      if (select === null) break;
      select.value = action;
      select.dispatchEvent(new Event('change'));
    }
    const mode = element.querySelector<HTMLButtonElement>('.tp-yakazu-mode');
    expect(mode?.dispatchEvent(new MouseEvent('mousedown', { cancelable: true }))).toBe(false);
    expect(mode?.getAttribute('aria-label')).toContain('entry mode');
  });

  it.each([
    [true, 'game', false, 0, 0, 'Solved'],
    [false, 'note', true, 1, 0, '1 incorrect box shown'],
    [false, 'note', true, 2, 0, '2 incorrect boxes shown'],
    [false, 'game', false, 0, 2, '2 empty cells'],
  ])('renders every status state', (complete, mode, showing, incorrect, empty, expected) => {
    const element = document.createElement('tp-yakazu');
    element.dataset.yakazuPuzzle = rows.join('\n');
    document.body.append(element);
    const internal = element as HTMLElement & { engine: unknown; updateStatus(): void };
    internal.engine = {
      getValidation: () => ({ isComplete: complete }), getEntryMode: () => mode,
      canUndo: () => true, canRedo: () => false, countIncorrectCells: () => incorrect,
      countEmptyCells: () => empty, isShowingIncorrectCells: () => showing,
    };
    internal.updateStatus();
    expect(element.querySelector('.tp-yakazu-status')?.textContent).toContain(expected);
  });
});
