import {
	applyDocumentNumbering,
	clearNumbering,
	escapeAttributeWhitespace,
	mediaOptionNames,
	numberingPreamble,
	numberingRuntimeSource,
	readNumbering,
} from "@tp/tp-utilities";
import {
	stripTheoremPresentation,
	theoremNumbers,
} from "../components/theorem/theorem-numbering.js";
import {
	cleanReferenceMarkup,
	indexComponents,
	referenceSourceHtml,
} from "./index-markup.js";
import {
	moveInlineCommentsToBlockBoundary,
	protectConversionComments,
} from "./markup-comments.js";
import {
	expandMarkupIncludes,
	extractMarkupIncludes,
	markupIncludeDirective,
} from "./markup-includes.js";
import {
	protectPivotMarkup,
	protectPivotRawElement,
	restorePivotMarkup,
} from "./markup-pivot-authorship.js";
import { resolveImageCandidates } from "./markup-responsive-images.js";
/** Native markup conversions shared by editors and the markup converter. */

import { tableRichLatex } from "../components/table-editor/table-rich-latex.js";
import { formatMarkupHtml } from "./format-markup-html.js";
import {
	fetchLatexBibliographyFiles,
	fetchLatexListingFiles,
} from "./latex-listing-files.js";
import {
	figureBlocks,
	nativeComplexFigure,
	nativeImage,
	nativeImageOptions,
	nativeList,
} from "./markup-native-presentation.js";
import { markupNativeTable } from "./markup-native-table.js";
import { normalizeMarkupHtml } from "./markup-normalize.js";
import { nativeMarkup } from "./native-markup.js";

export type MarkupLanguage =
	| "html"
	| "asciidoc"
	| "latex"
	| "markdown"
	| "restructuredtext";
export const markupFormats = [
	{
		language: "html",
		label: "html",
		extension: "html",
		accept: ".html,.htm",
		icon: "file_type_html",
	},
	{
		language: "asciidoc",
		label: "tp-asciidoc",
		extension: "adoc",
		accept: ".adoc,.asciidoc",
		icon: "file_type_asciidoc",
	},
	{
		language: "latex",
		label: "tp-latex",
		extension: "tex",
		accept: ".tex,.latex",
		icon: "file_type_latex",
	},
	{
		language: "markdown",
		label: "tp-markdown",
		extension: "md",
		accept: ".md,.markdown",
		icon: "file_type_markdown",
	},
	{
		language: "restructuredtext",
		label: "tp-restructuredtext",
		extension: "rst",
		accept: ".rst,.rest,.restructuredtext",
		icon: "file_type_restructuredtext",
	},
] as const;

export function normalizeMarkupLanguage(value: string): MarkupLanguage {
	const name = value.toLowerCase().replace(/^tp[/-]/, "");
	const format = markupFormats.find(
		(item) =>
			item.language === name || item.accept.split(",").includes(`.${name}`),
	);
	if (!format) throw new TypeError(`Unsupported markup language: ${value}`);
	return format.language;
}

export function markupLanguageFromPath(path: string): MarkupLanguage {
	const filename = new URL(path, "https://tp.invalid/").pathname;
	return normalizeMarkupLanguage(filename.split(".").pop() ?? "");
}

/** Context for resolving relative resources during programmatic conversion. */
export interface MarkupConversionOptions {
	/** Source document URL; defaults to the current browser document. */
	baseURL?: string;
}

/**
 * Converts markup without creating or changing a converter component.
 * Resolves asynchronously because language parsers and resources load on demand.
 */
export async function convertMarkup(
	code: string,
	fromMarkup: string,
	toMarkup: string,
	options: MarkupConversionOptions = {},
): Promise<string> {
	const from = normalizeMarkupLanguage(fromMarkup);
	const to = normalizeMarkupLanguage(toMarkup);
	if (from === to) return code;
	const base = new URL(options.baseURL ?? document.baseURI, document.baseURI)
		.href;
	const { source, includes } = extractMarkupIncludes(code, from);
	let result = htmlToMarkup(await markupToHtml(source, from, base), to);
	for (const include of includes) {
		const directive = markupIncludeDirective(include.path, to);
		const placeholder =
			to === "html" ? `<p>${include.marker}</p>` : include.marker;
		result = result.replace(placeholder, () => directive);
	}
	return result;
}

/** Fetches a document and converts it; use "auto" to infer its source language. */
export async function convertMarkupFile(
	filename: string,
	fromMarkup: string,
	toMarkup: string,
	options: MarkupConversionOptions = {},
): Promise<string> {
	const base = new URL(options.baseURL ?? document.baseURI, document.baseURI);
	const url = new URL(filename, base);
	const from =
		fromMarkup === "auto"
			? markupLanguageFromPath(url.href)
			: normalizeMarkupLanguage(fromMarkup);
	const to = normalizeMarkupLanguage(toMarkup);
	const response = await fetch(url.href);
	if (!response.ok)
		throw new Error(`Unable to load ${url.href} (${response.status}).`);
	return convertMarkup(await response.text(), from, to, {
		...options,
		baseURL: url.href,
	});
}

function nativeAttributes(
	element: Element,
	target: string,
	excluded: string[] = [],
): string {
	const attrs = [...element.attributes].filter(
		(attr) => !excluded.includes(attr.name),
	);
	const value = (text: string) =>
		text.includes('"') && !text.includes("'")
			? `'${text}'`
			: JSON.stringify(text);
	if (target === "rst")
		return attrs.length
			? `.. attributes::\n${attrs.map((attr) => `   :${attr.name}:${attr.value ? ` ${attr.value}` : ""}`).join("\n")}\n\n`
			: "";
	return attrs
		.map((attr) =>
			attr.name === "class" && target === "adoc"
				? `role=${value(attr.value)}`
				: `${attr.name}=${value(attr.value)}`,
		)
		.join(target === "adoc" ? "," : " ");
}

