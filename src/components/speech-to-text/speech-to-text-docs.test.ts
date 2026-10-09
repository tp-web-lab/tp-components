import { readFileSync } from "node:fs";
import { extractRstViewerExamples } from "@tp/tp-restructuredtext";
import { expect, it } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import "../asciidoc-viewer/asciidoc-viewer.js";
import "../markdown-viewer/markdown-viewer.js";

/** Loads authored documentation, never duplicate test fixtures. */
function source(extension: string): string {
	return readFileSync(
		`public/docs/components/speech-to-text/examples/examples.${extension}`,
		"utf8",
	);
}
/** Checks that every language presents the same component attributes. */
function check(elements: Element[]): void {
	expect(elements).toHaveLength(5);
	expect(elements[0]?.getAttribute("lang")).toBe("en-US");
	expect(elements[0]?.hasAttribute("interim-results")).toBe(true);
	expect(elements[1]?.getAttribute("lang")).toBe("en-US");
	expect(elements[2]?.getAttribute("lang")).toBe("fr-FR");
	expect(elements[3]?.hasAttribute("continuous")).toBe(true);
	expect(elements[3]?.hasAttribute("interim-results")).toBe(true);
	expect(elements[4]?.getAttribute("value")).toBe("My notes:");
}
it("provides five HTML examples with Basic usage first", () => {
	const root = document.createElement("template");
	root.innerHTML = source("html");
	check(
		Array.from(
			root.content
				.querySelector("template")
				?.content.querySelectorAll("tp-speech-to-text") ?? [],
		),
	);
});
it.each(["md", "adoc"])("renders equivalent %s examples", async (extension) => {
	const render =
		extension === "md" ? renderMarkdownToHtml : renderAsciidocToHtml;
	const root = document.createElement("div");
	root.innerHTML = await render(source(extension));
	const viewer = root.querySelector(
		extension === "md" ? "tp-markdown-viewer" : "tp-asciidoc-viewer",
	);
	const api = viewer as unknown as {
		readInlineSource(): { label: string; source: string; context: undefined };
		extractExamples(input: {
			label: string;
			source: string;
			context: undefined;
		}): { label: string; source: string }[];
	};
	const examples = api.extractExamples(api.readInlineSource());
	expect(examples.map((example) => example.label)).toEqual([
		"Basic usage",
		"Basic",
		"French",
		"Continuous",
		"Initial text",
	]);
	const output = document.createElement("div");
	for (const example of examples)
		output.insertAdjacentHTML("beforeend", await render(example.source));
	check(Array.from(output.querySelectorAll("tp-speech-to-text")));
});
it("preserves the reStructuredText examples", () => {
	const body = source("rst").split(":type: tp/restructuredtext\n")[1] ?? "";
	const examples = extractRstViewerExamples(body.replace(/^ {6}/gm, "").trim());
	expect(examples.map((example) => example.label)).toEqual([
		"Basic usage",
		"Basic",
		"French",
		"Continuous",
		"Initial text",
	]);
	expect(examples[2]?.source).toContain(":lang: fr-FR");
	expect(examples[3]?.source).toContain(":interim-results:");
	expect(examples[4]?.source).toContain(":value: My notes:");
});
