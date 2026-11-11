/**
 * @module components/memory
 * @summary Memory matching game generated from a list.
 */
import "../chronometer/chronometer.js";
import "../flip-card/flip-card.js";
import "../switcher/switcher.js";
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-memory>` element creates a memory matching game.
 *
 * @summary Creates a memory matching game.
 * @tagname tp-memory
 * @attr {string} back = "" - Card-back URL, or blue/red for an OpenDecks back.
 * @attr {number} mismatch-delay = 1000 - Delay before unmatched cards turn back, in milliseconds.
 *
 * @event tp-memory-complete Emitted when every pair is matched.
 * @event tp-memory-reset Emitted after the game is reset.
 * @cssprop --tp-memory-card-max-width Maximum width of image and SVG cards.
 * @cssprop --tp-memory-gap Gap between cards.
 * @example
 * <tp-memory label="Match the fruits">
 *   <ol><li>Apple</li><li>Pear</li><li>Plum</li></ol>
 * </tp-memory>
 *  @event tp-memory-match Emitted after two matching cards are revealed; pair is the zero-based identifier assigned to their original list item.
 * @eventdetail tp-memory-match { pair: number }
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
    private history;
    private historyIndex;
    private restoring;
    get back(): string;
    set back(value: string);
    get mismatchDelay(): number;
    set mismatchDelay(value: number);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    /** Resets the timer, hides and reshuffles every card. */
    reset(): void;
    private snapshot;
    private recordHistory;
    private restoreHistory;
    /** Takes back a completed pair attempt. Unmatched-pair animations must finish first. */
    undo(): void;
    /** Replays a completed pair attempt with the same card positions. */
    redo(): void;
    private renderFromList;
    private createCard;
    private handleCardChange;
    private setUnmatchedCardsDisabled;
    private shuffle;
    private renderError;
}
