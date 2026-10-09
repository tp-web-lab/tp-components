import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { openViewerSource } from "../test-helpers/viewer-source.js";

import "./asciidoc/asciidoc.js";
import {
	dedentAsciidocSource,
	renderAsciidocToHtml,
} from "./asciidoc/asciidoc.js";
import "./html-viewer/html-viewer.js";
import "./include/include.js";
import "./markdown-multi-pages/markdown-multi-pages.js";
import "./markdown-viewer/markdown-viewer.js";
import { renderMarkdownToHtml } from "./markdown/markdown.js";
import "./button/button.js";
import "./dropdown/dropdown.js";
import "./divider/divider.js";
import "./center/center.js";
import "./box/box.js";
import "./cluster/cluster.js";
import "./accordion/accordion.js";
import type { TpCodeEditor } from "./code-editor/code-editor.js";

beforeEach(() => {
	// CodeMirror schedules layout measurements that jsdom cannot perform after
	// the fixture has been detached. Viewer behavior does not depend on them.
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
	document.body.innerHTML = "";
	window.location.hash = "";
	document.getElementById("tp-markdown-highlight-theme")?.remove();
});

describe("markdown components migration", () => {
	it("preserves raw script content nested inside a custom element", async () => {
		const html = await renderMarkdownToHtml(`<tp-notebook>
  <script type="tp/restructuredtext" doctest>
    .. raw:: html

       <h2>Verification</h2>

    >>> print(6 * 7)
    42
  </script>
</tp-notebook>`);

		const template = document.createElement("template");
		template.innerHTML = html;
		const script = template.content.querySelector<HTMLScriptElement>(
			'script[type="tp/restructuredtext"]',
		);

		expect(script).not.toBeNull();
		expect(script?.textContent).toContain(
			".. raw:: html\n\n       <h2>Verification</h2>",
		);
		expect(script?.textContent).toContain(">>> print(6 * 7)\n    42");
		expect(script?.innerHTML).not.toContain("<pre>");
	});

	it("continues to render raw-text element examples inside fenced code blocks", async () => {
		const html = await renderMarkdownToHtml(
			'```html\n<script type="tp/python">print(6 * 7)</script>\n```',
		);

		expect(html).toContain("&lt;script type=&quot;tp/python&quot;&gt;");
		expect(html).toContain("print(6 * 7)");
	});

	it("keeps script examples inside a tab definition", async () => {
		const html = await renderMarkdownToHtml(`::: tp-tabs
no content
: \`\`\`html
  <tp-object-tree></tp-object-tree>
  \`\`\`

script
: Autoloading:

  \`\`\`html
  <script type="module" src="tp-loader.js"></script>
  \`\`\`

  Cherry picking:

  \`\`\`html
  <script type="module" src="/components/object-tree/object-tree.js"></script>
  \`\`\`

import
: \`\`\`js
  import "/components/object-tree/object-tree.js";
  \`\`\`
:::`);

		expect(html).not.toContain("tp-markdown-raw-text");
		expect(html).toContain('&lt;script type="module" src="tp-loader.js"&gt;');
		expect(html).toContain("Cherry picking:");
		expect(html).toContain('import "/components/object-tree/object-tree.js";');
	});

	it("preserves double hyphens in encoded CSS custom-property names", async () => {
		const html = await renderMarkdownToHtml(
			"| CSS property |\n| --- |\n| <code>&#45;&#45;tp-example-gap</code> |",
		);

		expect(html).toContain("<code>--tp-example-gap</code>");
		expect(html).not.toContain("<code>–tp-example-gap</code>");
	});

	async function flush(): Promise<void> {
		await Promise.resolve();
		await new Promise<void>((resolve) => {
			window.setTimeout(resolve, 0);
		});
	}

	async function waitFor(
		predicate: () => boolean,
		timeoutMs = 1000,
	): Promise<void> {
		const startedAt = Date.now();
		while (!predicate()) {
			if (Date.now() - startedAt > timeoutMs) {
				break;
			}
			await flush();
		}
	}

	it("renders tp-markdown from script source", async () => {
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        # Hello
      </script>
    `;

		document.body.append(element);
		await flush();

		expect(element.querySelector("h1")?.textContent).toBe("Hello");
	});

	it.each([
		[
			"markdown-example.md",
			"/docs/components/prose-editor/markdown-example.md",
		],
		[
			"./markdown-example.md",
			"/docs/components/prose-editor/markdown-example.md",
		],
		[
			"../prose-editor/markdown-example.md",
			"/docs/components/prose-editor/markdown-example.md",
		],
		[
			"../../components/prose-editor/markdown-example.md",
			"/docs/components/prose-editor/markdown-example.md",
		],
		[
			"/docs/components/prose-editor/markdown-example.md",
			"/docs/components/prose-editor/markdown-example.md",
		],
	])(
		'résout src="%s" depuis le document Markdown courant',
		async (src, expectedPath) => {
			const fetchMock = vi.fn(async () => new Response("# Loaded"));
			vi.stubGlobal("fetch", fetchMock);

			document.body.innerHTML = `
      <div data-tp-markdown-source="/docs/components/prose-editor/index.md">
        <tp-markdown src="${src}"></tp-markdown>
      </div>
    `;

			await waitFor(
				() =>
					document.body.querySelector("tp-markdown h1")?.textContent ===
					"Loaded",
			);

			const firstCall = fetchMock.mock.calls[0] as
				| [RequestInfo | URL, RequestInit?]
				| undefined;
			const requestedPath = new URL(
				String(firstCall?.[0]),
				window.location.href,
			).pathname;

			expect(requestedPath).toBe(expectedPath);
		},
	);

	it("supports frontmatter math extension in tp-markdown", async () => {
		vi.stubGlobal("MathJax", {
			startup: {
				promise: Promise.resolve(),
			},
			tex2svgPromise: vi.fn(async () => {
				const element = document.createElement("mjx-container");
				element.dataset.testMathjax = "latex";
				return element;
			}),
		});

		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        ---
        extensions:
          - math
        ---

        Inline :latexmath:\`E = mc^2\`
      </script>
    `;

		document.body.append(element);
		await waitFor(
			() =>
				element.querySelector('mjx-container[data-test-mathjax="latex"]') !==
				null,
		);

		expect(
			element.querySelector('mjx-container[data-test-mathjax="latex"]'),
			element.innerHTML,
		).not.toBeNull();
		expect(
			element
				.querySelector("[data-mathjax-tex]")
				?.getAttribute("data-mathjax-rendered"),
		).toBe("true");
	});

	it("overrides TpBase svg sizing for math output", async () => {
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        ---
        extensions:
          - math
        ---
        Inline :asciimath:\`x=(-b +- sqrt(b^2-4ac))/(2a)\`
      </script>
    `;

		document.body.append(element);
		await flush();

		const styleNode = document.head.querySelector("#tp-markdown-styles");
		const styleText = styleNode?.textContent ?? "";
		expect(styleText).toContain(".tp-markdown-output .tp-md-math-inline svg");
		expect(styleText).toContain("max-inline-size: none;");
	});

	it("makes Markdown tables fit beside floated content", async () => {
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        | A | B |
        | --- | --- |
        | Alpha | Beta |
      </script>
    `;

		document.body.append(element);
		await flush();

		const style = document.getElementById("tp-markdown-styles");
		expect(style?.textContent).toContain(".tp-markdown-output table");
		expect(style?.textContent).toContain("display: block;");
		expect(style?.textContent).toContain("inline-size: auto;");
		expect(style?.textContent).toContain("overflow-x: auto;");
	});

	it("makes fenced code containers fit beside floated content", async () => {
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        \`\`\`html
        <p>Example</p>
        \`\`\`
      </script>
    `;

		document.body.append(element);
		await flush();

		const style = document.getElementById("tp-markdown-styles");
		expect(style?.textContent).toContain(".tp-markdown-output > pre");
		expect(style?.textContent).toContain("display: flow-root;");
	});

	it("preserves fenced code language classes without highlight.js", async () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const element = document.createElement("tp-markdown");
		const script = document.createElement("script");
		script.type = "tp/markdown";
		script.textContent = `
      \`\`\`html
      <script type="module" src="tp-loader.js">
      \`\`\`
    `;
		element.append(script);

		document.body.append(element);
		await flush();

		const code = element.querySelector("pre > code");
		expect(code?.classList.contains("language-html")).toBe(true);
		expect(code?.textContent).toContain(
			'<script type="module" src="tp-loader.js">',
		);
		warnSpy.mockRestore();
	});

	it("injects Highlight.js colors through the Markdown component stylesheet", async () => {
		const element = document.createElement("tp-markdown");
		const script = document.createElement("script");
		script.type = "tp/markdown";
		script.textContent = `
      \`\`\`html
      <script type="module" src="tp-loader.js">
      \`\`\`
    `;
		element.append(script);

		document.body.append(element);
		await waitFor(() => element.querySelector("pre > code") !== null);

		const style = document.getElementById("tp-markdown-styles");
		const code = element.querySelector("pre > code");

		expect(style?.textContent).toContain(".tp-markdown-output .hljs-string");
		expect(style?.textContent).toContain("--tp-syntax-token-string");
		expect(code?.classList.contains("language-html")).toBe(true);
	});

	it("keeps inline include directives inside Markdown tp-tabs definition panels", async () => {
		const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
			const path = new URL(String(input), window.location.href).pathname;
			return new Response(`Included ${path}\nSecond line ${path}`, {
				status: 200,
			});
		});
		vi.stubGlobal("fetch", fetchMock);

		const element = document.createElement("tp-markdown");
		const script = document.createElement("script");
		script.type = "tp/markdown";
		script.textContent = `
      :::::: tp-tabs

      html
      : ::include{html-examples.html}

      asciidoc
      : ::include{adoc-examples.adoc}

      markdown
      : ::include{md-examples.md}

      restructuredtext
      : ::include{rst-examples.rst}

      ::::::
    `;
		element.append(script);

		document.body.append(element);
		await waitFor(() => element.querySelectorAll("tp-tabs dd").length === 4);

		const tabs = element.querySelector("tp-tabs");
		const terms = Array.from(tabs?.querySelectorAll(":scope > dl > dt") ?? []);
		const panels = Array.from(tabs?.querySelectorAll(":scope > dl > dd") ?? []);

		expect(terms.map((term) => term.textContent?.trim())).toEqual([
			"html",
			"asciidoc",
			"markdown",
			"restructuredtext",
		]);
		expect(panels).toHaveLength(4);
		expect(tabs?.querySelectorAll("tp-include")).toHaveLength(1);
		expect(tabs?.querySelectorAll("tp-asciidoc")).toHaveLength(1);
		expect(tabs?.querySelectorAll("tp-restructuredtext")).toHaveLength(1);
		expect(panels.map((panel) => panel.textContent?.trim())).toEqual([
			"Included /html-examples.html\nSecond line /html-examples.html",
			"Included /adoc-examples.adoc\nSecond line /adoc-examples.adoc",
			"Included /md-examples.md\nSecond line /md-examples.md",
			"",
		]);
		expect(
			tabs?.querySelector("tp-restructuredtext")?.getAttribute("src"),
		).toBe("http://localhost:3000/rst-examples.rst");
	});

	it("expands include directives inside a Markdown line", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("included text", { status: 200 })),
		);

		const element = document.createElement("tp-markdown");
		const script = document.createElement("script");
		script.type = "tp/markdown";
		script.textContent = "Before ::include{fragment.md} after";
		element.append(script);

		document.body.append(element);
		await waitFor(() => element.querySelector("p") !== null);

		expect(element.querySelector("p")?.textContent).toBe(
			"Before included text after",
		);
	});

	it("includes a file as raw source inside a code fence", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async () =>
					new Response("= Included title\n\nA *paragraph*.", { status: 200 }),
			),
		);

		const element = document.createElement("tp-markdown");
		const script = document.createElement("script");
		script.type = "tp/markdown";
		script.textContent = `\`\`\` asciidoc
::include{advanced-example.adoc mode=raw}
\`\`\``;
		element.append(script);

		document.body.append(element);
		await waitFor(() => element.querySelector("pre code") !== null);

		expect(element.querySelector("pre code")?.textContent).toBe(
			"= Included title\n\nA *paragraph*.\n",
		);
		expect(element.querySelector("tp-asciidoc")).toBeNull();
	});

	it("preserves all tp-html-viewer examples from an included HTML file", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async () =>
					new Response(
						`
<tp-html-viewer label="tp-callout" allow-script>
  <div role="example" label="Basic usage">
    <tp-callout>
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
    <p>If the <code>variant</code> attribute is not specified, <code>"neutral"</code> is used.</p>
  </div>

  <div role="example" label="Attribute variant">
    <p>The <code>variant</code> attribute allows you to change the colour of the border and background.</p>
    <p>The different values for the <code>variant</code> attribute are: <code>"brand"</code>, <code>"danger"</code>, <code>"info"</code>, <code>"neutral"</code>, <code>"success"</code>, and <code>"warning"</code>.</p>
    <tp-callout variant="brand">
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
    <tp-callout variant="danger">
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
  </div>

  <div role="example" label="Attribute outlined">
    <p>The <code>outlined</code> attribute removes the background colour.</p>
    <tp-callout variant="brand" outlined>
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
    <tp-callout variant="danger" outlined>
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
  </div>
</tp-html-viewer>
`,
						{ status: 200 },
					),
			),
		);

		const element = document.createElement("tp-markdown");
		const script = document.createElement("script");
		script.type = "tp/markdown";
		script.textContent = "::include{examples.html}";
		element.append(script);

		document.body.append(element);
		await waitFor(
			() => element.querySelectorAll("tp-html-viewer select").length === 3,
		);

		const selects = Array.from(
			element.querySelectorAll<HTMLSelectElement>("tp-html-viewer select"),
		);
		const exampleSelect = selects.find((select) =>
			Array.from(select.options).some(
				(option) => option.value === "Basic usage",
			),
		);

		expect(
			Array.from(exampleSelect?.options ?? []).map((option) => option.value),
		).toEqual(["Basic usage", "Attribute variant", "Attribute outlined"]);
	});

	it("preserves all tp-html-viewer examples from an included HTML file inside Markdown tabs", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async () =>
					new Response(
						`
<tp-html-viewer label="tp-callout" allow-script>
  <div role="example" label="Basic usage">
    <tp-callout>
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
  </div>

  <div role="example" label="Attribute variant">
    <p>The <code>variant</code> attribute allows you to change the colour.</p>
    <tp-callout variant="brand">
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
  </div>

  <div role="example" label="Attribute outlined">
    <p>The <code>outlined</code> attribute removes the background colour.</p>
    <tp-callout variant="brand" outlined>
      The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content in various ways.
    </tp-callout>
  </div>
</tp-html-viewer>
`,
						{ status: 200 },
					),
			),
		);

		const element = document.createElement("tp-markdown");
		const script = document.createElement("script");
		script.type = "tp/markdown";
		script.textContent = [
			"``` tabs",
			"",
			"html",
			": ::include{examples.html}",
			"",
			"markdown",
			": **Markdown panel**",
			"",
			"```",
		].join("\n");
		element.append(script);

		document.body.append(element);
		await waitFor(
			() => element.querySelectorAll("tp-html-viewer select").length === 3,
		);

		const selects = Array.from(
			element.querySelectorAll<HTMLSelectElement>("tp-html-viewer select"),
		);
		const exampleSelect = selects.find((select) =>
			Array.from(select.options).some(
				(option) => option.value === "Basic usage",
			),
		);

		expect(
			Array.from(exampleSelect?.options ?? []).map((option) => option.value),
		).toEqual(["Basic usage", "Attribute variant", "Attribute outlined"]);
	});

	it("preserves paragraph breaks in tp/asciidoc scripts from included HTML examples", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async () =>
					new Response(`
<tp-html-viewer label="tp-callout" allow-script>
  <div role="example" label="Basic usage">
    <tp-asciidoc>
      <script type="tp/asciidoc">
        The custom HTML element \`tp-asciidoc\` renders its content from *AsciiDoc* code.
        
        Reminder: in AsciiDoc, \`+*AsciiDoc*+\` is displayed in bold: *AsciiDoc*.
      </script>
    </tp-asciidoc>
  </div>
</tp-html-viewer>
`),
			),
		);

		const element = document.createElement("tp-markdown");
		element.innerHTML =
			'<script type="tp/markdown">::include{examples/examples.html}</script>';
		document.body.append(element);

		await waitFor(
			() => element.querySelector("tp-html-viewer iframe") !== null,
		);
		const frame = element.querySelector<HTMLIFrameElement>(
			"tp-html-viewer iframe",
		);
		const preview = new DOMParser().parseFromString(
			frame?.srcdoc ?? "",
			"text/html",
		);
		const source =
			preview.querySelector("tp-asciidoc script")?.textContent ?? "";
		expect(source).toMatch(/\*AsciiDoc\* code\.\n\s*\n\s*Reminder:/);
		const rendered = new DOMParser().parseFromString(
			await renderAsciidocToHtml(dedentAsciidocSource(source)),
			"text/html",
		);
		expect(rendered.querySelectorAll("p")).toHaveLength(2);
	});

	it("renders tp-markdown-viewer controls and panes", async () => {
		const element = document.createElement("tp-markdown-viewer");
		element.innerHTML = `
      <script type="tp/markdown">
        # Viewer
      </script>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await flush();

		expect(element.querySelector('[data-role="layout"]')).toBeNull();
		expect(element.querySelector('[data-role="mode"]')).toBeNull();
		expect(element.querySelector('[data-role="toggle-source"]')).not.toBeNull();
		expect(element.querySelector('[data-role="toggle-output"]')).not.toBeNull();
		expect(
			element.querySelector("tp-switcher.tp-markdown-viewer-layout"),
		).not.toBeNull();
		expect(
			element.querySelector(".tp-markdown-viewer-source-output"),
		).not.toBeNull();
		expect(element.querySelector(".tp-markdown-viewer-output")).not.toBeNull();
		expect(
			element
				.querySelector('[data-role="source"] tp-code-editor')
				?.hasAttribute("line-numbers"),
		).toBe(false);
	});

	it("preserves Markdown example labels written immediately after an attribute brace", async () => {
		const element = document.createElement("tp-markdown-viewer");
		element.innerHTML = `
      <script type="tp/markdown">
        \`\`\` example {label="Basic usage"}
        First
        \`\`\`

        \`\`\` example {label="Multiple examples"}
        Second
        \`\`\`

        \`\`\` example {label="Lite"}
        Third
        \`\`\`
      </script>
    `;
		document.body.append(element);
		await waitFor(
			() =>
				element.querySelectorAll('[data-role="start-controls"] option')
					.length === 3,
		);

		expect(
			Array.from(
				element.querySelectorAll<HTMLOptionElement>(
					'[data-role="start-controls"] option',
				),
			).map((option) => option.textContent),
		).toEqual(["Basic usage", "Multiple examples", "Lite"]);
	});

	it("renders the compact single-example lite viewer", async () => {
		const element = document.createElement("tp-markdown-viewer");
		element.setAttribute("lite", "");
		element.innerHTML = `
      <script type="tp/markdown">
        \`\`\`example label="First"
        # First example
        \`\`\`

        \`\`\`example label="Second"
        # Second example
        \`\`\`
      </script>
    `;

		document.body.append(element);
		await waitFor(
			() => element.querySelector(".tp-markdown-output h1") !== null,
		);

		expect(element.dataset.layout).toBe("output");
		expect(element.querySelector("select")).toBeNull();
		expect(
			element.querySelectorAll(".tp-markup-viewer-lite-toolbar"),
		).toHaveLength(1);
		expect(
			element.querySelector(".tp-markup-viewer-language")?.getAttribute("name"),
		).toBe("markdown-viewer");
		expect(
			element
				.querySelector(".tp-markup-viewer-language")
				?.getAttribute("library"),
		).toBe("components");
		expect(
			document.getElementById("tp-markup-viewer-styles")?.textContent,
		).toContain(".tp-markup-viewer[lite] .tp-markup-viewer-start");
		expect(
			document.getElementById("tp-markup-viewer-styles")?.textContent,
		).toContain(".tp-markup-viewer[lite] {");
		expect(
			document.getElementById("tp-markup-viewer-styles")?.textContent,
		).toContain("border-block-end: 1px solid");
		expect(
			document.getElementById("tp-markup-viewer-styles")?.textContent,
		).toContain(
			".tp-markup-viewer[lite][data-layout='both'] .tp-markup-viewer-end",
		);
		expect(
			document.getElementById("tp-markup-viewer-styles")?.textContent,
		).toContain("padding: 6px");
		expect(element.querySelector("tp-switcher")?.getAttribute("gap")).toBe("0");
		const preview = element.querySelector<HTMLIFrameElement>(
			".tp-markdown-output iframe",
		);
		expect(preview?.srcdoc).toContain("First example");
		expect(preview?.srcdoc).not.toContain("Second example");

		const sourceButton = element.querySelector<HTMLElement>(
			'[data-role="toggle-source"]',
		);
		const outputButton = element.querySelector<HTMLElement>(
			'[data-role="toggle-output"]',
		);
		sourceButton?.click();
		expect(element.dataset.layout).toBe("both");
		outputButton?.click();
		expect(element.dataset.layout).toBe("source");
		sourceButton?.click();
		expect(element.dataset.layout).toBe("source");

		const editor = element.querySelector<TpCodeEditor>(
			'[data-role="source"] tp-code-editor',
		);
		editor?.setValue("# Changed");
		element.querySelector<HTMLElement>('[data-role="run"]')?.click();
		await waitFor(
			() =>
				element
					.querySelector(".tp-markdown-output")
					?.textContent?.includes("Changed") === true,
		);
		element.querySelector<HTMLElement>('[data-role="reset"]')?.click();
		await waitFor(() => editor?.getValue().includes("First example") === true);
		outputButton?.click();
		sourceButton?.click();
		await flush();
	});

	it("renders the Markdown AST with tp-object-tree", async () => {
		const element = document.createElement("tp-markdown-viewer");
		element.innerHTML = '<script type="tp/markdown"># Tree title</script>';
		document.body.append(element);
		await openViewerSource(element);
		await flush();

		const mode = element.querySelector<HTMLElement>(
			'[data-role="output-mode"][data-mode="ast"]',
		);
		expect(mode).not.toBeNull();
		if (mode === null) return;
		mode.click();
		await flush();

		const output = element.querySelector('[data-role="output"]');
		expect(output?.querySelector("tp-object-tree")).not.toBeNull();
		expect(output?.querySelector("tp-code-editor")).toBeNull();
		expect(output?.textContent).toContain("Tree title");
	});

	it("runs the MathJax runtime in tp-markdown-viewer rendered output", async () => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const tex2svgPromise = vi.fn(async () => svg);
		vi.stubGlobal("MathJax", {
			startup: { promise: Promise.resolve() },
			tex2svgPromise,
			typesetPromise: vi.fn(async () => {}),
		});
		const element = document.createElement("tp-markdown-viewer");
		element.innerHTML = `
      <script type="tp/markdown">
        ---
        extensions:
          - math
        ---

        Inline :latexmath:\`E = mc^2\`
      </script>
    `;
		document.body.append(element);

		await waitFor(
			() =>
				element.querySelector<HTMLIFrameElement>(
					".tp-markdown-output iframe",
				) !== null,
		);

		const frame = element.querySelector<HTMLIFrameElement>(
			".tp-markdown-output iframe",
		);
		expect(frame?.srcdoc).toContain("<tp-markdown>");
		expect(frame?.srcdoc).toContain("E = mc^2");
		expect(tex2svgPromise).not.toHaveBeenCalled();
	});

	it("renders tp-html-viewer preview iframe", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <template>
        <p>Hello HTML</p>
      </template>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await flush();

		expect(
			element.querySelector("tp-switcher.tp-html-viewer-layout"),
		).not.toBeNull();
		expect(element.querySelectorAll(".tp-html-viewer-panel")).toHaveLength(2);
		expect(element.querySelector("iframe.tp-html-viewer-frame")).not.toBeNull();
		expect(
			element
				.querySelector('[data-role="source"] tp-code-editor')
				?.hasAttribute("line-numbers"),
		).toBe(false);

		const styleEl = document.getElementById("tp-html-viewer-styles");
		expect(styleEl?.textContent).toContain(".tp-html-viewer-output");
		expect(styleEl?.textContent).not.toContain("min-height: 14rem");
		const sharedStyle = document.getElementById("tp-markup-viewer-styles");
		expect(sharedStyle?.textContent).toContain(
			".tp-markup-viewer-output > iframe",
		);
		expect(sharedStyle?.textContent).toContain("display: block;");
		expect(sharedStyle?.textContent).toContain("inline-size: 100%;");
		expect(sharedStyle?.textContent).toContain(
			"--tp-html-viewer-frame-min-height",
		);
		expect(
			element.querySelector<HTMLIFrameElement>("iframe")?.style.height,
		).not.toBe("224px");
		expect(
			element.querySelector<HTMLIFrameElement>("iframe")?.srcdoc,
		).not.toContain("padding:.75rem");
		expect(
			element.querySelector<HTMLIFrameElement>("iframe")?.srcdoc,
		).toContain("html > body { margin: 0; padding: 0.5rem;");
		const iframeDocument =
			element.querySelector<HTMLIFrameElement>("iframe")?.contentDocument;
		expect(iframeDocument?.getElementById("tp-token-styles")).not.toBeNull();
		expect(iframeDocument?.getElementById("tp-reset-styles")).not.toBeNull();
		expect(
			iframeDocument?.getElementById("tp-base-styles")?.textContent,
		).toContain("margin: 0 0 0.5rem 0");
	});

	it("keeps empty tp-html-viewer output as compact as other markup viewers", async () => {
		const element = document.createElement("tp-html-viewer");
		document.body.append(element);
		await flush();

		const output = element.querySelector<HTMLElement>('[data-role="output"]');
		expect(output).not.toBeNull();
		expect(output?.children).toHaveLength(0);
		expect(output?.querySelector("iframe")).toBeNull();
	});

	it("does not fail when tp-html-viewer measures an iframe before body exists", () => {
		const element = document.createElement("tp-html-viewer");
		const output = document.createElement("div");
		const iframe = document.createElement("iframe");
		const iframeDocument =
			document.implementation.createHTMLDocument("Loading");
		iframeDocument.body.remove();
		output.append(iframe);

		Object.defineProperty(iframe, "contentDocument", {
			configurable: true,
			value: iframeDocument as unknown as Document,
		});

		expect(() => {
			(
				element as unknown as {
					initializeOutputIframe(container: HTMLElement): void;
				}
			).initializeOutputIframe(output);
		}).not.toThrow();
	});

	it("preserves raw script markup in nested tp-html-viewer source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Basic usage">
        <tp-html-viewer>
          <script type="tp/html-viewer">
            <h2>Live HTML</h2>
            <p>Edit this source and select <strong>Run</strong>.</p>
          </script>
        </tp-html-viewer>
      </div>
    `;
		document.body.append(element);
		await openViewerSource(element);
		await waitFor(
			() => element.querySelector<TpCodeEditor>("tp-code-editor") !== null,
		);

		const editor = element.querySelector<TpCodeEditor>("tp-code-editor");
		const source = editor?.getValue() ?? "";
		expect(source).toContain("<h2>Live HTML</h2>");
		expect(source).toContain(
			"<p>Edit this source and select <strong>Run</strong>.</p>",
		);
		expect(source).not.toContain("&lt;h2&gt;");
		expect(source).not.toContain("&lt;strong&gt;");
	});

	it("captures inline tp-html-viewer source before nested custom elements mutate", async () => {
		if (!customElements.get("tp-html-viewer-mutator-test")) {
			customElements.define(
				"tp-html-viewer-mutator-test",
				class extends HTMLElement {
					connectedCallback(): void {
						this.innerHTML = "<p>Mutated source</p>";
					}
				},
			);
		}

		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <tp-html-viewer-mutator-test>
        <p>Original source</p>
      </tp-html-viewer-mutator-test>
    `;
		document.body.append(element);
		await openViewerSource(element);
		await waitFor(
			() => element.querySelector<TpCodeEditor>("tp-code-editor") !== null,
		);

		const source =
			element.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ?? "";
		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);
		expect(source).toContain("<p>Original source</p>");
		expect(source).not.toContain("Mutated source");
		expect(iframe?.srcdoc).toContain("<p>Original source</p>");
		expect(iframe?.srcdoc).not.toContain("Mutated source");
	});

	it("preserves an explicit tp-toc scope in HTML viewer source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <section data-tp-toc-scope>
        <h1>Getting started</h1>
      </section>
    `;
		document.body.append(element);
		await openViewerSource(element);
		await waitFor(
			() => element.querySelector<TpCodeEditor>("tp-code-editor") !== null,
		);

		const source =
			element.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ?? "";
		expect(source).toContain("<section data-tp-toc-scope>");
		expect(source).toContain("<h1>Getting started</h1>");
	});

	it("omits styles reflected by tp-center attributes from HTML viewer source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <tp-center max-inline-size="20rem" intrinsic center-text>
        <tp-box>Centered content</tp-box>
      </tp-center>
    `;
		document.body.append(element);
		await openViewerSource(element);
		await waitFor(
			() => element.querySelector<TpCodeEditor>("tp-code-editor") !== null,
		);

		const source =
			element.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ?? "";
		expect(source).toContain(
			'<tp-center max-inline-size="20rem" intrinsic center-text>',
		);
		expect(source).not.toContain('intrinsic=""');
		expect(source).not.toContain('center-text=""');
		expect(source).not.toContain('style="max-inline-size: 20rem"');
	});

	it("omits styles reflected by tp-cluster attributes from HTML viewer source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <tp-cluster justify="center" gap="0.5rem">
        <tp-button>Alpha</tp-button>
      </tp-cluster>
    `;
		document.body.append(element);
		await openViewerSource(element);
		await waitFor(
			() => element.querySelector<TpCodeEditor>("tp-code-editor") !== null,
		);

		const source =
			element.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ?? "";
		expect(source).toContain('<tp-cluster justify="center" gap="0.5rem">');
		expect(source).not.toContain("justify-content: center");
		expect(source).not.toContain("align-items: center");
	});

	it("renders nested web-component fences with different lengths", async () => {
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        :::: tp-center { max-inline-size="20rem" }
        ::: tp-box
        Centered content
        :::
        ::::
      </script>
    `;
		document.body.append(element);
		await flush();

		expect(
			element.querySelector("tp-center > tp-box")?.textContent?.trim(),
		).toBe("Centered content");
	});

	it("renders standard block, inline, void, and raw-text HTML directives", async () => {
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        ::::: section { class="notice" }
        :mark:highlight{class="accent"}

        ::: img { src="icon.svg" alt="Icon" }
        ignored
        :::
        :::::

        ::: style
        .notice > mark { color: red; }
        :::

        ::: textarea { rows=3 }
        Text with *literal* markup.
        :::

        ::: template
        <tp-card>Template content</tp-card>
        :::
      </script>
    `;
		document.body.append(element);
		await flush();

		expect(
			element.querySelector("section.notice > mark.accent")?.textContent,
		).toBe("highlight");
		expect(element.querySelector("img")?.getAttribute("src")).toBe("icon.svg");
		expect(element.innerHTML).not.toContain("</img>");
		const renderedStyle = await renderMarkdownToHtml(`::: style
.notice > mark { color: red; }
:::`);
		expect(renderedStyle).toContain(`<style>
.notice > mark { color: red; }
</style>`);
		expect(element.querySelector("textarea")?.textContent).toContain(
			"Text with *literal* markup.",
		);
		expect(element.querySelector("textarea")?.innerHTML).not.toContain("<em>");
		expect(element.querySelector("template")?.innerHTML).toContain(
			"<tp-card>Template content</tp-card>",
		);
	});

	it("preserves Markdown source inside a script web-component directive", async () => {
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        :::: tp-markdown-viewer
        ::: script { type="tp/markdown" }
        # Raw title

        ::: tp-box
        Raw component source
        :::
        :::
        ::::
      </script>
    `;
		document.body.append(element);
		await openViewerSource(element);

		await waitFor(
			() =>
				element.querySelector<TpCodeEditor>(
					"tp-markdown-viewer tp-code-editor",
				) !== null,
		);

		const source =
			element
				.querySelector<TpCodeEditor>("tp-markdown-viewer tp-code-editor")
				?.getValue() ?? "";
		expect(source).toContain("# Raw title");
		expect(source).toContain("::: tp-box");
		expect(source).not.toContain("<h1>");
		expect(source).not.toContain("<tp-box>");
	});

	it("renders an included Markdown viewer directive inside definition-list content", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async () =>
					new Response(
						`
:::::: tp-markdown-viewer
:::: script { type="tp/markdown" }
# Preserved title
::::
::::::
    `.trim(),
					),
			),
		);
		const element = document.createElement("tp-markdown");
		element.innerHTML = `
      <script type="tp/markdown">
        Viewer
        : ::include{examples/viewer.md}
      </script>
    `;
		document.body.append(element);
		await openViewerSource(element);

		await waitFor(
			() =>
				element.querySelector<TpCodeEditor>(
					"tp-markdown-viewer tp-code-editor",
				) !== null,
		);

		const source =
			element
				.querySelector<TpCodeEditor>("tp-markdown-viewer tp-code-editor")
				?.getValue() ?? "";
		expect(source).toContain("# Preserved title");
		expect(element.querySelector("tp-markdown-viewer")).not.toBeNull();
	});

	it("renders the HTML DOM tree with tp-object-tree", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML =
			'<template><article id="example">Tree content</article></template>';
		document.body.append(element);
		await flush();

		const mode = element.querySelector<HTMLElement>(
			'[data-role="output-mode"][data-mode="dom"]',
		);
		expect(mode).not.toBeNull();
		if (mode === null) return;
		mode.click();
		await flush();

		const output = element.querySelector('[data-role="output"]');
		expect(output?.querySelector("tp-object-tree")).not.toBeNull();
		expect(output?.querySelector("pre.tp-html-viewer-code")).toBeNull();
		expect(output?.textContent).toContain("article");
		expect(output?.textContent).toContain("Tree content");
	});

	it("prefers a commented tp-loader import over explicit component imports in tp-html-viewer source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <template>
        <tp-callout>Imported component</tp-callout>
        <script type="module">
          import '/components/callout/callout.js';
        </script>
      </template>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);
		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(iframe).not.toBeNull();
		expect(source).toContain(
			"<!-- Added by tp-html-viewer to load custom tp-* elements in the visualisation panel. -->",
		);
		expect(source).toContain(
			"</tp-callout>\n\n<!-- Added by tp-html-viewer to load custom tp-* elements in the visualisation panel. -->",
		);
		expect(source).toContain("import '/tp-loader.js';");
		expect(source).not.toContain("import '/components/callout/callout.js';");
		expect(iframe?.srcdoc).not.toContain("'/components/callout/callout.js'");
		expect(iframe?.srcdoc).toContain(
			"Added by tp-html-viewer to load custom tp-* elements in the visualisation panel.",
		);
		expect(iframe?.srcdoc).toMatch(
			/import '(?:https?:\/\/[^']+)?\/(?:src\/tp-loader\.ts|dist\/tp-loader\.js)'/,
		);
	});

	it("adds a tp-loader import for tp-* elements in tp-html-viewer iframe source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <template>
        <tp-callout>Loaded by tp-loader</tp-callout>
      </template>
    `;

		document.body.append(element);
		await flush();

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(iframe).not.toBeNull();
		expect(iframe?.srcdoc).toContain(
			"<tp-callout>Loaded by tp-loader</tp-callout>",
		);
		expect(iframe?.srcdoc).toContain(
			"Added by tp-html-viewer to load custom tp-* elements in the visualisation panel.",
		);
		expect(iframe?.srcdoc).toMatch(
			/import '(?:https?:\/\/[^']+)?\/(?:src\/tp-loader\.ts|dist\/tp-loader\.js)'/,
		);
	});

	it("uses the stored user source for tp-dropdown in tp-html-viewer source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Dropdown">
        <tp-dropdown open>
          <ul>
            <li>Load</li>
            <tp-divider></tp-divider>
            <li>Save</li>
          </ul>
        </tp-dropdown>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain("<tp-dropdown open>");
		expect(source).toContain("<ul>");
		expect(source).toContain("<li>Load</li>");
		expect(source).toContain("<tp-divider></tp-divider>");
		expect(source).toContain("<li>Save</li>");
		expect(source).not.toContain('role="menu"');
		expect(source).not.toContain('role="menuitem"');
		expect(source).not.toContain('placement="bottom"');
		expect(source).not.toContain('offset="8px"');
		expect(source).not.toContain("data-open");
		expect(source).not.toContain("data-tp-dropdown-id");
		expect(source).not.toContain("style=");
		expect(source).not.toContain("tabindex");
	});

	it("rewrites tp-loader imports in tp-html-viewer iframe source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <template>
        <tp-callout>Loaded by tp-loader</tp-callout>
        <script type="module">
          import '/tp-loader.js';
        </script>
      </template>
    `;

		document.body.append(element);
		await flush();

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(iframe).not.toBeNull();
		expect(iframe?.srcdoc).not.toContain("'/tp-loader.js'");
		expect(iframe?.srcdoc).toMatch(
			/\/(?:src\/tp-loader\.ts|dist\/tp-loader\.js)/,
		);
	});

	it("preserves escaped tags as text in tp-html-viewer examples", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <template>
        <div role="example" label="Basic usage">
          <tp-callout>
            The custom HTML element <code>&lt;tp-callout&gt;</code> highlights its content.
          </tp-callout>
        </div>
      </template>
    `;

		document.body.append(element);
		await flush();

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(iframe?.srcdoc).toContain("<code>&lt;tp-callout&gt;</code>");
		expect(iframe?.srcdoc).not.toContain("<code><tp-callout>");
	});

	it("shows user-facing source for rendered component examples in tp-html-viewer", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Basic usage">
        <tp-callout
          data-source="&lt;tp-callout&gt;The custom HTML element &lt;code&gt;&amp;lt;tp-callout&amp;gt;&lt;/code&gt; highlights its content in various ways.&lt;/tp-callout&gt;"
          data-tp-base-host=""
          variant="neutral"
        >
          <div data-tp-callout-heading="" hidden=""></div>
          The custom HTML element
          <code>&lt;tp-callout&gt;</code>
          highlights its content in various ways.
        </tp-callout>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain("<tp-callout>");
		expect(source).toContain("<code>&lt;tp-callout&gt;</code>");
		expect(source).not.toContain("data-source");
		expect(source).not.toContain("data-tp-base-host");
		expect(source).not.toContain("data-tp-callout-heading");
		expect(source).not.toContain('variant="neutral"');
	});

	it("shows the original tp-accordion definition list in HTML viewer source", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <tp-accordion open-indexes="0">
        <dl>
          <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
          <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
        </dl>
      </tp-accordion>
    `;
		element.querySelector("tp-accordion")?.setAttribute(
			"data-source",
			`
      <tp-accordion open-indexes="0">
        <dl>
          <dt id="-summary-0" role="button" tabindex="0" aria-expanded="true" aria-controls="-content-0">What is HTML?</dt>
          <dd id="-content-0" role="region" aria-labelledby="-summary-0">The language used to structure web pages.</dd>
          <dt id="tp-accordion-42-summary-1" role="button" tabindex="0" aria-expanded="false" aria-controls="tp-accordion-42-content-1">What is CSS?</dt>
          <dd id="tp-accordion-42-content-1" role="region" aria-labelledby="tp-accordion-42-summary-1" hidden>The language used to style web pages.</dd>
        </dl>
      </tp-accordion>
    `,
		);
		document.body.append(element);
		await openViewerSource(element);
		await waitFor(
			() => element.querySelector<TpCodeEditor>("tp-code-editor") !== null,
		);

		const source =
			element.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ?? "";
		expect(source).toContain("<dt>What is HTML?</dt>");
		expect(source).toContain(
			"<dd>The language used to structure web pages.</dd>",
		);
		expect(source).not.toContain('role="button"');
		expect(source).not.toContain('role="region"');
		expect(source).not.toContain("aria-controls");
		expect(source).not.toContain("aria-labelledby");
		expect(source).not.toContain("tabindex");
		expect(source).not.toContain('id="-summary-0"');
		expect(source).not.toContain('id="-content-0"');
		expect(source).not.toContain(" hidden");
	});

	it("does not duplicate void elements in tp-html-viewer source display", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Line break">
        <p>Before<br>After</p>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source.match(/<br>/g)).toHaveLength(1);
		expect(source).not.toContain("</br>");
	});

	it("preserves tp-button text in pure HTML viewer examples", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Button">
        <tp-button type="button" id="show-callout-toast">Show toast</tp-button>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "").includes("Show toast");
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();
		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(source).toContain(
			'<tp-button type="button" id="show-callout-toast">Show toast</tp-button>',
		);
		expect(source).not.toContain("<button></button>");
		expect(iframe?.srcdoc).toContain("Show toast");
	});

	it("removes internal tp CSS variables from tp-html-viewer source display", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Box">
        <tp-box border-width="4px" style="--tp-box-border-width: 4px; color: red;">
          Box content
        </tp-box>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain('<tp-box border-width="4px" style="color: red">');
		expect(source).not.toContain("--tp-box-border-width");
	});

	it("removes generated theme classes from component examples", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Box">
        <tp-box invert class="tp-dark">
          Box content
        </tp-box>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain("<tp-box invert>");
		expect(source).not.toContain('class="tp-dark"');
	});

	it("removes generated theme classes from tp-theme examples", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Theme">
        <section class="tp-dark">
          <tp-theme mode="dark"></tp-theme>
          <p>Dark theme text</p>
        </section>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain("<section>");
		expect(source).toContain('<tp-theme mode="dark"></tp-theme>');
		expect(source).not.toContain("<tp-icon-button");
		expect(source).not.toContain("<tp-dropdown");
		expect(source).not.toContain("tp-theme-option");
		expect(source).not.toContain('class="tp-dark"');
		expect(source).not.toContain('class="tp-light"');
	});

	it("removes generated children from tp-dir examples", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Direction">
        <section dir="rtl">
          <tp-dir mode="rtl">
            <tp-icon-button></tp-icon-button>
            <tp-tooltip></tp-tooltip>
            <tp-dropdown>
              <ul>
                <li class="tp-dir-option" data-mode="rtl">
                  <tp-icon name="check"></tp-icon>
                  <tp-icon class="tp-dir-option-icon" name="arrow-left"></tp-icon>
                  <span>rtl</span>
                </li>
              </ul>
            </tp-dropdown>
          </tp-dir>
          <p>Right-to-left text</p>
        </section>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain('<tp-dir mode="rtl"></tp-dir>');
		expect(source).not.toContain("<tp-icon-button");
		expect(source).not.toContain("<tp-tooltip");
		expect(source).not.toContain("<tp-dropdown");
		expect(source).not.toContain("tp-dir-option");
	});

	it("removes generated children from tp-lang examples", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Language">
        <tp-lang langs="en,fr" repository="/docs">
          <tp-icon-button></tp-icon-button>
          <tp-dropdown>
            <ul>
              <li class="tp-lang-option" data-lang="auto">
                <tp-icon name="check"></tp-icon>
                <tp-icon class="tp-lang-option-icon" library="flags" name="en"></tp-icon>
                <span>auto</span>
              </li>
            </ul>
          </tp-dropdown>
        </tp-lang>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain(
			'<tp-lang langs="en,fr" repository="/docs"></tp-lang>',
		);
		expect(source).not.toContain("<tp-icon-button");
		expect(source).not.toContain("<tp-dropdown");
		expect(source).not.toContain("tp-lang-option");
	});

	it("keeps user-facing color scope attributes and removes generated color preset classes", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Color">
        <section data-tp-color-scope class="tp-default">
          <tp-color></tp-color>
          <code>Inline code</code>
        </section>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain("data-tp-color-scope");
		expect(source).toContain("<tp-color></tp-color>");
		expect(source).not.toContain('class="tp-default"');
	});

	it("removes generated tp-color UI from source display", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Color">
        <section>
          <tp-color id="tp-color-799rvid" preset="tp-default">
            <tp-icon-button id="tp-color-799rvid-trigger"></tp-icon-button>
            <tp-dropdown>
              <ul>
                <li class="tp-color-option" data-preset="tp-default">default</li>
              </ul>
            </tp-dropdown>
          </tp-color>
        </section>
        <section>
          <tp-color id="tp-color-explicit" preset="tp-emerald">
            <tp-icon-button id="tp-color-explicit-trigger"></tp-icon-button>
          </tp-color>
        </section>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain("<tp-color></tp-color>");
		expect(source).toContain('<tp-color preset="tp-emerald"></tp-color>');
		expect(source).not.toContain("tp-color-799rvid");
		expect(source).not.toContain("<tp-icon-button");
		expect(source).not.toContain("<tp-dropdown");
		expect(source).not.toContain("tp-color-option");
		expect(source).not.toContain('preset="tp-default"');
	});

	it("removes orphan generated tp-color option lists from source display", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <div role="example" label="Color">
        <article id="color-preview">
          <p>Preview</p>
        </article>
        <tp-color anchor="#color-preview"></tp-color>
        <ul>
          <li class="tp-color-option" data-preset="tp-default" data-selected="">
            <tp-icon name="check"></tp-icon>
            <tp-icon class="tp-color-swatch" name="square-rounded" size="1.5em" color="#88B1A1"></tp-icon>
            <span>default</span>
          </li>
        </ul>
        <ul role="menu">
          <li class="tp-color-option" data-preset="tp-red" role="menuitem" tabindex="-1">
            <tp-icon name="check"></tp-icon>
            <span>red</span>
          </li>
        </ul>
      </div>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await waitFor(() => {
			const editor = element.querySelector("tp-code-editor") as
				| (HTMLElement & {
						getValue(): string;
				  })
				| null;
			return (editor?.getValue() ?? "") !== "";
		});

		const editor = element.querySelector("tp-code-editor") as HTMLElement & {
			getValue(): string;
		};
		const source = editor.getValue();

		expect(source).toContain('<tp-color anchor="#color-preview"></tp-color>');
		expect(source).not.toContain("data-tp-color-scope");
		expect(source).not.toContain("tp-color-option");
		expect(source).not.toContain("tp-color-swatch");
		expect(source).not.toContain('data-preset="tp-default"');
		expect(source).not.toContain('role="menu"');
	});

	it("updates tp-html-viewer source from the public API", async () => {
		const element = document.createElement("tp-html-viewer") as HTMLElement & {
			setSource(
				source: string,
				baseHref?: string | null,
				resetSource?: string,
			): void;
		};
		element.innerHTML = `
      <template>
        <p>Initial source</p>
      </template>
    `;

		document.body.append(element);
		await openViewerSource(element);
		await flush();

		element.setSource("<p>Updated source</p>", null, "<p>Initial source</p>");
		await flush();
		await openViewerSource(element);

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);
		const editor = element.querySelector<HTMLElement>("tp-code-editor");
		const resetButton = element.querySelector<HTMLElement>(
			'[data-role="reset"]',
		);

		expect(iframe?.srcdoc).toContain("<p>Updated source</p>");
		expect(editor).not.toBeNull();
		resetButton?.dispatchEvent(new Event("click", { bubbles: true }));
		await flush();

		const resetIframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);
		expect(resetIframe?.srcdoc).toContain("<p>Initial source</p>");
	});

	it("preserves style elements in tp-html-viewer fragments", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <style>
        h2 {
          color: royalblue;
        }
      </style>
      <h2>Styled title</h2>
    `;

		document.body.append(element);
		await flush();

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(iframe?.srcdoc).toContain("<style>");
		expect(iframe?.srcdoc).toContain("color: royalblue;");
		expect(iframe?.srcdoc).toContain("<h2>Styled title</h2>");
	});

	it("preserves script text in tp-html-viewer fragments", async () => {
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <dl id="topics">
        <dt>HTML</dt>
        <dd>HTML structures the document.</dd>
      </dl>
      <script type="module">
        const list = document.querySelector('#topics');
        const terms = Array.from(list.querySelectorAll(':scope > dt'));
        console.log(terms.length);
      </script>
    `;

		document.body.append(element);
		await flush();

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(iframe?.srcdoc).toContain("querySelectorAll(':scope > dt')");
		expect(iframe?.srcdoc).not.toContain("querySelectorAll(':scope &gt; dt')");
	});

	it("sets the iframe base URL from the parent Markdown source", async () => {
		const markdown = document.createElement("div");
		markdown.setAttribute(
			"data-tp-markdown-source",
			"/docs/components/html-viewer/index.md",
		);
		const element = document.createElement("tp-html-viewer");
		element.innerHTML = `
      <html>
        <head>
          <title>HTML tabs</title>
          <link rel="stylesheet" href="./style.css" />
        </head>
        <body>
          <h2>HTML, CSS and JavaScript tabs</h2>
          <script type="module" src="./main.js"></script>
        </body>
      </html>
    `;

		markdown.append(element);
		document.body.append(markdown);
		await flush();

		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(iframe?.srcdoc).toContain(
			'<base href="http://localhost:3000/docs/components/html-viewer/" />',
		);
		expect(iframe?.srcdoc).toContain(
			'<link rel="stylesheet" href="./style.css">',
		);
		expect(iframe?.srcdoc).toContain('<script type="module" src="./main.js">');
	});

	it("loads tp-html-viewer source from a relative src attribute", async () => {
		const fetchMock = vi.fn(
			async () =>
				new Response(`
      <html>
        <head>
          <link rel="stylesheet" href="./style.css" />
        </head>
        <body>
          <h2>Loaded HTML</h2>
          <script type="module" src="./main.js"></script>
        </body>
      </html>
    `),
		);
		vi.stubGlobal("fetch", fetchMock);

		const markdown = document.createElement("div");
		markdown.setAttribute(
			"data-tp-markdown-source",
			"/docs/components/html-viewer/index.md",
		);
		const element = document.createElement("tp-html-viewer");
		element.setAttribute("src", "./index.html");

		markdown.append(element);
		document.body.append(markdown);
		await waitFor(
			() => element.querySelector("iframe.tp-html-viewer-frame") !== null,
		);

		const firstCall = fetchMock.mock.calls[0] as
			| [RequestInfo | URL, RequestInit?]
			| undefined;
		const requestedPath = new URL(String(firstCall?.[0]), window.location.href)
			.pathname;
		const iframe = element.querySelector<HTMLIFrameElement>(
			"iframe.tp-html-viewer-frame",
		);

		expect(requestedPath).toBe("/docs/components/html-viewer/index.html");
		expect(iframe?.srcdoc).toContain(
			'<base href="http://localhost:3000/docs/components/html-viewer/" />',
		);
		expect(iframe?.srcdoc).toContain("<h2>Loaded HTML</h2>");
		expect(iframe?.srcdoc).toContain(
			'<link rel="stylesheet" href="./style.css">',
		);
		expect(iframe?.srcdoc).toContain('<script type="module" src="./main.js">');
	});

	it("registers the canonical tp-markdown-multi-pages custom element", () => {
		expect(customElements.get("tp-markdown-multi-pages")).toBeDefined();
	});
});
