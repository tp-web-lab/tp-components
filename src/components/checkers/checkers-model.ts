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
	captures: (Piece & { square: Square })[];
	color: "w" | "b";
	piece: "m" | "k";
	promotion: boolean;
	number: number;
	notation: string;
	before: string;
	after: string;
}
export const DEFAULT_POSITION = "W:W31-50:B1-20";
export const EMPTY_FEN = "W:W:B";
export function isSquare(value: string): boolean {
	return /^(?:[1-9]|[1-4][0-9]|50)$/.test(value);
}
export function coordinates(square: Square): [number, number] {
	const n = Number(square) - 1,
		r = Math.floor(n / 5);
	return [r, (n % 5) * 2 + (r % 2 === 0 ? 1 : 0)];
}
export function squareAt(row: number, column: number): Square | undefined {
	if (
		row < 0 ||
		row >= 10 ||
		column < 0 ||
		column >= 10 ||
		(row + column) % 2 !== 1
	)
		return;
	return String(row * 5 + Math.floor(column / 2) + 1);
}
interface State {
	pieces: Record<Square, Piece>;
	side: "w" | "b";
	number: number;
	quiet: number;
	limit?: { w: number; b: number };
}
const copy = <T>(value: T): T => structuredClone(value);
function endgameLimit(pieces: Record<Square, Piece>): number | undefined {
	const all = Object.values(pieces);
	for (const side of ["w", "b"] as const) {
		const lone = all.filter((p) => p.color === side),
			opponent = all.filter((p) => p.color !== side);
		if (
			lone.length !== 1 ||
			lone[0]?.type !== "k" ||
			!opponent.some((p) => p.type === "k")
		)
			continue;
		if (opponent.length <= 2) return 5;
		if (opponent.length === 3) return 16;
	}
}
function parse(value: string | CheckersPosition): State {
	let side: "w" | "b" = "w";
	const pieces: Record<Square, Piece> = {};
	const put = (square: string, piece: Piece) => {
		if (!isSquare(square) || pieces[square])
			throw new Error("Use distinct numbered squares from 1 to 50.");
		const row = coordinates(square)[0];
		if (piece.type === "m" && (piece.color === "w" ? row === 0 : row === 9))
			throw new Error(
				"A man on its promotion row must be written as a king (K).",
			);
		pieces[square] = piece;
	};
	if (typeof value === "string") {
		const fields = value.trim().toUpperCase().split(":");
		if (fields.length !== 3 || !["W", "B"].includes(fields[0] ?? ""))
			throw new Error("Use draughts FEN such as W:W31-50:B1-20.");
		side = fields[0] === "W" ? "w" : "b";
		const seen = new Set<string>();
		for (const field of fields.slice(1)) {
			const color = field[0];
			if (!color || !["W", "B"].includes(color) || seen.has(color))
				throw new Error("FEN needs one W list and one B list.");
			seen.add(color);
			if (field.length === 1) continue;
			for (const token of field.slice(1).split(",")) {
				const match = /^(K?)([1-9][0-9]?)(?:-([1-9][0-9]?))?$/.exec(token);
				if (!match)
					throw new Error(
						"List square numbers or ranges; prefix kings with K.",
					);
				const first = Number(match[2]),
					last = Number(match[3] ?? match[2]);
				if (last < first || last > 50)
					throw new Error("Square ranges must increase within 1–50.");
				for (let n = first; n <= last; n++)
					put(String(n), {
						color: color === "W" ? "w" : "b",
						type: match[1] ? "k" : "m",
					});
			}
		}
	} else {
		if (!value || Array.isArray(value) || typeof value !== "object")
			throw new Error("Use draughts FEN or a numbered piece map.");
		for (const [square, code] of Object.entries(value)) {
			if (typeof code !== "string" || !/^[wb][MK]$/.test(code))
				throw new Error("Piece codes are wM, wK, bM and bK.");
			put(square, {
				color: code[0] === "w" ? "w" : "b",
				type: code[1] === "K" ? "k" : "m",
			});
		}
	}
	for (const color of ["w", "b"])
		if (Object.values(pieces).filter((p) => p.color === color).length > 20)
			throw new Error("Each side can have at most twenty pieces.");
	const limit = endgameLimit(pieces);
	return {
		pieces,
		side,
		number: 1,
		quiet: 0,
		limit: limit ? { w: limit, b: limit } : undefined,
	};
}
function fen(state: State): string {
	const list = (side: "w" | "b") =>
		Object.entries(state.pieces)
			.filter(([, p]) => p.color === side)
			.sort(([a], [b]) => Number(a) - Number(b))
			.map(([n, p]) => `${p.type === "k" ? "K" : ""}${n}`)
			.join(",");
	return `${state.side.toUpperCase()}:W${list("w")}:B${list("b")}`;
}
/** Pure state engine; snapshots preserve repetition and draw counters during undo/replay. */
export class CheckersGame {
	private state: State;
	private past: { state: State; move: CheckersMove }[] = [];
	constructor(value: string | CheckersPosition = DEFAULT_POSITION) {
		this.state = parse(value);
	}
	fen(): string {
		return fen(this.state);
	}
	turn(): "w" | "b" {
		return this.state.side;
	}
	get(square: Square): Piece | undefined {
		const p = this.state.pieces[square];
		return p ? { ...p } : undefined;
	}
	board(): Piece[] {
		return Object.values(this.state.pieces).map((p) => ({ ...p }));
	}
	history(): CheckersMove[] {
		return this.past.map((entry) => copy(entry.move));
	}
	/** All full legal turns, filtered by origin only after applying the global majority rule. */
	moves(options: { square?: Square } = {}): CheckersMove[] {
		const state = this.state;
		const result: CheckersMove[] = [];
		const add = (
			from: Square,
			piece: Piece,
			path: Square[],
			captures: CheckersMove["captures"],
		) => {
			const to = path.at(-1) ?? from;
			const r = coordinates(to)[0];
			result.push({
				from,
				to,
				path: [...path],
				captures: copy(captures),
				color: piece.color,
				piece: piece.type,
				promotion:
					piece.type === "m" && (piece.color === "w" ? r === 0 : r === 9),
				number: state.number,
				notation: path.join(captures.length ? "×" : "–"),
				before: this.fen(),
				after: "",
			});
		};
		const directions = [
			[-1, -1],
			[-1, 1],
			[1, -1],
			[1, 1],
		] as const;
		for (const [from, piece] of Object.entries(state.pieces)) {
			if (piece.color !== state.side) continue;
			const occupied = { ...state.pieces };
			delete occupied[from];
			const visit = (
				position: Square,
				path: Square[],
				captured: CheckersMove["captures"],
			) => {
				const [r, c] = coordinates(position);
				let extended = false;
				for (const [dr, dc] of directions) {
					let rr = r + dr,
						cc = c + dc;
					let victim: Square | undefined;
					while (true) {
						const square = squareAt(rr, cc);
						if (!square) break;
						const other = occupied[square];
						if (other) {
							if (
								victim ||
								other.color === piece.color ||
								captured.some((p) => p.square === square)
							)
								break;
							victim = square;
						} else if (victim) {
							const taken = occupied[victim];
							if (taken) {
								extended = true;
								visit(
									square,
									[...path, square],
									[...captured, { ...taken, square: victim }],
								);
							}
							if (piece.type === "m") break;
						} else if (piece.type === "m") break;
						rr += dr;
						cc += dc;
					}
				}
				if (!extended && captured.length) add(from, piece, path, captured);
			};
			visit(from, [from], []);
		}
		if (result.length) {
			const max = Math.max(...result.map((m) => m.captures.length));
			return result.filter(
				(m) =>
					m.captures.length === max &&
					(!options.square || m.from === options.square),
			);
		}
		for (const [from, piece] of Object.entries(state.pieces)) {
			if (piece.color !== state.side) continue;
			const [r, c] = coordinates(from);
			for (const [dr, dc] of directions) {
				if (piece.type === "m" && dr !== (piece.color === "w" ? -1 : 1))
					continue;
				let rr = r + dr,
					cc = c + dc;
				while (true) {
					const to = squareAt(rr, cc);
					if (!to || state.pieces[to]) break;
					add(from, piece, [from, to], []);
					if (piece.type === "m") break;
					rr += dr;
					cc += dc;
				}
			}
		}
		return result.filter((m) => !options.square || m.from === options.square);
	}
	/** Plays a complete move; an ambiguous destination requires the full path, including origin. */
	move(input: {
		from: Square;
		to: Square;
		path?: readonly Square[];
	}): CheckersMove {
		if (this.isGameOver()) throw new Error("The game has ended.");
		const choices = this.moves({ square: input.from }).filter(
			(m) =>
				m.to === input.to &&
				(!input.path || m.path.join(",") === input.path.join(",")),
		);
		if (choices.length !== 1)
			throw new Error("Choose one complete legal capture path.");
		const move = choices[0];
		if (!move) throw new Error("Illegal move.");
		const before = copy(this.state);
		const piece = this.state.pieces[move.from];
		if (!piece) throw new Error("Missing piece.");
		delete this.state.pieces[move.from];
		for (const p of move.captures) delete this.state.pieces[p.square];
		this.state.pieces[move.to] = {
			color: piece.color,
			type: move.promotion ? "k" : piece.type,
		};
		this.state.quiet =
			move.captures.length || piece.type === "m" ? 0 : this.state.quiet + 1;
		if (this.state.limit) this.state.limit[piece.color]--;
		const limit = endgameLimit(this.state.pieces);
		if (limit)
			this.state.limit = {
				w: Math.min(this.state.limit?.w ?? limit, limit),
				b: Math.min(this.state.limit?.b ?? limit, limit),
			};
		this.state.side = piece.color === "w" ? "b" : "w";
		if (piece.color === "b") this.state.number++;
		move.after = this.fen();
		this.past.push({ state: before, move: copy(move) });
		return copy(move);
	}
	undo(): CheckersMove | null {
		const entry = this.past.pop();
		if (!entry) return null;
		this.state = entry.state;
		return copy(entry.move);
	}
	/** Winner detection takes precedence over a draw reached on the same move. */
	result(): string {
		if (!Object.keys(this.state.pieces).length)
			return "Empty board. Load a position to play.";
		for (const color of ["w", "b"] as const)
			if (!Object.values(this.state.pieces).some((p) => p.color === color))
				return `${color === "w" ? "Black" : "White"} wins: the opponent has no pieces.`;
		if (!this.moves().length)
			return `${this.state.side === "w" ? "Black" : "White"} wins: the opponent has no legal move.`;
		const repetitions =
			1 + this.past.filter((p) => fen(p.state) === this.fen()).length;
		if (repetitions >= 3) return "Draw by threefold repetition.";
		if (this.state.quiet >= 50)
			return "Draw after 25 king-only moves by each side without a capture.";
		if (this.state.limit && this.state.limit.w <= 0 && this.state.limit.b <= 0)
			return "Draw by the limited-material endgame rule.";
		return `${this.state.side === "w" ? "White" : "Black"} to move.`;
	}
	isGameOver(): boolean {
		return !this.result().endsWith("to move.");
	}
}
export function createPosition(value: string | CheckersPosition): CheckersGame {
	return new CheckersGame(value);
}
