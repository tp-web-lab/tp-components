/**
 * @module components/object-tree
 * @summary Specialized tree for inspecting JavaScript values.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-tree
 * @summary Generic tree component for interactive hierarchical editing.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./object-tree.css?inline";
import "../tree/tree.js";

import type {
	TpTree,
	TpTreeContextActionDetail,
	TpTreeContextMenuConfig,
} from "../tree/tree.js";

/**
 * Logical kind of an inspectable value.
 *
 * @summary Represents the kind of a displayed value.
 */
export type TpInspectableValueKind =
	| "string"
	| "number"
	| "boolean"
	| "null"
	| "undefined"
	| "function"
	| "date"
	| "error"
	| "circular"
	| "array"
	| "object";

/**
 * Logical node in an inspectable value tree.
 *
 * @summary Represents a value normalized for display.
 */
export interface TpInspectableNode {
	/**
	 * Stable logical identifier of the node.
	 */
	id: string;

	/**
	 * Kind of the represented value.
	 */
	kind: TpInspectableValueKind;

	/**
	 * Optional key within the parent value.
	 */
	key?: string;

	/**
	 * Human-readable summary of the value.
	 */
	summary: string;

	/**
	 * Child nodes, when the value is structured.
	 */
	children: TpInspectableNode[];
}

/**
 * Detail emitted after a declarative object-tree source has loaded.
 *
 * @summary Describes a successful declarative value load.
 */
export interface TpObjectTreeLoadDetail {
	/** Source mechanism used to resolve the value. */
	source: "script" | "src";
	/** External URL, or an empty string for an inline script. */
	src: string;
	/** JavaScript value passed to the tree. */
	value: unknown;
}

/**
 * Detail emitted when a declarative object-tree source cannot be loaded.
 *
 * @summary Describes a declarative value loading error.
 */
export interface TpObjectTreeErrorDetail {
	/** Human-readable error message. */
	message: string;
	/** Source mechanism that failed. */
	source: "script" | "src";
	/** External URL, or an empty string for an inline script. */
	src: string;
}

/**
 * Checks whether a value is a non-null object.
 *
 * @summary Checks whether a value is object-like.
 * @param value Value to test.
 * @returns `true` when the value is a non-null object.
 * @internal
 */
function isObjectLike(value: unknown): value is object {
	return typeof value === "object" && value !== null;
}

/**
 * Checks whether a value is callable.
 *
 * @summary Provides a type guard for JavaScript functions.
 * @param value Value to test.
 * @returns `true` when the value is a function.
 * @internal
 */
