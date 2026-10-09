/**
 * @module components/asciidoc
 * @summary Semantic AsciiDoc rendering component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-asciidoc https://www.npmjs.com/package/@tp/tp-asciidoc
 * @summary AsciiDoc parsing and rendering.
 */
// tp-docgen:dependencies:end

import { renderAdocViewers, TpAsciidocParser } from "@tp/tp-asciidoc";
import { labelMathSvg } from "../../utilities/math-accessibility.js";
import {
	getComponentSourceBaseUrl,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./asciidoc.css?inline";

const STYLE_ID = "tp-asciidoc-styles";

/** A configured parser instance used by the component runtime. */
type TpAsciidocParserInstance = InstanceType<typeof TpAsciidocParser>;

type AsciidocBrowserRuntime = Window & {
	hljs?: { highlightAll(): void };
	MathJax?: {
		startup?: { promise?: Promise<unknown> };
		typesetPromise?: (roots: ParentNode[]) => Promise<unknown>;
	};
};

/**
 * Serializable representation of an Asciidoctor document node.
 *
 * This deliberately exposes only stable structural properties so the value can
 * be displayed as JSON without leaking Opal runtime objects.
 */
export type AsciidocAstNode = {
	/** Asciidoctor node context, such as `document`, `section`, or `paragraph`. */
	context: string;
	/** Explicit node identifier, when present. */
	id?: string;
	/** Node title, when present. */
	title?: string;
	/** Node style, when present. */
	style?: string;
	/** Original source associated with the node, when available. */
	source?: string;
	/** Recursively serialized child blocks. */
	blocks?: AsciidocAstNode[];
};

type AsciidocNode = {
	getContext(): string;
	getId?(): string | undefined;
	getTitle?(): string | undefined;
	getStyle?(): string | undefined;
	getSource?(): string | undefined;
	getBlocks?(): unknown[];
	/** Raw list item text retained by the native Asciidoctor.js v4 node. */
	_text?: string | null;
};

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * Removes the HTML embedding indentation from AsciiDoc source.
 *
 * The first non-empty line defines the embedding depth. Each following line
 * loses at most that amount of leading whitespace. This remains reliable when
 * an outer Markdown renderer has already moved list markers to column zero.
 *
 * @param source Source read from an embedded script, template, or code block.
 * @returns Source normalized for Asciidoctor.
 */
export function dedentAsciidocSource(source: string): string {
	const markdownCodeTag = (tag: string): string =>
		`(?:<|&(?:amp;)*lt;)${tag}(?:>|&(?:amp;)*gt;)`;
	const openingWrapper = new RegExp(
		`${markdownCodeTag("pre")}\\s*${markdownCodeTag("code")}`,
		"gi",
	);
	const closingWrapper = new RegExp(
		`${markdownCodeTag("/code")}\\s*${markdownCodeTag("/pre")}`,
		"gi",
	);
	const normalizedSource = source
		.replace(openingWrapper, "\n")
		.replace(closingWrapper, "");
	const lines = normalizedSource.replace(/\r\n?/g, "\n").split("\n");
	while (lines.length > 0 && lines[0]?.trim() === "") lines.shift();
	while (lines.length > 0 && lines.at(-1)?.trim() === "") lines.pop();

	const firstContentLine = lines.find((line) => line.trim() !== "");
	const baseIndent = firstContentLine?.match(/^[\t ]*/)?.[0].length ?? 0;
	if (baseIndent === 0) return lines.join("\n");

	return lines
		.map((line) => {
			if (line.trim() === "") return "";
			const indent = line.match(/^[\t ]*/)?.[0].length ?? 0;
			return line.slice(Math.min(indent, baseIndent));
		})
		.join("\n");
}

function serializeNode(value: unknown): AsciidocAstNode {
	const node = value as AsciidocNode;
	const result: AsciidocAstNode = { context: node.getContext() };
	const id = node.getId?.();
	const title = node.getTitle?.();
	const nodeStyle = node.getStyle?.();
	const source =
		node.getSource?.() ??
		(node.getContext() === "list_item" ? node._text : undefined);
	const blocks = node.getBlocks?.() ?? [];

	if (id) result.id = id;
	if (title) result.title = title;
	if (nodeStyle) result.style = nodeStyle;
	if (source) result.source = source;
	if (blocks.length > 0) result.blocks = blocks.map(serializeNode);
	return result;
}

/**
 * Creates a parser configured with the semantic HTML converter and bundled extensions.
 *
 * @returns A new independent AsciiDoc parser.
 */
export function createTpAsciidocParser(): TpAsciidocParserInstance {
	return new TpAsciidocParser();
}

const FORWARDED_STYLE_ATTRIBUTE = "data-tp-asciidoc-html-style";

async function renderWithHtmlStyleAttributes(
	parser: TpAsciidocParserInstance,
	source: string,
): Promise<string> {
	const normalizedSource = source.replace(/^\[[^\r\n]*\]$/gm, (attributeList) =>
		attributeList.replace(
			/([,\s])style=(?=["'])/g,
			`$1${FORWARDED_STYLE_ATTRIBUTE}=`,
		),
	);
	return (await parser.render(normalizedSource)).replaceAll(
		` ${FORWARDED_STYLE_ATTRIBUTE}=`,
		" style=",
	);
}

/**
 * Converts AsciiDoc source to embeddable semantic HTML.
 *
 * @param source AsciiDoc source to convert.
 * @returns Generated semantic HTML.
 */
export async function renderAsciidocToHtml(source: string): Promise<string> {
	return renderWithHtmlStyleAttributes(createTpAsciidocParser(), source);
}

/**
 * Parses AsciiDoc source into a JSON-safe abstract syntax tree.
 *
 * @param source AsciiDoc source to parse.
 * @returns Serializable root document node.
 */
export async function parseAsciidocToAst(
	source: string,
): Promise<AsciidocAstNode> {
	return serializeNode(await createTpAsciidocParser().parse(source));
}

/**
 * Converts source into an element and initializes interactive `adocviewer` blocks.
 *
 * @param source AsciiDoc source to render.
 * @param root Element that receives the generated HTML.
 */
export async function renderAsciidocInto(
	source: string,
	root: HTMLElement,
): Promise<void> {
	const parser = createTpAsciidocParser();
	root.innerHTML = await renderWithHtmlStyleAttributes(parser, source);
	await renderAdocViewers(root, { parser });
	activateAsciidocBrowserAssets(root);
}

function getBrowserRenderOptions(currentUrl: URL): Record<string, unknown> {
	const baseDirectoryUrl = new URL(".", currentUrl).href.replace(/\/$/, "");

	return {
		safe: "safe",
		base_dir: baseDirectoryUrl,
		attributes: { "allow-uri-read": "" },
	};
}

/** Activates only the trusted browser assets emitted by the AsciiDoc postprocessor. */
function activateAsciidocBrowserAssets(root: HTMLElement): void {
	const ownerDocument = root.ownerDocument;
	const runtime = ownerDocument.defaultView as AsciidocBrowserRuntime | null;
	let waitsForMathJax = false;

	for (const previous of root.querySelectorAll<HTMLScriptElement>(
		"script[data-tp-asciidoc-asset]",
	)) {
		if (previous.dataset.tpAsciidocAsset === "mathjax" && previous.src) {
			if (runtime?.MathJax?.startup?.promise) {
				previous.remove();
				continue;
			}
			const existing = Array.from(ownerDocument.scripts).find(
				(candidate) => candidate !== previous && candidate.src === previous.src,
			);
			if (existing) {
				waitsForMathJax = true;
				existing.addEventListener(
					"load",
					() => initializeAsciidocBrowserAssets(runtime, root, true),
					{ once: true },
				);
				previous.remove();
				continue;
			}
		}
		const script = ownerDocument.createElement("script");
		for (const { name, value } of Array.from(previous.attributes)) {
			script.setAttribute(name, value);
		}
		script.textContent = previous.textContent;
		if (script.src !== "") {
			const isMathJax = script.dataset.tpAsciidocAsset === "mathjax";
			if (isMathJax) waitsForMathJax = true;
			script.addEventListener(
				"load",
				() => initializeAsciidocBrowserAssets(runtime, root, true),
				{
					once: true,
				},
			);
		}
		previous.replaceWith(script);
	}

	initializeAsciidocBrowserAssets(runtime, root, !waitsForMathJax);
}

function initializeAsciidocBrowserAssets(
	runtime: AsciidocBrowserRuntime | null,
	root: HTMLElement,
	allowMathJax: boolean,
): void {
	runtime?.hljs?.highlightAll();
	const containsMathJax =
		root.querySelector('[data-tp-asciidoc-asset="mathjax"]') !== null;
	if (
		allowMathJax &&
		containsMathJax &&
		runtime?.MathJax?.typesetPromise !== undefined
	) {
		const math = runtime.MathJax;
		void Promise.resolve(math.startup?.promise)
			.then(() => math.typesetPromise?.([root]))
			.then(() => labelMathSvg(root))
			.catch((error: unknown) =>
				console.warn("AsciiDoc math rendering failed.", error),
			);
	}
}

/**
 * Initializes interactive `adocviewer` blocks already present below a root node.
 *
 * @param root Root node containing rendered AsciiDoc HTML.
 */
export async function renderAsciidocRuntimeIn(root: ParentNode): Promise<void> {
	await renderAdocViewers(root, { parser: createTpAsciidocParser() });
}

/**
 * Renders inline or external AsciiDoc as semantic HTML.
 *
 * @tagname tp-asciidoc
 * @attr {string} src = "" - URL of an external AsciiDoc source file.
 * @event tp-asciidoc-rendered Emitted after conversion and runtime initialization complete.
 * @eventdetail tp-asciidoc-rendered void
 * @example
 * <tp-box><tp-asciidoc><script type="tp/asciidoc">This paragraph uses *AsciiDoc*.</script></tp-asciidoc></tp-box> 
 */
export class TpAsciidoc extends TpBase {
	/** Attributes that trigger a new source load and conversion. */
	public static get observedAttributes(): string[] {
		return ["src"];
	}

	private readonly outputElement = document.createElement("div");
	/** Reapply names after MathJax's responsive line breaking replaces SVGs. */
	private readonly mathObserver = new MutationObserver(() =>
		labelMathSvg(this.outputElement),
	);
	private renderToken = 0;
	private inlineSourceSnapshot = "";

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-asciidoc");
		this.outputElement.className = "tp-asciidoc-output";
		this.inlineSourceSnapshot = this.readInlineSource();
		this.ensureGlobalStyle(STYLE_ID, style);
		this.replaceChildren(this.outputElement);
		this.mathObserver.observe(this.outputElement, {
			childList: true,
			subtree: true,
		});
		void this.renderAsciidoc();
	}

	/** Stops observing detached output and invalidates pending source requests. */
	public disconnectedCallback(): void {
		this.mathObserver.disconnect();
		this.renderToken += 1;
	}

	protected attributeChangedCallback(): void {
		if (this.isConnected) void this.renderAsciidoc();
	}

	/**
	 * URL of an external AsciiDoc source file.
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

	private async renderAsciidoc(): Promise<void> {
		const token = ++this.renderToken;
		this.removeAttribute("data-tp-asciidoc-rendered");

		try {
			const { source, currentUrl } = await this.getAsciidocSource();
			if (token !== this.renderToken) return;
			this.setAttribute("data-tp-asciidoc-source", currentUrl.pathname);
			const parser = createTpAsciidocParser();
			parser.configure(getBrowserRenderOptions(currentUrl));
			this.outputElement.innerHTML = await renderWithHtmlStyleAttributes(
				parser,
				source,
			);
			await renderAdocViewers(this.outputElement, { parser });
			activateAsciidocBrowserAssets(this.outputElement);
		} catch (error) {
			if (token !== this.renderToken) return;
			const message = error instanceof Error ? error.message : String(error);
			this.outputElement.innerHTML = `<pre class="tp-asciidoc-error" role="alert"><code>${escapeHtml(message)}</code></pre>`;
		}

		if (token !== this.renderToken) return;
		this.setAttribute("data-tp-asciidoc-rendered", "");
		this.dispatchEvent(
			new CustomEvent("tp-asciidoc-rendered", { bubbles: true }),
		);
	}

	private async getAsciidocSource(): Promise<{
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
				`Unable to load AsciiDoc file: ${currentUrl.pathname} (${String(response.status)})`,
			);
		}
		return { source: await response.text(), currentUrl };
	}

	private readInlineSource(): string {
		const script = this.querySelector(':scope > script[type="tp/asciidoc"]');
		if (script instanceof HTMLScriptElement && script.textContent !== null) {
			return dedentAsciidocSource(script.textContent);
		}

		const code = this.querySelector(":scope > pre > code");
		if (code instanceof HTMLElement && code.textContent !== null) {
			return dedentAsciidocSource(code.textContent);
		}

		return this.innerHTML.trim();
	}
}

if (!customElements.get("tp-asciidoc")) {
	customElements.define("tp-asciidoc", TpAsciidoc);
}
