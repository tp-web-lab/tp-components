import { afterEach, expect, it } from "vitest";
import {
	evaluateGeometry,
	parseGeometry,
	serializeGeometry,
} from "./geometry.js";
import { TpGraphGeometry } from "./graph-geometry.js";

const base = `point A = (0, 0)
point B = (4, 0)
point C = (4, 3)
segment s = segment(A,B)
vector v = vector(A,C)
circle c = circle(A,2)
arc a = arc(c,start=0deg,end=90deg)
sector w = sector(c,start=0deg,end=90deg)
polygon p = polygon(A,B,C)`;
function label(source: string, expression: string) {
	const result = evaluateGeometry(
		parseGeometry(`${source}\ncomment m = ${expression}`),
	);
	const value = result.values.get("m");
	if (value?.kind !== "comment") throw Error(result.errors.get("m"));
	return value.text;
}
afterEach(() => document.body.replaceChildren());
it.each([
	["length(A,C)", "5 u"],
	["length(s)", "4 u"],
	["length(v)", "5 u"],
	["length(c)", "12.57 u"],
	["length(a)", "3.14 u"],
	["length(w)", "7.14 u"],
	["length(p)", "12 u"],
	["area(p)", "6 u²"],
	["area(c)", "12.57 u²"],
	["area(w)", "3.14 u²"],
	["angle(A,B,C)", "90°"],
])("measures %s", (expression, expected) => {
	expect(label(base, expression)).toContain(`= ${expected}`);
	const parsed = parseGeometry(`${base}\ncomment m = ${expression} color=blue`);
	expect(parseGeometry(serializeGeometry(parsed))).toEqual(parsed);
});
it("updates measures through dependent transformations", () => {
	const source = `${base}\npolygon image = homothety(p,A,ratio=-2)`;
	expect(label(source, "area(image)")).toContain("24 u²");
	expect(label(source.replace("(4, 3)", "(4, 6)"), "area(image)")).toContain(
		"48 u²",
	);
});
it("measures concave polygons independently of winding and straight angles", () => {
	const source = `point A = (0,0)\npoint B = (4,0)\npoint C = (2,1)\npoint D = (4,4)\npoint E = (0,4)`;
	expect(
		label(`${source}\npolygon p = polygon(A,B,C,D,E)`, "area(p)"),
	).toContain("12 u²");
	expect(
		label(`${source}\npolygon p = polygon(E,D,C,B,A)`, "area(p)"),
	).toContain("12 u²");
	expect(label(`${base}\npoint D = (8,0)`, "angle(A,B,D)")).toContain("180°");
});
it.each([
	"length(A)",
	"area(s)",
	"area(a)",
	"angle(A,s,C)",
	"area(A,B)",
	"length(A,B,C)",
	"length(missing)",
])("rejects invalid measurement %s", (expression) => {
	expect(() => parseGeometry(`${base}\ncomment m = ${expression}`)).toThrow();
});
it("reports undefined angles and recovers when their arm becomes nonzero", () => {
	const source = `${base}\ncomment m = angle(A,B,C)`;
	expect(
		evaluateGeometry(
			parseGeometry(source.replace("(4, 3)", "(4, 0)")),
		).errors.get("m"),
	).toMatch(/nonzero/);
	expect(evaluateGeometry(parseGeometry(source)).errors.size).toBe(0);
});
it("offers standard tools, renders labels, undoes, deletes dependents and respects readonly", async () => {
	const g = new TpGraphGeometry();
	g.value = base;
	document.body.append(g);
	await Promise.resolve();
	const click = (selector: string) => {
		const button = g.querySelector<HTMLElement>(selector);
		if (!button) throw Error(selector);
		button.click();
	};
	for (const [tool, refs, expected] of [
		["length", ["s"], "4 u"],
		["length", ["A", "C"], "5 u"],
		["area", ["p"], "6 u²"],
		["angle", ["A", "B", "C"], "90°"],
	] as const) {
		click(`[data-tool="${tool}"]`);
		for (const ref of refs) click(`[data-object="${ref}"]`);
		expect(g.querySelector('[data-id="measure"]')?.textContent).toContain(
			expected,
		);
		g.undo();
		expect(g.analyze().values.has("measure")).toBe(false);
	}
	g.redo();
	g.removeObject("B");
	expect(g.analyze().values.has("measure")).toBe(false);
	g.undo();
	g.setAttribute("readonly", "");
	for (const tool of ["length", "area", "angle"])
		expect(
			g.querySelector(`[data-tool="${tool}"]`)?.hasAttribute("disabled"),
		).toBe(true);
});

