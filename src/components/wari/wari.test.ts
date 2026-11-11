import { afterEach, describe, expect, it, vi } from "vitest";
import { TpWari } from "./wari.js";
import { DEFAULT_POSITION, EMPTY_POSITION, WariGame } from "./wari-model.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
});
function board(position = DEFAULT_POSITION): TpWari {
	const el = new TpWari();
	el.setAttribute("position", position);
	document.body.append(el);
	return el;
}
describe("Oware Abapa engine", () => {
	it("starts with twelve pits, 48 seeds and six legal South moves", () => {
		const game = new WariGame();
		expect(game.snapshot().pits).toEqual(Array(12).fill(4));
		expect(game.legalMoves()).toEqual([1, 2, 3, 4, 5, 6]);
		const move = game.move(3);
		expect(move.path).toEqual([4, 5, 6, 7]);
		expect(game.turn()).toBe("north");
		expect(game.snapshot().pits).toEqual([4, 4, 0, 5, 5, 5, 5, 4, 4, 4, 4, 4]);
	});
	it("skips the source pit on every lap", () => {
		const game = new WariGame("S:12,0,0,0,0,0,4,0,0,0,0,0:16,16");
		const move = game.move(1);
		expect(move.path).toHaveLength(12);
		expect(move.path).not.toContain(1);
		expect(move.to).toBe(2);
		expect(game.snapshot().pits[0]).toBe(0);
		expect(game.snapshot().pits[1]).toBe(2);
	});
	it("captures consecutive opponent pits with two or three seeds backwards", () => {
		const game = new WariGame("S:4,0,0,0,3,0,1,2,1,0,0,0:18,19");
		const move = game.move(5);
		expect(move.captures).toEqual([
			{ pit: 8, seeds: 3 },
			{ pit: 7, seeds: 2 },
		]);
		expect(game.snapshot().scores).toEqual([23, 19]);
		expect(game.snapshot().pits.slice(6, 9)).toEqual([0, 0, 1]);
	});
	it("voids a grand slam while preserving the sowing", () => {
		const game = new WariGame("S:1,0,0,0,0,1,1,0,0,0,0,0:22,23");
		const move = game.move(6);
		expect(move.grandSlam).toBe(true);
		expect(move.captures).toEqual([]);
		expect(game.snapshot().scores).toEqual([22, 23]);
		expect(game.snapshot().pits[6]).toBe(2);
		expect(game.isGameOver()).toBe(false);
	});
	it("requires feeding an empty opposing row", () => {
		const game = new WariGame("S:1,0,0,0,0,1,0,0,0,0,0,0:23,23");
		expect(game.legalMoves()).toEqual([6]);
		expect(() => game.move(1)).toThrow();
		game.move(6);
		expect(game.snapshot().pits[6]).toBe(1);
	});
	it("collects remaining seeds when feeding is impossible, with score-based wins or draws", () => {
		const game = new WariGame("S:1,0,0,0,0,0,0,0,0,0,0,0:23,24");
		expect(game.isGameOver()).toBe(true);
		expect(game.snapshot().scores).toEqual([24, 24]);
		expect(game.result()).toContain("Draw");
		const win = new WariGame("S:3,0,0,0,0,0,0,0,0,0,0,0:23,22");
		expect(win.result()).toContain("South wins");
		expect(win.snapshot().scores).toEqual([26, 22]);
	});
	it("ends at 25 captured seeds and restores the pre-capture position on undo", () => {
		const game = new WariGame("S:4,0,0,0,3,0,1,2,1,0,0,0:20,17");
		const before = game.position();
		game.move(5);
		expect(game.snapshot().scores[0]).toBe(25);
		expect(game.isGameOver()).toBe(true);
		game.undo();
		expect(game.position()).toBe(before);
		expect(game.isGameOver()).toBe(false);
	});
	it("validates totals, turn, pit counts and scores; snapshots are independent", () => {
		for (const invalid of [
			"S:4,4:0,0",
			"N:4,4,4,4,4,4,4,4,4,4,4,4:1,0",
			"X:4,4,4,4,4,4,4,4,4,4,4,4:0,0",
		])
			expect(() => new WariGame(invalid)).toThrow();
		const game = new WariGame();
		const state = game.snapshot();
		state.pits[0] = 0;
		state.scores[0] = 30;
		expect(game.position()).toBe(DEFAULT_POSITION);
		expect(new WariGame(EMPTY_POSITION).result()).toContain("Empty board");
	});
	it("conserves all 48 seeds through complete deterministic games and undo", () => {
		let seed = 42;
		for (let n = 0; n < 8; n++) {
			const game = new WariGame();
			let steps = 0;
			while (!game.isGameOver() && steps < 5000) {
				seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
				const choices = game.legalMoves();
				const pit = choices[seed % choices.length];
				expect(pit).toBeDefined();
				if (pit === undefined) break;
				const before = game.position();
				const move = game.move(pit);
				const state = game.snapshot();
				expect(
					[...state.pits, ...state.scores].reduce((a, b) => a + b, 0),
				).toBe(48);
				game.undo();
				expect(game.position()).toBe(before);
				expect(game.move(pit)).toEqual(move);
				steps++;
			}
			expect(game.isGameOver()).toBe(true);
		}
	});
});
describe("repetition", () => {
	it("settles a third occurrence by collecting each side and restores the cycle on undo", () => {
		const game = new WariGame("S:1,0,0,0,0,0,1,0,0,0,0,0:23,23");
		for (let cycle = 0; cycle < 2; cycle++)
			for (const pit of [1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 6, 12]) game.move(pit);
		expect(game.result()).toContain("Threefold repetition");
		expect(game.snapshot().scores).toEqual([24, 24]);
		game.undo();
		expect(game.isGameOver()).toBe(false);
		game.move(12);
		expect(game.result()).toContain("Threefold repetition");
	});
});
describe("tp-wari", () => {
	it("renders twelve pits, scores and five playback buttons under the board", () => {
		const game = board();
		expect(game.querySelectorAll("[data-pit]")).toHaveLength(12);
		expect(game.querySelectorAll(".tp-wari-seed")).toHaveLength(48);
		expect(game.interactive).toBe(false);
		expect(game.querySelectorAll('[data-pit][tabindex="0"]')).toHaveLength(1);
		expect(
			game.querySelectorAll(".tp-wari-playback tp-icon-button"),
		).toHaveLength(5);
		expect(
			game
				.querySelector(".tp-wari-board-column")
				?.contains(game.querySelector(".tp-wari-footer")),
		).toBe(true);
	});
	it("plays clicks, emits complete move data and numbers both players' turns", () => {
		const game = board();
		game.interactive = true;
		const listener = vi.fn();
		game.addEventListener("tp-wari-move", listener);
		(game.querySelector('[data-pit="3"]') as HTMLElement).click();
		expect(game.querySelector(".tp-wari-last-move")?.textContent).toBe(
			"1. South: 3 → 7",
		);
		game.move(7);
		expect(game.querySelector(".tp-wari-last-move")?.textContent).toBe(
			"1… North: 7 → 12",
		);
		expect(listener).toHaveBeenCalledTimes(2);
		const event = listener.mock.calls[0]?.[0] as CustomEvent;
		expect(event.detail.path).toEqual([4, 5, 6, 7]);
	});
	it("rewinds captures and replays the same scores and outcome", () => {
		const game = board("S:4,0,0,0,3,0,1,2,1,0,0,0:20,17");
		const initial = game.position;
		game.move(5);
		expect(game.scores).toEqual([25, 17]);
		const final = game.position;
		game.previousMove();
		expect(game.scores).toEqual([20, 17]);
		game.nextMove();
		expect(game.position).toBe(final);
		game.rewind();
		expect(game.position).toBe(initial);
		game.nextMove();
		expect(game.position).toBe(final);
	});
	it("preserves the loaded board on invalid input and resets reflected positions", () => {
		const game = board();
		game.move(3);
		const current = game.position;
		expect(game.setPosition("invalid")).toBe(false);
		expect(game.position).toBe(current);
		game.reset();
		expect(game.position).toBe(DEFAULT_POSITION);
		expect(game.getAttribute("position")).toBe(DEFAULT_POSITION);
		game.clear();
		expect(game.position).toBe(EMPTY_POSITION);
		expect(game.play()).toBe(false);
	});
	it("flips the view and navigates pits in visual directions without changing the turn", () => {
		const game = board();
		game.flip();
		expect(game.querySelector("[data-pit]")?.getAttribute("data-pit")).toBe(
			"6",
		);
		expect(game.turn).toBe("south");
		const pit = game.querySelector('[data-pit="6"]') as HTMLElement;
		pit.focus();
		pit.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
		);
		expect((document.activeElement as HTMLElement).dataset.pit).toBe("7");
	});
	it("pauses autoplay and disconnection, preserves history, and leaves API play unlocked", () => {
		vi.useFakeTimers();
		const game = board();
		const initial = game.position;
		expect(game.move(3)).toBe(true);
		game.reset();
		game.playToEnd();
		vi.advanceTimersByTime(1999);
		expect(game.position).toBe(initial);
		vi.advanceTimersByTime(1);
		expect(game.position).not.toBe(initial);
		game.pause();
		const paused = game.position;
		vi.advanceTimersByTime(4000);
		expect(game.position).toBe(paused);
		game.playToEnd();
		game.remove();
		vi.advanceTimersByTime(4000);
		document.body.append(game);
		expect(game.position).toBe(paused);
		vi.advanceTimersByTime(4000);
		expect(game.position).toBe(paused);
	});
	it("enforces the chosen human side and discards a replaced recorded continuation", () => {
		const game = board();
		game.move(3);
		game.move(7);
		game.rewind();
		game.move(1);
		game.nextMove();
		expect(game.querySelectorAll(".tp-wari-history li")).toHaveLength(2);
		game.reset();
		game.play("user/random", "north");
		const initial = game.position;
		(game.querySelector('[data-pit="3"]') as HTMLElement).click();
		expect(game.position).toBe(initial);
		game.pause();
	});
});
