/**
 * @module markup-single-page/test
 * @summary Tests for `<tp-markup-single-page>`.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import "./markup-single-page.js";
import "../html-single-page/html-single-page.js";
import "../markdown-single-page/markdown-single-page.js";
import "../asciidoc-single-page/asciidoc-single-page.js";
import "../restructuredtext-single-page/restructuredtext-single-page.js";

afterEach(() => {
	vi.unstubAllGlobals();
	document.body.innerHTML = "";
});

describe("<tp-markup-single-page>", () => {
	async function flush(): Promise<void> {
		await Promise.resolve();
		await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
	}

	async function waitFor(
		predicate: () => boolean,
		timeoutMs = 1500,
	): Promise<void> {
		const startedAt = Date.now();
		while (!predicate() && Date.now() - startedAt <= timeoutMs) {
			await flush();
		}
	}

	it("renders inline Markdown from script type", async () => {
		const element = document.createElement("tp-markup-single-page");
		element.innerHTML = `
      <script type="tp/markdown">
        # Markdown title
      </script>
    `;

		document.body.append(element);
		await waitFor(() =>
			element.hasAttribute("data-tp-markup-single-page-rendered"),
		);

		expect(element.getAttribute("data-tp-markup-single-page-language")).toBe(
			"markdown",
		);
		expect(element.querySelector("tp-markdown h1")?.textContent).toBe(
			"Markdown title",
		);
	});

	it("renders inline HTML from script type", async () => {
		const element = document.createElement("tp-markup-single-page");
		element.innerHTML = `
      <script type="tp/html">
        <article><h2>HTML title</h2></article>
      </script>
    `;

		document.body.append(element);
		await waitFor(() =>
			element.hasAttribute("data-tp-markup-single-page-rendered"),
		);

		expect(element.getAttribute("data-tp-markup-single-page-language")).toBe(
			"html",
		);
		expect(element.querySelector("article h2")?.textContent).toBe("HTML title");
	});

	it("selects the AsciiDoc renderer from src extension", async () => {
		const element = document.createElement("tp-markup-single-page");
		element.setAttribute("src", "/guide/page.adoc");

		document.body.append(element);
		await waitFor(
			() =>
				element.querySelector('tp-asciidoc[src="/guide/page.adoc"]') !== null,
		);

		expect(element.getAttribute("data-tp-markup-single-page-language")).toBe(
			"asciidoc",
		);
		expect(element.getAttribute("data-tp-markup-single-page-source")).toBe(
			"/guide/page.adoc",
		);
	});

	it("loads HTML files directly from src extension", async () => {
		const fetchMock = vi.fn(
			async () => new Response("<section><h2>Loaded HTML</h2></section>"),
		);
		vi.stubGlobal("fetch", fetchMock);

		const element = document.createElement("tp-markup-single-page");
		element.setAttribute("src", "/guide/page.html");
		document.body.append(element);
		await waitFor(() =>
			element.hasAttribute("data-tp-markup-single-page-rendered"),
		);

		expect(element.getAttribute("data-tp-markup-single-page-language")).toBe(
			"html",
		);
		expect(element.querySelector("section h2")?.textContent).toBe(
			"Loaded HTML",
		);
		expect(fetchMock).toHaveBeenCalledOnce();
	});

	it("shows an error for unsupported src extensions", async () => {
		const element = document.createElement("tp-markup-single-page");
		element.setAttribute("src", "/guide/page.txt");

		document.body.append(element);
		await waitFor(() =>
			element.hasAttribute("data-tp-markup-single-page-rendered"),
		);

		expect(element.querySelector('[role="alert"]')?.textContent).toContain(
			"Unsupported single-page source extension",
		);
	});

	it.each([
		["tp/adoc", "asciidoc", "tp-asciidoc"],
		["tp/rst", "restructuredtext", "tp-restructuredtext"],
		["tp/md", "markdown", "tp-markdown"],
	])("supports the inline %s alias", async (type, language, tagName) => {
		const element = document.createElement("tp-markup-single-page");
		element.innerHTML = `<script type="${type}">Document</script>`;
		document.body.append(element);
		await waitFor(() =>
			element.hasAttribute("data-tp-markup-single-page-rendered"),
		);

		expect(element.dataset.tpMarkupSinglePageLanguage).toBe(language);
		expect(element.querySelector(tagName)).not.toBeNull();
	});

	it.each([
		["/guide/page.htm?raw=1", "html"],
		["/guide/page.markdown#title", "markdown"],
		["/guide/page.asciidoc", "asciidoc"],
		["/guide/page.rest", "restructuredtext"],
	])("detects the language of %s", async (src, language) => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("<p>HTML</p>", { status: 200 })),
		);
		const element = document.createElement("tp-markup-single-page");
		element.setAttribute("src", src);
		document.body.append(element);
		await waitFor(() =>
			element.hasAttribute("data-tp-markup-single-page-rendered"),
		);

		expect(element.dataset.tpMarkupSinglePageLanguage).toBe(language);
	});

	it("reflects src changes and reports missing or failed sources safely", async () => {
		const element = document.createElement(
			"tp-markup-single-page",
		) as HTMLElement & {
			src: string;
		};
		document.body.append(element);
		await waitFor(() =>
			element.hasAttribute("data-tp-markup-single-page-rendered"),
		);
		expect(element.querySelector('[role="alert"]')?.textContent).toContain(
			"Missing single-page source",
		);

		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("", { status: 503 })),
		);
		element.src = "/unavailable.html";
		await waitFor(
			() =>
				element
					.querySelector('[role="alert"]')
					?.textContent?.includes("503") === true,
		);
		expect(element.src).toBe("/unavailable.html");

		element.src = "   ";
		expect(element.hasAttribute("src")).toBe(false);
	});

	it("ignores stale asynchronous renders after src changes", async () => {
		let resolveFirst: ((response: Response) => void) | undefined;
		vi.stubGlobal(
			"fetch",
			vi.fn((input: RequestInfo | URL) => {
				if (String(input).includes("first")) {
					return new Promise<Response>((resolve) => {
						resolveFirst = resolve;
					});
				}
				return Promise.resolve(
					new Response("<h2>Second</h2>", { status: 200 }),
				);
			}),
		);

		const element = document.createElement("tp-markup-single-page");
		element.setAttribute("src", "/first.html");
		document.body.append(element);
		element.setAttribute("src", "/second.html");
		await waitFor(
			() =>
				element.querySelector(".tp-markup-single-page-output h2")
					?.textContent === "Second",
		);
		resolveFirst?.(new Response("<h2>First</h2>", { status: 200 }));
		await flush();

		expect(
			element.querySelector(".tp-markup-single-page-output h2")?.textContent,
		).toBe("Second");
	});
});

describe("single-page toolbar", () => {
	function page(toolbar?: string) {
		const page = document.createElement("tp-markup-single-page");
		page.innerHTML =
			'<script type="tp/html"><p>Keep this document</p></script>';
		if (toolbar !== undefined) page.toolbar = toolbar;
		document.body.append(page);
		return page;
	}

	it("is absent by default and updates without replacing the document", () => {
		const element = page();
		const paragraph = element.querySelector("p");
		expect(element.querySelector("tp-toolbar")).toBeNull();
		element.toolbar = "theme, code,calc,code,unknown";
		expect(
			[
				...element.querySelectorAll(
					"tp-toolbar > [data-toolbar-start] > [data-action], tp-toolbar > [data-toolbar-end] > [data-action]",
				),
			].map((node) => node.getAttribute("data-action")),
		).toEqual(["code", "calc", "theme"]);
		expect(element.querySelector("p")).toBe(paragraph);
		element.toolbar = null;
		expect(element.querySelector("tp-toolbar")).toBeNull();
		expect(element.querySelector("p")).toBe(paragraph);
	});

	it("enables all controls in the requested sections when empty", () => {
		const element = page("");
		expect(
			[
				...element.querySelectorAll(
					"tp-toolbar > [data-toolbar-start] > [data-action], tp-toolbar > [data-toolbar-end] > [data-action]",
				),
			].map((node) => node.getAttribute("data-action")),
		).toEqual([
			"code",
			"calc",
			"postit",
			"clock",
			"lang",
			"color",
			"theme",
			"fullscreen",
		]);
		for (const name of ["code", "calc", "postit"])
			expect(
				element
					.querySelector(`[data-action="${name}"]`)
					?.getAttribute("section"),
			).toBe("start");
		for (const name of ["clock", "lang", "color", "theme", "fullscreen"])
			expect(
				element
					.querySelector(`[data-action="${name}"]`)
					?.getAttribute("section"),
			).toBe("end");
		expect(element.querySelector("tp-lang")?.hidden).toBe(true);
	});

	it("shows literal source and opens a calculator, then disposes both drawers", async () => {
		const element = page("code,calc");
		element.querySelector<HTMLElement>('[data-action="code"]')?.click();
		expect(
			element.querySelector('[data-role="source-drawer"] code')?.textContent,
		).toBe("<p>Keep this document</p>");
		expect(
			element.querySelector('[data-role="source-drawer"] code p'),
		).toBeNull();
		element.querySelector<HTMLElement>('[data-action="calc"]')?.click();
		expect(
			element.querySelector(
				'[data-role="calculator-drawer"][open] tp-calculator',
			),
		).not.toBeNull();
		element.toolbar = null;
		expect(element.querySelector("tp-drawer")).toBeNull();
		element.remove();
		document.body.append(element);
		expect(element.querySelector("p")?.textContent).toBe("Keep this document");
	});

	it.each(["html", "markdown", "asciidoc", "restructuredtext"])(
		"inherits the toolbar on %s pages",
		(format) => {
			const element = document.createElement(`tp-${format}-single-page`);
			element.innerHTML = `<script type="tp/${format}">Document</script>`;
			element.setAttribute("toolbar", "theme");
			document.body.append(element);
			expect(element.querySelector("tp-toolbar tp-theme")).not.toBeNull();
			expect(element.querySelector("tp-post-it-editor")).toBeNull();
		},
	);

	it("does not probe translations without the language control", async () => {
		const fetchMock = vi.fn(async () => new Response("<p>Document</p>"));
		vi.stubGlobal("fetch", fetchMock);
		const element = document.createElement("tp-markup-single-page");
		element.src = "/guide/page.html";
		element.langs = "en,fr";
		element.toolbar = "code,theme";
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.querySelector("p")?.textContent).toBe("Document"),
		);
		expect(fetchMock).toHaveBeenCalledOnce();
	});

	it("ignores translation discovery completed after removing the toolbar", async () => {
		let complete: ((value: Response) => void) | undefined;
		vi.stubGlobal(
			"fetch",
			vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
				if (init?.method === "HEAD")
					return new Promise<Response>((resolve) => {
						complete = resolve;
					});
				return new Response("<p>Document</p>");
			}),
		);
		const element = document.createElement("tp-markup-single-page");
		element.src = "/guide/page.html";
		element.langs = "en,fr";
		element.toolbar = "lang";
		document.body.append(element);
		const selector = element.querySelector("tp-lang");
		element.toolbar = null;
		complete?.(new Response(""));
		await Promise.resolve();
		await Promise.resolve();
		expect(selector?.hidden).toBe(true);
		expect(element.querySelector("tp-toolbar")).toBeNull();
	});

	it("offers only existing translations and switches the source without navigating the host", async () => {
		const fetchMock = vi.fn(
			async (input: RequestInfo | URL, init?: RequestInit) => {
				const url = String(input);
				if (url.includes("/es/")) return new Response("", { status: 404 });
				return new Response(
					init?.method === "HEAD"
						? ""
						: `<p>${url.includes("/fr/") ? "Bonjour" : "Hello"}</p>`,
				);
			},
		);
		vi.stubGlobal("fetch", fetchMock);
		const element = document.createElement("tp-markup-single-page");
		element.setAttribute("src", "/guide/page.html");
		element.setAttribute("langs", "en,fr,es");
		element.toolbar = "lang";
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.querySelector("tp-lang")?.hidden).toBe(false),
		);
		expect(element.querySelector("tp-lang")?.langs).toBe("en,fr");
		const location = window.location.href;
		element.querySelector<HTMLElement>('[data-lang="fr"]')?.click();
		await vi.waitFor(() =>
			expect(
				element.querySelector(".tp-markup-single-page-output p")?.textContent,
			).toBe("Bonjour"),
		);
		expect(element.src).toContain("/guide/fr/page.html");
		expect(window.location.href).toBe(location);
		await vi.waitFor(() =>
			expect(element.querySelector("tp-lang")?.hidden).toBe(false),
		);
		element.querySelector<HTMLElement>('[data-lang="en"]')?.click();
		await vi.waitFor(() =>
			expect(
				element.querySelector(".tp-markup-single-page-output p")?.textContent,
			).toBe("Hello"),
		);
	});
});
