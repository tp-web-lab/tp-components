/** @module components/code-editor/code-comment-markers */
import { syntaxTree } from "@codemirror/language";
import type { EditorState, Extension } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
	ViewPlugin,
	type ViewUpdate,
	WidgetType,
} from "@codemirror/view";
import "../tooltip/tooltip.js";

/** Stable identities for tooltip anchors, independent of editable source offsets. */
let nextCommentAnchor = 0;
/** Cleanup belongs to the DOM, which CodeMirror may reuse with an equal widget. */
const tooltipCleanups = new WeakMap<HTMLElement, () => void>();

/** Clones author formatting without generated numbering or duplicate document IDs. */
function tooltipContent(source: HTMLElement, prefix: string): HTMLElement {
	const content = source.ownerDocument.createElement("div");
	for (const child of source.childNodes) content.append(child.cloneNode(true));
	for (const generated of content.querySelectorAll(
		"[data-code-comment-number], script",
	))
		generated.remove();
	const ids = new Map<string, string>();
	for (const element of content.querySelectorAll("[id]")) {
		const previous = element.id;
		element.id = `${prefix}-${ids.size}`;
		ids.set(previous, element.id);
	}
	for (const element of content.querySelectorAll("*")) {
		for (const attribute of Array.from(element.attributes)) {
			let value = attribute.value;
			for (const [previous, next] of ids) {
				value = value.replaceAll(`url(#${previous})`, `url(#${next})`);
				if (
					(attribute.name === "href" || attribute.name === "xlink:href") &&
					value === `#${previous}`
				)
					value = `#${next}`;
				if (["aria-labelledby", "aria-describedby"].includes(attribute.name))
					value = value
						.split(/\s+/)
						.map((id) => (id === previous ? next : id))
						.join(" ");
			}
			if (value !== attribute.value)
				element.setAttribute(attribute.name, value);
		}
	}
	return content;
}

/** One numbered marker located inside a parsed language comment. */
export interface CodeCommentMarker {
	/** Inclusive document offset. */
	from: number;
	/** Exclusive document offset. */
	to: number;
	/** One-based annotation number. */
	number: number;
}

/** Finds explicit markers in comments without treating strings or code as annotations. */
export function findCodeCommentMarkers(
	state: EditorState,
	numbers: ReadonlySet<number>,
): CodeCommentMarker[] {
	const markers: CodeCommentMarker[] = [];
	syntaxTree(state).iterate({
		enter(node) {
			if (!/comment/i.test(node.name)) return;
			const text = state.sliceDoc(node.from, node.to);
			for (const match of text.matchAll(/<([1-9]\d?)>/g)) {
				const number = Number(match[1]);
				if (numbers.has(number))
					markers.push({
						from: node.from + match.index,
						to: node.from + match.index + match[0].length,
						number,
					});
			}
			return false;
		},
	});
	return markers;
}

/** Visual replacement only: the underlying source and clipboard remain unchanged. */
class CommentNumberWidget extends WidgetType {
	/** Keeps the icon identity stable between editor updates. */
	public constructor(
		private readonly number: number,
		private readonly source?: HTMLElement,
	) {
		super();
	}
	/** Reuses DOM when a marker has not changed. */
	public override eq(other: CommentNumberWidget): boolean {
		return other.number === this.number && other.source === this.source;
	}
	/** Reuses the library's numbered SVG icons and supplies an accessible name. */
	public toDOM(view: EditorView): HTMLElement {
		const marker = view.dom.ownerDocument.createElement("span");
		marker.className = "tp-code-comment-marker";
		marker.setAttribute("role", "img");
		marker.setAttribute("aria-label", `Comment ${this.number}`);
		const icon = view.dom.ownerDocument.createElement("tp-icon");
		icon.setAttribute("library", "numbers");
		icon.setAttribute("name", String(this.number));
		icon.setAttribute("size", "1.25em");
		icon.setAttribute("aria-hidden", "true");
		marker.append(icon);
		const source = this.source;
		if (source) {
			marker.id = `tp-code-comment-anchor-${++nextCommentAnchor}`;
			marker.tabIndex = 0;
			marker.setAttribute("contenteditable", "false");
			const tooltip = marker.ownerDocument.createElement("tp-tooltip");
			tooltip.setAttribute("anchor", `#${marker.id}`);
			tooltip.setAttribute("data-tp-code-comment-tooltip", "");
			const update = (): void =>
				tooltip.replaceChildren(tooltipContent(source, `${marker.id}-content`));
			update();
			const observer = new MutationObserver(update);
			observer.observe(source, {
				childList: true,
				subtree: true,
				characterData: true,
				attributes: true,
			});
			tooltipCleanups.set(marker, () => {
				observer.disconnect();
				tooltip.remove();
			});
			queueMicrotask(() => {
				if (marker.isConnected && tooltipCleanups.has(marker))
					marker.ownerDocument.body.append(tooltip);
			});
		}
		return marker;
	}
	/** Releases the portalled tooltip and its author-content observer. */
	public override destroy(dom: HTMLElement): void {
		tooltipCleanups.get(dom)?.();
		tooltipCleanups.delete(dom);
	}
}

/** Adds live SVG decorations for the annotation numbers supplied by linked lists. */
export function codeCommentMarkers(
	numbers: ReadonlySet<number>,
	comments: ReadonlyMap<number, HTMLElement> = new Map(),
): Extension {
	/** Builds sorted, nonoverlapping replacements from the current syntax tree. */
	const build = (view: EditorView): DecorationSet =>
		Decoration.set(
			findCodeCommentMarkers(view.state, numbers).map((marker) =>
				Decoration.replace({
					widget: new CommentNumberWidget(
						marker.number,
						comments.get(marker.number),
					),
				}).range(marker.from, marker.to),
			),
			true,
		);
	return ViewPlugin.fromClass(
		class {
			/** Decorations currently installed in CodeMirror. */
			public decorations: DecorationSet;
			/** Initializes annotations for the current source. */
			public constructor(view: EditorView) {
				this.decorations = build(view);
			}
			/** Follows edits, language parsing and viewport changes. */
			public update(update: ViewUpdate): void {
				if (
					update.docChanged ||
					update.viewportChanged ||
					syntaxTree(update.startState) !== syntaxTree(update.state)
				)
					this.decorations = build(update.view);
			}
		},
		{ decorations: (plugin) => plugin.decorations },
	);
}
