import { afterEach, describe, expect, it, vi } from 'vitest';

import './solitaire.js';

afterEach(() => {
  vi.restoreAllMocks();
});

function createSolitaire(size: 32 | 52 = 52): HTMLElement {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  const element = document.createElement('tp-solitaire');
  element.setAttribute('deck-size', String(size));
  document.body.append(element);
  return element;
}

type Card = {
  id: string;
  suit: 'c' | 'd' | 'h' | 's';
  rank: string;
  value: number;
  color: 'red' | 'black';
  faceUp: boolean;
};

type TestSolitaire = HTMLElement & {
  deckSize: 32 | 52;
  back: 'blue' | 'red';
  stock: Card[];
  waste: Card[];
  tableau: Card[][];
  foundations: Card[][];
  selection: { source: 'waste' | 'tableau' | 'foundation'; pile: number; index: number } | null;
  renderBoard(): void;
  draw(): void;
  moveSelectionToFoundation(pile: number): boolean;
  moveSelectionToTableau(pile: number): boolean;
  autoMoveToFoundation(element: HTMLElement): void;
  handleCardClick(element: HTMLElement): void;
  handleDrop(detail: { source: HTMLElement; target: HTMLElement | null }): void;
  afterMove(): void;
  canPlaceOnTableau(card: Card, target?: Card): boolean;
  sourcePile(source: 'waste' | 'tableau' | 'foundation', pile: number): Card[];
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
};

