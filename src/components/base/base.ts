/**
 * @module components/base
 * @summary Shared base class for tp-* components.
 */

// tp-docgen:dependencies:start

// tp-docgen:dependencies:end

import { dedent } from "../../utilities/code.js";
import { ensureCodeBlockCopyButtons } from "../../utilities/code-block-copy.js";
import type { TpComponentUserHelp } from "../../utilities/component-user-help.js";
import baseStyle from "./base.css?inline";
import resetStyle from "./tp-reset.css?inline";
import tokenStyle from "./tp-tokens.css?inline";

const PRESERVE_DOCUMENT_STYLES_ATTRIBUTE = "data-tp-preserve-document-styles";

function preservesDocumentStyles(targetDocument: Document): boolean {
	return targetDocument.documentElement.hasAttribute(
		PRESERVE_DOCUMENT_STYLES_ATTRIBUTE,
	);
}

interface TpComponentApiManifest {
	userHelp?: TpComponentUserHelp;
	tagname: string;
	classname: string;
	superclass: string;
	description: string;
	examples: Array<{
		label: string;
		code: string;
	}>;
	attributes: Array<{
		name: string;
		description: string;
		reflected: boolean;
		static: boolean;
		inherited: boolean;
		type: string;
		default: string;
	}>;
	methods: Array<{
		name: string;
		inherited: boolean;
		description: string;
	}>;
	events: Array<{
		name: string;
		description: string;
		detail: string;
	}>;
	cssproperties: Array<{
		name: string;
		default: string;
		description: string;
	}>;
}

type TpHelpDrawerElement = HTMLElement & {
	setContent?: (content: string | Node | readonly Node[]) => void;
	show?: () => void;
};

/**
 * Base class for `tp-*` components.
 *
 * This class factors out a few recurring behaviors:
 * - injecting a global stylesheet once
 * - automatic marking of the host with `data-tp-base-host`
 * - simplified read/write handling for boolean attributes
 * - batch attribute removal
 * - typed element lookup in the DOM subtree
 *
 * The `<tp-base>` component can also be used directly
 * as a neutral demo or test element.
 *
 * @summary Shared base for `tp-*` components.
 * @tagname tp-base
 * @attr {string} dir = "" - Text direction (`ltr`, `rtl`, or `auto`).
 * @attr {string} lang = "" - Language tag used by the component content.
 * @attr {string} data-tp-help-src = "" - URL of the component API manifest used by the help system.
 * @attr {string} data-tp-markdown-source = "" - Source document URL used to resolve relative resources in generated help.
 * @example
 * <tp-base>This element provides the common tp-components foundation.</tp-base>
 */
export class TpBase extends HTMLElement {
	/**
	 * Unique identifier of the globally injected stylesheet.
	 *
	 * @summary Identifier of the base global stylesheet.
	 * @internal
	 */
	private static readonly baseStyleId = "tp-base-styles";
	private static readonly resetStyleId = "tp-reset-styles";
	private static readonly tokenStyleId = "tp-token-styles";
	private static readonly sourceAttribute = "data-source";
	private static globalHelpKeydownAttached = false;
	private static currentHelpElement: TpBase | null = null;
	/** Pointer target is independent of focus, including non-focusable layout components. */
	private static hoveredHelpElement: TpBase | null = null;
	private initialHelpMarkup: string | null = null;
	private baseHelpListenerAttached = false;
	private readonly handleBaseHelpFocusIn = (): void => {
		TpBase.currentHelpElement = this;
	};
	private readonly handleBaseHelpKeydown = (event: KeyboardEvent): void => {
		TpBase.openHelpFromKeyboard(event, this);
	};

	/**
	 * Attributes observed by `tp-base` itself.
	 *
	 * Subclasses that define their own `observedAttributes` should include
	 * these via spread when they also want to react to `dir` and `lang`:
	 * ```ts
	 * static get observedAttributes() {
	 *   return [...TpBase.observedAttributes, 'my-attr'];
	 * }
	 * ```
	 *
	 * @summary Liste des attributs observés par la classe de base.
	 */
	public static get observedAttributes(): string[] {
		return ["dir", "lang"];
	}

