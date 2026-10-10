/**
 * @module components/markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-asciidoc
 * @summary Semantic AsciiDoc rendering component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-calculator
 * @summary Scientific calculator with an editable expression and degree/radian modes.
 */
/**
 * @tp-dependency tp-clock
 * @summary Live clock component with digital or analogic display and date tooltip.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Drawer overlay component.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-lang
 * @summary Documentation language selector.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-post-it-editor
 * @summary creates and edits persistent personal annotations attached to document elements.
 */
/**
 * @tp-dependency tp-restructuredtext
 * @summary reStructuredText rendering component.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
// tp-docgen:dependencies:end

import { dedent } from "../../utilities/code.js";
import { TpDrawer } from "../drawer/drawer.js";
import "../calculator/calculator.js";
import "../clock/clock.js";
import "../lang/lang.js";
import "../color/color.js";
import "../theme/theme.js";
import "../fullscreen/fullscreen.js";
import "../icon-button/icon-button.js";
import { TpPostItEditor } from "../post-it-editor/post-it-editor.js";
import "../toolbar/toolbar.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import "../markdown/markdown.js";
import "../asciidoc/asciidoc.js";
import "../restructuredtext/restructuredtext.js";
import style from "./markup-single-page.css?inline";

const STYLE_ID = "tp-markup-single-page-styles";

export type TpMarkupSinglePageLanguage =
	| "html"
	| "markdown"
	| "asciidoc"
	| "restructuredtext";

type InlineSource = {
	language: TpMarkupSinglePageLanguage;
	source: string;
};

const LANGUAGE_BY_SCRIPT_TYPE: ReadonlyMap<string, TpMarkupSinglePageLanguage> =
	new Map([
		["tp/html", "html"],
		["tp/htm", "html"],
		["tp/markdown", "markdown"],
		["tp/md", "markdown"],
		["tp/asciidoc", "asciidoc"],
		["tp/adoc", "asciidoc"],
		["tp/restructuredtext", "restructuredtext"],
		["tp/rst", "restructuredtext"],
	]);

const SCRIPT_TYPE_BY_LANGUAGE: Record<TpMarkupSinglePageLanguage, string> = {
	html: "tp/html",
	markdown: "tp/markdown",
	asciidoc: "tp/asciidoc",
	restructuredtext: "tp/restructuredtext",
};

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function getLanguageFromPath(path: string): TpMarkupSinglePageLanguage | null {
	const pathname = path.split(/[?#]/, 1)[0]?.toLowerCase() ?? "";
	if (pathname.endsWith(".html") || pathname.endsWith(".htm")) return "html";
	if (pathname.endsWith(".md") || pathname.endsWith(".markdown"))
		return "markdown";
	if (pathname.endsWith(".adoc") || pathname.endsWith(".asciidoc"))
		return "asciidoc";
	if (pathname.endsWith(".rst") || pathname.endsWith(".rest"))
		return "restructuredtext";
	return null;
}

function getRendererTagName(
	language: TpMarkupSinglePageLanguage,
): string | null {
	if (language === "markdown") return "tp-markdown";
	if (language === "asciidoc") return "tp-asciidoc";
	if (language === "restructuredtext") return "tp-restructuredtext";
	return null;
}

function getRenderedEventName(language: TpMarkupSinglePageLanguage): string {
	if (language === "markdown") return "tp-markdown-rendered";
	if (language === "asciidoc") return "tp-asciidoc-rendered";
	if (language === "restructuredtext") return "tp-restructuredtext-rendered";
	return "tp-markup-single-page-rendered";
}

/**
 * Renders one document with a parser selected from `src` or inline script type.
 *
 * @tagname tp-markup-single-page
 * @attr {string} src = "" - Source file. The extension selects the renderer.
 * @attr {string | null} toolbar = null - Optional comma-separated controls: code, calc, postit, clock, lang, color, theme, fullscreen. Empty enables all; absent hides the toolbar.
 * @attr {string} langs = "en" - Candidate document languages. The first uses the source directory; others use language subdirectories.
 * @event tp-markup-single-page-rendered Emitted after the selected renderer completes.
 * @eventdetail tp-markup-single-page-rendered { language: "html" | "markdown" | "asciidoc" | "restructuredtext"; src: string }
 * @example
 * <tp-markup-single-page>
 *   <script type="tp/markdown">
 * ## A short guide
 *
 * This document is rendered as a single page.
 *
 * ### Getting started
 *
 * - Read the introduction
 * - Try a component
 *   </script>
 * </tp-markup-single-page>
 */
