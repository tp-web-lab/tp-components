import { afterEach, expect, it, vi } from "vitest";
import { TpXYPlot, type TpXYPlotData } from "./xy-plot.js";

/** Independent numeric runs, including a singleton sample. */
const data: TpXYPlotData = {
	title: "Altitude",
	xLabel: "Distance (km)",
	yLabel: "Elevation (m)",
	series: [
		{
			label: "First",
			points: [
				{ x: 0, y: 0 },
				{ x: 1, y: 20 },
			],
		},
		{ label: "Isolated", points: [{ x: 2, y: -5 }] },
	],
};

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("renders separate numeric runs and isolated points before and after connection", async () => {
	const plot = new TpXYPlot();
	plot.setData(data);
	document.body.append(plot);
	expect(plot.querySelectorAll('svg[aria-label="Altitude"]')).toHaveLength(2);
	expect(plot.textContent).toContain("Distance (km)");
	expect(plot.querySelector("circle")).not.toBeNull();
	plot.setData({
		...data,
		points: [{ x: 1, y: 20, label: "Peak <safe>", dx: -20, dy: 15 }],
	});
	expect(plot.querySelector(".tp-md-xy-graph-point-label")?.textContent).toBe(
		"Peak <safe>",
	);
	expect(plot.querySelector("safe")).toBeNull();
	plot.remove();
	document.body.append(plot);
	expect(
		plot.querySelectorAll(
			".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
		),
	).toHaveLength(2);
	plot.setData({
		...data,
		series: [
			{
				label: "Flat",
				points: [
					{ x: 0, y: 4 },
					{ x: 0, y: 4 },
				],
			},
		],
	});
	expect(plot.querySelector('[role="alert"]')).toBeNull();
	expect(plot.textContent).toContain("Flat");
	await Promise.resolve();
	expect(
		plot.querySelectorAll(
			".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
		),
	).toHaveLength(2);
});

it("validates data and prevents an old source response from replacing a new numeric plot", async () => {
	let respond: ((response: Response) => void) | undefined;
	vi.stubGlobal(
		"fetch",
		vi.fn(
			() =>
				new Promise<Response>((resolve) => {
					respond = resolve;
				}),
		),
	);
	const plot = new TpXYPlot();
	plot.setAttribute("src", "/pending.xy");
	document.body.append(plot);
	plot.setData(data);
	respond?.(new Response("invalid source"));
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(plot.querySelector('[role="alert"]')).toBeNull();
	plot.setData({ ...data, series: [] });
	expect(plot.textContent).toContain("finite data");
	plot.setData({ ...data, points: [{ x: 0, y: NaN, label: "Invalid" }] });
	expect(plot.textContent).toContain("finite data");
	plot.setData({
		...data,
		series: [{ label: "Invalid", points: [{ x: Infinity, y: 0 }] }],
	});
	expect(plot.textContent).toContain("finite data");
	plot.setData(data);
	plot.removeAttribute("src");
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(plot.innerHTML).toBe("");
});
