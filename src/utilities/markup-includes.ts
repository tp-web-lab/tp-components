import type { MarkupLanguage } from "./markup-conversion.js";

export interface MarkupInclude {
	marker: string;
	path: string;
}
/** Protect simple, standalone inclusions while converting the surrounding document. */
export function extractMarkupIncludes(
	code: string,
	language: MarkupLanguage,
): { source: string; includes: MarkupInclude[] } {
	const includes: MarkupInclude[] = [];
	let fence = "";
	let literal = false;
	let htmlLiteral = "";
	const lines = code.split("\n");
	const source = lines
		.map((line, index) => {
			if (language === "html") {
				htmlLiteral ||= /<(script|pre|style)\b/i.exec(line)?.[1] ?? "";
				if (htmlLiteral) {
					if (new RegExp(`</${htmlLiteral}\\s*>`, "i").test(line))
						htmlLiteral = "";
					return line;
				}
			}
			const delimiter =
				language === "markdown"
					? /^(?:`{3,}|~{3,})/.exec(line)?.[0]
					: language === "asciidoc"
						? /^(?:-{4,}|\.{4,}|\+{4,})/.exec(line)?.[0]
						: undefined;
			if (delimiter) {
				if (!fence) fence = delimiter;
				else if (delimiter[0] === fence[0] && delimiter.length >= fence.length)
					fence = "";
				return line;
			}
			if (fence) return line;
			if (/^\\begin\{(?:verbatim|lstlisting)\}/.test(line)) literal = true;
			if (literal) {
				if (/\\end\{(?:verbatim|lstlisting)\}/.test(line)) literal = false;
				return line;
			}
			const path =
				language === "asciidoc"
					? /^include::([^\n[]+)\[\]\s*$/.exec(line)?.[1]
					: language === "markdown"
						? /^::include\{([^\s{}]+)\}\s*$/.exec(line)?.[1]
						: language === "latex"
							? /^\\(?:input|include)\{([^{}]+)\}\s*$/.exec(line)?.[1]
							: language === "restructuredtext" &&
									!/^\s+\S/.test(lines[index + 1] || "")
								? /^\.\. include::\s+(.+?)\s*$/.exec(line)?.[1]
								: language === "html"
									? /^<tp-include\s+src="([^"<>]+)"\s*><\/tp-include>\s*$/.exec(
											line,
										)?.[1]
									: undefined;
			if (
				!path ||
				!/\.(?:html?|md|markdown|adoc|asciidoc|tex|latex|rst)(?:[?#]|$)/i.test(
					path,
				)
			)
				return line;
			let marker = `TPINCLUDE${includes.length}PLACEHOLDER`;
			while (code.includes(marker)) marker += "X";
			includes.push({ marker, path });
			return language === "html" ? `<p>${marker}</p>` : marker;
		})
		.join("\n");
	return { source, includes };
}

export function markupIncludeDirective(
	path: string,
	language: MarkupLanguage,
): string {
	if (/[\n\r{}"<>]/.test(path))
		throw new Error(`Unsupported include path: ${path}`);
	switch (language) {
		case "asciidoc":
			return `include::${path}[]`;
		case "markdown":
			return `::include{${path}}`;
		case "latex":
			return `\\input{${path}}`;
		case "restructuredtext":
			return `.. include:: ${path}`;
		case "html":
			return `<tp-include src="${path.replaceAll("&", "&amp;")}"></tp-include>`;
	}
}

/** Resolve included files in their own language, then convert to the containing language. */
export async function expandMarkupIncludes(
	code: string,
	language: MarkupLanguage,
	baseURL: string,
	ancestors: readonly string[] = [],
): Promise<string> {
	const { source, includes } = extractMarkupIncludes(code, language);
	if (!includes.length) return code;
	const { convertMarkup, markupLanguageFromPath } = await import(
		"./markup-conversion.js"
	);
	let result = source;
	for (const include of includes) {
		const url = new URL(include.path, baseURL).href;
		if (ancestors.includes(url) || url === baseURL)
			throw new Error(`Circular markup include: ${url}`);
		if (ancestors.length >= 20)
			throw new Error("Markup include nesting exceeds 20 levels");
		const from = markupLanguageFromPath(url);
		const response = await fetch(url);
		if (!response.ok)
			throw new Error(`Unable to include ${url} (${response.status})`);
		const nested = await expandMarkupIncludes(
			await response.text(),
			from,
			url,
			[...ancestors, baseURL],
		);
		const converted = await convertMarkup(nested, from, language, {
			baseURL: url,
		});
		result = result.replace(
			language === "html" ? `<p>${include.marker}</p>` : include.marker,
			() => converted,
		);
	}
	return result;
}
