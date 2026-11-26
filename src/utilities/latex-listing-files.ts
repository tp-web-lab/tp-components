import {
	loadLatexBibliographyFiles,
	loadLatexListingFiles,
} from "@tp/tp-latex";
/** Resolve code files against the containing LaTeX document, without interpreting their contents. */
export function fetchLatexListingFiles(
	source: string,
	base: string,
	signal?: AbortSignal,
): Promise<Record<string, string>> {
	return loadLatexListingFiles(source, async (path) => {
		const response = await fetch(new URL(path, base), { signal });
		if (!response.ok)
			throw new Error(`Unable to load listing ${path} (${response.status}).`);
		return response.text();
	});
}

/** Load BibTeX databases using the same source-relative URL and cancellation rules. */
export function fetchLatexBibliographyFiles(
	source: string,
	base: string,
	signal?: AbortSignal,
): Promise<Record<string, string>> {
	return loadLatexBibliographyFiles(source, async (path) => {
		const response = await fetch(new URL(path, base), { signal });
		if (!response.ok)
			throw new Error(
				`Unable to load bibliography ${path} (${response.status}).`,
			);
		return response.text();
	});
}
