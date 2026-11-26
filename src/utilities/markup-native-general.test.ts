import {
	applyNativeAttributes,
	escapeAttributeWhitespace,
	nativeMediaHtml,
} from "@tp/tp-utilities";
import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { nativeGeneralCases } from "./markup-native-general-fixtures.js";

for (const language of ["markdown", "asciidoc", "latex"] as const) {
	it.each(nativeGeneralCases)(
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
				for (const [selector, value] of example.texts || [])
					expect(
						root
							.querySelector(selector)
							?.textContent?.replace(/\s+/g, " ")
							.trim(),
					).toBe(value);
				for (const [selector, key, value] of example.attributes)
					expect(root.querySelector(selector)?.getAttribute(key)).toBe(value);
				for (const selector of example.selectors)
					expect(
						root.querySelector(selector),
						`${source}\n${html}`,
					).not.toBeNull();
			}
		},
	);
}

it("does not rewrite markup-shaped strings in literal script bodies", () => {
	const html =
		'<script>const text = `<p title="a\r\nb" tp-attributes="%7B%22title%22%3A%22changed%22%7D">`;</script>';
	expect(escapeAttributeWhitespace(html)).toBe(html);
	expect(applyNativeAttributes(html)).toBe(html);
});
it("rejects malformed attribute envelopes", () => {
	expect(() =>
		applyNativeAttributes('<p tp-attributes="%5B%5D">Text</p>'),
	).toThrow("Invalid tp-attributes");
	expect(() =>
		applyNativeAttributes('<p tp-attributes="%7B%22title%22%3A3%7D">Text</p>'),
	).toThrow("Invalid tp-attributes");
});

it("rejects duplicate and missing media child references", () => {
	for (const order of ["s0,s0", "s1", "s0,b2"]) {
		expect(() =>
			nativeMediaHtml(
				"video",
				{ sources: '[{"src":"movie.mp4"}]', "children-order": order },
				"<p>Fallback</p>",
			),
		).toThrow(/media child/);
	}
});
it("preserves arbitrary source attributes without treating them as markup", () => {
	const html = nativeMediaHtml("video", {
		sources: JSON.stringify([
			{
				src: "movie.mp4",
				"data-description": '<sample>\n"quoted"',
				"data-empty": "",
			},
		]),
	});
	const root = document.createElement("div");
	root.innerHTML = html;
	expect(root.querySelector("source")?.getAttribute("data-description")).toBe(
		'<sample>\n"quoted"',
	);
	expect(root.querySelector("source")?.getAttribute("data-empty")).toBe("");
	expect(() =>
		nativeMediaHtml("video", {
			sources: '[{"src":"movie.mp4","bad name":"x"}]',
		}),
	).toThrow(/attribute/);
});
