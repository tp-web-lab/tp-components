import { afterEach, describe, expect, it, vi } from "vitest";
import { TpCheckers } from "./checkers.js";
import {
	CheckersGame,
	coordinates,
	createPosition,
	DEFAULT_POSITION,
	EMPTY_FEN,
	squareAt,
} from "./checkers-model.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
});
function board(position = DEFAULT_POSITION): TpCheckers {
	const game = new TpCheckers();
	game.setAttribute("position", position);
	document.body.append(game);
	return game;
}
function play(game: CheckersGame, from: string, to: string, path?: string[]) {
	return game.move({ from, to, path });
}
describe("international draughts engine", () => {
	it("numbers fifty playable squares and starts twenty men per side with nine legal moves", () => {
		expect(coordinates("1")).toEqual([0, 1]);
		expect(coordinates("50")).toEqual([9, 8]);
		expect(squareAt(9, 0)).toBe("46");
		expect(squareAt(0, 0)).toBeUndefined();
		const game = new CheckersGame();
		expect(game.board()).toHaveLength(40);
		expect(game.moves()).toHaveLength(9);
		const before = game.fen();
		for (const move of game.moves()) {
			game.move(move);
			expect(game.moves()).toHaveLength(9);
			game.undo();
			expect(game.fen()).toBe(before);
		}
	});
	it("validates FEN, ranges, kings and numbered piece maps atomically", () => {
		expect(createPosition({ "32": "wM", "5": "bK" }).fen()).toBe("W:W32:BK5");
		expect(createPosition("B:BK5:W32").turn()).toBe("b");
		for (const invalid of [
			"W:W32:B32",
			"W:W51:B1",
			"W:W1:B20",
			"W:W31-20:B1",
			"W:W32:W17",
			"invalid",
			"W:W0:B1",
		])
			expect(() => new CheckersGame(invalid)).toThrow();
		expect(new CheckersGame({}).fen()).toBe(EMPTY_FEN);
	});
	it("requires complete maximum captures across all pieces", () => {
		const game = new CheckersGame("W:W32,34:B17,27,29");
		const moves = game.moves();
		expect(moves.length).toBeGreaterThan(0);
		expect(moves.every((m) => m.from === "32" && m.captures.length === 2)).toBe(
			true,
		);
		expect(game.moves({ square: "34" })).toHaveLength(0);
		expect(() => play(game, "32", "21")).toThrow();
		const move = play(game, "32", "12");
		expect(move.path).toEqual(["32", "21", "12"]);
		expect(move.captures.map((p) => p.square)).toEqual(["27", "17"]);
		expect(game.get("29")?.color).toBe("b");
	});
	it("allows backward captures by men but not backward quiet moves", () => {
		const game = new CheckersGame("W:W22:B28");
		expect(game.moves().map((m) => m.to)).toEqual(["33"]);
		play(game, "22", "33");
		expect(game.result()).toContain("White wins");
		const quiet = new CheckersGame("W:W22:B1");
		expect(quiet.moves().map((m) => m.to)).not.toContain("28");
	});
	it("lets kings fly while previously captured pieces remain blockers until a sequence ends", () => {
		const game = new CheckersGame("W:WK32:B27,38");
		expect(game.moves().every((m) => m.captures.length === 1)).toBe(true);
		expect(game.moves().some((m) => m.to === "16")).toBe(true);
		const quiet = new CheckersGame("W:WK46:B2");
		expect(quiet.moves().some((m) => m.to === "5")).toBe(true);
	});
	it("promotes only at the end of a complete turn", () => {
		const game = new CheckersGame("W:W7:B40");
		expect(play(game, "7", "1").promotion).toBe(true);
		expect(game.get("1")?.type).toBe("k");
		const passing = new CheckersGame("W:W12:B8,9");
		const move = play(passing, "12", "14");
		expect(move.path).toEqual(["12", "3", "14"]);
		expect(move.promotion).toBe(false);
		expect(passing.get("14")?.type).toBe("m");
	});
	it("restores complete turns, captures and promotion with undo; history is isolated", () => {
		const game = new CheckersGame("W:W12:B8,9");
		const initial = game.fen();
		play(game, "12", "14");
		const history = game.history();
		history[0]?.captures.splice(0);
		expect(game.history()[0]?.captures).toHaveLength(2);
		game.undo();
		expect(game.fen()).toBe(initial);
		expect(game.history()).toHaveLength(0);
	});
	it("detects a blocked side and a side without pieces", () => {
		expect(new CheckersGame("W:W6:B1,2").result()).toContain("Black wins");
		expect(new CheckersGame("W:WK46:B").result()).toContain("White wins");
		expect(new CheckersGame({}).isGameOver()).toBe(true);
	});
});
describe("draws and capture routes", () => {
	it("requires an explicit route for ambiguous endpoints", () => {
		const game = new CheckersGame("W:WK47:BK38,K8,K35,K18,K40,K9");
		const choices = game.moves().filter((m) => m.to === "45");
		expect(choices).toHaveLength(3);
		expect(() => play(game, "47", "45")).toThrow();
		const path = choices[1]?.path;
		expect(play(game, "47", "45", path).path).toEqual(path);
	});
	it("counts five moves per side in a lone-king ending and restores the counter on undo", () => {
		const game = new CheckersGame("W:WK46:BK1");
		const sequence = [
			["46", "41"],
			["1", "6"],
			["41", "19"],
			["6", "33"],
			["19", "30"],
			["33", "22"],
			["30", "25"],
			["22", "31"],
			["25", "34"],
			["31", "37"],
		];
		for (const [from, to] of sequence) {
			expect(game.isGameOver()).toBe(false);
			if (from && to) play(game, from, to);
		}
		expect(game.result()).toContain("limited-material");
		game.undo();
		expect(game.isGameOver()).toBe(false);
		play(game, "31", "37");
		expect(game.isGameOver()).toBe(true);
	});
	it("recognizes threefold repetition before the limited-material limit", () => {
		const game = new CheckersGame("W:WK46:BK1");
		for (let n = 0; n < 2; n++) {
			play(game, "46", "41");
			play(game, "1", "6");
			play(game, "41", "46");
			play(game, "6", "1");
		}
		expect(game.result()).toContain("threefold");
	});
});
describe("tp-checkers", () => {
	it("offers capture route choices and exposes independent legal move paths", () => {
		const game = board("W:WK47:BK38,K8,K35,K18,K40,K9");
		game.draggablePieces = true;
		const choices = game.legalMoves(47).filter((m) => m.to === "45");
		expect(choices).toHaveLength(3);
		expect(game.move(47, 45)).toBe(false);
		(game.querySelector('[data-square="47"]') as HTMLElement).click();
		(game.querySelector('[data-square="45"]') as HTMLElement).click();
		const panel = game.querySelector(".tp-checkers-paths");
		expect(panel?.querySelectorAll("tp-button")).toHaveLength(3);
		(game.querySelector(".tp-checkers-paths tp-button") as HTMLElement).click();
		expect(game.fen).toContain("K45");
		expect(game.querySelectorAll(".tp-checkers-captured tp-icon")).toHaveLength(
			5,
		);
	});
	it("renders a locked 10 by 10 board and fifty numbered buttons", () => {
		const game = board();
		expect(game.querySelectorAll(".tp-checkers-square")).toHaveLength(100);
		expect(game.querySelectorAll("[data-square]")).toHaveLength(50);
		expect(game.querySelectorAll(".tp-checkers-board tp-icon")).toHaveLength(
			40,
		);
		expect(game.draggablePieces).toBe(false);
		expect(game.querySelectorAll('[data-square][tabindex="0"]')).toHaveLength(
			1,
		);
		expect(
			game.querySelectorAll(".tp-checkers-playback tp-icon-button"),
		).toHaveLength(5);
		expect(
			game
				.querySelector(".tp-checkers-board-column")
				?.contains(game.querySelector(".tp-checkers-footer")),
		).toBe(true);
	});
	it("loads maps and FEN, honors initial fen priority and preserves state on errors", () => {
		const game = new TpCheckers();
		game.setAttribute("position", "W:W32:B27,17");
		game.setAttribute("fen", "B:WK46:BK1");
		document.body.append(game);
		expect(game.fen).toBe("B:WK46:BK1");
		expect(game.setPosition({ "32": "wM", "17": "bM", "27": "bM" })).toBe(true);
		const old = game.fen;
		expect(game.setPosition("broken")).toBe(false);
		expect(game.fen).toBe(old);
	});
	it("highlights final capture destinations and plays the whole turn by clicks", () => {
		const game = board("W:W32:B17,27");
		expect(game.highlightLegalMove(32)).toEqual(["12"]);
		expect(game.legalMove(32, 21)).toBe(false);
		game.draggablePieces = true;
		(game.querySelector('[data-square="32"]') as HTMLElement).click();
		(game.querySelector('[data-square="12"]') as HTMLElement).click();
		expect(game.querySelector(".tp-checkers-last-move")?.textContent).toBe(
			"1. White man: 32 → 21 → 12",
		);
		expect(game.querySelectorAll(".tp-checkers-captured tp-icon")).toHaveLength(
			2,
		);
		expect(game.textContent).toContain("White wins");
	});
	it("replays captures and restores captured pieces on rewind", () => {
		const game = board("W:W32:B17,27");
		game.move(32, 12);
		const final = game.fen;
		game.previousMove();
		expect(game.querySelectorAll(".tp-checkers-captured tp-icon")).toHaveLength(
			0,
		);
		game.nextMove();
		expect(game.fen).toBe(final);
		game.rewind();
		game.nextMove();
		expect(game.fen).toBe(final);
	});
	it("flips the board without changing its turn and moves keyboard focus in display directions", () => {
		const game = board();
		const fen = game.fen;
		game.flip();
		expect(game.fen).toBe(fen);
		expect(
			game.querySelector("[data-square]")?.getAttribute("data-square"),
		).toBe("50");
		const cell = game.querySelector('[data-square="50"]') as HTMLElement;
		cell.focus();
		cell.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect((document.activeElement as HTMLElement).dataset.square).toBe("49");
	});
	it("supports timed playback, pause, reset and disconnection", () => {
		vi.useFakeTimers();
		const game = board();
		const initial = game.fen;
		game.playToEnd();
		vi.advanceTimersByTime(1999);
		expect(game.fen).toBe(initial);
		vi.advanceTimersByTime(1);
		expect(game.fen).not.toBe(initial);
		game.pause();
		const paused = game.fen;
		vi.advanceTimersByTime(4000);
		expect(game.fen).toBe(paused);
		game.playToEnd();
		game.remove();
		vi.advanceTimersByTime(4000);
		expect(game.fen).toBe(paused);
		document.body.append(game);
		game.reset();
		expect(game.fen).toBe(initial);
		game.clear();
		expect(game.fen).toBe(EMPTY_FEN);
		expect(game.play()).toBe(false);
	});
});
