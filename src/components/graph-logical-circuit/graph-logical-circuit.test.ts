import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubMathJaxRuntime } from "../../test-helpers/mathjax.js";
import { required } from "../../test-helpers/required.js";

beforeEach(() => {
	stubMathJaxRuntime();
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

import fullAdderExample from "../../../public/docs/components/graph-logical-circuit/examples/full-adder.json";
import nandOnlyExample from "../../../public/docs/components/graph-logical-circuit/examples/nand-only.json";
import type { TpGraphDocument } from "../graph-editor/graph-editor.js";
import {
	evaluateLogicalCircuit,
	getLogicalEquations,
	TP_LOGIC_AND,
	TP_LOGIC_INPUT,
	TP_LOGIC_NOT,
	TP_LOGIC_OUTPUT,
	TP_LOGIC_WIRE,
	TpGraphLogicalCircuit,
} from "./graph-logical-circuit.js";

const AND_CIRCUIT: TpGraphDocument = {
	version: 1,
	nodes: [
		{ id: "a", type: TP_LOGIC_INPUT, x: 80, y: 80, state: { value: false } },
		{ id: "b", type: TP_LOGIC_INPUT, x: 80, y: 180, state: { value: true } },
		{ id: "and", type: TP_LOGIC_AND, x: 260, y: 130 },
		{ id: "out", type: TP_LOGIC_OUTPUT, x: 440, y: 130 },
	],
	edges: [
		{ id: "a-and", source: "a", target: "and", type: "logic-wire" },
		{ id: "b-and", source: "b", target: "and", type: "logic-wire" },
		{ id: "and-out", source: "and", target: "out", type: "logic-wire" },
	],
};

describe("<tp-graph-logical-circuit>", () => {
	it("implements the documented full adder", () => {
		const source = fullAdderExample as TpGraphDocument;
		for (let combination = 0; combination < 8; combination += 1) {
			const graph = structuredClone(source);
			const values = ["a", "b", "cin"].map(
				(_, index) => (combination & (1 << (2 - index))) !== 0,
			);
			for (const [index, id] of ["a", "b", "cin"].entries()) {
				const input = graph.nodes.find((node) => node.id === id);
				if (input) input.state = { value: values[index] };
			}
			const evaluated = evaluateLogicalCircuit(graph);
			const trueCount = values.filter(Boolean).length;
			expect(
				evaluated.nodes.find((node) => node.id === "sum")?.state?.value,
			).toBe(trueCount % 2 === 1);
			expect(
				evaluated.nodes.find((node) => node.id === "carry")?.state?.value,
			).toBe(trueCount >= 2);
		}
	});

	it("implements the documented NAND-only expression", () => {
		const source = nandOnlyExample as TpGraphDocument;
		expect(
			source.nodes
				.filter(
					(node) =>
						node.type.startsWith("logic-") &&
						node.type !== TP_LOGIC_INPUT &&
						node.type !== TP_LOGIC_OUTPUT,
				)
				.every((node) => node.type === "logic-nand"),
		).toBe(true);
		for (let combination = 0; combination < 16; combination += 1) {
			const graph = structuredClone(source);
			const values = ["a", "b", "c", "d"].map(
				(_, index) => (combination & (1 << (3 - index))) !== 0,
			);
			for (const [index, id] of ["a", "b", "c", "d"].entries()) {
				const input = graph.nodes.find((node) => node.id === id);
				if (input) input.state = { value: values[index] };
			}
			const evaluated = evaluateLogicalCircuit(graph);
			const expected = !(values[0] || values[1]) && !(!values[2] && !values[3]);
			expect(
				evaluated.nodes.find((node) => node.id === "s")?.state?.value,
			).toBe(expected);
		}
	});

	it("renders one west input port on a NOT gate", async () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = {
			version: 1,
			nodes: [{ id: "not", type: TP_LOGIC_NOT, x: 100, y: 100 }],
			edges: [],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const ports = editor.querySelectorAll('[data-node-id="not"] [data-port]');
		expect(ports).toHaveLength(2);
		expect(
			editor.querySelector('[data-node-id="not"] [data-port="west"]'),
		).not.toBeNull();
		expect(
			editor.querySelector('[data-node-id="not"] [data-port="north"]'),
		).toBeNull();
		expect(
			editor.querySelector('[data-node-id="not"] [data-port="south"]'),
		).toBeNull();
	});

	it("preserves the selected dark theme when switching gate representation", async () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const theme = editor.querySelector<HTMLElement>("tp-theme");
		theme?.setAttribute("mode", "dark");
		expect(editor.classList.contains("tp-dark")).toBe(true);
		editor.toggleRepresentation();
		expect(editor.representation).toBe("ansi");
		expect(editor.querySelector("tp-theme")?.getAttribute("mode")).toBe("dark");
		expect(editor.classList.contains("tp-dark")).toBe(true);
	});

	it("renders the complete truth table before the JSON editor", async () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.querySelector(".tp-graph-results-header")?.textContent).toBe(
			"Truth table",
		);
		expect(editor.querySelectorAll(".tp-graph-results tbody tr")).toHaveLength(
			4,
		);
		const results = editor.querySelector(".tp-graph-results");
		const code = editor.querySelector(".tp-graph-code");
		expect(results?.nextElementSibling).toBe(code);
	});

	it("places named wire measurements between inputs and outputs in the truth table", async () => {
		const editor = new TpGraphLogicalCircuit();
		const graph = structuredClone(AND_CIRCUIT);
		const wire = graph.edges.find((edge) => edge.id === "and-out");
		if (wire)
			wire.data = {
				measurements: [{ id: "probe-s", label: "S", position: 0.5 }],
			};
		editor.value = graph;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const headers = [...editor.querySelectorAll(".tp-graph-results th")].map(
			(cell) => cell.textContent,
		);
		expect(headers).toEqual(["a", "b", "S", "out"]);
		expect(
			editor.querySelectorAll(
				".tp-graph-results thead .tp-logic-truth-boundary",
			),
		).toHaveLength(2);
		expect(
			editor.querySelectorAll(
				".tp-graph-results tbody tr:first-child .tp-logic-truth-boundary",
			),
		).toHaveLength(2);
		expect(editor.querySelectorAll(".tp-graph-results tbody tr")).toHaveLength(
			4,
		);
	});

	it("derives one LaTeX logical equation for every output", async () => {
		const equations = getLogicalEquations(AND_CIRCUIT);
		expect(equations).toEqual([
			{
				outputId: "out",
				output: "out",
				latex: String.raw`\mathrm{out} = \left(\mathrm{a} \cdot \mathrm{b}\right)`,
			},
		]);
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.querySelector(".tp-logic-results-layout")).not.toBeNull();
		expect(
			editor.querySelector("tp-markdown.tp-logic-equation"),
		).not.toBeNull();
		for (
			let attempt = 0;
			attempt < 20 && !editor.querySelector("[data-mathjax-tex]");
			attempt += 1
		) {
			await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
		}
		const renderedEquation = editor.querySelector("[data-mathjax-tex]");
		expect(renderedEquation?.getAttribute("data-mathjax-tex")).toBe(
			equations[0]?.latex,
		);
		expect(renderedEquation?.getAttribute("data-mathjax-display")).toBe(
			"false",
		);
	});

	it("toggles logical equations from electronic to mathematical notation", async () => {
		expect(getLogicalEquations(AND_CIRCUIT, "mathematical")[0]?.latex).toBe(
			String.raw`\mathrm{out} = \left(\mathrm{a} \land \mathrm{b}\right)`,
		);
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const button = editor.querySelector<HTMLElement>(
			'[data-logic-action="equation-notation"]',
		);
		expect(button?.getAttribute("name")).toBe("function");
		expect(button?.getAttribute("label")).toBe("Use mathematical notation");
		button?.click();
		expect(editor.equationNotation).toBe("mathematical");
		expect(
			editor
				.querySelector('[data-logic-action="equation-notation"]')
				?.getAttribute("label"),
		).toBe("Use electronic notation");
	});

	it("evaluates combinational gates", () => {
		const first = evaluateLogicalCircuit(AND_CIRCUIT);
		expect(first.nodes.find((node) => node.id === "out")?.state?.value).toBe(
			false,
		);
		required(first.nodes.find((node) => node.id === "a")).state = {
			value: true,
		};
		const second = evaluateLogicalCircuit(first);
		expect(second.nodes.find((node) => node.id === "out")?.state?.value).toBe(
			true,
		);
	});
	it("toggles inputs and propagates their value", () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		expect(editor.toggle("a")).toBe(true);
		expect(
			editor.value.nodes.find((node) => node.id === "out")?.state?.value,
		).toBe(true);
		expect(
			editor.value.edges.find((edge) => edge.id === "and-out")?.state?.value,
		).toBe(true);
	});
	it("toggles inputs and outputs by clicking them with semantic colors", async () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const listener = vi.fn();
		editor.addEventListener("tp-logic-toggle", listener);
		editor
			.querySelector('[data-node-id="a"]')
			?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(
			editor
				.querySelector('[data-node-id="a"] .tp-logic-input')
				?.classList.contains("is-true"),
		).toBe(true);
		editor
			.querySelector('[data-node-id="out"]')
			?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(
			editor
				.querySelector('[data-node-id="out"] .tp-logic-output')
				?.classList.contains("is-false"),
		).toBe(true);
		expect(
			editor
				.querySelector('[data-edge-id="and-out"]')
				?.classList.contains("is-true"),
		).toBe(true);
		expect(listener).toHaveBeenCalledTimes(2);
	});
	it("toggles inputs and outputs with Enter and Space", async () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const listener = vi.fn();
		editor.addEventListener("tp-logic-toggle", listener);

		editor
			.querySelector('[data-node-id="a"]')
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
			);
		editor
			.querySelector('[data-node-id="out"]')
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: " ", bubbles: true }),
			);

		expect(listener).toHaveBeenCalledTimes(2);
	});
	it("provides every requested palette element", async () => {
		const editor = new TpGraphLogicalCircuit();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		for (const type of [
			"logic-input",
			"logic-output",
			"logic-and",
			"logic-or",
			"logic-not",
			"logic-xor",
			"logic-nand",
			"logic-nor",
		]) {
			expect(editor.querySelector(`[data-shape="${type}"]`)).not.toBeNull();
		}
		expect(editor.querySelectorAll("[data-edge-direction]")).toHaveLength(1);
		expect(
			editor.querySelector('[data-edge-direction="forward"]'),
		).not.toBeNull();
		expect(editor.querySelector('[data-edge-direction="backward"]')).toBeNull();
		expect(editor.hasAttribute("ports-visible")).toBe(true);
		expect(editor.querySelector("tp-accordion")).not.toBeNull();
		expect(editor.querySelector('[data-shape="logic-hub"]')).not.toBeNull();
		expect(editor.querySelector('[data-shape="logic-and-3"]')).not.toBeNull();
	});
	it("allows only valid logical wires", () => {
		const editor = new TpGraphLogicalCircuit();
		const input = editor.addNode(TP_LOGIC_INPUT, { x: 0, y: 0 });
		const secondInput = editor.addNode(TP_LOGIC_INPUT, { x: 0, y: 100 });
		const output = editor.addNode(TP_LOGIC_OUTPUT, { x: 300, y: 0 });
		const not = editor.addNode("logic-not", { x: 150, y: 0 });
		editor.addEdge(input.id, not.id);
		expect(() => editor.addEdge(secondInput.id, not.id)).toThrow(
			"accept only one input wire",
		);
		editor.addEdge(not.id, output.id);
		expect(() => editor.addEdge(input.id, output.id)).toThrow(
			"accept only one input wire",
		);
		expect(() => editor.addEdge(output.id, not.id)).toThrow(
			"cannot be the source",
		);
		expect(() => editor.addEdge(not.id, input.id)).toThrow(
			"cannot be the target",
		);
		expect(() => editor.addEdge(not.id, not.id)).toThrow(
			"Self-links are not allowed",
		);
		expect(() =>
			editor.addEdge(
				input.id,
				output.id,
				TP_LOGIC_WIRE,
				undefined,
				undefined,
				"backward",
			),
		).toThrow("Logical wires must be forward");
	});
	it("assigns the two input wires to distinct gate ports", () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		const incoming = editor.value.edges.filter((edge) => edge.target === "and");
		expect(incoming.map((edge) => edge.targetPort)).toEqual(["north", "south"]);
		expect(() => editor.addEdge("a", "and")).toThrow();
	});
	it("assigns three distinct ports to three-input gates", () => {
		const editor = new TpGraphLogicalCircuit();
		const inputs = [0, 1, 2, 3].map((index) =>
			editor.addNode(TP_LOGIC_INPUT, { x: 0, y: index * 60 }),
		);
		const gate = editor.addNode("logic-and-3", { x: 200, y: 100 });
		for (const input of inputs.slice(0, 3)) editor.addEdge(input.id, gate.id);
		expect(editor.value.edges.map((edge) => edge.targetPort)).toEqual([
			"north",
			"west",
			"south",
		]);
		expect(() => editor.addEdge(required(inputs[3]).id, gate.id)).toThrow(
			"accepts only 3 input wires",
		);
	});
	it("places two input ports on a gate left edge and one output port on its right edge", async () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = AND_CIRCUIT;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const gate = editor.querySelector('[data-node-id="and"]');
		expect(gate?.querySelectorAll(".tp-graph-port")).toHaveLength(3);
		expect(gate?.querySelector('[data-port="north"]')?.getAttribute("x")).toBe(
			"-34",
		);
		expect(gate?.querySelector('[data-port="north"]')?.getAttribute("y")).toBe(
			"-24",
		);
		expect(gate?.querySelector('[data-port="south"]')?.getAttribute("x")).toBe(
			"-34",
		);
		expect(gate?.querySelector('[data-port="south"]')?.getAttribute("y")).toBe(
			"16",
		);
		expect(gate?.querySelector('[data-port="east"]')?.getAttribute("x")).toBe(
			"26",
		);
		expect(gate?.querySelector('[data-port="west"]')).toBeNull();
		expect(
			editor
				.querySelector('[data-node-id="a"] [data-port="east"]')
				?.getAttribute("x"),
		).toBe("14");
		expect(
			editor
				.querySelector('[data-node-id="out"] [data-port="west"]')
				?.getAttribute("x"),
		).toBe("-22");
	});
	it("uses unfilled IEC gate symbols and places inverted outputs after their bubble", async () => {
		const editor = new TpGraphLogicalCircuit();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "and", type: "logic-and", x: 100, y: 100 },
				{ id: "or", type: "logic-or", x: 200, y: 100 },
				{ id: "xor", type: "logic-xor", x: 300, y: 100 },
				{ id: "not", type: "logic-not", x: 400, y: 100 },
			],
			edges: [],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.querySelector('[data-node-id="and"] text')?.textContent).toBe(
			"&",
		);
		expect(editor.querySelector('[data-node-id="or"] text')?.textContent).toBe(
			"≥1",
		);
		expect(editor.querySelector('[data-node-id="xor"] text')?.textContent).toBe(
			"=1",
		);
		expect(editor.querySelector('[data-node-id="not"] text')?.textContent).toBe(
			"1",
		);
		expect(
			editor
				.querySelector('[data-node-id="and"] text')
				?.classList.contains("tp-logic-gate-label"),
		).toBe(true);
		expect(
			editor
				.querySelector('[data-node-id="not"] [data-port="east"]')
				?.getAttribute("x"),
		).toBe("36");
		expect(editor.representation).toBe("iso");
		expect(
			editor.querySelector('[data-logic-action="representation"]'),
		).not.toBeNull();
		expect(
			editor.querySelector('[data-logic-action="representation"]')
				?.nextElementSibling,
		).toBe(editor.querySelector('[data-logic-action="evaluate"]'));
		editor.toggleRepresentation();
		expect(editor.representation).toBe("ansi");
		expect(
			editor
				.querySelector('[data-node-id="and"] .tp-logic-gate')
				?.tagName.toLowerCase(),
		).toBe("path");
		expect(editor.querySelector('[data-node-id="and"] text')).toBeNull();
	});
});
