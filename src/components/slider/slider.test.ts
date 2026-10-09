import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./slider.js";
import { TpSlider } from "./slider.js";

class ResizeObserverMock {
	public observe = vi.fn();
	public disconnect = vi.fn();
}

describe("<tp-slider>", () => {
	beforeEach(() => {
		document.head.innerHTML = "";
		document.body.innerHTML = "";
		vi.stubGlobal("ResizeObserver", ResizeObserverMock);
	});

	afterEach(() => {
		document.body.innerHTML = "";
		vi.unstubAllGlobals();
	});

	it("extends HTMLElement", () => {
		const element = document.createElement("tp-slider");

		expect(element).toBeInstanceOf(HTMLElement);
		expect(element).toBeInstanceOf(TpSlider);
	});

	it("injects CSS once", () => {
		const first = document.createElement("tp-slider");
		const second = document.createElement("tp-slider");

		document.body.append(first, second);

		const styles = document.head.querySelectorAll("#tp-slider-styles");
		expect(styles).toHaveLength(1);
	});

	it("contains the expected base CSS rules", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		const styleEl = document.head.querySelector("#tp-slider-styles");
		const cssText = styleEl?.textContent ?? "";

		expect(cssText).toContain("display: flex;");
		expect(cssText).toContain("overflow-x: auto;");
		expect(cssText).toContain("overflow-y: hidden;");
		expect(cssText).toContain("scrollbar-color:");
		expect(cssText).toContain("tp-slider > * {");
		expect(cssText).toContain("flex: 0 0 auto;");
		expect(cssText).toContain("tp-slider > img {");
		expect(cssText).toContain("block-size: 100%;");
		expect(cssText).toContain("var(--tp-slider-native-scrollbar-size, 0px)");
		expect(cssText).toContain("tp-slider:not([scrollbar])");
		expect(cssText).toContain("height: var(--tp-scrollbar-size);");
		expect(cssText).not.toContain("block-size: var(--tp-scrollbar-size);");
		expect(cssText).toContain("@supports selector(::-webkit-scrollbar)");
		expect(cssText).toContain(
			"var(--tp-scrollbar-thumb-color, var(--tp-neutral-fill-mid))",
		);
		expect(cssText).toContain("var(--tp-scrollbar-track-color, transparent)");
		expect(cssText).toContain("background-clip: padding-box;");
		expect(cssText).toContain("tp-slider[slider-height] > video");
		expect(cssText).toContain("object-fit: cover;");
		expect(cssText).toContain("tp-slider:focus-visible");
		// Removing the pseudo-element makes WebKit recreate an unstyled overlay.
		expect(cssText).toContain("height: 0;");
		expect(cssText).not.toContain("display: none;");
	});

	it("reflects the sliderHeight property to the attribute", () => {
		const element = document.createElement("tp-slider") as TpSlider;

		element.sliderHeight = "12rem";
		expect(element.getAttribute("slider-height")).toBe("12rem");
		expect(element.sliderHeight).toBe("12rem");

		element.sliderHeight = "";
		expect(element.hasAttribute("slider-height")).toBe(false);
	});

	it("reflects the itemWidth property to the attribute", () => {
		const element = document.createElement("tp-slider") as TpSlider;

		element.itemWidth = "18rem";
		expect(element.getAttribute("item-width")).toBe("18rem");
		expect(element.itemWidth).toBe("18rem");

		element.itemWidth = "";
		expect(element.hasAttribute("item-width")).toBe(false);
	});

	it("reflects the gap property to the attribute", () => {
		const element = document.createElement("tp-slider") as TpSlider;

		element.gap = "2rem";
		expect(element.getAttribute("gap")).toBe("2rem");
		expect(element.gap).toBe("2rem");

		element.gap = "";
		expect(element.hasAttribute("gap")).toBe(false);
	});

	it("reflects the scrollbar property to the attribute", () => {
		const element = document.createElement("tp-slider") as TpSlider;

		expect(element.scrollbar).toBe(false);

		element.scrollbar = false;
		expect(element.hasAttribute("scrollbar")).toBe(false);
		expect(element.scrollbar).toBe(false);

		element.scrollbar = true;
		expect(element.getAttribute("scrollbar")).toBe("");
		expect(element.scrollbar).toBe(true);
		element.scrollbar = false;
		expect(element.hasAttribute("scrollbar")).toBe(false);
	});

	it("reflects the scrollbarTrackColor property to the attribute", () => {
		const element = document.createElement("tp-slider") as TpSlider;

		element.scrollbarTrackColor = "#111";
		expect(element.getAttribute("scrollbar-track-color")).toBe("#111");
		expect(element.scrollbarTrackColor).toBe("#111");

		element.scrollbarTrackColor = "";
		expect(element.hasAttribute("scrollbar-track-color")).toBe(false);
	});

	it("reflects the scrollbackThumbColor property to the attribute", () => {
		const element = document.createElement("tp-slider") as TpSlider;

		element.scrollbackThumbColor = "#eee";
		expect(element.getAttribute("scrollback-thumb-color")).toBe("#eee");
		expect(element.scrollbackThumbColor).toBe("#eee");

		element.scrollbackThumbColor = "";
		expect(element.hasAttribute("scrollback-thumb-color")).toBe(false);
	});

	it("applies slider-height as inline block-size", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		element.setAttribute("slider-height", "10rem");

		expect(element.style.blockSize).toBe("10rem");
	});

	it("applies item-width through a CSS custom property", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		element.setAttribute("item-width", "20rem");

		expect(element.style.getPropertyValue("--tp-slider-item-width")).toBe(
			"20rem",
		);
	});

	it("applies gap through a CSS custom property", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		element.setAttribute("gap", "1.5rem");

		expect(element.style.getPropertyValue("--tp-slider-gap")).toBe("1.5rem");
	});

	it("applies scrollbar track color through a CSS custom property", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		element.setAttribute("scrollbar-track-color", "#000");

		expect(element.style.getPropertyValue("--tp-scrollbar-track-color")).toBe(
			"#000",
		);
	});

	it("applies scrollbar thumb color through a CSS custom property", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		element.setAttribute("scrollback-thumb-color", "#fff");

		expect(element.style.getPropertyValue("--tp-scrollbar-thumb-color")).toBe(
			"#fff",
		);
	});

	it("removes inline and custom properties when attributes are removed", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		element.setAttribute("slider-height", "10rem");
		element.setAttribute("item-width", "15rem");
		element.setAttribute("gap", "1rem");
		element.setAttribute("scrollbar-track-color", "#000");
		element.setAttribute("scrollback-thumb-color", "#fff");

		element.removeAttribute("slider-height");
		element.removeAttribute("item-width");
		element.removeAttribute("gap");
		element.removeAttribute("scrollbar-track-color");
		element.removeAttribute("scrollback-thumb-color");

		expect(element.style.blockSize).toBe("");
		expect(element.style.getPropertyValue("--tp-slider-item-width")).toBe("");
		expect(element.style.getPropertyValue("--tp-slider-gap")).toBe("");
		expect(element.style.getPropertyValue("--tp-scrollbar-track-color")).toBe(
			"",
		);
		expect(element.style.getPropertyValue("--tp-scrollbar-thumb-color")).toBe(
			"",
		);
	});

	it("adds the overflowing class when content overflows", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		Object.defineProperty(element, "scrollWidth", {
			configurable: true,
			value: 500,
		});
		Object.defineProperty(element, "clientWidth", {
			configurable: true,
			value: 200,
		});

		element.setAttribute("gap", "1rem");

		expect(element.classList.contains("overflowing")).toBe(true);
	});

	it("does not add the overflowing class when content does not overflow", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);

		Object.defineProperty(element, "scrollWidth", {
			configurable: true,
			value: 200,
		});
		Object.defineProperty(element, "clientWidth", {
			configurable: true,
			value: 200,
		});

		element.setAttribute("gap", "1rem");

		expect(element.classList.contains("overflowing")).toBe(false);
	});

	it("updates overflow state on scroll", () => {
		const element = document.createElement("tp-slider");
		document.body.append(element);
		Object.defineProperty(element, "scrollWidth", {
			configurable: true,
			value: 500,
		});
		Object.defineProperty(element, "clientWidth", {
			configurable: true,
			value: 200,
		});

		element.dispatchEvent(new Event("scroll"));

		expect(element.classList.contains("overflowing")).toBe(true);
	});

	it("measures classic scrollbar space without counting borders and updates for overlays", () => {
		const element = document.createElement("tp-slider");
		element.style.borderTop = "2px solid";
		element.style.borderBottom = "3px solid";
		document.body.append(element);
		Object.defineProperty(element, "clientHeight", {
			configurable: true,
			value: 60,
		});
		Object.defineProperty(element, "offsetHeight", {
			configurable: true,
			value: 81,
		});
		element.setAttribute("scrollbar", "");
		expect(
			element.style.getPropertyValue("--tp-slider-native-scrollbar-size"),
		).toBe("16px");
		Object.defineProperty(element, "offsetHeight", {
			configurable: true,
			value: 65,
		});
		element.dispatchEvent(new Event("scroll"));
		expect(
			element.style.getPropertyValue("--tp-slider-native-scrollbar-size"),
		).toBe("0px");
	});

	it("uses presence rather than the textual value of scrollbar", () => {
		const element = document.createElement("tp-slider") as TpSlider;
		for (const value of ["", "true", "false", "sometimes"]) {
			element.setAttribute("scrollbar", value);
			expect(element.scrollbar).toBe(true);
		}
		element.removeAttribute("scrollbar");
		expect(element.scrollbar).toBe(false);
	});
});
