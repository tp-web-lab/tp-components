import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import {
	presentationCases,
	presentationSignature,
} from "./markup-presentation-next-fixtures.js";

it.each(presentationCases)("native conversions: $name", async (test) => {
	const original = await markupToHtml(
		test.source,
		test.language,
		document.baseURI,
	);
	for (const first of ["markdown", "asciidoc", "latex"] as const)
		for (const second of ["markdown", "asciidoc", "latex"] as const) {
			const source = htmlToMarkup(original, first),
				a = await markupToHtml(source, first, document.baseURI);
			const code = htmlToMarkup(a, second),
				html = await markupToHtml(code, second, document.baseURI);
			expect(code).not.toMatch(
				/:+ (?:img|ol|ul|li|table)\b|\[(?:img|ol|ul|li|table),|\\wc(?:Img|Ol|Ul|Li|Div)\b/,
			);
			expect(
				presentationSignature(html),
				`${first} -> ${second}\n${source}\n${code}\n${html}`,
			).toEqual(presentationSignature(original));
		}
});
