import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { required } from "../test-helpers/required.js";
import { openViewerSource } from "../test-helpers/viewer-source.js";

import {
	dedentAsciidocSource,
	parseAsciidocToAst,
	renderAsciidocToHtml,
} from "./asciidoc/asciidoc.js";
import "./asciidoc/asciidoc.js";
import "./asciidoc-viewer/asciidoc-viewer.js";
import type { TpCodeEditor } from "./code-editor/code-editor.js";
import { renderMarkdownToHtml } from "./markdown/markdown.js";

beforeEach(() => {
	// Layout measurements are covered in browsers, not jsdom.
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
});
afterEach(() => {
	vi.unstubAllGlobals();
	document.body.innerHTML = "";
});

async function flush(): Promise<void> {
	await Promise.resolve();
	await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
}

describe("AsciiDoc components", () => {
	it("labels replacement MathJax SVGs and stops observing when detached", async () => {
		const element = document.createElement("tp-asciidoc");
		element.textContent = "A formula";
		document.body.append(element);
		await flush();
		const output = required(element.querySelector(".tp-asciidoc-output"));
		const formula =
			'<mjx-container><svg role="img"><g data-mml-node="math" data-latex="x^2"></g></svg></mjx-container>';
		output.insertAdjacentHTML("beforeend", formula);
		await flush();
		expect(output.querySelector("svg")?.getAttribute("aria-label")).toBe("x^2");
		element.remove();
		output.innerHTML = formula;
		await flush();
		expect(output.querySelector("svg")?.hasAttribute("aria-label")).toBe(false);
	});
	it("forwards an HTML style attribute declared on a block component", async () => {
		const html =
			await renderAsciidocToHtml(`[tp-asciidoc-viewer,style="--tp-markup-viewer-frame-min-height: 32rem"]
====
Example
====`);

		expect(html).toContain(
			'<tp-asciidoc-viewer style="--tp-markup-viewer-frame-min-height: 32rem">',
		);
	});

	it("includes raw source for list items in the AsciiDoc AST", async () => {
		const ast = await parseAsciidocToAst(`* First *item*
* Second item`);
		const list = ast.blocks?.find((node) => node.context === "ulist");

		expect(list?.blocks?.map((item) => item.context)).toEqual([
			"list_item",
			"list_item",
		]);
		expect(list?.blocks?.map((item) => item.source)).toEqual([
			"First *item*",
			"Second item",
		]);
	});

	it("removes escaped Markdown code wrappers from embedded AsciiDoc", () => {
		const source = `
      = Wrapped document
      :showtitle:
&lt;pre&gt;&lt;code&gt;First paragraph.

      == Section

      Last paragraph.
&lt;/code&gt;&lt;/pre&gt;
    `;

		expect(dedentAsciidocSource(source)).toBe(`= Wrapped document
:showtitle:

First paragraph.

== Section

Last paragraph.`);
	});

	it("dedents tp-asciidoc script source when list items are already at column zero", async () => {
		const element = document.createElement("tp-asciidoc");
		element.innerHTML = `
      <script type="tp/asciidoc">
        = A semantic document
        :showtitle:

        Hello, *Asciidoctor*!

- Semantic HTML
- AsciiDoc lists

        == Features

        [NOTE]
        ====
        Semantic output.
        ====
      </script>
    `;
		document.body.append(element);
		await flush();

		expect(element.querySelector("h1")?.textContent).toBe(
			"A semantic document",
		);
		expect(element.querySelector("p")?.innerHTML).toBe(
			"Hello, <strong>Asciidoctor</strong>!",
		);
		expect(element.querySelectorAll("li")).toHaveLength(2);
		expect(element.querySelector("h2")?.textContent).toBe("Features");
		expect(element.querySelector("pre")).toBeNull();
	});

	it("resolves browser includes from the containing documentation source", async () => {
		const fetchMock = vi.fn(async (input: string | URL | Request) => {
			expect(String(input)).toBe(
				"http://localhost:3000/docs/components/asciidoc/examples/advanced-example.adoc",
			);
			return new Response("Content loaded from the included file.");
		});
		vi.stubGlobal("fetch", fetchMock);

		const documentation = document.createElement("div");
		documentation.setAttribute(
			"data-tp-markdown-source",
			"/docs/components/asciidoc/index.md",
		);
		const host = document.createElement("div");
		host.setAttribute("data-tp-source", "examples/examples.md");
		host.innerHTML = `<tp-asciidoc>
      <script type="tp/asciidoc">include::advanced-example.adoc[]</script>
    </tp-asciidoc>`;
		documentation.append(host);
		document.body.append(documentation);
		await flush();

		expect(fetchMock).toHaveBeenCalledOnce();
		expect(host.querySelector("tp-asciidoc p")?.textContent).toBe(
			"Content loaded from the included file.",
		);
	});

	it("renders tp-asciidoc-viewer controls and titled examples", async () => {
		const element = document.createElement("tp-asciidoc-viewer");
		element.innerHTML = `<script type="tp/asciidoc">
      .First
      ====
      First example
      ====

      .Second
      ====
      Second example
      ====
    </script>`;
		document.body.append(element);
		await openViewerSource(element);
		await flush();

		expect(element.querySelector('[data-role="layout"]')).toBeNull();
		expect(element.querySelector('[data-role="mode"]')).toBeNull();
		expect(element.querySelector('[data-role="toggle-source"]')).not.toBeNull();
		expect(element.querySelector('[data-role="toggle-output"]')).not.toBeNull();
		expect(
			element.querySelector('[data-role="output-mode"][data-mode="ast"]'),
		).not.toBeNull();
		expect(
			element.querySelector("tp-switcher.tp-asciidoc-viewer-layout"),
		).not.toBeNull();
		expect(
			element
				.querySelector('[data-role="source"] tp-code-editor')
				?.hasAttribute("line-numbers"),
		).toBe(false);
		const values = Array.from(element.querySelectorAll("select")).flatMap(
			(select) => Array.from(select.options, (option) => option.value),
		);
		expect(values).toContain("First");
		expect(values).toContain("Second");
	});

	it("preserves nested component markup as the source of tp-asciidoc-viewer", async () => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		const source = `[tp-asciidoc-viewer%allow-script, label="tp-accordion"]
======
[script,type="tp/asciidoc"]
----
[tp-accordion,open-indexes="0"]
====
What is HTML?:: The language used to structure web pages.

What is CSS?:: The language used to style web pages.
====
----
======`;
		const host = document.createElement("div");
		host.innerHTML = await renderAsciidocToHtml(source);
		document.body.append(host);
		await openViewerSource(host);
		await flush();

		const viewer = host.querySelector("tp-asciidoc-viewer");
		const editor = viewer?.querySelector<TpCodeEditor>(
			'[data-role="source"] tp-code-editor',
		);
		expect(editor?.getValue()).toContain('[tp-accordion,open-indexes="0"]');
		expect(editor?.getValue()).not.toContain("<tp-accordion");
		const frame = viewer?.querySelector<HTMLIFrameElement>(
			'[data-role="output"] iframe',
		);
		expect(frame?.srcdoc).toContain('<tp-accordion open-indexes="0">');
	});

	it("renders an empty tp-asciidoc-viewer without invoking MathJax", async () => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		const queue = vi.fn(() => {
			throw new Error(
				"undefined is not an object (evaluating 'this.queue.Push')",
			);
		});
		vi.stubGlobal("MathJax", {
			startup: { promise: Promise.resolve() },
			typesetPromise: queue,
		});

		const element = document.createElement("tp-asciidoc-viewer");
		document.body.append(element);
		await openViewerSource(element);
		await flush();

		expect(
			element.querySelector('[data-role="source"] tp-code-editor'),
		).not.toBeNull();
		expect(element.querySelector('[data-role="output"]')?.textContent).toBe("");
		expect(element.textContent).not.toContain("undefined is not an object");
		expect(queue).not.toHaveBeenCalled();
	});

	it("runs the AsciiDoc renderer inside the viewer iframe", async () => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		const queue = vi.fn();
		vi.stubGlobal("MathJax", {
			startup: { promise: Promise.resolve() },
			typesetPromise: queue,
		});
		const element = document.createElement("tp-asciidoc-viewer");
		element.innerHTML = `<script type="tp/asciidoc">
      An equation: stem:[x^2].
    </script>`;
		document.body.append(element);
		await flush();

		const frame = element.querySelector<HTMLIFrameElement>(
			".tp-asciidoc-output iframe",
		);
		expect(frame?.srcdoc).toContain("<tp-asciidoc>");
		expect(frame?.srcdoc).toContain("stem:[x^2]");
		expect(frame?.srcdoc).toContain("tp-loader");
		expect(queue).not.toHaveBeenCalled();
	});

	it("renders the AsciiDoc AST with tp-object-tree", async () => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		const element = document.createElement("tp-asciidoc-viewer");
		element.innerHTML = `<script type="tp/asciidoc">
      A paragraph with *strong text*.
    </script>`;
		document.body.append(element);
		await openViewerSource(element);
		await flush();

		const mode = element.querySelector<HTMLElement>(
			'[data-role="output-mode"][data-mode="ast"]',
		);
		expect(mode).not.toBeNull();
		mode?.click();
		await flush();

		const output = element.querySelector('[data-role="output"]');
		expect(output?.querySelector("tp-object-tree")).not.toBeNull();
		expect(output?.querySelector("tp-code-editor")).toBeNull();
		expect(output?.textContent).toContain("paragraph");
	});

	it("preserves edited source when switching output modes", async () => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		const element = document.createElement("tp-asciidoc-viewer");
		element.innerHTML = `<script type="tp/asciidoc">
      Initial source.
    </script>`;
		document.body.append(element);
		await openViewerSource(element);
		await flush();

		const editor = element.querySelector<TpCodeEditor>(
			'[data-role="source"] tp-code-editor',
		);
		const mode = element.querySelector<HTMLElement>(
			'[data-role="output-mode"][data-mode="ast"]',
		);
		const run = element.querySelector<HTMLElement>('[data-role="run"]');
		expect(editor).not.toBeNull();
		expect(mode).not.toBeNull();
		expect(run).not.toBeNull();
		if (editor === null || mode === null || run === null) return;

		editor.setValue("Edited *source*.");
		run.click();
		await flush();

		mode.click();
		await flush();
		expect(element.querySelector('[data-role="source"] tp-code-editor')).toBe(
			editor,
		);
		expect(editor.getValue()).toBe("Edited *source*.");
		expect(
			element.querySelector('[data-role="output"] tp-object-tree')?.textContent,
		).toContain("Edited");
	});

	it("dedents an embedded tp-asciidoc example after Markdown rendering", async () => {
		const markdown = `<tp-asciidoc>
  <script type="tp/asciidoc">
    = A semantic document
    :showtitle:

    Hello, *Asciidoctor*!

    == Features

    * Semantic HTML
    * AsciiDoc tables and lists
    * Source highlighting and mathematical notation

    [NOTE]
    ====
    The generated paragraph is a direct \`<p>\` element.
    ====
  </script>
</tp-asciidoc>`;
		const container = document.createElement("div");
		container.innerHTML = await renderMarkdownToHtml(markdown);
		document.body.append(container);
		await flush();

		const element = container.querySelector("tp-asciidoc");
		expect(element?.querySelector("h1")?.textContent).toBe(
			"A semantic document",
		);
		expect(element?.querySelectorAll("li")).toHaveLength(3);
		expect(element?.querySelector("pre")).toBeNull();
	});

	it("does not render escaped Markdown code wrapper endings", async () => {
		const element = document.createElement("tp-asciidoc");
		element.innerHTML = `<script type="tp/asciidoc">
      = A semantic document
      :showtitle:
&lt;pre&gt;&lt;code&gt;Hello, *Asciidoctor*!

      == Features

      * Semantic HTML
&lt;/code&gt;&lt;/pre&gt;
    </script>`;
		document.body.append(element);
		await flush();

		expect(element.querySelector("p")?.innerHTML).toBe(
			"Hello, <strong>Asciidoctor</strong>!",
		);
		expect(element.textContent).not.toContain("</code></pre>");
		expect(element.textContent).not.toContain("&lt;/code&gt;&lt;/pre&gt;");
	});

	it("activates highlighting and mathematics assets in the component document", async () => {
		const highlightAll = vi.fn();
		const queue = vi.fn();
		vi.stubGlobal("hljs", { highlightAll });
		vi.stubGlobal("MathJax", {
			startup: { promise: Promise.resolve() },
			typesetPromise: queue,
		});

		const element = document.createElement("tp-asciidoc");
		element.innerHTML = `<script type="tp/asciidoc">
      [source, typescript]
      ----
      const answer: number = 42;
      ----

      An equation: stem:[x^2].
    </script>`;
		document.body.append(element);
		await flush();

		expect(element.querySelector("code.language-typescript")).not.toBeNull();
		expect(
			element.querySelector('[data-tp-asciidoc-asset="highlight.js"]'),
		).not.toBeNull();
		expect(
			element.querySelector('[data-tp-asciidoc-asset="mathjax"]'),
		).not.toBeNull();
		expect(
			document.getElementById("tp-asciidoc-styles")?.textContent,
		).toContain(".tp-asciidoc-output .MathJax_SVG");
		expect(highlightAll).toHaveBeenCalled();
		const mathJaxScript = element.querySelector<HTMLScriptElement>(
			'script[src][data-tp-asciidoc-asset="mathjax"]',
		);
		mathJaxScript?.dispatchEvent(new Event("load"));
		await flush();
		expect(queue).toHaveBeenCalledWith([
			element.querySelector(".tp-asciidoc-output"),
		]);
	});

	it("renders an included AsciiDoc example inside Markdown tabs", async () => {
		const includedSource = `[adocviewer%allow-script, label="tp-asciidoc"]
....
.Basic usage 1
====
[tp-asciidoc]
--
[script,type="tp/asciidoc"]
--
The custom HTML element \`tp-asciidoc\` renders its content from *AsciiDoc* code.
--
--
====

.Basic usage 2
====
[tp-asciidoc]
--
[script,type="tp/asciidoc"]
--
Second *AsciiDoc* example.
--
--
====
....`;
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response(includedSource)),
		);

		const element = document.createElement("tp-markdown");
		element.innerHTML = `<script type="tp/markdown">
      \`\`\`\`\` tabs
      tp-asciidoc
      : ::include{examples/examples.adoc}
      \`\`\`\`\`
    </script>`;
		document.body.append(element);

		for (let attempt = 0; attempt < 20; attempt += 1) {
			if (element.querySelector(".tp-adocviewer-output tp-asciidoc") !== null)
				break;
			await flush();
		}

		expect(
			element.querySelector(".tp-adocviewer-output tp-asciidoc"),
		).not.toBeNull();
		expect(
			element.querySelector("select.tp-adocviewer-example option")?.textContent,
		).toBe("Basic usage 1");
	});
});
