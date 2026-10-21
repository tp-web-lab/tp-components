import { describe, expect, it } from "vitest";
import { TpAsciidocMultiPages } from "../asciidoc-multi-pages/asciidoc-multi-pages.js";
import { TpHtmlMultiPages } from "../html-multi-pages/html-multi-pages.js";
import { TpMarkdownMultiPages } from "../markdown-multi-pages/markdown-multi-pages.js";
import { TpRestructuredTextMultiPages } from "../restructuredtext-multi-pages/restructuredtext-multi-pages.js";
import { TpMarkupMultiPages } from "./markup-multi-pages.js";

for (const Component of [
	TpMarkupMultiPages,
	TpMarkdownMultiPages,
	TpHtmlMultiPages,
	TpAsciidocMultiPages,
	TpRestructuredTextMultiPages,
]) {
	describe(Component.name, () => {
		it("updates visibility and choices only from distinct declared languages", () => {
			const element = new Component();
			const shell = element as unknown as {
				renderShell(): void;
				attributeChangedCallback(name: string): void;
			};
			shell.renderShell();
			const selector = element.querySelector<HTMLElement>("tp-lang");
			expect(selector).not.toBeNull();
			expect(selector?.hidden).toBe(true);
			expect(element.langs).toBe("");
			Object.defineProperty(element, "isConnected", {
				configurable: true,
				value: true,
			});
			for (const [value, expected, hidden] of [
				["fr", "fr", true],
				["fr,en", "fr,en", false],
				[" FR, fr, ,", "fr", true],
				["fr, ar, en", "fr,ar,en", false],
				["", "", true],
				[null, "", true],
			] as const) {
				if (value === null) element.removeAttribute("langs");
				else element.setAttribute("langs", value);
				shell.attributeChangedCallback("langs");
				expect(selector?.hidden).toBe(hidden);
				expect(selector?.getAttribute("langs")).toBe(expected);
			}
		});
	});
}
