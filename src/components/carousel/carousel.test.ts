import { afterEach, describe, expect, it, vi } from "vitest";
import "./carousel.js";

const create = (attrs = "", count = 3) => {
	const host = document.createElement("div");
	host.innerHTML = `<tp-carousel ${attrs}>${Array.from({ length: count }, (_, i) => `<img alt="Image ${i}">`).join("")}</tp-carousel>`;
	document.body.append(host);
	const carousel = host.querySelector("tp-carousel");
	if (!carousel) throw new Error("Missing carousel");
	return carousel;
};
afterEach(() => {
	document.body.replaceChildren();
});
describe("tp-carousel", () => {
	it("accepts standalone images from native markup parsers", async () => {
		const carousel = create("", 0);
		carousel.insertAdjacentHTML(
			"beforeend",
			'<p><img alt="Markdown"></p><div class="imageblock"><div class="content"><img alt="AsciiDoc"></div><div class="title">Caption</div></div>',
		);
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(carousel.count).toBe(2);
		expect(carousel.querySelector("figcaption")?.textContent).toBe("Caption");
	});
	it("loads its slider dependency and clamps selection at the boundaries", () => {
		const carousel = create();
		const viewport = carousel.querySelector("tp-slider");
		expect(viewport?.getAttribute("tabindex")).toBe("0");
		expect(viewport?.getAttribute("slider-height")).toBe("20rem");
		expect(carousel.count).toBe(3);
		expect(
			carousel
				.querySelector('[label="Previous image"]')
				?.hasAttribute("disabled"),
		).toBe(true);
		const change = vi.fn();
		carousel.addEventListener("tp-carousel-change", change);
		carousel.next();
		expect(carousel.index).toBe(1);
		expect(change.mock.calls[0]?.[0].detail).toEqual({ index: 1, count: 3 });
		carousel.goTo(20);
		expect(carousel.index).toBe(2);
		carousel.next();
		expect(carousel.index).toBe(2);
		expect(
			carousel.querySelector('[label="Next image"]')?.hasAttribute("disabled"),
		).toBe(true);
		carousel.index = -1;
		expect(carousel.index).toBe(0);
	});
	it("wraps navigation and follows orientation-specific keyboard commands", () => {
		const carousel = create('loop orientation="vertical"');
		carousel.previous();
		expect(carousel.index).toBe(2);
		carousel.next();
		expect(carousel.index).toBe(0);
		const viewport = carousel.querySelector("tp-slider");
		viewport?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
		);
		expect(carousel.index).toBe(1);
		viewport?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(carousel.index).toBe(1);
		carousel.orientation = "horizontal";
		viewport?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(carousel.index).toBe(2);
		viewport?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
		);
		expect(carousel.index).toBe(0);
	});
	it("supports empty galleries, dynamic images, removal and reconnection", async () => {
		const carousel = create("loop", 0);
		expect(carousel.querySelector("[data-carousel-counter]")?.textContent).toBe(
			"No images",
		);
		carousel.next();
		expect(carousel.index).toBe(0);
		carousel.append(document.createElement("img"));
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(carousel.count).toBe(1);
		expect(
			carousel.querySelector('[label="Next image"]')?.hasAttribute("disabled"),
		).toBe(true);
		carousel.append(document.createElement("img"));
		await new Promise((resolve) => setTimeout(resolve, 0));
		carousel.next();
		expect(carousel.index).toBe(1);
		carousel.querySelector("tp-slider > img:last-child")?.remove();
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(carousel.index).toBe(0);
		carousel.remove();
		document.body.append(carousel);
		expect(carousel.querySelectorAll("tp-slider")).toHaveLength(1);
		expect(carousel.count).toBe(1);
	});
});
