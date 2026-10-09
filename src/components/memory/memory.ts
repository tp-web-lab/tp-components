/**
 * @module components/memory
 * @summary Memory matching game generated from a list.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-chronometer
 * @summary Chronometer component with play, pause and stop controls.
 */
/**
 * @tp-dependency tp-flip-card
 * @summary Two-sided card component.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
// tp-docgen:dependencies:end

import style from './memory.css?inline';
import '../chronometer/chronometer.js';
import '../flip-card/flip-card.js';
import '../switcher/switcher.js';
import { TpBase } from '../base/base.js';
import type { TpChronometer } from '../chronometer/chronometer.js';
import type { TpFlipCard } from '../flip-card/flip-card.js';

const BLUE_BACK_URL = new URL('../card/cards/backs/back-blue.svg', import.meta.url).href;
const RED_BACK_URL = new URL('../card/cards/backs/back-red.svg', import.meta.url).href;

/**
 * Creates a memory game by duplicating every item of an ordered or unordered list.
 *
 * @summary Creates a memory matching game.
 * @tagname tp-memory
 * @attr {string} back = "" - Card-back URL, or blue/red for an OpenDecks back.
 * @attr {number} mismatch-delay = 1000 - Delay before unmatched cards turn back, in milliseconds.
 * @event tp-memory-match Emitted when a pair is matched.
 * @event tp-memory-complete Emitted when every pair is matched.
 * @event tp-memory-reset Emitted after the game is reset.
 * @cssprop --tp-memory-card-max-width Maximum width of image and SVG cards.
 * @cssprop --tp-memory-gap Gap between cards.
 * @example
 * <tp-memory></tp-memory>
 */
export class TpMemory extends TpBase {
  private static readonly styleId = 'tp-memory-styles';
  private selectedCards: TpFlipCard[] = [];
  private matchedPairs = 0;
  private pairCount = 0;
  private busy = false;
  private mismatchTimeout: number | null = null;
  private chronometer: TpChronometer | null = null;
  private chronometerStarted = false;

  public get back(): string {
    const value = this.getAttribute('back');
    if (value === null || value === 'blue') return BLUE_BACK_URL;
    if (value === 'red') return RED_BACK_URL;
    return value;
  }

  public set back(value: string) {
    if (value === '') this.removeAttribute('back');
    else this.setAttribute('back', value);
  }

  public get mismatchDelay(): number {
    const value = Number(this.getAttribute('mismatch-delay') ?? '1000');
    return Number.isFinite(value) && value >= 0 ? value : 1000;
  }

