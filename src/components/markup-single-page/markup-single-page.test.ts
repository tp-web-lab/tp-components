/**
 * @module markup-single-page/test
 * @summary Tests for `<tp-markup-single-page>`.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import "./markup-single-page.js";

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
