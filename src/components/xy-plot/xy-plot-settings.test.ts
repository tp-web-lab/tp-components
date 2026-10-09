import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TpXYPlot } from "./xy-plot.js";

const source = `xyFunctionGraph
  title "Original"
  x-axis [-2, 6]
  y-axis [-5, 25]
  grid horizontal
  functions [["Parabola", "x*x", [0, 3]]]
  points [["A", 2, 4, 10, 10]]`;

beforeEach(() => {
	// Layout and CodeMirror measurements are covered in the browser integration checks.
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
});

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

async function create(settings = true): Promise<TpXYPlot> {
	const plot = new TpXYPlot();
	plot.settings = settings;
	plot.textContent = source;
	document.body.append(plot);
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-preview > svg")).not.toBeNull(),
	);
	return plot;
}
async function open(plot: TpXYPlot): Promise<HTMLElement> {
	plot
		.querySelector<HTMLButtonElement>(".tp-xy-plot-settings-button > button")
		?.click();
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-settings")).not.toBeNull(),
	);
	const panel = plot.querySelector<HTMLElement>(".tp-xy-plot-settings");
	if (!panel) throw new Error("Missing settings panel");
	return panel;
}
function field(
	panel: HTMLElement,
	name: string,
): HTMLElement & { value: string } {
	const control = panel.querySelector<HTMLElement & { value: string }>(
		`[data-directive="${name}"]`,
	);
	if (!control) throw new Error(`Missing ${name}`);
	return control;
}
function edit(panel: HTMLElement, name: string, value: string): void {
	const control = field(panel, name);
	control.value = value;
	control.dispatchEvent(new Event("input", { bubbles: true }));
}
function title(plot: TpXYPlot): string | undefined | null {
	return plot.querySelector(".tp-xy-plot-preview > svg > text")?.textContent;
}

it("adds settings only when requested and toggles a labelled panel", async () => {
	const plot = await create(false);
	expect(plot.querySelector(".tp-xy-plot-settings-button")).toBeNull();
	plot.settings = true;
	const button = plot.querySelector<HTMLButtonElement>(
		".tp-xy-plot-settings-button > button",
	);
	expect(button?.getAttribute("aria-expanded")).toBe("false");
	const panel = await open(plot);
	expect(button?.getAttribute("aria-controls")).toBe(panel.id);
	expect(button?.getAttribute("aria-expanded")).toBe("true");
	expect(field(panel, "grid").value).toBe("2");
	expect(field(panel, "functions").value).toContain("[0, 3]");
	button?.click();
	expect(panel.hidden).toBe(true);
	button?.click();
	expect(panel.hidden).toBe(false);
	plot.settings = false;
	expect(plot.querySelector(".tp-xy-plot-settings")).toBeNull();
	expect(plot.querySelector(".tp-xy-plot-settings-button")).toBeNull();
});

it("updates both plots without replacing controls and resets to the original definition", async () => {
	const plot = await create();
	const panel = await open(plot);
	const input = field(panel, "title");
	edit(panel, "title", "Changed");
	await vi.waitFor(() => expect(title(plot)).toBe("Changed"));
	expect(field(panel, "title")).toBe(input);
	expect(
		plot.querySelector(".tp-xy-plot-dialog-content > svg > text")?.textContent,
	).toBe("Changed");
	edit(panel, "grid", "4");
	await vi.waitFor(() =>
		expect(
			Array.from(
				plot.querySelectorAll<SVGElement>(
					'.tp-xy-plot-preview line[stroke="#eee"]',
				),
			).every((line) => line.style.display === "none"),
		).toBe(true),
	);
	panel.querySelector<HTMLElement>(".tp-xy-plot-settings-reset")?.click();
	expect(title(plot)).toBe("Original");
	expect(field(panel, "title").value).toBe("Original");
	expect(field(panel, "functions").value).toContain("[0, 3]");
	expect(field(panel, "grid").value).toBe("2");
});

