import { renderLatexToFragment } from "@tp/tp-latex";
import { afterEach, expect, it } from "vitest";
import { TpTableEditor } from "./table-editor.js";
import { serializeTable, type TableData } from "./table-markup.js";

const data = (html: string): TableData => ({
	cells: [[html]],
	header: false,
	caption: "",
	alignments: ["left"],
	cellTypes: [["rich"]],
});
afterEach(() => document.body.replaceChildren());
it("round-trips native colors, strikeout, subscripts and superscripts", () => {
	const source = serializeTable(
		data(
			'<p><span style="color:#1256ab"><strong>Colored</strong></span> <del>old</del> H<sub>2</sub>O x<sup>3</sup></p>',
		),
		"latex",
	);
	expect(source).toContain("\\textcolor[HTML]{1256ab}");
	expect(source).toContain("\\sout{old}");
	expect(source).toContain("\\textsubscript{2}");
	expect(source).toContain("\\textsuperscript{3}");
	const root = renderLatexToFragment(source);
	expect(
		root.querySelector<HTMLSpanElement>("span[style]")?.style.color,
	).toContain("rgb(18, 86, 171)");
	expect(root.querySelector("s")?.textContent).toBe("old");
	expect(root.querySelector("sub")?.textContent).toBe("2");
	expect(root.querySelector("sup")?.textContent).toBe("3");
});
it("retains all source and subtitle attributes through native multimedia commands", () => {
	const source = serializeTable(
		data(
			'<video controls width="240" poster="still-image.jpg"><source src="movie-one.webm?x=1&amp;y=2" type="video/webm"><source src="movie-two.mp4" type="video/mp4"><track kind="subtitles" src="sub_titles-en.vtt" srclang="en" label="English subtitles" default></video><audio controls><source src="sound.ogg" type="audio/ogg"><source src="sound.mp3" type="audio/mpeg"></audio>',
		),
		"latex",
	);
	for (const command of ["movie", "sound"])
		expect(source).toContain(`\\${command}`);
	expect(source).not.toMatch(/\\(?:rawhtml|wcVideo|wcAudio|wcSource|wcTrack)/);
	const root = renderLatexToFragment(source);
	expect(root.querySelectorAll("source")).toHaveLength(4);
	expect(root.querySelector("source")?.getAttribute("src")).toBe(
		"movie-one.webm?x=1&y=2",
	);
	expect(root.querySelector("track")?.getAttribute("src")).toBe(
		"sub_titles-en.vtt",
	);
	expect(root.querySelector("track")?.getAttribute("label")).toBe(
		"English subtitles",
	);
	expect(root.querySelector("track")?.hasAttribute("default")).toBe(true);
	expect(root.querySelector("video")?.style.width).toBe("240px");
});
it("preserves colored dashed and double borders around a merged cell", () => {
	const table: TableData = {
		cells: [
			["A", ""],
			["B", "C"],
		],
		header: false,
		caption: "",
		alignments: ["left", "left"],
		merges: [{ row: 0, column: 0, rowspan: 1, colspan: 2 }],
		cellBorders: [
			[
				{
					top: { style: "dashed", color: "FF123456" },
					left: { style: "double", color: "FFABCDEF" },
				},
				{
					top: { style: "dashed", color: "FF123456" },
					right: { style: "thin", color: "FF123456" },
				},
			],
			[{}, {}],
		],
	};
	const source = serializeTable(table, "latex");
	expect(source).toContain("\\definecolor");
	expect(source).toContain("hline{1}={1}");
	const root = renderLatexToFragment(source);
	const cell = root.querySelector("td");
	expect(cell?.colSpan).toBe(2);
	expect(cell?.style.borderTopStyle).toBe("dashed");
	expect(cell?.style.borderTopColor).toBe("rgb(18, 52, 86)");
	expect(cell?.style.borderLeftStyle).toBe("double");
	expect(cell?.style.borderRightStyle).toBe("solid");
});
it("renders embedded Markdown, AsciiDoc and HTML before native LaTeX conversion", async () => {
	const editor = new TpTableEditor();
	editor.innerHTML =
		'<table><tr><td data-type="rich"><tp-markdown><script type="tp/markdown">**Markdown bold**</script></tp-markdown><tp-asciidoc><script type="tp/asciidoc">_AsciiDoc italic_</script></tp-asciidoc><tp-html><script type="tp/html"><del>HTML old</del></script></tp-html></td></tr></table>';
	document.body.append(editor);
	const source = await editor.getMarkupAsync("latex");
	expect(source).toContain("\\textbf{Markdown bold}");
	expect(source).toContain("\\textit{AsciiDoc italic}");
	expect(source).toContain("\\sout{HTML old}");
	expect(source).not.toContain("\\wcScript");
	const root = renderLatexToFragment(source);
	expect(root.textContent).toContain("Markdown bold");
	expect(root.querySelector("s")?.textContent).toBe("HTML old");
	expect(editor.getMarkup("latex")).toBe(source);
});
it("preserves literal code punctuation in native verbatim inside a table", () => {
	const source = serializeTable(
		data("<pre><code>rate = 20%\na &amp; b</code></pre>"),
		"latex",
	);
	const root = renderLatexToFragment(source);
	expect(root.querySelector("pre")?.textContent).toContain("rate = 20%\na & b");
});

it("preserves unprepared embedded source in the synchronous API", () => {
	const source = serializeTable(
		data(
			'<tp-markdown><script type="tp/markdown">**bold** 20% & {open</script></tp-markdown>',
		),
		"latex",
	);
	const root = renderLatexToFragment(source);
	expect(root.querySelector("tp-markdown script")?.textContent).toBe(
		"**bold** 20% & {open",
	);
});
