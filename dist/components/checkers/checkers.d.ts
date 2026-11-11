/** @module components/checkers
 * @summary Interactive checkers positions and endgames with legal moves and random opponents.
 */
import { TpBase } from "../base/base.js";
import { type CheckersMove as Move, type Square } from "./checkers-model.js";
import "../button/button.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { type CheckersPlayMode, type CheckersPosition, type CheckersSide } from "./checkers-model.js";
export type { CheckersMove, CheckersPiece, CheckersPlayMode, CheckersPosition, CheckersSide, } from "./checkers-model.js";
/**
 * The custom `<tp-checkers>` element displays international draughts positions and plays out endgames.
 *
 * @summary Displays international draughts positions and plays out endgames.
 * @tagname tp-checkers
 * @attr {string} position = "W:W31-50:B1-20" - Draughts FEN: side to move and numbered white/black piece lists. Prefix kings with K; ranges are accepted.
 * @attr {string} fen = "W:W31-50:B1-20" - Alias of position, synchronized after moves. Takes precedence on initial connection.
 * @attr {"black" | "white"} orientation = "white" - Side displayed at the bottom of the 10 by 10 board.
 * @attr {boolean} draggable-pieces = false - Enables human moves by dragging, clicking or keyboard.
 * @attr {boolean} draggablepieces = false - HTML-normalized alias of the JavaScript property draggablePieces.
 * @event tp-checkers-change Emitted after loading, playing or navigating a position.
 * @eventdetail tp-checkers-change { fen: string; position: string }
 * @event tp-checkers-move Emitted after a complete legal turn, including all captures and any promotion.
 * @eventdetail tp-checkers-move { from: string; to: string; path: string[]; captures: { square: string; color: string; type: string }[]; promotion: boolean; fen: string }
 * @event tp-checkers-end Emitted when a played move ends the game by a win or draw.
 * @eventdetail tp-checkers-end { fen: string; result: string }
 * @event tp-checkers-error Emitted for invalid positions or play parameters; the previous game remains unchanged.
 * @eventdetail tp-checkers-error { message: string }
 * @keyboard Arrow keys Move focus between playable squares in the displayed direction.
 * @keyboard Enter / Space Select a piece or play a complete move to a highlighted destination.
 * @keyboard Escape Cancel selection, dragging or a pending capture-path choice.
 * @accessibility Numbered square buttons support keyboard play; king icons, captured pieces and live game status have text alternatives.
 * @see tp-chess - Explore chess positions with the same playback controls.
 * @example
 * <tp-checkers position="W:W32,34,K46:B17,19,K5" draggable-pieces=""></tp-checkers>
 */
export declare class TpCheckers extends TpBase {
    static get observedAttributes(): string[];
    private game;
    private future;
    private initialized;
    private reflecting;
    private initialFen;
    private board?;
    private status?;
    private sidebar?;
    private pathPanel?;
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
    /** Current draughts FEN, including the side to move and numbered piece lists. */
    get position(): string;
    set position(value: string);
    /** Current draughts FEN; loading it begins a fresh history at move one. */
    get fen(): string;
    set fen(value: string);
    /** Side shown at the bottom; flipping does not change the side to move. */
    get orientation(): CheckersSide;
    set orientation(value: CheckersSide);
    /** Enables mouse, touch and keyboard moves. API moves do not depend on this switch. */
    get draggablePieces(): boolean;
    set draggablePieces(value: boolean);
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    /** Loads the international starting position with twenty men per side. Stops automatic play. */
    start(): void;
    /** Loads draughts FEN or a numbered piece map atomically. Returns false and emits an error if invalid; an empty map clears the board. */
    setPosition(value: string | CheckersPosition): boolean;
    /** Restores the most recently loaded position, preserving its side to move. Stops automatic play. */
    reset(): void;
    /** Reverses the viewing orientation without changing the position or human side. */
    flip(): void;
    /** Removes all pieces and stops automatic play; the empty board cannot play moves. */
    clear(): void;
    /** Returns independent descriptions of all complete legal moves, optionally restricted to one origin. Paths include the origin and every landing square. */
    legalMoves(square?: string | number): Move[];
    /** Tests a complete legal move. Supply a full path including origin if several capture routes share the same endpoint. */
    legalMove(begin: string | number, end: string | number, path?: readonly (string | number)[]): boolean;
    /** Highlights and returns legal destination squares. Omit the square to clear highlights. */
    highlightLegalMove(square?: string | number): Square[];
    /** Plays one complete legal turn, including a whole capture sequence. Ambiguous endpoints require the full path; promotion is automatic. */
    move(begin: string | number, end: string | number, path?: readonly (string | number)[]): boolean;
    /** Starts user/random or random/random play from the current position. The human is White by default, independently of orientation. Default delay is 2000 ms; accepts 100–60000 ms. */
    play(mode?: CheckersPlayMode, userSide?: CheckersSide, delay?: number): boolean;
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
    private renderPaths;
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
        "tp-checkers": TpCheckers;
    }
}