it("retains the last valid drawing and recovers from invalid settings", async () => {
	const plot = await create();
	const panel = await open(plot);
	const svg = plot.querySelector(".tp-xy-plot-preview")?.innerHTML;
	edit(panel, "samples", "0");
	await vi.waitFor(() =>
		expect(panel.querySelector('[role="status"]')?.textContent).toContain(
			"samples",
		),
	);
	expect(plot.querySelector(".tp-xy-plot-preview")?.innerHTML).toBe(svg);
	edit(panel, "samples", "64");
	edit(panel, "x-axis", "[2, 2]");
	await vi.waitFor(() =>
		expect(panel.querySelector('[role="status"]')?.textContent).toContain(
			"increasing",
		),
	);
	edit(panel, "x-axis", "[-2, 6]");
	edit(panel, "title", "Recovered");
	await vi.waitFor(() => expect(title(plot)).toBe("Recovered"));
});

it("keeps multiple instances independent and preserves edits across reconnection", async () => {
	const first = await create();
	const second = await create();
	const firstPanel = await open(first);
	const secondPanel = await open(second);
	expect(firstPanel.id).not.toBe(secondPanel.id);
	edit(firstPanel, "title", "First only");
	await vi.waitFor(() => expect(title(first)).toBe("First only"));
	expect(title(second)).toBe("Original");
	first.remove();
	document.body.append(first);
	await vi.waitFor(() => expect(title(first)).toBe("First only"));
	const reconnected = await open(first);
	reconnected.querySelector<HTMLElement>(".tp-xy-plot-settings-reset")?.click();
	expect(title(first)).toBe("Original");
});

it("does not clear numeric data when settings changes", async () => {
	const plot = new TpXYPlot();
	plot.setData({
		title: "Numeric",
		xLabel: "x",
		yLabel: "y",
		series: [
			{
				label: "Samples",
				points: [
					{ x: 0, y: 1 },
					{ x: 1, y: 2 },
				],
			},
		],
	});
	document.body.append(plot);
	plot.settings = true;
	expect(title(plot)).toBe("Numeric");
	expect(
		plot.querySelector<HTMLButtonElement>(
			".tp-xy-plot-settings-button > button",
		)?.disabled,
	).toBe(true);
	plot.settings = false;
	expect(title(plot)).toBe("Numeric");
});

it("uses a newly loaded src as the reset definition and does not refetch on edits", async () => {
	const fetchMock = vi.fn().mockResolvedValue({
		ok: true,
		text: async () => source.replace('"Original"', '"Loaded"'),
	});
	vi.stubGlobal("fetch", fetchMock);
	const plot = await create();
	await open(plot);
	plot.setAttribute("src", "/graph.xy");
	await vi.waitFor(() => expect(title(plot)).toBe("Loaded"));
	const panel = await open(plot);
	edit(panel, "title", "Edited remote");
	await vi.waitFor(() => expect(title(plot)).toBe("Edited remote"));
	panel.querySelector<HTMLElement>(".tp-xy-plot-settings-reset")?.click();
	expect(title(plot)).toBe("Loaded");
	expect(fetchMock).toHaveBeenCalledOnce();
});

it("creates only one panel when toggled repeatedly during loading", async () => {
	const plot = await create();
	const button = plot.querySelector<HTMLButtonElement>(
		".tp-xy-plot-settings-button > button",
	);
	button?.click();
	button?.click();
	button?.click();
	await vi.waitFor(() =>
		expect(plot.querySelectorAll(".tp-xy-plot-settings")).toHaveLength(1),
	);
	await Promise.resolve();
	expect(plot.querySelectorAll(".tp-xy-plot-settings")).toHaveLength(1);
});

it("edits vectors alongside styled curves and allows removing all curves", async () => {
	const plot = await create();
	const panel = await open(plot);
	edit(panel, "functions", '[["Line", "x", "dotted"]]');
	await vi.waitFor(() =>
		expect(
			plot
				.querySelector(".tp-xy-plot-preview > svg > path")
				?.getAttribute("stroke-dasharray"),
		).toBe("0 5"),
	);
	edit(panel, "vectors", '[["u", 0, 0, 2, 3, "dash-dot"]]');
	await vi.waitFor(() =>
		expect(plot.querySelectorAll(".tp-md-xy-graph-vector")).toHaveLength(2),
	);
	edit(panel, "functions", "[]");
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-preview > svg > path")).toBeNull(),
	);
	expect(plot.querySelectorAll(".tp-md-xy-graph-vector")).toHaveLength(2);
	expect(field(panel, "vectors").value).toContain('"dash-dot"');
	panel
		.querySelector<HTMLButtonElement>(".tp-xy-plot-settings-reset > button")
		?.click();
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-md-xy-graph-vector")).toBeNull(),
	);
});
