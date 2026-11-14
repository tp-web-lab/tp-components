import { afterEach, expect, it, vi } from "vitest";
import { openViewerSource } from "../../test-helpers/viewer-source.js";
import "./markdown-viewer.js";

afterEach(() => document.body.replaceChildren());
it("renders editable Markdown and its output", async () => {
	const element = document.createElement("tp-markdown-viewer");
	element.innerHTML = '<script type="tp/markdown"># Hello</script>';
	document.body.append(element);
	await openViewerSource(element);
	await vi.waitFor(() =>
		expect(element.querySelector("tp-code-editor")).not.toBeNull(),
	);
	expect(element.querySelector('[data-role="output"]')).not.toBeNull();
});

it("covers inline sources, fenced examples and every output mode", async () => {
	const element = document.createElement("tp-markdown-viewer");
	element.innerHTML =
		'<template>```example label="One"\n# One\n```\n```example {label="Two"}\n# Two\n```</template>';
	const api = element as unknown as {
		readInlineSource(): { label: string; source: string; context: undefined };
		extractExamples(value: {
			label: string;
			source: string;
			context: undefined;
		}): Array<{ label: string; source: string }>;
		createExternalContext(url: URL): undefined;
		renderOutput(
			source: string,
			mode: string,
			container: HTMLElement,
		): Promise<void>;
	};
	const source = api.readInlineSource();
	expect(api.extractExamples(source).map((item) => item.label)).toEqual([
		"One",
		"Two",
	]);
	expect(
		api.extractExamples({
			label: "Plain",
			source: "# Plain",
			context: undefined,
		}),
	).toHaveLength(1);
	expect(
		api.extractExamples({
			label: "Mixed",
			source: "~~~js\nignored\n~~~\n~~~example\nkept\n~~~",
			context: undefined,
		})[0]?.label,
	).toBe("Example 1");
	expect(
		api
			.extractExamples({
				label: "Labels",
				source:
					"```example label='Single'\na\n```\n```example label=Plain\nb\n```",
				context: undefined,
			})
			.map((item) => item.label),
	).toEqual(["Single", "Plain"]);
	expect(
		api.extractExamples({
			label: "Open",
			source: "```example\nunclosed",
			context: undefined,
		})[0]?.source,
	).toBe("unclosed");
	expect(
		api.createExternalContext(new URL("https://example.test/a.md")),
	).toBeUndefined();
	for (const mode of ["render", "ast", "html"]) {
		const output = document.createElement("div");
		await api.renderOutput("# Heading", mode, output);
		expect(output.childElementCount).toBeGreaterThan(0);
	}
	const runtime = document.createElement("div");
	await api.renderOutput(
		"---\nextensions:\n  - math\n---\n# Heading",
		"render",
		runtime,
	);
	expect(runtime.querySelector("iframe")?.srcdoc).toContain("tp-markdown");
	element.replaceChildren(document.createTextNode("Text source"));
	expect(api.readInlineSource().source).toBe("Text source");
	vi.resetModules();
	await expect(import("./markdown-viewer.js")).resolves.toBeDefined();
});

it.each(["@source", "^note", "%term"])(
	"renders %s references inside the iframe to initialize tooltip styles and behavior",
	async (key) => {
		const element = document.createElement("tp-markdown-viewer");
		const api = element as unknown as {
			renderOutput(
				source: string,
				mode: string,
				container: HTMLElement,
			): Promise<void>;
		};
		const source = `Reference [${key}].\n\n[${key}]: Definition.`;
		const output = document.createElement("div");
		await api.renderOutput(source, "render", output);
		const iframeDocument = new DOMParser().parseFromString(
			output.querySelector("iframe")?.srcdoc ?? "",
			"text/html",
		);
		expect(
			iframeDocument.querySelector('tp-markdown > script[type="tp/markdown"]')
				?.textContent,
		).toBe(source);
		expect(iframeDocument.querySelector(".tp-md-reference-tooltip")).toBeNull();
	},
);

it.each([
	":math:`x^2`",
	":latexmath:`x^2`",
	":asciimath:`sqrt(x)`",
	"```javascript\nconst answer = 42;\n```",
	"    const answer = 42;",
	'<pre><code class="language-css">body { color: red; }</code></pre>',
	"::: div {.cluster}\nOne\n\nTwo\n:::",
	"```tabs\nFirst\n: One\n\nSecond\n: Two\n```",
	"```list-table\n- - Name\n  - Value\n- - A\n  - 1\n```",
	"```mdviewer\n# Hello\n```",
	"```htmlviewer\n<p>Hello</p>\n```",
	" ```example label=Demo\n Hello\n ```",
])("initializes the native Markdown runtime for %s", async (source) => {
	const element = document.createElement("tp-markdown-viewer");
	const api = element as unknown as {
		renderOutput(
			source: string,
			mode: string,
			container: HTMLElement,
		): Promise<void>;
	};
	const output = document.createElement("div");
	await api.renderOutput(source, "render", output);
	const doc = new DOMParser().parseFromString(
		output.querySelector("iframe")?.srcdoc ?? "",
		"text/html",
	);
	expect(
		doc.querySelector('tp-markdown > script[type="tp/markdown"]')?.textContent,
	).toBe(source);
});
