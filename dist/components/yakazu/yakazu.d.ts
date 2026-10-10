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
import { TpBase } from "../base/base.js";
/**
 * Web component for interactive Yakazu puzzles.
 * Uses lightDOM to maintain consistent styling with page content.
 *
 * @element tp-yakazu
 * @tagname tp-yakazu
 * @example
 * <tp-yakazu></tp-yakazu>
 */
export declare class TpYakazu extends TpBase {
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
     * Container element for the interactive game grid.
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
     * Puzzle data is loaded from data-yakazu-puzzle attribute or parsed from light DOM.
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
