import { afterEach, expect, it, vi } from "vitest";
import "./html-viewer/html-viewer.js";
import "./markdown-viewer/markdown-viewer.js";
import "./asciidoc-viewer/asciidoc-viewer.js";
import "./restructuredtext-viewer/restructuredtext-viewer.js";
import "./latex-viewer/latex-viewer.js";

type SourceViewer = HTMLElement & {
	loadExamples(): Promise<Array<{ source: string }>>;
};
const samples = [
	[
		"html",
		'<!-- before -->\n<div><!-- <tp-note ref="detail">Keep me</tp-note> --><p>Text</p></div>\n<template><!-- template comment --></template>\n<!---->\n<!-- after -->',
		[
			"<!-- before -->",
			'<!-- <tp-note ref="detail">Keep me</tp-note> -->',
			"<!-- template comment -->",
			"<!---->",
			"<!-- after -->",
		],
	],
	[
		"markdown",
		"<!-- before -->\n# Title\n<!--\nmultiline comment\n-->\nText <!-- inline -->",
		["<!-- before -->", "multiline comment", "<!-- inline -->"],
	],
	[
		"asciidoc",
		"// before\n= Title\n\n////\nmultiline comment\n////\n\nText",
		["// before", "////\nmultiline comment\n////"],
	],
	[
		"restructuredtext",
		".. before\n\nTitle\n=====\n\n..\n   multiline comment\n\nText",
		[".. before", "..\n   multiline comment"],
	],
	[
		"latex",
		"% before\n\\section{Title}\nText % inline comment\n% after",
		["% before", "% inline comment", "% after"],
	],
] as const;
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it.each(samples)(
	"preserves %s comments in inline and external source without preserve-source",
	async (language, source, comments) => {
		const viewer = document.createElement(
			`tp-${language}-viewer`,
		) as SourceViewer;
		const script = document.createElement("script");
		script.type = `tp/${language}`;
		script.textContent = source;
		viewer.append(script);
		for (const external of [false, true]) {
			if (external) {
				viewer.setAttribute("src", "https://example.test/source.txt");
				vi.stubGlobal(
					"fetch",
					vi.fn().mockResolvedValue({ ok: true, text: async () => source }),
				);
			}
			const examples = await viewer.loadExamples();
			expect(examples).toHaveLength(1);
			for (const comment of comments)
				expect(examples[0]?.source).toContain(comment);
		}
	},
);
