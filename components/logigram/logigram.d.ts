/** @module components/logigram */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../checkbox-list/checkbox-list.js";
import { type LogigramMark, LogigramModel } from "./logigram-model.js";
/**
 * @summary Solves logic-grid puzzles by matching items across categories using written clues.
 * @tagname tp-logigram
 * @attr {string} label = "Logigram" - Puzzle title.
 * @attr {string} src = "" - Markdown file containing Prompt, Categories, Clues and Solution definitions.
 * @attr {boolean} auto-exclude = false - Marks other cells in the same pair row and column as no after a yes.
 * @attr {boolean} disabled = false - Prevents playing and using game controls.
 * @event tp-logigram-change Emitted after a move, undo, redo or reset.
 * @eventdetail tp-logigram-change { value: number[] }
 * @event tp-logigram-check Emitted after checking the grid.
 * @eventdetail tp-logigram-check { correct: number; total: number; errors: number[]; complete: boolean }
 * @keyboard {Enter / Space} Cycles the focused cell through unknown, no and yes, or activates a control.
 * @keyboard {Arrow keys} Moves between cells in the same category pair.
 * @keyboard {Delete / Backspace} Clears the focused cell.
 * @example
 * <tp-logigram label="The reading club">
 *   <dl>
 *     <dt>Prompt</dt>
 *     <dd><p>Three readers chose different books and drinks. Find every match.</p></dd>
 *     <dt>Categories</dt>
 *     <dd>
 *   <ul>
 *     <li>Readers<ul><li>Ada</li><li>Ben</li><li>Cleo</li></ul></li>
 *     <li>Books<ul><li>Poetry</li><li>History</li><li>Science</li></ul></li>
 *     <li>Drinks<ul><li>Tea</li><li>Juice</li><li>Water</li></ul></li>
 *   </ul>
 *   </dd>
 *     <dt>Clues</dt>
 *     <dd>
 *   <ol>
 *     <li>Ada chose Poetry.</li>
 *     <li>The History reader drank Juice.</li>
 *     <li>Ben drank Water.</li>
 *     <li>Cleo did not choose Poetry.</li>
 *   </ol>
 *   </dd>
 *     <dt>Solution</dt>
 *     <dd>
 *   <ol>
 *     <li><ul><li>Ada</li><li>Poetry</li><li>Tea</li></ul></li>
 *     <li><ul><li>Ben</li><li>Science</li><li>Water</li></ul></li>
 *     <li><ul><li>Cleo</li><li>History</li><li>Juice</li></ul></li>
 *   </ol>
 * </dd>
 *   </dl>
 * </tp-logigram>
 */
export declare class TpLogigram extends TpBase {
    private model;
    private original;
    private revision;
    private request;
    private timer;
    private observer;
    private cells;
    private status;
    private checked;
    private selectedCell;
    private selectedButton;
    private assistSelect;
    private selectionHint;
    static get observedAttributes(): string[];
    /** Puzzle title. @attr label */
    get label(): string;
    set label(v: string);
    /** Markdown definition URL. @attr src */
    get src(): string;
    set src(v: string);
    /** Exclude competing matches after a yes. @attr auto-exclude */
    get autoExclude(): boolean;
    set autoExclude(v: boolean);
    /** Disable all game interactions. @attr disabled */
    get disabled(): boolean;
    set disabled(v: boolean);
    /** A copy of the pair-grid marks: 0 unknown, -1 no, 1 yes. */
    get value(): LogigramMark[];
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    private schedule;
    private load;
    private move;
    private changed;
    /** Clears the grid; the reset can be undone. */
    reset(): void;
    /** Restores the preceding move, including automatic exclusions. */
    undo(): void;
    /** Reapplies an undone move. */
    redo(): void;
    /** Checks all marked cells and counts correct matches. Unknown negatives need not be filled. */
    check(): ReturnType<LogigramModel["check"]> | null;
    private render;
    private createCell;
    private updateAssistance;
    private update;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-logigram": TpLogigram;
    }
}
