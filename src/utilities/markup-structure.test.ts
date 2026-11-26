import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

const base = "http://localhost:4173/";
function root(html: string) {
	const element = document.createElement("div");
	element.innerHTML = html;
	return element;
}
it.each(["markdown", "asciidoc"] as const)(
	"preserves multiple heading anchors through %s",
	async (language) => {
		const html =
			'<h2 id="main"><span id="alias"></span><span id="other"></span>Title</h2><p><a href="#alias">Link</a></p>';
		const code = htmlToMarkup(html, language);
		expect(code).not.toMatch(/:span:|\[span|::: span/);
		const rendered = await markupToHtml(code, language, base);
		for (const id of ["main", "alias", "other"])
			expect(root(rendered).querySelector(`#${id}`), code).not.toBeNull();
		for (const target of ["markdown", "asciidoc"] as const) {
			const next = htmlToMarkup(rendered, target);
			const output = root(await markupToHtml(next, target, base));
			for (const id of ["main", "alias", "other"])
				expect(output.querySelector(`#${id}`), next).not.toBeNull();
		}
	},
);
it("uses native RST headings with an explicit starting level", () => {
	const code = htmlToMarkup(
		'<h2 id="first">First</h2><p>Text.</p><h3>Child</h3>',
		"restructuredtext",
	);
	expect(code).toContain(".. heading-level:: 2");
	expect(code).not.toMatch(/\.\. h[23]::/);
});
it("round-trips a Markdown image caption with inline formatting", async () => {
	const html =
		'<figure><img src="image.svg" alt="Diagram" width="120"><figcaption>A <strong>bold</strong> caption</figcaption></figure>';
	const code = htmlToMarkup(html, "markdown");
	expect(code).not.toContain(":::");
	const output = root(await markupToHtml(code, "markdown", base));
	expect(
		output.querySelector("figure > img")?.getAttribute("width"),
		code,
	).toBe("120");
	expect(output.querySelector("figcaption strong")?.textContent).toBe("bold");
	for (const language of ["asciidoc", "latex"] as const) {
		const rendered = await markupToHtml(
			htmlToMarkup(output.innerHTML, language),
			language,
			base,
		);
		const back = htmlToMarkup(rendered, "markdown");
		expect(back, rendered).not.toContain("::: figure");
		expect(
			root(await markupToHtml(back, "markdown", base)).querySelector(
				"figcaption",
			)?.textContent,
		).toContain("caption");
	}
});
it("round-trips numbered Markdown fences without altering source whitespace", async () => {
	const value = '  const text = "<tag>";\n\t~~~\n';
	const element = document.createElement("tp-code-editor");
	element.setAttribute("readonly", "");
	element.setAttribute("line-numbers", "");
	element.setAttribute("line-number-start", "12");
	element.setAttribute("language", "javascript");
	element.setAttribute("value", value);
	const code = htmlToMarkup(element.outerHTML, "markdown");
	expect(code).toContain("numbers=left");
	expect(code).not.toContain("tp-code-editor");
	const output = root(await markupToHtml(code, "markdown", base)).querySelector(
		"tp-code-editor",
	);
	expect(output?.getAttribute("value"), code).toBe(value);
	expect(output?.getAttribute("line-number-start")).toBe("12");
});
it.each(["asciidoc", "latex"] as const)(
	"round-trips numbered fences via %s",
	async (language) => {
		const code =
			'~~~javascript {numbers=left firstnumber=20}\nconst x = "<tag>";\nconsole.log(x);\n~~~';
		const html = await markupToHtml(code, "markdown", base);
		const converted = await markupToHtml(
			htmlToMarkup(html, language),
			language,
			base,
		);
		const back = htmlToMarkup(converted, "markdown");
		expect(back).toContain("firstnumber=20");
		const editor = root(
			await markupToHtml(back, "markdown", base),
		).querySelector("tp-code-editor");
		expect(editor?.getAttribute("value")).toBe(
			'const x = "<tag>";\nconsole.log(x);',
		);
	},
);

it("keeps a captionless image as a figure", async () => {
	const code = htmlToMarkup(
		'<figure><img src="image.svg" alt="A" width="120"></figure>',
		"markdown",
	);
	expect(code).toContain("{figure}");
	const output = root(await markupToHtml(code, "markdown", base));
	expect(output.querySelector("figure img")).not.toBeNull();
	expect(output.querySelector("figcaption")).toBeNull();
});
it("does not discard text beside a figure image", () => {
	const code = htmlToMarkup(
		'<figure>Extra text<img src="image.svg" alt="A"><figcaption>Caption</figcaption></figure>',
		"markdown",
	);
	expect(code).toContain("Extra text");
});

it("quotes underscore-prefixed RST targets", () => {
	const code = htmlToMarkup(
		'<h2 id="_workshop">Workshop</h2>',
		"restructuredtext",
	);
	expect(code).toContain(".. _`_workshop`:");
});
