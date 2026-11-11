import { expect, it } from "vitest";
import { LogigramModel } from "./logigram-model.js";
import { deriveLogigramResults } from "./logigram-results.js";

const puzzle = {
	title: "Test",
	categories: [
		{ name: "People", items: ["Ada", "Ben"] },
		{ name: "Drinks", items: ["Tea", "Juice"] },
		{ name: "Books", items: ["Poetry", "Science"] },
	],
	clues: ["A clue"],
	solution: [
		["Ada", "Tea", "Poetry"],
		["Ben", "Juice", "Science"],
	],
};
const results = (model: LogigramModel) =>
	deriveLogigramResults(model.puzzle.categories, model.cells, model.value);
it("leaves unknowns empty without looking at the solution", () => {
	const model = new LogigramModel(puzzle);
	expect(results(model)).toEqual({
		rows: [
			["Ada", null, null],
			["Ben", null, null],
		],
		conflict: false,
	});
	model.set(1, 1);
	expect(results(model).rows).toEqual([
		["Ada", "Juice", null],
		["Ben", "Tea", null],
	]);
});
it("propagates exclusions and transitive matches without changing player marks", () => {
	const model = new LogigramModel(puzzle);
	model.set(1, -1); // Ada is not Juice, therefore Tea.
	model.set(8, 1); // Tea is Poetry.
	const before = model.value;
	expect(results(model)).toEqual({ rows: puzzle.solution, conflict: false });
	expect(model.value).toEqual(before);
});
it("reports contradictions and recovers after undo", () => {
	const model = new LogigramModel(puzzle);
	model.set(0, 1);
	model.set(1, 1);
	expect(results(model).conflict).toBe(true);
	expect(results(model).rows[0]).toEqual(["Ada", null, null]);
	model.undo();
	expect(results(model).conflict).toBe(false);
});
it("rejects contradictory matches across three categories", () => {
	const model = new LogigramModel(puzzle);
	model.set(0, 1);
	model.set(4, 1);
	model.set(8, -1);
	expect(results(model).conflict).toBe(true);
});
