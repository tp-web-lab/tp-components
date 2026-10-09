/**
 * @module components/code-editor
 * @summary CodeMirror-based code editor component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-badge
 * @summary Badge component for compact status labels.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-copy-code
 * @summary Copy-to-clipboard button component.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
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
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-tooltip
 * @summary Displays anchored tooltip content.
 */
/**
 * @credit CodeMirror https://codemirror.net/
 * @summary Code editing and language support.
 */
/**
 * @credit Lezer https://lezer.codemirror.net/
 * @summary Syntax tree highlighting.
 */
// tp-docgen:dependencies:end

import {
	autocompletion,
	type Completion,
	type CompletionContext,
	type CompletionResult,
} from "@codemirror/autocomplete";
import {
	defaultKeymap,
	history,
	historyKeymap,
	indentLess,
	indentMore,
	indentWithTab,
	redo,
	selectAll,
	toggleBlockComment,
	toggleLineComment,
	undo,
} from "@codemirror/commands";
import {
	foldCode,
	foldGutter,
	HighlightStyle,
	StreamLanguage,
	syntaxHighlighting,
	unfoldCode,
} from "@codemirror/language";
import {
	gotoLine,
	openSearchPanel,
	replaceNext,
	searchKeymap,
} from "@codemirror/search";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { TpBase } from "../base/base.js";
import { codeCommentMarkers } from "./code-comment-markers.js";
import style from "./code-editor.css?inline";
import "../dropdown/dropdown.js";
import "../icon/icon.js";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	highlightActiveLine,
	keymap,
	lineNumbers,
	panels,
	placeholder,
	showPanel,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";
import { getCodeFromFile, getCodeFromScript } from "../../utilities/code.js";
import {
	hasComponentMarkdownSourceBase,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
import "../badge/badge.js";
import "../button/button.js";
import "../copy-code/copy-code.js";
import "../fullscreen/fullscreen.js";
import "../icon-button/icon-button.js";
import "../theme/theme.js";
import type { TpBadge } from "../badge/badge.js";
import { TpDropdown } from "../dropdown/dropdown.js";
import type { TpIconButton } from "../icon-button/icon-button.js";
import { abcBaseTheme, abcLanguage } from "./abc-language.js";

/**
 * Source actually used to produce the displayed code.
 *
 * - `api` : contenu fourni par `setValue()`
 * - `script`: content from a direct `<script type="tp/<language>">` child
 * - `src`: content loaded from the `src` attribute
 * - `value`: content from the `value` attribute
 * - `none`: no source available
 *
 * @summary Represents the source of the edited code.
 * @internal
 */
type TpCodeEditorSource = "api" | "script" | "src" | "value" | "none";

type TpCodeEditorKeyboardAction =
	| "undo"
	| "redo"
	| "copy"
	| "cut"
	| "paste"
	| "select-all"
	| "indent"
	| "dedent"
	| "search"
	| "replace"
	| "goto-line"
	| "toggle-line-comment"
	| "toggle-block-comment"
	| "fold-code"
	| "unfold-code"
	| "toggle-gutters"
	| "toggle-line-numbers"
	| "toggle-command-palette"
	| "toggle-toolbar";

export interface TpSqlTableSchema {
	name: string;
	columns: string[];
}

export type TpSqlSchema = TpSqlTableSchema[];

export function sqlCompletion(
	context: CompletionContext,
): CompletionResult | null {
	const word = context.matchBefore(/\w*/);

	if (word === null) {
		return null;
	}

	const schema: TpSqlSchema = window.__tp_sql_schema__ ?? [];

	const tableCompletions: Completion[] = schema.map(
		(table: TpSqlTableSchema): Completion => ({
			label: table.name,
			type: "class" as const,
		}),
	);

	const columnCompletions: Completion[] = schema.flatMap(
		(table: TpSqlTableSchema): Completion[] =>
			table.columns.map(
				(column: string): Completion => ({
					label: column,
					type: "property" as const,
				}),
			),
	);

	const keywords: Completion[] = [
		"SELECT",
		"FROM",
		"WHERE",
		"JOIN",
		"INNER",
		"LEFT",
		"RIGHT",
		"ON",
		"INSERT",
		"UPDATE",
		"DELETE",
		"CREATE",
		"TABLE",
		"INDEX",
		"EXPLAIN",
	].map(
		(keyword: string): Completion => ({
			label: keyword,
			type: "keyword" as const,
		}),
	);

	return {
		from: word.from,
		options: [...keywords, ...tableCompletions, ...columnCompletions],
	};
}

export const prologLanguage = StreamLanguage.define({
	token(stream) {
		if (stream.match(/%.*$/)) {
			return "comment";
		}
		if (stream.match(/"(?:[^"\\]|\\.)*"/)) {
			return "string";
		}
		if (stream.match(/'(?:[^'\\]|\\.)*'/)) {
			return "string";
		}
		if (stream.match(/[A-Z_][A-Za-z0-9_]*/)) {
			return "variableName";
		}
		if (stream.match(/[a-z][A-Za-z0-9_]*/)) {
			return "atom";
		}
		if (stream.match(/:-|-->|[().,[\]|!]/)) {
			return "operator";
		}
		stream.next();
		return null;
	},
});

interface AsciidocLanguageState {
	rawDelimiter: string | null;
	rawStyle: "comment" | "verbatim" | null;
	pendingVerbatim: boolean;
}

