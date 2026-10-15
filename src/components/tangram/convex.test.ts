import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	area,
	at,
	type Point,
	parseSolution,
	polygon,
	SQUARE_SOURCE,
	validate,
} from "./geometry.js";

function hull(points: Point[]): Point[] {
	// Rotation introduces sub-ulp differences at shared vertices; normalize before sorting.
	const unique = new Map(
		points.map((p) => {
			const q = {
				x: Math.round(p.x * 1e9) / 1e9,
				y: Math.round(p.y * 1e9) / 1e9,
			};
			return [`${q.x},${q.y}`, q];
		}),
	);
	const sorted = [...unique.values()].sort((a, b) => a.x - b.x || a.y - b.y);
	const turn = (a: Point, b: Point, c: Point): number =>
		(b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	const half = (input: Point[]): Point[] => {
		const result: Point[] = [];
		for (const p of input) {
			while (
				result.length >= 2 &&
				turn(at(result, result.length - 2), at(result, result.length - 1), p) <=
					1e-7
			)
				result.pop();
			result.push(p);
		}
		return result.slice(0, -1);
	};
	return [...half(sorted), ...half([...sorted].reverse())];
}
describe("thirteen reference convex tangrams", () => {
	const counts = [3, 6, 4, 4, 4, 4, 4, 6, 4, 5, 5, 6, 6];
	for (let i = 1; i <= 13; i++)
		it(`loads figure ${i} with seven pieces and a convex outline of area 16`, () => {
			const filename = `convex-${String(i).padStart(2, "0")}.txt`;
			const source = readFileSync(
				resolve(
					process.cwd(),
					`public/docs/components/tangram/examples/${filename}`,
				),
				"utf8",
			);
			const solution = parseSolution(source);
			expect(() => validate(solution)).not.toThrow();
			expect(
				solution
					.map((p) => area(polygon(p)))
					.sort((a, b) => a - b)
					.map((a) => Math.round(a)),
			).toEqual([1, 1, 2, 2, 2, 4, 4]);
			const outline = hull(solution.flatMap(polygon));
			expect(outline).toHaveLength(at(counts, i - 1));
			// Valid disjoint pieces have total area 16. Equal hull area excludes gaps and concavities.
			expect(area(outline)).toBeCloseTo(16, 7);
			expect(
				readFileSync(
					resolve(
						process.cwd(),
						`public/demos/components/tangram/examples/${filename}`,
					),
					"utf8",
				),
			).toBe(source);
		});
	it("applies grid scaling to named points and midpoints exactly once", () => {
		const source =
			"grid sqrt2\n" +
			SQUARE_SOURCE.replaceAll("(4, 0)", "(2.8284271247461903, 0)")
				.replaceAll("(4, 4)", "(2.8284271247461903, 2.8284271247461903)")
				.replaceAll("(0, 4)", "(0, 2.8284271247461903)");
		expect(() => validate(parseSolution(source))).not.toThrow();
	});
	it("rejects late, repeated or unsupported grid directives", () => {
		for (const source of [
			"grid 0",
			"grid 2",
			"grid sqrt2\ngrid sqrt2",
			"point A = (0,0)\ngrid sqrt2",
		])
			expect(() => parseSolution(source)).toThrow(/Line [0-9]+:/);
	});
});
