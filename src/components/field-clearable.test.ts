import { afterEach, describe, expect, it } from "vitest";
import "./textfield/textfield.js";
import "./mathfield/mathfield.js";
import "./datefield/datefield.js";
import "./timefield/timefield.js";

afterEach(() => document.body.replaceChildren());

describe.each([
	["tp-textfield", "Hello", false],
	["tp-textfield", "Hello", true],
	["tp-mathfield", "x^2", false],
	["tp-mathfield", "x^2", true],
	["tp-datefield", "2026-09-14", false],
	["tp-timefield", "14:30", false],
] as const)(
	"%s clearable (value=%s, multiline=%s)",
	(tag, value, multiline) => {
		it("hides the clear button unless clearable is present, including after updates", () => {
			const field = document.createElement(tag);
			field.setAttribute("value", value);
			field.toggleAttribute("multiline", multiline);
			document.body.append(field);
			const button = field.querySelector<HTMLElement>(
				"[data-tp-textfield-clear], [data-tp-datefield-clear], [data-tp-timefield-clear]",
			);
			if (!button) throw new Error("Missing embedded clear button");
			expect(button.hidden).toBe(true);
			field.setAttribute("clearable", "");
			expect(button.hidden).toBe(false);
			field.setAttribute("readonly", "");
			expect(button.hasAttribute("disabled")).toBe(true);
			field.removeAttribute("readonly");
			field.setAttribute("disabled", "");
			expect(button.hasAttribute("disabled")).toBe(true);
			field.removeAttribute("disabled");
			expect(button.hasAttribute("disabled")).toBe(false);
			field.removeAttribute("clearable");
			expect(button.hidden).toBe(true);
			// Boolean attributes use presence, even if their literal value is "false".
			field.setAttribute("clearable", "false");
			expect(button.hidden).toBe(false);
		});
	},
);
