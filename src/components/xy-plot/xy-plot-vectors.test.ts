import {
	parseXYGraph,
	renderXYGraphSvg,
	sampleXYGraph,
} from "@tp/tp-utilities/xy-graph";
import { afterEach, expect, it } from "vitest";
import { TpXYPlot } from "./xy-plot.js";

afterEach(() => document.body.replaceChildren());

function render(source: string): Element {
	const diagram = parseXYGraph(source);
	const root = document.createElement("div");
	root.innerHTML = renderXYGraphSvg(diagram, sampleXYGraph(diagram));
	const svg = root.firstElementChild;
	if (!svg) throw new Error("Missing SVG");
	return svg;
}

it.each([
	["xyFunctionGraph", '"x"'],
	["xyPolarGraph", '"2"'],
	["xyParametricGraph", '"cos(t)", "sin(t)"'],
])(
	"preserves styles and intervals in %s and its legend",
	(kind, expressions) => {
		const svg = render(
			`${kind}\nfunctions [["Solid", ${expressions}], ["Dashed", ${expressions}, "dashed", [0, 1]], ["Dotted", ${expressions}, "dotted"], ["Mixed", ${expressions}, "dash-dot"]]`,
		);
		expect(
			Array.from(svg.querySelectorAll(":scope > path"), (p) =>
				p.getAttribute("stroke-dasharray"),
			),
		).toEqual([null, "6 4", "0 5", "6 4 0 4"]);
		expect(
			Array.from(svg.querySelectorAll(":scope > g > line[stroke-width]"), (p) =>
				p.getAttribute("stroke-dasharray"),
			),
		).toEqual([null, "6 4", "0 5", "6 4 0 4"]);
	},
);

it("renders standalone vectors from origin to origin plus components, with directed arrowheads", () => {
	const svg = render(`xyFunctionGraph
 x-axis [-10, 10]
 y-axis [-10, 10]
 vectors [
 ["u <safe>", 1, 2, 3, -4, "dashed"],
 ["left", 0, 0, -2, 0],
 ["zero", 2, 3, 0, 0]
 ]`);
	const vectors = svg.querySelectorAll(".tp-md-xy-graph-vector");
	expect(vectors).toHaveLength(3);
	const line = vectors[0]?.querySelector("line");
	expect(["x1", "y1", "x2", "y2"].map((a) => line?.getAttribute(a))).toEqual([
		"476",
		"278",
		"554",
		"382",
	]);
	expect(line?.getAttribute("stroke-dasharray")).toBe("6 4");
	expect(vectors[0]?.querySelector("text")?.textContent).toBe("u <safe>");
	expect(svg.querySelector("safe")).toBeNull();
	expect(
		vectors[1]?.querySelector("path")?.getAttribute("transform"),
	).toContain("rotate(180)");
	expect(vectors[2]?.querySelector("circle")).not.toBeNull();
	expect(vectors[2]?.querySelector("path")).toBeNull();
	expect(vectors[0]?.parentElement?.getAttribute("overflow")).toBe("hidden");
	expect(svg.innerHTML).not.toMatch(/NaN|Infinity/);
});

it.each([
	'functions [["bad", "x", "unknown"]]',
	'vectors [["bad", 0, 0, 1/0, 1]]',
	'vectors [["bad", 0, 0, 1]]',
	'vectors [["bad", 0, 0, 1, 1, "unknown"]]',
])("rejects invalid declarations: %s", (declaration) => {
	expect(() => parseXYGraph(`xyFunctionGraph\n${declaration}`)).toThrow();
});

it("renders numeric styles and vectors in both previews, including vectors alone", () => {
	const plot = new TpXYPlot();
	document.body.append(plot);
	plot.setData({
		title: "Vectors",
		xLabel: "x",
		yLabel: "y",
		series: [
			{
				label: "Line",
				points: [
					{ x: 0, y: 0 },
					{ x: 1, y: 1 },
				],
				dashed: true,
				lineStyle: "dotted",
			},
		],
		vectors: [{ label: "u", x: 0, y: 0, dx: 3, dy: 2 }],
	});
	for (const svg of plot.querySelectorAll(
		".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
	)) {
		expect(
			svg.querySelector(":scope > path")?.getAttribute("stroke-dasharray"),
		).toBe("0 5");
		expect(
			svg.querySelector(".tp-md-xy-graph-vector line")?.getAttribute("x2"),
		).toBe("710");
	}
	plot.setData({
		title: "Only vectors",
		xLabel: "x",
		yLabel: "y",
		series: [],
		vectors: [{ label: "v", x: 1, y: 2, dx: -3, dy: 2 }],
	});
	expect(plot.querySelector('[role="alert"]')).toBeNull();
	expect(plot.querySelectorAll(".tp-md-xy-graph-vector")).toHaveLength(2);
});
