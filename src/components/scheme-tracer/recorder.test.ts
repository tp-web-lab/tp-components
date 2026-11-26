// @vitest-environment node
import { readFileSync } from "node:fs";
import { beforeAll, expect, it } from "vitest";

let recordScheme: typeof import("./recorder.js").recordScheme;
let lips: typeof import("./vendor/lips.js");

interface Frame {
	is_parent?: boolean;
	frame_id: string | number;
	encoded_locals: Record<string, unknown>;
}

beforeAll(async () => {
	const recorder = await import("./recorder.js");
	recordScheme = recorder.recordScheme;
	lips = await import("./vendor/lips.js");
	await recorder.initializeSchemeRecorder(
		`${process.cwd()}/src/components/scheme-tracer/vendor/std.xcb`,
		lips,
	);
});
const example = (name: string) =>
	readFileSync(
		`public/docs/components/scheme-tracer/examples/${name}.scm`,
		"utf8",
	);
async function record(code: string) {
	const result = await recordScheme(code);
	const last = result.trace.at(-1);
	if (!last) throw new Error("No snapshots");
	return { result, last };
}
it("records recursive parameters and results at original source positions", async () => {
	const code = example("recursion"),
		{ result, last } = await record(code);
	expect(result.code).toBe(code);
	expect(result.language).toBe("scheme");
	expect(last.stdout).toBe("120\n");
	expect(
		Math.max(
			...result.trace.map(
				(s) =>
					s.stack_to_render?.filter((f: Frame) => !f.is_parent).length || 0,
			),
		),
	).toBe(5);
	expect(
		result.trace.some(
			(s) =>
				s.event === "return" &&
				s.stack_to_render?.some(
					(f: Frame) =>
						JSON.stringify(f.encoded_locals.return) === '["SCHEME","120"]',
				),
		),
	).toBe(true);
	expect(
		result.trace
			.filter((s) => s.event === "step_line")
			.every((s) => s.line >= 1 && s.line <= 6),
	).toBe(true);
	expect(last.stack_to_render).toEqual([]);
});
it("preserves proper tail recursion with bounded active frames", async () => {
	const { result, last } = await record(example("tail-recursion"));
	expect(last.stdout).toBe("1275\n");
	expect(
		Math.max(
			...result.trace.map(
				(s) =>
					s.stack_to_render?.filter((f: Frame) => !f.is_parent).length || 0,
			),
		),
	).toBe(1);
});
it("retains separate captured environments and updates set! in place", async () => {
	const { result, last } = await record(example("closures"));
	expect(last.stdout).toBe("1\n2\n11\n");
	const captured =
		last.stack_to_render?.filter((f: Frame) => f.is_parent) || [];
	expect(captured.map((f: Frame) => f.encoded_locals.count)).toEqual(
		expect.arrayContaining([
			["SCHEME", "2"],
			["SCHEME", "11"],
		]),
	);
	expect(new Set(captured.map((f: Frame) => f.frame_id)).size).toBe(2);
	expect(
		result.trace.some((s) =>
			s.stack_to_render?.some(
				(f: Frame) =>
					JSON.stringify(f.encoded_locals.count) === '["SCHEME","1"]',
			),
		),
	).toBe(true);
});
it("preserves pair identity, shared tails and mutable car", async () => {
	const { last } = await record(example("shared-pairs"));
	const id = last.globals.shared[1];
	expect(last.heap[id]).toContainEqual(["car", ["SYMBOL", "changed"]]);
	expect(last.heap[last.globals.first[1]].slice(1)).toEqual([
		["car", ["REF", id]],
		["cdr", ["REF", id]],
	]);
	expect(last.stdout).toContain("#t\n");
});
it("preserves cycles after set-cdr! without recursively duplicating pairs", async () => {
	const { last } = await record(example("cyclic-pair"));
	const id = last.globals.ring[1];
	expect(last.heap[id]).toEqual([
		"PAIR",
		["car", ["SYMBOL", "changed"]],
		["cdr", ["REF", id]],
	]);
	expect(last.stdout).toBe("#t\nchanged\n");
});
it("preserves vector identity and mutation", async () => {
	const { last } = await record(example("vectors"));
	expect(last.globals.values).toEqual(last.globals.alias);
	expect(last.heap[last.globals.values[1]]).toEqual([
		"VECTOR",
		["SCHEME", "10"],
		["SCHEME", "99"],
		["SCHEME", "30"],
	]);
	expect(last.stdout).toBe("#(10 99 30)\n#t\n");
});
it("records higher-order callbacks and lexical variables", async () => {
	const { last, result } = await record(example("higher-order"));
	expect(last.stdout).toBe("(1 4 9 16)\n(3 6 9)\n");
	expect(
		result.trace.some((s) => s.event === "call" && s.stack_to_render?.length),
	).toBe(true);
	const local = await record(
		"(let ((x 2)) (let* ((x 4) (y (+ x 1))) (+ x y)))",
	);
	expect(
		local.result.trace.some((s) =>
			s.stack_to_render?.some(
				(f: Frame) => JSON.stringify(f.encoded_locals.y) === '["SCHEME","5"]',
			),
		),
	).toBe(true);
});
it("retains the failing call and line for errors", async () => {
	const { last } = await record(example("error"));
	expect(last.event).toBe("exception");
	expect(last.exception_msg).toContain("Expecting pair");
	expect(last.line).toBe(2);
	expect(last.stack_to_render?.at(-1)?.func_name).toBe("first-item");
});
it("bounds infinite recursion and leaves a replayable trace", async () => {
	const { last, result } = await record("(define (loop) (loop)) (loop)");
	expect(last.event).toBe("instruction_limit_reached");
	expect(result.trace.length).toBe(12001);
});
it("handles an empty source and syntax errors", async () => {
	expect((await record("; no program")).last.event).toBe("result");
	expect((await record("(define x")).last.event).toBe("exception");
});
it.each([
	"(call/cc (lambda (k) (k 1)))",
	"(define-syntax twice (syntax-rules () ((_ x) (+ x x))))",
	"(eval '(+ 1 2))",
	'(document.querySelector "body")',
])("reports excluded syntax explicitly: %s", async (code) => {
	expect((await record(code)).last.exception_msg).toContain(
		"outside synchronous Scheme tracing",
	);
});
it.each([
	"recursion",
	"tail-recursion",
	"closures",
	"shared-pairs",
	"cyclic-pair",
	"vectors",
	"higher-order",
])("matches unobserved LIPS evaluation for %s", async (name) => {
	const source = example(name),
		{ last } = await record(source);
	let output = "";
	const plain = new lips.Interpreter("baseline", {
		stdout: new lips.OutputPort((value: unknown) => {
			output += String(value);
		}),
	});
	const repr = plain.get("repr");
	const forms = await lips.parse(source);
	for (const form of forms) {
		const values = await plain.exec([form]);
		if (values.at(-1) !== undefined)
			output += `${String(repr(values.at(-1), true))}\n`;
	}
	expect(last.stdout).toBe(output);
});

