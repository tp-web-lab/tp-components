/**
 * @module components/mastermind
 * @summary Interactive Mastermind game component.
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
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./mastermind.css?inline";
import "../chronometer/chronometer.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import type { TpChronometer } from "../chronometer/chronometer.js";
import type { TpDropdown } from "../dropdown/dropdown.js";

let mastermindInstanceCount = 0;

const SUPPORTED_COLORS = [
	"red",
	"blue",
	"green",
	"yellow",
	"orange",
	"purple",
	"pink",
	"cyan",
] as const;

type MastermindColor = (typeof SUPPORTED_COLORS)[number];
type GameOutcome = "playing" | "won" | "lost";

interface Feedback {
	exact: number;
	misplaced: number;
}

interface MastermindSnapshot {
	guesses: Array<Array<MastermindColor | null>>;
	feedback: Array<Feedback | null>;
	currentAttempt: number;
	outcome: GameOutcome;
	selectedColor: MastermindColor;
}

/**
 * Displays an interactive Mastermind game.
 *
 * @summary Displays an interactive Mastermind game.
 * @tagname tp-mastermind
 *
 * @attr {string} solution = "" - Secret color sequence separated by spaces or commas.
 * @attr {string} colors = "red blue green yellow orange purple" - Available colors separated by spaces or commas.
 * @attr {number} attempts = 10 - Maximum number of guesses.
 *
 * @example
 * <tp-mastermind></tp-mastermind>
 */
