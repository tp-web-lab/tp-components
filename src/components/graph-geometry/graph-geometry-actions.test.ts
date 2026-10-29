import { afterEach, expect, it, vi } from "vitest";
import { useFixedJSDOMLayout } from "../../test-helpers/jsdom-layout.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { GEOMETRY_SHORTCUTS } from "./geometry-actions.js";
import { TpGraphGeometry } from "./graph-geometry.js";

useFixedJSDOMLayout();

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
function mount() {
	const g = new TpGraphGeometry();
	g.setAttribute("built-in", "");
	document.body.append(g);
	return g;
}
it("exposes every tool as a named icon, palette entry and unique working shortcut", () => {
	const g = mount();
	expect(new Set(Object.values(GEOMETRY_SHORTCUTS)).size).toBe(31);
	for (const [tool, key] of Object.entries(GEOMETRY_SHORTCUTS)) {
		const button = g.querySelector(`tp-icon-button[data-tool="${tool}"]`);
		expect(button?.getAttribute("title")).toContain(key);
		expect(button?.getAttribute("label")).toBeTruthy();
		expect(
			g
				.querySelector(`[data-palette-tool="${tool}"] tp-icon`)
				?.getAttribute("name"),
		).toBe(tool);
		g.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: key.split("+").at(-1),
				shiftKey: key.startsWith("Shift+"),
				bubbles: true,
			}),
		);
		expect(g.dataset.activeTool).toBe(tool);
		expect(g.querySelector("tp-callout")?.getAttribute("icon")).toBe(tool);
	}
});
it("does not capture typing and respects readonly and built-in availability", () => {
	const g = mount();
	g.removeAttribute("built-in");
	g.dispatchEvent(new KeyboardEvent("keydown", { key: "n", bubbles: true }));
	expect(g.dataset.activeTool).toBe("move");
	const input = g.querySelector("input");
	input?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "p", bubbles: true }),
	);
	expect(g.dataset.activeTool).toBe("move");
	g.setAttribute("readonly", "");
	g.dispatchEvent(new KeyboardEvent("keydown", { key: "p", bubbles: true }));
	expect(g.dataset.activeTool).toBe("move");
	g.dispatchEvent(new KeyboardEvent("keydown", { key: "h", bubbles: true }));
	expect(g.dataset.activeTool).toBe("pan");
});
it("renders label as text and changes it without resetting construction or draft source", () => {
	const g = mount();
	const before = g.value;
	const svg = g.querySelector("[data-geometry-canvas]");
	g.label = "<img src=x> Triangle";
	expect(g.querySelector("[data-figure-title]")?.textContent).toBe(g.label);
	expect(g.querySelector("[data-figure-title] img")).toBeNull();
	expect(g.value).toBe(`label = ${JSON.stringify(g.label)}\n${before}`);
	expect(g.querySelector("[data-geometry-canvas]")).toBe(svg);
});
it("enlarges the same interactive board and restores it on close", () => {
	const g = mount();
	g.canvasOnly = true;
	const board = g.querySelector(".tp-geometry-board");
	const dialog = g.querySelector<HTMLDialogElement>(".tp-geometry-dialog");
	if (!dialog) throw Error("Missing zoom dialog");
	dialog.showModal = vi.fn(() => dialog.setAttribute("open", ""));
	dialog.close = vi.fn(() => {
		dialog.removeAttribute("open");
		dialog.dispatchEvent(new Event("close"));
	});
	g.querySelector<HTMLElement>('[data-action="zoom"]')?.click();
	expect(dialog.contains(board)).toBe(true);
	g.value = "point A = (2, 3)";
	g.querySelector<HTMLElement>('[data-action="zoom"]')?.click();
	expect(g.querySelector(".tp-geometry-workspace")?.contains(board)).toBe(true);
	expect(g.value).toContain("(2, 3)");
});

it("keeps the requested grouped order in the strip and palette", () => {
	const g = mount();
	g.removeAttribute("built-in");
	const order = [
		"move",
		"pan",
		"point",
		"on",
		"intersection",
		"line",
		"ray",
		"segment",
		"fixedSegment",
		"vector",
		"sector",
		"circle",
		"through",
		"arc",
		"length",
		"area",
		"angle",
		"comment",
	];
	expect(
		[...g.querySelectorAll<HTMLElement>(".tp-geometry-tools [data-tool]")].map(
			(e) => e.dataset.tool,
		),
	).toEqual(order);
	expect(
		[...g.querySelectorAll<HTMLElement>("[data-palette-tool]")].map(
			(e) => e.dataset.paletteTool,
		),
	).toEqual(order);
	expect(
		g.querySelectorAll(".tp-geometry-tools tp-divider[orientation=vertical]"),
	).toHaveLength(5);
	expect(
		g.querySelectorAll(
			"[data-tool-palette] tp-divider[orientation=horizontal]",
		),
	).toHaveLength(5);
	expect(g.querySelector('[data-action="example"]')).toBeNull();
	expect(g.querySelector('[data-action="palette"]')?.getAttribute("name")).toBe(
		"keyboard-outline",
	);
	g.label = "My construction";
	expect(
		g.querySelector(".tp-geometry-board-heading [data-figure-title]")
			?.textContent,
	).toBe("My construction");
});

