import { imageOptionStyles, listOptionNames } from "@tp/tp-utilities";
import type { MarkupLanguage } from "./markup-conversion.js";

const quote = (s: string) => s.replaceAll('"', "&quot;");
const indent = (s: string, n: number) =>
	s
		.split("\n")
		.map((line) => (line ? " ".repeat(n) + line : ""))
		.join("\n");
/** Preserve explicit enumitem presentation on a native list, including nested lists. */
export function nativeList(
	list: Element,
	language: MarkupLanguage,
	convert: (html: string, lang: MarkupLanguage) => string,
): string | undefined {
	if (
		!list.hasAttribute("data-tp-list-label") &&
		![...list.querySelectorAll("[data-tp-list-override]")].some(
			(marker) => marker.closest("ol,ul") === list,
		)
	)
		return;

	if (
		[...list.attributes].some(
			(a) =>
				!a.name.startsWith("data-tp-list-") &&
				!["style", "start"].includes(a.name),
		)
	)
		return;
	if (
		Array.from((list as HTMLElement).style).some(
			(key) =>
				![
					"list-style",
					"list-style-image",
					"list-style-position",
					"list-style-type",
					"padding-left",
					"margin-block",
					"margin-block-start",
					"margin-block-end",
				].includes(key),
		)
	)
		return;
	const options = Object.fromEntries(
		listOptionNames.flatMap((key) =>
			list.hasAttribute(`data-tp-${key}`)
				? [[key, list.getAttribute(`data-tp-${key}`) ?? ""]]
				: [],
		),
	);
	const items = [...list.children];
	if (items.some((item) => item.localName !== "li")) return;
	delete options["list-item-html"];
	delete options["list-item-markup"];
	delete options["list-item-labels"];
	const markers = items.map((item) =>
		[...item.querySelectorAll("[data-tp-list-override]")].find(
			(marker) => marker.closest("li") === item,
		),
	);
	const rich = markers.some((marker) => marker?.children.length);
	if (markers.some(Boolean))
		options[rich ? "list-item-markup" : "list-item-labels"] = markers
			.flatMap((marker, index) =>
				marker
					? [
							`${index + 1}=${encodeURIComponent(
								rich
									? convert(marker.innerHTML, language).trim()
									: marker.textContent || "",
							)
								.replaceAll("*", "%2A")
								.replaceAll("%20", " ")}`,
						]
					: [],
			)
			.join("; ");
	const ordered = list.localName === "ol";
	const bodies = items.map((item) => {
		const copy = item.cloneNode(true) as Element;
		for (const marker of copy.querySelectorAll(
			"[data-tp-list-marker],[data-tp-list-override]",
		))
			if (marker.closest("li") === copy) marker.remove();
		return convert(copy.innerHTML, language).trim();
	});
	if (language === "markdown") {
		const body = bodies
			.map((body, i) => {
				const prefix = ordered
					? `${Number(options["list-start"] || 1) + i}. `
					: "- ";
				const lines = body.split("\n");
				return (
					prefix +
					lines[0] +
					(lines.length > 1
						? `\n${indent(lines.slice(1).join("\n"), prefix.length)}`
						: "")
				);
			})
			.join("\n\n");
		return `${body}\n\n{${Object.entries(options)
			.map(([key, value]) => `${key}="${quote(value)}"`)
			.join(" ")}}`;
	}
	if (language === "asciidoc") {
		const body = bodies
			.map((body) => {
				const [first, ...rest] = body.split(/\n\n/);
				return `${ordered ? "." : "*"} ${first}${rest.length ? `\n+\n--\n${rest.join("\n\n")}\n--` : ""}`;
			})
			.join("\n");
		return `[${Object.entries(options)
			.map(([key, value]) => `${key}="${quote(value)}"`)
			.join(",")}]\n${body}`;
	}
	if (language === "restructuredtext") {
		const body = bodies
			.map((body, i) => {
				const prefix = ordered ? `${i + 1}. ` : "* ";
				return (
					prefix +
					body.split("\n")[0] +
					(body.includes("\n")
						? `\n${indent(body.split("\n").slice(1).join("\n"), prefix.length)}`
						: "")
				);
			})
			.join("\n\n");
		return `.. list-options::\n${Object.entries(options)
			.map(([key, value]) => `   :${key}: ${value}`)
			.join("\n")}\n\n${indent(body, 3)}`;
	}
}
/** Only consume transformations with an exact native TP option equivalent. */
export function nativeImageOptions(
	image: HTMLImageElement,
): Record<string, string> | undefined {
	const options: Record<string, string> = {};
	const extra = Object.fromEntries(
		[...image.attributes]
			.filter(
				(a) => !["src", "alt", "width", "height", "style"].includes(a.name),
			)
			.map((a) => [a.name, a.value]),
	);
	if (Object.keys(extra).length)
		options["image-attributes"] = encodeURIComponent(JSON.stringify(extra));
	for (const property of Array.from(image.style))
		if (
			![
				"width",
				"height",
				"object-fit",
				"transform",
				"transform-origin",
				"clip-path",
			].includes(property)
		)
			return;
	for (const key of ["alt", "width", "height"] as const) {
		const value =
			key === "alt"
				? image.getAttribute(key)
				: image.style[key] || image.getAttribute(key);
		if (value) options[key] = value;
	}
	if (image.style.objectFit) {
		if (image.style.objectFit !== "contain") return;
		options["image-fit"] = "contain";
	}
	if (image.style.transformOrigin)
		options["image-origin"] = image.style.transformOrigin;
	const transform = image.style.transform;
	if (transform) {
		const match =
			/^(?:scale\(([-\d.]+)\)\s*)?(?:rotate\(([-\d.]+)deg\))?$/.exec(transform);
		if (!match) options["image-transform"] = transform;
		if (match?.[1]) options["image-scale"] = match[1];
		if (match?.[2]) options["image-angle"] = String(-Number(match[2]));
	}
	if (image.style.clipPath) {
		const match = /^inset\(([^)]+)\)$/.exec(image.style.clipPath);
		if (!match) return;
		const values = (match[1] || "").trim().split(/\s+/);
		if (values.length > 4) return;
		const [top, right = top, bottom = top, left = right] = values;
		options["image-trim"] = `${left} ${bottom} ${right} ${top}`;
		options["image-clip"] = "true";
	}
	try {
		imageOptionStyles(options);
	} catch {
		return;
	}
	return options;
}
export function nativeImage(
	image: HTMLImageElement,
	language: MarkupLanguage,
): string | undefined {
	const opts = nativeImageOptions(image);
	if (!opts) return;
	const src = image.getAttribute("src") || "";
	const alt = opts.alt || "";
	delete opts.alt;
	if (language === "markdown")
		return `![${alt.replace(/[[\]\\]/g, "\\$&")}](${src})${
			Object.keys(opts).length
				? `{${Object.entries(opts)
						.map(([key, value]) => `${key}="${quote(value)}"`)
						.join(" ")}}`
				: ""
		}`;
	if (language === "asciidoc")
		return `image::${src}["${quote(alt)}"${Object.entries(opts)
			.map(([key, value]) => `,${key}="${quote(value)}"`)
			.join("")}]`;
	if (language === "restructuredtext")
		return `.. image:: ${src}\n${Object.entries({ alt, ...opts })
			.map(([key, value]) => `   :${key}: ${value}`)
			.join("\n")}`;
}

