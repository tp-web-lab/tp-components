/**
 * @module components/prose-editor
 * @summary ProseMirror-based rich text editor component.
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
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-emoji-picker
 * @summary Unicode Emoji 17.0 picker.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
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
 * @tp-dependency tp-icon-picker
 * @summary Icon picker that lists built-in icons from `icon-internal`
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-restructuredtext
 * @summary reStructuredText rendering component.
 */
/**
 * @tp-dependency tp-symbol-picker
 * @summary HTML named-character symbol picker.
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
 * @credit ProseMirror https://prosemirror.net/
 * @summary Rich-text editing.
 */
/**
 * @credit MathJax https://www.mathjax.org/
 * @summary Mathematical notation rendering.
 */
// tp-docgen:dependencies:end

import {
	baseKeymap,
	chainCommands,
	setBlockType,
	toggleMark,
	wrapIn,
} from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import {
	type DOMOutputSpec,
	DOMSerializer,
	Fragment,
	type MarkSpec,
	type MarkType,
	type NodeSpec,
	type NodeType,
	DOMParser as ProseMirrorDOMParser,
	type Node as ProseMirrorNode,
	Schema,
	Slice,
} from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import {
	addListNodes,
	splitListItem,
	wrapInList,
} from "prosemirror-schema-list";
import {
	SearchQuery,
	search as searchPlugin,
	setSearchState,
} from "prosemirror-search";
import {
	AllSelection,
	EditorState,
	Selection,
	TextSelection,
	type Transaction,
} from "prosemirror-state";
import {
	addColumnAfter,
	addRowAfter,
	columnResizing,
	deleteColumn,
	deleteRow,
	deleteTable,
	goToNextCell,
	TableView,
	tableEditing,
	tableNodes,
	updateColumnsOnResize,
} from "prosemirror-tables";
import { EditorView, type NodeView } from "prosemirror-view";
import { TpBase } from "../base/base.js";
import "../checkbox-list/checkbox-list.js";
import { renderAsciidocInto } from "../asciidoc/asciidoc.js";
import "../code-editor/code-editor.js";
import "../color/color.js";
import "../dropdown/dropdown.js";
import "../emoji-picker/emoji-picker.js";
import "../fullscreen/fullscreen.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../icon-picker/icon-picker.js";
import "../menu/menu.js";
import "../symbol-picker/symbol-picker.js";
import { renderRestructuredTextInto } from "../restructuredtext/restructuredtext.js";
import "../theme/theme.js";
import "../toolbar/toolbar.js";
import { loadUsedTpComponents } from "../../tp-loader.js";
import { getLanguageFromFilename } from "../../utilities/code.js";
import { formatHtmlForDisplay } from "../../utilities/html-code.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import {
	renderMarkdownInto,
	renderMarkdownRuntimeIn,
} from "../markdown/markdown.js";
import style from "./prose-editor.css?inline";

const nodesWithLists = addListNodes(
	basicSchema.spec.nodes,
	"paragraph block*",
	"block",
);

const inlineIconCaretAnchor = "\u200B";

const MATHJAX_URL = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js";
let mathJaxLoadPromise: Promise<void> | null = null;

type MathJaxApi = {
	startup?: {
		promise?: Promise<unknown>;
		typeset?: boolean;
	};
	tex2svgPromise?: (
		tex: string,
		options: { display: boolean },
	) => Promise<HTMLElement>;
};

type MathJaxWindow = Window & {
	MathJax?: MathJaxApi & Record<string, unknown>;
};

type FileSystemWritableFileStreamLike = {
	close: () => Promise<void>;
	write: (data: Blob | string) => Promise<void>;
};

type FileSystemFileHandleLike = {
	createWritable: () => Promise<FileSystemWritableFileStreamLike>;
};

type WindowWithSaveFilePicker = Window & {
	showSaveFilePicker?: (options?: {
		suggestedName?: string;
		types?: Array<{
			accept: Record<string, string[]>;
			description: string;
		}>;
	}) => Promise<FileSystemFileHandleLike>;
};

type SerializeDocumentOptions = {
	renderComponents?: boolean;
};

const CODE_BLOCK_LANGUAGES = [
	"abc",
	"css",
	"html",
	"javascript",
	"json",
	"markdown",
	"prolog",
	"python",
	"sql",
	"text",
	"typescript",
	"yaml",
] as const;

const CODE_BLOCK_THEME_CLASSES = ["tp-light", "tp-dark"] as const;
const CODE_BLOCK_COLOR_CLASSES = [
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
] as const;

function normalizeCodeBlockLanguage(value: unknown): string {
	const language =
		typeof value === "string" && value.trim() !== ""
			? value.trim().toLowerCase()
			: "html";

	return language === "plaintext" ? "text" : language;
}

function normalizeCodeBlockTheme(value: unknown): string | null {
	if (typeof value !== "string") {
		return null;
	}

	const theme = value.trim();
	return CODE_BLOCK_THEME_CLASSES.includes(
		theme as (typeof CODE_BLOCK_THEME_CLASSES)[number],
	)
		? theme
		: null;
}

function normalizeCodeBlockColor(value: unknown): string | null {
	if (typeof value !== "string") {
		return null;
	}

	const color = value.trim();
	return CODE_BLOCK_COLOR_CLASSES.includes(
		color as (typeof CODE_BLOCK_COLOR_CLASSES)[number],
	)
		? color
		: null;
}

function findCodeBlockClass(
	elements: Array<Element | null>,
	candidates: readonly string[],
): string | null {
	for (const element of elements) {
		if (element === null) {
			continue;
		}

		for (const className of candidates) {
			if (element.classList.contains(className)) {
				return className;
			}
		}
	}

	return null;
}

function getCodeBlockTheme(elements: Array<Element | null>): string | null {
	return normalizeCodeBlockTheme(
		findCodeBlockClass(elements, CODE_BLOCK_THEME_CLASSES),
	);
}

function getCodeBlockColor(elements: Array<Element | null>): string | null {
	return normalizeCodeBlockColor(
		findCodeBlockClass(elements, CODE_BLOCK_COLOR_CLASSES),
	);
}

function applyCodeBlockVisualClasses(
	element: HTMLElement,
	theme: unknown,
	color: unknown,
): void {
	const normalizedTheme = normalizeCodeBlockTheme(theme);
	const normalizedColor = normalizeCodeBlockColor(color);

	element.classList.remove(
		...CODE_BLOCK_THEME_CLASSES,
		...CODE_BLOCK_COLOR_CLASSES,
	);

	if (normalizedTheme !== null) {
		element.classList.add(normalizedTheme);
	}

	if (normalizedColor !== null) {
		element.classList.add(normalizedColor);
	}
}

function getCodeBlockVisualClassName(
	theme: unknown,
	color: unknown,
): string | null {
	const classNames = [
		normalizeCodeBlockTheme(theme),
		normalizeCodeBlockColor(color),
	].filter((className): className is string => className !== null);

	return classNames.length === 0 ? null : classNames.join(" ");
}

function getCodeEditorThemeMode(editor: HTMLElement): string | null {
	return (
		editor
			.querySelector<HTMLElement>("tp-theme[data-tp-code-editor-theme]")
			?.getAttribute("mode") ?? null
	);
}

function syncCodeEditorThemeControl(editor: HTMLElement, theme: unknown): void {
	const themeControl = editor.querySelector<HTMLElement>(
		"tp-theme[data-tp-code-editor-theme]",
	);

	if (themeControl === null) {
		return;
	}

	const normalizedTheme = normalizeCodeBlockTheme(theme);

	if (normalizedTheme === "tp-dark") {
		themeControl.setAttribute("mode", "dark");
	} else if (normalizedTheme === "tp-light") {
		themeControl.setAttribute("mode", "light");
	} else {
		themeControl.setAttribute("mode", "auto");
	}
}

function isFetchableCodeSource(value: string): boolean {
	return /^(?:https?:|data:|blob:|\/|\.\/|\.\.\/)/.test(value.trim());
}

