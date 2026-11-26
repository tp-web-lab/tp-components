/** Temporary provenance used only while normalizing a conversion's HTML pivot. */
export const PIVOT_AUTHOR = "data-tp-pivot-authored";

/** Hide authored attributes from technical cleanup; restore them before returning HTML. */
export function protectPivotAttributes(
	element: Element,
	attributes: Record<string, string>,
): void {
	if (element.hasAttribute(PIVOT_AUTHOR)) return;
	for (const [name, value] of Object.entries(attributes)) {
		if (name === "class") {
			for (const token of value.split(/\s+/).filter(Boolean))
				element.classList.remove(token);
			if (!element.className) element.removeAttribute("class");
		} else element.removeAttribute(name);
	}
	element.setAttribute(PIVOT_AUTHOR, JSON.stringify(attributes));
}

export function protectPivotRawElement(element: Element): void {
	const previous = JSON.parse(
		element.getAttribute(PIVOT_AUTHOR) || "{}",
	) as Record<string, string>;
	const current = Object.fromEntries(
		[...element.attributes]
			.filter(
				(a) => ![PIVOT_AUTHOR, "tp-attributes", "tp-unwrap"].includes(a.name),
			)
			.map((a) => [a.name, a.value]),
	);
	element.removeAttribute(PIVOT_AUTHOR);
	protectPivotAttributes(element, { ...previous, ...current });
}

/** Renderer metadata identifies author attributes without guessing from their values. */
export function protectPivotMarkup(root: ParentNode): void {
	for (const element of root.querySelectorAll(`[${PIVOT_AUTHOR}]`)) {
		const attributes = JSON.parse(
			element.getAttribute(PIVOT_AUTHOR) || "{}",
		) as Record<string, string>;
		element.removeAttribute(PIVOT_AUTHOR);
		if (attributes["*"] !== undefined) protectPivotRawElement(element);
		else protectPivotAttributes(element, attributes);
	}
}

export function restorePivotMarkup(root: ParentNode): void {
	for (const element of root.querySelectorAll(`[${PIVOT_AUTHOR}]`)) {
		const attributes = JSON.parse(
			element.getAttribute(PIVOT_AUTHOR) || "{}",
		) as Record<string, string>;
		element.removeAttribute(PIVOT_AUTHOR);
		for (const [name, value] of Object.entries(attributes)) {
			if (name === "class") {
				for (const token of value.split(/\s+/).filter(Boolean))
					element.classList.add(token);
			} else element.setAttribute(name, value);
		}
	}
}

/** Annotate source tags without rewriting literal script/style text or comments. */
export function markPivotRawHtml(html: string): string {
	const opening = /<(?:[a-z][\w:-]*)(?:[^>"']|"[^"]*"|'[^']*')*>/i;
	return html.replace(
		/<!--[\s\S]*?-->|<(script|style|textarea|title)\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<[a-z][\w:-]*(?:[^>"']|"[^"]*"|'[^']*')*>/gi,
		(token) =>
			token.startsWith("<!--")
				? token
				: token.replace(opening, (tag) =>
						tag.replace(/(\/?>)$/, ` ${PIVOT_AUTHOR}='{"*":"true"}'$1`),
					),
	);
}