export class TpMastermind extends TpBase {
	private static readonly styleId = "tp-mastermind-styles";
	private solution: MastermindColor[] = [];
	private colors: MastermindColor[] = [];
	private maxAttempts = 10;
	private guesses: Array<Array<MastermindColor | null>> = [];
	private feedback: Array<Feedback | null> = [];
	private currentAttempt = 0;
	private outcome: GameOutcome = "playing";
	private selectedColor: MastermindColor = "red";
	private history: MastermindSnapshot[] = [];
	private historyIndex = 0;
	private chronometerStarted = false;
	private readonly assistTriggerId =
		`tp-mastermind-assist-${++mastermindInstanceCount}`;

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpMastermind.styleId, style);
		this.classList.add("tp-mastermind");

		try {
			this.readConfiguration();
			this.resetState();
			this.render();
		} catch (error) {
			this.renderError(error instanceof Error ? error.message : String(error));
		}
	}

	private readConfiguration(): void {
		this.colors = [
			...new Set(
				this.parseColors(
					this.getAttribute("colors") ?? "red blue green yellow orange purple",
					"colors",
				),
			),
		];
		if (this.colors.length < 2) {
			throw new Error("Mastermind requires at least two available colors");
		}

		this.solution = this.parseColors(
			this.getAttribute("solution") ?? "",
			"solution",
		);
		if (this.solution.length < 2 || this.solution.length > 8) {
			throw new Error(
				"Mastermind solution must contain between 2 and 8 colors",
			);
		}
		if (this.solution.some((color) => !this.colors.includes(color))) {
			throw new Error(
				"Every solution color must be included in the available colors",
			);
		}

		const attempts = Number.parseInt(this.getAttribute("attempts") ?? "10", 10);
		if (!Number.isInteger(attempts) || attempts < 1 || attempts > 20) {
			throw new Error(
				"Mastermind attempts must be an integer between 1 and 20",
			);
		}
		this.maxAttempts = attempts;
		this.selectedColor = this.colors[0] ?? "red";
	}

	private parseColors(value: string, attribute: string): MastermindColor[] {
		const colors = value
			.toLowerCase()
			.split(/[\s,]+/)
			.filter((color) => color !== "");

		if (colors.length === 0) {
			throw new Error(`Mastermind ${attribute} cannot be empty`);
		}

		for (const color of colors) {
			if (!SUPPORTED_COLORS.includes(color as MastermindColor)) {
				throw new Error(`Unknown Mastermind color: ${color}`);
			}
		}

		return colors as MastermindColor[];
	}

	private resetState(): void {
		this.guesses = Array.from({ length: this.maxAttempts }, () =>
			Array.from({ length: this.solution.length }, () => null),
		);
		this.feedback = Array.from({ length: this.maxAttempts }, () => null);
		this.currentAttempt = 0;
		this.outcome = "playing";
		this.history = [this.createSnapshot()];
		this.historyIndex = 0;
	}

	private createSnapshot(): MastermindSnapshot {
		return {
			guesses: this.guesses.map((guess) => [...guess]),
			feedback: this.feedback.map((result) => (result ? { ...result } : null)),
			currentAttempt: this.currentAttempt,
			outcome: this.outcome,
			selectedColor: this.selectedColor,
		};
	}

	private restoreSnapshot(snapshot: MastermindSnapshot): void {
		this.guesses = snapshot.guesses.map((guess) => [...guess]);
		this.feedback = snapshot.feedback.map((result) =>
			result ? { ...result } : null,
		);
		this.currentAttempt = snapshot.currentAttempt;
		this.outcome = snapshot.outcome;
		this.selectedColor = snapshot.selectedColor;
		this.render();
	}

	private pushHistory(): void {
		this.history = this.history.slice(0, this.historyIndex + 1);
		this.history.push(this.createSnapshot());
		this.historyIndex = this.history.length - 1;
	}

	private render(): void {
		const rows = this.guesses
			.map((guess, row) => this.renderRow(guess, row))
			.join("");
		const palette = this.colors
			.map(
				(color) => `
      <button
        class="tp-mastermind-color tp-${color}${color === this.selectedColor ? " selected" : ""}"
        type="button"
        data-color="${color}"
        aria-label="Select ${color}"
        aria-pressed="${color === this.selectedColor}"
      ></button>
    `,
			)
			.join("");

		if (!this.querySelector(".tp-mastermind-container")) {
			this.innerHTML = `
      <div class="tp-mastermind-container">
        <div class="tp-mastermind-header">
          <div class="tp-mastermind-title">Mastermind</div>
          <div class="tp-mastermind-header-actions">
            <tp-icon-button class="tp-mastermind-new-game" name="refresh" label="Reset with another code"></tp-icon-button>
            <tp-chronometer class="tp-mastermind-chronometer"></tp-chronometer>
            <div class="tp-mastermind-controls"></div>
            <tp-icon-button id="${this.assistTriggerId}" class="tp-mastermind-assist-trigger" name="help" label="Mastermind assistance"></tp-icon-button>
            <tp-dropdown class="tp-mastermind-assist" anchor="#${this.assistTriggerId}" placement="bottom" outside-click>
              <ul>
                <li data-assist="reset-game">Reset the game</li>
                <li data-assist="show-peg">Show next peg</li>
                <li data-assist="show-solution">Show the solution</li>
              </ul>
            </tp-dropdown>
          </div>
        </div>
        <div class="tp-mastermind-palette" role="group" aria-label="Available colors"></div>
        <div class="tp-mastermind-board" role="group" aria-label="Mastermind board"></div>
        <div class="tp-mastermind-status" role="status"></div>
      </div>
    `;
			this.querySelector(".tp-mastermind-new-game")?.addEventListener(
				"click",
				() => this.resetWithNewCode(),
			);
			this.querySelector(".tp-mastermind-assist-trigger")?.addEventListener(
				"click",
				() => {
					this.querySelector<TpDropdown>(".tp-mastermind-assist")?.toggle();
				},
			);
			this.querySelector(".tp-mastermind-assist")?.addEventListener(
				"click",
				(event) => {
					const item = (event.target as Element).closest<HTMLElement>(
						"[data-assist]",
					);
					if (!item) return;
					this.applyAssist(item.dataset.assist ?? "");
					this.querySelector<TpDropdown>(".tp-mastermind-assist")?.hide();
				},
			);
		}

		const controls = this.querySelector(".tp-mastermind-controls");
		if (controls) {
			controls.innerHTML = `
        <tp-icon-button class="tp-mastermind-undo" name="undo" label="Undo" ${this.historyIndex === 0 ? "disabled" : ""}></tp-icon-button>
        <tp-icon-button class="tp-mastermind-redo" name="redo" label="Redo" ${this.historyIndex >= this.history.length - 1 ? "disabled" : ""}></tp-icon-button>
      `;
		}
		const paletteElement = this.querySelector(".tp-mastermind-palette");
		if (paletteElement) paletteElement.innerHTML = palette;
		const boardElement = this.querySelector(".tp-mastermind-board");
		if (boardElement) boardElement.innerHTML = rows;
		const status = this.querySelector(".tp-mastermind-status");
		if (status) {
			status.className = `tp-mastermind-status ${this.outcome}`;
			status.textContent = this.statusText();
		}

		this.attachEventListeners();
	}

	private renderRow(guess: Array<MastermindColor | null>, row: number): string {
		const isCurrent = row === this.currentAttempt && this.outcome === "playing";
		const pegs = guess
			.map(
				(color, col) => `
      <button
        class="tp-mastermind-peg${color ? ` filled tp-${color}` : ""}"
        type="button"
        data-row="${row}"
        data-col="${col}"
        ${isCurrent ? "" : "disabled"}
        aria-label="Attempt ${row + 1}, position ${col + 1}${color ? `: ${color}` : ""}"
      ></button>
    `,
			)
			.join("");
		const result = this.feedback[row];
		const feedback = result
			? `<span class="tp-mastermind-feedback-exact" title="Exact">● ${result.exact}</span><span class="tp-mastermind-feedback-misplaced" title="Misplaced">○ ${result.misplaced}</span>`
			: '<span aria-hidden="true">—</span>';
		const action = isCurrent
			? '<button class="tp-mastermind-check" type="button">Play</button>'
			: "";

		return `
      <div class="tp-mastermind-row${isCurrent ? " current" : ""}">
        <span class="tp-mastermind-attempt">${row + 1}</span>
        <div class="tp-mastermind-pegs">${pegs}</div>
        <div class="tp-mastermind-feedback" role="group" aria-label="Feedback for attempt ${row + 1}">${feedback}</div>
        <div class="tp-mastermind-row-action">${action}</div>
      </div>
    `;
	}

	private attachEventListeners(): void {
		this.querySelector(".tp-mastermind-undo")?.addEventListener("click", () =>
			this.undo(),
		);
		this.querySelector(".tp-mastermind-redo")?.addEventListener("click", () =>
			this.redo(),
		);
		this.querySelector(".tp-mastermind-check")?.addEventListener("click", () =>
			this.checkGuess(),
		);

		for (const button of this.querySelectorAll<HTMLButtonElement>(
			".tp-mastermind-color",
		)) {
			button.addEventListener("click", () => {
				const color = button.dataset.color as MastermindColor;
				this.selectedColor = color;
				const firstEmpty =
					this.guesses[this.currentAttempt]?.findIndex(
						(value) => value === null,
					) ?? -1;
				if (firstEmpty >= 0) {
					this.setPeg(firstEmpty, color);
				} else {
					this.render();
				}
			});
		}

		for (const button of this.querySelectorAll<HTMLButtonElement>(
			".tp-mastermind-peg",
		)) {
			button.addEventListener("click", () => {
				const row = Number.parseInt(button.dataset.row ?? "-1", 10);
				const col = Number.parseInt(button.dataset.col ?? "-1", 10);
				if (row === this.currentAttempt) {
					this.setPeg(col, this.selectedColor);
				}
			});
		}
	}

	private setPeg(col: number, color: MastermindColor): void {
		const guess = this.guesses[this.currentAttempt];
		if (!guess || this.outcome !== "playing" || col < 0 || col >= guess.length)
			return;
		if (!this.chronometerStarted) {
			this.querySelector<TpChronometer>(".tp-mastermind-chronometer")?.play();
			this.chronometerStarted = true;
		}
		guess[col] = color;
		this.pushHistory();
		this.render();
	}

	private checkGuess(): void {
		const guess = this.guesses[this.currentAttempt];
		if (!guess || guess.some((color) => color === null)) {
			this.setStatusMessage("Complete the current guess first");
			return;
		}

		const result = this.scoreGuess(guess as MastermindColor[]);
		this.feedback[this.currentAttempt] = result;
		if (result.exact === this.solution.length) {
			this.outcome = "won";
		} else if (this.currentAttempt >= this.maxAttempts - 1) {
			this.outcome = "lost";
		} else {
			this.currentAttempt += 1;
		}
		if (this.outcome !== "playing") {
			this.querySelector<TpChronometer>(".tp-mastermind-chronometer")?.pause();
		}
		this.pushHistory();
		this.render();
	}

	private scoreGuess(guess: MastermindColor[]): Feedback {
		let exact = 0;
		const remainingSolution: MastermindColor[] = [];
		const remainingGuess: MastermindColor[] = [];

		for (let index = 0; index < this.solution.length; index += 1) {
			if (guess[index] === this.solution[index]) {
				exact += 1;
			} else {
				const solutionColor = this.solution[index];
				const guessColor = guess[index];
				if (solutionColor) remainingSolution.push(solutionColor);
				if (guessColor) remainingGuess.push(guessColor);
			}
		}

		let misplaced = 0;
		for (const color of remainingGuess) {
			const index = remainingSolution.indexOf(color);
			if (index >= 0) {
				misplaced += 1;
				remainingSolution.splice(index, 1);
			}
		}

		return { exact, misplaced };
	}

	private undo(): void {
		if (this.historyIndex === 0) return;
		this.historyIndex -= 1;
		const snapshot = this.history[this.historyIndex];
		if (snapshot) this.restoreSnapshot(snapshot);
	}

	private redo(): void {
		if (this.historyIndex >= this.history.length - 1) return;
		this.historyIndex += 1;
		const snapshot = this.history[this.historyIndex];
		if (snapshot) this.restoreSnapshot(snapshot);
	}

	private applyAssist(action: string): void {
		if (action === "reset-game") {
			this.resetGame();
			return;
		}
		if (this.outcome !== "playing") return;

		if (action === "show-peg") {
			const guess = this.guesses[this.currentAttempt];
			const empty = guess?.findIndex((color) => color === null) ?? -1;
			if (guess && empty >= 0) guess[empty] = this.solution[empty] ?? null;
		} else if (action === "show-solution") {
			this.guesses[this.currentAttempt] = [...this.solution];
		} else {
			return;
		}
		this.pushHistory();
		this.render();
	}

	private resetGame(): void {
		this.querySelector<TpChronometer>(".tp-mastermind-chronometer")?.stop();
		this.chronometerStarted = false;
		this.resetState();
		this.render();
	}

	private resetWithNewCode(): void {
		const previous = this.solution.join(" ");
		let next: MastermindColor[];
		do {
			next = Array.from(
				{ length: this.solution.length },
				() =>
					this.colors[
						Math.floor(Math.random() * this.colors.length)
					] as MastermindColor,
			);
		} while (next.join(" ") === previous);
		this.solution = next;
		this.setAttribute("solution", next.join(" "));
		this.resetGame();
	}

	private statusText(): string {
		if (this.outcome === "won") return "✓ Code cracked!";
		if (this.outcome === "lost")
			return `No attempts left · Solution: ${this.solution.join(", ")}`;
		return `Attempt ${this.currentAttempt + 1} of ${this.maxAttempts}`;
	}

	private setStatusMessage(message: string): void {
		const status = this.querySelector<HTMLElement>(".tp-mastermind-status");
		if (status) status.textContent = message;
	}

	private renderError(message: string): void {
		this.innerHTML = `<div class="tp-mastermind-error">Error: ${message}</div>`;
	}
}

if (!customElements.get("tp-mastermind")) {
	customElements.define("tp-mastermind", TpMastermind);
}
