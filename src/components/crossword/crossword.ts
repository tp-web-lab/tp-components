/**
 * @module components/crossword
 * @summary Crossword game web component.
 *
 * Parses definition list structure from lightDOM and initializes crossword puzzle.
 * This component is independent from tp-markdown and can be used in multiple ways:
 * - Standalone HTML with <dl> structure
 * - Via web-component extension in tp-markdown (`::: tp-crossword ... :::`)
 * - Via fence syntax with runtime renderer (legacy)
 *
 * Features:
 * - Interactive crossword grid with dual-direction word solving
 * - Current clue highlighting synchronized with focused cell
 * - Across and down clue navigation
 * - Undo/redo functionality
 * - Assistance options (show cell, show word, show solution)
 * - Clue part segmentation for complex clues
 * - Silent mode support for less intrusive display
 *
 * @example
 * <tp-crossword>
 * <dl>
 *   <dt>solution</dt>
 *   <dd>
 *     <ol>
 *       <li>BALL</li>
 *       <li>AREA</li>
 *       <li>LEAD</li>
 *       <li>LADY</li>
 *     </ol>
 *    </dd>
 *   <dt>across</dt>
 *   <dd>
 *     <ol>
 *       <li>A. A round toy used in many sports</li>
 *       <li>B. The size of a surface</li>
 *       <li>C. A heavy metal</li>
 *       <li>D. A polite word for a woman</li>
 *     </ol>
 *   </dd>
 *   <dt>down</dt>
 *   <dd>
 *     <ol>
 *       <li>1. A round toy used in many sports</li>
 *        <li>2. The size of a surface</li>
 *        <li>3. A heavy metal</li>
 *        <li>4. A polite word for a woman</li>
 *      </ol>
 *    </dd>
 *  </dl>
 * </tp-crossword>
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

import { CrosswordEngine } from "@tp/tp-utilities/games/crossword";
import { TpBase } from "../base/base.js";
import style from "./crossword.css?inline";

/**
 * Web component for interactive crossword puzzles.
 * Uses lightDOM to parse definition list and initialize game.
 *
 * @summary Displays an interactive crossword puzzle.
 * @tagname tp-crossword
 *
 * @attr {string} data-crossword-puzzle = "" - Crossword puzzle definition.
 * @attr {string} data-crossword-silent = false - Enables silent mode when set to `true`.
 * @attr {boolean} silent = false - Enables silent mode.
 *
 * @example
 * <tp-crossword>
 * <dl>
 *   <dt>solution</dt>
 *   <dd>
 *     <ol>
 *       <li>BALL</li>
 *       <li>AREA</li>
 *       <li>LEAD</li>
 *       <li>LADY</li>
 *     </ol>
 *    </dd>
 *   <dt>across</dt>
 *   <dd>
 *     <ol>
 *       <li>A. A round toy used in many sports</li>
 *       <li>B. The size of a surface</li>
 *       <li>C. A heavy metal</li>
 *       <li>D. A polite word for a woman</li>
 *     </ol>
 *   </dd>
 *   <dt>down</dt>
 *   <dd>
 *     <ol>
 *       <li>1. A round toy used in many sports</li>
 *        <li>2. The size of a surface</li>
 *        <li>3. A heavy metal</li>
 *        <li>4. A polite word for a woman</li>
 *      </ol>
 *    </dd>
 *  </dl>
 * </tp-crossword>
 */
export class TpCrossword extends TpBase {
	/**
	 * Global stylesheet identifier injected once per document.
	 */
	private static readonly styleId = "tp-crossword-styles";
	/**
	 * Core puzzle engine managing game logic and word tracking.
	 * @private
	 */
	private engine: CrosswordEngine | null = null;

	/**
	 * Container element for the interactive crossword grid.
	 * @private
	 */
	private gridElement: HTMLElement | null = null;

	/**
	 * Element displaying currently focused across and down clues.
	 * @private
	 */
	private currentCluesElement: HTMLElement | null = null;

	/**
	 * Container element for all across and down clue lists.
	 * @private
	 */
	private cluesElement: HTMLElement | null = null;