	/**
	 * Lifecycle callback called when the component is connected to the document.
	 *
	 * Cette implémentation :
	 * - injects the base styles once
	 * - automatically marks the host with `data-tp-base-host`
	 *
	 * Subclasses must call `super.connectedCallback()`.
	 *
	 * @summary Initializes the shared component foundation.
	 * @internal
	 */
	protected connectedCallback(): void {
		this.captureInitialHelpMarkup();
		this.ensureBaseStyles();
		this.setAttribute("data-tp-base-host", "");
		TpBase.ensureGlobalHelpKeydown();
		if (!this.baseHelpListenerAttached) {
			this.addEventListener("keydown", this.handleBaseHelpKeydown);
			this.addEventListener("focusin", this.handleBaseHelpFocusIn);
			this.baseHelpListenerAttached = true;
		}
	}

	private static ensureGlobalHelpKeydown(): void {
		if (TpBase.globalHelpKeydownAttached || typeof document === "undefined") {
			return;
		}

		document.addEventListener("keydown", (event) => {
			const currentHelpElement =
				TpBase.currentHelpElement?.isConnected === true
					? TpBase.currentHelpElement
					: null;
			const target =
				(TpBase.hoveredHelpElement?.isConnected
					? TpBase.hoveredHelpElement
					: null) ??
				TpBase.findHelpElement(event.target, event) ??
				currentHelpElement;
			if (target === null) {
				return;
			}

			TpBase.openHelpFromKeyboard(event, target);
		});
		document.addEventListener("pointerover", (event) => {
			TpBase.hoveredHelpElement = TpBase.findHelpElement(event.target, event);
		});
		document.addEventListener("mouseover", (event) => {
			TpBase.hoveredHelpElement = TpBase.findHelpElement(event.target, event);
		});
		document.addEventListener("pointerout", (event) => {
			TpBase.hoveredHelpElement = TpBase.findHelpElement(event.relatedTarget);
		});
		document.addEventListener("mouseout", (event) => {
			TpBase.hoveredHelpElement = TpBase.findHelpElement(event.relatedTarget);
		});
		window.addEventListener("blur", () => {
			TpBase.hoveredHelpElement = null;
		});
		TpBase.globalHelpKeydownAttached = true;
	}

	private static findHelpElement(
		target: EventTarget | null,
		event?: Event,
	): TpBase | null {
		for (const node of event?.composedPath() ?? []) {
			if (node instanceof TpBase) {
				return node;
			}

			if (node instanceof Element) {
				const host = node.closest("[data-tp-base-host]");
				if (host instanceof TpBase) {
					return host;
				}
			}
		}

		if (!(target instanceof Node)) {
			return null;
		}

		const element = target instanceof Element ? target : target.parentElement;
		const host = element?.closest("[data-tp-base-host]");
		return host instanceof TpBase ? host : null;
	}

	private static openHelpFromKeyboard(
		event: KeyboardEvent,
		target: TpBase,
	): void {
		if (event.defaultPrevented) {
			return;
		}

		const isQuestionMark =
			event.key === "?" ||
			(event.shiftKey && (event.code === "Slash" || event.code === "Comma"));
		if (!isQuestionMark || event.altKey || !event.ctrlKey || event.metaKey) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		const selected = TpBase.hoveredHelpElement?.isConnected
			? TpBase.hoveredHelpElement
			: target;
		TpBase.currentHelpElement = selected;
		void selected.help();
	}

	/**
	 * Opens generated component help in a drawer.
	 *
	 * The method loads the component JSON generated beside its source file by
	 * the Vite component API plugin. A custom URL can be provided with
	 * `data-tp-help-src`.
	 *
	 * @summary Opens generated component help.
	 */
	public async help(): Promise<void> {
		const api = await this.loadComponentApi();
		if (api === null) {
			return;
		}

		await import("../drawer/drawer.js");
		await import("../markdown/markdown.js");

		const drawer = this.getOrCreateHelpDrawer();
		drawer.setAttribute("label", "User help");
		drawer.setAttribute("placement", "end");
		drawer.setAttribute("width", "75%");
		drawer.setAttribute("outside-click", "");
		drawer.setAttribute("backdrop", "");

		const content = this.renderHelpContent(api);
		if (typeof drawer.setContent === "function") {
			drawer.setContent(content);
		} else {
			drawer.replaceChildren(content);
		}

		drawer.show?.();
	}

