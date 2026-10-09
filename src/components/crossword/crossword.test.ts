import { afterEach, describe, expect, it } from 'vitest';
import './crossword.js';
import { TpCrossword } from './crossword.js';

afterEach(() => document.body.replaceChildren());

const puzzle = `a. AB\nb. BA\nA. First\nB. Second\n1. Down one\n2. Down two`;

describe('<tp-crossword>', () => {
  it('is registered and reports an empty puzzle', () => {
    const element = document.createElement('tp-crossword');
    document.body.append(element);
    expect(element).toBeInstanceOf(TpCrossword);
    expect(element.textContent).toContain('Empty crossword puzzle');
  });

  it('renders a data-authored silent puzzle', () => {
    const element = document.createElement('tp-crossword');
    element.dataset.crosswordPuzzle = puzzle;
    element.setAttribute('silent', '');
    document.body.append(element);
    expect(element.querySelector('.tp-crossword-grid')).not.toBeNull();
    expect(element.querySelector('select')?.getAttribute('aria-label')).toBe('Assistance actions');
  });

  it('parses solution and clue lists from light DOM', () => {
    document.body.innerHTML = `<tp-crossword><dl>
      <dt>solution</dt><dd><ol><li>AB</li><li>BA</li></ol></dd>
      <dt>across</dt><dd><ol><li>First</li><li>Second</li></ol></dd>
      <dt>down</dt><dd><ol><li>One</li><li>Two</li></ol></dd>
      </dl></tp-crossword>`;
    expect(document.querySelector('tp-crossword .tp-crossword-grid')).not.toBeNull();
  });

  it('accepts horizontal and vertical aliases and ignores empty list entries', () => {
    document.body.innerHTML = `<tp-crossword><dl>
      <dt>solution</dt><dd><ul><span>ignored</span><li>AB</li><li>BA</li><li> </li></ul></dd>
      <dt>horizontal</dt><dd><ul><li>A. First</li><li>B. Second</li></ul></dd>
      <dt>vertical</dt><dd><ul><li>1. One</li><li>2. Two</li></ul></dd>
      </dl></tp-crossword>`;
    expect(document.querySelector('tp-crossword .tp-crossword-grid')).not.toBeNull();
  });

  it('supports legacy silent data and rejects definitions without solutions', () => {
    const legacy = document.createElement('tp-crossword');
    legacy.dataset.crosswordPuzzle = puzzle;
    legacy.dataset.crosswordSilent = 'true';
    document.body.append(legacy);
    expect(legacy.querySelector('.tp-crossword-grid')).not.toBeNull();
    document.body.innerHTML = '<tp-crossword><dl><dt>across</dt><dd><ol><li>A. clue</li></ol></dd></dl></tp-crossword>';
    expect(document.querySelector('.tp-crossword-error')?.textContent).toContain('Empty');
  });

  it('executes focus, history, and every assistance action', async () => {
    const element = document.createElement('tp-crossword');
    element.dataset.crosswordPuzzle = puzzle;
    document.body.append(element);
    const input = element.querySelector<HTMLInputElement>('.tp-crossword-grid input');
    input?.focus();
    await Promise.resolve();
    element.querySelector<HTMLButtonElement>('.tp-crossword-undo')?.dispatchEvent(new Event('click'));
    element.querySelector<HTMLButtonElement>('.tp-crossword-redo')?.dispatchEvent(new Event('click'));
    const select = element.querySelector<HTMLSelectElement>('.tp-crossword-assist');
    for (const action of ['reset-game', 'show-incorrect', 'clear-incorrect', 'show-cell', 'show-word', 'show-solution', '']) {
      if (select === null) break;
      select.value = action;
      select.dispatchEvent(new Event('change'));
    }
    const undo = element.querySelector<HTMLButtonElement>('.tp-crossword-undo');
    expect(undo?.dispatchEvent(new MouseEvent('mousedown', { cancelable: true }))).toBe(false);
    expect(element.querySelector('.tp-crossword-clues')?.textContent).toContain('Across');
  });

  it('handles labelled, unlabelled, multipart, and escaped clues', () => {
    const element = document.createElement('tp-crossword') as HTMLElement & {
      splitClueLabel(clue: string): { label: string; text: string };
      splitClueParts(text: string): string[];
      normalizeClueKey(label: string): string;
      escapeHtml(value: string): string;
      renderClueItems(clues: string[], direction: 'across' | 'down'): string;
    };
    expect(element.splitClueLabel('A. First')).toEqual({ label: 'A.', text: 'First' });
    expect(element.splitClueLabel('No label')).toEqual({ label: '', text: 'No label' });
    expect(element.splitClueParts('')).toEqual(['']);
    expect(element.splitClueParts('First. Second.')).toEqual(['First.', 'Second.']);
    expect(element.normalizeClueKey('a.')).toBe('A');
    expect(element.escapeHtml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;');
    expect(element.renderClueItems(['No label', 'A. <First>'], 'across')).toContain('&lt;First&gt;');
  });

  it.each([
    [true, 0, 'Solved'],
    [false, 1, '1 empty cell'],
    [false, 2, '2 empty cells'],
  ])('renders crossword status', (complete, empty, expected) => {
    const element = document.createElement('tp-crossword');
    element.dataset.crosswordPuzzle = puzzle;
    document.body.append(element);
    const internal = element as HTMLElement & { engine: unknown; updateStatus(): void };
    internal.engine = {
      getValidation: () => ({ isComplete: complete }), canUndo: () => true,
      canRedo: () => false, countEmptyCells: () => empty,
    };
    internal.updateStatus();
    expect(element.querySelector('.tp-crossword-status')?.textContent).toContain(expected);
  });

  it.each([
    ['across', false],
    ['down', true],
  ] as const)('highlights active %s and secondary clues', (primary, silent) => {
    const element = document.createElement('tp-crossword');
    element.dataset.crosswordPuzzle = puzzle;
    document.body.append(element);
    const internal = element as HTMLElement & {
      engine: unknown; updateClueHighlights(): void; updateCurrentClues(): void;
    };
    internal.engine = {
      isSilent: () => silent,
      getActiveClues: () => ({
        primary,
        secondary: primary === 'across' ? 'down' : 'across',
        across: { key: 'A', partIndex: 0 },
        down: { key: '1', partIndex: 4 },
      }),
    };
    internal.updateClueHighlights();
    internal.updateCurrentClues();
    expect(element.querySelector('.tp-crossword-clue-item.active-primary')).not.toBeNull();
    expect(element.querySelector('.tp-crossword-current-clues')?.textContent).toBeTruthy();
  });

  it('clears current clues when no cell is active', () => {
    const element = document.createElement('tp-crossword');
    element.dataset.crosswordPuzzle = puzzle;
    document.body.append(element);
    const internal = element as HTMLElement & {
      engine: unknown; updateClueHighlights(): void; updateCurrentClues(): void;
    };
    internal.engine = { isSilent: () => false, getActiveClues: () => null };
    internal.updateClueHighlights();
    internal.updateCurrentClues();
    expect(element.querySelector('.tp-crossword-current-clues')?.textContent).toBe('');
  });

  it('safely handles missing clue nodes and one-direction active clues', () => {
    const element = document.createElement('tp-crossword');
    element.dataset.crosswordPuzzle = puzzle;
    document.body.append(element);
    const internal = element as HTMLElement & {
      engine: unknown; updateClueHighlights(): void; updateCurrentClues(): void;
      getCurrentClueText(direction: 'across' | 'down', key: string, part: number): string;
      setClueHighlight(item: HTMLElement | null, part: number, name: 'active-primary'): void;
    };
    internal.engine = {
      isSilent: () => false,
      getActiveClues: () => ({
        primary: 'across', secondary: 'down', across: { key: 'A', partIndex: -2 }, down: null,
      }),
    };
    internal.updateClueHighlights();
    internal.updateCurrentClues();
    expect(internal.getCurrentClueText('down', 'missing', 0)).toBe('');
    expect(() => internal.setClueHighlight(null, 0, 'active-primary')).not.toThrow();
  });

  it('handles clue nodes without labels or segmented text', () => {
    const element = document.createElement('tp-crossword');
    element.dataset.crosswordPuzzle = puzzle;
    document.body.append(element);
    const internal = element as HTMLElement & {
      cluesElement: HTMLElement;
      getCurrentClueText(direction: 'across' | 'down', key: string, part: number, silent?: boolean): string;
      setClueHighlight(item: HTMLElement | null, part: number, name: 'active-primary', all?: boolean): void;
    };
    const bare = document.createElement('li');
    bare.className = 'tp-crossword-clue-item';
    bare.dataset.direction = 'across';
    bare.dataset.clueKey = 'X';
    internal.cluesElement.append(bare);
    internal.setClueHighlight(bare, 0, 'active-primary');
    expect(internal.getCurrentClueText('across', 'X', 0)).toBe('');
    expect(internal.getCurrentClueText('across', 'X', 0, true)).toBe('X.');

    bare.innerHTML = '<span class="tp-crossword-clue-text">Whole clue</span>';
    expect(internal.getCurrentClueText('across', 'X', 0, true)).toBe('X. Whole clue');
  });
});
