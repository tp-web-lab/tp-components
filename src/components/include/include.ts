/**
 * @module components/include
 * @summary Remote HTML include component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit DOMPurify https://github.com/cure53/DOMPurify
 * @summary HTML sanitization.
 */
// tp-docgen:dependencies:end

import DOMPurify from "dompurify";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./include.css?inline";

type TpIncludeFetchMode = "cors" | "no-cors" | "same-origin";
type TpIncludeMode = "auto" | "raw";

function isFetchMode(value: string): value is TpIncludeFetchMode {
	return value === "cors" || value === "no-cors" || value === "same-origin";
}

function isFullHtmlDocument(html: string): boolean {
	return /<html[\s>]/i.test(html) || /<body[\s>]/i.test(html);
}

/**
 * `<tp-include>` charge un contenu HTML distant et l'injecte dans le DOM léger.
 *
 * Handling:
 * - document HTML complet → injecte uniquement `<body>`
 * - fragment HTML → injecte tel quel
 *
 * @summary Loads remote HTML content.
 * @tagname tp-include
 * @attr {string} src = "" - HTML source URL.
 * @attr {string} mode = "auto" - Inclusion mode (`auto` or `raw`).
 * @attr {string} fetch-mode = "cors" - Fetch mode (`cors`, `no-cors`, or `same-origin`).
 * @attr {boolean} allow-scripts = false - Allows included scripts to run.
 * @attr {boolean} allow-styles = false - Keeps included `<style>` and stylesheet links.
 * @attr {boolean} sanitize = false - Sanitizes included HTML with DOMPurify.
 * @attr {string} loading = "" - Text shown while loading.
 * @attr {string} fallback = "" - CSS selector for fallback content displayed on error.
 * @event tp-include-load Emitted after content is loaded and injected.
 * @eventdetail tp-include-load { src: string; fetchMode: "cors" | "no-cors" | "same-origin"; allowScripts: boolean; allowStyles: boolean; sanitize: boolean; scriptsExecuted: boolean }
 * @event tp-include-error Emitted when loading or injecting content fails.
 * @eventdetail tp-include-error { src: string; fetchMode: "cors" | "no-cors" | "same-origin"; allowScripts: boolean; allowStyles: boolean; sanitize: boolean; scriptsExecuted: false; error: string }
 * @example
 * <tp-include></tp-include>
 */
export class TpInclude extends TpBase {
	private static readonly styleId = "tp-include-styles";

	private requestId = 0;

	public static get observedAttributes(): string[] {
		return [
			"src",
			"mode",
			"fetch-mode",
			"allow-scripts",
			"allow-styles",
			"sanitize",
			"loading",
			"fallback",
		];
	}

	/**
	 * Location of the HTML file to include.
	 */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	public set src(value: string) {
		if (value === "") {
			this.removeAttribute("src");
			return;
		}

		this.setAttribute("src", value);
	}

	/** Whether the response is interpreted as HTML or displayed as raw text. */
	public get mode(): TpIncludeMode {
		return this.getAttribute("mode") === "raw" ? "raw" : "auto";
	}

	public set mode(value: TpIncludeMode) {
		if (value === "raw") this.setAttribute("mode", "raw");
		else this.removeAttribute("mode");
	}

	/**
	 * Mode used for `fetch`.
	 */
	public get fetchMode(): TpIncludeFetchMode {
		const value = this.getAttribute("fetch-mode");
		return value !== null && isFetchMode(value) ? value : "cors";
	}

	public set fetchMode(value: TpIncludeFetchMode) {
		this.setAttribute("fetch-mode", value);
	}

	/**
	 * Allows included scripts to run.
	 */
	public get allowScripts(): boolean {
		return this.hasAttribute("allow-scripts");
	}

	public set allowScripts(value: boolean) {
		if (value) {
			this.setAttribute("allow-scripts", "");
			return;
		}

		this.removeAttribute("allow-scripts");
	}

	/**
	 * Allows included styles to remain in the injected content.
	 *
	 * Si absent, les balises `<style>` et `<link rel="stylesheet">`
	 * sont retirées du contenu injecté.
	 */
	public get allowStyles(): boolean {
		return this.hasAttribute("allow-styles");
	}

	public set allowStyles(value: boolean) {
		if (value) {
			this.setAttribute("allow-styles", "");
			return;
		}

		this.removeAttribute("allow-styles");
	}

	/**
	 * Enables sanitizing included HTML with DOMPurify.
	 */
	public get sanitize(): boolean {
		return this.hasAttribute("sanitize");
	}

	public set sanitize(value: boolean) {
		if (value) {
			this.setAttribute("sanitize", "");
			return;
		}

		this.removeAttribute("sanitize");
	}

	/**
	 * Text shown while loading.
	 */
	public get loading(): string {
		return this.getAttribute("loading") ?? "";
	}

	public set loading(value: string) {
		if (value === "") {
			this.removeAttribute("loading");
			return;
		}

		this.setAttribute("loading", value);
	}

	/**
	 * CSS selector for fallback content displayed on error.
	 */
	public get fallback(): string {
		return this.getAttribute("fallback") ?? "";
	}

	public set fallback(value: string) {
		if (value === "") {
			this.removeAttribute("fallback");
			return;
		}

		this.setAttribute("fallback", value);
	}

