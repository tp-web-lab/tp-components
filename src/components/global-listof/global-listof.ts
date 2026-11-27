import { GlobalDefinitionList } from "../../utilities/global-definitions.js";
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-accordion
 * @summary Collapsible multi-panels element.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-theorem
 * @summary Theorems, definitions, examples, remarks and proofs.
 */
// tp-docgen:dependencies:end

import {
	clearGlobalListCache,
	type GlobalListHost,
	globalListAnchor,
	globalListDefinitionContent,
	globalListDocument,
	globalListElements,
	globalListHostSelector,
} from "../../utilities/global-listof.js";
import {
	noteNumbers,
	referenceLabel,
	referenceScope,
} from "../../utilities/references.js";
import { TpBase } from "../base/base.js";
import "../accordion/accordion.js";
import "../theorem/theorem.js";
import { theoremNumbers } from "../theorem/theorem-numbering.js";

/**
 * The custom `<tp-global-listof>` element lists labelled elements across the pages of a multi-page document, with links to their pages and anchors.
 *
 * @summary Lists labelled elements across the pages of a multi-page document, with links to their pages and anchors.
 * @tagname tp-global-listof
 * @attr {string} selector = "" - CSS selector identifying the elements to list on each page.
 * @attr {string} title = "" - Heading displayed above the generated list.
 * @attr {string} index = "default" - Named index used when selecting tp-index definitions.
 * @attr {string} group-by = "" - Set to letter to group a merged index in closed alphabetical accordion panels.
 * @attr {boolean} merge = false - Combines source pages into a global list instead of closed per-page accordion panels.
 * @event tp-global-listof-ready Emitted after indexing with the entry count and number of unavailable pages.
 * @eventdetail tp-global-listof-ready { count: number; failures: number }
 * @keyboard {Enter} Follows the focused page and anchor link.
 * @accessibility Uses native link lists, locally numbered note lists and description lists, with a status message for loading or unavailable pages.
 * @accessibilityresponsibility Give targets meaningful titles, labels or captions and use unique authored IDs within each page.
 * @see tp-listof - Lists elements in the current document scope.
 * @see tp-markup-multi-pages - Provides pages and navigation for mixed markup documents.
 * @example
 * <tp-box style="position: relative; contain: layout; block-size: 32rem; padding: 0;">
 *   <tp-html-multi-pages repository="/docs/components/global-listof/examples/guide" label="Global lists" menu=""></tp-html-multi-pages>
 * </tp-box>
 */
