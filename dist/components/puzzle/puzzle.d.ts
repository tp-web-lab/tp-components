/** @module components/puzzle
 * @summary Image puzzle with draggable square, interlocking, triangular or hexagonal pieces.
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
import { type PuzzlePlacement, type PuzzleShape } from "./geometry.js";
export type { PuzzlePlacement, PuzzleShape } from "./geometry.js";
/**
 * The custom `<tp-puzzle>` element provides an image puzzle with movable and rotatable pieces.
 *
 * @summary Provides an image puzzle with movable and rotatable pieces.
 * @tagname tp-puzzle
 * @attr {string} src = "" - Image URL (SVG, PNG, WebP or JPEG); overrides an initial img child. Changing it starts a new game.
 * @attr {number} pieces = 16 - Exact number of pieces, from 1 to 144. A factor grid is chosen to approximate the image aspect ratio.
 * @attr {"square" | "puzzle" | "triangle" | "hexagon"} shape = "puzzle" - Square, interlocking, equilateral triangle or regular hexagon pieces.
 * @attr {string} alt = "" - Description of the image; falls back to the initial img alternative text.
 * @attr {boolean} exact-orientation = false - Starts every piece upright instead of randomly rotated; changing it restarts the game.
 * @event tp-puzzle-load Emitted when the image is loaded and the pieces are ready.
 * @eventdetail tp-puzzle-load { pieces: number; rows: number; columns: number }
 * @event tp-puzzle-change Emitted after a placement, rotation, undo, redo or shuffle; placements are independent copies.
 * @eventdetail tp-puzzle-change { placements: PuzzlePlacement[]; solved: boolean }
 * @event tp-puzzle-complete Emitted when a move first completes the current arrangement.
 * @eventdetail tp-puzzle-complete { placements: PuzzlePlacement[]; solved: boolean }
 * @event tp-puzzle-error Emitted when the configuration or image cannot be loaded.
 * @eventdetail tp-puzzle-error { message: string }
 * @keyboard Arrow keys Move the selected piece; Shift increases the step.
 * @keyboard R / Shift+R Rotate the selected piece by ±90° for square/puzzle or ±60° for triangle/hexagon.
 * @keyboard ContextMenu / Shift+F10 Open the selected piece rotation menu.
 * @keyboard Escape Cancel a drag or close the rotation menu.
 * @keyboard Ctrl+Z / Ctrl+Shift+Z Undo / redo; Command is also supported.
 * @accessibility Pieces are labelled focusable SVG buttons. Keyboard movement and rotation are alternatives to dragging; progress is announced politely.
 * @accessibilityresponsibility Describe the source image with alt and offer an alternative activity when a visual spatial puzzle is not usable.
 * @see tp-tangram - Assemble a silhouette from seven geometric pieces.
 * @example
 * <tp-puzzle src="/docs/components/puzzle/examples/landscape.svg" pieces="12" alt="Mountain lake at sunrise"></tp-puzzle>
 */
export declare class TpPuzzle extends TpBase {
    static get observedAttributes(): string[];
    private readonly instance;
    private fallbackSrc;
    private fallbackAlt;
    private captured;
    private generation;
    private loadingImage?;
    private imageUrl;
    private signature;
    private layout?;
    private state;
    private past;
    private future;
    private selected;
    private showingImage;
    private completed;
    private board?;
    private imageGuide?;
    private statusNode?;
    private menu?;
    private anchor?;
    private nodes;
    private buttons;
    private drag?;
    /** Image URL used to create the puzzle. */
    get src(): string;
    set src(value: string);
    /** Exact requested piece count. */
    get pieces(): number;
    set pieces(value: number);
    /** Piece outline style. */
    get shape(): PuzzleShape;
    set shape(value: PuzzleShape);
    /** Text description of the image. */
    get alt(): string;
    set alt(value: string);
    /** Whether shuffled pieces start upright. */
    get exactOrientation(): boolean;
    set exactOrientation(value: boolean);
    /** Independent copies of the piece centers in SVG cell units and right-angle rotations. */
    get placements(): PuzzlePlacement[];
    /** Whether every piece matches its image position and orientation. */
    get isSolved(): boolean;
    get canUndo(): boolean;
    get canRedo(): boolean;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    private configuration;
    private clearImageHandlers;
    private load;
    private fail;
    private build;
    /** Shuffles pieces into the tray and starts a fresh move history. */
    reset(): void;
    /** Places a piece in SVG cell units; angles must be multiples of the shape’s rotation step (90° or 60°). Snaps near its solution and clamps to the board. */
    place(id: number, x: number, y: number, angle?: number): boolean;
    private commit;
    /** Restores the previous accepted move. */
    undo(): void;
    /** Reapplies the most recently undone move. */
    redo(): void;
    /** Displays or hides the reference image in the target frame without changing placements. */
    showImage(show?: boolean): void;
    private rotate;
    private changed;
    private update;
    private pieceId;
    private point;
    private down;
    private move;
    private up;
    private cancel;
    private openMenu;
    private closeMenu;
    private context;
    private key;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-puzzle": TpPuzzle;
    }
}
