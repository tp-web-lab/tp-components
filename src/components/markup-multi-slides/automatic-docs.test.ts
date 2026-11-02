import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";

const renderers = {
	html: async (text: string) => text,
	md: renderMarkdownToHtml,
	adoc: renderAsciidocToHtml,
};
// The Pyodide-backed RST fixture is exercised in the real-browser integration check.
it.each(["html", "md", "adoc"] as const)(
	"renders navigable notes and complete reveal blocks from the authored %s automatic example",
	async (format) => {
		const root = `public/docs/components/markup-multi-slides/automatic/${format}/`;
		const sidebar = document.createElement("div");
		sidebar.innerHTML = await renderers[format](
			readFileSync(`${root}sidebar.${format}`, "utf8"),
		);
		expect(
			[...sidebar.querySelectorAll("a")].map((a) => a.getAttribute("href")),
		).toEqual([`cover.${format}`, `two.${format}`]);
		const cover = document.createElement("div");
		cover.innerHTML = await renderers[format](
			readFileSync(`${root}cover.${format}`, "utf8"),
		);
		expect(cover.querySelector("h1")?.textContent).toBe("One step at a time");
		expect(cover.querySelector('[data-slide-step="1"]')?.textContent).toContain(
			"Revealed by the first cue.",
		);
		expect(cover.querySelector('[data-slide-step="2"]')?.textContent).toContain(
			"Revealed by the second cue.",
		);
		expect(
			cover
				.querySelector(
					'tp-text-to-speech[data-slide-notes] script[type="tp/txt"]',
				)
				?.textContent?.match(/\[trigger=clic\]/g),
		).toHaveLength(3);
	},
	20_000,
);
