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
import { TpBase } from "../base/base.js";
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
export declare class TpCryptarithm extends TpBase {
    /**
     * Global stylesheet identifier injected once per document.
     */
    private static readonly styleId;
    /**
     * Core puzzle engine managing game logic and validation.
     * @private
     */
    private engine;
    /**
     * Container element for the interactive puzzle board.
     * @private
     */
    private boardElement;
    /**
     * Element displaying game status, validation errors, and progress.
     * @private
     */
    private statusElement;
    /**
     * Button for undoing the last assignment.
     * @private
     */
    private undoButton;
    /**
     * Button for redoing the last undone assignment.
     * @private
     */
    private redoButton;
    /**
     * Dropdown menu for game assistance options.
     * @private
     */
    private assistSelect;
    /**
     * Lifecycle hook: invoked when element is inserted into DOM.
     * Reads puzzle definition and initializes the engine and UI.
     * If puzzle loading fails, renders an error message.
     *
     * @summary Connects the cryptarithm puzzle to the document.
     * @internal
     */
    protected connectedCallback(): void;
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
    private readPuzzleDefinition;
    /**
     * Renders the component UI using pre-built shell markup and CSS.
     * Initializes all DOM element references and attaches event listeners.
     *
     * @private
     */
    private render;
    /**
     * Attaches event listeners to interactive elements.
     * Handles undo/redo buttons, assists menu selection, and game logic.
     *
     * @private
     */
    private attachEventListeners;
    /**
     * Updates the game status display.
     * Shows completion message or constraint violation messages (duplicate digits, leading zeros, etc.).
     * Displays current empty letter count.
     * Updates undo/redo button states.
     *
     * @private
     */
    private updateStatus;
    /**
     * Renders an error message when puzzle initialization fails.
     *
     * @param message - Error description to display.
     * @private
     */
    private renderError;
}
