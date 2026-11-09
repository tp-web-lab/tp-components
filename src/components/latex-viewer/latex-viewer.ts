/**
 * @module components/latex-viewer
 * @summary Editable LaTeX documents with rendered HTML and generated source views.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
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
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
// tp-docgen:dependencies:end

import { renderLatexToFragment } from "@tp/tp-latex";
import { dedent } from "../../utilities/code.js";
import { formatHtmlForDisplay } from "../../utilities/html-code.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { buildIframeDocument } from "../html-viewer/html-viewer.js";
import latexStyle from "../latex/latex.css?inline";
import {
	type MarkupViewerExample,
	type MarkupViewerMode,
	TpMarkupViewer,
} from "../markup-viewer/markup-viewer.js";

type LatexMode = "render" | "html";
/**
 * The custom `<tp-latex-viewer>` element presents editable LaTeX examples with rendered and generated HTML views.
 *
 * @summary Presents editable LaTeX examples with rendered and generated HTML views.
 * @tagname tp-latex-viewer
 * @attr {string} src = "" - Comma-separated URLs of LaTeX example files.
 * @attr {boolean} allow-script = false - Executes scripts in the generated HTML preview.
 * @attr {boolean} lite = false - Compact viewer with rendered output.
 * @see tp-latex-playground - Edit file-based LaTeX projects with a console.
 * @see tp-latex - Render LaTeX directly in a page.
 * @example
 * <tp-latex-viewer><script type="tp/latex">\section{Hello}A formula $x^2$.</script></tp-latex-viewer>
 */
export class TpLatexViewer extends TpMarkupViewer<LatexMode> {
	public static override get observedAttributes(): string[] {
		return [...TpMarkupViewer.observedAttributes, "allow-script"];
	}
	protected readonly sourceLanguage = "stex";
	protected readonly viewerClassName = "tp-latex-viewer";
	protected readonly outputModes: readonly MarkupViewerMode<LatexMode>[] = [
		{ value: "render", label: "Rendered HTML" },
		{ value: "html", label: "HTML code" },
	];
	protected readInlineSource(): MarkupViewerExample {
		const script = this.querySelector(
			':scope > script:is([type="tp/latex"], [type="tp/latex-viewer"])',
		);
		return {
			label: "Example",
			source: dedent(script?.textContent ?? this.textContent ?? ""),
			context: undefined,
		};
	}
	protected override extractExamples(
		example: MarkupViewerExample,
	): MarkupViewerExample[] {
		const markers = [...example.source.matchAll(/^% !tp-example (.+)$/gm)];
		if (!markers.length) return [example];
		return markers.map((marker, index) => ({
			label: (marker[1] ?? "Example").trim(),
			source: example.source
				.slice(
					(marker.index ?? 0) + marker[0].length,
					markers[index + 1]?.index,
				)
				.trim(),
			context: example.context,
		}));
	}
	protected createExternalContext(_url: URL): undefined {
		return undefined;
	}
	protected async renderOutput(
		source: string,
		mode: LatexMode,
		container: HTMLElement,
	): Promise<void> {
		if (mode === "render") {
			const latex = document.createElement("tp-latex");
			latex.setAttribute("value", source);
			const iframe = document.createElement("iframe");
			iframe.title = "LaTeX preview";
			if (this.hasAttribute("allow-script")) {
				// Parse the generated HTML in the iframe, as the HTML viewer does.
				// This activates scripts from rawhtml as well as wcScript exactly once.
				const output = document.createElement("div");
				output.className = "tp-latex-output";
				output.setAttribute("data-tp-reference-scope", "");
				output.append(renderLatexToFragment(source));
				iframe.allow = "autoplay";
				iframe.srcdoc = buildIframeDocument(
					`<style>${latexStyle}</style>${output.outerHTML}`,
					document.baseURI,
				);
			} else {
				iframe.srcdoc = buildIframeDocument(latex.outerHTML, document.baseURI);
			}
			container.replaceChildren(iframe);
			return;
		}
		const holder = document.createElement("div");
		holder.append(renderLatexToFragment(source));
		await import("../code-editor/code-editor.js");
		const editor = document.createElement("tp-code-editor") as TpCodeEditor;
		editor.language = "html";
		editor.lineNumbers = false;
		editor.wordWrap = true;
		editor.readonly = true;
		editor.setValue(formatHtmlForDisplay(holder.innerHTML));
		container.replaceChildren(editor);
		this.resyncEditorHeight(editor);
	}
}
if (!customElements.get("tp-latex-viewer"))
	customElements.define("tp-latex-viewer", TpLatexViewer);
declare global {
	interface HTMLElementTagNameMap {
		"tp-latex-viewer": TpLatexViewer;
	}
}
