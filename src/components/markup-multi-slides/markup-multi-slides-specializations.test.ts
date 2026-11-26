import { describe, expect, it } from "vitest";
import { TpAsciidocMultiSlides } from "../asciidoc-multi-slides/asciidoc-multi-slides.js";
import { TpHtmlMultiSlides } from "../html-multi-slides/html-multi-slides.js";
import { TpMarkdownMultiSlides } from "../markdown-multi-slides/markdown-multi-slides.js";
import { TpRestructuredTextMultiSlides } from "../restructuredtext-multi-slides/restructuredtext-multi-slides.js";
import { TpMarkupMultiSlides } from "./markup-multi-slides.js";

describe("tp-*-multi-slides specializations", () => {
	const cases = [
		["tp-asciidoc-multi-slides", TpAsciidocMultiSlides, "asciidoc"],
		["tp-html-multi-slides", TpHtmlMultiSlides, "html"],
		["tp-markdown-multi-slides", TpMarkdownMultiSlides, "markdown"],
		[
			"tp-restructuredtext-multi-slides",
			TpRestructuredTextMultiSlides,
			"restructuredtext",
		],
	] as const;

	it.each(cases)(
		"registers <%s> with its fixed language",
		(tagName, ComponentClass, language) => {
			const element = document.createElement(tagName);

			expect(customElements.get(tagName)).toBe(ComponentClass);
			expect(element).toBeInstanceOf(TpMarkupMultiSlides);
			expect(
				(element as unknown as { fixedLanguage: string }).fixedLanguage,
			).toBe(language);
		},
	);
});
