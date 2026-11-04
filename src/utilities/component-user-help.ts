export interface TpComponentCommand {
	button: string;
	description: string;
	shortcut: string;
}

/** Extract explicit command rows from the mouse interaction table.
 * An empty Shortcut cell denotes a gesture rather than a command;
 * an em dash denotes a command without a keyboard shortcut.
 */
export function extractComponentCommands(
	markdown: string,
): TpComponentCommand[] | undefined {
	const section = markdown.match(
		/^#### Mouse interactions\s*\n([\s\S]*?)(?=^#{1,4} |$(?![\s\S]))/m,
	)?.[1];
	if (!section) return undefined;
	const rows = section
		.split("\n")
		.filter((line) => line.trim().startsWith("|"))
		.map((line) =>
			line
				.trim()
				.slice(1, -1)
				.split(/(?<!\\)\|/)
				.map((cell) => cell.trim().replaceAll("\\|", "|")),
		);
	const header = rows[0];
	const shortcutIndex =
		header?.findIndex((cell) => /^shortcut$/i.test(cell)) ?? -1;
	if (shortcutIndex < 0) return undefined;
	return rows
		.slice(2)
		.filter((row) => row[shortcutIndex])
		.map((row) => ({
			button: (row[0] ?? "").replaceAll("`", ""),
			description: row[1] ?? "",
			shortcut: (row[shortcutIndex] ?? "").replaceAll("`", ""),
		}));
}

/** Metadata shown to readers, independently of the author-facing API. */
export interface TpComponentUserHelp {
	commands?: TpComponentCommand[];
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
	const commands = extractComponentCommands(markdown);
	return {
		...(commands === undefined ? {} : { commands }),
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
					/^### User interactions\s*\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/m,
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