it("separates built-in constructions, polygons, symmetries and transformations in both menus", () => {
	const g = mount();
	const expected = [
		"midpoint",
		"perpendicular",
		"parallel",
		"perpendicularBisector",
		"bisector",
		"tangent",
		"divider",
		"polygon",
		"regularPolygon",
		"divider",
		"axialSymmetry",
		"centralSymmetry",
		"divider",
		"homothety",
		"rotation",
		"translation",
	];
	for (const [selector, attribute] of [
		[".tp-geometry-tools", "data-tool"],
		["[data-tool-palette] > ul", "data-palette-tool"],
	] as const) {
		const entries = [
			...g.querySelectorAll(
				`${selector} > [${attribute}], ${selector} > tp-divider`,
			),
		].map((e) => e.getAttribute(attribute) ?? "divider");
		expect(entries.slice(entries.indexOf("midpoint"))).toEqual(expected);
	}
});
it("deletes the selection and dependents with Delete in canvas-only mode, with undo", () => {
	const g = mount();
	g.value = "point A = (0, 0)\npoint B = (4, 0)\nsegment s = segment(A, B)";
	g.canvasOnly = true;
	const before = g.value;
	const pressDelete = () =>
		g
			.querySelector("[data-geometry-canvas]")
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Delete", bubbles: true }),
			);
	pressDelete();
	expect(g.value).toBe(before);
	g.querySelector<HTMLElement>('[data-object="A"]')?.click();
	pressDelete();
	expect([...g.analyze().values.keys()]).toEqual(["B"]);
	g.undo();
	expect(g.value).toBe(before);
	g.querySelector<HTMLElement>('[data-object="A"]')?.click();
	g.querySelector("input")?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Delete", bubbles: true }),
	);
	expect(g.value).toBe(before);
	g.setAttribute("readonly", "");
	g.querySelector<HTMLElement>('[data-object="A"]')?.click();
	pressDelete();
	expect(g.value).toBe(before);
});

it("switches the same compact board between source and drawing without losing drafts", () => {
	const g = mount();
	g.canvasOnly = true;
	const board = g.querySelector(".tp-geometry-board");
	const canvas = g.querySelector("[data-geometry-canvas]");
	const source = g.querySelector(".tp-geometry-source");
	const editor = g.querySelector<TpCodeEditor>("tp-code-editor");
	const toggle = g.querySelector<HTMLElement>('[data-action="source-view"]');
	if (!editor || !toggle) throw Error("Missing source controls");
	expect(board?.contains(source)).toBe(true);
	const before = g.value;
	const draft = "<!-- draft -->\npoint P = (2, 3)";
	editor.setValue(draft);
	toggle.click();
	expect(board?.hasAttribute("data-source-open")).toBe(true);
	expect(source?.hasAttribute("hidden")).toBe(false);
	expect(toggle.getAttribute("aria-pressed")).toBe("true");
	toggle.click();
	expect(board?.hasAttribute("data-source-open")).toBe(false);
	expect(source?.hasAttribute("hidden")).toBe(true);
	expect(editor.getValue()).toBe(draft);
	expect(g.value).toBe(before);
	expect(g.querySelector("[data-geometry-canvas]")).toBe(canvas);
	toggle.click();
	g.querySelector<HTMLElement>('[data-action="apply"]')?.click();
	expect([...g.analyze().values.keys()]).toEqual(["P"]);
	const f1 = g.querySelector('[data-action="source-toolbar"]');
	expect(f1?.getAttribute("name")).toBe("keyboard-f1");
	expect(f1?.getAttribute("library")).toBe("tp");
	g.canvasOnly = false;
	expect(
		g.querySelector(".tp-geometry-board .tp-geometry-source"),
	).not.toBeNull();
	expect(
		g
			.querySelector<TpCodeEditor>(".tp-geometry-source tp-code-editor")
			?.getValue(),
	).toBe(g.value);
});

it("keeps focus on activated tool buttons while shortcuts focus the drawing", async () => {
	const g = mount();
	const pan = g.querySelector<HTMLButtonElement>('[data-tool="pan"] > button');
	if (!pan) throw new Error("Missing pan button");
	pan.focus();
	pan.click();
	await vi.waitFor(() => expect(pan.getAttribute("aria-pressed")).toBe("true"));
	expect(document.activeElement).toBe(pan);
	g.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: GEOMETRY_SHORTCUTS.point,
			bubbles: true,
		}),
	);
	expect(document.activeElement).toBe(
		g.querySelector("[data-geometry-canvas]"),
	);
});