	/**
	 * Lifecycle callback invoked when an observed attribute changes.
	 *
	 * This base implementation is intentionally empty. Subclasses should
	 * override it — without calling `super` — to react to their own
	 * attribute changes.
	 *
	 * @summary Réagit aux changements d'attributs observés.
	 * @param _name   Nom de l'attribut modifié.
	 * @param _oldValue Ancienne valeur (`null` si l'attribut était absent).
	 * @param _newValue Nouvelle valeur (`null` si l'attribut a été supprimé).
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected attributeChangedCallback(
		_name: string,
		_oldValue: string | null,
		_newValue: string | null,
	): void {
		// No-op base implementation; override in subclasses.
	}

	/**
	 * Injects the global base styles if needed.
	 *
	 * @summary Injects the base stylesheet.
	 * @internal
	 */
	protected ensureBaseStyles(targetDocument: Document = document): void {
		ensureCodeBlockCopyButtons(targetDocument);
		this.ensureGlobalStyle(TpBase.tokenStyleId, tokenStyle, targetDocument);
		if (preservesDocumentStyles(targetDocument)) {
			return;
		}
		this.ensureGlobalStyle(TpBase.resetStyleId, resetStyle, targetDocument);
		this.ensureGlobalStyle(TpBase.baseStyleId, baseStyle, targetDocument);
	}

	/**
	 * Injects a global stylesheet into `document.head`
	 * if it does not already exist.
	 *
	 * @summary Injects a global stylesheet once.
	 * @param styleId Identifiant unique de la balise `<style>`.
	 * @param cssText Contenu CSS à injecter.
	 * @internal
	 */
	protected ensureGlobalStyle(
		styleId: string,
		cssText: string,
		targetDocument: Document = document,
	): void {
		if (targetDocument.getElementById(styleId)) {
			return;
		}

		const styleEl = targetDocument.createElement("style");
		styleEl.id = styleId;
		styleEl.textContent = cssText;
		targetDocument.head.append(styleEl);
	}

	/**
	 * Returns the boolean value of an HTML attribute.
	 *
	 * Rule used:
	 * - attribute present → `true`
	 * - attribute absent → `false`
	 *
	 * @summary Reads a boolean attribute.
	 * @param name Attribute name.
	 * @returns Boolean value of the attribute.
	 * @internal
	 */
	protected getBooleanAttribute(name: string): boolean {
		return this.hasAttribute(name);
	}

	/**
	 * Sets the boolean value of an HTML attribute.
	 *
	 * Rule used:
	 * - `true` → attribute present with an empty value
	 * - `false` → attribute removed
	 *
	 * @summary Writes a boolean attribute.
	 * @param name Attribute name.
	 * @param value Value to apply.
	 * @internal
	 */
	protected setBooleanAttribute(name: string, value: boolean): void {
		if (value) {
			this.setAttribute(name, "");
			return;
		}

		this.removeAttribute(name);
	}

	/**
	 * Returns the value of a text attribute with a default fallback.
	 *
	 * @summary Reads a text attribute.
	 * @param name Attribute name.
	 * @param fallback Fallback value if the attribute is absent.
	 * @returns Attribute value or fallback value.
	 * @internal
	 */
	protected getStringAttribute(name: string, fallback = ""): string {
		return this.getAttribute(name) ?? fallback;
	}

	/**
	 * Sets or removes a text attribute.
	 *
	 * An empty string removes the attribute.
	 *
	 * @summary Writes a text attribute.
	 * @param name Attribute name.
	 * @param value Value to apply.
	 * @internal
	 */
	protected setStringAttribute(name: string, value: string): void {
		if (value === "") {
			this.removeAttribute(name);
			return;
		}

		this.setAttribute(name, value);
	}

	/**
	 * Removes multiple attributes in a single operation.
	 *
	 * @summary Removes multiple attributes from the component.
	 * @param names Names of the attributes to remove.
	 * @internal
	 */
	protected removeAttributes(...names: string[]): void {
		for (const name of names) {
			this.removeAttribute(name);
		}
	}

	/**
	 * Returns the first element matching the selector.
	 *
	 * @summary Finds a typed element in a DOM subtree.
	 * @param selectors CSS selector.
	 * @param root Search root. Defaults to the component itself.
	 * @returns Found element or `null`.
	 * @internal
	 */
	protected queryElement<T extends Element>(
		selectors: string,
		root: ParentNode = this,
	): T | null {
		const element = root.querySelector(selectors);
		return element instanceof Element ? (element as T) : null;
	}

