/**
 * @module components/sudoku
 * @summary Sudoku game web component.
 *
 * Provides interactive Sudoku puzzle solving via the `<tp-sudoku>` custom element.
 * Features dual entry modes (game/note) and complete game mechanics.
 *
 * Features:
 * - Interactive 9x9 grid with automatic zone marking
 * - Dual entry modes: Game (single digit) and Note (pencil marks)
 * - Real-time validation with visual highlighting of errors
 * - Undo/redo functionality
 * - Assistance options (show cell, show solution, clear errors)
 * - Entry mode toggling with mode button
 * - Progress tracking and completion detection
 *
 * @example
 * // From attribute
 * <tp-sudoku puzzle="row1&#10;row2&#10;..."></tp-sudoku>
 *
 * @example
 * // From HTML list
 * <tp-sudoku>
 *   <ol>
 *     <li>row1</li>
 *     <li>row2</li>
 *   </ol>
 * </tp-sudoku>
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
// tp-docgen:dependencies:end

import { SudokuEngine } from "@tp/tp-utilities/games/sudoku";
import { TpBase } from "../base/base.js";
import style from "./sudoku.css?inline";

/**
 * Web component for interactive Sudoku puzzles.
 * Uses lightDOM (no Shadow DOM) to maintain consistent styling with page.
 *
 * The component supports both game mode (single entries) and note mode (pencil marks).
 *
 * @summary Displays an interactive Sudoku puzzle.
 * @tagname tp-sudoku
 *
 * @attr {string} puzzle = "" - Puzzle rows separated by newlines.
 *
 * @example
 * <tp-sudoku></tp-sudoku>
 */
export class TpSudoku extends TpBase {
	/**
	 * Global stylesheet identifier injected once per document.
	 */
	private static readonly styleId = "tp-sudoku-styles";
	/**
	 * Core puzzle engine managing game logic and validation.
	 * @private
	 */
	private engine: SudokuEngine | null = null;

	/**
	 * Container element for the interactive 9x9 game grid.
	 * @private
	 */
	private gridElement: HTMLElement | null = null;

	/**
	 * Element displaying game status and progress information.
	 * @private
	 */
	private statusElement: HTMLElement | null = null;

	/**
	 * Button for toggling between game and note entry modes.
	 * @private
	 */
	private modeButton: HTMLButtonElement | null = null;

	/**
	 * Button for undoing the last move.
	 * @private
	 */
	private undoButton: HTMLButtonElement | null = null;

	/**
	 * Button for redoing the last undone move.
	 * @private
	 */
	private redoButton: HTMLButtonElement | null = null;

	/**
	 * Dropdown menu for game assistance options.
	 * @private
	 */
	private assistSelect: HTMLSelectElement | null = null;

	/**
	 * Currently focused cell position (for assist operations).
	 * @private
	 */
	private focusedCell: { row: number; col: number } | null = null;

	/**
	 * Lifecycle hook: invoked when element is inserted into DOM.
	 * Initializes the puzzle engine and renders the UI.
	 * Puzzle data is loaded from the puzzle attribute or parsed from light DOM.
	 * The legacy data-sudoku-puzzle attribute remains supported for backward compatibility.
	 *
	 * @summary Connects the Sudoku puzzle to the document.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpSudoku.styleId, style);
		this.classList.add("tp-sudoku");
		const puzzle =
			this.getAttribute("puzzle") ??
			this.dataset.sudokuPuzzle ??
			this.parsePuzzleFromLists();

		if (!puzzle) {
			this.renderError("Empty sudoku puzzle");
			return;
		}

		try {
			this.engine = new SudokuEngine({
				onChange: () => this.updateStatus(),
			});
			this.engine.initialize(puzzle);
			this.render();
		} catch (error) {
			this.renderError(error instanceof Error ? error.message : String(error));
		}
	}

	/**
	 * Parses puzzle definition from light DOM list structure.
	 * Extracts row content from <ol> or <ul> and <li> elements.
	 *
	 * @returns Puzzle string with rows joined by newlines, or undefined if no list found.
	 * @private
	 */
	private parsePuzzleFromLists(): string | undefined {
		const list = Array.from(this.children).find((child) => {
			const tagName = child.tagName.toLowerCase();
			return tagName === "ol" || tagName === "ul";
		}) as HTMLOListElement | HTMLUListElement | undefined;

		if (!list) {
			return undefined;
		}

		const rows = Array.from(list.children)
			.filter((child): child is HTMLLIElement => child.tagName === "LI")
			.map((item) => item.textContent?.trim() ?? "")
			.filter((line) => line.length > 0);

		if (rows.length === 0) {
			return undefined;
		}

		return rows.join("\n");
	}

