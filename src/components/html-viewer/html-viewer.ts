/**
 * @module components/html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
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

import { dedent } from "../../utilities/code.js";
import { formatHtmlForDisplay } from "../../utilities/html-code.js";
import {
	getComponentSourceBaseUrl,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
import type {
	MarkupViewerExample,
	MarkupViewerMode,
} from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import type { TpObjectTree } from "../object-tree/object-tree.js";
import style from "./html-viewer.css?inline";
import "../object-tree/object-tree.js";

/**
 * Supported two-pane layout modes.
 */
type HtmlViewerMode = "render" | "dom";

/**
 * One viewer example entry.
 */
type HtmlViewerContext = {
	baseHref: string | null;
};
type HtmlViewerExample = MarkupViewerExample<HtmlViewerContext>;
type HtmlViewerSource = { source: string } & HtmlViewerContext;

/**
 * Global stylesheet identifier injected once per document.
 */
const STYLE_ID = "tp-html-viewer-styles";
const OUTPUT_MODES: readonly MarkupViewerMode<HtmlViewerMode>[] = [
	{ value: "render", label: "Rendered HTML" },
	{ value: "dom", label: "DOM tree" },
];
const VIEWER_LOADER_COMMENT =
	"<!-- Added by tp-html-viewer to load custom tp-* elements in the visualisation panel. -->";
const VIEWER_LOADER_IMPORT = `<script type="module">
  import '/tp-loader.js';
</script>`;
const VIEWER_LOADER_BLOCK = `${VIEWER_LOADER_COMMENT}
${VIEWER_LOADER_IMPORT}`;
const HTML_VOID_TAGS = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);

