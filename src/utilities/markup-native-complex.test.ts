import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { nativeComplexCases } from "./markup-native-complex-fixtures.js";

for (const language of ["markdown", "asciidoc", "latex"] as const) {
	it.each(nativeComplexCases)(
		`retains compound native structures through ${language}: $name`,
		async (example) => {
			let html: string = example.html;
			for (let pass = 0; pass < 2; pass++) {
				const source = htmlToMarkup(html, language);
				expect(source).not.toMatch(
					/\\wc(?:Span|Figure|Figcaption|Ol|Ul|Li)|^:+ (?:figure|figcaption|ol|ul|li)\b|^\[(?:figure|figcaption|ol|ul|li)[,\]]/m,
				);
				html = await markupToHtml(source, language, document.baseURI);
				const root = document.createElement("div");
				root.innerHTML = html;
				for (const selector of example.selectors)
					expect(
						root.querySelector(selector),
						`${source}\n${html}`,
					).not.toBeNull();
			}
		},
	);
}
