import "../components/box/box.js";
import "../components/button/button.js";
import "../components/button-group/button-group.js";
import "../components/icon-button/icon-button.js";
import "../components/textfield/textfield.js";
import "../components/numberfield/numberfield.js";
import { TpColor } from "../components/color/color.js";
import "../components/stack/stack.js";
import "../components/cluster/cluster.js";
import "../components/icon/icon.js";
import DOMPurify from "dompurify";
import { TpDropdown } from "../components/dropdown/dropdown.js";
import { TpPostIt, type TpPostItColor } from "../components/post-it/post-it.js";
import "../components/post-it/post-it.js";
import style from "./personal-annotations.css?inline";

/** Supported source languages; older notes use plain text. */
const annotationLanguages = ["adoc", "html", "md", "rst", "txt"] as const;
type AnnotationLanguage = (typeof annotationLanguages)[number];
/** Public author-facing language names; storage retains its historical aliases. */
export const annotationMarkups = {
	none: "txt",
	html: "html",
	markdown: "md",
	asciidoc: "adoc",
	restructuredtext: "rst",
} as const;
export type AnnotationMarkup = keyof typeof annotationMarkups;

/** Persisted annotation; selectors are checked against a text fingerprint. */
export interface PersonalAnnotation {
	id: string;
	text: string;
	selector: string;
	tag: string;
	quote: string;
	x: number;
	y: number;
	/** Optional presentation values preserve compatibility with earlier saved notes. */
	heading?: string;
	color?: TpPostItColor;
	opacity?: number;
	rotation?: number;
	language?: AnnotationLanguage;
}

/** Renders source without executing annotation scripts or event handlers. */
export async function renderAnnotation(
	source: string,
	language: AnnotationLanguage,
): Promise<string> {
	let html = source;
	if (language === "md")
		html = await (
			await import("../components/markdown/markdown.js")
		).renderMarkdownToHtml(source);
	if (language === "adoc")
		html = await (
			await import("../components/asciidoc/asciidoc.js")
		).renderAsciidocToHtml(source);
	if (language === "rst")
		html = await (
			await import("../components/restructuredtext/restructuredtext.js")
		).renderRestructuredTextToHtml(source);
	const sanitized = DOMPurify.sanitize(html, {
		USE_PROFILES: { html: true },
		CUSTOM_ELEMENT_HANDLING: {
			tagNameCheck: /^tp-math$/,
			attributeNameCheck: /^(value|mode|displaystyle|label)$/,
		},
		FORBID_TAGS: ["style", "iframe", "form"],
		FORBID_ATTR: ["style"],
		SANITIZE_NAMED_PROPS: true,
	});
	const template = document.createElement("template");
	template.innerHTML = sanitized;
	for (const placeholder of template.content.querySelectorAll(
		"[data-mathjax-tex], [data-mathjax-asciimath]",
	)) {
		if (placeholder.closest("tp-math")) continue;
		const math = document.createElement("tp-math");
		const ascii = placeholder.hasAttribute("data-mathjax-asciimath");
		math.setAttribute(
			"value",
			placeholder.getAttribute(
				ascii ? "data-mathjax-asciimath" : "data-mathjax-tex",
			) ?? "",
		);
		math.setAttribute("mode", ascii ? "asciimath" : "latexmath");
		math.toggleAttribute(
			"displaystyle",
			placeholder.getAttribute("data-mathjax-display") === "true",
		);
		placeholder.replaceWith(math);
	}
	// Math is the only permitted custom element. Never load a formula from a URL.
	for (const math of template.content.querySelectorAll("tp-math")) {
		for (const attribute of [...math.attributes]) {
			if (!["value", "mode", "displaystyle", "label"].includes(attribute.name))
				math.removeAttribute(attribute.name);
		}
		math.textContent = math.textContent ?? "";
	}
	return template.innerHTML;
}

/** Uses the post-it palette in the same order as its Attributes example. */
const annotationColors = TpPostIt.colors;

