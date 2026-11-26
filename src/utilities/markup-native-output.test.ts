import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { formatMarkupHtml } from "./format-markup-html.js";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { nativeLatexSources } from "./markup-latex-package-fixtures.js";

it.each(["asciidoc", "restructuredtext"] as const)(
	"converts the actual introduction to a native %s table",
	async (language) => {
		const examples = document.createElement("template");
		examples.innerHTML = readFileSync(
			"public/docs/components/markup-converter/examples/examples.html",
			"utf8",
		);
		const content = examples.content.querySelector("template")?.content;
		const source =
			content?.querySelector('[label="Basic usage"] script')?.textContent ?? "";
		const html = await markupToHtml(
			source.replace(/^ {6}/gm, ""),
			"markdown",
			document.baseURI,
		);
		const converted = htmlToMarkup(html, language);
		expect(converted, html).toContain(
			language === "asciidoc"
				? "|==="
				: ".. list-table:: Science and illustration",
		);
		expect(converted).toContain("scienceandillustration");
		expect(converted).not.toMatch(/\[table\]|\.\. html-table::/);
		if (language === "asciidoc") {
			const rendered = document.createElement("div");
			rendered.innerHTML = await markupToHtml(
				converted,
				language,
				document.baseURI,
			);
			expect(rendered.querySelector("table")?.id).toBe(
				"scienceandillustration",
			);
			expect(rendered.querySelector("table img")?.getAttribute("width")).toBe(
				"160",
			);
			expect(rendered.querySelector("table tp-math")?.textContent).toContain(
				"E = mc^2",
			);
		}
	},
);

it.each(["markdown", "html"] as const)(
	"does not center a captioned table converted from %s",
	async (language) => {
		const examples = document.createElement("template");
		examples.innerHTML = readFileSync(
			"public/docs/components/markup-converter/examples/examples.html",
			"utf8",
		);
		const content = examples.content.querySelector("template")?.content;
		const label = language === "markdown" ? "Basic usage" : "HTML source";
		const source =
			content?.querySelector(`[label="${label}"] script`)?.textContent ?? "";
		const html = await markupToHtml(
			source.replace(/^ {6}/gm, ""),
			language,
			document.baseURI,
		);
		const converted = htmlToMarkup(html, "latex");
		expect(converted).not.toContain("\\centering");
		expect(converted).toContain("\\caption{Science and illustration}");
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(converted, "latex", document.baseURI);
		expect(root.querySelector("table")).not.toBeNull();
		expect(
			root
				.querySelector("table")
				?.closest('.center,[style*="text-align: center"]'),
			root.innerHTML,
		).toBeNull();
	},
);

it("indents table structures without rewriting literal code or inline spaces", () => {
	const source =
		"<table><tbody><tr><td><pre><code>  one\n\n    two</code></pre></td><td>A <strong>B</strong> C</td></tr></tbody></table>";
	const formatted = formatMarkupHtml(source);
	expect(formatted).toContain("\n    <tr>\n      <td>");
	expect(formatted).toContain("<pre><code>  one\n\n    two</code></pre>");
	expect(formatted).toContain("<td>A <strong>B</strong> C</td>");
	expect(formatMarkupHtml(formatted)).toBe(formatted);
});

it("leaves mixed phrasing and whitespace-sensitive elements intact", () => {
	for (const html of [
		"A<span>B</span>C",
		"<p>A  <em>B</em> C</p>",
		"<script>  const a = 1;\n\n</script>",
		'<div style="white-space:pre">  a\n b</div>',
	])
		expect(formatMarkupHtml(html)).toBe(html);
});

it("uses native AsciiDoc cell specifiers instead of a component table", async () => {
	const source = htmlToMarkup(nativeLatexSources.html, "asciidoc");
	expect(source).toContain("|===");
	expect(source).toContain(">.^|");
	expect(source).not.toContain("[table");
	const output = document.createElement("div");
	output.innerHTML = await markupToHtml(source, "asciidoc", document.baseURI);
	const cell = output.querySelector<HTMLElement>("tbody tr td:last-child");
	expect(cell?.style.textAlign).toBe("right");
	expect(cell?.style.verticalAlign).toBe("middle");
	expect(output.querySelector("pre code")?.textContent?.trimEnd()).toBe(
		'if ready:\n  print("ready")',
	);
});

it("does not inject a table stylesheet when parsing Markdown", async () => {
	await markupToHtml(
		"| Item | Value |\n| --- | --- |\n| A | 2 |",
		"markdown",
		document.baseURI,
	);
	expect(document.getElementById("tp-md-tables-styles")).toBeNull();
});

it("uses native RST classes for paragraphs inside semantic containers", () => {
	const code = htmlToMarkup(
		'<header class="document-details"><p class="author">Alex <strong>Example</strong></p></header>',
		"restructuredtext",
	);
	expect(code).toContain(".. html-header::");
	expect(code).toContain("   .. class:: author\n\n   Alex **Example**");
	expect(code).not.toContain(".. p::");
});

