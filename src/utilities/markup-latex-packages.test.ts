import { afterEach, describe, expect, it, vi } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { packageConversionErrors } from "./markup-latex-package-checks.js";

import {
	nativeLatexSources,
	packageExamples,
} from "./markup-latex-package-fixtures.js";

const root = (html: string) => {
	const element = document.createElement("div");
	element.innerHTML = html;
	return element;
};
const mathValues = (element: Element) =>
	[...element.querySelectorAll("tp-math")].map((e) =>
		(e.getAttribute("value") ?? e.textContent ?? "").trim(),
	);
afterEach(() => vi.unstubAllGlobals());
describe.each(["html", "markdown", "asciidoc"] as const)(
	"LaTeX packages converted to %s",
	(language) => {
		it.each(Object.entries(packageExamples))(
			"preserves %s content and semantics",
			async (name, source) => {
				vi.stubGlobal(
					"fetch",
					vi
						.fn()
						.mockResolvedValue(
							new Response(
								'ignored\nconst x = "<tag>";\nconsole.log(x);\nignored',
							),
						),
				);
				const html = await markupToHtml(
					source,
					"latex",
					"https://example.org/course/lesson.tex",
				);
				const before = root(html),
					converted = htmlToMarkup(html, language);
				const after = root(
					await markupToHtml(
						converted,
						language,
						"https://example.org/export/",
					),
				);
				expect(after.querySelector(".system-message,[role=alert]")).toBeNull();
				expect(mathValues(after)).toEqual(mathValues(before));
				expect(packageConversionErrors(before, after, name)).toEqual([]);
				for (const tag of ["table", "tr", "td", "th", "ol", "ul", "li", "img"])
					expect(after.querySelectorAll(tag).length, `${name}: ${tag}`).toBe(
						before.querySelectorAll(tag).length,
					);
				for (const element of before.querySelectorAll("[id]"))
					expect(
						after.querySelector(`[id="${element.id}"]`),
						`missing anchor ${element.id}`,
					).not.toBeNull();
				expect(
					[...after.querySelectorAll("a")].map((e) => e.getAttribute("href")),
				).toEqual(
					[...before.querySelectorAll("a")].map((e) => e.getAttribute("href")),
				);
				if (name === "rules") {
					const cells = [...before.querySelectorAll<HTMLElement>("td")];
					const converted = [...after.querySelectorAll<HTMLElement>("td")];
					cells.forEach((cell, i) => {
						expect(converted[i]?.style.borderBottom).toBe(
							cell.style.borderBottom,
						);
						expect(converted[i]?.style.borderTop).toBe(cell.style.borderTop);
						expect(converted[i]?.style.textAlign).toBe(cell.style.textAlign);
					});
				}
				if (name === "theorems") {
					expect(after.querySelector("h2 p")).toBeNull();
					const prose = (element: Element) => {
						const clone = element.cloneNode(true) as Element;
						for (const proofEnd of clone.querySelectorAll(
							'[aria-label="End of proof"]',
						))
							proofEnd.remove();
						for (const math of clone.querySelectorAll("tp-math"))
							math.replaceWith(
								document.createTextNode(
									`{${math.getAttribute("value") ?? math.textContent?.trim()}}`,
								),
							);
						return clone.textContent
							?.normalize("NFKC")
							.replace(/\u200b/g, "")
							.replace(/\s+/g, " ")
							.trim();
					};
					const originals = [...before.querySelectorAll("tp-theorem")];
					const converted = [...after.querySelectorAll("tp-theorem")];
					expect(converted.map(prose)).toEqual(originals.map(prose));
					expect(
						[...after.querySelectorAll("code")].filter(
							(code) => !code.closest("tp-math"),
						),
					).toHaveLength(0);
					const text = after.textContent
						?.normalize("NFKC")
						.replace(/\s+/g, " ");
					expect(text).toContain("See Theorem 1.2 below, in Section 1.");
					expect(text).toContain(
						"The shared counter gives Definition 1.1 and Theorem 1.2.",
					);
					const titles = [
						...after.querySelectorAll('tp-theorem:not([type="proof"])'),
					].map(
						(e) =>
							`${e.getAttribute("label")} ${e.getAttribute("number")}${e.getAttribute("heading") ? ` (${e.getAttribute("heading")})` : ""}.`,
					);
					expect(titles).toEqual([
						"Definition 1.1.",
						"Theorem 1.2 (Nonnegativity).",
					]);
				}
				if (name === "graphics") {
					const a = after.querySelector("img"),
						b = before.querySelector("img");
					if (!a || !b) throw new Error("Missing converted image");
					expect(a.getAttribute("src")).toBe(b.getAttribute("src"));
					for (const property of [
						"width",
						"height",
						"object-fit",
						"transform",
						"clip-path",
					])
						expect(a.style.getPropertyValue(property)).toBe(
							b.style.getPropertyValue(property),
						);
					expect(a.alt).toBe("A canoe");
				}
				if (name === "listings") {
					expect(
						after.querySelector("tp-code-editor")?.getAttribute("value") ??
							after.querySelector("tp-code-editor script")?.textContent?.trim(),
					).toBe('const x = "<tag>";\nconsole.log(x);');
					expect(
						after
							.querySelector("tp-code-editor")
							?.getAttribute("line-number-start"),
					).toBe("20");
					expect(
						after.querySelector("pre code")?.textContent?.replace(/\n$/, ""),
					).toBe('  print("<literal>")');
					expect(
						after
							.querySelector("pre code")
							?.classList.contains("language-python"),
					).toBe(true);
				}
				if (name === "lists")
					for (const label of ["C)", "D)", "E)"])
						expect(after.textContent).toContain(label);
				if (name === "tables")
					expect(after.querySelector("col")?.getAttribute("style")).toContain(
						"9em",
					);
			},
		);
	},
);

