/**
 * @module markup-multi-pages/test
 * @summary Tests du composant `<tp-markup-multi-pages>`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TpMarkupMultiPages } from "./markup-multi-pages.js";

function createLocalStorageMock(): Storage {
	const data = new Map<string, string>();
	return {
		clear: () => {
			data.clear();
		},
		getItem: (key: string) => data.get(String(key)) ?? null,
		key: (index: number) => Array.from(data.keys())[index] ?? null,
		removeItem: (key: string) => {
			data.delete(String(key));
		},
		setItem: (key: string, value: string) => {
			data.set(String(key), String(value));
		},
		get length() {
			return data.size;
		},
	};
}

async function flush(): Promise<void> {
	await Promise.resolve();
	await new Promise<void>((resolve) => {
		window.setTimeout(resolve, 0);
	});
}

async function waitFor(
	predicate: () => boolean,
	timeoutMs = 500,
): Promise<void> {
	const startedAt = Date.now();
	while (!predicate()) {
		if (Date.now() - startedAt > timeoutMs) break;
		await flush();
	}
}

function mockDocsFetch(files: Record<string, string>): void {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (input: RequestInfo | URL) => {
			const url = new URL(String(input), window.location.href);
			const source = files[url.pathname];

			return {
				ok: source !== undefined,
				status: source === undefined ? 404 : 200,
				headers: {
					get: () =>
						url.pathname.endsWith(".html") ? "text/html" : "text/plain",
				},
				text: async () => source ?? "",
			} as unknown as Response;
		}),
	);
}

function mockViteFallbackFetch(files: Record<string, string>): void {
	const fallback = `<!doctype html>
<html>
  <head><title>DEV : tp-components</title></head>
  <body>
    <tp-markup-multi-pages repository="/docs"></tp-markup-multi-pages>
    <script type="module" src="/src/tp-loader.ts"></script>
  </body>
</html>`;

	vi.stubGlobal(
		"fetch",
		vi.fn(async (input: RequestInfo | URL) => {
			const url = new URL(String(input), window.location.href);
			const source = files[url.pathname] ?? fallback;
			const isFallback = files[url.pathname] === undefined;

			return {
				ok: true,
				status: 200,
				headers: {
					get: () =>
						isFallback || url.pathname.endsWith(".html")
							? "text/html"
							: "text/plain",
				},
				text: async () => source,
			} as unknown as Response;
		}),
	);
}

function invoke<T>(target: object, name: string, ...args: unknown[]): T {
	const method = Reflect.get(target, name) as (...values: unknown[]) => T;
	return method.apply(target, args);
}

function setInternal(target: object, name: string, value: unknown): void {
	Reflect.set(target, name, value);
}

describe("<tp-markup-multi-pages>", () => {
	beforeEach(() => {
		vi.stubGlobal("localStorage", createLocalStorageMock());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = "";
		window.history.replaceState(
			null,
			"",
			`${window.location.pathname}${window.location.search}`,
		);
	});

	it("charge cover.html quand cover.md est absent", async () => {
		mockDocsFetch({
			"/docs/sidebar.md": "- [Home](cover.html)",
			"/docs/cover.html": '<h1 id="home">HTML cover</h1>',
		});

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);

		await waitFor(() => element.querySelector("main h1") !== null);

		expect(element.querySelector("main h1")?.textContent).toBe("HTML cover");
		expect(element.querySelector("main tp-markdown")).toBeNull();
	});

	it("choisit le renderer selon l’extension du fichier", () => {
		const element = new TpMarkupMultiPages();
		const createMarkupViewer = (
			element as unknown as {
				createMarkupViewer(href: string, source?: string): HTMLElement;
			}
		).createMarkupViewer.bind(element);
		const createInlineMarkupViewer = (
			element as unknown as {
				createInlineMarkupViewer(href: string, source: string): HTMLElement;
			}
		).createInlineMarkupViewer.bind(element);

		expect(createMarkupViewer("/docs/page.md").tagName.toLowerCase()).toBe(
			"tp-markdown",
		);
		expect(createMarkupViewer("/docs/page.adoc").tagName.toLowerCase()).toBe(
			"tp-asciidoc",
		);
		expect(createMarkupViewer("/docs/page.rst").tagName.toLowerCase()).toBe(
			"tp-restructuredtext",
		);
		expect(
			createMarkupViewer("/docs/page.html", "<h1>HTML</h1>").innerHTML,
		).toContain("<h1>HTML</h1>");

		const notFound = createInlineMarkupViewer(
			"/docs/page-not-found.rst",
			"Page not found\n==============",
		);
		expect(notFound.tagName.toLowerCase()).toBe("tp-restructuredtext");
		expect(notFound.querySelector("script")?.getAttribute("type")).toBe(
			"tp/restructuredtext",
		);
	});

	it("masque le sélecteur de langue sans répertoire de traduction", async () => {
		mockDocsFetch({
			"/docs/sidebar.md": "- [Home](cover.md)",
			"/docs/cover.md": "# Cover",
		});

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);
		await waitFor(() => element.querySelector("main h1") !== null);

		expect(element.querySelector<HTMLElement>("tp-lang")?.hidden).toBe(true);
	});

	it("affiche le sélecteur de langue lorsqu’une traduction existe", async () => {
		mockDocsFetch({
			"/docs/sidebar.md": "- [Home](cover.md)",
			"/docs/cover.md": "# Cover",
			"/docs/fr/sidebar.md": "- [Accueil](cover.md)",
			"/docs/fr/cover.md": "# Accueil",
		});

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);
		await waitFor(() => element.querySelector("main h1") !== null);

		expect(element.querySelector<HTMLElement>("tp-lang")?.hidden).toBe(false);
		const requestedPaths = vi
			.mocked(fetch)
			.mock.calls.map(
				([input]) => new URL(String(input), window.location.href).pathname,
			);
		expect(requestedPaths).toContain("/docs/fr/sidebar.md");
		expect(
			requestedPaths.filter((path) => path.startsWith("/docs/fr/")),
		).toEqual(["/docs/fr/sidebar.md"]);
	});

	it("préserve l’ordre documentaire de la sidebar sans commande de tri", async () => {
		mockDocsFetch({
			"/docs/sidebar.md": "- [Zulu](zulu.md)\n- [Alpha](alpha.md)",
			"/docs/cover.md": "# Cover",
		});

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);
		await waitFor(() => element.querySelector("tp-tree") !== null);

		const controls = element.querySelector(
			".tp-markup-multi-pages-sidebar-controls",
		);
		expect(controls?.querySelectorAll("tp-icon-button")).toHaveLength(2);
		expect(
			controls?.querySelector('[name="sort-alphabetical-ascending"]'),
		).toBeNull();

		const tree = element.querySelector("tp-tree") as HTMLElement & {
			contextMenuConfig?: {
				globalActions: Array<{ id: string }>;
				getNodeActions?: (target: {
					hasChildren: boolean;
					expanded: boolean;
				}) => Array<{ id: string }>;
			};
		};
		expect(
			tree.contextMenuConfig?.globalActions.some((action) =>
				action.id.includes("sort"),
			),
		).toBe(false);
		expect(
			tree.contextMenuConfig
				?.getNodeActions?.({ hasChildren: true, expanded: false })
				.some((action) => action.id === "sort"),
		).toBe(false);
	});

	it("affiche le code AsciiDoc dans un bloc pre/code colorisable", async () => {
		mockDocsFetch({
			"/docs/sidebar.md": "- [Page](page.adoc)",
			"/docs/cover.md": "# Cover",
			"/docs/page.adoc": "= Page\n:showtitle:",
		});
		window.location.hash = "#/page.adoc";

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);
		await waitFor(() => element.querySelector("main tp-asciidoc") !== null);
		element.querySelector<HTMLElement>('[data-action="code"]')?.click();
		await waitFor(() => element.querySelector("main pre code") !== null);

		const code = element.querySelector<HTMLElement>("main pre code");
		expect(code?.classList.contains("language-asciidoc")).toBe(true);
		expect(code?.textContent).toContain("= Page");
	});

	it("colorise le code reStructuredText dans le bloc pre/code", async () => {
		mockDocsFetch({
			"/docs/sidebar.md": "- [Page](page.rst)",
			"/docs/cover.md": "# Cover",
			"/docs/page.rst": "Page\n====\n\n.. tp-sudoku::",
		});
		window.location.hash = "#/page.rst";

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);
		await waitFor(
			() => element.querySelector("main tp-restructuredtext") !== null,
		);
		element.querySelector<HTMLElement>('[data-action="code"]')?.click();
		await waitFor(
			() => element.querySelector("main pre code .hljs-meta") !== null,
		);

		const code = element.querySelector<HTMLElement>("main pre code");
		expect(code?.classList.contains("hljs")).toBe(true);
		expect(code?.querySelector(".hljs-section")?.textContent).toContain("Page");
		expect(code?.querySelector(".hljs-meta")?.textContent).toContain(
			"tp-sudoku",
		);
	});

	it("ne convertit pas les routes html en markdown", () => {
		const element = new TpMarkupMultiPages();
		element.repository = "/docs";
		const resolveDocumentHref = (
			element as unknown as {
				resolveDocumentHref(href: string, baseHref?: string): string;
			}
		).resolveDocumentHref.bind(element);

		expect(
			resolveDocumentHref("./next.html#usage", "/docs/guide/current.adoc"),
		).toBe("/docs/guide/next.html#usage");
		expect(
			resolveDocumentHref("../intro.rst", "/docs/guide/current.html"),
		).toBe("/docs/intro.rst");
	});

	it("garde une sidebar visible avec une position persistée à zéro", async () => {
		localStorage.setItem("tp-markup-multi-pages-sidebar", "0%");
		mockDocsFetch({
			"/docs/sidebar.md": "- [Home](cover.html)",
			"/docs/cover.html": "<h1>Cover</h1>",
		});

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		element.setAttribute("menu", "");
		document.body.append(element);

		await waitFor(() => element.querySelector("tp-splitter") !== null);

		const splitter = element.querySelector<HTMLElement>("tp-splitter");
		expect(splitter?.getAttribute("position")).toBe("10%");
		expect(splitter?.style.getPropertyValue("--tp-splitter-position")).toBe(
			"10%",
		);
	});

	it("renvoie le bouton home vers le cover réellement disponible", async () => {
		mockDocsFetch({
			"/docs/sidebar.md": "- [Home](cover.html)\n- [Page](guide/page.md)",
			"/docs/cover.html": "<h1>Cover</h1>",
			"/docs/guide/page.md": "# Page",
		});
		window.location.hash = "#/guide/page.md";

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);

		await waitFor(
			() => element.querySelector("main h1")?.textContent === "Page",
		);

		element.querySelector<HTMLElement>('[data-action="home"]')?.click();

		await waitFor(() => window.location.hash === "#/cover.html");
		expect(window.location.hash).toBe("#/cover.html");
	});

	it("ignore le fallback index.html de Vite pour atteindre page-not-found.rst", async () => {
		mockViteFallbackFetch({
			"/docs/sidebar.md": "- [Missing](guide/missing.rst)",
			"/docs/cover.html": "<h1>Cover</h1>",
			"/docs/page-not-found.rst":
				"Page not found\n==============\n\nMissing ``{{ href }}``",
		});
		window.location.hash = "#/guide/missing.rst";

		const element = document.createElement("tp-markup-multi-pages");
		element.setAttribute("repository", "/docs");
		document.body.append(element);

		const readCurrentSource = (): string => {
			return (
				element as unknown as {
					currentSource: string;
				}
			).currentSource;
		};

		await waitFor(() =>
			readCurrentSource().includes("/docs/guide/missing.rst"),
		);

		const viewer = element.querySelector("main tp-restructuredtext");
		const source = readCurrentSource();

		expect(viewer).not.toBeNull();
		expect(source).toContain("Missing ``/docs/guide/missing.rst``");
		expect(source).not.toContain("<!doctype html>");
		expect(source).not.toContain(
			'<script type="module" src="/src/tp-loader.ts">',
		);
	});

	it("reflects its public configuration and applies it to the rendered shell", async () => {
		mockDocsFetch({
			"/guide/sidebar.md": "- [Home](cover.md)",
			"/guide/cover.md": "# Home",
		});
		const element = document.createElement(
			"tp-markup-multi-pages",
		) as TpMarkupMultiPages;
		element.repository = "/guide";
		element.label = "Guide";
		element.git = "https://example.test/repository";
		element.langs = "fr, ar";
		element.menu = true;
		element.theme = "dark";
		element.brand = "glaz";
		document.body.append(element);
		await waitFor(() => element.querySelector("main h1") !== null);

		expect(element.repository).toBe("/guide");
		expect(element.label).toBe("Guide");
		expect(element.git).toBe("https://example.test/repository");
		expect(element.langs).toBe("fr, ar");
		expect(element.menu).toBe(true);
		expect(element.theme).toBe("dark");
		expect(element.brand).toBe("glaz");
		expect(
			element.querySelector(".tp-markup-multi-pages-toolbar-label")
				?.textContent,
		).toBe("Guide");
		expect(element.querySelector("tp-lang")?.getAttribute("langs")).toBe(
			"fr, ar",
		);
		expect(
			element
				.querySelector(".tp-markup-multi-pages")
				?.hasAttribute("sidebar-open"),
		).toBe(true);
		expect(element.querySelector("main")?.getAttribute("lang")).toBe("fr");
		expect(element.querySelector("main")?.getAttribute("dir")).toBe("ltr");

		invoke<void>(element, "applyTheme");
		invoke<void>(element, "applyBrand");
		expect(
			element.querySelector<HTMLElement>(".tp-markup-multi-pages")?.dataset
				.theme,
		).toBe("dark");
		expect(
			element.style.getPropertyValue("--tp-markup-multi-pages-brand"),
		).toBe("glaz");

		element.label = "Updated";
		element.langs = "ar,fr";
		element.menu = false;
		expect(
			element.querySelector(".tp-markup-multi-pages-toolbar-label")
				?.textContent,
		).toBe("Updated");
		expect(element.querySelector("main")?.getAttribute("dir")).toBe("rtl");
		expect(
			element
				.querySelector(".tp-markup-multi-pages")
				?.hasAttribute("sidebar-open"),
		).toBe(false);
	});

	it("covers language, route and repository helpers", () => {
		const element = new TpMarkupMultiPages();
		element.repository = "/docs";

		expect(invoke(element, "detectLanguage", "/a.htm")).toBe("html");
		expect(invoke(element, "detectLanguage", "/a.asciidoc")).toBe("asciidoc");
		expect(invoke(element, "detectLanguage", "/a.rest")).toBe(
			"restructuredtext",
		);
		expect(invoke(element, "detectLanguage", "/a.unknown")).toBe("markdown");
		expect(invoke(element, "getViewerTagName", "asciidoc")).toBe("tp-asciidoc");
		expect(invoke(element, "getViewerTagName", "restructuredtext")).toBe(
			"tp-restructuredtext",
		);
		expect(invoke(element, "getViewerTagName", "markdown")).toBe("tp-markdown");
		expect(invoke(element, "getInlineScriptType", "asciidoc")).toBe(
			"tp/asciidoc",
		);
		expect(invoke(element, "getInlineScriptType", "restructuredtext")).toBe(
			"tp/restructuredtext",
		);
		expect(invoke(element, "getInlineScriptType", "markdown")).toBe(
			"tp/markdown",
		);

		for (const language of [
			"asciidoc",
			"restructuredtext",
			"html",
			"markdown",
		]) {
			expect(invoke(element, "getRenderedAttribute", language)).toContain(
				"rendered",
			);
			expect(invoke(element, "getRenderedEvent", language)).toContain(
				"rendered",
			);
			expect(invoke(element, "getOutputSelector", language)).toBeTruthy();
		}
		expect(invoke(element, "getSourceLanguage", "/a.rst")).toBe("plaintext");
		expect(invoke(element, "getSourceLanguage", "/a.adoc")).toBe("asciidoc");
		expect(invoke(element, "getSourceLanguage", "/a.html")).toBe("html");
		expect(invoke(element, "getSourceLanguage", "/a.md")).toBe("markdown");

		expect(invoke(element, "normalizeHref", "#/guide/")).toBe("guide");
		expect(invoke(element, "splitHrefFragment", "/page.md#part")).toEqual({
			href: "/page.md",
			fragment: "#part",
		});
		expect(invoke(element, "splitHrefFragment", "/page.md")).toEqual({
			href: "/page.md",
			fragment: "",
		});
		expect(invoke(element, "resolveDocumentHref", "/outside/page.md")).toBe(
			"/outside/page.md",
		);
		expect(invoke(element, "resolveDocumentHref", "/docs")).toBe("/docs/");
		expect(invoke(element, "resolveDocumentHref", "/docs/page.md")).toBe(
			"/docs/page.md",
		);
		expect(invoke(element, "stripRepository", "/docs")).toBe("");
		expect(invoke(element, "stripRepository", "/docs#part")).toBe("#part");
		expect(invoke(element, "stripRepository", "/outside.md#part")).toBe(
			"outside.md#part",
		);
		expect(
			invoke(
				element,
				"resolveRelativeHref",
				"../intro.md",
				"/docs/guide/page.md",
			),
		).toBe("/docs/intro.md");
		expect(
			invoke(element, "resolveRelativeHref", "#part", "/docs/page.md"),
		).toBe("#part");
		expect(invoke(element, "isRepositoryHref", "/docs/page.md")).toBe(true);
		expect(invoke(element, "isRepositoryHref", "/other/page.md")).toBe(false);
	});

	it("classifies links and HTML fallback responses", () => {
		const element = new TpMarkupMultiPages();
		element.repository = "/docs";
		const link = document.createElement("a");

		for (const href of [
			"",
			"#part",
			"https://example.test/a.md",
			"mailto:test@example.test",
		]) {
			expect(invoke(element, "shouldHandleDocumentHref", href)).toBe(false);
		}
		expect(invoke(element, "shouldHandleDocumentHref", "guide.md")).toBe(true);
		expect(invoke(element, "shouldHandleDocumentHref", "/docs/guide.md")).toBe(
			true,
		);
		expect(invoke(element, "shouldHandleDocumentHref", "/other/guide.md")).toBe(
			false,
		);

		link.href = "/docs/page.md";
		expect(
			invoke(element, "shouldHandleDocumentLink", link, "/docs/page.md"),
		).toBe(true);
		link.download = "page.md";
		expect(
			invoke(element, "shouldHandleDocumentLink", link, "/docs/page.md"),
		).toBe(false);
		link.removeAttribute("download");
		link.target = "_blank";
		expect(
			invoke(element, "shouldHandleDocumentLink", link, "/docs/page.md"),
		).toBe(false);
		link.target = "_self";
		expect(
			invoke(element, "shouldHandleDocumentLink", link, "/docs/page.md"),
		).toBe(true);

		const htmlResponse = new Response("", {
			headers: { "content-type": "text/html" },
		});
		const textResponse = new Response("", {
			headers: { "content-type": "text/plain" },
		});
		const shell =
			'<!doctype html><body><script type="module" src="/src/main.ts"></script></body>';
		expect(
			invoke(
				element,
				"isHtmlFallbackResponse",
				"/page.md",
				htmlResponse,
				shell,
			),
		).toBe(true);
		expect(
			invoke(
				element,
				"isHtmlFallbackResponse",
				"/page.md",
				textResponse,
				shell,
			),
		).toBe(false);
		expect(
			invoke(
				element,
				"isHtmlFallbackResponse",
				"/page.md",
				htmlResponse,
				"<p>fragment</p>",
			),
		).toBe(false);
		expect(
			invoke(
				element,
				"isHtmlFallbackResponse",
				"/page.bin",
				htmlResponse,
				shell,
			),
		).toBe(false);
		expect(
			invoke(
				element,
				"isHtmlFallbackResponse",
				"/page.html",
				htmlResponse,
				shell,
			),
		).toBe(true);
		expect(
			invoke(
				element,
				"isHtmlFallbackResponse",
				"/page.html",
				htmlResponse,
				"<html><p>document</p></html>",
			),
		).toBe(false);
		expect(
			invoke(
				element,
				"isLikelyApplicationShell",
				"<tp-markdown-multi-pages></tp-markdown-multi-pages>",
			),
		).toBe(true);
		expect(
			invoke(
				element,
				"isLikelyApplicationShell",
				'<script>import("/src/app.ts")</script>',
			),
		).toBe(true);
	});

	it("extracts, normalizes and rewrites accessible sidebar links", () => {
		const element = new TpMarkupMultiPages();
		element.repository = "/docs";
		const sidebar = document.createElement("aside");
		sidebar.className = "tp-markup-multi-pages-sidebar";
		sidebar.innerHTML =
			'<ul><li><a href="one.md"> One </a><ul><li><a href="two.md#part">Two</a></li></ul></li><li><a href="one.md">Duplicate</a></li><li><a href="#part">Fragment</a></li><li><a href="three.md">   </a></li></ul>';
		setInternal(element, "sidebarElement", sidebar);

		const links = invoke<Array<{ href: string; level: number; title: string }>>(
			element,
			"extractSidebarPageLinks",
			sidebar,
		);
		expect(links).toEqual([
			{ href: "/docs/one.md", level: 1, title: "One" },
			{ href: "/docs/two.md", level: 2, title: "Two" },
		]);
		const markdownLinks = invoke<
			Array<{ href: string; level: number; title: string }>
		>(
			element,
			"extractSidebarPageLinksFromMarkdown",
			"- [**One**](one.md)\n  - [<em>Two</em>](two.md#part)\n- [Duplicate](one.md)\n- [ ](empty.md)\n- [External](https://example.test)",
		);
		expect(markdownLinks).toEqual([
			{ href: "/docs/one.md", level: 1, title: "One" },
			{ href: "/docs/two.md", level: 2, title: "Two" },
		]);

		invoke<void>(element, "rewriteSidebarLinks", sidebar);
		expect(sidebar.querySelector("a")?.getAttribute("href")).toBe("#/one.md");
		element.append(sidebar);
		invoke<void>(element, "updateCurrentLink", "/docs/one.md");
		expect(sidebar.querySelector("a")?.getAttribute("aria-current")).toBe(
			"page",
		);
		invoke<void>(element, "updateCurrentLink", "/docs/two.md");
		expect(sidebar.querySelector("a")?.hasAttribute("aria-current")).toBe(
			false,
		);
	});

	it("builds tree controls and previous/top/next navigation", () => {
		const element = new TpMarkupMultiPages();
		element.repository = "/docs";
		const sidebar = document.createElement("aside");
		sidebar.innerHTML =
			"<p>Navigation</p><div><ul><li>One</li></ul><ol><li>Two</li></ol></div>";
		invoke<void>(element, "wrapSidebarListWithTree", sidebar);
		const tree = sidebar.querySelector("tp-tree") as HTMLElement & {
			expandAll(): void;
			collapseAll(): void;
			contextMenuConfig?: {
				getNodeActions(target: {
					hasChildren: boolean;
					expanded: boolean;
				}): unknown[];
			};
		};
		tree.expandAll = vi.fn();
		tree.collapseAll = vi.fn();
		sidebar
			.querySelector<HTMLElement>('[name="arrow-expand-vertical"]')
			?.click();
		sidebar
			.querySelector<HTMLElement>('[name="arrow-collapse-vertical"]')
			?.click();
		expect(tree.expandAll).toHaveBeenCalledOnce();
		expect(tree.collapseAll).toHaveBeenCalledOnce();
		expect(
			tree.contextMenuConfig?.getNodeActions({
				hasChildren: false,
				expanded: false,
			}),
		).toEqual([]);
		expect(
			tree.contextMenuConfig?.getNodeActions({
				hasChildren: true,
				expanded: false,
			}),
		).toHaveLength(2);

		setInternal(element, "pageLinks", [
			{ href: "/docs/one.md", level: 1, title: "One" },
			{ href: "/docs/two.md", level: 1, title: "Two" },
			{ href: "/docs/three.md", level: 1, title: "Three" },
		]);
		expect(
			invoke(element, "createPageNavigation", "/docs/missing.md"),
		).toBeNull();
		const navigation = invoke<HTMLElement>(
			element,
			"createPageNavigation",
			"/docs/two.md",
		);
		expect(
			navigation.querySelector('[data-direction="previous"]')?.textContent,
		).toContain("One");
		expect(
			navigation.querySelector('[data-direction="top"]')?.textContent,
		).toContain("Two");
		expect(
			navigation.querySelector('[data-direction="next"]')?.textContent,
		).toContain("Three");
		expect(
			invoke<HTMLElement>(
				element,
				"createPageNavigationLink",
				null,
				"next",
			).getAttribute("aria-hidden"),
		).toBe("true");
	});

	it("renders all source formats and default not-found variants", async () => {
		const element = new TpMarkupMultiPages();
		const markdown = await invoke<Promise<string>>(
			element,
			"renderSourceToHtml",
			"# Title",
			"/page.md",
		);
		const html = await invoke<Promise<string>>(
			element,
			"renderSourceToHtml",
			"<h1>Title</h1>",
			"/page.html",
		);
		expect(markdown).toContain("<h1");
		expect(html).toBe("<h1>Title</h1>");

		for (const [language, marker] of [
			["html", "<h1>"],
			["asciidoc", "= Page"],
			["restructuredtext", "Page not found"],
			["markdown", "# Page"],
		]) {
			Object.defineProperty(element, "fixedLanguage", {
				configurable: true,
				get: () => language,
			});
			expect(
				invoke<string>(element, "createDefaultNotFoundSource", "<missing>"),
			).toContain(marker);
			expect(
				invoke<string[]>(element, "getSpecialPageHrefs", "cover"),
			).toHaveLength(2);
		}
		Object.defineProperty(element, "fixedLanguage", {
			configurable: true,
			get: () => null,
		});
		expect(
			invoke<string[]>(element, "getSpecialPageHrefs", "cover"),
		).toHaveLength(6);
	});

	it("handles successful, missing and rejected fetches", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (href: string) => {
				if (href.includes("reject")) throw new Error("offline");
				if (href.includes("missing")) return new Response("", { status: 404 });
				return new Response("source", {
					status: 200,
					headers: { "content-type": "text/plain" },
				});
			}),
		);
		const element = new TpMarkupMultiPages();
		await expect(
			invoke<Promise<string | null>>(element, "fetchText", "/ok.md"),
		).resolves.toBe("source");
		await expect(
			invoke<Promise<string | null>>(element, "fetchText", "/missing.md"),
		).resolves.toBeNull();
		await expect(
			invoke<Promise<string | null>>(element, "fetchText", "/reject.md"),
		).resolves.toBeNull();
	});

	it("handles toolbar commands and disconnected cleanup", async () => {
		const element = new TpMarkupMultiPages();
		const goToCover = vi.fn(async () => {});
		const toggleSourceMode = vi.fn(async () => {});
		setInternal(element, "goToCover", goToCover);
		setInternal(element, "toggleSourceMode", toggleSourceMode);
		invoke<void>(element, "renderShell");

		element.querySelector<HTMLElement>('[data-action="home"]')?.click();
		element.querySelector<HTMLElement>('[data-action="menu"]')?.click();
		element.querySelector<HTMLElement>('[data-action="code"]')?.click();
		await flush();

		expect(goToCover).toHaveBeenCalledOnce();
		expect(toggleSourceMode).toHaveBeenCalledOnce();
		expect(element.menu).toBe(true);
		element.disconnectedCallback();
	});

	it("handles content links, fragments and modified clicks", () => {
		const element = new TpMarkupMultiPages();
		element.repository = "/docs";
		const content = document.createElement("main");
		const link = document.createElement("a");
		link.href = "page.md";
		link.innerHTML = "<span>Page</span>";
		content.append(link);
		setInternal(element, "contentElement", content);
		setInternal(element, "currentHref", "/docs/current.md");
		const goTo = vi.fn();
		const goToCurrentFragment = vi.fn();
		setInternal(element, "goTo", goTo);
		setInternal(element, "goToCurrentFragment", goToCurrentFragment);

		const click = (
			target: EventTarget,
			options: MouseEventInit = {},
		): MouseEvent => {
			const event = new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				...options,
			});
			Object.defineProperty(event, "target", { value: target });
			invoke<void>(element, "handleContentClick", event);
			return event;
		};

		expect(click(link.querySelector("span") as Element).defaultPrevented).toBe(
			true,
		);
		expect(goTo).toHaveBeenCalledWith("page.md", "/docs/current.md");
		for (const options of [
			{ button: 1 },
			{ metaKey: true },
			{ ctrlKey: true },
			{ shiftKey: true },
			{ altKey: true },
		])
			click(link, options);
		expect(goTo).toHaveBeenCalledOnce();
		click(document.createTextNode("text"));
		click(document.createElement("span"));

		link.setAttribute("href", "#section");
		expect(click(link).defaultPrevented).toBe(true);
		expect(goToCurrentFragment).toHaveBeenCalledWith("#section");
		link.setAttribute("href", "https://example.test");
		expect(click(link).defaultPrevented).toBe(false);
	});

	it("updates routes and fragments for empty, identical and new locations", async () => {
		const element = new TpMarkupMultiPages();
		element.repository = "/docs";
		expect(invoke(element, "readCurrentHref")).toBeNull();
		window.location.hash = "#/page.md";
		expect(invoke(element, "readCurrentHref")).toBe("page.md");

		const navigate = vi.fn(async () => {});
		const navigateToCover = vi.fn(async () => {});
		const scrollToFragment = vi.fn();
		setInternal(element, "navigate", navigate);
		setInternal(element, "navigateToCover", navigateToCover);
		setInternal(element, "scrollToFragment", scrollToFragment);
		invoke<void>(element, "handleHashChange");
		expect(navigate).toHaveBeenCalledWith("page.md");
		window.location.hash = "";
		invoke<void>(element, "handleHashChange");
		expect(navigateToCover).toHaveBeenCalledOnce();

		setInternal(element, "currentHref", "");
		invoke<void>(element, "goToCurrentFragment", "#part");
		setInternal(element, "currentHref", "/docs/page.md");
		window.location.hash = "#/page.md#part";
		invoke<void>(element, "goToCurrentFragment", "#part");
		expect(scrollToFragment).toHaveBeenCalledWith("#part");
		invoke<void>(element, "goToCurrentFragment", "#other");
		expect(window.location.hash).toBe("#/page.md#other");

		const coverElement = new TpMarkupMultiPages();
		coverElement.repository = "/docs";
		const coverNavigate = vi.fn(async () => {});
		setInternal(coverElement, "navigate", coverNavigate);
		setInternal(
			coverElement,
			"resolveSpecialPageHref",
			vi.fn(async () => null),
		);
		await invoke<Promise<void>>(coverElement, "navigateToCover");
		expect(coverNavigate).toHaveBeenCalledWith("/docs/cover.md");
		const goTo = vi.fn();
		setInternal(coverElement, "goTo", goTo);
		await invoke<Promise<void>>(coverElement, "goToCover");
		expect(goTo).toHaveBeenCalledWith("/docs/cover.md");
	});

	it("places navigation immediately, after rendering, or as a content fallback", () => {
		const element = new TpMarkupMultiPages();
		const content = document.createElement("main");
		setInternal(element, "contentElement", content);
		setInternal(element, "currentHref", "/docs/two.md");
		setInternal(element, "pageLinks", [
			{ href: "/docs/one.md", level: 1, title: "One" },
			{ href: "/docs/two.md", level: 1, title: "Two" },
		]);

		invoke<void>(element, "renderPageNavigation", "/docs/two.md");
		expect(content.querySelector("nav")).not.toBeNull();

		const viewer = document.createElement("tp-markdown");
		const output = document.createElement("div");
		output.className = "tp-markdown-output";
		viewer.append(output);
		content.replaceChildren(viewer);
		invoke<void>(element, "renderPageNavigation", "/docs/two.md");
		expect(output.querySelector("nav")).toBeNull();
		viewer.dispatchEvent(new CustomEvent("tp-markdown-rendered"));
		expect(output.querySelector("nav")).not.toBeNull();

		viewer.setAttribute("data-tp-markdown-rendered", "");
		invoke<void>(element, "renderPageNavigation", "/docs/two.md");
		expect(output.querySelector("nav")).not.toBeNull();
		invoke<void>(
			element,
			"appendPageNavigationToMultiPages",
			viewer,
			document.createElement("nav"),
			"html",
		);
		expect(viewer.lastElementChild?.tagName).toBe("NAV");
	});

	it("scrolls to encoded fragments before and after renderer completion", () => {
		const element = new TpMarkupMultiPages();
		const content = document.createElement("main");
		const target = document.createElement("h2");
		target.id = "a:b";
		target.scrollIntoView = vi.fn();
		content.append(target);
		setInternal(element, "contentElement", content);
		setInternal(element, "currentHref", "/docs/page.md");

		invoke<void>(element, "scrollToFragment", "");
		invoke<void>(element, "scrollToFragment", "#a%3Ab");
		expect(target.scrollIntoView).toHaveBeenCalledOnce();
		expect(invoke<string>(element, "escapeCssIdentifier", "a:b")).toContain(
			"\\:",
		);

		const viewer = document.createElement("tp-markdown");
		content.replaceChildren(viewer);
		const scroll = vi.fn();
		setInternal(element, "scrollToFragment", scroll);
		invoke<void>(element, "scrollToFragmentAfterRender", "");
		invoke<void>(element, "scrollToFragmentAfterRender", "#later");
		viewer.dispatchEvent(new CustomEvent("tp-markdown-rendered"));
		expect(scroll).toHaveBeenCalledWith("#later");
		viewer.setAttribute("data-tp-markdown-rendered", "");
		invoke<void>(element, "scrollToFragmentAfterRender", "#now");
		expect(scroll).toHaveBeenCalledWith("#now");
	});

	it("updates page-level SEO metadata for every markup language", () => {
		const element = new TpMarkupMultiPages();
		element.label = "tp-components";

		invoke<void>(
			element,
			"updateDocumentMetadata",
			"/docs/guide.md",
			"# Markdown title\n\nA concise Markdown description.",
		);
		expect(document.title).toBe("Markdown title · tp-components");
		expect(
			document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
				?.content,
		).toBe("A concise Markdown description.");

		expect(
			invoke<string>(
				element,
				"extractDocumentTitle",
				"/docs/guide.adoc",
				"= AsciiDoc title\n\nText.",
			),
		).toBe("AsciiDoc title");
		expect(
			invoke<string>(
				element,
				"extractDocumentTitle",
				"/docs/guide.rst",
				"reStructuredText title\n======================\n\nText.",
			),
		).toBe("reStructuredText title");
		expect(
			invoke<string>(
				element,
				"extractDocumentTitle",
				"/docs/guide.html",
				"<title>Fallback</title><h1>HTML title</h1>",
			),
		).toBe("HTML title");
		expect(
			invoke<string>(
				element,
				"extractDocumentTitle",
				"/docs/components/code-editor/index.md",
				'# <tp-icon name="code-editor" library="components" size="1.25em"></tp-icon> Code editor',
			),
		).toBe("Code editor");

		invoke<void>(
			element,
			"updateDocumentMetadata",
			"/docs/missing.md",
			"# Page not found",
		);
		expect(
			invoke<string>(
				element,
				"extractDocumentDescription",
				" ".repeat(170),
				"Fallback",
			).length,
		).toBeLessThanOrEqual(160);

		const nested = new TpMarkupMultiPages();
		document.body.append(element);
		element.append(nested);
		invoke<void>(
			nested,
			"updateDocumentMetadata",
			"/missing.md",
			"# Nested error",
		);
		expect(document.title).toBe("Page not found · tp-components");
	});
});
