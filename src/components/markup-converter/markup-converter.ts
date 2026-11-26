/** @module components/markup-converter */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-asciidoc-viewer
 * @summary Interactive AsciiDoc viewer with editable source and parser outputs.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-latex-viewer
 * @summary Editable LaTeX documents with rendered HTML and generated source views.
 */
/**
 * @tp-dependency tp-markdown-viewer
 * @summary Interactive Markdown viewer with editable source and parser outputs.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-restructuredtext-viewer
 * @summary Interactive reStructuredText viewer with editable source and parser outputs.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
// tp-docgen:dependencies:end

import { dedent } from "../../utilities/code.js";
import {
	convertMarkup,
	htmlToMarkup,
	type MarkupLanguage,
	markupFormats,
	markupLanguageFromPath,
	markupToHtml,
	normalizeMarkupLanguage,
} from "../../utilities/markup-conversion.js";
import { extractMarkupIncludes } from "../../utilities/markup-includes.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import { TpBase } from "../base/base.js";
import "../tabs/tabs.js";
import { TpDropdown } from "../dropdown/dropdown.js";
import "../menu/menu.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import "../toolbar/toolbar.js";
import "../color/color.js";
import "../theme/theme.js";
import "../fullscreen/fullscreen.js";
import "../html-viewer/html-viewer.js";
import "../asciidoc-viewer/asciidoc-viewer.js";
import "../latex-viewer/latex-viewer.js";
import "../markdown-viewer/markdown-viewer.js";
import "../restructuredtext-viewer/restructuredtext-viewer.js";
import type { TpHtmlViewer } from "../html-viewer/html-viewer.js";
import style from "./markup-converter.css?inline";

/**
 * The custom `<tp-markup-converter>` element provides bidirectional document conversion between HTML, [tp-asciidoc](http://127.0.0.1:4323/), [tp-latex](http://127.0.0.1:4325/), [tp-markdown](http://127.0.0.1:4322/) and [tp-restructuredtext](http://127.0.0.1:4324/), with editable code and rendered previews.
 *
 * @summary Provides bidirectional document conversion between HTML, [tp-asciidoc](http://127.0.0.1:4323/), [tp-latex](http://127.0.0.1:4325/), [tp-markdown](http://127.0.0.1:4322/) and [tp-restructuredtext](http://127.0.0.1:4324/), with editable code and rendered previews.
 * @tagname tp-markup-converter
 * @attr {string} value = "" - Source text; takes precedence over inline script content.
 * @attr {"html" | "asciidoc" | "latex" | "markdown" | "restructuredtext"} language = "markdown" - Source language; aliases adoc, tex, md and rst are accepted.
 * @attr {string} src = "" - Source file URL; takes precedence over value and its extension determines the language.
 * @attr {boolean} show-code = false - Initially displays code and rendered output together in every language viewer.
 * @event tp-markup-converter-change Emitted after a source document has been loaded and converted.
 * @eventdetail tp-markup-converter-change { language: string; value: string }
 * @event tp-markup-converter-error Emitted when loading, conversion or saving fails.
 * @eventdetail tp-markup-converter-error { message: string }
 * @see tp-prose-editor - Edit rich documents before converting them.
 * @see tp-table-editor - Build and convert tables interactively.
 * @example
 * <tp-markup-converter><script type="tp/markdown">
 * # Workshop
 *
 * A **practical** introduction to markup.
 *
 * | Formula | Image |
 * | :--- | :--- |
 * | :tp-math:`E = mc^2`{mode="latexmath"} | ![Canoe](/medias/image/canoe.svg){width=160} |
 * [Science and illustration]
 * </script></tp-markup-converter>
 */
