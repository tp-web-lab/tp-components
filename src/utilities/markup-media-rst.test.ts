import { nativeMediaHtml, restoreLiteralTail } from "@tp/tp-utilities";
import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";
import {
	mediaRstCases,
	mediaRstSignature,
} from "./markup-media-rst-fixtures.js";

it.each(mediaRstCases.slice(0, 2))("native media: $name", async (test) => {
	const original = await markupToHtml(test.html, "html", document.baseURI);
	for (const first of ["markdown", "asciidoc", "latex"] as const)
		for (const second of ["markdown", "asciidoc", "latex"] as const) {
			const source = htmlToMarkup(original, first);
			const a = await markupToHtml(source, first, document.baseURI);
			const code = htmlToMarkup(a, second);
			const html = await markupToHtml(code, second, document.baseURI);
			expect(code).not.toMatch(
				/:+ (?:video|audio|source|track)\b|\[(?:audio|video)[%,]|\\wc(?:Video|Audio|Source|Track)/,
			);
			expect(
				mediaRstSignature(html),
				`${first} -> ${second}\n${source}\n${code}\n${html}`,
			).toEqual(mediaRstSignature(original));
		}
});

it("validates semantic media options rather than emitting arbitrary attributes", () => {
	const invalidOptions: Record<string, string>[] = [
		{ controls: "sometimes" },
		{ preload: "invalid" },
		{ sources: "{}" },
		{ sources: '[{"src":"clip.mp4","invalid name":"bad"}]' },
		{ tracks: '[{"src":"en.vtt","kind":"invalid"}]' },
		{ tracks: '[{"kind":"subtitles"}]' },
	];
	for (const options of invalidOptions)
		expect(() => nativeMediaHtml("video", options)).toThrow();
	expect(
		nativeMediaHtml("video", {
			sources: '[{"src":"clip.mp4","data-source":"camera"}]',
		}),
	).toContain('data-source="camera"');
	expect(nativeMediaHtml("audio", { src: "a&b.mp3", controls: "false" })).toBe(
		'<audio src="a&amp;b.mp3"></audio>',
	);
});

it("restores only whitespace at the end of literal blocks", () => {
	expect(restoreLiteralTail("x\n", "%20%0A%09")).toBe("x \n\t");
	expect(restoreLiteralTail("x\n", "-")).toBe("x");
	expect(() => restoreLiteralTail("x", "not-whitespace")).toThrow();
});
