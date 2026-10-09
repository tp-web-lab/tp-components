import { parseXYGraph } from "@tp/tp-utilities/xy-graph";
import { afterEach, expect, it } from "vitest";
import "./xy-plot.js";

const source = `xyFunctionGraph
 functions [["Fixed", "x"], ["Curve", "x*x", "dotted"]]
 points [["A", 1, 1]]
 vectors [["u", 1, 1, 1, 2]]`;
afterEach(() => document.body.replaceChildren());

async function mount(anim = "") {
	const plot = document.createElement("tp-xy-plot");
	plot.innerHTML = `<script type="tp/xy-plot">${source}\n${anim}</script>`;
	document.body.append(plot);
	await Promise.resolve();
	await Promise.resolve();
	return plot;
}

it("parses default and multiline animation lists and rejects invalid names", () => {
	expect(parseXYGraph(source).anim).toEqual([]);
	expect(parseXYGraph(`${source}\nanim [\n"u",\n"A"\n]`).anim).toEqual([
		"u",
		"A",
	]);
	for (const value of ['["Missing"]', '["A", "A"]', "[1]", '[""]', "{}"])
		expect(() => parseXYGraph(`${source}\nanim ${value}`)).toThrow();
});

it("reveals objects and legends in order in both views, with reversible steps and stable SVG", async () => {
	const plot = await mount('anim ["u", "A", "Curve"]');
	const svg = plot.querySelector("svg");
	const colors = Array.from(plot.querySelectorAll("[data-xy-object]"), (e) =>
		e.getAttribute("stroke"),
	);
	const click = (action: string) =>
		plot.querySelector<HTMLElement>(`[data-action="${action}"]`)?.click();
	const verify = (step: number, names: string[]) => {
		expect(plot.querySelector('[role="status"]')?.textContent).toBe(
			`${step} / 3`,
		);
		for (const object of plot.querySelectorAll<SVGElement>(
			"[data-xy-object]",
		)) {
			expect(object.style.visibility).toBe(
				names.includes(object.getAttribute("data-xy-object") ?? "")
					? "visible"
					: "hidden",
			);
		}
	};
	verify(0, ["Fixed"]);
	expect(
		plot.querySelector('[data-action="start"]')?.hasAttribute("disabled"),
	).toBe(true);
	click("next");
	verify(1, ["Fixed", "u"]);
	click("next");
	verify(2, ["Fixed", "u", "A"]);
	click("previous");
	verify(1, ["Fixed", "u"]);
	click("end");
	verify(3, ["Fixed", "u", "A", "Curve"]);
	expect(
		plot.querySelector('[data-action="next"]')?.hasAttribute("disabled"),
	).toBe(true);
	click("next");
	verify(3, ["Fixed", "u", "A", "Curve"]);
	click("start");
	verify(0, ["Fixed"]);
	expect(plot.querySelector("svg")).toBe(svg);
	expect(
		Array.from(plot.querySelectorAll("[data-xy-object]"), (e) =>
			e.getAttribute("stroke"),
		),
	).toEqual(colors);
});
it.each(["", "anim []"])("omits controls for %s", async (anim) => {
	expect((await mount(anim)).querySelector(".tp-xy-plot-animation")).toBeNull();
});
