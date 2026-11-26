import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { resolveMarkdownIncludes } from "./markdown-includes.js";

afterEach(() => vi.unstubAllGlobals());
it("keeps lazy Markdown inclusions unfetched and propagates their depth", async () => {
	const fetch = vi.fn();
	vi.stubGlobal("fetch", fetch);
	const html = await resolveMarkdownIncludes(
		"::include{child.md loading=lazy}",
		new URL("https://example.test/docs/page.md"),
		3,
	);
	expect(html).toContain('src="https://example.test/docs/child.md"');
	expect(html).toContain('data-tp-include-depth="4"');
	expect(fetch).not.toHaveBeenCalled();
	await expect(
		resolveMarkdownIncludes(
			"::include{child.md loading=lazy}",
			new URL("https://example.test/"),
			13,
		),
	).rejects.toThrow("Include depth exceeded");
});

it.each(["```", "~~~~"])(
	"includes literal source inside %s fences",
	async (fence) => {
		const code = 'const greeting = "<hello>";';
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: true, text: async () => code }),
		);
		const result = await resolveMarkdownIncludes(
			`${fence}javascript\n::include{greeting.js mode=raw}\n${fence}\n\n::include{greeting.js}`,
			new URL("https://example.test/docs/page.md"),
		);
		expect(result).toBe(
			`${fence}javascript\n${code}\n${fence}\n\n<pre><code>const greeting = &quot;&lt;hello&gt;&quot;;</code></pre>`,
		);
	},
);

it("leaves inline include examples inert, including table cells and multiline code spans", async () => {
	const fetch = vi
		.fn()
		.mockResolvedValue({ ok: true, text: async () => "Included" });
	vi.stubGlobal("fetch", fetch);
	const literal =
		"| Syntax |\n| --- |\n| ` ::include{part.md} ` |\n| `` ` ::include{other.md} ` `` |\n\n`example\n::include{third.md}`";
	expect(
		await resolveMarkdownIncludes(
			`${literal}\n\n::include{real.md}`,
			new URL("https://example.test/docs/page.md"),
		),
	).toBe(`${literal}\n\nIncluded`);
	expect(fetch).toHaveBeenCalledTimes(1);
	expect(fetch).toHaveBeenCalledWith("https://example.test/docs/real.md", {
		cache: "no-store",
	});
});

it("does not fetch the illustrative include paths in the converter documentation", async () => {
	const source = readFileSync(
		"public/docs/components/markup-converter/index.md",
		"utf8",
	);
	const mapping = source.slice(
		source.indexOf("#### HTML-to-markup mapping"),
		source.indexOf("#### Cleaning the HTML pivot"),
	);
	const fetch = vi.fn();
	vi.stubGlobal("fetch", fetch);
	expect(
		await resolveMarkdownIncludes(
			mapping,
			new URL("https://example.test/docs/components/markup-converter/index.md"),
		),
	).toBe(mapping);
	expect(fetch).not.toHaveBeenCalled();
});