	/**
	 * Skips over container elements when searching upward with a selector.
	 *
	 * Like `closest()`, but does not traverse through container elements
	 * (toolbar, menu, dropdown, button-group, contextmenu).
	 *
	 * @summary Finds a matching ancestor, skipping containers.
	 * @param selectors CSS selector to match.
	 * @returns Matching ancestor, or `null`.
	 * @internal
	 */
	protected getClosestSkippingContainers(
		selectors: string,
	): HTMLElement | null {
		const containerTags = new Set([
			"TP-TOOLBAR",
			"TP-MENU",
			"TP-DROPDOWN",
			"TP-BUTTON-GROUP",
			"TP-CONTEXTMENU",
		]);
		let current: HTMLElement | null = this;

		while (current instanceof HTMLElement) {
			// Skip containers entirely — don't check them or traverse through them
			if (!containerTags.has(current.tagName) && current.matches(selectors)) {
				return current;
			}

			const parentElement: HTMLElement | null = current.parentElement;
			if (!(parentElement instanceof HTMLElement)) {
				break;
			}

			// If parent is a container, skip it and continue with its parent
			if (containerTags.has(parentElement.tagName)) {
				current = parentElement.parentElement;
			} else {
				current = parentElement;
			}
		}

		return null;
	}

	private async loadComponentApi(): Promise<TpComponentApiManifest | null> {
		const sources = this.getComponentApiSources();

		for (const source of sources) {
			try {
				const response = await fetch(source);
				if (!response.ok) {
					continue;
				}

				return (await response.json()) as TpComponentApiManifest;
			} catch {
				// Try the next candidate.
			}
		}

		return null;
	}

	private getComponentApiSources(): string[] {
		const componentName = this.tagName.toLowerCase().replace(/^tp-/, "");
		const explicitSource = this.getAttribute("data-tp-help-src");
		if (explicitSource !== null && explicitSource !== "") {
			return this.getExplicitComponentApiSources(explicitSource, componentName);
		}

		const rootSources = this.getComponentApiRootSources(componentName);

		return [
			...rootSources,
			`/src/components/${componentName}/${componentName}.json`,
			`/components/${componentName}/${componentName}.json`,
		];
	}

	private getExplicitComponentApiSources(
		source: string,
		componentName: string,
	): string[] {
		if (this.isAbsoluteApiSource(source)) {
			return [source];
		}

		const roots = this.getComponentApiRoots();
		const candidates = new Set<string>();

		for (const root of roots) {
			try {
				const sourcePath = source.includes("/")
					? source
					: `${componentName}/${source}`;
				candidates.add(new URL(sourcePath, root).href);
			} catch {
				// Try the next root.
			}
		}

		return [...candidates];
	}

	private isAbsoluteApiSource(source: string): boolean {
		if (source.startsWith("/")) {
			return true;
		}

		try {
			const url = new URL(source);
			return (
				url.protocol === "http:" ||
				url.protocol === "https:" ||
				url.protocol === "file:"
			);
		} catch {
			return false;
		}
	}

	private getComponentApiRootSources(componentName: string): string[] {
		return this.getComponentApiRoots().map(
			(root) => `${root}${componentName}/${componentName}.json`,
		);
	}

	private getComponentApiRoots(): string[] {
		const roots = new Set<string>();
		const moduleUrl = new URL(import.meta.url);

		this.addDocumentComponentApiRoots(roots, document);
		this.addParentDocumentComponentApiRoots(roots);

		if (moduleUrl.pathname.includes("/src/components/base/")) {
			roots.add(new URL("../", moduleUrl).href);
		}

		if (moduleUrl.pathname.includes("/dist/chunks/")) {
			roots.add(new URL("../components/", moduleUrl).href);
		}

		if (moduleUrl.pathname.includes("/dist/components/base/")) {
			roots.add(new URL("../", moduleUrl).href);
		}

		return [...roots];
	}

	private addParentDocumentComponentApiRoots(roots: Set<string>): void {
		if (typeof window === "undefined" || window.parent === window) {
			return;
		}

		try {
			let currentWindow = window.parent;
			while (currentWindow !== window) {
				this.addDocumentComponentApiRoots(roots, currentWindow.document);

				if (currentWindow.parent === currentWindow) {
					break;
				}

				currentWindow = currentWindow.parent;
			}
		} catch {
			// Ignore cross-origin parent windows.
		}
	}

