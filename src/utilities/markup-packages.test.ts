import { describe, expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

describe("LaTeX conversion dependencies", () => {
	it("does not add packages to paragraphs or basic formatting", () => {
		const code = htmlToMarkup(
			"<p>Hello <strong>world</strong>.<br>Next line.</p>",
			"latex",
		);
		expect(code).not.toContain("\\usepackage");
		expect(code).not.toContain("\\documentclass");
		expect(code).not.toContain("\\begin{document}");
		expect(code).not.toContain("\\end{document}");
	});
	it("uses the built-in quote environment without loading csquotes", () => {
		const code = htmlToMarkup(
			"<blockquote><p>Quotation</p></blockquote>",
			"latex",
		);
		expect(code).toContain("\\begin{quote}");
		expect(code).not.toContain("\\usepackage");
	});
	it("renders chapter and section fragments without a document envelope", async () => {
		const code = htmlToMarkup(
			'<h1>Guide</h1><h2>Introduction</h2><p><a href="https://example.org">Link</a></p>',
			"latex",
		);
		expect(code).not.toContain("\\documentclass");
		expect(code).not.toContain("\\begin{document}");
		expect(code).toContain("\\usepackage{hyperref}");
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(code, "latex", document.baseURI);
		expect(root.querySelector("h1")?.textContent).toContain("Guide");
		expect(root.querySelector("h2")?.textContent).toContain("Introduction");
		expect(root.querySelector("a")?.getAttribute("href")).toBe(
			"https://example.org",
		);
	});
	it.each([
		['<p><a href="https://example.org">Link</a></p>', "hyperref"],
		['<img src="image.svg" alt="Image">', "graphicx"],
		['<audio src="sound.mp3" controls></audio>', "multimedia"],
		["<p><del>Old</del></p>", "ulem"],
		['<ol start="3"><li>Third</li></ol>', "enumitem"],
		[
			"<tp-math>\\begin{pmatrix}1 &amp; 2 \\\\ 3 &amp; 4\\end{pmatrix}</tp-math>",
			"amsmath",
		],
	])("includes the dependency for %s", (html, dependency) => {
		const declarations = htmlToMarkup(html, "latex").match(
			/\\usepackage(?:\[[^\]]*\])?\{[^}]+\}/g,
		);
		expect(declarations).toHaveLength(1);
		expect(declarations?.[0]).toContain(`{${dependency}}`);
	});
	it("ignores package commands shown as literal source code", () => {
		const code = htmlToMarkup(
			"<pre><code>\\includegraphics{example} \\textcolor{red}{hello}</code></pre>",
			"latex",
		);
		expect(code.match(/\\usepackage[^\n]+/g)).toEqual([
			"\\usepackage{listings}",
		]);
	});
});

describe("cheat sheet conversion regressions", () => {
	it("keeps inserted Markdown prose out of code elements", async () => {
		const code = htmlToMarkup(
			"<p><code>Code</code> and <ins>Inserted text</ins></p>",
			"markdown",
		);
		const html = await markupToHtml(code, "markdown", document.baseURI);
		const root = document.createElement("div");
		root.innerHTML = html;
		expect(root.querySelectorAll("code")).toHaveLength(1);
		expect(root.querySelector("ins")?.innerHTML).toBe("Inserted text");
	});
	it("leaves default LaTeX table borders to the shared stylesheet", async () => {
		const code = htmlToMarkup(
			"<table><thead><tr><th>Item</th></tr></thead><tbody><tr><td>Value</td></tr></tbody></table>",
			"latex",
		);
		expect(code).not.toMatch(/hlines|vlines/);
		const { renderLatexToHtml } = await import("@tp/tp-latex");
		const html = renderLatexToHtml(code);
		expect(html).not.toMatch(/border-|font-weight/);
	});
	it("keeps brackets in links and superscripts in LaTeX", async () => {
		const html = '<p><a href="#note">[note]</a> <sup>[1]</sup></p>';
		const rendered = await markupToHtml(
			htmlToMarkup(html, "latex"),
			"latex",
			"https://example.org/",
		);
		const root = document.createElement("div");
		root.innerHTML = rendered;
		expect(root.querySelector("a")?.textContent).toBe("[note]");
		expect(root.querySelector("sup")?.textContent).toBe("[1]");
	});
	it("keeps formatting and literal characters through Markdown", async () => {
		const html =
			"<p>&lt;p&gt; *literal* <mark>highlighted</mark> H<sub>2</sub>O <del>old</del> <ins>new</ins></p>";
		const code = htmlToMarkup(html, "markdown");
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(
			code,
			"markdown",
			"https://example.org/",
		);
		expect(root.textContent).toContain("<p> *literal*");
		for (const selector of ["mark", "sub", "s,del", "ins"])
			expect(root.querySelector(selector)).not.toBeNull();
	});
	it("uses native display mathematics and preserves it on import", async () => {
		const html =
			'<p>Formula:</p><tp-math displaystyle value="\\frac{a}{b}"></tp-math>';
		const code = htmlToMarkup(html, "markdown");
		expect(code).toContain("```latexmath");
		expect(code).not.toContain(":tp-math");
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(
			code,
			"markdown",
			"https://example.org/",
		);
		expect(
			root.querySelector("tp-math[displaystyle]")?.getAttribute("value"),
		).toBe("\\frac{a}{b}");
	});
	it("does not add blank lines to native LaTeX figures and quotes", async () => {
		for (const html of [
			'<figure>\n<img src="sample.svg"><figcaption>Caption</figcaption>\n</figure>',
			"<blockquote>\n<p>Quotation.</p>\n<footer>Author</footer>\n</blockquote>",
		]) {
			const rendered = await markupToHtml(
				htmlToMarkup(html, "latex"),
				"latex",
				"https://example.org/",
			);
			expect(rendered).not.toContain("<br>");
		}
	});
	it("preserves a header cell in the table body", async () => {
		const html =
			'<table><thead><tr><th colspan="2">Workshop</th></tr></thead><tbody><tr><th rowspan="2">Morning</th><td>Introduction</td></tr><tr><td>Practice</td></tr></tbody></table>';
		const asciidoc = htmlToMarkup(html, "asciidoc");
		expect(asciidoc).toContain("h|Morning");
		expect(asciidoc).not.toContain("[table]");
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(
			htmlToMarkup(html, "latex"),
			"latex",
			"https://example.org/",
		);
		expect(root.querySelector("tbody th")?.textContent).toBe("Morning");
		expect(root.querySelector("tbody th")?.getAttribute("rowspan")).toBe("2");
	});
	it("exports description lists and thematic breaks natively", () => {
		expect(
			htmlToMarkup("<dl><dt>Term</dt><dd>Meaning</dd></dl>", "latex"),
		).toContain("\\begin{description}");
		expect(htmlToMarkup("<hr>", "markdown")).toBe("---");
	});
});
