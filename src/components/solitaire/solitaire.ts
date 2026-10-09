/**
 * @module components/solitaire
 * @summary Klondike solitaire with a 32-card or 52-card deck.
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
 * @tp-dependency tp-dragdrop
 * @summary Generic drag-and-drop controller for content.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./solitaire.css?inline";
import "../chronometer/chronometer.js";
import "../dragdrop/dragdrop.js";
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
import type { TpChronometer } from "../chronometer/chronometer.js";
import type { TpDragDropDropDetail } from "../dragdrop/dragdrop.js";

const CARD_ASSETS = import.meta.glob(
	"../card/cards/{clubs,diamonds,hearts,spades}/*.svg",
	{
		eager: true,
		import: "default",
		query: "?url",
	},
) as Record<string, string>;
const BLUE_BACK_URL = new URL(
	"../card/cards/backs/back-blue.svg",
	import.meta.url,
).href;
const RED_BACK_URL = new URL(
	"../card/cards/backs/back-red.svg",
	import.meta.url,
).href;

type Suit = "c" | "d" | "h" | "s";
type Source = "waste" | "tableau" | "foundation";

interface SolitaireCard {
	id: string;
	suit: Suit;
	rank: string;
	value: number;
	color: "red" | "black";
	faceUp: boolean;
}

interface Selection {
	source: Source;
	pile: number;
	index: number;
}

const SUITS: Suit[] = ["c", "d", "h", "s"];
const SUIT_NAMES: Record<Suit, string> = {
	c: "clubs",
	d: "diamonds",
	h: "hearts",
	s: "spades",
};
const RANK_NAMES: Record<string, string> = {
	a: "Ace",
	j: "Jack",
	q: "Queen",
	k: "King",
};

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
export class TpSolitaire extends TpBase {
	private static readonly styleId = "tp-solitaire-styles";
	private static nextId = 0;
	private readonly boardId = `tp-solitaire-board-${TpSolitaire.nextId++}`;
	private stock: SolitaireCard[] = [];
	private waste: SolitaireCard[] = [];
	private tableau: SolitaireCard[][] = [];
	private foundations: SolitaireCard[][] = [[], [], [], []];
	private selection: Selection | null = null;
	private chronometerStarted = false;
	private rendered = false;

	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "deck-size", "back"];
	}

	public get deckSize(): 32 | 52 {
		return this.getAttribute("deck-size") === "32" ? 32 : 52;
	}

	public set deckSize(value: 32 | 52) {
		this.setAttribute("deck-size", String(value));
	}

	public get back(): "blue" | "red" {
		return this.getAttribute("back") === "red" ? "red" : "blue";
	}

	public set back(value: "blue" | "red") {
		this.setAttribute("back", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpSolitaire.styleId, style);
		this.classList.add("tp-solitaire");
		if (!this.rendered) {
			this.ensureShell();
			this.reset();
			this.rendered = true;
		}
	}

	public attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (this.rendered && oldValue !== newValue) {
			if (name === "deck-size") this.reset();
			else if (name === "back") this.renderBoard();
		}
	}

	/** Reshuffles and starts a new game. */
	public reset(): void {
		const deck = this.shuffle(this.createDeck());
		this.tableau = Array.from({ length: 7 }, () => []);
		for (let column = 0; column < 7; column += 1) {
			for (let row = 0; row <= column; row += 1) {
				const card = deck.pop();
				if (card) {
					card.faceUp = row === column;
					this.tableau[column]?.push(card);
				}
			}
		}
		this.stock = deck.map((card) => ({ ...card, faceUp: false }));
		this.waste = [];
		this.foundations = [[], [], [], []];
		this.selection = null;
		this.chronometerStarted = false;
		this.chronometer?.stop();
		this.renderBoard();
		this.dispatchEvent(
			new CustomEvent("tp-solitaire-reset", { bubbles: true }),
		);
	}

	private get chronometer(): TpChronometer | null {
		return this.querySelector<TpChronometer>(".tp-solitaire-chronometer");
	}

	private ensureShell(): void {
		this.innerHTML = `
      <div class="tp-solitaire-header">
        <div class="tp-solitaire-title">Solitaire</div>
        <div class="tp-solitaire-controls">
          <tp-icon-button class="tp-solitaire-reset" name="refresh" label="New solitaire"></tp-icon-button>
          <tp-chronometer class="tp-solitaire-chronometer"></tp-chronometer>
        </div>
      </div>
      <div id="${this.boardId}" class="tp-solitaire-board" aria-label="Solitaire board"></div>
      <tp-dragdrop root="#${this.boardId}" items=".tp-solitaire-card, .tp-solitaire-foundation, .tp-solitaire-tableau-pile" handle=".tp-solitaire-card"></tp-dragdrop>
      <div class="tp-solitaire-status" role="status"></div>
    `;
		this.querySelector(".tp-solitaire-reset")?.addEventListener("click", () =>
			this.reset(),
		);
		this.querySelector("tp-dragdrop")?.addEventListener(
			"tp-dragdrop-drop",
			(event) => {
				this.handleDrop((event as CustomEvent<TpDragDropDropDetail>).detail);
			},
		);
	}

	private createDeck(): SolitaireCard[] {
		const ranks =
			this.deckSize === 32
				? ["7", "8", "9", "10", "j", "q", "k", "a"]
				: ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
		return SUITS.flatMap((suit) =>
			ranks.map((rank, value) => ({
				id: `${suit}${rank}`,
				suit,
				rank,
				value,
				color: suit === "d" || suit === "h" ? "red" : "black",
				faceUp: false,
			})),
		);
	}

	private shuffle(cards: SolitaireCard[]): SolitaireCard[] {
		for (let index = cards.length - 1; index > 0; index -= 1) {
			const target = Math.floor(Math.random() * (index + 1));
			[cards[index], cards[target]] = [
				cards[target] as SolitaireCard,
				cards[index] as SolitaireCard,
			];
		}
		return cards;
	}

	private renderBoard(): void {
		const board = this.querySelector<HTMLElement>(".tp-solitaire-board");
		if (!board) return;
		board.innerHTML = `
      <div class="tp-solitaire-top-row">
        <button class="tp-solitaire-pile tp-solitaire-stock" type="button" aria-label="Stock">
          ${this.stock.length > 0 ? this.renderBack() : '<span class="tp-solitaire-empty-symbol">↻</span>'}
        </button>
        <div class="tp-solitaire-pile tp-solitaire-waste">${this.renderTopCard(this.waste, "waste", 0)}</div>
        <div class="tp-solitaire-foundations">
          ${this.foundations
						.map(
							(pile, index) => `
            <div class="tp-solitaire-pile tp-solitaire-foundation" data-foundation="${index}" aria-label="${SUIT_NAMES[SUITS[index] as Suit]} foundation">
              ${this.renderTopCard(pile, "foundation", index) || `<span class="tp-solitaire-empty-symbol">${this.suitSymbol(SUITS[index] as Suit)}</span>`}
            </div>
          `,
						)
						.join("")}
        </div>
      </div>
      <div class="tp-solitaire-tableau">
        ${this.tableau
					.map(
						(pile, pileIndex) => `
          <div class="tp-solitaire-tableau-pile" data-tableau="${pileIndex}">
            ${pile.length === 0 ? '<button class="tp-solitaire-empty-tableau" type="button" aria-label="Empty tableau pile"></button>' : pile.map((card, index) => this.renderCard(card, "tableau", pileIndex, index)).join("")}
          </div>
        `,
					)
					.join("")}
      </div>
    `;
		const dragdrop = this.querySelector("tp-dragdrop");
		if (dragdrop) {
			const items = dragdrop.getAttribute("items") ?? "";
			dragdrop.removeAttribute("items");
			dragdrop.setAttribute("items", items);
		}
		this.attachBoardListeners();
		const status = this.querySelector(".tp-solitaire-status");
		if (status)
			status.textContent = `${this.foundationCount()} / ${this.deckSize} cards in foundations`;
	}

	private renderTopCard(
		pile: SolitaireCard[],
		source: Source,
		pileIndex: number,
	): string {
		const card = pile.at(-1);
		return card
			? this.renderCard(card, source, pileIndex, pile.length - 1)
			: "";
	}

	private renderCard(
		card: SolitaireCard,
		source: Source,
		pile: number,
		index: number,
	): string {
		const selected =
			this.selection?.source === source &&
			this.selection.pile === pile &&
			this.selection.index === index;
		const label = `${RANK_NAMES[card.rank] ?? card.rank} of ${SUIT_NAMES[card.suit]}`;
		return `
      <button class="tp-solitaire-card${card.faceUp ? " face-up" : " face-down"}${selected ? " selected" : ""}" type="button" data-source="${source}" data-pile="${pile}" data-index="${index}" aria-label="${card.faceUp ? label : "Face-down card"}" aria-pressed="${selected}">
        ${card.faceUp ? `<img src="${this.cardUrl(card.id)}" alt="${label}">` : this.renderBack()}
      </button>
    `;
	}

	private renderBack(): string {
		return `<img src="${this.back === "red" ? RED_BACK_URL : BLUE_BACK_URL}" alt="">`;
	}

	private handleDrop({ source, target }: TpDragDropDropDetail): void {
		if (!target || !source.classList.contains("tp-solitaire-card")) return;
		const sourceType = source.dataset.source as Source;
		const sourcePile = Number(source.dataset.pile);
		const sourceIndex = Number(source.dataset.index);
		const cards = this.sourcePile(sourceType, sourcePile);
		const card = cards[sourceIndex];
		if (!card?.faceUp) return;

		this.startTimer();
		this.selection = {
			source: sourceType,
			pile: sourcePile,
			index: sourceIndex,
		};
		const foundation = target.closest<HTMLElement>(".tp-solitaire-foundation");
		const tableau = target.closest<HTMLElement>(".tp-solitaire-tableau-pile");
		const moved = foundation
			? this.moveSelectionToFoundation(Number(foundation.dataset.foundation))
			: tableau
				? this.moveSelectionToTableau(Number(tableau.dataset.tableau))
				: false;
		if (!moved) {
			this.selection = null;
			this.renderBoard();
		}
	}

	private cardUrl(id: string): string {
		const entry = Object.entries(CARD_ASSETS).find(([path]) =>
			path.endsWith(`/${id}.svg`),
		);
		return entry?.[1] ?? "";
	}

	private attachBoardListeners(): void {
		this.querySelector(".tp-solitaire-stock")?.addEventListener("click", () =>
			this.draw(),
		);
		for (const card of this.querySelectorAll<HTMLElement>(
			".tp-solitaire-card",
		)) {
			card.addEventListener("click", () => this.handleCardClick(card));
			card.addEventListener("dblclick", () => this.autoMoveToFoundation(card));
		}
		for (const pile of this.querySelectorAll<HTMLElement>(
			".tp-solitaire-tableau-pile",
		)) {
			pile.addEventListener("click", (event) => {
				if (
					event.target === pile ||
					(event.target as Element).classList.contains(
						"tp-solitaire-empty-tableau",
					)
				) {
					this.moveSelectionToTableau(Number(pile.dataset.tableau));
				}
			});
		}
		for (const foundation of this.querySelectorAll<HTMLElement>(
			".tp-solitaire-foundation",
		)) {
			foundation.addEventListener("click", (event) => {
				if ((event.target as Element).closest(".tp-solitaire-card")) return;
				this.moveSelectionToFoundation(Number(foundation.dataset.foundation));
			});
		}
	}

	private draw(): void {
		this.startTimer();
		this.selection = null;
		if (this.stock.length > 0) {
			const card = this.stock.pop();
			if (card) this.waste.push({ ...card, faceUp: true });
		} else if (this.waste.length > 0) {
			this.stock = this.waste
				.reverse()
				.map((card) => ({ ...card, faceUp: false }));
			this.waste = [];
		}
		this.afterMove();
	}

	private handleCardClick(element: HTMLElement): void {
		const source = element.dataset.source as Source;
		const pile = Number(element.dataset.pile);
		const index = Number(element.dataset.index);
		const cards = this.sourcePile(source, pile);
		const card = cards[index];
		if (!card) return;
		this.startTimer();
		if (!card.faceUp) {
			if (source === "tableau" && index === cards.length - 1) {
				card.faceUp = true;
				this.afterMove();
			}
			return;
		}
		if (this.selection) {
			if (
				source === "tableau" &&
				index === cards.length - 1 &&
				this.moveSelectionToTableau(pile)
			)
				return;
			if (source === "foundation" && this.moveSelectionToFoundation(pile))
				return;
		}
		this.selection = { source, pile, index };
		this.renderBoard();
	}

	private moveSelectionToTableau(targetPile: number): boolean {
		const selection = this.selection;
		if (
			!selection ||
			(selection.source === "tableau" && selection.pile === targetPile)
		)
			return false;
		const source = this.sourcePile(selection.source, selection.pile);
		const moving =
			selection.source === "tableau"
				? source.slice(selection.index)
				: source.slice(-1);
		const first = moving[0];
		const target = this.tableau[targetPile];
		if (!first || !target || !this.canPlaceOnTableau(first, target.at(-1)))
			return false;
		if (selection.source === "tableau") source.splice(selection.index);
		else source.pop();
		target.push(...moving);
		this.selection = null;
		this.revealTableauTop(selection);
		this.afterMove();
		return true;
	}

	private moveSelectionToFoundation(targetPile: number): boolean {
		const selection = this.selection;
		if (!selection) return false;
		const source = this.sourcePile(selection.source, selection.pile);
		if (selection.index !== source.length - 1) return false;
		const card = source.at(-1);
		const target = this.foundations[targetPile];
		if (
			!card ||
			!target ||
			SUITS[targetPile] !== card.suit ||
			card.value !== target.length
		)
			return false;
		source.pop();
		target.push(card);
		this.selection = null;
		this.revealTableauTop(selection);
		this.afterMove();
		return true;
	}

	private autoMoveToFoundation(element: HTMLElement): void {
		const source = element.dataset.source as Source;
		const pile = Number(element.dataset.pile);
		const index = Number(element.dataset.index);
		const cards = this.sourcePile(source, pile);
		const card = cards[index];
		if (!card?.faceUp || index !== cards.length - 1) return;
		this.selection = { source, pile, index };
		this.moveSelectionToFoundation(SUITS.indexOf(card.suit));
	}

	private canPlaceOnTableau(
		card: SolitaireCard,
		target?: SolitaireCard,
	): boolean {
		if (!target) return card.value === this.ranksCount - 1;
		return (
			target.faceUp &&
			target.color !== card.color &&
			target.value === card.value + 1
		);
	}

	private get ranksCount(): number {
		return this.deckSize === 32 ? 8 : 13;
	}

	private sourcePile(source: Source, pile: number): SolitaireCard[] {
		if (source === "waste") return this.waste;
		if (source === "foundation") return this.foundations[pile] ?? [];
		return this.tableau[pile] ?? [];
	}

	private revealTableauTop(selection: Selection): void {
		if (selection.source !== "tableau") return;
		const top = this.tableau[selection.pile]?.at(-1);
		if (top) top.faceUp = true;
	}

	private afterMove(): void {
		this.renderBoard();
		this.dispatchEvent(new CustomEvent("tp-solitaire-move", { bubbles: true }));
		if (this.foundationCount() === this.deckSize) {
			this.chronometer?.pause();
			const status = this.querySelector(".tp-solitaire-status");
			if (status) status.textContent = "Solitaire completed";
			this.dispatchEvent(
				new CustomEvent("tp-solitaire-win", { bubbles: true }),
			);
		}
	}

	private foundationCount(): number {
		return this.foundations.reduce((total, pile) => total + pile.length, 0);
	}

	private startTimer(): void {
		if (!this.chronometerStarted) {
			this.chronometer?.play();
			this.chronometerStarted = true;
		}
	}

	private suitSymbol(suit: Suit): string {
		return { c: "♣", d: "♦", h: "♥", s: "♠" }[suit];
	}
}

if (!customElements.get("tp-solitaire"))
	customElements.define("tp-solitaire", TpSolitaire);