	/**
	 * @summary Initializes the include component.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		void this.loadContent();
	}

	/**
	 * @summary Reloads content when an observed attribute changes.
	 * @internal
	 */
	protected attributeChangedCallback(): void {
		if (!this.isConnected) {
			return;
		}

		void this.loadContent();
	}

	/**
	 * Explicitly reloads the remote content.
	 *
	 * @summary Reloads the included content.
	 */
	public async reload(): Promise<void> {
		await this.loadContent();
	}

	private ensureStyles(): void {
		if (document.getElementById(TpInclude.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpInclude.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	private async loadContent(): Promise<void> {
		const currentRequestId = ++this.requestId;

		if (this.src === "") {
			this.replaceChildren();
			return;
		}

		this.renderLoading();

		try {
			const sourceUrl = resolveComponentSourceUrl(this, this.src);
			this.setAttribute("data-tp-source", sourceUrl.href);
			const response = await fetch(sourceUrl.href, {
				mode: this.fetchMode,
			});

			if (currentRequestId !== this.requestId) {
				return;
			}

			if (!response.ok) {
				throw new Error(`HTTP ${String(response.status)}`);
			}

			const html = await response.text();

			if (currentRequestId !== this.requestId) {
				return;
			}

			if (this.mode === "raw") this.injectRaw(html);
			else this.injectHtml(html);

			this.dispatchEvent(
				new CustomEvent("tp-include-load", {
					bubbles: true,
					detail: {
						src: this.src,
						fetchMode: this.fetchMode,
						allowScripts: this.allowScripts,
						allowStyles: this.allowStyles,
						sanitize: this.sanitize,
						scriptsExecuted: this.allowScripts && !this.sanitize,
					},
				}),
			);
		} catch (error: unknown) {
			if (currentRequestId !== this.requestId) {
				return;
			}

			this.renderFallback();

			this.dispatchEvent(
				new CustomEvent("tp-include-error", {
					bubbles: true,
					detail: {
						src: this.src,
						fetchMode: this.fetchMode,
						allowScripts: this.allowScripts,
						allowStyles: this.allowStyles,
						sanitize: this.sanitize,
						scriptsExecuted: false,
						error:
							error instanceof Error ? error.message : "Unknown include error",
					},
				}),
			);
		}
	}

	private injectHtml(html: string): void {
		const normalizedHtml = this.sanitize
			? DOMPurify.sanitize(html, {
					WHOLE_DOCUMENT: isFullHtmlDocument(html),
				})
			: html;

		let fragment: DocumentFragment;

		if (isFullHtmlDocument(normalizedHtml)) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(normalizedHtml, "text/html");

			fragment = document.createDocumentFragment();

			for (const node of Array.from(doc.body.childNodes)) {
				fragment.append(node.cloneNode(true));
			}
		} else {
			const template = document.createElement("template");
			template.innerHTML = normalizedHtml;
			fragment = template.content.cloneNode(true) as DocumentFragment;
		}

		this.processStyles(fragment);
		this.processScripts(fragment);

		this.replaceChildren(fragment);
	}

	private injectRaw(source: string): void {
		const pre = document.createElement("pre");
		const code = document.createElement("code");
		code.textContent = source;
		pre.append(code);
		this.replaceChildren(pre);
	}

	private processStyles(fragment: DocumentFragment): void {
		if (this.allowStyles) {
			return;
		}

		const styles = Array.from(fragment.querySelectorAll("style"));
		for (const styleEl of styles) {
			styleEl.remove();
		}

		const links = Array.from(fragment.querySelectorAll("link"));
		for (const link of links) {
			const rel = link.getAttribute("rel");
			if (rel?.toLowerCase() === "stylesheet") {
				link.remove();
			}
		}
	}

	private processScripts(fragment: DocumentFragment): void {
		const scripts = Array.from(fragment.querySelectorAll("script"));
		const canRunScripts = this.allowScripts && !this.sanitize;

		for (const script of scripts) {
			if (isTpSourceScript(script)) {
				continue;
			}

			if (!canRunScripts) {
				script.remove();
				continue;
			}

			const replacement = document.createElement("script");

			for (const { name, value } of Array.from(script.attributes)) {
				replacement.setAttribute(name, value);
			}

			replacement.textContent = script.textContent;
			script.replaceWith(replacement);
		}
	}

	private renderLoading(): void {
		if (this.loading === "") {
			this.replaceChildren();
			return;
		}

		const loadingEl = document.createElement("div");
		loadingEl.setAttribute("data-tp-include-loading", "");
		loadingEl.textContent = this.loading;

		this.replaceChildren(loadingEl);
	}

	private renderFallback(): void {
		if (this.fallback === "") {
			this.replaceChildren();
			return;
		}

		const fallbackTemplate = this.querySelector(this.fallback);
		if (!(fallbackTemplate instanceof HTMLElement)) {
			this.replaceChildren();
			return;
		}

		const clone = fallbackTemplate.cloneNode(true) as HTMLElement;
		if (clone instanceof HTMLElement) {
			clone.hidden = false;
		}

		this.replaceChildren(clone);
	}
}

/** Tests whether a script stores declarative `tp/LANG` source instead of JavaScript. */
function isTpSourceScript(script: HTMLScriptElement): boolean {
	return (
		script.getAttribute("type")?.trim().toLowerCase().startsWith("tp/") === true
	);
}

if (!customElements.get("tp-include")) {
	customElements.define("tp-include", TpInclude);
}
