import { afterEach, expect, it } from "vitest";
import "./textfield.js";
import "../mathfield/mathfield.js";

afterEach(() => document.body.replaceChildren());

it.each([
	["tp-textfield", "textfield-mark"],
	["tp-mathfield", "mathfield-mark"],
] as const)(
	"always identifies %s but only shows its clear control when clearable",
	(tag, marker) => {
		const field = document.createElement(tag);
		document.body.append(field);
		const icon = field.querySelector(
			tag === "tp-mathfield"
				? "[data-tp-mathfield-mode-button] tp-icon"
				: "[data-tp-textfield-type]",
		);
		expect(icon?.getAttribute("name")).toBe(marker);
		expect(icon?.getAttribute("aria-hidden")).toBe("true");
		const close = field.querySelector("[data-tp-textfield-clear]");
		expect(close?.hasAttribute("hidden")).toBe(true);
		field.setAttribute("clearable", "");
		expect(close?.hasAttribute("hidden")).toBe(false);
		expect(close?.hasAttribute("disabled")).toBe(true);
		const input = field.querySelector("input");
		if (!input) throw new Error("Expected input");
		input.value = "12";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		expect(close?.hasAttribute("disabled")).toBe(false);
		close?.dispatchEvent(new Event("click"));
		expect(input.value).toBe("");
	},
);
