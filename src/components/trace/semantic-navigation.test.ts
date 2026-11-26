import { expect, it } from "vitest";
import {
	queryStepIndex,
	stepOutIndex,
	stepOverIndex,
} from "./semantic-navigation.js";
import { parseTrace } from "./trace-file.js";

const frame = (id: number) => ({
	frame_id: id,
	func_name: "recursive",
	is_highlighted: true,
});
const step = (ids: number[], event = "step_line") => ({
	event,
	stack_to_render: ids.map((n, i) => ({
		...frame(n),
		is_highlighted: i === ids.length - 1,
	})),
});
it("steps over recursive calls by invocation identity, not function name", () => {
	const steps = [
		step([]),
		step([1], "call"),
		step([1]),
		step([1, 2], "call"),
		step([1, 2], "return"),
		step([1]),
		step([1], "return"),
		step([]),
	];
	const saved = JSON.stringify(steps);
	expect(stepOverIndex(steps, 0)).toBe(7);
	expect(stepOverIndex(steps, 2)).toBe(5);
	expect(stepOutIndex(steps, 3)).toBe(5);
	expect(stepOutIndex(steps, 1)).toBe(7);
	expect(stepOutIndex(steps, 0)).toBe(0);
	expect(JSON.stringify(steps)).toBe(saved);
});
it("ignores captured frames and stops on exceptions and truncated recordings", () => {
	const steps = [
		step([1]),
		{ ...step([1, 2]), exception_msg: "boom" },
		step([]),
	];
	expect(stepOutIndex(steps, 0)).toBe(1);
	expect(stepOverIndex(steps, 0)).toBe(1);
	expect(
		stepOutIndex([step([1]), step([1], "instruction_limit_reached")], 0),
	).toBe(1);
	const captured = {
		frame_id: 1,
		func_name: "recursive",
		is_zombie: true,
		is_highlighted: false,
	};
	expect(
		stepOutIndex([step([1]), { ...step([]), stack_to_render: [captured] }], 0),
	).toBe(1);
});
it("follows Scheme tail-call continuations without treating them as returns", () => {
	const first = { ...frame(1), continuation_id: 1 };
	const replacement = { ...frame(2), continuation_id: 1 };
	expect(
		stepOutIndex(
			[
				{ event: "call", stack_to_render: [first] },
				{ event: "call", stack_to_render: [replacement] },
				step([]),
			],
			0,
		),
	).toBe(2);
});
it("query navigation requires an explicit boundary, preserves Unicode offsets and validates replay", () => {
	const source = 'const s="😀";',
		query = "f();",
		code = `${source}\n\n${query}`;
	const trace = [
		{ event: "step_line", source_range: { start: 0, end: source.length } },
		{
			event: "step_line",
			source_range: { start: source.length + 2, end: code.length },
		},
	];
	expect(queryStepIndex(trace, source, query)).toBe(1);
	expect(queryStepIndex(trace, undefined, undefined)).toBe(-1);
	for (const language of [
		"python",
		"javascript",
		"typescript",
		"scheme",
		"ocaml",
	]) {
		const data = { version: 1, language, code, source, query, trace };
		expect(parseTrace(JSON.stringify(data))).toEqual(data);
		expect(() =>
			parseTrace(JSON.stringify({ ...data, source: "wrong" })),
		).toThrow();
	}
});
it("legacy traces without invocation ids do not invent a call stack", () => {
	expect(
		stepOutIndex(
			[{ event: "step_line", stack_to_render: [{ func_name: "f" }] }],
			0,
		),
	).toBe(0);
});
