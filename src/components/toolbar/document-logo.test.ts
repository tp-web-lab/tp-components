import { afterEach, expect, it, vi } from "vitest";
import "../markup-single-page/markup-single-page.js";
import "../markup-multi-pages/markup-multi-pages.js";
import "../html-single-page/html-single-page.js";
import "../html-multi-pages/html-multi-pages.js";
import "../markdown-single-page/markdown-single-page.js";
import "../markdown-multi-pages/markdown-multi-pages.js";
import "../asciidoc-single-page/asciidoc-single-page.js";
import "../asciidoc-multi-pages/asciidoc-multi-pages.js";
import "../restructuredtext-single-page/restructuredtext-single-page.js";
import "../restructuredtext-multi-pages/restructuredtext-multi-pages.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it.each([
	"tp-markup-single-page",
	"tp-markup-multi-pages",
	"tp-html-single-page",
	"tp-html-multi-pages",
	"tp-markdown-single-page",
	"tp-markdown-multi-pages",
	"tp-asciidoc-single-page",
	"tp-asciidoc-multi-pages",
	"tp-restructuredtext-single-page",
	"tp-restructuredtext-multi-pages",
])(
	"updates the leading logo without replacing the toolbar in %s",
	async (tag) => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("", { status: 404 })),
		);
		const element = document.createElement(tag);
		element.setAttribute("toolbar", "code");
		element.setAttribute("logo", "/first.svg");
		document.body.append(element);
		await vi.waitFor(() =>
			expect(
				element.querySelector("tp-toolbar [data-document-logo]"),
			).not.toBeNull(),
		);
		const toolbar = element.querySelector("tp-toolbar");
		if (!toolbar) throw new Error("Missing toolbar");
		const icon = toolbar.querySelector("[data-document-logo]");
		expect(icon?.tagName).toBe("TP-ICON-BUTTON");
		expect(icon?.getAttribute("size")).toBe("m");
		expect(icon?.getAttribute("src")).toBe("/first.svg");
		expect(icon?.querySelector("tp-icon")?.getAttribute("src")).toBe(
			"/first.svg",
		);
		expect(icon?.hasAttribute("disabled")).toBe(false);
		expect(icon?.getAttribute("data-logo-href")).toBe(
			new URL("./", document.baseURI).href,
		);
		element.setAttribute("logo-href", "https://example.com/site");
		expect(icon?.getAttribute("data-logo-href")).toBe(
			"https://example.com/site",
		);
		expect(icon?.hasAttribute("disabled")).toBe(false);
		element.setAttribute("logo-href", "javascript:alert(1)");
		expect(icon?.hasAttribute("disabled")).toBe(true);
		element.setAttribute("logo-href", "/associated");
		expect(icon?.getAttribute("data-logo-href")).toBe(
			new URL("/associated", document.baseURI).href,
		);
		element.removeAttribute("logo-href");
		expect(icon?.hasAttribute("disabled")).toBe(false);
		expect(icon?.getAttribute("data-logo-href")).toBe(
			new URL("./", document.baseURI).href,
		);
		for (const value of ["", "   "]) {
			element.setAttribute("logo-href", value);
			expect(icon?.getAttribute("data-logo-href")).toBe(
				new URL("./", document.baseURI).href,
			);
			expect(icon?.hasAttribute("disabled")).toBe(false);
		}
		element.setAttribute("git", "https://example.com/repository");
		element.setAttribute("logo", "/second.svg");
		expect(
			toolbar.querySelector("[data-toolbar-start]")?.firstElementChild,
		).toBe(icon);
		expect(icon?.getAttribute("src")).toBe("/second.svg");
		expect(element.querySelector("tp-toolbar")).toBe(toolbar);
		element.removeAttribute("logo");
		expect(toolbar.querySelector("[data-document-logo]")).toBeNull();
		element.setAttribute("logo", "/third.svg");
		expect(
			toolbar
				.querySelector("[data-toolbar-start]")
				?.firstElementChild?.getAttribute("src"),
		).toBe("/third.svg");
		element.setAttribute("logo", " ");
		expect(toolbar.querySelector("[data-document-logo]")).toBeNull();
	},
);
