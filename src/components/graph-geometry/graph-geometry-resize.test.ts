import { afterEach, expect, it, vi } from "vitest";
import { TpGraphGeometry } from "./graph-geometry.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

it("extends and shrinks the view below unchanged geometry and exports its actual height", async () => {
	let resize: (() => void) | undefined;
	let disconnected = false;
	vi.stubGlobal(
		"ResizeObserver",
		class {
			private canvas = false;
			constructor(private callback: () => void) {}
			observe(target: Element) {
				if (target.classList.contains("tp-geometry-canvas")) {
					this.canvas = true;
					resize = this.callback;
				}
			}
			unobserve() {}
			disconnect() {
				if (this.canvas) disconnected = true;
			}
		},
	);
	const g = new TpGraphGeometry();
	g.value = "point A = (0,0)\npoint B = (3,4)\ncircle c = circle(A,through=B)";
	g.grid = true;
	document.body.append(g);
	await Promise.resolve();
	const canvas = g.querySelector(".tp-geometry-canvas");
	const svg = g.querySelector("svg[data-geometry-canvas]");
	if (!canvas || !svg || !resize) throw Error("Missing observed canvas");
	let height = 560;
	let width = 900;
	vi.spyOn(canvas, "getBoundingClientRect").mockImplementation(() => ({
		x: 0,
		y: 0,
		left: 0,
		top: 0,
		right: width,
		bottom: height,
		width,
		height,
		toJSON: () => ({}),
	}));
	const source = g.value;
	const drawing = g.querySelector("[data-drawing]")?.innerHTML;
	for (const next of [1000, 1600, 560]) {
		height = next;
		resize();
		expect(svg.getAttribute("viewBox")).toBe(`0 0 900 ${next}`);
		expect(g.querySelector("[data-drawing]")?.innerHTML).toBe(drawing);
		expect(g.value).toBe(source);
		expect(g.querySelector("[data-grid] path")?.getAttribute("d")).toContain(
			`V ${next}`,
		);
		const exported = new DOMParser().parseFromString(
			g.exportSvg(),
			"image/svg+xml",
		).documentElement;
		expect(exported.getAttribute("height")).toBe(String(next));
	}
	width = 450;
	height = 800;
	resize();
	expect(svg.getAttribute("viewBox")).toBe("0 0 900 1600");
	expect(g.querySelector("[data-drawing]")?.innerHTML).toBe(drawing);
	width = 0;
	height = 0;
	resize();
	expect(svg.getAttribute("viewBox")).toBe("0 0 900 1600");
	g.remove();
	expect(disconnected).toBe(true);
});
