import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

it("keeps an automatic TOC in native target syntax", async () => {
	const source =
		":toc:\n:toc-title: Contents\n\n== Preparation\n\nRead.\n\n== Practice\n\nEdit.\n\n=== Review\n\nCompare.";
	const html = await markupToHtml(source, "asciidoc", document.baseURI);
	for (const [language, directive] of [
		["latex", "\\tableofcontents"],
		["markdown", "[[toc]]"],
		["restructuredtext", ".. contents::"],
		["asciidoc", "toc::[]"],
	] as const) {
		const converted = htmlToMarkup(html, language);
		expect(converted).toContain(directive);
		if (language === "restructuredtext") continue; // Docutils runs in the browser audit.
		const rendered = await markupToHtml(converted, language, document.baseURI);
		const root = document.createElement("div");
		root.innerHTML = rendered;
		const links = [...root.querySelectorAll('a[href^="#"]')].filter((link) =>
			/Preparation|Practice|Review/.test(link.textContent || ""),
		);
		expect(
			links.length,
			`${language}: ${converted}\n${rendered}`,
		).toBeGreaterThanOrEqual(3);
		for (const link of links)
			expect(
				root.querySelector(
					`[id="${link.getAttribute("href")?.split("#").pop()}"]`,
				),
				`${language}: ${converted}\n${rendered}`,
			).not.toBeNull();
		expect(htmlToMarkup(rendered, "markdown"), language).toContain("[[toc]]");
	}
});

it("does not turn ordinary navigation into an automatic TOC", () => {
	expect(
		htmlToMarkup('<nav><a href="#section">Manual link</a></nav>', "markdown"),
	).not.toContain("[[toc]]");
});
