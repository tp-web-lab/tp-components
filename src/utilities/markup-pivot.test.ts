import { expect, it } from "vitest";
import { markupToHtml } from "./markup-conversion.js";

const parse = (html: string) =>
	new DOMParser().parseFromString(html, "text/html");
const base = "https://example.test/document/";

it.each([
	["markdown", "| Item | Value |\n| --- | --- |\n| A | 1 |"],
	[
		"asciidoc",
		"[source,javascript]\n----\nconst n = 1;\n----\n\n[quote]\n____\nQuote\n____\n\nimage::a.svg[Image]",
	],
	[
		"latex",
		String.raw`\usepackage{listings}\begin{lstlisting}[language=JavaScript]
const n = 1;
\end{lstlisting}`,
	],
] as const)(
	"removes generated presentation artifacts from %s",
	async (language, source) => {
		const html = await markupToHtml(source, language, base);
		const doc = parse(html);
		expect(
			doc.querySelector(
				".tp-md-table,.tp-md-table-number,.highlight,.imageblock,.quoteblock,.reference,.external,.literal-block,[data-lang],[data-tp-latex-listing],[data-tp-pivot-authored]",
			),
			html,
		).toBeNull();
		if (language !== "markdown")
			expect(
				doc.querySelector("code.language-javascript")?.textContent,
			).toContain("const n = 1;");
	},
);

const authored =
	'<section class="sect1" id="authored"><p class="title" style="color:red">Author</p><span class="image"><img src="a.svg" style="width:120px"></span><pre class="highlight code literal-block"><code data-lang="javascript" class="language-javascript">literal</code></pre><a class="reference external" href="#authored">Link</a><div class="body"><span class="bf">Preserved</span></div><p><audio src="a.wav"></audio></p></section>';

it.each(["html", "markdown", "asciidoc", "latex"] as const)(
	"preserves explicitly authored HTML attributes and wrappers from %s",
	async (language) => {
		const source =
			language === "asciidoc"
				? `++++\n${authored}\n++++`
				: language === "latex"
					? `\\rawhtml|${authored}|`
					: authored;
		const html = await markupToHtml(source, language, base);
		const doc = parse(html);
		expect(
			doc
				.querySelector("section.sect1#authored > p.title")
				?.getAttribute("style"),
			html,
		).toBe("color:red");
		expect(
			doc.querySelector("span.image > img")?.getAttribute("style"),
			html,
		).toBe("width:120px");
		expect(
			doc
				.querySelector("pre.highlight.code.literal-block > code")
				?.getAttribute("data-lang"),
			html,
		).toBe("javascript");
		expect(
			doc.querySelector("a.reference.external")?.getAttribute("href"),
			html,
		).toBe("#authored");
		expect(doc.querySelector("div.body > span.bf")?.textContent, html).toBe(
			"Preserved",
		);
		expect(doc.querySelector("p > audio"), html).not.toBeNull();
		expect(html).not.toContain("data-tp-pivot-authored");
	},
);

it.each([
	["markdown", "| Item |\n| --- |\n| A |\n{.tp-md-table}"],
	[
		"asciidoc",
		'[source,javascript,role="highlight"]\n----\nconst n = 1;\n----',
	],
	["latex", String.raw`\wcDiv[class=body]{\wcSpan*[class=bf]{Author}}`],
] as const)(
	"keeps explicitly assigned classes even when their names look technical in %s",
	async (language, source) => {
		const html = await markupToHtml(source, language, base);
		const selector = {
			markdown: ".tp-md-table",
			asciidoc: "pre.highlight",
			restructuredtext: "pre.literal-block",
			latex: "div.body > span.bf",
		}[language];
		expect(parse(html).querySelector(selector), html).not.toBeNull();
		expect(html).not.toContain("data-tp-pivot-authored");
	},
);

it.each(["html", "markdown", "latex"] as const)(
	"preserves literal script text and comments in %s",
	async (language) => {
		const source =
			'<div class="body"><script type="text/plain">const sample = "<span class=bf>text</span>";</script><!-- <div>example</div> --><img style="width:120px" src="a.svg"></div>';
		const html = await markupToHtml(
			language === "latex" ? `\\rawhtml|${source}|` : source,
			language,
			base,
		);
		expect(parse(html).querySelector("script")?.textContent).toBe(
			'const sample = "<span class=bf>text</span>";',
		);
		expect(html).toContain("<!-- <div>example</div> -->");
		expect(parse(html).querySelector("img")?.getAttribute("style")).toBe(
			"width:120px",
		);
		expect(html).not.toContain("data-tp-pivot-authored");
	},
);
