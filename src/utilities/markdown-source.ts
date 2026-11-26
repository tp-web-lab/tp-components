/** Markdown source conversion shared by browser components and publication builds. */
import { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";
import { markPivotRawHtml } from "./markup-pivot-authorship.js";

type TpMarkdownParserInstance = InstanceType<typeof TpMarkdownParser>;

interface ProtectedMarkdownSource {
	source: string;
	restore(html: string): string;
}

/** Keeps raw-text HTML elements intact while their parent web component is rendered as Markdown. */
function protectMarkdownRawTextElements(
	source: string,
	pivot = false,
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
				? line.match(
						/^ {0,3}(?:<[a-z][\w:-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>\s*)*?<(script|style|textarea|template)\b/i,
					)
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
					result.replace(
						`<!--tp-markdown-raw-text-${String(index)}-->`,
						pivot ? markPivotRawHtml(block) : block,
					),
				html,
			),
	};
}

export async function renderProtectedMarkdown(
	parser: TpMarkdownParserInstance,
	source: string,
	pivot = false,
): Promise<string> {
	const protectedSource = protectMarkdownRawTextElements(source, pivot);
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

/** Keep authored tabindex values while omitting the anchor plugin's generated values. */
function omitGeneratedHeadingTabindex(parser: TpMarkdownParserInstance): void {
	const authored = new WeakMap<object, string | null>();
	parser.md.core.ruler.before(
		"anchor",
		"tp_capture_heading_tabindex",
		(state) => {
			for (const token of state.tokens) {
				if (token.type === "heading_open")
					authored.set(token, token.attrGet("tabindex"));
			}
		},
	);
	parser.md.core.ruler.after(
		"anchor",
		"tp_restore_heading_tabindex",
		(state) => {
			for (const token of state.tokens) {
				if (!authored.has(token)) continue;
				const value = authored.get(token);
				if (value != null) token.attrSet("tabindex", value);
				else {
					const index = token.attrIndex("tabindex");
					if (index >= 0) token.attrs?.splice(index, 1);
				}
			}
		},
	);
}

/** Omit presentation-only table decorations; protect raw author HTML at token level. */
function prepareMarkdownPivot(parser: TpMarkdownParserInstance): void {
	parser.md.core.ruler.disable("tp_native_table_class", true);
	// Wrap only the actual HTML rules, not HTML tokens emitted by extensions.
	const inline = (
		parser.md.inline.ruler as unknown as {
			__rules__: {
				name: string;
				fn: ReturnType<typeof parser.md.inline.ruler.getRules>[number];
			}[];
		}
	).__rules__.find((rule) => rule.name === "html_inline")?.fn;
	if (inline)
		parser.md.inline.ruler.at("html_inline", (state, silent) => {
			const start = state.tokens.length;
			const matched = inline(state, silent);
			if (matched && !silent)
				for (const token of state.tokens.slice(start))
					token.content = markPivotRawHtml(token.content);
			return matched;
		});
	const block = (
		parser.md.block.ruler as unknown as {
			__rules__: {
				name: string;
				fn: ReturnType<typeof parser.md.block.ruler.getRules>[number];
			}[];
		}
	).__rules__.find((rule) => rule.name === "html_block")?.fn;
	if (block)
		parser.md.block.ruler.at("html_block", (state, start, end, silent) => {
			const offset = state.tokens.length;
			const matched = block(state, start, end, silent);
			if (matched && !silent)
				for (const token of state.tokens.slice(offset))
					token.content = markPivotRawHtml(token.content);
			return matched;
		});
}

export async function renderMarkdownToHtml(
	source: string,
	path = "/index.md",
	options: { omitGeneratedHeadingTabindex?: boolean; pivot?: boolean } = {},
): Promise<string> {
	const parser = createTpMarkdownParser(path);
	if (options.pivot) prepareMarkdownPivot(parser);
	if (options.omitGeneratedHeadingTabindex)
		omitGeneratedHeadingTabindex(parser);
	return renderProtectedMarkdown(parser, source, options.pivot);
}

export async function parseMarkdownToTokens(
	source: string,
	path = "/index.md",
): Promise<unknown> {
	const result = await createTpMarkdownParser(path).parseAsync(source);
	return result.tokens;
}

export { resolveMarkdownIncludes } from "./markdown-includes.js";
