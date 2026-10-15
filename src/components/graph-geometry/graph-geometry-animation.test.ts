import { afterEach, expect, it } from "vitest";
import {
	evaluateGeometry,
	parseGeometry,
	renameGeometry,
	serializeGeometry,
} from "./geometry.js";
import { TpGraphGeometry } from "./graph-geometry.js";

const source = `point O = (0, -2)
point A = (-2, 0)
point B = (2, 0)
segment s = segment(A, B)
point P = midpoint(s)
animation a = [[A, B], P, s]`;
afterEach(() => document.body.replaceChildren());
function mount(text = source): TpGraphGeometry {
	const g = new TpGraphGeometry();
	g.value = text;
	document.body.append(g);
	return g;
}
function click(g: Element, action: string): void {
	const button = g.querySelector<HTMLElement>(
		`[data-action="animation-${action}"]`,
	);
	if (!button) throw new Error(`Missing ${action}`);
	button.click();
}
const shown = (g: Element, id: string) =>
	!!g.querySelector(`[data-drawing] [data-id="${id}"]`);
it("parses unquoted grouped steps, comments, multiline lists and forward references", () => {
	const objects = parseGeometry(
		`animation a = [\n [A, B], <!-- simultaneous -->\n P, s\n]\n${source.slice(0, source.indexOf("animation"))}`,
	);
	expect(objects[0]?.definition).toEqual({
		kind: "animation",
		steps: [["A", "B"], "P", "s"],
	});
	expect(parseGeometry(serializeGeometry(objects))).toEqual(objects);
	expect([...evaluateGeometry(objects).errors]).toEqual([]);
	expect(evaluateGeometry(objects).values.has("a")).toBe(false);
});
it.each([
	"[missing]",
	"[[A, B], A]",
	"[[]]",
	"[[[A]]]",
	"[A,]",
	"[a]",
	'["A"]',
	"[A] hidden",
])("rejects invalid animation %s", (value) => {
	expect(() =>
		parseGeometry(source.replace("[[A, B], P, s]", value)),
	).toThrow();
});
it("reveals grouped steps cumulatively without changing source or computed geometry", () => {
	const g = mount();
	const saved = g.value;
	const values = g.analyze().values;
	expect(shown(g, "O")).toBe(true);
	expect(["A", "B", "P", "s"].map((id) => shown(g, id))).toEqual([
		false,
		false,
		false,
		false,
	]);
	expect(g.querySelector("[data-animation-status]")?.textContent).toBe("0 / 3");
	click(g, "next");
	expect(["A", "B", "P", "s"].map((id) => shown(g, id))).toEqual([
		true,
		true,
		false,
		false,
	]);
	click(g, "next");
	expect(shown(g, "P")).toBe(true);
	expect(shown(g, "s")).toBe(false);
	click(g, "end");
	expect(shown(g, "s")).toBe(true);
	click(g, "previous");
	expect(shown(g, "s")).toBe(false);
	click(g, "start");
	expect(shown(g, "A")).toBe(false);
	expect(g.value).toBe(saved);
	expect(g.analyze().values).toEqual(values);
});
it("keeps unlisted dependents visible and respects hidden geometry and names", () => {
	const g = mount(
		source
			.replace("point A = (-2, 0)", "point A = (-2, 0) hidden")
			.replace("point B = (2, 0)", "point B = (2, 0) label-hidden")
			.replace("[[A, B], P, s]", "[[A, B]]"),
	);
	expect(shown(g, "s")).toBe(true);
	expect(shown(g, "P")).toBe(true);
	click(g, "end");
	expect(shown(g, "A")).toBe(false);
	expect(shown(g, "B")).toBe(true);
	expect(g.querySelector('[data-id="B"] [data-name-label]')).toBeNull();
});
it("renames animation references and removes deleted objects from steps with undo", () => {
	const renamed = serializeGeometry(
		renameGeometry(parseGeometry(source), "A", "Origin"),
	);
	expect(renamed).toContain("animation a = [[Origin, B], P, s]");
	const g = mount();
	g.querySelector<HTMLElement>('[data-object="A"]')?.click();
	g.querySelector<HTMLElement>('[data-action="delete"]')?.click();
	expect(g.value).toContain("animation a = [[B]]");
	expect(() => parseGeometry(g.value)).not.toThrow();
	g.undo();
	expect(g.value).toContain("animation a = [[A, B], P, s]");
});
it("switches named sequences and allows stepping in readonly canvas-only mode", () => {
	const g = mount(`${source}\nanimation reverse = [s, [A, B], P]`);
	g.canvasOnly = true;
	g.setAttribute("readonly", "");
	g.querySelector<HTMLElement>('[data-animation="reverse"]')?.click();
	click(g, "next");
	expect(shown(g, "s")).toBe(true);
	expect(shown(g, "A")).toBe(false);
	expect(
		g.querySelector('[data-animation="reverse"]')?.getAttribute("aria-pressed"),
	).toBe("true");
});
it("exports only the current step and restarts after applying the source", () => {
	const g = mount();
	const labels = () =>
		Array.from(
			new DOMParser()
				.parseFromString(g.exportSvg(), "image/svg+xml")
				.querySelectorAll("text"),
			(node) => node.textContent,
		);
	expect(labels()).not.toContain("A");
	click(g, "next");
	expect(labels()).toContain("A");
	g.setConstruction(g.value);
	expect(shown(g, "A")).toBe(false);
});
it("accepts empty sequences and prevents animations from serving as geometry supports", () => {
	expect(() => parseGeometry("animation a = []")).not.toThrow();
	expect(() =>
		parseGeometry(`${source}\nsegment bad = segment(a, A)`),
	).toThrow();
	expect(() => parseGeometry(`${source}\nanimation b = [a]`)).toThrow();
});
