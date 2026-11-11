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
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Drawer overlay component.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-flip-card
 * @summary Two-sided card component.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
// tp-docgen:dependencies:end

import {
	gameActivity,
	mountGameHeader,
	updateGameHeader,
} from "../../utilities/game-header.js";
import style from "./memory.css?inline";
import "../chronometer/chronometer.js";
import "../flip-card/flip-card.js";
import "../switcher/switcher.js";
import { TpBase } from "../base/base.js";
import type { TpChronometer } from "../chronometer/chronometer.js";
import type { TpFlipCard } from "../flip-card/flip-card.js";

const BLUE_BACK_URL = new URL(
	"../card/cards/backs/back-blue.svg",
	import.meta.url,
).href;
const RED_BACK_URL = new URL(
	"../card/cards/backs/back-red.svg",
	import.meta.url,
).href;

interface MemorySnapshot {
	cards: { flipped: boolean; disabled: boolean; matched: boolean }[];
	matchedPairs: number;
}

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
export class TpMemory extends TpBase {
	private static readonly styleId = "tp-memory-styles";
	private selectedCards: TpFlipCard[] = [];
	private matchedPairs = 0;
	private pairCount = 0;
	private busy = false;
	private mismatchTimeout: number | null = null;
	private chronometer: TpChronometer | null = null;
	private chronometerStarted = false;
	private history: MemorySnapshot[] = [];
	private historyIndex = 0;
	private restoring = false;

	public get back(): string {
		const value = this.getAttribute("back");
		if (value === null || value === "blue") return BLUE_BACK_URL;
		if (value === "red") return RED_BACK_URL;
		return value;
	}

	public set back(value: string) {
		if (value === "") this.removeAttribute("back");
		else this.setAttribute("back", value);
	}

	public get mismatchDelay(): number {
		const value = Number(this.getAttribute("mismatch-delay") ?? "1000");
		return Number.isFinite(value) && value >= 0 ? value : 1000;
	}

