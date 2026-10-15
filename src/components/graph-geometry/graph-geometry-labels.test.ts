import { afterEach, expect, it } from "vitest";
import type { TpTextfield } from "../textfield/textfield.js";
import {
	evaluateGeometry,
	parseGeometry,
	renameGeometry,
	serializeGeometry,
} from "./geometry.js";
import { TpGraphGeometry } from "./graph-geometry.js";

afterEach(() => document.body.replaceChildren());
const source = `point A = (0, 0)
point B = (4, 0)
segment s = segment(A, B)
comment note = comment(A, "A remains literal")`;
function mount(value = source): TpGraphGeometry {
	const g = new TpGraphGeometry();
	g.value = value;
	document.body.append(g);
	return g;
}
function click(g: Element, selector: string): void {
	const target = g.querySelector<HTMLElement>(selector);
	if (!target) throw new Error(`Missing ${selector}`);
	target.click();
}
function key(g: Element, key: string): void {
	g.querySelector("svg[data-geometry-canvas]")?.dispatchEvent(
		new KeyboardEvent("keydown", { key, bubbles: true }),
	);
}
it("renames structural references, including nested transformations, without editing text", () => {
	const objects = parseGeometry(
		`${source}\ncircle c = circle(A, distance(A, B))\npolygon p = polygon(A, B, C)\npoint C = (2, 3)\ncomment m = length(A, B)\nsegment t = translation(segment(A, B), v)\nvector v = vector(A, B)`,
	);
	const renamed = renameGeometry(objects, "A", "Origin");
	const result = evaluateGeometry(renamed);
	expect([...result.errors]).toEqual([]);
	expect(serializeGeometry(renamed)).toContain(
		'comment(Origin, "A remains literal")',
	);
	expect(serializeGeometry(renamed)).toContain(
		"translation(segment(Origin, B), v)",
	);
	expect(() => renameGeometry(objects, "A", "B")).toThrow(/Duplicate/);
	expect(() => renameGeometry(objects, "A", "invalid name")).toThrow();
	expect(objects[0]?.id).toBe("A");
});
it("round-trips free and attached comments and label offsets", () => {
	const objects = parseGeometry(
		`${source}\ncomment free = comment((2, -3), "Independent", dx=1, dy=2) label-x=0.5 label-y=-1`,
	);
	expect(parseGeometry(serializeGeometry(objects))).toEqual(objects);
	expect(evaluateGeometry(objects).values.get("free")).toMatchObject({
		point: { x: 3, y: -1 },
	});
});
it("renames from Construction objects and supports undo", () => {
	const g = mount();
	click(g, '[data-object="A"]');
	const field = g.querySelector<TpTextfield>("[data-object-name]");
	if (!field) throw new Error("Missing name field");
	field.value = "Origin";
	click(g, '[data-action="rename"]');
	expect(g.value).toContain("segment(Origin, B)");
	expect(g.querySelector('[data-object="Origin"]')).not.toBeNull();
	click(g, '[data-action="undo"]');
	expect(g.value).toContain("segment(A, B)");
});
it("moves a name with the keyboard without moving geometry, and restores it with undo", () => {
	const g = mount();
	const before = g.analyze();
	click(g, '[data-object="s"]');
	click(g, '[data-action="move-name"]');
	key(g, "ArrowRight");
	expect(g.value).toContain("label-x=0.2");
	expect(g.analyze().values).toEqual(before.values);
	click(g, '[data-action="undo"]');
	expect(g.value).not.toContain("label-x");
});
it("creates a comment on empty space and moves it independently", () => {
	const g = mount();
	click(g, '[data-tool="comment"]');
	g.querySelector("svg[data-geometry-canvas]")?.dispatchEvent(
		new MouseEvent("click", { bubbles: true, clientX: 450, clientY: 280 }),
	);
	expect(g.value).toContain('comment note1 = comment((2, 0), "Comment")');
	click(g, '[data-tool="move"]');
	click(g, '[data-object="note1"]');
	key(g, "ArrowUp");
	expect(g.analyze().values.get("note1")).toMatchObject({
		point: { x: 2, y: 0.2 },
	});
	expect(g.analyze().values.get("A")).toMatchObject({ point: { x: 0, y: 0 } });
});
it("drags an attached comment without moving its anchor, preserving its offset on reload", () => {
	const g = mount();
	const svg = g.querySelector("svg[data-geometry-canvas]");
	g.querySelector('[data-id="note"] text')?.dispatchEvent(
		new MouseEvent("pointerdown", {
			bubbles: true,
			clientX: 120,
			clientY: 100,
		}),
	);
	svg?.dispatchEvent(
		new MouseEvent("pointermove", { bubbles: true, clientX: 156, clientY: 64 }),
	);
	svg?.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
	const moved = g.analyze().values.get("note");
	expect(moved).not.toMatchObject({ point: { x: 0, y: 0 } });
	expect(g.analyze().values.get("A")).toMatchObject({ point: { x: 0, y: 0 } });
	const restored = evaluateGeometry(parseGeometry(g.value)).values.get("note");
	if (moved?.kind !== "comment" || restored?.kind !== "comment")
		throw new Error("Missing comment");
	expect(restored.point.x).toBeCloseTo(moved.point.x, 10);
	expect(restored.point.y).toBeCloseTo(moved.point.y, 10);
});
it("blocks name and comment changes in readonly mode", () => {
	const g = mount();
	g.setAttribute("readonly", "");
	click(g, '[data-object="note"]');
	const before = g.value;
	key(g, "ArrowUp");
	click(g, '[data-action="move-name"]');
	click(g, '[data-action="rename"]');
	expect(g.value).toBe(before);
});