it("separates setup results from query values without hiding explicit output", async () => {
	const result = await recordScheme(
		'(display "setup:") (write 3) (newline) (+ 1 2) (define x 4)',
		{ query: "(+ x 5)" },
	);
	expect(result.trace.at(-1)?.stdout).toBe("setup:3\n9\n");
	expect(result.setup_stdout).toBe("setup:3\n");
	expect(result.query_stdout).toBe("9\n");
	expect(result.code).toBe(
		'(display "setup:") (write 3) (newline) (+ 1 2) (define x 4)\n\n(+ x 5)',
	);
	expect(result.trace.some((step) => step.line === 3)).toBe(true);
	const plain = await recordScheme("(+ 1 2)");
	expect(plain.trace.at(-1)?.stdout).toBe("3\n");
	expect(plain.trace.at(-1)?.globals).toEqual({});
	const empty = await recordScheme("(+ 1 2)", { query: "" });
	expect(empty.trace.at(-1)?.stdout).toBe("");
});
it("allows readers in primitive tables and ordinary local definitions", async () => {
	const result = await recordScheme(
		"(define primitives (list (list 'read read))) (define (read) 42)",
		{ query: "(read)" },
	);
	expect(result.trace.at(-1)?.event).toBe("result");
	expect(result.trace.at(-1)?.stdout).toBe("42\n");
});
for (const query of [
	"(read)",
	"(let ((reader read)) (reader))",
	"(apply read '())",
	"((cadr (car primitives)))",
	"(map (lambda (unused) (read)) '(1))",
]) {
	it(`rejects actual input through ${query}`, async () => {
		const result = await recordScheme(
			"(define primitives (list (list 'read read)))",
			{ query },
		);
		expect(result.trace.at(-1)?.event).toBe("exception");
		expect(result.trace.at(-1)?.exception_msg).toContain(
			"read is outside synchronous Scheme tracing",
		);
	});
}

