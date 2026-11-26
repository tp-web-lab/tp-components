import { afterEach, expect, it, vi } from "vitest";
import { convertMarkup, convertMarkupFile } from "./markup-conversion.js";
import {
	expandMarkupIncludes,
	extractMarkupIncludes,
} from "./markup-includes.js";

afterEach(() => vi.unstubAllGlobals());
it("keeps the original file path in native inclusion directives", async () => {
	const source = "include::fragment.adoc[]";
	for (const [to, expected] of [
		["markdown", "::include{fragment.adoc}"],
		["latex", "\\input{fragment.adoc}"],
		["restructuredtext", ".. include:: fragment.adoc"],
		["html", '<tp-include src="fragment.adoc"></tp-include>'],
	] as const) {
		expect((await convertMarkup(source, "adoc", to)).trim()).toBe(expected);
	}
});
it("converts included contents using the file extension and resolves nested paths", async () => {
	const fetcher = vi.fn(
		async (url: string) =>
			new Response(
				url.endsWith("fragment.adoc")
					? "*Strong*\n\ninclude::nested/list.md[]"
					: "- One\n- Two",
			),
	);
	vi.stubGlobal("fetch", fetcher);
	const result = await expandMarkupIncludes(
		"::include{fragment.adoc}",
		"markdown",
		"https://example.test/docs/page.md",
	);
	expect(result).toContain("**Strong**");
	expect(result).toContain("One");
	expect(fetcher.mock.calls.map((call) => call[0])).toEqual([
		"https://example.test/docs/fragment.adoc",
		"https://example.test/docs/nested/list.md",
	]);
});
it("rejects missing files and cycles", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response("", { status: 404 })),
	);
	await expect(
		expandMarkupIncludes(
			"::include{missing.md}",
			"markdown",
			"https://example.test/page.md",
		),
	).rejects.toThrow("404");
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response("::include{loop.md}")),
	);
	await expect(
		expandMarkupIncludes(
			"::include{loop.md}",
			"markdown",
			"https://example.test/page.md",
		),
	).rejects.toThrow("Circular");
});
it("does not interpret fenced code or include options as simple document includes", () => {
	expect(
		extractMarkupIncludes("```md\n::include{code.md}\n```", "markdown")
			.includes,
	).toEqual([]);
	expect(
		extractMarkupIncludes("include::code.adoc[lines=1..2]", "asciidoc")
			.includes,
	).toEqual([]);
	expect(
		extractMarkupIncludes(
			".. include:: code.rst\n   :literal:",
			"restructuredtext",
		).includes,
	).toEqual([]);
});
it("fetches a source file and converts it with inferred language", async () => {
	const fetcher = vi.fn(
		async () => new Response("<p><strong>Hello</strong></p>"),
	);
	vi.stubGlobal("fetch", fetcher);
	expect(
		(
			await convertMarkupFile("fragment.html", "auto", "md", {
				baseURL: "https://example.test/docs/page.html",
			})
		).trim(),
	).toBe("**Hello**");
	expect(fetcher).toHaveBeenCalledWith(
		"https://example.test/docs/fragment.html",
	);
});

it("keeps HTML code examples literal and recognizes includes after RST headings", () => {
	expect(
		extractMarkupIncludes(
			'<pre>\n<tp-include src="code.html"></tp-include>\n</pre>',
			"html",
		).includes,
	).toEqual([]);
	expect(
		extractMarkupIncludes(
			"Title\n-----\n\n.. include:: fragment.adoc",
			"restructuredtext",
		).includes,
	).toHaveLength(1);
});
