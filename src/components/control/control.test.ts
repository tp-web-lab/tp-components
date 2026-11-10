import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./control.js";

beforeEach(() => {
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => ({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
async function create(value = "") {
	const scope = document.createElement("section");
	scope.innerHTML = `<tp-control value="${value}"></tp-control>`;
	document.body.append(scope);
	const control = scope.querySelector("tp-control");
	if (!control) throw new Error("Missing control");
	await Promise.resolve();
	return { control, scope };
}
describe("tp-control", () => {
	it("shows the selected controllers and synchronizes individual and all checkboxes", async () => {
		const { control } = await create("color,theme");
		const checks = control.querySelectorAll<HTMLInputElement>(
			":scope > tp-dropdown input",
		);
		expect(checks).toHaveLength(8);
		expect(checks[0]?.indeterminate).toBe(true);
		expect(checks[4]?.checked).toBe(true);
		expect(checks[5]?.checked).toBe(true);
		checks[3]?.click();
		expect(control.value).toBe("dir,color,theme");
		checks[0]?.click();
		expect(control.value).toBe("clock,lang,dir,color,theme,screen,fullscreen");
		expect(checks[0]?.checked).toBe(true);
		expect(checks[0]?.indeterminate).toBe(false);
		checks[0]?.click();
		expect(control.value).toBe("");
		expect(
			control.querySelector<HTMLElement>("[data-control-toolbar]")?.hidden,
		).toBe(true);
	});
	it("inserts the clock first even when enabled after other controllers", async () => {
		const { control } = await create("lang,color");
		control.value = "color,clock,lang";
		expect(control.value).toBe("clock,lang,color");
		const zone = control.querySelector(
			"[data-control-toolbar] > [data-toolbar-start]",
		);
		expect(
			Array.from(zone?.children ?? []).map((item) => item.localName),
		).toEqual(["tp-clock", "tp-lang", "tp-color"]);
		const clock = control.querySelector("tp-clock");
		expect(clock?.hidden).toBe(false);
		control.value = "lang,color";
		expect(clock?.hidden).toBe(true);
		control.value = "clock,lang,color";
		expect(control.querySelector("tp-clock")).toBe(clock);
		expect(clock?.hidden).toBe(false);
	});
	it("keeps the same controller and its setting when hidden and shown", async () => {
		const { control, scope } = await create("theme");
		const theme = control.querySelector("tp-theme");
		theme?.setAttribute("mode", "dark");
		expect(scope.classList.contains("tp-dark")).toBe(true);
		control.value = "";
		expect(scope.classList.contains("tp-dark")).toBe(true);
		control.value = "theme";
		expect(control.querySelector("tp-theme")).toBe(theme);
		expect(theme?.getAttribute("mode")).toBe("dark");
	});
	it("uses the surrounding scope for color and direction", async () => {
		const { control, scope } = await create("color,dir");
		control.querySelector("tp-dir")?.setAttribute("mode", "rtl");
		expect(scope.getAttribute("dir")).toBe("rtl");
		control.querySelector("tp-color")?.setAttribute("preset", "tp-red");
		expect(scope.classList.contains("tp-red")).toBe(true);
	});
	it("shares the enclosing brand scope instead of introducing a default palette", async () => {
		const outer = document.createElement("section");
		outer.className = "tp-red";
		outer.innerHTML =
			'<tp-color></tp-color><div><tp-control value="color,theme"></tp-control></div>';
		document.body.append(outer);
		await Promise.resolve();
		const globalColor = outer.querySelector(":scope > tp-color");
		const control = outer.querySelector("tp-control");
		const localColor = control?.querySelector("tp-color");
		expect(localColor?.getAttribute("preset")).toBe("tp-red");
		expect(outer.querySelector("div.tp-default")).toBeNull();
		globalColor?.setAttribute("preset", "tp-blue");
		expect(localColor?.getAttribute("preset")).toBe("tp-blue");
		localColor?.setAttribute("preset", "tp-orange");
		expect(globalColor?.getAttribute("preset")).toBe("tp-orange");
		expect(outer.classList.contains("tp-orange")).toBe(true);
	});

	it("reports reader changes once and keeps instances on reconnection", async () => {
		const { control } = await create();
		const change = vi.fn();
		control.addEventListener("tp-control-change", change);
		control
			.querySelector<HTMLInputElement>(":scope > tp-dropdown input")
			?.click();
		expect(change).toHaveBeenCalledTimes(1);
		expect(change.mock.calls[0]?.[0].detail.controllers).toHaveLength(7);
		control.remove();
		document.body.append(control);
		expect(control.querySelectorAll(":scope > tp-dropdown")).toHaveLength(1);
		expect(control.querySelectorAll("tp-theme")).toHaveLength(1);
	});
});
