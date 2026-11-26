import { expect, it } from "vitest";
import { markupToHtml } from "./markup-conversion.js";

it("preserves heading levels through LaTeX conversion", async () => {
	const { htmlToMarkup } = await import("./markup-conversion.js");
	const html = Array.from(
		{ length: 6 },
		(_, index) => `<h${index + 1}>Level ${index + 1}</h${index + 1}>`,
	).join("");
	const rendered = await markupToHtml(
		htmlToMarkup(html, "latex"),
		"latex",
		document.baseURI,
	);
	const root = document.createElement("div");
	root.innerHTML = rendered;
	expect(
		[...root.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
			(heading) => heading.tagName,
		),
	).toEqual(["H1", "H2", "H3", "H4", "H5", "H6"]);
});

it("uses explicit reStructuredText headings when levels cannot be inferred natively", async () => {
	const { htmlToMarkup } = await import("./markup-conversion.js");
	expect(
		htmlToMarkup(
			"<h2>Second level</h2><h4>Fourth level</h4>",
			"restructuredtext",
		),
	).toMatch(/\.\. h2::/);
	expect(
		htmlToMarkup(
			"<h2>Second level</h2><h4>Fourth level</h4>",
			"restructuredtext",
		),
	).toMatch(/\.\. h4::/);
});

it("keeps AsciiDoc document titles", async () => {
	const html = await markupToHtml(
		"= Workshop\n:showtitle:\n\nA paragraph.",
		"asciidoc",
		document.baseURI,
	);
	expect(html).toContain("Workshop");
});

it("preserves a converted title, inline image and formula from AsciiDoc", async () => {
	const { htmlToMarkup } = await import("./markup-conversion.js");
	const source = htmlToMarkup(
		'<h1>Workshop</h1><p><img src="/canoe.svg" alt="Canoe"> and <strong>science</strong></p>',
		"asciidoc",
	);
	const html = await markupToHtml(source, "asciidoc", document.baseURI);
	expect(html).toContain("Workshop");
	const markdown = htmlToMarkup(
		await markupToHtml(
			"= Workshop\n:showtitle:\n\nimage:/canoe.svg[Canoe] latexmath:[E=mc^2]",
			"asciidoc",
			document.baseURI,
		),
		"markdown",
	);
	expect(markdown).toContain("canoe.svg");
	expect(markdown).toContain("tp-math");
	expect(markdown).not.toContain("data-tp-asciidoc-asset");
});

it("exports image figures using native reStructuredText", async () => {
	const { htmlToMarkup } = await import("./markup-conversion.js");
	const source = htmlToMarkup(
		'<figure><img src="/canoe.svg" alt="Canoe"><figcaption>A canoe</figcaption></figure>',
		"restructuredtext",
	);
	expect(source).toContain(".. figure:: /canoe.svg");
	expect(source).toContain("   A canoe");
});

it.each([
	["markdown", "|"],
	["asciidoc", "|==="],
] as const)(
	"uses and renders a native %s table with rich cells",
	async (language, syntax) => {
		const { htmlToMarkup } = await import("./markup-conversion.js");
		const source = htmlToMarkup(
			'<table><caption>Workshop</caption><thead><tr><th>Text</th><th>Image</th></tr></thead><tbody><tr><td><strong>Bold</strong></td><td><img src="https://example.org/canoe.svg" alt="Canoe"></td></tr></tbody></table>',
			language,
		);
		expect(source).toContain(syntax);
		expect(source).not.toMatch(/::: table|\[table\]|\.\. html-table::/);
		const html = await markupToHtml(source, language, document.baseURI);
		const root = document.createElement("div");
		root.innerHTML = html;
		expect(root.querySelector("table strong")?.textContent).toBe("Bold");
		expect(root.querySelector("table img")?.getAttribute("src")).toBe(
			"https://example.org/canoe.svg",
		);
		expect(root.textContent).toContain("Workshop");
		expect(root.querySelector(".system-message")).toBeNull();
	},
);

it("keeps custom table attributes through the fallback", async () => {
	const { htmlToMarkup } = await import("./markup-conversion.js");
	const source = htmlToMarkup(
		'<table id="custom"><tr><td>Content</td></tr></table>',
		"markdown",
	);
	expect(source).toContain('id="custom"');
});

it("exports rich cells using a native reStructuredText list-table", async () => {
	const { htmlToMarkup } = await import("./markup-conversion.js");
	const source = htmlToMarkup(
		'<table><tr><th>Text</th><th>Image</th></tr><tr><td><strong>Bold</strong></td><td><img src="https://example.org/canoe.svg" alt="Canoe"></td></tr></table>',
		"restructuredtext",
	);
	expect(source).toContain(".. list-table::");
	expect(source).toContain("**Bold**");
	expect(source).toContain(".. image:: https://example.org/canoe.svg");
	expect(source).not.toContain(".. html-table::");
});

it.each(["markdown", "asciidoc"] as const)(
	"renders native %s quotations",
	async (language) => {
		const { htmlToMarkup } = await import("./markup-conversion.js");
		const source = htmlToMarkup(
			"<blockquote><p>A <strong>quotation</strong>.</p></blockquote>",
			language,
		);
		expect(source).not.toMatch(/::: blockquote|\[blockquote\]/);
		const html = await markupToHtml(source, language, document.baseURI);
		const root = document.createElement("div");
		root.innerHTML = html;
		expect(root.querySelector("blockquote strong")?.textContent).toBe(
			"quotation",
		);
	},
);
