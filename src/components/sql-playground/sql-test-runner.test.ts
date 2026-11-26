import { expect, it } from "vitest";
import { compareSqlResults } from "./sql-test-runner.js";

it("compares column names and SQL value types exactly", () => {
	const result = [{ columns: ["value"], values: [[1], [null]] }];
	expect(
		compareSqlResults(
			result,
			[{ columns: ["value"], values: [["1"], [null]] }],
			true,
		),
	).toBe(false);
	expect(
		compareSqlResults(
			result,
			[{ columns: ["VALUE"], values: [[1], [null]] }],
			true,
		),
	).toBe(false);
	expect(compareSqlResults(result, result, true)).toBe(true);
});
it("ignores row order only on request and preserves duplicate counts", () => {
	const result = [{ columns: ["value"], values: [[1], [1], [2]] }];
	const reordered = [{ columns: ["value"], values: [[2], [1], [1]] }];
	expect(compareSqlResults(result, reordered, true)).toBe(false);
	expect(compareSqlResults(result, reordered, false)).toBe(true);
	expect(
		compareSqlResults(
			result,
			[{ columns: ["value"], values: [[2], [1]] }],
			false,
		),
	).toBe(false);
});
it("distinguishes an empty SELECT from no result set and keeps result-set order", () => {
	const empty = [{ columns: ["value"], values: [] }];
	expect(compareSqlResults(empty, [], true)).toBe(false);
	const one = { columns: ["a"], values: [[1]] };
	const two = { columns: ["b"], values: [[2]] };
	expect(compareSqlResults([one, two], [two, one], false)).toBe(false);
});
