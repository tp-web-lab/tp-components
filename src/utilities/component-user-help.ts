/** Metadata shown to readers, independently of the author-facing API. */
export interface TpComponentUserHelp {
	/** Human-readable component name from the documentation heading. */
	displayName?: string;
	/** Introductory paragraph from the component documentation, in Markdown. */
	introduction?: string;
	interactions: string;
	keyboard: Array<{ key: string; description: string }>;
}

/** Extracts only reader instructions and declared keyboard interactions. */
export function extractComponentUserHelp(
	markdown: string,
	source: string,
): TpComponentUserHelp {
	return {
		displayName:
			markdown
				.match(/^#\s+(.+)$/m)?.[1]
				?.replace(/<tp-icon\b[^>]*>[\s\S]*?<\/tp-icon>/g, "")
				.replace(/:tp-icon:\{[^}]*\}/g, "")
				.replace(/[*`]/g, "")
				.trim() ?? "",
		introduction:
			markdown
				.match(/^The custom[^\n]*(?:\n(?!\s*\n|## |<)[^\n]+)*/m)?.[0]
				?.trim() ?? "",
		interactions:
			markdown
				.match(
					/^### User interactions\s*\n([\s\S]*?)(?=^### Author directives|^## |$(?![\s\S]))/m,
				)?.[1]
				?.trim() ?? "",
		keyboard: [
			...source.matchAll(/^\s*\*\s*@keyboard\s+\{([^}]+)\}\s+([^\n]+)/gm),
		].map((match) => ({
			key: match[1] ?? "",
			description: match[2]?.trim() ?? "",
		})),
	};
}
