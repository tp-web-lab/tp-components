import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { indexSignature } from "./markup-index-checks.js";
import { packageExamples } from "./markup-latex-package-fixtures.js";

it.each(["html", "markdown", "asciidoc"] as const)(
	"preserves indexes through %s and native LaTeX",
	async (language) => {
		const original = await markupToHtml(
			packageExamples.imakeidx,
			"latex",
			"https://example.org/index.tex",
		);
		const code = htmlToMarkup(original, language),
			html = await markupToHtml(
				code,
				language,
				"https://example.org/index.tex",
			);
		expect(indexSignature(html)).toEqual(indexSignature(original));
		const backCode = htmlToMarkup(html, "latex");
		expect(backCode).toContain("\\usepackage{imakeidx}");
		expect(backCode).toContain("\\printindex[people]");
		expect(backCode).not.toMatch(/\\wc(?:Ul|Li|Section)/);
		const back = await markupToHtml(
			backCode,
			"latex",
			"https://example.org/index.tex",
		);
		expect(indexSignature(back)).toEqual(indexSignature(original));
	},
);