describe("RST math conversion", () => {
	it("uses native AsciiMath roles and directives", () => {
		const output = htmlToMarkup(
			'<p><tp-math mode="asciimath" value="sqrt(x)"></tp-math></p><tp-math mode="asciimath" displaystyle value="sum x"></tp-math>',
			"restructuredtext",
		);
		expect(output).toContain(":asciimath:`sqrt(x)`");
		expect(output).toContain(".. asciimath::");
		expect(output).toContain("   sum x");
	});
});

describe.each(["html", "markdown", "asciidoc"] as const)(
	"LaTeX package content converted back from %s",
	(language) => {
		it.each(Object.entries(packageExamples))(
			"preserves %s content and semantics",
			async (name, source) => {
				vi.stubGlobal(
					"fetch",
					vi
						.fn()
						.mockResolvedValue(
							new Response(
								'ignored\nconst x = "<tag>";\nconsole.log(x);\nignored',
							),
						),
				);
				const html = await markupToHtml(
					source,
					"latex",
					"https://example.org/course/lesson.tex",
				);
				const before = root(html),
					converted = htmlToMarkup(html, language);
				const intermediate = await markupToHtml(
					converted,
					language,
					"https://example.org/export/",
				);
				const after = root(
					await markupToHtml(
						htmlToMarkup(intermediate, "latex"),
						"latex",
						"https://example.org/export/",
					),
				);
				expect(after.querySelector(".system-message,[role=alert]")).toBeNull();
				expect(mathValues(after)).toEqual(mathValues(before));
				expect(packageConversionErrors(before, after, name)).toEqual([]);
				for (const tag of ["table", "tr", "td", "th", "ol", "ul", "li", "img"])
					expect(after.querySelectorAll(tag).length, `${name}: ${tag}`).toBe(
						before.querySelectorAll(tag).length,
					);
				for (const element of before.querySelectorAll("[id]"))
					expect(
						after.querySelector(`[id="${element.id}"]`),
						`missing anchor ${element.id}`,
					).not.toBeNull();
				expect(
					[...after.querySelectorAll("a")].map((e) => e.getAttribute("href")),
				).toEqual(
					[...before.querySelectorAll("a")].map((e) => e.getAttribute("href")),
				);
				if (name === "rules") {
					const cells = [...before.querySelectorAll<HTMLElement>("td")];
					const converted = [...after.querySelectorAll<HTMLElement>("td")];
					cells.forEach((cell, i) => {
						expect(converted[i]?.style.borderBottom).toBe(
							cell.style.borderBottom,
						);
						expect(converted[i]?.style.borderTop).toBe(cell.style.borderTop);
						expect(converted[i]?.style.textAlign).toBe(cell.style.textAlign);
					});
				}
				if (name === "theorems") {
					expect(after.querySelector("h2 p")).toBeNull();
					const prose = (element: Element) => {
						const clone = element.cloneNode(true) as Element;
						for (const proofEnd of clone.querySelectorAll(
							'[aria-label="End of proof"]',
						))
							proofEnd.remove();
						for (const math of clone.querySelectorAll("tp-math"))
							math.replaceWith(
								document.createTextNode(
									`{${math.getAttribute("value") ?? math.textContent?.trim()}}`,
								),
							);
						return clone.textContent
							?.normalize("NFKC")
							.replace(/\u200b/g, "")
							.replace(/\s+/g, " ")
							.trim();
					};
					const originals = [...before.querySelectorAll("tp-theorem")];
					const converted = [...after.querySelectorAll("tp-theorem")];
					expect(converted.map(prose)).toEqual(originals.map(prose));
					expect(
						[...after.querySelectorAll("code")].filter(
							(code) => !code.closest("tp-math"),
						),
					).toHaveLength(0);
					const text = after.textContent
						?.normalize("NFKC")
						.replace(/\s+/g, " ");
					expect(text).toContain("See Theorem 1.2 below, in Section 1.");
					expect(text).toContain(
						"The shared counter gives Definition 1.1 and Theorem 1.2.",
					);
					const titles = [
						...after.querySelectorAll('tp-theorem:not([type="proof"])'),
					].map(
						(e) =>
							`${e.getAttribute("label")} ${e.getAttribute("number")}${e.getAttribute("heading") ? ` (${e.getAttribute("heading")})` : ""}.`,
					);
					expect(titles).toEqual([
						"Definition 1.1.",
						"Theorem 1.2 (Nonnegativity).",
					]);
				}
				if (name === "graphics") {
					const a = after.querySelector("img"),
						b = before.querySelector("img");
					if (!a || !b) throw new Error("Missing converted image");
					expect(a.getAttribute("src")).toBe(b.getAttribute("src"));
					for (const property of [
						"width",
						"height",
						"object-fit",
						"transform",
						"clip-path",
					])
						expect(a.style.getPropertyValue(property)).toBe(
							b.style.getPropertyValue(property),
						);
					expect(a.alt).toBe("A canoe");
				}
				if (name === "listings") {
					expect(
						after.querySelector("tp-code-editor")?.getAttribute("value") ??
							after.querySelector("tp-code-editor script")?.textContent?.trim(),
					).toBe('const x = "<tag>";\nconsole.log(x);');
					expect(
						after
							.querySelector("tp-code-editor")
							?.getAttribute("line-number-start"),
					).toBe("20");
					expect(
						after.querySelector("pre code")?.textContent?.replace(/\n$/, ""),
					).toBe('  print("<literal>")');
					expect(
						after
							.querySelector("pre code")
							?.classList.contains("language-python"),
					).toBe(true);
				}
				if (name === "lists")
					for (const label of ["C)", "D)", "E)"])
						expect(after.textContent).toContain(label);
				if (name === "tables")
					expect(after.querySelector("col")?.getAttribute("style")).toContain(
						"9em",
					);
			},
		);
	},
);

