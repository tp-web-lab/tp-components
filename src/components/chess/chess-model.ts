/** @module components/chess/model */
import { Chess, DEFAULT_POSITION, type Square } from "chess.js";
export type ChessSide = "white" | "black";
export type ChessPlayMode = "user/random" | "random/random";
export type ChessPiece = `${"w" | "b"}${"K" | "Q" | "R" | "B" | "N" | "P"}`;
export type ChessPosition = Partial<Record<Square, ChessPiece>>;
export type ChessPromotion = "q" | "r" | "b" | "n";
export { DEFAULT_POSITION };
export const EMPTY_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";
export function isSquare(value: string): value is Square {
	return /^[a-h][1-8]$/.test(value);
}
/** Converts a placement or piece map to full FEN, preserving all supplied FEN fields. */
export function normalizePosition(value: string | ChessPosition): string {
	if (typeof value === "string") {
		const parts = value.trim().split(/\s+/);
		if (parts.length === 1) return `${parts[0]} w - - 0 1`;
		if (parts.length !== 6)
			throw new Error("Use a piece placement or a full six-field FEN.");
		return parts.join(" ");
	}
	if (!value || Array.isArray(value) || typeof value !== "object")
		throw new Error("Use a FEN string or a square-to-piece object.");
	for (const [square, piece] of Object.entries(value)) {
		if (
			!isSquare(square) ||
			typeof piece !== "string" ||
			!/^[wb][KQRBNP]$/.test(piece)
		)
			throw new Error(
				"Piece maps use squares a1–h8 and codes such as wK or bP.",
			);
	}
	const ranks: string[] = [];
	for (let rank = 8; rank >= 1; rank--) {
		let row = "",
			empty = 0;
		for (const file of "abcdefgh") {
			const piece = value[`${file}${rank}` as Square];
			if (!piece) {
				empty++;
				continue;
			}
			if (empty) row += empty;
			empty = 0;
			row += piece[0] === "w" ? piece[1] : piece[1]?.toLowerCase();
		}
		if (empty) row += empty;
		ranks.push(row);
	}
	return `${ranks.join("/")} w - - 0 1`;
}
/** Validates atomically; the empty board is an explicit non-playable diagram. */
export function createPosition(value: string | ChessPosition): Chess {
	const fen = normalizePosition(value);
	const game = new Chess();
	if (fen === EMPTY_FEN) game.clear();
	else game.load(fen);
	return game;
}