const codeBlockNodeSpec: NodeSpec = {
	...basicSchema.spec.nodes.get("code_block"),
	attrs: {
		language: { default: "html" },
		src: { default: null },
		theme: { default: null },
		color: { default: null },
	},
	parseDOM: [
		{
			tag: "pre",
			preserveWhitespace: "full",
			getAttrs(dom: HTMLElement | string):
				| false
				| {
						color: string | null;
						language: string;
						src: string | null;
						theme: string | null;
				  } {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				const code = dom.querySelector("code");
				const languageClass = Array.from(code?.classList ?? []).find(
					(className) => className.startsWith("language-"),
				);

				return {
					language: normalizeCodeBlockLanguage(
						code?.getAttribute("data-language") ??
							(languageClass === undefined
								? null
								: languageClass.slice("language-".length)),
					),
					src:
						dom.getAttribute("data-src") ??
						code?.getAttribute("data-src") ??
						null,
					theme: getCodeBlockTheme([code, dom]),
					color: getCodeBlockColor([code, dom]),
				};
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const language = normalizeCodeBlockLanguage(node.attrs.language);
		const src =
			typeof node.attrs.src === "string" && node.attrs.src.trim() !== ""
				? node.attrs.src.trim()
				: null;
		const preAttrs: Record<string, string> = {};
		const visualClassName = getCodeBlockVisualClassName(
			node.attrs.theme,
			node.attrs.color,
		);

		if (src !== null) {
			preAttrs["data-src"] = src;
		}

		if (visualClassName !== null) {
			preAttrs.class = visualClassName;
		}

		const codeClassName = [
			language === "html" ? null : `language-${language}`,
			visualClassName,
		]
			.filter((className): className is string => className !== null)
			.join(" ");
		const codeAttrs: Record<string, string> = {};

		if (codeClassName !== "") {
			codeAttrs.class = codeClassName;
		}

		if (language !== "html") {
			codeAttrs["data-language"] = language;
		}

		return ["pre", preAttrs, ["code", codeAttrs, 0]];
	},
};

function hasCssToken(value: unknown, token: string): boolean {
	return typeof value === "string" && value.split(/\s+/).includes(token);
}

const underlineMarkSpec: MarkSpec = {
	parseDOM: [
		{ tag: "u" },
		{
			style: "text-decoration",
			getAttrs: (value) => (hasCssToken(value, "underline") ? null : false),
		},
		{
			style: "text-decoration-line",
			getAttrs: (value) => (hasCssToken(value, "underline") ? null : false),
		},
	],
	toDOM: () => ["u", 0],
};

const strikethroughMarkSpec: MarkSpec = {
	parseDOM: [
		{ tag: "s" },
		{ tag: "strike" },
		{ tag: "del" },
		{
			style: "text-decoration",
			getAttrs: (value) => (hasCssToken(value, "line-through") ? null : false),
		},
		{
			style: "text-decoration-line",
			getAttrs: (value) => (hasCssToken(value, "line-through") ? null : false),
		},
	],
	toDOM: () => ["s", 0],
};

const subscriptMarkSpec: MarkSpec = {
	excludes: "superscript",
	parseDOM: [{ tag: "sub" }],
	toDOM: () => ["sub", 0],
};

const superscriptMarkSpec: MarkSpec = {
	excludes: "subscript",
	parseDOM: [{ tag: "sup" }],
	toDOM: () => ["sup", 0],
};

function getMediaSource(dom: HTMLElement): string {
	return (
		dom.getAttribute("src") ??
		dom.querySelector("source")?.getAttribute("src") ??
		""
	);
}

function getMediaDimension(
	dom: HTMLElement,
	name: "height" | "width",
): string | null {
	const attribute = dom.getAttribute(name);

	if (attribute !== null && attribute.trim() !== "") {
		return attribute;
	}

	const styleValue = dom.style.getPropertyValue(name);
	return styleValue.trim() === "" ? null : styleValue.trim();
}

function setMediaDimensionAttribute(
	attrs: Record<string, string>,
	name: "height" | "width",
	value: unknown,
): void {
	if (typeof value !== "string" || value.trim() === "") {
		return;
	}

	attrs[name] = value.trim();
}

function createMediaFigure(media: HTMLElement, caption: unknown): HTMLElement {
	const figure = document.createElement("figure");
	figure.append(media);

	if (typeof caption === "string" && caption.trim() !== "") {
		const figcaption = document.createElement("figcaption");
		figcaption.textContent = caption;
		figure.append(figcaption);
	}

	return figure;
}

const imageNodeSpec: NodeSpec = {
	attrs: {
		alt: { default: null },
		height: { default: null },
		src: {},
		title: { default: null },
		width: { default: null },
	},
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	parseDOM: [
		{
			tag: "figure",
			getAttrs(dom: HTMLElement | string): false | Record<string, unknown> {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				const image = dom.querySelector("img[src]");

				if (!(image instanceof HTMLElement)) {
					return false;
				}

				const caption =
					dom.querySelector("figcaption")?.textContent?.trim() ?? "";

				return {
					alt: caption || image.getAttribute("alt"),
					height: getMediaDimension(image, "height"),
					src: image.getAttribute("src"),
					title: image.getAttribute("title"),
					width: getMediaDimension(image, "width"),
				};
			},
		},
		{
			tag: "img[src]",
			getAttrs(dom: HTMLElement | string): false | Record<string, unknown> {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				return {
					alt: dom.getAttribute("alt"),
					height: getMediaDimension(dom, "height"),
					src: dom.getAttribute("src"),
					title: dom.getAttribute("title"),
					width: getMediaDimension(dom, "width"),
				};
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const attrs: Record<string, string> = { src: String(node.attrs.src) };

		if (typeof node.attrs.alt === "string") {
			attrs.alt = node.attrs.alt;
		}

		if (typeof node.attrs.title === "string" && node.attrs.title !== "") {
			attrs.title = node.attrs.title;
		}

		setMediaDimensionAttribute(attrs, "width", node.attrs.width);
		setMediaDimensionAttribute(attrs, "height", node.attrs.height);
		const image = document.createElement("img");
		for (const [name, value] of Object.entries(attrs)) {
			image.setAttribute(name, value);
		}

		return createMediaFigure(image, node.attrs.alt);
	},
};

const videoNodeSpec: NodeSpec = {
	attrs: {
		autoplay: { default: false },
		controls: { default: true },
		height: { default: null },
		poster: { default: null },
		caption: { default: null },
		src: {},
		title: { default: null },
		width: { default: null },
	},
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	parseDOM: [
		{
			tag: "figure",
			getAttrs(dom: HTMLElement | string): false | Record<string, unknown> {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				const video = dom.querySelector("video");

				if (!(video instanceof HTMLElement)) {
					return false;
				}

				const src = getMediaSource(video);

				if (src.trim() === "") {
					return false;
				}

				return {
					autoplay: video.hasAttribute("autoplay"),
					caption: dom.querySelector("figcaption")?.textContent?.trim() ?? null,
					controls: video.hasAttribute("controls"),
					height: getMediaDimension(video, "height"),
					poster: video.getAttribute("poster"),
					src,
					title: video.getAttribute("title"),
					width: getMediaDimension(video, "width"),
				};
			},
		},
		{
			tag: "video",
			getAttrs(dom: HTMLElement | string): false | Record<string, unknown> {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				const src = getMediaSource(dom);

				if (src.trim() === "") {
					return false;
				}

				return {
					autoplay: dom.hasAttribute("autoplay"),
					caption: null,
					controls: dom.hasAttribute("controls"),
					height: getMediaDimension(dom, "height"),
					poster: dom.getAttribute("poster"),
					src,
					title: dom.getAttribute("title"),
					width: getMediaDimension(dom, "width"),
				};
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const attrs: Record<string, string> = { src: String(node.attrs.src) };

		if (node.attrs.autoplay === true) {
			attrs.autoplay = "";
		}

		if (node.attrs.controls === true) {
			attrs.controls = "";
		}

		if (typeof node.attrs.poster === "string" && node.attrs.poster !== "") {
			attrs.poster = node.attrs.poster;
		}

		if (typeof node.attrs.title === "string" && node.attrs.title !== "") {
			attrs.title = node.attrs.title;
		}

		setMediaDimensionAttribute(attrs, "width", node.attrs.width);
		setMediaDimensionAttribute(attrs, "height", node.attrs.height);
		const video = document.createElement("video");
		for (const [name, value] of Object.entries(attrs)) {
			video.setAttribute(name, value);
		}

		return createMediaFigure(video, node.attrs.caption);
	},
};

const audioNodeSpec: NodeSpec = {
	attrs: {
		autoplay: { default: false },
		caption: { default: null },
		controls: { default: true },
		src: {},
		title: { default: null },
	},
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	parseDOM: [
		{
			tag: "figure",
			getAttrs(dom: HTMLElement | string): false | Record<string, unknown> {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				const audio = dom.querySelector("audio");

				if (!(audio instanceof HTMLElement)) {
					return false;
				}

				const src = getMediaSource(audio);

				if (src.trim() === "") {
					return false;
				}

				return {
					autoplay: audio.hasAttribute("autoplay"),
					caption: dom.querySelector("figcaption")?.textContent?.trim() ?? null,
					controls: audio.hasAttribute("controls"),
					src,
					title: audio.getAttribute("title"),
				};
			},
		},
		{
			tag: "audio",
			getAttrs(dom: HTMLElement | string): false | Record<string, unknown> {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				const src = getMediaSource(dom);

				if (src.trim() === "") {
					return false;
				}

				return {
					autoplay: dom.hasAttribute("autoplay"),
					caption: null,
					controls: dom.hasAttribute("controls"),
					src,
					title: dom.getAttribute("title"),
				};
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const attrs: Record<string, string> = { src: String(node.attrs.src) };

		if (node.attrs.autoplay === true) {
			attrs.autoplay = "";
		}

		if (node.attrs.controls === true) {
			attrs.controls = "";
		}

		if (typeof node.attrs.title === "string" && node.attrs.title !== "") {
			attrs.title = node.attrs.title;
		}

		const audio = document.createElement("audio");
		for (const [name, value] of Object.entries(attrs)) {
			audio.setAttribute(name, value);
		}

		if (node.attrs.controls === true) {
			return createMediaFigure(audio, node.attrs.caption);
		}

		return audio;
	},
};

const customElementNodeSpec: NodeSpec = {
	attrs: {
		html: {},
	},
	group: "block",
	atom: true,
	isolating: true,
	selectable: true,
	draggable: false,
	parseDOM: [
		{
			tag: "*",
			priority: 10,
			getAttrs(dom: HTMLElement | string): false | { html: string } {
				if (!(dom instanceof HTMLElement) || !dom.localName.startsWith("tp-")) {
					return false;
				}

				return { html: dom.outerHTML };
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const template = document.createElement("template");
		template.innerHTML = String(node.attrs.html);
		const element = template.content.firstElementChild;

		if (element !== null) {
			return element;
		}

		return ["div", { "data-tp-prose-editor-custom-element": "" }];
	},
};

const tpIconNodeSpec: NodeSpec = {
	attrs: {
		html: {},
	},
	group: "inline",
	inline: true,
	atom: true,
	selectable: true,
	parseDOM: [
		{
			tag: "tp-icon",
			priority: 60,
			getAttrs(dom: HTMLElement | string): false | { html: string } {
				return dom instanceof HTMLElement ? { html: dom.outerHTML } : false;
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const template = document.createElement("template");
		template.innerHTML = String(node.attrs.html);
		return template.content.firstElementChild ?? ["span"];
	},
};

const markdownBlockNodeSpec: NodeSpec = {
	attrs: {
		html: { default: "" },
		language: { default: "markdown" },
		markdown: { default: "" },
		view: { default: "both" },
	},
	group: "block",
	atom: true,
	isolating: true,
	selectable: true,
	draggable: false,
	parseDOM: [
		{
			tag: "[data-tp-prose-editor-markdown-block]",
			getAttrs(dom: HTMLElement | string):
				| false
				| {
						html: string;
						language: string;
						markdown: string;
						view: string;
				  } {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				return {
					html: dom.innerHTML,
					language: dom.getAttribute("data-language") ?? "markdown",
					markdown: dom.getAttribute("data-markdown") ?? "",
					view: dom.getAttribute("data-view") ?? "both",
				};
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const element = document.createElement("div");
		element.dataset.tpProseEditorMarkdownBlock = "";
		element.dataset.language = normalizeMarkupBlockLanguage(
			node.attrs.language,
		);
		element.dataset.markdown = String(node.attrs.markdown);
		element.dataset.view = normalizeMarkdownBlockViewMode(node.attrs.view);
		element.innerHTML = String(node.attrs.html);
		return element;
	},
};

const mathInlineNodeSpec: NodeSpec = {
	attrs: {
		tex: { default: "" },
	},
	group: "inline",
	inline: true,
	atom: true,
	selectable: true,
	parseDOM: [
		{
			tag: "[data-tp-prose-editor-math-inline]",
			getAttrs(dom: HTMLElement | string): false | { tex: string } {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				return {
					tex: dom.getAttribute("data-mathjax-tex") ?? dom.textContent ?? "",
				};
			},
		},
		{
			tag: '[data-mathjax-tex][data-mathjax-display="false"]',
			getAttrs(dom: HTMLElement | string): false | { tex: string } {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				return { tex: dom.getAttribute("data-mathjax-tex") ?? "" };
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		return [
			"span",
			{
				class: "tp-prose-editor-math-inline",
				"data-mathjax-display": "false",
				"data-mathjax-tex": String(node.attrs.tex),
				"data-tp-prose-editor-math-inline": "",
			},
		];
	},
};

const mathBlockNodeSpec: NodeSpec = {
	attrs: {
		tex: { default: "" },
	},
	group: "block",
	atom: true,
	isolating: true,
	selectable: true,
	parseDOM: [
		{
			tag: "[data-tp-prose-editor-math-block]",
			getAttrs(dom: HTMLElement | string): false | { tex: string } {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				return {
					tex: dom.getAttribute("data-mathjax-tex") ?? dom.textContent ?? "",
				};
			},
		},
		{
			tag: '[data-mathjax-tex][data-mathjax-display="true"]',
			getAttrs(dom: HTMLElement | string): false | { tex: string } {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				return { tex: dom.getAttribute("data-mathjax-tex") ?? "" };
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		return [
			"div",
			{
				class: "tp-prose-editor-math-block",
				"data-mathjax-display": "true",
				"data-mathjax-tex": String(node.attrs.tex),
				"data-tp-prose-editor-math-block": "",
			},
		];
	},
};

const definitionListNodeSpec: NodeSpec = {
	content: "(definition_term | definition_description)+",
	group: "block",
	parseDOM: [{ tag: "dl" }],
	toDOM: () => ["dl", 0],
};

const definitionTermNodeSpec: NodeSpec = {
	content: "inline*",
	defining: true,
	parseDOM: [{ tag: "dt" }],
	toDOM: () => ["dt", 0],
};

const definitionDescriptionNodeSpec: NodeSpec = {
	content: "block+",
	defining: true,
	parseDOM: [{ tag: "dd" }],
	toDOM: () => ["dd", 0],
};

const tableNodeSpecs = tableNodes({
	tableGroup: "block",
	cellContent: "block+",
	cellAttributes: {},
});
tableNodeSpecs.table = {
	...tableNodeSpecs.table,
	attrs: {
		caption: { default: null },
	},
	parseDOM: [
		{
			tag: "table",
			getAttrs(dom: HTMLElement | string): false | { caption: string | null } {
				if (!(dom instanceof HTMLElement)) {
					return false;
				}

				return {
					caption:
						dom.querySelector(":scope > caption")?.textContent?.trim() ?? null,
				};
			},
		},
	],
	toDOM(node: ProseMirrorNode): DOMOutputSpec {
		const caption =
			typeof node.attrs.caption === "string" ? node.attrs.caption.trim() : "";

		if (caption !== "") {
			return ["table", ["caption", caption], ["tbody", 0]];
		}

		return ["table", ["tbody", 0]];
	},
};

class CaptionedTableView extends TableView {
	private captionElement: HTMLTableCaptionElement | null = null;

	public constructor(node: ProseMirrorNode, defaultCellMinWidth: number) {
		super(node, defaultCellMinWidth);
		this.syncCaption(node);
	}

	public override update(node: ProseMirrorNode): boolean {
		if (node.type !== this.node.type) {
			return false;
		}

		this.node = node;
		updateColumnsOnResize(
			node,
			this.colgroup,
			this.table,
			this.defaultCellMinWidth,
		);
		this.syncCaption(node);
		return true;
	}

	private syncCaption(node: ProseMirrorNode): void {
		const caption =
			typeof node.attrs.caption === "string" ? node.attrs.caption.trim() : "";

		if (caption === "") {
			this.captionElement?.remove();
			this.captionElement = null;
			return;
		}

		if (this.captionElement === null) {
			this.captionElement = document.createElement("caption");
			this.table.insertBefore(this.captionElement, this.colgroup);
		}

		this.captionElement.textContent = caption;
	}
}

const schema = new Schema({
	nodes: nodesWithLists
		.update("code_block", codeBlockNodeSpec)
		.update("image", imageNodeSpec)
		.append(tableNodeSpecs)
		.append({
			audio: audioNodeSpec,
			custom_element: customElementNodeSpec,
			definition_description: definitionDescriptionNodeSpec,
			definition_list: definitionListNodeSpec,
			definition_term: definitionTermNodeSpec,
			math_block: mathBlockNodeSpec,
			math_inline: mathInlineNodeSpec,
			markdown_block: markdownBlockNodeSpec,
			tp_icon: tpIconNodeSpec,
			video: videoNodeSpec,
		}),
	marks: basicSchema.spec.marks.append({
		underline: underlineMarkSpec,
		strikethrough: strikethroughMarkSpec,
		subscript: subscriptMarkSpec,
		superscript: superscriptMarkSpec,
	}),
});

const TP_LOADER_SCRIPT = '<script type="module" src="./tp-loader.js"></script>';
const MARKDOWN_RENDER_TIMEOUT = 1500;

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function getNodeType(name: string): NodeType {
	const nodeType = schema.nodes[name];

	if (nodeType === undefined) {
		throw new Error(`Missing ProseMirror node type: ${name}`);
	}

	return nodeType;
}

function getMarkType(name: string): MarkType {
	const markType = schema.marks[name];

	if (markType === undefined) {
		throw new Error(`Missing ProseMirror mark type: ${name}`);
	}

	return markType;
}

type TpProseEditorCommand =
	| "files"
	| "copy"
	| "cut"
	| "html"
	| "emoji-picker"
	| "icon-picker"
	| "symbol-picker"
	| "format-bold"
	| "format-clear"
	| "format-code"
	| "format-code-block"
	| "format-color-highlight"
	| "format-color-text"
	| "format-header-1"
	| "format-header-2"
	| "format-header-3"
	| "format-header-4"
	| "format-header-5"
	| "format-header-6"
	| "format-italic"
	| "format-list-checkbox"
	| "format-list-bulleted"
	| "format-list-numbered"
	| "format-list-text"
	| "format-math"
	| "format-quote-open"
	| "format-strikethrough"
	| "format-subscript"
	| "format-superscript"
	| "format-text"
	| "format-underline"
	| "insert-horizontal-rule"
	| "insert-math-block"
	| "insert-markdown-block"
	| "insert-markup-asciidoc"
	| "insert-markup-html"
	| "insert-markup-markdown"
	| "insert-markup-restructuredtext"
	| "insert-image"
	| "insert-audio"
	| "insert-video"
	| "link"
	| "list"
	| "load-html"
	| "media"
	| "more"
	| "paste"
	| "save-html"
	| "save-html-as"
	| "select-all"
	| "types"
	| "insert-table"
	| "format"
	| "import-markdown"
	| "redo"
	| "search"
	| "undo";

type ProseMirrorCommand = (
	state: EditorState,
	dispatch?: (tr: Transaction) => void,
	view?: EditorView,
) => boolean;

type TpDropdownElement = HTMLElement & {
	hide: () => void;
	open: boolean;
	toggle: () => void;
};

type TpCodeEditorElement = HTMLElement & {
	getValue: () => string;
	readonly: boolean;
	setValue: (value: string) => void;
	toolbar: boolean;
};

type MediaFileKind = "audio" | "image" | "video";

type MediaBooleanAttributes = {
	autoplay: boolean;
	controls: boolean;
};

type MediaAttributes = MediaBooleanAttributes & {
	alt: string;
	caption: string;
	height: string | null;
	lockRatio: boolean;
	poster: string;
	title: string;
	width: string | null;
};

type MarkdownBlockViewMode = "both" | "source" | "preview";
type MarkupBlockLanguage =
	| "asciidoc"
	| "html"
	| "markdown"
	| "restructuredtext";

function normalizeMarkupBlockLanguage(value: unknown): MarkupBlockLanguage {
	if (value === "asciidoc" || value === "html" || value === "restructuredtext")
		return value;
	return "markdown";
}

function normalizeMarkdownBlockViewMode(value: unknown): MarkdownBlockViewMode {
	if (value === "source" || value === "preview") {
		return value;
	}

	return "both";
}

/**
 * Rich text editor backed by ProseMirror.
 *
 * @summary ProseMirror-based rich text editor.
 * @tagname tp-prose-editor
 * @attr {string} placeholder = "Type your prose..." - Text displayed while the editor is empty.
 * @attr {boolean} readonly = false - Prevents the user from editing the prose.
 * @attr {string} src = "" - URL of an external document loaded into the editor.
 * @attr {string} value = "" - Initial HTML content of the editor.
 * @example
 * <tp-prose-editor></tp-prose-editor>
 */
export class TpProseEditor extends TpBase {
	private static readonly styleId = "tp-prose-editor-styles";
	private static nextId = 0;

	private editorView: EditorView | null = null;
	private fileButtonId = "";
	private fileDropdownElement: TpDropdownElement | null = null;
	private formatButtonId = "";
	private formatDropdownElement: TpDropdownElement | null = null;
	private htmlButtonId = "";
	private htmlDropdownElement: TpDropdownElement | null = null;
	private htmlFileInputElement: HTMLInputElement | null = null;
	private htmlMode = false;
	private htmlRenderMode = false;
	private htmlRenderedElement: HTMLDivElement | null = null;
	private htmlSourceElement: HTMLTextAreaElement | null = null;
	private secondaryToolbarElement: HTMLElement | null = null;
	private imageFileInputElement: HTMLInputElement | null = null;
	private listButtonId = "";
	private listDropdownElement: TpDropdownElement | null = null;
	private markdownFileInputElement: HTMLInputElement | null = null;
	private mediaButtonId = "";
	private mediaDropdownElement: TpDropdownElement | null = null;
	private audioFileInputElement: HTMLInputElement | null = null;
	private searchClearButtonElement: HTMLElement | null = null;
	private searchControlElement: HTMLElement | null = null;
	private searchInputElement: HTMLInputElement | null = null;
	private surfaceElement: HTMLDivElement | null = null;
	private tableDropdownElement: TpDropdownElement | null = null;
	private toolbarElement: HTMLElement | null = null;
	private emojiPickerDropdownElement: TpDropdownElement | null = null;
	private iconPickerDropdownElement: TpDropdownElement | null = null;
	private symbolPickerDropdownElement: TpDropdownElement | null = null;
	private tableButtonId = "";
	private typeButtonId = "";
	private typeDropdownElement: TpDropdownElement | null = null;
	private videoFileInputElement: HTMLInputElement | null = null;
	private selectedTableColumns = 3;
	private selectedTableRows = 3;
	private internalValueUpdate = false;
	private initialHTML = "";
	private srcLoadToken = 0;

	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"placeholder",
			"readonly",
			"src",
			"value",
		];
	}

	public get value(): string {
		return this.getHTML();
	}

	public set value(value: string) {
		this.setHTML(value);
	}

	public get placeholder(): string {
		return this.getStringAttribute("placeholder", "Type your prose...");
	}

	public set placeholder(value: string) {
		this.setStringAttribute("placeholder", value);
	}

	public get readonly(): boolean {
		return this.getBooleanAttribute("readonly");
	}

	public set readonly(value: boolean) {
		this.setBooleanAttribute("readonly", value);
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

	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpProseEditor.styleId, style);

		if (this.editorView !== null) {
			return;
		}

		this.initialHTML = this.getAttribute("value") ?? this.innerHTML.trim();
		this.render();
		this.createEditor(this.initialHTML);
		if (this.src.trim() !== "") {
			void this.loadSrcDocument();
		}
	}

	public disconnectedCallback(): void {
		this.editorView?.destroy();
		this.editorView = null;
		this.fileDropdownElement = null;
		this.formatDropdownElement = null;
		this.htmlDropdownElement = null;
		this.htmlFileInputElement = null;
		this.htmlRenderedElement = null;
		this.htmlSourceElement = null;
		this.secondaryToolbarElement = null;
		this.listDropdownElement = null;
		this.markdownFileInputElement = null;
		this.mediaDropdownElement = null;
		this.emojiPickerDropdownElement = null;
		this.iconPickerDropdownElement = null;
		this.symbolPickerDropdownElement = null;
		this.searchClearButtonElement = null;
		this.searchControlElement = null;
		this.searchInputElement = null;
		this.surfaceElement = null;
		this.tableDropdownElement = null;
		this.toolbarElement = null;
		this.typeDropdownElement = null;
	}

	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue) {
			return;
		}

		if (name === "value" && !this.internalValueUpdate) {
			this.replaceDocument(newValue ?? "");
			return;
		}

		if (name === "readonly") {
			this.editorView?.setProps({ editable: () => !this.readonly });
			return;
		}

		if (name === "placeholder") {
			this.syncPlaceholder();
			return;
		}

		if (name === "src" && this.isConnected) {
			void this.loadSrcDocument();
		}
	}

	public focus(options?: FocusOptions): void {
		if (this.htmlRenderMode) {
			this.htmlRenderedElement?.focus(options);
			return;
		}

		if (options !== undefined) {
			this.editorView?.dom.focus(options);
			return;
		}

		this.editorView?.focus();
	}

	public getHTML(): string {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			return this.htmlSourceElement.value;
		}

		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			return this.htmlRenderedElement.innerHTML;
		}

		if (this.editorView === null) {
			return this.getAttribute("value") ?? this.initialHTML;
		}

		return this.serializeDocument(this.editorView.state.doc);
	}

	public setHTML(value: string): void {
		this.replaceDocument(value);
		if (this.htmlSourceElement !== null) {
			this.htmlSourceElement.value = value;
		}
		if (this.htmlRenderedElement !== null) {
			this.htmlRenderedElement.innerHTML = value;
		}
		this.internalValueUpdate = true;
		this.setStringAttribute("value", value);
		this.internalValueUpdate = false;
	}

	public insertTable(rows = 3, columns = 3): boolean {
		if (this.editorView === null) {
			return false;
		}

		const table = this.createTableNode(rows, columns);

		if (table === null) {
			return false;
		}

		const transaction = this.editorView.state.tr
			.replaceSelectionWith(table)
			.scrollIntoView();
		this.editorView.dispatch(transaction);
		this.editorView.focus();
		return true;
	}

	public addTableRowAfter(): boolean {
		return this.runTableCommand(addRowAfter);
	}

	public addTableColumnAfter(): boolean {
		return this.runTableCommand(addColumnAfter);
	}

	public deleteTableRow(): boolean {
		return this.runTableCommand(deleteRow);
	}

	public deleteTableColumn(): boolean {
		return this.runTableCommand(deleteColumn);
	}

	public deleteTable(): boolean {
		return this.runTableCommand(deleteTable);
	}

	public setSearchQuery(
		value: string,
		options: Omit<ConstructorParameters<typeof SearchQuery>[0], "search"> = {},
	): void {
		if (this.editorView === null) {
			return;
		}

		const query = new SearchQuery({ ...options, search: value });
		const transaction = setSearchState(this.editorView.state.tr, query);
		this.editorView.dispatch(transaction);
	}

	public findNext(value?: string): boolean {
		return this.findSearchMatch(value, "next");
	}

	public findPrevious(value?: string): boolean {
		return this.findSearchMatch(value, "previous");
	}

	private render(): void {
		this.replaceChildren();

		if (this.id.trim() === "") {
			this.id = this.createToolbarId("root");
		}
		this.dataset.tpColorScope = "";
		this.dataset.tpThemeScope = "";

		if (this.fileButtonId === "") {
			this.fileButtonId = this.createToolbarId("files");
		}

		if (this.typeButtonId === "") {
			this.typeButtonId = this.createToolbarId("types");
		}

		if (this.formatButtonId === "") {
			this.formatButtonId = this.createToolbarId("format");
		}

		if (this.listButtonId === "") {
			this.listButtonId = this.createToolbarId("list");
		}

		if (this.tableButtonId === "") {
			this.tableButtonId = this.createToolbarId("table");
		}

		if (this.mediaButtonId === "") {
			this.mediaButtonId = this.createToolbarId("media");
		}

		if (this.htmlButtonId === "") {
			this.htmlButtonId = this.createToolbarId("html");
		}

		const tableGridCells = Array.from({ length: 6 }, (_, rowIndex) =>
			Array.from({ length: 6 }, (_, columnIndex) => {
				const rows = rowIndex + 1;
				const columns = columnIndex + 1;
				return `
          <button
            type="button"
            data-table-grid-cell
            data-table-rows="${String(rows)}"
            data-table-columns="${String(columns)}"
            aria-label="Insert ${String(rows)} by ${String(columns)} table"
          ></button>
        `;
			}).join(""),
		).join("");
		const menuLabel = (icon: string, label: string, library = ""): string => `
      <span data-tp-prose-editor-menu-label>
        <tp-icon${icon === "" ? "" : ` name="${icon}"`}${library === "" ? "" : ` library="${library}"`} aria-hidden="true"></tp-icon>
        <span>${label}</span>
      </span>
    `;
		const menuItem = (
			icon: string,
			label: string,
			attributes = "",
			library = "",
		): string =>
			`<li${attributes === "" ? "" : ` ${attributes}`}>${menuLabel(icon, label, library)}</li>`;
		const headingItems = Array.from({ length: 6 }, (_, index) => index + 1)
			.map(
				(level) => `
        <li data-menu-command="format-header-${String(level)}" title="Heading ${String(level)}">
          <tp-icon name="format-header-${String(level)}" label="Heading ${String(level)}"></tp-icon>
        </li>
      `,
			)
			.join("");

		const toolbar = document.createElement("tp-toolbar");
		toolbar.dataset.tpProseEditorToolbar = "";
		toolbar.setAttribute("placement", "top");
		toolbar.innerHTML = `
      <tp-icon-button section="start" id="${this.fileButtonId}" name="file" label="Files" data-command="files" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-file-dropdown anchor="#${this.fileButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-file-menu>
          <ul>
            ${menuItem("file-download", "Load HTML", 'data-file-action="load-html"')}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${menuItem("file-import", "Import Markdown", 'data-file-action="import-markdown"')}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${menuItem("file-upload", "Save HTML", 'data-file-action="save-html"')}
            ${menuItem("file-upload-as", "Save HTML as", 'data-file-action="save-html-as"')}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <input section="start" type="file" accept=".html,.htm,text/html" data-tp-prose-editor-html-file hidden />
      <input section="start" type="file" accept=".md,.markdown,text/markdown,text/plain" data-tp-prose-editor-markdown-file hidden />
      <input section="start" type="file" accept="image/*" data-tp-prose-editor-image-file hidden />
      <input section="start" type="file" accept="video/*" data-tp-prose-editor-video-file hidden />
      <input section="start" type="file" accept="audio/*" data-tp-prose-editor-audio-file hidden />
      <span section="start" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="start" id="${this.typeButtonId}" name="format-title" label="Types" data-command="types" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-type-dropdown anchor="#${this.typeButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="type">
          <ul>
            ${menuItem("paragraph", "Paragraph", 'data-menu-command="format-text"')}
            ${menuItem("format-quote-open", "Blockquote", 'data-menu-command="format-quote-open"')}
            <li>${menuLabel("format-heading-hash", "Headings")}<ul data-tp-prose-editor-horizontal-submenu>${headingItems}</ul></li>
            ${menuItem("code-block", "Code block", 'data-menu-command="format-code-block"')}
            ${menuItem("function-block", "Math block", 'data-menu-command="insert-math-block"')}
            <li>${menuLabel("text-block", "Markup block")}
              <ul>
                ${menuItem("file_type_asciidoc", "AsciiDoc", 'data-menu-command="insert-markup-asciidoc"', "languages")}
                ${menuItem("file_type_html", "HTML", 'data-menu-command="insert-markup-html"', "languages")}
                ${menuItem("file_type_markdown", "Markdown", 'data-menu-command="insert-markup-markdown"', "languages")}
                ${menuItem("file_type_restructuredtext", "reStructuredText", 'data-menu-command="insert-markup-restructuredtext"', "languages")}
              </ul>
            </li>
            ${menuItem("horizontal-line", "Horizontal rule", 'data-menu-command="insert-horizontal-rule"')}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <span section="start" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="start" id="${this.formatButtonId}" name="letter-f" label="Format" data-command="format" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-format-dropdown anchor="#${this.formatButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="format">
          <ul>
            ${menuItem("format-bold", "Bold", 'data-menu-command="format-bold"')}
            ${menuItem("format-italic", "Italic", 'data-menu-command="format-italic"')}
            ${menuItem("format-underline", "Underline", 'data-menu-command="format-underline"')}
            ${menuItem("format-strikethrough", "Strikethrough", 'data-menu-command="format-strikethrough"')}
            ${menuItem("format-subscript", "Subscript", 'data-menu-command="format-subscript"')}
            ${menuItem("format-superscript", "Superscript", 'data-menu-command="format-superscript"')}
            ${menuItem("format-code", "Code", 'data-menu-command="format-code"')}
            ${menuItem("function", "Math", 'data-menu-command="format-math"')}
            ${menuItem("link", "Link", 'data-menu-command="link"')}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.listButtonId}" name="list-down" label="List" data-command="list" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-list-dropdown anchor="#${this.listButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="list">
          <ul>
            ${menuItem("format-list-bulleted", "Unordered list", 'data-menu-command="format-list-bulleted"')}
            ${menuItem("format-list-numbered", "Ordered list", 'data-menu-command="format-list-numbered"')}
            ${menuItem("format-list-text", "Definition list", 'data-menu-command="format-list-text"')}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.tableButtonId}" name="table" label="Table" data-command="insert-table" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-table-dropdown anchor="#${this.tableButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-table-menu>
          <ul>
            <li data-table-picker>
              ${menuLabel("table-settings", "Insert table")}
              <ul data-tp-prose-editor-table-picker-submenu>
                <li data-table-picker-content>
                  <div data-tp-prose-editor-table-picker>
                    <output data-tp-prose-editor-table-picker-size>${String(this.selectedTableRows)} x ${String(this.selectedTableColumns)}</output>
                    <div data-tp-prose-editor-table-picker-grid role="grid" aria-label="Table size">
                      ${tableGridCells}
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            ${menuItem("text-short", "Add caption", 'data-table-action="add-caption"')}
            ${menuItem("table-row-plus-after", "Insert row", 'data-table-action="add-row"')}
            ${menuItem("table-column-plus-after", "Insert column", 'data-table-action="add-column"')}
            <li data-tp-menu-divider aria-disabled="true"></li>
            ${menuItem("table-row-remove", "Delete row", 'data-table-action="delete-row"')}
            ${menuItem("table-column-remove", "Delete column", 'data-table-action="delete-column"')}
            ${menuItem("table-remove", "Delete table", 'data-table-action="delete-table"')}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.mediaButtonId}" name="multimedia" label="Medias" data-command="media" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-media-dropdown anchor="#${this.mediaButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="media">
          <ul>
            ${menuItem("image-plus", "Image", 'data-menu-command="insert-image"')}
            ${menuItem("video-plus", "Video", 'data-menu-command="insert-video"')}
            ${menuItem("music-note-plus", "Audio", 'data-menu-command="insert-audio"')}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-emoji-picker-button" name="emoticon-happy-outline" label="Emoji" data-command="emoji-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-emoji-picker-dropdown anchor="#${this.id}-emoji-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-emoji-picker compact filter="face"></tp-emoji-picker>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-icon-picker-button" name="shapes" label="Icon" data-command="icon-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-icon-picker-dropdown anchor="#${this.id}-icon-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-icon-picker compact copy="tp-icon"></tp-icon-picker>
      </tp-dropdown>
      <tp-icon-button section="start" id="${this.id}-symbol-picker-button" name="symbol" label="Symbol" data-command="symbol-picker" aria-haspopup="dialog" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="start" data-tp-prose-editor-symbol-picker-dropdown anchor="#${this.id}-symbol-picker-button" placement="bottom" offset="4px" outside-click>
        <tp-symbol-picker compact></tp-symbol-picker>
      </tp-dropdown>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="start" aria-hidden="true"></span>
      <tp-icon-button section="center" name="undo" label="Undo" data-command="undo"></tp-icon-button>
      <tp-icon-button section="center" name="redo" label="Redo" data-command="redo"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="copy" label="Copy" data-command="copy"></tp-icon-button>
      <tp-icon-button section="center" name="cut" label="Cut" data-command="cut"></tp-icon-button>
      <tp-icon-button section="center" name="paste" label="Paste" data-command="paste"></tp-icon-button>
      <tp-icon-button section="center" name="select-all" label="Select all" data-command="select-all"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="format-clear" label="Clear formatting" data-command="format-clear"></tp-icon-button>
      <tp-icon-button section="center" id="${this.htmlButtonId}" name="language-html" label="HTML" data-command="html" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown section="center" data-tp-prose-editor-html-dropdown anchor="#${this.htmlButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-menu data-menu-kind="html">
          <ul>
            ${menuItem("application-edit-outline", "Editor", 'data-html-action="editor"')}
            ${menuItem("cellphone-screenshot", "Rendered HTML", 'data-html-action="render"')}
            ${menuItem("code", "HTML code", 'data-html-action="code"')}
          </ul>
        </tp-menu>
      </tp-dropdown>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="end" aria-hidden="true"></span>
      <tp-icon-button section="end" name="search" label="Search" data-command="search"></tp-icon-button>
      <span section="end" data-tp-prose-editor-search-control hidden>
        <input type="search" data-tp-prose-editor-search-input hidden aria-label="Search text" />
        <tp-icon-button name="close" size="xs" label="Clear search" data-tp-prose-editor-search-clear></tp-icon-button>
      </span>
      <tp-icon-button section="end" name="dots-vertical" label="More formatting tools" data-command="more" aria-pressed="false"></tp-icon-button>
      <tp-fullscreen section="end" anchor="#${this.id}"></tp-fullscreen>
      <tp-color section="end" anchor="#${this.id}"></tp-color>
      <tp-theme section="end" anchor="#${this.id}"></tp-theme>
    `;
		const secondaryToolbar = document.createElement("tp-toolbar");
		secondaryToolbar.dataset.tpProseEditorSecondaryToolbar = "";
		secondaryToolbar.setAttribute("placement", "top");
		secondaryToolbar.hidden = true;
		secondaryToolbar.innerHTML = `
      <tp-icon-button section="start" name="paragraph" label="Paragraph" data-command="format-text"></tp-icon-button>
      <tp-icon-button section="start" name="format-quote-open" label="Blockquote" data-command="format-quote-open"></tp-icon-button>
      <tp-icon-button section="start" name="format-header-1" label="Heading 1" data-command="format-header-1"></tp-icon-button>
      <tp-icon-button section="start" name="format-header-2" label="Heading 2" data-command="format-header-2"></tp-icon-button>
      <tp-icon-button section="start" name="format-header-3" label="Heading 3" data-command="format-header-3"></tp-icon-button>
      <tp-icon-button section="start" name="code-block" label="Code block" data-command="format-code-block"></tp-icon-button>
      <tp-icon-button section="start" name="function-block" label="Math block" data-command="insert-math-block"></tp-icon-button>
      <tp-icon-button section="start" name="text-block" label="Markdown block" data-command="insert-markup-markdown"></tp-icon-button>
      <tp-icon-button section="start" name="horizontal-line" label="Horizontal rule" data-command="insert-horizontal-rule"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="start" aria-hidden="true"></span>
      <tp-icon-button section="center" name="format-list-bulleted" label="Unordered list" data-command="format-list-bulleted"></tp-icon-button>
      <tp-icon-button section="center" name="format-list-numbered" label="Ordered list" data-command="format-list-numbered"></tp-icon-button>
      <tp-icon-button section="center" name="format-list-text" label="Definition list" data-command="format-list-text"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="image-plus" label="Image" data-command="insert-image"></tp-icon-button>
      <tp-icon-button section="center" name="video-plus" label="Video" data-command="insert-video"></tp-icon-button>
      <tp-icon-button section="center" name="music-note-plus" label="Audio" data-command="insert-audio"></tp-icon-button>
      <span section="center" data-tp-prose-editor-separator data-tp-prose-editor-center-boundary="end" aria-hidden="true"></span>
      <tp-icon-button section="end" name="format-bold" label="Bold" data-command="format-bold"></tp-icon-button>
      <tp-icon-button section="end" name="format-italic" label="Italic" data-command="format-italic"></tp-icon-button>
      <tp-icon-button section="end" name="format-underline" label="Underline" data-command="format-underline"></tp-icon-button>
      <tp-icon-button section="end" name="format-strikethrough" label="Strikethrough" data-command="format-strikethrough"></tp-icon-button>
      <tp-icon-button section="end" name="format-subscript" label="Subscript" data-command="format-subscript"></tp-icon-button>
      <tp-icon-button section="end" name="format-superscript" label="Superscript" data-command="format-superscript"></tp-icon-button>
      <tp-icon-button section="end" name="format-code" label="Code" data-command="format-code"></tp-icon-button>
      <tp-icon-button section="end" name="function" label="Math" data-command="format-math"></tp-icon-button>
      <tp-icon-button section="end" name="link" label="Link" data-command="link"></tp-icon-button>
    `;
		toolbar.addEventListener("mousedown", this.handleToolbarMouseDown);
		secondaryToolbar.addEventListener("mousedown", this.handleToolbarMouseDown);
		toolbar.addEventListener("click", this.handleToolbarClick);
		secondaryToolbar.addEventListener("click", this.handleToolbarClick);
		toolbar.addEventListener("tp-menu-item-select", this.handleMenuItemSelect);
		secondaryToolbar.addEventListener(
			"tp-menu-item-select",
			this.handleMenuItemSelect,
		);
		const menuElements = [
			...toolbar.querySelectorAll<HTMLElement>(
				"[data-tp-prose-editor-menu], [data-tp-prose-editor-file-menu]",
			),
			...secondaryToolbar.querySelectorAll<HTMLElement>(
				"[data-tp-prose-editor-menu], [data-tp-prose-editor-file-menu]",
			),
		];
		for (const menu of menuElements) {
			menu.addEventListener("keydown", this.handleGenericMenuKeydown);
		}
		const searchInput = toolbar.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-search-input]",
		);
		searchInput?.addEventListener("input", this.handleSearchInput);
		searchInput?.addEventListener("keydown", this.handleSearchInputKeydown);
		const searchControl = toolbar.querySelector<HTMLElement>(
			"[data-tp-prose-editor-search-control]",
		);
		const searchClearButton = toolbar.querySelector<HTMLElement>(
			"[data-tp-prose-editor-search-clear]",
		);
		searchClearButton?.addEventListener("click", this.handleSearchClearClick);
		const fileDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-file-dropdown]",
		);
		fileDropdown?.addEventListener(
			"tp-dropdown-toggle",
			this.handleFileDropdownToggle,
		);
		const typeDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-type-dropdown]",
		);
		typeDropdown?.addEventListener(
			"tp-dropdown-toggle",
			this.handleTypeDropdownToggle,
		);
		const formatDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-format-dropdown]",
		);
		formatDropdown?.addEventListener(
			"tp-dropdown-toggle",
			this.handleFormatDropdownToggle,
		);
		const htmlDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-html-dropdown]",
		);
		htmlDropdown?.addEventListener(
			"tp-dropdown-toggle",
			this.handleHTMLDropdownToggle,
		);
		const listDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-list-dropdown]",
		);
		listDropdown?.addEventListener(
			"tp-dropdown-toggle",
			this.handleListDropdownToggle,
		);
		const tableDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-table-dropdown]",
		);
		const tableMenu = toolbar.querySelector<HTMLElement>(
			"[data-tp-prose-editor-table-menu]",
		);
		tableMenu?.addEventListener("keydown", this.handleTableMenuKeydown);
		tableMenu?.addEventListener(
			"pointerover",
			this.handleTablePickerPointerOver,
		);
		tableMenu?.addEventListener("click", this.handleTablePickerClick, {
			capture: true,
		});
		tableDropdown?.addEventListener(
			"tp-dropdown-toggle",
			this.handleTableDropdownToggle,
		);
		const mediaDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-media-dropdown]",
		);
		mediaDropdown?.addEventListener(
			"tp-dropdown-toggle",
			this.handleMediaDropdownToggle,
		);
		const emojiPickerDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-emoji-picker-dropdown]",
		);
		const iconPickerDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-icon-picker-dropdown]",
		);
		const symbolPickerDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-symbol-picker-dropdown]",
		);
		emojiPickerDropdown
			?.querySelector("tp-emoji-picker")
			?.addEventListener(
				"tp-emoji-picker-select",
				this.handleEmojiPickerSelect,
			);
		iconPickerDropdown
			?.querySelector("tp-icon-picker")
			?.addEventListener("tp-icon-picker-select", this.handleIconPickerSelect);
		symbolPickerDropdown
			?.querySelector("tp-symbol-picker")
			?.addEventListener(
				"tp-symbol-picker-select",
				this.handleSymbolPickerSelect,
			);
		const htmlFileInput = toolbar.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-html-file]",
		);
		htmlFileInput?.addEventListener("change", this.handleHtmlFileChange);
		const markdownFileInput = toolbar.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-markdown-file]",
		);
		markdownFileInput?.addEventListener(
			"change",
			this.handleMarkdownFileChange,
		);
		const imageFileInput = toolbar.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-image-file]",
		);
		imageFileInput?.addEventListener("change", this.handleImageFileChange);
		const videoFileInput = toolbar.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-video-file]",
		);
		videoFileInput?.addEventListener("change", this.handleVideoFileChange);
		const audioFileInput = toolbar.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-audio-file]",
		);
		audioFileInput?.addEventListener("change", this.handleAudioFileChange);

		const surface = document.createElement("div");
		surface.dataset.tpProseEditorSurface = "";
		const htmlSource = document.createElement("textarea");
		htmlSource.dataset.tpProseEditorHtmlSource = "";
		htmlSource.placeholder = this.placeholder;
		htmlSource.hidden = true;
		htmlSource.spellcheck = false;
		htmlSource.addEventListener("input", this.handleHtmlSourceInput);
		const htmlRendered = document.createElement("div");
		htmlRendered.dataset.tpProseEditorHtmlRendered = "";
		htmlRendered.hidden = true;
		htmlRendered.tabIndex = -1;

		this.toolbarElement = toolbar;
		this.fileDropdownElement = fileDropdown;
		this.formatDropdownElement = formatDropdown;
		this.htmlDropdownElement = htmlDropdown;
		this.htmlFileInputElement = htmlFileInput;
		this.imageFileInputElement = imageFileInput;
		this.listDropdownElement = listDropdown;
		this.markdownFileInputElement = markdownFileInput;
		this.mediaDropdownElement = mediaDropdown;
		this.emojiPickerDropdownElement = emojiPickerDropdown;
		this.iconPickerDropdownElement = iconPickerDropdown;
		this.symbolPickerDropdownElement = symbolPickerDropdown;
		this.audioFileInputElement = audioFileInput;
		this.searchClearButtonElement = searchClearButton;
		this.searchControlElement = searchControl;
		this.searchInputElement = searchInput;
		this.secondaryToolbarElement = secondaryToolbar;
		this.surfaceElement = surface;
		this.tableDropdownElement = tableDropdown;
		this.htmlRenderedElement = htmlRendered;
		this.htmlSourceElement = htmlSource;
		this.typeDropdownElement = typeDropdown;
		this.videoFileInputElement = videoFileInput;
		this.append(toolbar, secondaryToolbar, surface, htmlSource, htmlRendered);
	}

	private createToolbarId(name: string): string {
		TpProseEditor.nextId += 1;
		return `tp-prose-editor-${name}-${String(TpProseEditor.nextId)}`;
	}

	private createEditor(value: string): void {
		if (this.surfaceElement === null) {
			return;
		}

		const view = new EditorView(this.surfaceElement, {
			state: EditorState.create({
				doc: this.parseHTML(value),
				plugins: [
					history(),
					searchPlugin(),
					columnResizing({ View: CaptionedTableView }),
					tableEditing(),
					keymap({
						"Mod-b": toggleMark(getMarkType("strong")),
						"Mod-i": toggleMark(getMarkType("em")),
						"Mod-`": toggleMark(getMarkType("code")),
						"Mod-z": undo,
						"Mod-y": redo,
						"Shift-Mod-z": redo,
						Enter: chainCommands(
							this.exitDefinitionListPlaceholder,
							this.insertDefinitionPairAfterDescription,
							splitListItem(getNodeType("list_item")),
						),
						Tab: goToNextCell(1),
						"Shift-Tab": goToNextCell(-1),
					}),
					keymap(baseKeymap),
				],
			}),
			dispatchTransaction: (transaction: Transaction): void => {
				let nextState = view.state.apply(transaction);
				if (this.requiresTrailingEditableBlock(nextState.doc.lastChild)) {
					const paragraph = getNodeType("paragraph").createAndFill();
					if (paragraph !== null) {
						const trailingTransaction = nextState.tr
							.insert(nextState.doc.content.size, paragraph)
							.setMeta("addToHistory", false);
						nextState = nextState.apply(trailingTransaction);
					}
				}
				view.updateState(nextState);
				this.syncPlaceholder(view);

				if (transaction.docChanged) {
					this.dispatchInputEvent();
				}

				this.updateToolbarState();
			},
			editable: () => !this.readonly,
			nodeViews: {
				audio: (node: ProseMirrorNode): NodeView =>
					this.createAudioNodeView(node),
				code_block: (
					node: ProseMirrorNode,
					view: EditorView,
					getPos: (() => number | undefined) | boolean,
				): NodeView => this.createCodeBlockNodeView(node, view, getPos),
				custom_element: (node: ProseMirrorNode): NodeView =>
					this.createCustomElementNodeView(node),
				markdown_block: (
					node: ProseMirrorNode,
					view: EditorView,
					getPos: (() => number | undefined) | boolean,
				): NodeView => this.createMarkdownBlockNodeView(node, view, getPos),
				math_block: (
					node: ProseMirrorNode,
					view: EditorView,
					getPos: (() => number | undefined) | boolean,
				): NodeView => this.createMathNodeView(node, view, getPos, true),
				math_inline: (
					node: ProseMirrorNode,
					view: EditorView,
					getPos: (() => number | undefined) | boolean,
				): NodeView => this.createMathNodeView(node, view, getPos, false),
			},
		});

		view.dom.setAttribute("aria-label", "Rich text editor");
		view.dom.setAttribute("role", "textbox");
		view.dom.setAttribute("aria-multiline", "true");
		this.editorView = view;
		this.syncPlaceholder(view);
		this.updateToolbarState();
		this.loadRenderedTpComponents();
	}

	private replaceDocument(value: string): void {
		if (this.editorView === null) {
			this.initialHTML = value;
			return;
		}

		const nextState = EditorState.create({
			doc: this.parseHTML(value),
			plugins: this.editorView.state.plugins,
		});
		this.editorView.updateState(nextState);
		this.syncPlaceholder();
		this.updateToolbarState();
		this.loadRenderedTpComponents();
	}

	private syncPlaceholder(view = this.editorView): void {
		if (this.htmlSourceElement !== null) {
			this.htmlSourceElement.placeholder = this.placeholder;
		}
		if (view === null) return;

		view.dom.dataset.placeholder = this.placeholder;
		const doc = view.state.doc;
		const isEmpty =
			doc.childCount === 1 &&
			doc.firstChild?.isTextblock === true &&
			doc.firstChild.content.size === 0;
		view.dom.toggleAttribute("data-tp-prose-editor-empty", isEmpty);
	}

	private insertHTMLWithHistory(value: string): void {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(value);
			return;
		}

		if (this.editorView === null) {
			this.setHTML(value);
			return;
		}

		const nextDoc = this.parseHTML(value);
		const transaction = this.editorView.state.tr.replaceSelection(
			new Slice(nextDoc.content, 0, 0),
		);

		this.editorView.dispatch(transaction);

		if (this.htmlSourceElement !== null) {
			this.htmlSourceElement.value = this.serializeDocument(transaction.doc);
		}

		this.updateToolbarState();
		this.loadRenderedTpComponents();
		this.editorView.focus();
	}

	private async loadSrcDocument(): Promise<void> {
		const rawSrc = this.src.trim();
		const token = ++this.srcLoadToken;

		if (rawSrc === "") {
			return;
		}

		try {
			const sourceUrl = this.resolveSourceUrl(rawSrc);
			const response = await fetch(sourceUrl.href, { cache: "no-store" });

			if (!response.ok) {
				throw new Error(
					`Unable to load ${sourceUrl.pathname} (${String(response.status)})`,
				);
			}

			const source = await response.text();

			if (token !== this.srcLoadToken || !this.isConnected) {
				return;
			}

			if (this.isMarkdownSource(sourceUrl)) {
				await this.replaceDocumentWithMarkdownSource(source, sourceUrl);
				return;
			}

			this.setHTML(await this.renderSourceDocument(source, sourceUrl));
		} catch (error: unknown) {
			if (token !== this.srcLoadToken || !this.isConnected) {
				return;
			}

			const message = error instanceof Error ? error.message : String(error);
			this.setHTML(`<pre><code>${escapeHtml(message)}</code></pre>`);
		}
	}

	private async renderSourceDocument(
		source: string,
		sourceUrl: URL,
	): Promise<string> {
		const extension = this.getSourceExtension(sourceUrl);

		if (extension === "html" || extension === "htm") {
			return source;
		}

		return `<pre><code>${escapeHtml(source)}</code></pre>`;
	}

	private async replaceDocumentWithMarkdownSource(
		markdown: string,
		sourceUrl: URL,
	): Promise<void> {
		const root = document.createElement("div");
		await renderMarkdownInto(markdown, root, sourceUrl.pathname);
		const html = this.serializeRenderedElement(root);
		const markdownBlock = getNodeType("markdown_block").create({
			html,
			markdown,
			view: "preview",
		});
		const doc = this.ensureTrailingEditableBlock(
			schema.topNodeType.create(null, [markdownBlock]),
		);

		this.replaceDocumentNode(doc);
		this.syncHTMLSurfaces(html);
		this.internalValueUpdate = true;
		this.setStringAttribute("value", html);
		this.internalValueUpdate = false;
		this.dispatchInputEvent();
	}

	private serializeRenderedElement(root: HTMLElement): string {
		this.syncFormControlAttributes(root);
		return root.innerHTML;
	}

	private async renderMarkupInto(
		source: string,
		language: MarkupBlockLanguage,
		root: HTMLElement,
	): Promise<void> {
		if (language === "html") {
			root.innerHTML = source;
			return;
		}
		if (language === "asciidoc") {
			await renderAsciidocInto(source, root);
			return;
		}
		if (language === "restructuredtext") {
			await renderRestructuredTextInto(source, root);
			return;
		}
		await renderMarkdownInto(source, root, "/tp-prose-editor-markup-block.md");
	}

	private syncFormControlAttributes(root: ParentNode): void {
		for (const input of root.querySelectorAll<HTMLInputElement>("input")) {
			if (input.type === "checkbox" || input.type === "radio") {
				input.toggleAttribute("checked", input.checked);
			} else {
				input.setAttribute("value", input.value);
			}
		}

		for (const textarea of root.querySelectorAll<HTMLTextAreaElement>(
			"textarea",
		)) {
			textarea.textContent = textarea.value;
		}

		for (const select of root.querySelectorAll<HTMLSelectElement>("select")) {
			for (const option of select.options) {
				option.toggleAttribute("selected", option.selected);
			}
		}
	}

	private replaceDocumentNode(doc: ProseMirrorNode): void {
		if (this.editorView === null) {
			return;
		}

		const nextState = EditorState.create({
			doc,
			plugins: this.editorView.state.plugins,
		});
		this.editorView.updateState(nextState);
		this.updateToolbarState();
		this.loadRenderedTpComponents();
	}

	private syncHTMLSurfaces(value: string): void {
		if (this.htmlSourceElement !== null) {
			this.htmlSourceElement.value = value;
		}
		if (this.htmlRenderedElement !== null) {
			this.htmlRenderedElement.innerHTML = value;
		}
	}

	private isMarkdownSource(sourceUrl: URL): boolean {
		const extension = this.getSourceExtension(sourceUrl);
		return extension === "md" || extension === "markdown";
	}

	private getSourceExtension(sourceUrl: URL): string {
		const filename = sourceUrl.pathname.split("/").pop() ?? "";
		const extensionIndex = filename.lastIndexOf(".");

		if (extensionIndex < 0) {
			return "";
		}

		return filename.slice(extensionIndex + 1).toLowerCase();
	}

	private resolveSourceUrl(src: string): URL {
		return resolveComponentSourceUrl(this, src);
	}

	private parseHTML(value: string): ProseMirrorNode {
		const container = document.createElement("div");
		container.innerHTML = value.trim() === "" ? "<p></p>" : value;
		return this.ensureTrailingEditableBlock(
			ProseMirrorDOMParser.fromSchema(schema).parse(container),
		);
	}

	private serializeDocument(
		doc: ProseMirrorNode,
		options: SerializeDocumentOptions = {},
	): string {
		const container = document.createElement("div");
		const nodes = Array.from(this.iterateChildNodes(doc));

		for (const [index, node] of nodes.entries()) {
			if (this.shouldSkipTrailingEditableBlock(nodes, index)) {
				continue;
			}

			if (this.shouldSkipEmptyParagraphBeforeMedia(nodes, index)) {
				continue;
			}

			if (node.type === getNodeType("markdown_block")) {
				const template = document.createElement("template");
				template.innerHTML = String(node.attrs.html);
				container.append(template.content.cloneNode(true));
				continue;
			}

			if (
				options.renderComponents === true &&
				node.type === getNodeType("code_block")
			) {
				container.append(this.serializeCodeBlockAsComponent(node));
				continue;
			}

			container.append(DOMSerializer.fromSchema(schema).serializeNode(node));
		}

		for (const icon of container.querySelectorAll("tp-icon")) {
			const sibling = icon.nextSibling;
			if (
				sibling instanceof Text &&
				sibling.data.startsWith(inlineIconCaretAnchor)
			) {
				sibling.data = sibling.data.slice(inlineIconCaretAnchor.length);
				if (sibling.data === "") sibling.remove();
			}
		}
		return container.innerHTML;
	}

	private serializeCodeBlockAsComponent(node: ProseMirrorNode): HTMLElement {
		const editor = document.createElement("tp-code-editor");
		const script = document.createElement("script");
		const language = normalizeCodeBlockLanguage(node.attrs.language);
		const src = typeof node.attrs.src === "string" ? node.attrs.src.trim() : "";

		editor.setAttribute("language", language);
		editor.setAttribute("line-numbers", "");
		editor.setAttribute("word-wrap", "");
		applyCodeBlockVisualClasses(editor, node.attrs.theme, node.attrs.color);
		editor.addEventListener(
			"tp-code-editor-ready",
			() => {
				syncCodeEditorThemeControl(editor, node.attrs.theme);
				applyCodeBlockVisualClasses(editor, node.attrs.theme, node.attrs.color);
			},
			{ once: true },
		);

		if (src !== "") {
			editor.setAttribute("filename", src);
			if (isFetchableCodeSource(src)) {
				editor.setAttribute("src", src);
			}
			script.setAttribute("filename", src);
		}

		script.type = `tp/${language}`;
		script.textContent = node.textContent;
		editor.append(script);
		return editor;
	}

	private ensureTrailingEditableBlock(doc: ProseMirrorNode): ProseMirrorNode {
		if (!this.requiresTrailingEditableBlock(doc.lastChild)) {
			return doc;
		}

		const paragraph = getNodeType("paragraph").createAndFill();

		if (paragraph === null) {
			return doc;
		}

		return doc.copy(doc.content.append(Fragment.from(paragraph)));
	}

	private shouldSkipTrailingEditableBlock(
		nodes: ProseMirrorNode[],
		index: number,
	): boolean {
		if (index !== nodes.length - 1) {
			return false;
		}

		const node = nodes[index];
		const previousNode = nodes[index - 1];

		return (
			node !== undefined &&
			previousNode !== undefined &&
			this.isEmptyParagraph(node) &&
			this.requiresTrailingEditableBlock(previousNode)
		);
	}

	private shouldSkipEmptyParagraphBeforeMedia(
		nodes: ProseMirrorNode[],
		index: number,
	): boolean {
		const node = nodes[index];
		const nextNode = nodes[index + 1];

		return (
			node !== undefined &&
			nextNode !== undefined &&
			this.isEmptyParagraph(node) &&
			(nextNode.type === getNodeType("image") ||
				nextNode.type === getNodeType("video"))
		);
	}

	private isEmptyParagraph(node: ProseMirrorNode): boolean {
		return node.type === getNodeType("paragraph") && node.content.size === 0;
	}

	private requiresTrailingEditableBlock(node: ProseMirrorNode | null): boolean {
		if (node === null) {
			return false;
		}

		return (
			node.type === getNodeType("bullet_list") ||
			node.type === getNodeType("definition_list") ||
			node.type === getNodeType("ordered_list") ||
			node.type === getNodeType("table") ||
			node.type === getNodeType("code_block") ||
			node.type === getNodeType("custom_element") ||
			node.type === getNodeType("markdown_block") ||
			node.type === getNodeType("math_block") ||
			node.type === getNodeType("image") ||
			node.type === getNodeType("video") ||
			node.type === getNodeType("audio")
		);
	}

	private *iterateChildNodes(node: ProseMirrorNode): Iterable<ProseMirrorNode> {
		for (let index = 0; index < node.childCount; index += 1) {
			yield node.child(index);
		}
	}

	private loadRenderedTpComponents(): void {
		if (this.surfaceElement === null) {
			return;
		}

		void loadUsedTpComponents(this.surfaceElement).catch((error: unknown) => {
			console.error("Unable to load tp components in prose editor", error);
		});
	}

	private loadRenderedHTMLComponents(): void {
		if (this.htmlRenderedElement === null) {
			return;
		}

		void this.refreshRenderedHTML(this.htmlRenderedElement);
	}

	private async refreshRenderedHTML(root: HTMLElement): Promise<void> {
		try {
			await loadUsedTpComponents(root);
			await this.waitForRenderedMarkdownElements(root);
			await renderMarkdownRuntimeIn(root, "/tp-prose-editor-html-render.md");
			await this.renderMathElements(root);
		} catch (error: unknown) {
			console.error("Unable to refresh prose editor HTML render", error);
		}
	}

	private async waitForRenderedMarkdownElements(
		root: ParentNode,
	): Promise<void> {
		const markdownElements = root.querySelectorAll("tp-markdown");

		await Promise.all(
			Array.from(markdownElements, (element) =>
				this.waitForRenderedMarkdownElement(element),
			),
		);
	}

	private waitForRenderedMarkdownElement(element: Element): Promise<void> {
		if (element.hasAttribute("data-tp-markdown-rendered")) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			const timeout = window.setTimeout(() => {
				element.removeEventListener("tp-markdown-rendered", handleRendered);
				resolve();
			}, MARKDOWN_RENDER_TIMEOUT);

			const handleRendered = (): void => {
				window.clearTimeout(timeout);
				resolve();
			};

			element.addEventListener("tp-markdown-rendered", handleRendered, {
				once: true,
			});
		});
	}

	private async ensureMathJax(): Promise<MathJaxApi> {
		const currentWindow = window as MathJaxWindow;

		if (typeof currentWindow.MathJax?.tex2svgPromise === "function") {
			await currentWindow.MathJax.startup?.promise;
			return currentWindow.MathJax;
		}

		if (mathJaxLoadPromise !== null) {
			await mathJaxLoadPromise;
			return currentWindow.MathJax ?? {};
		}

		mathJaxLoadPromise = new Promise<void>((resolve, reject) => {
			currentWindow.MathJax = {
				...currentWindow.MathJax,
				loader: {
					load: ["input/tex", "output/svg"],
				},
				tex: {
					packages: {
						"[+]": [],
					},
				},
				svg: {
					fontCache: "local",
				},
				startup: {
					typeset: false,
				},
			};

			const script = document.createElement("script");
			script.async = true;
			script.src = MATHJAX_URL;
			script.addEventListener(
				"load",
				() => {
					void Promise.resolve(currentWindow.MathJax?.startup?.promise).then(
						() => {
							resolve();
						},
					);
				},
				{ once: true },
			);
			script.addEventListener(
				"error",
				() => {
					reject(new Error("Unable to load MathJax"));
				},
				{ once: true },
			);
			document.head.append(script);
		}).catch((error: unknown) => {
			mathJaxLoadPromise = null;
			throw error;
		});

		await mathJaxLoadPromise;
		return currentWindow.MathJax ?? {};
	}

	private async renderMathElements(root: ParentNode): Promise<void> {
		const elements = root.querySelectorAll<HTMLElement>("[data-mathjax-tex]");

		for (const element of elements) {
			await this.renderMathElement(element);
		}
	}

	private async renderMathElement(element: HTMLElement): Promise<void> {
		const tex = element.getAttribute("data-mathjax-tex") ?? "";

		if (tex.trim() === "") {
			element.textContent = "";
			return;
		}

		element.textContent =
			element.getAttribute("data-mathjax-display") === "true"
				? `$$${tex}$$`
				: `$${tex}$`;

		try {
			const mathJax = await this.ensureMathJax();

			if (typeof mathJax.tex2svgPromise !== "function") {
				return;
			}

			const svg = await mathJax.tex2svgPromise(tex, {
				display: element.getAttribute("data-mathjax-display") === "true",
			});
			element.replaceChildren(svg);
			element.setAttribute("data-mathjax-rendered", "true");
		} catch (error: unknown) {
			console.warn("Unable to render MathJax formula", error);
		}
	}

	private createMathNodeView(
		node: ProseMirrorNode,
		view: EditorView,
		getPos: (() => number | undefined) | boolean,
		display: boolean,
	): NodeView {
		let currentNode = node;
		const dom = document.createElement(display ? "div" : "span");
		dom.className = display
			? "tp-prose-editor-math-block"
			: "tp-prose-editor-math-inline";
		dom.toggleAttribute("data-tp-prose-editor-math-block", display);
		dom.toggleAttribute("data-tp-prose-editor-math-inline", !display);
		dom.setAttribute("data-mathjax-display", String(display));
		dom.contentEditable = "false";

		const updateAttributes = (): void => {
			dom.setAttribute("data-mathjax-tex", String(currentNode.attrs.tex));
			void this.renderMathElement(dom);
		};
		const editFormula = (): void => {
			if (this.readonly || typeof getPos !== "function") {
				return;
			}

			const position = getPos();

			if (typeof position !== "number") {
				return;
			}

			const nextTex = window.prompt("Math", String(currentNode.attrs.tex));

			if (nextTex === null) {
				return;
			}

			view.dispatch(
				view.state.tr.setNodeMarkup(position, undefined, {
					tex: nextTex,
				}),
			);
		};

		dom.addEventListener("dblclick", editFormula);
		updateAttributes();

		return {
			dom,
			stopEvent: (event: Event): boolean => event.type === "dblclick",
			ignoreMutation: (): boolean => true,
			update: (nextNode: ProseMirrorNode): boolean => {
				if (nextNode.type !== currentNode.type) {
					return false;
				}

				currentNode = nextNode;
				updateAttributes();
				return true;
			},
			destroy: (): void => {
				dom.removeEventListener("dblclick", editFormula);
			},
		};
	}

	private createCodeBlockNodeView(
		node: ProseMirrorNode,
		view: EditorView,
		getPos: (() => number | undefined) | boolean,
	): NodeView {
		let currentNode = node;
		const dom = document.createElement("div");
		const toolbar = document.createElement("div");
		const fileButtonId = this.createToolbarId("code-file");
		const languageButtonId = this.createToolbarId("code-language");
		const editor = document.createElement(
			"tp-code-editor",
		) as TpCodeEditorElement;
		const fileInput = document.createElement("input");
		const languageItems = CODE_BLOCK_LANGUAGES.map(
			(language) => `<li data-code-language="${language}">${language}</li>`,
		).join("");

		dom.dataset.tpProseEditorCodeBlockEditor = "";
		toolbar.dataset.tpProseEditorCodeBlockToolbar = "";
		toolbar.innerHTML = `
      <tp-icon-button id="${fileButtonId}" name="file" label="Code file" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown data-tp-prose-editor-code-file-dropdown anchor="#${fileButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-code-menu>
          <ul>
            <li data-code-file-action="load"><span data-tp-prose-editor-menu-label><tp-icon name="file-download" aria-hidden="true"></tp-icon><span>Load</span></span></li>
            <li data-code-file-action="save"><span data-tp-prose-editor-menu-label><tp-icon name="file-upload" aria-hidden="true"></tp-icon><span>Save</span></span></li>
            <li data-code-file-action="save-as"><span data-tp-prose-editor-menu-label><tp-icon name="file-upload-as" aria-hidden="true"></tp-icon><span>Save as</span></span></li>
          </ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button id="${languageButtonId}" name="code" label="Code language" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
      <tp-dropdown data-tp-prose-editor-code-language-dropdown anchor="#${languageButtonId}" placement="bottom" offset="4px" outside-click>
        <tp-menu data-tp-prose-editor-code-menu>
          <ul>${languageItems}</ul>
        </tp-menu>
      </tp-dropdown>
      <tp-icon-button data-tp-prose-editor-code-toolbar name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)"></tp-icon-button>
    `;
		editor.dataset.tpProseEditorCodeBlock = "";
		editor.setAttribute("line-numbers", "");
		editor.setAttribute("word-wrap", "");
		editor.readonly = this.readonly;
		fileInput.type = "file";
		fileInput.hidden = true;
		fileInput.dataset.tpProseEditorCodeFile = "";
		dom.append(toolbar, fileInput, editor);
		const fileButton = toolbar.querySelector<HTMLElement>(`#${fileButtonId}`);
		const languageButton = toolbar.querySelector<HTMLElement>(
			`#${languageButtonId}`,
		);
		const editorToolbarButton = toolbar.querySelector<HTMLElement>(
			"[data-tp-prose-editor-code-toolbar]",
		);
		const fileDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-code-file-dropdown]",
		);
		const languageDropdown = toolbar.querySelector<TpDropdownElement>(
			"[data-tp-prose-editor-code-language-dropdown]",
		);

		const syncEditorAttributes = (): void => {
			const language = normalizeCodeBlockLanguage(currentNode.attrs.language);
			const src =
				typeof currentNode.attrs.src === "string"
					? currentNode.attrs.src.trim()
					: "";

			editor.setAttribute("language", language);
			syncCodeEditorThemeControl(editor, currentNode.attrs.theme);
			applyCodeBlockVisualClasses(
				editor,
				currentNode.attrs.theme,
				currentNode.attrs.color,
			);
			if (src === "") {
				editor.removeAttribute("src");
				editor.removeAttribute("filename");
			} else if (isFetchableCodeSource(src)) {
				editor.setAttribute("src", src);
				editor.removeAttribute("filename");
			} else {
				editor.removeAttribute("src");
				editor.setAttribute("filename", src);
			}
			for (const item of toolbar.querySelectorAll<HTMLElement>(
				"[data-code-language]",
			)) {
				item.toggleAttribute(
					"data-selected",
					item.dataset.codeLanguage === language,
				);
				if (item.dataset.codeLanguage === language) {
					item.setAttribute("aria-current", "true");
				} else {
					item.removeAttribute("aria-current");
				}
			}
		};

		const updateNode = (
			attrs: Record<string, unknown> = currentNode.attrs,
			nextValue = editor.getValue(),
		): void => {
			if (typeof getPos !== "function") {
				return;
			}

			const position = getPos();

			if (typeof position !== "number") {
				return;
			}

			let transaction = view.state.tr.setNodeMarkup(position, undefined, attrs);

			if (nextValue !== currentNode.textContent) {
				const content =
					nextValue === ""
						? Fragment.empty
						: Fragment.from(schema.text(nextValue));
				transaction = transaction.replaceWith(
					position + 1,
					position + currentNode.nodeSize - 1,
					content,
				);
			}

			view.dispatch(transaction);
		};

		const updateVisualAttrsFromEditor = (): void => {
			let nextTheme = getCodeBlockTheme([editor]);
			const nextColor = getCodeBlockColor([editor]);
			const currentTheme = normalizeCodeBlockTheme(currentNode.attrs.theme);
			const themeMode = getCodeEditorThemeMode(editor);

			if (nextTheme !== null && themeMode === "auto") {
				editor.classList.remove(...CODE_BLOCK_THEME_CLASSES);
				if (currentTheme !== null) {
					editor.classList.add(currentTheme);
				}
				nextTheme = currentTheme;
			}

			if (
				nextTheme === currentTheme &&
				nextColor === normalizeCodeBlockColor(currentNode.attrs.color)
			) {
				return;
			}

			updateNode({
				...currentNode.attrs,
				theme: nextTheme,
				color: nextColor,
			});
		};

		const visualObserver = new MutationObserver(updateVisualAttrsFromEditor);
		visualObserver.observe(editor, {
			attributeFilter: ["class"],
			attributes: true,
		});

		const setCodeValue = (nextValue: string): void => {
			if (editor.getValue() !== nextValue) {
				editor.setValue(nextValue);
			}
		};
		setCodeValue(node.textContent);
		syncEditorAttributes();

		const updateDocument = (): void => {
			if (editor.getValue() === currentNode.textContent) {
				return;
			}

			updateNode(currentNode.attrs, editor.getValue());
		};
		const loadSelectedCodeFile = async (): Promise<void> => {
			const file = fileInput.files?.[0];

			if (file === undefined) {
				return;
			}

			const value = await file.text();
			const language = normalizeCodeBlockLanguage(
				getLanguageFromFilename(file.name),
			);
			updateNode(
				{
					...currentNode.attrs,
					language,
					src: file.name,
				},
				value,
			);
			setCodeValue(value);
			editor.setAttribute("language", language);
			editor.removeAttribute("src");
			editor.setAttribute("filename", file.name);
			fileInput.value = "";
		};
		const handleCodeFileChange = (): void => {
			void loadSelectedCodeFile();
		};
		const saveCode = (filename?: string): void => {
			const src =
				typeof currentNode.attrs.src === "string"
					? currentNode.attrs.src.trim()
					: "";
			const fallback =
				filename ??
				(src.split("/").pop() ||
					`code.${normalizeCodeBlockLanguage(currentNode.attrs.language)}`);
			this.downloadTextFile(
				fallback,
				editor.getValue(),
				"text/plain;charset=utf-8",
			);
		};
		const saveCodeAs = (): void => {
			const src =
				typeof currentNode.attrs.src === "string"
					? currentNode.attrs.src.trim()
					: "";
			const fallback =
				src.split("/").pop() ||
				`code.${normalizeCodeBlockLanguage(currentNode.attrs.language)}`;
			void this.saveTextFileAs(
				fallback,
				editor.getValue(),
				"text/plain;charset=utf-8",
			);
		};
		const handleFileMenuSelect = (event: Event): void => {
			const item = (event as CustomEvent<{ item?: HTMLElement }>).detail?.item;
			const action = item?.dataset.codeFileAction;

			if (action === "load") {
				fileInput.value = "";
				fileInput.click();
			} else if (action === "save") {
				saveCode();
			} else if (action === "save-as") {
				saveCodeAs();
			}

			item?.closest<TpDropdownElement>("tp-dropdown")?.hide();
		};
		const handleLanguageMenuSelect = (event: Event): void => {
			const item = (event as CustomEvent<{ item?: HTMLElement }>).detail?.item;
			const language = item?.dataset.codeLanguage;

			if (language === undefined) {
				return;
			}

			updateNode(
				{
					...currentNode.attrs,
					language,
					src: currentNode.attrs.src,
				},
				editor.getValue(),
			);
			item?.closest<TpDropdownElement>("tp-dropdown")?.hide();
		};
		const handleCodeLoad = (): void => {
			updateDocument();
		};
		const handleCodeReady = (): void => {
			syncEditorAttributes();
		};
		const syncCodeDropdownButtons = (): void => {
			fileButton?.setAttribute(
				"aria-expanded",
				String(fileDropdown?.open === true),
			);
			languageButton?.setAttribute(
				"aria-expanded",
				String(languageDropdown?.open === true),
			);
		};
		const toggleCodeDropdown = (
			event: Event,
			dropdown: TpDropdownElement | null,
			otherDropdown: TpDropdownElement | null,
		): void => {
			event.preventDefault();
			event.stopPropagation();

			if (dropdown === null) {
				return;
			}

			otherDropdown?.hide();
			dropdown.toggle();
			syncCodeDropdownButtons();

			if (dropdown.open) {
				dropdown
					.querySelector<HTMLElement>('li[role="menuitem"], li, button, input')
					?.focus();
			} else {
				editor.focus();
			}
		};
		const handleFileButtonClick = (event: Event): void => {
			toggleCodeDropdown(event, fileDropdown, languageDropdown);
		};
		const handleLanguageButtonClick = (event: Event): void => {
			toggleCodeDropdown(event, languageDropdown, fileDropdown);
		};
		const handleCodeDropdownToggle = (): void => {
			syncCodeDropdownButtons();
		};
		const handleEditorToolbarClick = (): void => {
			editor.toolbar = !editor.toolbar;
			editorToolbarButton?.setAttribute("aria-pressed", String(editor.toolbar));
		};

		editor.addEventListener("tp-code-editor-input", updateDocument);
		editor.addEventListener("tp-code-editor-load", handleCodeLoad);
		editor.addEventListener("tp-code-editor-ready", handleCodeReady);
		fileInput.addEventListener("change", handleCodeFileChange);
		fileButton?.addEventListener("click", handleFileButtonClick);
		languageButton?.addEventListener("click", handleLanguageButtonClick);
		editorToolbarButton?.addEventListener("click", handleEditorToolbarClick);
		fileDropdown?.addEventListener(
			"tp-dropdown-toggle",
			handleCodeDropdownToggle,
		);
		languageDropdown?.addEventListener(
			"tp-dropdown-toggle",
			handleCodeDropdownToggle,
		);
		fileDropdown?.addEventListener("tp-menu-item-select", handleFileMenuSelect);
		languageDropdown?.addEventListener(
			"tp-menu-item-select",
			handleLanguageMenuSelect,
		);

		return {
			dom,
			stopEvent: (): boolean => true,
			ignoreMutation: (): boolean => true,
			update: (nextNode: ProseMirrorNode): boolean => {
				if (nextNode.type !== currentNode.type) {
					return false;
				}

				currentNode = nextNode;
				const nextValue = nextNode.textContent;

				setCodeValue(nextValue);
				syncEditorAttributes();
				editor.readonly = this.readonly;
				return true;
			},
			destroy: (): void => {
				visualObserver.disconnect();
				editor.removeEventListener("tp-code-editor-input", updateDocument);
				editor.removeEventListener("tp-code-editor-load", handleCodeLoad);
				editor.removeEventListener("tp-code-editor-ready", handleCodeReady);
				fileInput.removeEventListener("change", handleCodeFileChange);
				fileButton?.removeEventListener("click", handleFileButtonClick);
				languageButton?.removeEventListener("click", handleLanguageButtonClick);
				editorToolbarButton?.removeEventListener(
					"click",
					handleEditorToolbarClick,
				);
				fileDropdown?.removeEventListener(
					"tp-dropdown-toggle",
					handleCodeDropdownToggle,
				);
				languageDropdown?.removeEventListener(
					"tp-dropdown-toggle",
					handleCodeDropdownToggle,
				);
				fileDropdown?.removeEventListener(
					"tp-menu-item-select",
					handleFileMenuSelect,
				);
				languageDropdown?.removeEventListener(
					"tp-menu-item-select",
					handleLanguageMenuSelect,
				);
			},
		};
	}

	private createMarkdownBlockNodeView(
		node: ProseMirrorNode,
		view: EditorView,
		getPos: (() => number | undefined) | boolean,
	): NodeView {
		let currentNode = node;
		const dom = document.createElement("div");
		const header = document.createElement("div");
		const modes = document.createElement("div");
		const editor = document.createElement(
			"tp-code-editor",
		) as TpCodeEditorElement;
		const preview = document.createElement("div");
		let renderToken = 0;
		let viewMode = normalizeMarkdownBlockViewMode(node.attrs.view);
		const language = normalizeMarkupBlockLanguage(node.attrs.language);
		const languageLabel =
			language === "restructuredtext"
				? "reStructuredText"
				: language === "asciidoc"
					? "AsciiDoc"
					: language === "html"
						? "HTML"
						: "Markdown";

		dom.dataset.tpProseEditorMarkdownBlockEditor = "";
		header.dataset.tpProseEditorMarkdownBlockHeader = "";
		modes.dataset.tpProseEditorMarkdownBlockModes = "";
		modes.setAttribute("role", "group");
		modes.setAttribute("aria-label", `${languageLabel} block display`);
		const modeOptions = [
			["both", "splitscreen", `${languageLabel} + HTML`],
			["source", "splitscreen-top", languageLabel],
			["preview", "splitscreen-bottom", "HTML"],
		] as const;

		for (const [mode, iconName, label] of modeOptions) {
			const button = document.createElement("tp-icon-button");

			button.setAttribute("type", "button");
			button.setAttribute("name", iconName);
			button.setAttribute("label", label);
			button.dataset.markdownView = mode;
			modes.append(button);
		}
		const editorToolbarButton = document.createElement("tp-icon-button");
		editorToolbarButton.setAttribute("name", "keyboard-f1");
		editorToolbarButton.setAttribute("label", "Toggle editor toolbar");
		editorToolbarButton.setAttribute("title", "Toggle editor toolbar (F1)");
		editorToolbarButton.dataset.tpProseEditorMarkupToolbar = "";
		modes.append(editorToolbarButton);
		header.append(modes);
		editor.dataset.tpProseEditorMarkdownSource = "";
		editor.setAttribute("language", language);
		editor.setAttribute("line-numbers", "");
		editor.setAttribute("word-wrap", "");
		editor.readonly = this.readonly;
		editor.setValue(String(node.attrs.markdown));
		preview.dataset.tpProseEditorMarkdownPreview = "";
		preview.innerHTML = String(node.attrs.html);
		dom.append(header, editor, preview);

		const updateMarkdownBlockAttributes = (attrs: {
			html: string;
			language: MarkupBlockLanguage;
			markdown: string;
			view: MarkdownBlockViewMode;
		}): void => {
			if (typeof getPos !== "function") {
				return;
			}

			const position = getPos();

			if (typeof position !== "number") {
				return;
			}

			if (
				currentNode.attrs.markdown === attrs.markdown &&
				currentNode.attrs.html === attrs.html &&
				normalizeMarkdownBlockViewMode(currentNode.attrs.view) === attrs.view
			) {
				return;
			}

			view.dispatch(view.state.tr.setNodeMarkup(position, undefined, attrs));
		};

		const syncViewMode = (
			nextViewMode: MarkdownBlockViewMode,
			shouldUpdateDocument = false,
		): void => {
			viewMode = nextViewMode;
			dom.dataset.viewMode = nextViewMode;
			editor.hidden = nextViewMode === "preview";
			editorToolbarButton.hidden = nextViewMode === "preview";
			preview.hidden = nextViewMode === "source";
			for (const button of modes.querySelectorAll<HTMLElement>(
				"tp-icon-button[data-markdown-view]",
			)) {
				button.setAttribute(
					"aria-pressed",
					String(button.dataset.markdownView === nextViewMode),
				);
			}

			if (shouldUpdateDocument) {
				updateMarkdownBlockAttributes({
					html: String(currentNode.attrs.html),
					language,
					markdown: String(currentNode.attrs.markdown),
					view: nextViewMode,
				});
			}

			if (nextViewMode === "preview") {
				document.getSelection()?.removeAllRanges();
			}
		};

		const renderMarkupBlock = (source: string): void => {
			renderToken += 1;
			const currentToken = renderToken;
			const previewRoot = document.createElement("div");

			void this.renderMarkupInto(source, language, previewRoot)
				.then(() => {
					if (currentToken !== renderToken) {
						return;
					}

					const html = this.serializeRenderedElement(previewRoot);
					preview.innerHTML = html;

					updateMarkdownBlockAttributes({
						html,
						language,
						markdown: source,
						view: viewMode,
					});
				})
				.catch((error: unknown) => {
					console.error(
						`Unable to render ${languageLabel} block in prose editor`,
						error,
					);
				});
		};

		const handleInput = (): void => {
			renderMarkupBlock(editor.getValue());
		};

		const handleModeMouseDown = (event: MouseEvent): void => {
			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			if (target.closest("tp-icon-button[data-markdown-view]") !== null) {
				event.preventDefault();
			}
		};

		const handleModeClick = (event: MouseEvent): void => {
			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			const button = target.closest<HTMLElement>(
				"tp-icon-button[data-markdown-view]",
			);

			if (button === null) {
				return;
			}

			event.preventDefault();
			syncViewMode(
				normalizeMarkdownBlockViewMode(button.dataset.markdownView),
				true,
			);
		};

		editor.addEventListener("tp-code-editor-input", handleInput);
		editorToolbarButton.addEventListener("click", () => {
			editor.toolbar = !editor.toolbar;
			editorToolbarButton.setAttribute("aria-pressed", String(editor.toolbar));
		});
		modes.addEventListener("mousedown", handleModeMouseDown);
		modes.addEventListener("click", handleModeClick);
		syncViewMode(viewMode);

		if (node.attrs.html === "" && node.attrs.markdown !== "") {
			renderMarkupBlock(String(node.attrs.markdown));
		}

		return {
			dom,
			stopEvent: (): boolean => true,
			ignoreMutation: (): boolean => true,
			update: (nextNode: ProseMirrorNode): boolean => {
				if (nextNode.type !== currentNode.type) {
					return false;
				}

				currentNode = nextNode;
				const markdown = String(nextNode.attrs.markdown);
				const html = String(nextNode.attrs.html);
				const nextViewMode = normalizeMarkdownBlockViewMode(
					nextNode.attrs.view,
				);

				if (editor.getValue() !== markdown) {
					editor.setValue(markdown);
				}

				if (preview.innerHTML !== html) {
					preview.innerHTML = html;
				}

				editor.readonly = this.readonly;
				syncViewMode(nextViewMode);
				return true;
			},
			destroy: (): void => {
				renderToken += 1;
				editor.removeEventListener("tp-code-editor-input", handleInput);
				modes.removeEventListener("mousedown", handleModeMouseDown);
				modes.removeEventListener("click", handleModeClick);
			},
		};
	}

	private createCustomElementNodeView(node: ProseMirrorNode): NodeView {
		const dom = this.createCustomElementDOM(node);
		dom.contentEditable = "false";
		dom.dataset.tpProseEditorCustomElement = "";

		void loadUsedTpComponents(dom).catch((error: unknown) => {
			console.error("Unable to load tp component node view", error);
		});

		return {
			dom,
			stopEvent: (event: Event): boolean =>
				this.shouldIgnoreCustomElementEvent(event),
			ignoreMutation: (): boolean => true,
			update: (nextNode: ProseMirrorNode): boolean => {
				if (
					nextNode.type !== node.type ||
					nextNode.attrs.html !== node.attrs.html
				) {
					return false;
				}

				return true;
			},
		};
	}

	private createAudioNodeView(node: ProseMirrorNode): NodeView {
		if (node.attrs.controls === true) {
			const audio = this.createAudioElement(node);
			const figure = createMediaFigure(audio, node.attrs.caption);
			return {
				dom: figure,
				ignoreMutation: (): boolean => true,
			};
		}

		const wrapper = document.createElement("span");
		wrapper.dataset.tpProseEditorAudioButton = "";
		wrapper.contentEditable = "false";

		const audio = this.createAudioElement(node);
		audio.hidden = true;

		const button = document.createElement("tp-icon-button");
		button.setAttribute("name", "volume-high");
		button.setAttribute("label", String(node.attrs.title || "Play audio"));
		button.addEventListener("click", (event: MouseEvent) => {
			event.preventDefault();
			void audio.play();
		});

		wrapper.append(button, audio);
		return {
			dom: wrapper,
			ignoreMutation: (): boolean => true,
			stopEvent: (event: Event): boolean => event.type === "click",
		};
	}

	private createAudioElement(node: ProseMirrorNode): HTMLAudioElement {
		const audio = document.createElement("audio");
		audio.src = String(node.attrs.src);

		if (node.attrs.autoplay === true) {
			audio.autoplay = true;
		}

		if (node.attrs.controls === true) {
			audio.controls = true;
		}

		if (typeof node.attrs.title === "string" && node.attrs.title !== "") {
			audio.title = node.attrs.title;
		}

		return audio;
	}

	private createCustomElementDOM(node: ProseMirrorNode): HTMLElement {
		const template = document.createElement("template");
		template.innerHTML = String(node.attrs.html);
		const element = template.content.firstElementChild;

		if (element instanceof HTMLElement) {
			return element;
		}

		const fallback = document.createElement("div");
		fallback.dataset.tpProseEditorCustomElement = "";
		return fallback;
	}

	private shouldIgnoreCustomElementEvent(event: Event): boolean {
		if (event.type === "focus" || event.type === "blur") {
			return true;
		}

		if (
			event.type === "mousedown" ||
			event.type === "mouseup" ||
			event.type === "click" ||
			event.type === "dblclick" ||
			event.type === "pointerdown" ||
			event.type === "pointerup" ||
			event.type === "keydown" ||
			event.type === "keyup" ||
			event.type === "keypress" ||
			event.type === "input" ||
			event.type === "change"
		) {
			return true;
		}

		const target = event.target;

		if (!(target instanceof Element)) {
			return false;
		}

		return (
			target.closest(
				'input, textarea, select, button, label, [contenteditable="true"]',
			) !== null
		);
	}

	private createTableNode(
		rows: number,
		columns: number,
	): ProseMirrorNode | null {
		const rowCount = Math.max(1, Math.floor(rows));
		const columnCount = Math.max(1, Math.floor(columns));
		const tableCell = getNodeType("table_cell");
		const tableRow = getNodeType("table_row");
		const table = getNodeType("table");

		const rowNodes = Array.from({ length: rowCount }, (): ProseMirrorNode => {
			const cellNodes = Array.from(
				{ length: columnCount },
				(): ProseMirrorNode => {
					const cell = tableCell.createAndFill();

					if (cell === null) {
						throw new Error("Unable to create table cell.");
					}

					return cell;
				},
			);

			return tableRow.create(null, cellNodes);
		});

		return table.create(null, rowNodes);
	}

	private runTableCommand(command: ProseMirrorCommand): boolean {
		if (this.editorView === null) {
			return false;
		}

		return command(
			this.editorView.state,
			this.editorView.dispatch,
			this.editorView,
		);
	}

	private handleToolbarMouseDown = (event: MouseEvent): void => {
		const target = event.target;

		if (!(target instanceof Element)) {
			return;
		}

		const button = target.closest<HTMLElement>(
			'tp-icon-button[data-command="html"]',
		);

		if (button === null || button.hasAttribute("disabled")) {
			return;
		}

		event.preventDefault();
	};

	private handleToolbarClick = (event: MouseEvent): void => {
		const target = event.target;

		if (!(target instanceof Element)) {
			return;
		}

		const button = target.closest<HTMLElement>("tp-icon-button[data-command]");

		if (
			button === null ||
			this.editorView === null ||
			button.hasAttribute("disabled")
		) {
			return;
		}

		event.preventDefault();
		const command = button.dataset.command as TpProseEditorCommand;
		this.runCommand(command);

		if (
			![
				"copy",
				"cut",
				"files",
				"emoji-picker",
				"format",
				"html",
				"insert-table",
				"list",
				"media",
				"icon-picker",
				"more",
				"paste",
				"search",
				"select-all",
				"types",
				"symbol-picker",
			].includes(command)
		) {
			this.editorView.focus();
		}
	};

	private runCommand(command: TpProseEditorCommand): void {
		if (this.editorView === null) {
			return;
		}

		if (command === "more") {
			this.toggleSecondaryToolbar();
			return;
		}

		if (this.toggleDropdownCommand(command)) return;

		if (["copy", "cut", "paste", "select-all"].includes(command)) {
			void this.runClipboardCommand(command);
			return;
		}

		const commandMap: Partial<
			Record<TpProseEditorCommand, ProseMirrorCommand>
		> = {
			"format-bold": toggleMark(getMarkType("strong")),
			"format-clear": this.clearFormatting,
			"format-code": toggleMark(getMarkType("code")),
			"format-code-block": setBlockType(getNodeType("code_block")),
			"format-list-bulleted": wrapInList(getNodeType("bullet_list")),
			"format-list-numbered": wrapInList(getNodeType("ordered_list")),
			"format-list-text": this.insertDefinitionList,
			"format-math": this.insertInlineMath,
			"format-header-1": this.toggleHeading(1),
			"format-header-2": this.toggleHeading(2),
			"format-header-3": this.toggleHeading(3),
			"format-header-4": this.toggleHeading(4),
			"format-header-5": this.toggleHeading(5),
			"format-header-6": this.toggleHeading(6),
			"format-italic": toggleMark(getMarkType("em")),
			"format-quote-open": wrapIn(getNodeType("blockquote")),
			"format-strikethrough": toggleMark(getMarkType("strikethrough")),
			"format-subscript": toggleMark(getMarkType("subscript")),
			"format-superscript": toggleMark(getMarkType("superscript")),
			"format-text": setBlockType(getNodeType("paragraph")),
			"format-underline": toggleMark(getMarkType("underline")),
			"insert-horizontal-rule": this.insertHorizontalRule,
			"insert-math-block": this.insertMathBlock,
			"insert-markdown-block": this.insertMarkdownBlock,
			"insert-markup-asciidoc": this.insertMarkupBlock("asciidoc"),
			"insert-markup-html": this.insertMarkupBlock("html"),
			"insert-markup-markdown": this.insertMarkupBlock("markdown"),
			"insert-markup-restructuredtext":
				this.insertMarkupBlock("restructuredtext"),
			"insert-audio": this.insertAudio,
			"insert-image": this.insertImage,
			"insert-video": this.insertVideo,
			link: this.toggleLink,
			redo,
			undo,
		};

		commandMap[command]?.(
			this.editorView.state,
			this.editorView.dispatch,
			this.editorView,
		);
		this.updateToolbarState();
	}

	private toggleDropdownCommand(command: TpProseEditorCommand): boolean {
		const dropdownMap: Partial<
			Record<TpProseEditorCommand, TpDropdownElement | null>
		> = {
			files: this.fileDropdownElement,
			"emoji-picker": this.emojiPickerDropdownElement,
			format: this.formatDropdownElement,
			html: this.htmlDropdownElement,
			"insert-table": this.tableDropdownElement,
			list: this.listDropdownElement,
			media: this.mediaDropdownElement,
			"icon-picker": this.iconPickerDropdownElement,
			"symbol-picker": this.symbolPickerDropdownElement,
			types: this.typeDropdownElement,
		};

		const dropdown = dropdownMap[command];

		if (dropdown === undefined) {
			if (command === "search") {
				this.toggleSearch();
				return true;
			}

			return false;
		}

		if (dropdown === null) {
			return true;
		}

		const willOpen = !dropdown.open;
		dropdown.toggle();

		if (willOpen) {
			dropdown
				.querySelector<HTMLElement>('li[role="menuitem"], button, input')
				?.focus();
			return true;
		}

		this.editorView?.focus();
		return true;
	}

	private handleMenuItemSelect = (event: Event): void => {
		const customEvent = event as CustomEvent<{ item?: Element }>;
		const item = customEvent.detail.item;

		if (!(item instanceof HTMLElement)) {
			return;
		}

		if (item.getAttribute("aria-disabled") === "true") {
			return;
		}

		const menuCommand = item.dataset.menuCommand as
			| TpProseEditorCommand
			| undefined;
		const fileAction = item.dataset.fileAction as
			| TpProseEditorCommand
			| undefined;
		const htmlAction = item.dataset.htmlAction;
		const tableAction = item.dataset.tableAction;

		if (menuCommand !== undefined) {
			this.runCommand(menuCommand);
			item.closest<TpDropdownElement>("tp-dropdown")?.hide();
			this.editorView?.focus();
			return;
		}

		if (fileAction !== undefined) {
			this.runFileAction(fileAction);
			item.closest<TpDropdownElement>("tp-dropdown")?.hide();
			return;
		}

		if (htmlAction !== undefined) {
			this.runHTMLAction(htmlAction);
			item.closest<TpDropdownElement>("tp-dropdown")?.hide();
			return;
		}

		if (tableAction !== undefined) {
			this.runTableAction(tableAction);
		}
	};

	private handleGenericMenuKeydown = (event: KeyboardEvent): void => {
		if (event.key !== "Escape") {
			return;
		}

		event.preventDefault();
		(event.currentTarget as HTMLElement | null)
			?.closest<TpDropdownElement>("tp-dropdown")
			?.hide();
		this.editorView?.focus();
	};

	private runFileAction(action: TpProseEditorCommand): void {
		switch (action) {
			case "load-html":
				this.htmlFileInputElement?.click();
				break;
			case "import-markdown":
				this.markdownFileInputElement?.click();
				break;
			case "save-html":
				this.downloadHTML("prose-editor.html");
				break;
			case "save-html-as":
				this.downloadHTMLAs();
				break;
		}
	}

	private openFileInput(input: HTMLInputElement | null): void {
		if (input === null) {
			return;
		}

		input.value = "";
		input.click();
	}

	private runHTMLAction(action: string): void {
		switch (action) {
			case "editor":
				this.restoreEditorMode();
				break;
			case "render":
				this.setHTMLRenderMode(true);
				break;
			case "code":
				this.setHTMLCodeMode(true);
				break;
		}
	}

	private handleHtmlFileChange = (event: Event): void => {
		void this.loadSelectedHTMLFile(event);
	};

	private handleMarkdownFileChange = (event: Event): void => {
		void this.loadSelectedMarkdownFile(event);
	};

	private handleImageFileChange = (event: Event): void => {
		void this.loadSelectedMediaFile(event, "image");
	};

	private handleVideoFileChange = (event: Event): void => {
		void this.loadSelectedMediaFile(event, "video");
	};

	private handleAudioFileChange = (event: Event): void => {
		void this.loadSelectedMediaFile(event, "audio");
	};

	private handleHtmlSourceInput = (): void => {
		this.dispatchInputEvent();
	};

	private handleSearchInput = (): void => {
		const query = this.searchInputElement?.value.trim() ?? "";
		this.syncSearchClearButton();

		if (query === "") {
			this.setSearchQuery("");
			return;
		}

		this.findNext(query);
	};

	private handleSearchClearClick = (event: MouseEvent): void => {
		event.preventDefault();
		event.stopPropagation();
		this.clearSearch();
	};

	private handleFileDropdownToggle = (): void =>
		this.syncDropdownButton("files", this.fileDropdownElement);
	private handleTypeDropdownToggle = (): void =>
		this.syncDropdownButton("types", this.typeDropdownElement);
	private handleFormatDropdownToggle = (): void =>
		this.syncDropdownButton("format", this.formatDropdownElement);
	private handleHTMLDropdownToggle = (): void =>
		this.syncDropdownButton("html", this.htmlDropdownElement);
	private handleListDropdownToggle = (): void =>
		this.syncDropdownButton("list", this.listDropdownElement);
	private handleMediaDropdownToggle = (): void =>
		this.syncDropdownButton("media", this.mediaDropdownElement);
	private toggleSecondaryToolbar(): void {
		if (this.secondaryToolbarElement === null) {
			return;
		}

		const willShow = this.secondaryToolbarElement.hidden;
		this.secondaryToolbarElement.hidden = !willShow;

		if (!willShow) {
			this.typeDropdownElement?.hide();
			this.formatDropdownElement?.hide();
			this.listDropdownElement?.hide();
		}

		this.updateToolbarState();
	}

	private syncDropdownButton(
		command: TpProseEditorCommand,
		dropdown: TpDropdownElement | null,
	): void {
		const buttons = this.querySelectorAll<HTMLElement>(
			`tp-icon-button[data-command="${command}"]`,
		);

		for (const button of buttons) {
			button.setAttribute("aria-expanded", String(dropdown?.open === true));
		}
	}

	private syncSearchClearButton(): void {
		if (
			this.searchClearButtonElement === null ||
			this.searchInputElement === null
		) {
			return;
		}

		this.searchClearButtonElement.hidden = false;
		this.searchClearButtonElement.setAttribute(
			"label",
			this.searchInputElement.value.trim() === ""
				? "Close search"
				: "Clear search",
		);
	}

	private clearSearch(): void {
		if (this.searchInputElement === null) {
			return;
		}

		if (this.searchInputElement.value.trim() === "") {
			this.searchInputElement.hidden = true;
			if (this.searchControlElement !== null) {
				this.searchControlElement.hidden = true;
			}
			this.editorView?.focus();
			return;
		}

		this.searchInputElement.value = "";
		this.setSearchQuery("");
		this.syncSearchClearButton();
		this.searchInputElement.focus();
	}

	private closeTableMenu(): void {
		if (this.tableDropdownElement === null) {
			return;
		}

		this.tableDropdownElement.hide();
	}

	private handleTableDropdownToggle = (): void => {
		this.toolbarElement
			?.querySelector<HTMLElement>(
				'tp-icon-button[data-command="insert-table"]',
			)
			?.setAttribute(
				"aria-expanded",
				String(this.tableDropdownElement?.open === true),
			);
		this.syncTablePicker();
	};

	private runTableAction(action: string): void {
		switch (action) {
			case "insert":
				this.insertTable(this.readTableRows(), this.readTableColumns());
				this.closeTableMenu();
				break;
			case "add-caption":
				this.addTableCaption();
				this.closeTableMenu();
				this.editorView?.focus();
				break;
			case "add-row":
				this.addTableRowAfter();
				this.editorView?.focus();
				break;
			case "add-column":
				this.addTableColumnAfter();
				this.editorView?.focus();
				break;
			case "delete-row":
				this.deleteTableRow();
				this.editorView?.focus();
				break;
			case "delete-column":
				this.deleteTableColumn();
				this.editorView?.focus();
				break;
			case "delete-table":
				this.deleteTable();
				this.closeTableMenu();
				this.editorView?.focus();
				break;
		}
	}

	private addTableCaption(): boolean {
		if (this.editorView === null) {
			return false;
		}

		const { state } = this.editorView;
		const table = this.findTableForCaption();

		if (table === null) {
			return false;
		}

		const currentCaption =
			typeof table.node.attrs.caption === "string"
				? table.node.attrs.caption
				: "";
		const caption = window.prompt("Table caption", currentCaption);

		if (caption === null) {
			return false;
		}

		const nextAttrs = {
			...table.node.attrs,
			caption: caption.trim() === "" ? null : caption.trim(),
		};
		this.editorView.dispatch(
			state.tr
				.setNodeMarkup(table.position, undefined, nextAttrs)
				.scrollIntoView(),
		);
		return true;
	}

	private findTableForCaption(): {
		node: ProseMirrorNode;
		position: number;
	} | null {
		if (this.editorView === null) {
			return null;
		}

		const tableType = getNodeType("table");
		const { state } = this.editorView;
		const { $from } = state.selection;

		for (let depth = $from.depth; depth > 0; depth -= 1) {
			const node = $from.node(depth);

			if (node.type === tableType) {
				return { node, position: $from.before(depth) };
			}
		}

		let nearestTable: {
			distance: number;
			node: ProseMirrorNode;
			position: number;
		} | null = null;

		state.doc.descendants((node, position) => {
			if (node.type !== tableType) {
				return true;
			}

			const distance = Math.min(
				Math.abs(position - state.selection.from),
				Math.abs(position + node.nodeSize - state.selection.from),
			);

			if (nearestTable === null || distance < nearestTable.distance) {
				nearestTable = { distance, node, position };
			}

			return false;
		});

		return nearestTable;
	}

	private handleTableMenuKeydown = (event: KeyboardEvent): void => {
		if (event.key !== "Escape") {
			return;
		}

		event.preventDefault();
		this.closeTableMenu();
		this.editorView?.focus();
	};

	private handleTablePickerPointerOver = (event: PointerEvent): void => {
		const cell = this.getTablePickerCell(event.target);

		if (cell === null) {
			return;
		}

		this.selectTablePickerCell(cell);
	};

	private handleTablePickerClick = (event: MouseEvent): void => {
		const cell = this.getTablePickerCell(event.target);

		if (cell === null) {
			return;
		}

		event.preventDefault();
		this.selectTablePickerCell(cell);
		this.insertTable(this.readTableRows(), this.readTableColumns());
		this.closeTableMenu();
	};

	private getTablePickerCell(target: EventTarget | null): HTMLElement | null {
		if (!(target instanceof Element)) {
			return null;
		}

		return target.closest<HTMLElement>("[data-table-grid-cell]");
	}

	private selectTablePickerCell(cell: HTMLElement): void {
		this.selectedTableRows = this.readPositiveInteger(
			cell.dataset.tableRows ?? "",
			this.selectedTableRows,
		);
		this.selectedTableColumns = this.readPositiveInteger(
			cell.dataset.tableColumns ?? "",
			this.selectedTableColumns,
		);
		this.syncTablePicker();
	}

	private syncTablePicker(): void {
		const picker = this.toolbarElement?.querySelector<HTMLElement>(
			"[data-tp-prose-editor-table-picker]",
		);

		if (picker === null || picker === undefined) {
			return;
		}

		picker
			.querySelector<HTMLOutputElement>(
				"[data-tp-prose-editor-table-picker-size]",
			)
			?.replaceChildren(
				`${String(this.selectedTableRows)} x ${String(this.selectedTableColumns)}`,
			);

		const cells = picker.querySelectorAll<HTMLElement>(
			"[data-table-grid-cell]",
		);
		for (const cell of cells) {
			const rows = this.readPositiveInteger(cell.dataset.tableRows ?? "", 0);
			const columns = this.readPositiveInteger(
				cell.dataset.tableColumns ?? "",
				0,
			);
			const selected =
				rows <= this.selectedTableRows && columns <= this.selectedTableColumns;
			cell.toggleAttribute("data-selected", selected);
			cell.setAttribute(
				"aria-pressed",
				String(
					rows === this.selectedTableRows &&
						columns === this.selectedTableColumns,
				),
			);
		}
	}

	private readTableRows(): number {
		return this.selectedTableRows;
	}

	private readTableColumns(): number {
		return this.selectedTableColumns;
	}

	private readPositiveInteger(rawValue: string, fallback: number): number {
		const value = Number.parseInt(rawValue, 10);

		if (!Number.isFinite(value) || value < 1) {
			return fallback;
		}

		return value;
	}

	private toggleSearch(): void {
		if (this.searchInputElement === null) {
			return;
		}

		if (this.searchInputElement.hidden) {
			if (this.searchControlElement !== null) {
				this.searchControlElement.hidden = false;
			}
			this.searchInputElement.hidden = false;
			const selectedText = this.getSelectedText();

			if (selectedText !== "") {
				this.searchInputElement.value = selectedText;
			}

			this.syncSearchClearButton();
			this.searchInputElement.focus();
			this.searchInputElement.select();
			return;
		}

		if (this.searchInputElement.value.trim() !== "") {
			this.findNext(this.searchInputElement.value);
			return;
		}

		this.searchInputElement.hidden = true;
		if (this.searchControlElement !== null) {
			this.searchControlElement.hidden = true;
		}
		this.editorView?.focus();
	}

	private handleSearchInputKeydown = (event: KeyboardEvent): void => {
		if (this.searchInputElement === null) {
			return;
		}

		if (event.key === "Escape") {
			event.preventDefault();
			this.searchInputElement.hidden = true;
			if (this.searchControlElement !== null) {
				this.searchControlElement.hidden = true;
			}
			this.editorView?.focus();
			return;
		}

		if (event.key !== "Enter") {
			return;
		}

		event.preventDefault();
		const query = this.searchInputElement.value.trim();

		if (query === "") {
			return;
		}

		if (event.shiftKey) {
			this.findPrevious(query);
			return;
		}

		this.findNext(query);
	};

	private findSearchMatch(
		value: string | undefined,
		direction: "next" | "previous",
	): boolean {
		if (this.editorView === null) {
			return false;
		}

		const search = (value ?? this.searchInputElement?.value ?? "").trim();
		const query = new SearchQuery({ search });
		const { state } = this.editorView;
		const { from, to } = state.selection;
		let result =
			direction === "next"
				? query.findNext(state, to)
				: query.findPrev(state, from);

		if (result === null) {
			result =
				direction === "next"
					? query.findNext(state, 0, from)
					: query.findPrev(state, state.doc.content.size, to);
		}

		let transaction = setSearchState(state.tr, query);

		if (result !== null) {
			transaction = transaction
				.setSelection(
					TextSelection.create(transaction.doc, result.from, result.to),
				)
				.scrollIntoView();
		}

		this.editorView.dispatch(transaction);
		return result !== null;
	}

	private getSelectedText(): string {
		if (this.editorView === null) {
			return "";
		}

		const { from, to, empty } = this.editorView.state.selection;

		if (empty) {
			return "";
		}

		return this.editorView.state.doc.textBetween(from, to, " ").trim();
	}

	private updateToolbarState(): void {
		if (this.editorView === null || this.toolbarElement === null) {
			return;
		}

		const activeCommands = new Set<TpProseEditorCommand>();

		if (this.isMarkActive("strong")) {
			activeCommands.add("format-bold");
		}

		if (this.isMarkActive("em")) {
			activeCommands.add("format-italic");
		}

		if (this.isMarkActive("code")) {
			activeCommands.add("format-code");
		}

		if (this.isMarkActive("underline")) {
			activeCommands.add("format-underline");
		}

		if (this.isMarkActive("strikethrough")) {
			activeCommands.add("format-strikethrough");
		}

		if (this.isMarkActive("subscript")) {
			activeCommands.add("format-subscript");
		}

		if (this.isMarkActive("superscript")) {
			activeCommands.add("format-superscript");
		}

		const parentNode = this.editorView.state.selection.$from.parent;
		if (
			parentNode.type === getNodeType("heading") &&
			parentNode.attrs.level === 1
		) {
			activeCommands.add("format-header-1");
		}

		if (
			parentNode.type === getNodeType("heading") &&
			parentNode.attrs.level === 2
		) {
			activeCommands.add("format-header-2");
		}

		if (
			parentNode.type === getNodeType("heading") &&
			parentNode.attrs.level === 3
		) {
			activeCommands.add("format-header-3");
		}

		if (
			parentNode.type === getNodeType("heading") &&
			parentNode.attrs.level === 4
		) {
			activeCommands.add("format-header-4");
		}

		if (
			parentNode.type === getNodeType("heading") &&
			parentNode.attrs.level === 5
		) {
			activeCommands.add("format-header-5");
		}

		if (
			parentNode.type === getNodeType("heading") &&
			parentNode.attrs.level === 6
		) {
			activeCommands.add("format-header-6");
		}

		if (parentNode.type === getNodeType("paragraph")) {
			activeCommands.add("format-text");
		}

		if (this.isSelectAllActive()) {
			activeCommands.add("select-all");
		}

		const commandButtons = this.querySelectorAll<HTMLElement>(
			"tp-icon-button[data-command]",
		);
		const secondaryToolbarIsOpen =
			this.secondaryToolbarElement?.hidden === false;

		for (const button of commandButtons) {
			const command = button.dataset.command as TpProseEditorCommand;
			const isToggle = [
				"format-bold",
				"format-code",
				"format-header-1",
				"format-header-2",
				"format-header-3",
				"format-header-4",
				"format-header-5",
				"format-header-6",
				"format-italic",
				"format-strikethrough",
				"format-subscript",
				"format-superscript",
				"format-text",
				"format-underline",
				"html",
				"more",
				"select-all",
			].includes(command);
			if (isToggle) {
				const pressed =
					activeCommands.has(command) ||
					(command === "html" && (this.htmlMode || this.htmlRenderMode)) ||
					(command === "more" && secondaryToolbarIsOpen)
						? "true"
						: "false";

				button.setAttribute("aria-pressed", pressed);
				button
					.querySelector(":scope > button")
					?.setAttribute("aria-pressed", pressed);
			} else {
				button.removeAttribute("aria-pressed");
				button
					.querySelector(":scope > button")
					?.removeAttribute("aria-pressed");
			}
		}
	}

	private isSelectAllActive(): boolean {
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			const selection = window.getSelection();

			if (selection === null || selection.rangeCount === 0) {
				return false;
			}

			return (
				selection.getRangeAt(0).commonAncestorContainer ===
				this.htmlRenderedElement
			);
		}

		if (this.htmlMode && this.htmlSourceElement !== null) {
			return (
				this.htmlSourceElement.selectionStart === 0 &&
				this.htmlSourceElement.selectionEnd ===
					this.htmlSourceElement.value.length &&
				this.htmlSourceElement.value.length > 0
			);
		}

		if (this.editorView === null) {
			return false;
		}

		const selection = this.editorView.state.selection;
		return selection instanceof AllSelection;
	}

	private isMarkActive(
		markName:
			| "code"
			| "em"
			| "strikethrough"
			| "strong"
			| "subscript"
			| "superscript"
			| "underline",
	): boolean {
		if (this.editorView === null) {
			return false;
		}

		const markType = getMarkType(markName);
		const { empty, $from, from, to } = this.editorView.state.selection;

		if (empty) {
			return (
				markType.isInSet(this.editorView.state.storedMarks ?? $from.marks()) !==
				undefined
			);
		}

		return this.editorView.state.doc.rangeHasMark(from, to, markType);
	}

	private clearFormatting: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		if (dispatch === undefined) {
			return true;
		}

		const { from, to } = state.selection;
		let transaction = state.tr;

		for (const markType of Object.values(schema.marks)) {
			transaction = transaction.removeMark(from, to, markType);
		}

		transaction = transaction.setBlockType(from, to, getNodeType("paragraph"));
		dispatch(transaction);
		return true;
	};

	private insertHorizontalRule: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		if (dispatch === undefined) {
			return true;
		}

		dispatch(
			state.tr
				.replaceSelectionWith(getNodeType("horizontal_rule").create())
				.scrollIntoView(),
		);
		return true;
	};

	private toggleHeading(level: number): ProseMirrorCommand {
		return (
			state: EditorState,
			dispatch?: (tr: Transaction) => void,
		): boolean => {
			const parentNode = state.selection.$from.parent;
			const isActiveHeading =
				parentNode.type === getNodeType("heading") &&
				parentNode.attrs.level === level;
			const nextType = isActiveHeading
				? getNodeType("paragraph")
				: getNodeType("heading");
			const nextAttrs = isActiveHeading ? null : { level };

			return setBlockType(nextType, nextAttrs)(state, dispatch);
		};
	}

	private insertInlineMath: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		const tex = this.getSelectedTextOrPrompt(state, "Math");

		if (tex === null) {
			return false;
		}

		if (dispatch === undefined) {
			return true;
		}

		dispatch(
			state.tr
				.replaceSelectionWith(getNodeType("math_inline").create({ tex }))
				.scrollIntoView(),
		);
		return true;
	};

	private insertMathBlock: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		const tex = this.getSelectedTextOrPrompt(state, "Math block");

		if (tex === null) {
			return false;
		}

		if (dispatch === undefined) {
			return true;
		}

		const { $from, $to } = state.selection;
		const replaceWholeParagraph =
			$from.parent.type === getNodeType("paragraph") &&
			$to.parent.type === getNodeType("paragraph") &&
			$from.before() === $to.before();
		const from = replaceWholeParagraph ? $from.before() : state.selection.from;
		const to = replaceWholeParagraph ? $from.after() : state.selection.to;
		const mathBlock = getNodeType("math_block").create({ tex });
		let transaction = state.tr.replaceWith(from, to, mathBlock);
		const selectionPosition = Math.min(
			from + mathBlock.nodeSize,
			transaction.doc.content.size,
		);
		let textSelectionPosition = -1;

		if (selectionPosition >= transaction.doc.content.size) {
			const paragraph = getNodeType("paragraph").createAndFill();

			if (paragraph !== null) {
				textSelectionPosition = transaction.doc.content.size + 1;
				transaction = transaction.insert(
					transaction.doc.content.size,
					paragraph,
				);
			}
		}

		const selection =
			textSelectionPosition > 0
				? TextSelection.create(transaction.doc, textSelectionPosition)
				: TextSelection.near(transaction.doc.resolve(selectionPosition), 1);

		dispatch(transaction.setSelection(selection).scrollIntoView());
		return true;
	};

	private getSelectedTextOrPrompt(
		state: EditorState,
		label: string,
	): string | null {
		const selectedText = state.doc
			.textBetween(state.selection.from, state.selection.to, "\n", "\n")
			.trim();

		if (selectedText !== "") {
			return selectedText
				.replace(/^\${1,2}/, "")
				.replace(/\${1,2}$/, "")
				.trim();
		}

		const prompted = window.prompt(label, "");

		if (prompted === null || prompted.trim() === "") {
			return null;
		}

		return prompted
			.trim()
			.replace(/^\${1,2}/, "")
			.replace(/\${1,2}$/, "")
			.trim();
	}

	private insertMarkdownBlock: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		if (dispatch === undefined) {
			return true;
		}

		return this.insertMarkupBlock("markdown")(state, dispatch);
	};

	private insertMarkupBlock =
		(language: MarkupBlockLanguage): ProseMirrorCommand =>
		(state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
			if (dispatch === undefined) return true;
			dispatch(
				state.tr
					.replaceSelectionWith(
						getNodeType("markdown_block").create({
							html: "",
							language,
							markdown: "",
							view: "both",
						}),
					)
					.scrollIntoView(),
			);
			queueMicrotask(() => {
				const editors = this.querySelectorAll<TpCodeEditorElement>(
					"tp-code-editor[data-tp-prose-editor-markdown-source]",
				);
				const editor = editors.item(editors.length - 1);
				if (editor === null) return;

				const focusEditor = (): void => {
					document.getSelection()?.removeAllRanges();
					editor.focus();
				};
				editor.addEventListener("tp-code-editor-ready", focusEditor, {
					once: true,
				});
				focusEditor();
			});
			return true;
		};

	private insertDefinitionList: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		const descriptionText = "Description";
		const paragraph = getNodeType("paragraph").create(
			null,
			schema.text(descriptionText),
		);

		if (dispatch === undefined) {
			return true;
		}

		const selectedText = state.doc
			.textBetween(state.selection.from, state.selection.to, " ")
			.trim();
		const termText = selectedText === "" ? "Term" : selectedText;
		const definitionPair = [
			getNodeType("definition_term").create(null, schema.text(termText)),
			getNodeType("definition_description").create(null, paragraph),
		];
		const currentDefinitionList = this.findCurrentDefinitionList(state);
		let transaction: Transaction;
		let selectionAnchor: number;

		if (currentDefinitionList === null) {
			const definitionList = getNodeType("definition_list").create(
				null,
				definitionPair,
			);
			transaction = state.tr.replaceSelectionWith(definitionList);
			selectionAnchor = transaction.mapping.map(state.selection.from, 1);
		} else {
			selectionAnchor =
				currentDefinitionList.position +
				currentDefinitionList.node.nodeSize -
				1;
			transaction = state.tr.insert(
				selectionAnchor,
				Fragment.fromArray(definitionPair),
			);
		}

		let descriptionDistance = Number.POSITIVE_INFINITY;
		let descriptionSelectionFrom = -1;
		let descriptionSelectionTo = -1;

		transaction.doc.descendants((node, position) => {
			if (node.type === getNodeType("definition_description")) {
				const from = position + 2;
				const to = from + descriptionText.length;
				const distance = Math.abs(position - selectionAnchor);

				if (distance < descriptionDistance) {
					descriptionDistance = distance;
					descriptionSelectionFrom = from;
					descriptionSelectionTo = to;
				}

				return false;
			}

			return true;
		});

		if (descriptionSelectionTo >= transaction.doc.content.size) {
			const trailingParagraph = getNodeType("paragraph").createAndFill();

			if (trailingParagraph !== null) {
				transaction = transaction.insert(
					transaction.doc.content.size,
					trailingParagraph,
				);
			}
		}

		if (descriptionSelectionFrom < 0 || descriptionSelectionTo < 0) {
			dispatch(transaction.scrollIntoView());
			return true;
		}

		dispatch(
			transaction
				.setSelection(
					TextSelection.create(
						transaction.doc,
						descriptionSelectionFrom,
						descriptionSelectionTo,
					),
				)
				.scrollIntoView(),
		);
		return true;
	};

	private findCurrentDefinitionList(
		state: EditorState,
	): { node: ProseMirrorNode; position: number } | null {
		const definitionListType = getNodeType("definition_list");
		const { $from } = state.selection;

		for (let depth = $from.depth; depth > 0; depth -= 1) {
			const node = $from.node(depth);

			if (node.type === definitionListType) {
				return { node, position: $from.before(depth) };
			}
		}

		return null;
	}

	private insertDefinitionPairAfterDescription: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		if (!state.selection.empty) {
			return false;
		}

		const { $from } = state.selection;

		if ($from.parentOffset !== $from.parent.content.size) {
			return false;
		}

		let descriptionDepth = -1;

		for (let depth = $from.depth; depth > 0; depth -= 1) {
			if ($from.node(depth).type === getNodeType("definition_description")) {
				descriptionDepth = depth;
				break;
			}
		}

		if (descriptionDepth < 0) {
			return false;
		}

		if (dispatch === undefined) {
			return true;
		}

		const termText = "Term";
		const descriptionText = "Description";
		const paragraph = getNodeType("paragraph").create(
			null,
			schema.text(descriptionText),
		);
		const definitionPair = Fragment.fromArray([
			getNodeType("definition_term").create(null, schema.text(termText)),
			getNodeType("definition_description").create(null, paragraph),
		]);
		const insertPosition = $from.after(descriptionDepth);
		const transaction = state.tr.insert(insertPosition, definitionPair);

		transaction
			.setSelection(
				TextSelection.create(
					transaction.doc,
					insertPosition + 1,
					insertPosition + 1 + termText.length,
				),
			)
			.scrollIntoView();

		dispatch(transaction);
		return true;
	};

	private exitDefinitionListPlaceholder: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		const placeholderPair = this.findDefinitionPlaceholderPair(state);

		if (placeholderPair === null) {
			return false;
		}

		if (dispatch === undefined) {
			return true;
		}

		const paragraph = getNodeType("paragraph").createAndFill();

		if (paragraph === null) {
			return false;
		}

		let transaction: Transaction;
		let selectionPosition: number;

		if (placeholderPair.removeList) {
			transaction = state.tr.delete(
				placeholderPair.listStart,
				placeholderPair.listEnd,
			);
			const nextNode = transaction.doc.nodeAt(placeholderPair.listStart);

			if (nextNode !== null && this.isEmptyParagraph(nextNode)) {
				selectionPosition = placeholderPair.listStart + 1;
			} else {
				transaction = transaction.insert(placeholderPair.listStart, paragraph);
				selectionPosition = placeholderPair.listStart + 1;
			}
		} else {
			transaction = state.tr.delete(
				placeholderPair.pairStart,
				placeholderPair.pairEnd,
			);
			const paragraphPosition = transaction.mapping.map(
				placeholderPair.listEnd,
				-1,
			);
			const nextNode = transaction.doc.nodeAt(paragraphPosition);

			if (nextNode !== null && this.isEmptyParagraph(nextNode)) {
				selectionPosition = paragraphPosition + 1;
			} else {
				transaction = transaction.insert(paragraphPosition, paragraph);
				selectionPosition = paragraphPosition + 1;
			}
		}

		dispatch(
			transaction
				.setSelection(TextSelection.create(transaction.doc, selectionPosition))
				.scrollIntoView(),
		);
		return true;
	};

	private findDefinitionPlaceholderPair(state: EditorState): {
		listEnd: number;
		listStart: number;
		pairEnd: number;
		pairStart: number;
		removeList: boolean;
	} | null {
		const { $from, $to } = state.selection;
		let listDepth = -1;

		for (let depth = $from.depth; depth > 0; depth -= 1) {
			if ($from.node(depth).type === getNodeType("definition_list")) {
				listDepth = depth;
				break;
			}
		}

		if (listDepth < 0 || !$to.sameParent($from)) {
			return null;
		}

		const listNode = $from.node(listDepth);
		const childIndex = $from.index(listDepth);
		const currentNode = listNode.child(childIndex);
		let termIndex = -1;

		if (currentNode.type === getNodeType("definition_term")) {
			termIndex = childIndex;
		} else if (currentNode.type === getNodeType("definition_description")) {
			termIndex = childIndex - 1;
		}

		if (termIndex < 0 || termIndex + 1 >= listNode.childCount) {
			return null;
		}

		const termNode = listNode.child(termIndex);
		const descriptionNode = listNode.child(termIndex + 1);

		if (
			termNode.type !== getNodeType("definition_term") ||
			descriptionNode.type !== getNodeType("definition_description")
		) {
			return null;
		}

		const termText = termNode.textContent.trim();
		const descriptionText = descriptionNode.textContent.trim();

		if (
			(termText !== "" && termText !== "Term") ||
			(descriptionText !== "" && descriptionText !== "Description")
		) {
			return null;
		}

		let pairStart = $from.before(listDepth) + 1;

		for (let index = 0; index < termIndex; index += 1) {
			pairStart += listNode.child(index).nodeSize;
		}

		const pairEnd = pairStart + termNode.nodeSize + descriptionNode.nodeSize;

		if (state.selection.from < pairStart || state.selection.to > pairEnd) {
			return null;
		}

		const listStart = $from.before(listDepth);
		return {
			listEnd: listStart + listNode.nodeSize,
			listStart,
			pairEnd,
			pairStart,
			removeList: listNode.childCount === 2,
		};
	}

	private insertImage: ProseMirrorCommand = (
		_state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		if (dispatch === undefined) {
			return true;
		}

		this.openFileInput(this.imageFileInputElement);
		return true;
	};

	private insertVideo: ProseMirrorCommand = (
		_state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		if (dispatch === undefined) {
			return true;
		}

		this.openFileInput(this.videoFileInputElement);
		return true;
	};

	private insertAudio: ProseMirrorCommand = (
		_state: EditorState,
		dispatch?: (tr: Transaction) => void,
	): boolean => {
		if (dispatch === undefined) {
			return true;
		}

		this.openFileInput(this.audioFileInputElement);
		return true;
	};

	private toggleLink: ProseMirrorCommand = (
		state: EditorState,
		dispatch?: (tr: Transaction) => void,
		view?: EditorView,
	): boolean => {
		const linkType = getMarkType("link");
		const { empty, from, to } = state.selection;

		if (!empty && state.doc.rangeHasMark(from, to, linkType)) {
			return toggleMark(linkType)(state, dispatch, view);
		}

		const href = window.prompt("Link URL");

		if (href === null || href.trim() === "") {
			return false;
		}

		return toggleMark(linkType, { href: href.trim(), title: null })(
			state,
			dispatch,
			view,
		);
	};

	private async runClipboardCommand(
		command: TpProseEditorCommand,
	): Promise<void> {
		if (command === "select-all") {
			this.selectAllContent();
			return;
		}

		const activeEditable = this.htmlMode
			? this.htmlSourceElement
			: this.htmlRenderMode
				? this.htmlRenderedElement
				: this.editorView?.dom;
		activeEditable?.focus();

		switch (command) {
			case "copy":
				document.execCommand("copy");
				return;
			case "cut":
				document.execCommand("cut");
				return;
			case "paste":
				await this.pasteClipboardText();
				return;
		}
	}

	private selectAllContent(): void {
		if (this.isSelectAllActive()) {
			this.clearSelectAllContent();
			return;
		}

		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			this.htmlRenderedElement.focus();
			const range = document.createRange();
			range.selectNodeContents(this.htmlRenderedElement);
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
			this.updateToolbarState();
			return;
		}

		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.htmlSourceElement.focus();
			this.htmlSourceElement.select();
			this.updateToolbarState();
			return;
		}

		if (this.editorView === null) {
			return;
		}

		this.editorView.focus();
		this.editorView.dispatch(
			this.editorView.state.tr.setSelection(
				new AllSelection(this.editorView.state.doc),
			),
		);
		this.updateToolbarState();
	}

	private clearSelectAllContent(): void {
		if (this.htmlRenderMode && this.htmlRenderedElement !== null) {
			window.getSelection()?.removeAllRanges();
			this.htmlRenderedElement.focus();
			this.updateToolbarState();
			return;
		}

		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.htmlSourceElement.focus();
			this.htmlSourceElement.setSelectionRange(0, 0);
			this.updateToolbarState();
			return;
		}

		if (this.editorView === null) {
			return;
		}

		this.editorView.focus();
		this.editorView.dispatch(
			this.editorView.state.tr.setSelection(
				TextSelection.create(this.editorView.state.doc, 1),
			),
		);
		this.updateToolbarState();
	}

	private handleEmojiPickerSelect = (event: Event): void => {
		const value = (event as CustomEvent<{ value?: string }>).detail?.value;
		if (typeof value !== "string") return;
		this.insertPickerText(value);
		this.emojiPickerDropdownElement?.hide();
	};

	private handleSymbolPickerSelect = (event: Event): void => {
		const value = (event as CustomEvent<{ value?: string }>).detail?.value;
		if (typeof value !== "string") return;
		this.insertPickerText(value);
		this.symbolPickerDropdownElement?.hide();
	};

	private handleIconPickerSelect = (event: Event): void => {
		const value = (event as CustomEvent<{ value?: string }>).detail?.value;
		if (typeof value !== "string") return;
		this.insertInlineIcon(value);
		this.iconPickerDropdownElement?.hide();
	};

	private insertInlineIcon(value: string): void {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(value);
			return;
		}
		if (this.editorView === null) return;

		const template = document.createElement("template");
		template.innerHTML = value;
		const icon = template.content.querySelector("tp-icon");
		if (!(icon instanceof HTMLElement)) return;

		const node = getNodeType("tp_icon").create({ html: icon.outerHTML });
		let transaction = this.editorView.state.tr.replaceSelectionWith(node);
		transaction = transaction.insertText(
			inlineIconCaretAnchor,
			transaction.selection.from,
		);
		this.editorView.dispatch(transaction.scrollIntoView());
		this.loadRenderedTpComponents();
		this.editorView.focus();
	}

	private insertPickerText(value: string): void {
		if (this.htmlMode && this.htmlSourceElement !== null) {
			this.insertTextInHTMLSource(value);
			return;
		}
		if (this.editorView === null) return;
		this.editorView.dispatch(
			this.editorView.state.tr.insertText(value).scrollIntoView(),
		);
		this.editorView.focus();
	}

	private async pasteClipboardText(): Promise<void> {
		try {
			const text = await navigator.clipboard.readText();

			if (this.htmlMode && this.htmlSourceElement !== null) {
				this.insertTextInHTMLSource(text);
				return;
			}

			if (this.editorView !== null) {
				this.editorView.dispatch(
					this.editorView.state.tr.insertText(text).scrollIntoView(),
				);
			}
		} catch {
			document.execCommand("paste");
		}
	}

	private insertTextInHTMLSource(text: string): void {
		if (this.htmlSourceElement === null) {
			return;
		}

		const start = this.htmlSourceElement.selectionStart;
		const end = this.htmlSourceElement.selectionEnd;
		const currentValue = this.htmlSourceElement.value;
		this.htmlSourceElement.value = `${currentValue.slice(0, start)}${text}${currentValue.slice(end)}`;
		const nextCursor = start + text.length;
		this.htmlSourceElement.setSelectionRange(nextCursor, nextCursor);
		this.dispatchInputEvent();
	}

	private setHTMLCodeMode(enabled: boolean): boolean {
		if (
			this.surfaceElement === null ||
			this.htmlSourceElement === null ||
			this.htmlRenderedElement === null
		) {
			return false;
		}

		if (!enabled) {
			if (!this.htmlMode) {
				return this.restoreEditorMode();
			}

			const nextHTML = this.htmlSourceElement.value;
			this.htmlMode = false;
			this.htmlSourceElement.hidden = true;
			this.htmlRenderMode = false;
			this.htmlRenderedElement.hidden = true;
			this.surfaceElement.hidden = false;
			this.setHTML(nextHTML);
			this.editorView?.focus();
			this.updateToolbarState();
			return true;
		}

		if (this.htmlMode) {
			this.htmlSourceElement.focus();
			this.updateToolbarState();
			return true;
		}

		const html = this.htmlRenderMode
			? this.htmlRenderedElement.innerHTML
			: this.serializeDocument(
					this.editorView?.state.doc ?? this.parseHTML(""),
				);
		this.htmlSourceElement.value = formatHtmlForDisplay(html);
		this.htmlMode = true;
		this.htmlRenderMode = false;
		this.surfaceElement.hidden = true;
		this.htmlRenderedElement.hidden = true;
		this.htmlSourceElement.hidden = false;
		this.htmlSourceElement.focus();
		this.updateToolbarState();
		return true;
	}

	private setHTMLRenderMode(enabled: boolean): boolean {
		if (
			this.surfaceElement === null ||
			this.htmlSourceElement === null ||
			this.htmlRenderedElement === null
		) {
			return false;
		}

		if (!enabled) {
			return this.restoreEditorMode();
		}

		const html = this.htmlMode
			? this.htmlSourceElement.value
			: this.serializeDocument(
					this.editorView?.state.doc ?? this.parseHTML(""),
					{
						renderComponents: true,
					},
				);

		this.htmlRenderedElement.innerHTML = html;
		this.htmlRenderMode = true;
		this.htmlMode = false;
		this.surfaceElement.hidden = true;
		this.htmlSourceElement.hidden = true;
		this.htmlRenderedElement.hidden = false;
		this.loadRenderedHTMLComponents();
		this.updateToolbarState();
		return true;
	}

	private restoreEditorMode(): boolean {
		if (
			this.surfaceElement === null ||
			this.htmlSourceElement === null ||
			this.htmlRenderedElement === null
		) {
			return false;
		}

		this.htmlMode = false;
		this.htmlRenderMode = false;
		this.htmlSourceElement.hidden = true;
		this.htmlRenderedElement.hidden = true;
		this.surfaceElement.hidden = false;
		document.getSelection()?.removeAllRanges();
		this.updateToolbarState();
		return true;
	}

	private async loadSelectedHTMLFile(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement | null;

		if (input === null) {
			return;
		}

		const file = input.files?.[0];

		if (file === undefined) {
			return;
		}

		this.insertHTMLWithHistory(await file.text());
		input.value = "";
	}

	private async loadSelectedMarkdownFile(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement | null;

		if (input === null) {
			return;
		}

		const file = input.files?.[0];

		if (file === undefined) {
			return;
		}

		const markdown = await file.text();
		const markdownRoot = document.createElement("div");
		await renderMarkdownInto(markdown, markdownRoot, file.name);
		const html = markdownRoot.innerHTML;
		this.insertHTMLWithHistory(html);
		input.value = "";
	}

	private async loadSelectedMediaFile(
		event: Event,
		kind: MediaFileKind,
	): Promise<void> {
		const input = event.currentTarget as HTMLInputElement | null;

		if (input === null) {
			return;
		}

		const file = input.files?.[0];

		if (file === undefined) {
			return;
		}

		const src = await this.readFileAsDataURL(file);
		await this.insertMediaFile(kind, src, file);
		input.value = "";
	}

	private async insertMediaFile(
		kind: MediaFileKind,
		src: string,
		file: File,
	): Promise<void> {
		if (this.editorView === null) {
			return;
		}

		const node = await this.createMediaNode(kind, src, file);

		if (node === null) {
			return;
		}

		const insertFrom = this.editorView.state.selection.from;
		let transaction = this.editorView.state.tr.replaceSelectionWith(node);
		const selectionPosition = Math.min(
			insertFrom + node.nodeSize,
			transaction.doc.content.size,
		);

		if (
			this.requiresTrailingEditableBlock(node) &&
			selectionPosition >= transaction.doc.content.size
		) {
			const paragraph = getNodeType("paragraph").createAndFill();

			if (paragraph !== null) {
				transaction = transaction.insert(selectionPosition, paragraph);
			}
		}

		this.editorView.dispatch(
			transaction
				.setSelection(
					Selection.near(transaction.doc.resolve(selectionPosition), 1),
				)
				.scrollIntoView(),
		);
		this.editorView.focus();
	}

	private async createMediaNode(
		kind: MediaFileKind,
		src: string,
		file: File,
	): Promise<ProseMirrorNode | null> {
		const attributes = await this.promptMediaAttributes(kind, file.name, src);

		if (attributes === null) {
			return null;
		}

		if (kind === "image") {
			return getNodeType("image").create({
				alt: attributes.alt,
				height: attributes.height,
				src,
				title: attributes.title,
				width: attributes.width,
			});
		}

		if (kind === "video") {
			return getNodeType("video").create({
				autoplay: attributes.autoplay,
				controls: attributes.controls,
				caption: attributes.caption,
				poster:
					attributes.poster.trim() === "" ? null : attributes.poster.trim(),
				src,
				title: attributes.title,
				width: attributes.width,
				height: attributes.height,
			});
		}

		return getNodeType("audio").create({
			autoplay: attributes.autoplay,
			caption: attributes.caption,
			controls: attributes.controls,
			src,
			title: attributes.title,
		});
	}

	private getMediaOptionChecked(
		dialog: HTMLElement,
		option: string,
		fallback: boolean,
	): boolean {
		const input = dialog.querySelector<HTMLInputElement>(
			`[data-media-option="${option}"] input[type="checkbox"]`,
		);

		return input?.checked ?? fallback;
	}

	private normalizeDimension(value: string): string | null {
		const trimmed = value.trim();

		if (trimmed === "") {
			return null;
		}

		const parsed = Number.parseInt(trimmed, 10);
		return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : null;
	}

	private promptMediaAttributes(
		kind: MediaFileKind,
		filename: string,
		src: string,
	): Promise<MediaAttributes | null> {
		return new Promise((resolve) => {
			const dialog = document.createElement("dialog");
			const hasBooleanAttributes = kind === "audio" || kind === "video";
			const hasSizeAttributes = kind === "image" || kind === "video";
			const checkboxValue =
				kind === "image" ? "1" : kind === "video" ? "1,3" : "1";
			const checkboxItems =
				kind === "image"
					? '<li data-media-option="lock-ratio">Lock ratio</li>'
					: `
          <li data-media-option="controls">controls</li>
          <li data-media-option="autoplay">autoplay</li>
          ${kind === "video" ? '<li data-media-option="lock-ratio">Lock ratio</li>' : ""}
        `;
			dialog.innerHTML = `
        <form method="dialog">
          <label>
            <span>Title</span>
            <input type="text" name="title" value="${escapeHtml(filename)}">
          </label>
          ${
						kind === "image"
							? `
            <label>
              <span>Alternative text</span>
              <input type="text" name="alt" value="">
            </label>
          `
							: ""
					}
          ${
						kind === "video"
							? `
            <label>
              <span>Poster URL</span>
              <input type="text" name="poster" value="">
            </label>
          `
							: ""
					}
          ${
						kind === "audio" || kind === "video"
							? `
            <label>
              <span>Caption</span>
              <input type="text" name="caption" value="">
            </label>
          `
							: ""
					}
          ${
						hasSizeAttributes
							? `
            <label>
              <span>Width</span>
              <input type="number" name="width" min="1" step="1" inputmode="numeric">
            </label>
            <label>
              <span>Height</span>
              <input type="number" name="height" min="1" step="1" inputmode="numeric">
            </label>
          `
							: ""
					}
          ${
						hasBooleanAttributes || hasSizeAttributes
							? `
            <tp-checkbox-list value="${checkboxValue}">
              <ul>
                ${checkboxItems}
              </ul>
            </tp-checkbox-list>
          `
							: ""
					}
          <menu>
            <button type="button" value="cancel">Cancel</button>
            <button type="button" value="ok">OK</button>
          </menu>
        </form>
      `;
			const checkboxList =
				dialog.querySelector<HTMLElement>("tp-checkbox-list");
			const titleInput = dialog.querySelector<HTMLInputElement>(
				'input[name="title"]',
			);
			const altInput =
				dialog.querySelector<HTMLInputElement>('input[name="alt"]');
			const captionInput = dialog.querySelector<HTMLInputElement>(
				'input[name="caption"]',
			);
			const posterInput = dialog.querySelector<HTMLInputElement>(
				'input[name="poster"]',
			);
			const widthInput = dialog.querySelector<HTMLInputElement>(
				'input[name="width"]',
			);
			const heightInput = dialog.querySelector<HTMLInputElement>(
				'input[name="height"]',
			);
			let naturalWidth = 0;
			let naturalHeight = 0;
			let isSyncingDimensions = false;
			const isRatioLocked = (): boolean =>
				this.getMediaOptionChecked(dialog, "lock-ratio", hasSizeAttributes);
			const syncDimension = (changedInput: HTMLInputElement): void => {
				if (
					isSyncingDimensions ||
					!isRatioLocked() ||
					naturalWidth <= 0 ||
					naturalHeight <= 0 ||
					widthInput === null ||
					heightInput === null
				) {
					return;
				}

				const value = Number.parseInt(changedInput.value, 10);

				if (!Number.isFinite(value) || value <= 0) {
					return;
				}

				isSyncingDimensions = true;
				if (changedInput === widthInput) {
					heightInput.value = String(
						Math.round((value * naturalHeight) / naturalWidth),
					);
				} else {
					widthInput.value = String(
						Math.round((value * naturalWidth) / naturalHeight),
					);
				}
				isSyncingDimensions = false;
			};
			const closeDialog = (returnValue: string): void => {
				dialog.returnValue = returnValue;
				dialog.dispatchEvent(new Event("close"));
			};
			const handleClick = (event: MouseEvent): void => {
				const button = (
					event.target as Element | null
				)?.closest<HTMLButtonElement>("button[value]");

				if (button === null || button === undefined) {
					return;
				}

				event.preventDefault();
				closeDialog(button.value);
			};
			const handleClose = (): void => {
				dialog.removeEventListener("click", handleClick);
				dialog.remove();

				if (dialog.returnValue !== "ok") {
					resolve(null);
					return;
				}

				const selectedValue = hasBooleanAttributes
					? checkboxList?.getAttribute("value") || "1"
					: "";
				const selectedValues = new Set(selectedValue.split(","));
				resolve({
					autoplay: this.getMediaOptionChecked(
						dialog,
						"autoplay",
						selectedValues.has("2"),
					),
					controls:
						!hasBooleanAttributes ||
						this.getMediaOptionChecked(
							dialog,
							"controls",
							selectedValues.has("1"),
						),
					alt: altInput?.value ?? "",
					caption: captionInput?.value ?? "",
					height: this.normalizeDimension(heightInput?.value ?? ""),
					lockRatio: this.getMediaOptionChecked(
						dialog,
						"lock-ratio",
						hasSizeAttributes,
					),
					poster: posterInput?.value ?? "",
					title: titleInput?.value ?? "",
					width: this.normalizeDimension(widthInput?.value ?? ""),
				});
			};

			dialog.addEventListener("click", handleClick);
			dialog.addEventListener("close", handleClose, { once: true });
			widthInput?.addEventListener("input", () => {
				syncDimension(widthInput);
			});
			heightInput?.addEventListener("input", () => {
				syncDimension(heightInput);
			});
			this.append(dialog);
			if (hasBooleanAttributes || hasSizeAttributes) {
				checkboxList?.setAttribute("value", checkboxValue);
			}

			if (hasSizeAttributes) {
				void this.loadNaturalMediaSize(kind, src).then((size) => {
					if (size === null) {
						return;
					}

					naturalWidth = size.width;
					naturalHeight = size.height;
					widthInput?.setAttribute("placeholder", String(size.width));
					heightInput?.setAttribute("placeholder", String(size.height));
				});
			}

			if (typeof dialog.showModal === "function") {
				dialog.showModal();
			} else {
				dialog.setAttribute("open", "");
			}
		});
	}

	private loadNaturalMediaSize(
		kind: MediaFileKind,
		src: string,
	): Promise<{ height: number; width: number } | null> {
		if (kind === "image") {
			return new Promise((resolve) => {
				const image = new Image();
				image.addEventListener(
					"load",
					() => {
						resolve({ height: image.naturalHeight, width: image.naturalWidth });
					},
					{ once: true },
				);
				image.addEventListener(
					"error",
					() => {
						resolve(null);
					},
					{ once: true },
				);
				image.src = src;
			});
		}

		if (kind === "video") {
			return new Promise((resolve) => {
				const video = document.createElement("video");
				video.preload = "metadata";
				video.addEventListener(
					"loadedmetadata",
					() => {
						resolve({ height: video.videoHeight, width: video.videoWidth });
					},
					{ once: true },
				);
				video.addEventListener(
					"error",
					() => {
						resolve(null);
					},
					{ once: true },
				);
				video.src = src;
			});
		}

		return Promise.resolve(null);
	}

	private readFileAsDataURL(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				if (typeof reader.result === "string") {
					resolve(reader.result);
					return;
				}

				reject(new Error(`Unable to read ${file.name}`));
			});
			reader.addEventListener("error", () => {
				reject(reader.error ?? new Error(`Unable to read ${file.name}`));
			});
			reader.readAsDataURL(file);
		});
	}

	private downloadHTMLAs(): void {
		void this.saveTextFileAs(
			"prose-editor.html",
			this.createHTMLDocument(),
			"text/html;charset=utf-8",
			(filename) => this.normalizeHTMLFilename(filename),
		);
	}

	private downloadHTML(filename: string): void {
		this.downloadTextFile(
			filename,
			this.createHTMLDocument(),
			"text/html;charset=utf-8",
		);
	}

	private downloadTextFile(
		filename: string,
		content: string,
		type: string,
	): void {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");

		anchor.href = url;
		anchor.download = filename;
		anchor.hidden = true;
		document.body.append(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	}

	private async saveTextFileAs(
		filename: string,
		content: string,
		type: string,
		normalizeFilename: (filename: string) => string = (value) => value.trim(),
	): Promise<void> {
		const saveFilePicker = (window as WindowWithSaveFilePicker)
			.showSaveFilePicker;
		const suggestedName = normalizeFilename(filename);

		if (suggestedName === "") {
			return;
		}

		if (typeof saveFilePicker !== "function") {
			const fallbackFilename = window.prompt("File name", suggestedName);

			if (fallbackFilename === null || fallbackFilename.trim() === "") {
				return;
			}

			const normalizedFallbackFilename = normalizeFilename(fallbackFilename);

			if (normalizedFallbackFilename === "") {
				return;
			}

			this.downloadTextFile(normalizedFallbackFilename, content, type);
			return;
		}

		try {
			const extension = /\.[a-z0-9]+$/i.exec(suggestedName)?.[0] ?? ".txt";
			const handle = await saveFilePicker.call(window, {
				suggestedName,
				types: [
					{
						description: "Text file",
						accept: {
							[type.split(";")[0] ?? "text/plain"]: [extension],
						},
					},
				],
			});
			const writable = await handle.createWritable();
			await writable.write(new Blob([content], { type }));
			await writable.close();
		} catch (error: unknown) {
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}

			throw error;
		}
	}

	private normalizeHTMLFilename(filename: string): string {
		const trimmedFilename = filename.trim();

		if (trimmedFilename === "") {
			return "";
		}

		return /\.(?:html?|xhtml)$/i.test(trimmedFilename)
			? trimmedFilename
			: `${trimmedFilename}.html`;
	}

	private createHTMLDocument(): string {
		return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>prose-editor</title>
</head>
<body>
${this.getHTML()}
${TP_LOADER_SCRIPT}
</body>
</html>
`;
	}

	private dispatchInputEvent(): void {
		const value = this.getHTML();
		this.internalValueUpdate = true;
		this.setStringAttribute("value", value);
		this.internalValueUpdate = false;

		this.dispatchEvent(
			new CustomEvent("tp-prose-editor-input", {
				bubbles: true,
				detail: { value },
			}),
		);
		this.dispatchEvent(
			new CustomEvent("tp-prose-editor-change", {
				bubbles: true,
				detail: { value },
			}),
		);
	}
}

if (!customElements.get("tp-prose-editor")) {
	customElements.define("tp-prose-editor", TpProseEditor);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-prose-editor": TpProseEditor;
	}
}
