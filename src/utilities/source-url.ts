export function getComponentSourceBaseUrl(element: Element): string {
	// Components can be adopted into a preview document with its own <base>.
	// Resolve there, not against the realm where this module was first loaded.
	const documentBase = element.ownerDocument.baseURI;
	const markdownSource = element
		.closest("[data-tp-markdown-source]")
		?.getAttribute("data-tp-markdown-source")
		?.trim();
	const markdownBase =
		markdownSource === undefined || markdownSource === ""
			? documentBase
			: new URL(markdownSource, documentBase).href;
	const explicitSource = element
		.closest("[data-tp-source]")
		?.getAttribute("data-tp-source")
		?.trim();

	if (explicitSource !== undefined && explicitSource !== "") {
		return new URL(explicitSource, markdownBase).href;
	}

	return markdownBase;
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
