/** Convert the semantic imakeidx pivot into declarative reference components. */
export function indexComponents(root: HTMLElement): void {
	const document = root.ownerDocument;
	const definitions = [...root.querySelectorAll("tp-index")];
	const group = (node: Element) => node.getAttribute("index") || "default";
	const path = (node: Element, visited = new Set<Element>()): string => {
		if (visited.has(node)) throw Error("Cyclic index parent");
		visited.add(node);
		const key = node.getAttribute("sort-key") || node.getAttribute("ref") || "";
		const parent = definitions.find(
			(p) =>
				group(p) === group(node) &&
				p.getAttribute("ref") === node.getAttribute("parent"),
		);
		return parent ? `${path(parent, visited)}!${key}` : key;
	};
	const entries = new Map<string, Element>(
		definitions.map((node) => [`${group(node)}:${path(node)}`, node]),
	);
	for (const marker of [...root.querySelectorAll("[data-latex-index-entry]")]) {
		const data = JSON.parse(
			marker.getAttribute("data-latex-index-entry") || "{}",
		);
		const name = data.definition.name;
		const [raw, cross] = data.entry.split("|") as [string, string?];
		const parts = raw.split("!");
		let key = "",
			parent = "",
			definition: Element | undefined;
		for (const part of parts) {
			const [sort = "", label] = part.split("@");
			key = key ? `${key}!${sort}` : sort;
			definition = entries.get(`${name}:${key}`);
			if (!definition) {
				definition = document.createElement("tp-index");
				definition.setAttribute("ref", key);
				definition.setAttribute("index", name);
				definition.setAttribute("title", label || sort);
				definition.setAttribute("sort-key", sort);
				if (parent) definition.setAttribute("parent", parent);
				definition.setAttribute("data-latex-index-native", "");
				root.append(definition);
				entries.set(`${name}:${key}`, definition);
			}
			parent = definition.getAttribute("ref") || key;
		}
		if (!definition) continue;
		if (cross) {
			const match = /^(see|seealso)\{([^{}]+)\}$/.exec(cross);
			if (match)
				definition.setAttribute(
					match[1] === "see" ? "see" : "see-also",
					entries.get(`${name}:${match[2]}`)?.getAttribute("ref") ||
						match[2] ||
						"",
				);
			const paragraph = marker.parentElement;
			marker.remove();
			if (
				paragraph?.localName === "p" &&
				!paragraph.children.length &&
				!paragraph.textContent?.trim()
			)
				paragraph.remove();
			continue;
		}
		const outer = marker.closest('tp-ref[href^="!"]');
		if (outer) {
			marker.remove();
			continue;
		}
		const ref = document.createElement("tp-ref");
		ref.setAttribute("href", `!${definition.getAttribute("ref")}`);
		ref.setAttribute("index", name);
		ref.setAttribute("silent", "");

		marker.replaceWith(ref);
	}

	for (const section of [...root.querySelectorAll("[data-latex-index]")]) {
		const definition = JSON.parse(
			section.getAttribute("data-latex-index") || "{}",
		);
		const list = document.createElement("tp-listof");
		list.setAttribute("selector", "tp-index");
		list.setAttribute("index", definition.name);
		list.setAttribute("title", definition.title);
		if (definition.intoc) list.setAttribute("intoc", "");
		const heading = section.querySelector("h2");
		if (heading?.id) list.id = heading.id;
		section.replaceWith(list);
	}
}

/** Remove rendered controls while retaining the authored label of a reference. */
export function cleanReferenceMarkup(root: ParentNode): void {
	for (const ref of root.querySelectorAll("tp-ref")) {
		const source = ref.querySelector<HTMLTemplateElement>(
			":scope > template[data-tp-reference-source]",
		);
		if (source) ref.replaceChildren(source.content.cloneNode(true));
	}
	for (const element of root.querySelectorAll("[data-tp-base-host]")) {
		element.removeAttribute("data-source");
		element.removeAttribute("data-tp-base-host");
	}
	for (const generated of root.querySelectorAll("[data-tp-reference-output]"))
		generated.remove();
	for (const element of root.querySelectorAll(
		"[data-tp-reference-generated-id]",
	)) {
		element.removeAttribute("id");
		element.removeAttribute("data-tp-reference-generated-id");
	}
}

/** Strip live reference previews before HTML parsing can move their block content out of prose. */
export function referenceSourceHtml(html: string): string {
	const tags = /<\/?tp-ref\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;
	let depth = 0,
		start = 0,
		opening = "",
		cursor = 0,
		result = "";
	for (const match of html.matchAll(tags)) {
		if (!match[0].startsWith("</")) {
			if (depth++ === 0) {
				start = match.index;
				opening = match[0];
			}
			continue;
		}
		if (!depth || --depth) continue;
		const end = match.index + match[0].length;
		const holder = document.createElement("template");
		holder.innerHTML = `${opening}</tp-ref>`;
		const ref = holder.content.firstElementChild;
		if (
			!ref?.hasAttribute("data-tp-base-host") ||
			!ref.hasAttribute("data-source")
		)
			continue;
		const source = document.createElement("template");
		source.innerHTML = ref.getAttribute("data-source") || "";
		const authored = source.content.querySelector("tp-ref");
		if (!authored) continue;
		ref.replaceChildren(
			...[...authored.childNodes].map((n) => n.cloneNode(true)),
		);
		ref.removeAttribute("data-source");
		ref.removeAttribute("data-tp-base-host");
		if (ref.hasAttribute("data-tp-reference-generated-id")) {
			ref.removeAttribute("id");
			ref.removeAttribute("data-tp-reference-generated-id");
		}
		result += html.slice(cursor, start) + ref.outerHTML;
		cursor = end;
	}
	return result + html.slice(cursor);
}
