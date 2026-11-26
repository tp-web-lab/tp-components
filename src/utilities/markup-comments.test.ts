import { expect, it } from "vitest";
import { protectConversionComments } from "./markup-comments.js";
import { htmlToMarkup } from "./markup-conversion.js";

it("exports native comments and keeps inline prose unchanged", () => {
	const html = "<!-- before --><p>Alpha<!-- note -->Omega</p><!-- after -->";
	expect(htmlToMarkup(html, "markdown")).toContain("Alpha<!-- note -->Omega");
	expect(
		htmlToMarkup("<!--\nFirst line\nSecond line\n-->", "restructuredtext"),
	).toBe("..\n   First line\n   Second line");
	for (const suffix of [" Omega", "\nOmega", "\tOmega"]) {
		expect(htmlToMarkup(`<p>Alpha<!-- note -->${suffix}</p>`, "latex")).toMatch(
			/%[^\n]*note[^\n]*\n\\ Omega/,
		);
	}
	const tex = htmlToMarkup(html, "latex");
	expect(tex).toMatch(/Alpha%[^\n]*note[^\n]*\nOmega/);
	expect(htmlToMarkup(html, "asciidoc")).toMatch(/\/\/.*note/);
	expect(htmlToMarkup(html, "restructuredtext")).toMatch(/\.\.\n +note/);
	for (const lang of ["asciidoc", "restructuredtext"] as const) {
		const code = htmlToMarkup(html, lang);
		expect(code).toContain("AlphaOmega");
		expect(code).not.toContain("raw::");
	}
});
it("does not interpret comment-looking text in LaTeX literal inputs or URLs", () => {
	const source = String.raw`\begin{lstlisting}
% code, not a document comment
\end{lstlisting}
\verb|% literal| \wcScript[type=module]|const text = "% literal";|
\href{https://example.test/a%20b}{Link}
\wcTpRef[href=%entry]{}
Escaped \% text.
% real comment`;
	const protectedSource = protectConversionComments(source, "latex");
	expect(protectedSource.source).toContain("% code, not a document comment");
	expect(protectedSource.source).toContain(String.raw`\verb|% literal|`);
	expect(protectedSource.source).toContain("a%20b");
	expect(protectedSource.source).toContain("href=%entry");
	expect(protectedSource.source).toContain(String.raw`\% text`);
	expect(protectedSource.source).not.toContain("% real comment");
});
it("keeps AsciiDoc source blocks literal and leaves heading/list syntax intact", () => {
	const source =
		"// header comment\n= Title\n\n// item comment\n* Item\n\n[source,javascript]\n----\n// code comment\n----";
	const result = protectConversionComments(source, "asciidoc").source;
	expect(result).toContain("= Titlepass:[");
	expect(result).toContain("* Itempass:[");
	expect(result).toContain("----\n// code comment\n----");
});
