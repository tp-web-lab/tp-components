/**
 * @module components/playground/playground-source-loader
 * @summary Shared loading of JSON projects and single-language source files.
 */

import {
	loadPlaygroundProjectJson,
	type TpPlaygroundProjectData,
} from "./playground-project-loader.js";

/** Accepted source extensions for each execution environment. */
const extensions: Record<string, readonly string[]> = {
	javascript: ["js", "mjs", "cjs"],
	typescript: ["ts", "mts", "cts"],
	python: ["py"],
	prolog: ["pl", "pro"],
	sql: ["sql"],
	html: ["html", "htm"],
	markdown: ["md", "markdown"],
	asciidoc: ["adoc", "asciidoc"],
	restructuredtext: ["rst"],
};

/** File-picker filter matching the source formats accepted by src. */
export function playgroundSourceAccept(language: string): string {
	return (extensions[language] ?? [])
		.map((extension) => `.${extension}`)
		.join(",");
}

/** Rejects source formats that cannot be executed by this playground. */
function validateSourceFilename(filename: string, language: string): void {
	const extension = filename.split(".").at(-1)?.toLowerCase() ?? "";
	if (!filename.includes(".") || !extensions[language]?.includes(extension)) {
		throw new Error(`Unsupported ${language} source file: ${filename}`);
	}
}

/** Wraps compatible source files; JSON and extensionless URLs keep project loading. */
export async function loadPlaygroundSource(
	url: string,
	language: string,
): Promise<TpPlaygroundProjectData> {
	const filename = new URL(url).pathname.split("/").at(-1) ?? "";
	const extension = filename.split(".").at(-1)?.toLowerCase() ?? "";
	if (extension === "json" || !filename.includes(".")) {
		return loadPlaygroundProjectJson(url);
	}
	validateSourceFilename(filename, language);
	const response = await fetch(url, { cache: "no-store" });
	if (!response.ok) {
		throw new Error(`Unable to load file: ${url} (${response.status})`);
	}
	const content = await response.text();
	return createSingleSourceProject(filename, content, language);
}

/** Creates the same single-file project for disk imports and source URLs. */
export function createSingleSourceProject(
	filename: string,
	content: string,
	language: string,
): TpPlaygroundProjectData {
	validateSourceFilename(filename, language);
	const entry = `/${filename}`;
	return {
		name: filename,
		entry,
		files: [
			...(language === "html"
				? []
				: [
						{
							path: "/index.html",
							language: "html",
							content: '<main id="app"></main>',
						},
					]),
			{ path: entry, language, content },
		],
	};
}
