import { afterEach, describe, expect, it, vi } from "vitest";
import "./textfield.js";

afterEach(() => document.body.replaceChildren());

describe("<tp-textfield>", () => {
	it("forwards updated autocomplete hints to inputs and textareas", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("name", "email");
		field.setAttribute("type", "email");
		field.setAttribute("autocomplete", "email");
		document.body.append(field);
		for (const hint of ["email", "on", "off"]) {
			field.autocomplete = hint;
			expect(field.querySelector("input")?.getAttribute("autocomplete")).toBe(
				hint,
			);
		}
		field.multiline = true;
		expect(field.querySelector("textarea")?.getAttribute("autocomplete")).toBe(
			"off",
		);
		field.autocomplete = "on";
		expect(field.querySelector("textarea")?.getAttribute("autocomplete")).toBe(
			"on",
		);
		field.removeAttribute("autocomplete");
		expect(field.querySelector("textarea")?.hasAttribute("autocomplete")).toBe(
			false,
		);
	});
	it("forwards an accessible name without requiring a visible label", () => {
		const field = document.createElement("tp-textfield");
		field.placeholder = "Capital";
		field.setAttribute("aria-label", "Capital of France");
		document.body.append(field);
		expect(field.querySelector("label")).toBeNull();
		expect(field.querySelector("input")?.getAttribute("aria-label")).toBe(
			"Capital of France",
		);
		field.setAttribute("aria-label", "Answer");
		expect(field.querySelector("input")?.getAttribute("aria-label")).toBe(
			"Answer",
		);
		field.removeAttribute("aria-label");
		expect(field.querySelector("input")?.hasAttribute("aria-label")).toBe(
			false,
		);
	});
	it("renders a text input by default", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("placeholder", "Name");
		document.body.append(field);
		const input = field.querySelector("input");
		expect(input?.type).toBe("text");
		expect(input?.placeholder).toBe("Name");
	});

	it("associates a visible label with the native control", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("label", "Email address");
		document.body.append(field);
		const label = field.querySelector("label");
		const input = field.querySelector("input");
		expect(label?.textContent).toBe("Email address");
		expect(label?.contains(input ?? null)).toBe(true);
	});

	it("supports each label position and defaults invalid values to top", () => {
		const field = document.createElement("tp-textfield");
		expect(field.labelPosition).toBe("top");
		for (const position of ["top", "bottom", "start", "end"] as const) {
			field.labelPosition = position;
			expect(field.labelPosition).toBe(position);
		}
		field.setAttribute("label-position", "invalid");
		expect(field.labelPosition).toBe("top");
	});

	it("renders an automatically sized textarea in multiline mode", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("multiline", "");
		field.setAttribute("rows", "4");
		document.body.append(field);
		const textarea = field.querySelector("textarea");
		expect(textarea?.rows).toBe(4);
		expect(getComputedStyle(field).display).toBe("flow-root");
		expect(getComputedStyle(field).inlineSize).toBe("auto");
		expect(getComputedStyle(field).minInlineSize).toBe("0px");
		Object.defineProperty(textarea, "scrollHeight", {
			configurable: true,
			value: 96,
		});
		textarea?.dispatchEvent(new Event("input", { bubbles: true }));
		expect(textarea?.style.height).toBe("96px");
	});

	it("reflects editing through value and emits input", () => {
		const field = document.createElement("tp-textfield");
		document.body.append(field);
		const listener = vi.fn();
		field.addEventListener("input", listener);
		const input = field.querySelector("input");
		if (!input) throw new Error("Expected a native input");
		input.value = "Ada";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		expect(field.getAttribute("value")).toBe("Ada");
		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener.mock.calls[0]?.[0].target).toBe(field);
	});

	it("shows the clearable button and enables it when the user types", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("clearable", "");
		document.body.append(field);
		const clearButton = field.querySelector<HTMLElement>(
			"[data-tp-textfield-clear]",
		);
		if (!clearButton) throw new Error("Expected a clear button");
		const input = field.querySelector("input");
		if (!input) throw new Error("Expected a native input");
		expect(clearButton.hidden).toBe(false);
		expect(clearButton.hasAttribute("disabled")).toBe(true);
		input.value = "A";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		expect(clearButton.hidden).toBe(false);
		expect(clearButton.hasAttribute("disabled")).toBe(false);
	});

	it("renders a prefix and clears the value", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("icon", "magnify");
		field.setAttribute("clearable", "");
		field.setAttribute("value", "Search");
		document.body.append(field);
		expect(
			field.querySelector(
				'tp-icon[name="magnify"][library="tp"][size="1.25em"]',
			),
		).not.toBeNull();
		const cleared = vi.fn();
		field.addEventListener("tp-clear", cleared);
		field.querySelector<HTMLElement>("[data-tp-textfield-clear]")?.click();
		expect(field.value).toBe("");
		expect(cleared).toHaveBeenCalledTimes(1);
	});

	it("forwards native form attributes to its control", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("name", "answer");
		field.setAttribute("required", "");
		field.setAttribute("readonly", "");
		document.body.append(field);
		const input = field.querySelector("input");
		if (!input) throw new Error("Expected a native input");
		expect(input.name).toBe("answer");
		expect(input.required).toBe(true);
		expect(input.readOnly).toBe(true);
	});

	it("reflects its complete public API", () => {
		const field = document.createElement("tp-textfield");
		field.type = "email";
		field.multiline = true;
		field.label = "Contact";
		field.value = "hello@example.test";
		field.name = "contact";
		field.placeholder = "Email";
		field.autocomplete = "email";
		field.rows = 6;
		field.required = true;
		field.readOnly = true;
		field.disabled = true;
		field.clearable = true;
		field.icon = "mail";
		field.iconLibrary = "custom";
		document.body.append(field);
		expect([
			field.type,
			field.multiline,
			field.label,
			field.value,
			field.name,
			field.placeholder,
			field.autocomplete,
			field.rows,
		]).toEqual([
			"email",
			true,
			"Contact",
			"hello@example.test",
			"contact",
			"Email",
			"email",
			6,
		]);
		expect([
			field.required,
			field.readOnly,
			field.disabled,
			field.clearable,
			field.icon,
			field.iconLibrary,
		]).toEqual([true, true, true, true, "mail", "custom"]);
	});

	it("uses safe defaults for invalid type and rows", () => {
		const field = document.createElement("tp-textfield");
		field.setAttribute("type", "unsupported");
		field.setAttribute("rows", "bad");
		expect(field.type).toBe("text");
		expect(field.rows).toBe(3);
		expect(field.iconLibrary).toBe("tp");
	});
});
