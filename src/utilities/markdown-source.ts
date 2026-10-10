/** Markdown source conversion shared by browser components and publication builds. */
import { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";

type TpMarkdownParserInstance = InstanceType<typeof TpMarkdownParser>;

interface ProtectedMarkdownSource {
	source: string;
	restore(html: string): string;
}

/** Keeps raw-text HTML elements intact while their parent web component is rendered as Markdown. */
function protectMarkdownRawTextElements(
	source: string,
): ProtectedMarkdownSource {
	const lines = source.replace(/\r\n?/g, "\n").split("\n");
	const blocks: string[] = [];
	const output: string[] = [];
	let fence: { marker: string; length: number } | null = null;

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		const fenceMatch = line.match(/^(?:[ ]{0,3}:\s*)?[ ]{0,3}(`{3,}|~{3,})/);
		if (fenceMatch?.[1] !== undefined) {
			const marker = fenceMatch[1][0] ?? "";
			if (fence === null) fence = { marker, length: fenceMatch[1].length };
			else if (marker === fence.marker && fenceMatch[1].length >= fence.length)
				fence = null;
			output.push(line);
			continue;
		}

		const opening =
			fence === null
				? line.match(/^ {0,3}<(script|style|textarea|template)\b/i)
				: null;
		const tag = opening?.[1]?.toLowerCase();
		if (tag === undefined) {
			output.push(line);
			continue;
		}

		const blockLines = [line];
		while (
			!new RegExp(`</${tag}\\s*>`, "i").test(blockLines.at(-1) ?? "") &&
			index + 1 < lines.length
		) {
			index += 1;
			blockLines.push(lines[index] ?? "");
		}
		const blockIndex = blocks.push(blockLines.join("\n")) - 1;
		output.push(`<!--tp-markdown-raw-text-${String(blockIndex)}-->`);
	}

	return {
		source: output.join("\n"),
		restore: (html: string): string =>
			blocks.reduce(
				(result, block, index) =>
					result.replace(`<!--tp-markdown-raw-text-${String(index)}-->`, block),
				html,
			),
	};
}

export async function renderProtectedMarkdown(
	parser: TpMarkdownParserInstance,
	source: string,
): Promise<string> {
	const protectedSource = protectMarkdownRawTextElements(source);
	const rendered = protectedSource.restore(
		await parser.renderAsync(protectedSource.source),
	);
	return rendered.replace(
		/<p(\s[^>]*)?>\s*<p>([\s\S]*?)<\/p>\s*<\/p>/gi,
		(_match, attributes: string | undefined, content: string) =>
			`<p${attributes ?? ""}>${content}</p>`,
	);
}

export function createTpMarkdownParser(
	path = "/index.md",
): TpMarkdownParserInstance {
	return new TpMarkdownParser({
		path,
		pageNavRoot: false,
	});
}

export async function renderMarkdownToHtml(
	source: string,
	path = "/index.md",
): Promise<string> {
	return renderProtectedMarkdown(createTpMarkdownParser(path), source);
}

export async function parseMarkdownToTokens(
	source: string,
	path = "/index.md",
): Promise<unknown> {
	const result = await createTpMarkdownParser(path).parseAsync(source);
	return result.tokens;
}

export { resolveMarkdownIncludes } from "./markdown-includes.js";
