export function getComponentSourceBaseUrl(element: Element): string {
	// Components can be adopted into a preview document with its own <base>.
	// Resolve there, not against the realm where this module was first loaded.
	const documentBase = element.ownerDocument.baseURI;
	const owner = element.closest("[data-tp-markdown-source], [data-tp-source]");
	if (!owner) return documentBase;
	const parentBase = owner.parentElement
		? getComponentSourceBaseUrl(owner.parentElement)
		: documentBase;
	const markdownSource = owner.getAttribute("data-tp-markdown-source")?.trim();
	const markdownBase = markdownSource
		? new URL(markdownSource, parentBase).href
		: parentBase;
	const explicitSource = owner.getAttribute("data-tp-source")?.trim();
	return explicitSource
		? new URL(explicitSource, markdownBase).href
		: markdownBase;
}

export function hasComponentMarkdownSourceBase(element: Element): boolean {
	const markdownSource = element
		.closest("[data-tp-markdown-source]")
		?.getAttribute("data-tp-markdown-source")
		?.trim();

	return markdownSource !== undefined && markdownSource !== "";
}

export function resolveComponentSourceUrl(element: Element, src: string): URL {
	return new URL(src, getComponentSourceBaseUrl(element));
}

/** Rebase parser-resolved resources when a fragment retains its original document context. */
export function rebaseSourceContent(
	root: Element,
	from: string,
	to: string,
): void {
	const directory = new URL(".", from).href;
	for (const element of root.querySelectorAll("[src], [href], [poster]")) {
		for (const name of ["src", "href", "poster"]) {
			const value = element.getAttribute(name);
			if (value?.startsWith(directory)) {
				element.setAttribute(
					name,
					new URL(value.slice(directory.length), to).href,
				);
			}
		}
	}
}
