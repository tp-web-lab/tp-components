import { afterEach, expect, it, vi } from "vitest";
import { followFragment } from "./fragment-scroll.js";

afterEach(() => vi.unstubAllGlobals());
it("compensates asynchronous layout shifts and stops on user input", () => {
	let resize = (): void => {};
	let pending = (): void => {};
	const disconnect = vi.fn();
	vi.stubGlobal(
		"ResizeObserver",
		class {
			constructor(callback: () => void) {
				resize = callback;
			}
			observe(): void {}
			disconnect = disconnect;
		},
	);
	vi.stubGlobal("requestAnimationFrame", (callback: () => void) => {
		pending = callback;
		return 1;
	});
	vi.stubGlobal("cancelAnimationFrame", vi.fn());
	const container = document.createElement("main");
	const target = document.createElement("h2");
	container.append(target);
	let offset = 800;
	vi.spyOn(container, "getBoundingClientRect").mockImplementation(
		() => ({ top: 56 }) as DOMRect,
	);
	vi.spyOn(target, "getBoundingClientRect").mockImplementation(
		() => ({ top: 56 + offset - container.scrollTop }) as DOMRect,
	);
	const stop = followFragment(container, target);
	expect(container.scrollTop).toBe(800);
	offset = 1200;
	resize();
	pending();
	expect(container.scrollTop).toBe(1200);
	offset = 900;
	resize();
	pending();
	expect(container.scrollTop).toBe(900);
	container.dispatchEvent(new Event("wheel"));
	offset = 1500;
	resize();
	pending();
	expect(container.scrollTop).toBe(900);
	expect(disconnect).toHaveBeenCalled();
	stop();
});
