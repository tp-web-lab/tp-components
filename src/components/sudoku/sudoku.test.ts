import { afterEach, describe, expect, it } from 'vitest';
import './sudoku.js';
import { TpSudoku } from './sudoku.js';

afterEach(() => document.body.replaceChildren());

const puzzle = [
  '123456789', '456789123', '789123456', '214365897', '365897214',
  '897214365', '531642978', '642978531', '978531642',
].join('\n');

describe('<tp-sudoku>', () => {
  it('is registered and reports an empty puzzle', () => {
    const element = document.createElement('tp-sudoku');
    document.body.append(element);
    expect(element).toBeInstanceOf(TpSudoku);
    expect(element.textContent).toContain('Empty sudoku puzzle');
  });

  it('renders an attribute-authored grid and its controls', () => {
    const element = document.createElement('tp-sudoku');
    element.setAttribute('puzzle', puzzle);
    document.body.append(element);
    expect(element.querySelector('.tp-sudoku-grid')).not.toBeNull();
    expect(element.querySelector('.tp-sudoku-mode')?.textContent).toBe('Game');
    expect(element.querySelector('select')?.getAttribute('aria-label')).toBe('Assistance actions');
  });

  it('accepts list-authored rows', () => {
    const rows = puzzle.split('\n').map((row) => `<li>${row}</li>`).join('');
    document.body.innerHTML = `<tp-sudoku><ol>${rows}</ol></tp-sudoku>`;
    expect(document.querySelector('tp-sudoku .tp-sudoku-grid')).not.toBeNull();
  });

  it('supports the legacy data attribute and rejects empty list rows', () => {
    const legacy = document.createElement('tp-sudoku');
    legacy.dataset.sudokuPuzzle = puzzle;
    document.body.append(legacy);
    expect(legacy.querySelector('.tp-sudoku-grid')).not.toBeNull();
    document.body.innerHTML = '<tp-sudoku><ul><span>ignored</span><li> </li></ul></tp-sudoku>';
    expect(document.querySelector('.tp-sudoku-error')?.textContent).toContain('Empty');
  });

  it('renders invalid puzzle errors', () => {
    document.body.innerHTML = '<tp-sudoku puzzle="invalid"></tp-sudoku>';
    expect(document.querySelector('.tp-sudoku-error')?.textContent).toContain('Error');
  });

  it('executes mode, focus, history, and every assistance action', () => {
    const element = document.createElement('tp-sudoku');
    element.setAttribute('puzzle', puzzle);
    document.body.append(element);
    element.querySelector<HTMLButtonElement>('.tp-sudoku-mode')?.click();
    element.querySelector<HTMLInputElement>('.tp-sudoku-grid input')?.focus();
    element.querySelector<HTMLButtonElement>('.tp-sudoku-undo')?.dispatchEvent(new Event('click'));
    element.querySelector<HTMLButtonElement>('.tp-sudoku-redo')?.dispatchEvent(new Event('click'));
    const select = element.querySelector<HTMLSelectElement>('.tp-sudoku-assist');
    for (const action of ['show-cell', 'show-incorrect', 'clear-incorrect', 'reset-game', 'show-solution', '']) {
      if (select === null) break;
      select.value = action;
      select.dispatchEvent(new Event('change'));
    }
    const mode = element.querySelector<HTMLButtonElement>('.tp-sudoku-mode');
    expect(mode?.dispatchEvent(new MouseEvent('mousedown', { cancelable: true }))).toBe(false);
    expect(mode?.getAttribute('aria-label')).toContain('entry mode');
  });

  it.each([
    [true, 'game', false, 0, 0, 'Solved'],
    [false, 'note', true, 2, 0, '2 incorrect boxes shown'],
    [false, 'note', true, 1, 0, '1 incorrect box shown'],
    [false, 'game', false, 0, 1, '1 empty cell'],
  ])('renders every status state', (complete, mode, showing, incorrect, empty, expected) => {
    const element = document.createElement('tp-sudoku');
    element.setAttribute('puzzle', puzzle);
    document.body.append(element);
    const internal = element as HTMLElement & { engine: unknown; updateStatus(): void };
    internal.engine = {
      getValidation: () => ({ isComplete: complete }), getEntryMode: () => mode,
      canUndo: () => true, canRedo: () => false, countIncorrectCells: () => incorrect,
      countEmptyCells: () => empty, isShowingIncorrectCells: () => showing,
    };
    internal.updateStatus();
    expect(element.querySelector('.tp-sudoku-status')?.textContent).toContain(expected);
  });
});
