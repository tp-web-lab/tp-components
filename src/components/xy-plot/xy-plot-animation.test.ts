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

it("reveals and hides a group atomically in both views and counts groups as steps", async () => {
	const plot = await mount('anim = ["A", ["u", "Curve"]]');
	const visible = (name: string) =>
		[...plot.querySelectorAll<SVGElement>(`[data-xy-object="${name}"]`)].every(
			(e) => e.style.visibility === "visible",
		);
	const hidden = (name: string) =>
		[...plot.querySelectorAll<SVGElement>(`[data-xy-object="${name}"]`)].every(
			(e) => e.style.visibility === "hidden",
		);
	const status = () =>
		plot.querySelector('.tp-xy-plot-animation [role="status"]')?.textContent;
	expect(status()).toBe("0 / 2");
	plot.next();
	expect(visible("A")).toBe(true);
	expect(hidden("u")).toBe(true);
	expect(hidden("Curve")).toBe(true);
	plot.next();
	expect(status()).toBe("2 / 2");
	expect(visible("u")).toBe(true);
	expect(visible("Curve")).toBe(true);
	plot.querySelector<HTMLElement>('[data-xy-zoom="in"]')?.click();
	expect(status()).toBe("2 / 2");
	expect(visible("Curve")).toBe(true);
	plot.previous();
	expect(status()).toBe("1 / 2");
	expect(hidden("u")).toBe(true);
	expect(hidden("Curve")).toBe(true);
	plot.goToEnd();
	expect(visible("u")).toBe(true);
	plot.goToStart();
	expect(hidden("A")).toBe(true);
	expect(hidden("u")).toBe(true);
	expect(plot.anim()).toBe('["A",["u","Curve"]]');
	plot.anim(plot.anim());
	expect(status()).toBe("0 / 2");
	const sequence: (string | string[])[] = [["A", "Curve"], "u"];
	plot.anim(sequence);
	(sequence[0] as string[]).push("Missing");
	expect(plot.anim()).toBe('[["A","Curve"],"u"]');
	plot.anim("A,u");
	expect(plot.anim()).toBe("A,u");
});
it.each([
	"[[]]",
	'[["A", "A"]]',
	'["A", ["A", "u"]]',
	'[[["A"]]]',
	'[["Missing"]]',
	'[[""]]',
	"[[1]]",
])("rejects invalid animation groups %s", (value) => {
	expect(() => parseXYGraph(`${source}\nanim = ${value}`)).toThrow();
});
it("parses multiline grouped animation without losing its structure", () => {
	expect(
		parseXYGraph(`${source}\nanim = [\n"A",\n["u", "Curve"]\n]`).anim,
	).toEqual(["A", ["u", "Curve"]]);
});