	/**
	 * Element displaying game status and progress information.
	 * @private
	 */
	private statusElement: HTMLElement | null = null;

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
	 * Loads puzzle from data attribute or parsed definition list.
	 * Initializes engine and renders complete UI with grid and clues.
	 *
	 * Supports optional 'silent' attribute/dataset for less intrusive display.
	 * If puzzle loading fails, renders an error message.
	 *
	 * @summary Connects the crossword puzzle to the document.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpCrossword.styleId, style);
		this.classList.add("tp-crossword");
		try {
			// Check for data attribute or silent attribute (set by extension or user)
			let puzzle = this.dataset.crosswordPuzzle;
			let silent = this.dataset.crosswordSilent === "true";

			// Also check for silent as a boolean attribute
			if (this.hasAttribute("silent")) {
				silent = true;
			}

			if (!puzzle) {
				// Try parsing from lightDOM <dl> structure
				puzzle = this.parsePuzzleFromDL();
			}

			if (!puzzle) {
				this.renderError("Empty crossword puzzle");
				return;
			}

			this.engine = new CrosswordEngine({
				onChange: () => this.onEngineChange(),
			});
			this.engine.initialize(puzzle, { silent });
			this.render();
		} catch (error) {
			this.renderError(error instanceof Error ? error.message : String(error));
		}
	}

	/**
	 * Parse crossword puzzle from definition list (<dl>) structure.
	 * Expected format:
	 * <dl>
	 *   <dt>solution</dt>
	 *   <dd><ol><li>row_content</li>...</ol></dd>
	 *   <dt>across</dt> (or horizontal)
	 *   <dd><ol><li>clue</li>...</ol></dd>
	 *   <dt>down</dt> (or vertical)
	 *   <dd><ol><li>clue</li>...</ol></dd>
	 * </dl>
	 */
	private parsePuzzleFromDL(): string | undefined {
		const dl = this.querySelector("dl");
		if (!dl) return undefined;

		const sections: Record<string, string[]> = {
			solution: [],
			across: [],
			down: [],
		};

		let currentSection: keyof typeof sections | null = null;

		for (const child of dl.children) {
			if (child.tagName === "DT") {
				const label = child.textContent?.toLowerCase().trim() ?? "";
				// Accept "across", "horizontal", or their aliases
				if (label === "across" || label === "horizontal") {
					currentSection = "across";
				} else if (label === "down" || label === "vertical") {
					currentSection = "down";
				} else if (label === "solution") {
					currentSection = "solution";
				}
			} else if (child.tagName === "DD" && currentSection) {
				// Extract list items from <ol> or <ul>
				const items = child.querySelectorAll("li");
				for (const item of items) {
					const content = item.textContent?.trim() ?? "";
					if (content) {
						const section = sections[currentSection];
						if (section) {
							section.push(content);
						}
					}
				}
			}
		}

		const solutionItems = sections.solution;
		if (!solutionItems || solutionItems.length === 0) {
			return undefined;
		}

		// Build puzzle string in format: a. row_content\nb. row_content\n...\nA. clue\n...\n1. clue\n...
		const puzzleLines: string[] = [];

		// Add row definitions (solution rows)
		for (let i = 0; i < solutionItems.length; i++) {
			const letter = String.fromCharCode(97 + i); // a, b, c, ...
			puzzleLines.push(`${letter}. ${solutionItems[i]}`);
		}

		// Add across clues
		const acrossItems = sections.across;
		if (acrossItems) {
			for (let i = 0; i < acrossItems.length; i++) {
				const letter = String.fromCharCode(65 + i); // A, B, C, ...
				const clue = acrossItems[i]?.replace(/^[A-Za-z]\.\s*/, "") ?? "";
				puzzleLines.push(`${letter}. ${clue}`);
			}
		}

		// Add down clues
		const downItems = sections.down;
		if (downItems) {
			for (let i = 0; i < downItems.length; i++) {
				const number = i + 1;
				const clue = downItems[i]?.replace(/^\d+\.\s*/, "") ?? "";
				puzzleLines.push(`${number}. ${clue}`);
			}
		}

		return puzzleLines.join("\n");
	}

	/**
	 * Renders the complete component UI including grid, clue lists, and controls.
	 * Generates HTML markup with embedded CSS and initializes all DOM element references.
	 * Renders grid and clues, attaches event listeners, and updates status display.
	 *
	 * @private
	 */
	private render(): void {
		this.innerHTML = `
      <div class="tp-crossword-container">
        <div class="tp-crossword-header">
          <div class="tp-crossword-title">Crossword</div>
          <div class="tp-crossword-controls">
            <button class="tp-crossword-undo" disabled>Undo</button>
            <button class="tp-crossword-redo" disabled>Redo</button>
            <select class="tp-crossword-assist" aria-label="Assistance actions">
              <option value="">Assist…</option>
              <option value="reset-game">Reset the game</option>
              <option value="show-incorrect">Show all incorrect boxes</option>
              <option value="clear-incorrect">Clear the incorrect boxes</option>
              <option value="show-cell">Show the box</option>
              <option value="show-word">Show the word</option>
              <option value="show-solution">Show the solution</option>
            </select>
          </div>
        </div>

        <div class="tp-crossword-board-wrap">
          <div class="tp-crossword-grid"></div>
        </div>

        <div class="tp-crossword-current-clues"></div>
        <div class="tp-crossword-clues"></div>
        <div class="tp-crossword-status"></div>
      </div>
    `;

		this.gridElement = this.querySelector(".tp-crossword-grid");
		this.currentCluesElement = this.querySelector(
			".tp-crossword-current-clues",
		);
		this.cluesElement = this.querySelector(".tp-crossword-clues");
		this.statusElement = this.querySelector(".tp-crossword-status");
		this.undoButton = this.querySelector(
			".tp-crossword-undo",
		) as HTMLButtonElement;
		this.redoButton = this.querySelector(
			".tp-crossword-redo",
		) as HTMLButtonElement;
		this.assistSelect = this.querySelector(
			".tp-crossword-assist",
		) as HTMLSelectElement;

		if (!this.engine || !this.gridElement || !this.cluesElement) return;

		this.engine.renderGrid(this.gridElement);
		this.renderClues();
		this.attachEventListeners();
		this.updateStatus();
		this.updateClueHighlights();
		this.updateCurrentClues();
	}

	/**
	 * Attaches event listeners to interactive elements.
	 * Sets up undo/redo buttons, assists menu, and cell focus tracking.
	 * Handles word navigation via clue highlighting.
	 *
	 * @private
	 */
	private attachEventListeners(): void {
		if (
			!this.engine ||
			!this.gridElement ||
			!this.undoButton ||
			!this.redoButton ||
			!this.assistSelect
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
			if (!this.engine || !this.assistSelect || !this.cluesElement) return;

			switch (this.assistSelect.value) {
				case "reset-game":
					this.engine.resetGame();
					this.renderClues();
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
				case "show-word":
					if (this.focusedCell) {
						this.engine.showWord(this.focusedCell.row, this.focusedCell.col);
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

		// Track focused cell
		this.gridElement.addEventListener(
			"focus",
			(e) => {
				if (e.target instanceof HTMLInputElement) {
					const row = Number.parseInt(e.target.dataset.row ?? "0", 10);
					const col = Number.parseInt(e.target.dataset.col ?? "0", 10);
					this.focusedCell = { row, col };
					queueMicrotask(() => {
						this.updateClueHighlights();
						this.updateCurrentClues();
					});
				}
			},
			true,
		);
	}

	/**
	 * Renders both across and down clue lists from engine clue data.
	 * Parses clue labels and text, creates separate HTML elements for each.
	 *
	 * @private
	 */
	private renderClues(): void {
		if (!this.engine || !this.cluesElement) return;

		const clues = this.engine.getClues();
		const acrossItems = this.renderClueItems(clues.across, "across");
		const downItems = this.renderClueItems(clues.down, "down");

		this.cluesElement.innerHTML = `
      <section>
        <h4>Across</h4>
        <ul class="tp-crossword-clue-list">${acrossItems}</ul>
      </section>
      <section>
        <h4>Down</h4>
        <ul class="tp-crossword-clue-list">${downItems}</ul>
      </section>
    `;
	}

	/**
	 * Renders HTML for clue list items with label and text parts.
	 * Segments clue text into parts for fine-grained highlighting.
	 *
	 * @param clues - Array of clue strings with labels.
	 * @param direction - Clue direction: 'across' or 'down'.
	 * @returns HTML string with rendered clue list items.
	 * @private
	 */
	private renderClueItems(
		clues: string[],
		direction: "across" | "down",
	): string {
		return clues
			.map((clue) => {
				const { label, text } = this.splitClueLabel(clue);
				const key = this.normalizeClueKey(label);
				const parts = this.splitClueParts(text);
				const renderedParts = parts
					.map(
						(part, partIndex) =>
							`<span class="tp-crossword-clue-part" data-part-index="${partIndex}">${this.escapeHtml(part)}</span>`,
					)
					.join(" ");

				if (label === "") {
					return `<li class="tp-crossword-clue-item" data-direction="${direction}" data-clue-key=""><span class="tp-crossword-clue-text">${renderedParts}</span></li>`;
				}

				return `<li class="tp-crossword-clue-item" data-direction="${direction}" data-clue-key="${this.escapeHtml(key)}"><span class="tp-crossword-clue-label">${this.escapeHtml(label)}</span><span class="tp-crossword-clue-text">${renderedParts}</span></li>`;
			})
			.join("");
	}

	/**
	 * Splits a clue string into label (e.g., "A.") and text parts.
	 *
	 * @param clue - Full clue string.
	 * @returns Object with label and text properties.
	 * @private
	 */
	private splitClueLabel(clue: string): { label: string; text: string } {
		const normalized = clue.trim();
		const match = normalized.match(/^([A-Za-z0-9]+)\.\s*(.*)$/);
		if (!match) {
			return { label: "", text: normalized };
		}

		return { label: `${match[1]}.`, text: match[2] ?? "" };
	}

	/**
	 * Normalizes a clue label by removing trailing period and uppercasing.
	 *
	 * @param label - Label string (e.g., "A.").
	 * @returns Normalized label (e.g., "A").
	 * @private
	 */
	private normalizeClueKey(label: string): string {
		return label.replace(/\.$/, "").toUpperCase();
	}

	/**
	 * Splits clue text into individual segments separated by periods.
	 * Handles Unicode uppercase letters for international characters.
	 *
	 * @param text - Clue text to split.
	 * @returns Array of text parts.
	 * @private
	 */
	private splitClueParts(text: string): string[] {
		const trimmed = text.trim();
		if (trimmed === "") {
			return [""];
		}

		return trimmed
			.split(/(?<=\.)\s+(?=[A-ZÀ-ÖØ-Þ0-9])/u)
			.map((part) => part.trim())
			.filter((part) => part.length > 0);
	}

	/**
	 * Escapes HTML special characters to prevent XSS.
	 *
	 * @param value - Raw string.
	 * @returns HTML-escaped string.
	 * @private
	 */
	private escapeHtml(value: string): string {
		return value
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");
	}

	/**
	 * Called when engine state changes (after cell input or move).
	 * Updates status display, clue highlighting, and current clue display.
	 *
	 * @private
	 */
	private onEngineChange(): void {
		this.updateStatus();
		this.updateClueHighlights();
		this.updateCurrentClues();
	}

	/**
	 * Updates clue highlighting based on active cell word(s).
	 * Highlights across and down clues with primary/secondary styling.
	 * Respects silent mode to avoid spoiling part hints.
	 *
	 * @private
	 */
	private updateClueHighlights(): void {
		if (!this.engine || !this.cluesElement) return;
		const silent = this.engine.isSilent();

		const items = this.cluesElement.querySelectorAll<HTMLElement>(
			".tp-crossword-clue-item",
		);
		for (const item of items) {
			item.classList.remove("active-primary", "active-secondary");
			const label = item.querySelector<HTMLElement>(".tp-crossword-clue-label");
			label?.classList.remove("active-primary", "active-secondary");
			const parts = item.querySelectorAll<HTMLElement>(
				".tp-crossword-clue-part",
			);
			for (const part of parts) {
				part.classList.remove("active-primary", "active-secondary");
			}
		}

		const active = this.engine.getActiveClues();
		if (!active) {
			return;
		}

		const acrossItem = active.across
			? this.cluesElement.querySelector<HTMLElement>(
					`.tp-crossword-clue-item[data-direction="across"][data-clue-key="${active.across.key}"]`,
				)
			: null;
		const downItem = active.down
			? this.cluesElement.querySelector<HTMLElement>(
					`.tp-crossword-clue-item[data-direction="down"][data-clue-key="${active.down.key}"]`,
				)
			: null;

		if (active.primary === "across") {
			if (active.across) {
				this.setClueHighlight(
					acrossItem,
					active.across.partIndex,
					"active-primary",
					silent,
				);
			}
			if (active.down) {
				this.setClueHighlight(
					downItem,
					active.down.partIndex,
					"active-secondary",
					silent,
				);
			}
		} else {
			if (active.down) {
				this.setClueHighlight(
					downItem,
					active.down.partIndex,
					"active-primary",
					silent,
				);
			}
			if (active.across) {
				this.setClueHighlight(
					acrossItem,
					active.across.partIndex,
					"active-secondary",
					silent,
				);
			}
		}
	}

	/**
	 * Applies highlight class to a clue item and its parts.
	 * Highlights specific part based on partIndex, or all parts if highlightAllParts.
	 *
	 * @param item - Clue item element.
	 * @param partIndex - Index of part to highlight (0-based).
	 * @param className - CSS class to apply ('active-primary' or 'active-secondary').
	 * @param highlightAllParts - If true, highlight all parts (for silent mode).
	 * @private
	 */
	private setClueHighlight(
		item: HTMLElement | null,
		partIndex: number,
		className: "active-primary" | "active-secondary",
		highlightAllParts = false,
	): void {
		if (!item) return;

		item.classList.add(className);
		const label = item.querySelector<HTMLElement>(".tp-crossword-clue-label");
		label?.classList.add(className);

		const parts = item.querySelectorAll<HTMLElement>(".tp-crossword-clue-part");
		if (parts.length === 0) {
			return;
		}

		if (highlightAllParts) {
			for (const part of parts) {
				part.classList.add(className);
			}
			return;
		}

		const safeIndex = Math.min(Math.max(partIndex, 0), parts.length - 1);
		parts[safeIndex]?.classList.add(className);
	}

	/**
	 * Updates the current clues display for active cell's across and down words.
	 * Shows clue label and currently focused part text.
	 *
	 * @private
	 */
	private updateCurrentClues(): void {
		if (!this.engine || !this.currentCluesElement || !this.cluesElement) return;
		const silent = this.engine.isSilent();

		const active = this.engine.getActiveClues();
		if (!active) {
			this.currentCluesElement.innerHTML = "";
			return;
		}

		const primaryDirection = active.primary;
		const secondaryDirection = active.secondary;
		const primary = primaryDirection === "across" ? active.across : active.down;
		const secondary =
			secondaryDirection === "across" ? active.across : active.down;

		const clueTexts: string[] = [];

		if (primary) {
			const primaryText = this.getCurrentClueText(
				primaryDirection,
				primary.key,
				primary.partIndex,
				silent,
			);
			if (primaryText) {
				clueTexts.push(
					`<div class="tp-crossword-current-clue primary">${this.escapeHtml(primaryText)}</div>`,
				);
			}
		}

		if (secondary) {
			const secondaryText = this.getCurrentClueText(
				secondaryDirection,
				secondary.key,
				secondary.partIndex,
				silent,
			);
			if (secondaryText) {
				clueTexts.push(
					`<div class="tp-crossword-current-clue secondary">${this.escapeHtml(secondaryText)}</div>`,
				);
			}
		}

		this.currentCluesElement.innerHTML = clueTexts.join("");
	}

	/**
	 * Extracts current clue text for given direction and part index.
	 * In silent mode, shows all parts. Otherwise shows only focused part.
	 *
	 * @param direction - Clue direction ('across' or 'down').
	 * @param key - Clue label key.
	 * @param partIndex - Part index to display.
	 * @param silent - If true, show all parts.
	 * @returns Formatted clue text with label.
	 * @private
	 */
	private getCurrentClueText(
		direction: "across" | "down",
		key: string,
		partIndex: number,
		silent = false,
	): string {
		if (!this.cluesElement) return "";

		const item = this.cluesElement.querySelector<HTMLElement>(
			`.tp-crossword-clue-item[data-direction="${direction}"][data-clue-key="${key}"]`,
		);
		if (!item) {
			return "";
		}

		const label =
			item
				.querySelector<HTMLElement>(".tp-crossword-clue-label")
				?.textContent?.trim() ?? `${key}.`;
		if (silent) {
			const text =
				item
					.querySelector<HTMLElement>(".tp-crossword-clue-text")
					?.textContent?.trim() ?? "";
			return `${label} ${text}`.trim();
		}

		const parts = Array.from(
			item.querySelectorAll<HTMLElement>(".tp-crossword-clue-part"),
		);
		if (parts.length === 0) {
			return "";
		}

		// Clamp partIndex to available parts (0 to parts.length-1)
		const safeIndex = Math.min(Math.max(partIndex, 0), parts.length - 1);
		const selectedText = parts[safeIndex]?.textContent ?? "";
		return `${label} ${selectedText}`.trim();
	}

	/**
	 * Updates the game status display.
	 * Shows completion message or empty cell count.
	 * Updates undo/redo button states.
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

		this.undoButton.disabled = !this.engine.canUndo();
		this.redoButton.disabled = !this.engine.canRedo();

		this.statusElement.className = "tp-crossword-status";

		if (validation.isComplete) {
			this.statusElement.textContent = "✓ Solved!";
			this.statusElement.classList.add("success");
		} else {
			const emptyCount = this.engine.countEmptyCells();
			this.statusElement.textContent = `${emptyCount} empty cell${emptyCount !== 1 ? "s" : ""}`;
			this.statusElement.classList.add("info");
		}
	}

	/**
	 * Renders an error message when puzzle initialization fails.
	 *
	 * @param message - Error description to display.
	 * @private
	 */
	private renderError(message: string): void {
		this.innerHTML = `<div class="tp-crossword-error">Error: ${message}</div>`;
	}
}

/**
 * Registers `<tp-crossword>` custom element once.
 */
if (!customElements.get("tp-crossword")) {
	customElements.define("tp-crossword", TpCrossword);
}
