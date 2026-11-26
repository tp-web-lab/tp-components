import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

it.each([
	[
		"markdown",
		'<p id="part" class="note" data-kind="example" hidden>Text</p>',
		'data-kind="example" hidden}',
		'p#part.note[hidden][data-kind="example"]',
	],
	[
		"asciidoc",
		'<p><span class="note">Text</span></p>',
		"[.note]#Text#",
		"span.note",
	],
	["asciidoc", "<p><kbd>Ctrl</kbd></p>", "kbd:[Ctrl]", "kbd"],
	["asciidoc", "<aside><p>Text</p></aside>", "****", "aside"],
	[
		"latex",
		'<p>Status <sl-badge variant="success">Ready</sl-badge>.</p>',
		"\\wcSlBadge*",
		'p sl-badge[variant="success"]',
	],
] as const)(
	"prefers documented native forms in %s (%s)",
	async (language, html, syntax, selector) => {
		const source = htmlToMarkup(html, language);
		expect(source).toContain(syntax);
		const restored = await markupToHtml(source, language, document.baseURI);
		const root = document.createElement("div");
		root.innerHTML = restored;
		expect(root.querySelector(selector)).not.toBeNull();
		expect(root.textContent?.trim()).toBe(
			new DOMParser()
				.parseFromString(html, "text/html")
				.body.textContent?.trim(),
		);
		expect(htmlToMarkup(restored, language)).toContain(syntax);
	},
);

it.each(["markdown", "asciidoc", "latex", "restructuredtext"] as const)(
	"exports a standalone stylesheet in %s",
	(language) => {
		const source = htmlToMarkup(
			"<style>.note { color: red; }</style>",
			language,
		);
		expect(source.toLowerCase()).toContain("style");
		expect(source).toContain("red");
	},
);
it.each(["markdown", "asciidoc", "latex"] as const)(
	"preserves a standalone stylesheet through %s",
	async (language) => {
		const html = "<style>.note { color: red; }</style>";
		const source = htmlToMarkup(html, language);
		const restored = await markupToHtml(source, language, document.baseURI);
		const root = document.createElement("template");
		root.innerHTML = restored;
		expect(root.content.querySelector("style")?.textContent?.trim()).toBe(
			".note { color: red; }",
		);
	},
);
it("does not accumulate invisible characters in LaTeX quotes", async () => {
	const source = htmlToMarkup("<blockquote>Text</blockquote>", "latex");
	const html = await markupToHtml(source, "latex", document.baseURI);
	expect(html).not.toContain("\u200b");
	expect(
		await markupToHtml(htmlToMarkup(html, "latex"), "latex", document.baseURI),
	).toBe(html);
});
it.each(["markdown", "asciidoc", "restructuredtext"] as const)(
	"keeps simple %s lists compact",
	(language) => {
		expect(
			htmlToMarkup("<ul><li>One</li><li>Two</li></ul>", language),
		).not.toContain("\n\n");
	},
);
it("uses native RST containers and generic roles", () => {
	expect(htmlToMarkup("<hr>", "restructuredtext")).toBe("----");
	expect(
		htmlToMarkup("<p>Before.</p><hr><p>After.</p>", "restructuredtext"),
	).toContain("----");
	expect(
		htmlToMarkup('<div class="note"><p>Text</p></div>', "restructuredtext"),
	).toContain(".. container:: note");
	const span = htmlToMarkup(
		'<p><span class="note">Text</span></p>',
		"restructuredtext",
	);
	expect(span).toContain(":class: note");
	expect(span).not.toContain("(span)");
});
