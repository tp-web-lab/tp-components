import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

it("exports a numbered equation and reference to native LaTeX and restores their association", async () => {
	const source =
		'<tp-equanum ref="energy" number="2.1"><tp-math displaystyle value="E=mc^2"></tp-math></tp-equanum><p>See <tp-ref href="=energy"></tp-ref>.</p>';
	const code = htmlToMarkup(source, "latex");
	expect(code).toContain("\\begin{equation}");
	expect(code).toContain("\\label{energy}");
	expect(code).toContain("\\eqref{energy}");
	expect(code).not.toContain("wcTpEquanum");
	const html = await markupToHtml(
		code,
		"latex",
		"https://example.org/test.tex",
	);
	expect(html).toContain('ref="energy"');
	expect(html).toContain('number="2.1"');
	expect(html).toContain('href="=energy"');
});
it("retains all labels and tags in aligned groups over a native LaTeX roundtrip", async () => {
	const source = String.raw`\usepackage{amsmath}\begin{align}x&=1\label{a}\\y&=2\label{b}\end{align}\eqref{a} and \ref{b}`;
	const html = await markupToHtml(
		source,
		"latex",
		"https://example.org/test.tex",
	);
	const code = htmlToMarkup(html, "latex");
	expect(code).toContain("\\label{a}");
	expect(code).toContain("\\label{b}");
	expect(code).not.toContain("wcTpEquanum");
	const back = await markupToHtml(
		code,
		"latex",
		"https://example.org/test.tex",
	);
	const root = document.createElement("div");
	root.innerHTML = back;
	expect(root.querySelectorAll("tp-equanum")).toHaveLength(2);
	expect(root.querySelectorAll("tp-math")).toHaveLength(1);
	expect(
		[...root.querySelectorAll("tp-ref")].map((e) => e.getAttribute("label")),
	).toEqual(["1", "2"]);
});