/** Resolves safe presentation values, including older records without appearance settings. */
function appearance(record: PersonalAnnotation): {
	heading: string;
	color: TpPostItColor;
	opacity: number;
	rotation: number;
} {
	return {
		heading:
			typeof record.heading === "string"
				? record.heading
				: "Personal annotation",
		color:
			record.color && annotationColors.includes(record.color)
				? record.color
				: "yellow",
		opacity:
			typeof record.opacity === "number" && Number.isFinite(record.opacity)
				? Math.max(0, Math.min(1, record.opacity))
				: 1,
		rotation:
			typeof record.rotation === "number" && Number.isFinite(record.rotation)
				? Math.max(-12, Math.min(12, record.rotation))
				: 0,
	};
}

/** Normalizes author text without including personal notes. */
function quote(element: Element): string {
	const walker = element.ownerDocument.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
	);
	let text = "";
	let node = walker.nextNode();
	while (node) {
		if (
			!node.parentElement?.closest("[data-personal-annotation], script, style")
		)
			text += node.textContent ?? "";
		node = walker.nextNode();
	}
	return text.replace(/\s+/g, " ").trim().slice(0, 240);
}

/** Builds a root-relative structural path; a fingerprint prevents silent reassignment. */
export function annotationTarget(
	root: HTMLElement,
	element: Element,
): Pick<PersonalAnnotation, "selector" | "tag" | "quote"> {
	const parts: string[] = [];
	let current: Element | null = element;
	while (current && current !== root) {
		const tag = current.localName;
		const siblings: Element[] = Array.from(
			current.parentElement?.children ?? [],
		).filter((child) => child.localName === tag);
		parts.unshift(`${tag}:nth-of-type(${siblings.indexOf(current) + 1})`);
		current = current.parentElement;
	}
	return {
		selector: element.id
			? `[id=${JSON.stringify(element.id)}]`
			: parts.join(" > "),
		tag: element.localName,
		quote: quote(element),
	};
}

/** Finds a verified target, falling back only to a unique text match. */
export function resolveAnnotationTarget(
	root: HTMLElement,
	record: PersonalAnnotation,
): Element | null {
	try {
		const selected = root.querySelector(record.selector);
		if (selected?.localName === record.tag && quote(selected) === record.quote)
			return selected;
	} catch {
		/* Stale or malformed selectors remain recoverable in the annotations list. */
	}
	const matches = Array.from(root.querySelectorAll("*")).filter(
		(element) =>
			element.localName === record.tag &&
			!element.closest("[data-personal-annotation]") &&
			quote(element) === record.quote,
	);
	return record.quote && matches.length === 1 ? (matches[0] ?? null) : null;
}

/** Validates storage before any record can reach the DOM. */
export function parseAnnotations(value: string | null): PersonalAnnotation[] {
	if (!value) return [];
	const data: unknown = JSON.parse(value);
	if (!Array.isArray(data)) throw new Error("Invalid annotation data.");
	return data.filter((item): item is PersonalAnnotation => {
		if (!item || typeof item !== "object") return false;
		const record = item as Record<string, unknown>;
		return (
			["id", "text", "selector", "tag", "quote"].every(
				(key) => typeof record[key] === "string",
			) &&
			typeof record.x === "number" &&
			Number.isFinite(record.x) &&
			typeof record.y === "number" &&
			Number.isFinite(record.y)
		);
	});
}