export function htmlToMarkup(
	html: string,
	language: MarkupLanguage,
	nested = false,
): string {
	const numbered = document.createElement("template");
	numbered.innerHTML = html;
	const numbering = readNumbering(numbered.content);
	if (numbering && language === "html") {
		for (const old of numbered.content.querySelectorAll(
			"script[data-tp-numbering-runtime]",
		))
			old.remove();
		applyDocumentNumbering(numbered.content, numbering);
		const runtime = document.createElement("script");
		runtime.setAttribute("data-tp-numbering-runtime", "");
		runtime.textContent = numberingRuntimeSource();
		numbered.content.append(runtime);
		return formatMarkupHtml(numbered.innerHTML);
	}

	if (numbering && Object.keys(numbering).length && language !== "html") {
		const headings = [
			...numbered.content.querySelectorAll("h1,h2,h3,h4,h5,h6"),
		].map(
			(h) =>
				!h.classList.contains("unnumbered") &&
				Number(h.localName[1]) <= (numbering.section?.maxLevel ?? 6),
		);
		clearNumbering(numbered.content);
		const listings = new Map<string, string>();
		if (language === "latex" && numbering.code?.enabled) {
			for (const figure of numbered.content.querySelectorAll("figure")) {
				const pre = figure.querySelector(":scope > pre");
				const caption = figure.querySelector(":scope > figcaption");
				if (
					!pre ||
					!caption ||
					figure.children.length !== 2 ||
					figure.classList.contains("unnumbered") ||
					[...figure.attributes].some((a) => a.name !== "id") ||
					caption.attributes.length ||
					caption.querySelector("*:not(p)")
				)
					continue;
				const title = caption.textContent?.trim() ?? "";
				if (!title || /[\\{}%&#_$^~]/.test(title)) continue;
				let listing = htmlToMarkup(pre.outerHTML, "latex", true).replace(
					/^\\usepackage\{[^}]*\}\s*/g,
					"",
				);
				if (!listing.includes("\\begin{lstlisting}")) continue;
				listing = listing.replace(
					/\\begin\{lstlisting\}(?:\[([^\]]*)\])?/,
					(_all, options) =>
						`\\begin{lstlisting}[${options ? `${options},` : ""}caption={${title}}${figure.id ? `,label={${figure.id}}` : ""}]`,
				);
				const key = `TPAUTOMATICLISTING${listings.size}END`;
				listings.set(key, listing);
				const placeholder = document.createElement("p");
				placeholder.textContent = key;
				figure.replaceWith(placeholder);
			}
		}
		let code = htmlToMarkup(numbered.innerHTML, language, nested);
		for (const [key, listing] of listings) code = code.replace(key, listing);
		const literalBlocks: string[] = [];
		if (language === "latex")
			code = code.replace(
				/\\begin\{(?:lstlisting|verbatim)\}[\s\S]*?\\end\{(?:lstlisting|verbatim)\}/g,
				(block) => `TPNUMBERINGCODE${literalBlocks.push(block) - 1}END`,
			);
		if (language === "latex" && numbering.section?.enabled) {
			let i = 0;
			code = code.replace(
				/\\(chapter|section|subsection|subsubsection|paragraph|subparagraph)\*/g,
				(all, name) => (headings[i++] ? `\\${name}` : all),
			);
		}
		if (language === "latex") {
			const declarations: string[] = [];
			code = code.replace(
				/\\(?:documentclass|usepackage)(?:\[[^\]]*\])?\{[^}]*\}\n?/g,
				(line) => {
					declarations.push(line.trim());
					return "";
				},
			);
			if (
				numbering.section?.enabled &&
				!declarations.some((line) => line.startsWith("\\documentclass"))
			)
				declarations.unshift("\\documentclass{report}");
			if (
				listings.size &&
				!declarations.some((line) => line.includes("listings"))
			)
				declarations.push("\\usepackage{listings}");
			const independent = declarations.some((line) => line.includes("{report}"))
				? (["figure", "table", "code"] as const)
						.filter((kind) => numbering[kind]?.enabled)
						.map(
							(kind) =>
								`\\counterwithout{${kind === "code" ? "lstlisting" : kind}}{chapter}`,
						)
						.join("\n")
				: "";
			code = code.replace(
				/TPNUMBERINGCODE(\d+)END/g,
				(_all, i) => literalBlocks[Number(i)] ?? _all,
			);
			return (
				declarations.join("\n") +
				"\n" +
				independent +
				"\n" +
				numberingPreamble(numbering, language) +
				code
			);
		}
		return numberingPreamble(numbering, language) + code;
	}

	if (
		html.includes("data-tp-equanum-generated") ||
		html.includes("data-tp-theorem-generated") ||
		html.includes("data-tp-bibtex-generated") ||
		html.includes("data-tp-python-tracer-generated") ||
		html.includes("data-tp-javascript-tracer-generated") ||
		html.includes("data-tp-typescript-tracer-generated") ||
		html.includes("data-tp-scheme-tracer-generated") ||
		html.includes("data-tp-ocaml-tracer-generated") ||
		html.includes("data-tp-prolog-tracer-generated") ||
		html.includes("data-tp-reference-output")
	) {
		const clean = document.createElement("template");
		clean.innerHTML = referenceSourceHtml(html);
		stripTheoremPresentation(clean.content);
		for (const n of clean.content.querySelectorAll(
			"[data-tp-equanum-generated]",
		))
			n.remove();
		cleanReferenceMarkup(clean.content);
		for (const node of clean.content.querySelectorAll(
			"tp-bibtex > [data-tp-bibtex-generated], tp-python-tracer > [data-tp-python-tracer-generated], tp-javascript-tracer > [data-tp-javascript-tracer-generated], tp-typescript-tracer > [data-tp-typescript-tracer-generated], tp-scheme-tracer > [data-tp-scheme-tracer-generated], tp-ocaml-tracer > [data-tp-ocaml-tracer-generated], tp-prolog-tracer > [data-tp-prolog-tracer-generated]",
		))
			node.remove();
		html = clean.innerHTML;
	}
	if (language === "html") return formatMarkupHtml(html);
	if (language === "asciidoc" || language === "restructuredtext")
		html = moveInlineCommentsToBlockBoundary(html);
	const quotations = document.createElement("template");
	quotations.innerHTML = html;
	for (const [node, number] of theoremNumbers(quotations.content))
		if (!node.hasAttribute("number")) node.setAttribute("number", number);

	// Normalize interleaved fallback runs into native paragraphs, then retain their placement.
	for (const media of quotations.content.querySelectorAll("audio,video")) {
		const nodes = [...media.childNodes];
		const significant = nodes.filter(
			(n) => n.nodeType !== Node.TEXT_NODE || n.textContent?.trim(),
		);
		const tags = significant
			.map((n) =>
				n instanceof Element && n.localName === "source"
					? "s"
					: n instanceof Element && n.localName === "track"
						? "t"
						: "b",
			)
			.join("");
		if (/^s*t*b*$/.test(tags)) continue;
		const counts = { s: 0, t: 0, b: 0 };
		const order: string[] = [],
			unwrap: number[] = [];
		let run: Node[] = [];
		const flush = () => {
			if (!run.length) return;
			if (
				run.every(
					(n) => n.nodeType === Node.TEXT_NODE && !n.textContent?.trim(),
				)
			) {
				run = [];
				return;
			}
			const p = document.createElement("p");
			p.append(...run);
			media.append(p);
			unwrap.push(counts.b);
			order.push(`b${counts.b++}`);
			run = [];
		};
		media.replaceChildren();
		for (const node of nodes) {
			const tag = node instanceof Element ? node.localName : "";
			if (tag === "source" || tag === "track") {
				flush();
				media.append(node);
				const key = tag === "source" ? "s" : "t";
				order.push(`${key}${counts[key]++}`);
			} else if (
				/^(p|ul|ol|div|blockquote|pre|table|h[1-6]|figure)$/.test(tag)
			) {
				flush();
				media.append(node);
				order.push(`b${counts.b++}`);
			} else run.push(node);
		}
		flush();
		media.setAttribute("children-order", order.join(","));
		if (unwrap.length) media.setAttribute("fallback-unwrap", unwrap.join(","));
	}
	for (const element of quotations.content.querySelectorAll("*")) {
		const values = Object.fromEntries(
			[...element.attributes]
				.filter(
					(a) =>
						(/[\r\n\t]/.test(a.value) &&
							!(
								a.name === "value" &&
								["tp-code-editor", "tp-math"].includes(element.localName)
							)) ||
						(["audio", "video"].includes(element.localName) &&
							!mediaOptionNames.includes(a.name)),
				)
				.map((a) => [a.name, a.value]),
		);
		if (Object.keys(values).length) {
			for (const key of Object.keys(values)) element.removeAttribute(key);
			element.setAttribute(
				"tp-attributes",
				encodeURIComponent(JSON.stringify(values)),
			);
		}
	}
	if (language === "latex") {
		for (const container of quotations.content.querySelectorAll(
			"figure,figcaption",
		)) {
			const parts = figureBlocks(container);
			if (
				parts.some((part) => part.unwrap) &&
				[...container.children].some((child) =>
					/^(?:p|ul|ol|pre|blockquote)$/.test(child.localName),
				)
			) {
				// Normalize only this container's phrasing runs, never flatten its caption.
				let run: Node[] = [];
				const unwrap: number[] = [];
				let index = 0;
				const flush = () => {
					if (!run.length) return;
					if (
						run.some((node) => node.textContent?.trim() || node.nodeType === 1)
					) {
						const p = document.createElement("p");
						container.insertBefore(p, run[0] || null);
						p.append(...run);
						unwrap.push(index++);
					}
					run = [];
				};
				for (const node of [...container.childNodes]) {
					if (
						node instanceof Element &&
						/^(?:p|figure|figcaption|ul|ol|pre|blockquote|img|table)$/.test(
							node.localName,
						)
					) {
						flush();
						index++;
					} else run.push(node);
				}
				flush();
				if (unwrap.length)
					container.setAttribute("tp-unwrap", unwrap.join(","));
			}
		}
	}

	// Regenerate recognized automatic TOCs instead of freezing their link lists.
	const tocs = quotations.content.querySelectorAll(
		'nav#toc, nav[data-tp-toc], nav[role="doc-toc"], [data-markdown-toc], .contents.topic',
	);
	if (tocs.length) {
		for (const backlink of quotations.content.querySelectorAll("a.toc-backref"))
			backlink.replaceWith(...backlink.childNodes);
		const replacements = new Map<string, string>();
		for (const toc of tocs) {
			let marker = `TPAUTOMATICTOC${replacements.size}END`;
			while (html.includes(marker)) marker += "X";
			const paragraph = document.createElement("p");
			paragraph.textContent = marker;
			toc.replaceWith(paragraph);
			replacements.set(
				marker,
				language === "latex"
					? "\\tableofcontents"
					: language === "markdown"
						? "[[toc]]"
						: language === "restructuredtext"
							? ".. contents:: Contents\n   :backlinks: none"
							: ":toc: macro\n:toc-title: Contents\n\ntoc::[]",
			);
		}
		let result = htmlToMarkup(quotations.innerHTML, language);
		for (const [marker, directive] of replacements)
			result = result.replace(marker, directive);
		return result;
	}
	for (const quote of language === "latex"
		? []
		: quotations.content.querySelectorAll("[data-tp-quotation]")) {
		for (const span of quote.querySelectorAll("span")) {
			if (
				[...span.attributes].every((a) => a.name === "lang") &&
				span.getAttribute("lang") === quote.getAttribute("lang")
			)
				span.replaceWith(...span.childNodes);
		}
	}
	if (language === "restructuredtext") {
		for (const span of quotations.content.querySelectorAll(
			"span.keyseq,span.menuseq",
		))
			span.replaceWith(...span.childNodes);
	}
	for (const list of quotations.content.querySelectorAll("ul[class]")) {
		if (/^sectlevel[1-6]$/.test(list.className)) list.removeAttribute("class");
	}
	html = quotations.innerHTML;
	if (language !== "latex") {
		const target =
			language === "markdown" ? "md" : language === "asciidoc" ? "adoc" : "rst";
		const template = document.createElement("template");
		template.innerHTML = html;
		const headings = new Map<string, string>();
		const markerParagraph = (marker: string): HTMLElement => {
			const paragraph = document.createElement("p");
			paragraph.textContent = marker;
			return paragraph;
		};
		for (const list of template.content.querySelectorAll("ol,ul")) {
			if (list.parentElement?.closest("[data-tp-list-label]")) continue;
			const source = nativeList(list, language, htmlToMarkup);
			if (source === undefined) continue;
			const marker = `TPMARKUPLIST${headings.size}END`;
			headings.set(marker, source);
			list.replaceWith(markerParagraph(marker));
		}
		for (const editor of template.content.querySelectorAll<HTMLElement>(
			"tp-code-editor[readonly][line-numbers]",
		)) {
			if (
				editor.hasAttribute("src") ||
				editor.hasAttribute("word-wrap") ||
				editor.hasAttribute("line-wrapping")
			)
				continue;
			if (
				[...editor.attributes].some(
					(attr) =>
						![
							"readonly",
							"class",
							"line-numbers",
							"line-number-start",
							"language",
							"value",
							"data-tp-latex-listing",
							"style",
						].includes(attr.name),
				)
			)
				continue;
			if (
				(editor.getAttribute("style") || "")
					.split(";")
					.filter((part) => part.trim())
					.map((part) => part.split(":")[0]?.trim() || "")
					.some(
						(name) =>
							![
								"--tp-latex-listing-tab-size",
								"tab-size",
								"white-space",
								"overflow-x",
							].includes(name),
					) ||
				[
					editor.style.tabSize,
					editor.style.getPropertyValue("--tp-latex-listing-tab-size"),
				].some((value) => value && value.trim() !== "2")
			)
				continue;
			const value =
				editor.getAttribute("value") ??
				editor.querySelector("script")?.textContent ??
				"";
			const syntax = editor.getAttribute("language") || "plaintext";
			const start = editor.getAttribute("line-number-start") || "1";
			if (!/^[a-zA-Z0-9+-]+$/.test(syntax) || !/^[1-9][0-9]*$/.test(start))
				continue;

			const theme = ["tp-dark", "tp-light"].find((value) =>
				editor.classList.contains(value),
			);
			if ([...editor.classList].some((value) => value !== theme)) continue;
			const marker = `TPMARKUPLISTING${headings.size}END`;
			const fence = "-".repeat(
				Math.max(
					4,
					...value
						.split("\n")
						.map((line) => (/^-+$/.test(line) ? line.length + 1 : 0)),
				),
			);
			headings.set(
				marker,
				target === "md"
					? `${"~".repeat(Math.max(3, ...value.split("\n").map((line) => (/^~+$/.test(line.trim()) ? line.trim().length + 1 : 0))))}${syntax} {numbers=left firstnumber=${start} literal-tail="${encodeURIComponent(/[ \t\r\n]*$/.exec(value)?.[0] || "") || "-"}"${theme ? ` .${theme}` : ""}}\n${value}\n${"~".repeat(Math.max(3, ...value.split("\n").map((line) => (/^~+$/.test(line.trim()) ? line.trim().length + 1 : 0))))}`
					: target === "adoc"
						? `[source,${syntax},linenums,start=${start},literal-tail="${encodeURIComponent(/[ \t\r\n]*$/.exec(value)?.[0] || "") || "-"}"${theme ? `,role="${theme}"` : ""}]\n${fence}\n${value}\n${fence}`
						: `.. code:: ${syntax}\n   :number-lines: ${start}\n   :literal-indent: 3\n   :literal-lines: ${value.split("\n").length}${theme ? `\n   :class: ${theme}` : ""}\n\n${value
								.split("\n")
								.map((line) => `   ${line}`)
								.join("\n")}`,
			);
			editor.replaceWith(markerParagraph(marker));
		}
		for (const editor of template.content.querySelectorAll(
			"tp-code-editor[value]",
		)) {
			const script = document.createElement("script");
			script.type = `tp/${editor.getAttribute("language") || "plaintext"}`;
			script.textContent = editor.getAttribute("value") ?? "";
			editor.removeAttribute("value");
			editor.append(script);
		}
		for (const figure of template.content.querySelectorAll("figure")) {
			if (figure.closest("td,th")) continue;
			for (const paragraph of figure.querySelectorAll(":scope > p")) {
				if (
					!paragraph.attributes.length &&
					paragraph.children.length === 1 &&
					paragraph.firstElementChild?.localName === "img" &&
					!paragraph.textContent?.trim()
				)
					paragraph.replaceWith(...paragraph.childNodes);
			}
			const complex = nativeComplexFigure(figure, language, (html, lang) =>
				htmlToMarkup(html, lang, true),
			);
			if (complex) {
				const marker = `TPMARKUPFIGURE${headings.size}END`;
				headings.set(marker, complex);
				figure.replaceWith(markerParagraph(marker));
				continue;
			}
			const table = figure.querySelector(":scope > table");
			const caption = figure.querySelector(":scope > figcaption");
			if (
				table &&
				[...figure.children].every(
					(child) => child === table || child === caption,
				)
			) {
				if (caption && !table.querySelector("caption")) {
					const label = document.createElement("caption");
					label.innerHTML = caption.innerHTML;
					table.prepend(label);
				}
				figure.replaceWith(table);
			} else if (
				target === "md" &&
				[...figure.attributes].every(
					(attr) => attr.name === "class" && attr.value === "imageblock",
				) &&
				!caption?.attributes.length &&
				[...figure.childNodes].every(
					(node) =>
						node.nodeType === Node.ELEMENT_NODE || !node.textContent?.trim(),
				)
			) {
				const image = figure.querySelector(":scope > img");
				if (
					image &&
					[...figure.children].every(
						(child) => child === image || child === caption,
					)
				) {
					const source = (
						nativeImage(image as HTMLImageElement, language) ??
						nativeMarkup("md", image.outerHTML)
					).trim();
					const label = caption
						? nativeMarkup("md", caption.innerHTML).trim()
						: "";
					if (
						source.startsWith("![") &&
						!source.includes("\n") &&
						!label.includes("\n")
					) {
						const marker = `TPMARKUPFIGURE${headings.size}END`;
						headings.set(
							marker,
							caption ? `${source}\n[${label}]` : `${source}{figure}`,
						);
						figure.replaceWith(markerParagraph(marker));
					}
				}
			} else if (
				target === "adoc" &&
				[...figure.attributes].every(
					(attr) => attr.name === "class" && attr.value === "imageblock",
				)
			) {
				const image = figure.querySelector(":scope > img");
				if (
					image &&
					[...figure.children].every(
						(child) => child === image || child === caption,
					)
				) {
					const source =
						nativeImage(image as HTMLImageElement, language) ??
						nativeMarkup("adoc", image.outerHTML);
					if (source.startsWith("image::")) {
						const marker = `TPMARKUPFIGURE${headings.size}END`;
						headings.set(
							marker,
							`${caption ? `.${nativeMarkup("adoc", caption.innerHTML)}\n[caption=""]\n` : ""}${source}`,
						);
						figure.replaceWith(markerParagraph(marker));
					}
				}
			} else if (target === "rst") {
				const image = figure.querySelector(":scope > img");
				if (
					image &&
					[...figure.children].every(
						(child) => child === image || child === caption,
					)
				) {
					const marker = `TPMARKUPFIGURE${headings.size}END`;
					const imageOptions = nativeImageOptions(image as HTMLImageElement);
					if (!imageOptions) continue;
					const options = Object.entries(imageOptions)
						.map(([key, value]) => `   :${key}: ${value}`)
						.join("\n");
					const body = caption
						? nativeMarkup(target, caption.innerHTML)
								.split("\n")
								.map((line: string) => (line ? `   ${line}` : ""))
								.join("\n")
						: "";
					headings.set(
						marker,
						`.. figure:: ${image.getAttribute("src")}\n${options}\n\n${body}`,
					);
					figure.replaceWith(markerParagraph(marker));
				}
			}
		}

		for (const image of template.content.querySelectorAll("img")) {
			if (image.closest("figure,table")) continue;
			// A native RST image directive is a block. Inline images retain their fallback.
			const parent = image.parentElement;
			if (
				parent &&
				parent.localName === "p" &&
				(parent.textContent?.trim() || parent.children.length > 1)
			)
				continue;
			const source = nativeImage(image, language);
			if (source === undefined) continue;
			const marker = `TPMARKUPIMAGE${headings.size}END`;
			headings.set(marker, source);
			if (parent?.localName === "p")
				parent.replaceWith(markerParagraph(marker));
			else image.replaceWith(markerParagraph(marker));
		}

		for (const quote of template.content.querySelectorAll("blockquote")) {
			if (quote.parentElement?.closest("blockquote")) continue;
			const body = htmlToMarkup(quote.innerHTML, language, true);
			const marker = `TPMARKUPQUOTE${headings.size}END`;
			const fence = "_".repeat(
				Math.max(
					4,
					...body
						.split("\n")
						.map((line) => (/^_+$/.test(line) ? line.length + 1 : 0)),
				),
			);
			const text =
				target === "md"
					? body
							.split("\n")
							.map((line) => `> ${line}`)
							.join("\n")
					: target === "rst"
						? body
								.split("\n")
								.map((line) => (line ? `    ${line}` : ""))
								.join("\n")
						: `[quote]\n${fence}\n${body}\n${fence}`;
			const attrs = nativeAttributes(quote, target);
			const attributed = !attrs
				? text
				: target === "md"
					? `${text}\n\n{${attrs}}`
					: target === "rst"
						? `${attrs}..\n\n${text}`
						: text.replace("[quote]", `[quote,${attrs}]`);
			headings.set(marker, attributed);
			quote.replaceWith(markerParagraph(marker));
		}
		for (const table of template.content.querySelectorAll("table")) {
			if (table.closest("td,th")) continue;
			const source = markupNativeTable(table, language);
			if (source === undefined) continue;
			const marker = `TPMARKUPTABLE${headings.size}END`;
			headings.set(marker, source);
			table.replaceWith(markerParagraph(marker));
		}
		const headingLevels = [
			...new Set(
				[...template.content.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
					(heading) => Number(heading.tagName.slice(1)),
				),
			),
		];
		const nativeRstHierarchy =
			!quotations.content.querySelector(
				"li h1,li h2,li h3,li h4,li h5,li h6,blockquote h1,blockquote h2,blockquote h3,blockquote h4,blockquote h5,blockquote h6,figure h1,figure h2,figure h3,figure h4,figure h5,figure h6",
			) &&
			headingLevels.every(
				(level, index) => level === index + (headingLevels[0] || 1),
			);
		for (const heading of template.content.querySelectorAll(
			"h1,h2,h3,h4,h5,h6",
		)) {
			if (heading.parentElement) continue;
			const aliases: string[] = [];
			for (const anchor of heading.querySelectorAll("span[id]")) {
				if (
					anchor.attributes.length === 1 &&
					(!anchor.childNodes.length ||
						anchor.textContent === heading.textContent) &&
					/^[a-zA-Z_][\w.-]*$/.test(anchor.id)
				) {
					aliases.push(anchor.id);
					anchor.replaceWith(...anchor.childNodes);
				}
			}
			const level = Number(heading.tagName.slice(1));
			const body = nativeMarkup(target, `<p>${heading.innerHTML}</p>`).trim();
			const id = heading.id;
			if (id && !/^[a-zA-Z_][\w.-]*$/.test(id)) continue;
			const marker = `TPMARKUPHEADING${headings.size}END`;
			const text =
				target === "md"
					? `${"#".repeat(level)} ${body}${id || aliases.length ? ` {${id ? `#${id}` : ""}${aliases.length ? ` aliases="${aliases.join(" ")}"` : ""}}` : ""}`
					: target === "adoc"
						? `${nested ? `[discrete${id ? `,id="${id}"` : ""}]\n` : id ? `[[${id}]]\n` : ""}${"=".repeat(level)} ${aliases.map((alias) => `[[${alias}]]`).join("")}${body}${level === 1 ? "\n:showtitle:" : ""}`
						: `${[...aliases, ...(id && heading.attributes.length === 1 ? [id] : [])].map((anchor) => `.. _${anchor.startsWith("_") ? `\`${anchor}\`` : anchor}:\n`).join("")}${aliases.length || id ? "\n" : ""}${body}\n${["=", "-", "~", "^", '"', "+"][level - 1]?.repeat(Math.max(body.length, 3))}`;
			const attrs = nativeAttributes(
				heading,
				target,
				target === "rst" && heading.attributes.length > 1 ? [] : ["id"],
			);
			const attributed = !attrs
				? text
				: target === "md"
					? `${"#".repeat(level)} ${body} {${id ? `id="${id}" ` : ""}${aliases.length ? `aliases="${aliases.join(" ")}" ` : ""}${attrs}}`
					: target === "rst"
						? `${attrs}${text}`
						: level === 1
							? `[discrete,${attrs}${id ? `,id="${id}"` : ""}]\n= ${body}`
							: `[discrete,${attrs}${id ? `,id="${id}"` : ""}]\n${"=".repeat(level)} ${body}`;
			headings.set(marker, attributed);
			heading.replaceWith(markerParagraph(marker));
		}
		let result = nativeMarkup(target, template.innerHTML);
		for (const [marker, text] of headings)
			result = result.replace(
				new RegExp(`^([ \t]*)${marker}`, "m"),
				(_match: string, prefix: string) =>
					text
						.split("\n")
						.map((line) => (line ? prefix + line : ""))
						.join("\n"),
			);
		if (target === "rst" && !nativeRstHierarchy) {
			const original = document.createElement("template");
			original.innerHTML = html;
			return `.. heading-levels:: ${[...original.content.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((heading) => heading.tagName.slice(1)).join(",")}\n\n${result}`;
		}
		return target === "rst" && nativeRstHierarchy && (headingLevels[0] || 1) > 1
			? `.. heading-level:: ${headingLevels[0]}\n\n${result}`
			: result;
	}
	const escapeText = (text: string) =>
		text.replace(
			/[\\{}$&#%_~^]/g,
			(char) =>
				({
					"\\": "\\textbackslash{}",
					"~": "\\textasciitilde{}",
					"^": "\\textasciicircum{}",
				})[char] ?? `\\${char}`,
		);
	const body = tableRichLatex(html, escapeText, { document: true });
	return [...latexPackages(body), body].join("\n");
}

