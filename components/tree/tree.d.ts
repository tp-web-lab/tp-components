/**
 * @module components/tree
 * @summary Generic tree component for interactive hierarchical editing.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-dragdrop
 * @summary Generic drag-and-drop controller for content.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
import { TpBase } from "../base/base.js";
import "../dragdrop/dragdrop.js";
import "../icon-button/icon-button.js";
/**
 * @summary Indicates if the action targets the tree entire or a node.
 */
export type TpTreeContextScope = "global" | "node";
/**
 * @summary API documentation summary.
 */
export type TpTreeDropPosition = "inside" | "before" | "after";
/**
 * @summary API documentation summary.
 */
export interface TpTreeContextAction {
    /**
     * @summary API documentation summary.
     */
    id: string;
    /**
     * @summary API documentation summary.
     */
    label: string;
    /**
     * @summary API documentation summary.
     */
    disabled?: boolean;
    /**
     * @summary API documentation summary.
     */
    hidden?: boolean;
    /**
     * @summary API documentation summary.
     */
    separatorBefore?: boolean;
    /**
     * @summary API documentation summary.
     */
    shortcutLabel?: string;
    /**
     * @summary API documentation summary.
     */
    tone?: "default" | "danger";
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeNodeCapabilities {
    /**
     * @summary API documentation summary.
     */
    renamable?: boolean;
    /**
     * @summary API documentation summary.
     */
    draggable?: boolean;
    /**
     * @summary API documentation summary.
     */
    droppable?: boolean;
    /**
     * @summary API documentation summary.
     */
    addable?: boolean;
    /**
     * @summary API documentation summary.
     */
    clonable?: boolean;
    /**
     * @summary API documentation summary.
     */
    deletable?: boolean;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeNodeTarget {
    /**
     * @summary API documentation summary.
     */
    element: HTMLLIElement;
    /**
     * @summary API documentation summary.
     */
    nodeId: string | null;
    /**
     * @summary API documentation summary.
     */
    kind: string | null;
    /**
     * @summary API documentation summary.
     */
    label: string | null;
    /**
     * @summary API documentation summary.
     */
    hasChildren: boolean;
    /**
     * @summary API documentation summary.
     */
    expanded: boolean;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeContextMenuConfig {
    /**
     * @summary API documentation summary.
     */
    globalActions: TpTreeContextAction[];
    /**
     * @summary API documentation summary.
     * @param target Parameter.
     * @returns Return value.
     */
    getNodeActions?: (target: TpTreeNodeTarget) => TpTreeContextAction[];
    /**
     * @summary API documentation summary.
     * @param target Parameter.
     * @returns Return value.
     */
    getNodeCapabilities?: (target: TpTreeNodeTarget) => TpTreeNodeCapabilities;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeContextActionDetail {
    /**
     * @summary API documentation summary.
     */
    actionId: string;
    /**
     * @summary API documentation summary.
     */
    scope: TpTreeContextScope;
    /**
     * @summary API documentation summary.
     */
    target: TpTreeNodeTarget | null;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeContextOpenDetail {
    /**
     * @summary API documentation summary.
     */
    scope: TpTreeContextScope;
    /**
     * @summary API documentation summary.
     */
    target: TpTreeNodeTarget | null;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeContextCloseDetail {
    /**
     * @summary API documentation summary.
     */
    scope: TpTreeContextScope | null;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeSelectDetail {
    /**
     * @summary API documentation summary.
     */
    target: TpTreeNodeTarget;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeNodeRenameRequestDetail {
    /**
     * @summary API documentation summary.
     */
    target: TpTreeNodeTarget;
    /**
     * @summary API documentation summary.
     */
    oldLabel: string;
    /**
     * @summary API documentation summary.
     */
    newLabel: string;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeNodeAddRequestDetail {
    /**
     * @summary API documentation summary.
     */
    target: TpTreeNodeTarget | null;
    /**
     * @summary API documentation summary.
     */
    position: TpTreeDropPosition;
    actionId: "add-leaf" | "add-node";
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeNodeCloneRequestDetail {
    /**
     * @summary API documentation summary.
     */
    target: TpTreeNodeTarget;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeNodeDeleteRequestDetail {
    /**
     * @summary API documentation summary.
     */
    target: TpTreeNodeTarget;
}
/**
 * @summary API documentation summary.
 */
export interface TpTreeNodeMoveRequestDetail {
    /**
     * @summary API documentation summary.
     */
    source: TpTreeNodeTarget;
    /**
     * @summary API documentation summary.
     */
    destination: TpTreeNodeTarget | null;
    /**
     * @summary API documentation summary.
     */
    position: TpTreeDropPosition;
}
/**
 * @summary Interactive hierarchical tree.
 * @tagname tp-tree
 * @attr {boolean} selectable = false - Enables node selection.
 * @attr {boolean} guides = false - Shows hierarchy guide lines.
 * @attr {boolean} editable = false - Enables node editing actions.
 * @attr {boolean} draggable = false - Enables node drag and drop.
 * @attr {number} level = 1 - Initial expansion depth.
 * @event tp-tree-select Emitted when a node is selected.
 * @eventdetail tp-tree-select { target: TpTreeNodeTarget }
 * @event tp-tree-context-open Emitted when a context menu opens.
 * @eventdetail tp-tree-context-open { scope: "global" | "node"; target: TpTreeNodeTarget | null }
 * @event tp-tree-context-close Emitted when a context menu closes.
 * @eventdetail tp-tree-context-close { scope: "global" | "node" | null }
 * @event tp-tree-context-action Emitted when a context menu action is selected.
 * @eventdetail tp-tree-context-action { actionId: string; scope: "global" | "node"; target: TpTreeNodeTarget | null }
 * @event tp-tree-node-rename-request Emitted when a node rename is requested.
 * @eventdetail tp-tree-node-rename-request { target: TpTreeNodeTarget; oldLabel: string; newLabel: string }
 * @event tp-tree-node-add-request Emitted when a node add action is requested.
 * @eventdetail tp-tree-node-add-request { target: TpTreeNodeTarget | null; position: "inside" | "before" | "after"; actionId: "add-leaf" | "add-node" }
 * @event tp-tree-node-clone-request Emitted when a node clone action is requested.
 * @eventdetail tp-tree-node-clone-request { target: TpTreeNodeTarget }
 * @event tp-tree-node-delete-request Emitted when a node delete action is requested.
 * @eventdetail tp-tree-node-delete-request { target: TpTreeNodeTarget }
 * @event tp-tree-node-move-request Emitted when a node move is requested.
 * @eventdetail tp-tree-node-move-request { source: TpTreeNodeTarget; destination: TpTreeNodeTarget | null; position: "inside" | "before" | "after" }
 * @cssprop --tp-tree-toggle-size Toggle icon button size.
 * @cssprop --tp-tree-toggle-half-size Half toggle size used by guide alignment.
 * @cssprop --tp-tree-row-padding-block Vertical padding for each tree row.
 * @cssprop --tp-tree-guide-inline-start Inline position of guide lines.
 * @cssprop --tp-tree-guide-midline Block position of guide midlines.
 * @example
 * <tp-tree></tp-tree>
 */
export declare class TpTree extends TpBase {
    /**
     * @summary API documentation summary.
     * @internal
     */
    private static readonly styleId;
    /**
     * @summary Describes the actions available.
     */
    contextMenuConfig: TpTreeContextMenuConfig | null;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private selectedItem;
    /**
     * @summary Reference to the floating menu.
     * @internal
     */
    private contextMenuEl;
    /**
     * @summary Describes the menu visible.
     * @internal
     */
    private openMenuState;
    /**
     * @summary Internal controller for native drag events.
     * @internal
     */
    private dragController;
    /**
     * @summary Reference to the node target current.
     * @internal
     */
    private dragTargetItem;
    /**
     * @summary Reference to the observateur of mutations.
     * @internal
     */
    private mutationObserver;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private renamingItem;
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary API documentation summary.
     * @attr selectable
     */
    get selectable(): boolean;
    set selectable(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr guides
     */
    get guides(): boolean;
    set guides(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr editable
     */
    get editable(): boolean;
    set editable(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr draggable
     */
    get draggableNodes(): boolean;
    set draggableNodes(value: boolean);
    /**
     * @summary Initial expansion depth.
     * @attr level
     * @default 1
     */
    get level(): number;
    set level(value: number);
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected attributeChangedCallback(name: string): void;
    /**
     * @summary Sets the context menu configuration.
     * @param config Context menu configuration, or `null` to restore defaults.
     */
    setContextMenuConfig(config: TpTreeContextMenuConfig | null): void;
    /**
     * @summary Returns the selected tree item.
     * @returns Selected tree item, or `null` when no item is selected.
     */
    getSelectedItem(): HTMLLIElement | null;
    /**
     * @summary Expands every tree item that has children.
     */
    expandAll(): void;
    /**
     * @summary Collapses every tree item that has children.
     */
    collapseAll(): void;
    /**
     * @summary Expands a tree item that has children.
     * @param item Tree item to expand.
     */
    expandNode(item: HTMLLIElement): void;
    /**
     * @summary Collapses a tree item that has children.
     * @param item Tree item to collapse.
     */
    collapseNode(item: HTMLLIElement): void;
    /**
     * @summary Sorts the direct children of a tree item alphabetically.
     * @param item Tree item whose direct children should be sorted.
     */
    sortNodeChildren(item: HTMLLIElement): void;
    /**
     * @summary Sorts every subtree alphabetically.
     */
    sortAll(): void;
    /**
     * @summary Toggles hierarchy guide lines.
     */
    toggleGuides(): void;
    /**
     * @summary Opens the global context menu at viewport coordinates.
     * @param x Viewport x coordinate.
     * @param y Viewport y coordinate.
     */
    openGlobalContextMenuAt(x: number, y: number): void;
    /**
     * @summary Opens the context menu for a tree node at viewport coordinates.
     * @param node Tree item.
     * @param x Viewport x coordinate.
     * @param y Viewport y coordinate.
     */
    openNodeContextMenuAt(node: HTMLLIElement, x: number, y: number): void;
    /**
     * @summary Closes the current context menu.
     */
    closeContextMenu(): void;
    /**
     * @summary Starts inline rename for a tree node.
     * @param node Tree item to rename.
     */
    beginRename(node: HTMLLIElement): void;
    /**
     * @summary API documentation summary.
     * @returns Return value.
     * @internal
     */
    private getDefaultContextMenuConfig;
    /**
     * @summary API documentation summary.
     * @param event Parameter.
     * @internal
     */
    private readonly handleClick;
    /**
     * @summary Opens or closes a node if possible.
     * @param event Parameter.
     * @internal
     */
    private readonly handleDoubleClick;
    /**
     * @summary Opens the global menu or the node menu.
     * @param event Parameter.
     * @internal
     */
    private readonly handleContextMenu;
    /** Creates one hidden controller and supplies the tree's existing drag rules. */
    private ensureDragController;
    /** Applies the existing tree marker to the controller's proposed position. */
    private readonly handleControllerOver;
    /** Keeps hierarchy mutations and the public tree move event in the tree component. */
    private readonly handleControllerDrop;
    /** Removes the tree marker after native drag completion or cancellation. */
    private readonly handleControllerEnd;
    /**
     * @summary API documentation summary.
     * @param event Parameter.
     * @internal
     */
    private readonly handleDocumentClick;
    /**
     * @summary API documentation summary.
     * @param event Parameter.
     * @internal
     */
    private readonly handleDocumentKeyDown;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private readonly handleDocumentScroll;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureStyles;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private observeMutations;
    /**
     * @summary List tous the nodes rendus.
     * @returns Return value.
     * @internal
     */
    private getAllItems;
    /**
     * @summary API documentation summary.
     * @returns Return value.
     * @internal
     */
    private getRootItem;
    /**
     * @summary Computes a tree item nesting level.
     * @param item Tree item.
     * @returns One-based tree item level.
     * @internal
     */
    private getItemLevel;
    /**
     * @summary Clears generated expansion state so `level` can be reapplied.
     * @internal
     */
    private resetLevelExpansionState;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private enhanceTree;
    /**
     * @summary API documentation summary.
     * @param item Parameter.
     * @returns Return value.
     * @internal
     */
    private getNodeTarget;
    /**
     * @summary API documentation summary.
     * @param target Parameter.
     * @returns Return value.
     * @internal
     */
    private getNodeCapabilities;
    /**
     * @summary API documentation summary.
     * @param item Parameter.
     * @internal
     */
    private selectItem;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private updateSelectionDom;
    /**
     * @summary Opens or closes a node disposant of children.
     * @param item Parameter.
     * @param expanded Parameter.
     * @internal
     */
    private setItemExpanded;
    /**
     * @summary API documentation summary.
     * @param item Parameter.
     * @param clientY Parameter.
     * @returns Return value.
     * @internal
     */
    private getDropPosition;
    /**
     * @summary API documentation summary.
     * @param destinationItem Parameter.
     * @param position Parameter.
     * @returns Return value.
     * @internal
     */
    private getEffectiveDropPosition;
    /**
     * @summary API documentation summary.
     * @param item Parameter.
     * @param position Parameter.
     * @internal
     */
    private applyDragTarget;
    /**
     * @summary API documentation summary.
     * @param sourceItem Parameter.
     * @param destinationItem Parameter.
     * @param position Parameter.
     * @internal
     */
    private moveItemInDom;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private clearDragTargetMarker;
    /**
     * @summary Clears the tree's visual drop marker.
     * @internal
     */
    private clearDragState;
    /**
     * @summary API documentation summary.
     * @param targetItem Parameter.
     * @param withChildren Parameter.
     * @internal
     */
    private addItemToDom;
    /**
     * @summary API documentation summary.
     * @param item Parameter.
     * @internal
     */
    private cloneItemInDom;
    /**
     * @summary Removes a node of its list parente.
     * @param item Parameter.
     * @internal
     */
    private deleteItemFromDom;
    /**
     * @summary API documentation summary.
     * @param item Parameter.
     * @returns Return value.
     * @internal
     */
    private getSortableItem;
    /**
     * @summary API documentation summary.
     * @param item Parameter.
     * @internal
     */
    private sortChildrenOfItem;
    /**
     * @summary API documentation summary.
     * @param childList Parameter.
     * @internal
     */
    private sortChildList;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private sortAllItems;
    /**
     * @summary API documentation summary.
     * @param actions Parameter.
     * @param scope Parameter.
     * @param target Parameter.
     * @param x Parameter.
     * @param y Parameter.
     * @internal
     */
    private openContextMenu;
    /**
     * @summary API documentation summary.
     * @param actionId Parameter.
     * @param scope Parameter.
     * @param target Parameter.
     * @internal
     */
    private handleContextActionSelection;
    /**
     * @summary API documentation summary.
     * @param actionId Parameter.
     * @internal
     */
    private handleGlobalContextAction;
    /**
     * @summary API documentation summary.
     * @param actionId Parameter.
     * @param target Parameter.
     * @internal
     */
    private handleNodeContextAction;
}
/**
 * @summary API documentation summary.
 */
declare global {
    interface HTMLElementTagNameMap {
        "tp-tree": TpTree;
    }
    interface HTMLElementEventMap {
        "tp-tree-select": CustomEvent<TpTreeSelectDetail>;
        "tp-tree-context-open": CustomEvent<TpTreeContextOpenDetail>;
        "tp-tree-context-close": CustomEvent<TpTreeContextCloseDetail>;
        "tp-tree-context-action": CustomEvent<TpTreeContextActionDetail>;
        "tp-tree-node-rename-request": CustomEvent<TpTreeNodeRenameRequestDetail>;
        "tp-tree-node-add-request": CustomEvent<TpTreeNodeAddRequestDetail>;
        "tp-tree-node-clone-request": CustomEvent<TpTreeNodeCloneRequestDetail>;
        "tp-tree-node-delete-request": CustomEvent<TpTreeNodeDeleteRequestDetail>;
        "tp-tree-node-move-request": CustomEvent<TpTreeNodeMoveRequestDetail>;
    }
}
