import { afterEach, describe, expect, it, vi } from "vitest";
import {
	evaluateGeometry,
	type GeometryPoint,
	type GeometryResult,
	intersections,
	MEDIATRIX_CONSTRUCTION,
	parameterAt,
	parseGeometry,
	serializeGeometry,
} from "./geometry.js";
import { TpGraphGeometry } from "./graph-geometry.js";

function point(result: GeometryResult, id: string): GeometryPoint {
	const value = result.values.get(id);
	if (value?.kind !== "point") throw new Error(`Missing point ${id}`);
	return value.point;
}
const evaluate = (source: string): GeometryResult =>
	evaluateGeometry(parseGeometry(source));
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
describe("ruler and compass geometry", () => {
	it("constructs a perpendicular bisector that follows translation, rotation and scaling", () => {
		for (const [ax, ay, bx, by] of [
			[-3, 0, 3, 0],
			[1, 2, -4, 7],
			[0, 0, 0, -9],
			[2, 3, 2.1, 3.1],
		]) {
			const source = MEDIATRIX_CONSTRUCTION.replace(
				"(-3, 0)",
				`(${ax}, ${ay})`,
			).replace("(3, 0)", `(${bx}, ${by})`);
			const result = evaluate(source);
			expect([...result.errors]).toEqual([]);
			const a = point(result, "A");
			const b = point(result, "B");
			const c = point(result, "C");
			const d = point(result, "D");
			expect((b.x - a.x) * (d.x - c.x) + (b.y - a.y) * (d.y - c.y)).toBeCloseTo(
				0,
				8,
			);
			expect((c.x + d.x) / 2).toBeCloseTo((a.x + b.x) / 2);
			expect((c.y + d.y) / 2).toBeCloseTo((a.y + b.y) / 2);
			expect(Math.hypot(c.x - a.x, c.y - a.y)).toBeCloseTo(
				Math.hypot(b.x - a.x, b.y - a.y),
			);
		}
	});
	it("distinguishes fixed radii, through points and transferred distances", () => {
		const result = evaluate(
			"point O = (0, 0)\npoint A = (3, 4)\npoint B = (3, 10)\ncircle fixed = circle(O, 5)\ncircle through = circle(O, through=A)\ncircle transferred = circle(O, distance(A, B))",
		);
		expect(result.values.get("fixed")).toMatchObject({ radius: 5 });
		expect(result.values.get("through")).toMatchObject({ radius: 5 });
		expect(result.values.get("transferred")).toMatchObject({ radius: 6 });
	});
	it("keeps points attached to moving circles and lines, with segment clamping", () => {
		const source =
			"point O = (2, 3)\npoint A = (6, 3)\ncircle c = circle(O, through=A)\npoint P = on(c, angle=90deg)\nline d = line(O, A)\npoint Q = on(d, t=0.25)\nsegment s = segment(O, A)\npoint R = on(s, t=2)";
		expect(point(evaluate(source), "P")).toEqual({
			x: 2.0000000000000004,
			y: 7,
		});
		expect(point(evaluate(source), "Q")).toEqual({ x: 3, y: 3 });
		expect(point(evaluate(source), "R")).toEqual({ x: 6, y: 3 });
		expect(
			point(evaluate(source.replace("(6, 3)", "(10, 3)")), "P").y,
		).toBeCloseTo(11);
	});
	it("supports forward references and serialization without changing the figure", () => {
		const objects = parseGeometry(
			MEDIATRIX_CONSTRUCTION.split("\n").reverse().join("\n"),
		);
		const roundTrip = evaluateGeometry(
			parseGeometry(serializeGeometry(objects)),
		);
		expect([...roundTrip.errors]).toEqual([]);
		expect(point(roundTrip, "C")).toEqual(
			point(evaluate(MEDIATRIX_CONSTRUCTION), "C"),
		);
	});
	it.each([
		"point A = on(c, angle=0deg)\ncircle c = circle(A, 5)",
		"point A = (0, 0)\npoint A = (1, 1)",
		"line d = line(A, B)",
		"point A = (0, 0)\ncircle c = circle(A, -5)",
		"point A = (0, 0)\ncircle c = circle(A, 5)\npoint P = on(c, t=0.5)",
		"point A = (0, 0)\ncircle c = circle(A, 5)\narc a = arc(c, start=0deg, end=360deg)",
		"point A = (0, 0)\npoint B = (1, 1)\nline d = line(A, B)\npoint P = on(d, angle=30deg)",
		"point A = (window.alert(1), 0)",
	])("rejects invalid definitions atomically: %s", (source) => {
		expect(() => parseGeometry(source)).toThrow();
	});
	it("propagates undefined objects and restores them when the construction becomes possible", () => {
		const source =
			"point A = (0, 0)\npoint B = (3, 0)\ncircle a = circle(A, 2)\ncircle b = circle(B, 2)\npoint I = intersection(a, b)\nline d = line(A, I)";
		expect(evaluate(source).errors.size).toBe(0);
		const absent = evaluate(source.replace("(3, 0)", "(8, 0)"));
		expect([...absent.errors.keys()]).toEqual(["I", "d"]);
		expect(evaluate(source).errors.size).toBe(0);
		expect(
			evaluate(MEDIATRIX_CONSTRUCTION.replace("(3, 0)", "(-3, 0)")).errors.has(
				"m",
			),
		).toBe(true);
	});
	it("clips intersections to visible arcs and segments without changing branch identity", () => {
		const result = evaluate(
			"point O = (0, 0)\npoint A = (-2, 0)\npoint B = (2, 0)\ncircle c = circle(O, 1)\narc a = arc(c, start=270deg, end=90deg)\nline d = line(A, B)\npoint L = intersection(d, a, branch=0)\npoint R = intersection(d, a, branch=1)",
		);
		expect(result.values.get("L")).toBeNull();
		expect(point(result, "R")).toEqual({ x: 1, y: 0 });
		expect(
			intersections(
				{ kind: "segment", first: { x: 2, y: 0 }, second: { x: 3, y: 0 } },
				{ kind: "circle", center: { x: 0, y: 0 }, radius: 1 },
			),
		).toEqual([null, null]);
	});
	it("handles line intersections, tangencies and coincident supports", () => {
		const line = {
			kind: "line" as const,
			first: { x: -2, y: 1 },
			second: { x: 2, y: 1 },
		};
		const circle = {
			kind: "circle" as const,
			center: { x: 0, y: 0 },
			radius: 1,
		};
		expect(intersections(line, circle)).toEqual([
			{ x: 0, y: 1 },
			{ x: 0, y: 1 },
		]);
		expect(intersections(line, line)).toEqual([]);
		expect(intersections(circle, circle)).toEqual([]);
		expect(
			intersections(line, {
				kind: "line",
				first: { x: 0, y: 0 },
				second: { x: 0, y: 2 },
			}),
		).toEqual([{ x: 0, y: 1 }]);
	});
	it("constrains dragging to an arc, including wraparound and clockwise arcs", () => {
		expect(
			parameterAt(
				{
					kind: "arc",
					center: { x: 0, y: 0 },
					radius: 2,
					start: 0,
					sweep: Math.PI / 2,
				},
				{ x: -1, y: 1 },
			),
		).toBeCloseTo(Math.PI / 2);
		const result = evaluate(
			"point O = (0, 0)\ncircle c = circle(O, 2)\narc a = arc(c, start=90deg, end=0deg, direction=cw)\npoint P = on(a, angle=180deg)",
		);
		expect(point(result, "P").y).toBeCloseTo(2);
	});
});
describe("<tp-graph-geometry>", () => {
	function mount(source?: string): TpGraphGeometry {
		const editor = new TpGraphGeometry();
		if (source !== undefined) editor.value = source;
		document.body.append(editor);
		return editor;
	}
	function click(editor: TpGraphGeometry, selector: string): void {
		const button = editor.querySelector<HTMLButtonElement>(selector);
		if (!button) throw new Error(selector);
		button.click();
	}
	it("renders four arcs, a segment and a bisector, with no visible supporting circles", () => {
		const editor = mount();
		expect(editor.querySelectorAll(".shape-ink.arc")).toHaveLength(4);
		expect(editor.querySelectorAll(".shape-ink.circle")).toHaveLength(0);
		expect(editor.querySelectorAll(".point")).toHaveLength(4);
	});
	it("preserves the last valid figure after a source error", () => {
		const editor = mount();
		const before = editor.value;
		expect(() => {
			editor.value = "line d = line(missing, A)";
		}).toThrow();
		expect(editor.value).toBe(before);
	});
	it("supports declarative script source and reconnection without losing construction", () => {
		const editor = new TpGraphGeometry();
		editor.innerHTML =
			'<script type="tp/geometry">point O = (0, 0)\ncircle c = circle(O, 5)</script>';
		document.body.append(editor);
		expect(editor.analyze().values.get("c")).toMatchObject({ radius: 5 });
		editor.remove();
		document.body.append(editor);
		expect(editor.analyze().values.get("c")).toMatchObject({ radius: 5 });
	});
	it("moves points with the keyboard, recalculates, and supports undo/redo", () => {
		const editor = mount();
		const before = editor.value;
		click(editor, '[data-object="B"]');
		editor
			.querySelector("svg[data-geometry-canvas]")
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
			);
		expect(point(editor.analyze(), "B").y).toBeCloseTo(0.2);
		expect(editor.analyze().errors.size).toBe(0);
		editor.undo();
		expect(editor.value).toBe(before);
		editor.redo();
		expect(point(editor.analyze(), "B").y).toBeCloseTo(0.2);
	});
	it("constructs a line from selected points with toolbar tools", () => {
		const editor = mount("point A = (0, 0)\npoint B = (2, 0)");
		click(editor, '[data-tool="line"]');
		click(editor, '[data-object="A"]');
		click(editor, '[data-object="B"]');
		expect(editor.analyze().values.get("d")).toMatchObject({ kind: "line" });
	});
	it("uses the drawing canvas, not a control icon, to project pointer movement", () => {
		const editor = mount();
		const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		editor.prepend(icon);
		const canvas = editor.querySelector("svg[data-geometry-canvas]");
		const a = editor.querySelector('[data-id="A"]');
		if (!canvas || !a) throw new Error("Missing drawing");
		a.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
		canvas.dispatchEvent(
			new MouseEvent("pointermove", {
				clientX: 450,
				clientY: 280,
				bubbles: true,
			}),
		);
		canvas.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
		expect(point(editor.analyze(), "A")).toEqual({ x: 0, y: 0 });
		expect(document.activeElement).toBe(canvas);
		editor.undo();
		expect(point(editor.analyze(), "A")).toEqual({ x: -3, y: 0 });
	});
	it("deletes dependents as one reversible action", () => {
		const editor = mount();
		const before = editor.value;
		editor.removeObject("A");
		expect([...editor.analyze().values.keys()]).toEqual(["B"]);
		editor.undo();
		expect(editor.value).toBe(before);
	});
	it("blocks pointer and keyboard editing in readonly mode but allows API updates", () => {
		const editor = mount();
		editor.setAttribute("readonly", "");
		const before = editor.value;
		click(editor, '[data-object="A"]');
		editor
			.querySelector("svg[data-geometry-canvas]")
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
			);
		editor.removeObject("A");
		editor.undo();
		expect(editor.value).toBe(before);
		expect(
			editor.querySelector<HTMLButtonElement>('[data-action="clear"]')
				?.disabled,
		).toBe(true);
		editor.value = "point P = (0, 0)";
		expect(editor.analyze().values.size).toBe(1);
	});
	it("pans the whole drawing without editing objects or adding undo history", () => {
		const editor = mount();
		const source = editor.value;
		const canvas = editor.querySelector("svg[data-geometry-canvas]");
		if (!canvas) throw new Error("Missing canvas");
		const position = () =>
			Number(editor.querySelector('[data-id="A"] .point')?.getAttribute("cx"));
		const before = position();
		let changes = 0;
		editor.addEventListener("tp-geometry-change", () => changes++);
		canvas.dispatchEvent(
			new MouseEvent("pointerdown", {
				clientX: 20,
				clientY: 20,
				bubbles: true,
			}),
		);
		canvas.dispatchEvent(
			new MouseEvent("pointermove", {
				clientX: 110,
				clientY: 70,
				bubbles: true,
			}),
		);
		canvas.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
		expect(position() - before).toBeCloseTo(90);
		expect(editor.value).toBe(source);
		expect(changes).toBe(0);
		expect(
			editor.querySelector<HTMLButtonElement>('[data-action="undo"]')?.disabled,
		).toBe(true);
		click(editor, '[data-action="fit"]');
		expect(position()).toBeCloseTo(before);
	});
	it("pans over points with Pan view and cancels interrupted gestures", () => {
		const editor = mount();
		click(editor, '[data-tool="pan"]');
		const source = editor.value;
		const canvas = editor.querySelector("svg[data-geometry-canvas]");
		const a = editor.querySelector('[data-id="A"]');
		if (!canvas || !a) throw new Error("Missing drawing");
		const before = editor
			.querySelector('[data-id="A"] .point')
			?.getAttribute("cx");
		a.dispatchEvent(
			new MouseEvent("pointerdown", {
				clientX: 20,
				clientY: 20,
				bubbles: true,
			}),
		);
		canvas.dispatchEvent(
			new MouseEvent("pointermove", {
				clientX: 110,
				clientY: 70,
				bubbles: true,
			}),
		);
		expect(
			editor.querySelector('[data-id="A"] .point')?.getAttribute("cx"),
		).not.toBe(before);
		canvas.dispatchEvent(new MouseEvent("pointercancel", { bubbles: true }));
		expect(
			editor.querySelector('[data-id="A"] .point')?.getAttribute("cx"),
		).toBe(before);
		expect(editor.value).toBe(source);
	});
	it("scrolls in both directions and supports Shift and line/page wheel units", () => {
		const editor = mount();
		const source = editor.value;
		const canvas = editor.querySelector("svg[data-geometry-canvas]");
		if (!canvas) throw new Error("Missing canvas");
		const position = (attribute: string) =>
			Number(
				editor.querySelector('[data-id="A"] .point')?.getAttribute(attribute),
			);
		let x = position("cx");
		let y = position("cy");
		const wheel = new WheelEvent("wheel", {
			deltaX: 20,
			deltaY: 30,
			cancelable: true,
		});
		canvas.dispatchEvent(wheel);
		expect(wheel.defaultPrevented).toBe(true);
		expect(position("cx")).toBeCloseTo(x - 20);
		expect(position("cy")).toBeCloseTo(y - 30);
		x = position("cx");
		y = position("cy");
		canvas.dispatchEvent(
			new WheelEvent("wheel", { deltaY: 2, deltaMode: 1, shiftKey: true }),
		);
		expect(position("cx")).toBeCloseTo(x - 32);
		expect(position("cy")).toBeCloseTo(y);
		canvas.dispatchEvent(new WheelEvent("wheel", { deltaY: 1, deltaMode: 2 }));
		expect(position("cy")).toBeCloseTo(y - 560);
		expect(editor.value).toBe(source);
	});
	it("retains browser zoom gestures and does not scroll while dragging a point", () => {
		const editor = mount();
		const canvas = editor.querySelector("svg[data-geometry-canvas]");
		const a = editor.querySelector('[data-id="A"]');
		if (!canvas || !a) throw new Error("Missing drawing");
		const before = editor
			.querySelector('[data-id="A"] .point')
			?.getAttribute("cx");
		const pinch = new WheelEvent("wheel", {
			deltaY: 100,
			ctrlKey: true,
			cancelable: true,
		});
		canvas.dispatchEvent(pinch);
		expect(pinch.defaultPrevented).toBe(false);
		a.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
		canvas.dispatchEvent(new WheelEvent("wheel", { deltaX: 100 }));
		canvas.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
		expect(
			editor.querySelector('[data-id="A"] .point')?.getAttribute("cx"),
		).toBe(before);
	});
	it("allows scrolling, keyboard panning and grid toggling in readonly mode", () => {
		const editor = mount();
		editor.setAttribute("readonly", "");
		const source = editor.value;
		click(editor, '[data-tool="pan"]');
		const canvas = editor.querySelector("svg[data-geometry-canvas]");
		if (!canvas) throw new Error("Missing canvas");
		const before = Number(
			editor.querySelector('[data-id="A"] .point')?.getAttribute("cx"),
		);
		canvas.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
		expect(
			Number(editor.querySelector('[data-id="A"] .point')?.getAttribute("cx")),
		).toBeCloseTo(before - 40);
		canvas.dispatchEvent(new WheelEvent("wheel", { deltaX: 10 }));
		expect(
			Number(editor.querySelector('[data-id="A"] .point')?.getAttribute("cx")),
		).toBeCloseTo(before - 50);
		click(editor, '[data-action="grid"]');
		expect(editor.grid).toBe(true);
		expect(editor.value).toBe(source);
	});
	it("toggles a world-aligned light grid without recreating the source editor or adding graduations", () => {
		const editor = mount();
		const sourceEditor = editor.querySelector("tp-code-editor");
		const source = editor.value;
		expect(editor.querySelector("[data-grid] path")).toBeNull();
		expect(editor.querySelector(".tp-geometry-ruler")).toBeNull();
		click(editor, '[data-action="grid"]');
		expect(editor.hasAttribute("grid")).toBe(true);
		const before = editor.querySelector("[data-grid] path")?.getAttribute("d");
		expect(before).toBeTruthy();
		editor
			.querySelector("svg[data-geometry-canvas]")
			?.dispatchEvent(new WheelEvent("wheel", { deltaX: 7 }));
		expect(
			editor.querySelector("[data-grid] path")?.getAttribute("d"),
		).not.toBe(before);
		expect(editor.querySelector("tp-code-editor")).toBe(sourceEditor);
		expect(editor.value).toBe(source);
		editor.removeAttribute("grid");
		expect(editor.querySelector("[data-grid] path")).toBeNull();
		expect(
			editor
				.querySelector('[data-action="grid"]')
				?.getAttribute("aria-pressed"),
		).toBe("false");
	});
	it("creates points at the visible position after scrolling", () => {
		const editor = mount("");
		const canvas = editor.querySelector("svg[data-geometry-canvas]");
		if (!canvas) throw new Error("Missing canvas");
		canvas.dispatchEvent(new WheelEvent("wheel", { deltaX: 72, deltaY: 36 }));
		click(editor, '[data-tool="point"]');
		canvas.dispatchEvent(
			new MouseEvent("click", { clientX: 450, clientY: 280, bubbles: true }),
		);
		expect(point(editor.analyze(), "A")).toEqual({ x: 2, y: -1 });
		expect(
			Number(editor.querySelector('[data-id="A"] .point')?.getAttribute("cx")),
		).toBe(450);
		expect(
			Number(editor.querySelector('[data-id="A"] .point')?.getAttribute("cy")),
		).toBe(280);
	});
	it("uses library controls with accessible native toggle states and disabled actions", async () => {
		const editor = mount();
		await Promise.resolve();
		await Promise.resolve();
		expect(
			editor.querySelectorAll("tp-button[data-geometry-control]").length,
		).toBeGreaterThan(15);
		expect(
			editor.querySelector("tp-accordion.tp-geometry-source"),
		).not.toBeNull();
		const grid = editor.querySelector<HTMLButtonElement>(
			'[data-action="grid"] > button',
		);
		expect(grid?.getAttribute("aria-pressed")).toBe("false");
		grid?.click();
		await Promise.resolve();
		expect(grid?.getAttribute("aria-pressed")).toBe("true");
		expect(
			editor
				.querySelector('[data-action="out"] > button')
				?.getAttribute("aria-label"),
		).toBe("Zoom out");
		editor.setAttribute("readonly", "");
		await Promise.resolve();
		await Promise.resolve();
		const clear = editor.querySelector<HTMLButtonElement>(
			'[data-action="clear"] > button',
		);
		expect(clear?.disabled).toBe(true);
		const before = editor.value;
		clear?.click();
		expect(editor.value).toBe(before);
		expect(
			editor.querySelector<HTMLButtonElement>('[data-tool="pan"] > button')
				?.disabled,
		).toBe(false);
	});
	it("preserves object controls and the source editor while panning", async () => {
		const editor = mount();
		await Promise.resolve();
		await Promise.resolve();
		const button = editor.querySelector('[data-object="A"]');
		const source = editor.querySelector("tp-code-editor");
		editor
			.querySelector("svg[data-geometry-canvas]")
			?.dispatchEvent(new WheelEvent("wheel", { deltaX: 10 }));
		expect(editor.querySelector('[data-object="A"]')).toBe(button);
		expect(editor.querySelector("tp-code-editor")).toBe(source);
	});
});