it("rejects a crossing polygon area and recovers after uncrossing", () => {
	const source = `point A = (0,0)\npoint B = (3,3)\npoint C = (0,3)\npoint D = (3,0)\npolygon p = polygon(A,B,C,D)\ncomment m = area(p)`;
	expect(evaluateGeometry(parseGeometry(source)).errors.get("m")).toMatch(
		/simple polygon/,
	);
	expect(
		evaluateGeometry(
			parseGeometry(source.replace("polygon(A,B,C,D)", "polygon(A,D,B,C)")),
		).errors.size,
	).toBe(0);
});

it("round-trips label offsets and keeps them attached to moving supports", () => {
	const source = `${base}\ncomment m = length(s, dx=1, dy=-2)`;
	const parsed = parseGeometry(source);
	expect(parseGeometry(serializeGeometry(parsed))).toEqual(parsed);
	const before = evaluateGeometry(parsed).values.get("m");
	expect(before).toMatchObject({
		kind: "comment",
		point: { x: 3, y: -2 },
		text: "length(s) = 4 u",
	});
	const after = evaluateGeometry(
		parseGeometry(source.replace("(4, 0)", "(6, 0)")),
	).values.get("m");
	expect(after).toMatchObject({
		point: { x: 4, y: -2 },
		text: "length(s) = 6 u",
	});
	for (const option of ["dx=NaN", "dy=Infinity", "dx=1, dx=2", "offset=1"])
		expect(() =>
			parseGeometry(`${base}\ncomment m = length(s, ${option})`),
		).toThrow();
});
it("moves labels by keyboard with undo, redo and readonly protection", async () => {
	const g = new TpGraphGeometry();
	g.value = `${base}\ncomment m = area(c)`;
	document.body.append(g);
	await Promise.resolve();
	const before = g.value;
	g.querySelector<HTMLElement>('[data-object="m"]')?.click();
	const svg = g.querySelector("svg[data-geometry-canvas]");
	if (!svg) throw Error("Missing drawing");
	svg.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	svg.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "ArrowUp",
			shiftKey: true,
			bubbles: true,
		}),
	);
	expect(g.analyze().values.get("m")).toMatchObject({
		point: { x: 0.2, y: 0.02 },
		text: "area(c) = 12.57 u²",
	});
	expect(g.value).toContain("area(c, dx=0.2, dy=0.02)");
	expect(g.analyze().values.get("A")).toMatchObject({ point: { x: 0, y: 0 } });
	const after = g.value;
	g.undo();
	g.undo();
	expect(g.value).toBe(before);
	g.redo();
	g.redo();
	expect(g.value).toBe(after);
	g.setAttribute("readonly", "");
	svg.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(g.value).toBe(after);
});
it("drags from the grabbed location without jumping and cancels atomically", async () => {
	const g = new TpGraphGeometry();
	g.value = `${base}\ncomment m = length(s)`;
	document.body.append(g);
	await Promise.resolve();
	const svg = g.querySelector("svg[data-geometry-canvas]");
	if (!svg) throw Error("Missing drawing");
	const before = g.value;
	const start = g.analyze().values.get("m");
	const label = g.querySelector('[data-id="m"] text');
	if (!label) throw Error("Missing label");
	label.dispatchEvent(
		new MouseEvent("pointerdown", {
			bubbles: true,
			clientX: 120,
			clientY: 100,
		}),
	);
	svg.dispatchEvent(
		new MouseEvent("pointermove", {
			bubbles: true,
			clientX: 120,
			clientY: 100,
		}),
	);
	expect(g.analyze().values.get("m")).toEqual(start);
	svg.dispatchEvent(
		new MouseEvent("pointermove", { bubbles: true, clientX: 156, clientY: 64 }),
	);
	expect(g.value).not.toBe(before);
	svg.dispatchEvent(new MouseEvent("pointercancel", { bubbles: true }));
	expect(g.value).toBe(before);
	g.querySelector('[data-id="m"] text')?.dispatchEvent(
		new MouseEvent("pointerdown", {
			bubbles: true,
			clientX: 120,
			clientY: 100,
		}),
	);
	svg.dispatchEvent(
		new MouseEvent("pointermove", { bubbles: true, clientX: 156, clientY: 64 }),
	);
	svg.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
	const after = g.value;
	expect(after).not.toBe(before);
	g.undo();
	expect(g.value).toBe(before);
	g.redo();
	expect(g.value).toBe(after);
});

