/** @module components/checkers/model
 * International 10×10 draughts: mandatory majority captures, flying kings and terminal promotion.
 */
export type CheckersSide = "white" | "black";
export type CheckersPlayMode = "user/random" | "random/random";
export type CheckersPiece = `${"w" | "b"}${"M" | "K"}`;
export type CheckersPosition = Record<string, CheckersPiece>;
export type Square = string;
export interface Piece {
    color: "w" | "b";
    type: "m" | "k";
}
export interface CheckersMove {
    from: Square;
    to: Square;
    path: Square[];
    captures: (Piece & {
        square: Square;
    })[];
    color: "w" | "b";
    piece: "m" | "k";
    promotion: boolean;
    number: number;
    notation: string;
    before: string;
    after: string;
}
export declare const DEFAULT_POSITION = "W:W31-50:B1-20";
export declare const EMPTY_FEN = "W:W:B";
export declare function isSquare(value: string): boolean;
export declare function coordinates(square: Square): [number, number];
export declare function squareAt(row: number, column: number): Square | undefined;
/** Pure state engine; snapshots preserve repetition and draw counters during undo/replay. */
export declare class CheckersGame {
    private state;
    private past;
    constructor(value?: string | CheckersPosition);
    fen(): string;
    turn(): "w" | "b";
    get(square: Square): Piece | undefined;
    board(): Piece[];
    history(): CheckersMove[];
    /** All full legal turns, filtered by origin only after applying the global majority rule. */
    moves(options?: {
        square?: Square;
    }): CheckersMove[];
    /** Plays a complete move; an ambiguous destination requires the full path, including origin. */
    move(input: {
        from: Square;
        to: Square;
        path?: readonly Square[];
    }): CheckersMove;
    undo(): CheckersMove | null;
    /** Winner detection takes precedence over a draw reached on the same move. */
    result(): string;
    isGameOver(): boolean;
}
export declare function createPosition(value: string | CheckersPosition): CheckersGame;
