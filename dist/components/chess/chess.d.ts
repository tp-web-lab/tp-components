/** @module components/chess
 * @summary Interactive chess positions and endgames with legal moves and random opponents.
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
/**
 * @credit chess.js https://github.com/jhlywa/chess.js
 * @summary Legal chess moves, FEN validation and game-end detection (BSD-2-Clause).
 */
import { type Square } from "chess.js";
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { type ChessPlayMode, type ChessPosition, type ChessPromotion, type ChessSide } from "./chess-model.js";
export type { ChessPiece, ChessPlayMode, ChessPosition, ChessPromotion, ChessSide, } from "./chess-model.js";
/**
 * The custom `<tp-chess>` element displays chess positions and plays out endgames.
 *
 * @summary Displays chess positions and plays out endgames.
 * @tagname tp-chess
 * @attr {string} position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" - Piece placement or full FEN. Placement-only input defaults to White to move with no castling or en-passant rights.
 * @attr {string} fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" - Full six-field FEN, synchronized after every move. Takes precedence over position on initial connection.
 * @attr {"black" | "white"} orientation = "white" - Side displayed at the bottom of the board.
 * @attr {boolean} draggable-pieces = false - Enables human moves by dragging, clicking or keyboard. Also accepts the HTML spelling draggablePieces; the JavaScript property is draggablePieces.
 * @attr {boolean} draggablepieces = false - HTML-normalized alias of draggablePieces; use draggable-pieces for the canonical markup spelling.
 * @event tp-chess-change Emitted after an accepted position change or legal move.
 * @eventdetail tp-chess-change { fen: string; position: string }
 * @event tp-chess-move Emitted after a legal move, including castling, en passant and promotion.
 * @eventdetail tp-chess-move { from: string; to: string; san: string; promotion?: string; fen: string }
 * @event tp-chess-end Emitted after a move ends the game by checkmate or a draw.
 * @eventdetail tp-chess-end { fen: string; result: string }
 * @event tp-chess-error Emitted when a supplied position or play configuration is invalid; the previous position is preserved.
 * @eventdetail tp-chess-error { message: string }
 * @keyboard Arrow keys Move focus across the board in the displayed direction.
 * @keyboard Enter / Space Select a piece or move it to the focused square.
 * @keyboard Escape Cancel the selection, drag or promotion choice.
 * @accessibility Squares have coordinate and piece labels, a roving keyboard focus and visible legal-move indicators. Game status is announced politely.
 * @example
 * <tp-chess position="8/8/3k4/8/3PK3/8/8/8" draggable-pieces=""></tp-chess>
 */
export declare class TpChess extends TpBase {
    static get observedAttributes(): string[];
    private game;
    private future;
    private initialized;
    private reflecting;
    private initialFen;
    private board?;
    private status?;
    private sidebar?;
    private promotionPanel?;
    private selected?;
    private highlighted;
    private focusSquare;
    private pending?;
    private mode;
    private userSide;
    private timer?;
    private delay;
    private drag?;
    private ghost?;
    private suppressClick;
    private message;
    /** Current piece-placement field. Assign a placement, full FEN or piece map through setPosition. */
    get position(): string;
    set position(value: string);
    /** Full FEN, including side to move, rights and move counters. */
    get fen(): string;
    set fen(value: string);
    /** Side shown at the bottom; flipping does not change the side to move. */
    get orientation(): ChessSide;
    set orientation(value: ChessSide);
    /** Enables mouse, touch and keyboard moves. API moves do not depend on this switch. */
    get draggablePieces(): boolean;
    set draggablePieces(value: boolean);
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    /** Loads the classical starting position, with all castling rights. Stops automatic play. */
    start(): void;
    /** Loads a FEN or square-to-piece map atomically. Returns false and emits an error if invalid. Empty maps clear the board; other positions need both kings. */
    setPosition(value: string | ChessPosition): boolean;
    /** Restores the most recently loaded position, preserving its turn and rights. Stops automatic play. */
    reset(): void;
    /** Reverses the viewing orientation without changing the position or human side. */
    flip(): void;
    /** Removes all pieces and stops automatic play; the empty board cannot play moves. */
    clear(): void;
    /** Tests a legal move for the side to move. Promotion defaults to queen; no state is changed. */
    legalMove(begin: string, end: string, promotion?: ChessPromotion): boolean;
    /** Highlights and returns legal destination squares. Omit the square to clear highlights. */
    highlightLegalMove(square?: string): Square[];
    /** Plays a legal move, returning false for an illegal move or a finished game. Promotion defaults to queen. */
    move(begin: string, end: string, promotion?: ChessPromotion): boolean;
    /** Starts user/random or random/random play from the current position. The human is White by default, independently of orientation. Default delay is 2000 ms; accepts 100–60000 ms. */
    play(mode?: ChessPlayMode, userSide?: ChessSide, delay?: number): boolean;
    /** Stops the random opponent or autoplay. The current position remains on the board. */
    stop(): void;
    /** Returns to the loaded starting position while retaining played moves for replay. Pauses automatic play. */
    rewind(): void;
    /** Undoes one half-move and keeps it available for replay. Returns false at the beginning. */
    previousMove(): boolean;
    /** Replays the next recorded half-move, or plays one random legal move at the end of the recording. Pauses automatic play. */
    nextMove(): boolean;
    /** Replays recorded moves and then continues with random legal moves until the game ends or is paused. */
    playToEnd(): boolean;
    /** Pauses playback without losing the current position or recorded moves. */
    pause(): void;
    private navigationChanged;
    private advance;
    private emit;
    private fail;
    private sync;
    private playable;
    private available;
    private humanTurn;
    private schedule;
    private result;
    private updateStatus;
    private build;
    private render;
    private renderHistory;
    private describeMove;
    private renderPromotion;
    private mark;
    private squareAt;
    private focusCell;
    private activate;
    private humanMove;
    private key;
    private down;
    private pointerMove;
    private up;
    private cancelDrag;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-chess": TpChess;
    }
}