	public set mismatchDelay(value: number) {
		this.setAttribute("mismatch-delay", String(Math.max(0, value)));
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpMemory.styleId, style);
		this.classList.add("tp-memory");
		if (this.dataset.tpMemoryRendered !== "true") this.renderFromList();
	}

	public disconnectedCallback(): void {
		if (this.mismatchTimeout !== null)
			window.clearTimeout(this.mismatchTimeout);
	}

	/** Resets the timer, hides and reshuffles every card. */
	public reset(): void {
		this.restoring = true;
		if (this.mismatchTimeout !== null) {
			window.clearTimeout(this.mismatchTimeout);
			this.mismatchTimeout = null;
		}
		this.busy = false;
		this.selectedCards = [];
		this.matchedPairs = 0;
		this.chronometerStarted = false;
		this.chronometer?.stop();

		const board = this.querySelector(".tp-memory-board");
		const cards = Array.from(this.querySelectorAll<TpFlipCard>("tp-flip-card"));
		for (const card of cards) {
			card.flipped = false;
			card.disabled = false;
			delete card.dataset.matched;
		}
		this.shuffle(cards);
		board?.append(...cards);
		this.restoring = false;
		this.history = [this.snapshot()];
		this.historyIndex = 0;
		updateGameHeader(this);
		this.dispatchEvent(new CustomEvent("tp-memory-reset", { bubbles: true }));
	}

	private snapshot(): MemorySnapshot {
		return {
			cards: Array.from(
				this.querySelectorAll<TpFlipCard>("tp-flip-card"),
				(card) => ({
					flipped: card.flipped,
					disabled: card.disabled,
					matched: card.dataset.matched === "true",
				}),
			),
			matchedPairs: this.matchedPairs,
		};
	}
	private recordHistory(): void {
		this.history = this.history.slice(0, this.historyIndex + 1);
		this.history.push(this.snapshot());
		this.historyIndex++;
		updateGameHeader(this);
	}
	private restoreHistory(): void {
		const state = this.history[this.historyIndex];
		if (!state) return;
		if (this.mismatchTimeout !== null)
			window.clearTimeout(this.mismatchTimeout);
		this.mismatchTimeout = null;
		this.busy = false;
		this.selectedCards = [];
		this.restoring = true;
		Array.from(this.querySelectorAll<TpFlipCard>("tp-flip-card")).forEach(
			(card, i) => {
				const saved = state.cards[i];
				if (!saved) return;
				card.flipped = saved.flipped;
				card.disabled = saved.disabled;
				if (saved.matched) card.dataset.matched = "true";
				else delete card.dataset.matched;
			},
		);
		this.matchedPairs = state.matchedPairs;
		this.restoring = false;
		updateGameHeader(this);
		gameActivity(
			this,
			this.historyIndex > 0,
			this.matchedPairs === this.pairCount,
		);
	}
	/** Takes back a completed pair attempt. Unmatched-pair animations must finish first. */
	public undo(): void {
		if (!this.busy && this.historyIndex > 0) {
			this.historyIndex--;
			this.restoreHistory();
		}
	}
	/** Replays a completed pair attempt with the same card positions. */
	public redo(): void {
		if (!this.busy && this.historyIndex < this.history.length - 1) {
			this.historyIndex++;
			this.restoreHistory();
		}
	}
	private renderFromList(): void {
		const list = Array.from(this.children).find(
			(child): child is HTMLOListElement | HTMLUListElement =>
				child.tagName === "OL" || child.tagName === "UL",
		);
		if (!list) {
			this.renderError("tp-memory requires an ol or ul list");
			return;
		}

		const items = Array.from(list.children).filter(
			(child): child is HTMLLIElement => child.tagName === "LI",
		);
		if (items.length === 0) {
			this.renderError("tp-memory requires at least one list item");
			return;
		}

		this.pairCount = items.length;
		const cards = items.flatMap((item, pairIndex) => [
			this.createCard(item, pairIndex),
			this.createCard(item, pairIndex),
		]);
		this.shuffle(cards);

		const switcher = document.createElement("tp-switcher");
		switcher.className = "tp-memory-board";
		switcher.setAttribute("gap", "var(--tp-memory-gap, 0.75rem)");
		switcher.append(...cards);
		const chronometer = document.createElement("tp-chronometer");
		chronometer.className = "tp-memory-chronometer";
		this.chronometer = chronometer;
		const resetButton = document.createElement("tp-icon-button");
		resetButton.className = "tp-memory-reset";
		resetButton.setAttribute("name", "refresh");
		resetButton.setAttribute("label", "Reset memory");
		resetButton.addEventListener("click", () => this.reset());
		const controls = document.createElement("div");
		controls.className = "tp-memory-controls";
		controls.append(resetButton, chronometer);
		const title = document.createElement("div");
		title.className = "tp-memory-title";
		title.textContent = "Memory";
		const header = document.createElement("div");
		header.className = "tp-memory-header";
		header.append(title, controls);
		this.replaceChildren(header, switcher);
		this.dataset.tpMemoryRendered = "true";
		this.history = [this.snapshot()];
		this.historyIndex = 0;
		mountGameHeader(this, {
			name: "Memory",
			icon: "memory",
			target: header,
			chronometer,
			reset: () => this.reset(),
			undo: () => this.undo(),
			redo: () => this.redo(),
			canUndo: () => !this.busy && this.historyIndex > 0,
			canRedo: () => !this.busy && this.historyIndex < this.history.length - 1,
			help: () => [
				{
					label: "Reveal one matching pair",
					disabled: () => this.busy || this.matchedPairs === this.pairCount,
					run: () => {
						const cards = Array.from(
							this.querySelectorAll<TpFlipCard>("tp-flip-card"),
						);
						const first =
							this.selectedCards[0] ??
							cards.find((c) => c.dataset.matched !== "true");
						if (!first) return;
						const second = cards.find(
							(c) => c !== first && c.dataset.pair === first.dataset.pair,
						);
						if (!first.flipped) first.flip();
						if (second && !second.flipped) second.flip();
					},
				},
			],
		});
	}

	private createCard(item: HTMLLIElement, pairIndex: number): TpFlipCard {
		const card = document.createElement("tp-flip-card") as TpFlipCard;
		card.className = "tp-memory-card";
		card.dataset.pair = String(pairIndex);
		card.setAttribute("fit-content", "");
		card.setAttribute("button-position", "none");
		const list = document.createElement("dl");
		const rectoTerm = document.createElement("dt");
		rectoTerm.textContent = "recto";
		const recto = document.createElement("dd");
		const back = document.createElement("img");
		back.src = this.back;
		back.alt = "";
		back.className = "tp-memory-card-back";
		recto.append(back);
		const versoTerm = document.createElement("dt");
		versoTerm.textContent = "verso";
		const verso = document.createElement("dd");
		verso.append(
			...Array.from(item.childNodes, (node) => node.cloneNode(true)),
		);
		list.append(rectoTerm, recto, versoTerm, verso);
		card.append(list);
		card.addEventListener("tp-flip-card-change", () =>
			this.handleCardChange(card),
		);
		return card;
	}

	private handleCardChange(card: TpFlipCard): void {
		if (this.restoring) return;
		if (this.busy) {
			card.flipped = false;
			return;
		}
		if (!card.flipped) {
			this.selectedCards = this.selectedCards.filter(
				(selected) => selected !== card,
			);
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
			first.dataset.matched = "true";
			second.dataset.matched = "true";
			this.matchedPairs += 1;
			this.recordHistory();
			this.dispatchEvent(
				new CustomEvent("tp-memory-match", {
					bubbles: true,
					detail: { pair: Number(first.dataset.pair) },
				}),
			);
			if (this.matchedPairs === this.pairCount) {
				this.chronometer?.pause();
				this.dispatchEvent(
					new CustomEvent("tp-memory-complete", { bubbles: true }),
				);
			}
			return;
		}

		this.busy = true;
		updateGameHeader(this);
		this.setUnmatchedCardsDisabled(true);
		this.mismatchTimeout = window.setTimeout(() => {
			first.flipped = false;
			second.flipped = false;
			this.busy = false;
			this.mismatchTimeout = null;
			this.setUnmatchedCardsDisabled(false);
			this.recordHistory();
		}, this.mismatchDelay);
	}

	private setUnmatchedCardsDisabled(disabled: boolean): void {
		for (const card of this.querySelectorAll<TpFlipCard>("tp-flip-card")) {
			if (card.dataset.matched !== "true") card.disabled = disabled;
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
		const error = document.createElement("div");
		error.className = "tp-memory-error";
		error.textContent = `Error: ${message}`;
		this.replaceChildren(error);
	}
}

if (!customElements.get("tp-memory"))
	customElements.define("tp-memory", TpMemory);