	private addDocumentComponentApiRoots(
		roots: Set<string>,
		targetDocument: Document,
	): void {
		for (const script of targetDocument.querySelectorAll<HTMLScriptElement>(
			"script[src]",
		)) {
			const source = script.getAttribute("src");
			if (source === null || !source.includes("tp-loader")) {
				continue;
			}

			try {
				const loaderUrl = new URL(source, targetDocument.baseURI);
				roots.add(new URL("./components/", loaderUrl).href);
			} catch {
				// Ignore loader scripts that cannot be resolved in this document.
			}
		}

		const documentDirectory = this.getDocumentDirectoryUrl(targetDocument);
		if (documentDirectory === null) {
			return;
		}

		const isPublicDocument = documentDirectory.pathname.includes("/public/");
		const isDistDocument = documentDirectory.pathname.includes("/dist/");

		if (isPublicDocument) {
			roots.add(new URL("../dist/components/", documentDirectory).href);
			return;
		}

		roots.add(new URL("components/", documentDirectory).href);
		roots.add(new URL("../dist/components/", documentDirectory).href);
		roots.add(new URL("../components/", documentDirectory).href);

		if (!isDistDocument) {
			roots.add(new URL("dist/components/", documentDirectory).href);
		}
	}

	private getDocumentDirectoryUrl(targetDocument: Document): URL | null {
		for (const candidate of this.getDocumentBaseCandidates(targetDocument)) {
			try {
				const url = new URL(candidate);
				return new URL(".", url);
			} catch {
				// Try the next candidate.
			}
		}

		return null;
	}

	private getDocumentBaseCandidates(targetDocument: Document): string[] {
		const candidates: Array<string | null | undefined> = [
			targetDocument.baseURI,
			targetDocument.location.href,
		];

		try {
			if (targetDocument.defaultView?.parent !== targetDocument.defaultView) {
				const parentDocument = targetDocument.defaultView?.parent.document;
				candidates.push(parentDocument?.baseURI, parentDocument?.location.href);
			}
		} catch {
			// Ignore cross-origin parent documents.
		}

		return candidates.filter((candidate): candidate is string =>
			this.isUsableDocumentUrl(candidate),
		);
	}

	private isUsableDocumentUrl(
		value: string | null | undefined,
	): value is string {
		if (value === undefined || value === null || value === "") {
			return false;
		}

		try {
			const url = new URL(value);
			return (
				url.protocol === "http:" ||
				url.protocol === "https:" ||
				url.protocol === "file:"
			);
		} catch {
			return false;
		}
	}

	private getOrCreateHelpDrawer(): TpHelpDrawerElement {
		const parent =
			document.fullscreenElement instanceof HTMLElement
				? document.fullscreenElement
				: document.body;
		const existing = document.getElementById("tp-component-help-drawer");
		if (existing instanceof HTMLElement) {
			if (existing.parentElement !== parent) {
				parent.append(existing);
			}
			return existing as TpHelpDrawerElement;
		}

		const drawer = document.createElement("tp-drawer") as TpHelpDrawerElement;
		drawer.id = "tp-component-help-drawer";
		parent.append(drawer);
		return drawer;
	}