	/**
	 * Renders the complete component UI including grid, controls, and status display.
	 * Generates HTML markup and initializes all DOM element references.
	 * Attaches event listeners and performs initial grid rendering.
	 *
	 * @private
	 */
	private render(): void {
		this.innerHTML = `
      <div class="tp-sudoku-container">
        <div class="tp-sudoku-header">
          <div class="tp-sudoku-title">Sudoku</div>
          <div class="tp-sudoku-controls">
            <button class="tp-sudoku-mode" type="button">Game</button>
            <button class="tp-sudoku-undo" disabled>Undo</button>
            <button class="tp-sudoku-redo" disabled>Redo</button>
            <select class="tp-sudoku-assist" aria-label="Assistance actions">
              <option value="">Assist…</option>
              <option value="reset-game">Reset the game</option>
              <option value="show-incorrect">Show all incorrect boxes</option>
              <option value="clear-incorrect">Clear the incorrect boxes</option>
              <option value="show-cell">Show the box</option>
              <option value="show-solution">Show the solution</option>
            </select>
          </div>
        </div>

        <div class="tp-sudoku-grid"></div>
        <div class="tp-sudoku-status"></div>
      </div>
    `;

		this.gridElement = this.querySelector(".tp-sudoku-grid");
		this.statusElement = this.querySelector(".tp-sudoku-status");
		this.modeButton = this.querySelector(
			".tp-sudoku-mode",
		) as HTMLButtonElement;
		this.undoButton = this.querySelector(
			".tp-sudoku-undo",
		) as HTMLButtonElement;
		this.redoButton = this.querySelector(
			".tp-sudoku-redo",
		) as HTMLButtonElement;
		this.assistSelect = this.querySelector(
			".tp-sudoku-assist",
		) as HTMLSelectElement;

		if (!this.engine || !this.gridElement) return;

		this.engine.renderGrid(this.gridElement);
		this.attachEventListeners();
		this.updateStatus();
	}

	/**
	 * Attaches event listeners to interactive elements.
	 * Handles mode button, undo/redo, assists menu, and cell focus tracking.
	 *
	 * @private
	 */
	private attachEventListeners(): void {
		if (
			!this.modeButton ||
			!this.undoButton ||
			!this.redoButton ||
			!this.assistSelect ||
			!this.gridElement
		)
			return;

		this.modeButton.addEventListener("click", () => {
			this.engine?.toggleEntryMode();
			this.updateStatus();
		});

		this.undoButton.addEventListener("click", () => {
			this.engine?.undo();
			this.updateStatus();
		});

		this.redoButton.addEventListener("click", () => {
			this.engine?.redo();
			this.updateStatus();
		});

		this.assistSelect.addEventListener("change", () => {
			if (!this.engine || !this.assistSelect) return;

			switch (this.assistSelect.value) {
				case "reset-game":
					this.engine.resetGame();
					this.focusedCell = null;
					break;
				case "show-incorrect":
					this.engine.showIncorrectCells();
					break;
				case "clear-incorrect":
					this.engine.clearIncorrectCells();
					break;
				case "show-cell":
					if (this.focusedCell) {
						this.engine.showCell(this.focusedCell.row, this.focusedCell.col);
					}
					break;
				case "show-solution":
					this.engine.showSolution();
					break;
				default:
					break;
			}

			this.assistSelect.value = "";
			this.updateStatus();
		});

		for (const button of [this.modeButton, this.undoButton, this.redoButton]) {
			button.addEventListener("mousedown", (e) => {
				e.preventDefault();
			});
		}

		// Track focused cell
		this.gridElement.addEventListener(
			"focus",
			(e) => {
				if (e.target instanceof HTMLInputElement) {
					const row = Number.parseInt(e.target.dataset.row ?? "0", 10);
					const col = Number.parseInt(e.target.dataset.col ?? "0", 10);
					this.focusedCell = { row, col };
				}
			},
			true,
		);
	}

	/**
	 * Updates the UI with current game status.
	 * Refreshes undo/redo button states, mode button label, and progress display.
	 * Shows either empty cell count or incorrect cells if visible.
	 *
	 * @private
	 */
	private updateStatus(): void {
		if (
			!this.statusElement ||
			!this.engine ||
			!this.modeButton ||
			!this.undoButton ||
			!this.redoButton
		)
			return;

		const validation = this.engine.getValidation();

		this.undoButton.disabled = !this.engine.canUndo();
		this.redoButton.disabled = !this.engine.canRedo();
		this.modeButton.textContent =
			this.engine.getEntryMode() === "game" ? "Game" : "Note";
		this.modeButton.setAttribute(
			"aria-label",
			`Current entry mode: ${this.engine.getEntryMode()}`,
		);

		this.statusElement.className = "tp-sudoku-status";

		if (validation.isComplete) {
			this.statusElement.textContent = "✓ Solved!";
			this.statusElement.classList.add("success");
		} else {
			const incorrectCount = this.engine.countIncorrectCells();
			const emptyCount = this.engine.countEmptyCells();

			if (this.engine.isShowingIncorrectCells() && incorrectCount > 0) {
				this.statusElement.textContent = `${incorrectCount} incorrect box${incorrectCount !== 1 ? "es" : ""} shown`;
			} else {
				this.statusElement.textContent = `${emptyCount} empty cell${emptyCount !== 1 ? "s" : ""}`;
			}
			this.statusElement.classList.add("info");
		}
	}

	/**
	 * Renders an error message when puzzle initialization fails.
	 * Replaces entire component content with error display.
	 *
	 * @param message - Error description to display.
	 * @private
	 */
	private renderError(message: string): void {
		this.innerHTML = `<div class="tp-sudoku-error">Error: ${message}</div>`;
	}
}

/**
 * Registers `<tp-sudoku>` custom element once.
 */
if (!customElements.get("tp-sudoku")) {
	customElements.define("tp-sudoku", TpSudoku);
}