/** Select dependencies from generated commands, excluding literal listing contents. */
function latexPackages(body: string): string[] {
	const commands = body
		.replace(
			/(\\begin\{lstlisting\}(?:\[[^\]]*\])?)[\s\S]*?\\end\{lstlisting\}/g,
			"$1",
		)
		.replace(/\\wcScript(?:\[[^\]]*\])?([^\w\s])[\s\S]*?\1/g, "")
		.replace(/(?<!\\)%[^\n]*/g, "");
	const rules: [string, RegExp][] = [
		["amsthm", /\\newtheorem|\\begin\{proof\}/],
		["graphicx", /\\includegraphics\b/],
		["hyperref", /\\(?:href|url|hypertarget|hyperlink)\b/],
		["multimedia", /\\(?:movie|sound)\b/],
		["xcolor", /\\(?:textcolor|colorbox|definecolor|color)\b/],
		["tabularray", /\\begin\{(?:long)?tblr\}/],
		["listings", /\\begin\{lstlisting\}|\\lstinputlisting\b/],
		["enumitem", /\\begin\{(?:enumerate|itemize|description)\}\[/],
		["booktabs", /\\(?:toprule|midrule|bottomrule|cmidrule|addlinespace)\b/],
		[
			"amsmath",
			/\\begin\{(?:align(?:at)?|flalign|gather|multline|split|cases|[pbBvV]?matrix|smallmatrix)\*?\}|\\(?:dfrac|tfrac|text|operatorname|overset|underset)\b/,
		],
		[
			"csquotes",
			/\\begin\{displayquote\}|\\(?:enquote|foreignquote|blockquote)\b/,
		],
	];
	const packages = rules
		.filter(([, pattern]) => pattern.test(commands))
		.map(([name]) => name);
	return [
		...(packages.length ? [`\\usepackage{${packages.join(",")}}`] : []),
		...(() => {
			const languages = [
				...commands.matchAll(
					/\\(?:foreignlanguage|foreignquote\*?|begin\{otherlanguage\})\{([^}]+)\}/g,
				),
			].map((match) => match[1]);
			return languages.length
				? [`\\usepackage[${[...new Set(languages)].join(",")}]{babel}`]
				: [];
		})(),
		...(/\\(?:sout|uline|uwave|xout)\b/.test(commands)
			? ["\\usepackage[normalem]{ulem}"]
			: []),
	];
}

