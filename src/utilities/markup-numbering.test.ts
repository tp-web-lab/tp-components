import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

const source = `---
sectionNumbering:
  enabled: true
  maxLevel: 3
  start: [2, 3]
figureNumbering:
  enabled: true
  prefix: "2."
  start: 7
tableNumbering:
  enabled: true
codeNumbering:
  enabled: true
---
## Results {#results}

### Detail

![Diagram](image.svg)
[An illustration]

| Name | Value |
| --- | --- |
| A | 1 |
[Measurements]

:::: figure
~~~scheme
(+ 1 2)
~~~
::: figcaption
Calculation
:::
::::
`;
const labels = [
	"2.3 Results",
	"2.3.1 Detail",
	"Figure 2.7. An illustration",
	"Table 1. Measurements",
	"Code 1. Calculation",
];
const text = (html: string) =>
	new DOMParser()
		.parseFromString(html, "text/html")
		.body.textContent?.normalize("NFKC")
		.replace(/\s+/g, " ");
it("preserves counter rules and generated marker spans in the pivot", async () => {
	const html = await markupToHtml(source, "markdown", document.baseURI);
	for (const label of labels) expect(text(html)).toContain(label);
	expect(html).toContain("data-tp-numbering");
});
it.each(["html", "markdown", "asciidoc", "latex"] as const)(
	"retains resolved numbers on %s round trips using native headings",
	async (language) => {
		const pivot = await markupToHtml(source, "markdown", document.baseURI);
		const code = htmlToMarkup(pivot, language);
		if (language !== "html")
			expect(code).not.toMatch(/data-(?:section|object)-number/);
		if (language === "markdown") {
			expect(code).toContain("## Results");
			expect(code).toContain("| Name | Value |");
			expect(code).toContain("[Measurements][measurements]");
			expect(code).not.toContain("::: table");
		}
		if (language === "asciidoc") expect(code).toMatch(/=+ Results/);
		if (language === "latex")
			expect(code).toContain("\\section{\\hypertarget{results}{Results}}");
		const html = await markupToHtml(code, language, document.baseURI);
		for (const label of labels) expect(text(html), code).toContain(label);
		const back = await markupToHtml(
			htmlToMarkup(html, "markdown"),
			"markdown",
			document.baseURI,
		);
		for (const label of labels) expect(text(back)).toContain(label);
	},
);
it("retains explicitly authored numbering marker attributes", async () => {
	const html = await markupToHtml(
		'<span data-section-number="author">Manual</span>',
		"markdown",
		document.baseURI,
	);
	expect(html).toContain('data-section-number="author"');
});

const additions = {
	html: '<h2>Added section</h2><figure><img src="extra.svg"><figcaption>Added figure</figcaption></figure><table><caption>Added table</caption><tr><th>A</th></tr><tr><td>2</td></tr></table><figure><pre><code>42</code></pre><figcaption>Added code</figcaption></figure>',
	markdown:
		"\n\n## Added section\n\n![Extra](extra.svg)\n[Added figure]\n\n| A |\n| - |\n| 2 |\n[Added table]\n\n:::: figure\n~~~text\n42\n~~~\n::: figcaption\nAdded code\n:::\n::::",
	asciidoc:
		'\n\n== Added section\n\n.Added figure\n[caption=""]\nimage::extra.svg[Extra]\n\n.Added table\n[caption=""]\n|===\n|A\n|2\n|===\n\n.Added code\n[source,text]\n----\n42\n----',
	latex:
		"\n\\section{Added section}\n\\begin{figure}\\includegraphics{extra.svg}\\caption{Added figure}\\end{figure}\n\\begin{table}\\begin{tabular}{l}A\\\\2\\end{tabular}\\caption{Added table}\\end{table}\n\\begin{figure}\n\\begin{lstlisting}\n42\n\\end{lstlisting}\n\\caption{Added code}\\end{figure}",
};
it.each(["html", "markdown", "asciidoc", "latex"] as const)(
	"renumbers inserted native objects after %s conversion and on return",
	async (language) => {
		const pivot = await markupToHtml(source, "markdown", document.baseURI);
		const code = htmlToMarkup(pivot, language) + additions[language];
		const html = await markupToHtml(code, language, document.baseURI);
		for (const label of [
			"2.4 Added section",
			"Figure 2.8. Added figure",
			"Table 2. Added table",
			"Code 2. Added code",
		])
			expect(text(html), `${code}\n${html}`).toContain(label);
		const back = htmlToMarkup(html, "markdown");
		expect(back).toContain("sectionNumbering:");
		expect(back).not.toContain("## 2.4 Added");
		const rendered = await markupToHtml(back, "markdown", document.baseURI);
		for (const label of [
			"2.4 Added section",
			"Figure 2.8. Added figure",
			"Table 2. Added table",
			"Code 2. Added code",
		])
			expect(text(rendered), back).toContain(label);
	},
);

