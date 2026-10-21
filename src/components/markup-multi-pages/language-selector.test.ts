import { afterEach, describe, expect, it, vi } from "vitest";
import { TpAsciidocMultiPages } from "../asciidoc-multi-pages/asciidoc-multi-pages.js";
import { TpHtmlMultiPages } from "../html-multi-pages/html-multi-pages.js";
import { TpMarkdownMultiPages } from "../markdown-multi-pages/markdown-multi-pages.js";
import { TpRestructuredTextMultiPages } from "../restructuredtext-multi-pages/restructuredtext-multi-pages.js";
import { TpMarkupMultiPages } from "./markup-multi-pages.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

for (const Component of [
	TpMarkupMultiPages,
	TpMarkdownMultiPages,
	TpHtmlMultiPages,
	TpAsciidocMultiPages,
	TpRestructuredTextMultiPages,
]) {
	describe(Component.name, () => {
		it("provides the same left and right toolbar controls with working calculator and annotations", () => {
			vi.spyOn(
				Component.prototype as unknown as { initialize(): Promise<void> },
				"initialize",
			).mockResolvedValue();
			const element = new Component();
			document.body.append(element);
			const toolbar = element.querySelector("tp-toolbar");
			const names = (section: string) =>
				[
					...(toolbar?.querySelectorAll(
						`:scope > [data-toolbar-${section}] > [section="${section}"]`,
					) ?? []),
				].map((node) => node.getAttribute("data-action") || node.localName);
			expect(names("end")).toEqual([
				"tp-clock",
				"tp-lang",
				"tp-color",
				"tp-theme",
				"tp-fullscreen",
			]);
			expect(names("start")).toEqual([
				"home",
				"menu",
				"code",
				"calculator",
				"tp-post-it-editor",
				"tp-source",
			]);
			expect(
				toolbar?.querySelector("tp-post-it-editor tp-icon-button"),
			).not.toBeNull();
			const button = toolbar?.querySelector<HTMLElement>(
				'[data-action="calculator"]',
			);
			button?.click();
			const drawer = element.querySelector(
				'tp-drawer[data-role="calculator-drawer"]',
			);
			expect(drawer?.hasAttribute("open")).toBe(true);
			const calculator = drawer?.querySelector("tp-calculator");
			expect(calculator).not.toBeNull();
			button?.click();
			expect(drawer?.hasAttribute("open")).toBe(false);
			button?.click();
			expect(drawer?.querySelector("tp-calculator")).toBe(calculator);
		});
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