describe("construction files", () => {
	it("loads initial and changed src, including relative URLs", async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue({ ok: true, text: async () => "point O = (2, 3)" });
		vi.stubGlobal("fetch", fetcher);
		const element = new TpGraphGeometry();
		element.src = "figure.geometry";
		element.textContent = "invalid inline content";
		document.body.append(element);
		await vi.waitFor(() => expect(element.value).toContain("point O"));
		expect(fetcher.mock.calls[0]?.[0]).toBe(
			new URL("figure.geometry", element.baseURI).href,
		);
		fetcher.mockResolvedValue({
			ok: true,
			text: async () => "point B = (4, 5)",
		});
		element.src = "second.geometry";
		await vi.waitFor(() => expect(element.value).toContain("point B"));
		element.src = "";
		expect(element.value).toContain("point B");
	});
	it.each(["http", "syntax"])(
		"preserves the construction and reports %s errors",
		async (failure) => {
			vi.stubGlobal(
				"fetch",
				vi
					.fn()
					.mockResolvedValue(
						failure === "http"
							? { ok: false, status: 404 }
							: { ok: true, text: async () => "invalid" },
					),
			);
			const element = new TpGraphGeometry();
			document.body.append(element);
			const before = element.value;
			const error = vi.fn();
			element.addEventListener("tp-geometry-error", error);
			element.src = "broken.geometry";
			await vi.waitFor(() => expect(error).toHaveBeenCalledOnce());
			expect(element.value).toBe(before);
		},
	);
	it("ignores obsolete responses after src changes", async () => {
		let resolveFirst: (value: string) => void = () => {};
		const pending = new Promise<string>((resolve) => {
			resolveFirst = resolve;
		});
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce({ ok: true, text: () => pending })
				.mockResolvedValue({ ok: true, text: async () => "point B = (0, 0)" }),
		);
		const element = new TpGraphGeometry();
		document.body.append(element);
		element.src = "first.geometry";
		await Promise.resolve();
		element.src = "second.geometry";
		await vi.waitFor(() => expect(element.value).toContain("point B"));
		resolveFirst("point A = (0, 0)");
		await Promise.resolve();
		await Promise.resolve();
		expect(element.value).toContain("point B");
	});
	it.each(["remove", "disconnect"])(
		"cancels pending loads on %s",
		async (action) => {
			let resolveSource: (source: string) => void = () => {};
			const pending = new Promise<string>((resolve) => {
				resolveSource = resolve;
			});
			const fetcher = vi
				.fn()
				.mockResolvedValue({ ok: true, text: () => pending });
			vi.stubGlobal("fetch", fetcher);
			const element = new TpGraphGeometry();
			document.body.append(element);
			const previous = element.value;
			element.src = "pending.geometry";
			await Promise.resolve();
			if (action === "remove") element.removeAttribute("src");
			else element.remove();
			expect(fetcher.mock.calls[0]?.[1].signal.aborted).toBe(true);
			resolveSource("point Z = (8, 9)");
			await Promise.resolve();
			await Promise.resolve();
			expect(element.value).toBe(previous);
		},
	);
});

