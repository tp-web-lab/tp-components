import { parseXYGraph } from "@tp/tp-utilities/xy-graph";
import { afterEach, expect, it, vi } from "vitest";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import {
	geometrySourceLabel,
	parseGeometry,
} from "../graph-geometry/geometry.js";
import { TpXYPlot } from "./xy-plot.js";

const shared = `label = "Shared figure"
point O = (0, 0)
point A = (3, 4)
vector u = vector(O, A)`;
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("reads the exact same title, points and vector declarations in both components", () => {
	const graph = parseXYGraph(shared);
	expect(graph.title).toBe(geometrySourceLabel(shared));
	expect(parseGeometry(shared).map((object) => object.id)).toEqual([
		"O",
		"A",
		"u",
	]);
	expect(graph.points).toEqual([
		{ label: "O", x: 0, y: 0 },
		{ label: "A", x: 3, y: 4 },
	]);
	expect(graph.vectors).toEqual([{ label: "u", x: 0, y: 0, dx: 3, dy: 4 }]);
	expect(
		parseXYGraph(shared.replace("(3, 4)", "(6, 8)")).vectors?.[0],
	).toMatchObject({ dx: 6, dy: 8 });
});
it("supports forward references, title alias, point-only figures and old declarations", () => {
	expect(
		parseXYGraph("vector u = vector(O, A)\npoint A = (3, 4)\npoint O = (1, 2)")
			.vectors?.[0],
	).toMatchObject({ x: 1, y: 2, dx: 2, dy: 2 });
	expect(parseXYGraph('title = "Point"\npoint A = (1, 2)').title).toBe("Point");
	const graph = parseXYGraph(
		'xyFunctionGraph\n title "Legacy"\n points [["O",0,0]]\n point A = (3, 4)\n vector u = vector(O, A)\n vectors [["v",0,0,1,2,"dashed"]]',
	);
	expect(graph.vectors).toHaveLength(2);
	expect(graph.vectors?.[0]?.lineStyle).toBe("dashed");
});
it.each([
	"point A = (1, 2)\npoint A = (3, 4)",
	"point A = (1, 2)\nvector A = vector(A, A)",
	"vector u = vector(A, B)",
	"point A = (1/0, 2)",
	"point A = (1, 2, 3)",
	'label = "One"\ntitle "Two"\npoint A = (0, 0)',
	"point A = on(c, angle=0)",
])("rejects invalid shared construction: %s", (source) =>
	expect(() => parseXYGraph(source)).toThrow(),
);
it("preserves point references through settings edits, Play and undo", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const plot = new TpXYPlot();
	plot.settings = true;
	plot.textContent = shared;
	document.body.append(plot);
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-settings-source")).not.toBeNull(),
	);
	const editor = plot.querySelector<TpCodeEditor>(
		".tp-xy-plot-settings-source",
	);
	const points = plot.querySelector<TpCodeEditor>('[data-directive="points"]');
	if (!editor || !points) throw Error("Missing editors");
	points.setValue("point O = (0, 0)\npoint A = (6, 8)");
	points.dispatchEvent(new Event("input", { bubbles: true }));
	await vi.waitFor(() => expect(editor.getValue()).toContain("(6, 8)"));
	expect(editor.getValue()).toContain("vector u = vector(O, A)");
	expect(editor.getValue()).toContain('label = "Shared figure"');
	expect(parseXYGraph(editor.getValue()).vectors?.[0]).toMatchObject({
		dx: 6,
		dy: 8,
	});
	plot.querySelector<HTMLElement>('[data-xy-history="undo"]')?.click();
	expect(editor.getValue()).toBe(shared);
	editor.setValue(shared.replace("(3, 4)", "(2, 5)"));
	plot.querySelector<HTMLElement>('[data-source-action="play"]')?.click();
	expect(points.getValue()).toContain("(2, 5)");
});

it.each(["xyFunctionGraph", "xyPolarGraph", "xyParametricGraph"])(
	"accepts assignments for every directive in %s without changing legacy results",
	(kind) => {
		const functions =
			kind === "xyParametricGraph"
				? '[["f", "cos(t)", "sin(t)"]]'
				: '[["f", "2"]]';
		const directives = `legend-x "x = horizontal"
legend-y "y"
x-axis [-4, 8]
y-axis [-4, 8]
x-ticks [-4, 0, 4, 8]
y-ticks [-4, 0, 4, 8]
x-axis-at 0
y-axis-at 0
grid horizontal
samples 64
anim ["f", "A", "u"]
t-axis [0, PI]
theta-axis [0, PI]
functions ${functions}
points [["A", 1, 2]]
vectors [["u", 0, 0, 1, 2]]`;
		const assigned = directives.replace(/^([a-z-]+) /gm, "$1 = ");
		expect(parseXYGraph(`${kind}\n${assigned}`)).toEqual(
			parseXYGraph(`${kind}\n${directives}`),
		);
		expect(
			parseXYGraph(
				`${kind}\n${assigned.replace('anim = ["f", "A", "u"]', 'anim=[\n"f",\n"A",\n"u"\n]')}`,
			).anim,
		).toEqual(["f", "A", "u"]);
	},
);
it("defaults to Cartesian for assignments and preserves them through settings", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const plot = new TpXYPlot();
	plot.settings = true;
	plot.textContent = `x-axis = [-5, 5]\ny-axis=[-5,5]\nlegend-x = "Distance"\ngrid = both\nsamples = 64\n${shared}`;
	document.body.append(plot);
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-settings-source")).not.toBeNull(),
	);
	const field = plot.querySelector<HTMLElement & { value: string }>(
		'[data-directive="samples"]',
	);
	if (!field) throw Error("Missing sample field");
	expect(field.value).toBe("64");
	field.value = "128";
	field.dispatchEvent(new Event("input", { bubbles: true }));
	const editor = plot.querySelector<TpCodeEditor>(
		".tp-xy-plot-settings-source",
	);
	await vi.waitFor(() => expect(editor?.getValue()).toContain("samples = 128"));
	expect(editor?.getValue()).toContain("x-axis = [-5, 5]");
	expect(editor?.getValue()).toContain('legend-x = "Distance"');
	expect(editor?.getValue()).toContain("grid = both");
	expect(editor?.getValue()).toContain("vector u = vector(O, A)");
});

it("ignores HTML comments before headers, after declarations and inside lists", () => {
	const source = `<!-- intro
ignored curve f = broken -->
xyPolarGraph <!-- explicit kind -->
label = "Polar"
curve f = polar(t, cos(t)) <!-- trailing -->
anim = [<!-- first -->"f"<!-- last -->]`;
	expect(parseXYGraph(source)).toEqual(
		parseXYGraph(`xyPolarGraph
label = "Polar"
curve f = polar(t, cos(t))
anim = ["f"]`),
	);
	expect(
		parseXYGraph(`<!-- heading -->
${shared}`).title,
	).toBe("Shared figure");
});

it("preserves comment markers and escaped quotes in JSON strings", () => {
	const title = 'Quoted " <!-- literal -->';
	expect(
		parseXYGraph(`label = ${JSON.stringify(title)}
point A = (1, 2)`).title,
	).toBe(title);
});

it("rejects unfinished comments and does not join tokens across comments", () => {
	expect(() =>
		parseXYGraph(`${shared}
<!-- unfinished`),
	).toThrow(/Unterminated HTML comment/);
	expect(() => parseXYGraph("point A = (1<!-- separator -->2, 0)")).toThrow();
});
