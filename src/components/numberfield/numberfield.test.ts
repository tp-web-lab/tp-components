import { afterEach, describe, expect, it, vi } from "vitest";
import "./numberfield.js";
import { getBlankFields } from "../fill-blank/fields.js";

afterEach(() => document.body.replaceChildren());

/** Create a connected field and require its native editor. */
function setup(attributes: Record<string, string> = {}) {
	const field = document.createElement("tp-numberfield");
	Object.entries(attributes).forEach(([name, value]) => {
		field.setAttribute(name, value);
	});
	document.body.append(field);
	const input = field.querySelector("input");
	const button = field.querySelector("tp-icon-button");
	if (!input || !button) throw new Error("Missing field controls");
	return { field, input, button };
}

describe("tp-numberfield", () => {
	it("forwards and removes an external datalist without losing it on render", () => {
		const ticks = document.createElement("datalist");
		ticks.id = "numberfield-test-ticks";
		ticks.innerHTML =
			'<option value="0"></option><option value="50"></option><option value="100"></option>';
		document.body.append(ticks);
		const { field, input } = setup({ range: "" });
		field.list = ticks.id;
		expect(input.list).toBe(ticks);
		field.label = "Level";
		expect(input.list?.options.length).toBe(3);
		field.range = false;
		expect(input.list).toBe(ticks);
		field.list = "";
		expect(input.hasAttribute("list")).toBe(false);
	});
	it("starts as an empty native number field with optional clearing", () => {
		const { field, input, button } = setup();
		expect(input.type).toBe("number");
		expect(field.value).toBe("");
		expect(field.step).toBe("1");
		expect(field.labelPosition).toBe("top");
		expect(button.hidden).toBe(true);
		field.clearable = true;
		expect(button.hidden).toBe(false);
		expect(button.disabled).toBe(true);
		field.clearable = false;
		expect(button.hidden).toBe(true);
		field.setAttribute("clearable", "false");
		expect(button.hidden).toBe(false);
		field.clear();
		expect(field.value).toBe("");
	});
	it("reflects every setting and validates numbers through native constraints", () => {
		const { field, input } = setup();
		field.label = "Quantity";
		field.labelPosition = "start";
		field.min = "2";
		field.max = "10";
		field.step = "2";
		field.name = "quantity";
		field.placeholder = "Enter a number";
		field.required = true;
		expect(input.validity.valueMissing).toBe(true);
		field.value = "3";
		expect(input.validity.stepMismatch).toBe(true);
		field.step = "any";
		expect(input.validity.valid).toBe(true);
		field.value = "11";
		expect(input.validity.rangeOverflow).toBe(true);
		field.value = "1";
		expect(input.validity.rangeUnderflow).toBe(true);
		expect([
			field.label,
			field.labelPosition,
			field.min,
			field.max,
			field.name,
			field.placeholder,
		]).toEqual(["Quantity", "start", "2", "10", "quantity", "Enter a number"]);
		expect(input.labels?.[0]?.textContent).toContain("Quantity");
		field.setAttribute("aria-label", "Count");
		expect(input.getAttribute("aria-label")).toBe("Count");
		field.removeAttribute("aria-label");
		expect(input.hasAttribute("aria-label")).toBe(false);
		field.label = "";
		expect(field.querySelector("label")).toBeNull();
		field.setAttribute("label-position", "invalid");
		expect(field.labelPosition).toBe("top");
		["0", "-1", "invalid", "Infinity"].forEach((step) => {
			field.step = step;
			expect(field.step).toBe("1");
		});
		field.value = "invalid";
		expect(field.value).toBe("");
	});
	it("normalizes a slider and preserves values when switching representations", () => {
		const { field, input } = setup({ range: "" });
		expect(input.type).toBe("range");
		expect(field.value).toBe("50");
		const suffix = field.querySelector("[data-tp-numberfield-suffix]");
		expect(suffix?.firstElementChild?.localName).toBe("tp-icon");
		expect(
			suffix?.lastElementChild?.getAttribute("data-tp-numberfield-value"),
		).toBe("");
		expect(suffix?.textContent).toBe("50");
		field.min = "10";
		field.max = "20";
		field.value = "99";
		expect(field.value).toBe("20");
		field.value = "0";
		expect(field.value).toBe("10");
		field.clear();
		expect(field.value).toBe("15");
		expect(
			field.querySelector("[data-tp-numberfield-value]")?.textContent,
		).toBe("15");
		field.required = true;
		expect(input.required).toBe(false);
		field.range = false;
		expect(input.type).toBe("number");
		expect(input.required).toBe(true);
		expect(
			suffix
				?.querySelector("[data-tp-numberfield-value]")
				?.hasAttribute("hidden"),
		).toBe(true);
		expect(field.value).toBe("15");
		field.range = true;
		expect(field.value).toBe("15");
	});
	it("forwards single input/change events and clears through the library button", () => {
		const { field, input, button } = setup({ clearable: "" });
		const onInput = vi.fn();
		const onChange = vi.fn();
		const onClear = vi.fn();
		field.addEventListener("input", onInput);
		field.addEventListener("change", onChange);
		field.addEventListener("tp-clear", onClear);
		input.value = "4";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		expect(field.value).toBe("4");
		input.value = "5";
		input.dispatchEvent(new Event("change", { bubbles: true }));
		expect(field.value).toBe("5");
		button.click();
		expect(field.value).toBe("");
		expect(onInput).toHaveBeenCalledTimes(2);
		expect(onChange).toHaveBeenCalledTimes(2);
		expect(onClear).toHaveBeenCalledOnce();
		expect(document.activeElement).toBe(input);
	});
	it("protects disabled/readonly values and submits readonly sliders once", () => {
		const { field, input, button } = setup({
			value: "7",
			name: "amount",
			clearable: "",
		});
		const form = document.createElement("form");
		document.body.append(form);
		form.append(field);
		field.readOnly = true;
		expect(input.readOnly).toBe(true);
		expect(button.disabled).toBe(true);
		field.clear();
		input.value = "8";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		input.value = "9";
		input.dispatchEvent(new Event("change", { bubbles: true }));
		expect(input.value).toBe("7");
		field.range = true;
		expect(input.disabled).toBe(true);
		expect(getBlankFields(field)).toEqual([input]);
		expect(new FormData(form).getAll("amount")).toEqual(["7"]);
		field.disabled = true;
		field.clear();
		expect(new FormData(form).getAll("amount")).toEqual([]);
		field.readOnly = false;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		input.dispatchEvent(new Event("change", { bubbles: true }));
		field.disabled = false;
		expect(new FormData(form).getAll("amount")).toEqual(["7"]);
	});
	it("reconnects without duplicate listeners or styles", () => {
		const { field, input } = setup({ label: "Amount", value: "3" });
		field.focus({ preventScroll: true });
		expect(document.activeElement).toBe(input);
		const listener = vi.fn();
		field.addEventListener("input", listener);
		field.remove();
		field.value = "6";
		input.dispatchEvent(new Event("input"));
		expect(listener).not.toHaveBeenCalled();
		document.body.append(field);
		expect(input.value).toBe("6");
		field.value = "6";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		expect(listener).toHaveBeenCalledOnce();
		expect(
			document.querySelectorAll("#tp-numberfield-styles").length,
		).toBeLessThanOrEqual(1);
	});
});
