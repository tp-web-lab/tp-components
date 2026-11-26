import { expect, it } from "vitest";
import { htmlToMarkup, markupToHtml } from "./markup-conversion.js";

it.each([
	["math", String.raw`Inline \begin{math}x^2+1\end{math} text.`, false],
	["displaymath", String.raw`\begin{displaymath}x^2+1\end{displaymath}`, true],
	["eqnarray", String.raw`\begin{eqnarray}a&=&b\\c&=&d\end{eqnarray}`, true],
	["eqnarray*", String.raw`\begin{eqnarray*}a&=&b\\c&=&d\end{eqnarray*}`, true],
] as const)(
	"preserves %s in native LaTeX exports",
	async (name, source, display) => {
		const html = await markupToHtml(
			source,
			"latex",
			"https://example.org/test.tex",
		);
		const root = document.createElement("div");
		root.innerHTML = html;
		const math = root.querySelector("tp-math");
		expect(math?.hasAttribute("displaystyle")).toBe(display);
		const code = htmlToMarkup(html, "latex");
		expect(code).not.toContain("wcTpMath");
		if (name.startsWith("eqnarray")) {
			expect(code.trim()).toMatch(/^\\begin\{eqnarray\*?\}/);
		}
		const back = document.createElement("div");
		back.innerHTML = await markupToHtml(
			code,
			"latex",
			"https://example.org/test.tex",
		);
		expect(back.querySelector("tp-math")?.getAttribute("value")).toBe(
			math?.getAttribute("value"),
		);
		expect(back.querySelector("tp-math")?.hasAttribute("displaystyle")).toBe(
			display,
		);
	},
);
