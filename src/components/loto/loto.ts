/**
 * @module components/loto
 * @summary French loto game with a random ticket and number draw.
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
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./loto.css?inline";
import "../chronometer/chronometer.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../switcher/switcher.js";
import type { TpChronometer } from "../chronometer/chronometer.js";

type LotoCell = number | null;

/** Information emitted after a loto draw. */
export interface TpLotoDrawDetail {
	number: number;
}

/**
 * Displays a French loto ticket and draws numbers from 1 to 90.
 *
 * @summary Displays a playable French loto game.
 * @tagname tp-loto
 * @attr {number} cards = 1 - Number of loto tickets displayed, from 1 to 4.
 * @event tp-loto-draw Emitted after a number is drawn.
 * @eventdetail tp-loto-draw { number: number }
 * @event tp-loto-reset Emitted after a new ticket and draw are generated.
 * @event tp-loto-win Emitted when every displayed ticket number has been drawn.
 * @cssprop --tp-game-cell-size Size of a ticket cell.
 * @example
 * <tp-loto></tp-loto>
 */
export class TpLoto extends TpBase {
	private static readonly styleId = "tp-loto-styles";
	private tickets: LotoCell[][][] = [];
	private drawPile: number[] = [];
	private drawnNumbers: number[] = [];
	private chronometerStarted = false;
	private completed = false;
	private rendered = false;

	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "cards"];
	}

	public get cards(): number {
		const value = Number.parseInt(this.getAttribute("cards") ?? "1", 10);
		return Number.isInteger(value) && value >= 1 && value <= 4 ? value : 1;
	}

	public set cards(value: number) {
		const normalized = Math.min(4, Math.max(1, Math.trunc(value)));
		this.setAttribute("cards", String(normalized));
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpLoto.styleId, style);
		this.classList.add("tp-loto");
		if (!this.rendered) {
			this.renderShell();
			this.reset();
			this.rendered = true;
		}
	}

	public attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (name === "cards" && this.rendered && oldValue !== newValue)
			this.reset();
	}

	/** Generates a new ticket and resets the draw and chronometer. */
	public reset(): void {
		const previous = this.tickets.map((ticket) => ticket.flat().join(","));
		const signatures = new Set<string>();
		this.tickets = Array.from({ length: this.cards }, (_, index) => {
			let ticket: LotoCell[][];
			let signature: string;
			do {
				ticket = this.createTicket();
				signature = ticket.flat().join(",");
			} while (signature === previous[index] || signatures.has(signature));
			signatures.add(signature);
			return ticket;
		});
		this.drawPile = this.shuffle(
			Array.from({ length: 90 }, (_, index) => index + 1),
		);
		this.drawnNumbers = [];
		this.chronometerStarted = false;
		this.completed = false;
		this.chronometer?.stop();
		this.renderGame();
		this.dispatchEvent(new CustomEvent("tp-loto-reset", { bubbles: true }));
	}

	/** Draws and returns the next number, or null when the game is over. */
	public draw(): number | null {
		if (this.completed) return null;
		const number = this.drawPile.pop();
		if (number === undefined) return null;
		if (!this.chronometerStarted) {
			this.chronometer?.play();
			this.chronometerStarted = true;
		}
		this.drawnNumbers.push(number);
		this.completed = this.ticketNumbers.every((ticketNumber) =>
			this.drawnNumbers.includes(ticketNumber),
		);
		if (this.completed) this.chronometer?.pause();
		this.renderGame();
		this.dispatchEvent(
			new CustomEvent<TpLotoDrawDetail>("tp-loto-draw", {
				bubbles: true,
				detail: { number },
			}),
		);
		if (this.completed)
			this.dispatchEvent(new CustomEvent("tp-loto-win", { bubbles: true }));
		return number;
	}

	private get chronometer(): TpChronometer | null {
		return this.querySelector<TpChronometer>(".tp-loto-chronometer");
	}

	private get ticketNumbers(): number[] {
		return this.tickets.flat(2).filter((cell): cell is number => cell !== null);
	}

	private renderShell(): void {
		this.innerHTML = `
      <div class="tp-loto-header">
        <div class="tp-loto-title">Loto</div>
        <div class="tp-loto-controls">
          <tp-icon-button class="tp-loto-reset" name="refresh" label="New loto game"></tp-icon-button>
          <tp-chronometer class="tp-loto-chronometer"></tp-chronometer>
        </div>
      </div>
      <div class="tp-loto-tickets"></div>
      <div class="tp-loto-draw">
        <button class="tp-loto-draw-button" type="button">Draw a number</button>
        <output class="tp-loto-current" aria-live="polite"></output>
      </div>
      <tp-switcher class="tp-loto-history" role="list" gap="0.4rem" aria-label="Drawn numbers"></tp-switcher>
      <div class="tp-loto-status" role="status"></div>
    `;
		this.querySelector(".tp-loto-reset")?.addEventListener("click", () =>
			this.reset(),
		);
		this.querySelector(".tp-loto-draw-button")?.addEventListener("click", () =>
			this.draw(),
		);
	}

	private renderGame(): void {
		const drawn = new Set(this.drawnNumbers);
		const tickets = this.querySelector(".tp-loto-tickets");
		if (tickets) {
			tickets.innerHTML = this.tickets
				.map(
					(ticket, ticketIndex) => `
        <div class="tp-loto-ticket" role="grid" aria-label="Loto ticket ${ticketIndex + 1}">
          ${ticket
						.map(
							(row, rowIndex) => `
            <div role="row" aria-rowindex="${rowIndex + 1}">
              ${row
								.map(
									(cell, columnIndex) => `
                <div
                  class="tp-loto-cell${cell === null ? " empty" : ""}${cell !== null && drawn.has(cell) ? " drawn" : ""}"
                  role="gridcell"
                  aria-colindex="${columnIndex + 1}"
                  ${cell !== null && drawn.has(cell) ? 'aria-label="' + cell + ', drawn"' : ""}
                >${cell ?? ""}</div>
              `,
								)
								.join("")}
            </div>
          `,
						)
						.join("")}
        </div>
      `,
				)
				.join("");
		}
		const current = this.querySelector<HTMLOutputElement>(".tp-loto-current");
		if (current) {
			const currentNumber = this.drawnNumbers.at(-1);
			current.innerHTML =
				currentNumber === undefined
					? "—"
					: `<tp-icon name="${currentNumber}" library="numbers" size="3.5rem"></tp-icon>`;
		}
		const history = this.querySelector(".tp-loto-history");
		if (history) {
			history.innerHTML = this.drawnNumbers
				.map(
					(number) => `
          <span class="tp-loto-ball" role="listitem" aria-label="${number}">
            <tp-icon name="${number}" library="numbers" size="2.75rem"></tp-icon>
          </span>
        `,
				)
				.join("");
		}
		const button = this.querySelector<HTMLButtonElement>(
			".tp-loto-draw-button",
		);
		if (button) button.disabled = this.completed || this.drawPile.length === 0;
		const status = this.querySelector(".tp-loto-status");
		if (status) {
			const marked = this.ticketNumbers.filter((number) =>
				drawn.has(number),
			).length;
			status.textContent = this.completed
				? "Loto completed"
				: `${marked} / ${15 * this.cards} ticket numbers drawn`;
			status.classList.toggle("completed", this.completed);
		}
	}

	private createTicket(): LotoCell[][] {
		let occupied: boolean[][];
		do {
			occupied = Array.from({ length: 3 }, () => {
				const columns = this.shuffle(
					Array.from({ length: 9 }, (_, index) => index),
				).slice(0, 5);
				return Array.from({ length: 9 }, (_, column) =>
					columns.includes(column),
				);
			});
		} while (
			Array.from({ length: 9 }, (_, column) =>
				occupied.some((row) => row[column]),
			).some((hasNumber) => !hasNumber)
		);

		const ticket: LotoCell[][] = Array.from({ length: 3 }, () =>
			Array(9).fill(null),
		);
		for (let column = 0; column < 9; column += 1) {
			const rows = [0, 1, 2].filter((row) => occupied[row]?.[column]);
			const first = column === 0 ? 1 : column * 10;
			const last = column === 8 ? 90 : column * 10 + 9;
			const values = this.shuffle(
				Array.from({ length: last - first + 1 }, (_, index) => first + index),
			)
				.slice(0, rows.length)
				.sort((left, right) => left - right);
			rows.forEach((row, index) => {
				if (ticket[row]) ticket[row][column] = values[index] ?? null;
			});
		}
		return ticket;
	}

	private shuffle<T>(values: T[]): T[] {
		for (let index = values.length - 1; index > 0; index -= 1) {
			const target = Math.floor(Math.random() * (index + 1));
			[values[index], values[target]] = [
				values[target] as T,
				values[index] as T,
			];
		}
		return values;
	}
}

if (!customElements.get("tp-loto")) customElements.define("tp-loto", TpLoto);