function escapeAttribute(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

const USER_FACING_TP_DATA_ATTRIBUTES = new Set([
	"data-tp-color-scope",
	"data-tp-toc-scope",
	"data-tp-reference-scope",
]);
const GENERATED_COLOR_PRESET_CLASSES = new Set([
	"tp-default",
	"tp-red",
	"tp-orange",
	"tp-amber",
	"tp-yellow",
	"tp-lime",
	"tp-green",
	"tp-emerald",
	"tp-teal",
	"tp-glaz",
	"tp-cyan",
	"tp-sky",
	"tp-blue",
	"tp-indigo",
	"tp-violet",
	"tp-purple",
	"tp-fuchsia",
	"tp-pink",
	"tp-rose",
	"tp-zinc",
	"tp-ivory",
	"tp-stone",
]);

function isInternalViewerAttribute(name: string): boolean {
	return (
		name === "data-source" ||
		name === "data-tp-base-host" ||
		(name.startsWith("data-tp-") && !USER_FACING_TP_DATA_ATTRIBUTES.has(name))
	);
}

function isInternalViewerElement(element: Element): boolean {
	if (element.localName.startsWith("tp-")) {
		return false;
	}

	return Array.from(element.attributes).some(
		(attribute) =>
			attribute.name.startsWith("data-tp-") &&
			!USER_FACING_TP_DATA_ATTRIBUTES.has(attribute.name),
	);
}

function isGeneratedViewerElement(element: Element): boolean {
	if (
		element.classList.contains("tp-color-option") ||
		element.classList.contains("tp-color-swatch") ||
		element.classList.contains("tp-theme-option") ||
		element.classList.contains("tp-theme-option-icon") ||
		element.classList.contains("tp-dir-option") ||
		element.classList.contains("tp-dir-option-icon") ||
		element.classList.contains("tp-lang-option") ||
		element.classList.contains("tp-lang-option-icon")
	) {
		return true;
	}

	if (element.tagName.toLowerCase() === "ul") {
		const items = Array.from(element.children);
		return (
			items.length > 0 &&
			items.every(
				(child) =>
					child.classList.contains("tp-color-option") ||
					child.classList.contains("tp-theme-option") ||
					child.classList.contains("tp-dir-option") ||
					child.classList.contains("tp-lang-option"),
			)
		);
	}

	if (element.tagName.toLowerCase() === "tp-dropdown") {
		return (
			element.querySelector(".tp-color-option") !== null ||
			element.querySelector(".tp-theme-option") !== null ||
			element.querySelector(".tp-dir-option") !== null ||
			element.querySelector(".tp-lang-option") !== null
		);
	}

	return false;
}

function sanitizeViewerStyleAttribute(element: Element, value: string): string {
	const keptDeclarations: string[] = [];

	for (const declaration of value.split(";")) {
		const trimmed = declaration.trim();
		if (trimmed === "") {
			continue;
		}

		const separatorIndex = trimmed.indexOf(":");
		if (separatorIndex === -1) {
			keptDeclarations.push(trimmed);
			continue;
		}

		const property = trimmed.slice(0, separatorIndex).trim();
		const propertyValue = trimmed.slice(separatorIndex + 1).trim();
		// Custom properties are part of the author's styling contract, not generated UI.

		if (element.localName === "tp-center") {
			const maxInlineSize = element.getAttribute("max-inline-size");
			const paddingInline = element.getAttribute("padding-inline");
			if (
				(property === "max-inline-size" && maxInlineSize === propertyValue) ||
				(property === "text-align" &&
					element.hasAttribute("center-text") &&
					propertyValue === "center") ||
				((property === "padding-inline-start" ||
					property === "padding-inline-end") &&
					paddingInline === propertyValue)
			) {
				continue;
			}
		}

		if (element.localName === "tp-cluster") {
			const justify = element.getAttribute("justify") ?? "flex-start";
			const align = element.getAttribute("align") ?? "center";
			const gap = element.getAttribute("gap") ?? "var(--tp-cluster-gap, 1rem)";
			if (
				(property === "justify-content" && propertyValue === justify) ||
				(property === "align-items" && propertyValue === align) ||
				(property === "gap" && propertyValue === gap)
			) {
				continue;
			}
		}

		keptDeclarations.push(trimmed);
	}

	return keptDeclarations.join("; ");
}

function sanitizeViewerClassAttribute(value: string): string {
	const classes = value
		.split(/\s+/)
		.map((className) => className.trim())
		.filter((className) => className !== "");

	return classes
		.filter(
			(className) =>
				className !== "tp-light" &&
				className !== "tp-dark" &&
				!GENERATED_COLOR_PRESET_CLASSES.has(className),
		)
		.join(" ");
}

function isGeneratedAccordionId(element: Element, attribute: Attr): boolean {
	if (attribute.name !== "id") {
		return false;
	}

	if (element.localName === "dt") {
		const match = attribute.value.match(/^(.*)-summary-(\d+)$/);
		return (
			match !== null &&
			element.getAttribute("role") === "button" &&
			element.getAttribute("aria-controls") ===
				`${match[1] ?? ""}-content-${match[2] ?? ""}`
		);
	}

	if (element.localName === "dd") {
		const match = attribute.value.match(/^(.*)-content-(\d+)$/);
		return (
			match !== null &&
			element.getAttribute("role") === "region" &&
			element.getAttribute("aria-labelledby") ===
				`${match[1] ?? ""}-summary-${match[2] ?? ""}`
		);
	}

	return false;
}

function isGeneratedViewerAttribute(
	element: Element,
	attribute: Attr,
): boolean {
	const tagName = element.tagName.toLowerCase();

	if (element.closest("tp-accordion") !== null) {
		if (tagName === "dt") {
			return (
				attribute.name === "role" ||
				attribute.name === "tabindex" ||
				attribute.name === "aria-expanded" ||
				attribute.name === "aria-controls" ||
				attribute.name === "data-index" ||
				isGeneratedAccordionId(element, attribute)
			);
		}

		if (tagName === "dd") {
			return (
				attribute.name === "role" ||
				attribute.name === "aria-labelledby" ||
				attribute.name === "hidden" ||
				attribute.name === "data-index" ||
				isGeneratedAccordionId(element, attribute)
			);
		}
	}

	if (
		element.closest("tp-dropdown[data-source]") !== null &&
		tagName !== "tp-dropdown"
	) {
		return (
			attribute.name === "role" ||
			attribute.name === "tabindex" ||
			attribute.name === "aria-haspopup" ||
			attribute.name === "aria-expanded"
		);
	}

	if (tagName === "tp-dropdown") {
		return (
			attribute.name === "style" ||
			attribute.name === "data-open" ||
			(attribute.name === "placement" && attribute.value === "bottom") ||
			(attribute.name === "offset" && attribute.value === "8px")
		);
	}

	if (element.closest("tp-dropdown") !== null) {
		return (
			attribute.name === "tabindex" ||
			attribute.name === "aria-haspopup" ||
			attribute.name === "aria-expanded"
		);
	}

	if (tagName === "tp-color") {
		if (
			attribute.name === "id" &&
			/^tp-color-[a-z0-9]+$/i.test(attribute.value)
		) {
			return true;
		}

		if (attribute.name === "preset" && attribute.value === "tp-default") {
			return true;
		}
	}

	return false;
}

function serializeViewerSourceNode(node: ChildNode): string {
	if (node.nodeType === Node.TEXT_NODE) {
		return escapeHtml(node.textContent ?? "");
	}

	if (!(node instanceof Element)) {
		return "";
	}

	const storedSource = node.getAttribute("data-source");
	if (storedSource !== null && storedSource !== "") {
		return sanitizeViewerSource(storedSource);
	}

	if (isInternalViewerElement(node)) {
		return "";
	}

	if (isGeneratedViewerElement(node)) {
		return "";
	}

	const tagName = node.tagName.toLowerCase();
	const attributes = Array.from(node.attributes)
		.filter((attribute) => !isInternalViewerAttribute(attribute.name))
		.filter((attribute) => !isGeneratedViewerAttribute(node, attribute))
		.flatMap((attribute) => {
			const value =
				attribute.name === "style"
					? sanitizeViewerStyleAttribute(node, attribute.value)
					: attribute.name === "class"
						? sanitizeViewerClassAttribute(attribute.value)
						: attribute.value;
			if (
				(attribute.name === "style" || attribute.name === "class") &&
				value === ""
			) {
				return [];
			}

			return [
				value === ""
					? attribute.name
					: `${attribute.name}="${escapeAttribute(value)}"`,
			];
		});
	const openTag = [tagName, ...attributes].join(" ");
	if (HTML_VOID_TAGS.has(tagName)) {
		return `<${openTag}>`;
	}

	if (
		tagName === "tp-color" ||
		tagName === "tp-theme" ||
		tagName === "tp-dir" ||
		tagName === "tp-lang"
	) {
		return `<${openTag}></${tagName}>`;
	}

	if (tagName === "script" || tagName === "style") {
		return `<${openTag}>${node.textContent ?? ""}</${tagName}>`;
	}

	const children = Array.from(node.childNodes)
		.map((child) => serializeViewerSourceNode(child))
		.join("");

	return `<${openTag}>${children}</${tagName}>`;
}

function sanitizeViewerSource(source: string): string {
	const template = document.createElement("template");
	template.innerHTML = source;
	return Array.from(template.content.childNodes)
		.map((node) => serializeViewerSourceNode(node))
		.join("")
		.trim();
}

/**
 * Collapses whitespace to a single-space normalized line.
 *
 * @param value Raw text value.
 * @returns Normalized text.
 */
function normalizeText(value: string): string {
	return value.replace(/\s+/g, " ").trim();
}

type HtmlDomTreeNode = {
	nodeName: string;
	attributes?: Record<string, string>;
	value?: string;
	children?: HtmlDomTreeNode[];
};

/** Serializes one DOM node into a JSON-safe tree node. */
function serializeDomNode(node: ChildNode): HtmlDomTreeNode | null {
	if (node.nodeType === Node.TEXT_NODE) {
		const text = normalizeText(node.textContent ?? "");
		return text === "" ? null : { nodeName: "#text", value: text };
	}

	if (node.nodeType !== Node.ELEMENT_NODE) {
		return null;
	}

	const element = node as Element;
	const attributes = Object.fromEntries(
		Array.from(element.attributes, (attribute) => [
			attribute.name,
			attribute.value,
		]),
	);
	const children = Array.from(element.childNodes)
		.map(serializeDomNode)
		.filter((child): child is HtmlDomTreeNode => child !== null);
	return {
		nodeName: element.tagName.toLowerCase(),
		...(Object.keys(attributes).length > 0 ? { attributes } : {}),
		...(children.length > 0 ? { children } : {}),
	};
}

/**
 * Produces a JSON-safe DOM tree from HTML source.
 *
 * @param source HTML source.
 * @returns Serializable document fragment tree.
 */
function renderDomTree(source: string): HtmlDomTreeNode {
	const parser = new DOMParser();
	const doc = parser.parseFromString(source, "text/html");
	const children = Array.from(doc.body.childNodes)
		.map(serializeDomNode)
		.filter((child): child is HtmlDomTreeNode => child !== null);
	return { nodeName: "#document-fragment", children };
}

/**
 * Detects whether the current runtime is served by Vite dev.
 *
 * @returns Whether Vite client is present in the host document.
 */
function isViteDevRuntime(): boolean {
	return (
		document.querySelector('script[src*="/@vite/client"]') !== null ||
		new URL(import.meta.url).pathname.includes("/src/")
	);
}

/**
 * Rewrites legacy distribution paths before applying runtime-specific paths.
 *
 * @param html HTML source.
 * @returns Normalized HTML source.
 */
function rewriteLegacyDistComponentPaths(html: string): string {
	return html
		.replaceAll("/dist/components/", "/components/")
		.replaceAll("/dist/tp-loader.js", "/tp-loader.js");
}

/**
 * Rewrites package component imports to source files for Vite dev.
 *
 * @param html HTML source.
 * @returns HTML source with dev component paths.
 */
function rewriteComponentPathsToSource(html: string): string {
	let out = html;
	out = out.replace(/(["'])\/components\//g, "$1/src/components/");
	out = out.replace(/(["'])\.\/components\//g, "$1/src/components/");
	out = out.replace(/(["'])components\//g, "$1/src/components/");
	out = out.replace(
		/\/src\/components\/([^"'\s?#]+)\.js/g,
		"/src/components/$1.ts",
	);
	out = out.replace(/(["'])\/tp-loader\.js/g, "$1/src/tp-loader.ts");
	out = out.replace(/(["'])\.\/tp-loader\.js/g, "$1/src/tp-loader.ts");
	out = out.replace(/(["'])tp-loader\.js/g, "$1/src/tp-loader.ts");
	return out;
}

function getRuntimeDistUrl(path: string): string {
	const moduleUrl = new URL(import.meta.url);
	const distRootUrl =
		moduleUrl.pathname.includes("/chunks/") &&
		!moduleUrl.pathname.includes("/src/chunks/")
			? new URL("../", moduleUrl)
			: moduleUrl.pathname.includes("/components/") &&
					!moduleUrl.pathname.includes("/src/components/")
				? new URL("../../", moduleUrl)
				: new URL("./dist/", getSafeDocumentBaseUrl() ?? window.location.href);

	return new URL(path, distRootUrl).href;
}

function getSafeDocumentBaseUrl(): string | null {
	const candidates = [document.baseURI, window.location.href];

	for (const candidate of candidates) {
		if (isUsableBaseUrl(candidate)) {
			return candidate;
		}
	}

	try {
		if (
			window.parent !== window &&
			isUsableBaseUrl(window.parent.document.baseURI)
		) {
			return window.parent.document.baseURI;
		}
	} catch {
		// Ignore cross-origin parents.
	}

	return null;
}

function isUsableBaseUrl(value: string | null | undefined): value is string {
	if (value === undefined || value === null || value === "") {
		return false;
	}

	try {
		const url = new URL(value);
		return (
			url.protocol === "http:" ||
			url.protocol === "https:" ||
			url.protocol === "file:"
		);
	} catch {
		return false;
	}
}

/**
 * Rewrites component import paths so iframe examples can run in dev and build runtimes.
 *
 * @param html HTML source.
 * @returns HTML source with runtime component paths.
 */
function rewriteComponentPathsForRuntime(html: string): string {
	if (isViteDevRuntime()) {
		return rewriteComponentPathsToSource(html);
	}

	let out = html;
	const componentsUrl = getRuntimeDistUrl("components/");
	const loaderUrl = getRuntimeDistUrl("tp-loader.js");

	out = out.replace(/(["'])\/components\//g, `$1${componentsUrl}`);
	out = out.replace(/(["'])\.\/components\//g, `$1${componentsUrl}`);
	out = out.replace(/(["'])components\//g, `$1${componentsUrl}`);
	out = out.replace(/(["'])\/tp-loader\.js/g, `$1${loaderUrl}`);
	out = out.replace(/(["'])\.\/tp-loader\.js/g, `$1${loaderUrl}`);
	out = out.replace(/(["'])tp-loader\.js/g, `$1${loaderUrl}`);
	return out;
}

function sourceContainsTpElement(source: string): boolean {
	return /<tp-[a-z0-9-]+(?:\s|>|\/)/i.test(source);
}

function sourceImportsTpLoader(source: string): boolean {
	return /(?:import\s*\(?\s*["'][^"']*tp-loader\.(?:js|ts)["']|<script\b[^>]+src=["'][^"']*tp-loader\.(?:js|ts)["'])/i.test(
		source,
	);
}

function addTpLoaderImport(source: string): string {
	if (!sourceContainsTpElement(source) || sourceImportsTpLoader(source)) {
		return source;
	}

	return `${source.trimEnd()}


${VIEWER_LOADER_BLOCK}`;
}

function formatViewerSourceForDisplay(source: string): string {
	return formatHtmlForDisplay(source).replace(
		VIEWER_LOADER_COMMENT,
		`\n${VIEWER_LOADER_COMMENT}`,
	);
}

function isComponentImportOnlyScript(script: HTMLScriptElement): boolean {
	const source = script.textContent?.trim() ?? "";
	if (source === "") {
		return false;
	}

	return /^(?:import\s+["']\/?components\/[a-z0-9-]+\/[a-z0-9-]+\.js["'];?\s*)+$/i.test(
		source,
	);
}

function preferTpLoaderImport(source: string): string {
	if (!sourceContainsTpElement(source) || sourceImportsTpLoader(source)) {
		return source;
	}

	const template = document.createElement("template");
	template.innerHTML = source;
	const componentImportScripts = Array.from(
		template.content.querySelectorAll<HTMLScriptElement>(
			'script[type="module"]',
		),
	).filter(isComponentImportOnlyScript);

	if (componentImportScripts.length === 0) {
		return addTpLoaderImport(source);
	}

	const loaderTemplate = document.createElement("template");
	loaderTemplate.innerHTML = VIEWER_LOADER_BLOCK;
	componentImportScripts[0]?.replaceWith(
		loaderTemplate.content.cloneNode(true),
	);

	for (const script of componentImportScripts.slice(1)) {
		script.remove();
	}

	return template.innerHTML.trim();
}

function createIframeBaseElement(baseHref: string | null): string {
	if (baseHref === null) return "";
	return `    <base href="${escapeAttribute(baseHref)}" />\n`;
}

function getDirectoryBaseHref(url: URL): string {
	const pathname = url.pathname.endsWith("/")
		? url.pathname
		: url.pathname.slice(0, url.pathname.lastIndexOf("/") + 1);

	return new URL(`${pathname}${url.search}`, url.origin).href;
}

function addIframeBaseElement(html: string, baseHref: string | null): string {
	if (baseHref === null || /<base[\s>]/i.test(html)) {
		return html;
	}

	const baseElement = createIframeBaseElement(baseHref);
	if (/<head[\s>]/i.test(html)) {
		return html.replace(/<head([^>]*)>/i, `<head$1>\n${baseElement}`);
	}

	if (/<html[\s>]/i.test(html)) {
		return html.replace(
			/<html([^>]*)>/i,
			`<html$1>\n  <head>\n${baseElement}  </head>`,
		);
	}

	return html;
}

function resolveIframeBaseHref(host: HTMLElement): string | null {
	const baseUrl = getSafeDocumentBaseUrl();

	if (baseUrl === null) {
		return null;
	}

	try {
		const url = new URL(getComponentSourceBaseUrl(host), baseUrl);
		return getDirectoryBaseHref(url);
	} catch {
		return null;
	}
}

/**
 * Builds the iframe document used for live preview.
 *
 * @param source User HTML source.
 * @param baseHref Base URL used to resolve relative assets.
 * @returns Complete HTML document.
 */
export function buildIframeDocument(
	source: string,
	baseHref: string | null,
	loadTpComponents = true,
): string {
	const normalized = rewriteComponentPathsForRuntime(
		rewriteLegacyDistComponentPaths(
			loadTpComponents ? addTpLoaderImport(source) : source,
		),
	);
	const trimmed = normalized.trim();
	const hasHtmlTag = /<html[\s>]/i.test(trimmed);
	const hasDoctype = /^<!doctype\s+html[\s>]/i.test(trimmed);

	// The iframe has its own custom-element registry. Keep unupgraded markup
	// (including question solutions) out of the first paint while its loader runs.
	const pendingStyle = loadTpComponents
		? "<style data-tp-viewer-pending-components>:not(:defined):not(mjx-container):not(mjx-container *) { display: none !important; }</style>"
		: "";
	// Leave room inside the viewport for component borders and focus outlines.
	const documentStyle = `<style data-tp-viewer-spacing>html > body { margin: 0; padding: 0.5rem; box-sizing: border-box; }</style>${pendingStyle}`;

	if (hasDoctype || hasHtmlTag) {
		const documentSource = addIframeBaseElement(trimmed, baseHref);
		if (/<head[\s>]/i.test(documentSource)) {
			return documentSource.replace(
				/<head([^>]*)>/i,
				`<head$1>\n${documentStyle}`,
			);
		}
		if (/<html[\s>]/i.test(documentSource)) {
			return documentSource.replace(
				/<html([^>]*)>/i,
				`<html$1><head>${documentStyle}</head>`,
			);
		}
		return documentSource.replace(
			/^(<!doctype[^>]*>)/i,
			`$1\n${documentStyle}`,
		);
	}

	return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${documentStyle}
${createIframeBaseElement(baseHref)}
  </head>
  <body>
${normalized}
  </body>
</html>`;
}

/**
 * Reads `role="example"` blocks from an HTML fixture.
 *
 * @param source Raw fixture source.
 * @returns Parsed examples.
 */
function readExamples(
	source: string,
	context: HtmlViewerContext,
	loadTpComponents = true,
): HtmlViewerExample[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(source, "text/html");
	const root = doc.body;

	const examples = Array.from(
		root.querySelectorAll<HTMLElement>('div[role="example"]'),
	).map((example, index) => ({
		label:
			example.getAttribute("label")?.trim() || `Example ${String(index + 1)}`,
		source: loadTpComponents
			? preferTpLoaderImport(sanitizeViewerSource(example.innerHTML))
			: sanitizeViewerSource(example.innerHTML),
		context,
	}));

	if (examples.length > 0) return examples;
	return [
		{
			label: "Example",
			source: loadTpComponents
				? preferTpLoaderImport(sanitizeViewerSource(source))
				: sanitizeViewerSource(source),
			context,
		},
	];
}

/**
 * Interactive HTML viewer component.
 *
 * @tagname tp-html-viewer
 * @attr {boolean} allow-script = false - Allows executable scripts in the rendered example.
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {boolean} no-loader = false - Disables automatic tp-loader injection when the example manages its own imports.
 * @attr {string} src = "" - URL of the HTML file to load into the viewer.
 * @example
 * <tp-html-viewer></tp-html-viewer>
 */
export class TpHtmlViewer extends TpMarkupViewer<
	HtmlViewerMode,
	HtmlViewerContext
> {
	public static override get observedAttributes(): string[] {
		return [...TpMarkupViewer.observedAttributes, "allow-script", "no-loader"];
	}

	protected readonly sourceLanguage = "html";
	protected readonly outputModes = OUTPUT_MODES;
	protected readonly viewerClassName = "tp-html-viewer";
	protected override readonly deferInitialRender = true;

	private overrideSource: HtmlViewerSource | null = null;
	private overrideResetSource: string | null = null;
	private initialInlineExample: HtmlViewerExample | null = null;

	/**
	 * Replaces the viewer input source and refreshes the preview.
	 *
	 * @summary Sets the HTML source from code.
	 * @param source HTML source to display and render.
	 * @param baseHref Optional base URL used to resolve relative assets.
	 * @param resetSource Optional source used by the viewer reset button.
	 */
	public setSource(
		source: string,
		baseHref: string | null = null,
		resetSource = source,
	): void {
		this.overrideSource = {
			source,
			baseHref,
		};
		this.overrideResetSource = resetSource;
		this.removeAttribute("src");
		this.requestViewerRender();
	}

	protected override connectedCallback(): void {
		if (
			this.initialInlineExample === null &&
			this.overrideSource === null &&
			this.src.trim() === ""
		) {
			this.initialInlineExample = this.readInlineSource();
		}
		super.connectedCallback();
		this.ensureGlobalStyle(STYLE_ID, style);
	}

	protected override async loadExamples(): Promise<HtmlViewerExample[]> {
		const { source: rawSource, baseHref } = await this.readSource();
		return readExamples(
			rawSource,
			{ baseHref },
			!this.hasAttribute("no-loader"),
		).map((example) => ({
			...example,
			source: this.hasAttribute("preserve-source")
				? example.source
				: formatViewerSourceForDisplay(example.source),
		}));
	}

	protected getResetSource(example: HtmlViewerExample): string {
		return this.overrideResetSource ?? example.source;
	}

	protected readInlineSource(): HtmlViewerExample {
		const script = this.querySelector(
			':scope > script:is([type="tp/html"], [type="tp/html-viewer"])',
		);
		const template = this.querySelector(":scope > template");
		const source =
			script instanceof HTMLScriptElement && script.textContent !== null
				? dedent(script.textContent)
				: template instanceof HTMLTemplateElement
					? dedent(template.innerHTML)
					: dedent(this.innerHTML);
		return {
			label: "Example",
			source,
			context: { baseHref: resolveIframeBaseHref(this) },
		};
	}

	protected createExternalContext(url: URL): HtmlViewerContext {
		return { baseHref: getDirectoryBaseHref(url) };
	}

	protected async renderOutput(
		source: string,
		mode: HtmlViewerMode,
		container: HTMLElement,
		context: HtmlViewerContext,
	): Promise<void> {
		if (mode === "dom") {
			const tree = document.createElement("tp-object-tree") as TpObjectTree;
			tree.setValue(renderDomTree(source));
			container.replaceChildren(tree);
			return;
		}

		if (source.trim() === "") {
			container.replaceChildren();
			return;
		}

		const iframe = document.createElement("iframe");
		iframe.className = "tp-html-viewer-frame";
		iframe.title = "HTML preview";
		if (this.hasAttribute("allow-script")) iframe.allow = "autoplay";
		iframe.srcdoc = buildIframeDocument(
			source,
			context.baseHref,
			!this.hasAttribute("no-loader"),
		);
		container.replaceChildren(iframe);
	}

	/**
	 * Reads source from `<script>`, `<template>`, or host content.
	 *
	 * @returns Dedented HTML source.
	 */
	private async readSource(): Promise<HtmlViewerSource> {
		if (this.overrideSource !== null) {
			return this.overrideSource;
		}

		const rawSrc = this.src.trim();
		if (rawSrc !== "") {
			const sourceUrl = resolveComponentSourceUrl(this, rawSrc);
			const response = await fetch(sourceUrl.href, { cache: "no-store" });
			if (!response.ok) {
				throw new Error(
					`Unable to load HTML file: ${sourceUrl.pathname} (${String(response.status)})`,
				);
			}
			return {
				source: await response.text(),
				baseHref: getDirectoryBaseHref(sourceUrl),
			};
		}

		const inline = this.initialInlineExample ?? this.readInlineSource();
		return { source: inline.source, baseHref: inline.context.baseHref };
	}
}

if (!customElements.get("tp-html-viewer")) {
	customElements.define("tp-html-viewer", TpHtmlViewer);
}
