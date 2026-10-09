import { readFileSync } from "node:fs";
import { extractRstViewerExamples } from "@tp/tp-restructuredtext";
import { expect, it } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import "../markdown-viewer/markdown-viewer.js";
import "../asciidoc-viewer/asciidoc-viewer.js";

/** Reads the authored examples, not a separate test fixture. */
function source(extension: string): string {
	return readFileSync(
		`public/docs/components/text-to-speech/examples/examples.${extension}`,
		"utf8",
	);
}

/** Checks the introduction, voice comparisons and linked speech example. */
function checkExamples(allElements: Element[]): void {
	expect(allElements).toHaveLength(5);
	const [intro, ...elements] = allElements;
	expect(intro?.getAttribute("lang")).toBe("en-GB");
	expect(intro?.hasAttribute("show-text")).toBe(true);
	expect(intro?.querySelector('script[type="tp/txt"]')?.textContent).toContain(
		"Welcome to tp-components. This example uses the browser speech synthesis service.",
	);
	expect(elements).toHaveLength(4);
	expect(elements[0]?.id).toBe("voice-comparison");
	expect(elements[0]?.getAttribute("lang")).toBe("en-US");
	expect(elements[1]?.id).toBe("voice-comparison");
	expect(elements[1]?.getAttribute("lang")).toBe("fr-FR");
	expect(elements[1]?.hasAttribute("show-text")).toBe(true);
	expect(elements[1]?.getAttribute("value")).toContain("Bienvenue");
	expect(elements[2]?.getAttribute("for")).toBe("spoken-text");
	expect(elements[2]?.previousElementSibling?.tagName).toBe("TP-TYPEWRITING");
	expect(elements[2]?.previousElementSibling?.id).toBe("spoken-text");
	expect(elements[2]?.previousElementSibling?.textContent).toContain(
		"Welcome to tp-components.",
	);
	expect(elements[3]?.getAttribute("for")).toBe("reading-article");
	expect(elements[3]?.previousElementSibling?.tagName).toBe("ARTICLE");
	expect(elements[3]?.previousElementSibling?.id).toBe("reading-article");
}

it("keeps six equivalent HTML examples inside the viewer template", () => {
	const root = document.createElement("div");
	root.innerHTML = source("html");
	const template = root.querySelector("template");
	expect(template?.content.querySelectorAll('[role="example"]')).toHaveLength(
		6,
	);
	checkExamples(
		Array.from(template?.content.querySelectorAll("tp-text-to-speech") ?? []),
	);
});

it.each(["md", "adoc"])(
	"preserves and renders the %s viewer source",
	async (extension) => {
		const render =
			extension === "md" ? renderMarkdownToHtml : renderAsciidocToHtml;
		const root = document.createElement("div");
		root.innerHTML = await render(source(extension));
		const viewer = root.querySelector(
			extension === "md" ? "tp-markdown-viewer" : "tp-asciidoc-viewer",
		);
		expect(viewer?.querySelector("script")?.type).toBe(
			extension === "md" ? "tp/markdown" : "tp/asciidoc",
		);
		const api = viewer as unknown as {
			readInlineSource(): { label: string; source: string; context: undefined };
			extractExamples(example: {
				label: string;
				source: string;
				context: undefined;
			}): Array<{ label: string; source: string }>;
		};
		const examples = api.extractExamples(api.readInlineSource());
		expect(examples.map((example) => example.label)).toEqual([
			"Basic usage",
			"Attributes",
			"English voices",
			"French voices",
			"Synchronized speech",
			"Read an element",
		]);
		const output = document.createElement("div");
		for (const example of examples)
			output.insertAdjacentHTML("beforeend", await render(example.source));
		checkExamples(Array.from(output.querySelectorAll("tp-text-to-speech")));
	},
	20_000,
);

it("preserves six named reStructuredText examples in its data script", () => {
	const text = source("rst");
	expect(text).toContain(":type: tp/restructuredtext");
	const body = text.split(":type: tp/restructuredtext\n")[1] ?? "";
	const examples = extractRstViewerExamples(body.replace(/^ {6}/gm, "").trim());
	expect(examples.map((example) => example.label)).toEqual([
		"Basic usage",
		"Attributes",
		"English voices",
		"French voices",
		"Synchronized speech",
		"Read an element",
	]);
	const [intro, ...variants] = examples;
	expect(intro?.source).toContain(":type: tp/txt");
	expect(intro?.source).toContain(":show-text:");
	expect(variants[0]?.source).toContain("for");
	expect(variants[1]?.source).toContain(":lang: en-US");
	expect(variants[2]?.source).toContain(":lang: fr-FR");
	expect(variants[3]?.source).toContain(":for: spoken-text");
	expect(variants[3]?.source).toContain(":id: spoken-text");
	expect(variants[4]?.source).toContain(":for: reading-article");
	expect(variants[4]?.source).toContain(":id: reading-article");
});