/** One page-scoped annotation editor shared by all single-page and multi-page formats. */
export class PersonalAnnotations {
	/** Toolbar entry point, owned by the host's toolbar. */
	public readonly button = document.createElement("tp-icon-button");
	/** Management panel stays outside rendered author content. */
	private readonly panel = document.createElement("tp-box");
	/** Announcements include selection instructions and storage errors. */
	private readonly status = document.createElement("p");
	/** List includes annotations whose target no longer exists. */
	private readonly list = document.createElement("div");
	/** Plain-text editor does not execute annotation markup. */
	private readonly field = document.createElement("tp-textfield");
	/** Language trigger and current source format. */
	private readonly languageButton = document.createElement("tp-icon-button");
	private language: AnnotationLanguage = "txt";
	private defaultLanguage: AnnotationLanguage = "txt";
	/** Menu entries retained to synchronize the selected language after editing or choosing. */
	private readonly languageItems = new Map<AnnotationLanguage, HTMLLIElement>();
	/** Optional title, edited as plain text. */
	private readonly headingField = document.createElement("tp-textfield");
	/** Palette controller targets itself so draft changes never recolor the document. */
	private readonly colorField = new TpColor();
	/** Transparency control mirrors the post-it Attributes example. */
	private readonly opacityField = document.createElement("tp-numberfield");
	/** Angle control mirrors the post-it Attributes example. */
	private readonly rotationField = document.createElement("tp-numberfield");
	/** Editor actions remain available even for invisible notes. */
	private readonly editor = document.createElement("div");
	/** Current page's validated records. */
	private records: PersonalAnnotation[] = [];
	/** Live notes indexed independently of their DOM position. */
	private readonly notes = new Map<string, TpPostIt>();
	/** Storage key never includes the active heading fragment. */
	private key = "";
	/** Draft remains unpersisted until Save. */
	private draft: PersonalAnnotation | null = null;
	/** A pending target selection either creates or reattaches an annotation. */
	private selecting: string | null = null;
	/** Original tabindex values restored when selection ends. */
	private readonly focusTargets = new Map<HTMLElement, string | null>();
	/** Watches asynchronously rendered markup without polling. */
	private readonly observer = new MutationObserver((mutations) => {
		// A body-wide target includes our own UI: never observe its rendering as
		// a document change, or refreshing the saved-note list triggers itself.
		const documentChanged = mutations.some((mutation) => {
			const element =
				mutation.target instanceof Element
					? mutation.target
					: mutation.target.parentElement;
			return !element?.closest("[data-personal-annotation]");
		});
		if (documentChanged) this.restore();
	});
	/** Position against the document column, never the smaller selectable example box. */
	private readonly layoutRoot: HTMLElement;
	/** Recomputes editor bounds when the document column changes width. */
	private readonly layoutObserver =
		typeof ResizeObserver === "undefined"
			? null
			: new ResizeObserver(() => this.positionPanel());