const asciidocVerbatimStyle =
	/^\[(?:source|listing|literal|script|style)(?:[,.%#\]].*)?$/i;
const asciidocDelimiter = /^(?:={4,}|-{4,}|\.{4,}|_{4,}|\+{4,}|\*{4,})$/;

export const asciidocLanguage = StreamLanguage.define<AsciidocLanguageState>({
	startState: () => ({
		rawDelimiter: null,
		rawStyle: null,
		pendingVerbatim: false,
	}),
	copyState: (state) => ({ ...state }),
	token(stream, state) {
		if (stream.sol()) {
			const line = stream.string.trim();

			if (state.rawDelimiter !== null) {
				if (line === state.rawDelimiter) {
					stream.skipToEnd();
					state.rawDelimiter = null;
					state.rawStyle = null;
					return "meta";
				}
				stream.skipToEnd();
				return state.rawStyle === "comment" ? "comment" : "string";
			}

			if (line === "////") {
				stream.skipToEnd();
				state.rawDelimiter = "////";
				state.rawStyle = "comment";
				return "comment";
			}

			const delimiter = line.match(asciidocDelimiter)?.[0];
			if (delimiter !== undefined) {
				stream.skipToEnd();
				if (
					state.pendingVerbatim ||
					delimiter.startsWith("-") ||
					delimiter.startsWith(".") ||
					delimiter.startsWith("+")
				) {
					state.rawDelimiter = delimiter;
					state.rawStyle = "verbatim";
				}
				state.pendingVerbatim = false;
				return "meta";
			}

			state.pendingVerbatim = asciidocVerbatimStyle.test(line);

			if (stream.match(/^={1,6}\s.+$/)) return "heading";
			if (stream.match(/^:{1,2}[\w-]+:/)) return "attributeName";
			if (stream.match(/^\.\S.*$/)) return "labelName";
			if (stream.match(/^(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION):/))
				return "keyword";
			if (stream.match(/^\/\//)) {
				stream.skipToEnd();
				return "comment";
			}
			if (stream.match(/^\s*(?:\*+|-|\.+|\d+\.)\s+/)) return "meta";
			if (stream.match(/^.+?(?=::{1,4}(?:\s|$))/)) return "typeName";
		}

		if (stream.match(/^\[(?=[a-z][a-z0-9-]*(?:[,.%#\]]))/i)) return "meta";
		if (
			stream.match(/^[a-z][a-z0-9-]*/i) &&
			stream.string.trimStart().startsWith("[")
		) {
			return "typeName";
		}
		if (stream.match(/^,[\w:-]+/)) return "attributeName";
		if (stream.match(/^=(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^,\]]+)/))
			return "string";
		if (stream.match(/^[.%#][\w-]+/)) return "attributeName";
		if (stream.match(/^\]/)) return "meta";

		if (
			stream.match(
				/^(?:include|image|video|audio|xref|link|icon|kbd|btn|menu|footnote|stem)::?/,
			)
		) {
			return "keyword";
		}
		if (stream.match(/^::{1,4}/)) return "meta";
		if (stream.match(/^\{[\w-]+\}/)) return "variableName";
		if (stream.match(/^<<[^>,]+(?:,[^>]+)?>>/)) return "link";
		if (stream.match(/^https?:\/\/[^\s[]+(?:\[[^\]]*\])?/)) return "link";
		if (stream.match(/^\*\*[^*]+\*\*/)) return "strong";
		if (stream.match(/^\*[^*]+\*/)) return "emphasis";
		if (stream.match(/^_[^_]+_/)) return "emphasis";
		if (stream.match(/^`[^`]+`/)) return "string";
		if (stream.match(/^#[^#]+#/)) return "atom";
		if (stream.match(/^\^[^^]+\^|^~[^~]+~/)) return "number";

		stream.next();
		return null;
	},
});

import { RangeSetBuilder } from "@codemirror/state";
import { tags } from "@lezer/highlight";

const rstSectionDecoration = Decoration.line({
	class: "cm-rst-section-title",
});

export const rstSectionTitlePlugin = ViewPlugin.fromClass(
	class {
		public decorations: DecorationSet;

		public constructor(view: EditorView) {
			this.decorations = buildRstSectionDecorations(view);
		}

		public update(update: ViewUpdate): void {
			if (update.docChanged || update.viewportChanged) {
				this.decorations = buildRstSectionDecorations(update.view);
			}
		}
	},
	{
		decorations: (value) => value.decorations,
	},
);

function buildRstSectionDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const doc = view.state.doc;

	for (let index = 2; index <= doc.lines; index += 1) {
		const underline = doc.line(index).text.trim();

		if (!/^[=~`:#"^_*+-]{3,}$/.test(underline)) {
			continue;
		}

		const titleLine = doc.line(index - 1);

		if (titleLine.text.trim() === "") {
			continue;
		}

		builder.add(titleLine.from, titleLine.from, rstSectionDecoration);
	}

	return builder.finish();
}

export const restructuredTextLanguage = StreamLanguage.define({
	token(stream) {
		if (stream.sol()) {
			const line = stream.string.trim();

			// Section underline: visible but discreet
			if (/^[=~`:#"^_*+-]{3,}$/.test(line)) {
				stream.skipToEnd();
				return "meta";
			}

			// Directives: .. note::, .. include::, .. code-block::, etc.
			if (stream.match(/^\s*\.\.\s+[\w-]+::/)) {
				return "keyword";
			}

			// Explicit targets / comments: .. _name:, ..
			if (stream.match(/^\s*\.\.\s+_[^:]+:/)) {
				return "link";
			}

			// Directive options: :class:, :depth:, :header-rows:
			if (stream.match(/^\s+:[\w-]+:/)) {
				return "attributeName";
			}
		}

		// Inline roles: :math:`...`, :ref:`...`, :doc:`...`, :asciimath:`...`
		if (stream.match(/:[\w-]+:`[^`]*`/)) {
			return "keyword";
		}

		// Strong
		if (stream.match(/\*\*[^*]+\*\*/)) {
			return "strong";
		}

		// Emphasis
		if (stream.match(/\*[^*]+\*/)) {
			return "emphasis";
		}

		// Inline literal
		if (stream.match(/``[^`]+``/)) {
			return "string";
		}

		// Named link
		if (stream.match(/`[^`<]+<[^>]+>`_/)) {
			return "link";
		}

		// URL
		if (stream.match(/https?:\/\/\S+/)) {
			return "link";
		}

		stream.next();
		return null;
	},
});

export const tpCodeEditorHighlightStyle = syntaxHighlighting(
	HighlightStyle.define([
		{
			tag: [tags.keyword, tags.operatorKeyword, tags.modifier],
			color: "var(--tp-code-editor-token-keyword, #2563eb)",
		},
		{
			tag: [tags.string, tags.special(tags.string), tags.regexp],
			color: "var(--tp-code-editor-token-string, #b45309)",
		},
		{
			tag: [tags.number, tags.bool, tags.null, tags.atom],
			color: "var(--tp-code-editor-token-number, #7c3aed)",
		},
		{
			tag: [tags.comment, tags.lineComment, tags.blockComment],
			color: "var(--tp-code-editor-token-comment, #6b7280)",
			fontStyle: "italic",
		},
		{
			tag: [tags.variableName, tags.name],
			color: "var(--tp-code-editor-token-variable, #0f766e)",
		},
		{
			tag: [tags.propertyName, tags.attributeName, tags.labelName],
			color: "var(--tp-code-editor-token-property, #0f766e)",
		},
		{
			tag: [tags.typeName, tags.className, tags.namespace],
			color: "var(--tp-code-editor-token-type, #1d4ed8)",
		},
		{
			tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
			color: "var(--tp-code-editor-token-function, #1d4ed8)",
		},
		{
			tag: [tags.link, tags.url],
			color: "var(--tp-code-editor-token-link, #0284c7)",
			textDecoration: "underline",
		},
		{
			tag: [tags.strong],
			fontWeight: "700",
		},
		{
			tag: [tags.emphasis],
			fontStyle: "italic",
		},
	]),
);

export const tpCodeEditorTheme = EditorView.theme({
	"&": {
		backgroundColor:
			"var(--tp-code-editor-surface, var(--tp-paper-color, #ffffff))",
		color: "var(--tp-code-editor-foreground, var(--tp-text-body, #111827))",
	},
	".cm-content": {
		caretColor: "var(--tp-code-editor-caret, currentColor)",
	},
	".cm-cursor, .cm-dropCursor": {
		borderLeftColor: "var(--tp-code-editor-caret, currentColor)",
	},
	".cm-selectionBackground, .cm-content ::selection": {
		backgroundColor:
			"var(--tp-code-editor-selection, rgba(59, 130, 246, 0.25))",
	},
	".cm-activeLine": {
		backgroundColor:
			"var(--tp-code-editor-active-line, rgba(148, 163, 184, 0.16))",
	},
	".cm-gutters": {
		backgroundColor:
			"var(--tp-code-editor-gutter-background, color-mix(in srgb, var(--tp-neutral-fill-softer, #f3f4f6) 88%, transparent))",
		color:
			"var(--tp-code-editor-gutter-foreground, var(--tp-text-muted, #6b7280))",
		borderInlineEnd:
			"1px solid var(--tp-code-editor-gutter-border, var(--tp-neutral-stroke-soft, #d1d5db))",
	},
	".cm-activeLineGutter": {
		backgroundColor:
			"var(--tp-code-editor-active-line, rgba(148, 163, 184, 0.16))",
	},
	".cm-foldPlaceholder": {
		backgroundColor:
			"var(--tp-code-editor-fold-background, color-mix(in srgb, var(--tp-neutral-fill-soft, #e5e7eb) 70%, transparent))",
		border: "none",
		color: "var(--tp-code-editor-muted, var(--tp-text-muted, #6b7280))",
	},
});

export const asciidocHighlightStyle = syntaxHighlighting(
	HighlightStyle.define([
		{
			tag: [
				tags.heading,
				tags.heading1,
				tags.heading2,
				tags.heading3,
				tags.heading4,
				tags.heading5,
				tags.heading6,
			],
			color: "var(--tp-code-editor-token-number, #7c3aed)",
			fontWeight: "700",
		},
		{
			tag: tags.keyword,
			color: "var(--tp-code-editor-token-keyword, #2563eb)",
			fontWeight: "600",
		},
		{
			tag: [tags.attributeName, tags.labelName],
			color: "var(--tp-code-editor-token-property, #0f766e)",
		},
		{
			tag: [tags.typeName, tags.className],
			color: "var(--tp-code-editor-token-type, #1d4ed8)",
			fontWeight: "600",
		},
		{
			tag: tags.meta,
			color: "var(--tp-code-editor-muted, #6b7280)",
		},
		{
			tag: [tags.link, tags.url],
			color: "var(--tp-code-editor-token-link, #0284c7)",
			textDecoration: "underline",
		},
		{
			tag: tags.atom,
			color: "var(--tp-code-editor-token-number, #7c3aed)",
		},
	]),
);

export const rstHighlightStyle = syntaxHighlighting(
	HighlightStyle.define([
		{
			tag: [
				tags.heading,
				tags.heading1,
				tags.heading2,
				tags.heading3,
				tags.heading4,
				tags.heading5,
				tags.heading6,
			],
			color: "var(--tp-code-editor-token-number, #7c3aed)",
			fontWeight: "700",
		},

		{
			tag: tags.keyword,
			color: "var(--tp-code-editor-token-keyword, #2563eb)",
			fontWeight: "600",
		},

		{
			tag: tags.attributeName,
			color: "var(--tp-code-editor-token-property, #0f766e)",
		},

		{
			tag: tags.link,
			color: "var(--tp-code-editor-token-link, #0284c7)",
			textDecoration: "underline",
		},

		{
			tag: tags.strong,
			fontWeight: "700",
		},

		{
			tag: tags.emphasis,
			fontStyle: "italic",
		},

		{
			tag: tags.string,
			color: "var(--tp-code-editor-token-string, #b45309)",
		},
	]),
);

export const rstBaseTheme = EditorView.baseTheme({
	".cm-line .cm-header": {
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		fontWeight: "700",
		textDecoration: "none",
	},

	".cm-line .cm-header *": {
		textDecoration: "none",
	},

	".cm-rst-section-title": {
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		fontWeight: "700",
		textDecoration: "none",
	},

	".cm-meta": {
		color: "var(--tp-code-editor-token-number, #7c3aed)",
		opacity: "0.35",
		textDecoration: "none",
	},
});

const markdownFenceMark = Decoration.mark({ class: "cm-tp-markdown-fence" });
const markdownComponentMark = Decoration.mark({
	class: "cm-tp-markdown-component",
});
const markdownAttributesMark = Decoration.mark({
	class: "cm-tp-markdown-attributes",
});
const markdownDefinitionTermMark = Decoration.mark({
	class: "cm-tp-markdown-definition-term",
});
const markdownDefinitionMarkerMark = Decoration.mark({
	class: "cm-tp-markdown-definition-marker",
});

/**
 * Builds supplemental Markdown decorations for tp-specific syntax.
 *
 * CodeMirror's Markdown grammar deliberately treats custom `:::` containers
 * and definition lists as plain text. These decorations make their structure
 * visible while leaving parsing, selection, and editing unchanged.
 */
function buildTpMarkdownDecorations(view: EditorView): DecorationSet {
	const ranges: Array<ReturnType<typeof markdownFenceMark.range>> = [];

	for (
		let lineNumber = 1;
		lineNumber <= view.state.doc.lines;
		lineNumber += 1
	) {
		const line = view.state.doc.line(lineNumber);
		const block =
			/^(\s*)(:{3,})(?:\s+([a-z][a-z0-9-]*)(?:\s+(\{.*\}))?)?\s*$/i.exec(
				line.text,
			);

		if (block !== null) {
			const leadingLength = block[1]?.length ?? 0;
			const fence = block[2] ?? "";
			const fenceFrom = line.from + leadingLength;
			ranges.push(markdownFenceMark.range(fenceFrom, fenceFrom + fence.length));

			const component = block[3];
			if (component !== undefined) {
				const componentFrom = line.text.indexOf(
					component,
					leadingLength + fence.length,
				);
				ranges.push(
					markdownComponentMark.range(
						line.from + componentFrom,
						line.from + componentFrom + component.length,
					),
				);
			}

			const attributes = block[4];
			if (attributes !== undefined) {
				const attributesFrom = line.text.lastIndexOf(attributes);
				ranges.push(
					markdownAttributesMark.range(
						line.from + attributesFrom,
						line.from + attributesFrom + attributes.length,
					),
				);
			}
		}

		const definition = /^(\s*)(:)(?=\s+)/.exec(line.text);
		if (definition !== null) {
			const markerFrom = line.from + (definition[1]?.length ?? 0);
			ranges.push(
				markdownDefinitionMarkerMark.range(markerFrom, markerFrom + 1),
			);

			if (lineNumber > 1) {
				const term = view.state.doc.line(lineNumber - 1);
				if (term.text.trim() !== "") {
					const termLeading = term.text.length - term.text.trimStart().length;
					const termTrailing = term.text.length - term.text.trimEnd().length;
					ranges.push(
						markdownDefinitionTermMark.range(
							term.from + termLeading,
							term.to - termTrailing,
						),
					);
				}
			}
		}

		for (const match of line.text.matchAll(
			/:([a-z][a-z0-9-]*):[^{}\n]*(\{[^}\n]*\})/gi,
		)) {
			const full = match[0];
			const component = match[1];
			const attributes = match[2];
			const start = match.index;
			if (
				full === undefined ||
				component === undefined ||
				attributes === undefined ||
				start === undefined
			)
				continue;

			const componentFrom = line.from + start;
			const attributesFrom = line.from + start + full.lastIndexOf(attributes);
			ranges.push(
				markdownComponentMark.range(
					componentFrom,
					componentFrom + component.length + 2,
				),
			);
			ranges.push(
				markdownAttributesMark.range(
					attributesFrom,
					attributesFrom + attributes.length,
				),
			);
		}
	}

	ranges.sort((left, right) => left.from - right.from || left.to - right.to);
	return Decoration.set(ranges, true);
}

export const tpMarkdownSyntaxPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildTpMarkdownDecorations(view);
		}

		update(update: ViewUpdate): void {
			if (update.docChanged || update.viewportChanged) {
				this.decorations = buildTpMarkdownDecorations(update.view);
			}
		}
	},
	{ decorations: (plugin) => plugin.decorations },
);

export const tpMarkdownSyntaxTheme = EditorView.baseTheme({
	".cm-tp-markdown-fence, .cm-tp-markdown-definition-marker": {
		color: "var(--tp-code-editor-token-keyword, #2563eb)",
		fontWeight: "700",
	},
	".cm-tp-markdown-component": {
		color: "var(--tp-code-editor-token-type, #1d4ed8)",
		fontWeight: "600",
	},
	".cm-tp-markdown-attributes": {
		color: "var(--tp-code-editor-token-property, #0f766e)",
	},
	".cm-tp-markdown-definition-term": {
		color: "var(--tp-code-editor-token-variable, #0f766e)",
		fontWeight: "600",
	},
});

/**
 * Code editor based on CodeMirror 6, without Shadow DOM.
 *
 * Possible sources:
 * 1. content defined by `setValue()`
 * 2. content of a direct child `<script type="tp/<language>">`
 * 3. content loaded from `src`
 * 4. content of the `value` attribute
 *
 * The component automatically adds an internal CodeMirror panel above the editor, containing:
 * - a badge showing the current language
 * - a `<tp-copy-code>` button targeting the editor itself
 * - a `<tp-theme>` button for switching between light and dark themes
 * - a `<tp-dropdown>` button for keyboard shortcuts and editor actions
 *
 * This panel is displayed when the `toolbar` attribute is present and can be
 * toggled with F1.
 *
 * @summary Displays a CodeMirror 6 based code editor.
 * @tagname tp-code-editor
 *
 * @attr {string} dir = "inherited" - Text direction inherited from HTMLElement (`ltr`, `rtl`, `auto`).
 * @attr {string} filename = "" - Logical filename associated with the current content.
 * @attr {boolean} fold-gutter = false - Shows fold markers in the gutter.
 * @attr {string} lang = "inherited" - Language tag inherited from HTMLElement.
 * @attr {string} language = "html" - Fallback editing language when it cannot be inferred from a `tp/LANGUAGE` script or `src` extension.
 * @attr {boolean} line-numbers = false - Shows line numbers.
 * @attr {string} placeholder = "Type some LANGUAGE code... or F1 to toggle the toolbar" - Text shown when the editor is empty. Defaults to `Type some LANGUAGE code... or F1 to toggle the toolbar` using the resolved language.
 * @attr {boolean} readonly = false - Enables read-only mode.
 * @attr {string} src = "" - URL of a source file to load.
 * @attr {boolean} toolbar = false - Shows the editor UI panel.
 * @attr {string} value = "" - Initial editor content.
 * @attr {boolean} word-wrap = false - Enables soft wrapping.
 *
 *
 * @event tp-code-editor-boundary Emitted when keyboard navigation reaches the editor boundary.
 * @event tp-code-editor-change Emitted when the editor content changes after user input.
 * @event tp-code-editor-error Emitted when a source loading error occurs.
 * @event tp-code-editor-input Emitted on user input.
 * @event tp-code-editor-load Emitted after the editor source has been resolved and loaded.
 * @event tp-code-editor-ready Emitted when the editor has been initialized.
 * @event tp-code-editor-reset Emitted after `reset()` restores the initial value.
 * @eventdetail tp-code-editor-boundary { direction: "before" | "after" }
 * @eventdetail tp-code-editor-change { filename: string; value: string }
 * @eventdetail tp-code-editor-error { message: string }
 * @eventdetail tp-code-editor-input { filename: string; value: string }
 * @eventdetail tp-code-editor-load { filename: string; source: "api" | "script" | "src" | "value"; valueLength: number }
 * @eventdetail tp-code-editor-ready void
 * @eventdetail tp-code-editor-reset { value: string }
 *
 * @cssprop --tp-code-editor-active-line Background color of the active editor line.
 * @cssprop --tp-code-editor-caret Caret color.
 * @cssprop --tp-code-editor-fold-background Background color of fold placeholders.
 * @cssprop --tp-code-editor-foreground Main editor text color.
 * @cssprop --tp-code-editor-gutter-background Gutter background color.
 * @cssprop --tp-code-editor-gutter-border Gutter border color.
 * @cssprop --tp-code-editor-gutter-foreground Gutter text and marker color.
 * @cssprop --tp-code-editor-muted Muted editor text color.
 * @cssprop --tp-code-editor-selection Selection background color.
 * @cssprop --tp-code-editor-surface Editor surface background color.
 * @cssprop --tp-code-editor-token-comment Syntax color for comments.
 * @cssprop --tp-code-editor-token-function Syntax color for function names.
 * @cssprop --tp-code-editor-token-keyword Syntax color for keywords.
 * @cssprop --tp-code-editor-token-link Syntax color for links.
 * @cssprop --tp-code-editor-token-number Syntax color for numbers.
 * @cssprop --tp-code-editor-token-property Syntax color for properties.
 * @cssprop --tp-code-editor-token-string Syntax color for strings.
 * @cssprop --tp-code-editor-token-type Syntax color for types.
 * @cssprop --tp-code-editor-token-variable Syntax color for variables.
 * @example
 * <tp-code-editor></tp-code-editor>
 */
export class TpCodeEditor extends TpBase {
	/**
	 * Identifiant unique de la feuille de styles injectée globalement.
	 *
	 * @summary Identifiant du style global du composant.
	 * @internal
	 */
	private static readonly styleId = "tp-code-editor-styles";

	/**
	 * Instance CodeMirror active.
	 *
	 * @summary Référence vers l’éditeur CodeMirror.
	 * @internal
	 */
	private editor: EditorView | null = null;
	/** Annotation numbers owned by each linked tp-code-comment list. */
	private readonly commentNumbers = new Map<object, readonly number[]>();
	/** Rich explanations supplied by each linked annotation list. */
	private readonly commentContents = new Map<
		object,
		ReadonlyMap<number, HTMLElement>
	>();
	/** Reconfigures comment decorations without resetting code, selection or undo. */
	private readonly commentCompartment = new Compartment();

	/** Registers a linked annotation list; an empty array removes only that owner's markers. */
	public setCodeCommentNumbers(
		owner: object,
		numbers: readonly number[],
		comments: ReadonlyMap<number, HTMLElement> = new Map(),
	): void {
		if (numbers.length) {
			this.commentNumbers.set(owner, [...numbers]);
			this.commentContents.set(owner, comments);
		} else {
			this.commentNumbers.delete(owner);
			this.commentContents.delete(owner);
		}
		this.editor?.dispatch({
			effects: this.commentCompartment.reconfigure(this.commentExtension()),
		});
	}
	/** Combines the marker numbers requested by all linked annotation lists. */
	private commentExtension(): Extension {
		if (!this.commentNumbers.size) return [];
		return codeCommentMarkers(
			new Set([...this.commentNumbers.values()].flat()),
			new Map(
				[...this.commentContents.values()].flatMap((comments) => [...comments]),
			),
		);
	}

	/**
	 * Conteneur DOM de l’éditeur.
	 *
	 * @summary Référence vers le conteneur de rendu de CodeMirror.
	 * @internal
	 */
	private container: HTMLDivElement | null = null;
	private panelContainer: HTMLDivElement | null = null;
	private sourceErrorElement: HTMLDivElement | null = null;
	private panelObserver: MutationObserver | null = null;
	private layoutObserver: ResizeObserver | null = null;
	private observedInlineSize = -1;
	private actionPanelEl: HTMLDivElement | null = null;

	/**
	 * Badge du langage courant.
	 *
	 * @summary Référence vers le badge de langage.
	 * @internal
	 */
	private languageBadgeEl: TpBadge | null = null;
	private cursorPositionEl: HTMLSpanElement | null = null;

	/**
	 * Bouton de copie interne.
	 *
	 * @summary Référence vers le bouton de copie.
	 * @internal
	 */
	// private copyButtonEl: TpCopyCode | null = null;

	private static nextKeyboardId = 0;
	private static nextThemeTargetId = 0;

	private readonly keyboardId = `tp-code-editor-keyboard-${String(
		TpCodeEditor.nextKeyboardId++,
	)}`;

	private keyboardDropdownEl: TpDropdown | null = null;

	private readonly generatedThemeTargetId = `tp-code-editor-${String(
		TpCodeEditor.nextThemeTargetId++,
	)}`;

	/**
	 * Code courant résolu par le composant.
	 *
	 * @summary Contenu courant de l’éditeur.
	 * @internal
	 */
	private currentValue = "";
	private currentLanguage = "html";

	/**
	 * Surcharge de code définie explicitement via `setValue()`.
	 *
	 * @summary Surcharge de contenu fournie par l’API.
	 * @internal
	 */
	private overrideValue: string | null = null;

	/**
	 * Nom de fichier effectivement résolu.
	 *
	 * @summary Nom logique du fichier courant.
	 * @internal
	 */
	private currentFilename = "";
	private pendingSourceLoad: Promise<void> | null = null;
	private sourceReloadRequested = false;

	/**
	 * Indique si le prochain changement vient d’une synchronisation interne
	 * et non d’une saisie utilisateur.
	 *
	 * @summary Distingue les mises à jour internes des saisies utilisateur.
	 * @internal
	 */
	private isApplyingExternalValue = false;

	private initialValue = "";
	private hasInitialValue = false;

	private toggleGutters(): void {
		this.foldGutter = !this.foldGutter;
	}

	private toggleLineNumbers(): void {
		this.lineNumbers = !this.lineNumbers;
	}

	private emitBoundaryIntent(direction: "before" | "after"): boolean {
		this.dispatchEvent(
			new CustomEvent("tp-code-editor-boundary", {
				bubbles: true,
				detail: {
					direction,
				},
			}),
		);

		return true;
	}

	private getShortcutLabels(): {
		mod: string;
		shift: string;
		alt: string;
	} {
		const isMac =
			navigator.platform.toLowerCase().includes("mac") ||
			navigator.userAgent.toLowerCase().includes("mac");

		if (isMac) {
			return {
				mod: "⌘",
				shift: "⇧",
				alt: "⌥",
			};
		}

		return {
			mod: "Ctrl",
			shift: "Shift",
			alt: "Alt",
		};
	}

	/**
	 * Liste des attributs observés par le composant.
	 *
	 * @summary Déclare les attributs observés.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return [
			"value",
			"src",
			"filename",
			"language",
			"placeholder",
			"readonly",
			"toolbar",
			"line-numbers",
			"fold-gutter",
			"word-wrap",
		];
	}

	/**
	 * Code initial sérialisé dans l’attribut.
	 *
	 * @attr value
	 */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}

	public set value(value: string) {
		if (value === "") {
			this.removeAttribute("value");
			return;
		}

		this.setAttribute("value", value);
	}

	/**
	 * URL optionnelle d’un fichier source à charger.
	 *
	 * @attr src
	 */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	public set src(value: string) {
		if (value === "") {
			this.removeAttribute("src");
			return;
		}

		this.setAttribute("src", value);
	}

	/**
	 * Nom logique du fichier associé au contenu courant.
	 *
	 * @attr filename
	 */
	public get filename(): string {
		return this.getAttribute("filename") ?? "";
	}

	public set filename(value: string) {
		if (value === "") {
			this.removeAttribute("filename");
			return;
		}

		this.setAttribute("filename", value);
	}

	/**
	 * Langage de l’éditeur.
	 *
	 * @attr language
	 * @default html
	 */
	public get language(): string {
		return this.getAttribute("language") ?? "html";
	}

	public set language(value: string) {
		this.setAttribute("language", value);
	}

	/**
	 * Texte affiché quand l’éditeur est vide.
	 *
	 * @attr placeholder
	 */
	public get placeholder(): string {
		return (
			this.getAttribute("placeholder") ??
			`Type some ${this.currentLanguage} code... or F1 to toggle the toolbar`
		);
	}

	public set placeholder(value: string) {
		if (value === "") {
			this.removeAttribute("placeholder");
			return;
		}

		this.setAttribute("placeholder", value);
	}

	/**
	 * Active le mode lecture seule.
	 *
	 * @attr readonly
	 */
	public get readonly(): boolean {
		return this.hasAttribute("readonly");
	}

	public set readonly(value: boolean) {
		if (value) {
			this.setAttribute("readonly", "");
			return;
		}

		this.removeAttribute("readonly");
	}

	/**
	 * Affiche les numéros de ligne.
	 *
	 * @attr line-numbers
	 */
	public get lineNumbers(): boolean {
		return this.hasAttribute("line-numbers");
	}

	public set lineNumbers(value: boolean) {
		if (value) {
			this.setAttribute("line-numbers", "");
			return;
		}

		this.removeAttribute("line-numbers");
	}

	/**
	 * Affiche les indicateurs de pliage CodeMirror.
	 *
	 * @attr fold-gutter
	 */
	public get foldGutter(): boolean {
		return this.hasAttribute("fold-gutter");
	}

	public set foldGutter(value: boolean) {
		if (value) {
			this.setAttribute("fold-gutter", "");
			return;
		}

		this.removeAttribute("fold-gutter");
	}

	/**
	 * Active le retour automatique à la ligne.
	 *
	 * @attr word-wrap
	 */
	public get wordWrap(): boolean {
		return this.hasAttribute("word-wrap");
	}

	public set wordWrap(value: boolean) {
		if (value) {
			this.setAttribute("word-wrap", "");
			return;
		}

		this.removeAttribute("word-wrap");
	}

	/**
	 * Shows the editor UI panel.
	 *
	 * @attr toolbar
	 */
	public get toolbar(): boolean {
		return this.hasAttribute("toolbar");
	}

	public set toolbar(value: boolean) {
		this.toggleAttribute("toolbar", value);
	}

	/**
	 * Définit la valeur initiale de l’éditeur.
	 *
	 * @summary Sets the value used by `reset()` without changing the current editor content.
	 */
	public setInitialValue(value: string): void {
		this.initialValue = value;
		this.hasInitialValue = true;
	}

	/**
	 * Retourne la valeur initiale.
	 *
	 * @summary Returns the value currently used as the reset target.
	 */
	public getInitialValue(): string {
		return this.initialValue;
	}

	/**
	 * Restaure la valeur initiale.
	 *
	 * @summary Restores the editor content to the initial value and emits `tp-code-editor-reset`.
	 */
	public reset(): void {
		if (!this.hasInitialValue) {
			this.setValue("");
			return;
		}

		this.setValue(this.initialValue);

		this.dispatchEvent(
			new CustomEvent("tp-code-editor-reset", {
				bubbles: true,
				detail: {
					value: this.initialValue,
				},
			}),
		);
	}

	/**
	 * Lifecycle callback called when the component is connected to the document.
	 *
	 * @summary Initialise le composant lors de sa connexion au DOM.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureThemeTargetId();
		this.ensureContainer();
		this.ensureActionPanel();
		this.createEditor();
		this.startPanelObserver();
		this.startLayoutObserver();
		this.syncActionPanel();
		void this.requestLoadSourceAndSyncEditor();

		void document.fonts?.ready.then(() => {
			this.editor?.requestMeasure();
			this.scheduleSyncHeight();
		});

		this.dispatchEvent(
			new CustomEvent("tp-code-editor-ready", {
				bubbles: true,
			}),
		);
	}

	/**
	 * Callback du cycle de vie appelée lorsqu’un attribut observé change.
	 *
	 * @summary Réagit aux changements d’attributs observés.
	 * @internal
	 */
	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (!this.isConnected || oldValue === newValue) {
			return;
		}

		if (name === "language") {
			this.currentLanguage = this.readExplicitLanguage() ?? "html";
			this.reconfigureEditor();
		}

		this.syncActionPanel();

		if (name === "toolbar") {
			if (!this.toolbar) {
				this.keyboardDropdownEl?.hide();
			}
			this.scheduleSyncHeight();
			return;
		}

		if (
			name === "value" ||
			name === "src" ||
			name === "filename" ||
			name === "language"
		) {
			void this.requestLoadSourceAndSyncEditor();
			return;
		}

		this.reconfigureEditor();
		this.scheduleSyncHeight();
	}

	/**
	 * Callback du cycle de vie appelée lors de la déconnexion du composant.
	 *
	 * @summary Détruit proprement l’éditeur.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.panelObserver?.disconnect();
		this.panelObserver = null;
		this.layoutObserver?.disconnect();
		this.layoutObserver = null;
		this.keyboardDropdownEl?.removeEventListener(
			"tp-dropdown-toggle",
			this.handleKeyboardDropdownToggle,
		);
		this.keyboardDropdownEl?.remove();
		this.keyboardDropdownEl = null;
		this.editor?.destroy();
		this.editor = null;
	}

	/**
	 * Retourne la hauteur utile intrinsèque du contenu édité.
	 *
	 * Cette mesure ne dépend pas de la hauteur actuellement visible du composant.
	 * Elle est donc adaptée au calcul d’un layout parent, notamment en mode vertical.
	 *
	 * @summary Returns the computed height required by the current editor content, in pixels.
	 * @returns Hauteur utile du contenu en pixels.
	 */
	public getContentHeight(): number {
		if (this.container === null || this.editor === null) {
			return 0;
		}

		const editorRoot = this.container.querySelector<HTMLElement>(".cm-editor");
		const scroller = this.container.querySelector<HTMLElement>(".cm-scroller");
		const content = this.container.querySelector(".cm-content");
		const firstLine = this.container.querySelector(".cm-line");
		const previousBlockSizes = {
			host: this.style.blockSize,
			container: this.container.style.blockSize,
			editorRoot: editorRoot?.style.blockSize ?? "",
			scroller: scroller?.style.blockSize ?? "",
		};

		this.style.blockSize = "auto";
		this.container.style.blockSize = "auto";
		if (editorRoot instanceof HTMLElement) {
			editorRoot.style.blockSize = "auto";
		}
		if (scroller instanceof HTMLElement) {
			scroller.style.blockSize = "auto";
		}

		try {
			const lineHeight =
				firstLine instanceof HTMLElement
					? Math.max(
							Math.ceil(
								Number.parseFloat(getComputedStyle(firstLine).lineHeight) || 20,
							),
							20,
						)
					: 20;

			const lineCount = this.editor.state.doc.lines;

			let paddingTop = 0;
			let paddingBottom = 0;

			if (content instanceof HTMLElement) {
				const styles = getComputedStyle(content);
				paddingTop = Number.parseFloat(styles.paddingTop) || 0;
				paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
			}

			const logicalLinesHeight = Math.ceil(
				lineCount * lineHeight + paddingTop + paddingBottom,
			);
			const renderedLinesHeight = Array.from(
				this.container.querySelectorAll<HTMLElement>(".cm-line"),
			).reduce(
				(height, line) =>
					height + Math.ceil(line.getBoundingClientRect().height),
				0,
			);
			const measuredContentHeight = Math.ceil(
				renderedLinesHeight + paddingTop + paddingBottom,
			);
			return Math.max(logicalLinesHeight, measuredContentHeight);
		} finally {
			this.style.blockSize = previousBlockSizes.host;
			this.container.style.blockSize = previousBlockSizes.container;
			if (editorRoot instanceof HTMLElement) {
				editorRoot.style.blockSize = previousBlockSizes.editorRoot;
			}
			if (scroller instanceof HTMLElement) {
				scroller.style.blockSize = previousBlockSizes.scroller;
			}
		}
	}

	/**
	 * Retourne le code courant.
	 *
	 * @summary Returns the current editor content.
	 * @returns Contenu textuel courant.
	 */
	public getValue(): string {
		return this.editor?.state.doc.toString() ?? this.currentValue;
	}

	/**
	 * Définit explicitement le contenu de l’éditeur.
	 *
	 * @summary Replaces the current editor content and stores it as an explicit API-provided value.
	 * @param code Code à injecter dans l’éditeur.
	 */
	public setValue(code: string): void {
		this.overrideValue = code;
		this.currentValue = code;
		this.applyValueToEditor(code);
	}

	/**
	 * Donne le focus à l’éditeur.
	 *
	 * @summary Moves focus to the CodeMirror editor.
	 */
	public focus(): void {
		this.editor?.focus();
		this.container?.querySelector(".cm-editor")?.classList.add("cm-focused");
	}

	/**
	 * Returns whether the primary cursor is at the start of the document.
	 *
	 * @summary Returns `true` when the editor selection is collapsed at the start of the document.
	 * @returns `true` when the main selection is empty and starts at offset 0.
	 */
	public isCursorAtStart(): boolean {
		if (this.editor === null) {
			return false;
		}

		const selection = this.editor.state.selection.main;

		return selection.empty && selection.from === 0;
	}

	/**
	 * Returns whether the primary cursor is at the end of the document.
	 *
	 * @summary Returns `true` when the editor selection is collapsed at the end of the document.
	 * @returns `true` when the main selection is empty and ends at document length.
	 */
	public isCursorAtEnd(): boolean {
		if (this.editor === null) {
			return false;
		}

		const selection = this.editor.state.selection.main;

		return selection.empty && selection.to === this.editor.state.doc.length;
	}

	/**
	 * Recharge explicitement la source courante.
	 *
	 * @summary Reloads the content from `src`, when a source file is configured.
	 */
	public reload(): void {
		void this.loadSourceAndSyncEditor();
	}

	private requestLoadSourceAndSyncEditor(): Promise<void> {
		if (this.pendingSourceLoad !== null) {
			this.sourceReloadRequested = true;
			return this.pendingSourceLoad;
		}

		this.pendingSourceLoad = (async () => {
			do {
				this.sourceReloadRequested = false;
				await this.loadSourceAndSyncEditor();
			} while (this.sourceReloadRequested);
		})().finally(() => {
			this.pendingSourceLoad = null;
		});

		return this.pendingSourceLoad;
	}

	/**
	 * Force la resynchronisation de la hauteur visible avec le contenu.
	 *
	 * @summary Recomputes the editor height from the current content and panels.
	 */
	public syncHeightToContent(): void {
		this.scheduleSyncHeight();
	}

	/**
	 * Crée l’instance CodeMirror.
	 *
	 * @summary Initialise l’éditeur CodeMirror.
	 * @internal
	 */
	private createEditor(): void {
		if (this.container === null) {
			return;
		}

		const state = EditorState.create({
			doc: this.currentValue,
			extensions: this.buildExtensions(),
		});

		this.editor = new EditorView({
			parent: this.container,
			state,
		});
	}

	private async runKeyboardAction(
		action: TpCodeEditorKeyboardAction,
	): Promise<void> {
		if (this.editor === null) {
			return;
		}

		const view = this.editor;
		view.focus();

		switch (action) {
			case "undo":
				undo(view);
				return;

			case "redo":
				redo(view);
				return;

			case "copy":
				document.execCommand("copy");
				return;

			case "cut":
				document.execCommand("cut");
				return;

			case "paste": {
				try {
					const text = await navigator.clipboard.readText();
					view.dispatch(view.state.replaceSelection(text));
				} catch {
					document.execCommand("paste");
				}
				return;
			}

			case "select-all":
				selectAll(view);
				return;

			case "fold-code":
				foldCode(view);
				return;

			case "unfold-code":
				unfoldCode(view);
				return;

			case "toggle-gutters":
				this.foldGutter = !this.foldGutter;
				return;

			case "toggle-line-numbers":
				this.lineNumbers = !this.lineNumbers;
				return;

			case "indent":
				indentMore(view);
				return;

			case "dedent":
				indentLess(view);
				return;

			case "search":
				openSearchPanel(view);
				return;

			case "replace":
				openSearchPanel(view);
				replaceNext(view);
				return;

			case "goto-line":
				gotoLine(view);
				return;

			case "toggle-line-comment":
				toggleLineComment(view);
				return;

			case "toggle-block-comment":
				toggleBlockComment(view);
				return;

			case "toggle-command-palette":
				this.toggleKeyboardDropdown();
				return;

			case "toggle-toolbar":
				this.toolbar = !this.toolbar;
				return;

			default:
				return;
		}
	}

	private readonly handleKeyboardDropdownClick = (event: Event): void => {
		const target = event.target;

		if (!(target instanceof HTMLElement)) {
			return;
		}

		const item = target.closest("[data-tp-code-editor-keyboard-action]");

		if (!(item instanceof HTMLElement)) {
			return;
		}

		const action = item.getAttribute(
			"data-tp-code-editor-keyboard-action",
		) as TpCodeEditorKeyboardAction | null;

		if (action === null) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		void this.runKeyboardAction(action).finally(() => {
			this.keyboardDropdownEl?.hide();
		});
	};

	private readonly handleKeyboardDropdownToggle = (event: Event): void => {
		const dropdown = event.currentTarget;

		if (!(dropdown instanceof HTMLElement)) {
			return;
		}

		this.toggleAttribute(
			"data-tp-code-editor-keyboard-open",
			dropdown.hasAttribute("open"),
		);
	};

	/**
	 * Recharge la source active puis synchronise l’éditeur.
	 *
	 * @summary Résout la source puis met à jour CodeMirror.
	 * @internal
	 */
	private async loadSourceAndSyncEditor(): Promise<void> {
		const resolved = await this.resolveSource();
		// setValue() may run while a declarative source is being resolved.
		// Its explicit API value must retain precedence over that older result.
		const { filename, source, value } =
			this.overrideValue === null
				? resolved
				: { filename: this.filename, source: "api", value: this.overrideValue };

		this.currentValue = value;
		this.currentFilename = filename;

		if (source !== "api" && this.overrideValue !== null) {
			this.overrideValue = null;
		}

		if (this.editor === null) {
			return;
		}

		this.reconfigureEditor();
		this.applyValueToEditor(value);
		this.scheduleSyncHeight();
		this.syncActionPanel();

		this.dispatchEvent(
			new CustomEvent("tp-code-editor-load", {
				bubbles: true,
				detail: {
					filename,
					source,
					valueLength: value.length,
				},
			}),
		);
	}

	/**
	 * Résout la source de code à utiliser.
	 *
	 * @summary Résout la source de code.
	 * @returns Objet contenant le code, sa source et le nom logique du fichier.
	 * @internal
	 */
	private async resolveSource(): Promise<{
		filename: string;
		source: TpCodeEditorSource;
		value: string;
	}> {
		const explicitLanguage = this.readExplicitLanguage();

		if (this.overrideValue !== null) {
			this.currentLanguage = explicitLanguage ?? "html";
			this.clearInlineSourceError();
			return {
				filename: this.filename,
				source: "api",
				value: this.overrideValue,
			};
		}

		const fromScript = getCodeFromScript(undefined, this);
		if (fromScript !== null) {
			this.currentLanguage = this.resolveLanguage(
				fromScript.language,
				explicitLanguage,
			);
			this.clearInlineSourceError();
			return {
				filename: fromScript.filename || this.filename,
				source: "script",
				value: fromScript.value,
			};
		}

		if (this.src !== "") {
			try {
				const source = hasComponentMarkdownSourceBase(this)
					? resolveComponentSourceUrl(this, this.src).href
					: this.src;
				const fromFile = await getCodeFromFile(source);
				this.currentLanguage = this.resolveLanguage(
					fromFile.language,
					explicitLanguage,
				);
				this.clearInlineSourceError();

				return {
					filename: this.filename || fromFile.filename,
					source: "src",
					value: fromFile.value,
				};
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : "Unknown fetch error";

				this.currentLanguage = explicitLanguage ?? "html";
				this.dispatchErrorEvent(message);
				this.showInlineSourceError(message);

				return {
					filename: this.filename,
					source: "none",
					value: `/* Failed to load src: ${message} */`,
				};
			}
		}

		if (this.value !== "") {
			this.currentLanguage = explicitLanguage ?? "html";
			this.clearInlineSourceError();
			return {
				filename: this.filename,
				source: "value",
				value: this.value,
			};
		}

		this.currentLanguage = explicitLanguage ?? "html";
		this.clearInlineSourceError();
		return {
			filename: this.filename,
			source: "none",
			value: "",
		};
	}

	private resolveLanguage(
		detectedLanguage: string | undefined,
		explicitLanguage: string | undefined,
	): string {
		const detected = detectedLanguage?.trim().toLowerCase() ?? "";
		if (detected !== "" && detected !== "plaintext") {
			return detected;
		}

		return explicitLanguage ?? "html";
	}

	/**
	 * Applique une nouvelle configuration à CodeMirror
	 * après changement d’attributs structurels.
	 *
	 * @summary Reconfigure l’éditeur CodeMirror.
	 * @internal
	 */
	private reconfigureEditor(): void {
		if (this.editor === null) {
			return;
		}

		const doc = this.editor.state.doc.toString();

		this.editor.setState(
			EditorState.create({
				doc,
				extensions: this.buildExtensions(),
			}),
		);
	}

	/**
	 * Injecte une valeur dans l’éditeur sans déclencher la logique
	 * de saisie utilisateur.
	 *
	 * @summary Synchronise le contenu de l’éditeur avec une valeur externe.
	 * @param value Contenu à injecter.
	 * @internal
	 */
	private applyValueToEditor(value: string): void {
		if (this.editor === null) {
			return;
		}

		const current = this.editor.state.doc.toString();
		if (current === value) {
			return;
		}

		this.isApplyingExternalValue = true;

		this.editor.dispatch({
			changes: {
				from: 0,
				insert: value,
				to: this.editor.state.doc.length,
			},
		});

		this.isApplyingExternalValue = false;
	}

	private toggleKeyboardDropdown(): void {
		if (this.keyboardDropdownEl?.open) {
			this.keyboardDropdownEl.hide();
		} else {
			this.keyboardDropdownEl?.show();
		}
	}

	/**
	 * Construit les extensions CodeMirror nécessaires.
	 *
	 * @summary Construit la configuration de l’éditeur.
	 * @returns Tableau d’extensions CodeMirror.
	 * @internal
	 */
	private buildExtensions(): Extension[] {
		const customKeymap = keymap.of([
			{
				key: "ArrowUp",
				run: () => {
					if (!this.isCursorAtStart()) {
						return false;
					}

					return this.emitBoundaryIntent("before");
				},
			},
			{
				key: "Backspace",
				run: () => {
					if (!this.isCursorAtStart()) {
						return false;
					}

					return this.emitBoundaryIntent("before");
				},
			},
			{
				key: "ArrowDown",
				run: () => {
					if (!this.isCursorAtEnd()) {
						return false;
					}

					return this.emitBoundaryIntent("after");
				},
			},
			{
				key: "Delete",
				run: () => {
					if (!this.isCursorAtEnd()) {
						return false;
					}

					return this.emitBoundaryIntent("after");
				},
			},
			indentWithTab,
			{
				key: "Mod-Alt-ArrowDown",
				run: (view) => {
					foldCode(view);
					return true;
				},
			},
			{
				key: "Mod-Alt-ArrowUp",
				run: (view) => {
					unfoldCode(view);
					return true;
				},
			},
			{
				key: "Mod-Alt-g",
				run: () => {
					this.toggleGutters();
					return true;
				},
			},
			{
				key: "Mod-Alt-l",
				run: () => {
					this.toggleLineNumbers();
					return true;
				},
			},
			{
				key: "Mod-Alt-f",
				run: (view) => {
					openSearchPanel(view);
					return true;
				},
			},
			{
				key: "Mod-g",
				run: (view) => {
					gotoLine(view);
					return true;
				},
			},
			{
				key: "Mod-Alt-c",
				run: (view) => {
					toggleLineComment(view);
					return true;
				},
			},
			{
				key: "Mod-Alt-b",
				run: (view) => {
					toggleBlockComment(view);
					return true;
				},
			},
			{
				key: "F1",
				run: () => {
					this.toolbar = !this.toolbar;
					return true;
				},
			},
			{
				key: "Mod-Shift-p",
				run: (view) => {
					view.focus();
					this.toggleKeyboardDropdown();
					return true;
				},
			},
		]);

		const extensions: Extension[] = [
			this.commentCompartment.of(this.commentExtension()),
			customKeymap,
			keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
			history(),
			highlightActiveLine(),
			...(this.panelContainer === null
				? []
				: [
						panels({
							topContainer: this.panelContainer,
							bottomContainer: this.panelContainer,
						}),
					]),
			showPanel.of(() => ({
				dom: this.ensureActionPanel(),
				top: true,
			})),
			tpCodeEditorTheme,
			tpCodeEditorHighlightStyle,
			EditorView.editorAttributes.of({
				dir: "ltr",
			}),

			EditorView.contentAttributes.of({
				"aria-label": this.getAttribute("aria-label")?.trim() || "Code editor",
				dir: "ltr",
				spellcheck: "false",
			}),

			EditorView.updateListener.of((update) => {
				if (update.docChanged || update.selectionSet) {
					this.syncCursorPosition();
				}

				if (!update.docChanged) {
					return;
				}

				this.currentValue = update.state.doc.toString();
				this.scheduleSyncHeight();

				if (this.isApplyingExternalValue) {
					return;
				}

				this.dispatchEvent(
					new CustomEvent("tp-code-editor-input", {
						bubbles: true,
						detail: {
							filename: this.currentFilename,
							value: this.currentValue,
						},
					}),
				);

				this.dispatchEvent(
					new CustomEvent("tp-code-editor-change", {
						bubbles: true,
						detail: {
							filename: this.currentFilename,
							value: this.currentValue,
						},
					}),
				);
			}),
		];

		if (this.placeholder !== "") {
			extensions.push(placeholder(this.placeholder));
		}

		switch (this.currentLanguage) {
			case "abc":
				extensions.push(abcLanguage);
				extensions.push(abcBaseTheme);
				break;
			case "asciidoc":
				extensions.push(asciidocLanguage);
				extensions.push(asciidocHighlightStyle);
				break;
			case "json":
				extensions.push(json());
				break;
			case "javascript":
				extensions.push(javascript());
				break;
			case "typescript":
				extensions.push(javascript({ typescript: true }));
				break;
			case "css":
				extensions.push(css());
				break;
			case "python":
				extensions.push(python());
				break;
			case "markdown":
				extensions.push(markdown());
				extensions.push(tpMarkdownSyntaxPlugin);
				extensions.push(tpMarkdownSyntaxTheme);
				break;
			case "html":
				extensions.push(html());
				break;
			case "sql":
				extensions.push(sql());
				extensions.push(autocompletion({ override: [sqlCompletion] }));
				break;
			case "prolog":
				extensions.push(prologLanguage);
				break;
			case "restructuredtext":
				extensions.push(restructuredTextLanguage);
				extensions.push(rstSectionTitlePlugin);
				extensions.push(rstHighlightStyle);
				extensions.push(rstBaseTheme);
				break;
		}

		if (this.readonly) {
			extensions.push(EditorView.editable.of(false));
		}

		if (this.lineNumbers) {
			extensions.push(lineNumbers());
		}

		if (this.foldGutter) {
			extensions.push(foldGutter());
		}

		if (this.wordWrap) {
			extensions.push(EditorView.lineWrapping);
		}

		return extensions;
	}

	/**
	 * Ajuste la hauteur visible du composant à la hauteur réelle du contenu.
	 *
	 * @summary Synchronise la hauteur visible du composant avec le contenu édité.
	 * @internal
	 */
	private syncHeight(): void {
		if (this.container === null) {
			return;
		}

		const editorRoot = this.container.querySelector(".cm-editor");

		if (!(editorRoot instanceof HTMLElement)) {
			return;
		}

		const content = this.container.querySelector(".cm-content");
		const firstLine = this.container.querySelector(".cm-line");
		const lineHeight =
			firstLine instanceof HTMLElement
				? Math.max(
						Math.ceil(
							Number.parseFloat(getComputedStyle(firstLine).lineHeight) || 20,
						),
						20,
					)
				: 20;

		let paddingTop = 0;
		let paddingBottom = 0;

		if (content instanceof HTMLElement) {
			const styles = getComputedStyle(content);
			paddingTop = Number.parseFloat(styles.paddingTop) || 0;
			paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
		}

		const minHeight = Math.ceil(2 * lineHeight + paddingTop + paddingBottom);
		const codeHeight = Math.max(this.getContentHeight(), minHeight);

		let panelHeight = 0;
		if (this.panelContainer instanceof HTMLElement) {
			const rect = this.panelContainer.getBoundingClientRect();
			const styles = getComputedStyle(this.panelContainer);
			const marginTop = Number.parseFloat(styles.marginTop) || 0;
			const marginBottom = Number.parseFloat(styles.marginBottom) || 0;
			panelHeight = Math.ceil(rect.height + marginTop + marginBottom);
		}

		const hostStyles = getComputedStyle(this);
		const borderHeight =
			(Number.parseFloat(hostStyles.borderBlockStartWidth) || 0) +
			(Number.parseFloat(hostStyles.borderBlockEndWidth) || 0);

		this.container.style.blockSize = `${String(Math.ceil(codeHeight))}px`;
		this.style.blockSize = `${String(Math.ceil(codeHeight + panelHeight + borderHeight))}px`;
		editorRoot.style.blockSize = "100%";
	}

	/**
	 * Programme plusieurs resynchronisations de hauteur après le layout.
	 *
	 * CodeMirror finalise parfois sa géométrie après la mise à jour du DOM.
	 *
	 * @summary Rejoue la synchronisation de hauteur après layout.
	 * @internal
	 */
	private scheduleSyncHeight(): void {
		this.syncHeight();

		this.editor?.requestMeasure({
			read: () => undefined,
			write: () => {
				this.syncHeight();
			},
		});

		queueMicrotask(() => {
			this.syncHeight();
		});

		requestAnimationFrame(() => {
			this.syncHeight();
			requestAnimationFrame(() => {
				this.editor?.requestMeasure();
				this.syncHeight();
			});
		});

		setTimeout(() => {
			this.syncHeight();
		}, 0);
	}

	/**
	 * Crée ou réutilise le panel d'actions interne.
	 *
	 * @summary Crée ou réutilise le panel d'interface.
	 * @internal
	 */
	private ensureActionPanel(): HTMLDivElement {
		const { mod, shift, alt } = this.getShortcutLabels();
		this.querySelector(":scope > [data-tp-code-editor-overlay]")?.remove();

		let panel = this.actionPanelEl;

		if (!(panel instanceof HTMLDivElement)) {
			panel = document.createElement("div");
			panel.classList.add("cm-panel");
			panel.setAttribute("data-tp-code-editor-action-panel", "");
			this.actionPanelEl = panel;
		}

		const startSection = this.ensureActionPanelSection(panel, "start");
		const centerSection = this.ensureActionPanelSection(panel, "center");
		const endSection = this.ensureActionPanelSection(panel, "end");

		let badge = panel.querySelector(
			"tp-badge[data-tp-code-editor-language-badge]",
		);

		if (!(badge instanceof HTMLElement)) {
			badge = document.createElement("tp-badge");
			badge.setAttribute("data-tp-code-editor-language-badge", "");
		}

		if (badge instanceof HTMLElement) {
			badge.setAttribute("size", "xs");
			badge.setAttribute("outlined", "");
			startSection.append(badge);
		}

		this.languageBadgeEl =
			badge instanceof HTMLElement ? (badge as TpBadge) : null;

		let cursorPosition = panel.querySelector<HTMLSpanElement>(
			"[data-tp-code-editor-cursor-position]",
		);

		if (!(cursorPosition instanceof HTMLSpanElement)) {
			cursorPosition = document.createElement("span");
			cursorPosition.setAttribute("data-tp-code-editor-cursor-position", "");
		}

		startSection.append(cursorPosition);
		this.cursorPositionEl = cursorPosition;

		let copy = panel.querySelector("tp-copy-code[data-tp-code-editor-copy]");

		if (!(copy instanceof HTMLElement)) {
			copy = document.createElement("tp-copy-code");
			copy.setAttribute("data-tp-code-editor-copy", "");
		}

		if (copy instanceof HTMLElement) {
			copy.setAttribute("size", "xs");
			(
				copy as HTMLElement & {
					forElement?: HTMLElement | null;
				}
			).forElement = this;
		}

		let theme = panel.querySelector("tp-theme[data-tp-code-editor-theme]");

		if (!(theme instanceof HTMLElement)) {
			theme = document.createElement("tp-theme");
			theme.setAttribute("data-tp-code-editor-theme", "");
			if (this.classList.contains("tp-dark")) {
				theme.setAttribute("mode", "dark");
			} else if (this.classList.contains("tp-light")) {
				theme.setAttribute("mode", "light");
			}
		}

		if (theme instanceof HTMLElement) {
			if (!theme.hasAttribute("mode")) {
				if (this.classList.contains("tp-dark")) {
					theme.setAttribute("mode", "dark");
				} else if (this.classList.contains("tp-light")) {
					theme.setAttribute("mode", "light");
				}
			}
			theme.setAttribute("anchor", `#${this.ensureThemeTargetId()}`);
			this.syncThemeDropdownPlacement(theme);
		}

		let fullscreen = panel.querySelector(
			"tp-fullscreen[data-tp-code-editor-fullscreen]",
		);

		if (!(fullscreen instanceof HTMLElement)) {
			fullscreen = document.createElement("tp-fullscreen");
			fullscreen.setAttribute("data-tp-code-editor-fullscreen", "");
		}

		if (fullscreen instanceof HTMLElement) {
			fullscreen.setAttribute("anchor", `#${this.ensureThemeTargetId()}`);
		}

		// --- Bouton clavier (TpButton) ---
		let keyboardButton = panel.querySelector(
			"[data-tp-code-editor-keyboard-button]",
		) as TpIconButton | null;

		if (!(keyboardButton instanceof HTMLElement)) {
			const button = document.createElement("tp-icon-button") as TpIconButton;

			button.id = this.keyboardId;
			button.setAttribute("data-tp-code-editor-keyboard-button", "");
			button.setAttribute("name", "keyboard-outline");
			button.setAttribute("size", "xs");
			button.setAttribute("label", "Keyboard shortcuts");

			panel.append(button);

			keyboardButton = button;
		}

		if (keyboardButton instanceof HTMLElement) {
			keyboardButton.setAttribute("size", "xs");
		}

		if (keyboardButton instanceof HTMLElement) {
			endSection.append(keyboardButton);
		}
		if (copy instanceof HTMLElement) {
			endSection.append(copy);
		}
		if (theme instanceof HTMLElement) {
			endSection.append(theme);
		}
		if (fullscreen instanceof HTMLElement) {
			endSection.append(fullscreen);
		}

		if (centerSection.childElementCount === 0) {
			centerSection.replaceChildren();
		}

		// --- Dropdown clavier ---
		this.querySelector(
			":scope > [data-tp-code-editor-keyboard-dropdown]",
		)?.remove();
		panel
			.querySelector(":scope > [data-tp-code-editor-keyboard-dropdown]")
			?.remove();
		let keyboardDropdown = this.keyboardDropdownEl;

		if (
			!(keyboardDropdown instanceof TpDropdown) ||
			!keyboardDropdown.isConnected
		) {
			const dropdown = document.createElement("tp-dropdown") as TpDropdown;

			dropdown.setAttribute("data-tp-code-editor-keyboard-dropdown", "");
			dropdown.setAttribute("data-tp-dropdown-align", "end");
			dropdown.setAttribute("anchor", `#${keyboardButton.id}`);
			dropdown.setAttribute("placement", "bottom");
			dropdown.setAttribute("outside-click", "");

			dropdown.innerHTML = `
      <ul>
        <li data-tp-code-editor-keyboard-action="undo">
          <span>Undo</span><kbd>${mod} Z</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="redo">
          <span>Redo</span><kbd>${mod} ${shift} Z</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="copy">
          <span>Copy</span><kbd>${mod} C</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="cut">
          <span>Cut</span><kbd>${mod} X</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="paste">
          <span>Paste</span><kbd>${mod} V</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="select-all">
          <span>Select all</span><kbd>${mod} A</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="fold-code">
          <span>Fold code</span><kbd>${mod} ${alt} ↓</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="unfold-code">
          <span>Unfold code</span><kbd>${mod} ${alt} ↑</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="toggle-gutters">
          <span>Toggle gutters</span><kbd>${mod} ${alt} G</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="toggle-line-numbers">
          <span>Toggle line numbers</span><kbd>${mod} ${alt} L</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="indent">
          <span>Indent</span><kbd>Tab</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="dedent">
          <span>Dedent</span><kbd>${shift} Tab</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="search">
          <span>Search</span><kbd>${mod} F</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="replace">
          <span>Replace</span><kbd>${mod} ${alt} F</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="goto-line">
          <span>Go to line</span><kbd>${mod} G</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-keyboard-action="toggle-line-comment">
          <span>Toggle line comment</span><kbd>${mod} ${alt} C</kbd>
        </li>
        <li data-tp-code-editor-keyboard-action="toggle-block-comment">
          <span>Toggle block comment</span><kbd>${mod} ${alt} B</kbd>
        </li>

        <li aria-disabled="true" data-tp-dropdown-divider></li>

        <li data-tp-code-editor-command-palette-hint data-tp-code-editor-keyboard-action="toggle-command-palette">
          <span>Toggle Command Palette</span><kbd>${mod} ${shift} P</kbd>
        </li>

        <li data-tp-code-editor-keyboard-action="toggle-toolbar">
          <span>Toggle toolbar</span><kbd>F1</kbd>
        </li>

      </ul>
    `;

			document.body.append(dropdown);
			keyboardDropdown = dropdown;
		}

		if (keyboardDropdown.parentElement !== document.body) {
			document.body.append(keyboardDropdown);
		}

		keyboardDropdown.setAttribute("anchor", `#${keyboardButton.id}`);
		keyboardDropdown.setAttribute("placement", "bottom");
		keyboardDropdown.setAttribute("data-tp-dropdown-align", "end");
		keyboardDropdown.setAttribute("outside-click", "");

		// --- Comportement ---
		keyboardButton.onclick = (event) => {
			event.preventDefault();
			event.stopPropagation();

			keyboardDropdown.toggle();
		};

		keyboardDropdown.removeEventListener(
			"click",
			this.handleKeyboardDropdownClick,
		);
		keyboardDropdown.addEventListener(
			"click",
			this.handleKeyboardDropdownClick,
		);
		keyboardDropdown.removeEventListener(
			"tp-dropdown-toggle",
			this.handleKeyboardDropdownToggle,
		);
		keyboardDropdown.addEventListener(
			"tp-dropdown-toggle",
			this.handleKeyboardDropdownToggle,
		);
		keyboardDropdown.style.setProperty("-webkit-overflow-scrolling", "touch");

		// --- Sync ---
		this.keyboardDropdownEl = keyboardDropdown;

		return panel;
	}

	private ensureActionPanelSection(
		panel: HTMLElement,
		section: "start" | "center" | "end",
	): HTMLElement {
		let sectionElement = panel.querySelector<HTMLElement>(
			`:scope > [data-tp-code-editor-action-section="${section}"]`,
		);

		if (!(sectionElement instanceof HTMLElement)) {
			sectionElement = document.createElement("div");
			sectionElement.setAttribute(
				"data-tp-code-editor-action-section",
				section,
			);
			panel.append(sectionElement);
		}

		return sectionElement;
	}

	private syncThemeDropdownPlacement(theme: HTMLElement): void {
		const sync = (): void => {
			const dropdown = theme.querySelector(":scope > tp-dropdown");
			if (dropdown instanceof HTMLElement) {
				dropdown.setAttribute("placement", "start");
			}
		};

		sync();
		setTimeout(sync, 0);
	}

	private ensureThemeTargetId(): string {
		if (this.id !== "") {
			return this.id;
		}

		this.id = this.generatedThemeTargetId;
		return this.id;
	}

	/**
	 * Synchronise le contenu du panel d'actions interne.
	 *
	 * @summary Synchronise le badge et le bouton de copie.
	 * @internal
	 */
	private syncActionPanel(): void {
		this.ensureActionPanel();

		if (this.languageBadgeEl instanceof HTMLElement) {
			this.languageBadgeEl.textContent = this.currentLanguage;
		}

		this.syncCursorPosition();

		// this.ensureCopyTarget();
	}

	private syncCursorPosition(): void {
		if (
			!(this.cursorPositionEl instanceof HTMLElement) ||
			this.editor === null
		) {
			return;
		}

		const selection = this.editor.state.selection.main;
		const line = this.editor.state.doc.lineAt(selection.head);
		const column = selection.head - line.from + 1;

		this.cursorPositionEl.textContent = `Ln ${String(line.number)}, Col ${String(column)}`;
		this.cursorPositionEl.setAttribute(
			"aria-label",
			`Line ${String(line.number)}, column ${String(column)}`,
		);
	}

	/**
	 * Garantit l’existence du conteneur DOM interne.
	 *
	 * @summary Crée ou réutilise le conteneur de l’éditeur.
	 * @internal
	 */
	private ensureContainer(): void {
		const existing = this.querySelector(":scope > [data-tp-code-editor]");
		const existingPanelContainer = this.querySelector(
			":scope > [data-tp-code-editor-panels]",
		);

		if (existing instanceof HTMLDivElement) {
			this.container = existing;
		} else {
			const container = document.createElement("div");
			container.setAttribute("data-tp-code-editor", "");
			this.append(container);
			this.container = container;
		}

		if (existingPanelContainer instanceof HTMLDivElement) {
			this.panelContainer = existingPanelContainer;
		} else {
			const panelContainer = document.createElement("div");
			panelContainer.setAttribute("data-tp-code-editor-panels", "");
			this.insertBefore(panelContainer, this.container);
			this.panelContainer = panelContainer;
		}

		if (
			this.panelContainer instanceof HTMLDivElement &&
			this.container instanceof HTMLDivElement &&
			this.panelContainer.nextElementSibling !== this.container
		) {
			this.insertBefore(this.panelContainer, this.container);
		}

		if (this.panelContainer === null) {
			this.sourceErrorElement = null;
			return;
		}

		const existingSourceError = this.panelContainer.querySelector(
			":scope > [data-tp-code-editor-source-error]",
		);

		if (existingSourceError instanceof HTMLDivElement) {
			this.sourceErrorElement = existingSourceError;
			return;
		}

		const sourceError = document.createElement("div");
		sourceError.setAttribute("data-tp-code-editor-source-error", "");
		sourceError.setAttribute("role", "alert");
		sourceError.hidden = true;
		this.panelContainer.append(sourceError);
		this.sourceErrorElement = sourceError;
	}

	private startPanelObserver(): void {
		if (
			typeof MutationObserver === "undefined" ||
			this.panelContainer === null
		) {
			return;
		}

		this.panelObserver?.disconnect();
		this.panelObserver = new MutationObserver(() => {
			this.scheduleSyncHeight();
		});
		this.panelObserver.observe(this.panelContainer, {
			childList: true,
			subtree: true,
		});
	}

	/**
	 * Re-measures CodeMirror when a hidden tab/viewer becomes visible or when
	 * its available inline size changes.
	 */
	private startLayoutObserver(): void {
		if (typeof ResizeObserver === "undefined" || this.container === null) {
			return;
		}

		this.layoutObserver?.disconnect();
		this.layoutObserver = new ResizeObserver((entries) => {
			const inlineSize = Math.ceil(entries[0]?.contentRect.width ?? 0);
			if (inlineSize === this.observedInlineSize) {
				return;
			}

			this.observedInlineSize = inlineSize;
			this.editor?.requestMeasure();
			this.scheduleSyncHeight();
		});
		this.layoutObserver.observe(this.container);
	}

	/**
	 * Injecte la feuille de styles du composant dans `document.head`
	 * si elle n’existe pas encore.
	 *
	 * @summary Injecte la feuille de styles globale du composant.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpCodeEditor.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpCodeEditor.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	private readExplicitLanguage(): string | undefined {
		const value = this.getAttribute("language");
		if (value === null) {
			return undefined;
		}

		const normalized = value.trim().toLowerCase();
		return normalized === "" ? undefined : normalized;
	}

	/**
	 * Émet un événement d’erreur standardisé.
	 *
	 * @summary Émet l’événement `tp-code-editor-error`.
	 * @param message Message d’erreur.
	 * @internal
	 */
	private dispatchErrorEvent(message: string): void {
		this.dispatchEvent(
			new CustomEvent("tp-code-editor-error", {
				bubbles: true,
				detail: {
					message,
				},
			}),
		);
	}

	private showInlineSourceError(message: string): void {
		if (!(this.sourceErrorElement instanceof HTMLDivElement)) {
			return;
		}

		this.sourceErrorElement.textContent = message;
		this.sourceErrorElement.hidden = false;
		this.scheduleSyncHeight();
	}

	private clearInlineSourceError(): void {
		if (!(this.sourceErrorElement instanceof HTMLDivElement)) {
			return;
		}

		if (this.sourceErrorElement.hidden) {
			return;
		}

		this.sourceErrorElement.textContent = "";
		this.sourceErrorElement.hidden = true;
		this.scheduleSyncHeight();
	}
}

if (!customElements.get("tp-code-editor")) {
	customElements.define("tp-code-editor", TpCodeEditor);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-code-editor": TpCodeEditor;
	}
}
