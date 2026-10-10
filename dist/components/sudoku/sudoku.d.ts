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
import { TpBase } from "../base/base.js";
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
export declare class TpSudoku extends TpBase {
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
     * Container element for the interactive 9x9 game grid.
     * @private
     */
    private gridElement;
    /**
     * Element displaying game status and progress information.
     * @private
     */
    private statusElement;
    /**
     * Button for toggling between game and note entry modes.
     * @private
     */
    private modeButton;
    /**
     * Button for undoing the last move.
     * @private
     */
    private undoButton;
    /**
     * Button for redoing the last undone move.
     * @private
     */
    private redoButton;
    /**
     * Dropdown menu for game assistance options.
     * @private
     */
    private assistSelect;
    /**
     * Currently focused cell position (for assist operations).
     * @private
     */
    private focusedCell;
    /**
     * Lifecycle hook: invoked when element is inserted into DOM.
     * Initializes the puzzle engine and renders the UI.
     * Puzzle data is loaded from the puzzle attribute or parsed from light DOM.
     * The legacy data-sudoku-puzzle attribute remains supported for backward compatibility.
     *
     * @summary Connects the Sudoku puzzle to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Parses puzzle definition from light DOM list structure.
     * Extracts row content from <ol> or <ul> and <li> elements.
     *
     * @returns Puzzle string with rows joined by newlines, or undefined if no list found.
     * @private
     */
    private parsePuzzleFromLists;
    /**
     * Renders the complete component UI including grid, controls, and status display.
     * Generates HTML markup and initializes all DOM element references.
     * Attaches event listeners and performs initial grid rendering.
     *
     * @private
     */
    private render;
    /**
     * Attaches event listeners to interactive elements.
     * Handles mode button, undo/redo, assists menu, and cell focus tracking.
     *
     * @private
     */
    private attachEventListeners;
    /**
     * Updates the UI with current game status.
     * Refreshes undo/redo button states, mode button label, and progress display.
     * Shows either empty cell count or incorrect cells if visible.
     *
     * @private
     */
    private updateStatus;
    /**
     * Renders an error message when puzzle initialization fails.
     * Replaces entire component content with error display.
     *
     * @param message - Error description to display.
     * @private
     */
    private renderError;
}