export class TpMarkupConverter extends TpBase {
	public static get observedAttributes(): string[] {
		return ["value", "language", "src", "show-code"];
	}
	private static sequence = 0;
	private inlineSource = "";
	private inlineLanguage = "markdown";
	private initialized = false;
	private revision = 0;
	private request?: AbortController;
	private ready: Promise<void> = Promise.resolve();
	private outputs = new Map<MarkupLanguage, string>();
	private originalOutputs = new Map<MarkupLanguage, string>();
	private originalLanguage: MarkupLanguage = "markdown";
	private originalBase = "";
	private loadedLanguage: MarkupLanguage = "markdown";
	private loadError: unknown;
	private filename = "document";
	private sourceBase = "";
	private batch = false;
	public get value(): string {
		return this.getAttribute("value") ?? this.inlineSource;
	}
	public set value(value: string) {
		this.setAttribute("value", value);
	}
	public get language(): string {
		return this.getAttribute("language") ?? this.inlineLanguage;
	}
	public set language(value: string) {
		this.setAttribute("language", value);
	}
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-markup-converter-styles", style);
		if (!this.initialized) {
			const script = this.querySelector<HTMLScriptElement>(
				":scope > script[type^='tp/']",
			);
			this.inlineSource = dedent(script?.textContent ?? "");
			this.inlineLanguage = script?.type.slice(3) ?? "markdown";
			this.initialized = true;
		}
		this.ready = this.load();
	}
	protected attributeChangedCallback(): void {
		if (this.isConnected && this.initialized && !this.batch)
			this.ready = this.load();
	}
	protected disconnectedCallback(): void {
		this.revision++;
		this.request?.abort();
	}
	/** Returns the source for a target language after the current conversion finishes. */
	public async getMarkup(language?: string): Promise<string> {
		await this.ready;
		if (this.loadError) throw this.loadError;
		return (
			this.outputs.get(
				normalizeMarkupLanguage(language ?? this.loadedLanguage),
			) ?? ""
		);
	}
	/** Replaces the source and selects its language tab. */
	public setSource(value: string, language: string): void {
		const normalized = normalizeMarkupLanguage(language);
		this.batch = true;
		this.removeAttribute("src");
		this.language = normalized;
		this.value = value;
		this.batch = false;
		if (this.isConnected) this.ready = this.load();
	}
	private fail(error: unknown): void {
		const message = error instanceof Error ? error.message : String(error);
		const status = this.querySelector<HTMLElement>("[data-converter-status]");
		if (status) {
			status.textContent = message;
			status.setAttribute("role", "alert");
		}
		this.dispatchEvent(
			new CustomEvent("tp-markup-converter-error", {
				bubbles: true,
				detail: { message },
			}),
		);
	}
	private async load(keepEditors = false): Promise<void> {
		const revision = ++this.revision;
		this.request?.abort();
		this.request = new AbortController();
		this.outputs.clear();
		this.loadError = undefined;
		this.setAttribute("aria-busy", "true");
		if (!keepEditors)
			this.innerHTML =
				'<p data-converter-status role="status">Loading document…</p>';
		try {
			let source = this.value;
			const base = this.src
				? new URL(this.src, this.baseURI).href
				: keepEditors && this.sourceBase
					? this.sourceBase
					: this.baseURI;
			const language = this.src
				? markupLanguageFromPath(base)
				: normalizeMarkupLanguage(this.language);
			if (this.src) {
				const response = await fetch(base, { signal: this.request.signal });
				if (!response.ok)
					throw new Error(`Unable to load document (${response.status}).`);
				source = await response.text();
				this.filename =
					new URL(base).pathname
						.split("/")
						.pop()
						?.replace(/\.[^.]+$/, "") || "document";
			}

			const html = extractMarkupIncludes(source, language).includes.length
				? undefined
				: await markupToHtml(source, language, base);
			const outputs = new Map<MarkupLanguage, string>();
			for (const format of markupFormats) {
				const code =
					format.language === language
						? source
						: html !== undefined
							? htmlToMarkup(html, format.language)
							: await convertMarkup(source, language, format.language, {
									baseURL: base,
								});
				outputs.set(
					format.language,
					format.language === "html" || format.language === "latex"
						? code.replace(/(?:\r?\n[ \t]*)+$/, "")
						: code,
				);
			}
			if (revision !== this.revision || !this.isConnected) return;
			this.sourceBase = base;
			this.outputs = outputs;
			if (!keepEditors) {
				this.originalOutputs = new Map(outputs);
				this.originalLanguage = language;
				this.originalBase = base;
			}
			this.loadedLanguage = language;
			if (keepEditors) this.syncEditors();
			else this.render();
			this.dispatchEvent(
				new CustomEvent("tp-markup-converter-change", {
					bubbles: true,
					detail: { language, value: source },
				}),
			);
		} catch (error) {
			if (revision !== this.revision || !this.isConnected) return;
			this.loadError = error;
			this.fail(error);
		} finally {
			if (revision === this.revision) this.removeAttribute("aria-busy");
		}
	}
	private sourceLabel(): string {
		const format = markupFormats.find(
			(item) => item.language === this.loadedLanguage,
		);
		return `Source: <tp-icon library="languages" name="${format?.icon ?? "file_type_html"}" size="1.25em" aria-hidden="true"></tp-icon><span data-converter-source-name>${format?.language === "html" ? "HTML" : (format?.label ?? this.loadedLanguage)}</span>`;
	}
	private render(): void {
		const id = `tp-markup-converter-files-${++TpMarkupConverter.sequence}`;
		const icon = (name: string) =>
			`<tp-icon library="languages" name="${name}" size="1.25em" aria-hidden="true"></tp-icon>`;
		const items = (action: string) =>
			markupFormats
				.map(
					(f) =>
						`<li data-${action}="${f.language}">${icon(f.icon)} ${f.label}</li>`,
				)
				.join("");
		this.innerHTML = `<tp-toolbar class="tp-markup-converter-toolbar" data-help-group="Files">
   <span section="start" class="tp-markup-converter-title"><tp-icon library="components" name="markup-converter" size="1.5em"></tp-icon> Markup converter</span>
   <tp-divider section="start" orientation="vertical" inline class="tp-markup-converter-title-divider"></tp-divider>
   <tp-icon-button section="start" id="${id}" name="file" label="Files" data-help-description="Import a document or save it in another markup format." pill></tp-icon-button>
   <tp-dropdown section="start" data-converter-files anchor="#${id}" placement="bottom" outside-click><tp-menu><ul>
   <li><span class="tp-markup-converter-menu-label"><tp-icon name="file-import" size="1.25em"></tp-icon> Import</span><ul>${items("import")}</ul></li>
   <li><span class="tp-markup-converter-menu-label"><tp-icon name="file-upload-as" size="1.25em"></tp-icon> Export as</span><ul>${items("save")}</ul></li>
   </ul></tp-menu></tp-dropdown><span section="center" data-converter-source aria-live="polite">${this.sourceLabel()}</span><input data-converter-file type="file" hidden><tp-color section="end"></tp-color><tp-theme section="end"></tp-theme><tp-fullscreen section="end"></tp-fullscreen></tp-toolbar>
   <p data-converter-status role="status"></p>
   <tp-tabs data-converter-formats selected="${markupFormats.findIndex((f) => f.language === this.loadedLanguage)}"><dl>
   ${markupFormats
			.map(
				(
					f,
				) => `<dt>${icon(f.icon)} ${f.label}</dt><dd data-converter-format="${f.language}">
<div data-converter-viewer-host id="${id}-${f.language}-viewer"></div></dd>`,
			)
			.join("")}
   </dl></tp-tabs>`;
		const candidate = this.querySelector("[data-converter-files]");
		const dropdown = candidate instanceof TpDropdown ? candidate : null;
		const trigger = this.querySelector<HTMLElement>(`#${id}`);
		trigger?.setAttribute("aria-haspopup", "menu");
		trigger?.setAttribute("aria-expanded", "false");
		trigger?.addEventListener("click", () => dropdown?.toggle());
		dropdown?.addEventListener("tp-dropdown-toggle", () =>
			trigger?.setAttribute("aria-expanded", String(dropdown.open)),
		);
		for (const panel of this.querySelectorAll<HTMLElement>(
			"[data-converter-format]",
		)) {
			const language = normalizeMarkupLanguage(
				panel.dataset.converterFormat ?? "",
			);
			const viewer = document.createElement(
				`tp-${language}-viewer`,
			) as TpHtmlViewer;
			viewer.setAttribute("lite", "");
			viewer.toggleAttribute("show-code", this.hasAttribute("show-code"));
			viewer.setAttribute("data-converter-viewer", "");
			viewer.setAttribute("data-tp-source", this.sourceBase || this.baseURI);
			const source = document.createElement("script");
			source.type = `tp/${language}`;
			source.textContent = this.outputs.get(language) ?? "";
			viewer.append(source);
			void viewer.setValue(source.textContent);
			viewer.addEventListener("tp-markup-viewer-run", (event) => {
				if (event.target !== viewer) return;
				event.preventDefault();
				void this.convert(language).catch((error) => this.fail(error));
			});
			viewer.addEventListener("tp-markup-viewer-reset", (event) => {
				if (event.target !== viewer) return;
				event.preventDefault();
				this.resetDocument();
			});
			panel.querySelector("[data-converter-viewer-host]")?.append(viewer);
		}
		for (const button of this.querySelectorAll<HTMLElement>("[data-save]"))
			button.addEventListener("click", () => {
				if (button.closest("tp-dropdown")) dropdown?.hide();
				void this.save(button.dataset.save ?? "html").catch((error) =>
					this.fail(error),
				);
			});
		const input = this.querySelector<HTMLInputElement>("[data-converter-file]");
		for (const item of this.querySelectorAll<HTMLElement>("[data-import]"))
			item.addEventListener("click", () => {
				this.openImport(item.dataset.import ?? "html");
			});
		input?.addEventListener("change", () => {
			const file = input.files?.[0];
			if (file) void this.importFile(file).catch((error) => this.fail(error));
			input.value = "";
		});
	}
	/** Opens the source-file chooser with the requested markup format filter. */
	public openImport(language: string): void {
		const input = this.querySelector<HTMLInputElement>("[data-converter-file]");
		if (!input) return;
		this.querySelector<TpDropdown>("[data-converter-files]")?.hide();
		input.accept =
			markupFormats.find(
				(format) => format.language === normalizeMarkupLanguage(language),
			)?.accept ?? "";
		input.click();
	}

	/** Restores the initially loaded source and updates all conversions. */
	resetDocument(): void {
		if (!this.originalOutputs.size) return;
		++this.revision;
		this.request?.abort();
		this.batch = true;
		this.removeAttribute("src");
		this.language = this.originalLanguage;
		this.value = this.originalOutputs.get(this.originalLanguage) ?? "";
		this.batch = false;
		this.sourceBase = this.originalBase;
		this.outputs = new Map(this.originalOutputs);
		this.loadedLanguage = this.originalLanguage;
		this.loadError = undefined;
		this.ready = Promise.resolve();
		this.removeAttribute("aria-busy");
		this.syncEditors();
		this.dispatchEvent(
			new CustomEvent("tp-markup-converter-change", {
				bubbles: true,
				detail: { language: this.language, value: this.value },
			}),
		);
	}
	/** Converts edited code into all five formats without replacing the active editor. */
	public async convert(language: string): Promise<void> {
		const normalized = normalizeMarkupLanguage(language);
		const editor = this.querySelector(
			`[data-converter-format="${normalized}"]`,
		)?.querySelector<TpHtmlViewer>("[data-converter-viewer]");
		if (!editor) return;
		const value = editor.hasAttribute("data-tp-viewer-ready")
			? editor.getValue()
			: (this.outputs.get(normalized) ?? "");
		this.batch = true;
		this.removeAttribute("src");
		this.language = normalized;
		this.value = value;
		this.batch = false;
		this.ready = this.load(true);
		await this.ready;
		if (this.loadError) throw this.loadError;
	}
	private syncEditors(): void {
		const sourceLabel = this.querySelector("[data-converter-source]");
		if (sourceLabel) sourceLabel.innerHTML = this.sourceLabel();
		const status = this.querySelector<HTMLElement>("[data-converter-status]");
		if (status) {
			status.textContent = "";
			status.setAttribute("role", "status");
		}
		for (const panel of this.querySelectorAll<HTMLElement>(
			"[data-converter-format]",
		)) {
			const language = normalizeMarkupLanguage(
				panel.dataset.converterFormat ?? "html",
			);
			const viewer = panel.querySelector<TpHtmlViewer>(
				"[data-converter-viewer]",
			);
			const value = this.outputs.get(language) ?? "";
			if (viewer)
				void viewer.setValue(value).catch((error) => this.fail(error));
		}
	}

	/** Loads a markup file as the new source document. */
	async importFile(file: File): Promise<void> {
		const language = markupLanguageFromPath(file.name);
		const source = await file.text();
		this.filename = file.name.replace(/\.[^.]+$/, "");
		this.setSource(source, language);
	}
	/** Saves the current conversion in the requested language. */
	async save(language: string): Promise<void> {
		const normalized = normalizeMarkupLanguage(language);
		const format = markupFormats.find((f) => f.language === normalized);
		if (!format) return;
		const source =
			this.querySelector(`[data-converter-format="${normalized}"]`)
				?.querySelector<TpHtmlViewer>(
					"[data-converter-viewer][data-tp-viewer-ready]",
				)
				?.getValue() ??
			this.outputs.get(normalized) ??
			"";
		const target = await chooseSaveTarget({
			suggestedName: `${this.filename}.${format.extension}`,
			extension: `.${format.extension}`,
			mimeType: normalized === "html" ? "text/html" : "text/plain",
			description: format.label,
		});
		if (target)
			await saveBlob(
				new Blob([source], { type: "text/plain;charset=utf-8" }),
				target,
			);
	}
}
if (!customElements.get("tp-markup-converter"))
	customElements.define("tp-markup-converter", TpMarkupConverter);
declare global {
	interface HTMLElementTagNameMap {
		"tp-markup-converter": TpMarkupConverter;
	}
}

export type { MarkupConversionOptions } from "../../utilities/markup-conversion.js";
/** Programmatic conversion independent of the component UI. */
export {
	convertMarkup as convert,
	convertMarkupFile as convertFile,
} from "../../utilities/markup-conversion.js";
