import {
	type GlobalListHost,
	type GlobalListPage,
	globalListAnchor,
	globalListDefinitionContent,
} from "./global-listof.js";
import { indexCrossReferences } from "./index-references.js";
import {
	referenceElements,
	referenceLabel,
	referenceScope,
} from "./references.js";

/** Conservative structural identity: preserve formatting and literal whitespace. */
function contentKey(fragment: DocumentFragment): string {
	const visit = (node: Node, literal = false): unknown => {
		if (node.nodeType === Node.COMMENT_NODE) return null;
		if (node.nodeType === Node.TEXT_NODE) {
			const value = node.textContent ?? "";
			const block = (item: Node | null) =>
				item instanceof Element &&
				item.matches("p,div,section,article,ul,ol,dl,table,blockquote,pre");
			if (
				!literal &&
				/^\s*$/.test(value) &&
				/\n/.test(value) &&
				(node.parentNode instanceof DocumentFragment ||
					block(node.previousSibling) ||
					block(node.nextSibling) ||
					(block(node.parentNode) &&
						(!node.previousSibling || !node.nextSibling)))
			)
				return null;
			return literal ? value : value.replace(/\s+/g, " ");
		}
		if (node instanceof Element)
			return [
				node.localName,
				[...node.attributes]
					.map((a) => [a.name, a.value])
					.sort(([a], [b]) => (a ?? "").localeCompare(b ?? "")),
				[...node.childNodes]
					.map((child) =>
						visit(child, literal || node.matches("pre,code,textarea")),
					)
					.filter((value) => value !== null),
			];
		return [...node.childNodes]
			.map((child) => visit(child, literal))
			.filter((value) => value !== null);
	};
	return JSON.stringify(visit(fragment));
}
interface ReturnLink {
	anchor: string;
	order: number;
	citation: boolean;
}
interface PageLinks {
	title: string;
	href: string;
	element: HTMLSpanElement;
	items: Map<string, ReturnLink>;
}
let nextDefinitionListId = 0;
interface Entry {
	sources: Element[];
	ref: string;
	sortKey: string;
	term: HTMLElement;
	description: HTMLElement;
	returns: HTMLElement;
	pages: Map<string, PageLinks>;
	label: string;
}