describe("extended constructions", () => {
	const base = `point O = (0, 0)
point A = (3, 4)
point B = (8, 0)
segment s = segment(O, A)
circle c = circle(O, 5)`;
	it("keeps an imposed length while its origin and direction move", () => {
		const source = `${base}\nsegment fixed = segment(O, A, length=10)\npoint E = on(fixed, t=1)\npoint M = midpoint(fixed)`;
		const initial = evaluate(source);
		expect(point(initial, "E")).toEqual({ x: 6, y: 8 });
		expect(point(initial, "M")).toEqual({ x: 3, y: 4 });
		const moved = evaluate(
			source.replace("(0, 0)", "(1, 2)").replace("(3, 4)", "(1, 6)"),
		);
		expect(point(moved, "E")).toEqual({ x: 1, y: 12 });
		expect(point(moved, "M")).toEqual({ x: 1, y: 7 });
	});
	it("clips rays and vectors and clamps attached points to their actual support", () => {
		const source = `${base}\nray r = ray(O, B)\nvector v = vector(O, B)\npoint R = on(r, t=-1)\npoint V = on(v, t=2)\npoint I = intersection(r, c, branch=0)\npoint J = intersection(r, c, branch=1)`;
		const result = evaluate(source);
		expect(point(result, "R")).toEqual({ x: 0, y: 0 });
		expect(point(result, "V")).toEqual({ x: 8, y: 0 });
		expect(result.values.get("I")).toBeNull();
		expect(point(result, "J")).toEqual({ x: 5, y: 0 });
		const ray = result.values.get("r");
		const vector = result.values.get("v");
		if (!ray || !vector) throw new Error("Missing supports");
		expect(parameterAt(ray, { x: -3, y: 2 })).toBe(0);
		expect(parameterAt(ray, { x: 16, y: 2 })).toBe(2);
		expect(parameterAt(vector, { x: 16, y: 2 })).toBe(1);
	});
	it("recomputes direct constructions and points attached to their resulting lines", () => {
		const source = `${base}\npoint M = midpoint(s)\nline m = perpendicularBisector(s)\nline p = parallel(B, s)\nline q = perpendicular(B, s)\nline b = bisector(A, O, B)\npoint Q = on(q, t=0.5)`;
		for (const text of [source, source.replace("(3, 4)", "(-4, 3)")]) {
			const result = evaluate(text);
			expect([...result.errors]).toEqual([]);
			const a = point(result, "A"),
				mid = point(result, "M");
			expect(mid).toEqual({ x: a.x / 2, y: a.y / 2 });
			for (const id of ["m", "q", "p"]) {
				const line = result.values.get(id);
				if (line?.kind !== "line") throw new Error("Missing line");
				const dx = line.second.x - line.first.x,
					dy = line.second.y - line.first.y;
				expect(
					id === "p" ? dx * a.y - dy * a.x : dx * a.x + dy * a.y,
				).toBeCloseTo(0);
			}
			expect(evaluate(serializeGeometry(parseGeometry(text)))).toEqual(result);
		}
		const b = evaluate(source).values.get("b");
		expect(b).toMatchObject({
			kind: "line",
			first: { x: 0, y: 0 },
			second: { x: 1.6, y: 0.8 },
		});
	});
	it("creates two true tangents, one at the circumference and none inside, then recovers", () => {
		const source = `${base}\nline t0 = tangent(B, c, branch=0)\nline t1 = tangent(B, c, branch=1)`;
		const result = evaluate(source);
		for (const id of ["t0", "t1"]) {
			const t = result.values.get(id);
			if (t?.kind !== "line") throw new Error("Missing tangent");
			expect(Math.hypot(t.second.x, t.second.y)).toBeCloseTo(5);
			expect(
				t.second.x * (t.second.x - t.first.x) +
					t.second.y * (t.second.y - t.first.y),
			).toBeCloseTo(0);
		}
		const on = evaluate(source.replace("(8, 0)", "(5, 0)"));
		expect(on.values.get("t0")).toEqual(on.values.get("t1"));
		expect(evaluate(source.replace("(8, 0)", "(2, 0)")).errors.size).toBe(2);
		expect(evaluate(source).errors.size).toBe(0);
	});
	it("round-trips sectors, all primitives and quoted comments safely", () => {
		const text = 'Length #1, (A): "five" <img src=x onerror=alert(1)>';
		const source = `${base}\nline d = line(O, B)\nray r = ray(O, B)\nvector v = vector(A, B)\nsegment fixed = segment(O, A, length=2)\ncircle through = circle(O, through=A)\nsector w = sector(c, start=0deg, end=90deg, relative-to=s)\ncomment note = comment(A, ${JSON.stringify(text)}) # discarded`;
		const objects = parseGeometry(source);
		expect(parseGeometry(serializeGeometry(objects))).toEqual(objects);
		const result = evaluateGeometry(objects);
		expect([...result.errors]).toEqual([]);
		expect(result.values.get("w")).toMatchObject({
			kind: "sector",
			radius: 5,
			sweep: Math.PI / 2,
		});
		expect(result.values.get("note")).toEqual({
			kind: "comment",
			point: { x: 3, y: 4 },
			text,
		});
	});
	it.each([
		"segment x = segment(O, A, length=0)",
		"segment x = segment(O, A, length=-1)",
		"ray x = ray(O, A, length=3)",
		"point M = midpoint(c)",
		"line p = parallel(O, c)",
		"line t = tangent(O, s)",
		"line t = tangent(O, c, branch=2)",
		"line b = bisector(O, A)",
		'comment n = comment(s, "Text")',
		'comment n = comment(O, "")',
		"sector w = sector(c, start=0deg, end=360deg)",
		"sector w = sector(c, start=0deg, end=90deg)\npoint P = on(w, angle=45deg)",
	])("rejects invalid supports or options: %s", (command) => {
		expect(() => parseGeometry(`${base}\n${command}`)).toThrow();
	});
	it("marks collapsed directions and undefined angles with diagnostics", () => {
		expect(
			evaluate(`${base}\nsegment fixed = segment(O, O, length=5)`).values.get(
				"fixed",
			),
		).toBeNull();
		expect(
			evaluate(`${base}\nline b = bisector(O, O, A)`).values.get("b"),
		).toBeNull();
		expect(
			evaluate(
				"point A = (-1, 0)\npoint O = (0, 0)\npoint B = (1, 0)\nline b = bisector(A, O, B)",
			).values.get("b"),
		).toMatchObject({
			kind: "line",
			first: { x: 0, y: 0 },
			second: { x: 0, y: -1 },
		});
	});
});