it("drags a point name independently and cancels a second drag", () => {
	const g = mount();
	const svg = g.querySelector("svg[data-geometry-canvas]");
	const before = g.analyze().values.get("A");
	const drag = () => {
		g.querySelector('[data-id="A"] [data-name-label]')?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 100,
				clientY: 100,
			}),
		);
		svg?.dispatchEvent(
			new MouseEvent("pointermove", {
				bubbles: true,
				clientX: 140,
				clientY: 140,
			}),
		);
	};
	drag();
	svg?.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
	const saved = g.value;
	expect(saved).toContain("label-x=");
	expect(g.analyze().values.get("A")).toEqual(before);
	drag();
	svg?.dispatchEvent(new MouseEvent("pointercancel", { bubbles: true }));
	expect(g.value).toBe(saved);
	click(g, '[data-action="undo"]');
	expect(g.value).not.toContain("label-x=");
	click(g, '[data-action="redo"]');
	expect(g.value).toBe(saved);
});

it.each(['comment(A, "Comment")', 'comment((2, 3), "Comment")'])(
	"shows the renamed comment in the drawing and preserves it through source reload: %s",
	(expression) => {
		const g = mount(`point A = (0, 0)\ncomment note = ${expression}`);
		click(g, '[data-object="note"]');
		const field = g.querySelector<TpTextfield>("[data-object-name]");
		if (!field) throw new Error("Missing name field");
		field.value = "Observation";
		click(g, '[data-action="rename"]');
		expect(g.querySelector('[data-id="Observation"] text')?.textContent).toBe(
			"Observation",
		);
		const saved = g.value;
		expect(
			evaluateGeometry(parseGeometry(saved)).values.get("Observation"),
		).toMatchObject({ text: "Observation" });
		click(g, '[data-action="undo"]');
		expect(g.querySelector('[data-id="note"] text')?.textContent).toBe(
			"Comment",
		);
		click(g, '[data-action="redo"]');
		expect(g.querySelector('[data-id="Observation"] text')?.textContent).toBe(
			"Observation",
		);
	},
);

function inlineField(g: Element): TpTextfield {
	const field = g.querySelector<TpTextfield>(
		"[data-inline-rename] tp-textfield",
	);
	if (!field) throw new Error("Missing inline rename field");
	return field;
}
function inlineKey(field: TpTextfield, key: string): void {
	field.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}
