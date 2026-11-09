import { afterEach, expect, it, vi } from "vitest";
import { createViewerFullscreen } from "./viewer-fullscreen.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

it("targets the complete host through toolbar wrappers and keeps instances independent", async () => {
	const first = document.createElement("section");
	const second = document.createElement("section");
	const toolbar = document.createElement("div");
	const wrapper = document.createElement("span");
	const control = createViewerFullscreen(first);
	const other = createViewerFullscreen(second);
	wrapper.append(control);
	toolbar.append(wrapper);
	first.append(toolbar);
	second.append(other);
	document.body.append(first, second);
	const request = vi.fn(async () => undefined);
	Object.defineProperty(first, "requestFullscreen", { value: request });
	expect(document.querySelector(control.getAttribute("anchor") ?? "")).toBe(
		first,
	);
	expect(document.querySelector(other.getAttribute("anchor") ?? "")).toBe(
		second,
	);
	await vi.waitFor(() =>
		expect(control.querySelector("tp-icon-button")).not.toBeNull(),
	);
	control.querySelector<HTMLElement>("tp-icon-button")?.click();
	await vi.waitFor(() => expect(request).toHaveBeenCalledOnce());
});