  public set mismatchDelay(value: number) {
    this.setAttribute('mismatch-delay', String(Math.max(0, value)));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpMemory.styleId, style);
    this.classList.add('tp-memory');
    if (this.dataset.tpMemoryRendered !== 'true') this.renderFromList();
  }

  public disconnectedCallback(): void {
    if (this.mismatchTimeout !== null) window.clearTimeout(this.mismatchTimeout);
  }

  /** Resets the timer, hides and reshuffles every card. */
  public reset(): void {
    if (this.mismatchTimeout !== null) {
      window.clearTimeout(this.mismatchTimeout);
      this.mismatchTimeout = null;
    }
    this.busy = false;
    this.selectedCards = [];
    this.matchedPairs = 0;
    this.chronometerStarted = false;
    this.chronometer?.stop();

    const board = this.querySelector('.tp-memory-board');
    const cards = Array.from(this.querySelectorAll<TpFlipCard>('tp-flip-card'));
    for (const card of cards) {
      card.flipped = false;
      card.disabled = false;
      delete card.dataset.matched;
    }
    this.shuffle(cards);
    board?.append(...cards);
    this.dispatchEvent(new CustomEvent('tp-memory-reset', { bubbles: true }));
  }

  private renderFromList(): void {
    const list = Array.from(this.children).find(
      (child): child is HTMLOListElement | HTMLUListElement =>
        child.tagName === 'OL' || child.tagName === 'UL',
    );
    if (!list) {
      this.renderError('tp-memory requires an ol or ul list');
      return;
    }

    const items = Array.from(list.children).filter(
      (child): child is HTMLLIElement => child.tagName === 'LI',
    );
    if (items.length === 0) {
      this.renderError('tp-memory requires at least one list item');
      return;
    }

    this.pairCount = items.length;
    const cards = items.flatMap((item, pairIndex) => [
      this.createCard(item, pairIndex),
      this.createCard(item, pairIndex),
    ]);
    this.shuffle(cards);

    const switcher = document.createElement('tp-switcher');
    switcher.className = 'tp-memory-board';
    switcher.setAttribute('gap', 'var(--tp-memory-gap, 0.75rem)');
    switcher.append(...cards);
    const chronometer = document.createElement('tp-chronometer');
    chronometer.className = 'tp-memory-chronometer';
    this.chronometer = chronometer;
    const resetButton = document.createElement('tp-icon-button');
    resetButton.className = 'tp-memory-reset';
    resetButton.setAttribute('name', 'refresh');
    resetButton.setAttribute('label', 'Reset memory');
    resetButton.addEventListener('click', () => this.reset());
    const controls = document.createElement('div');
    controls.className = 'tp-memory-controls';
    controls.append(resetButton, chronometer);
    const title = document.createElement('div');
    title.className = 'tp-memory-title';
    title.textContent = 'Memory';
    const header = document.createElement('div');
    header.className = 'tp-memory-header';
    header.append(title, controls);
    this.replaceChildren(header, switcher);
    this.dataset.tpMemoryRendered = 'true';
  }

  private createCard(item: HTMLLIElement, pairIndex: number): TpFlipCard {
    const card = document.createElement('tp-flip-card') as TpFlipCard;
    card.className = 'tp-memory-card';
    card.dataset.pair = String(pairIndex);
    card.setAttribute('fit-content', '');
    card.setAttribute('button-position', 'none');
    const list = document.createElement('dl');
    const rectoTerm = document.createElement('dt');
    rectoTerm.textContent = 'recto';
    const recto = document.createElement('dd');
    const back = document.createElement('img');
    back.src = this.back;
    back.alt = '';
    back.className = 'tp-memory-card-back';
    recto.append(back);
    const versoTerm = document.createElement('dt');
    versoTerm.textContent = 'verso';
    const verso = document.createElement('dd');
    verso.append(...Array.from(item.childNodes, (node) => node.cloneNode(true)));
    list.append(rectoTerm, recto, versoTerm, verso);
    card.append(list);
    card.addEventListener('tp-flip-card-change', () => this.handleCardChange(card));
    return card;
  }

  private handleCardChange(card: TpFlipCard): void {
    if (this.busy) {
      card.flipped = false;
      return;
    }
    if (!card.flipped) {
      this.selectedCards = this.selectedCards.filter((selected) => selected !== card);
      return;
    }
    if (!this.chronometerStarted) {
      this.chronometer?.play();
      this.chronometerStarted = true;
    }
    this.selectedCards.push(card);
    if (this.selectedCards.length < 2) {
      card.disabled = true;
      return;
    }

    const [first, second] = this.selectedCards;
    this.selectedCards = [];
    if (!first || !second) return;

    if (first.dataset.pair === second.dataset.pair) {
      first.disabled = true;
      second.disabled = true;
      first.dataset.matched = 'true';
      second.dataset.matched = 'true';
      this.matchedPairs += 1;
      this.dispatchEvent(new CustomEvent('tp-memory-match', {
        bubbles: true,
        detail: { pair: Number(first.dataset.pair) },
      }));
      if (this.matchedPairs === this.pairCount) {
        this.chronometer?.pause();
        this.dispatchEvent(new CustomEvent('tp-memory-complete', { bubbles: true }));
      }
      return;
    }

    this.busy = true;
    this.setUnmatchedCardsDisabled(true);
    this.mismatchTimeout = window.setTimeout(() => {
      first.flipped = false;
      second.flipped = false;
      this.busy = false;
      this.mismatchTimeout = null;
      this.setUnmatchedCardsDisabled(false);
    }, this.mismatchDelay);
  }

  private setUnmatchedCardsDisabled(disabled: boolean): void {
    for (const card of this.querySelectorAll<TpFlipCard>('tp-flip-card')) {
      if (card.dataset.matched !== 'true') card.disabled = disabled;
    }
  }

  private shuffle(cards: TpFlipCard[]): void {
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      const current = cards[index] as TpFlipCard;
      cards[index] = cards[target] as TpFlipCard;
      cards[target] = current;
    }
  }

  private renderError(message: string): void {
    const error = document.createElement('div');
    error.className = 'tp-memory-error';
    error.textContent = `Error: ${message}`;
    this.replaceChildren(error);
  }
}

if (!customElements.get('tp-memory')) customElements.define('tp-memory', TpMemory);
