import { describe, expect, it } from "vitest";
import { createMathChecker } from "./math-checker.js";

describe("mathematical answer verdicts", () => {
	it("rejects the wrong difference quotient and still accepts a afterwards", () => {
		const check = createMathChecker();
		expect(
			check(
				String.raw`\frac{f(x)-f(a)}{x-a}`,
				String.raw`\frac{f(a+h)-f(a)}{h}`,
			),
		).toBe(false);
		expect(check("a", "a")).toBe(true);
		expect(check("a", String.raw`\displaystyle a`)).toBe(true);
	});
	it("accepts equivalent quotients without depending on their spelling", () => {
		const check = createMathChecker();
		expect(
			check(
				String.raw`\frac{f(a)-f(x)}{a-x}`,
				String.raw`\frac{f(x)-f(a)}{x-a}`,
			),
		).toBe(true);
		expect(check("1+x^2", "x^2+1")).toBe(true);
	});
	it("rejects different variables without making math case insensitive", () => {
		const check = createMathChecker();
		expect(check("a", "x")).toBe(false);
		expect(check("A", "a")).toBe(false);
	});
	it("never treats a handful of agreeing sample points as a proof", () => {
		const check = createMathChecker();
		expect(check(String.raw`\sin(x)`, String.raw`\cos(x)`)).not.toBe(true);
		expect(check(String.raw`\frac{`, "a")).toBeUndefined();
	});
});

it("reports the actual comparison stage for rearranged answers", () => {
	const check = createMathChecker();
	const stages: string[] = [];
	const report = (stage: string) => stages.push(stage);
	expect(
		check(
			String.raw`\frac{f(x) - f(a)}{-(a-x)}`,
			String.raw`\displaystyle\frac{f(x)-f(a)}{x-a}`,
			report,
		),
	).toBe(true);
	expect(stages).toEqual(["simplification"]);
	stages.length = 0;
	expect(check("1+x^2", "x^2+1", report)).toBe(true);
	expect(stages).toEqual(["normalization"]);
	stages.length = 0;
	expect(
		check(
			String.raw`\frac{f(x) - f(a)}{x-a}`,
			String.raw`\displaystyle\frac{f(x)-f(a)}{x-a}`,
			report,
		),
	).toBe(true);
	expect(stages).toEqual([]);
	expect(check("a", "x", report)).toBe(false);
	expect(stages).toEqual([]);
});
