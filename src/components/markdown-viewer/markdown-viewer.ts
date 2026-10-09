/**
 * @module components/markdown-viewer
 * @summary Interactive Markdown viewer with editable source and parser outputs.
 */

// tp-docgen:dependencies:start
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
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
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

import { dedent } from "../../utilities/code.js";
import { formatHtmlForDisplay } from "../../utilities/html-code.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { buildIframeDocument } from "../html-viewer/html-viewer.js";
import {
	parseMarkdownToTokens,
	renderMarkdownToHtml,
} from "../markdown/markdown.js";
import type {
	MarkupViewerExample,
	MarkupViewerMode,
} from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import type { TpObjectTree } from "../object-tree/object-tree.js";
import "../object-tree/object-tree.js";

/** Supported Markdown output views. */
type MdViewerMode = "render" | "html" | "ast";

const OUTPUT_MODES: readonly MarkupViewerMode<MdViewerMode>[] = [
	{ value: "render", label: "Rendered HTML" },
	{ value: "html", label: "HTML code" },
	{ value: "ast", label: "AST JSON" },
];

/** Extracts fenced `example` blocks from Markdown source. */
function extractFencedExamples(source: string): MarkupViewerExample[] {
	const lines = source.split("\n");
	const examples: MarkupViewerExample[] = [];
	let index = 0;

	while (index < lines.length) {
		const open = (lines[index] ?? "").match(/^(`{3,}|~{3,})\s*(\S+)?\s*(.*)$/);
		if (open === null) {
			index += 1;
			continue;
		}

		const fence = open[1] ?? "```";
		const language = (open[2] ?? "").trim().toLowerCase();
		const args = open[3] ?? "";
		const labelMatch = args.match(
			/(?:^|[\s{])label\s*=\s*("[^"]*"|'[^']*'|[^\s}]+)/,
		);
		const label =
			labelMatch?.[1]?.replace(/^["']|["']$/g, "") ||
			`Example ${String(examples.length + 1)}`;

		index += 1;
		const content: string[] = [];
		while (index < lines.length && (lines[index] ?? "").trim() !== fence) {
			content.push(lines[index] ?? "");
			index += 1;
		}

		if (language === "example") {
			examples.push({ label, source: content.join("\n"), context: undefined });
		}
		index += 1;
	}

	return examples;
}

/**
 * Interactive Markdown viewer component.
 *
 * @tagname tp-markdown-viewer
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {string} src = "" - Comma-separated URLs of external Markdown example files.
 * @example
 * <tp-markdown-viewer></tp-markdown-viewer>
 */
export class TpMarkdownViewer extends TpMarkupViewer<MdViewerMode> {
	protected readonly sourceLanguage = "markdown";
	protected readonly outputModes = OUTPUT_MODES;
	protected readonly viewerClassName = "tp-markdown-viewer";

	protected readInlineSource(): MarkupViewerExample {
		const script = this.querySelector(
			':scope > script:is([type="tp/markdown"], [type="tp/markdown-viewer"])',
		);
		if (script instanceof HTMLScriptElement && script.textContent !== null) {
			return {
				label: "Example",
				source: dedent(script.textContent),
				context: undefined,
			};
		}

		const template = this.querySelector(":scope > template");
		const source =
			template instanceof HTMLTemplateElement
				? template.innerHTML
				: (this.textContent ?? "");
		return { label: "Example", source: dedent(source), context: undefined };
	}

	protected override extractExamples(
		example: MarkupViewerExample,
	): MarkupViewerExample[] {
		const fenced = extractFencedExamples(example.source);
		return fenced.length > 0 ? fenced : [example];
	}

	protected createExternalContext(_url: URL): undefined {
		return undefined;
	}

	protected async renderOutput(
		source: string,
		mode: MdViewerMode,
		container: HTMLElement,
	): Promise<void> {
		if (mode === "render") {
			container.classList.add("tp-markdown-output");
			const iframe = document.createElement("iframe");
			iframe.title = "Markdown preview";
			const needsRuntimeRenderer =
				/^---[\s\S]*?^extensions:\s*[\s\S]*?^---/m.test(source);
			const renderedSource = needsRuntimeRenderer
				? `<tp-markdown><script type="tp/markdown">${source.replace(/<\/script/gi, "<\\/script")}</script></tp-markdown>`
				: await renderMarkdownToHtml(source);
			iframe.srcdoc = buildIframeDocument(renderedSource, document.baseURI);
			container.replaceChildren(iframe);
			return;
		}

		if (mode === "ast") {
			const tree = document.createElement("tp-object-tree") as TpObjectTree;
			tree.setValue(await parseMarkdownToTokens(source));
			container.replaceChildren(tree);
			return;
		}

		const editor = document.createElement("tp-code-editor") as TpCodeEditor;
		editor.language = "html";
		editor.lineNumbers = false;
		editor.wordWrap = true;
		editor.readonly = true;
		editor.setValue(formatHtmlForDisplay(await renderMarkdownToHtml(source)));
		container.replaceChildren(editor);
		this.resyncEditorHeight(editor);
	}
}

if (!customElements.get("tp-markdown-viewer")) {
	customElements.define("tp-markdown-viewer", TpMarkdownViewer);
}
