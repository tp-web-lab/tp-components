import { afterEach, expect, it, vi } from "vitest";
import { DeferredVisibility } from "./deferred-visibility.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

it("resumes an offscreen host once near the viewport and ignores stale callbacks", () => {
	const callbacks: IntersectionObserverCallback[] = [];
	const disconnect = vi.fn();
	vi.stubGlobal(
		"IntersectionObserver",
		class {
			constructor(callback: IntersectionObserverCallback) {
				callbacks.push(callback);
			}
			observe() {}
			disconnect = disconnect;
		},
	);
	const host = document.createElement("div");
	document.body.append(host);
	vi.spyOn(host, "getBoundingClientRect").mockReturnValue(
		new DOMRect(0, 5000, 300, 0),
	);
	const resume = vi.fn();
	const pending = new DeferredVisibility(host, resume);
	expect(pending.defer()).toBe(true);
	pending.disconnect();
	const entry = { isIntersecting: true } as IntersectionObserverEntry;
	callbacks[0]?.([entry], {} as IntersectionObserver);
	expect(resume).not.toHaveBeenCalled();
	expect(pending.defer()).toBe(true);
	callbacks[1]?.([entry], {} as IntersectionObserver);
	expect(resume).toHaveBeenCalledOnce();
	expect(pending.defer()).toBe(false);
	expect(disconnect).toHaveBeenCalled();
});

it("waits for each enclosing hidden panel to open", async () => {
	const outer = document.createElement("div");
	const inner = document.createElement("div");
	const host = document.createElement("div");
	outer.hidden = inner.hidden = true;
	inner.append(host);
	outer.append(inner);
	document.body.append(outer);
	const pending = new DeferredVisibility(host, () => {
		pending.defer();
	});
	const resume = vi.spyOn(pending, "defer");
	expect(pending.defer()).toBe(true);
	inner.hidden = false;
	await Promise.resolve();
	expect(resume).toHaveBeenCalledTimes(2);
	outer.hidden = false;
	await Promise.resolve();
	expect(resume).toHaveBeenCalledTimes(3);
	pending.disconnect();
});