describe('<tp-solitaire>', () => {
  it.each([32, 52] as const)('creates a complete %i-card game', (size) => {
    const element = createSolitaire(size);
    const tableauCards = element.querySelectorAll('.tp-solitaire-tableau .tp-solitaire-card');
    const stockCards = Number(element.querySelector('.tp-solitaire-status')?.textContent?.match(/\/ (\d+)/)?.[1]);

    expect(tableauCards).toHaveLength(28);
    expect(stockCards).toBe(size);
    expect(element.querySelectorAll('.tp-solitaire-foundation')).toHaveLength(4);
    expect(element.querySelector('.tp-solitaire-reset')?.getAttribute('name')).toBe('refresh');
    expect(element.querySelector('.tp-solitaire-chronometer')).not.toBeNull();
  });

  it('draws from the stock and starts the chronometer', () => {
    vi.useFakeTimers();
    const element = createSolitaire();
    const display = element.querySelector<HTMLElement>('[data-tp-chronometer-display]');
    element.querySelector<HTMLElement>('.tp-solitaire-stock')?.click();
    vi.advanceTimersByTime(1100);

    expect(element.querySelectorAll('.tp-solitaire-waste .tp-solitaire-card')).toHaveLength(1);
    expect(display?.textContent).toMatch(/^00:01\.\d{2}$/);
    vi.useRealTimers();
  });

  it('resets with the selected red back', () => {
    const element = createSolitaire(32);
    element.setAttribute('back', 'red');
    element.querySelector<HTMLElement>('.tp-solitaire-stock')?.click();
    element.querySelector<HTMLElement>('.tp-solitaire-reset')?.click();

    expect(element.querySelector<HTMLImageElement>('.tp-solitaire-stock img')?.src).toContain(
      'back-red.svg',
    );
    expect(element.querySelector('.tp-solitaire-status')?.textContent).toContain('/ 32');
  });

  it('replaces the empty foundation slot with its first card', () => {
    const element = createSolitaire() as HTMLElement & {
      foundations: Array<Array<{
        id: string;
        suit: 'c' | 'd' | 'h' | 's';
        rank: string;
        value: number;
        color: 'red' | 'black';
        faceUp: boolean;
      }>>;
      renderBoard: () => void;
    };
    element.foundations[0] = [{
      id: 'ca',
      suit: 'c',
      rank: 'a',
      value: 0,
      color: 'black',
      faceUp: true,
    }];

    element.renderBoard();

    const foundation = element.querySelector('.tp-solitaire-foundation');
    expect(foundation?.children).toHaveLength(1);
    expect(foundation?.querySelectorAll('.tp-solitaire-card')).toHaveLength(1);
    expect(foundation?.querySelector('.tp-solitaire-empty-symbol')).toBeNull();
  });

  it('moves a card to a tableau pile with tp-dragdrop', () => {
    const element = createSolitaire() as HTMLElement & {
      tableau: Array<Array<{
        id: string;
        suit: 'c' | 'd' | 'h' | 's';
        rank: string;
        value: number;
        color: 'red' | 'black';
        faceUp: boolean;
      }>>;
      renderBoard: () => void;
    };
    element.tableau = [
      [{ id: 'c8', suit: 'c', rank: '8', value: 7, color: 'black', faceUp: true }],
      [{ id: 'h9', suit: 'h', rank: '9', value: 8, color: 'red', faceUp: true }],
      [], [], [], [], [],
    ];
    element.renderBoard();
    const source = element.querySelector<HTMLElement>('[data-tableau="0"] .tp-solitaire-card');
    const target = element.querySelector<HTMLElement>('[data-tableau="1"]');

    element.querySelector('tp-dragdrop')?.dispatchEvent(new CustomEvent('tp-dragdrop-drop', {
      detail: { source, target, position: 'inside' },
    }));

    expect(element.querySelectorAll('[data-tableau="0"] .tp-solitaire-card')).toHaveLength(0);
    expect(element.querySelectorAll('[data-tableau="1"] .tp-solitaire-card')).toHaveLength(2);
  });

  it('reflects deck and back properties and rerenders after attribute changes', () => {
    const element = createSolitaire() as TestSolitaire;
    element.deckSize = 32;
    element.back = 'red';
    expect(element.deckSize).toBe(32);
    expect(element.back).toBe('red');
    expect(element.querySelector('.tp-solitaire-status')?.textContent).toContain('/ 32');
    expect(element.querySelector<HTMLImageElement>('.tp-solitaire-stock img')?.src).toContain('back-red.svg');
  });

  it('recycles the waste into the stock', () => {
    const element = createSolitaire() as TestSolitaire;
    element.stock = [];
    element.waste = [{ id: 'ca', suit: 'c', rank: 'a', value: 0, color: 'black', faceUp: true }];
    element.draw();
    expect(element.waste).toHaveLength(0);
    expect(element.stock[0]?.faceUp).toBe(false);
  });

  it('moves an ace to its foundation and reveals a covered tableau card', () => {
    const element = createSolitaire() as TestSolitaire;
    element.tableau = [[
      { id: 'c2', suit: 'c', rank: '2', value: 1, color: 'black', faceUp: false },
      { id: 'ca', suit: 'c', rank: 'a', value: 0, color: 'black', faceUp: true },
    ], [], [], [], [], [], []];
    element.foundations = [[], [], [], []];
    element.selection = { source: 'tableau', pile: 0, index: 1 };
    expect(element.moveSelectionToFoundation(0)).toBe(true);
    expect(element.foundations[0]).toHaveLength(1);
    expect(element.tableau[0]?.[0]?.faceUp).toBe(true);
  });

  it('rejects invalid moves and accepts a king on an empty tableau', () => {
    const element = createSolitaire() as TestSolitaire;
    expect(element.moveSelectionToTableau(0)).toBe(false);
    element.waste = [{ id: 'hk', suit: 'h', rank: 'k', value: 12, color: 'red', faceUp: true }];
    element.tableau = [[], [], [], [], [], [], []];
    element.selection = { source: 'waste', pile: 0, index: 0 };
    expect(element.moveSelectionToTableau(0)).toBe(true);
    element.selection = { source: 'tableau', pile: 0, index: 0 };
    expect(element.moveSelectionToTableau(0)).toBe(false);
  });

  it('automatically moves a top ace but ignores a face-down card', () => {
    const element = createSolitaire() as TestSolitaire;
    element.waste = [{ id: 'ca', suit: 'c', rank: 'a', value: 0, color: 'black', faceUp: true }];
    element.foundations = [[], [], [], []];
    element.renderBoard();
    const ace = element.querySelector<HTMLElement>('[data-source="waste"]');
    if (ace) element.autoMoveToFoundation(ace);
    expect(element.foundations[0]).toHaveLength(1);

    element.tableau = [[{ id: 'd2', suit: 'd', rank: '2', value: 1, color: 'red', faceUp: false }]];
    element.renderBoard();
    const hidden = element.querySelector<HTMLElement>('[data-source="tableau"]');
    if (hidden) element.autoMoveToFoundation(hidden);
    expect(element.foundations[1]).toHaveLength(0);
  });

  it('flips the last covered tableau card and selects face-up cards', () => {
    const element = createSolitaire() as TestSolitaire;
    element.tableau = [[{ id: 'c2', suit: 'c', rank: '2', value: 1, color: 'black', faceUp: false }], [], [], [], [], [], []];
    element.renderBoard();
    const hidden = element.querySelector<HTMLElement>('[data-source="tableau"]');
    if (hidden) element.handleCardClick(hidden);
    expect(element.tableau[0]?.[0]?.faceUp).toBe(true);
    const shown = element.querySelector<HTMLElement>('[data-source="tableau"]');
    if (shown) element.handleCardClick(shown);
    expect(element.querySelector('.tp-solitaire-card.selected')).not.toBeNull();
  });

  it('rejects invalid foundation and drop targets without losing cards', () => {
    const element = createSolitaire() as TestSolitaire;
    element.waste = [{ id: 'c2', suit: 'c', rank: '2', value: 1, color: 'black', faceUp: true }];
    element.selection = { source: 'waste', pile: 0, index: 0 };
    expect(element.moveSelectionToFoundation(0)).toBe(false);
    expect(element.moveSelectionToFoundation(3)).toBe(false);
    const source = document.createElement('div');
    const target = document.createElement('div');
    expect(() => element.handleDrop({ source, target })).not.toThrow();
    source.className = 'tp-solitaire-card';
    source.dataset.source = 'waste';
    source.dataset.pile = '0';
    source.dataset.index = '0';
    expect(() => element.handleDrop({ source, target })).not.toThrow();
  });

  it('announces completion when every foundation is full', () => {
    const element = createSolitaire(32) as TestSolitaire;
    const cards = Array.from({ length: 8 }, (_, value): Card => ({
      id: `c${value}`, suit: 'c', rank: String(value), value, color: 'black', faceUp: true,
    }));
    element.foundations = [cards, [...cards], [...cards], [...cards]];
    const win = vi.fn();
    element.addEventListener('tp-solitaire-win', win);
    element.afterMove();
    expect(element.querySelector('.tp-solitaire-status')?.textContent).toBe('Solitaire completed');
    expect(win).toHaveBeenCalledOnce();
  });

  it('covers tableau placement and every source pile', () => {
    const element = createSolitaire(32) as TestSolitaire;
    const king: Card = { id: 'hk', suit: 'h', rank: 'k', value: 7, color: 'red', faceUp: true };
    const queen: Card = { id: 'cq', suit: 'c', rank: 'q', value: 6, color: 'black', faceUp: true };
    expect(element.canPlaceOnTableau(king)).toBe(true);
    expect(element.canPlaceOnTableau(queen)).toBe(false);
    expect(element.canPlaceOnTableau(queen, king)).toBe(true);
    expect(element.canPlaceOnTableau({ ...queen, color: 'red' }, king)).toBe(false);
    expect(element.sourcePile('waste', 0)).toBe(element.waste);
    expect(element.sourcePile('foundation', 99)).toEqual([]);
    expect(element.sourcePile('tableau', 99)).toEqual([]);
  });

  it('rejects a non-top foundation selection and missing target piles', () => {
    const element = createSolitaire() as TestSolitaire;
    element.waste = [
      { id: 'ca', suit: 'c', rank: 'a', value: 0, color: 'black', faceUp: true },
      { id: 'c2', suit: 'c', rank: '2', value: 1, color: 'black', faceUp: true },
    ];
    element.selection = { source: 'waste', pile: 0, index: 0 };
    expect(element.moveSelectionToFoundation(0)).toBe(false);
    element.selection = { source: 'waste', pile: 0, index: 1 };
    expect(element.moveSelectionToTableau(99)).toBe(false);
  });

  it('ignores unchanged attributes, null drops, and face-down drop sources', () => {
    const element = createSolitaire() as TestSolitaire;
    element.attributeChangedCallback('back', 'blue', 'blue');
    const source = element.querySelector<HTMLElement>('.tp-solitaire-card.face-down');
    if (source) {
      element.handleDrop({ source, target: null });
      const target = element.querySelector<HTMLElement>('.tp-solitaire-foundation');
      if (target) element.handleDrop({ source, target });
    }
    expect(element.querySelectorAll('.tp-solitaire-card')).toHaveLength(28);
  });

  it('exercises empty-pile and foundation click targets', () => {
    const element = createSolitaire() as TestSolitaire;
    element.tableau = [[], [], [], [], [], [], []];
    element.renderBoard();
    element.querySelector<HTMLElement>('.tp-solitaire-empty-tableau')?.click();
    element.querySelector<HTMLElement>('.tp-solitaire-foundation')?.click();
    expect(element.querySelectorAll('.tp-solitaire-empty-tableau')).toHaveLength(7);
  });
});
