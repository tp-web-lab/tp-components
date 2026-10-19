/** Finds a question, including subclasses, through wrappers and shadow hosts. */
export function isInQuestion(element: Element): boolean {
	let parent: Element | null = element.parentElement;
	while (parent) {
		if (
			parent.localName === "tp-question" ||
			("readResponseValue" in parent && "validateSubmit" in parent)
		)
			return true;
		const root = parent.getRootNode();
		parent =
			parent.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
	}
	return false;
}
