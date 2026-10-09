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
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-restructuredtext
 * @summary reStructuredText rendering component.
 */
// tp-docgen:dependencies:end

import { dedent } from "../../utilities/code.js";
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
		return ["src"];
	}

	private readonly outputElement = document.createElement("div");
	private renderToken = 0;
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
		this.annotations?.dispose();
		this.annotations = new TpPostItEditor();
		this.annotations.setAttribute("section", "start");
		this.annotations.setTarget(this.outputElement);
		const toolbar = document.createElement("tp-toolbar");
		toolbar.append(this.annotations);
		this.prepend(toolbar);
		void this.renderSinglePage();
	}
	/** Removes annotation listeners and floating notes when detached. */
	public disconnectedCallback(): void {
		this.annotations?.dispose();
		this.annotations = null;
		this.renderToken++;
	}

	protected attributeChangedCallback(): void {
		if (this.isConnected) void this.renderSinglePage();
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
			this.outputElement.innerHTML = await response.text();
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
