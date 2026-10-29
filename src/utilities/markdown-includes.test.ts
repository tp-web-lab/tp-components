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
