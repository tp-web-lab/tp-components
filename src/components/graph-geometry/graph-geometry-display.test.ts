import { afterEach, expect, it } from "vitest";
import type { TpTheme } from "../theme/theme.js";
import { TpGraphGeometry } from "./graph-geometry.js";

afterEach(() => document.body.replaceChildren());

it("keeps point editing and keyboard panning when switching canvas-only dynamically", () => {
	const g = new TpGraphGeometry();
	document.body.append(g);
	g.value =
		"point A = (0, 0)\npoint B = (4, 0)\ncircle c = circle(A, through=B)";
	const source = g.value;
	g.canvasOnly = true;
	const svg = g.querySelector("svg[data-geometry-canvas]");
	if (!svg) throw Error("Missing drawing");
	const x = () => g.querySelector('[data-id="A"] .point')?.getAttribute("cx");
	const before = x();
	svg.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(x()).not.toBe(before);
	expect(g.value).toBe(source);
	g.querySelector('[data-id="A"]')?.dispatchEvent(
		new MouseEvent("pointerdown", { bubbles: true }),
	);
	svg.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
	svg.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(g.analyze().values.get("A")).toMatchObject({
		point: { x: 0.2, y: 0 },
	});
	const moved = g.value;
	g.canvasOnly = false;
	expect(g.value).toBe(moved);
	g.undo();
	expect(g.value).toBe(source);
});

it("scopes the theme to one figure and retains it when the interface is rebuilt", () => {
	const first = new TpGraphGeometry();
	const second = new TpGraphGeometry();
	document.body.append(first, second);
	const theme = first.querySelector<TpTheme>("tp-theme");
	if (!theme) throw Error("Missing theme switcher");
	theme.mode = "dark";
	expect(first.classList.contains("tp-dark")).toBe(true);
	expect(second.classList.contains("tp-dark")).toBe(false);
	expect(document.body.classList.contains("tp-dark")).toBe(false);
	first.canvasOnly = true;
	expect(first.querySelector("tp-theme")?.getAttribute("mode")).toBe("dark");
	expect(first.classList.contains("tp-dark")).toBe(true);
	first.removeAttribute("canvas-only");
	expect(first.querySelector("tp-theme")?.getAttribute("mode")).toBe("dark");
});

it.each([false, true])(
	"toggles construction objects without changing the drawing (canvas-only=%s)",
	(canvasOnly) => {
		const g = new TpGraphGeometry();
		g.canvasOnly = canvasOnly;
		g.setAttribute("readonly", "");
		document.body.append(g);
		const source = g.value;
		const panel = g.querySelector<HTMLElement>("aside");
		const toggle = g.querySelector<HTMLElement>(
			'[data-action="objects-panel"]',
		);
		expect(toggle?.getAttribute("name")).toBe("splitscreen-right");
		expect(toggle?.previousElementSibling?.getAttribute("data-action")).toBe(
			"grid",
		);
		expect(panel?.hidden).toBe(canvasOnly);
		toggle?.click();
		expect(panel?.hidden).toBe(!canvasOnly);
		expect(toggle?.getAttribute("aria-expanded")).toBe(String(canvasOnly));
		expect(g.value).toBe(source);
		toggle?.click();
		expect(panel?.hidden).toBe(canvasOnly);
		expect(g.value).toBe(source);
	},
);

it.each([false, true])(
	"switches source and objects in place (canvas-only=%s)",
	(compact) => {
		const g = new TpGraphGeometry();
		g.canvasOnly = compact;
		document.body.append(g);
		const canvas = g.querySelector<HTMLElement>(".tp-geometry-canvas");
		const source = g.querySelector<HTMLElement>(".tp-geometry-source");
		const objects = g.querySelector<HTMLElement>("aside");
		const click = (name: string) =>
			g.querySelector<HTMLElement>(`[data-action="${name}"]`)?.click();
		click("source-view");
		expect(source?.hidden).toBe(false);
		expect(source?.querySelector("details, tp-accordion")).toBeNull();
		expect(canvas?.hidden).toBe(compact);
		if (compact) {
			click("objects-panel");
			expect(objects?.hidden).toBe(false);
			expect(source?.hidden).toBe(true);
			expect(canvas?.hidden).toBe(true);
			click("source-view");
			expect(source?.hidden).toBe(false);
			expect(objects?.hidden).toBe(true);
		}
		click("source-view");
		expect(canvas?.hidden).toBe(false);
		expect(source?.hidden).toBe(true);
		expect(g.querySelector(".tp-geometry-canvas")).toBe(canvas);
	},
);
