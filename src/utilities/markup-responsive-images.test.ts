import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import { resolveImageCandidates } from "./markup-responsive-images.js";

it("resolves responsive candidates without splitting URL commas or altering descriptors", () => {
	expect(
		resolveImageCandidates(
			"small.png 480w, ../large.png 960w",
			"https://example.org/course/chapter/index.html",
		),
	).toBe(
		"https://example.org/course/chapter/small.png 480w, https://example.org/course/large.png 960w",
	);
	expect(
		resolveImageCandidates(
			"data:image/svg+xml,%3Csvg%3E 1x, image.png?x=1,2 2x",
			"https://example.org/course/",
		),
	).toBe(
		"data:image/svg+xml,%3Csvg%3E 1x, https://example.org/course/image.png?x=1,2 2x",
	);
	expect(resolveImageCandidates("a.png, b.png", "https://example.org/")).toBe(
		"https://example.org/a.png, https://example.org/b.png",
	);
	expect(
		resolveImageCandidates(
			"//cdn.example.org/a.png 1x, /b.png 2x",
			"https://example.org/course/",
		),
	).toBe("https://cdn.example.org/a.png 1x, https://example.org/b.png 2x");
});
it.each(["markdown", "asciidoc", "latex"] as const)(
	"retains responsive image URLs after relocating %s and returning to HTML",
	async (language) => {
		const source =
			'<img src="small.png" srcset="small.png 1x, ../large.png 2x" sizes="(max-width: 600px) 100vw, 300px" alt="Responsive">';
		const original = await markupToHtml(
			source,
			"html",
			"https://example.org/course/chapter/index.html",
		);
		const result = await markupToHtml(
			htmlToMarkup(original, language),
			language,
			"https://elsewhere.example/export/document",
		);
		const root = document.createElement("div");
		root.innerHTML = result;
		expect(root.querySelector("img")?.getAttribute("srcset")).toBe(
			"https://example.org/course/chapter/small.png 1x, https://example.org/course/large.png 2x",
		);
		expect(root.querySelector("img")?.getAttribute("src")).toBe(
			"https://example.org/course/chapter/small.png",
		);
		expect(root.querySelector("img")?.getAttribute("sizes")).toBe(
			"(max-width: 600px) 100vw, 300px",
		);
	},
);

it("resolves picture source candidates in the HTML pivot", async () => {
	const html = await markupToHtml(
		'<picture><source srcset="wide.webp 600w, ../wide@2.webp 1200w" sizes="100vw"><img src="fallback.png" alt="View"></picture>',
		"html",
		"https://example.org/course/lesson/",
	);
	const root = document.createElement("div");
	root.innerHTML = html;
	expect(root.querySelector("source")?.getAttribute("srcset")).toBe(
		"https://example.org/course/lesson/wide.webp 600w, https://example.org/course/wide@2.webp 1200w",
	);
	expect(root.querySelector("source")?.getAttribute("sizes")).toBe("100vw");
});
