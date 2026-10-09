/**
 * @module components/yakazu
 * @summary Yakazu puzzle web component.
 *
 * Provides interactive Yakazu puzzle solving via the `<tp-yakazu>` custom element.
 * Yakazu is a logic puzzle combining elements of Sudoku with arithmetic constraints.
 *
 * Features:
 * - Interactive grid solving with visual feedback
 * - Dual entry modes: Game (single value) and Note (pencil marks)
 * - Real-time validation with constraint checking
 * - Undo/redo functionality
 * - Assistance options (show cell, show solution, clear errors)
 * - Entry mode toggling
 * - Progress tracking and completion detection
 *
 * Puzzle data is loaded from data attributes or HTML list structures.
 *
 * @example
 * // From data attribute
 * <tp-yakazu data-yakazu-puzzle="puzzle_string"></tp-yakazu>
 *
 * @example
 * // From HTML list
 * <tp-yakazu>
 *   <ol>
 *     <li>row1</li>
 *     <li>row2</li>
 *   </ol>
 * </tp-yakazu>
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

import { YakazuEngine } from "@tp/tp-utilities/games/yakazu";
import { TpBase } from "../base/base.js";
import style from "./yakazu.css?inline";

/**
 * Web component for interactive Yakazu puzzles.
 * Uses lightDOM to maintain consistent styling with page content.
 *
 * @element tp-yakazu
 * @tagname tp-yakazu
 * @example
 * <tp-yakazu></tp-yakazu>
 */
export class TpYakazu extends TpBase {
	/**
	 * Global stylesheet identifier injected once per document.
	 */
	private static readonly styleId = "tp-yakazu-styles";
	/**
	 * Core puzzle engine managing game logic and validation.
	 * @private
	 */
	private engine: YakazuEngine | null = null;

	/**
	 * Container element for the interactive game grid.
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
	 * Puzzle data is loaded from data-yakazu-puzzle attribute or parsed from light DOM.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpYakazu.styleId, style);
		this.classList.add("tp-yakazu");
		const puzzle = this.dataset.yakazuPuzzle ?? this.parsePuzzleFromLists();

		if (!puzzle) {
			this.renderError("Empty yakazu puzzle");
			return;
		}

		try {
			this.engine = new YakazuEngine({
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
      <div class="tp-yakazu-container">
        <div class="tp-yakazu-header">
          <div class="tp-yakazu-title">Yakazu</div>
          <div class="tp-yakazu-controls">
            <button class="tp-yakazu-mode" type="button">Game</button>
            <button class="tp-yakazu-undo" disabled>Undo</button>
            <button class="tp-yakazu-redo" disabled>Redo</button>
            <select class="tp-yakazu-assist" aria-label="Assistance actions">
              <option value="">Assist…</option>
              <option value="reset-game">Reset the game</option>
              <option value="show-incorrect">Show all incorrect boxes</option>
              <option value="clear-incorrect">Clear the incorrect boxes</option>
              <option value="show-cell">Show the box</option>
              <option value="show-solution">Show the solution</option>
            </select>
          </div>
        </div>

        <div class="tp-yakazu-grid"></div>
        <div class="tp-yakazu-status"></div>
      </div>
    `;

		this.gridElement = this.querySelector(".tp-yakazu-grid");
		this.statusElement = this.querySelector(".tp-yakazu-status");
		this.modeButton = this.querySelector(
			".tp-yakazu-mode",
		) as HTMLButtonElement;
		this.undoButton = this.querySelector(
			".tp-yakazu-undo",
		) as HTMLButtonElement;
		this.redoButton = this.querySelector(
			".tp-yakazu-redo",
		) as HTMLButtonElement;
		this.assistSelect = this.querySelector(
			".tp-yakazu-assist",
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
		this.modeButton.textContent =
			this.engine.getEntryMode() === "game" ? "Game" : "Note";
		this.modeButton.setAttribute(
			"aria-label",
			`Current entry mode: ${this.engine.getEntryMode()}`,
		);
		this.undoButton.disabled = !this.engine.canUndo();
		this.redoButton.disabled = !this.engine.canRedo();
		this.statusElement.className = "tp-yakazu-status";

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
		this.innerHTML = `<div class="tp-yakazu-error">Error: ${message}</div>`;
	}
}

/**
 * Registers `<tp-yakazu>` custom element once.
 */
if (!customElements.get("tp-yakazu")) {
	customElements.define("tp-yakazu", TpYakazu);
}
