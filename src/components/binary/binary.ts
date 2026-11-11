/**
 * @module components/binary
 * @summary Binary puzzle web component.
 *
 * Provides interactive Binary puzzle solving with the `<tp-binary>` custom element.
 * Supports puzzle loading from attributes or HTML list structures.
 *
 * Features:
 * - Interactive cell solving with visual feedback
 * - Undo/redo functionality
 * - Assistance options (show cell, show solution, clear incorrect)
 * - Real-time validation and progress tracking
 *
 * @example
 * // From attribute
 * <tp-binary puzzle="row1&#10;row2&#10;..."></tp-binary>
 *
 * @example
 * // From HTML list
 * <tp-binary>
 *   <ol>
 *     <li>row1</li>
 *     <li>row2</li>
 *   </ol>
 * </tp-binary>
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
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
// tp-docgen:dependencies:end

import { BinaryEngine } from "@tp/tp-utilities/games/binary";
import {
	gameActivity,
	mountLegacyGameHeader,
} from "../../utilities/game-header.js";
import { TpBase } from "../base/base.js";
import type { TpIconButton } from "../icon-button/icon-button.js";
import style from "./binary.css?inline";

/**
 * The custom `<tp-binary>` element displays an interactive Binary puzzle.
 *
 * The Binary puzzle is a logical puzzle where grid cells must be filled with 0 or 1
 * following specific rules. This component provides a complete UI with grid rendering,
 * controls, and game state management.
 *
 * @summary Displays an interactive Binary puzzle.
 * @tagname tp-binary
 *
 * @attr {string} puzzle = "" - Puzzle rows separated by newlines.
 *
 * @example
 * <tp-binary>
 *         <ol>
 *           <li>1010110!0</li>
 *           <li>01!01!0011!</li>
 *           <li>0010101!1!</li>
 *           <li>11!01!0100</li>
 *           <li>10011001!</li>
 *           <li>0!110!1010</li>
 *           <li>0110!0!101</li>
 *           <li>10!0101!10</li>
 *         </ol>
 *       </tp-binary>
 */
export class TpBinary extends TpBase {
	/**
	 * Global stylesheet identifier injected once per document.
	 */
	private static readonly styleId = "tp-binary-styles";
	/**
	 * Core puzzle engine managing game logic and validation.
	 * @private
	 */
	private engine: BinaryEngine | null = null;

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
	 * Button for undoing the last move.
	 * @private
	 */
	private undoButton: TpIconButton | null = null;

	/**
	 * Button for redoing the last undone move.
	 * @private
	 */
	private redoButton: TpIconButton | null = null;

	/**
	 * Dropdown menu for game assistance options.
	 * @private
	 */
	private assistSelect: HTMLSelectElement | null = null;

	/**
	 * Lifecycle hook: invoked when element is inserted into DOM.
	 * Initializes the puzzle engine and renders the UI.
	 *
	 * Puzzle data is loaded from the puzzle attribute or parsed from light DOM.
	 * The legacy data-binary-puzzle attribute remains supported for backward compatibility.
	 * If puzzle loading fails, renders an error message.
	 *
	 * @summary Connects the Binary puzzle to the document.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpBinary.styleId, style);
		this.classList.add("tp-binary");
		const puzzle =
			this.getAttribute("puzzle") ??
			this.dataset.binaryPuzzle ??
			this.parsePuzzleFromLists();

		if (!puzzle) {
			this.renderError("Empty binary puzzle");
			return;
		}

		try {
			this.engine = new BinaryEngine({
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
	 * Looks for <ol> or <ul> elements and extracts row content from <li> items.
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
      <div class="tp-binary-container">
        <div class="tp-binary-header">
          <div class="tp-binary-title">Binary</div>
          <div class="tp-binary-controls">
            <tp-icon-button class="tp-binary-undo" name="undo" label="Undo" disabled></tp-icon-button>
            <tp-icon-button class="tp-binary-redo" name="redo" label="Redo" disabled></tp-icon-button>
            <select class="tp-binary-assist" aria-label="Assistance actions">
              <option value="">Assist…</option>
              <option value="reset-game">Reset the game</option>
              <option value="show-incorrect">Show all incorrect boxes</option>
              <option value="clear-incorrect">Clear the incorrect boxes</option>
              <option value="show-cell">Show the box</option>
              <option value="show-solution">Show the solution</option>
            </select>
          </div>
        </div>

        <div class="tp-binary-grid"></div>
        <div class="tp-binary-status"></div>
      </div>
    `;

		this.gridElement = this.querySelector(".tp-binary-grid");
		this.statusElement = this.querySelector(".tp-binary-status");
		this.undoButton = this.querySelector(".tp-binary-undo") as TpIconButton;
		this.redoButton = this.querySelector(".tp-binary-redo") as TpIconButton;
		this.assistSelect = this.querySelector(
			".tp-binary-assist",
		) as HTMLSelectElement;

		if (!this.engine || !this.gridElement) return;

		this.engine.renderGrid(this.gridElement);
		this.attachEventListeners();
		mountLegacyGameHeader(this, "binary");
		this.updateStatus();
	}

	/**
	 * Attaches event listeners to interactive elements.
	 * Sets up undo/redo button handlers and assists menu actions.
	 * Prevents default mousedown behavior to keep focus on grid.
	 *
	 * @private
	 */
	private attachEventListeners(): void {
		if (
			!this.undoButton ||
			!this.redoButton ||
			!this.assistSelect ||
			!this.gridElement
		)
			return;

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
					break;
				case "show-incorrect":
					this.engine.showIncorrectCells();
					break;
				case "clear-incorrect":
					this.engine.clearIncorrectCells();
					break;
				case "show-cell":
					if (this.engine?.getActiveCell()) {
						const active = this.engine.getActiveCell();
						if (active) {
							this.engine.showCell(active.row, active.col);
						}
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

		for (const button of [this.undoButton, this.redoButton]) {
			button.addEventListener("mousedown", (e) => {
				e.preventDefault();
			});
		}
	}

	/**
	 * Updates the UI with current game status.
	 * Refreshes undo/redo button states and displays progress/completion message.
	 * Shows either empty cell count or incorrect cells if visible.
	 *
	 * @private
	 */
	private updateStatus(): void {
		if (
			!this.statusElement ||
			!this.engine ||
			!this.undoButton ||
			!this.redoButton
		)
			return;

		const validation = this.engine.getValidation();
		gameActivity(this, this.engine.canUndo(), validation.isComplete);
		this.undoButton.disabled = !this.engine.canUndo();
		this.redoButton.disabled = !this.engine.canRedo();
		this.statusElement.className = "tp-binary-status";

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
		this.innerHTML = `<div class="tp-binary-error">Error: ${message}</div>`;
	}
}

/**
 * Registers `<tp-binary>` custom element once.
 */
if (!customElements.get("tp-binary")) {
	customElements.define("tp-binary", TpBinary);
}
