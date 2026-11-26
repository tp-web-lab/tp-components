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
	vi.useRealTimers();
});
describe("tp-carousel", () => {
	it("automatically wraps without loop and updates or disables the interval", () => {
		vi.useFakeTimers();
		const carousel = create();
		vi.advanceTimersByTime(1000);
		expect(carousel.index).toBe(0);
		carousel.hideControls = true;
		const controls = carousel.querySelector<HTMLElement>(
			"[data-carousel-controls]",
		);
		expect(controls?.hidden).toBe(true);
		carousel.auto = 100;
		vi.advanceTimersByTime(100);
		expect(carousel.index).toBe(1);
		vi.advanceTimersByTime(200);
		expect(carousel.index).toBe(0);
		carousel.removeAttribute("hide-controls");
		expect(carousel.hideControls).toBe(false);
		expect(controls?.hidden).toBe(false);
		carousel.setAttribute("hide-controls", "");
		expect(controls?.hidden).toBe(true);
		carousel.hideControls = false;
		expect(controls?.hidden).toBe(false);
		carousel.auto = 200;
		vi.advanceTimersByTime(80);
		carousel.dispatchEvent(new MouseEvent("mouseenter"));
		vi.advanceTimersByTime(1000);
		expect(carousel.index).toBe(0);
		carousel.dispatchEvent(new MouseEvent("mouseleave"));
		vi.advanceTimersByTime(119);
		expect(carousel.index).toBe(0);
		vi.advanceTimersByTime(1);
		expect(carousel.index).toBe(1);
		for (const value of ["0", "-1", "invalid", "Infinity"]) {
			carousel.setAttribute("auto", value);
			vi.advanceTimersByTime(500);
			expect(carousel.auto).toBe(0);
			expect(carousel.index).toBe(1);
		}
		carousel.auto = 100;
		carousel.removeAttribute("auto");
		vi.advanceTimersByTime(500);
		expect(carousel.index).toBe(1);
	});
	it("stops automatic navigation when detached and restarts on reconnection", () => {
		vi.useFakeTimers();
		const carousel = create('auto="100" orientation="vertical"');
		carousel.remove();
		vi.advanceTimersByTime(500);
		expect(carousel.index).toBe(0);
		document.body.append(carousel);
		vi.advanceTimersByTime(100);
		expect(carousel.index).toBe(1);
		for (const count of [0, 1]) {
			const small = create('auto="100"', count);
			vi.advanceTimersByTime(300);
			expect(small.index).toBe(0);
		}
	});

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
		const viewport = carousel.querySelector<HTMLElement>("tp-slider");
		expect(carousel.bgColor).toBe("transparent");
		expect(viewport?.style.backgroundColor).toBe("transparent");
		carousel.bgColor = "brand";
		expect(viewport?.style.backgroundColor).toBe("var(--tp-brand-fill-softer)");
		carousel.bgColor = "#123456";
		expect(viewport?.style.backgroundColor).toBe("rgb(18, 52, 86)");
		carousel.removeAttribute("bg-color");
		expect(viewport?.style.backgroundColor).toBe("transparent");
		expect(carousel.transition).toBe("none");
		carousel.transition = "start-to-end";
		expect(carousel.getAttribute("transition")).toBe("start-to-end");
		carousel.setAttribute("transition", "invalid");
		expect(carousel.transition).toBe("none");
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
		const viewport = carousel.querySelector<HTMLElement>("tp-slider");
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
