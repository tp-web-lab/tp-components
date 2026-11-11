import { afterEach, describe, expect, it, vi } from "vitest";
import { TpChess } from "./chess.js";
import {
	createPosition,
	DEFAULT_POSITION,
	EMPTY_FEN,
	normalizePosition,
} from "./chess-model.js";

const ENDGAME = "8/8/3k4/8/3PK3/8/8/8 w - - 0 1";
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
});
function board(fen = DEFAULT_POSITION): TpChess {
	const game = new TpChess();
	game.setAttribute("fen", fen);
	document.body.append(game);
	return game;
}
describe("FEN and piece maps", () => {
	it("accepts placement-only and complete FEN without inventing rights", () => {
		const placement = "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R";
		expect(normalizePosition(placement)).toBe(`${placement} w - - 0 1`);
		expect(createPosition(placement).turn()).toBe("w");
		expect(createPosition(`${placement} b KQkq - 3 4`).fen()).toBe(
			`${placement} b KQkq - 3 4`,
		);
	});
	it("converts maps and rejects invalid coordinates, piece codes and incomplete FEN", () => {
		expect(normalizePosition({ d6: "bK", d4: "wP", e4: "wK" })).toBe(ENDGAME);
		expect(() => normalizePosition({ z1: "wK" } as never)).toThrow();
		expect(() => normalizePosition({ a1: "white king" } as never)).toThrow();
		expect(() => normalizePosition("8/8/8/8/8/8/8/8 b")).toThrow();
		expect(() => createPosition("8/8/8/8/8/8/8/8 b - - 0 1")).toThrow();
	});
});
describe("tp-chess", () => {
	it("starts with a locked classical board, accessible SVG pieces and synchronized FEN", () => {
		const game = board();
		expect(game.fen).toBe(DEFAULT_POSITION);
		expect(game.draggablePieces).toBe(false);
		expect(game.querySelectorAll("[data-square]")).toHaveLength(64);
		expect(game.querySelectorAll(".tp-chess-piece")).toHaveLength(32);
		expect(game.querySelectorAll('[data-square][tabindex="0"]')).toHaveLength(
			1,
		);
		expect(
			game.querySelector('[data-square="a1"]')?.getAttribute("aria-label"),
		).toBe("a1: White rook");
		(game.querySelector('[data-square="e2"]') as HTMLElement).click();
		(game.querySelector('[data-square="e4"]') as HTMLElement).click();
		expect(game.fen).toBe(DEFAULT_POSITION);
	});
	it("gives initial fen precedence and accepts the requested draggablePieces spelling", () => {
		const game = new TpChess();
		game.setAttribute("position", ENDGAME);
		game.setAttribute("fen", DEFAULT_POSITION);
		game.setAttribute("draggablePieces", "");
		document.body.append(game);
		expect(game.fen).toBe(DEFAULT_POSITION);
		expect(game.draggablePieces).toBe(true);
		game.draggablePieces = false;
		expect(game.draggablePieces).toBe(false);
	});
	it("handles state changes before connection and preserves the previous game on invalid input", () => {
		const game = new TpChess();
		expect(game.setPosition({ d6: "bK", d4: "wP", e4: "wK" })).toBe(true);
		document.body.append(game);
		expect(game.fen).toBe(ENDGAME);
		const errors = vi.fn();
		game.addEventListener("tp-chess-error", errors);
		game.setAttribute("fen", "broken");
		expect(game.fen).toBe(ENDGAME);
		expect(game.getAttribute("fen")).toBe(ENDGAME);
		expect(errors).toHaveBeenCalledOnce();
		game.position = DEFAULT_POSITION;
		expect(game.fen).toBe(DEFAULT_POSITION);
	});
	it("validates turns, blockers and king safety without changing state", () => {
		const game = board();
		expect(game.legalMove("e2", "e4")).toBe(true);
		expect(game.legalMove("e7", "e5")).toBe(false);
		expect(game.move("a1", "a4")).toBe(false);
		expect(game.move("x1", "e4")).toBe(false);
		expect(game.fen).toBe(DEFAULT_POSITION);
		game.setPosition("4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1");
		expect(game.legalMove("e2", "d2")).toBe(false);
		expect(game.legalMove("e2", "e3")).toBe(true);
	});
	it("reflects moves, reports independent event data and resets the loaded endgame", () => {
		const game = board(ENDGAME);
		const moved = vi.fn();
		game.addEventListener("tp-chess-move", moved);
		expect(game.move("d4", "d5")).toBe(true);
		expect(game.getAttribute("fen")).toBe(game.fen);
		expect(game.fen.split(" ")[1]).toBe("b");
		expect(moved.mock.calls[0]?.[0].detail).toMatchObject({
			from: "d4",
			to: "d5",
			san: "d5",
		});
		game.reset();
		expect(game.fen).toBe(ENDGAME);
		game.start();
		expect(game.fen).toBe(DEFAULT_POSITION);
	});
	it("handles castling and en passant including removal of the captured pawn", () => {
		const game = board("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
		expect(game.move("e1", "g1")).toBe(true);
		expect(game.position.split("/")[7]).toBe("R4RK1");
		game.setPosition("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2");
		expect(game.move("e5", "d6")).toBe(true);
		expect(game.position).toBe("4k3/8/3P4/8/8/8/8/4K3");
		game.setPosition("4kr2/8/8/8/8/8/8/4K2R w K - 0 1");
		expect(game.legalMove("e1", "g1")).toBe(false);
	});
	it("promotes to queen by default and supports all underpromotions", () => {
		const game = board("7k/P7/8/8/8/8/8/4K3 w - - 0 1");
		expect(game.move("a7", "a8")).toBe(true);
		expect(game.position.startsWith("Q")).toBe(true);
		game.reset();
		expect(game.move("a7", "a8", "n")).toBe(true);
		expect(game.position.startsWith("N")).toBe(true);
	});
	it("offers an explicit promotion choice for human moves", () => {
		const game = board("7k/P7/8/8/8/8/8/4K3 w - - 0 1");
		game.draggablePieces = true;
		(game.querySelector('[data-square="a7"]') as HTMLElement).click();
		(game.querySelector('[data-square="a8"]') as HTMLElement).click();
		expect(
			game.querySelector(".tp-chess-promotion")?.hasAttribute("hidden"),
		).toBe(false);
		expect(game.position.startsWith("7k/P")).toBe(true);
		const button = Array.from(
			game.querySelectorAll(".tp-chess-promotion tp-button"),
		).find((el) => el.textContent === "rook");
		(button as HTMLElement).click();
		expect(game.position.startsWith("R")).toBe(true);
	});
	it("detects checkmate, stalemate and insufficient material", () => {
		const game = board();
		const end = vi.fn();
		game.addEventListener("tp-chess-end", end);
		game.move("f2", "f3");
		game.move("e7", "e5");
		game.move("g2", "g4");
		game.move("d8", "h4");
		expect(game.textContent).toContain("Checkmate. Black wins.");
		expect(end).toHaveBeenCalledOnce();
		expect(game.move("a2", "a3")).toBe(false);
		game.setPosition("7k/5K2/6Q1/8/8/8/8/8 b - - 0 1");
		expect(game.textContent).toContain("stalemate");
		expect(game.play()).toBe(false);
		game.setPosition("7k/8/8/8/8/8/8/K7 w - - 0 1");
		expect(game.textContent).toContain("insufficient material");
	});
	it("highlights legal targets and flips coordinates without altering the turn", () => {
		const game = board();
		expect(game.highlightLegalMove("e2").sort()).toEqual(["e3", "e4"]);
		expect(game.querySelectorAll("[data-legal]")).toHaveLength(2);
		game.highlightLegalMove();
		expect(game.querySelectorAll("[data-legal]")).toHaveLength(0);
		game.flip();
		expect(game.orientation).toBe("black");
		expect(
			game.querySelector("[data-square]")?.getAttribute("data-square"),
		).toBe("h1");
		expect(game.fen).toBe(DEFAULT_POSITION);
	});
	it("allows click moves only when enabled and navigates in screen directions", () => {
		const game = board();
		game.draggablePieces = true;
		(game.querySelector('[data-square="e2"]') as HTMLElement).click();
		expect(game.querySelectorAll("[data-legal]")).toHaveLength(2);
		(game.querySelector('[data-square="e4"]') as HTMLElement).click();
		expect(game.fen.split(" ")[1]).toBe("b");
		const cell = game.querySelector('[data-square="a8"]') as HTMLElement;
		cell.focus();
		cell.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect((document.activeElement as HTMLElement).dataset.square).toBe("b8");
	});
	it("runs user/random and random/random, and stops on reset, clear or disconnect", () => {
		vi.useFakeTimers();
		const game = board();
		expect(game.play("user/random", "black", 100)).toBe(true);
		vi.advanceTimersByTime(100);
		expect(game.fen.split(" ")[1]).toBe("b");
		const position = game.fen;
		vi.advanceTimersByTime(1000);
		expect(game.fen).toBe(position);
		expect(game.play("random/random", "white", 100)).toBe(true);
		vi.advanceTimersByTime(200);
		expect(game.fen).not.toBe(position);
		game.stop();
		const stopped = game.fen;
		vi.advanceTimersByTime(1000);
		expect(game.fen).toBe(stopped);
		game.play("random/random", "white", 100);
		game.remove();
		vi.advanceTimersByTime(1000);
		expect(game.fen).toBe(stopped);
		document.body.append(game);
		expect(game.fen).toBe(stopped);
		game.play("random/random", "white", 100);
		game.reset();
		vi.advanceTimersByTime(500);
		expect(game.fen).toBe(DEFAULT_POSITION);
		game.play("random/random", "white", 100);
		game.clear();
		vi.advanceTimersByTime(500);
		expect(game.fen).toBe(EMPTY_FEN);
		expect(game.legalMove("e2", "e4")).toBe(false);
		expect(game.play()).toBe(false);
	});
	it("rejects invalid play parameters without starting a timer", () => {
		vi.useFakeTimers();
		const game = board();
		expect(game.play("other" as never)).toBe(false);
		expect(game.play("random/random", "white", 0)).toBe(false);
		vi.advanceTimersByTime(1000);
		expect(game.fen).toBe(DEFAULT_POSITION);
	});
});

it("stops play for threefold repetition and the fifty-move rule", () => {
	const game = board();
	for (let cycle = 0; cycle < 2; cycle++) {
		game.move("g1", "f3");
		game.move("g8", "f6");
		game.move("f3", "g1");
		game.move("f6", "g8");
	}
	expect(game.textContent).toContain("threefold repetition");
	expect(game.play()).toBe(false);
	game.setPosition("7k/8/5K2/8/8/8/8/R7 w - - 99 1");
	expect(game.move("a1", "a2")).toBe(true);
	expect(game.textContent).toContain("fifty-move");
});

it("explains captures, lists captured pieces by color and preserves them on stop or flip", () => {
	const game = board();
	game.move("e2", "e4");
	game.move("d7", "d5");
	game.move("e4", "d5");
	expect(game.querySelector(".tp-chess-last-move")?.textContent).toBe(
		"2. White pawn: e4 → d5",
	);
	expect(
		game.querySelectorAll('.tp-chess-captured[data-color="b"] tp-icon'),
	).toHaveLength(1);
	expect(
		game.querySelectorAll('.tp-chess-captured[data-color="w"] tp-icon'),
	).toHaveLength(0);
	expect(game.querySelectorAll(".tp-chess-history li")).toHaveLength(3);
	expect(game.querySelectorAll("[data-last-move]")).toHaveLength(2);
	game.stop();
	game.flip();
	expect(game.querySelectorAll(".tp-chess-captured tp-icon")).toHaveLength(1);
	game.move("d8", "d5");
	expect(game.querySelector(".tp-chess-last-move")?.textContent).toBe(
		"2… Black queen: d8 → d5",
	);
	expect(
		game.querySelector(".tp-chess-history li:last-child")?.textContent,
	).toBe("2… Black queen: d8 → d5");
	expect(
		game.querySelectorAll('.tp-chess-captured[data-color="w"] tp-icon'),
	).toHaveLength(1);
	game.reset();
	expect(game.querySelectorAll(".tp-chess-captured tp-icon")).toHaveLength(0);
	expect(game.querySelectorAll(".tp-chess-history li")).toHaveLength(0);
});
it("counts en-passant captures and does not mistake a promotion or missing FEN material for a capture", () => {
	const game = board("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2");
	expect(game.querySelectorAll(".tp-chess-captured tp-icon")).toHaveLength(0);
	game.move("e5", "d6");
	expect(game.querySelector(".tp-chess-last-move")?.textContent).toBe(
		"2. White pawn: e5 → d6",
	);
	expect(game.querySelectorAll(".tp-chess-captured tp-icon")).toHaveLength(1);
	game.setPosition("7k/P7/8/8/8/8/8/4K3 w - - 0 1");
	game.move("a7", "a8");
	expect(game.querySelector(".tp-chess-last-move")?.textContent).toBe(
		"1. White pawn: a7 → a8",
	);
	expect(game.querySelectorAll(".tp-chess-captured tp-icon")).toHaveLength(0);
});
it("uses a two-second default interval for automatic moves", () => {
	vi.useFakeTimers();
	const game = board();
	game.play("random/random");
	vi.advanceTimersByTime(1999);
	expect(game.fen).toBe(DEFAULT_POSITION);
	vi.advanceTimersByTime(1);
	expect(game.fen).not.toBe(DEFAULT_POSITION);
	expect(game.querySelectorAll(".tp-chess-history li")).toHaveLength(1);
});

it("navigates recorded moves and restores captures without losing the continuation", () => {
	const game = board();
	game.move("e2", "e4");
	game.move("d7", "d5");
	game.move("e4", "d5");
	const end = game.fen;
	expect(game.previousMove()).toBe(true);
	expect(game.querySelectorAll(".tp-chess-captured tp-icon")).toHaveLength(0);
	expect(game.nextMove()).toBe(true);
	expect(game.fen).toBe(end);
	expect(game.querySelectorAll(".tp-chess-captured tp-icon")).toHaveLength(1);
	game.rewind();
	expect(game.fen).toBe(DEFAULT_POSITION);
	expect(game.previousMove()).toBe(false);
	for (let i = 0; i < 3; i++) expect(game.nextMove()).toBe(true);
	expect(game.fen).toBe(end);
	expect(
		game.querySelectorAll(".tp-chess-playback tp-icon-button"),
	).toHaveLength(5);
});
it("replays castling and en passant exactly, and discards a continuation after a different move", () => {
	const game = board("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
	game.move("e1", "g1");
	const castled = game.fen;
	game.previousMove();
	game.nextMove();
	expect(game.fen).toBe(castled);
	game.setPosition("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2");
	const initial = game.fen;
	game.move("e5", "d6");
	const capture = game.fen;
	game.rewind();
	expect(game.fen).toBe(initial);
	game.nextMove();
	expect(game.fen).toBe(capture);
	game.start();
	game.move("e2", "e4");
	game.move("e7", "e5");
	game.rewind();
	game.move("d2", "d4");
	game.nextMove();
	expect(game.querySelectorAll(".tp-chess-history li")).toHaveLength(2);
	expect(game.position).not.toBe(DEFAULT_POSITION.split(" ")[0]);
});
it("pauses before stepping and resumes the recorded sequence at the playback interval", () => {
	vi.useFakeTimers();
	const game = board();
	game.move("e2", "e4");
	game.move("e7", "e5");
	const end = game.fen;
	game.rewind();
	expect(game.playToEnd()).toBe(true);
	vi.advanceTimersByTime(2000);
	game.pause();
	const paused = game.fen;
	vi.advanceTimersByTime(4000);
	expect(game.fen).toBe(paused);
	game.nextMove();
	expect(game.fen).toBe(end);
	vi.advanceTimersByTime(4000);
	expect(game.fen).toBe(end);
	game.playToEnd();
	game.previousMove();
	const previous = game.fen;
	vi.advanceTimersByTime(4000);
	expect(game.fen).toBe(previous);
	game.reset();
	expect(game.querySelectorAll(".tp-chess-history li")).toHaveLength(0);
});
