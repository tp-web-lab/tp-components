/**
 * @module components/asciidoc-viewer
 * @summary Interactive AsciiDoc viewer with editable source and parser outputs.
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
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
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
 * @tp-dependency tp-object-tree
 * @summary Specialized tree for inspecting JavaScript values.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
// tp-docgen:dependencies:end

import { formatHtmlForDisplay } from "../../utilities/html-code.js";
import {
	dedentAsciidocSource,
	parseAsciidocToAst,
	renderAsciidocToHtml,
} from "../asciidoc/asciidoc.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { buildIframeDocument } from "../html-viewer/html-viewer.js";
import type {
	MarkupViewerExample,
	MarkupViewerMode,
} from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import type { TpObjectTree } from "../object-tree/object-tree.js";
import "../object-tree/object-tree.js";

/** Supported AsciiDoc output views. */
type AdocViewerMode = "render" | "html" | "ast";

const OUTPUT_MODES: readonly MarkupViewerMode<AdocViewerMode>[] = [
	{ value: "render", label: "Rendered HTML" },
	{ value: "html", label: "HTML code" },
	{ value: "ast", label: "AST JSON" },
];

/** Extracts consecutive titled AsciiDoc example blocks. */
function extractTitledExamples(source: string): MarkupViewerExample[] {
	const lines = source.split("\n");
	const examples: MarkupViewerExample[] = [];
	let index = 0;

	while (index < lines.length) {
		const title = (lines[index] ?? "").match(/^\.([^.]\S.*)$/)?.[1]?.trim();
		const delimiter = lines[index + 1]?.trim() ?? "";
		if (title === undefined || !/^={4,}$/.test(delimiter)) {
			index += 1;
			continue;
		}

		index += 2;
		const content: string[] = [];
		while (index < lines.length && (lines[index] ?? "").trim() !== delimiter) {
			content.push(lines[index] ?? "");
			index += 1;
		}

		if (index < lines.length) {
			examples.push({
				label: title,
				source: content.join("\n"),
				context: undefined,
			});
			index += 1;
		}
	}

	return examples;
}

/**
 * Interactive editor and viewer for one or more AsciiDoc examples.
 *
 * @tagname tp-asciidoc-viewer
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {string} src = "" - Comma-separated URLs of external AsciiDoc example files.
 * @example
 * <tp-asciidoc-viewer></tp-asciidoc-viewer>
 */
export class TpAsciidocViewer extends TpMarkupViewer<AdocViewerMode> {
	protected readonly sourceLanguage = "asciidoc";
	protected readonly outputModes = OUTPUT_MODES;
	protected readonly viewerClassName = "tp-asciidoc-viewer";

	protected readInlineSource(): MarkupViewerExample {
		const script = this.querySelector(
			':scope > script:is([type="tp/asciidoc"], [type="tp/asciidoc-viewer"])',
		);
		if (script instanceof HTMLScriptElement && script.textContent !== null) {
			return {
				label: "Example",
				source: dedentAsciidocSource(script.textContent),
				context: undefined,
			};
		}

		const template = this.querySelector(":scope > template");
		const source =
			template instanceof HTMLTemplateElement
				? template.innerHTML
				: (this.textContent ?? "");
		return {
			label: "Example",
			source: dedentAsciidocSource(source),
			context: undefined,
		};
	}

	protected override extractExamples(
		example: MarkupViewerExample,
	): MarkupViewerExample[] {
		const titled = extractTitledExamples(example.source);
		return titled.length > 0 ? titled : [example];
	}

	protected createExternalContext(_url: URL): undefined {
		return undefined;
	}

	protected async renderOutput(
		source: string,
		mode: AdocViewerMode,
		container: HTMLElement,
	): Promise<void> {
		if (mode === "render") {
			container.classList.add("tp-asciidoc-output");
			const iframe = document.createElement("iframe");
			iframe.title = "AsciiDoc preview";
			const needsRuntimeRenderer = /(?:stem:|latexmath:|\[stem(?:,|\]))/i.test(
				source,
			);
			const renderedSource = needsRuntimeRenderer
				? `<tp-asciidoc><script type="tp/asciidoc">${source.replace(/<\/script/gi, "<\\/script")}</script></tp-asciidoc>`
				: await renderAsciidocToHtml(source);
			iframe.srcdoc = buildIframeDocument(renderedSource, document.baseURI);
			container.replaceChildren(iframe);
			return;
		}

		if (mode === "ast") {
			const tree = document.createElement("tp-object-tree") as TpObjectTree;
			tree.setValue(await parseAsciidocToAst(source));
			container.replaceChildren(tree);
			return;
		}

		const editor = document.createElement("tp-code-editor") as TpCodeEditor;
		editor.language = "html";
		editor.lineNumbers = false;
		editor.wordWrap = true;
		editor.readonly = true;
		editor.setValue(formatHtmlForDisplay(await renderAsciidocToHtml(source)));
		container.replaceChildren(editor);
		this.resyncEditorHeight(editor);
	}
}

if (!customElements.get("tp-asciidoc-viewer")) {
	customElements.define("tp-asciidoc-viewer", TpAsciidocViewer);
}