it.each(["html", "markdown", "asciidoc", "latex"] as const)(
	"keeps exclusions and empty/abbreviated labels through %s",
	async (language) => {
		for (const label of ["", "Fig."]) {
			const configured = source
				.replace(
					"figureNumbering:\n  enabled: true",
					`figureNumbering:\n  enabled: true\n  label: ${JSON.stringify(label)}`,
				)
				.replace("## Results", "## Aside {.unnumbered}\n\n## Results");
			const initial = await markupToHtml(
				configured,
				"markdown",
				document.baseURI,
			);
			const rendered = await markupToHtml(
				htmlToMarkup(initial, language),
				language,
				document.baseURI,
			);
			const doc = new DOMParser().parseFromString(rendered, "text/html");
			expect(doc.querySelector("h2")?.textContent?.trim()).toBe("Aside");
			expect(doc.querySelector("#results")?.textContent?.trim()).toBe(
				"2.3 Results",
			);
			expect(doc.querySelector("figure figcaption")?.textContent?.trim()).toBe(
				`${label ? `${label} ` : ""}2.7. An illustration`,
			);
			const back = await markupToHtml(
				htmlToMarkup(rendered, "markdown"),
				"markdown",
				document.baseURI,
			);
			expect(
				new DOMParser()
					.parseFromString(back, "text/html")
					.querySelector("figure figcaption")
					?.textContent?.trim(),
			).toBe(`${label ? `${label} ` : ""}2.7. An illustration`);
		}
	},
);

it("does not interpret declarations displayed inside native code blocks", async () => {
	const adoc =
		"[source,asciidoc]\n----\n:sectnums:\n:figure-numbering:\n----\n\n== Plain title";
	const latex = String.raw`\usepackage{listings}
\begin{lstlisting}
\setcounter{secnumdepth}{2}
\setcounter{figure}{5}
\end{lstlisting}
\section*{Plain title}`;
	for (const [language, code] of [
		["asciidoc", adoc],
		["latex", latex],
	] as const) {
		const html = await markupToHtml(code, language, document.baseURI);
		expect(html).not.toContain("data-tp-numbering=");
		expect(
			new DOMParser()
				.parseFromString(html, "text/html")
				.querySelector("pre code")?.textContent,
		).toContain(
			language === "latex" ? "\\setcounter{figure}{5}" : ":figure-numbering:",
		);
	}
});

it.each(["html", "markdown", "asciidoc", "latex"] as const)(
	"retains independent exercise and example counters through %s",
	async (language) => {
		const source = `---
exerciseNumbering:
  enabled: true
  start: 7
  prefix: "2."
exampleNumbering:
  enabled: true
  label: "Ex."
---
:strong:\`Solve this.\`{id="exercise" data-numbering="exercise"}

:strong:\`Try this.\`{id="example" data-numbering="example"}

::: tp-scheme-interpreter-question {id="question" data-numbering="exercise" src="exercise.md"}
:::
`;
		const pivot = await markupToHtml(source, "markdown", document.baseURI);
		expect(text(pivot)).toContain("Exercise 2.7. Solve this.");
		expect(text(pivot)).toContain("Ex. 1. Try this.");
		expect(pivot).toContain('data-tp-numbering-title="Exercise 2.8"');
		const code = htmlToMarkup(pivot, language);
		if (language !== "html")
			expect(code).not.toContain("data-tp-numbering-title");
		const html = await markupToHtml(code, language, document.baseURI);
		expect(text(html), `${code}\n${html}`).toContain(
			"Exercise 2.7. Solve this.",
		);
		expect(text(html)).toContain("Ex. 1. Try this.");
		expect(html).toContain('data-tp-numbering-title="Exercise 2.8"');
		const back = htmlToMarkup(html, "markdown");
		expect(back).toContain("exerciseNumbering:");
		expect(back).toContain("exampleNumbering:");
	},
);

it("numbers new exercises and examples independently and skips exclusions", async () => {
	const source = `---
exerciseNumbering:
  enabled: true
exampleNumbering:
  enabled: true
  label: ""
---
:span:\`A\`{data-numbering="exercise"}

:span:\`Skipped\`{data-numbering="exercise" .unnumbered}

:span:\`B\`{data-numbering="example" data-number="4"}
`;
	const first = await markupToHtml(source, "markdown", document.baseURI);
	const changed = await markupToHtml(
		first +
			'<span data-numbering="exercise">C</span><span data-numbering="example">D</span>',
		"html",
		document.baseURI,
	);
	const root = new DOMParser().parseFromString(changed, "text/html");
	expect(
		[...root.querySelectorAll("[data-object-number]")].map(
			(n) => n.textContent,
		),
	).toEqual(["Exercise 1. ", "4. ", "Exercise 2. ", "5. "]);
});
