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
import { TpBase } from "../base/base.js";
/**
 * Web component for interactive Binary puzzles.
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
 * <tp-binary></tp-binary>
 */
export declare class TpBinary extends TpBase {
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
    protected connectedCallback(): void;
    /**
     * Parses puzzle definition from light DOM list structure.
     * Looks for <ol> or <ul> elements and extracts row content from <li> items.
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
     * Sets up undo/redo button handlers and assists menu actions.
     * Prevents default mousedown behavior to keep focus on grid.
     *
     * @private
     */
    private attachEventListeners;
    /**
     * Updates the UI with current game status.
     * Refreshes undo/redo button states and displays progress/completion message.
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
