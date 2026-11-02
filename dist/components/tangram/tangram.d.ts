/** @module components/tangram */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../button-group/button-group.js";
import "../dropdown/dropdown.js";
import { type Placement } from "./geometry.js";
export type { Placement as TangramPlacement } from "./geometry.js";
/**
 * @summary Seven-piece tangram with a life-size silhouette and collision-safe placement.
 * @tagname tp-tangram
 * @attr {string} src = "" - Text or JSON file containing the seven solution placements.
 * @attr {boolean} exact-orientation = false - Starts every piece in its solution orientation, including reflection; changing it restarts the puzzle.

 * @event tp-tangram-error Fired when loading a solution fails; detail contains message.
 * @keyboard Arrow keys Move the selected piece; Shift increases the step.
 * @keyboard R / Shift+R Rotate clockwise / counterclockwise by 45 degrees.
 * @keyboard Escape Cancel a drag and close the selected piece controls.
 * @keyboard F Flip the selected parallelogram.
 * @keyboard Ctrl+Z / Ctrl+Shift+Z Undo / redo (Command also supported).
 * @example
 * <tp-tangram></tp-tangram>
 * @event tp-tangram-change Emitted after an accepted piece edit; placements contains each piece ID, x/y position, angle and flip state, and solved reports whether the target is matched.
 * @eventdetail tp-tangram-change { placements: Placement[]; solved: boolean }
 * @accessibility Names the puzzle board and exposes playing pieces as labelled focusable SVG buttons; keyboard commands support moving, rotating, flipping, undoing and redoing placements.
 * @accessibility Groups and labels toolbar and selected-piece controls, announces game status politely, and removes playing pieces from keyboard navigation during solution preview.
 * @accessibilityresponsibility Provide a text description of the target and a suitable alternative activity when spatial visual manipulation is not usable; piece colors alone must not carry essential instructions.
 */
export declare class TpTangram extends TpBase {
    private source;
    private target;
    private state;
    private history;
    private cursor;
    private selected;
    private hasSelection;
    private selectionToolsDismissed;
    private resizeObserver?;
    private showing;
    private showingIncorrect;
    private revealedPiece;
    private readonly assistId;
    private extent;
    private viewExtent;
    private token;
    private abort?;
    private ui?;
    private drag?;
    static get observedAttributes(): string[];
    /** Whether initial orientations match the solution. Changing this restarts the game. */
    get exactOrientation(): boolean;
    set exactOrientation(value: boolean);
    /** External solution URL. */
    get src(): string;
    set src(value: string);
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    private reload;
    /** Loads a validated solution; centers it and starts a fresh game. */
    setSolution(solution: string | Placement[]): void;
    /** Current placements, returned as independent objects. */
    get placements(): Placement[];
    get isSolved(): boolean;
    get canUndo(): boolean;
    get canRedo(): boolean;
    /** Restores the seven pieces around the target silhouette. */
    reset(): void;
    /** Attempts an absolute placement. Rejected placements leave history unchanged. */
    place(id: string, x: number, y: number, angle?: number, flipped?: boolean): boolean;
    /**
     * @summary Restores the previous piece arrangement from undo history; does nothing when history is empty.
     */
    undo(): void;
    /**
     * @summary Restores the next undone piece arrangement; does nothing when redo history is empty.
     */
    redo(): void;
    /** Shows an isolated solution preview; hiding it restores the unchanged playing pieces. */
    showSolution(show?: boolean): void;
    /** Highlights pieces that are not entirely inside the target silhouette. */
    showIncorrectPieces(show?: boolean): void;
    /** Returns incorrect pieces outside the silhouette in one undoable operation. */
    clearIncorrectPieces(): void;
    /** Reveals the selected piece in the supplied dissection without moving it. */
    showPiece(): void;
    /** Toggles the browser fullscreen view. */
    fullscreen(): Promise<void>;
    private changed;
    private status;
    private updateButtons;
    private dismissOutsideSelection;
    private dismissSelectionTools;
    private positionSelectionTools;
    private iconButton;
    private render;
    private points;
    private handleClick;
    private key;
    private position;
    private down;
    private candidate;
    private move;
    private up;
    private cancel;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-tangram": TpTangram;
    }
}
