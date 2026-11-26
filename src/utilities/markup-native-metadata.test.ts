import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { nativeMetadataCases } from "./markup-native-metadata-fixtures.js";

for (const language of ["markdown", "asciidoc", "latex"] as const) {
	it.each(nativeMetadataCases)(
		`preserves native metadata through ${language}: $name`,
		async (example) => {
			let html: string = example.html;
			for (let pass = 0; pass < 2; pass++) {
				const source = htmlToMarkup(html, language);
				expect(source).not.toMatch(
					/\\wc(?:P|Span|Blockquote)|\\webcomponent|^:+ (?:p|h[1-6]|blockquote)\b|^\[(?:h[1-6]|p|span|blockquote)[,\]]/m,
				);
				html = await markupToHtml(source, language, document.baseURI);
				const root = document.createElement("div");
				root.innerHTML = html;
				const found = root.querySelector(example.selector);
				expect(found, `${source}\n${html}`).not.toBeNull();
				if (example.text !== null)
					expect(
						found?.textContent
							?.replace(/\u200b/g, "")
							.replace(/\s+/g, " ")
							.trim(),
					).toBe(example.text);
				if (example.name === "anchor")
					expect(root.querySelector('a[href="#Part_A"]')).not.toBeNull();
			}
		},
	);
}
