/** Reads visible document text without speaking executable source or interactive controls. */
export function readSpeechText(target: Element): string {
	const parts: string[] = [];
	const view = target.ownerDocument.defaultView;
	/** Visits author text and preserves boundaries between paragraphs, cells and line breaks. */
	function visit(node: Node): void {
		if (node.nodeType === Node.TEXT_NODE) {
			parts.push(node.textContent ?? "");
			return;
		}
		if (!(node instanceof Element)) return;
		if (
			node.matches(
				'script, style, template, noscript, input, textarea, select, button, [hidden], [aria-hidden="true"], tp-text-to-speech, tp-button, tp-icon-button, tp-dropdown',
			)
		)
			return;
		const style = view?.getComputedStyle(node);
		if (
			style?.display === "none" ||
			style?.visibility === "hidden" ||
			style?.visibility === "collapse"
		)
			return;
		const block = node.matches(
			"p, div, section, article, header, footer, aside, main, nav, blockquote, h1, h2, h3, h4, h5, h6, li, dt, dd, tr, br, hr",
		);
		if (node.matches("br, hr")) {
			parts.push("\n");
			return;
		}
		if (block) parts.push("\n");
		for (const child of node.childNodes) visit(child);
		if (block) parts.push("\n");
		if (node.matches("td, th")) parts.push(" ");
	}
	visit(target);
	return parts
		.join("")
		.replace(/[\t\r\f\v ]+/g, " ")
		.replace(/ *\n */g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}
