import { afterEach, describe, expect, it } from "vitest";
import type { TpTextfield } from "../textfield/textfield.js";
import {
	distance,
	evaluateGeometry,
	parseGeometry,
	serializeGeometry,
} from "./geometry.js";
import { TpGraphGeometry } from "./graph-geometry.js";

afterEach(() => document.body.replaceChildren());
const base = "point A = (0, 0)\npoint B = (2, 0)\npoint C = (1, 3)";
function click(g: TpGraphGeometry, selector: string) {
	const node = g.querySelector<HTMLElement>(selector);
	if (!node) throw Error(selector);
	node.click();
}
function mount(source = "") {
	const g = new TpGraphGeometry();
	g.builtIn = true;
	g.value = source;
	document.body.append(g);
	return g;
}
function canvas(g: TpGraphGeometry) {
	const c = g.querySelector<SVGSVGElement>("[data-geometry-canvas]");
	if (!c) throw Error("Missing canvas");
	return c;
}
function place(g: TpGraphGeometry, x: number, y: number) {
	canvas(g).dispatchEvent(
		new MouseEvent("click", { bubbles: true, clientX: x, clientY: y }),
	);
}
describe("geometry polygons", () => {
	it.each([3, 4, 5, 6, 12, 360])(
		"builds a regular %i-gon with equal sides and follows its first edge",
		(sides) => {
			const source = `${base}\npolygon p = regularPolygon(A, B, sides=${sides}) color=blue`;
			const objects = parseGeometry(source);
			expect(parseGeometry(serializeGeometry(objects))).toEqual(objects);
			for (const text of [source, source.replace("(2, 0)", "(0, 4)")]) {
				const v = evaluateGeometry(parseGeometry(text)).values.get("p");
				if (v?.kind !== "polygon") throw Error("Missing polygon");
				expect(v.vertices).toHaveLength(sides);
				const length = distance(
					v.vertices[0] ?? { x: 0, y: 0 },
					v.vertices[1] ?? { x: 0, y: 0 },
				);
				v.vertices.forEach((p, i) => {
					expect(distance(p, v.vertices[(i + 1) % sides] ?? p)).toBeCloseTo(
						length,
						8,
					);
				});
			}
		},
	);
	it("preserves irregular vertex order and marks collapsed edges undefined", () => {
		const source = `${base}\npolygon p = polygon(A, C, B) style=dotted color=green`;
		expect(parseGeometry(serializeGeometry(parseGeometry(source)))).toEqual(
			parseGeometry(source),
		);
		expect(evaluateGeometry(parseGeometry(source)).values.get("p")).toEqual({
			kind: "polygon",
			vertices: [
				{ x: 0, y: 0 },
				{ x: 1, y: 3 },
				{ x: 2, y: 0 },
			],
		});
		expect(
			evaluateGeometry(
				parseGeometry(source.replace("(2, 0)", "(0, 0)")),
			).values.get("p"),
		).toBeNull();
	});
	it.each([
		"polygon(A,B)",
		"polygon(A,B,A)",
		"polygon(A,B,missing)",
		"regularPolygon(A,B,sides=2)",
		"regularPolygon(A,B,sides=3.5)",
		"regularPolygon(A,B,sides=361)",
		"regularPolygon(A,B)",
		"regularPolygon(A,B,sides=4,extra=1)",
	])("rejects %s", (recipe) => {
		expect(() => parseGeometry(`${base}\npolygon p = ${recipe}`)).toThrow();
	});
	it("creates points by successive clicks and closes on the first vertex as one undo step", () => {
		const g = mount();
		click(g, '[data-tool="polygon"]');
		place(g, 200, 200);
		place(g, 400, 200);
		place(g, 300, 350);
		expect(g.value).toBe("");
		const first = g.querySelector('[data-polygon-preview] [data-id="A"]');
		first?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(g.value).toContain("polygon poly = polygon(A, B, C)");
		expect(g.querySelector(".shape-ink.polygon polygon")).not.toBeNull();
		expect(g.querySelector("[data-polygon-preview] .point")).toBeNull();
		g.undo();
		expect(g.value).toBe("");
		g.redo();
		expect(g.analyze().values.get("poly")?.kind).toBe("polygon");
	});
	it("reuses existing vertices and finishes from the keyboard", () => {
		const g = mount(base);
		click(g, '[data-tool="polygon"]');
		for (const id of ["A", "B", "C"]) click(g, `[data-object="${id}"]`);
		canvas(g).dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
		expect(g.value).toContain("polygon poly = polygon(A, B, C)");
		g.removeObject("A");
		expect(g.analyze().values.has("poly")).toBe(false);
		g.undo();
		expect(g.analyze().values.has("poly")).toBe(true);
	});
	it("cancels draft points when escaping or changing tools and excludes previews from export", () => {
		const g = mount();
		click(g, '[data-tool="polygon"]');
		place(g, 100, 100);
		expect(g.exportSvg()).not.toContain("polyline");
		canvas(g).dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(g.value).toBe("");
		expect(g.querySelector("[data-polygon-preview]")).toBeNull();
		click(g, '[data-tool="polygon"]');
		place(g, 200, 100);
		click(g, '[data-tool="move"]');
		expect(g.querySelector("[data-polygon-preview]")).toBeNull();
	});
	it("constructs a regular polygon from two new points, validates sides and gates tools", () => {
		const g = mount();
		const sides = g.querySelector<TpTextfield>('[data-field="sides"]');
		if (!sides) throw Error("Missing sides");
		sides.value = "2";
		click(g, '[data-tool="regularPolygon"]');
		place(g, 100, 100);
		expect(g.value).toBe("");
		expect(g.querySelector("[data-status]")?.textContent).toContain("3 to 360");
		sides.value = "4";
		place(g, 200, 200);
		place(g, 400, 200);
		expect(g.value).toContain("regularPolygon(A, B, sides=4)");
		g.setAttribute("readonly", "");
		expect(
			g.querySelector('[data-tool="polygon"]')?.hasAttribute("disabled"),
		).toBe(true);
		g.builtIn = false;
		expect(g.querySelector('[data-tool="regularPolygon"]')).toBeNull();
		expect(g.analyze().values.has("poly")).toBe(true);
	});
});
