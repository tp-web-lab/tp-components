import { afterEach, describe, expect, it, vi } from "vitest";
import { TpXYPlot } from "./xy-plot.js";

async function plot(extra = ""): Promise<TpXYPlot> {
	const element = new TpXYPlot();
	element.textContent = `xyFunctionGraph
 x-axis [-4,4]
 y-axis [-4,4]
 functions [["Line", "x"]]
 points [["A",1,1]]
 ${extra}`;
	document.body.append(element);
	await Promise.resolve();
	await Promise.resolve();
	return element;
}
function click(element: TpXYPlot, direction: string, dialog = false): void {
	const button = element.querySelector<HTMLButtonElement>(
		`${dialog ? ".tp-xy-plot-dialog-header" : ".tp-xy-plot-toolbar"} [data-xy-zoom="${direction}"] button`,
	);
	if (!button) throw new Error("Missing zoom control");
	button.click();
}
function pointX(element: TpXYPlot): number {
	const circle = element.querySelector(
		'.tp-xy-plot-preview [data-xy-object="A"] circle',
	);
	if (!circle) throw new Error("Missing marker");
	return Number(circle.getAttribute("cx"));
}
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
describe("dynamic XY zoom", () => {
	it("changes the coordinate scale reversibly while preserving animation and presentation", async () => {
		const element = await plot('anim ["Line","A"]');
		element.grid = "horizontal";
		element.noLegend = true;
		element.next();
		const original = pointX(element);
		click(element, "in");
		expect(pointX(element)).toBeGreaterThan(original);
		expect(
			element.querySelector('.tp-xy-plot-animation [role="status"]')
				?.textContent,
		).toBe("1 / 2");
		expect(
			element.querySelector<SVGElement>('[data-xy-object="A"]')?.style
				.visibility,
		).toBe("hidden");
		expect(
			element.querySelector<SVGElement>("[data-xy-legend]")?.style.display,
		).toBe("none");
		expect(
			element.querySelector<SVGElement>('[data-xy-grid="vertical"]')?.style
				.display,
		).toBe("none");
		const preview = element.querySelector(".tp-xy-plot-preview > svg");
		const enlarged = element.querySelector(".tp-xy-plot-dialog-content > svg");
		expect(enlarged?.outerHTML).toBe(preview?.outerHTML);
		expect(
			element.querySelector<HTMLButtonElement>(
				".tp-xy-plot-dialog-header [data-xy-zoom] button",
			)?.type,
		).toBe("button");
		click(element, "out", true);
		expect(pointX(element)).toBe(original);
	});
	it("bounds repeated zoom and restores explicit ticks and axes on return", async () => {
		const element = await plot("x-ticks [-4,0,4]\nx-axis-at 4");
		const original = element.querySelector(".tp-xy-plot-preview")?.innerHTML;
		click(element, "in");
		expect(
			element.querySelector('svg > line[data-xy-axis="horizontal"]'),
		).toBeNull();
		click(element, "out");
		expect(element.querySelector(".tp-xy-plot-preview")?.innerHTML).toBe(
			original,
		);
		for (let i = 0; i < 15; i++) click(element, "in");
		expect(
			element.querySelector('[data-xy-zoom="in"]')?.hasAttribute("disabled"),
		).toBe(true);
		click(element, "out");
		expect(
			element.querySelector('[data-xy-zoom="in"]')?.hasAttribute("disabled"),
		).toBe(false);
	});
	it("zooms numeric data and resets the scale when data is replaced", async () => {
		const element = await plot();
		const data = {
			title: "Data",
			xLabel: "x",
			yLabel: "y",
			series: [
				{
					label: "Data",
					points: [
						{ x: -4, y: -4 },
						{ x: 4, y: 4 },
					],
				},
			],
			points: [{ label: "A", x: 1, y: 1 }],
		};
		element.setData(data);
		const original = pointX(element);
		click(element, "in");
		expect(pointX(element)).toBeGreaterThan(original);
		element.setData(data);
		expect(pointX(element)).toBe(original);
	});
	it.each([
		'xyPolarGraph\nx-axis [-4,4]\ny-axis [-4,4]\ntheta-axis [0,6.28]\nfunctions [["Circle","2"]]',
		'xyParametricGraph\nx-axis [-4,4]\ny-axis [-4,4]\nt-axis [0,6.28]\nfunctions [["Circle","2*cos(t)","2*sin(t)"]]',
	])(
		"zooms polar and parametric curves without changing the parameter interval",
		async (source) => {
			const element = new TpXYPlot();
			element.textContent = source;
			document.body.append(element);
			await Promise.resolve();
			await Promise.resolve();
			const path = () =>
				element
					.querySelector('.tp-xy-plot-preview path[data-xy-object="Circle"]')
					?.getAttribute("d");
			const original = path();
			expect(original).toBeTruthy();
			click(element, "in");
			expect(path()).not.toBe(original);
			click(element, "out");
			expect(path()).toBe(original);
		},
	);
});

