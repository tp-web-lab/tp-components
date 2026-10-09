import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { stubMathJaxRuntime } from "../../test-helpers/mathjax.js";
import "./mathfield.js";

beforeEach(() => stubMathJaxRuntime());
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("switches notation and synchronizes its check without replacing the expression", () => {
	const field = document.createElement("tp-mathfield");
	field.value = "x^2";
	document.body.append(field);
	const button = field.querySelector<HTMLButtonElement>(
		"[data-tp-mathfield-mode-button]",
	);
	button?.click();
	expect(field.querySelector("tp-dropdown")?.hasAttribute("open")).toBe(true);
	const item = field.querySelector<HTMLElement>('[data-mode="asciimath"]');
	item?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	expect(field.mode).toBe("asciimath");
	expect(field.value).toBe("x^2");
	expect(
		item?.querySelector<HTMLElement>("[data-mode-check]")?.style.visibility,
	).toBe("visible");
	expect(field.querySelector("tp-dropdown")?.hasAttribute("open")).toBe(false);
	field.mode = "latexmath";
	expect(
		item?.querySelector<HTMLElement>("[data-mode-check]")?.style.visibility,
	).toBe("hidden");
	field.multiline = true;
	field.label = "Formula";
	expect(
		field.querySelectorAll("[data-tp-mathfield-mode-button]"),
	).toHaveLength(1);
	expect(
		field
			.querySelector("[data-tp-mathfield-mode-button] tp-icon")
			?.getAttribute("name"),
	).toBe("mathfield-mark");
});
it("disables mode selection for disabled and readonly fields", () => {
	const field = document.createElement("tp-mathfield");
	document.body.append(field);
	const button = field.querySelector<HTMLButtonElement>(
		"[data-tp-mathfield-mode-button]",
	);
	field.disabled = true;
	expect(button?.disabled).toBe(true);
	field.disabled = false;
	field.readOnly = true;
	expect(button?.disabled).toBe(true);
	field.querySelector<HTMLElement>('[data-mode="asciimath"]')?.click();
	expect(field.mode).toBe("latexmath");
	field.readOnly = false;
	expect(button?.disabled).toBe(false);
});

it("anchors the dropdown below the connected mode button", () => {
	const field = document.createElement("tp-mathfield");
	document.body.append(field);
	const button = field.querySelector<HTMLButtonElement>(
		"[data-tp-mathfield-mode-button]",
	);
	if (!button) throw new Error("Missing mode button");
	vi.spyOn(button, "getBoundingClientRect").mockReturnValue(
		new DOMRect(200, 100, 20, 20),
	);
	button.click();
	const dropdown = field.querySelector<HTMLElement>("tp-dropdown");
	expect(dropdown?.style.left).toBe("200px");
	expect(dropdown?.style.top).toBe("128px");
});
