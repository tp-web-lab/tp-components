import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { recordTypeScript } from "./recorder.js";

function last(code: string) {
	const result = recordTypeScript(code);
	const step = result.trace.at(-1);
	if (!step) throw new Error("No steps");
	return { result, step };
}
it("preserves original TypeScript source and line numbers without stepping through types", () => {
	const code =
		"interface Point { x: number; }\ntype Points = Point[];\nconst point: Point = { x: 7 };\nconsole.log(point.x);";
	const { result, step } = last(code);
	expect(result.language).toBe("typescript");
	expect(result.code).toBe(code);
	expect([
		...new Set(
			result.trace.filter((s) => s.event === "step_line").map((s) => s.line),
		),
	]).toEqual([3, 4]);
	expect(step.stdout).toBe("7\n");
	expect(Object.keys(step.globals)).toEqual(["point"]);
});
it("supports generics, assertions, satisfies and non-null assertions", () => {
	const { step } = last(
		"function identity<T>(value: T): T {return value;} const item = {n: 42} satisfies {n: number}; const n: number | undefined = identity(item.n); console.log((n! as number));",
	);
	expect(step.stdout).toBe("42\n");
	expect(step.exception_msg).toBeUndefined();
});
it("preserves constructor parameter properties and inheritance", () => {
	const { result, step } = last(
		"class Base { constructor(public value: number) {} } class Derived extends Base { constructor(value: number, public step: number) { super(value); } increment(): number {return this.value += this.step;} } const c = new Derived(3, 2); const alias = c; console.log(c.increment(), alias.value);",
	);
	expect(step.stdout).toBe("5 5\n");
	expect(step.globals.c).toEqual(step.globals.alias);
	expect(step.heap[step.globals.c[1]]).toContainEqual(["step", 2]);
	expect(
		result.trace.some((s) =>
			s.stack_to_render.some(
				(f: { func_name: string }) => f.func_name === "Derived.constructor",
			),
		),
	).toBe(true);
});
it("erases overload signatures without duplicate calls or phantom bindings", () => {
	const { step } = last(
		"declare const missing: number; function twice(n: number): number; function twice(n: number): number {return 2*n;} console.log(twice(3));",
	);
	expect(step.stdout).toBe("6\n");
	expect(Object.keys(step.globals)).toEqual(["twice"]);
});
it("retains runtime errors and does not pretend to perform type checking", () => {
	expect(last('const n: number = "text"; console.log(n);').step.stdout).toBe(
		"text\n",
	);
	expect(
		last("const x: unknown = null; console.log((x as {n: number}).n);").step
			.exception_msg,
	).toContain("TypeError");
});
it.each([
	"enum Direction { Left, Right }",
	"namespace Utils {}",
	"@sealed class Counter {}",
	"async function f() {}",
	"document.body",
	"const value: = 4;",
])("rejects unsupported or invalid syntax: %s", (code) => {
	expect(() => recordTypeScript(code)).toThrow();
});
it.each([
	["nested-arrays", "true\n[[1,2,5],[3,4],[1,2,5]]\n"],
	["recursion", "120\n"],
	["closures", "1\n2\n1\n"],
	["classes", "4\n4\ntrue\n"],
	["inheritance", "5\n7\ntrue\n"],
	["caught-exception", "Cannot divide by zero\ndone\n"],
	["uncaught-exception", ""],
	["loops", "[1,4,9,16]\n"],
])("executes the documented %s example", (name, output) => {
	const code = readFileSync(
		`public/docs/components/typescript-tracer/examples/${name}.ts`,
		"utf8",
	);
	const { step } = last(code);
	expect(step.stdout).toBe(output);
	if (name === "uncaught-exception")
		expect(step.exception_msg).toContain("TypeError");
	else expect(step.exception_msg).toBeUndefined();
});

it("highlights original subexpressions without repeating side effects", () => {
	const code =
		'const emoji = "😀"; let n = 0; const value = (++n + 3) * 4; false && ++n; console.log(value, n);';
	const result = recordTypeScript(code);
	expect(result.trace.at(-1)?.stdout).toBe("16 1\n");
	const highlighted = result.trace.map((step) =>
		step.source_range
			? code.slice(step.source_range.start, step.source_range.end)
			: "",
	);
	expect(highlighted).toContain("++n + 3");
	expect(highlighted).toContain("(++n + 3) * 4");
	expect(highlighted.filter((value) => value === "++n")).toHaveLength(1);
});