/** Flatten phrasing runs into temporary paragraphs; metadata restores their original placement. */
export function figureBlocks(
	parent: Element,
): { html: string; unwrap: boolean; caption: boolean }[] {
	const result: { html: string; unwrap: boolean; caption: boolean }[] = [];
	let run: Node[] = [];
	const flush = () => {
		if (!run.length) return;
		const p = document.createElement("p");
		p.append(...run.map((n) => n.cloneNode(true)));
		if (p.textContent?.trim() || p.children.length)
			result.push({ html: p.outerHTML, unwrap: true, caption: false });
		run = [];
	};
	for (const node of parent.childNodes) {
		if (
			node instanceof Element &&
			/^(?:p|h[1-6]|figure|figcaption|div|section|article|aside|header|footer|ul|ol|dl|blockquote|pre|table|img|audio|video|hr)$/.test(
				node.localName,
			)
		) {
			flush();
			if (node.localName === "figcaption")
				result.push(
					...figureBlocks(node).map((part) => ({ ...part, caption: true })),
				);
			else result.push({ html: node.outerHTML, unwrap: false, caption: false });
		} else run.push(node);
	}
	flush();
	return result;
}
export function generalFigure(
	figure: Element,
	language: MarkupLanguage,
	convert: (html: string, lang: MarkupLanguage) => string,
): string {
	const caption = figure.querySelector(":scope > figcaption");
	const parts = figureBlocks(figure);
	let first = parts.findIndex((part) => part.caption);
	if (caption && first < 0) {
		const before = document.createElement("div");
		for (const child of figure.childNodes) {
			if (child === caption) break;
			before.append(child.cloneNode(true));
		}
		first = figureBlocks(before).length;
	}
	const layout = [
		`${Math.max(first, 0)}:${parts.filter((part) => part.caption).length}:blocks`,
		...(caption ? ["caption-present=true"] : []),
		...(parts.some((part) => part.unwrap)
			? [
					`unwrap=${parts.flatMap((part, index) => (part.unwrap ? [index] : [])).join(",")}`,
				]
			: []),
		...[...figure.attributes].map(
			(a) => `figure.${a.name}=${encodeURIComponent(a.value)}`,
		),
		...[...(caption?.attributes || [])].map(
			(a) => `caption.${a.name}=${encodeURIComponent(a.value)}`,
		),
	].join(";");
	const body = parts
		.map((part) => convert(part.html, language).trim())
		.join("\n\n");
	if (language === "markdown")
		return `${body
			.split("\n")
			.map((line) => `> ${line}`)
			.join("\n")}\n\n{figure-layout="${layout}"}`;
	if (language === "asciidoc") {
		const fence = "=".repeat(
			Math.max(
				4,
				...[...body.matchAll(/^=+$/gm)].map((match) => match[0].length + 1),
			),
		);
		return `[example,figure-layout="${layout}"]\n${fence}\n${body}\n${fence}`;
	}
	return `.. container::\n   :figure-layout: ${layout}\n\n${indent(body, 3)}`;
}
/** Compound image figures retain native content and explicit caption grouping. */
export function nativeComplexFigure(
	figure: Element,
	language: MarkupLanguage,
	convert: (html: string, lang: MarkupLanguage) => string,
): string | undefined {
	const image = figure.firstElementChild;
	const caption = figure.querySelector(":scope > figcaption");
	if (
		!(image instanceof HTMLImageElement) ||
		figure.querySelector("figure") ||
		(caption && !figureBlocks(caption).length) ||
		figureBlocks(figure).some(
			(part) =>
				part.unwrap &&
				(!part.caption || caption?.querySelector("p,ul,ol,blockquote")),
		)
	)
		return generalFigure(figure, language, convert);
	const complex =
		figure.attributes.length ||
		caption?.attributes.length ||
		figure.children.length > 2 ||
		caption?.querySelector("p,ul,ol,blockquote");
	if (!complex) return;
	const options = nativeImageOptions(image);
	if (!options) return;
	const children = [...figure.children];
	const inline =
		!!caption && !caption.querySelector("p,ul,ol,blockquote,div,table,pre");
	const metadata = [
		`${caption ? children.indexOf(caption) : 0}:${caption ? (inline ? 1 : caption.children.length) : 0}:${inline ? "inline" : "blocks"}`,
		...[...figure.attributes].map(
			(a) => `figure.${a.name}=${encodeURIComponent(a.value)}`,
		),
		...[...(caption?.attributes || [])].map(
			(a) => `caption.${a.name}=${encodeURIComponent(a.value)}`,
		),
	].join(";");

	const body = children
		.slice(1)
		.map((child) =>
			child === caption
				? inline
					? `<p>${child.innerHTML}</p>`
					: child.innerHTML
				: child.outerHTML,
		)
		.map((html) => convert(html, language).trim())
		.join("\n\n");
	if (language === "markdown") {
		const lines = body.split("\n");
		return `${nativeImage(image, language)}{figure-layout="${metadata}" figure-lines="${lines.length}"}\n${indent(body, 4)}`;
	}
	if (language === "asciidoc")
		return `[example,figure-layout="${metadata}"]\n====\n${nativeImage(image, language)}\n\n${body}\n====`;
	if (language === "restructuredtext")
		return `.. figure:: ${image.getAttribute("src")}\n${Object.entries({
			...options,
			"figure-layout": metadata,
		})
			.map(([k, v]) => `   :${k}: ${v}`)
			.join("\n")}\n\n${indent(body, 3)}`;
}
