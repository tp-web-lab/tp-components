import { afterEach, expect, it } from "vitest";
import { TpXYPlot } from "./xy-plot.js";

afterEach(() => document.body.replaceChildren());
async function mount() {
	const plot = new TpXYPlot();
	plot.innerHTML = `<script type="tp/xy-plot">xyFunctionGraph
 grid horizontal
 functions [["Line", "x"]]
 points [["A", 1, 1]]
 anim ["A", "Line"]</script>`;
	document.body.append(plot);
	await Promise.resolve();
	await Promise.resolve();
	return plot;
}
it("updates display attributes in both views without resetting progression", async () => {
	const plot = await mount();
	plot.next();
	for (const mode of ["none", "horizontal", "vertical", "both"] as const) {
		plot.axis = mode;
		plot.grid = mode;
		for (const item of plot.querySelectorAll<SVGElement>(
			"[data-xy-axis], [data-xy-grid]",
		)) {
			const direction =
				item.getAttribute("data-xy-axis") ?? item.getAttribute("data-xy-grid");
			expect(item.style.display).toBe(
				mode === "both" || mode === direction ? "" : "none",
			);
		}
		expect(plot.querySelector('[role="status"]')?.textContent).toBe("1 / 2");
	}
	plot.noLegend = true;
	expect(
		Array.from(plot.querySelectorAll<SVGElement>("[data-xy-legend]")).every(
			(e) => e.style.display === "none",
		),
	).toBe(true);
	plot.noLegend = false;
	expect(
		Array.from(plot.querySelectorAll<SVGElement>("[data-xy-legend]")).every(
			(e) => e.style.display === "",
		),
	).toBe(true);
	plot.removeAttribute("grid");
	expect(
		plot.querySelector<SVGElement>('[data-xy-grid="vertical"]')?.style.display,
	).toBe("none");
});
it("supports public progression methods and empty or replacement sequences", async () => {
	const plot = await mount();
	expect(plot.anim()).toBe("A,Line");
	plot.anim(" Line , A ");
	expect(plot.anim()).toBe("Line,A");
	plot.previous();
	expect(plot.querySelector('[role="status"]')?.textContent).toBe("0 / 2");
	plot.next();
	plot.goToEnd();
	plot.next();
	expect(plot.querySelector('[role="status"]')?.textContent).toBe("2 / 2");
	plot.previous();
	expect(plot.querySelector('[role="status"]')?.textContent).toBe("1 / 2");
	plot.goToStart();
	expect(plot.querySelector('[role="status"]')?.textContent).toBe("0 / 2");
	expect(() => plot.anim("missing")).toThrow();
	expect(() => plot.anim("A,A")).toThrow();
	plot.anim("");
	expect(plot.querySelector(".tp-xy-plot-animation")).toBeNull();
	expect(
		Array.from(plot.querySelectorAll<SVGElement>("[data-xy-object]")).every(
			(e) => e.style.visibility === "visible",
		),
	).toBe(true);
});
it("retains preconnection animation settings and display attributes for numeric data", () => {
	const plot = new TpXYPlot();
	plot.anim("Line");
	plot.axis = "none";
	plot.grid = "none";
	plot.setData({
		title: "Data",
		xLabel: "x",
		yLabel: "y",
		series: [
			{
				label: "Line",
				points: [
					{ x: 0, y: 0 },
					{ x: 1, y: 1 },
				],
			},
		],
	});
	document.body.append(plot);
	expect(plot.anim()).toBe("Line");
	expect(
		plot.querySelector<SVGElement>('[data-xy-object="Line"]')?.style.visibility,
	).toBe("hidden");
	plot.goToEnd();
	expect(
		plot.querySelector<SVGElement>('[data-xy-object="Line"]')?.style.visibility,
	).toBe("visible");
});
