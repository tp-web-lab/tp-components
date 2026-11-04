import { afterEach, expect, it, vi } from "vitest";
import { updateDocumentNavbar } from "./document-navbar.js";
import "./toolbar.js";
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
	window.history.replaceState(null, "", "/");
	vi.unstubAllGlobals();
});

const formats = [
	["markup", "md", "- [Playlist](playlist.md)"],
	["markdown", "md", "1. [Playlist](playlist.md)"],
	["html", "html", '<ol><li><a href="playlist.html">Playlist</a></li></ol>'],
	["asciidoc", "adoc", "* link:playlist.adoc[Playlist]"],
	["restructuredtext", "rst", "* `Playlist <playlist.rst>`_"],
];

it.each(
	formats.flatMap(([format, extension, source]) => [
		[format, extension, source, "single-page"],
		[format, extension, source, "multi-pages"],
	]),
)(
	"loads %s navbar.%s in a %s %s shell",
	async (format, extension, source, kind) => {
		if (format === "restructuredtext") {
			const globals = new Map<string, unknown>();
			vi.stubGlobal(
				"loadPyodide",
				vi.fn(async () => ({
					globals: {
						set: (key: string, value: unknown) => globals.set(key, value),
						get: (key: string) => globals.get(key),
						delete: (key: string) => globals.delete(key),
					},
					loadPackage: vi.fn(async () => undefined),
					runPythonAsync: vi.fn(async () =>
						globals.set(
							"tp_rst_result",
							JSON.stringify({
								html: '<ul><li><a href="playlist.rst">Playlist</a></li></ul>',
								ast: { type: "document" },
							}),
						),
					),
				})),
			);
		}

		vi.stubGlobal(
			"fetch",
			vi.fn(
				async (input: string) =>
					new Response(
						String(input).endsWith(`/navbar.${extension}`) ? source : "",
						{
							status: String(input).endsWith(`/navbar.${extension}`)
								? 200
								: 404,
						},
					),
			),
		);
		const host = document.createElement(`tp-${format}-${kind}`);
		host.setAttribute("toolbar", "theme");
		if (kind === "single-page")
			host.setAttribute("src", `/guide/index.${extension}`);
		else host.setAttribute("repository", "/guide");
		document.body.append(host);
		await vi.waitFor(() =>
			expect(host.querySelector("[data-document-navbar] a")?.textContent).toBe(
				"Playlist",
			),
		);
		const menu = host.querySelector("[data-document-navbar]");
		expect(menu?.tagName).toBe("TP-BUTTON");
		expect(host.querySelector("tp-toolbar tp-menu")).toBeNull();
		expect(
			menu?.parentElement?.getAttribute("data-toolbar-end"),
		).not.toBeNull();
		expect(menu?.parentElement?.firstElementChild).toBe(menu);
		const divider = menu?.nextElementSibling;
		expect(divider?.tagName).toBe("TP-DIVIDER");
		expect(divider?.getAttribute("orientation")).toBe("vertical");
		expect(divider?.getAttribute("role")).toBe("separator");
		const link = menu?.querySelector("a");
		expect(link?.getAttribute("href")).toBe(
			kind === "multi-pages"
				? `#/playlist.${extension}`
				: new URL(`/guide/playlist.${extension}`, document.baseURI).href,
		);
		if (kind === "multi-pages") {
			link?.click();
			expect(window.location.hash).toBe(`#/playlist.${extension}`);
			expect(host.querySelector("[data-document-navbar]")).toBe(menu);
		}
	},
);

it("ignores a stale response and removes a menu when the next source has no list", async () => {
	const toolbar = document.createElement("tp-toolbar");
	document.body.append(toolbar);
	let finish: (response: Response) => void = () => {};
	vi.stubGlobal(
		"fetch",
		vi.fn((input: string) =>
			String(input).endsWith("old.html")
				? new Promise<Response>((resolve) => {
						finish = resolve;
					})
				: Promise.resolve(
						new Response('<ul><li><a href="new.html">New</a></li></ul>'),
					),
		),
	);
	const stale = updateDocumentNavbar(toolbar, ["/old.html"]);
	await updateDocumentNavbar(toolbar, ["/new.html"]);
	finish(new Response("<ul><li>Old</li></ul>"));
	await stale;
	expect(toolbar.querySelectorAll("[data-document-navbar]")).toHaveLength(1);
	expect(toolbar.querySelector("[data-document-navbar]")?.textContent).toBe(
		"New",
	);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response("<p>No list</p>")),
	);
	await updateDocumentNavbar(toolbar, ["/empty.html"]);
	expect(toolbar.querySelector("[data-document-navbar]")).toBeNull();
	expect(toolbar.querySelector("[data-document-navbar-divider]")).toBeNull();
});

it.each(["markup", "markdown"])(
	"routes icon-button navbar links in %s pages",
	async (format) => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async (input: string) =>
					new Response(
						String(input).endsWith("/navbar.md")
							? '- <tp-icon-button name="home" label="Playlist" href="playlist/playlist.md"></tp-icon-button>'
							: "",
						{ status: String(input).endsWith("/navbar.md") ? 200 : 404 },
					),
			),
		);
		const host = document.createElement(`tp-${format}-multi-pages`);
		host.setAttribute("repository", "/jazz/docs");
		document.body.append(host);
		await vi.waitFor(() =>
			expect(
				host
					.querySelector("tp-icon-button[data-document-navbar] a")
					?.getAttribute("href"),
			).toBe("#/playlist/playlist.md"),
		);
		const control = host.querySelector<HTMLElement>(
			"tp-icon-button[data-document-navbar]",
		);
		control?.setAttribute("label", "Updated label");
		expect(control?.querySelector("a")?.getAttribute("href")).toBe(
			"#/playlist/playlist.md",
		);
		control?.querySelector("a")?.click();
		expect(window.location.hash).toBe("#/playlist/playlist.md");
	},
);
