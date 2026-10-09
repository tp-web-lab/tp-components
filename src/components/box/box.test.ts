import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./box.js";
import { TpBox } from "./box.js";

describe("<tp-box>", () => {
	it("uses a flow-root so its border does not overlap adjacent floated content", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		const style = document.getElementById("tp-box-styles");
		expect(style?.textContent).toContain("display: flow-root;");
	});

	beforeEach(() => {
		document.head.innerHTML = "";
		document.body.innerHTML = "";
		document.body.className = "";
	});

	afterEach(() => {
		document.body.innerHTML = "";
		document.body.className = "";
	});

	it("extends HTMLElement", () => {
		const element = document.createElement("tp-box");

		expect(element).toBeInstanceOf(HTMLElement);
		expect(element).toBeInstanceOf(TpBox);
	});

	it("injects CSS once", () => {
		const first = document.createElement("tp-box");
		const second = document.createElement("tp-box");

		document.body.append(first, second);

		const styles = document.head.querySelectorAll("#tp-box-styles");
		expect(styles).toHaveLength(1);
	});

	it("contains the expected base CSS rules", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		const style = document.head.querySelector("#tp-box-styles");
		const cssText = style?.textContent ?? "";

		expect(cssText).toContain("display: flow-root;");
		expect(cssText).toContain("padding: var(--tp-box-padding, 1rem);");
		expect(cssText).toContain(
			"border: var(--tp-box-border-width, 1px) solid currentColor;",
		);
		expect(cssText).toContain(
			"border-radius: var(--tp-box-border-radius, 0px);",
		);
		expect(cssText).toContain(
			"background: var(--tp-box-background, var(--tp-paper-color, transparent));",
		);
		expect(cssText).toContain("tp-box :where(code, samp, tt)");
		expect(cssText).toContain("tp-box > p:last-child");
		expect(cssText).toContain("margin-block-end: 0;");
		expect(cssText).toContain("--tp-box-color: var(--tp-neutral-200);");
		expect(cssText).toContain(
			"color: var(--tp-box-color, var(--tp-text-body, inherit));",
		);
		expect(cssText).toContain("tp-box[invert]");
		expect(cssText).toContain("--tp-box-background: var(--tp-neutral-950);");
		expect(cssText).toContain(".tp-dark tp-box[invert]");
	});

	it("reflects the padding property to the attribute", () => {
		const element = document.createElement("tp-box") as TpBox;

		expect(element.padding).toBe("");
		expect(element.hasAttribute("padding")).toBe(false);

		element.padding = "1.5rem";

		expect(element.getAttribute("padding")).toBe("1.5rem");
		expect(element.padding).toBe("1.5rem");

		element.padding = "";

		expect(element.hasAttribute("padding")).toBe(false);
		expect(element.padding).toBe("");
	});

	it("reflects the borderWidth property to the attribute", () => {
		const element = document.createElement("tp-box") as TpBox;

		expect(element.borderWidth).toBe("");
		expect(element.hasAttribute("border-width")).toBe(false);

		element.borderWidth = "2px";

		expect(element.getAttribute("border-width")).toBe("2px");
		expect(element.borderWidth).toBe("2px");

		element.borderWidth = "";

		expect(element.hasAttribute("border-width")).toBe(false);
		expect(element.borderWidth).toBe("");
	});

	it("reflects the borderRadius property to the border-radius attribute", () => {
		const element = document.createElement("tp-box") as TpBox;

		expect(element.borderRadius).toBe("");
		expect(element.hasAttribute("border-radius")).toBe(false);

		element.borderRadius = "0.5rem";

		expect(element.getAttribute("border-radius")).toBe("0.5rem");
		expect(element.borderRadius).toBe("0.5rem");

		element.borderRadius = "";

		expect(element.hasAttribute("border-radius")).toBe(false);
		expect(element.borderRadius).toBe("");
	});

	it("no longer exposes the obsolete radius property or observes its attribute", () => {
		const element = document.createElement("tp-box") as TpBox;
		expect("radius" in element).toBe(false);
		expect(TpBox.observedAttributes).not.toContain("radius");
	});

	it("reflects the invert property to the attribute", () => {
		const element = document.createElement("tp-box") as TpBox;

		expect(element.invert).toBe(false);
		expect(element.hasAttribute("invert")).toBe(false);

		element.invert = true;

		expect(element.invert).toBe(true);
		expect(element.hasAttribute("invert")).toBe(true);

		element.invert = false;

		expect(element.invert).toBe(false);
		expect(element.hasAttribute("invert")).toBe(false);
	});

	it("does not define custom properties by default", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		expect(element.style.getPropertyValue("--tp-box-padding")).toBe("");
		expect(element.style.getPropertyValue("--tp-box-border-width")).toBe("");
		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe("");
	});

	it("applies padding through a CSS custom property", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		element.setAttribute("padding", "2rem");

		expect(element.style.getPropertyValue("--tp-box-padding")).toBe("2rem");
	});

	it("applies border-width through a CSS custom property", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		element.setAttribute("border-width", "3px");

		expect(element.style.getPropertyValue("--tp-box-border-width")).toBe("3px");
	});

	it("applies border-radius through a CSS custom property", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		element.setAttribute("border-radius", "1rem");

		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe(
			"1rem",
		);
	});

	it("ignores obsolete radius even when the supported attribute is removed", () => {
		const element = document.createElement("tp-box") as TpBox;
		document.body.append(element);

		element.setAttribute("radius", "1rem");

		expect(element.borderRadius).toBe("");
		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe("");
		element.borderRadius = "4px";
		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe(
			"4px",
		);
		element.borderRadius = "";
		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe("");
	});

	it("removes padding when the attribute is removed", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		element.setAttribute("padding", "1rem");
		expect(element.style.getPropertyValue("--tp-box-padding")).toBe("1rem");

		element.removeAttribute("padding");
		expect(element.style.getPropertyValue("--tp-box-padding")).toBe("");
	});

	it("removes border-width when the attribute is removed", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		element.setAttribute("border-width", "2px");
		expect(element.style.getPropertyValue("--tp-box-border-width")).toBe("2px");

		element.removeAttribute("border-width");
		expect(element.style.getPropertyValue("--tp-box-border-width")).toBe("");
	});

	it("removes border-radius when the attribute is removed", () => {
		const element = document.createElement("tp-box");
		document.body.append(element);

		element.setAttribute("border-radius", "0.75rem");
		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe(
			"0.75rem",
		);

		element.removeAttribute("border-radius");
		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe("");
	});

	it("does not inject theme classes when invert is enabled", () => {
		const element = document.createElement("tp-box") as TpBox;
		document.body.append(element);

		element.invert = true;

		expect(element.classList.contains("tp-dark")).toBe(false);
		expect(element.classList.contains("tp-light")).toBe(false);
	});

	it("supports updating reactive properties after connection", () => {
		const element = document.createElement("tp-box") as TpBox;
		document.body.append(element);

		element.padding = "1.25rem";
		element.borderWidth = "2px";
		element.borderRadius = "0.5rem";
		element.invert = true;

		expect(element.style.getPropertyValue("--tp-box-padding")).toBe("1.25rem");
		expect(element.style.getPropertyValue("--tp-box-border-width")).toBe("2px");
		expect(element.style.getPropertyValue("--tp-box-border-radius")).toBe(
			"0.5rem",
		);
		expect(element.hasAttribute("invert")).toBe(true);
	});
});