	/** Builds reader help without author controls, source code or class metadata. */
	private renderHelpContent(api: TpComponentApiManifest): HTMLElement {
		const content = document.createElement("section");
		content.className = "tp-component-help";
		const componentTitle = document.createElement("h2");
		componentTitle.textContent =
			api.userHelp?.displayName?.trim() ||
			api.tagname
				.replace(/^tp-/, "")
				.replaceAll("-", " ")
				.replace(/^./, (letter) => letter.toUpperCase());
		content.append(componentTitle);
		const current = document.createElement("section");
		current.className = "tp-component-help-current";
		const title = document.createElement("h3");
		title.textContent = "Current element";
		const preview = document.createElement("div");
		preview.className = "tp-component-help-preview";
		const template = document.createElement("template");
		template.innerHTML = this.getStoredHelpMarkup();
		const clone = template.content.firstElementChild;
		if (clone instanceof HTMLElement) {
			// Use author content, but preserve current public attribute values.
			[...clone.attributes].forEach((attribute) => {
				if (!this.hasAttribute(attribute.name))
					clone.removeAttribute(attribute.name);
			});
			[...this.attributes]
				.filter((attribute) => !this.isInternalSourceAttribute(attribute))
				.forEach((attribute) => {
					clone.setAttribute(attribute.name, attribute.value);
				});
			clone.removeAttribute("autoplay");
			const base = this.getCurrentDocumentBaseHref() ?? document.baseURI;
			[clone, ...clone.querySelectorAll("*")].forEach((element) => {
				[
					"src",
					"href",
					"poster",
					"repository",
					"data-tp-markdown-source",
				].forEach((name) => {
					const value = element.getAttribute(name);
					if (value && !value.startsWith("#")) {
						try {
							element.setAttribute(name, new URL(value, base).href);
						} catch {
							/* Keep non-URL values. */
						}
					}
				});
			});
			// Do not run author scripts again merely because help was opened.
			clone.querySelectorAll("script").forEach((script) => {
				if (
					!script.type.startsWith("tp/") &&
					script.type !== "application/json"
				)
					script.remove();
			});
			const ids = new Map<string, string>();
			[clone, ...clone.querySelectorAll("[id]")].forEach((element) => {
				if (element.id) {
					const id = `tp-help-${crypto.randomUUID()}`;
					ids.set(element.id, id);
					element.id = id;
				}
			});
			[clone, ...clone.querySelectorAll("*")].forEach((element) => {
				[
					"for",
					"aria-labelledby",
					"aria-describedby",
					"aria-controls",
					"aria-owns",
					"list",
				].forEach((name) => {
					const value = element.getAttribute(name);
					if (value)
						element.setAttribute(
							name,
							value
								.split(/\s+/)
								.map((id) => ids.get(id) ?? id)
								.join(" "),
						);
				});
				const href = element.getAttribute("href");
				if (href?.startsWith("#") && ids.has(href.slice(1)))
					element.setAttribute("href", `#${ids.get(href.slice(1))}`);
			});
			const language = this.closest("[lang]")?.getAttribute("lang");
			if (language) clone.setAttribute("lang", language);
			preview.append(clone);
		}
		current.append(title);
		if (api.userHelp?.introduction) {
			const introduction = document.createElement("tp-markdown");
			introduction.className = "tp-component-help-introduction";
			const source = document.createElement("script");
			source.type = "tp/markdown";
			source.textContent = api.userHelp.introduction;
			introduction.append(source);
			current.append(introduction);
		}
		current.append(preview);
		const interactions = document.createElement("section");
		const interactionTitle = document.createElement("h3");
		interactionTitle.textContent = "User interactions";
		const instructions = document.createElement("tp-markdown");
		const source = document.createElement("script");
		source.type = "tp/markdown";
		source.textContent =
			api.userHelp?.interactions ||
			"No user interaction instructions are available for this component.";
		instructions.append(source);
		interactions.append(interactionTitle, instructions);
		if (
			api.userHelp?.keyboard.length &&
			!/^#### Keyboard interactions\s*$/m.test(api.userHelp.interactions)
		) {
			const keys = document.createElement("dl");
			api.userHelp.keyboard.forEach((item) => {
				const term = document.createElement("dt");
				const key = document.createElement("kbd");
				key.textContent = item.key;
				term.append(key);
				const description = document.createElement("dd");
				description.textContent = item.description;
				keys.append(term, description);
			});
			interactions.append(keys);
		}
		content.append(current, interactions);
		return content;
	}

	private getCurrentDocumentBaseHref(): string | null {
		const sourceHost = this.closest("[data-tp-markdown-source]");
		const source = sourceHost?.getAttribute("data-tp-markdown-source")?.trim();

		if (source === undefined || source === "") {
			return null;
		}

		for (const base of this.getDocumentBaseCandidates(document)) {
			try {
				return new URL(".", new URL(source, base)).href;
			} catch {
				// Try the next candidate.
			}
		}

		return null;
	}

	private captureInitialHelpMarkup(): void {
		this.captureHelpSource();
	}

	protected captureHelpSource(): void {
		if (this.initialHelpMarkup !== null) {
			return;
		}

		const source = this.getAttribute(TpBase.sourceAttribute);
		this.initialHelpMarkup =
			source !== null && source !== ""
				? this.stripInternalGeneratedMarkup(source)
				: this.serializeUserFacingElement();

		if (source === null || source === "") {
			this.setAttribute(TpBase.sourceAttribute, this.initialHelpMarkup);
		}
	}

