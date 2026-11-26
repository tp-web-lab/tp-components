import { afterEach, expect, it, vi } from "vitest";
import "./textfield.js";
import "../markdown/markdown.js";
import "../mathfield/mathfield.js";
import "../numberfield/numberfield.js";
import "../datefield/datefield.js";
import "../timefield/timefield.js";
import type { TpCopyCode } from "../copy-code/copy-code.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it.each([
	["tp-textfield", "Example"],
	["tp-mathfield", "x^2"],
	["tp-numberfield", "42"],
	["tp-datefield", "2026-11-15"],
	["tp-timefield", "14:30"],
] as const)(
	"toggles optional copies of the live %s value without losing content",
	async (tag, value) => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		const field = document.createElement(tag);
		field.value = value;
		document.body.append(field);
		expect(field.copyCode).toBe(false);
		expect(field.querySelector("tp-copy-code")).toBeNull();
		field.setAttribute("copy-code", "");
		expect(field.copyCode).toBe(true);
		expect(field.querySelectorAll("tp-copy-code")).toHaveLength(
			tag === "tp-mathfield" ? 2 : 1,
		);
		const copy = field.querySelector<TpCopyCode>("tp-copy-code");
		if (!copy) throw new Error("Missing copy");
		await copy.copy();
		expect(writeText).toHaveBeenLastCalledWith(value);
		field.copyCode = false;
		expect(field.hasAttribute("copy-code")).toBe(false);
		expect(field.querySelector("tp-copy-code")).toBeNull();
		expect(field.value).toBe(value);
		field.copyCode = true;
		expect(field.querySelector("tp-copy-code")).not.toBeNull();
		field.removeAttribute("copy-code");
		expect(field.querySelector("tp-copy-code")).toBeNull();
	},
);