/** One definition list, preserving source scopes and every occurrence location. */
export class GlobalDefinitionList {
	public readonly element = document.createElement("dl");
	private entries = new Map<string, Entry>();
	private readonly anchorPrefix = `tp-global-index-${++nextDefinitionListId}`;
	public constructor(
		private host: GlobalListHost,
		private kind: "biblio" | "glossary" | "index" = "biblio",
	) {
		this.element.dataset.tpGlobalDefinitions = kind;
		if (kind === "biblio") this.element.dataset.tpGlobalBibliography = "";
	}
	public get size(): number {
		return this.entries.size;
	}
	public add(target: Element, doc: Document, page: GlobalListPage): void {
		const content = globalListDefinitionContent(
			target,
			doc,
			this.host,
			page.href,
		);
		const ref = target.getAttribute("ref") ?? "";
		const key = JSON.stringify([
			ref || `${page.href}#${globalListAnchor(target, doc)}`,
			contentKey(content),
			...(this.kind === "index"
				? ["index", "parent", "see", "see-also"].map(
						(name) =>
							target.getAttribute(name) || (name === "index" ? "default" : ""),
					)
				: []),
		]);
		let entry = this.entries.get(key);
		if (!entry) {
			const term = document.createElement("dt");
			const origin = document.createElement("a");
			const label =
				this.kind === "biblio"
					? target.getAttribute("label") || ref || referenceLabel(target)
					: referenceLabel(target) || ref;
			origin.textContent = label;
			origin.dataset.tpGlobalOrigin = "";
			origin.href = this.host.globalListHref(
				`${page.href}#${encodeURIComponent(globalListAnchor(target, doc))}`,
			);
			term.append(origin);
			if (this.kind === "index")
				term.dataset.tpIndexSortKey = target.getAttribute("sort-key") || label;
			const description = document.createElement("dd");
			const body = document.createElement("div");
			body.append(content);
			const returns = document.createElement("p");
			returns.dataset.tpGlobalOccurrences = "";
			if (this.kind === "biblio") returns.dataset.tpGlobalCitations = "";
			description.append(body, returns);
			entry = {
				term,
				description,
				returns,
				pages: new Map(),
				label,
				sources: [],
				ref,
				sortKey: target.getAttribute("sort-key") || ref,
			};
			term.id = `${this.anchorPrefix}-${this.entries.size}`;
			this.entries.set(key, entry);
		}
		entry.sources.push(target);
		let group = entry.pages.get(page.href);
		if (!group) {
			group = {
				title: page.title,
				href: page.href,
				element: document.createElement("span"),
				items: new Map(),
			};
			entry.pages.set(page.href, group);
		}
		const scope = referenceScope(target);
		const first = referenceElements(scope, `tp-${this.kind}[ref]`).find(
			(definition) =>
				definition.getAttribute("ref") === ref &&
				(this.kind !== "index" ||
					(definition.getAttribute("index") || "default") ===
						(target.getAttribute("index") || "default")),
		);
		const citations =
			first === target
				? referenceElements(scope, "tp-ref").filter(
						(citation) =>
							citation.getAttribute("href") ===
								`${{ biblio: "@", glossary: "%", index: "!" }[this.kind]}${ref}` &&
							(this.kind !== "index" ||
								(citation.getAttribute("index") || "default") ===
									(target.getAttribute("index") || "default")) &&
							!citation.closest("tp-biblio,tp-glossary,tp-index"),
					)
				: [];
		const all: Element[] = [...doc.querySelectorAll("tp-ref")];
		for (const citation of citations) {
			const anchor = globalListAnchor(citation, doc);
			group.items.set(anchor, {
				anchor,
				order: all.indexOf(citation),
				citation: true,
			});
		}
		if (!citations.length) {
			const anchor = globalListAnchor(target, doc);
			group.items.set(anchor, { anchor, order: Infinity, citation: false });
		}
		group.element.replaceChildren(document.createTextNode(`${group.title}: `));
		let number = 0;
		[...group.items.values()]
			.sort((a, b) => a.order - b.order)
			.forEach((item, index) => {
				if (index) group.element.append(", ");
				const link = document.createElement("a");
				link.href = this.host.globalListHref(
					`${group.href}#${encodeURIComponent(item.anchor)}`,
				);
				link.textContent = item.citation ? String(++number) : "definition";
				link.setAttribute(
					"aria-label",
					`${group.title}: ${item.citation ? `${this.kind === "biblio" ? "citation" : "occurrence"} ${number}` : "uncited definition"}`,
				);
				if (item.citation) {
					link.dataset.tpGlobalOccurrence = "";
					if (this.kind === "biblio") link.dataset.tpGlobalCitation = "";
				} else link.dataset.tpGlobalUncited = "";
				group.element.append(link);
			});
		entry.returns.replaceChildren(document.createTextNode("Sources: "));
		[...entry.pages.values()].forEach((page, index) => {
			if (index) entry.returns.append(" · ");
			entry.returns.append(page.element);
		});
	}
	public render(): void {
		const entries = [...this.entries.values()].sort((a, b) =>
			(this.kind === "index" ? a.sortKey : a.label).localeCompare(
				this.kind === "index" ? b.sortKey : b.label,
				undefined,
				{
					numeric: true,
					sensitivity: "base",
				},
			),
		);
		this.element.replaceChildren();
		if (this.kind !== "index") {
			this.element.append(
				...entries.flatMap((entry) => [entry.term, entry.description]),
			);
			return;
		}
		const resolve = (
			entry: Entry,
			attribute: string,
			explicitKey?: string,
		): Entry | undefined => {
			const key = explicitKey ?? entry.sources[0]?.getAttribute(attribute);
			if (!key) return;
			const candidates = entries.filter((candidate) => candidate.ref === key);
			const local = candidates.filter((candidate) =>
				candidate.sources.some((source) =>
					entry.sources.some(
						(origin) => referenceScope(source) === referenceScope(origin),
					),
				),
			);
			return local.length === 1
				? local[0]
				: local.length
					? undefined
					: candidates.length === 1
						? candidates[0]
						: undefined;
		};
		const parents = new Map(
			entries.map((entry) => [entry, resolve(entry, "parent")]),
		);
		const children = new Map<Entry, HTMLDListElement>();
		for (const entry of entries) {
			// Rebuilding never duplicates generated hierarchy or cross-references.
			entry.description
				.querySelectorAll(":scope > [data-tp-global-index-generated]")
				.forEach((node) => {
					node.remove();
				});
		}
		for (const entry of entries) {
			let parent = parents.get(entry);
			let cursor = parent;
			const visited = new Set([entry]);
			while (cursor) {
				if (visited.has(cursor)) {
					parent = undefined;
					break;
				}
				visited.add(cursor);
				cursor = parents.get(cursor);
			}
			let destination = this.element;
			if (parent) {
				let nested = children.get(parent);
				if (!nested) {
					nested = document.createElement("dl");
					nested.dataset.tpGlobalIndexGenerated = "";
					parent.description.append(nested);
					children.set(parent, nested);
				}
				destination = nested;
			}
			destination.append(entry.term, entry.description);
			for (const [attribute, label] of [
				["see", "see"],
				["see-also", "see also"],
			] as const) {
				const key = entry.sources[0]?.getAttribute(attribute);
				if (!key) continue;
				const paragraph = document.createElement("p");
				paragraph.dataset.tpGlobalIndexGenerated = "";
				paragraph.append(`${label} `);
				for (const [position, reference] of indexCrossReferences(
					key,
				).entries()) {
					if (position) paragraph.append("; ");
					const target = resolve(entry, attribute, reference.ref);
					if (target) {
						const link = document.createElement("a");
						link.textContent = reference.label ?? target.label;
						const hash =
							this.host.ownerDocument.defaultView?.location.hash ?? "";
						const route = hash.startsWith("#/")
							? hash.split("#").slice(0, 2).join("#")
							: "";
						link.href = `${route}#${target.term.id}`;
						link.dataset.tpGlobalIndexCrossref = attribute;
						link.addEventListener("click", (event) => {
							if (
								event.button ||
								event.ctrlKey ||
								event.metaKey ||
								event.shiftKey ||
								event.altKey
							)
								return;
							event.preventDefault();
							event.stopPropagation();
							for (
								let accordion = target.term.closest("tp-accordion");
								accordion;
								accordion =
									accordion.parentElement?.closest("tp-accordion") ?? null
							) {
								const heading =
									accordion.querySelector<HTMLElement>(":scope > dl > dt");
								if (heading?.getAttribute("aria-expanded") === "false")
									heading.click();
							}
							target.term.tabIndex = -1;
							target.term.focus({ preventScroll: true });
							target.term.scrollIntoView?.({ block: "center" });
						});
						paragraph.append(link);
					} else paragraph.append(reference.label ?? reference.ref);
				}
				entry.description.insertBefore(
					paragraph,
					entry.description.querySelector(":scope > dl"),
				);
			}
		}
	}
}
