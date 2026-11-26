import { afterEach, expect, it, vi } from "vitest";
import { fetchLatexListingFiles } from "./latex-listing-files.js";

afterEach(() => vi.unstubAllGlobals());
it("loads deduplicated listing paths relative to their LaTeX document and propagates cancellation", async () => {
	const fetcher = vi
		.fn()
		.mockResolvedValue({ ok: true, text: async () => "const x = 1;" });
	vi.stubGlobal("fetch", fetcher);
	const signal = new AbortController().signal;
	const files = await fetchLatexListingFiles(
		String.raw`\lstinputlisting{source.js}\lstinputlisting{source.js}`,
		"https://example.org/docs/chapter.tex",
		signal,
	);
	expect(files).toEqual({ "source.js": "const x = 1;" });
	expect(fetcher).toHaveBeenCalledTimes(1);
	expect(String(fetcher.mock.calls[0]?.[0])).toBe(
		"https://example.org/docs/source.js",
	);
	expect(fetcher.mock.calls[0]?.[1]).toEqual({ signal });
});
it("reports missing files and ignores references inside literal code", async () => {
	const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 404 });
	vi.stubGlobal("fetch", fetcher);
	await expect(
		fetchLatexListingFiles(
			String.raw`\lstinputlisting{missing.js}`,
			"https://example.org/",
		),
	).rejects.toThrow("404");
	fetcher.mockClear();
	await fetchLatexListingFiles(
		String.raw`\begin{lstlisting}\lstinputlisting{ignored.js}\end{lstlisting}`,
		"https://example.org/",
	);
	expect(fetcher).not.toHaveBeenCalled();
});
