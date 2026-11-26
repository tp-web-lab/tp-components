import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import {
	textEnvironmentExamples,
	textEnvironmentSignature,
} from "./markup-text-environment-fixtures.js";

it.each(Object.entries(textEnvironmentExamples))(
	"preserves %s through HTML and native LaTeX",
	async (name, source) => {
		const html = await markupToHtml(
			source,
			"latex",
			"https://example.org/document.tex",
		);
		const code = htmlToMarkup(html, "latex");
		expect(code).toContain(`\\begin{${name === "table" ? "table" : name}}`);
		const back = await markupToHtml(
			code,
			"latex",
			"https://example.org/document.tex",
		);
		expect(textEnvironmentSignature(back)).toEqual(
			textEnvironmentSignature(html),
		);
	},
);