it("highlights nested expressions on the same line and preserves their result", async () => {
	const code = "(+ (* 3 5) (- 10 6))";
	const result = await recordScheme(code);
	expect(
		result.trace.map(
			(step) =>
				step.source_range &&
				result.code.slice(step.source_range.start, step.source_range.end),
		),
	).toEqual([code, "(* 3 5)", "(* 3 5)", "(- 10 6)", "(- 10 6)", code, code]);
	expect(result.trace.at(-1)?.stdout).toBe("19\n");
});
it("maps query columns and multiline expressions without confusing comments and strings", async () => {
	const source = "; 😀 (ignored)\n(define x 3)";
	const query = '(list "(not code)"\n  (+ x 2))';
	const result = await recordScheme(source, { query });
	const spans = result.trace.map(
		(step) =>
			step.source_range &&
			result.code.slice(step.source_range.start, step.source_range.end),
	);
	expect(spans).toContain(query);
	expect(spans).toContain("(+ x 2)");
	expect(spans).not.toContain("ignored");
});
it("points calls and returns to their call site and keeps stack changes", async () => {
	const result = await recordScheme(
		"(define (square x) (* x x))\n(square (+ 1 2))",
	);
	for (const step of result.trace.filter(
		(step) => step.event === "call" || step.event === "return",
	)) {
		expect(step.line).toBe(2);
		expect(
			step.source_range &&
				result.code.slice(step.source_range.start, step.source_range.end),
		).toBe("(square (+ 1 2))");
	}
	expect(result.trace.some((step) => step.event === "return")).toBe(true);
});
it("keeps an error visible on the failing expression", async () => {
	const result = await recordScheme("(car 42)");
	const last = result.trace.at(-1);
	expect(last?.event).toBe("exception");
	const invalid = await recordScheme('(display "unterminated)');
	expect(invalid.trace.at(-1)?.event).toBe("exception");
	expect(
		last?.source_range &&
			result.code.slice(last.source_range.start, last.source_range.end),
	).toBe("(car 42)");
});

it("completes cosine and sine/cosine fixed points within the recording budget", async () => {
	const source = `(define (fixed-point f guess)
  (let ((next (f guess)))
    (if (< (abs (- guess next)) 0.00001) next (fixed-point f next))))`;
	for (const [query, expected] of [
		["(fixed-point cos 1.0)", 0.7390822985224023],
		["(fixed-point (lambda (x) (+ (sin x) (cos x))) 1.0)", 1.2587315962971173],
	] as const) {
		const data = await recordScheme(source, { query });
		expect(data.trace.some((step) => /exception|limit/.test(step.event))).toBe(
			false,
		);
		expect(Number(data.trace.at(-1)?.stdout)).toBeCloseTo(expected, 14);
		expect(data.trace.length).toBeLessThan(1001);
		expect(
			data.trace.some((step) => step.expression && step.source_range),
		).toBe(true);
	}
});
