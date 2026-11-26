import { escapeAttributeWhitespace } from "@tp/tp-utilities";
import type { MarkupLanguage } from "./markup-conversion.js";

const markerAttribute = "data-tp-conversion-comment";
/** Retain comments lost by rendering engines, without exposing them as document text. */
export function protectConversionComments(
	input: string,
	language: MarkupLanguage,
) {
	const comments = new Map<string, string>();
	const leading: string[] = [];
	let prefix = "tpconversioncomment";
	while (input.includes(prefix)) prefix += "x";
	const marker = (text: string) => {
		const key = `${prefix}${comments.size}`;
		comments.set(key, text);
		return language === "latex"
			? `\\wcSpan*[${markerAttribute}=${key}]{}`
			: `pass:[<span ${markerAttribute}="${key}"></span>]`;
	};
	const mathWithComments = (text: string) => {
		let clean = "";
		let suffix = "";
		for (let i = 0; i < text.length; i++) {
			if (text[i] === "\\") {
				clean += text[i] + (text[++i] ?? "");
				continue;
			}
			if (text[i] !== "%") {
				clean += text[i];
				continue;
			}
			const newline = text.indexOf("\n", i);
			const end = newline < 0 ? text.length : newline;
			suffix += marker(text.slice(i + 1, end).replace(/^ /, ""));
			i = end;
			while (/[ \t]/.test(text[i + 1] ?? "")) i++;
		}
		return clean + suffix;
	};
	let source = input;
	if (language === "asciidoc") {
		const lines = input.split("\n");
		const output: string[] = [];
		let literal = "";
		let pending = "";
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i] ?? "";
			const trimmed = line.trim();
			if (literal) {
				output.push(line);
				if (trimmed === literal) literal = "";
				continue;
			}
			if (pending && /^(?:\[.*\]|[-.+]{4,})$/.test(trimmed)) {
				output.push("", pending, "");
				pending = "";
			}
			if (/^(?:-{4,}|\.{4,}|\+{4,})$/.test(trimmed)) {
				literal = trimmed;
				output.push(line);
				continue;
			}
			if (/^\/{4,}$/.test(trimmed)) {
				const body: string[] = [];
				while (++i < lines.length && lines[i]?.trim() !== trimmed)
					body.push(lines[i] ?? "");
				pending += marker(body.join("\n"));
				continue;
			}
			if (/^\s*\/\//.test(line)) {
				pending += marker(line.replace(/^\s*\/\/ ?/, ""));
				output.push(line);
				continue;
			}
			// Attach to content, not block attributes or delimiters. This keeps lists and headings intact.
			if (
				pending &&
				trimmed &&
				!/^(?:\[.*\]|:.*:.*|[=*_\-|+]{2,}|\.[^.]|include::)/.test(trimmed)
			) {
				output.push(line + pending);
				pending = "";
			} else output.push(line);
		}
		if (pending) output.push("", pending);
		source = output.join("\n");
	} else if (language === "latex") {
		let output = "";
		let cursor = 0;
		let depth = 0;
		let inDocument = !/\\begin\s*\{document\}/.test(input);
		while (cursor < input.length) {
			const rest = input.slice(cursor);
			// Literal commands/environments and mathematics must never receive HTML macros.
			const env =
				/^\\begin\{(verbatim\*?|lstlisting|math|displaymath|equation\*?|align(?:at)?\*?|flalign\*?|gather\*?|multline\*?|eqnarray\*?|tabular\*?|tabularx|tblr|longtblr|array|itemize|enumerate|description|tikzpicture)\}/.exec(
					rest,
				);
			if (env) {
				const endToken = `\\end{${env[1]}}`;
				const end = input.indexOf(endToken, cursor + env[0].length);
				if (end >= 0) {
					const fragment = input.slice(cursor, end + endToken.length);
					output += /^(verbatim|lstlisting|tikzpicture)/.test(env[1] ?? "")
						? fragment
						: mathWithComments(fragment);
					cursor = end + endToken.length;
					continue;
				}
			}
			const literal =
				/^\\(?:verb\*?|lstinline(?:\[[^\]]*\])?|wcScript(?:\[[^\]]*\])?|rawhtml\*?)([^\w\s{])/.exec(
					rest,
				);
			if (literal) {
				const delimiter = literal[1] ?? "|";
				const end = input.indexOf(delimiter, cursor + literal[0].length);
				if (end >= 0) {
					output += input.slice(cursor, end + 1);
					cursor = end + 1;
					continue;
				}
			}
			const math = /^(\$\$?|\\\[|\\\()/.exec(rest);
			if (math) {
				const close =
					math[0] === "\\[" ? "\\]" : math[0] === "\\(" ? "\\)" : math[0];
				const end = input.indexOf(close, cursor + math[0].length);
				if (end >= 0) {
					output += mathWithComments(input.slice(cursor, end + close.length));
					cursor = end + close.length;
					continue;
				}
			}
			// TP option values and URL/file arguments are literal, including percent signs.
			const component =
				/^\\wc[A-Z][a-zA-Z]*\*?(?:\[(?:[^\]]|\{[^}]*\})*\])?/.exec(rest);
			const resource =
				/^\\(?:href|url|includegraphics|lstinputlisting|input|include)(?:\[[^\]]*\])?\{(?:\\.|[^}])*\}/.exec(
					rest,
				);
			const rawPrefix = component?.[0] ?? resource?.[0];
			if (rawPrefix) {
				output += rawPrefix;
				cursor += rawPrefix.length;
				continue;
			}
			if (rest.startsWith("\\begin{document}")) inDocument = true;
			if (input[cursor] === "%") {
				const newline = input.indexOf("\n", cursor);
				const end = newline < 0 ? input.length : newline;
				const text = input.slice(cursor + 1, end).replace(/^ /, "");
				// Preamble and command argument comments cannot safely contain an HTML macro.
				if (!inDocument || depth > 0) leading.push(text);
				else output += marker(text);
				cursor = end;
				if (input[cursor] === "\n") cursor++;
				while (/[ \t]/.test(input[cursor] ?? "")) cursor++;
				continue;
			}
			if (input[cursor] === "\\") {
				const command = /^\\(?:[a-zA-Z]+|[^a-zA-Z])/.exec(rest)?.[0] ?? "\\";
				output += command;
				cursor += command.length;
				continue;
			}
			if (input[cursor] === "{") depth++;
			if (input[cursor] === "}") depth--;
			output += input[cursor++];
		}
		source = output;
	}
	return {
		source,
		restore(root: HTMLElement) {
			for (const element of root.querySelectorAll(`[${markerAttribute}]`)) {
				const text = comments.get(element.getAttribute(markerAttribute) ?? "");
				if (text === undefined) continue;
				const parent = element.parentElement;
				const comment = document.createComment(text);
				if (language === "asciidoc" && parent !== root) {
					let block: Element = element;
					while (block.parentElement && block.parentElement !== root)
						block = block.parentElement;
					block.before(comment);
					element.remove();
				} else element.replaceWith(comment);
				if (
					parent?.matches("p") &&
					!parent.textContent?.trim() &&
					!parent.children.length
				)
					parent.replaceWith(...parent.childNodes);
			}
			root.prepend(...leading.map((text) => document.createComment(text)));
		},
	};
}

/** Block-only comment syntaxes cannot faithfully occupy a position inside a phrase. */
export function moveInlineCommentsToBlockBoundary(html: string): string {
	const template = document.createElement("template");
	if (!html.includes("<!--")) return html;
	template.innerHTML = escapeAttributeWhitespace(html);
	const walker = document.createTreeWalker(
		template.content,
		NodeFilter.SHOW_COMMENT,
	);
	const comments: Comment[] = [];
	while (walker.nextNode()) comments.push(walker.currentNode as Comment);
	for (const comment of comments) {
		let block = comment.parentElement;
		if (!block) continue;
		while (block.parentElement) block = block.parentElement;
		block.before(comment);
	}
	return template.innerHTML;
}
