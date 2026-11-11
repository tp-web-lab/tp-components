/** @module components/chess/model */
import { Chess, DEFAULT_POSITION, type Square } from "chess.js";
export type ChessSide = "white" | "black";
export type ChessPlayMode = "user/random" | "random/random";
export type ChessPiece = `${"w" | "b"}${"K" | "Q" | "R" | "B" | "N" | "P"}`;
export type ChessPosition = Partial<Record<Square, ChessPiece>>;
export type ChessPromotion = "q" | "r" | "b" | "n";
export { DEFAULT_POSITION };
export declare const EMPTY_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";
export declare function isSquare(value: string): value is Square;
/** Converts a placement or piece map to full FEN, preserving all supplied FEN fields. */
export declare function normalizePosition(value: string | ChessPosition): string;
/** Validates atomically; the empty board is an explicit non-playable diagram. */
export declare function createPosition(value: string | ChessPosition): Chess;
