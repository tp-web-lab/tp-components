/**
 * @module components/markdown
 * @summary Markdown rendering component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
 * @summary Markdown parsing and rendering.
 */
// tp-docgen:dependencies:end

import type { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";
import { executeAllowedScripts } from "@tp/tp-markdown/markdown/engine/markdown-execute-allowed-scripts";
import {
	createTpMarkdownParser,
	renderProtectedMarkdown,
} from "../../utilities/markdown-source.js";

export {
	createTpMarkdownParser,
	parseMarkdownToTokens,
	renderMarkdownToHtml,
} from "../../utilities/markdown-source.js";

import { dedent } from "../../utilities/code.js";
import { labelMathSvg } from "../../utilities/math-accessibility.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./markdown.css?inline";

const STYLE_ID = "tp-markdown-styles";
const MAX_INCLUDE_DEPTH = 12;
type MarkdownIncludeMode = "auto" | "raw";

type TpMarkdownParserInstance = InstanceType<typeof TpMarkdownParser>;
type TpMarkdownRuntimeOptions = Parameters<
	TpMarkdownParserInstance["renderRuntime"]
>[1];
type MarkdownRuntimeTask = () => Promise<void>;

let markdownRuntimeQueue = Promise.resolve();

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export async function renderMarkdownInto(
	source: string,
	root: HTMLElement,
	path = "/index.md",
): Promise<void> {
	const parser = createTpMarkdownParser(path);
	const content = await prepareMarkdownContent(parser, source);
	root.replaceChildren(content);
	await runMarkdownRuntime(parser, root);
}

/** Completes formulas in inert content before custom elements copy their answers. */
async function prepareMarkdownContent(
	parser: TpMarkdownParserInstance,
	source: string,
): Promise<DocumentFragment> {
	const template = document.createElement("template");
	template.innerHTML = await renderProtectedMarkdown(parser, source);
	if (
		template.content.querySelector(
			"[data-mathjax-tex], [data-mathjax-asciimath]",
		)
	) {
		await parser.renderRuntime(template.content, { only: ["math"] });
		labelMathSvg(template.content);
	}
	return template.content;
}

export async function renderMarkdownRuntimeIn(
	root: ParentNode,
	path = "/index.md",
): Promise<void> {
	await runMarkdownRuntime(createTpMarkdownParser(path), root);
}

/**
 * @summary Markdown rendering component.
 * @tagname tp-markdown
 * @example
 * <tp-markdown><script type="tp/markdown">This paragraph uses **Markdown**.</script></tp-markdown>
 */
export class TpMarkdown extends TpBase {
	public static get observedAttributes(): string[] {
		return ["src"];
	}

	private readonly outputElement = document.createElement("div");
	private renderToken = 0;
	private inlineSourceSnapshot = "";

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-markdown");
		this.outputElement.className = "tp-markdown-output";
		this.inlineSourceSnapshot = this.readInlineSource();
		this.ensureGlobalStyle(STYLE_ID, style);
		this.replaceChildren(this.outputElement);
		void this.renderMarkdown();
	}

	protected attributeChangedCallback(): void {
		if (!this.isConnected) return;
		void this.renderMarkdown();
	}

	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	public set src(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", value);
	}

	private async renderMarkdown(): Promise<void> {
		const token = ++this.renderToken;
		this.removeAttribute("data-tp-markdown-rendered");

		try {
			const { source, currentUrl } = await this.getMarkdownSource();
			const resolvedSource = await this.resolveIncludes(source, currentUrl);

			if (token !== this.renderToken) return;
			this.setAttribute("data-tp-markdown-source", currentUrl.pathname);
			const parser = createTpMarkdownParser(this.src.trim() || "/index.md");
			const content = await prepareMarkdownContent(parser, resolvedSource);
			if (token !== this.renderToken) return;
			this.outputElement.replaceChildren(content);

			void this.renderMarkdownRuntime(parser)
				.then(() => {
					if (token !== this.renderToken) return;
					this.setAttribute("data-tp-markdown-rendered", "");
					this.dispatchEvent(
						new CustomEvent("tp-markdown-rendered", {
							bubbles: true,
						}),
					);
				})
				.catch((error: unknown) => {
					console.error("Unable to run markdown runtime extensions", error);
				});
		} catch (error) {
			if (token !== this.renderToken) return;
			const message = error instanceof Error ? error.message : String(error);
			this.outputElement.innerHTML = `<pre class="tp-markdown-error" role="alert"><code>${escapeHtml(message)}</code></pre>`;
			this.setAttribute("data-tp-markdown-rendered", "");
			this.dispatchEvent(
				new CustomEvent("tp-markdown-rendered", {
					bubbles: true,
				}),
			);
		}
	}

	private async getMarkdownSource(): Promise<{
		source: string;
		currentUrl: URL;
	}> {
		const rawSrc = this.src.trim();

		if (rawSrc !== "") {
			const currentUrl = this.resolveSourceUrl(rawSrc);
			const response = await fetch(currentUrl.href, { cache: "no-store" });
			if (!response.ok) {
				throw new Error(
					`Unable to load Markdown file: ${currentUrl.pathname} (${String(response.status)})`,
				);
			}
			return {
				source: await response.text(),
				currentUrl,
			};
		}

		return {
			source: this.inlineSourceSnapshot,
			currentUrl: new URL(window.location.href, document.baseURI),
		};
	}

	private resolveSourceUrl(src: string): URL {
		return resolveComponentSourceUrl(this, src);
	}

	private readInlineSource(): string {
		const script = this.querySelector(':scope > script[type="tp/markdown"]');
		if (script instanceof HTMLScriptElement && script.textContent !== null) {
			return dedent(script.textContent);
		}

		const code = this.querySelector(":scope > pre > code");
		if (code instanceof HTMLElement && code.textContent !== null) {
			return dedent(code.textContent);
		}

		return this.innerHTML.trim();
	}

	private async renderMarkdownRuntime(
		parser: TpMarkdownParserInstance,
	): Promise<void> {
		await runMarkdownRuntime(parser, this.outputElement);
	}

	private async resolveIncludes(
		markdown: string,
		currentUrl: URL,
		depth = 0,
	): Promise<string> {
		if (depth > MAX_INCLUDE_DEPTH) {
			throw new Error("Include depth exceeded.");
		}

		const includePattern = /(^[^\S\r\n]*:?[^\S\r\n]*)?::include\{([^}]+)\}/gm;
		const parts: string[] = [];
		let lastIndex = 0;

		for (const match of markdown.matchAll(includePattern)) {
			const index = match.index;
			const prefix = match[1] ?? "";
			const include = parseMarkdownInclude(match[2] ?? "");
			const includePath = include.path;

			if (
				index === undefined ||
				includePath === undefined ||
				includePath === ""
			) {
				continue;
			}

			parts.push(markdown.slice(lastIndex, index));
			parts.push(
				this.applyIncludePrefix(
					await this.renderInclude(
						includePath,
						currentUrl,
						depth,
						include.mode,
					),
					prefix,
				),
			);
			lastIndex = index + match[0].length;
		}

		parts.push(markdown.slice(lastIndex));
		return parts.join("");
	}

	private applyIncludePrefix(content: string, prefix: string): string {
		if (prefix === "") {
			return content;
		}

		const definitionPrefix = prefix.match(/^([^\S\r\n]*):([^\S\r\n]*)$/);

		if (definitionPrefix !== null) {
			const continuationPrefix = `${definitionPrefix[1] ?? ""}${" ".repeat(
				1 + (definitionPrefix[2]?.length ?? 0),
			)}`;

			if (/^:{3,}\s+[a-z]/i.test(content)) {
				return `${definitionPrefix[1] ?? ""}:\n${content
					.split("\n")
					.map((line) => `${continuationPrefix}${line}`)
					.join("\n")}`;
			}

			return content
				.split("\n")
				.map(
					(line, index) =>
						`${index === 0 ? prefix : continuationPrefix}${line}`,
				)
				.join("\n");
		}

		return content
			.split("\n")
			.map((line) => `${prefix}${line}`)
			.join("\n");
	}

	private async renderInclude(
		includePath: string,
		currentUrl: URL,
		depth: number,
		mode: MarkdownIncludeMode,
	): Promise<string> {
		const includeUrl = new URL(includePath, currentUrl);
		const pathname = includeUrl.pathname.toLowerCase();

		if (mode === "raw") {
			const response = await fetch(includeUrl.href, { cache: "no-store" });
			if (!response.ok) {
				return `Unable to include file: ${includeUrl.pathname} (${String(response.status)})`;
			}
			return response.text();
		}

		if (pathname.endsWith(".adoc") || pathname.endsWith(".asciidoc")) {
			return `<tp-asciidoc src="${escapeHtml(includeUrl.href)}"></tp-asciidoc>`;
		}

		if (pathname.endsWith(".rst") || pathname.endsWith(".rest")) {
			return `<tp-restructuredtext src="${escapeHtml(includeUrl.href)}"></tp-restructuredtext>`;
		}

		if (pathname.endsWith(".html") || pathname.endsWith(".htm")) {
			return `<tp-include src="${escapeHtml(includeUrl.href)}"></tp-include>`;
		}

		const response = await fetch(includeUrl.href, { cache: "no-store" });

		if (!response.ok) {
			return `<pre class="tp-markdown-error"><code>Unable to include file: ${escapeHtml(includeUrl.pathname)} (${String(response.status)})</code></pre>`;
		}

		const content = await response.text();
		if (pathname.endsWith(".md")) {
			return this.resolveIncludes(content, includeUrl, depth + 1);
		}

		if (pathname.endsWith(".svg")) {
			return content;
		}

		return `<pre><code>${escapeHtml(content)}</code></pre>`;
	}
}

