// @vitest-environment node
import { expect, it } from "vitest";
import { packTrace, serializeTrace, unpackTrace } from "./trace-codec.js";
import { parseTrace } from "./trace-file.js";

it("round-trips long Scheme recordings without losing mutations or intermediate values", () => {
	const trace = Array.from({ length: 12000 }, (_, i) => ({
		event: "expression",
		line: 1,
		source_range: { start: 0, end: 3 },
		expression: { value: i },
		globals: { x: i },
		heap: { 1: ["PAIR", ["car", i], ["cdr", null]] },
		stdout: i > 6000 ? "hello" : "",
	}));
	const data = {
		version: 1,
		language: "scheme",
		code: "(+)",
		setup_stdout: "",
		query_stdout: "hello",
		trace,
	};
	const saved = serializeTrace(data);
	expect(saved.length).toBeLessThan(10000000);
	expect(parseTrace(saved)).toEqual(data);
	expect(serializeTrace(parseTrace(saved))).toBe(saved);
});
it("preserves distinct snapshots while sharing unchanged encoded objects", () => {
	const data = {
		trace: [
			{ heap: { 1: ["LIST", 1] } },
			{ heap: { 1: ["LIST", 2] } },
			{ heap: { 1: ["LIST", 2] } },
		],
	};
	const result = unpackTrace(packTrace(data));
	expect(result).toEqual(data);
	expect(result.trace[1].heap).toBe(result.trace[2].heap);
	expect(result.trace[0].heap).not.toBe(result.trace[1].heap);
});
it("rejects forward references and exponential compact input", () => {
	expect(() =>
		unpackTrace({
			version: 2,
			encoding: "tp-trace-pool-v1",
			nodes: [{ a: [{ $: 0 }] }],
			root: { $: 0 },
		}),
	).toThrow(/reference/);
	const nodes: { a: unknown[] }[] = [{ a: ["large"] }];
	for (let i = 1; i < 40; i++) nodes.push({ a: [{ $: i - 1 }, { $: i - 1 }] });
	expect(() =>
		unpackTrace({
			version: 2,
			encoding: "tp-trace-pool-v1",
			nodes,
			root: { $: 39 },
		}),
	).toThrow(/too large/);
});
it("keeps short legacy JSON and author property names readable", () => {
	const data = JSON.parse(
		'{"version":1,"code":"x","trace":[{"event":"step_line","globals":{"__proto__":1}}]}',
	);
	expect(parseTrace(serializeTrace(data))).toEqual(data);
	expect(unpackTrace(packTrace(data))).toEqual(data);
});