describe.each(["html", "markdown", "asciidoc"] as const)(
	"Native %s to LaTeX",
	(language) => {
		it("preserves independently authored headings, tables, math, code, images and links", async () => {
			const html = await markupToHtml(
				nativeLatexSources[language],
				language,
				"https://example.org/source/",
			);
			const source = htmlToMarkup(html, "latex");
			const result = root(
				await markupToHtml(source, "latex", "https://example.org/export/"),
			);
			expect(result.querySelector('[id="results"]')).not.toBeNull();
			expect(result.querySelector('a[href="#results"]')).not.toBeNull();
			expect(result.querySelector("strong")?.textContent).toBe("Energy");
			expect(result.querySelectorAll("table").length).toBe(1);
			expect(mathValues(result)).toContain("E=mc^2");
			expect(result.querySelector("pre code")?.textContent).toBe(
				root(html).querySelector("pre code")?.textContent,
			);
			expect(
				result.querySelector("pre code")?.classList.contains("language-python"),
			).toBe(true);
			expect(result.querySelector("img")?.getAttribute("src")).toBe(
				"https://example.org/source/sample.svg",
			);
			expect(result.querySelector("img")?.getAttribute("alt")).toBe("Diagram");
			expect(source).toContain("\\begin{enumerate}");
			expect(source).toContain("start=3");
			expect(source).toContain("\\includegraphics");
			expect(source).toContain("\\begin{lstlisting}");
		});
	},
);
