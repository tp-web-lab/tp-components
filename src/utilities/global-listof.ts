import {
	referenceContent,
	referenceElements,
	referenceLabel,
	referenceScope,
} from "./references.js";
import { rebaseSourceContent } from "./source-url.js";

export const globalListHostSelector =
	"tp-markup-multi-pages,tp-html-multi-pages,tp-markdown-multi-pages,tp-asciidoc-multi-pages,tp-latex-multi-pages,tp-restructuredtext-multi-pages";
export interface GlobalListPage {
	href: string;
	title: string;
}
export interface GlobalListHost extends HTMLElement {
	getGlobalListPages(): GlobalListPage[];
	globalListHref(href: string): string;
}
const prefix = "tp-global-target-";
const excluded =
	"[data-tp-reference-output],tp-tooltip,tp-global-listof,script,style,template";
export function globalListElements(
	root: ParentNode,
	selector: string,
): Element[] {
	return [...root.querySelectorAll(selector)].filter(
		(element) => !element.closest(excluded),
	);
}
function locatorLabel(element: Element): string {
	return element.localName === "tp-ref"
		? (element.getAttribute("href") ?? "")
		: referenceLabel(element);
}
/** A locator remains stable across inert parsing and component upgrades. */
export function globalListAnchor(element: Element, root: ParentNode): string {
	if (element.id && !element.hasAttribute("data-tp-reference-generated-id"))
		return element.id;
	const label = locatorLabel(element);
	const matches = globalListElements(root, element.localName).filter(
		(item) => locatorLabel(item) === label,
	);
	return (
		prefix +
		JSON.stringify([element.localName, label, matches.indexOf(element)])
	);
}
/** Prefer the visible local note copy over a hidden authored definition. */
function visibleNoteTarget(
	root: ParentNode,
	target: Element,
): HTMLElement | null {
	const note = target.closest("tp-note[ref]");
	if (!note) return null;
	const item = [
		...root.querySelectorAll<HTMLElement>("tp-listof [data-tp-note-ref]"),
	].find((element) => element.dataset.tpNoteRef === note.getAttribute("ref"));
	if (!item) return null;
	if (target.localName !== "tp-ref") return item;
	const index = [...note.querySelectorAll<Element>("tp-ref")].indexOf(target);
	const copy = item.querySelectorAll<HTMLElement>("tp-ref")[index];
	return copy?.hasAttribute("silent")
		? (copy.parentElement ?? item)
		: (copy ?? item);
}
/** Resolve a deep link without changing local reference IDs or numbering. */
export function globalListTarget(
	root: ParentNode | null,
	id: string,
): HTMLElement | null {
	if (!root) return null;
	const existing = [...root.querySelectorAll<HTMLElement>("[id]")].find(
		(element) => element.id === id,
	);
	if (existing) {
		const visible = visibleNoteTarget(root, existing);
		if (visible) return visible;
		if (
			!existing.hidden &&
			!existing.matches("tp-note,tp-biblio,tp-glossary,tp-index,tp-ref[silent]")
		)
			return existing;
		const previous = existing.previousElementSibling;
		if (previous instanceof HTMLElement && previous.dataset.tpGlobalFor === id)
			return previous;
		const anchor = existing.ownerDocument.createElement("span");
		anchor.dataset.tpGlobalAnchor = "";
		anchor.dataset.tpGlobalFor = id;
		existing.before(anchor);
		return anchor;
	}
	if (!id.startsWith(prefix)) return null;
	try {
		const [tag, label, index] = JSON.parse(id.slice(prefix.length));
		if (
			typeof tag !== "string" ||
			!/^[a-z][a-z0-9-]*$/.test(tag) ||
			typeof label !== "string" ||
			!Number.isInteger(index) ||
			index < 0
		)
			return null;
		const target = globalListElements(root, tag).filter(
			(item) => locatorLabel(item) === label,
		)[index];
		if (!(target instanceof HTMLElement)) return null;
		const visible = visibleNoteTarget(root, target);
		const anchor = target.ownerDocument.createElement("span");
		anchor.id = id;
		anchor.dataset.tpGlobalAnchor = "";
		(visible ?? target).before(anchor);
		return anchor;
	} catch {
		return null;
	}
}
const snapshots = new WeakMap<HTMLElement, Map<string, Promise<Document>>>();
export function clearGlobalListCache(host: HTMLElement): void {
	snapshots.delete(host);
}
export function globalListDocument(
	host: HTMLElement,
	href: string,
): Promise<Document> {
	let cache = snapshots.get(host);
	if (!cache) {
		cache = new Map();
		snapshots.set(host, cache);
	}
	const url = new URL(href, host.ownerDocument.baseURI).href;
	let pending = cache.get(url);
	if (!pending) {
		pending = (async () => {
			const response = await fetch(url);
			if (!response.ok)
				throw new Error(`Unable to load ${url} (${response.status})`);
			const source = await response.text();
			const { markupToHtml, markupLanguageFromPath } = await import(
				"./markup-conversion.js"
			);
			const html = await markupToHtml(source, markupLanguageFromPath(url), url);
			// DOMParser never connects custom elements or executes authored scripts.
			const snapshot = new DOMParser().parseFromString(html, "text/html");
			await expandQuestionPrompts(snapshot, url);
			return snapshot;
		})();
		cache.set(url, pending);
		pending.catch(() => cache?.delete(url));
	}
	return pending;
}

