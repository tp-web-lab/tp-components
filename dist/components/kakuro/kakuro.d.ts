/** @module components/kakuro
 * @summary Interactive cross-sum puzzle with notes, history and assistance.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
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
import { TpBase } from "../base/base.js";
import "../button/button.js";
/**
 * The custom `<tp-kakuro>` element displays an interactive Kakuro puzzle.
 *
 * @summary Displays an interactive Kakuro puzzle.
 * @tagname tp-kakuro
 * @attr {string} puzzle = "" - Whitespace-separated cells in newline-separated rows: #, ., fixed digits or down/across clues. Overrides the initial list.
 * @event tp-kakuro-change Emitted after a move, assistance action, reset or history change.
 * @eventdetail tp-kakuro-change { values: number[][], complete: boolean }
 * @event tp-kakuro-complete Emitted when the player reaches a valid completed grid.
 * @eventdetail tp-kakuro-complete { values: number[][], complete: boolean }
 * @keyboard {Arrow keys} Moves to the next white cell in the chosen direction.
 * @keyboard {1–9} Enters a digit or toggles a pencil mark in Note mode.
 * @keyboard {Backspace / Delete / 0} Clears the selected editable cell.
 * @keyboard {Ctrl+Z / Ctrl+Y} Undoes or redoes a move; Command is also accepted.
 * @accessibility Cell labels include coordinates and across/down sums; status updates use a live region.
 * @cssprop [--tp-kakuro-cell-size=4rem] Maximum width of each square.
 * @tp-dependency tp-base - Shared component behavior.
 * @tp-dependency tp-button - Game action buttons.
 * @see tp-sudoku - Another numeric grid puzzle with pencil marks.
 * @see tp-crossword - A word-based across and down puzzle.
 * @example
 * <tp-kakuro>
 *   <ol>
 *     <li><code># 23/0 30/0 # # 27/0 12/0 16/0</code></li>
 *     <li><code>0/16 . . # 17/24 . . .</code></li>
 *     <li><code>0/17 . . 15/29 . . . .</code></li>
 *     <li><code>0/35 . . . . . 12/0 #</code></li>
 *     <li><code># 0/7 . . 7/8 . . 7/0</code></li>
 *     <li><code># 11/0 10/16 . . . . .</code></li>
 *     <li><code>0/21 . . . . 0/5 . .</code></li>
 *     <li><code>0/6 . . . # 0/3 . .</code></li>
 *   </ol>
 * </tp-kakuro>
 */
export declare class TpKakuro extends TpBase {
    static get observedAttributes(): string[];
    private grid;
    private values;
    private notes;
    private initialSource;
    private undoStack;
    private redoStack;
    private noteMode;
    private showingErrors;
    private selected;
    private completed;
    private inputs;
    private status;
    private buttons;
    /** Puzzle source; assigning it starts a new game. */
    get puzzle(): string;
    set puzzle(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    private initialize;
    private render;
    private updateSelection;
    private snapshot;
    private change;
    private enter;
    private history;
    private assist;
    private keydown;
    private update;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-kakuro": TpKakuro;
    }
}
