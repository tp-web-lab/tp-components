/**
 * @module components/cryptarithm
 * @summary Cryptarithmetic puzzle web component.
 *
 * Provides interactive Cryptarithmetic puzzle solving via the `<tp-cryptarithm>` custom element.
 * Each letter maps to a unique digit (0-9), and the arithmetic equation must be satisfied.
 *
 * Features:
 * - Interactive digit assignment for letters
 * - Equation validation with constraint checking
 * - Detection of duplicate digits and leading zeros
 * - Undo/redo functionality
 * - Assistance options (show incorrect, show letter, show solution)
 * - Real-time validation feedback
 *
 * Puzzle data is loaded from attributes or HTML definition list structure.
 *
 * @example
 * // From attributes
 * <tp-cryptarithm
 *   equation="SEND + MORE = MONEY"
 *   solution="9567 + 1085 = 10652">
 * </tp-cryptarithm>
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

import {
	CRYPTARITHM_CSS,
	CRYPTARITHM_STYLE_ID,
	CryptarithmEngine,
	createCryptarithmShellMarkup,
} from "@tp/tp-utilities/games/cryptarithm";
import { TpBase } from "../base/base.js";
import style from "./cryptarithm.css?inline";

/**
 * Web component for interactive Cryptarithmetic puzzles.
 *
 * In cryptarithmetic, letters represent digits and must satisfy the displayed equation.
 * The puzzle is solved by finding the correct digit-to-letter mapping.
 *
 * @summary Displays an interactive cryptarithm puzzle.
 * @tagname tp-cryptarithm
 *
 * @attr {string} equation = "" - Equation to solve.
 * @attr {string} solution = "" - Numeric solution matching the equation.
 * @accessibility Uses native inputs, buttons and a select for every puzzle action; clicking a letter only moves focus to its corresponding input.
 * @accessibilityresponsibility Provide an equation whose letter and digit relationships remain understandable without relying on color alone.
 * @keyboard {Tab / Shift+Tab} Moves among assignments, assistance options, undo and redo controls.
 * @keyboard {Number keys} Enters a digit in the focused letter assignment.
 *
 * @example
 * <tp-cryptarithm equation="SEND + MORE = MONEY" solution="9567 + 1085 = 10652"></tp-cryptarithm>
 */
export class TpCryptarithm extends TpBase {
	/**
	 * Global stylesheet identifier injected once per document.
	 */
	private static readonly styleId = CRYPTARITHM_STYLE_ID;
	/**
	 * Core puzzle engine managing game logic and validation.
	 * @private
	 */
	private engine: CryptarithmEngine | null = null;

	/**
	 * Container element for the interactive puzzle board.
	 * @private
	 */
	private boardElement: HTMLElement | null = null;

	/**
	 * Element displaying game status, validation errors, and progress.
	 * @private
	 */
	private statusElement: HTMLElement | null = null;

	/**
	 * Button for undoing the last assignment.
	 * @private
	 */
	private undoButton: HTMLButtonElement | null = null;

	/**
	 * Button for redoing the last undone assignment.
	 * @private
	 */
	private redoButton: HTMLButtonElement | null = null;

	/**
	 * Dropdown menu for game assistance options.
	 * @private
	 */
	private assistSelect: HTMLSelectElement | null = null;

	/**
	 * Lifecycle hook: invoked when element is inserted into DOM.
	 * Reads puzzle definition and initializes the engine and UI.
	 * If puzzle loading fails, renders an error message.
	 *
	 * @summary Connects the cryptarithm puzzle to the document.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpCryptarithm.styleId, CRYPTARITHM_CSS);
		this.ensureGlobalStyle(`${TpCryptarithm.styleId}-component`, style);
		this.classList.add("tp-cryptarithm");

		const attrs = this.readPuzzleDefinition();
		if (!attrs) {
			this.renderError("Empty cryptarithm puzzle");
			return;
		}

		const distinctLetters = new Set(
			attrs.equation.toUpperCase().match(/[A-Z]/g) ?? [],
		);
		if (distinctLetters.size > 10) {
			this.renderError(
				"Cryptarithm puzzles can use at most 10 distinct letters",
			);
			return;
		}

		try {
			this.engine = new CryptarithmEngine({
				onChange: () => this.updateStatus(),
			});
			this.engine.initialize(attrs.equation, attrs.solution);
			this.render();
		} catch (error) {
			this.renderError(error instanceof Error ? error.message : String(error));
		}
	}

	/**
	 * Reads puzzle definition from attributes or definition list structure.
	 * The legacy data-cryptarithm-equation and data-cryptarithm-solution
	 * attributes remain supported for backward compatibility.
	 *
	 * Expected definition list format:
	 * ```html
	 * <dl>
	 *   <dt>equation</dt>
	 *   <dd>SEND + MORE = MONEY</dd>
	 *   <dt>solution</dt>
	 *   <dd>S:9 E:5 N:6 D:7 M:1 O:0 R:8 Y:2</dd>
	 * </dl>
	 * ```
	 *
	 * @returns Object with equation and solution strings, or null if not found.
	 * @private
	 */
	private readPuzzleDefinition(): {
		equation: string;
		solution: string;
	} | null {
		const equationAttribute =
			this.getAttribute("equation")?.trim() ||
			this.dataset.cryptarithmEquation?.trim() ||
			"";
		const solutionAttribute =
			this.getAttribute("solution")?.trim() ||
			this.dataset.cryptarithmSolution?.trim() ||
			"";
		if (equationAttribute !== "" && solutionAttribute !== "") {
			return {
				equation: equationAttribute,
				solution: solutionAttribute,
			};
		}

		const dl = this.querySelector("dl");
		if (!dl) {
			return null;
		}

		let equation = "";
		let solution = "";
		let currentSection = "";

		for (const child of dl.children) {
			if (child.tagName === "DT") {
				currentSection = child.textContent?.trim().toLowerCase() ?? "";
			} else if (child.tagName === "DD") {
				const value = child.textContent?.trim() ?? "";
				if (currentSection === "equation") {
					equation = value;
				} else if (currentSection === "solution") {
					solution = value;
				}
			}
		}

		if (equation === "" || solution === "") {
			return null;
		}

		return { equation, solution };
	}

