import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { gameHelp } from "../../utilities/game-header-test-helpers.js";
import "./kakuro.js";
import { kakuroConflicts, parseKakuro, solveKakuro } from "./kakuro-model.js";

const introduction = readFileSync(
	"public/docs/components/kakuro/examples/introduction.html",
	"utf8",
);
const wiki = Array.from(
	introduction.matchAll(/<li><code>(.*?)<\/code><\/li>/g),
	(match) => match[1],
).join("\n");
const small = "# 3/0 4/0\n0/4 . .\n0/3 . .";
const solution = [
	"0 0 0 0 0 0 0 0",
	"0 9 7 0 0 8 7 9",
	"0 8 9 0 8 9 5 7",
	"0 6 8 5 9 7 0 0",
	"0 0 6 1 0 2 6 0",
	"0 0 0 4 6 1 3 2",
	"0 8 9 3 1 0 1 4",
	"0 3 1 2 0 0 2 1",
].flatMap((row) => row.split(" ").map(Number));
afterEach(() => document.body.replaceChildren());
function mount(puzzle = small) {
	const element = document.createElement("tp-kakuro");
	element.puzzle = puzzle;
	document.body.append(element);
	return element;
}
function action(element: HTMLElement, name: string) {
	if (["check", "hint", "solve"].includes(name)) gameHelp(element, name);
	else element.querySelector<HTMLElement>(`[data-action="${name}"]`)?.click();
}
function digit(input: HTMLInputElement, key: string) {
	input.dispatchEvent(
		new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
	);
}
function inputAt(element: HTMLElement, index = 0) {
	const input = element.querySelectorAll("input")[index];
	if (!input) throw new Error("Missing input");
	return input;
}
describe("Kakuro constraints", () => {
	it("solves the Wikipedia puzzle exactly as in the published solution", () => {
		const grid = parseKakuro(wiki);
		expect(grid.rows).toBe(8);
		expect(grid.columns).toBe(8);
		expect(
			solveKakuro(
				grid,
				grid.cells.map((cell) => cell.given),
			),
		).toEqual(solution);
		expect(kakuroConflicts(grid, solution).size).toBe(0);
	});
	it("detects repetition, wrong totals and impossible partial sums", () => {
		const grid = parseKakuro(small);
		const values = grid.cells.map((cell) => cell.given);
		values[4] = 3;
		values[5] = 3;
		expect(kakuroConflicts(grid, values).has(4)).toBe(true);
		values[5] = 0;
		expect(kakuroConflicts(grid, values).has(4)).toBe(true);
		expect(solveKakuro(grid, values)).toBeNull();
	});
	it.each([
		"",
		"# .\n# .",
		". . .\n. . .\n. . .",
		"# 50/0 4/0\n0/4 . .\n0/3 . .",
		"# 3/0 4/0\n0/1 . .\n0/3 . .",
		"# 3/0 4/0\n0/4 3 .\n0/3 . .",
	])("rejects malformed or contradictory puzzles: %s", (source) =>
		expect(() => parseKakuro(source)).toThrow(),
	);
	it("limits search instead of freezing on an excessive search", () => {
		const grid = parseKakuro(small);
		expect(() =>
			solveKakuro(
				grid,
				grid.cells.map((cell) => cell.given),
				0,
			),
		).toThrow("search limit");
	});
});
describe("tp-kakuro", () => {
	it("renders the introductory list with all clue labels", () => {
		document.body.innerHTML = introduction;
		const element = document.querySelector("tp-kakuro");
		expect(element?.querySelectorAll("input")).toHaveLength(36);
		expect(
			element?.querySelector("input")?.getAttribute("aria-label"),
		).toContain("down 23, across 16");
	});
	it("supports notes, digit input, deletion and undo/redo", () => {
		const element = mount();
		const input = inputAt(element);
		input.focus();
		expect(element.querySelector("[data-kakuro-mode-label]")?.textContent).toBe(
			"Game",
		);
		action(element, "notes");
		expect(element.querySelector("[data-kakuro-mode-label]")?.textContent).toBe(
			"Note",
		);
		digit(input, "2");
		expect(input.value).toBe("");
		expect(input.title).toBe("Notes: 2");
		action(element, "notes");
		expect(element.querySelector("[data-kakuro-mode-label]")?.textContent).toBe(
			"Game",
		);
		digit(input, "1");
		expect(input.value).toBe("1");
		expect(input.title).toBe("");
		action(element, "undo");
		expect(input.title).toBe("Notes: 2");
		expect(input.value).toBe("");
		action(element, "redo");
		expect(input.value).toBe("1");
		digit(input, "Delete");
		expect(input.value).toBe("");
		input.dispatchEvent(
			new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }),
		);
		expect(input.value).toBe("1");
	});
	it("reports conflicts without rejecting editable entries and accepts mobile input", () => {
		const element = mount();
		const input = inputAt(element);
		input.value = "9";
		input.dispatchEvent(new Event("input"));
		action(element, "check");
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(input.value).toBe("9");
		input.value = "x";
		input.dispatchEvent(new Event("input"));
		expect(input.value).toBe("9");
	});
	it("reveals a selected cell and the solution, emits completion and resets with undo", () => {
		const element = mount();
		const change = vi.fn();
		const complete = vi.fn();
		element.addEventListener("tp-kakuro-change", change);
		element.addEventListener("tp-kakuro-complete", complete);
		const input = inputAt(element);
		input.focus();
		digit(input, "9");
		action(element, "hint");
		expect(input.value).toBe("1");
		action(element, "solve");
		expect(
			Array.from(element.querySelectorAll("input"), (node) => node.value),
		).toEqual(["1", "3", "2", "1"]);
		expect(complete).toHaveBeenCalledTimes(1);
		expect(
			element.querySelector(".tp-kakuro-status")?.getAttribute("data-success"),
		).toBe("true");
		action(element, "check");
		expect(complete).toHaveBeenCalledTimes(1);
		const event = change.mock.calls.at(-1)?.[0];
		if (!(event instanceof CustomEvent))
			throw new Error("Missing change event");
		const detail = event.detail as { values: number[][] };
		detail.values[1]?.splice(1, 1, 9);
		expect(input.value).toBe("1");
		action(element, "reset");
		expect(input.value).toBe("");
		expect(
			element.querySelector(".tp-kakuro-status")?.getAttribute("data-success"),
		).toBe("false");
		action(element, "undo");
		expect(input.value).toBe("1");
		expect(complete).toHaveBeenCalledTimes(2);
		expect(
			element.querySelector(".tp-kakuro-status")?.getAttribute("data-success"),
		).toBe("true");
	});
	it("keeps fixed digits immutable and skips blocked cells with arrow navigation", () => {
		const element = mount(small.replace("0/4 . .", "0/4 1 ."));
		const input = inputAt(element);
		input.focus();
		digit(input, "9");
		expect(input.value).toBe("1");
		digit(input, "ArrowRight");
		expect(document.activeElement).toBe(inputAt(element, 1));
		digit(inputAt(element, 1), "ArrowDown");
		expect(document.activeElement).toBe(inputAt(element, 3));
	});
	it("preserves state on reconnection, reloads attributes and restores initial list", () => {
		document.body.innerHTML = introduction;
		const element = document.querySelector("tp-kakuro");
		if (!element) throw new Error("Missing game");
		digit(inputAt(element), "9");
		element.remove();
		document.body.append(element);
		expect(inputAt(element).value).toBe("9");
		element.puzzle = small;
		expect(element.querySelectorAll("input")).toHaveLength(4);
		element.removeAttribute("puzzle");
		expect(element.querySelectorAll("input")).toHaveLength(36);
		expect(inputAt(element).value).toBe("");
		element.puzzle = "invalid";
		expect(element.querySelector("[role=alert]")).not.toBeNull();
		element.puzzle = small;
		expect(element.querySelectorAll("input")).toHaveLength(4);
	});
	it("accepts any valid completion of an ambiguous puzzle", () => {
		const element = mount("# 3/0 3/0\n0/3 . .\n0/3 . .");
		["2", "1", "1", "2"].forEach((value, i) => {
			digit(inputAt(element, i), value);
		});
		expect(element.querySelector("[role=status]")?.textContent).toContain(
			"Solved!",
		);
	});
});