it("renames a comment in place on double-click, with undo and source persistence", () => {
	const g = mount();
	g.querySelector('[data-id="note"] text')?.dispatchEvent(
		new MouseEvent("dblclick", { bubbles: true, clientX: 450, clientY: 280 }),
	);
	const field = inlineField(g);
	expect(field.value).toBe("note");
	field.value = "Observation";
	inlineKey(field, "Enter");
	expect(g.querySelector("[data-inline-rename]")).toBeNull();
	expect(g.querySelector('[data-id="Observation"] text')?.textContent).toBe(
		"Observation",
	);
	expect(g.value).toContain('comment(A, "Observation")');
	click(g, '[data-action="undo"]');
	expect(g.value).toContain('comment(A, "A remains literal")');
});
it("keeps invalid names open, then cancels inline edits without changing construction", () => {
	const g = mount();
	click(g, '[data-object="A"]');
	key(g, "F2");
	const field = inlineField(g);
	const before = g.value;
	field.value = "B";
	inlineKey(field, "Enter");
	expect(
		g.querySelector('[data-inline-rename] [role="alert"]')?.textContent,
	).toContain("Duplicate");
	expect(g.value).toBe(before);
	inlineKey(field, "Escape");
	expect(g.querySelector("[data-inline-rename]")).toBeNull();
	expect(g.value).toBe(before);
});
it("supports inline renaming in canvas-only mode and disallows readonly edits", () => {
	const g = mount();
	g.setAttribute("canvas-only", "");
	g.querySelector('[data-id="s"]')?.dispatchEvent(
		new MouseEvent("dblclick", { bubbles: true }),
	);
	const field = inlineField(g);
	field.value = "AB";
	inlineKey(field, "Enter");
	expect(g.value).toContain("segment AB = segment(A, B)");
	g.setAttribute("readonly", "");
	g.querySelector('[data-id="AB"]')?.dispatchEvent(
		new MouseEvent("dblclick", { bubbles: true }),
	);
	expect(g.querySelector("[data-inline-rename]")).toBeNull();
});
it("cancels inline edits on focus loss", async () => {
	const g = mount();
	click(g, '[data-object="A"]');
	key(g, "F2");
	const field = inlineField(g);
	field.value = "Other";
	g.querySelector<SVGSVGElement>("[data-geometry-canvas]")?.focus();
	await Promise.resolve();
	expect(g.querySelector("[data-inline-rename]")).toBeNull();
	expect(g.value).toContain("point A =");
});

it("keeps the hit target connected through both clicks so native double-click remains possible", () => {
	const g = mount();
	const target = g.querySelector('[data-id="A"] .point');
	const svg = g.querySelector("[data-geometry-canvas]");
	if (!target || !svg) throw new Error("Missing point");
	for (let count = 0; count < 2; count++) {
		target.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
		svg.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
		expect(target.isConnected).toBe(true);
	}
	target.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	expect(inlineField(g).value).toBe("A");
});

it("round-trips hidden names independently from hidden objects", () => {
	const objects = parseGeometry(
		"point A = (0, 0) label-hidden label-x=1 label-y=2\npoint B = (1, 0) hidden",
	);
	expect(objects[0]).toMatchObject({
		hidden: false,
		labelHidden: true,
		labelOffset: { x: 1, y: 2 },
	});
	expect(objects[1]?.labelHidden).toBeUndefined();
	expect(parseGeometry(serializeGeometry(objects))).toEqual(objects);
});
it("toggles name visibility without hiding geometry, including exports and undo/redo", () => {
	const g = mount();
	click(g, '[data-object="A"]');
	const before = g.analyze().values;
	click(g, '[data-action="hide-name"]');
	expect(g.querySelector('[data-id="A"] .point')).not.toBeNull();
	expect(g.querySelector('[data-id="A"] [data-name-label]')).toBeNull();
	expect(g.querySelector('[data-object="A"]')?.textContent).toContain(
		"name hidden",
	);
	expect(
		g.querySelector('[data-action="hide-name"]')?.getAttribute("aria-pressed"),
	).toBe("true");
	expect(g.value).toContain("label-hidden");
	expect(g.analyze().values).toEqual(before);
	const svg = new DOMParser().parseFromString(g.exportSvg(), "image/svg+xml");
	expect(
		Array.from(svg.querySelectorAll("text"), (text) => text.textContent),
	).not.toContain("A");
	click(g, '[data-action="undo"]');
	expect(g.querySelector('[data-id="A"] [data-name-label]')).not.toBeNull();
	click(g, '[data-action="redo"]');
	expect(g.querySelector('[data-id="A"] [data-name-label]')).toBeNull();
	click(g, '[data-object="A"]');
	click(g, '[data-action="hide-name"]');
	expect(g.querySelector('[data-id="A"] [data-name-label]')).not.toBeNull();
	expect(g.value).not.toContain("label-hidden");
});
it("keeps hidden names hidden after rename and reload, and blocks readonly toggling", () => {
	const g = mount("point A = (0, 0) label-hidden");
	g.value = serializeGeometry(
		renameGeometry(parseGeometry(g.value), "A", "Origin"),
	);
	expect(g.querySelector('[data-id="Origin"] .point')).not.toBeNull();
	expect(g.querySelector('[data-id="Origin"] [data-name-label]')).toBeNull();
	g.setAttribute("readonly", "");
	click(g, '[data-object="Origin"]');
	const before = g.value;
	click(g, '[data-action="hide-name"]');
	expect(g.value).toBe(before);
});