describe("extended toolbar", () => {
	const base = `point O = (0, 0)\npoint A = (3, 4)\npoint B = (8, 0)\nsegment s = segment(O, A)\ncircle c = circle(O, 5)`;
	function mount(builtIn = false): TpGraphGeometry {
		const editor = new TpGraphGeometry();
		editor.value = base;
		editor.builtIn = builtIn;
		document.body.append(editor);
		return editor;
	}
	function click(editor: TpGraphGeometry, selector: string): void {
		const button = editor.querySelector<HTMLElement>(selector);
		if (!button) throw new Error(selector);
		button.click();
	}
	function construct(
		editor: TpGraphGeometry,
		tool: string,
		ids: string[],
	): void {
		click(editor, `[data-tool="${tool}"]`);
		for (const id of ids) click(editor, `[data-object="${id}"]`);
	}
	it("gates all six tools by attribute presence and preserves constructions on removal", () => {
		const editor = mount();
		const builtIns = [
			"midpoint",
			"perpendicular",
			"parallel",
			"perpendicularBisector",
			"bisector",
			"tangent",
		];
		for (const id of builtIns)
			expect(editor.querySelector(`[data-tool="${id}"]`)).toBeNull();
		editor.setAttribute("built-in", "false"); // Boolean attributes depend on presence.
		for (const id of builtIns)
			expect(editor.querySelector(`[data-tool="${id}"]`)).not.toBeNull();
		construct(editor, "midpoint", ["s"]);
		const source = editor.value;
		editor.builtIn = false;
		expect(editor.value).toBe(source);
		expect(point(editor.analyze(), "M")).toEqual({ x: 1.5, y: 2 });
		for (const id of builtIns)
			expect(editor.querySelector(`[data-tool="${id}"]`)).toBeNull();
	});
	it("creates each primitive from the object list and renders arrows, sectors and safe text", () => {
		const editor = mount();
		for (const tool of [
			"segment",
			"fixedSegment",
			"line",
			"ray",
			"vector",
			"through",
		])
			construct(editor, tool, ["O", "A"]);
		construct(editor, "circle", ["O"]);
		construct(editor, "sector", ["c"]);
		construct(editor, "comment", ["A"]);
		expect([...editor.analyze().errors]).toEqual([]);
		expect(editor.value).toContain("length=5");
		expect(editor.querySelector(".shape-ink.vector path")).not.toBeNull();
		expect(
			editor.querySelector(".shape-ink.sector path")?.getAttribute("d"),
		).toMatch(/ Z$/);
		expect(editor.querySelector('[data-id="note"] text')?.textContent).toBe(
			"Comment",
		);
		const text = '<img src=x onerror=alert(1)> # "test"';
		editor.value += `\ncomment safe = comment(O, ${JSON.stringify(text)})`;
		expect(editor.querySelector('[data-id="safe"] text')?.textContent).toBe(
			text,
		);
		expect(editor.querySelector('[data-id="safe"] img')).toBeNull();
	});
	it("creates all direct tools, undoes both tangents together and deletes dependents", () => {
		const editor = mount(true);
		construct(editor, "midpoint", ["s"]);
		construct(editor, "perpendicularBisector", ["s"]);
		construct(editor, "parallel", ["B", "s"]);
		construct(editor, "perpendicular", ["B", "s"]);
		construct(editor, "bisector", ["A", "O", "B"]);
		const before = editor.value;
		construct(editor, "tangent", ["B", "c"]);
		expect(editor.value.match(/= tangent/g)).toHaveLength(2);
		expect([...editor.analyze().errors]).toEqual([]);
		editor.undo();
		expect(editor.value).toBe(before);
		editor.redo();
		expect(editor.value.match(/= tangent/g)).toHaveLength(2);
		editor.removeObject("s");
		for (const id of ["M", "m", "d", "d1"])
			expect(editor.analyze().values.has(id)).toBe(false);
		editor.undo();
		expect(editor.analyze().values.has("M")).toBe(true);
	});
	it("creates one tangent at a circumference and announces interior impossibility", () => {
		const editor = mount(true);
		construct(editor, "tangent", ["A", "c"]);
		expect(editor.value.match(/= tangent/g)).toHaveLength(1);
		const before = editor.value;
		construct(editor, "tangent", ["O", "c"]);
		expect(editor.value).toBe(before);
		expect(editor.querySelector("[data-status]")?.textContent).toContain(
			"inside",
		);
	});
	it("blocks built-in interaction when readonly", () => {
		const editor = mount(true);
		editor.setAttribute("readonly", "");
		const before = editor.value;
		construct(editor, "midpoint", ["s"]);
		expect(editor.value).toBe(before);
		expect(
			editor.querySelector('[data-tool="midpoint"]')?.hasAttribute("disabled"),
		).toBe(true);
	});
});
