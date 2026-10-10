/**
 * @module components/solitaire
 * @summary Klondike solitaire with a 32-card or 52-card deck.
 */
import "../chronometer/chronometer.js";
import "../dragdrop/dragdrop.js";
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
/**
 * Displays a playable Klondike solitaire.
 *
 * @summary Displays a playable Klondike solitaire.
 * @tagname tp-solitaire
 * @attr {number} deck-size = 52 - Number of cards: 32 or 52.
 * @attr {string} back = "blue" - OpenDecks card back: blue or red.
 * @event tp-solitaire-move Emitted after a valid move.
 * @event tp-solitaire-win Emitted when the game is won.
 * @event tp-solitaire-reset Emitted after the cards are reshuffled.
 * @cssprop --tp-solitaire-card-width Card width.
 * @cssprop --tp-solitaire-gap Gap between piles.
 * @example
 * <tp-solitaire></tp-solitaire>
 */
export declare class TpSolitaire extends TpBase {
    private static readonly styleId;
    private static nextId;
    private readonly boardId;
    private stock;
    private waste;
    private tableau;
    private foundations;
    private selection;
    private chronometerStarted;
    private rendered;
    static get observedAttributes(): string[];
    get deckSize(): 32 | 52;
    set deckSize(value: 32 | 52);
    get back(): "blue" | "red";
    set back(value: "blue" | "red");
    protected connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Reshuffles and starts a new game. */
    reset(): void;
    private get chronometer();
    private ensureShell;
    private createDeck;
    private shuffle;
    private renderBoard;
    private renderTopCard;
    private renderCard;
    private renderBack;
    private handleDrop;
    private cardUrl;
    private attachBoardListeners;
    private draw;
    private handleCardClick;
    private moveSelectionToTableau;
    private moveSelectionToFoundation;
    private autoMoveToFoundation;
    private canPlaceOnTableau;
    private get ranksCount();
    private sourcePile;
    private revealTableauTop;
    private afterMove;
    private foundationCount;
    private startTimer;
    private suitSymbol;
}