it("uses native RST classes for bibliographies and paragraphs with targets", () => {
	const bibliography = htmlToMarkup(
		'<ul class="bibliography"><li><span id="guide"></span>[guide] Alex. <em>Workshop guide</em>. 2026.</li></ul>',
		"restructuredtext",
	);
	expect(bibliography).toContain(".. class:: bibliography");
	expect(bibliography).not.toMatch(/\.\. (ul|li)::/);
	const paragraph = htmlToMarkup(
		'<p id="workshop" class="introduction">This paragraph has an ID and a class.</p>',
		"restructuredtext",
	);
	expect(paragraph).toBe(
		".. _workshop:\n\n.. class:: introduction\n\nThis paragraph has an ID and a class.",
	);
});
it("keeps HTML semantics and unsupported attributes when class alone is insufficient", () => {
	for (const tag of ["header", "nav", "footer", "aside"]) {
		const code = htmlToMarkup(
			`<${tag} class="example"><p>Content</p></${tag}>`,
			"restructuredtext",
		);
		expect(code).toContain(":class: example");
		expect(code).not.toContain(".. class:: example");
	}
	const code = htmlToMarkup(
		'<p class="author" lang="en">Alex</p>',
		"restructuredtext",
	);
	expect(code).toContain(".. attributes::");
	expect(code).not.toContain(".. p::");
	expect(code).toContain(":lang: en");
});

it("writes compact native AsciiDoc list items and preserves their structure", async () => {
	const source =
		'<ul><li>First</li><li>Second<ul><li>Nested one</li><li>Nested two</li></ul></li><li>Last</li></ul><ol><li>One</li><li>Two</li></ol><ul><li><audio src="https://example.org/a.ogg" controls></audio></li><li>After audio</li></ul>';
	const converted = htmlToMarkup(source, "asciidoc");
	expect(converted).toContain(
		"* First\n* Second\n** Nested one\n** Nested two\n* Last",
	);
	expect(converted).toContain(". One\n. Two");
	const rendered = document.createElement("div");
	rendered.innerHTML = await markupToHtml(
		converted,
		"asciidoc",
		document.baseURI,
	);
	expect(rendered.querySelectorAll("li")).toHaveLength(9);
	expect(rendered.querySelectorAll("ul > li > ul > li")).toHaveLength(2);
	expect(rendered.querySelectorAll(":scope > ul")).toHaveLength(2);
	expect(rendered.querySelectorAll(":scope > ol")).toHaveLength(1);
	expect(rendered.querySelector("li > audio")?.getAttribute("src")).toBe(
		"https://example.org/a.ogg",
	);
});

it("uses native paragraph anchors without rewriting identifiers", async () => {
	const source =
		'<p id="part">Read the <strong>guide</strong>.</p><p><a href="#part">Back</a></p>';
	const adoc = htmlToMarkup(source, "asciidoc");
	expect(adoc).toContain("[[part]]\nRead the *guide*.");
	expect(adoc).not.toContain("[p,");
	const rst = htmlToMarkup(source, "restructuredtext");
	expect(rst).toContain(".. _part:\n\nRead the **guide**.");
	expect(rst).not.toContain(".. p::");
	// TP preserves the original spelling of native explicit targets.
	expect(
		htmlToMarkup('<p id="Part_Name">Text</p>', "restructuredtext"),
	).toContain(".. _Part_Name:");
	expect(
		htmlToMarkup('<p id="part" data-example="kept">Text</p>', "asciidoc"),
	).toContain('data-example="kept"');
	const html = await markupToHtml(adoc, "asciidoc", document.baseURI);
	const root = document.createElement("div");
	root.innerHTML = html;
	expect(root.querySelector("p#part > strong")?.textContent).toBe("guide");
	expect(root.querySelector('a[href="#part"]')?.textContent).toBe("Back");
	expect(htmlToMarkup(html, "asciidoc")).toContain("[[part]]");
});

it("round-trips paragraph attributes through a native AsciiDoc attribute list", async () => {
	const html =
		'<p id="part" class="note" data-kind="" hidden>Text with <strong>emphasis</strong>.</p>';
	const source = htmlToMarkup(html, "asciidoc");
	expect(source).toBe(
		'[#part.note%hidden,data-kind=""]\nText with *emphasis*.',
	);
	const back = await markupToHtml(source, "asciidoc", document.baseURI);
	const root = document.createElement("div");
	root.innerHTML = back;
	const paragraph = root.querySelector("p#part.note");
	expect(root.querySelectorAll("p")).toHaveLength(1);
	expect(paragraph?.getAttribute("data-kind")).toBe("");
	expect(paragraph?.hasAttribute("hidden")).toBe(true);
	expect(paragraph?.querySelector("strong")?.textContent).toBe("emphasis");
	expect(htmlToMarkup(back, "asciidoc")).toBe(source);
});
