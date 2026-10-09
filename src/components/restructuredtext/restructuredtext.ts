/**
 * @module components/restructuredtext
 * @summary reStructuredText rendering component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-restructuredtext https://www.npmjs.com/package/@tp/tp-restructuredtext
 * @summary reStructuredText parsing and rendering.
 */
/**
 * @credit highlight.js https://highlightjs.org/
 * @summary Source-code syntax highlighting.
 */
// tp-docgen:dependencies:end

import {
	renderRestructuredTextMath,
	renderRstViewers,
	type TpRestructuredTextDoctestResult,
	type TpRestructuredTextNode,
	type TpRestructuredTextOptions,
	TpRestructuredTextParser,
} from "@tp/tp-restructuredtext";
import { dedent } from "../../utilities/code.js";
import {
	getComponentSourceBaseUrl,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./restructuredtext.css?inline";

const STYLE_ID = "tp-restructuredtext-styles";
const HIGHLIGHT_URL =
	"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js";

interface HighlightJsApi {
	highlightElement(element: HTMLElement): void;
}

type HighlightJsWindow = Window & { hljs?: HighlightJsApi };

const highlightRuntimeByDocument = new WeakMap<
	Document,
	Promise<HighlightJsApi>
>();

/** Configured parser instance used by the component runtime. */
export type TpRestructuredTextParserInstance = InstanceType<
	typeof TpRestructuredTextParser
>;

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * Removes HTML embedding indentation from reStructuredText source.
 *
 * @param source Source read from an embedded script or code block.
 * @returns Source normalized for Docutils.
 */
export function dedentRestructuredTextSource(source: string): string {
	return dedent(source);
}

/** Creates an independent Pyodide and Docutils parser facade. */
export function createTpRestructuredTextParser(
	options: TpRestructuredTextOptions = {},
): TpRestructuredTextParserInstance {
	return new TpRestructuredTextParser(options);
}

/** Completes formulas before connected components capture their author content. */
async function mountRestructuredTextHtml(
	html: string,
	root: HTMLElement,
): Promise<void> {
	const template = document.createElement("template");
	template.innerHTML = html;
	await renderRestructuredTextMath(template.content);
	root.replaceChildren(template.content);
}

/**
 * Converts reStructuredText source to HTML.
 *
 * @param source reStructuredText source to convert.
 * @returns Generated HTML.
 */
export async function renderRestructuredTextToHtml(
	source: string,
): Promise<string> {
	return createTpRestructuredTextParser().render(source);
}

/**
 * Parses reStructuredText into a JSON-compatible Docutils tree.
 *
 * @param source reStructuredText source to parse.
 * @returns Serializable document node.
 */
export async function parseRestructuredTextToAst(
	source: string,
): Promise<TpRestructuredTextNode> {
	return createTpRestructuredTextParser().parse(source);
}

/**
 * Converts source into an existing element.
 *
 * @param source reStructuredText source to render.
 * @param root Element that receives the generated HTML.
 */
export async function renderRestructuredTextInto(
	source: string,
	root: HTMLElement,
): Promise<void> {
	const parser = createTpRestructuredTextParser();
	await mountRestructuredTextHtml(await parser.render(source), root);
	await renderRstViewers(root, { parser });
	await highlightRestructuredTextCode(root);
}

async function highlightRestructuredTextCode(root: HTMLElement): Promise<void> {
	const blocks = Array.from(root.querySelectorAll<HTMLElement>("pre code"));
	if (blocks.length === 0) return;

	for (const block of blocks) {
		if (
			Array.from(block.classList).some((name) => name.startsWith("language-"))
		) {
			continue;
		}

		const pre = block.closest("pre");
		const language =
			pre === null
				? undefined
				: Array.from(pre.classList).find(
						(name) =>
							name !== "code" &&
							name !== "literal-block" &&
							name !== "number-lines",
					);
		if (language !== undefined) block.classList.add(`language-${language}`);
	}

	const highlightjs = await loadHighlightJs(root.ownerDocument);
	for (const block of blocks) highlightjs.highlightElement(block);
}

function loadHighlightJs(ownerDocument: Document): Promise<HighlightJsApi> {
	const runtime = ownerDocument.defaultView as HighlightJsWindow | null;
	if (runtime?.hljs !== undefined) return Promise.resolve(runtime.hljs);

	const existing = highlightRuntimeByDocument.get(ownerDocument);
	if (existing !== undefined) return existing;

	const loading = new Promise<HighlightJsApi>((resolve, reject) => {
		const script = ownerDocument.createElement("script");
		script.src = HIGHLIGHT_URL;
		script.dataset.tpRestructuredtextAsset = "highlight";
		script.addEventListener(
			"load",
			() => {
				if (runtime?.hljs === undefined) {
					reject(new Error("Highlight.js did not initialize."));
					return;
				}
				resolve(runtime.hljs);
			},
			{ once: true },
		);
		script.addEventListener(
			"error",
			() => reject(new Error("Unable to load Highlight.js.")),
			{ once: true },
		);
		ownerDocument.head.append(script);
	});
	highlightRuntimeByDocument.set(ownerDocument, loading);
	return loading;
}

/**
 * Renders inline or external reStructuredText as HTML.
 *
 * The browser runtime and the Docutils package are loaded lazily when the first
 * document is rendered.
 *
 * @tagname tp-restructuredtext
 * @attr {string} src = "" - URL of an external reStructuredText source file.
 * @attr {boolean} doctest = false - Runs standard Python doctest blocks and reports their result.
 * @event tp-restructuredtext-rendered Emitted after conversion completes.
 * @eventdetail tp-restructuredtext-rendered void
 * @event tp-restructuredtext-doctest Emitted after the document doctests have run.
 * @eventdetail tp-restructuredtext-doctest TpRestructuredTextDoctestResult
 * @example
 * <tp-restructuredtext>
 *       <script type="tp/restructuredtext">
 *         Hello, **Docutils**!
 *       </script>
 *     </tp-restructuredtext>
 */
export class TpRestructuredText extends TpBase {
	/** Attributes that trigger a new source load and conversion. */
	public static get observedAttributes(): string[] {
		return ["src", "doctest"];
	}

	private readonly outputElement = document.createElement("div");
	private renderToken = 0;
	private inlineSourceSnapshot = "";

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-restructuredtext");
		this.outputElement.className = "tp-restructuredtext-output";
		this.inlineSourceSnapshot = this.readInlineSource();
		this.ensureGlobalStyle(STYLE_ID, style);
		this.replaceChildren(this.outputElement);
		void this.renderRestructuredText();
	}

	protected attributeChangedCallback(): void {
		if (this.isConnected) void this.renderRestructuredText();
	}

	/**
	 * URL of an external reStructuredText source file.
	 *
	 * Inline content is used when this value is empty.
	 *
	 * @attr src
	 */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	public set src(value: string) {
		if (value.trim() === "") this.removeAttribute("src");
		else this.setAttribute("src", value);
	}

	/** Whether standard Python doctest blocks are executed after rendering. */
	public get doctest(): boolean {
		return this.hasAttribute("doctest");
	}

	public set doctest(value: boolean) {
		this.toggleAttribute("doctest", value);
	}

	private async renderRestructuredText(): Promise<void> {
		const token = ++this.renderToken;
		this.removeAttribute("data-tp-restructuredtext-rendered");

		try {
			const { source, currentUrl } = await this.getRestructuredTextSource();
			if (token !== this.renderToken) return;
			this.setAttribute("data-tp-restructuredtext-source", currentUrl.pathname);
			const parser = createTpRestructuredTextParser({ doctest: this.doctest });
			const result = await parser.renderDocument(source);
			await mountRestructuredTextHtml(result.html, this.outputElement);
			await renderRstViewers(this.outputElement, { parser });
			await highlightRestructuredTextCode(this.outputElement);
			if (result.doctest != null) {
				this.renderDoctestResults(result.doctest);
				this.dispatchEvent(
					new CustomEvent<TpRestructuredTextDoctestResult>(
						"tp-restructuredtext-doctest",
						{ bubbles: true, detail: result.doctest },
					),
				);
			}
		} catch (error) {
			if (token !== this.renderToken) return;
			const message = error instanceof Error ? error.message : String(error);
			this.outputElement.innerHTML = `<pre class="tp-restructuredtext-error" role="alert"><code>${escapeHtml(message)}</code></pre>`;
		}

		if (token !== this.renderToken) return;
		this.setAttribute("data-tp-restructuredtext-rendered", "");
		this.dispatchEvent(
			new CustomEvent("tp-restructuredtext-rendered", { bubbles: true }),
		);
	}

	private renderDoctestResults(result: TpRestructuredTextDoctestResult): void {
		const blocks = this.outputElement.querySelectorAll<HTMLElement>(
			"pre.doctest, pre.doctest-block",
		);

		for (const blockResult of result.blocks) {
			const block = blocks.item(blockResult.index);
			if (block === null) continue;
			const passed = blockResult.failed === 0;
			block.dataset.tpDoctest = passed ? "passed" : "failed";

			const report = document.createElement(passed ? "p" : "details");
			report.className = `tp-restructuredtext-doctest-result ${passed ? "is-passed" : "is-failed"}`;

			const message = `Doctest ${passed ? "passed" : "failed"} (${String(blockResult.passed)}/${String(blockResult.attempted)}).`;
			if (passed) {
				report.textContent = `✓ ${message}`;
				report.setAttribute("role", "status");
			} else {
				const summary = document.createElement("summary");
				summary.textContent = `✕ ${message}`;
				const output = document.createElement("pre");
				const code = document.createElement("code");
				code.textContent = blockResult.output;
				output.append(code);
				report.append(summary, output);
			}
			block.after(report);
		}
	}

	private async getRestructuredTextSource(): Promise<{
		source: string;
		currentUrl: URL;
	}> {
		const rawSrc = this.src.trim();
		if (rawSrc === "") {
			return {
				source: this.inlineSourceSnapshot,
				currentUrl: new URL(getComponentSourceBaseUrl(this)),
			};
		}

		const currentUrl = resolveComponentSourceUrl(this, rawSrc);
		const response = await fetch(currentUrl.href, { cache: "no-store" });
		if (!response.ok) {
			throw new Error(
				`Unable to load reStructuredText file: ${currentUrl.pathname} (${String(response.status)})`,
			);
		}
		return { source: await response.text(), currentUrl };
	}

	private readInlineSource(): string {
		const script = this.querySelector(
			':scope > script[type="tp/restructuredtext"]',
		);
		if (script instanceof HTMLScriptElement && script.textContent !== null) {
			return dedentRestructuredTextSource(script.textContent);
		}

		const code = this.querySelector(":scope > pre > code");
		if (code instanceof HTMLElement && code.textContent !== null) {
			return dedentRestructuredTextSource(code.textContent);
		}

		return this.innerHTML.trim();
	}
}

if (!customElements.get("tp-restructuredtext")) {
	customElements.define("tp-restructuredtext", TpRestructuredText);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-restructuredtext": TpRestructuredText;
	}
}
