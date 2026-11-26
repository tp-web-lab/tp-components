import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	applyIncludePrefix,
	renderInclude,
	resolveMarkdownIncludes,
} from "../../utilities/markdown-includes.js";
import {
	parseMarkdownToTokens,
	renderMarkdownInto,
	renderMarkdownRuntimeIn,
	renderMarkdownToHtml,
	type TpMarkdown,
} from "./markdown.js";

afterEach(() => {
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

describe("<tp-markdown>", () => {
	it("resolves inline source against the document base in preview frames", async () => {
		const element = document.createElement("tp-markdown") as TpMarkdown;
		const previewDocument = document.implementation.createHTMLDocument();
		const base = previewDocument.createElement("base");
		base.href = "https://example.test/docs/";
		previewDocument.head.append(base);
		previewDocument.adoptNode(element);
		const api = element as unknown as {
			getMarkdownSource(): Promise<{ currentUrl: URL }>;
		};
		expect((await api.getMarkdownSource()).currentUrl.href).toBe(base.href);
	});
	it("renders raw-text blocks, fenced examples and tokens", async () => {
		const html = await renderMarkdownToHtml(
			"<tp-box>\n<script>const x = 1;</script>\n</tp-box>\n\n```html\n<style>x{}</style>\n```",
		);
		expect(html).toContain("<script>const x = 1;</script>");
		expect(html).toContain("&lt;style&gt;");
		expect(await parseMarkdownToTokens("# Title")).toBeTruthy();
		const root = document.createElement("div");
		await renderMarkdownInto("**bold**", root);
		expect(root.querySelector("strong")?.textContent).toBe("bold");
	});

	it("preserves inline-parent TikZ source in the introductory documentation", async () => {
		const page = readFileSync("public/docs/components/tikz/index.md", "utf8");
		const introduction = readFileSync(
			"public/docs/components/tikz/examples/introduction.html",
			"utf8",
		);
		const expected = document.createElement("template");
		expected.innerHTML = introduction;
		const rendered = document.createElement("template");
		rendered.innerHTML = await renderMarkdownToHtml(page);
		expect(rendered.content.querySelector("tp-tikz script")?.textContent).toBe(
			expected.content.querySelector("tp-tikz script")?.textContent,
		);
		expect(
			rendered.content.querySelector("tp-tikz script")?.textContent,
		).toContain(String.raw`\end{tikzpicture}`);
		const fenced = await renderMarkdownToHtml(
			`\x60\x60\x60html\n${introduction}\n\x60\x60\x60`,
		);
		expect(fenced).toContain("&lt;tp-tikz");
	});

	it("renders inline, external and recursively included sources", async () => {
		const responses = new Map([
			["http://localhost:3000/root.md", "# Remote\n::include{child.md}"],
			["http://localhost:3000/child.md", "Child"],
		]);
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async (url: string | URL | Request) =>
					new Response(responses.get(String(url)) ?? "", {
						status: responses.has(String(url)) ? 200 : 404,
					}),
			),
		);
		const element = document.createElement("tp-markdown") as TpMarkdown;
		element.innerHTML = '<script type="tp/markdown"># Inline</script>';
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.hasAttribute("data-tp-markdown-rendered")).toBe(true),
		);
		expect(element.querySelector("h1")?.textContent).toBe("Inline");
		element.src = "/root.md";
		await vi.waitFor(() => expect(element.textContent).toContain("Child"));
		expect(element.querySelector("h1")?.textContent).toBe("Remote");
		element.src = "";
		expect(element.hasAttribute("src")).toBe(false);
	});

	it("converts markup includes and retains raw and SVG inclusion modes", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async (url: string | URL | Request) =>
					new Response(
						String(url).endsWith(".txt")
							? "<raw>"
							: String(url).endsWith(".adoc")
								? "*Converted*"
								: String(url).endsWith(".html")
									? "<p><em>HTML</em></p>"
									: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
					),
			),
		);
		const element = document.createElement("tp-markdown");
		element.innerHTML = `<script type="tp/markdown">::include{page.adoc}\n::include{page.html}\n::include{icon.svg}\n::include{file.txt mode=raw}</script>`;
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.hasAttribute("data-tp-markdown-rendered")).toBe(true),
		);
		expect(element.querySelector("strong")?.textContent).toBe("Converted");
		expect(element.querySelector("em")?.textContent).toBe("HTML");
		expect(element.querySelector("svg")).not.toBeNull();
		expect(element.querySelector("raw")).not.toBeNull();
	});
	it("reports failed converted includes", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("", { status: 404 })),
		);
		const element = document.createElement("tp-markdown");
		element.innerHTML =
			'<script type="tp/markdown">::include{missing.md}</script>';
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.querySelector('[role="alert"]')?.textContent).toContain(
				"404",
			),
		);
	});

	it("preserves several raw blocks and applies include prefixes", async () => {
		const html = await renderMarkdownToHtml(
			"<script>one</script>\n<style>two</style>",
		);
		expect(html).toContain("<script>one</script>");
		expect(html).toContain("<style>two</style>");
		const root = document.createElement("div");
		await renderMarkdownRuntimeIn(root);
		expect(applyIncludePrefix("one\ntwo", "  ")).toBe("  one\n  two");
		expect(applyIncludePrefix("one\ntwo", "  : ")).toBe("  : one\n    two");
		expect(applyIncludePrefix("::: tp-card\ncontent\n:::", ": ")).toContain(
			":\n",
		);
		await expect(
			resolveMarkdownIncludes("text", new URL("http://localhost/root.md"), 13),
		).rejects.toThrow("depth exceeded");
	});

	it("covers external failures, code fallback and every automatic include output", async () => {
		const requests = vi.fn(async (url: string | URL | Request) => {
			const path = new URL(String(url)).pathname;
			if (path.includes("missing")) return new Response("", { status: 500 });
			if (path.endsWith(".md")) return new Response("Nested");
			if (path.endsWith(".svg"))
				return new Response("<svg><title>Icon</title></svg>");
			return new Response("<unsafe>");
		});
		vi.stubGlobal("fetch", requests);
		const element = document.createElement("tp-markdown") as TpMarkdown;
		element.innerHTML = "<pre><code># From code</code></pre>";
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.hasAttribute("data-tp-markdown-rendered")).toBe(true),
		);
		expect(element.querySelector("h1")?.textContent).toBe("From code");
		element.src = "/missing-root.md";
		await vi.waitFor(() =>
			expect(element.querySelector('[role="alert"]')?.textContent).toContain(
				"500",
			),
		);
		const base = new URL("http://localhost/docs/root.md");
		expect(await renderInclude("missing.txt", base, 0, "raw")).toContain(
			"Unable to include",
		);
		expect(await renderInclude("file.txt", base, 0, "auto")).toContain(
			"&lt;unsafe&gt;",
		);
		expect(await renderInclude("icon.svg", base, 0, "auto")).toContain("<svg>");
		expect(await renderInclude("nested.md", base, 0, "auto")).toBe("Nested");
	});
});
