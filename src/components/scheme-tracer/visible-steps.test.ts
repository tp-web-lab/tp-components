import { expect, it } from "vitest";
import { compactSchemeSteps, schemeVisibleState } from "./visible-steps.js";

const step = {
	event: "step_line",
	line: 1,
	source_range: { start: 0, end: 5 },
	globals: { x: 1 },
	heap: {},
	stack_to_render: [],
	stdout: "",
};
it("groups consecutive identical states despite internal event names", () => {
	const result = compactSchemeSteps([step, { ...step, event: "result" }, step]);
	expect(result).toHaveLength(1);
	expect(result[0].grouped_steps).toBe(3);
	expect(step).not.toHaveProperty("grouped_steps");
	expect(compactSchemeSteps(result)).toEqual(result);
});
it("keeps expression, variable, heap, stack, output and error changes", () => {
	for (const change of [
		{ source_range: { start: 1, end: 5 } },
		{ globals: { x: 2 } },
		{ heap: { 1: ["PAIR", ["car", 1], ["cdr", 2]] } },
		{ stack_to_render: [{ func_name: "f", frame_id: 1 }] },
		{ stdout: "1" },
		{ exception_msg: "error", event: "exception" },
		{ event: "instruction_limit_reached" },
	]) {
		expect(compactSchemeSteps([step, { ...step, ...change }])).toHaveLength(2);
	}
});
it("also compacts legacy recordings without inventing expression positions", () => {
	const legacy = { event: "step_line", line: 1, stdout: "" };
	const compact = compactSchemeSteps([legacy, { ...legacy, event: "result" }]);
	expect(compact).toHaveLength(1);
	expect(compact[0]).not.toHaveProperty("source_range");
	expect(schemeVisibleState(compact[0])).toBe(schemeVisibleState(legacy));
});
