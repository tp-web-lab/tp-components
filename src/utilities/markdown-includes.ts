const MAX_INCLUDE_DEPTH = 12;
type MarkdownIncludeMode = "auto" | "raw";

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/** Keep inline code inert while retaining the supported raw-include-in-fence feature. */
function maskInlineCode(markdown: string): string {
	const output: string[] = [];
	let paragraph = "";
	let fence: { marker: string; length: number } | undefined;
	const flush = () => {
		output.push(
			paragraph.replace(
				/(?<!`)(`+)(?!`)([\s\S]*?)(?<!`)\1(?!`)/g,
				(match, _delimiter, _body, offset: number) => {
					const prefix = paragraph.slice(0, offset);
					const escapes = /\\*$/.exec(prefix)?.[0].length ?? 0;
					return escapes % 2 ? match : match.replace(/[^\r\n]/g, " ");
				},
			),
		);
		paragraph = "";
	};
	for (const line of markdown.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
		const delimiter = /^ {0,3}(?:[:>]\s*)?(`{3,}|~{3,})(.*)/.exec(line);
		if (fence) {
			output.push(line);
			if (
				delimiter?.[1]?.[0] === fence.marker &&
				delimiter[1].length >= fence.length &&
				!delimiter[2]?.trim()
			)
				fence = undefined;
		} else if (
			delimiter &&
			!(delimiter[1]?.[0] === "`" && delimiter[2]?.includes("`"))
		) {
			flush();
			fence = {
				marker: delimiter[1]?.[0] ?? "",
				length: delimiter[1]?.length ?? 0,
			};
			output.push(line);
		} else if (!line.trim()) {
			flush();
			output.push(line);
		} else paragraph += line;
	}
	flush();
	return output.join("");
}

export async function resolveMarkdownIncludes(
	markdown: string,
	currentUrl: URL,
	depth = 0,
): Promise<string> {
	if (depth > MAX_INCLUDE_DEPTH) {
		throw new Error("Include depth exceeded.");
	}

	const includePattern = /(^[^\S\r\n]*:?[^\S\r\n]*)?::include\{([^}]+)\}/gm;
	const parts: string[] = [];
	let lastIndex = 0;

	for (const match of maskInlineCode(markdown).matchAll(includePattern)) {
		const index = match.index;
		const prefix = match[1] ?? "";
		const include = parseMarkdownInclude(match[2] ?? "");
		const includePath = include.path;

		if (
			index === undefined ||
			includePath === undefined ||
			includePath === ""
		) {
			continue;
		}

		parts.push(markdown.slice(lastIndex, index));
		parts.push(
			applyIncludePrefix(
				await renderInclude(
					includePath,
					currentUrl,
					depth,
					include.mode,
					include.lazy,
				),
				prefix,
			),
		);
		lastIndex = index + match[0].length;
	}

	parts.push(markdown.slice(lastIndex));
	return parts.join("");
}

export function applyIncludePrefix(content: string, prefix: string): string {
	if (prefix === "") {
		return content;
	}

	const definitionPrefix = prefix.match(/^([^\S\r\n]*):([^\S\r\n]*)$/);

	if (definitionPrefix !== null) {
		const continuationPrefix = `${definitionPrefix[1] ?? ""}${" ".repeat(
			1 + (definitionPrefix[2]?.length ?? 0),
		)}`;

		if (/^:{3,}\s+[a-z]/i.test(content)) {
			return `${definitionPrefix[1] ?? ""}:\n${content
				.split("\n")
				.map((line) => `${continuationPrefix}${line}`)
				.join("\n")}`;
		}

		return content
			.split("\n")
			.map(
				(line, index) => `${index === 0 ? prefix : continuationPrefix}${line}`,
			)
			.join("\n");
	}

	return content
		.split("\n")
		.map((line) => `${prefix}${line}`)
		.join("\n");
}

export async function renderInclude(
	includePath: string,
	currentUrl: URL,
	depth: number,
	mode: MarkdownIncludeMode,
	lazy = false,
): Promise<string> {
	const includeUrl = new URL(includePath, currentUrl);
	const pathname = includeUrl.pathname.toLowerCase();

	if (lazy && mode !== "raw" && pathname.endsWith(".md")) {
		return `<tp-markdown src="${escapeHtml(includeUrl.href)}" data-tp-defer-visibility data-tp-include-depth="${depth + 1}"></tp-markdown>`;
	}

	if (mode === "raw") {
		const response = await fetch(includeUrl.href, { cache: "no-store" });
		if (!response.ok) {
			return `Unable to include file: ${includeUrl.pathname} (${String(response.status)})`;
		}
		return response.text();
	}

	if (pathname.endsWith(".adoc") || pathname.endsWith(".asciidoc")) {
		return `<tp-asciidoc src="${escapeHtml(includeUrl.href)}"></tp-asciidoc>`;
	}

	if (pathname.endsWith(".rst") || pathname.endsWith(".rest")) {
		return `<tp-restructuredtext src="${escapeHtml(includeUrl.href)}"></tp-restructuredtext>`;
	}

	if (pathname.endsWith(".html") || pathname.endsWith(".htm")) {
		return `<tp-include src="${escapeHtml(includeUrl.href)}"></tp-include>`;
	}

	const response = await fetch(includeUrl.href, { cache: "no-store" });

	if (!response.ok) {
		return `<pre class="tp-markdown-error"><code>Unable to include file: ${escapeHtml(includeUrl.pathname)} (${String(response.status)})</code></pre>`;
	}

	const content = await response.text();
	if (pathname.endsWith(".md")) {
		return resolveMarkdownIncludes(content, includeUrl, depth + 1);
	}

	if (pathname.endsWith(".svg")) {
		return content;
	}

	return `<pre><code>${escapeHtml(content)}</code></pre>`;
}

function parseMarkdownInclude(value: string): {
	path: string;
	mode: MarkdownIncludeMode;
	lazy: boolean;
} {
	const lazy = /(?:^|\s)loading\s*=\s*["']?lazy["']?(?=\s|$)/i;
	const deferred = lazy.test(value);
	value = value.replace(lazy, "");
	const modePattern =
		/(?:^|\s)mode\s*=\s*(?:"(auto|raw)"|'(auto|raw)'|(auto|raw))(?=\s|$)/i;
	const match = value.match(modePattern);
	const selectedMode = (
		match?.[1] ??
		match?.[2] ??
		match?.[3] ??
		"auto"
	).toLowerCase();

	return {
		path: (match === null ? value : value.replace(modePattern, "")).trim(),
		mode: selectedMode === "raw" ? "raw" : "auto",
		lazy: deferred,
	};
}