function isCallable(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

/**
 * Returns the display name of a function.
 *
 * @summary Resolves a function display name.
 * @param value Source function.
 * @returns Display name, or `(anonymous)` when no name is available.
 * @internal
 */
function getFunctionDisplayName(
	value: (...args: unknown[]) => unknown,
): string {
	return value.name !== "" ? value.name : "(anonymous)";
}

/**
 * Returns a compact summary for a primitive value.
 *
 * @summary Produces a compact primitive value summary.
 * @param value Source value.
 * @returns Textual summary.
 * @internal
 */
function formatPrimitiveSummary(value: unknown): string {
	if (value === null) {
		return "null";
	}

	if (value === undefined) {
		return "undefined";
	}

	if (typeof value === "string") {
		return `"${value}"`;
	}

	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	if (typeof value === "bigint") {
		return `${String(value)}n`;
	}

	return String(value);
}

/**
 * Compares two inspectable nodes for stable sorting.
 *
 * Defined keys are sorted alphabetically. The summary is used as a fallback
 * for nodes without a key.
 *
 * @summary Compares two inspectable nodes.
 * @param left Left-hand node.
 * @param right Right-hand node.
 * @returns Standard comparison value.
 * @internal
 */
function compareInspectableNodes(
	left: TpInspectableNode,
	right: TpInspectableNode,
): number {
	const leftKey = left.key ?? "";
	const rightKey = right.key ?? "";

	if (leftKey !== "" || rightKey !== "") {
		const result = leftKey.localeCompare(rightKey, undefined, {
			sensitivity: "base",
			numeric: true,
		});

		if (result !== 0) {
			return result;
		}
	}

	return left.summary.localeCompare(right.summary, undefined, {
		sensitivity: "base",
		numeric: true,
	});
}

/**
 * Returns a recursively sorted copy of an inspectable node.
 *
 * @summary Recursively sorts an inspectable tree.
 * @param node Source node.
 * @returns Sorted node copy.
 * @internal
 */
function sortInspectableNode(node: TpInspectableNode): TpInspectableNode {
	const sortedChildren = node.children
		.map((child) => sortInspectableNode(child))
		.sort(compareInspectableNodes);

	return {
		...node,
		children: sortedChildren,
	};
}

/**
 * Global context-menu configuration for `<tp-object-tree>`.
 *
 * @summary Defines the object tree global actions.
 * @internal
 */
const OBJECT_TREE_CONTEXT_MENU_CONFIG: TpTreeContextMenuConfig = {
	globalActions: [
		{ id: "expand-all", label: "Expand all" },
		{ id: "collapse-all", label: "Collapse all" },
		{ id: "sort-all", label: "Sort all" },
		{ id: "toggle-guides", label: "Toggle guides" },
	],
	getNodeActions: () => [],
};

/**
 * `<tp-object-tree>` inspects a JavaScript value and renders it as a tree.
 *
 * This component is a specialized wrapper around `<tp-tree>`:
 * - it converts an arbitrary JavaScript value into a tree structure
 * - it delegates rendering and interaction to `<tp-tree>`
 * - it exposes only global context-menu actions, with no per-node actions
 *
 * Unlike `<tp-tree>`, this component is **read-only**:
 * - structural changes such as add, delete, rename, and drag and drop are disabled
 * - only navigation and visualization actions are available
 *
 * ---
 *
 * ## Processing
 *
 * 1. `setValue(value)` converts the value into a tree of `TpInspectableNode` objects
 * 2. the tree is rendered as `<ul>/<li>` elements in the light DOM
 * 3. `<tp-tree>` enhances that DOM with expansion, selection, and global actions
 *
 * ---
 *
 * ## Context menu
 *
 * The context menu is **global only** and is available by right-clicking the tree:
 *
 * - Expand all
 * - Collapse all
 * - Sort all
 * - Toggle guides
 *
 * Individual nodes do not expose contextual actions.
 *
 * ---
 *
 * ## Value kinds
 *
 * JavaScript values are converted into typed nodes (`TpInspectableValueKind`):
 *
 * - primitives: string, number, boolean, null, undefined
 * - structures: object, array
 * - special values: function, date, error, circular reference
 *
 * ---
 *
 * @summary Specialized tree for inspecting JavaScript values.
 * @tagname tp-object-tree
 *
 * @attr {string} src = "" - URL of an external JSON file to inspect.
 *
 * @event tp-object-tree-error Emitted when an external JSON file or inline JavaScript expression cannot be loaded.
 * @event tp-object-tree-load Emitted after an external JSON file or inline JavaScript expression has been loaded.
 * @eventdetail tp-object-tree-error { message: string; source: "script" | "src"; src: string }
 * @eventdetail tp-object-tree-load { source: "script" | "src"; src: string; value: unknown }
 * @event tp-tree-context-action Emitted when the user triggers a global tree action.
 *
 * @cssprop [--tp-object-tree-font-size=0.875rem] Controls the tree text size consistently across rendering contexts.
 * @cssprop [--tp-tree-*] Inherits the CSS custom properties exposed by `<tp-tree>`.
 * @example
 * <tp-object-tree>
 *       <script type="tp/javascript">
 *         ({
 *           course: {
 *             title: 'Web components',
 *             lessons: 12,
 *             published: true
 *           },
 *           topics: ['HTML', 'CSS', 'JavaScript']
 *         })
 *       </script>
 *     </tp-object-tree>
 */
export class TpObjectTree extends TpBase {
	private static readonly styleId = "tp-object-tree-styles";

	/**
	 * Root logical node currently being rendered.
	 *
	 * @summary Stores the inspected root node.
	 * @internal
	 */
	private rootNode: TpInspectableNode | null = null;

	/**
	 * Reference to the internal tree component.
	 *
	 * @summary Stores the internal `<tp-tree>` reference.
	 * @internal
	 */
	private treeEl: TpTree | null = null;

	/** Inline JavaScript source preserved before the light DOM is rebuilt. */
	private inlineScriptSource = "";

	/** Sequence number used to ignore stale asynchronous load results. */
	private loadSequence = 0;

	/**
	 * Names of attributes observed by the component.
	 *
	 * @summary Declares the observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["src"];
	}

	/** URL of the external JSON file to inspect. */
	public get src(): string {
		return this.getAttribute("src")?.trim() ?? "";
	}

	public set src(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("src");
			return;
		}

		this.setAttribute("src", value);
	}

	/**
	 * Initializes the component.
	 *
	 * The inline script is captured before rendering because `render()` rebuilds
	 * the component light DOM. The configured source is then loaded asynchronously.
	 *
	 * @summary Renders the initial tree and binds its events.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		const inlineScript = this.querySelector<HTMLScriptElement>(
			':scope > script[type="tp/javascript"]',
		);
		if (inlineScript !== null) {
			this.inlineScriptSource = inlineScript.textContent?.trim() ?? "";
		}
		this.ensureStyles();
		this.render();
		this.bindEvents();
		void this.loadConfiguredValue();
	}

	/**
	 * Responds to observed attribute changes.
	 *
	 * @internal
	 */
	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (!this.isConnected) {
			return;
		}

		if (name === "src" && oldValue !== newValue) {
			void this.loadConfiguredValue();
		}
	}

	/**
	 * Loads the value declared by `src` or by the direct inline JavaScript script.
	 *
	 * `src` takes precedence. Each invocation receives a sequence number so that
	 * a slower previous request cannot overwrite a more recently configured value.
	 *
	 * @summary Resolves and displays the configured declarative value.
	 * @internal
	 */
	private async loadConfiguredValue(): Promise<void> {
		const sequence = ++this.loadSequence;

		if (this.src !== "") {
			try {
				const response = await fetch(this.src);
				if (!response.ok) {
					throw new Error(
						`Unable to load "${this.src}" (${String(response.status)} ${response.statusText}).`,
					);
				}

				const value: unknown = await response.json();
				if (sequence !== this.loadSequence) return;
				this.setValue(value);
				this.dispatchLoadEvent("src", value);
			} catch (error: unknown) {
				if (sequence !== this.loadSequence) return;
				this.dispatchErrorEvent("src", error);
			}
			return;
		}

		if (this.inlineScriptSource === "") return;

		try {
			const evaluate = new Function(
				`"use strict"; return (\n${this.inlineScriptSource}\n);`,
			) as () => unknown;
			const value = evaluate();
			if (sequence !== this.loadSequence) return;
			this.setValue(value);
			this.dispatchLoadEvent("script", value);
		} catch (error: unknown) {
			if (sequence !== this.loadSequence) return;
			this.dispatchErrorEvent("script", error);
		}
	}

	/**
	 * Emits the event indicating that a declarative value was loaded.
	 *
	 * @param source Source used to obtain the value.
	 * @param value Loaded JavaScript value.
	 * @internal
	 */
	private dispatchLoadEvent(source: "script" | "src", value: unknown): void {
		this.dispatchEvent(
			new CustomEvent<TpObjectTreeLoadDetail>("tp-object-tree-load", {
				bubbles: true,
				detail: { source, src: source === "src" ? this.src : "", value },
			}),
		);
	}

	/**
	 * Emits a loading error without replacing the value currently displayed.
	 *
	 * @param source Source that failed.
	 * @param error Original loading or evaluation error.
	 * @internal
	 */
	private dispatchErrorEvent(source: "script" | "src", error: unknown): void {
		const message = error instanceof Error ? error.message : String(error);
		this.dispatchEvent(
			new CustomEvent<TpObjectTreeErrorDetail>("tp-object-tree-error", {
				bubbles: true,
				detail: { message, source, src: source === "src" ? this.src : "" },
			}),
		);
	}

	/**
	 * Sets the value to inspect.
	 *
	 * Existing output is replaced and the new tree is expanded initially.
	 *
	 * @summary Loads a new value into the tree.
	 * @param value Value to inspect.
	 */
	public setValue(value: unknown): void {
		this.rootNode = this.inspectValue(
			value,
			undefined,
			"$",
			new WeakSet<object>(),
		);
		this.render();
		this.bindEvents();
	}

	/**
	 * Expands every node in the tree.
	 *
	 * @summary Expands all nodes.
	 */
	public expandAll(): void {
		this.treeEl?.expandAll();
	}

	/**
	 * Collapses every node in the tree.
	 *
	 * @summary Collapses all nodes.
	 */
	public collapseAll(): void {
		this.treeEl?.collapseAll();
	}

	/**
	 * Recursively sorts all displayed nodes.
	 *
	 * @summary Sorts the current inspectable tree.
	 */
	public sortAll(): void {
		if (this.rootNode === null) {
			return;
		}

		this.rootNode = sortInspectableNode(this.rootNode);
		this.render();
		this.bindEvents();
		this.treeEl?.expandAll();
	}

	/**
	 * Injects the `<tp-object-tree>` stylesheet when needed.
	 *
	 * The stylesheet is added only once per document through a unique identifier,
	 * even when multiple component instances are present.
	 *
	 * This avoids duplicate rules while keeping the component in the light DOM
	 * without relying on Shadow DOM.
	 *
	 * @summary Injects the component CSS into the document.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpObjectTree.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpObjectTree.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	/**
	 * Binds internal events.
	 *
	 * @summary Subscribes to actions from the internal tree.
	 * @internal
	 */
	private bindEvents(): void {
		this.unbindEvents();

		this.treeEl?.addEventListener(
			"tp-tree-context-action",
			this.handleTreeContextAction as EventListener,
		);
	}

	/**
	 * Unbinds internal events.
	 *
	 * @summary Removes subscriptions from the internal tree.
	 * @internal
	 */
	private unbindEvents(): void {
		this.treeEl?.removeEventListener(
			"tp-tree-context-action",
			this.handleTreeContextAction as EventListener,
		);
	}

	/**
	 * Handles global context-menu actions.
	 *
	 * @summary Applies global tree commands.
	 * @param event Context action emitted by the internal tree.
	 * @internal
	 */
	private readonly handleTreeContextAction = (
		event: CustomEvent<TpTreeContextActionDetail>,
	): void => {
		if (event.detail.scope !== "global") {
			return;
		}

		switch (event.detail.actionId) {
			case "expand-all":
				this.expandAll();
				break;
			case "collapse-all":
				this.collapseAll();
				break;
			case "sort-all":
				this.sortAll();
				break;
			case "toggle-guides":
				this.treeEl?.toggleGuides();
				break;
			default:
				break;
		}
	};

	/**
	 * Converts an arbitrary value into an inspectable node.
	 *
	 * Circular references are detected through `seen` and represented by a
	 * terminal `circular` node instead of being traversed again.
	 *
	 * @summary Recursively inspects a JavaScript value.
	 * @param value Value to inspect.
	 * @param key Optional key within the parent.
	 * @param id Logical identifier assigned to the node.
	 * @param seen Objects already visited on the current inspection.
	 * @returns Normalized inspectable node.
	 * @internal
	 */
	private inspectValue(
		value: unknown,
		key: string | undefined,
		id: string,
		seen: WeakSet<object>,
	): TpInspectableNode {
		if (value === null) {
			return {
				id,
				kind: "null",
				key,
				summary: "null",
				children: [],
			};
		}

		if (value === undefined) {
			return {
				id,
				kind: "undefined",
				key,
				summary: "undefined",
				children: [],
			};
		}

		if (typeof value === "string") {
			return {
				id,
				kind: "string",
				key,
				summary: formatPrimitiveSummary(value),
				children: [],
			};
		}

		if (typeof value === "number") {
			return {
				id,
				kind: "number",
				key,
				summary: formatPrimitiveSummary(value),
				children: [],
			};
		}

		if (typeof value === "boolean") {
			return {
				id,
				kind: "boolean",
				key,
				summary: formatPrimitiveSummary(value),
				children: [],
			};
		}

		if (typeof value === "bigint") {
			return {
				id,
				kind: "number",
				key,
				summary: formatPrimitiveSummary(value),
				children: [],
			};
		}

		if (isCallable(value)) {
			return {
				id,
				kind: "function",
				key,
				summary: `Function(${getFunctionDisplayName(value)})`,
				children: [],
			};
		}

		if (value instanceof Date) {
			return {
				id,
				kind: "date",
				key,
				summary: `Date(${value.toISOString()})`,
				children: [],
			};
		}

		if (value instanceof Error) {
			const children: TpInspectableNode[] = [
				{
					id: `${id}.name`,
					kind: "string",
					key: "name",
					summary: `"${value.name}"`,
					children: [],
				},
				{
					id: `${id}.message`,
					kind: "string",
					key: "message",
					summary: `"${value.message}"`,
					children: [],
				},
			];

			if (typeof value.stack === "string" && value.stack !== "") {
				children.push({
					id: `${id}.stack`,
					kind: "string",
					key: "stack",
					summary: `"${value.stack}"`,
					children: [],
				});
			}

			return {
				id,
				kind: "error",
				key,
				summary: `${value.name}: ${value.message}`,
				children,
			};
		}

		if (!isObjectLike(value)) {
			return {
				id,
				kind: "string",
				key,
				summary: String(value),
				children: [],
			};
		}

		if (seen.has(value)) {
			return {
				id,
				kind: "circular",
				key,
				summary: "[Circular]",
				children: [],
			};
		}

		seen.add(value);

		if (Array.isArray(value)) {
			const children = value.map((item, index) =>
				this.inspectValue(item, String(index), `${id}[${String(index)}]`, seen),
			);

			return {
				id,
				kind: "array",
				key,
				summary: `Array(${value.length})`,
				children,
			};
		}

		const entries = Object.entries(value);
		const children = entries.map(([entryKey, entryValue]) =>
			this.inspectValue(entryValue, entryKey, `${id}.${entryKey}`, seen),
		);

		return {
			id,
			kind: "object",
			key,
			summary: `Object(${entries.length})`,
			children,
		};
	}

	/**
	 * Renders the complete component.
	 *
	 * The internal `<tp-tree>` is rebuilt from the normalized root node and all
	 * nodes are expanded after a value has been loaded.
	 *
	 * @summary Rebuilds the internal `<tp-tree>`.
	 * @internal
	 */
	private render(): void {
		this.unbindEvents();
		this.innerHTML = "";

		const tree = document.createElement("tp-tree") as TpTree;
		tree.setAttribute("guides", "");

		tree.setContextMenuConfig(OBJECT_TREE_CONTEXT_MENU_CONFIG);

		const ul = document.createElement("ul");

		if (this.rootNode !== null) {
			ul.append(this.renderNode(this.rootNode));
		}

		tree.append(ul);
		this.append(tree);

		this.treeEl = tree;
		this.bindEvents();

		if (this.rootNode !== null) {
			tree.expandAll();
		}
	}

	/**
	 * Renders an inspectable node as an `<li>` element.
	 *
	 * @summary Produces a DOM node for the tree.
	 * @param node Inspectable node to render.
	 * @returns Corresponding `<li>` element.
	 * @internal
	 */
	private renderNode(node: TpInspectableNode): HTMLLIElement {
		const li = document.createElement("li");
		li.setAttribute("data-node-id", node.id);
		li.setAttribute("data-kind", node.kind);

		if (typeof node.key === "string" && node.key !== "") {
			li.setAttribute("data-label", node.key);
		} else {
			li.setAttribute("data-label", node.summary);
		}

		const row = document.createElement("span");
		row.setAttribute("data-tp-object-tree-row", "");

		if (typeof node.key === "string") {
			const keyEl = document.createElement("span");
			keyEl.setAttribute("data-tp-object-tree-key", "");
			keyEl.textContent = node.key;

			const separatorEl = document.createElement("span");
			separatorEl.setAttribute("data-tp-object-tree-separator", "");
			separatorEl.textContent = ":";

			row.append(keyEl, separatorEl);
		}

		const summaryEl = document.createElement("span");
		summaryEl.setAttribute("data-tp-object-tree-summary", "");
		summaryEl.setAttribute("data-value-kind", node.kind);
		summaryEl.textContent = this.formatSummary(node);

		row.append(summaryEl);
		li.append(row);

		if (node.children.length > 0) {
			const ul = document.createElement("ul");

			for (const child of node.children) {
				ul.append(this.renderNode(child));
			}

			li.append(ul);
		}

		return li;
	}

	/**
	 * Formats the displayed summary of an inspectable node.
	 *
	 * This method applies small presentation adjustments based on the value kind:
	 *
	 * - `function`: prefixes the summary with `ƒ`
	 * - `date`: removes the `Date(...)` wrapper
	 * - `circular`: replaces the summary with the `↻ Circular` indicator
	 *
	 * Other kinds retain the representation stored in `summary`. The underlying
	 * inspected value and tree structure are never modified here.
	 *
	 * @summary Produces a display-ready node summary.
	 * @param node Inspectable node to format.
	 * @returns Formatted display text.
	 * @internal
	 */
	private formatSummary(node: TpInspectableNode): string {
		switch (node.kind) {
			case "string":
				return node.summary; // Strings are already quoted.

			case "number":
			case "boolean":
				return node.summary;

			case "null":
			case "undefined":
				return node.summary;

			case "function":
				return `ƒ ${node.summary.replace("Function", "")}`;

			case "date":
				return node.summary.replace("Date", "");

			case "error":
				return node.summary;

			case "array":
				return node.summary; // Array(n)

			case "object":
				return node.summary; // Object(n)

			case "circular":
				return "↻ Circular";

			default:
				return node.summary;
		}
	}
}

/**
 * Registers `<tp-object-tree>` unless it is already defined.
 *
 * The guard prevents duplicate-registration errors when the module is reloaded,
 * for example during Vite hot-module replacement.
 */
if (!customElements.get("tp-object-tree")) {
	customElements.define("tp-object-tree", TpObjectTree);
}

/**
 * Extends the DOM element map for TypeScript.
 *
 * Associates the `<tp-object-tree>` tag with `TpObjectTree` for typed DOM APIs
 * such as `createElement` and `querySelector`.
 */
declare global {
	interface HTMLElementTagNameMap {
		"tp-object-tree": TpObjectTree;
	}
}

/**
 * Extends the DOM event map for TypeScript.
 *
 * Declaring the relayed tree event provides event-name completion and a typed
 * `event.detail` payload to consumers.
 */
declare global {
	interface HTMLElementEventMap {
		"tp-object-tree-error": CustomEvent<TpObjectTreeErrorDetail>;
		"tp-object-tree-load": CustomEvent<TpObjectTreeLoadDetail>;
		"tp-tree-context-action": CustomEvent<TpTreeContextActionDetail>;
	}
}