function parseMarkdownInclude(value: string): {
	path: string;
	mode: MarkdownIncludeMode;
} {
	const modePattern =
		/(?:^|\s)mode\s*=\s*(?:"(auto|raw)"|'(auto|raw)'|(auto|raw))(?=\s|$)/i;
	const match = value.match(modePattern);
	const selectedMode = (
		match?.[1] ??
		match?.[2] ??
		match?.[3] ??
		"auto"
	).toLowerCase();

	return {
		path: (match === null ? value : value.replace(modePattern, "")).trim(),
		mode: selectedMode === "raw" ? "raw" : "auto",
	};
}

if (!customElements.get("tp-markdown")) {
	customElements.define("tp-markdown", TpMarkdown);
}

async function runMarkdownRuntime(
	parser: TpMarkdownParserInstance,
	root: ParentNode,
	options?: TpMarkdownRuntimeOptions,
): Promise<void> {
	await enqueueMarkdownRuntime(async () => {
		await parser.renderRuntime(root, options);
		// Match parser.renderInto(): only explicitly trusted, connected containers
		// may activate scripts. Inert content preparation must never execute them.
		if (root instanceof HTMLElement && root.isConnected && !options?.only) {
			executeAllowedScripts(root);
		}
	});
}

async function enqueueMarkdownRuntime(
	task: MarkdownRuntimeTask,
): Promise<void> {
	const run = markdownRuntimeQueue.then(task);
	markdownRuntimeQueue = run.catch(() => {});
	await run;
}