/** Read external exercise prompts without executing their editors or indexing solutions. */
export async function expandQuestionPrompts(
	root: Document | Element,
	base: string,
	ancestors: ReadonlySet<string> = new Set(),
): Promise<void> {
	if (ancestors.size >= 12) return;
	const questions = [...root.querySelectorAll("[src]")].filter((node) =>
		/^tp-.+-(?:interpreter|playground)-question$/.test(node.localName),
	);
	for (const question of questions) {
		const src = question.getAttribute("src") ?? "";
		if (!/\.(?:md|markdown)(?:[?#]|$)/i.test(src)) continue;
		const url = new URL(src, base).href;
		if (ancestors.has(url)) continue;
		const response = await fetch(url);
		if (!response.ok)
			throw new Error(`Unable to load exercise ${url} (${response.status})`);
		const { markupToHtml } = await import("./markup-conversion.js");
		const html = await markupToHtml(await response.text(), "markdown", url);
		const definition = new DOMParser().parseFromString(html, "text/html");
		const terms = [
			...(definition.querySelector("dl")?.querySelectorAll(":scope > dt") ??
				[]),
		];
		const prompt = terms.find(
			(term) => term.textContent?.trim().toLowerCase() === "prompt",
		)?.nextElementSibling;
		if (prompt?.localName !== "dd") continue;
		const context = terms
			.find((term) => term.textContent?.trim().toLowerCase() === "context")
			?.nextElementSibling?.querySelector("a")
			?.getAttribute("href");
		const promptBase = context ? new URL(context, url).href : url;
		const container = definition.createElement("div");
		container.setAttribute("data-tp-source", promptBase);
		container.append(...prompt.childNodes);
		rebaseSourceContent(container, url, promptBase);
		await expandQuestionPrompts(
			container,
			promptBase,
			new Set([...ancestors, url]),
		);
		question.append(container);
	}
}

/** Copy readable definitions without creating references in the destination scope. */
export function globalListDefinitionContent(
	target: Element,
	source: Document,
	host: GlobalListHost,
	href: string,
): DocumentFragment {
	const content = referenceContent(target);
	const base = new URL(href, host.ownerDocument.baseURI);
	// Book resources may already include the repository path (docs/image.svg).
	// Keep that application-relative prefix rather than adding docs twice.
	const application = new URL("./", host.ownerDocument.baseURI);
	const repositoryAttribute = host.getAttribute("repository");
	const repositoryUrl = repositoryAttribute
		? new URL(`${repositoryAttribute.replace(/\/$/, "")}/`, application)
		: null;
	// A root-relative repository inside this application has the same prefix
	// semantics as ./docs, including when the whole book is mounted below Home.
	const repository = repositoryUrl?.href.startsWith(application.href)
		? repositoryUrl.href.slice(application.href.length).replace(/\/$/, "")
		: undefined;
	const pages = new Set(
		host
			.getGlobalListPages()
			.map(
				(page) =>
					new URL(page.href, host.ownerDocument.baseURI).href.split("#")[0],
			),
	);
	for (const element of content.querySelectorAll("*")) {
		for (const attribute of [...element.attributes]) {
			if (attribute.name.startsWith("on"))
				element.removeAttribute(attribute.name);
			if (
				!["href", "src", "poster"].includes(attribute.name) ||
				element.localName === "tp-ref"
			)
				continue;
			try {
				const repositoryRelative =
					repository &&
					!repository.startsWith("/") &&
					attribute.value.startsWith(`${repository}/`);
				const url = new URL(
					attribute.value,
					repositoryRelative ? host.ownerDocument.baseURI : base,
				);
				if (
					repository &&
					!repository.startsWith("/") &&
					["src", "poster"].includes(attribute.name)
				) {
					const prefixed = new URL(`${repository}/`, base).href;
					const resolved = new URL(`${repository}/`, host.ownerDocument.baseURI)
						.href;
					if (url.href.startsWith(prefixed) && prefixed !== resolved)
						url.href = resolved + url.href.slice(prefixed.length);
				}
				if (url.protocol === "javascript:") {
					element.removeAttribute(attribute.name);
					continue;
				}
				element.setAttribute(
					attribute.name,
					attribute.name === "href" && pages.has(url.href.split("#")[0])
						? host.globalListHref(`${url.pathname}${url.search}${url.hash}`)
						: url.href,
				);
			} catch {
				/* Preserve non-URL component values. */
			}
		}
	}
	const originals = [...target.querySelectorAll("tp-ref")];
	const tags: Record<string, string> = {
		"^": "tp-note",
		"@": "tp-biblio",
		"%": "tp-glossary",
		"!": "tp-index",
		"=": "tp-equanum",
	};
	[...content.querySelectorAll("tp-ref")].forEach((copy, index) => {
		const original = originals[index];
		const reference = original?.getAttribute("href") ?? "";
		const tag = tags[reference[0] ?? ""];
		const definition =
			original && tag
				? referenceElements(referenceScope(original), tag).find(
						(item) =>
							item.getAttribute("ref") === reference.slice(1) &&
							(tag !== "tp-index" ||
								(item.getAttribute("index") || "default") ===
									(original.getAttribute("index") || "default")),
					)
				: undefined;
		const replacement = document.createElement(definition ? "a" : "span");
		if (definition)
			replacement.setAttribute(
				"href",
				host.globalListHref(
					`${href}#${encodeURIComponent(globalListAnchor(definition, source))}`,
				),
			);
		replacement.append(...copy.childNodes);
		if (!replacement.textContent?.trim())
			replacement.textContent =
				original?.getAttribute("label") ||
				(definition ? referenceLabel(definition) : reference.slice(1));
		if (original?.hasAttribute("silent")) replacement.textContent = "";
		copy.replaceWith(replacement);
	});
	return content;
}