export class TpMarkupSinglePage extends TpBase {
	public static get observedAttributes(): string[] {
		return ["src", "toolbar", "langs"];
	}

	private readonly outputElement = document.createElement("div");
	private renderToken = 0;
	private toolbarElement: HTMLElement | null = null;
	private calculatorDrawer: TpDrawer | null = null;
	private sourceDrawer: TpDrawer | null = null;
	private sourceToken = 0;
	private pageUrl = "";
	private languageToken = 0;
	private languageSources = new Map<string, string>();
	private currentDocumentLanguage = "";

	public get langs(): string {
		return this.getAttribute("langs") ?? "en";
	}
	public set langs(value: string) {
		this.setAttribute("langs", value);
	}
	/** Current document language, independent of its markup syntax. */
	public get documentLanguage(): string {
		return this.currentDocumentLanguage;
	}

	/** Select a translation discovered for this document. */
	public setDocumentLanguage(language: string): void {
		const src = this.languageSources.get(language);
		if (src) this.src = src;
	}
	private inlineSourceSnapshot: InlineSource | null = null;
	/** Personal annotations share the rendered document's storage scope. */
	private annotations: TpPostItEditor | null = null;

	/** Language imposed by a format-specific subclass, or automatic detection. */
	protected get fixedLanguage(): TpMarkupSinglePageLanguage | null {
		return null;
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-markup-single-page");
		this.outputElement.className = "tp-markup-single-page-output";
		this.inlineSourceSnapshot ??= this.readInlineSource();
		this.ensureGlobalStyle(STYLE_ID, style);
		this.replaceChildren(this.outputElement);
		this.renderToolbar();
		void this.renderSinglePage();
	}
	/** Removes annotation listeners and floating notes when detached. */
	public disconnectedCallback(): void {
		this.disposeToolbar();
		this.renderToken++;
	}

	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) return;
		if (name === "toolbar") this.renderToolbar();
		else if (name === "langs") void this.updateLanguages();
		else {
			void this.renderSinglePage();
			void this.updateLanguages();
		}
	}

	/** Null removes the toolbar; an empty string enables every control. */
	public get toolbar(): string | null {
		return this.getAttribute("toolbar");
	}

	public set toolbar(value: string | null) {
		if (value === null) this.removeAttribute("toolbar");
		else this.setAttribute("toolbar", value);
	}

	private disposeToolbar(): void {
		this.sourceToken++;
		this.languageToken++;
		this.annotations?.dispose();
		this.annotations = null;
		this.toolbarElement?.remove();
		this.toolbarElement = null;
		for (const drawer of [this.sourceDrawer, this.calculatorDrawer]) {
			drawer?.hide();
			drawer?.remove();
		}
		this.sourceDrawer = null;
		this.calculatorDrawer = null;
	}

	private renderToolbar(): void {
		this.disposeToolbar();
		const value = this.toolbar;
		if (value === null) return;
		const controls = [
			"code",
			"calc",
			"postit",
			"clock",
			"lang",
			"color",
			"theme",
			"fullscreen",
		];
		const selected = new Set(
			value.trim() === ""
				? controls
				: value.split(",").map((name) => name.trim().toLowerCase()),
		);
		const toolbar = document.createElement("tp-toolbar");
		toolbar.className = "tp-markup-single-page-toolbar";
		toolbar.setAttribute("orientation", "horizontal");
		this.toolbarElement = toolbar;
		for (const name of controls) {
			if (!selected.has(name)) continue;
			let control: HTMLElement;
			if (name === "code" || name === "calc") {
				control = document.createElement("tp-icon-button");
				control.setAttribute("name", name === "calc" ? "calculator" : "code");
				control.setAttribute("label", name === "calc" ? "Calculator" : "Code");
				control.setAttribute("color", "currentColor");
				if (name === "calc") control.setAttribute("library", "components");
				control.addEventListener("click", () => {
					if (name === "calc") this.toggleCalculator();
					else void this.toggleSource();
				});
			} else if (name === "postit") {
				this.annotations = new TpPostItEditor();
				this.annotations.setTarget(this.outputElement);
				this.annotations.setPage(this.pageUrl);
				control = this.annotations;
			} else control = document.createElement(`tp-${name}`);
			if (name === "lang") control.hidden = true;
			control.dataset.action = name;
			control.setAttribute(
				"section",
				["code", "calc", "postit"].includes(name) ? "start" : "end",
			);
			toolbar.append(control);
		}
		this.prepend(toolbar);
		void this.updateLanguages();
	}

	private async updateLanguages(): Promise<void> {
		const token = ++this.languageToken;
		const control = this.toolbarElement?.querySelector("tp-lang");
		this.languageSources.clear();
		if (!control) return;
		control.hidden = true;
		const langs = [
			...new Set(
				this.langs
					.split(",")
					.map((lang) => lang.trim().toLowerCase())
					.filter((lang) => /^[a-z]{2,3}(?:-[a-z0-9]+)*$/.test(lang)),
			),
		];
		const first = langs[0];
		if (!first || langs.length < 2 || !this.src.trim()) return;
		const source = resolveComponentSourceUrl(this, this.src);
		const directory = new URL(".", source);
		const parentLanguage =
			directory.pathname.split("/").filter(Boolean).at(-1) ?? "";
		const translated =
			parentLanguage !== first && langs.includes(parentLanguage);
		const base = translated ? new URL("../", directory) : directory;
		const filename = source.pathname.split("/").at(-1) ?? "";
		this.currentDocumentLanguage = translated ? parentLanguage : first;
		const available = new Map<string, string>();
		for (const lang of langs) {
			const url = new URL(
				`${lang === first ? "" : `${lang}/`}${filename}`,
				base,
			);
			url.search = source.search;
			url.hash = source.hash;
			if (lang === this.currentDocumentLanguage)
				available.set(lang, source.href);
			else {
				try {
					const response = await fetch(url.href, { method: "HEAD" });
					if (token !== this.languageToken) return;
					const htmlFallback =
						getLanguageFromPath(source.pathname) !== "html" &&
						response.headers.get("content-type")?.includes("text/html");
					if (response.ok && !response.redirected && !htmlFallback)
						available.set(lang, url.href);
				} catch {
					/* An unavailable translation is not offered. */
				}
			}
			if (token !== this.languageToken) return;
		}
		this.languageSources = available;
		control.langs = [...available.keys()].join(",");
		control.hidden = available.size < 2;
	}

	private toggleCalculator(): void {
		if (!this.calculatorDrawer) {
			const drawer = new TpDrawer();
			drawer.setAttribute("label", "Calculator");
			drawer.setAttribute("placement", "end");
			drawer.setAttribute("width", "min(52rem, 100vw)");
			drawer.dataset.role = "calculator-drawer";
			drawer.setContent(document.createElement("tp-calculator"));
			this.append(drawer);
			this.calculatorDrawer = drawer;
		}
		if (this.calculatorDrawer.hasAttribute("open"))
			this.calculatorDrawer.hide();
		else this.calculatorDrawer.show();
	}

	private async toggleSource(): Promise<void> {
		if (this.sourceDrawer?.hasAttribute("open")) {
			this.sourceToken++;
			this.sourceDrawer.hide();
			return;
		}
		if (!this.sourceDrawer) {
			this.sourceDrawer = new TpDrawer();
			this.sourceDrawer.setAttribute("label", "Source code");
			this.sourceDrawer.setAttribute("placement", "end");
			this.sourceDrawer.setAttribute("width", "min(60rem, 100vw)");
			this.sourceDrawer.dataset.role = "source-drawer";
			this.append(this.sourceDrawer);
		}
		const drawer = this.sourceDrawer;
		const token = ++this.sourceToken;
		const pre = document.createElement("pre");
		const code = document.createElement("code");
		pre.append(code);
		code.textContent = "Loading…";
		drawer.setContent(pre);
		drawer.show();
		try {
			let source = dedent(this.inlineSourceSnapshot?.source ?? "");
			if (this.src.trim()) {
				const response = await fetch(
					resolveComponentSourceUrl(this, this.src).href,
				);
				if (!response.ok)
					throw new Error(`Unable to load source (${response.status}).`);
				source = await response.text();
			}
			if (token === this.sourceToken) code.textContent = source;
		} catch (error) {
			if (token === this.sourceToken) {
				pre.setAttribute("role", "alert");
				code.textContent =
					error instanceof Error ? error.message : String(error);
			}
		}
	}

	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	public set src(value: string) {
		if (value.trim() === "") this.removeAttribute("src");
		else this.setAttribute("src", value);
	}

	private async renderSinglePage(): Promise<void> {
		const token = ++this.renderToken;
		this.sourceToken++;
		this.sourceDrawer?.hide();
		this.pageUrl = "";
		this.annotations?.setPage("");
		this.removeAttribute("data-tp-markup-single-page-rendered");
		this.outputElement.replaceChildren();

		try {
			const rawSrc = this.src.trim();
			if (rawSrc !== "") {
				await this.renderExternalSource(rawSrc, token);
			} else {
				await this.renderInlineSource(token);
			}
		} catch (error) {
			if (token !== this.renderToken) return;
			const message = error instanceof Error ? error.message : String(error);
			this.outputElement.innerHTML = `<pre class="tp-markup-single-page-error" role="alert"><code>${escapeHtml(message)}</code></pre>`;
			this.finishRender("html", "");
		}
	}

	private async renderExternalSource(
		src: string,
		token: number,
	): Promise<void> {
		const language = this.fixedLanguage ?? getLanguageFromPath(src);
		if (language === null) {
			throw new Error(`Unsupported single-page source extension: ${src}`);
		}

		this.setAttribute("data-tp-markup-single-page-language", language);
		this.setAttribute(
			"data-tp-markup-single-page-source",
			resolveComponentSourceUrl(this, src).pathname,
		);

		if (language === "html") {
			const currentUrl = resolveComponentSourceUrl(this, src);
			const response = await fetch(currentUrl.href, { cache: "no-store" });
			if (!response.ok) {
				throw new Error(
					`Unable to load HTML file: ${currentUrl.pathname} (${String(response.status)})`,
				);
			}
			if (token !== this.renderToken) return;
			const source = await response.text();
			if (token !== this.renderToken) return;
			this.outputElement.innerHTML = source;
			this.finishRender(language, src);
			return;
		}

		await this.renderMarkupElement(language, token, src);
	}

	private async renderInlineSource(token: number): Promise<void> {
		const inline = this.inlineSourceSnapshot;
		if (inline === null) {
			throw new Error(
				'Missing single-page source. Provide a supported `src` file or a direct `<script type="tp/...">` child.',
			);
		}

		this.setAttribute("data-tp-markup-single-page-language", inline.language);
		this.removeAttribute("data-tp-markup-single-page-source");

		if (inline.language === "html") {
			this.outputElement.innerHTML = dedent(inline.source);
			this.finishRender(inline.language, "");
			return;
		}

		await this.renderMarkupElement(inline.language, token, "", inline.source);
	}

	private renderMarkupElement(
		language: TpMarkupSinglePageLanguage,
		token: number,
		src = "",
		source = "",
	): Promise<void> {
		const tagName = getRendererTagName(language);
		if (tagName === null) {
			throw new Error(`Unsupported single-page language: ${language}`);
		}

		return new Promise((resolve) => {
			const element = document.createElement(tagName);
			const eventName = getRenderedEventName(language);

			element.addEventListener(
				eventName,
				() => {
					if (token === this.renderToken) this.finishRender(language, src);
					resolve();
				},
				{ once: true },
			);

			if (src.trim() !== "") {
				element.setAttribute("src", src);
			} else {
				const script = document.createElement("script");
				script.type = SCRIPT_TYPE_BY_LANGUAGE[language];
				script.textContent = source;
				element.append(script);
			}

			this.outputElement.replaceChildren(element);
		});
	}

	private finishRender(
		language: TpMarkupSinglePageLanguage,
		src: string,
	): void {
		this.setAttribute("data-tp-markup-single-page-rendered", "");
		const pageUrl = src
			? resolveComponentSourceUrl(this, src).href
			: `${this.ownerDocument.location.href.split("#")[0]}#${this.id || `${this.localName}-${Array.from(this.ownerDocument.querySelectorAll(this.localName)).indexOf(this)}`}`;
		this.pageUrl = pageUrl;
		this.annotations?.setPage(pageUrl);
		const detail = { language, src };
		this.dispatchEvent(
			new CustomEvent("tp-markup-single-page-rendered", {
				bubbles: true,
				detail,
			}),
		);
		if (this.localName !== "tp-markup-single-page")
			this.dispatchEvent(
				new CustomEvent(`${this.localName}-rendered`, {
					bubbles: true,
					detail,
				}),
			);
	}

	private readInlineSource(): InlineSource | null {
		const scripts = Array.from(
			this.querySelectorAll(':scope > script[type^="tp/"]'),
		);

		for (const script of scripts) {
			if (!(script instanceof HTMLScriptElement)) continue;
			const language = LANGUAGE_BY_SCRIPT_TYPE.get(
				script.type.trim().toLowerCase(),
			);
			if (language === undefined || script.textContent === null) continue;
			if (this.fixedLanguage !== null && language !== this.fixedLanguage)
				continue;
			return { language, source: script.textContent };
		}

		return null;
	}
}

if (!customElements.get("tp-markup-single-page")) {
	customElements.define("tp-markup-single-page", TpMarkupSinglePage);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-markup-single-page": TpMarkupSinglePage;
	}
}