export class TpGlobalListof extends TpBase {
	private generation = 0;
	private host: GlobalListHost | null = null;
	public static get observedAttributes(): string[] {
		return ["selector", "title", "index", "merge", "group-by"];
	}
	public get merge(): boolean {
		return this.hasAttribute("merge");
	}
	public set merge(value: boolean) {
		this.toggleAttribute("merge", value);
	}
	public get selector(): string {
		return this.getAttribute("selector") ?? "";
	}
	public set selector(value: string) {
		this.setAttribute("selector", value);
	}
	public get index(): string {
		return this.getAttribute("index") || "default";
	}
	public set index(value: string) {
		this.setAttribute("index", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.host = this.closest<GlobalListHost>(globalListHostSelector);
		this.host?.addEventListener("tp-global-pages-change", this.pagesChanged);
		void this.update();
	}
	public disconnectedCallback(): void {
		this.generation++;
		this.host?.removeEventListener("tp-global-pages-change", this.pagesChanged);
		this.host = null;
	}
	protected override attributeChangedCallback(): void {
		if (this.isConnected) void this.update();
	}
	private pagesChanged = (): void => {
		void this.update();
	};
	/** Reloads the document index after files have changed. */
	public async refresh(): Promise<void> {
		if (this.host) clearGlobalListCache(this.host);
		await this.update();
	}
	private async update(): Promise<void> {
		const generation = ++this.generation;
		const output = document.createElement("div");
		output.dataset.tpReferenceOutput = "";
		const status = document.createElement("p");
		status.setAttribute("role", "status");
		const list = document.createElement("div");
		let count = 0;
		if (this.title) {
			const heading = document.createElement("h2");
			heading.textContent = this.title;
			output.append(heading);
		}
		output.append(status, list);
		this.replaceChildren(output);
		this.removeAttribute("data-invalid-selector");
		this.removeAttribute("aria-busy");
		if (!this.host || typeof this.host.getGlobalListPages !== "function") {
			status.textContent = "Place this list inside a multi-page document.";
			return;
		}
		if (!this.selector.trim()) {
			status.textContent = "Choose a selector to list document elements.";
			return;
		}
		try {
			document.createDocumentFragment().querySelector(this.selector);
		} catch {
			this.setAttribute("data-invalid-selector", "");
			status.textContent = "Invalid element selector.";
			return;
		}
		const host = this.host;
		const selector = this.selector;
		const index = this.index;
		const pages = host.getGlobalListPages();
		const merge = this.merge;
		const definitions = new Map<string, GlobalDefinitionList>();
		this.setAttribute("aria-busy", "true");
		status.textContent = "Loading document entries…";
		let failures = 0;
		const sections = new Map<
			Element | string,
			{ title: string; content: HTMLElement }
		>();
		const accordion = document.createElement("tp-accordion");
		accordion.setAttribute("multiple", "");
		const accordionData = document.createElement("dl");
		accordion.append(accordionData);
		let accordionPlaced = false;
		for (const page of pages) {
			if (generation !== this.generation || !this.isConnected) return;
			try {
				const doc = await globalListDocument(host, page.href);
				if (generation !== this.generation || !this.isConnected) return;
				const targets = globalListElements(doc, selector);
				const statementNumbers = theoremNumbers(doc);
				const sectionFor = (): HTMLElement => {
					const key = page.href;
					let section = sections.get(key);
					if (!section) {
						section = {
							title: page.title,
							content: document.createElement("div"),
						};
						sections.set(key, section);
						const term = document.createElement("dt");
						term.textContent = section.title;
						const panel = document.createElement("dd");
						panel.append(section.content);
						accordionData.append(term, panel);
					}
					if (!accordionPlaced) {
						list.append(document.createComment("global sections"));
						accordionPlaced = true;
					}
					return section.content;
				};
				const numbers = new Map<Element, Map<string, number>>();
				const notes = new Map<Element, Element[]>();
				const numberFor = (note: Element) => {
					const scope = referenceScope(note);
					if (!numbers.has(scope)) numbers.set(scope, noteNumbers(scope));
					return numbers.get(scope)?.get(note.getAttribute("ref") ?? "");
				};
				for (const target of targets.filter(
					(item) => item.localName === "tp-note",
				)) {
					const scope = referenceScope(target);
					const group = notes.get(scope) ?? [];
					group.push(target);
					notes.set(scope, group);
				}
				for (const group of notes.values())
					group.sort(
						(a, b) => (numberFor(a) ?? Infinity) - (numberFor(b) ?? Infinity),
					);
				for (const original of targets) {
					const target =
						original.localName === "tp-note"
							? (notes.get(referenceScope(original))?.shift() ?? original)
							: original;
					if (
						target.localName === "tp-index" &&
						(target.getAttribute("index") || "default") !== index
					)
						continue;
					const equationNumber =
						target.localName === "tp-equanum"
							? target.getAttribute("number")?.trim()
							: "";
					const statementType = target.getAttribute("type") || "theorem";
					const statementNumber = statementNumbers.get(target) || "";
					const statementName =
						target.getAttribute("label") ||
						statementType.charAt(0).toUpperCase() + statementType.slice(1);
					const statementHeading =
						target.getAttribute("heading") ||
						target.querySelector('[slot="heading"]')?.textContent?.trim();
					const statementLabel =
						target.localName === "tp-theorem"
							? `${statementName}${statementNumber ? ` ${statementNumber}` : ""}${statementHeading ? ` — ${statementHeading}` : ""}`
							: "";
					const label =
						statementLabel ||
						(equationNumber ? `Equation (${equationNumber})` : "") ||
						referenceLabel(target) ||
						(target.localName === "tp-toc" ? "Contents" : "") ||
						(target.matches("h1,h2,h3,h4,h5,h6")
							? target.textContent?.trim()
							: "");
					if (!label) continue;
					const container = merge ? list : sectionFor();
					if (target.matches("tp-biblio,tp-glossary,tp-index")) {
						const key = `${merge ? "" : page.href}:${target.localName}`;
						let bibliography = definitions.get(key);
						if (!bibliography) {
							bibliography = new GlobalDefinitionList(
								host,
								target.localName.slice(3) as "biblio" | "glossary" | "index",
							);
							definitions.set(key, bibliography);
						}
						if (!bibliography.element.parentNode)
							container.append(bibliography.element);
						const before = bibliography.size;
						bibliography.add(target, doc, page);
						count += bibliography.size - before;
						continue;
					}

					const link = document.createElement("a");
					link.href = host.globalListHref(
						`${page.href}#${encodeURIComponent(globalListAnchor(target, doc))}`,
					);
					link.textContent = merge ? `${page.title} — ${label}` : label;
					link.dataset.tpGlobalOrigin = "";
					const definition = target.matches("tp-biblio,tp-glossary,tp-index");
					const note = target.localName === "tp-note";
					const tag = definition ? "dl" : note ? "ol" : "ul";

					let group = container.lastElementChild;
					if (
						group?.localName !== tag ||
						group.hasAttribute("data-tp-global-definitions")
					) {
						group = document.createElement(tag);
						container.append(group);
					}
					if (definition) {
						const term = document.createElement("dt");
						const description = document.createElement("dd");
						term.append(link);
						description.append(
							globalListDefinitionContent(target, doc, host, page.href),
						);
						group.append(term, description);
					} else {
						const item = document.createElement("li");
						item.append(link);
						if (
							note ||
							target.matches("tp-equanum,figure,table,pre,tp-theorem")
						) {
							if (note) {
								const number = numberFor(target);
								if (number !== undefined) item.value = number;
							}
							const content = document.createElement(
								target.matches("figure,table,pre,tp-theorem")
									? target.localName
									: "div",
							);
							if (target.matches("figure,table,pre,tp-theorem")) {
								if (target.localName === "figure")
									content.setAttribute("data-tp-global-figure", "");
								for (const name of ["class", "style", "lang", "dir", "title"]) {
									const value = target.getAttribute(name);
									if (value !== null) content.setAttribute(name, value);
								}
							}
							if (target.localName === "tp-theorem") {
								content.setAttribute("number", statementNumber);
								for (const name of [
									"type",
									"variant",
									"heading",
									"label",
									"qed",
								]) {
									const value = target.getAttribute(name);
									if (value !== null) content.setAttribute(name, value);
								}
							}
							content.append(
								globalListDefinitionContent(target, doc, host, page.href),
							);
							if (target.localName === "figure") {
								const caption = content.querySelector(":scope > figcaption");
								if (caption?.textContent?.trim()) {
									if (caption.querySelector("a")) {
										link.textContent = merge
											? `${page.title} — View figure`
											: "View figure";
										caption.append(" ", link);
									} else {
										link.replaceChildren(...caption.childNodes);
										if (merge) link.prepend(`${page.title} — `);
										caption.append(link);
									}
								}
							}
							item.append(content);
						}
						group.append(item);
					}
					count++;
				}
			} catch {
				failures++;
			}
		}
		if (generation !== this.generation || !this.isConnected) return;
		if (sections.size) {
			const marker = [...list.childNodes].find(
				(node) =>
					node.nodeType === Node.COMMENT_NODE &&
					node.textContent === "global sections",
			);
			marker?.replaceWith(accordion);
		}
		for (const definition of definitions.values()) definition.render();
		if (merge && this.getAttribute("group-by") === "letter") {
			for (const indexList of list.querySelectorAll<HTMLDListElement>(
				'dl[data-tp-global-definitions="index"]',
			)) {
				const groups = new Map<string, HTMLDListElement>();
				for (const term of [...indexList.children]) {
					if (term.localName !== "dt") continue;
					const description = term.nextElementSibling;
					const sortKey =
						(term as HTMLElement).dataset.tpIndexSortKey ??
						term.textContent ??
						"";
					const initial = sortKey
						.normalize("NFKD")
						.replace(/\p{M}/gu, "")
						.trim()
						.charAt(0)
						.toUpperCase();
					const letter = /^[A-Z]$/.test(initial) ? initial : "Symbols";
					let group = groups.get(letter);
					if (!group) {
						group = document.createElement("dl");
						group.dataset.tpGlobalDefinitions = "index";
						groups.set(letter, group);
					}
					group.append(term);
					if (description?.localName === "dd") group.append(description);
				}
				const panels = document.createElement("div");
				panels.dataset.tpGlobalAlphabet = "";
				for (const letter of [...groups.keys()].sort((a, b) =>
					a === "Symbols" ? -1 : b === "Symbols" ? 1 : a.localeCompare(b),
				)) {
					const accordion = document.createElement("tp-accordion");
					accordion.dataset.tpIndexLetter = letter;
					const data = document.createElement("dl"),
						summary = document.createElement("dt"),
						content = document.createElement("dd");
					summary.textContent = letter;
					const group = groups.get(letter);
					if (group) content.append(group);
					data.append(summary, content);
					accordion.append(data);
					panels.append(accordion);
				}
				indexList.replaceWith(panels);
			}
		}
		this.removeAttribute("aria-busy");
		status.textContent = failures
			? `${failures} page(s) could not be indexed. Available entries are shown.`
			: count
				? ""
				: "No matching document entries.";
		status.hidden = !status.textContent;
		this.dispatchEvent(
			new CustomEvent("tp-global-listof-ready", {
				bubbles: true,
				detail: { count: count, failures },
			}),
		);
	}
}
if (!customElements.get("tp-global-listof"))
	customElements.define("tp-global-listof", TpGlobalListof);
declare global {
	interface HTMLElementTagNameMap {
		"tp-global-listof": TpGlobalListof;
	}
}