	private getStoredHelpMarkup(): string {
		const source = this.getAttribute(TpBase.sourceAttribute);
		if (source !== null && source !== "") {
			return this.stripInternalGeneratedMarkup(source);
		}

		return this.initialHelpMarkup ?? this.serializeUserFacingElement();
	}

	private stripInternalGeneratedMarkup(markup: string): string {
		const template = document.createElement("template");
		template.innerHTML = markup;
		return this.normalizeHelpMarkupWhitespace(
			this.serializeStoredSourceChildNodes(template.content),
		);
	}

	private serializeUserFacingElement(): string {
		const tagName = this.tagName.toLowerCase();
		const attributes = Array.from(this.attributes)
			.filter((attribute) => !this.isInternalSourceAttribute(attribute))
			.flatMap((attribute) => {
				const value = this.getUserFacingAttributeValue(attribute);
				if (value === null) {
					return [];
				}
				if (attribute.value === "") {
					return [attribute.name];
				}
				return [`${attribute.name}="${escapeHtml(value)}"`];
			});
		const openTag = [tagName, ...attributes].join(" ");
		const content = this.normalizeHelpMarkupWhitespace(
			dedent(this.serializeUserFacingChildNodes(this)),
		);
		const hasUserContent =
			content.trim() !== "" && this.getAttribute("src") === null;

		if (!hasUserContent) {
			return `<${openTag}></${tagName}>`;
		}

		return `<${openTag}>${content}</${tagName}>`;
	}

	private serializeUserFacingChildNodes(parent: ParentNode): string {
		return Array.from(parent.childNodes)
			.map((node) => this.serializeUserFacingNode(node))
			.join("");
	}

	private serializeStoredSourceChildNodes(parent: ParentNode): string {
		return Array.from(parent.childNodes)
			.map((node) => this.serializeStoredSourceNode(node))
			.join("");
	}

	private serializeStoredSourceNode(node: ChildNode): string {
		if (node.nodeType === Node.TEXT_NODE) {
			return escapeHtml(node.textContent ?? "");
		}

		if (!(node instanceof Element) || this.isInternalGeneratedElement(node)) {
			return "";
		}

		const tagName = node.tagName.toLowerCase();
		const attributes = Array.from(node.attributes)
			.filter((attribute) => !this.isInternalSourceAttribute(attribute))
			.map((attribute) =>
				attribute.value === ""
					? attribute.name
					: `${attribute.name}="${escapeHtml(attribute.value)}"`,
			);
		const openTag = [tagName, ...attributes].join(" ");

		if (this.isContentlessGeneratedComponent(tagName)) {
			return `<${openTag}></${tagName}>`;
		}

		if (tagName === "script" || tagName === "style") {
			return `<${openTag}>${node.textContent ?? ""}</${tagName}>`;
		}

		return `<${openTag}>${this.serializeStoredSourceChildNodes(node)}</${tagName}>`;
	}

	private serializeUserFacingNode(node: ChildNode): string {
		if (node.nodeType === Node.TEXT_NODE) {
			return escapeHtml(node.textContent ?? "");
		}

		if (!(node instanceof Element)) {
			return "";
		}

		if (!(node instanceof TpBase) && this.isInternalGeneratedElement(node)) {
			return "";
		}

		if (node instanceof Element) {
			const source = node.getAttribute(TpBase.sourceAttribute);
			if (source !== null && source !== "") {
				return this.stripInternalGeneratedMarkup(source);
			}
		}

		if (node instanceof TpBase) {
			return node.getStoredHelpMarkup();
		}

		const tagName = node.tagName.toLowerCase();
		const attributes = Array.from(node.attributes)
			.filter((attribute) => !this.isInternalSourceAttribute(attribute))
			.map((attribute) =>
				attribute.value === ""
					? attribute.name
					: `${attribute.name}="${escapeHtml(attribute.value)}"`,
			);
		const openTag = [tagName, ...attributes].join(" ");

		if (this.isContentlessGeneratedComponent(tagName)) {
			return `<${openTag}></${tagName}>`;
		}

		if (tagName === "script" || tagName === "style") {
			return `<${openTag}>${node.textContent ?? ""}</${tagName}>`;
		}

		return `<${openTag}>${this.serializeUserFacingChildNodes(node)}</${tagName}>`;
	}

	private isContentlessGeneratedComponent(tagName: string): boolean {
		return tagName === "tp-icon-button";
	}

