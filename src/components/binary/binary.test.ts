import { afterEach, describe, expect, it } from 'vitest';
import './binary.js';
import { TpBinary } from './binary.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-binary>', () => {
  it('is registered and reports an empty puzzle', () => {
    const element = document.createElement('tp-binary');
    document.body.append(element);
    element.querySelector<HTMLElement>('.tp-binary-grid button, .tp-binary-grid input')?.click();
    expect(element).toBeInstanceOf(TpBinary);
    expect(element.textContent).toContain('Empty binary puzzle');
  });

  it('renders a puzzle supplied as an attribute with labelled controls', () => {
    const element = document.createElement('tp-binary');
    element.setAttribute('puzzle', '0!1!\n1!0!');
    document.body.append(element);
    expect(element.querySelector('.tp-binary-grid')).not.toBeNull();
    expect(element.querySelector('select')?.getAttribute('aria-label')).toBe('Assistance actions');
    expect(element.querySelector('.tp-binary-undo')).toBeInstanceOf(HTMLButtonElement);
  });

  it('accepts list-authored puzzle rows', () => {
    document.body.innerHTML = '<tp-binary><ol><li>0!1!</li><li>1!0!</li></ol></tp-binary>';
    expect(document.querySelector('tp-binary .tp-binary-grid')).not.toBeNull();
  });

  it('supports the legacy data attribute and ignores empty non-row list children', () => {
    const legacy = document.createElement('tp-binary');
    legacy.dataset.binaryPuzzle = '0!1!\n1!0!';
    document.body.append(legacy);
    expect(legacy.querySelector('.tp-binary-grid')).not.toBeNull();

    document.body.innerHTML = '<tp-binary><ol><span>ignored</span><li> </li></ol></tp-binary>';
    expect(document.querySelector('.tp-binary-error')?.textContent).toContain('Empty');
  });

  it('renders engine initialization errors', () => {
    document.body.innerHTML = '<tp-binary puzzle="not-a-grid"></tp-binary>';
    expect(document.querySelector('.tp-binary-error')?.textContent).toContain('Error');
  });

  it('executes history and every assistance action', () => {
    const element = document.createElement('tp-binary');
    element.setAttribute('puzzle', '01\n10');
    document.body.append(element);
    element.querySelector<HTMLButtonElement>('.tp-binary-undo')?.dispatchEvent(new Event('click'));
    element.querySelector<HTMLButtonElement>('.tp-binary-redo')?.dispatchEvent(new Event('click'));
    const select = element.querySelector<HTMLSelectElement>('.tp-binary-assist');
    for (const action of ['show-cell', 'show-incorrect', 'clear-incorrect', 'reset-game', 'show-solution', '']) {
      if (select === null) break;
      select.value = action;
      select.dispatchEvent(new Event('change'));
      expect(select.value).toBe('');
    }
    const undo = element.querySelector<HTMLButtonElement>('.tp-binary-undo');
    expect(undo?.dispatchEvent(new MouseEvent('mousedown', { cancelable: true }))).toBe(false);
    expect(element.querySelector('.tp-binary-status')?.textContent).toBeTruthy();
  });

  it.each([
    [true, false, 0, 0, 'Solved'],
    [false, true, 1, 2, '1 incorrect box shown'],
    [false, true, 2, 1, '2 incorrect boxes shown'],
    [false, false, 0, 1, '1 empty cell'],
  ])('renders every status state', (complete, showing, incorrect, empty, expected) => {
    const element = document.createElement('tp-binary');
    element.setAttribute('puzzle', '01\n10');
    document.body.append(element);
    const internal = element as HTMLElement & { engine: unknown; updateStatus(): void };
    internal.engine = {
      getValidation: () => ({ isComplete: complete }), canUndo: () => true, canRedo: () => false,
      countIncorrectCells: () => incorrect, countEmptyCells: () => empty,
      isShowingIncorrectCells: () => showing,
    };
    internal.updateStatus();
    expect(element.querySelector('.tp-binary-status')?.textContent).toContain(expected);
  });
});
