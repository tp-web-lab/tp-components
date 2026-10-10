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

	for (const match of markdown.matchAll(includePattern)) {
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
				await renderInclude(includePath, currentUrl, depth, include.mode),
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
): Promise<string> {
	const includeUrl = new URL(includePath, currentUrl);
	const pathname = includeUrl.pathname.toLowerCase();

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
} {
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
	};
}