	private normalizeHelpMarkupWhitespace(markup: string): string {
		const preservedBlocks: string[] = [];
		const protectedMarkup = markup.replace(
			/<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi,
			(block) => {
				const index = preservedBlocks.push(block) - 1;
				return `TP_PRESERVED_BLOCK_${String(index)}`;
			},
		);

		const normalized = protectedMarkup
			.replace(/[ \t]+\n/g, "\n")
			.replace(/\n\s*\n/g, "\n")
			.trim();

		return normalized.replace(
			/TP_PRESERVED_BLOCK_(\d+)/g,
			(_placeholder, index: string) => preservedBlocks[Number(index)] ?? "",
		);
	}

	private isInternalSourceAttribute(attribute: Attr): boolean {
		const name = attribute.name;

		return (
			this.isGeneratedDropdownSourceAttribute(attribute) ||
			name === "data-tp-base-host" ||
			name === TpBase.sourceAttribute ||
			(name.startsWith("data-") && !this.isUserFacingDataAttribute(name))
		);
	}

	private isGeneratedDropdownSourceAttribute(attribute: Attr): boolean {
		if (this.tagName.toLowerCase() !== "tp-dropdown") {
			return false;
		}

		const element = attribute.ownerElement;
		if (element === null) {
			return false;
		}

		const tagName = element.tagName.toLowerCase();
		const name = attribute.name;
		const value = attribute.value;

		if (tagName === "ul") {
			return name === "role" && value === "menu";
		}

		if (tagName !== "li") {
			return false;
		}

		return (
			(name === "role" && value === "menuitem") ||
			name === "tabindex" ||
			name === "aria-haspopup" ||
			name === "aria-expanded"
		);
	}

	private isInternalGeneratedElement(element: Element): boolean {
		return Array.from(element.attributes).some(
			(attribute) =>
				attribute.name.startsWith("data-tp-") &&
				!this.isUserFacingDataAttribute(attribute.name),
		);
	}

	private isUserFacingDataAttribute(name: string): boolean {
		return name === "data-tp-help-src" || name === "data-tp-markdown-source";
	}

	private getUserFacingAttributeValue(attribute: Attr): string | null {
		if (attribute.name !== "class") {
			return attribute.value;
		}

		const generatedClass = this.tagName.toLowerCase();
		const classNames = attribute.value
			.split(/\s+/)
			.filter((className) => className !== "" && className !== generatedClass);

		return classNames.length === 0 ? null : classNames.join(" ");
	}
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/**
 * Injects the shared tp-* styles and a default theme class eagerly.
 *
 * This avoids initial render flashes when static markup uses theme-dependent
 * tokens before any `<tp-theme>` or `<tp-color>` interaction occurs.
 *
 * @summary Ensures global tp-* styles are ready.
 * @internal
 */
export function ensureTpBaseStyles(): void {
	if (typeof document === "undefined") {
		return;
	}

	ensureCodeBlockCopyButtons(document);
	injectGlobalStyle("tp-token-styles", tokenStyle);
	if (preservesDocumentStyles(document)) {
		return;
	}
	injectGlobalStyle("tp-reset-styles", resetStyle);
	injectGlobalStyle("tp-base-styles", baseStyle);

	if (typeof window === "undefined") {
		return;
	}

	const body = document.body;
	if (!(body instanceof HTMLElement)) {
		return;
	}

	if (
		body.classList.contains("tp-light") ||
		body.classList.contains("tp-dark")
	) {
		return;
	}

	const prefersDark =
		window.matchMedia?.("(prefers-color-scheme: dark)").matches === true;
	body.classList.add(prefersDark ? "tp-dark" : "tp-light");
}

/**
 * Injects a global stylesheet into `document.head` if needed.
 *
 * @summary Inserts a shared stylesheet once.
 * @param styleId Unique id of the style tag.
 * @param cssText CSS text to inject.
 * @internal
 */
function injectGlobalStyle(styleId: string, cssText: string): void {
	if (document.getElementById(styleId)) {
		return;
	}

	const styleEl = document.createElement("style");
	styleEl.id = styleId;
	styleEl.textContent = cssText;
	document.head.append(styleEl);
}

/**
 * Registers the `tp-base` custom element
 * if it is not already defined.
 *
 * @summary Registers the `tp-base` custom element.
 * @internal
 */
if (!customElements.get("tp-base")) {
	customElements.define("tp-base", TpBase);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-base": TpBase;
	}
}
