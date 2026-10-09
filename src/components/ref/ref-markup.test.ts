import { readFileSync } from "node:fs";
import { afterEach, expect, it } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import "./ref.js";
import "../listof/listof.js";

afterEach(() => document.body.replaceChildren());
it.each([
	["adoc", renderAsciidocToHtml],
	["md", renderMarkdownToHtml],
] as const)(
	"preserves distinct reference targets in the %s documentation example",
	async (extension, render) => {
		const helpersPath = "../../../scripts/component-basic-examples.mjs";
		const { namedExamples, viewerSource } = await import(helpersPath);
		const file = readFileSync(
			`public/docs/components/ref/examples/examples.${extension}`,
			"utf8",
		);
		const examples = namedExamples(
			extension,
			viewerSource(extension, file),
		) as { label: string; source: string }[];
		const source = examples.find(
			(e) => e.label === "Notes, bibliography and glossary",
		)?.source;
		if (!source) throw new Error("Missing example");
		document.body.innerHTML = await render(source);
		await Promise.resolve();
		await Promise.resolve();
		await Promise.resolve();
		expect(
			Array.from(document.querySelectorAll("tp-ref"), (e) =>
				e.getAttribute("href"),
			),
		).toEqual(["^method", "@book", "%ecosystem", "^weather", "^method"]);
		expect(
			Array.from(
				document.querySelectorAll("tp-ref > button"),
				(e) => e.textContent,
			),
		).toEqual(["[1]", "[book]", "ecosystem", "[2]", "[1]"]);
		expect(document.querySelectorAll(".tp-listof-notes > li")).toHaveLength(2);
		expect(
			Array.from(
				document.querySelectorAll(".tp-listof-biblio > dt"),
				(e) => e.textContent,
			),
		).toEqual(["atlas", "book"]);
	},
);
