/** Restricted Markdown for generated explanations: no includes, scripts or interactive components. */
import DOMPurify from "dompurify";
import markdownMathJaxExtension from "../languages/markdown/extensions/mathjax/index.js";
import { createTpMarkdownParser } from "./markdown-source.js";

export function safeMarkdownContent(source: string): DocumentFragment {
	const parser = createTpMarkdownParser();
	parser.md.set({ html: false });
	parser.md.use(markdownMathJaxExtension);
	// Use the synchronous Markdown parser, without frontmatter extensions, includes or runtime scripts.
	const html = parser.md.render(source);
	const fragment = DOMPurify.sanitize(html, {
		RETURN_DOM_FRAGMENT: true,
		ALLOWED_TAGS: [
			"p",
			"br",
			"strong",
			"em",
			"s",
			"del",
			"ul",
			"ol",
			"li",
			"blockquote",
			"pre",
			"code",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"hr",
			"table",
			"thead",
			"tbody",
			"tr",
			"th",
			"td",
			"span",
			"div",
			"a",
			"sup",
			"sub",
		],
		ALLOWED_ATTR: [
			"href",
			"title",
			"class",
			"start",
			"data-mathjax-tex",
			"data-mathjax-asciimath",
			"data-mathjax-display",
		],
		ALLOW_DATA_ATTR: false,
		ALLOW_ARIA_ATTR: false,
	});
	for (const placeholder of fragment.querySelectorAll(
		"[data-mathjax-tex], [data-mathjax-asciimath]",
	)) {
		const math = document.createElement("tp-math");
		const ascii = placeholder.hasAttribute("data-mathjax-asciimath");
		math.setAttribute(
			"value",
			placeholder.getAttribute(
				ascii ? "data-mathjax-asciimath" : "data-mathjax-tex",
			) ?? "",
		);
		math.setAttribute("mode", ascii ? "asciimath" : "latexmath");
		math.toggleAttribute(
			"displaystyle",
			placeholder.getAttribute("data-mathjax-display") === "true",
		);
		placeholder.replaceWith(math);
	}
	return fragment;
}
