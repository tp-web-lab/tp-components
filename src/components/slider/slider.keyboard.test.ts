import { afterEach, describe, expect, it } from "vitest";
import "./slider.js";

/** Creates a slider with a predictable scroll range for keyboard tests. */
function createSlider() {
	const slider = document.createElement("tp-slider");
	Object.defineProperties(slider, {
		clientWidth: { value: 200, configurable: true },
		scrollWidth: { value: 800, configurable: true },
	});
	document.body.append(slider);
	return slider;
}

/** Dispatches a cancellable keyboard event and returns it for assertions. */
function press(
	target: HTMLElement,
	key: string,
	options: KeyboardEventInit = {},
) {
	const event = new KeyboardEvent("keydown", {
		key,
		bubbles: true,
		cancelable: true,
		...options,
	});
	target.dispatchEvent(event);
	return event;
}

afterEach(() => document.body.replaceChildren());

describe("slider keyboard scrolling", () => {
	it("adds a tab stop without overriding an author-provided tabindex", () => {
		expect(createSlider().tabIndex).toBe(0);
		const slider = document.createElement("tp-slider");
		slider.tabIndex = -1;
		document.body.append(slider);
		expect(slider.tabIndex).toBe(-1);
	});

	it("scrolls by 80% of the viewport and clamps at the content boundaries", () => {
		const slider = createSlider();
		expect(press(slider, "ArrowRight").defaultPrevented).toBe(true);
		expect(slider.scrollLeft).toBe(160);
		press(slider, "ArrowLeft");
		expect(slider.scrollLeft).toBe(0);
		press(slider, "ArrowLeft");
		expect(slider.scrollLeft).toBe(0);
		press(slider, "End");
		expect(slider.scrollLeft).toBe(600);
		press(slider, "ArrowRight");
		expect(slider.scrollLeft).toBe(600);
		press(slider, "Home");
		expect(slider.scrollLeft).toBe(0);
	});

	it("respects RTL content while keeping arrow directions physical", () => {
		const slider = createSlider();
		slider.style.direction = "rtl";
		press(slider, "ArrowLeft");
		expect(slider.scrollLeft).toBe(-160);
		press(slider, "ArrowRight");
		expect(slider.scrollLeft).toBe(0);
		press(slider, "End");
		expect(slider.scrollLeft).toBe(-600);
		press(slider, "ArrowLeft");
		expect(slider.scrollLeft).toBe(-600);
		press(slider, "Home");
		expect(slider.scrollLeft).toBe(0);
	});

	it("preserves child keys, modified shortcuts and unrelated keys", () => {
		const slider = createSlider();
		const input = document.createElement("input");
		slider.append(input);
		expect(press(input, "End").defaultPrevented).toBe(false);
		for (const options of [
			{ altKey: true },
			{ ctrlKey: true },
			{ metaKey: true },
			{ shiftKey: true },
		]) {
			expect(press(slider, "End", options).defaultPrevented).toBe(false);
		}
		expect(press(slider, "Tab").defaultPrevented).toBe(false);
		expect(slider.scrollLeft).toBe(0);
	});

	it("does not consume keys without overflow", () => {
		const slider = createSlider();
		Object.defineProperty(slider, "scrollWidth", { value: 200 });
		expect(press(slider, "End").defaultPrevented).toBe(false);
	});

	it("cleans up and restores one listener on reconnection", () => {
		const slider = createSlider();
		slider.remove();
		press(slider, "ArrowRight");
		expect(slider.scrollLeft).toBe(0);
		document.body.append(slider);
		press(slider, "ArrowRight");
		expect(slider.scrollLeft).toBe(160);
	});
});
