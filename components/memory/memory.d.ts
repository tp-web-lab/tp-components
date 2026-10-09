/**
 * @module components/memory
 * @summary Memory matching game generated from a list.
 */
import '../chronometer/chronometer.js';
import '../flip-card/flip-card.js';
import '../switcher/switcher.js';
import { TpBase } from '../base/base.js';
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
export declare class TpMemory extends TpBase {
    private static readonly styleId;
    private selectedCards;
    private matchedPairs;
    private pairCount;
    private busy;
    private mismatchTimeout;
    private chronometer;
    private chronometerStarted;
    get back(): string;
    set back(value: string);
    get mismatchDelay(): number;
    set mismatchDelay(value: number);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    /** Resets the timer, hides and reshuffles every card. */
    reset(): void;
    private renderFromList;
    private createCard;
    private handleCardChange;
    private setUnmatchedCardsDisabled;
    private shuffle;
    private renderError;
}