	/** Installs scoped controls and listeners. Call dispose before replacing the host. */
	public constructor(
		private readonly host: HTMLElement,
		private readonly root: HTMLElement,
		private readonly onMarkupChange?: (markup: AnnotationMarkup) => void,
	) {
		this.layoutRoot =
			root.closest<HTMLElement>('main, [data-role="content"]') ??
			root.ownerDocument.documentElement;
		if (!host.ownerDocument.getElementById("tp-personal-annotations-style")) {
			const stylesheet = host.ownerDocument.createElement("style");
			stylesheet.id = "tp-personal-annotations-style";
			stylesheet.textContent = style;
			host.ownerDocument.head.append(stylesheet);
		}
		this.button.setAttribute("name", "post-it-editor");
		this.button.setAttribute("library", "components");
		this.button.setAttribute("label", "Personal annotations");
		this.button.setAttribute("section", "start");
		this.button.setAttribute("data-action", "annotations");
		this.button.addEventListener("click", () => {
			this.showPanel(Boolean(this.panel.hidden));
			if (!this.panel.hidden) {
				this.renderList();
				this.panel.focus();
			}
		});
		this.panel.setAttribute("data-personal-annotation", "panel");
		this.panel.tabIndex = -1;
		this.panel.hidden = true;
		this.panel.setAttribute("popover", "manual");
		this.panel.setAttribute("role", "region");
		this.panel.setAttribute("aria-label", "Personal annotations");
		const heading = document.createElement("h3");
		const headingIcon = document.createElement("tp-icon");
		headingIcon.setAttribute("name", "post-it");
		headingIcon.setAttribute("library", "components");
		headingIcon.setAttribute("aria-hidden", "true");
		const headingText = document.createElement("span");
		headingText.textContent = "Personal annotations";
		heading.append(headingIcon, headingText);
		const header = document.createElement("tp-cluster");
		header.setAttribute("data-annotation-header", "");
		header.setAttribute("align", "center");
		header.setAttribute("gap", "var(--tp-toolbar-section-gap, 0.25rem)");
		header.setAttribute("justify", "space-between");
		header.append(
			heading,
			this.iconAction("close", "Close", () => {
				this.showPanel(false);
				this.cancelSelection();
				this.button.querySelector("button")?.focus();
			}),
		);
		const add = this.iconAction("plus", "Add annotation", () =>
			this.select("new"),
		);
		add.setAttribute("data-annotation-add", "");
		header.insertBefore(add, header.lastElementChild);
		this.status.setAttribute("role", "status");
		const help = document.createElement("p");
		help.textContent =
			"Saved only in this browser for this document. Clearing site data deletes these notes. Select a target below, or focus an element and press Enter. Escape cancels selection.";
		const helpDetails = document.createElement("details");
		const helpSummary = document.createElement("summary");
		helpSummary.textContent = "Help and local storage";
		helpDetails.append(helpSummary, help);
		this.field.setAttribute("multiline", "");
		this.field.setAttribute("rows", "2");
		this.field.setAttribute("aria-label", "Annotation text");
		this.field.setAttribute("label", "Annotation text");
		this.field.setAttribute("clearable", "");
		this.headingField.setAttribute("label", "heading");
		this.headingField.setAttribute("aria-label", "heading");
		this.headingField.setAttribute("clearable", "");
		this.colorField.id = `annotation-color-${crypto.randomUUID()}`;
		this.colorField.anchor = `#${this.colorField.id}`;
		this.colorField.preset = "tp-yellow";
		[this.opacityField, this.rotationField].forEach((control) => {
			control.setAttribute("range", "");
		});
		this.opacityField.setAttribute("label", "opacity");
		this.opacityField.setAttribute("min", "0");
		this.opacityField.setAttribute("max", "1");
		this.opacityField.setAttribute("step", "0.05");
		this.rotationField.setAttribute("label", "rotation");
		this.rotationField.setAttribute("min", "-12");
		this.rotationField.setAttribute("max", "12");
		this.rotationField.setAttribute("step", "1");
		const ranges = document.createElement("tp-cluster");
		ranges.setAttribute("data-annotation-ranges", "");
		ranges.setAttribute("gap", "0.75rem");
		ranges.append(this.opacityField, this.rotationField);
		const settings = document.createElement("tp-stack");
		settings.setAttribute("gap", "0.5rem");
		settings.append(this.headingField, ranges);
		const actions = document.createElement("tp-button-group");
		actions.append(
			this.action("Save", () => this.saveDraft()),
			this.action("Cancel", () => {
				this.draft = null;
				this.setEditing(false);
				this.list.hidden = false;
			}),
			this.action("Reset appearance defaults", () =>
				this.editAppearance({
					heading: "",
					color: "yellow",
					opacity: 1,
					rotation: 0,
				}),
			),
		);
		this.editor.setAttribute("data-annotation-editor", "");
		this.languageButton.id = `annotation-language-${crypto.randomUUID()}`;
		this.languageButton.setAttribute("label", "Annotation language");
		this.languageButton.setAttribute("aria-label", "Annotation language");
		this.languageButton.setAttribute("aria-haspopup", "menu");
		this.languageButton.setAttribute("aria-expanded", "false");
		const dropdown = new TpDropdown();
		dropdown.setAttribute("anchor", `#${this.languageButton.id}`);
		dropdown.setAttribute("outside-click", "");
		const languages = document.createElement("ul");
		languages.setAttribute("data-annotation-languages", "");
		const languageIcons: Record<AnnotationLanguage, string> = {
			adoc: "file_type_asciidoc",
			html: "file_type_html",
			md: "file_type_markdown",
			rst: "file_type_restructuredtext",
			txt: "language-text",
		};
		const languageNames: Record<AnnotationLanguage, string> = {
			adoc: "AsciiDoc",
			html: "HTML",
			md: "Markdown",
			rst: "reStructuredText",
			txt: "Plain text",
		};
		annotationLanguages.forEach((language) => {
			const item = document.createElement("li");
			item.setAttribute("data-language", language);
			const icon = document.createElement("tp-icon");
			icon.setAttribute("library", language === "txt" ? "tp" : "languages");
			icon.setAttribute("name", languageIcons[language]);
			icon.setAttribute("aria-hidden", "true");
			const caption = document.createElement("span");
			caption.textContent = languageNames[language];
			const check = document.createElement("tp-icon");
			check.setAttribute("name", "check");
			check.setAttribute("library", "tp");
			check.setAttribute("aria-hidden", "true");
			check.setAttribute("data-language-check", "");
			item.append(icon, caption, check);
			this.languageItems.set(language, item);
			item.addEventListener("click", () => {
				this.language = language;
				const markup = (
					Object.keys(annotationMarkups) as AnnotationMarkup[]
				).find((key) => annotationMarkups[key] === language);
				if (markup) this.onMarkupChange?.(markup);
				this.syncLanguageMenu();
				dropdown.hide();
				this.languageButton.querySelector("button")?.focus();
			});
			item.addEventListener("keydown", (event) => {
				if (event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				event.stopPropagation();
				item.click();
			});
			languages.append(item);
		});
		dropdown.append(languages);
		this.syncLanguageMenu();
		this.languageButton.addEventListener("click", () => dropdown.toggle());
		dropdown.addEventListener("tp-dropdown-toggle", () =>
			this.languageButton.setAttribute(
				"aria-expanded",
				String(dropdown.hasAttribute("open")),
			),
		);
		const close = header.lastElementChild;
		header.insertBefore(this.languageButton, close);
		header.insertBefore(this.colorField, close);
		this.editor.append(this.field, settings, actions);
		this.setEditing(false);
		this.panel.append(header, helpDetails, this.status, this.editor, this.list);
		this.panel.append(dropdown);
		this.host.append(this.panel);
		this.root.addEventListener("click", this.pick, true);
		this.host.ownerDocument.addEventListener("keydown", this.keyboard, true);
		this.observer.observe(this.root, { childList: true, subtree: true });
		this.layoutObserver?.observe(this.root);
		if (this.layoutRoot !== this.root)
			this.layoutObserver?.observe(this.layoutRoot);
		this.host.ownerDocument.defaultView?.addEventListener(
			"resize",
			this.positionPanel,
		);
	}
	/** Header settings remain visible but only edit an active draft. */
	private setEditing(active: boolean): void {
		this.editor.hidden = !active;
		this.languageButton.toggleAttribute("disabled", !active);
		this.colorField.disabled = !active;
	}
	/** Keeps the trigger, visible check and accessible current item in agreement. */
	private syncLanguageMenu(): void {
		const languageName = this.languageItems
			.get(this.language)
			?.querySelector(":scope > span")?.textContent;
		this.languageButton.setAttribute("title", languageName ?? "Plain text");
		this.languageButton.setAttribute(
			"aria-description",
			`Current language: ${languageName ?? "Plain text"}`,
		);
		const selectedIcon = this.languageItems
			.get(this.language)
			?.querySelector("tp-icon");
		this.languageButton.setAttribute(
			"name",
			selectedIcon?.getAttribute("name") ?? "language-text",
		);
		this.languageButton.setAttribute(
			"library",
			selectedIcon?.getAttribute("library") ?? "tp",
		);
		this.languageItems.forEach((item, language) => {
			const selected = language === this.language;
			item.setAttribute("aria-current", String(selected));
			const check = item.querySelector<HTMLElement>("[data-language-check]");
			if (check) check.hidden = !selected;
		});
	}
	/** Aligns the editor with the current document column and viewport. */
	private readonly positionPanel = (): void => {
		if (this.panel.hidden) return;
		const viewport = this.host.ownerDocument.defaultView;
		if (!viewport) return;
		const rect = this.layoutRoot.getBoundingClientRect();
		const right =
			rect.width > 0
				? Math.min(viewport.innerWidth, rect.right)
				: viewport.innerWidth;
		const left = rect.width > 0 ? Math.max(0, rect.left) : 0;
		this.panel.style.right = `${Math.max(16, viewport.innerWidth - right + 16)}px`;
		this.panel.style.inlineSize = `min(36rem, ${Math.max(0, right - left - 32)}px)`;
	};
	/** Keeps the editor above floating notes without making the document modal. */
	private showPanel(open: boolean): void {
		this.panel.hidden = !open;
		if (open) {
			this.positionPanel();
			if (
				typeof this.panel.hidePopover === "function" &&
				this.panel.matches(":popover-open")
			)
				this.panel.hidePopover();
			this.panel.showPopover?.();
		} else this.panel.hidePopover?.();
	}
	/** Constructs a library button without interpolating stored text as HTML. */
	private action(label: string, callback: () => void): HTMLElement {
		const button = document.createElement("tp-button");
		button.textContent = label;
		button.addEventListener("click", callback);
		return button;
	}
	/** Creates a labelled library icon button with keyboard and tooltip support. */
	private iconAction(
		name: string,
		label: string,
		callback: () => void,
	): HTMLElement {
		const button = document.createElement("tp-icon-button");
		button.setAttribute("name", name);
		button.setAttribute("label", label);
		button.addEventListener("click", callback);
		return button;
	}
	/** Switches storage scope before page content is replaced; an empty key suspends notes. */
	public setPage(url: string): void {
		this.notes.forEach((note) => {
			note.remove();
		});
		this.notes.clear();
		this.cancelSelection();
		this.draft = null;
		this.setEditing(false);
		this.key = url ? `tp-personal-annotations:v1:${url}` : "";
		this.records = [];
		this.status.textContent = "";
		if (this.key) {
			try {
				this.records = parseAnnotations(
					this.host.ownerDocument.defaultView?.localStorage.getItem(this.key) ??
						null,
				);
			} catch {
				this.status.textContent =
					"Saved annotations could not be read. Browser storage may be unavailable or the saved data invalid.";
			}
		}
		this.restore();
		this.renderList();
	}
	/** Renders notes once their validated targets are available. */
	private restore(): void {
		this.records.forEach((record) => {
			const target = resolveAnnotationTarget(this.root, record);
			const existing = this.notes.get(record.id);
			if (!target) {
				existing?.remove();
				this.notes.delete(record.id);
				return;
			}
			if (existing?.isConnected) {
				if (existing.attachment?.element !== target)
					existing.attachTo(target, record.x, record.y);
				return;
			}
			const note = document.createElement("tp-post-it");
			note.setAttribute("data-personal-annotation", record.id);
			Object.assign(note, appearance(record));
			note.lite = true;
			const text = document.createElement("div");
			text.setAttribute("data-annotation-content", "");
			text.textContent = record.text;
			text.style.whiteSpace = "pre-wrap";
			if (
				record.language &&
				annotationLanguages.includes(record.language) &&
				record.language !== "txt"
			) {
				void renderAnnotation(record.text, record.language)
					.then(async (html) => {
						if (html.includes("<tp-math"))
							await import("../components/math/math.js");
						if (!text.isConnected) return;
						text.style.whiteSpace = "normal";
						text.innerHTML = html;
					})
					.catch(() => {
						text.textContent = `Unable to render this annotation.\n${record.text}`;
					});
			}
			const footer = document.createElement("footer");
			footer.setAttribute("data-annotation-footer", "");
			const actions = document.createElement("tp-cluster");
			actions.setAttribute("justify", "end");
			actions.setAttribute("align", "center");
			actions.setAttribute("gap", "var(--tp-toolbar-section-gap, 0.25rem)");
			actions.append(
				this.iconAction("pencil", "Edit", () => this.edit(record)),
				this.iconAction("delete-outline", "Delete", () =>
					this.remove(record.id),
				),
			);
			footer.append(actions);
			note.append(text, footer);
			this.host.append(note);
			note.attachTo(target, record.x, record.y, true);
			note.addEventListener("tp-post-it-move", () => {
				const anchor = note.attachment;
				if (
					!anchor ||
					anchor.element === this.root ||
					!this.root.contains(anchor.element) ||
					anchor.element.closest("[data-personal-annotation]")
				) {
					note.attachTo(target, record.x, record.y);
					return;
				}
				Object.assign(record, annotationTarget(this.root, anchor.element), {
					x: anchor.x,
					y: anchor.y,
				});
				this.persist();
			});
			this.notes.set(record.id, note);
		});
		if (!this.panel.hidden) this.renderList();
	}
	/** Persists only explicit edits; failures remain visible and notes stay usable in memory. */
	private persist(): void {
		try {
			this.host.ownerDocument.defaultView?.localStorage.setItem(
				this.key,
				JSON.stringify(this.records),
			);
			this.status.textContent = "Annotations saved in this browser.";
		} catch {
			this.showPanel(true);
			this.status.textContent =
				"Unable to save annotations. Changes are only kept in memory; browser storage may be full or disabled.";
		}
		this.renderList();
	}
	/** Displays stored text as text, with recovery actions for missing targets. */
	private renderList(): void {
		this.list.hidden = this.draft !== null;
		this.list.replaceChildren();
		this.records.forEach((record) => {
			const row = document.createElement("div");
			const title = document.createElement("p");
			title.textContent = `${record.text}${resolveAnnotationTarget(this.root, record) ? "" : " — Target unavailable. Reattach this annotation."}`;
			const buttons = document.createElement("tp-button-group");
			buttons.append(
				this.action("Edit", () => this.edit(record)),
				this.action("Reattach", () => this.select(record.id)),
				this.action("Delete", () => this.remove(record.id)),
			);
			row.append(title, buttons);
			this.list.append(row);
		});
	}
	/** Selects the default for new notes and the language of an active unsaved draft. */
	public setMarkup(markup: AnnotationMarkup): void {
		this.defaultLanguage = annotationMarkups[markup];
		this.language = this.defaultLanguage;
		this.syncLanguageMenu();
	}
	/** Opens a copy so Cancel never changes a saved record. */
	private edit(record: PersonalAnnotation): void {
		this.draft = { ...record };
		this.status.textContent = "";
		this.list.hidden = true;
		this.field.value = record.text;
		this.language =
			record.language && annotationLanguages.includes(record.language)
				? record.language
				: "txt";
		this.editAppearance(appearance(record));
		this.syncLanguageMenu();
		this.showPanel(true);
		this.setEditing(true);
		this.field.focus();
	}
	/** Populates independent controls; changing them does not mutate saved notes until Save. */
	private editAppearance(settings: ReturnType<typeof appearance>): void {
		this.headingField.value = settings.heading;
		this.colorField.preset = `tp-${settings.color}`;
		this.opacityField.value = String(settings.opacity);
		this.rotationField.value = String(settings.rotation);
	}
	/** Commits nonempty source and its language, then refreshes the associated note. */
	private saveDraft(): void {
		if (!this.draft || !this.key) return;
		const text = this.field.value.trim();
		if (!text) {
			this.status.textContent = "Enter annotation text before saving.";
			return;
		}
		const record = {
			...this.draft,
			text,
			language: this.language,
			...appearance({
				...this.draft,
				heading: this.headingField.value,
				color: this.colorField.preset.slice(3) as TpPostItColor,
				opacity: Number(this.opacityField.value),
				rotation: Number(this.rotationField.value),
			}),
		};
		this.records = this.records.filter((item) => item.id !== record.id);
		this.records.push(record);
		this.notes.get(record.id)?.remove();
		this.notes.delete(record.id);
		this.draft = null;
		this.setEditing(false);
		this.persist();
		this.restore();
	}
	/** Deletes only the chosen personal annotation. */
	private remove(id: string): void {
		this.records = this.records.filter((record) => record.id !== id);
		this.notes.get(id)?.remove();
		this.notes.delete(id);
		this.persist();
	}
	/** Enables one explicit target selection; no author links are followed during selection. */
	private select(id: string): void {
		if (!this.key) {
			this.status.textContent = "Open a rendered document first.";
			return;
		}
		this.cancelSelection();
		this.selecting = id;
		this.status.textContent =
			"Select an element in the document. Escape cancels.";
		this.showPanel(true);
		this.root.setAttribute("data-annotation-selecting", "");
		this.root
			.querySelectorAll<HTMLElement>(
				"p, li, h1, h2, h3, h4, h5, h6, figure, img, blockquote, pre",
			)
			.forEach((element) => {
				this.focusTargets.set(element, element.getAttribute("tabindex"));
				element.tabIndex = 0;
			});
		this.focusTargets.set(this.root, this.root.getAttribute("tabindex"));
		this.root.tabIndex = 0;
		this.root.focus();
	}
	/** Clears temporary selection mode. */
	private cancelSelection(): void {
		this.selecting = null;
		this.root.removeAttribute("data-annotation-selecting");
		this.focusTargets.forEach((value, element) => {
			if (value === null) element.removeAttribute("tabindex");
			else element.setAttribute("tabindex", value);
		});
		this.focusTargets.clear();
	}
	/** Intercepts clicks only while the user is deliberately choosing a target. */
	private readonly pick = (event: MouseEvent): void => {
		if (!this.selecting || !(event.target instanceof Element)) return;
		event.preventDefault();
		event.stopImmediatePropagation();
		this.choose(event.target, event.clientX, event.clientY);
	};
	/** Supports keyboard-only creation and a predictable Escape exit. */
	private readonly keyboard = (event: KeyboardEvent): void => {
		if (!this.selecting) return;
		if (event.key === "Escape") {
			event.preventDefault();
			this.cancelSelection();
			this.status.textContent = "Selection cancelled.";
			this.showPanel(true);
			this.button.querySelector("button")?.focus();
		} else if (
			event.key === "Enter" &&
			event.target instanceof Element &&
			this.root.contains(event.target)
		) {
			event.preventDefault();
			event.stopImmediatePropagation();
			const target =
				event.target === this.root ? this.root.firstElementChild : event.target;
			if (target) {
				const rect = target.getBoundingClientRect();
				this.choose(target, rect.left + 20, rect.top + 20);
			}
		}
	};
	/** Converts a target selection to either a new draft or a repaired attachment. */
	private choose(element: Element, x: number, y: number): void {
		if (
			element === this.root ||
			element.closest("[data-personal-annotation], script, style, tp-toolbar")
		)
			return;
		const id = this.selecting;
		this.cancelSelection();
		const rect = element.getBoundingClientRect();
		const target = {
			...annotationTarget(this.root, element),
			x: x - rect.left,
			y: y - rect.top,
		};
		const existing = this.records.find((record) => record.id === id);
		if (existing) {
			Object.assign(existing, target);
			this.notes.get(existing.id)?.remove();
			this.notes.delete(existing.id);
			this.persist();
			this.restore();
			this.showPanel(true);
		} else
			this.edit({
				id: crypto.randomUUID(),
				language: this.defaultLanguage,
				text: "",
				heading: "",
				color: "yellow",
				opacity: 1,
				rotation: 0,
				...target,
			});
	}
	/** Releases observers, document listeners, and every floating note. */
	public dispose(): void {
		this.observer.disconnect();
		this.layoutObserver?.disconnect();
		this.host.ownerDocument.defaultView?.removeEventListener(
			"resize",
			this.positionPanel,
		);
		this.cancelSelection();
		this.root.removeEventListener("click", this.pick, true);
		this.host.ownerDocument.removeEventListener("keydown", this.keyboard, true);
		this.notes.forEach((note) => {
			note.remove();
		});
		this.notes.clear();
		this.panel.remove();
		this.button.remove();
	}
}
