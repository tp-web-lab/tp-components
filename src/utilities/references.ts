/** Shared document boundaries and observation for references and generated lists. */
const boundary =
	"[data-tp-reference-scope], .tp-markdown-output, .tp-asciidoc-output, .tp-restructuredtext-output, article, main";
export const referenceOutput = "[data-tp-reference-output], tp-tooltip";
let nextId = 0;
export function referenceScope(element: Element): Element {
	return element.closest(boundary) ?? element.ownerDocument.body ?? element;
}
export function referenceId(element: Element): string {
	if (!element.id) {
		let id: string;
		do {
			id = `tp-reference-${++nextId}`;
		} while (element.ownerDocument.getElementById(id));
		element.id = id;
	}
	return element.id;
}
export function referenceLabel(element: Element): string {
	for (const name of ["title", "label", "caption", "figcaption"]) {
		const value = element.getAttribute(name)?.trim();
		if (value) return value;
	}
	const caption = element
		.querySelector(":scope > caption, :scope > figcaption")
		?.textContent?.trim();
	return caption || element.getAttribute("ref")?.trim() || "";
}
export function referenceElements(scope: Element, selector: string): Element[] {
	return Array.from(scope.querySelectorAll(selector)).filter(
		(element) =>
			!element.closest(referenceOutput) && referenceScope(element) === scope,
	);
}
const scopes = new WeakMap<
	Element,
	{ observer: MutationObserver; listeners: Set<() => void> }
>();
export function observeReferences(
	element: Element,
	refresh: () => void,
): () => void {
	const scope = referenceScope(element);
	let entry = scopes.get(scope);
	if (!entry) {
		const listeners = new Set<() => void>();
		const observer = new MutationObserver((records) => {
			if (
				records.some((record) => {
					const target =
						record.target instanceof Element
							? record.target
							: record.target.parentElement;
					return target && !target.closest(referenceOutput);
				})
			)
				for (const listener of listeners) listener();
		});
		observer.observe(scope, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
		});
		entry = { observer, listeners };
		scopes.set(scope, entry);
	}
	entry.listeners.add(refresh);
	return () => {
		entry.listeners.delete(refresh);
		if (!entry.listeners.size) {
			entry.observer.disconnect();
			scopes.delete(scope);
		}
	};
}

/** Copies displayed content without duplicating anchors or source definitions. */
export function referenceContent(element: Element): DocumentFragment {
	const template = element.ownerDocument.createElement("template");
	template.innerHTML = element.innerHTML;
	for (const script of template.content.querySelectorAll("script"))
		script.remove();
	for (const child of template.content.querySelectorAll("[id], [ref]")) {
		child.removeAttribute("id");
		child.removeAttribute("ref");
	}
	return template.content;
}

/** Shared numbering: first citation order, then uncited definitions in document order. */
export function noteNumbers(scope: Element): Map<string, number> {
	const definitions = referenceElements(scope, "tp-note[ref]");
	const identifiers = new Set(
		definitions
			.map((e) => e.getAttribute("ref"))
			.filter((id): id is string => Boolean(id)),
	);
	const numbers = new Map<string, number>();
	for (const ref of referenceElements(scope, 'tp-ref[href^="^"]')) {
		if (ref.closest("tp-note, tp-biblio, tp-glossary")) continue;
		const id = ref.getAttribute("href")?.slice(1) ?? "";
		if (identifiers.has(id) && !numbers.has(id))
			numbers.set(id, numbers.size + 1);
	}
	for (const id of identifiers)
		if (!numbers.has(id)) numbers.set(id, numbers.size + 1);
	return numbers;
}
