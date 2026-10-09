import {
	parseXYGraph,
	renderXYGraphSvg,
	sampleXYGraph,
} from "@tp/tp-utilities/xy-graph";
import { afterEach, describe, expect, it } from "vitest";
import "./xy-plot.js";

const source = `xyFunctionGraph
  x-axis [-2, 2]
  y-axis [-2, 2]
  x-ticks [-2, 0, 2]
  y-ticks [-2, 0, 2]
  functions ["x"]`;

function render(settings = ""): SVGSVGElement {
	const diagram = parseXYGraph(`${source}\n${settings}`);
	const template = document.createElement("template");
	template.innerHTML = renderXYGraphSvg(diagram, sampleXYGraph(diagram));
	const svg = template.content.querySelector("svg");
	if (!svg) throw new Error("Missing plot");
	return svg;
}

afterEach(() => document.body.replaceChildren());

describe("XY plot grid and axes", () => {
	it.each([
		["", 3, 3],
		["both", 3, 3],
		["none", 0, 0],
		["horizontal", 0, 3],
		["vertical", 3, 0],
	] as const)(
		"renders grid %s without removing ticks or curves",
		(grid, vertical, horizontal) => {
			const svg = render(grid ? `grid ${grid}` : "");
			const lines = [...svg.querySelectorAll('line[stroke="#eee"]')];
			expect(
				lines.filter(
					(line) => line.getAttribute("x1") === line.getAttribute("x2"),
				),
			).toHaveLength(vertical);
			expect(
				lines.filter(
					(line) => line.getAttribute("y1") === line.getAttribute("y2"),
				),
			).toHaveLength(horizontal);
			expect(svg.querySelectorAll('line[stroke="#666"]')).toHaveLength(6);
			expect(svg.querySelectorAll(':scope > line[stroke="#aaa"]')).toHaveLength(
				2,
			);
			expect(svg.querySelector("path")?.getAttribute("d")).toContain("M ");
		},
	);

	it("moves axes, tick marks and labels to their requested coordinates", () => {
		const svg = render(
			'grid none\nx-axis-at 1\ny-axis-at -1\nlegend-x "x"\nlegend-y "y"',
		);
		const axes = svg.querySelectorAll(':scope > line[stroke="#aaa"]');
		expect(axes[0]?.getAttribute("y1")).toBe("200");
		expect(axes[0]?.getAttribute("y2")).toBe("200");
		expect(axes[1]?.getAttribute("x1")).toBe("320");
		expect(axes[1]?.getAttribute("x2")).toBe("320");
		const ticks = svg.querySelectorAll('line[stroke="#666"]');
		expect(ticks[0]?.getAttribute("y1")).toBe("200");
		expect(ticks[3]?.getAttribute("x2")).toBe("320");
		const labels = svg.querySelectorAll(":scope > g > text");
		expect(labels[0]?.getAttribute("y")).toBe("222");
		expect(labels[3]?.getAttribute("x")).toBe("310");
		expect(svg.querySelector(':scope > text[y="244"]')?.textContent).toBe("x");
		expect(svg.querySelector(':scope > text[x="270"]')?.textContent).toBe("y");
	});

	it("accepts all four boundary positions and mathematical expressions", () => {
		for (const at of [-2, 2]) {
			expect(
				render(`x-axis-at ${at}\ny-axis-at ${at}`).querySelectorAll(
					':scope > line[stroke="#aaa"]',
				),
			).toHaveLength(2);
		}
		expect(
			parseXYGraph(
				`xyFunctionGraph\nx-axis-at PI/2\ny-axis-at -PI/2\nx-axis [-2,2]\ny-axis [-2,2]\nfunctions ["x"]`,
			),
		).toMatchObject({ xAxisAt: Math.PI / 2, yAxisAt: -Math.PI / 2 });
	});

	it("preserves the original layout when positions are omitted", () => {
		const svg = render();
		const ticks = svg.querySelectorAll('line[stroke="#666"]');
		expect(ticks[0]?.getAttribute("y1")).toBe("590");
		expect(ticks[3]?.getAttribute("x2")).toBe("190");
		const axes = svg.querySelectorAll(':scope > line[stroke="#aaa"]');
		expect(axes[0]?.getAttribute("y1")).toBe("330");
		expect(axes[1]?.getAttribute("x1")).toBe("450");
	});

	it.each([
		"grid diagonal",
		"grid",
		"x-axis-at 3",
		"y-axis-at -3",
		"x-axis-at 1/0",
		"y-axis-at sqrt(-1)",
	])("rejects invalid settings: %s", (setting) => {
		expect(() => parseXYGraph(`${source}\n${setting}`)).toThrow();
	});

	it.each(["xyPolarGraph", "xyParametricGraph"])("supports %s", (kind) => {
		const functions =
			kind === "xyPolarGraph"
				? 'functions ["1"]'
				: 'functions [["cos(t)", "sin(t)"]]';
		const diagram = parseXYGraph(
			`${kind}\ngrid vertical\nx-axis-at 1\ny-axis-at -1\n${functions}`,
		);
		expect(diagram).toMatchObject({
			grid: "vertical",
			xAxisAt: 1,
			yAxisAt: -1,
		});
		expect(renderXYGraphSvg(diagram, sampleXYGraph(diagram))).toContain("<svg");
	});

	it("uses the same settings in the preview and the zoom dialog", async () => {
		const plot = document.createElement("tp-xy-plot");
		plot.textContent = `${source}\ngrid none\nx-axis-at 1\ny-axis-at -1`;
		document.body.append(plot);
		await Promise.resolve();
		await Promise.resolve();
		const svgs = plot.querySelectorAll(
			".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
		);
		expect(svgs).toHaveLength(2);
		for (const svg of svgs) {
			expect(
				Array.from(
					svg.querySelectorAll<SVGElement>('line[stroke="#eee"]'),
				).every((line) => line.style.display === "none"),
			).toBe(true);
			expect(
				svg.querySelector(':scope > line[stroke="#aaa"]')?.getAttribute("y1"),
			).toBe("200");
		}
	});
});
