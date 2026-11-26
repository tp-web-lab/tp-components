import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { nativeTheoremCases } from "./markup-theorem-fixtures.js";

for (const language of ["markdown", "asciidoc", "latex"] as const) {
	it.each(nativeTheoremCases)(
		`retains compound native structures through ${language}: $name`,
		async (example) => {
			let html: string = example.html;
			for (let pass = 0; pass < 2; pass++) {
				const source = htmlToMarkup(html, language);
				expect(source).not.toMatch(
					/\\wc(?:TpTheorem|Span|Figure|Figcaption|Ol|Ul|Li)|^:+ (?:figure|figcaption|ol|ul|li)\b|^\[(?:figure|figcaption|ol|ul|li)[,\]]/m,
				);
				html = await markupToHtml(source, language, document.baseURI);
				const root = document.createElement("div");
				root.innerHTML = html;
				for (const [selector, value] of example.texts || [])
					expect(
						root
							.querySelector(selector)
							?.textContent?.replace(/\s+/g, " ")
							.trim(),
					).toBe(value);
				for (const [selector, key, value] of example.attributes)
					expect(root.querySelector(selector)?.getAttribute(key)).toBe(value);
				for (const selector of example.selectors)
					expect(
						root.querySelector(selector),
						`${source}\n${html}`,
					).not.toBeNull();
			}
		},
	);
}

it("omits generated light-DOM headings and proof symbols from every export", async () => {
	await import("../components/theorem/theorem.js");
	const element = document.createElement("tp-theorem");
	element.setAttribute("type", "proof");
	element.setAttribute("qed", "◆");
	element.setAttribute("heading", "Author title");
	element.innerHTML = "<p>Only author content.</p>";
	document.body.append(element);
	try {
		await Promise.resolve();
		await Promise.resolve();
		expect(
			element.querySelectorAll("[data-tp-theorem-generated]"),
		).toHaveLength(2);
		for (const language of [
			"html",
			"markdown",
			"asciidoc",
			"latex",
			"restructuredtext",
		] as const) {
			const source = htmlToMarkup(element.outerHTML, language);
			expect(source).not.toContain("data-tp-theorem-generated");
			expect(source).not.toContain("End of statement");
			expect(source).not.toContain("□");
			if (language !== "restructuredtext") {
				const html = await markupToHtml(source, language, document.baseURI);
				const template = document.createElement("template");
				template.innerHTML = html;
				expect(
					template.content.querySelector("tp-theorem")?.getAttribute("qed") ||
						"",
				).toBe("◆");
				expect(
					template.content.querySelector("tp-theorem")?.textContent?.trim(),
				).toBe("Only author content.");
			}
		}
	} finally {
		element.remove();
	}
});

it("exports an authored rich heading once, using the native optional LaTeX title", async () => {
	await import("../components/theorem/theorem.js");
	const element = document.createElement("tp-theorem");
	element.innerHTML =
		'<span slot="heading">A <em>useful</em> result</span><p>Body.</p>';
	document.body.append(element);
	try {
		await Promise.resolve();
		await Promise.resolve();
		const html = htmlToMarkup(element.outerHTML, "html");
		expect(html.match(/slot="heading"/g)).toHaveLength(1);
		expect(html).not.toContain("data-tp-theorem-generated");
		const code = htmlToMarkup(element.outerHTML, "latex");
		expect(code).toContain("\\begin{theorem}[{A \\textit{useful} result}]");
		const restored = await markupToHtml(code, "latex", document.baseURI);
		expect(restored).toContain('slot="heading"');
		expect(restored).toContain("<em>useful</em>");
	} finally {
		element.remove();
	}
});

it("round-trips rich theorem citations and bibliography through native LaTeX", async () => {
	const code = String.raw`\usepackage{amsthm}\newtheorem{proposition}{Proposition}\begin{proposition}[Companion, {\cite[p. 12]{guide}}]Text.\end{proposition}\begin{thebibliography}{99}\bibitem[7]{guide}Alex. \emph{Guide}.\end{thebibliography}`;
	const html = await markupToHtml(code, "latex", document.baseURI);
	expect(html).toContain("tp-biblio");
	expect(html).toContain('slot="heading"');
	const back = htmlToMarkup(html, "latex");
	expect(back).toContain("\\cite");
	expect(back).toContain("\\begin{thebibliography}");
	expect(back).not.toContain("\\wcTpRef");
	const result = document.createElement("template");
	result.innerHTML = await markupToHtml(back, "latex", document.baseURI);
	expect(
		result.content
			.querySelector('[slot="heading"] tp-ref')
			?.getAttribute("href"),
	).toBe("@guide");
	expect(result.content.querySelector("tp-biblio")?.getAttribute("label")).toBe(
		"[7]",
	);
});
