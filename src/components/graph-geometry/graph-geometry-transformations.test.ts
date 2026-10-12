import { afterEach, describe, expect, it } from "vitest";
import type { TpRadioList } from "../radio-list/radio-list.js";
import type { TpTextfield } from "../textfield/textfield.js";
import {
	evaluateGeometry,
	GEOMETRY_TRANSFORMATIONS,
	parseGeometry,
	serializeGeometry,
} from "./geometry.js";
import { TpGraphGeometry } from "./graph-geometry.js";

const base = `point O = (0, 0)
point A = (2, 1)
point B = (4, 1)
point X = (3, 0)
line axis = line(O, X)
vector v = vector(O, A)
segment s = segment(A, B)
ray ray1 = ray(A, B)
polygon p = polygon(O, A, B) color=blue
circle c = circle(A, 2)
arc a = arc(c, start=30deg, end=120deg)
sector w = sector(c, start=30deg, end=120deg)
comment note = comment(A, "Label")`;
const result = (command: string) =>
	evaluateGeometry(parseGeometry(`${base}\n${command}`));
afterEach(() => document.body.replaceChildren());
describe("geometric transformations", () => {
	it.each([
		["axialSymmetry(A, axis)", 2, -1],
		["centralSymmetry(A, O)", -2, -1],
		["homothety(A, O, ratio=-2)", -4, -2],
		["rotation(A, O, angle=90deg)", -1, 2],
		["translation(A, v)", 4, 2],
	])("transforms a point using %s", (recipe, x, y) => {
		const point = result(`point image = ${recipe}`).values.get("image");
		if (point?.kind !== "point") throw Error("Missing image");
		expect(point.point.x).toBeCloseTo(Number(x));
		expect(point.point.y).toBeCloseTo(Number(y));
	});
	it.each([
		"point A",
		"line axis",
		"segment s",
		"ray ray1",
		"vector v",
		"polygon p",
		"circle c",
		"arc a",
		"sector w",
		"comment note",
	])(
		"preserves the kind and round-trips %s through each transformation",
		(entry) => {
			const [kind, id] = entry.split(" ");
			for (const operation of GEOMETRY_TRANSFORMATIONS) {
				const support =
					operation === "translation"
						? "v"
						: operation === "axialSymmetry"
							? "axis"
							: "O";
				const option =
					operation === "homothety"
						? ", ratio=2"
						: operation === "rotation"
							? ", angle=45deg"
							: "";
				const source = `${base}\n${kind} image = ${operation}(${id}, ${support}${option}) style=dashed color=green`;
				const parsed = parseGeometry(source);
				expect(parseGeometry(serializeGeometry(parsed))).toEqual(parsed);
				expect(evaluateGeometry(parsed).values.get("image")?.kind).toBe(kind);
			}
		},
	);
	it("reflects arc orientation and scales radii with a negative ratio", () => {
		const reflected = result("arc image = axialSymmetry(a, axis)").values.get(
			"image",
		);
		if (reflected?.kind !== "arc") throw Error("Missing arc");
		expect(reflected.center).toEqual({ x: 2, y: -1 });
		expect(reflected.start).toBeCloseTo(-Math.PI / 6);
		expect(reflected.sweep).toBeCloseTo(-Math.PI / 2);
		const scaled = result(
			"sector image = homothety(w, O, ratio=-2)",
		).values.get("image");
		if (scaled?.kind !== "sector") throw Error("Missing sector");
		expect(scaled.center).toEqual({ x: -4, y: -2 });
		expect(scaled.radius).toBe(4);
		expect(Math.cos(scaled.start)).toBeCloseTo(-Math.cos(Math.PI / 6));
		expect(scaled.sweep).toBeCloseTo(Math.PI / 2);
	});
	it("reflects in an oblique axis and follows changes to source and support through chained images", () => {
		const source = `${base}\nline diagonal = line(O,A)\npoint reflected = axialSymmetry(X,diagonal)\npoint rotated = rotation(reflected,O,angle=180deg)\nsegment imageSegment = segment(reflected, rotated)`;
		const before = evaluateGeometry(parseGeometry(source));
		const p = before.values.get("reflected");
		if (p?.kind !== "point") throw Error("Missing reflection");
		expect(p.point.x).toBeCloseTo(1.8);
		expect(p.point.y).toBeCloseTo(2.4);
		const moved = evaluateGeometry(
			parseGeometry(source.replace("(2, 1)", "(0, 2)")),
		);
		expect(moved.values.get("reflected")).toEqual({
			kind: "point",
			point: { x: -3, y: 0 },
		});
		expect(moved.errors.size).toBe(0);
		expect(
			evaluateGeometry(
				parseGeometry(source.replace("(2, 1)", "(0, 0)")),
			).values.get("rotated"),
		).toBeNull();
	});
	it.each([
		"circle image = rotation(p,O,angle=90deg)",
		"point image = axialSymmetry(A,c)",
		"point image = centralSymmetry(A,axis)",
		"point image = translation(A,s)",
		"point image = homothety(A,O,ratio=0)",
		"point image = rotation(A,O,angle=Infinity)",
		"point image = rotation(A,O)",
		"point image = translation(A,v,ratio=2)",
		"point image = centralSymmetry(image,O)",
	])("rejects invalid transformation %s", (command) => {
		expect(() => parseGeometry(`${base}\n${command}`)).toThrow();
	});
	it("creates each image from the toolbar, copies appearance and supports undo, deletion and attribute gating", () => {
		const g = new TpGraphGeometry();
		g.value = base;
		document.body.append(g);
		const click = (selector: string) => {
			const node = g.querySelector<HTMLElement>(selector);
			if (!node) throw Error(selector);
			node.click();
		};
		for (const name of GEOMETRY_TRANSFORMATIONS)
			expect(g.querySelector(`[data-tool="${name}"]`)).toBeNull();
		g.builtIn = true;
		const ratio = g.querySelector<TpTextfield>('[data-field="ratio"]');
		if (ratio) ratio.value = "-2";
		for (const name of GEOMETRY_TRANSFORMATIONS) {
			click(`[data-tool="${name}"]`);
			click('[data-object="p"]');
			click(
				`[data-object="${name === "translation" ? "v" : name === "axialSymmetry" ? "axis" : "O"}"]`,
			);
			expect(g.analyze().values.get("p_image")?.kind).toBe("polygon");
			expect(g.value).toContain("color=blue");
			expect(g.querySelector('[data-id="p_image"].tp-blue')).not.toBeNull();
			g.undo();
			expect(g.analyze().values.has("p_image")).toBe(false);
		}
		g.redo();
		g.removeObject("p");
		expect(g.analyze().values.has("p_image")).toBe(false);
		g.undo();
		g.builtIn = false;
		expect(g.analyze().values.has("p_image")).toBe(true);
		g.builtIn = true;
		g.setAttribute("readonly", "");
		for (const name of GEOMETRY_TRANSFORMATIONS)
			expect(
				g.querySelector(`[data-tool="${name}"]`)?.hasAttribute("disabled"),
			).toBe(true);
	});
});

