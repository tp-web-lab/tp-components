import { navigateDocumentAnchor } from "./document-history.js";
import { referenceId, referenceLabel } from "./references.js";
export const indexName = (element: Element): string =>
	element.getAttribute("index") || "default";
/** A single ID remains supported; JSON arrays preserve multiple labelled cross-references. */
export function indexCrossReferences(
	value: string | null,
): { ref: string; label?: string }[] {
	if (!value) return [];
	if (value.trim().startsWith("[")) {
		try {
			const parsed: unknown = JSON.parse(value);
			if (Array.isArray(parsed))
				return parsed.flatMap((item: unknown) => {
					if (typeof item === "string") return [{ ref: item }];
					if (
						item &&
						typeof item === "object" &&
						"ref" in item &&
						typeof item.ref === "string"
					)
						return [
							{
								ref: item.ref,
								...("label" in item && typeof item.label === "string"
									? { label: item.label }
									: {}),
							},
						];
					return [];
				});
		} catch {
			/* Retain a literal identifier when it is not JSON. */
		}
	}
	return [{ ref: value }];
}
/** Build an index using native lists and links; callers provide scope-filtered sources. */
export function indexList(
	definitions: Element[],
	references: Element[],
	owner: Element,
): HTMLUListElement {
	const list = document.createElement("ul");
	list.className = "tp-listof-index";
	const byRef = new Map<string, Element>();
	for (const entry of definitions) {
		const ref = entry.getAttribute("ref");
		if (ref && !byRef.has(ref)) byRef.set(ref, entry);
	}
	const collator = new Intl.Collator(
		owner.closest("[lang]")?.getAttribute("lang") || undefined,
		{ numeric: true, sensitivity: "base" },
	);
	const sorted = [...byRef.entries()].sort(([, a], [, b]) =>
		collator.compare(
			a.getAttribute("sort-key") || a.getAttribute("ref") || "",
			b.getAttribute("sort-key") || b.getAttribute("ref") || "",
		),
	);
	const items = new Map<string, HTMLLIElement>();
	const link = (target: Element, text: string) => {
		const a = document.createElement("a");
		const hash = owner.ownerDocument.defaultView?.location.hash ?? "";
		const route = hash.startsWith("#/")
			? hash.split("#").slice(0, 2).join("#")
			: "";
		a.href = `${route}#${encodeURIComponent(referenceId(target))}`;
		a.textContent = text;
		a.addEventListener("click", (event) => {
			if (
				event.button ||
				event.ctrlKey ||
				event.metaKey ||
				event.shiftKey ||
				event.altKey
			)
				return;
			event.preventDefault();
			navigateDocumentAnchor(target, a.getAttribute("href") ?? "");
		});
		return a;
	};
	for (const [ref, entry] of sorted) {
		const item = document.createElement("li");
		item.id = `${referenceId(owner)}-entry-${referenceId(entry)}`;
		item.append(document.createTextNode(referenceLabel(entry)));
		items.set(ref, item);
	}
	for (const [ref, entry] of sorted) {
		const item = items.get(ref);
		if (!item) continue;
		let parent = entry.getAttribute("parent") || "";
		let cursor = parent;
		const visited = new Set([ref]);
		while (cursor) {
			if (visited.has(cursor)) {
				parent = "";
				break;
			}
			visited.add(cursor);
			cursor = byRef.get(cursor)?.getAttribute("parent") || "";
		}
		const parentItem = items.get(parent);
		if (parentItem) {
			let nested = parentItem.querySelector<HTMLUListElement>(":scope > ul");
			if (!nested) {
				nested = document.createElement("ul");
				parentItem.append(nested);
			}
			nested.append(item);
		} else list.append(item);
		const matches = references.filter(
			(node) =>
				node.getAttribute("href") === `!${ref}` &&
				indexName(node) === indexName(entry),
		);
		const links = document.createElement("span");
		for (const [i, occurrence] of matches.entries()) {
			links.append(i ? ", " : ": ");
			const a = link(occurrence, String(i + 1));
			a.setAttribute(
				"aria-label",
				`${referenceLabel(entry)}: occurrence ${i + 1}`,
			);
			links.append(a);
		}
		for (const [attribute, label] of [
			["see", "see"],
			["see-also", "see also"],
		] as const) {
			const targets = indexCrossReferences(entry.getAttribute(attribute));
			if (targets.length) links.append(`; ${label} `);
			targets.forEach((reference, i) => {
				if (i) links.append("; ");
				const target = items.get(reference.ref);
				if (target)
					links.append(
						link(
							target,
							reference.label ??
								referenceLabel(byRef.get(reference.ref) ?? entry),
						),
					);
				else links.append(reference.label ?? reference.ref);
			});
		}
		item.insertBefore(links, item.querySelector(":scope > ul"));
	}
	return list;
}