	/**
	 * Renders the component UI using pre-built shell markup and CSS.
	 * Initializes all DOM element references and attaches event listeners.
	 *
	 * @private
	 */
	private render(): void {
		this.innerHTML = `
      ${createCryptarithmShellMarkup()}
    `;

		this.boardElement = this.querySelector(".tp-cryptarithm-board");
		this.statusElement = this.querySelector(".tp-cryptarithm-status");
		this.undoButton = this.querySelector(
			".tp-cryptarithm-undo",
		) as HTMLButtonElement;
		this.redoButton = this.querySelector(
			".tp-cryptarithm-redo",
		) as HTMLButtonElement;
		this.assistSelect = this.querySelector(
			".tp-cryptarithm-assist",
		) as HTMLSelectElement;
		this.assistSelect?.setAttribute("aria-label", "Assistance actions");

		if (!this.engine || !this.boardElement) {
			return;
		}

		this.engine.renderBoard(this.boardElement);
		this.attachEventListeners();
		this.updateStatus();
	}

	/**
	 * Attaches event listeners to interactive elements.
	 * Handles undo/redo buttons, assists menu selection, and game logic.
	 *
	 * @private
	 */
	private attachEventListeners(): void {
		if (
			!this.engine ||
			!this.boardElement ||
			!this.undoButton ||
			!this.redoButton ||
			!this.assistSelect
		) {
			return;
		}

		this.boardElement.addEventListener("click", (event) => {
			const target = event.target;
			if (!(target instanceof Element)) {
				return;
			}

			const cell = target.closest(".tp-cryptarithm-char");
			const letter =
				cell
					?.querySelector(".tp-cryptarithm-char-symbol")
					?.textContent?.trim() ?? "";
			if (letter !== "") {
				this.engine?.setActiveLetter(letter, true);
				this.boardElement
					?.querySelector<HTMLInputElement>(
						`.tp-cryptarithm-assignment-input[data-letter="${letter}"]`,
					)
					?.focus();
			}
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
			if (!this.engine || !this.assistSelect) {
				return;
			}

			switch (this.assistSelect.value) {
				case "reset-game":
					this.engine.resetGame();
					break;
				case "show-incorrect":
					this.engine.showIncorrectAssignments();
					break;
				case "clear-incorrect":
					this.engine.clearIncorrectAssignments();
					break;
				case "show-letter":
					this.engine.showLetter();
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
			button.addEventListener("mousedown", (event) => {
				event.preventDefault();
			});
		}
	}

	/**
	 * Updates the game status display.
	 * Shows completion message or constraint violation messages (duplicate digits, leading zeros, etc.).
	 * Displays current empty letter count.
	 * Updates undo/redo button states.
	 *
	 * @private
	 */
	private updateStatus(): void {
		if (
			!this.engine ||
			!this.statusElement ||
			!this.undoButton ||
			!this.redoButton
		) {
			return;
		}

		const validation = this.engine.getValidation();
		this.undoButton.disabled = !this.engine.canUndo();
		this.redoButton.disabled = !this.engine.canRedo();
		this.statusElement.className = "tp-cryptarithm-status";

		if (validation.isSolved) {
			this.statusElement.textContent = "✓ Solved!";
			this.statusElement.classList.add("success");
			return;
		}

		const messages: string[] = [];
		const emptyCount = this.engine.countEmptyLetters();
		const incorrectCount = this.engine.countIncorrectLetters();

		if (this.engine.isShowingIncorrectAssignments() && incorrectCount > 0) {
			messages.push(
				`${incorrectCount} incorrect letter${incorrectCount !== 1 ? "s" : ""} shown`,
			);
		} else {
			messages.push(`${emptyCount} empty letter${emptyCount !== 1 ? "s" : ""}`);
		}

		if (validation.hasDuplicateDigits) {
			messages.push("duplicate digits");
		}
		if (validation.hasLeadingZero) {
			messages.push("leading digit cannot be 0");
		}
		if (validation.isComplete && !validation.equationMatches) {
			messages.push("equation mismatch");
		}

		this.statusElement.textContent = messages.join(" · ");
		this.statusElement.classList.add("info");
	}

	/**
	 * Renders an error message when puzzle initialization fails.
	 *
	 * @param message - Error description to display.
	 * @private
	 */
	private renderError(message: string): void {
		this.innerHTML = `<div class="tp-cryptarithm-error">Error: ${message}</div>`;
	}
}

if (!customElements.get("tp-cryptarithm")) {
	customElements.define("tp-cryptarithm", TpCryptarithm);
}
