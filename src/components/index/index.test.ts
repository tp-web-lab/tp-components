import { afterEach, expect, it } from "vitest";
import "./index.js";
import "../ref/ref.js";
import "../listof/listof.js";
import {
	htmlToMarkup,
	markupToHtml,
} from "../../utilities/markup-conversion.js";
import { indexSignature } from "../../utilities/markup-index-checks.js";

const settle = async () => {
	for (let i = 0; i < 8; i++) await Promise.resolve();
};
afterEach(() => document.body.replaceChildren());
const example = `<div data-tp-reference-scope><p>A <tp-ref href="!matrix">matrix</tp-ref> and another<tp-ref href="!matrix" silent></tp-ref>.</p><tp-index ref="matrix" title="Matrix"><p>A <strong>rectangular</strong> array.</p></tp-index><tp-index ref="square" parent="matrix" title="Square matrix"></tp-index><tp-listof selector="tp-index" title="Terms"></tp-listof></div>`;
it("renders in light DOM, keeps definitions hidden and preserves visible labels", async () => {
	document.body.innerHTML = example;
	await settle();
	expect(document.querySelector("tp-index")?.shadowRoot).toBeNull();
	expect(
		getComputedStyle(document.querySelector("tp-index") as Element).display,
	).toBe("none");
	expect(
		document.querySelector("tp-ref:not([silent]) button")?.textContent,
	).toBe("matrix");
	expect(document.querySelector("tp-ref tp-tooltip strong")?.textContent).toBe(
		"rectangular",
	);
	expect(
		document
			.querySelector("tp-ref[silent] > tp-button")
			?.hasAttribute("hidden"),
	).toBe(true);
	expect(document.querySelectorAll("tp-listof ul ul li")).toHaveLength(1);
	expect(document.querySelectorAll("tp-listof a")).toHaveLength(2);
	for (const a of document.querySelectorAll<HTMLAnchorElement>("tp-listof a"))
		expect(
			document.getElementById(decodeURIComponent(a.hash.slice(1)))?.localName,
		).toBe("tp-ref");
});
it("updates occurrences, terms and silent mode without duplicating output", async () => {
	document.body.innerHTML = example;
	await settle();
	const ref = document.querySelector("tp-ref[silent]");
	ref?.removeAttribute("silent");
	await settle();
	expect(ref?.querySelector("tp-button")?.hasAttribute("hidden")).toBe(false);
	expect(ref?.querySelector("button")?.textContent).toBe("Matrix");
	document.querySelector("tp-index")?.setAttribute("title", "Updated");
	await settle();
	expect(ref?.querySelector("button")?.textContent).toBe("Updated");
	ref?.remove();
	await settle();
	expect(document.querySelectorAll("tp-listof a")).toHaveLength(1);
	expect(
		document.querySelectorAll("tp-listof > [data-tp-reference-output]"),
	).toHaveLength(1);
});
it("separates named indexes and nested reference scopes", async () => {
	document.body.innerHTML = `<main><tp-index ref="same" title="Outer"></tp-index><tp-index ref="same" title="Other" index="people"></tp-index><tp-ref href="!same"></tp-ref><tp-ref href="!same" index="people"></tp-ref><tp-listof selector="tp-index" index="people"></tp-listof><article><tp-index ref="same" title="Inner"></tp-index><tp-ref href="!same"></tp-ref><tp-listof selector="tp-index"></tp-listof></article></main>`;
	await settle();
	expect(
		[...document.querySelectorAll("tp-ref button")].map((e) => e.textContent),
	).toEqual(["Outer", "Other", "Inner"]);
	expect(document.querySelector("main > tp-listof")?.textContent).toContain(
		"Other",
	);
	expect(
		document.querySelector("article tp-listof")?.textContent,
	).not.toContain("Outer");
});
it("keeps cyclic parents at root and resolves see links", async () => {
	document.body.innerHTML = `<main><tp-index ref="a" parent="b" see="b"></tp-index><tp-index ref="b" parent="a"></tp-index><tp-listof selector="tp-index"></tp-listof></main>`;
	await settle();
	expect(document.querySelectorAll("tp-listof ul > li")).toHaveLength(2);
	const link = document.querySelector<HTMLAnchorElement>("tp-listof a");
	expect(document.getElementById(link?.hash.slice(1) || "")?.localName).toBe(
		"li",
	);
});
it("exports authored labels rather than live controls or tooltips", async () => {
	document.body.innerHTML = example;
	await settle();
	const html = htmlToMarkup(document.body.innerHTML, "html");
	expect(html).not.toContain("tp-tooltip");
	expect(html).not.toContain("tp-button");
	expect(html).not.toContain("data-tp-reference-output");
	expect(html).toContain('href="!matrix">matrix</tp-ref>');
	expect(html).toContain("rectangular");
});
it.each(["html", "markdown", "asciidoc", "latex"] as const)(
	"round trips authored index components through %s",
	async (language) => {
		const converted = await markupToHtml(
			htmlToMarkup(example, language),
			language,
			"https://example.org/document.html",
		);
		expect(indexSignature(converted)).toEqual(indexSignature(example));
	},
);

it("preserves independent scopes with explicit TP LaTeX commands", async () => {
	const html =
		'<article><p><tp-ref href="!same">First</tp-ref></p><tp-index ref="same" title="First"></tp-index><tp-listof selector="tp-index"></tp-listof></article><article><p><tp-ref href="!same">Second</tp-ref></p><tp-index ref="same" title="Second"></tp-index><tp-listof selector="tp-index"></tp-listof></article>';
	const code = htmlToMarkup(html, "latex");
	expect(code).not.toContain("\\makeindex");
	const back = await markupToHtml(
		code,
		"latex",
		"https://example.org/document.tex",
	);
	const root = document.createElement("div");
	root.innerHTML = back;
	expect(
		[...root.querySelectorAll("article tp-index")].map((e) =>
			e.getAttribute("title"),
		),
	).toEqual(["First", "Second"]);
	expect(
		[...root.querySelectorAll("article tp-ref")].map((e) => e.textContent),
	).toEqual(["First", "Second"]);
});
