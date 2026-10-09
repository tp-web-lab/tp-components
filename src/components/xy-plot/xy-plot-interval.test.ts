import { parseXYGraph, sampleXYGraph } from "@tp/tp-utilities/xy-graph";
import { afterEach, describe, expect, it } from "vitest";
import "./xy-plot.js";

const source = `xyFunctionGraph
  x-axis [-10, 10]
  y-axis [-5, 10]
  samples 3
  functions [
    ["Parabola", "x*x", [0, 3]],
    ["Line", "x/2"]
  ]`;

afterEach(() => document.body.replaceChildren());

describe("XY curve intervals", () => {
	it("samples the exact interval endpoints while preserving full-grid defaults", () => {
		const diagram = parseXYGraph(source);
		const curves = sampleXYGraph(diagram);
		expect(diagram.xAxis).toEqual([-10, 10]);
		expect(curves[0]?.points).toEqual([
			{ x: 0, y: 0 },
			{ x: 1.5, y: 2.25 },
			{ x: 3, y: 9 },
		]);
		expect(curves[1]?.points).toEqual([
			{ x: -10, y: -5 },
			{ x: 0, y: 0 },
			{ x: 10, y: 5 },
		]);
	});

	it("clips intervals to the grid and keeps entirely outside curves empty", () => {
		const diagram = parseXYGraph(`xyFunctionGraph
      x-axis [-2, 2]
      samples 3
      functions [["Left", "x", [-4, 0]], ["Right", "x", [1, 4]], ["Outside", "x", [3, 4]]]`);
		expect(
			sampleXYGraph(diagram).map((curve) => curve.points.map((p) => p.x)),
		).toEqual([[-2, -1, 0], [1, 1.5, 2], []]);
		expect(diagram.xAxis).toEqual([-2, 2]);
	});

	it("accepts mathematical bounds containing nested commas", () => {
		const diagram = parseXYGraph(`xyFunctionGraph
      functions [["Sine", "sin(x)", [min(-PI/2, 0), max(0, PI/2)]]]`);
		expect(diagram.functions[0]).toMatchObject({
			range: [-Math.PI / 2, Math.PI / 2],
		});
		const points = sampleXYGraph(diagram)[0]?.points;
		expect(points?.[0]?.x).toBeCloseTo(-Math.PI / 2);
		expect(points?.at(-1)?.x).toBeCloseTo(Math.PI / 2);
	});

	it.each([
		"[]",
		"[0]",
		"[0, 1, 2]",
		"[2, 1]",
		"[1, 1]",
		"[0, 1/0]",
		"[0, sqrt(-1)]",
		"[0, x]",
	])(
		"rejects the invalid interval %s even alongside a valid curve",
		(range) => {
			expect(() =>
				parseXYGraph(
					`xyFunctionGraph\nfunctions [["Full", "x"], ["Bad", "x", ${range}]]`,
				),
			).toThrow();
		},
	);

	it("validates intervals supplied directly through the graph API", () => {
		const diagram = parseXYGraph(source);
		if (diagram.kind !== "xyFunctionGraph")
			throw new Error("Expected a function graph");
		diagram.functions = [{ label: "Bad", expression: "x", range: [2, 1] }];
		expect(() => sampleXYGraph(diagram)).toThrow("Intervalle");
	});

	it("uses per-curve parameter intervals and preserves the default parameter axis", () => {
		const diagram = parseXYGraph(`xyParametricGraph
      t-axis [-2, 2]
      samples 3
      functions [["Segment", "t", "2*t", [0, 1]], ["t", "t"]]`);
		const curves = sampleXYGraph(diagram);
		expect(curves[0]?.points).toEqual([
			{ x: 0, y: 0 },
			{ x: 0.5, y: 1 },
			{ x: 1, y: 2 },
		]);
		expect(curves[1]?.points).toEqual([
			{ x: -2, y: -2 },
			{ x: 0, y: 0 },
			{ x: 2, y: 2 },
		]);
	});

	it("supports limited polar arcs alongside full circles", () => {
		const diagram = parseXYGraph(`xyPolarGraph
      samples 3
      functions [["Arc", "1", [0, PI]], ["Circle", "1"]]`);
		const curves = sampleXYGraph(diagram);
		expect(curves[0]?.points.at(-1)?.x).toBeCloseTo(-1);
		expect(curves[1]?.points.at(-1)?.x).toBeCloseTo(1);
	});

	it("renders the interval in both previews without changing the grid", async () => {
		const plot = document.createElement("tp-xy-plot");
		plot.innerHTML = `<script type="tp/xy-plot">${source}</script>`;
		document.body.append(plot);
		await Promise.resolve();
		await Promise.resolve();
		expect(plot.querySelector('[role="alert"]')).toBeNull();
		expect(
			plot.querySelectorAll(
				".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
			),
		).toHaveLength(2);
		for (const svg of plot.querySelectorAll(
			".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
		)) {
			const paths = svg.querySelectorAll(":scope > path");
			// The unchanged [-10, 10] grid maps to SVG x coordinates [190, 710].
			expect(paths[0]?.getAttribute("d")).toMatch(/^M\s*450(?:\.0+)?[,\s]/);
			expect(paths[0]?.getAttribute("d")).toContain("528");
			expect(paths[1]?.getAttribute("d")).toMatch(/^M\s*190(?:\.0+)?[,\s]/);
			expect(paths[1]?.getAttribute("d")).toContain("710");
		}
	});

	it("reports invalid intervals through the component error display", async () => {
		const plot = document.createElement("tp-xy-plot");
		plot.textContent = source.replace("[0, 3]", "[3, 0]");
		document.body.append(plot);
		await Promise.resolve();
		await Promise.resolve();
		expect(plot.querySelector('[role="alert"]')?.textContent).toContain(
			"Intervalle",
		);
		expect(plot.querySelector("svg")).toBeNull();
	});
});
