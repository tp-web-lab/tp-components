import { expect, it } from "vitest";
import { convertMarkup } from "./markup-conversion.js";

it("converts without a mounted component and accepts language aliases", async () => {
	const result = await convertMarkup(
		"<h2>Preparation</h2><p>Read <strong>this</strong>.</p>",
		"html",
		"md",
	);
	expect(result).toContain("## Preparation");
	expect(result).toContain("**this**");
	const latex = await convertMarkup(result, "md", "latex");
	expect(latex).toContain("\\section*{");
	expect(latex).toContain("Preparation");
	expect(latex).toContain("\\textbf{this}");
});
it("preserves same-language source and rejects unknown languages", async () => {
	const code = "\n# Exact source  \n";
	expect(await convertMarkup(code, "md", "markdown")).toBe(code);
	await expect(convertMarkup(code, "unknown", "html")).rejects.toThrow(
		"Unsupported markup language",
	);
});

it("omits generated heading tabindex without changing anchors or viewer rendering", async () => {
	const source = "## Workshop\n\n## Another heading";
	const converted = new DOMParser().parseFromString(
		await convertMarkup(source, "md", "html"),
		"text/html",
	);
	expect([...converted.querySelectorAll("h2")].map((h) => h.id)).toEqual([
		"workshop",
		"another-heading",
	]);
	expect(converted.querySelector("[tabindex]")).toBeNull();
	const { renderMarkdownToHtml } = await import("./markdown-source.js");
	expect(await renderMarkdownToHtml(source)).toContain('tabindex="-1"');
});

it("preserves authored heading tabindex, including -1, and raw HTML attributes", async () => {
	const source =
		'## Automatic\n\n## Explicit negative {tabindex=-1}\n\n## Explicit zero {tabindex=0}\n\n## Explicit positive {tabindex=3}\n\n<h2 tabindex="-1">Raw heading</h2>\n\n<div tabindex="0">Focusable block</div>';
	const converted = new DOMParser().parseFromString(
		await convertMarkup(source, "md", "html"),
		"text/html",
	);
	expect(
		[...converted.querySelectorAll("h2")].map((h) =>
			h.getAttribute("tabindex"),
		),
	).toEqual([null, "-1", "0", "3", "-1"]);
	expect(converted.querySelector("div")?.getAttribute("tabindex")).toBe("0");
	const { markupToHtml } = await import("./markup-conversion.js");
	expect(
		await markupToHtml(
			'<h2 tabindex="-1">Authored HTML</h2>',
			"html",
			document.baseURI,
		),
	).toContain('tabindex="-1"');
});

for (const language of ["html", "markdown", "asciidoc"]) {
	it(`preserves semantic document titles through ${language} and native LaTeX`, async () => {
		const source = String.raw`\title{A simple result}\author{Alex \textbf{Example}}\date{October 5, 2026}\maketitle`;
		const code = await convertMarkup(source, "latex", language);
		const html = await convertMarkup(code, language, "html");
		const dom = new DOMParser().parseFromString(html, "text/html");
		expect(dom.querySelector("header.document-title > h1")?.textContent).toBe(
			"A simple result",
		);
		expect(
			dom.querySelector("header.document-title > p.author strong")?.textContent,
		).toBe("Example");
		expect(
			dom.querySelector("header.document-title > p.date")?.textContent,
		).toBe("October 5, 2026");
		expect(dom.querySelector(".vspace,[style]")).toBeNull();
		const restored = await convertMarkup(code, language, "latex");
		expect(restored).toContain("\\maketitle");
		expect(restored).toContain("\\author{Alex \\textbf{Example}}");
		const roundtrip = await convertMarkup(restored, "latex", "html");
		expect(
			new DOMParser()
				.parseFromString(roundtrip, "text/html")
				.querySelector("header.document-title")?.textContent,
		).toBe(dom.querySelector("header.document-title")?.textContent);
	});
}
