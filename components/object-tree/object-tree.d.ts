/**
 * @module components/object-tree
 * @summary Specialized tree for inspecting JavaScript values.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-tree
 * @summary Generic tree component for interactive hierarchical editing.
 */
import { TpBase } from "../base/base.js";
import "../tree/tree.js";
import type { TpTreeContextActionDetail } from "../tree/tree.js";
/**
 * Logical kind of an inspectable value.
 *
 * @summary Represents the kind of a displayed value.
 */
export type TpInspectableValueKind = "string" | "number" | "boolean" | "null" | "undefined" | "function" | "date" | "error" | "circular" | "array" | "object";
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
export declare class TpObjectTree extends TpBase {
    private static readonly styleId;
    /**
     * Root logical node currently being rendered.
     *
     * @summary Stores the inspected root node.
     * @internal
     */
    private rootNode;
    /**
     * Reference to the internal tree component.
     *
     * @summary Stores the internal `<tp-tree>` reference.
     * @internal
     */
    private treeEl;
    /** Inline JavaScript source preserved before the light DOM is rebuilt. */
    private inlineScriptSource;
    /** Sequence number used to ignore stale asynchronous load results. */
    private loadSequence;
    /**
     * Names of attributes observed by the component.
     *
     * @summary Declares the observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /** URL of the external JSON file to inspect. */
    get src(): string;
    set src(value: string);
    /**
     * Initializes the component.
     *
     * The inline script is captured before rendering because `render()` rebuilds
     * the component light DOM. The configured source is then loaded asynchronously.
     *
     * @summary Renders the initial tree and binds its events.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Responds to observed attribute changes.
     *
     * @internal
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Loads the value declared by `src` or by the direct inline JavaScript script.
     *
     * `src` takes precedence. Each invocation receives a sequence number so that
     * a slower previous request cannot overwrite a more recently configured value.
     *
     * @summary Resolves and displays the configured declarative value.
     * @internal
     */
    private loadConfiguredValue;
    /**
     * Emits the event indicating that a declarative value was loaded.
     *
     * @param source Source used to obtain the value.
     * @param value Loaded JavaScript value.
     * @internal
     */
    private dispatchLoadEvent;
    /**
     * Emits a loading error without replacing the value currently displayed.
     *
     * @param source Source that failed.
     * @param error Original loading or evaluation error.
     * @internal
     */
    private dispatchErrorEvent;
    /**
     * Sets the value to inspect.
     *
     * Existing output is replaced and the new tree is expanded initially.
     *
     * @summary Loads a new value into the tree.
     * @param value Value to inspect.
     */
    setValue(value: unknown): void;
    /**
     * Expands every node in the tree.
     *
     * @summary Expands all nodes.
     */
    expandAll(): void;
    /**
     * Collapses every node in the tree.
     *
     * @summary Collapses all nodes.
     */
    collapseAll(): void;
    /**
     * Recursively sorts all displayed nodes.
     *
     * @summary Sorts the current inspectable tree.
     */
    sortAll(): void;
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
    private ensureStyles;
    /**
     * Binds internal events.
     *
     * @summary Subscribes to actions from the internal tree.
     * @internal
     */
    private bindEvents;
    /**
     * Unbinds internal events.
     *
     * @summary Removes subscriptions from the internal tree.
     * @internal
     */
    private unbindEvents;
    /**
     * Handles global context-menu actions.
     *
     * @summary Applies global tree commands.
     * @param event Context action emitted by the internal tree.
     * @internal
     */
    private readonly handleTreeContextAction;
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
    private inspectValue;
    /**
     * Renders the complete component.
     *
     * The internal `<tp-tree>` is rebuilt from the normalized root node and all
     * nodes are expanded after a value has been loaded.
     *
     * @summary Rebuilds the internal `<tp-tree>`.
     * @internal
     */
    private render;
    /**
     * Renders an inspectable node as an `<li>` element.
     *
     * @summary Produces a DOM node for the tree.
     * @param node Inspectable node to render.
     * @returns Corresponding `<li>` element.
     * @internal
     */
    private renderNode;
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
    private formatSummary;
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
