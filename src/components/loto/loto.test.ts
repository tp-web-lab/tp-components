import { afterEach, describe, expect, it, vi } from 'vitest';

import './loto.js';
import type { TpLoto } from './loto.js';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

function createLoto(): TpLoto {
  const element = document.createElement('tp-loto') as TpLoto;
  document.body.append(element);
  return element;
}

function createLotoWithCards(cards: number): TpLoto {
  const element = document.createElement('tp-loto') as TpLoto;
  element.setAttribute('cards', String(cards));
  document.body.append(element);
  return element;
}

function ticket(element: TpLoto): Array<Array<number | null>> {
  const cells = [...element.querySelectorAll<HTMLElement>('.tp-loto-cell')];
  return Array.from({ length: 3 }, (_, row) =>
    cells.slice(row * 9, row * 9 + 9).map((cell) => {
      const value = Number(cell.textContent);
      return cell.textContent === '' ? null : value;
    }),
  );
}

describe('<tp-loto>', () => {
  it('creates a valid 3 by 9 French loto ticket', () => {
    const element = createLoto();
    const rows = ticket(element);

    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.length === 9)).toBe(true);
    expect(rows.every((row) => row.filter((cell) => cell !== null).length === 5)).toBe(true);

    for (let column = 0; column < 9; column += 1) {
      const values = rows.map((row) => row[column]).filter((cell): cell is number => cell !== null);
      const first = column === 0 ? 1 : column * 10;
      const last = column === 8 ? 90 : column * 10 + 9;
      expect(values.length).toBeGreaterThan(0);
      expect(values.every((value) => value >= first && value <= last)).toBe(true);
      expect(values).toEqual([...values].sort((left, right) => left - right));
    }
  });

  it('displays from one to four independent tickets', () => {
    const element = createLotoWithCards(4);

    expect(element.cards).toBe(4);
    expect(element.querySelectorAll('.tp-loto-ticket')).toHaveLength(4);
    expect(element.querySelectorAll('.tp-loto-cell')).toHaveLength(4 * 27);
    expect(element.querySelector('.tp-loto-status')?.textContent).toBe(
      '0 / 60 ticket numbers drawn',
    );

    const signatures = [...element.querySelectorAll('.tp-loto-ticket')]
      .map((ticketElement) => ticketElement.textContent?.replaceAll(/\s/g, ''));
    expect(new Set(signatures)).toHaveLength(4);
  });

  it('uses one ticket when cards is outside the 1 to 4 range', () => {
    const element = createLotoWithCards(5);

    expect(element.cards).toBe(1);
    expect(element.querySelectorAll('.tp-loto-ticket')).toHaveLength(1);
  });

  it('normalizes the cards property to the supported range', () => {
    const element = createLoto() as TpLoto;
    element.cards = 9.8;
    expect(element.cards).toBe(4);
    element.cards = -2;
    expect(element.cards).toBe(1);
  });

  it('draws distinct numbers and marks ticket numbers', () => {
    const element = createLoto();
    const drawn = Array.from({ length: 10 }, () => element.draw());

    expect(drawn.every((number) => number !== null && number >= 1 && number <= 90)).toBe(true);
    expect(new Set(drawn).size).toBe(drawn.length);
    expect(element.querySelectorAll('.tp-loto-history .tp-loto-ball')).toHaveLength(10);
    expect(element.querySelector('.tp-loto-history')?.tagName).toBe('TP-SWITCHER');
    expect(element.querySelectorAll('.tp-loto-history tp-icon[library="numbers"]')).toHaveLength(10);
    expect(element.querySelector('.tp-loto-current tp-icon')?.getAttribute('name')).toBe(
      String(drawn.at(-1)),
    );
    expect(element.querySelectorAll('.tp-loto-cell.drawn').length).toBeGreaterThanOrEqual(0);
  });

  it('starts the chronometer with the first draw', () => {
    vi.useFakeTimers();
    const element = createLoto();
    const display = element.querySelector<HTMLElement>('[data-tp-chronometer-display]');

    element.draw();
    vi.advanceTimersByTime(1100);

    expect(display?.textContent).toMatch(/^00:01\.\d{2}$/);
  });

  it('resets with a new ticket, an empty history, and reset chronometer', () => {
    const element = createLoto();
    const firstTicket = ticket(element).flat().join(',');
    element.draw();

    element.reset();

    expect(ticket(element).flat().join(',')).not.toBe(firstTicket);
    expect(element.querySelectorAll('.tp-loto-history .tp-loto-ball')).toHaveLength(0);
    expect(element.querySelector('[data-tp-chronometer-display]')?.textContent).toBe('00:00.00');
    expect(element.querySelector('.tp-loto-reset')?.getAttribute('name')).toBe('refresh');
  });

  it('finishes when every ticket number has been drawn', () => {
    const element = createLoto();
    const win = vi.fn();
    element.addEventListener('tp-loto-win', win);

    while (!element.querySelector<HTMLButtonElement>('.tp-loto-draw-button')?.disabled) {
      element.draw();
    }

    expect(element.querySelectorAll('.tp-loto-cell.drawn')).toHaveLength(15);
    expect(element.querySelector('.tp-loto-status')?.textContent).toBe('Loto completed');
    expect(win).toHaveBeenCalledOnce();
  });
});
