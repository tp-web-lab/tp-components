import { afterEach, expect, it, vi } from "vitest";
import { IframeOverlayBridge } from "./iframe-overlay-bridge.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
it("expands for a constrained inner menu and restores the exact preview size on close", async () => {
	vi.stubGlobal("requestAnimationFrame", vi.fn());
	const frame = document.createElement("iframe");
	frame.style.height = "120px";
	document.body.append(frame);
	const initialStyle = frame.getAttribute("style");
	frame.showPopover = vi.fn();
	frame.hidePopover = vi.fn();
	vi.spyOn(frame, "getBoundingClientRect").mockReturnValue({
		top: 100,
		left: 0,
		height: 120,
		width: 600,
		bottom: 220,
		right: 600,
		x: 0,
		y: 100,
		toJSON: () => ({}),
	});
	const doc = frame.contentDocument;
	if (!doc) throw Error("Missing iframe document");
	doc.body.innerHTML =
		"<tp-dropdown open><ul><li>Voice</li></ul></tp-dropdown>";
	const dropdown = doc.querySelector("tp-dropdown") as HTMLElement;
	const menu = doc.querySelector("ul") as HTMLElement;
	vi.spyOn(dropdown, "getBoundingClientRect").mockReturnValue({
		top: 40,
		left: 0,
		height: 120,
		width: 300,
		bottom: 160,
		right: 300,
		x: 0,
		y: 40,
		toJSON: () => ({}),
	});
	Object.defineProperty(dropdown, "scrollHeight", { value: 120 });
	Object.defineProperty(menu, "clientHeight", { value: 110 });
	Object.defineProperty(menu, "scrollHeight", { value: 2000 });
	const bridge = new IframeOverlayBridge(frame);
	bridge.connect();
	expect(Number.parseFloat(frame.style.blockSize)).toBeGreaterThan(400);
	expect(Number.parseFloat(frame.style.blockSize)).toBeLessThanOrEqual(
		window.innerHeight,
	);
	expect(
		document
			.querySelector("[data-tp-iframe-overlay-placeholder]")
			?.getAttribute("style"),
	).toContain("120px");
	dropdown.removeAttribute("open");
	await Promise.resolve();
	expect(frame.getAttribute("style")).toBe(initialStyle);
	expect(
		document.querySelector("[data-tp-iframe-overlay-placeholder]"),
	).toBeNull();
	expect(doc.querySelector("[data-tp-iframe-overlay-transparency]")).toBeNull();
	bridge.disconnect();
});
