/** Indent structural HTML without changing phrasing or whitespace-sensitive content. */
export function formatMarkupHtml(html: string): string {
	const template = document.createElement("template");
	template.innerHTML = html;
	const blocks =
		/^(address|article|aside|blockquote|caption|col|colgroup|dd|details|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|summary|table|tbody|td|tfoot|th|thead|tr|ul)$/;
	const structural = (parent: ParentNode): boolean =>
		[...parent.childNodes].every((child) =>
			child.nodeType === Node.TEXT_NODE
				? !child.textContent?.trim()
				: child instanceof Element && blocks.test(child.localName),
		);
	const render = (element: Element, depth: number): string => {
		const prefix = "  ".repeat(depth);
		if (
			!element.children.length ||
			!structural(element) ||
			element.matches("pre,script,style,textarea,code,svg,math,[style]")
		)
			return prefix + element.outerHTML;
		const shell = element.cloneNode(false) as Element;
		const closing = `</${element.localName}>`;
		const opening = shell.outerHTML.slice(0, -closing.length);
		return `${prefix}${opening}\n${[...element.children].map((child) => render(child, depth + 1)).join("\n")}\n${prefix}${closing}`;
	};
	// Mixed inline content at the root has meaningful inter-element spaces too.
	if (!structural(template.content)) return html;
	return [...template.content.children]
		.map((child) => render(child, 0))
		.join("\n\n");
}
