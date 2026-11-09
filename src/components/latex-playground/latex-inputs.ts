/** @module components/latex-playground/latex-inputs */
import type { TpLatexProject } from "./latex-project.js";

function normalizePath(path: string): string {
	const parts: string[] = [];
	for (const part of path.split("/")) {
		if (part === "..") parts.pop();
		else if (part && part !== ".") parts.push(part);
	}
	return `/${parts.join("/")}`;
}

/** Expand literal input paths from the entry directory, using only project files. */
export function resolveLatexInputs(
	project: TpLatexProject,
	entryPath: string,
): string {
	const files = new Map(
		project.files.map((file) => [normalizePath(file.path), file.content]),
	);
	const entry = normalizePath(entryPath);
	const base = entry.slice(0, entry.lastIndexOf("/") + 1);
	let size = 0;
	function expand(path: string, stack: string[]): string {
		if (stack.includes(path))
			throw new Error(`Circular LaTeX input: ${[...stack, path].join(" -> ")}`);
		if (stack.length >= 64)
			throw new Error("LaTeX input nesting exceeds 64 files.");
		const source = files.get(path);
		if (source === undefined)
			throw new Error(
				`LaTeX input file not found: ${path} (from ${stack.at(-1) ?? entry})`,
			);
		size += source.length;
		if (size > 5_000_000)
			throw new Error("Expanded LaTeX project exceeds 5 MB.");
		// Consume complete commands so escaped backslashes and percent signs stay literal.
		const tokens = /%[^\n]*(?:\n|$)|\\([a-zA-Z]+|[^a-zA-Z])/g;
		let result = "";
		let copied = 0;
		let token = tokens.exec(source);
		while (token) {
			const command = token[1];
			let end = tokens.lastIndex;
			if (command === "verb") {
				if (source[end] === "*") end++;
				const delimiter = source[end];
				const close = delimiter ? source.indexOf(delimiter, end + 1) : -1;
				tokens.lastIndex = close < 0 ? source.length : close + 1;
			} else if (command === "begin") {
				const env = /^\s*\{(verbatim\*?|comment)\}/.exec(source.slice(end));
				if (env) {
					const closing = `\\end{${env[1]}}`;
					const close = source.indexOf(closing, end + env[0].length);
					tokens.lastIndex = close < 0 ? source.length : close + closing.length;
				}
			} else if (command === "wcScript" || command === "rawhtml") {
				const attributes = /^\s*(?:\[(?:"[^"]*"|'[^']*'|[^\]])*\])?\s*/.exec(
					source.slice(end),
				);
				end += attributes?.[0].length ?? 0;
				if (source[end] === "{") {
					let depth = 1;
					while (++end < source.length && depth) {
						if (source[end] === "\\") end++;
						else if (source[end] === "{") depth++;
						else if (source[end] === "}") depth--;
					}
					tokens.lastIndex = end;
				} else {
					const delimiter = source[end];
					const close = delimiter ? source.indexOf(delimiter, end + 1) : -1;
					tokens.lastIndex = close < 0 ? source.length : close + 1;
				}
			} else if (command === "input") {
				const argument = /^\s*\{([^{}]*)\}|^[ \t]*([^\s%{}]+)/.exec(
					source.slice(end),
				);
				if (!argument)
					throw new Error(
						`Expected a literal filename after \\input in ${path}`,
					);
				const name = (argument[1] ?? argument[2] ?? "").trim();
				if (!name || /[\\#]/.test(name))
					throw new Error(
						`Unsupported LaTeX input filename in ${path}: ${name}`,
					);
				let target = normalizePath(name.startsWith("/") ? name : base + name);
				if (!files.has(target) && !target.endsWith(".tex")) target += ".tex";
				const content = expand(target, [...stack, path]);
				result += `${source.slice(copied, token.index)}${content}\n`;
				copied = end + argument[0].length;
				tokens.lastIndex = copied;
			}
			token = tokens.exec(source);
		}
		return result + source.slice(copied);
	}
	return expand(entry, []);
}
