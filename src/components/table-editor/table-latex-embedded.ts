import type { TableData } from "./table-markup.js";

const prepared = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
const selector = "tp-markdown,tp-asciidoc,tp-restructuredtext,tp-html,tp-latex";
const key = (html: string, base: string) => JSON.stringify([base, html]);
/** Use already converted blocks without making the existing synchronous API asynchronous. */
export function cachedLatexData(data: TableData, base: string): TableData {
	return {
		...data,
		cells: data.cells.map((row, r) =>
			row.map((html, c) =>
				data.cellTypes?.[r]?.[c] === "rich"
					? (prepared.get(key(html, base)) ?? html)
					: html,
			),
		),
	};
}
async function renderBlocks(
	html: string,
	base: string,
	depth = 0,
): Promise<string> {
	if (depth > 8)
		throw new Error("Embedded markup nesting exceeds eight levels");
	const template = document.createElement("template");
	template.innerHTML = html;
	for (const element of [...template.content.querySelectorAll(selector)]) {
		if (element.parentElement?.closest(selector)) continue;
		let source =
			element.querySelector(":scope > script")?.textContent ??
			element.textContent ??
			"";
		const url = new URL(element.getAttribute("src") || base, base);
		if (element.hasAttribute("src")) {
			const response = await fetch(url);
			if (!response.ok)
				throw new Error(`Unable to load embedded markup (${response.status})`);
			source = await response.text();
		}
		let rendered: string;
		switch (element.localName) {
			case "tp-markdown":
				rendered = await (
					await import("../../utilities/markdown-source.js")
				).renderMarkdownToHtml(source, url.href);
				break;
			case "tp-asciidoc":
				rendered = await (
					await import("../asciidoc/asciidoc.js")
				).renderAsciidocToHtml(source, url);
				break;
			case "tp-restructuredtext":
				rendered = await (
					await import("../restructuredtext/restructuredtext.js")
				).renderRestructuredTextToHtml(source);
				break;
			case "tp-latex": {
				const holder = document.createElement("div");
				holder.append(
					(await import("@tp/tp-latex")).renderLatexToFragment(source),
				);
				rendered = holder.innerHTML;
				break;
			}
			default:
				rendered = element.querySelector(":scope > script")
					? source
					: element.innerHTML;
		}
		const replacement = document.createElement("template");
		replacement.innerHTML = await renderBlocks(rendered, url.href, depth + 1);
		// Relative media paths in an included document belong to that document.
		if (element.hasAttribute("src"))
			for (const node of replacement.content.querySelectorAll("[src],[href]"))
				for (const attr of ["src", "href"]) {
					const value = node.getAttribute(attr);
					if (value && !value.startsWith("#"))
						node.setAttribute(attr, new URL(value, url).href);
				}
		element.replaceWith(replacement.content);
	}
	return template.innerHTML;
}
/** Render embedded source languages before converting their semantic HTML to native LaTeX. */
export async function prepareLatexData(
	data: TableData,
	base: string,
): Promise<TableData> {
	await Promise.all(
		data.cells.flatMap((row, r) =>
			row.map(async (html, c) => {
				if (
					data.cellTypes?.[r]?.[c] !== "rich" ||
					!/<tp-(?:markdown|asciidoc|restructuredtext|html|latex)\b/.test(html)
				)
					return;
				const id = key(html, base);
				if (prepared.has(id)) return;
				let promise = pending.get(id);
				if (!promise) {
					promise = renderBlocks(html, base);
					pending.set(id, promise);
				}
				try {
					prepared.set(id, await promise);
					if (prepared.size > 100) {
						const oldest = prepared.keys().next().value;
						if (oldest) prepared.delete(oldest);
					}
				} finally {
					pending.delete(id);
				}
			}),
		),
	);
	return cachedLatexData(data, base);
}
