import { afterEach, describe, expect, it, vi } from "vitest";
import {
	dedentAsciidocSource,
	parseAsciidocToAst,
	renderAsciidocInto,
	renderAsciidocRuntimeIn,
	renderAsciidocToHtml,
	type TpAsciidoc,
} from "./asciidoc.js";

async function rendered(element: Element): Promise<void> {
	await vi.waitFor(() =>
		expect(element.hasAttribute("data-tp-asciidoc-rendered")).toBe(true),
	);
}

afterEach(() => {
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

describe("<tp-asciidoc>", () => {
	it("dedents wrappers, renders semantic HTML and serializes its AST", async () => {
		expect(
			dedentAsciidocSource(
				"\n  &lt;pre&gt;&lt;code&gt;Title\n  =====\n  &lt;/code&gt;&lt;/pre&gt;",
			),
		).toContain("Title");
		expect(await renderAsciidocToHtml("Hello, *world*!")).toContain(
			"<strong>world</strong>",
		);
		expect((await parseAsciidocToAst("* First")).blocks?.[0]?.context).toBe(
			"ulist",
		);
		const root = document.createElement("div");
		await renderAsciidocInto("A paragraph.", root);
		expect(root.querySelector("p")?.textContent).toBe("A paragraph.");
	});

	it("renders script and code sources and supports src changes", async () => {
		const element = document.createElement("tp-asciidoc") as TpAsciidoc;
		element.innerHTML =
			'<script type="tp/asciidoc">= Title\n:showtitle:</script>';
		document.body.append(element);
		await rendered(element);
		expect(element.querySelector("h1")?.textContent).toBe("Title");
		const fetchMock = vi.fn(async () => new Response("= Remote\n:showtitle:"));
		vi.stubGlobal("fetch", fetchMock);
		element.src = "/remote.adoc";
		await rendered(element);
		await vi.waitFor(() =>
			expect(element.querySelector("h1")?.textContent).toBe("Remote"),
		);
		element.src = "";
		expect(element.hasAttribute("src")).toBe(false);
	});

	it("renders escaped loading errors", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("", { status: 404 })),
		);
		const element = document.createElement("tp-asciidoc") as TpAsciidoc;
		element.src = "/missing.adoc";
		document.body.append(element);
		await rendered(element);
		expect(element.querySelector('[role="alert"]')?.textContent).toContain(
			"404",
		);
	});

	it("covers indentation, code fallback and browser runtime assets", async () => {
		expect(dedentAsciidocSource("\n    First\n      Second\n")).toBe(
			"First\n  Second",
		);
		const element = document.createElement("tp-asciidoc");
		element.innerHTML = "<pre><code>Paragraph from code.</code></pre>";
		document.body.append(element);
		await rendered(element);
		expect(element.querySelector("p")?.textContent).toBe(
			"Paragraph from code.",
		);
		await renderAsciidocRuntimeIn(element);
		const root = document.createElement("div");
		root.innerHTML =
			'<script data-tp-asciidoc-asset="mathjax" src="/mathjax.js"></script>';
		const highlightAll = vi.fn();
		const typesetPromise = vi.fn(async () => {});
		vi.stubGlobal("hljs", { highlightAll });
		vi.stubGlobal("MathJax", {
			startup: { promise: Promise.resolve() },
			typesetPromise,
		});
		await renderAsciidocInto("A paragraph.", root);
		expect(root.textContent).toContain("A paragraph.");
	});

	it("forwards styles and initializes syntax and MathJax assets", async () => {
		const html = await renderAsciidocToHtml(
			'[tp-asciidoc-viewer,style="--tp-markup-viewer-frame-min-height: 32rem"]\n====\nStyled\n====',
		);
		expect(html).toContain(
			'<tp-asciidoc-viewer style="--tp-markup-viewer-frame-min-height: 32rem">',
		);
		const highlightAll = vi.fn();
		const typesetPromise = vi.fn(async () => {});
		vi.stubGlobal("hljs", { highlightAll });
		vi.stubGlobal("MathJax", {
			startup: { promise: Promise.resolve() },
			typesetPromise,
		});
		const root = document.createElement("div");
		await renderAsciidocInto(
			":stem: latexmath\n\n[source,javascript]\n----\nconst x = 1;\n----\n\nstem:[x^2]",
			root,
		);
		for (const script of root.querySelectorAll<HTMLScriptElement>(
			"script[data-tp-asciidoc-asset]",
		))
			script.dispatchEvent(new Event("load"));
		expect(highlightAll).toHaveBeenCalled();
		await vi.waitFor(() => expect(typesetPromise).toHaveBeenCalledWith([root]));
		expect(root.querySelector('script[src*="mathjax@4"]')).toBeNull();
	});

	it("uses direct inline HTML and preserves optional AST metadata", async () => {
		const element = document.createElement("tp-asciidoc");
		element.innerHTML = "Direct *content*.";
		document.body.append(element);
		await rendered(element);
		expect(element.querySelector("strong")?.textContent).toBe("content");
		const ast = await parseAsciidocToAst(
			"= Document\n:showtitle:\n\n== Section\n\n[source,ruby]\n----\nputs 1\n----",
		);
		expect(ast.title).toBe("Document");
		expect(ast.blocks?.some((node) => node.context === "section")).toBe(true);
	});
});