describe("transform in place", () => {
	async function mount() {
		const g = new TpGraphGeometry();
		g.value = base;
		g.builtIn = true;
		document.body.append(g);
		await Promise.resolve();
		const mode = g.querySelector<TpRadioList>("[data-transform-mode]");
		if (!mode) throw Error("Missing mode");
		mode.value = "2";
		return g;
	}
	function click(g: TpGraphGeometry, selector: string) {
		const button = g.querySelector<HTMLElement>(selector);
		if (!button) throw Error(selector);
		button.click();
	}
	it.each(GEOMETRY_TRANSFORMATIONS)(
		"replaces the polygon with %s without extra objects and preserves its appearance",
		async (operation) => {
			const g = await mount();
			const before = g.value;
			const count = g.analyze().values.size;
			const support =
				operation === "axialSymmetry"
					? "axis"
					: operation === "translation"
						? "v"
						: "O";
			const option =
				operation === "homothety"
					? ", ratio=2"
					: operation === "rotation"
						? ", angle=90deg"
						: "";
			const expected = result(
				`polygon expected = ${operation}(p, ${support}${option})`,
			).values.get("expected");
			click(g, `[data-tool="${operation}"]`);
			click(g, '[data-object="p"]');
			click(g, `[data-object="${support}"]`);
			expect(g.analyze().values.size).toBe(count);
			expect(g.analyze().values.get("p")).toEqual(expected);
			expect(g.analyze().values.has("p_image")).toBe(false);
			expect(g.value).toContain(`${operation}(polygon(O, A, B), ${support}`);
			expect(g.querySelector('[data-id="p"].tp-blue')).not.toBeNull();
			expect(parseGeometry(serializeGeometry(parseGeometry(g.value)))).toEqual(
				parseGeometry(g.value),
			);
			const after = g.value;
			g.undo();
			expect(g.value).toBe(before);
			g.redo();
			expect(g.value).toBe(after);
		},
	);
	it("composes in-place transformations and keeps downstream constructions attached to the same name", async () => {
		const g = await mount();
		g.value = `${base}\npoint Q = on(c, angle=0deg)`;
		const original = g.analyze().values.get("c");
		for (let i = 0; i < 2; i++) {
			click(g, '[data-tool="centralSymmetry"]');
			click(g, '[data-object="c"]');
			click(g, '[data-object="O"]');
			if (i === 0)
				expect(g.analyze().values.get("Q")).toEqual({
					kind: "point",
					point: { x: 0, y: -1 },
				});
		}
		expect(g.analyze().values.get("c")).toEqual(original);
		expect(g.value).toContain(
			"centralSymmetry(centralSymmetry(circle(A, 2), O), O)",
		);
		g.removeObject("c");
		expect(g.analyze().values.has("Q")).toBe(false);
	});
	it("rejects circular references atomically instead of creating a hidden copy", async () => {
		const g = await mount();
		const before = g.value;
		click(g, '[data-tool="translation"]');
		click(g, '[data-object="A"]');
		click(g, '[data-object="v"]');
		expect(g.value).toBe(before);
		expect(g.querySelector("[data-status]")?.textContent).toContain(
			"Circular dependency",
		);
	});
	it("validates nested constructions and round-trips attached point syntax", () => {
		const source = `${base}\npoint Q = rotation(on(c, angle=30deg), O, angle=45deg)`;
		const parsed = parseGeometry(source);
		expect(parseGeometry(serializeGeometry(parsed))).toEqual(parsed);
		expect(evaluateGeometry(parsed).values.get("Q")?.kind).toBe("point");
		expect(() =>
			parseGeometry(
				`${base}\npolygon bad = rotation(polygon(A, B, c), O, angle=90deg)`,
			),
		).toThrow();
	});
});
