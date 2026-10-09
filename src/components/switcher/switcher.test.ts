import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./switcher.js";
import type { TpSwitcher } from "./switcher.js";

describe("<tp-switcher>", () => {
	beforeEach(() => {
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("contains the expected base CSS rules", () => {
		const element = document.createElement("tp-switcher");
		document.body.append(element);

		const style = document.head.querySelector("#tp-switcher-styles");
		const cssText = style?.textContent ?? "";

		expect(cssText).toContain("display: flex;");
		expect(cssText).toContain("flex-wrap: wrap;");
		expect(cssText).toContain("--tp-switcher-gap");
	});

	it("reflects layout attributes to CSS custom properties", () => {
		const element = document.createElement("tp-switcher") as TpSwitcher;
		document.body.append(element);

		element.gap = "2rem";
		element.threshold = "30rem";

		expect(element.style.getPropertyValue("--tp-switcher-gap")).toBe("2rem");
		expect(element.style.getPropertyValue("--tp-switcher-threshold")).toBe(
			"30rem",
		);
	});

	it("reflects and removes layout attributes", () => {
		const element = document.createElement("tp-switcher") as TpSwitcher;
		document.body.append(element);
		element.gap = "2rem";
		element.threshold = "30rem";

		element.gap = "";
		element.threshold = "";

		expect(element.hasAttribute("gap")).toBe(false);
		expect(element.hasAttribute("threshold")).toBe(false);
		expect(element.style.getPropertyValue("--tp-switcher-gap")).toBe("");
		expect(element.style.getPropertyValue("--tp-switcher-threshold")).toBe("");
	});

	it("validates max-horizontal", () => {
		const element = document.createElement("tp-switcher") as TpSwitcher;
		expect(element.maxHorizontal).toBeNull();
		expect(() => {
			element.maxHorizontal = 0;
		}).toThrow(TypeError);
		expect(() => {
			element.maxHorizontal = 1.5;
		}).toThrow(TypeError);
		element.setAttribute("max-horizontal", "invalid");
		expect(element.maxHorizontal).toBeNull();
	});

	it("creates, updates, and removes the max-horizontal instance rule", () => {
		const element = document.createElement("tp-switcher") as TpSwitcher;
		element.maxHorizontal = 3;
		document.body.append(element);
		const instanceId = element.getAttribute("data-tp-switcher-id");

		expect(document.head.textContent).toContain(
			`tp-switcher[data-tp-switcher-id="${instanceId}"]`,
		);
		expect(document.head.textContent).toContain(
			"calc((100% - 2 * var(--tp-switcher-gap, 1rem)) / 3)",
		);
		expect(document.head.textContent).toContain("flex-basis: max(");
		expect(document.head.textContent).toContain(
			"var(--tp-switcher-threshold, 30rem)",
		);
		expect(document.head.textContent).not.toContain(":nth-last-child");

		element.maxHorizontal = 2;
		expect(document.head.textContent).toContain(
			"calc((100% - 1 * var(--tp-switcher-gap, 1rem)) / 2)",
		);
		expect(document.head.textContent).not.toContain(
			"calc((100% - 2 * var(--tp-switcher-gap, 1rem)) / 3)",
		);

		element.maxHorizontal = 1;
		expect(document.head.textContent).toContain(
			"calc((100% - 0 * var(--tp-switcher-gap, 1rem)) / 1)",
		);

		element.maxHorizontal = null;
		expect(document.head.textContent).not.toContain(
			`tp-switcher[data-tp-switcher-id="${instanceId}"]`,
		);
	});

	it("removes the instance rule when disconnected", () => {
		const element = document.createElement("tp-switcher") as TpSwitcher;
		element.maxHorizontal = 2;
		document.body.append(element);
		const selector = `tp-switcher[data-tp-switcher-id="${element.getAttribute("data-tp-switcher-id")}"]`;
		element.remove();
		expect(document.head.textContent).not.toContain(selector);
	});
});