/** Parses source without mounting interactive components in the document. */
export async function markupToHtml(
	source: string,
	language: MarkupLanguage,
	base: string,
): Promise<string> {
	const comments = protectConversionComments(source, language);
	source = await expandMarkupIncludes(comments.source, language, base);
	let html = source;
	if (language === "markdown")
		html = await (await import("./markdown-source.js")).renderMarkdownToHtml(
			source,
			base,
			{ omitGeneratedHeadingTabindex: true, pivot: true },
		);
	else if (language === "asciidoc")
		html = await (
			await import("../components/asciidoc/asciidoc.js")
		).renderAsciidocToHtml(source, new URL(base), { pivot: true });
	else if (language === "restructuredtext")
		html = await (
			await import("../components/restructuredtext/restructuredtext.js")
		).renderRestructuredTextToHtml(source, { settings: { tp_pivot: true } });
	else if (language === "latex") {
		const root = document.createElement("div");
		const listingFiles = /\\lstinputlisting\b/.test(source)
			? await fetchLatexListingFiles(source, base)
			: undefined;
		root.append(
			(await import("@tp/tp-latex")).renderLatexToFragment(source, {
				listingFiles,
				bibliographyFiles: await fetchLatexBibliographyFiles(source, base),
				bibliography: "components",
				equations: "components",
				onAuthoredElement: protectPivotRawElement,
			}),
		);
		for (const body of root.querySelectorAll<HTMLElement>("div.body")) {
			// Babel wraps each text fragment. Move a common language to its
			// containing block so conversion cannot split words or link labels.
			if (body.lang) {
				for (const child of body.children) {
					if (
						child instanceof HTMLElement &&
						!child.hasAttribute("lang") &&
						!JSON.parse(child.getAttribute("data-tp-pivot-authored") || "{}")
							.lang
					)
						child.lang = body.lang;
				}
				for (const span of body.querySelectorAll<HTMLElement>("span[lang]")) {
					if (
						span.attributes.length === 1 &&
						span.lang === body.lang &&
						(() => {
							const parent = span.parentElement?.closest(
								"[lang],[data-tp-pivot-authored]",
							);
							return (
								parent &&
								(JSON.parse(
									parent.getAttribute("data-tp-pivot-authored") || "{}",
								).lang ??
									parent.getAttribute("lang"))
							);
						})() === body.lang
					)
						span.replaceWith(...span.childNodes);
				}
			}
			body.replaceWith(...body.childNodes);
		}
		for (const [selector, tag] of [
			["span.bf", "strong"],
			["span.it", "em"],
			["span.tt", "code"],
		] as const) {
			for (const span of root.querySelectorAll(selector)) {
				const element = document.createElement(tag);
				element.append(...span.childNodes);
				span.replaceWith(element);
			}
		}
		html = root.innerHTML;
	}
	const doc = new DOMParser().parseFromString(
		`<body>${escapeAttributeWhitespace(html)}</body>`,
		"text/html",
	);
	if (language === "html") {
		for (const element of doc.body.querySelectorAll("*"))
			protectPivotRawElement(element);
	} else protectPivotMarkup(doc.body);
	for (const anchor of doc.querySelectorAll("a[id]:not([href])")) {
		if (anchor.attributes.length !== 1 || anchor.childNodes.length) continue;
		const span = doc.createElement("span");
		span.id = anchor.id;
		anchor.replaceWith(span);
	}

	if (language === "restructuredtext") {
		// Docutils puts document IDs before its title. Keep those anchors inside
		// the heading so target parsers cannot turn them into empty paragraphs.
		for (const heading of doc.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
			const anchors: Element[] = [];
			let previous = heading.previousElementSibling;
			while (
				previous?.matches("span[id]") &&
				!previous.textContent?.trim() &&
				!previous.children.length
			) {
				anchors.unshift(previous);
				previous = previous.previousElementSibling;
			}
			heading.prepend(...anchors);
		}
		for (const literal of doc.querySelectorAll("span.docutils.literal")) {
			if (literal.closest("pre")) continue;
			const code = doc.createElement("code");
			for (const attribute of [...literal.attributes])
				if (attribute.name !== "class")
					code.setAttribute(attribute.name, attribute.value);
			code.textContent = literal.textContent;
			literal.replaceWith(code);
		}
		for (const pre of doc.querySelectorAll("pre.code")) {
			const language = [...pre.classList].find(
				(name) => !["code", "literal-block", "tp-dark"].includes(name),
			);
			const code = pre.querySelector("code") ?? doc.createElement("code");
			if (!code.parentElement) {
				code.textContent = pre.textContent;
				pre.replaceChildren(code);
			}
			if (language) code.classList.add(`language-${language}`);
		}
		for (const formula of doc.querySelectorAll(
			"span.math,div.math,[data-mathjax-asciimath]",
		)) {
			if (formula.querySelector("math")) continue;
			const math = doc.createElement("tp-math");
			const ascii = formula.getAttribute("data-mathjax-asciimath");
			math.setAttribute("mode", ascii === null ? "latexmath" : "asciimath");
			math.setAttribute(
				"value",
				ascii ??
					(formula.textContent ?? "")
						.trim()
						.replace(/^\\[([]|\\[)\]]$/g, "")
						.replace(
							/^\\begin\{equation\*\}\s*([\s\S]*?)\s*\\end\{equation\*\}$/,
							"$1",
						),
			);
			if (formula.localName === "div") math.setAttribute("displaystyle", "");
			if (formula.id) {
				const anchor = doc.createElement("span");
				anchor.id = formula.id;
				formula.before(anchor);
			}
			formula.before(...formula.querySelectorAll("span[id],a[id]"));
			formula.replaceWith(math);
		}
	}
	for (const formula of doc.querySelectorAll("[data-mathjax-asciimath]")) {
		const math = doc.createElement("tp-math");
		math.setAttribute("mode", "asciimath");
		math.setAttribute(
			"value",
			formula.getAttribute("data-mathjax-asciimath") ?? "",
		);
		if (formula.getAttribute("data-mathjax-display") === "true")
			math.setAttribute("displaystyle", "");
		formula.replaceWith(math);
	}
	for (const formula of doc.querySelectorAll("[data-mathjax-tex]")) {
		const math = doc.createElement("tp-math");
		math.setAttribute("value", formula.getAttribute("data-mathjax-tex") ?? "");
		if (formula.getAttribute("data-mathjax-display") === "true")
			math.setAttribute("displaystyle", "");
		formula.replaceWith(math);
	}
	if (language === "asciidoc") {
		for (const cell of doc.querySelectorAll<HTMLElement>("td,th")) {
			for (const [prefix, property] of [
				["halign-", "text-align"],
				["valign-", "vertical-align"],
			]) {
				const value = [...cell.classList]
					.find((name) => name.startsWith(prefix ?? ""))
					?.slice(prefix?.length);
				if (value && property && !cell.style.getPropertyValue(property))
					cell.style.setProperty(property, value);
			}
		}
		for (const asset of doc.querySelectorAll("[data-tp-asciidoc-asset]"))
			asset.remove();
		for (const wrapper of doc.querySelectorAll("span.image"))
			wrapper.replaceWith(...wrapper.childNodes);
		const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
		const nodes: Text[] = [];
		while (walker.nextNode()) nodes.push(walker.currentNode as Text);
		for (const node of nodes) {
			if (node.parentElement?.closest("script,pre,code,tp-math")) continue;
			const pattern = /\\\((.*?)\\\)|\\\[(.*?)\\\]|\\\$(.*?)\\\$/gs;
			const matches = [...node.data.matchAll(pattern)];
			if (!matches.length) continue;
			const fragment = doc.createDocumentFragment();
			let offset = 0;
			for (const match of matches) {
				fragment.append(node.data.slice(offset, match.index));
				const math = doc.createElement("tp-math");
				math.setAttribute(
					"mode",
					match[3] !== undefined ? "asciimath" : "latexmath",
				);
				if (match[2] !== undefined || node.parentElement?.closest(".stemblock"))
					math.setAttribute("displaystyle", "");
				math.textContent = match[1] ?? match[2] ?? match[3] ?? "";
				fragment.append(math);
				offset = (match.index ?? 0) + match[0].length;
			}
			fragment.append(node.data.slice(offset));
			node.replaceWith(fragment);
		}
	}

	normalizeMarkupHtml(doc.body, language);
	restorePivotMarkup(doc.body);
	applyDocumentNumbering(doc.body);
	indexComponents(doc.body);
	comments.restore(doc.body);
	// Retain relative media and links when exported beside a different document.
	for (const element of doc.querySelectorAll("[src],[href],[poster]")) {
		if (element.localName === "tp-ref") continue;
		for (const attr of ["src", "href", "poster"]) {
			const value = element.getAttribute(attr);
			if (value && !value.startsWith("#") && !/^[a-z][\w+.-]*:/i.test(value))
				element.setAttribute(attr, new URL(value, base).href);
		}
	}
	for (const element of doc.querySelectorAll("img[srcset],source[srcset]")) {
		element.setAttribute(
			"srcset",
			resolveImageCandidates(element.getAttribute("srcset") || "", base),
		);
	}
	return escapeAttributeWhitespace(doc.body.innerHTML);
}
