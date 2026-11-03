import { afterEach, describe, expect, it, vi } from "vitest";
import { TP_SCREEN_DEVICES } from "./screen.js";
import "./screen.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
function create() {
	const screen = document.createElement("tp-screen");
	screen.src = "https://example.com/demo#/slides/02-plan.adoc";
	document.body.append(screen);
	return screen;
}
describe("tp-screen", () => {
	it("opens only on demand with the requested page route", () => {
		const screen = create();
		expect(document.querySelector("iframe")).toBeNull();
		screen.show();
		expect(document.querySelector("tp-modal")?.hasAttribute("open")).toBe(true);
		expect(document.querySelector("iframe")?.getAttribute("src")).toBe(
			screen.src,
		);
		expect(document.querySelectorAll("[data-device]")).toHaveLength(14);
	});
	it("resizes the same frame for all viewport presets", () => {
		const screen = create();
		screen.show();
		const frame = document.querySelector("iframe");
		for (const [device, preset] of Object.entries(TP_SCREEN_DEVICES)) {
			screen.setAttribute("device", device);
			const viewport = document.querySelector<HTMLElement>(
				".tp-screen-viewport",
			);
			expect(viewport?.style.width).toBe(`${preset.width}px`);
			expect(viewport?.style.height).toBe(`${preset.height}px`);
			expect(document.querySelector("iframe")).toBe(frame);
			expect(
				document
					.querySelector('[aria-current="true"]')
					?.getAttribute("data-device"),
			).toBe(device);
		}
	});
	it("selects a format through the menu keyboard activation", () => {
		const screen = create();
		screen.show();
		document
			.querySelector<HTMLElement>('[data-device="desktop"]')
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
			);
		expect(screen.device).toBe("default");
		screen.confirm();
		expect(screen.device).toBe("desktop");
	});
	it("closes and releases the iframe, then opens a fresh preview", () => {
		const screen = create();
		screen.show();
		const previous = document.querySelector("iframe");
		screen.close();
		expect(document.querySelector("iframe")).toBeNull();
		screen.show();
		expect(document.querySelector("iframe")).not.toBe(previous);
	});
	it("disabled closes the preview and blocks reopening", () => {
		const screen = create();
		screen.show();
		screen.disabled = true;
		expect(document.querySelector("iframe")).toBeNull();
		screen.show();
		expect(document.querySelector("iframe")).toBeNull();
		expect(
			document.querySelector("tp-icon-button")?.hasAttribute("disabled"),
		).toBe(true);
	});
	it("removal releases the preview and reconnection remains usable", () => {
		const screen = create();
		screen.show();
		screen.remove();
		expect(document.querySelector("tp-modal")).toBeNull();
		document.body.append(screen);
		screen.show();
		expect(document.querySelector("iframe")).not.toBeNull();
	});
	it("fits relative ratios to the preview area and updates on window resize", () => {
		const screen = create();
		screen.show();
		const stage = document.querySelector<HTMLElement>(".tp-screen-stage");
		if (!stage) throw new Error("Missing preview stage");
		const bounds = vi.spyOn(stage, "getBoundingClientRect");
		bounds.mockReturnValue({ width: 1000, height: 600 } as DOMRect);
		screen.device = "16:9";
		const viewport = document.querySelector<HTMLElement>(".tp-screen-viewport");
		expect(viewport?.style.width).toBe("1000px");
		expect(viewport?.style.height).toBe("562.5px");
		screen.device = "4:3";
		expect(viewport?.style.width).toBe("800px");
		expect(viewport?.style.height).toBe("600px");
		bounds.mockReturnValue({ width: 400, height: 600 } as DOMRect);
		window.dispatchEvent(new Event("resize"));
		expect(viewport?.style.width).toBe("400px");
		expect(viewport?.style.height).toBe("300px");
	});
	it("reopens inside the active fullscreen element and returns to the page afterwards", () => {
		const host = document.createElement("section");
		document.body.append(host);
		const screen = create();
		host.append(screen);
		Object.defineProperty(document, "fullscreenElement", {
			configurable: true,
			get: () => null,
		});
		const fullscreen = vi.spyOn(document, "fullscreenElement", "get");
		fullscreen.mockReturnValue(null);
		screen.show();
		screen.close();
		fullscreen.mockReturnValue(host);
		screen.show();
		expect(host.querySelector("tp-modal[open]")).not.toBeNull();
		expect(
			host.querySelector("tp-modal-backdrop[data-open='true']"),
		).not.toBeNull();
		expect(host.inert).not.toBe(true);
		screen.close();
		fullscreen.mockReturnValue(null);
		screen.show();
		expect(document.querySelector("tp-modal")?.parentElement).toBe(
			document.body,
		);
		expect(document.querySelector("tp-modal-backdrop")?.parentElement).toBe(
			document.body,
		);
		expect(host.inert).toBe(true);
		screen.close();
		expect(host.inert).not.toBe(true);
	});
	it("separates absolute and relative formats in the requested order", () => {
		create().show();
		const menus = document.querySelectorAll(".tp-screen-menus tp-menu");
		expect(menus).toHaveLength(2);
		if (!menus[0] || !menus[1]) throw new Error("Missing format menus");
		expect(menus[0].querySelectorAll("[data-device]")).toHaveLength(6);
		expect(
			[...menus[1].querySelectorAll<HTMLElement>("[data-device]")].map(
				(item) => item.dataset.device,
			),
		).toEqual(["default", "16:9", "3:2", "4:3", "1:1", "3:4", "2:3", "9:16"]);
	});
	it("keeps an applied page alive, cancels tentative choices, and restores default", () => {
		const screen = create();
		const choose = (device: string) =>
			document
				.querySelector(`[data-device="${device}"]`)
				?.dispatchEvent(
					new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
				);
		screen.show();
		const frame = document.querySelector("iframe");
		choose("4:3");
		screen.confirm();
		expect(screen.device).toBe("4:3");
		expect(
			screen.querySelector("tp-icon-button")?.getAttribute("label"),
		).toContain("Format: 4:3");
		expect(document.querySelector(".tp-screen-applied")).not.toBeNull();
		expect(frame?.getAttribute("data-tp-screen-applied")).toBe("4:3");
		frame?.dispatchEvent(new CustomEvent("tp-screen-edit"));
		expect(document.querySelector(".tp-screen-applied")).toBeNull();
		choose("9:16");
		screen.close();
		expect(screen.device).toBe("4:3");
		expect(
			screen.querySelector("tp-icon-button")?.getAttribute("label"),
		).toContain("Format: 4:3");
		expect(
			document
				.querySelector("[aria-current=true]")
				?.getAttribute("data-device"),
		).toBe("4:3");
		expect(document.querySelector("iframe")).toBe(frame);
		screen.show();
		choose("default");
		screen.confirm();
		expect(screen.device).toBe("default");
		expect(document.querySelector("iframe")).toBeNull();
		expect(document.querySelector("tp-modal[open]")).toBeNull();
	});
	it("rejects invalid sources and removes a previous preview", () => {
		const screen = create();
		screen.show();
		screen.src = "http://[";
		expect(document.querySelector("iframe")).toBeNull();
		expect(document.querySelector('[role="status"]')?.textContent).toContain(
			"Choose an HTTP",
		);
		screen.src = "https://example.com";
		expect(
			document.querySelector("iframe")?.hasAttribute("data-tp-screen-preview"),
		).toBe(true);
	});
	it("invalid device falls back to the current window", () => {
		const screen = create();
		screen.setAttribute("device", "unknown");
		screen.show();
		expect(screen.device).toBe("default");
		expect(
			document.querySelector<HTMLElement>(".tp-screen-viewport")?.style.width,
		).toBe("0px");
	});
});
