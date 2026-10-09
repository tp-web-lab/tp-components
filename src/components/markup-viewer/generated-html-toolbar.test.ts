import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { required } from "../../test-helpers/required.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";

vi.mock("../restructuredtext/restructuredtext.js", () => ({
	dedentRestructuredTextSource: (source: string) => source.trim(),
	parseRestructuredTextToAst: vi.fn(async () => ({ type: "document" })),
	renderRestructuredTextToHtml: vi.fn(async () => "<p>Hello</p>"),
}));

import "../markdown-viewer/markdown-viewer.js";
import "../asciidoc-viewer/asciidoc-viewer.js";
import "../restructuredtext-viewer/restructuredtext-viewer.js";
import "../html-viewer/html-viewer.js";

// Layout is checked in browsers; jsdom cannot measure CodeMirror's CSS geometry.
beforeEach(() =>
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	),
);
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

describe.each(["markdown", "asciidoc", "restructuredtext"])(
	"%s generated HTML toolbar",
	(language) => {
		it("places code between render and tree, opens read-only HTML, then returns to rendering", async () => {
			const viewer = document.createElement(`tp-${language}-viewer`);
			const source = document.createElement("script");
			source.type = `tp/${language}`;
			source.textContent = "Hello";
			viewer.append(source);
			document.body.append(viewer);
			await vi.waitFor(() =>
				expect(viewer.querySelector('[data-mode="html"]')).not.toBeNull(),
			);
			const buttons = Array.from(
				viewer.querySelectorAll<HTMLElement>('[data-role="output-mode"]'),
			);
			expect(buttons.map((button) => button.getAttribute("name"))).toEqual([
				"language-html",
				"code",
				"tree",
			]);
			const button = required(
				viewer.querySelector<HTMLElement>('[data-mode="html"]'),
			);
			button.click();
			await vi.waitFor(() =>
				expect(
					viewer.querySelector('[data-role="output"] > tp-code-editor'),
				).not.toBeNull(),
			);
			const editor = required(
				viewer.querySelector<TpCodeEditor>(
					'[data-role="output"] > tp-code-editor',
				),
			);
			expect(editor.readonly).toBe(true);
			expect(editor.language).toBe("html");
			expect(editor.getValue()).toContain("<p>Hello</p>");
			expect(button.getAttribute("aria-pressed")).toBe("true");
			expect(viewer.getAttribute("data-layout")).toBe("output");
			required(
				viewer.querySelector<HTMLElement>('[data-mode="render"]'),
			).click();
			await vi.waitFor(() =>
				expect(
					viewer.querySelector('[data-role="output"] > iframe'),
				).not.toBeNull(),
			);
			expect(button.getAttribute("aria-pressed")).toBe("false");
		});
		it("keeps lite mode free of output-mode controls", async () => {
			const viewer = document.createElement(`tp-${language}-viewer`);
			viewer.setAttribute("lite", "");
			viewer.textContent = "Hello";
			document.body.append(viewer);
			await vi.waitFor(() =>
				expect(viewer.querySelector('[data-role="output"]')).not.toBeNull(),
			);
			expect(viewer.querySelector('[data-mode="html"]')).toBeNull();
		});
	},
);
