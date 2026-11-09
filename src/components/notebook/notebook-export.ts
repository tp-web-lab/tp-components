import { renderLatexToFragment } from "@tp/tp-latex";
import { renderMarkdownToHtml } from "../../utilities/markdown-source.js";
import asciidocStyle from "../asciidoc/asciidoc.css?inline";
import baseStyle from "../base/base.css?inline";
import resetStyle from "../base/tp-reset.css?inline";
import tokenStyle from "../base/tp-tokens.css?inline";
import latexStyle from "../latex/latex.css?inline";
import markdownStyle from "../markdown/markdown.css?inline";
import rstStyle from "../restructuredtext/restructuredtext.css?inline";

export const notebookExportStyle = [
	tokenStyle,
	resetStyle,
	baseStyle,
	markdownStyle,
	asciidocStyle,
	rstStyle,
	latexStyle,
].join("\n");

/** Export actual HTML: reading the document must not depend on the loader. */
export async function renderNotebookMarkup(
	language: string,
	source: string,
): Promise<HTMLElement> {
	const output = document.createElement("section");
	output.className = `tp-${language}-output`;
	output.setAttribute("data-tp-reference-scope", "");
	if (language === "latex") output.append(renderLatexToFragment(source));
	else if (language === "markdown")
		output.innerHTML = await renderMarkdownToHtml(source);
	else if (language === "asciidoc") {
		const { renderAsciidocToHtml } = await import("../asciidoc/asciidoc.js");
		output.innerHTML = await renderAsciidocToHtml(source);
	} else if (language === "restructuredtext") {
		const { renderRestructuredTextToHtml } = await import(
			"../restructuredtext/restructuredtext.js"
		);
		output.innerHTML = await renderRestructuredTextToHtml(source);
	} else output.innerHTML = source;
	// Keep formulas readable even when the interactive math runtime is unavailable.
	for (const formula of output.querySelectorAll("tp-math[value]")) {
		if (!formula.textContent?.trim())
			formula.textContent = formula.getAttribute("value");
	}
	return output;
}
