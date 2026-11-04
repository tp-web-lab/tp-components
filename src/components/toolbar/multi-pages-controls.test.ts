import { afterEach, describe, expect, it, vi } from "vitest";
import "../markdown-multi-pages/markdown-multi-pages.js";
import "../markup-multi-pages/markup-multi-pages.js";
import "../html-multi-pages/html-multi-pages.js";
import "../asciidoc-multi-pages/asciidoc-multi-pages.js";
import "../restructuredtext-multi-pages/restructuredtext-multi-pages.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
describe("multi-page toolbar selection", () => {
	it.each(["markdown", "markup", "html", "asciidoc", "restructuredtext"])(
		"updates %s commands without replacing page content",
		async (format) => {
			vi.stubGlobal(
				"fetch",
				vi.fn(async () => new Response("", { status: 404 })),
			);
			const host = document.createElement(`tp-${format}-multi-pages`);
			host.setAttribute("toolbar", " HOME, menu,theme,theme,unknown");
			host.setAttribute("langs", "en,fr");
			document.body.append(host);
			const toolbar = host.querySelector("tp-toolbar");
			const content = host.querySelector('[data-role="content"]');
			const hidden = (selector: string) =>
				toolbar?.querySelector<HTMLElement>(selector)?.hidden;
			expect(hidden('[data-action="home"]')).toBe(false);
			expect(hidden("tp-theme")).toBe(false);
			expect(hidden('[data-action="calculator"]')).toBe(true);
			expect(hidden("tp-post-it-editor")).toBe(true);
			expect(hidden("tp-lang")).toBe(true);
			host.setAttribute("toolbar", "postit,lang");
			expect(hidden("tp-post-it-editor")).toBe(false);
			expect(hidden("tp-lang")).toBe(false);
			host.setAttribute("langs", "fr");
			expect(hidden("tp-lang")).toBe(true);
			host.removeAttribute("toolbar");
			expect(hidden('tp-color[data-role="brand"]')).toBe(false);
			expect(hidden('[data-action="code"]')).toBe(false);
			expect(hidden("tp-fullscreen")).toBe(false);
			host.setAttribute("toolbar", "none");
			expect(hidden("tp-theme")).toBe(true);
			host.setAttribute("toolbar", "");
			expect(hidden("tp-theme")).toBe(false);
			expect(host.querySelector('[data-role="content"]')).toBe(content);
			expect(host.querySelector("tp-toolbar")).toBe(toolbar);
			await new Promise((resolve) => setTimeout(resolve, 0));
		},
	);
});

it.each(["markdown", "markup", "html", "asciidoc", "restructuredtext"])(
	"closes the %s menu on initial portrait and on entering portrait",
	(format) => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("", { status: 404 })),
		);
		vi.stubGlobal("innerWidth", 600);
		vi.stubGlobal("innerHeight", 800);
		const host = document.createElement(`tp-${format}-multi-pages`);
		host.setAttribute("menu", "");
		document.body.append(host);
		expect(host.hasAttribute("menu")).toBe(false);
		host.setAttribute("menu", "");
		window.dispatchEvent(new Event("resize"));
		expect(host.hasAttribute("menu")).toBe(true);
		vi.stubGlobal("innerWidth", 1000);
		window.dispatchEvent(new Event("resize"));
		vi.stubGlobal("innerWidth", 600);
		window.dispatchEvent(new Event("resize"));
		expect(host.hasAttribute("menu")).toBe(false);
		host.remove();
		vi.stubGlobal("innerWidth", 1000);
		window.dispatchEvent(new Event("resize"));
		host.setAttribute("menu", "");
		vi.stubGlobal("innerWidth", 600);
		window.dispatchEvent(new Event("resize"));
		expect(host.hasAttribute("menu")).toBe(true);
	},
);
