import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { expect, it } from "vitest";

import { TpTableEditor } from "./table-editor.js";
import { parseTableSource } from "./table-source.js";

it("renders the documentation's four separate rich cells in markup exports", async () => {
	const file = readFileSync(
		"public/docs/components/table-editor/examples/examples.html",
		"utf8",
	);
	const exampleDocument = new DOMParser().parseFromString(file, "text/html");
	const template = exampleDocument.querySelector("template");
	const example = template?.content.querySelector(
		'[role="example"][label="Rich content"]',
	);
	if (!example) throw new Error("Missing Rich content example");
	const doc = new DOMParser().parseFromString(example.innerHTML, "text/html");
	const table = doc.querySelector("table");
	if (!table) throw new Error("Missing example table");
	const editor = new TpTableEditor();
	editor.append(document.importNode(table, true));
	document.body.append(editor);
	try {
		for (const [format, ext] of [
			["html", "html"],
			["markdown", "md"],
			["asciidoc", "adoc"],
			["latex", "tex"],
			["restructuredtext", "rst"],
		] as const) {
			const markup = editor.getMarkup(format);
			if (process.env.TP_EXPORT_VALIDATION_DIR) {
				mkdirSync(process.env.TP_EXPORT_VALIDATION_DIR, { recursive: true });
				writeFileSync(
					`${process.env.TP_EXPORT_VALIDATION_DIR}/table.${ext}`,
					markup,
				);
			}
			if (format === "restructuredtext") {
				expect(markup).toContain(".. list-table::");
				expect(markup).not.toContain(".. html-table::");
				expect(markup).toContain(".. image::");
				expect(markup).toContain(".. media:: video");
				expect(markup).toContain(".. media:: audio");
				expect(markup).toMatch(/^ +\.\. media:: video/m);
				expect(markup).toMatch(/^ +\.\. media:: audio/m);
				expect(markup).not.toMatch(/^\s*\.\. table::/m);
				continue;
			}
			if (format === "markdown") {
				expect(markup).toMatch(/^\|/m);
				expect(markup).not.toMatch(/^:{3,}/m);
				expect(markup).toContain("**Compare bold text in each export.**");
				expect(markup).toContain("![Canoe]");
				expect(markup).toContain("media=video");
				expect(markup).toContain("media=audio");
			}
			if (format === "asciidoc") {
				expect(markup).toContain("|===");
				expect(markup).toContain("a|");
				expect(markup).toContain('options="header,autowidth"');
				expect(markup).not.toContain("[table");
				expect(markup).toContain("image::");
				// Native media options retain preload and accessible labels.
				expect(markup).toContain("video::");
				expect(markup).toContain("audio::");
				expect(markup).toContain('preload="metadata"');
				expect(markup).toContain('aria-label="Waterfall video"');
			}
			if (format === "latex")
				expect(markup).toContain("\\includegraphics[width=160px,alt={Canoe}]");
			if (format === "html") expect(markup).toContain("width: 240px");
			const result = await parseTableSource(
				markup,
				new URL(`https://example.org/table.${ext}`),
				new AbortController().signal,
			);
			expect(result.querySelectorAll("tbody > tr")).toHaveLength(4);
			if (format === "asciidoc") {
				expect(result.classList.contains("fit-content")).toBe(true);
				expect(result.querySelector("col[style*='width']")).toBeNull();
			}
			if (format === "latex")
				expect(result.querySelector("img")?.style.width).toBe("160px");
			expect(result.querySelector("strong,b,.bf")?.textContent).toBe(
				"Compare bold text in each export.",
			);
			for (const [tag, src] of [
				["img", "/medias/image/canoe.svg"],
				["video", "/medias/video/chute-eau.mp4"],
				["audio", "/medias/audio/glass-break.mp3"],
			]) {
				const media = result.querySelector(tag ?? "");
				expect(media?.getAttribute("src")).toBe(src);
				if (tag !== "img") expect(media?.hasAttribute("controls")).toBe(true);
			}
		}
	} finally {
		editor.remove();
	}
});