describe("XY viewport pan and reset", () => {
	it("pans with arrow keys and resets both scale and center without resetting animation", async () => {
		const element = await plot('anim ["Line","A"]');
		element.next();
		const original = pointX(element);
		const host = element.querySelector<HTMLElement>(".tp-xy-plot-preview");
		if (!host) throw new Error("Missing viewport");
		host.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(pointX(element)).toBeGreaterThan(original);
		click(element, "in");
		const moved = pointX(element);
		expect(moved).toBeGreaterThan(original);
		click(element, "reset", true);
		expect(pointX(element)).toBe(original);
		expect(
			element.querySelector('.tp-xy-plot-animation [role="status"]')
				?.textContent,
		).toBe("1 / 2");
		host.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
		);
		expect(pointX(element)).toBeLessThan(original);
		host.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
		);
		expect(pointX(element)).toBe(original);
	});
	it("tracks a captured pointer in both directions, flushes the last move and releases capture", async () => {
		const element = await plot();
		const host = element.querySelector<HTMLElement>(".tp-xy-plot-preview");
		const frame = host?.querySelector('rect[stroke="#999"]');
		if (!host || !frame) throw new Error("Missing viewport frame");
		vi.spyOn(frame, "getBoundingClientRect").mockReturnValue(
			new DOMRect(0, 0, 520, 520),
		);
		const capture = vi.fn();
		const release = vi.fn();
		Object.defineProperty(host, "setPointerCapture", { value: capture });
		Object.defineProperty(host, "hasPointerCapture", { value: () => true });
		Object.defineProperty(host, "releasePointerCapture", { value: release });
		const request = vi.fn(() => 1);
		const cancel = vi.fn();
		vi.stubGlobal("requestAnimationFrame", request);
		vi.stubGlobal("cancelAnimationFrame", cancel);
		function pointer(type: string, x: number, y: number): void {
			const event = new MouseEvent(type, {
				clientX: x,
				clientY: y,
				button: 0,
				bubbles: true,
			});
			Object.defineProperty(event, "pointerId", { value: 7 });
			host?.dispatchEvent(event);
		}
		const original = pointX(element);
		pointer("pointerdown", 100, 100);
		pointer("pointermove", 126, 74);
		pointer("pointermove", 152, 48);
		expect(request).toHaveBeenCalledTimes(1);
		pointer("pointerup", 152, 48);
		expect(pointX(element)).toBeCloseTo(original + 52);
		expect(capture).toHaveBeenCalledWith(7);
		expect(release).toHaveBeenCalledWith(7);
		expect(cancel).toHaveBeenCalledWith(1);
		expect(host.classList.contains("tp-xy-plot-panning")).toBe(false);
		expect(
			element.querySelector(".tp-xy-plot-dialog-content > svg")?.outerHTML,
		).toBe(element.querySelector(".tp-xy-plot-preview > svg")?.outerHTML);
		click(element, "reset");
		expect(pointX(element)).toBe(original);
	});
});
