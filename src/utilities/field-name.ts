const initializedFields = new WeakSet<HTMLElement>();

/** Inline field content supplies a form name, never an initial value. */
export function initializeFieldName(field: HTMLElement): void {
	if (initializedFields.has(field)) return;
	initializedFields.add(field);
	if (field.hasAttribute("name")) return;
	const name = Array.from(field.childNodes)
		.filter(
			(node) =>
				node.nodeType === Node.TEXT_NODE ||
				(node instanceof HTMLElement && node.tagName === "CODE"),
		)
		.map((node) => node.textContent ?? "")
		.join("")
		.trim();
	if (name) field.setAttribute("name", name);
}
