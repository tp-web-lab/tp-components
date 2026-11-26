import {
	htmlToMarkup,
	type MarkupLanguage,
	markupToHtml,
} from "./markup-conversion.js";
import { nativeLatexSources } from "./markup-latex-package-fixtures.js";

export const matrixLanguages = [
	"html",
	"markdown",
	"asciidoc",
	"restructuredtext",
] as const;
export const matrixCases = [
	"native document",
	"rich media",
	"table layout",
	"math and code",
] as const;
export const richSources = {
	"rich media":
		'<p><strong>Bold</strong>, <em>italic</em>, <code>a &lt; b</code> and <a href="https://example.org/a?x=1&amp;y=2#part">link</a>.</p><blockquote><p>A quotation.</p></blockquote><img src="https://example.org/picture.svg" alt="A diagram" width="120"><video controls width="240"><source src="https://example.org/movie.mp4" type="video/mp4"><source src="https://example.org/movie.webm" type="video/webm"><track kind="subtitles" srclang="en" src="https://example.org/captions.vtt"></video><audio src="https://example.org/sound.ogg" controls></audio>',
	"table layout":
		'<table style="width:360px;table-layout:fixed"><caption>Schedule</caption><colgroup><col style="width:120px"><col style="width:240px"></colgroup><thead><tr><th>Item</th><th>Value</th></tr></thead><tbody><tr><td rowspan="2" style="vertical-align:middle">Grouped</td><td style="text-align:right;vertical-align:bottom">20</td></tr><tr><td><strong>Rich</strong><br>cell</td></tr></tbody></table>',
	"math and code":
		'<p>Inline <tp-math mode="latexmath" value="\\frac{a}{b}"></tp-math> and <tp-math mode="asciimath" value="sqrt(x)"></tp-math>.</p><tp-math mode="latexmath" displaystyle value="\\sum_{i=1}^n i"></tp-math><pre class="tp-dark"><code class="language-python">  if ready:\n    print("&lt;value&gt;")</code></pre>',
};
const root = (html: string) => {
	const node = document.createElement("div");
	node.innerHTML = html;
	return node;
};
export function conversionDifferences(
	beforeHtml: string,
	afterHtml: string,
): string[] {
	const before = root(beforeHtml),
		after = root(afterHtml),
		errors: string[] = [];
	const equal = (a: unknown, b: unknown, label: string) => {
		if (JSON.stringify(a) !== JSON.stringify(b))
			errors.push(`${label}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
	};
	if (after.querySelector('.system-message,[role="alert"]'))
		errors.push(
			"Renderer error: " +
				after.querySelector('.system-message,[role="alert"]')?.textContent,
		);
	for (const tag of [
		"table",
		"tr",
		"td",
		"th",
		"ol",
		"ul",
		"li",
		"img",
		"video",
		"audio",
		"source",
		"track",
		"blockquote",
	])
		equal(
			before.querySelectorAll(tag).length,
			after.querySelectorAll(tag).length,
			`${tag} count`,
		);
	for (const e of before.querySelectorAll("[id]"))
		if (![...after.querySelectorAll("[id]")].some((a) => a.id === e.id))
			errors.push(`Missing anchor ${e.id}`);
	const texts = (r: Element, selector: string) =>
		[...r.querySelectorAll(selector)].map((e) =>
			e.textContent?.replace(/\s+/g, " ").trim(),
		);
	for (const selector of ["h1,h2,h3,h4,h5,h6", "strong", "em", "caption"])
		equal(texts(before, selector), texts(after, selector), `${selector} text`);
	const attrs = (r: Element, selector: string, names: string[]) =>
		[...r.querySelectorAll(selector)].map((e) =>
			names.map((name) => e.getAttribute(name)),
		);
	for (const [selector, names] of [
		["a", ["href"]],
		["img", ["src", "alt"]],
		[
			"video,audio,source,track",
			["src", "type", "kind", "srclang", "controls"],
		],
		["td,th", ["colspan", "rowspan"]],
	] as const)
		equal(
			attrs(before, selector, [...names]),
			attrs(after, selector, [...names]),
			`${selector} attributes`,
		);
	const listTypes = (r: Element) =>
		[...r.querySelectorAll("ol")].map((e) => [
			e.getAttribute("start") ?? "1",
			e.getAttribute("type") ??
				(
					{
						upperalpha: "A",
						loweralpha: "a",
						upperroman: "I",
						lowerroman: "i",
					} as Record<string, string>
				)[
					[...e.classList].find((c) =>
						/^(upper|lower)(alpha|roman)$/.test(c),
					) ?? ""
				] ??
				"1",
		]);
	equal(listTypes(before), listTypes(after), "list numbering");
	const imageSizes = (r: Element) =>
		[...r.querySelectorAll<HTMLElement>("img")].map((e) =>
			["width", "height"].map((key) =>
				(e.style.getPropertyValue(key) || e.getAttribute(key) || "").replace(
					/px$/,
					"",
				),
			),
		);
	equal(imageSizes(before), imageSizes(after), "image dimensions");
	const inlineCode = (r: Element) =>
		[...r.querySelectorAll("code")]
			.filter((e) => !e.closest("pre,tp-math"))
			.map((e) => e.textContent);
	equal(inlineCode(before), inlineCode(after), "inline code");
	const languages = (r: Element) =>
		[...r.querySelectorAll("pre")].map((e) => {
			const code = e.querySelector("code");
			const classes = [...(code?.classList ?? []), ...e.classList];
			return (
				classes.find((c) => c.startsWith("language-"))?.slice(9) ??
				["python", "javascript"].find((c) => classes.includes(c)) ??
				""
			);
		});
	equal(languages(before), languages(after), "code languages");
	const math = (r: Element) =>
		[...r.querySelectorAll("tp-math")].map((e) => [
			e.getAttribute("mode") ?? "latexmath",
			(e.getAttribute("value") ?? e.textContent ?? "").trim(),
			e.hasAttribute("displaystyle"),
		]);
	equal(math(before), math(after), "formulas");
	const code = (r: Element) =>
		[...r.querySelectorAll("pre")].map((e) =>
			e.textContent?.replace(/\n$/, ""),
		);
	equal(code(before), code(after), "code");
	for (const selector of ["col", "td,th"]) {
		const originals = [...before.querySelectorAll<HTMLElement>(selector)],
			copies = [...after.querySelectorAll<HTMLElement>(selector)];
		originals.forEach((e, i) => {
			for (const property of ["width", "text-align", "vertical-align"])
				if (e.style.getPropertyValue(property))
					equal(
						e.style.getPropertyValue(property),
						copies[i]?.style.getPropertyValue(property) ||
							(selector === "td,th" && property === "vertical-align"
								? "top"
								: ""),
						`${selector} ${i} ${property}`,
					);
		});
	}
	return errors;
}
export async function runMarkupMatrixCase(
	name: (typeof matrixCases)[number],
	from: (typeof matrixLanguages)[number],
	to: MarkupLanguage,
	base: string,
) {
	const source =
		name === "native document"
			? nativeLatexSources[from]
			: htmlToMarkup(richSources[name], from);
	const original = await markupToHtml(source, from, base);
	const converted = htmlToMarkup(original, to);
	const rendered = await markupToHtml(converted, to, base);
	return {
		source,
		converted,
		rendered,
		errors: conversionDifferences(original, rendered),
	};
}