it("marks two sides at their common endpoint, including reversed sides", () => {
	const source = `${base}\nsegment t = segment(B,C)\nsegment reverse = segment(B,A)`;
	for (const expression of ["angle(s,t)", "angle(reverse,t)", "angle(t,s)"]) {
		const parsed = parseGeometry(`${source}\ncomment m = ${expression}`);
		expect(parseGeometry(serializeGeometry(parsed))).toEqual(parsed);
		expect(evaluateGeometry(parsed).values.get("m")).toMatchObject({
			kind: "comment",
			text: "",
			angleMark: { vertex: { x: 4, y: 0 }, right: true },
		});
	}
	const oblique = evaluateGeometry(
		parseGeometry(
			`${source.replace("(4, 3)", "(1, 3)")}\ncomment m = angle(s,t)`,
		),
	);
	expect(oblique.values.get("m")).toMatchObject({
		text: "45°",
		angleMark: { right: false },
	});
});
it("handles intersecting lines and reports disjoint sides", () => {
	const source = `${base}\npoint D = (2,-2)\npoint E = (2,2)\nline l = line(A,B)\nline t = line(D,E)\ncomment m = angle(l,t)`;
	expect(evaluateGeometry(parseGeometry(source)).values.get("m")).toMatchObject(
		{ angleMark: { vertex: { x: 2, y: 0 }, right: true } },
	);
	expect(
		evaluateGeometry(
			parseGeometry(
				`${base}\npoint D = (0,3)\nsegment t = segment(D,C)\ncomment m = angle(s,t)`,
			),
		).errors.get("m"),
	).toMatch(/common vertex/);
	expect(() => parseGeometry(`${base}\ncomment m = angle(A,s)`)).toThrow();
});
it("selects two sides and switches between square and arc as the figure changes", async () => {
	const g = new TpGraphGeometry();
	const source = `${base}\nsegment t = segment(B,C)`;
	g.value = source;
	document.body.append(g);
	await Promise.resolve();
	for (const selector of [
		'[data-tool="angle"]',
		'[data-object="s"]',
		'[data-object="t"]',
	])
		g.querySelector<HTMLElement>(selector)?.click();
	expect(g.value).toContain("angle(s, t)");
	expect(
		g.querySelector('[data-id="measure"] [data-angle-mark="right"]'),
	).not.toBeNull();
	expect(g.querySelector('[data-id="measure"] text')).toBeNull();
	g.value = g.value.replace("(4, 3)", "(1, 3)");
	expect(
		g.querySelector('[data-id="measure"] [data-angle-mark="arc"]'),
	).not.toBeNull();
	expect(g.querySelector('[data-id="measure"] text')?.textContent).toBe("45°");
	g.querySelector<HTMLElement>('[data-tool="move"]')?.click();
	g.querySelector<HTMLElement>('[data-object="measure"]')?.click();
	const path = g.querySelector("[data-angle-mark]")?.getAttribute("d");
	g.querySelector("svg[data-geometry-canvas]")?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(g.value).toContain("dx=0.2");
	expect(g.querySelector("[data-angle-mark]")?.getAttribute("d")).toBe(path);
});
