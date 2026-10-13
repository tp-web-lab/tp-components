import { parseXYGraph } from "@tp/tp-utilities/xy-graph";
import { afterEach, expect, it, vi } from "vitest";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { TpXYPlot } from "./xy-plot.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it.each([
	[
		"xyFunctionGraph",
		"curve f = function(x, max(0, sin(x)), range=[-PI, PI]) style=dashed",
		'[["f", "max(0, sin(x))", "dashed", [-PI, PI]]]',
	],
	[
		"xyPolarGraph",
		"curve f = polar(t, 2*cos(3*t), range=[0, PI]) style=dotted",
		'[["f", "2*cos(3*t)", "dotted", [0, PI]]]',
	],
	[
		"xyParametricGraph",
		"curve f = parametric(t, cos(t), sin(t), range=[0, 2*PI]) style=dash-dot",
		'[["f", "cos(t)", "sin(t)", "dash-dot", [0, 2*PI]]]',
	],
])(
	"matches legacy curves in %s and infers the kind without a header",
	(kind, source, legacy) => {
		const expected = parseXYGraph(`${kind}\nfunctions = ${legacy}`);
		expect(parseXYGraph(`${kind}\n${source}`)).toEqual(expected);
		expect(parseXYGraph(source)).toEqual(expected);
		expect(parseXYGraph(`label = "Figure"\n${source}`).kind).toBe(kind);
	},
);
it("combines named curves, legacy curves, points, vectors and animation", () => {
	const graph = parseXYGraph(`curve f = function(x, x*x)
functions = [["g", "x"]]
point O = (0, 0)
point A = (3, 4)
vector u = vector(O, A)
anim = ["f", "u"]`);
	expect(graph.functions.map((f) => f.label)).toEqual(["g", "f"]);
	expect(graph.anim).toEqual(["f", "u"]);
});
it.each([
	"curve f = function(t, sin(t))",
	"curve f = polar(x, cos(x))",
	"curve f = parametric(t, cos(t))",
	"curve f = function(x, sin(x), cos(x))",
	"curve f = function(x, sin(x), range=[1, 0])",
	"curve f = function(x, sin(x), range=[0, 1/0])",
	"curve f = function(x, sin(x)) style=unknown",
	"curve f = function(x, sin(x))\ncurve f = function(x, x)",
	"curve f = function(x, sin(x))\npoint f = (0, 0)",
	'curve f = function(x, sin(x))\nfunctions [["f", "x"]]',
	"curve f = function(x, sin(x))\ncurve c = polar(t, 2)",
	"xyParametricGraph\ncurve f = function(x, sin(x))",
	"curve f = nonsense(x, sin(x))",
])("rejects invalid named curves: %s", (source) =>
	expect(() => parseXYGraph(source)).toThrow(),
);
it("preserves named expressions, styles and ranges through form edits and undo", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const source =
		'label = "Curve"\ncurve f = function(x, sin(x), range=[-PI, PI]) style=dashed';
	const plot = new TpXYPlot();
	plot.settings = true;
	plot.textContent = source;
	document.body.append(plot);
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-settings-source")).not.toBeNull(),
	);
	const editor = plot.querySelector<TpCodeEditor>(
		".tp-xy-plot-settings-source",
	);
	const curves = plot.querySelector<TpCodeEditor>(
		'[data-directive="functions"]',
	);
	if (!editor || !curves) throw Error("Missing editors");
	expect(curves.getValue()).toBe(source.split("\n")[1]);
	curves.setValue(
		"curve f = function(x, cos(x), range=[-PI, PI]) style=dotted",
	);
	curves.dispatchEvent(new Event("input", { bubbles: true }));
	await vi.waitFor(() => expect(editor.getValue()).toContain("cos(x)"));
	expect(parseXYGraph(editor.getValue()).functions[0]).toMatchObject({
		label: "f",
		expression: "cos(x)",
		lineStyle: "dotted",
		range: [-Math.PI, Math.PI],
	});
	plot.querySelector<HTMLElement>('[data-xy-history="undo"]')?.click();
	expect(editor.getValue()).toBe(source);
	const kind = plot.querySelector<HTMLElement & { value: string }>(
		'[data-directive="kind"]',
	);
	if (!kind) throw Error("Missing kind");
	kind.value = "2";
	kind.dispatchEvent(
		new CustomEvent("tp-radio-list-change", { bubbles: true }),
	);
	await vi.waitFor(() =>
		expect(editor.getValue()).toContain("curve r = polar(t, 2)"),
	);
	expect(parseXYGraph(editor.getValue()).kind).toBe("xyPolarGraph");
});
