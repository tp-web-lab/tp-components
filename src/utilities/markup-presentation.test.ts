import { applyNativePresentation } from "@tp/tp-utilities";
import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { packageExamples } from "./markup-latex-package-fixtures.js";
import {
	presentationCases,
	presentationSignature,
} from "./markup-presentation-next-fixtures.js";

function signature(html: string) {
	const root = document.createElement("div");
	root.innerHTML = html;
	return {
		lists: [...root.querySelectorAll<HTMLElement>("ol,ul")].map((e) => ({
			tag: e.localName,
			label: e.getAttribute("data-tp-list-label"),
			start: e.getAttribute("data-tp-list-start"),
			spacing: e.style.marginBlock.replace(/^0(?:px|pt)$/, "0"),
		})),
		markers: [...root.querySelectorAll("[data-tp-list-marker]")].map(
			(e) => e.textContent,
		),
		images: [...root.querySelectorAll<HTMLImageElement>("img")].map((e) => ({
			src: e.src,
			alt: e.alt,
			width: e.style.width || e.getAttribute("width"),
			height: e.style.height || e.getAttribute("height"),
			transform: e.style.transform,
			clip: e.style.clipPath,
			fit: e.style.objectFit,
		})),
	};
}
it.each(["lists", "graphics"] as const)(
	"preserves native %s in both directions",
	async (name) => {
		const original = await markupToHtml(
			packageExamples[name],
			"latex",
			document.baseURI,
		);
		for (const lang of ["markdown", "asciidoc"] as const) {
			const source = htmlToMarkup(original, lang);
			expect(source, original).not.toMatch(
				/:+ (?:ol|ul|li|span|img)\b|\[(?:ol|ul|li|span|img),/,
			);
			const html = await markupToHtml(source, lang, document.baseURI);
			expect(signature(html), `${source}\n${html}`).toEqual(
				signature(original),
			);
			const latex = htmlToMarkup(html, "latex");
			const back = await markupToHtml(latex, "latex", document.baseURI);
			expect(signature(back), latex).toEqual(signature(original));
		}
	},
);
it("leaves ordinary lists unchanged and validates explicit options", () => {
	expect(applyNativePresentation("<ol><li>First</li></ol>")).toBe(
		"<ol><li>First</li></ol>",
	);
	const partial = applyNativePresentation(
		'<ul list-item-labels="1=!"><li>Custom</li><li>Default</li></ul>',
	);
	expect(partial).toContain('<span data-tp-list-override="">!</span> Custom');
	expect(partial).toContain("<li>Default</li>");
	expect(partial).not.toContain("padding-left");
	expect(partial).not.toContain("data-tp-list-label=");
	expect(() => applyNativePresentation('<img image-scale="-2">')).toThrow();
	for (const value of [
		"rotate(20px)",
		"matrix(1,2)",
		"translate(2px);color:red",
		"scale()",
		"rotateW(20deg)",
	])
		expect(() =>
			applyNativePresentation(`<img image-transform="${value}">`),
		).toThrow();
	expect(() =>
		applyNativePresentation('<ul list-label="@x"><li>First</li></ul>'),
	).toThrow();
	expect(() =>
		applyNativePresentation('<img image-trim="0 0 0 red">'),
	).toThrow();
});

it.each(["markdown", "asciidoc", "latex"] as const)(
	"preserves scale and rotation through %s",
	async (language) => {
		const original =
			'<img src="/picture.svg" alt="Picture" width="180" style="transform:scale(0.75) rotate(-30deg);object-fit:contain;clip-path:inset(4pt 3pt 2pt 1pt)">';
		const source = htmlToMarkup(original, language);
		const html = await markupToHtml(source, language, document.baseURI);
		expect(signature(html), source).toEqual(signature(original));
	},
);
it("retains unsupported image formatting", () => {
	const source = htmlToMarkup(
		'<img src="/picture.svg" style="transform:skew(20deg)">',
		"markdown",
	);
	expect(source).toContain("skew(20deg)");
});
it("retains nested item overrides without element fallbacks or duplicate markers", async () => {
	const example = presentationCases.find(
		(example) => example.name === "Item labels",
	);
	if (!example) throw new Error("Missing nested-list fixture");
	const html = await markupToHtml(example.source, "latex", document.baseURI);
	const expected = presentationSignature(html);
	expect(expected.markers).toEqual(["Special", "D)", "!"]);
	for (const language of ["markdown", "asciidoc", "latex"] as const) {
		const source = htmlToMarkup(html, language);
		expect(source).not.toMatch(
			/:+ (?:ol|ul|li)\b|\[(?:ol|ul|li),|\\wc(?:Ol|Ul|Li|Span)\b/,
		);
		const rendered = await markupToHtml(source, language, document.baseURI);
		expect(presentationSignature(rendered), source).toEqual(expected);
		const back = htmlToMarkup(rendered, "latex");
		expect(back).not.toMatch(/\\wc(?:Ol|Ul|Li|Span)\b/);
		expect(
			presentationSignature(
				await markupToHtml(back, "latex", document.baseURI),
			),
			back,
		).toEqual(expected);
	}
});

for (const example of presentationCases.filter((example) =>
	/Custom cleveref|3D image|Matrix3d|Compound image|Matrix image|Additional languages|Multilingual cleveref/.test(
		example.name,
	),
)) {
	it.each(["markdown", "asciidoc", "latex"] as const)(
		`${example.name} survives %s and returns to its source language`,
		async (language) => {
			const original = await markupToHtml(
				example.source,
				example.language,
				document.baseURI,
			);
			const code = htmlToMarkup(original, language);
			expect(code).not.toMatch(/\\wcImg|:+ img\b|\[img,/);
			const rendered = await markupToHtml(code, language, document.baseURI);
			expect(presentationSignature(rendered)).toEqual(
				presentationSignature(original),
			);
			const back = await markupToHtml(
				htmlToMarkup(rendered, example.language),
				example.language,
				document.baseURI,
			);
			expect(presentationSignature(back)).toEqual(
				presentationSignature(original),
			);
		},
	);
}
