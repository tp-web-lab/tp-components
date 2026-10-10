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
import { TpBase } from "../base/base.js";
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
export declare class TpCrossword extends TpBase {
    /**
     * Global stylesheet identifier injected once per document.
     */
    private static readonly styleId;
    /**
     * Core puzzle engine managing game logic and word tracking.
     * @private
     */
    private engine;
    /**
     * Container element for the interactive crossword grid.
     * @private
     */
    private gridElement;
    /**
     * Element displaying currently focused across and down clues.
     * @private
     */
    private currentCluesElement;
    /**
     * Container element for all across and down clue lists.
     * @private
     */
    private cluesElement;
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
     * Currently focused cell position (for assist operations).
     * @private
     */
    private focusedCell;
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
    protected connectedCallback(): void;
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
    private parsePuzzleFromDL;
    /**
     * Renders the complete component UI including grid, clue lists, and controls.
     * Generates HTML markup with embedded CSS and initializes all DOM element references.
     * Renders grid and clues, attaches event listeners, and updates status display.
     *
     * @private
     */
    private render;
    /**
     * Attaches event listeners to interactive elements.
     * Sets up undo/redo buttons, assists menu, and cell focus tracking.
     * Handles word navigation via clue highlighting.
     *
     * @private
     */
    private attachEventListeners;
    /**
     * Renders both across and down clue lists from engine clue data.
     * Parses clue labels and text, creates separate HTML elements for each.
     *
     * @private
     */
    private renderClues;
    /**
     * Renders HTML for clue list items with label and text parts.
     * Segments clue text into parts for fine-grained highlighting.
     *
     * @param clues - Array of clue strings with labels.
     * @param direction - Clue direction: 'across' or 'down'.
     * @returns HTML string with rendered clue list items.
     * @private
     */
    private renderClueItems;
    /**
     * Splits a clue string into label (e.g., "A.") and text parts.
     *
     * @param clue - Full clue string.
     * @returns Object with label and text properties.
     * @private
     */
    private splitClueLabel;
    /**
     * Normalizes a clue label by removing trailing period and uppercasing.
     *
     * @param label - Label string (e.g., "A.").
     * @returns Normalized label (e.g., "A").
     * @private
     */
    private normalizeClueKey;
    /**
     * Splits clue text into individual segments separated by periods.
     * Handles Unicode uppercase letters for international characters.
     *
     * @param text - Clue text to split.
     * @returns Array of text parts.
     * @private
     */
    private splitClueParts;
    /**
     * Escapes HTML special characters to prevent XSS.
     *
     * @param value - Raw string.
     * @returns HTML-escaped string.
     * @private
     */
    private escapeHtml;
    /**
     * Called when engine state changes (after cell input or move).
     * Updates status display, clue highlighting, and current clue display.
     *
     * @private
     */
    private onEngineChange;
    /**
     * Updates clue highlighting based on active cell word(s).
     * Highlights across and down clues with primary/secondary styling.
     * Respects silent mode to avoid spoiling part hints.
     *
     * @private
     */
    private updateClueHighlights;
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
    private setClueHighlight;
    /**
     * Updates the current clues display for active cell's across and down words.
     * Shows clue label and currently focused part text.
     *
     * @private
     */
    private updateCurrentClues;
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
    private getCurrentClueText;
    /**
     * Updates the game status display.
     * Shows completion message or empty cell count.
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
