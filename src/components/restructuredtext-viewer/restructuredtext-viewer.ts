/**
 * @module components/restructuredtext-viewer
 * @summary Interactive reStructuredText viewer with editable source and parser outputs.
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
 * @tp-dependency tp-object-tree
 * @summary Specialized tree for inspecting JavaScript values.
 */
/**
 * @tp-dependency tp-restructuredtext
 * @summary reStructuredText rendering component.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @credit tp-restructuredtext https://www.npmjs.com/package/@tp/tp-restructuredtext
 * @summary reStructuredText parsing and rendering.
 */
// tp-docgen:dependencies:end

import { extractRstViewerExamples } from "@tp/tp-restructuredtext";
import { formatHtmlForDisplay } from "../../utilities/html-code.js";
import { getComponentSourceBaseUrl } from "../../utilities/source-url.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { buildIframeDocument } from "../html-viewer/html-viewer.js";
import type {
	MarkupViewerExample,
	MarkupViewerMode,
} from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import type { TpObjectTree } from "../object-tree/object-tree.js";
import "../object-tree/object-tree.js";
import {
	dedentRestructuredTextSource,
	parseRestructuredTextToAst,
	renderRestructuredTextToHtml,
} from "../restructuredtext/restructuredtext.js";

/** Supported reStructuredText output views. */
type RstViewerMode = "render" | "html" | "ast";

type RstViewerExample = MarkupViewerExample<URL>;

const OUTPUT_MODES: readonly MarkupViewerMode<RstViewerMode>[] = [
	{ value: "render", label: "Rendered HTML" },
	{ value: "html", label: "HTML code" },
	{ value: "ast", label: "AST JSON" },
];

/**
 * Interactive editor and viewer for one or more reStructuredText examples.
 *
 * Consecutive examples can be declared with `.. example:: Label` blocks.
 *
 * @tagname tp-restructuredtext-viewer
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {boolean} doctest = false - Runs standard Python doctest blocks in rendered output.
 * @attr {string} src = "" - Comma-separated URLs of external reStructuredText example files.
 * @example
 * <tp-restructuredtext-viewer></tp-restructuredtext-viewer>
 */
export class TpRestructuredTextViewer extends TpMarkupViewer<
	RstViewerMode,
	URL
> {
	public static override get observedAttributes(): string[] {
		return [...TpMarkupViewer.observedAttributes, "doctest"];
	}

	protected readonly sourceLanguage = "restructuredtext";
	protected readonly outputModes = OUTPUT_MODES;
	protected readonly viewerClassName = "tp-restructuredtext-viewer";

	/** Whether rendered standard Python doctest blocks are executed. */
	public get doctest(): boolean {
		return this.hasAttribute("doctest");
	}

	public set doctest(value: boolean) {
		this.toggleAttribute("doctest", value);
	}

	protected readInlineSource(): RstViewerExample {
		const script = this.querySelector(
			':scope > script:is([type="tp/restructuredtext"], [type="tp/restructuredtext-viewer"])',
		);
		if (script instanceof HTMLScriptElement && script.textContent !== null) {
			return {
				label: "Example",
				source: dedentRestructuredTextSource(script.textContent),
				context: new URL(getComponentSourceBaseUrl(this)),
			};
		}

		const template = this.querySelector(":scope > template");
		const source =
			template instanceof HTMLTemplateElement
				? template.innerHTML
				: (this.textContent ?? "");
		return {
			label: "Example",
			source: dedentRestructuredTextSource(source),
			context: new URL(getComponentSourceBaseUrl(this)),
		};
	}

	protected override extractExamples(
		example: RstViewerExample,
	): RstViewerExample[] {
		if (!/^\.\.\s+example::/m.test(example.source)) return [example];

		return extractRstViewerExamples(example.source).map((item) => ({
			...item,
			context: example.context,
		}));
	}

	protected createExternalContext(url: URL): URL {
		return url;
	}

	protected async renderOutput(
		source: string,
		mode: RstViewerMode,
		container: HTMLElement,
		context: URL,
	): Promise<void> {
		container.setAttribute("data-tp-source", context.href);

		if (mode === "render") {
			container.classList.add("tp-restructuredtext-output");
			if (this.doctest) {
				const renderer = document.createElement("tp-restructuredtext");
				renderer.setAttribute("doctest", "");
				const script = document.createElement("script");
				script.type = "tp/restructuredtext";
				script.textContent = source;
				renderer.append(script);
				const rendered = new Promise<void>((resolve) => {
					renderer.addEventListener(
						"tp-restructuredtext-rendered",
						() => resolve(),
						{ once: true },
					);
				});
				container.replaceChildren(renderer);
				await rendered;
				const output = renderer.querySelector(
					":scope > .tp-restructuredtext-output",
				);
				if (output !== null) container.replaceChildren(...output.childNodes);
				return;
			}
			const iframe = document.createElement("iframe");
			iframe.title = "reStructuredText preview";
			iframe.srcdoc = buildIframeDocument(
				/:(?:math|latexmath|asciimath):|\.\.\s+(?:math|latexmath|asciimath)::|\.\.\s+role::[^\n]*\((?:math|latexmath|asciimath)\)/i.test(
					source,
				)
					? `<tp-restructuredtext><script type="tp/restructuredtext">${source.replace(/<\/script/gi, "<\\/script")}</script></tp-restructuredtext>`
					: await renderRestructuredTextToHtml(source),
				context.href,
			);
			container.replaceChildren(iframe);
			return;
		}

		if (mode === "ast") {
			const tree = document.createElement("tp-object-tree") as TpObjectTree;
			tree.setValue(await parseRestructuredTextToAst(source));
			container.replaceChildren(tree);
			return;
		}

		const editor = document.createElement("tp-code-editor") as TpCodeEditor;
		editor.language = "html";
		editor.lineNumbers = false;
		editor.wordWrap = true;
		editor.readonly = true;
		editor.setValue(
			formatHtmlForDisplay(await renderRestructuredTextToHtml(source)),
		);
		container.replaceChildren(editor);
		this.resyncEditorHeight(editor);
	}
}

if (!customElements.get("tp-restructuredtext-viewer")) {
	customElements.define("tp-restructuredtext-viewer", TpRestructuredTextViewer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-restructuredtext-viewer": TpRestructuredTextViewer;
	}
}
