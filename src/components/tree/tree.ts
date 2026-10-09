/**
 * @module components/tree
 * @summary Generic tree component for interactive hierarchical editing.
 */

// tp-docgen:dependencies:start
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
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import type {
	TpDragDropDropDetail,
	TpDragDropOverDetail,
	TpDragdrop,
} from "../dragdrop/dragdrop.js";
import style from "./tree.css?inline";
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
 * @summary Describes the currently open menu.
 * @internal
 */
interface TpTreeOpenMenuState {
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
 * @summary Finds the list child direct.
 * @param item Parameter.
 * @returns Return value.
 * @internal
 */
function getDirectChildList(item: HTMLLIElement): HTMLUListElement | null {
	for (const child of Array.from(item.children)) {
		if (child instanceof HTMLUListElement) {
			return child;
		}
	}

	return null;
}

/**
 * @summary API documentation summary.
 * @param item Parameter.
 * @returns Return value.
 * @internal
 */
function getDirectRow(item: HTMLLIElement): HTMLSpanElement | null {
	for (const child of Array.from(item.children)) {
		if (
			child instanceof HTMLSpanElement &&
			child.hasAttribute("data-tp-tree-row")
		) {
			return child;
		}
	}

	return null;
}

/**
 * @summary Finds the button of open/close.
 * @param item Parameter.
 * @returns Return value.
 * @internal
 */
function getDirectToggleButton(item: HTMLLIElement): HTMLElement | null {
	const row = getDirectRow(item);

	if (!(row instanceof HTMLSpanElement)) {
		return null;
	}

	for (const child of Array.from(row.children)) {
		if (
			child instanceof HTMLElement &&
			child.hasAttribute("data-tp-tree-toggle")
		) {
			return child;
		}
	}

	return null;
}

/**
 * @summary API documentation summary.
 * @param item Parameter.
 * @returns Return value.
 * @internal
 */
function getNodeLabel(item: HTMLLIElement): string | null {
	const fromDataLabel = item.getAttribute("data-label");

	if (typeof fromDataLabel === "string" && fromDataLabel !== "") {
		return fromDataLabel;
	}

	const row = getDirectRow(item);

	if (!(row instanceof HTMLSpanElement)) {
		return null;
	}

	const labelClone = row.cloneNode(true);

	if (!(labelClone instanceof HTMLSpanElement)) {
		return null;
	}

	for (const button of Array.from(labelClone.querySelectorAll("button"))) {
		button.remove();
	}

	for (const editor of Array.from(
		labelClone.querySelectorAll("[data-tp-tree-rename-input]"),
	)) {
		editor.remove();
	}

	const text = labelClone.textContent?.trim() ?? "";
	return text !== "" ? text : null;
}

/**
 * @summary API documentation summary.
 * @param item Parameter.
 * @returns Return value.
 * @internal
 */
function ensureRow(item: HTMLLIElement): HTMLSpanElement {
	const existingRow = getDirectRow(item);

	if (existingRow instanceof HTMLSpanElement) {
		return existingRow;
	}

	const row = document.createElement("span");
	row.setAttribute("data-tp-tree-row", "");

	const directChildList = getDirectChildList(item);
	const nodesToMove = Array.from(item.childNodes).filter((node) => {
		return node !== directChildList;
	});

	for (const node of nodesToMove) {
		row.append(node);
	}

	if (directChildList instanceof HTMLUListElement) {
		item.insertBefore(row, directChildList);
	} else {
		item.append(row);
	}

	return row;
}

/**
 * @summary API documentation summary.
 * @param target Parameter.
 * @returns Return value.
 * @internal
 */
function getClosestItem(target: EventTarget | null): HTMLLIElement | null {
	if (!(target instanceof HTMLElement)) {
		return null;
	}

	const item = target.closest("li");
	return item instanceof HTMLLIElement ? item : null;
}

/**
 * @summary API documentation summary.
 * @param event Parameter.
 * @returns Return value.
 * @internal
 */
function getClosestItemFromEvent(event: Event): HTMLLIElement | null {
	for (const entry of event.composedPath()) {
		if (entry instanceof HTMLLIElement) {
			return entry;
		}
	}

	return null;
}

/**
 * @summary API documentation summary.
 * @param event Parameter.
 * @returns Return value.
 * @internal
 */
function getToggleButtonFromEvent(event: Event): HTMLElement | null {
	for (const entry of event.composedPath()) {
		if (
			entry instanceof HTMLElement &&
			entry.hasAttribute("data-tp-tree-toggle")
		) {
			return entry;
		}
	}

	return null;
}

/**
 * @summary API documentation summary.
 * @param menu Parameter.
 * @param target Parameter.
 * @returns Return value.
 * @internal
 */
function isInsideMenu(
	menu: HTMLElement | null,
	target: EventTarget | null,
): boolean {
	return (
		menu instanceof HTMLElement &&
		target instanceof Node &&
		menu.contains(target)
	);
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
export class TpTree extends TpBase {
	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private static readonly styleId = "tp-tree-styles";

	/**
	 * @summary Describes the actions available.
	 */
	public contextMenuConfig: TpTreeContextMenuConfig | null = null;

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private selectedItem: HTMLLIElement | null = null;

	/**
	 * @summary Reference to the floating menu.
	 * @internal
	 */
	private contextMenuEl: HTMLDivElement | null = null;

	/**
	 * @summary Describes the menu visible.
	 * @internal
	 */
	private openMenuState: TpTreeOpenMenuState | null = null;

	/**
	 * @summary Internal controller for native drag events.
	 * @internal
	 */
	private dragController: TpDragdrop | null = null;

	/**
	 * @summary Reference to the node target current.
	 * @internal
	 */
	private dragTargetItem: HTMLLIElement | null = null;

	/**
	 * @summary Reference to the observateur of mutations.
	 * @internal
	 */
	private mutationObserver: MutationObserver | null = null;

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private renamingItem: HTMLLIElement | null = null;

	/**
	 * @summary Declares observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["selectable", "guides", "editable", "draggable", "level"];
	}

	/**
	 * @summary API documentation summary.
	 * @attr selectable
	 */
	public get selectable(): boolean {
		return this.hasAttribute("selectable");
	}

	public set selectable(value: boolean) {
		if (value) {
			this.setAttribute("selectable", "");
			return;
		}

		this.removeAttribute("selectable");
	}

	/**
	 * @summary API documentation summary.
	 * @attr guides
	 */
	public get guides(): boolean {
		return this.hasAttribute("guides");
	}

	public set guides(value: boolean) {
		if (value) {
			this.setAttribute("guides", "");
			return;
		}

		this.removeAttribute("guides");
	}

	/**
	 * @summary API documentation summary.
	 * @attr editable
	 */
	public get editable(): boolean {
		return this.hasAttribute("editable");
	}

	public set editable(value: boolean) {
		if (value) {
			this.setAttribute("editable", "");
			return;
		}

		this.removeAttribute("editable");
	}

	/**
	 * @summary API documentation summary.
	 * @attr draggable
	 */
	public get draggableNodes(): boolean {
		return this.hasAttribute("draggable");
	}

	public set draggableNodes(value: boolean) {
		if (value) {
			this.setAttribute("draggable", "");
			return;
		}

		this.removeAttribute("draggable");
	}

	/**
	 * @summary Initial expansion depth.
	 * @attr level
	 * @default 1
	 */
	public get level(): number {
		const value = this.getAttribute("level");

		if (value === null) {
			return 1;
		}

		const parsed = Number(value);

		return Number.isInteger(parsed) && parsed >= 0 ? parsed : 1;
	}

	public set level(value: number) {
		if (!Number.isInteger(value) || value < 0) {
			throw new TypeError(
				'The "level" attribute must be an integer greater than or equal to 0.',
			);
		}

		this.setAttribute("level", String(value));
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.enhanceTree();
		this.ensureDragController();
		this.observeMutations();

		this.addEventListener("click", this.handleClick);
		this.addEventListener("dblclick", this.handleDoubleClick);
		this.addEventListener("contextmenu", this.handleContextMenu);

		document.addEventListener("click", this.handleDocumentClick, true);
		document.addEventListener("keydown", this.handleDocumentKeyDown, true);
		document.addEventListener("scroll", this.handleDocumentScroll, true);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
		this.mutationObserver?.disconnect();
		this.mutationObserver = null;

		this.closeContextMenu();
		this.clearDragState();
		this.dragController?.remove();

		this.removeEventListener("click", this.handleClick);
		this.removeEventListener("dblclick", this.handleDoubleClick);
		this.removeEventListener("contextmenu", this.handleContextMenu);

		document.removeEventListener("click", this.handleDocumentClick, true);
		document.removeEventListener("keydown", this.handleDocumentKeyDown, true);
		document.removeEventListener("scroll", this.handleDocumentScroll, true);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) {
			return;
		}

		if (name === "level") {
			this.resetLevelExpansionState();
		}

		this.enhanceTree();
	}

	/**
	 * @summary Sets the context menu configuration.
	 * @param config Context menu configuration, or `null` to restore defaults.
	 */
	public setContextMenuConfig(config: TpTreeContextMenuConfig | null): void {
		this.contextMenuConfig = config;
	}

	/**
	 * @summary Returns the selected tree item.
	 * @returns Selected tree item, or `null` when no item is selected.
	 */
	public getSelectedItem(): HTMLLIElement | null {
		return this.selectedItem;
	}

	/**
	 * @summary Expands every tree item that has children.
	 */
	public expandAll(): void {
		for (const item of this.getAllItems()) {
			if (getDirectChildList(item) instanceof HTMLUListElement) {
				this.setItemExpanded(item, true);
			}
		}
	}

	/**
	 * @summary Collapses every tree item that has children.
	 */
	public collapseAll(): void {
		for (const item of this.getAllItems()) {
			if (getDirectChildList(item) instanceof HTMLUListElement) {
				this.setItemExpanded(item, false);
			}
		}
	}

	/**
	 * @summary Expands a tree item that has children.
	 * @param item Tree item to expand.
	 */
	public expandNode(item: HTMLLIElement): void {
		this.setItemExpanded(item, true);
	}

	/**
	 * @summary Collapses a tree item that has children.
	 * @param item Tree item to collapse.
	 */
	public collapseNode(item: HTMLLIElement): void {
		this.setItemExpanded(item, false);
	}

	/**
	 * @summary Sorts the direct children of a tree item alphabetically.
	 * @param item Tree item whose direct children should be sorted.
	 */
	public sortNodeChildren(item: HTMLLIElement): void {
		this.sortChildrenOfItem(item);
	}

	/**
	 * @summary Sorts every subtree alphabetically.
	 */
	public sortAll(): void {
		this.sortAllItems();
	}

	/**
	 * @summary Toggles hierarchy guide lines.
	 */
	public toggleGuides(): void {
		this.guides = !this.guides;
	}

	/**
	 * @summary Opens the global context menu at viewport coordinates.
	 * @param x Viewport x coordinate.
	 * @param y Viewport y coordinate.
	 */
	public openGlobalContextMenuAt(x: number, y: number): void {
		const config = this.contextMenuConfig ?? this.getDefaultContextMenuConfig();
		const actions = config.globalActions.filter((action) => !action.hidden);

		if (actions.length === 0) {
			return;
		}

		this.openContextMenu(actions, "global", null, x, y);
	}

	/**
	 * @summary Opens the context menu for a tree node at viewport coordinates.
	 * @param node Tree item.
	 * @param x Viewport x coordinate.
	 * @param y Viewport y coordinate.
	 */
	public openNodeContextMenuAt(
		node: HTMLLIElement,
		x: number,
		y: number,
	): void {
		const config = this.contextMenuConfig ?? this.getDefaultContextMenuConfig();
		const target = this.getNodeTarget(node);

		const nodeActions =
			typeof config.getNodeActions === "function"
				? config.getNodeActions(target).filter((action) => !action.hidden)
				: [];

		const globalActions = config.globalActions.filter(
			(action) => !action.hidden,
		);
		const actions: TpTreeContextAction[] = [...nodeActions];

		if (nodeActions.length > 0 && globalActions.length > 0) {
			const firstGlobalAction = globalActions.at(0);

			if (firstGlobalAction !== undefined) {
				actions.push({
					...firstGlobalAction,
					separatorBefore: true,
				});
			}

			actions.push(...globalActions.slice(1));
		} else {
			actions.push(...globalActions);
		}

		if (actions.length === 0) {
			return;
		}

		this.openContextMenu(actions, "node", target, x, y);
	}

	/**
	 * @summary Closes the current context menu.
	 */
	public closeContextMenu(): void {
		if (this.contextMenuEl instanceof HTMLDivElement) {
			this.contextMenuEl.remove();
			this.contextMenuEl = null;
		}

		if (this.openMenuState !== null) {
			const previousScope = this.openMenuState.scope;
			this.openMenuState = null;

			this.dispatchEvent(
				new CustomEvent<TpTreeContextCloseDetail>("tp-tree-context-close", {
					bubbles: true,
					detail: {
						scope: previousScope,
					},
				}),
			);
		}
	}

	/**
	 * @summary Starts inline rename for a tree node.
	 * @param node Tree item to rename.
	 */
	public beginRename(node: HTMLLIElement): void {
		const target = this.getNodeTarget(node);
		const capabilities = this.getNodeCapabilities(target);

		if (!capabilities.renamable) {
			return;
		}

		const row = getDirectRow(node);

		if (!(row instanceof HTMLSpanElement)) {
			return;
		}

		const existingInput = row.querySelector("[data-tp-tree-rename-input]");

		if (existingInput instanceof HTMLInputElement) {
			existingInput.focus();
			existingInput.select();
			return;
		}

		const oldLabel = target.label ?? "";
		const toggle = getDirectToggleButton(node);
		const trailingNodes = Array.from(row.childNodes).filter((child) => {
			return child !== toggle;
		});

		if (trailingNodes.length === 0) {
			return;
		}

		const labelWrapper = document.createElement("span");
		labelWrapper.setAttribute("data-tp-tree-rename-label", "");

		for (const child of trailingNodes) {
			labelWrapper.append(child);
		}

		row.append(labelWrapper);

		const input = document.createElement("input");
		input.type = "text";
		input.value = oldLabel;
		input.setAttribute("data-tp-tree-rename-input", "");

		labelWrapper.replaceWith(input);
		this.renamingItem = node;

		let isFinished = false;

		const finish = (commit: boolean): void => {
			if (isFinished) {
				return;
			}

			isFinished = true;

			if (this.renamingItem !== node) {
				return;
			}

			const newLabel = input.value.trim();
			const finalLabel = commit && newLabel !== "" ? newLabel : oldLabel;

			const replacement = document.createElement("span");
			replacement.setAttribute("data-tp-tree-rename-label", "");
			replacement.textContent = finalLabel;

			if (input.parentNode !== null) {
				input.replaceWith(replacement);
			}

			node.setAttribute("data-label", finalLabel);
			this.renamingItem = null;

			if (commit && newLabel !== "" && newLabel !== oldLabel) {
				this.dispatchEvent(
					new CustomEvent<TpTreeNodeRenameRequestDetail>(
						"tp-tree-node-rename-request",
						{
							bubbles: true,
							detail: {
								target,
								oldLabel,
								newLabel,
							},
						},
					),
				);
			}
		};

		input.addEventListener("keydown", (event) => {
			if (!(event instanceof KeyboardEvent)) {
				return;
			}

			if (event.key === "Enter") {
				event.preventDefault();
				finish(true);
				return;
			}

			if (event.key === "Escape") {
				event.preventDefault();
				finish(false);
			}
		});

		input.addEventListener("blur", () => {
			finish(true);
		});

		input.focus();
		input.select();
	}

	/**
	 * @summary API documentation summary.
	 * @returns Return value.
	 * @internal
	 */
	private getDefaultContextMenuConfig(): TpTreeContextMenuConfig {
		return {
			globalActions: [
				{ id: "expand-all", label: "Expand all" },
				{ id: "collapse-all", label: "Collapse all" },
				{ id: "sort-all", label: "Sort all" },
				{ id: "toggle-guides", label: "Toggle guides" },
			],
			getNodeActions: () => {
				if (!this.editable) {
					return [];
				}

				return [
					{ id: "add-leaf", label: "Add leaf" },
					{ id: "add-node", label: "Add node" },
					{ id: "clone", label: "Clone" },
					{ id: "rename", label: "Rename" },
					{ id: "sort", label: "Sort" },
					{ id: "delete", label: "Delete", tone: "danger" },
				];
			},
			getNodeCapabilities: () => ({
				renamable: this.editable,
				addable: this.editable,
				clonable: this.editable,
				deletable: this.editable,
				draggable: this.draggableNodes,
				droppable: this.draggableNodes,
			}),
		};
	}

	/**
	 * @summary API documentation summary.
	 * @param event Parameter.
	 * @internal
	 */
	private readonly handleClick = (event: Event): void => {
		if (isInsideMenu(this.contextMenuEl, event.target)) {
			return;
		}

		const toggle = getToggleButtonFromEvent(event);

		if (toggle instanceof HTMLElement) {
			const item = getClosestItem(toggle);

			if (item instanceof HTMLLIElement) {
				this.setItemExpanded(
					item,
					item.getAttribute("data-expanded") !== "true",
				);
			}

			return;
		}

		const item = getClosestItemFromEvent(event);

		if (!(item instanceof HTMLLIElement) || !this.selectable) {
			return;
		}

		this.selectItem(item);
	};

	/**
	 * @summary Opens or closes a node if possible.
	 * @param event Parameter.
	 * @internal
	 */
	private readonly handleDoubleClick = (event: MouseEvent): void => {
		const item = getClosestItemFromEvent(event);

		if (!(item instanceof HTMLLIElement)) {
			return;
		}

		if (!(getDirectChildList(item) instanceof HTMLUListElement)) {
			return;
		}

		const isExpanded = item.getAttribute("data-expanded") === "true";
		this.setItemExpanded(item, !isExpanded);
	};

	/**
	 * @summary Opens the global menu or the node menu.
	 * @param event Parameter.
	 * @internal
	 */
	private readonly handleContextMenu = (event: MouseEvent): void => {
		event.preventDefault();

		const item = getClosestItemFromEvent(event);

		if (item instanceof HTMLLIElement) {
			this.openNodeContextMenuAt(item, event.clientX, event.clientY);
			return;
		}

		this.openGlobalContextMenuAt(event.clientX, event.clientY);
	};

	/** Creates one hidden controller and supplies the tree's existing drag rules. */
	private ensureDragController(): void {
		if (this.dragController === null) {
			const controller = document.createElement("tp-dragdrop");
			controller.setAttribute("data-tp-tree-dragdrop", "");
			controller.adapter = {
				root: this,
				getItem: (event) => {
					const item = getClosestItemFromEvent(event);
					return item instanceof HTMLLIElement &&
						item.closest("tp-tree") === this
						? item
						: null;
				},
				canStart: (event) => {
					const item = getClosestItemFromEvent(event);
					return (
						item instanceof HTMLLIElement &&
						item.closest("tp-tree") === this &&
						event.dataTransfer !== null &&
						this.getNodeCapabilities(this.getNodeTarget(item)).draggable ===
							true
					);
				},
				canDrop: (item) =>
					item instanceof HTMLLIElement &&
					item.closest("tp-tree") === this &&
					(item === this.getRootItem() ||
						this.getNodeCapabilities(this.getNodeTarget(item)).droppable ===
							true),
				getPosition: (event, item) =>
					this.getEffectiveDropPosition(
						item as HTMLLIElement,
						this.getDropPosition(item as HTMLLIElement, event.clientY),
					),
				getData: (item) =>
					this.getNodeTarget(item as HTMLLIElement).nodeId ?? "",
			};
			controller.addEventListener(
				"tp-dragdrop-over",
				this.handleControllerOver,
			);
			controller.addEventListener(
				"tp-dragdrop-drop",
				this.handleControllerDrop,
			);
			controller.addEventListener("tp-dragdrop-end", this.handleControllerEnd);
			this.dragController = controller;
		}
		if (this.dragController.parentElement !== this)
			this.append(this.dragController);
	}

	/** Applies the existing tree marker to the controller's proposed position. */
	private readonly handleControllerOver = (event: Event): void => {
		const { target, position } = (event as CustomEvent<TpDragDropOverDetail>)
			.detail;
		if (target instanceof HTMLLIElement && position !== null) {
			this.applyDragTarget(target, position);
		}
	};

	/** Keeps hierarchy mutations and the public tree move event in the tree component. */
	private readonly handleControllerDrop = (event: Event): void => {
		const {
			source: sourceItem,
			target: destinationItem,
			position,
		} = (event as CustomEvent<TpDragDropDropDetail>).detail;
		if (
			!(sourceItem instanceof HTMLLIElement) ||
			!(destinationItem instanceof HTMLLIElement) ||
			sourceItem === destinationItem ||
			sourceItem.contains(destinationItem)
		) {
			this.clearDragState();
			return;
		}
		const effectivePosition = this.getEffectiveDropPosition(
			destinationItem,
			position ?? "inside",
		);
		const source = this.getNodeTarget(sourceItem);
		const destination = this.getNodeTarget(destinationItem);
		this.moveItemInDom(sourceItem, destinationItem, effectivePosition);
		this.dispatchEvent(
			new CustomEvent<TpTreeNodeMoveRequestDetail>(
				"tp-tree-node-move-request",
				{
					bubbles: true,
					detail: { source, destination, position: effectivePosition },
				},
			),
		);
		this.enhanceTree();
		this.clearDragState();
	};

	/** Removes the tree marker after native drag completion or cancellation. */
	private readonly handleControllerEnd = (): void => {
		this.clearDragState();
	};

	/**
	 * @summary API documentation summary.
	 * @param event Parameter.
	 * @internal
	 */
	private readonly handleDocumentClick = (event: Event): void => {
		if (isInsideMenu(this.contextMenuEl, event.target)) {
			return;
		}

		this.closeContextMenu();
	};

	/**
	 * @summary API documentation summary.
	 * @param event Parameter.
	 * @internal
	 */
	private readonly handleDocumentKeyDown = (event: Event): void => {
		if (!(event instanceof KeyboardEvent)) {
			return;
		}

		if (event.key === "Escape") {
			this.closeContextMenu();
		}
	};

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private readonly handleDocumentScroll = (): void => {
		this.closeContextMenu();
	};

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpTree.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpTree.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private observeMutations(): void {
		// Internal implementation detail.
	}

	/**
	 * @summary List tous the nodes rendus.
	 * @returns Return value.
	 * @internal
	 */
	private getAllItems(): HTMLLIElement[] {
		return Array.from(this.querySelectorAll("li")).filter(
			(element): element is HTMLLIElement => element instanceof HTMLLIElement,
		);
	}

	/**
	 * @summary API documentation summary.
	 * @returns Return value.
	 * @internal
	 */
	private getRootItem(): HTMLLIElement | null {
		const firstList = this.querySelector(":scope > ul");

		if (!(firstList instanceof HTMLUListElement)) {
			return null;
		}

		const firstItem = firstList.querySelector(":scope > li");
		return firstItem instanceof HTMLLIElement ? firstItem : null;
	}

	/**
	 * @summary Computes a tree item nesting level.
	 * @param item Tree item.
	 * @returns One-based tree item level.
	 * @internal
	 */
	private getItemLevel(item: HTMLLIElement): number {
		let level = 1;
		let parent = item.parentElement?.closest("li");

		while (parent instanceof HTMLLIElement && this.contains(parent)) {
			level += 1;
			parent = parent.parentElement?.closest("li") ?? null;
		}

		return level;
	}

	/**
	 * @summary Clears generated expansion state so `level` can be reapplied.
	 * @internal
	 */
	private resetLevelExpansionState(): void {
		for (const item of this.getAllItems()) {
			if (item.getAttribute("data-tp-tree-level-expanded") === "true") {
				item.removeAttribute("data-expanded");
				item.removeAttribute("data-tp-tree-level-expanded");
			}
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private enhanceTree(): void {
		for (const item of this.getAllItems()) {
			const row = ensureRow(item);
			const childList = getDirectChildList(item);
			const target = this.getNodeTarget(item);
			const capabilities = this.getNodeCapabilities(target);

			item.setAttribute("data-tp-tree-item", "");

			if (capabilities.draggable) {
				item.setAttribute("draggable", "true");
			} else {
				item.removeAttribute("draggable");
			}

			if (childList instanceof HTMLUListElement) {
				let toggle = getDirectToggleButton(item);

				if (!(toggle instanceof HTMLElement)) {
					toggle = document.createElement("tp-icon-button");
					toggle.setAttribute("data-tp-tree-toggle", "");
					toggle.setAttribute("library", "tp");
					toggle.setAttribute("size", "xxs");
					toggle.setAttribute("name", "plus-box-outline");
					toggle.setAttribute("label", "Toggle node");

					row.prepend(toggle);
				}

				const expandedAttribute = item.getAttribute("data-expanded");
				const expanded =
					expandedAttribute === null
						? this.getItemLevel(item) <= this.level
						: expandedAttribute === "true";

				this.setItemExpanded(item, expanded);

				if (expandedAttribute === null) {
					item.setAttribute("data-tp-tree-level-expanded", "true");
				}
			} else {
				const toggle = getDirectToggleButton(item);
				toggle?.remove();
				item.removeAttribute("data-expanded");
				item.removeAttribute("data-tp-tree-level-expanded");
			}
		}

		if (
			this.selectedItem instanceof HTMLLIElement &&
			!this.contains(this.selectedItem)
		) {
			this.selectedItem = null;
		}

		this.updateSelectionDom();
	}

	/**
	 * @summary API documentation summary.
	 * @param item Parameter.
	 * @returns Return value.
	 * @internal
	 */
	private getNodeTarget(item: HTMLLIElement): TpTreeNodeTarget {
		const childList = getDirectChildList(item);

		return {
			element: item,
			nodeId:
				item.getAttribute("data-node-id") ?? item.getAttribute("data-path"),
			kind: item.getAttribute("data-kind"),
			label: getNodeLabel(item),
			hasChildren: childList instanceof HTMLUListElement,
			expanded: item.getAttribute("data-expanded") === "true",
		};
	}

	/**
	 * @summary API documentation summary.
	 * @param target Parameter.
	 * @returns Return value.
	 * @internal
	 */
	private getNodeCapabilities(
		target: TpTreeNodeTarget,
	): TpTreeNodeCapabilities {
		const config = this.contextMenuConfig ?? this.getDefaultContextMenuConfig();

		if (typeof config.getNodeCapabilities === "function") {
			return config.getNodeCapabilities(target);
		}

		return {};
	}

	/**
	 * @summary API documentation summary.
	 * @param item Parameter.
	 * @internal
	 */
	private selectItem(item: HTMLLIElement): void {
		this.selectedItem = item;
		this.updateSelectionDom();

		this.dispatchEvent(
			new CustomEvent<TpTreeSelectDetail>("tp-tree-select", {
				bubbles: true,
				detail: {
					target: this.getNodeTarget(item),
				},
			}),
		);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private updateSelectionDom(): void {
		for (const item of this.getAllItems()) {
			if (item === this.selectedItem) {
				item.setAttribute("data-selected", "");
			} else {
				item.removeAttribute("data-selected");
			}
		}
	}

	/**
	 * @summary Opens or closes a node disposant of children.
	 * @param item Parameter.
	 * @param expanded Parameter.
	 * @internal
	 */
	private setItemExpanded(item: HTMLLIElement, expanded: boolean): void {
		const childList = getDirectChildList(item);
		const toggle = getDirectToggleButton(item);

		if (!(childList instanceof HTMLUListElement)) {
			return;
		}

		item.setAttribute("data-expanded", expanded ? "true" : "false");
		childList.hidden = !expanded;

		if (toggle instanceof HTMLElement) {
			toggle.setAttribute("aria-expanded", String(expanded));
			toggle.setAttribute(
				"name",
				expanded ? "minus-box-outline" : "plus-box-outline",
			);
			const nativeButton = toggle.querySelector("button");
			if (nativeButton instanceof HTMLButtonElement) {
				nativeButton.setAttribute("aria-expanded", String(expanded));
			}
		}
	}

	/**
	 * @summary API documentation summary.
	 * @param item Parameter.
	 * @param clientY Parameter.
	 * @returns Return value.
	 * @internal
	 */
	private getDropPosition(
		item: HTMLLIElement,
		clientY: number,
	): TpTreeDropPosition {
		const rect = item.getBoundingClientRect();
		const relativeY = clientY - rect.top;
		const upperThreshold = rect.height * 0.15;
		const lowerThreshold = rect.height * 0.85;

		if (relativeY <= upperThreshold) {
			return "before";
		}

		if (relativeY >= lowerThreshold) {
			return "after";
		}

		return "inside";
	}

	/**
	 * @summary API documentation summary.
	 * @param destinationItem Parameter.
	 * @param position Parameter.
	 * @returns Return value.
	 * @internal
	 */
	private getEffectiveDropPosition(
		destinationItem: HTMLLIElement,
		position: TpTreeDropPosition,
	): TpTreeDropPosition {
		const rootItem = this.getRootItem();

		if (destinationItem === rootItem) {
			return "inside";
		}

		const hasChildren =
			getDirectChildList(destinationItem) instanceof HTMLUListElement;

		if (!hasChildren && position === "inside") {
			return "after";
		}

		return position;
	}

	/**
	 * @summary API documentation summary.
	 * @param item Parameter.
	 * @param position Parameter.
	 * @internal
	 */
	private applyDragTarget(
		item: HTMLLIElement,
		position: TpTreeDropPosition,
	): void {
		this.clearDragTargetMarker();

		this.dragTargetItem = item;

		item.setAttribute("data-drop-target", position);
	}

	/**
	 * @summary API documentation summary.
	 * @param sourceItem Parameter.
	 * @param destinationItem Parameter.
	 * @param position Parameter.
	 * @internal
	 */
	private moveItemInDom(
		sourceItem: HTMLLIElement,
		destinationItem: HTMLLIElement,
		position: TpTreeDropPosition,
	): void {
		if (sourceItem === destinationItem) {
			return;
		}

		if (sourceItem.contains(destinationItem)) {
			return;
		}

		if (position === "before") {
			destinationItem.parentElement?.insertBefore(sourceItem, destinationItem);
			return;
		}

		if (position === "after") {
			destinationItem.parentElement?.insertBefore(
				sourceItem,
				destinationItem.nextSibling,
			);
			return;
		}

		const childList = getDirectChildList(destinationItem);

		if (childList instanceof HTMLUListElement) {
			childList.append(sourceItem);
			this.setItemExpanded(destinationItem, true);
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private clearDragTargetMarker(): void {
		if (this.dragTargetItem instanceof HTMLLIElement) {
			this.dragTargetItem.removeAttribute("data-drop-target");
		}

		this.dragTargetItem = null;
	}

	/**
	 * @summary Clears the tree's visual drop marker.
	 * @internal
	 */
	private clearDragState(): void {
		this.clearDragTargetMarker();
	}

	/**
	 * @summary API documentation summary.
	 * @param targetItem Parameter.
	 * @param withChildren Parameter.
	 * @internal
	 */
	private addItemToDom(targetItem: HTMLLIElement, withChildren: boolean): void {
		const targetHasChildren =
			getDirectChildList(targetItem) instanceof HTMLUListElement;

		const parentItem = targetHasChildren
			? targetItem
			: (targetItem.parentElement?.closest("li") ?? targetItem);

		let childList = getDirectChildList(parentItem);

		if (!(childList instanceof HTMLUListElement)) {
			childList = document.createElement("ul");
			parentItem.append(childList);
		}

		const item = document.createElement("li");
		item.textContent = withChildren ? "New node" : "New leaf";

		if (withChildren) {
			const ul = document.createElement("ul");
			const child = document.createElement("li");
			child.textContent = "New leaf";
			ul.append(child);
			item.append(ul);
		}

		childList.append(item);
		this.setItemExpanded(parentItem, true);
		this.enhanceTree();
		this.selectItem(item);
	}

	/**
	 * @summary API documentation summary.
	 * @param item Parameter.
	 * @internal
	 */
	private cloneItemInDom(item: HTMLLIElement): void {
		const clone = item.cloneNode(true);

		if (!(clone instanceof HTMLLIElement)) {
			return;
		}

		const label = getNodeLabel(item) ?? "Node";
		const cloneLabel = `${label} clone`;

		clone.setAttribute("data-label", cloneLabel);
		clone.removeAttribute("data-selected");
		clone.removeAttribute("data-drop-target");

		const row = getDirectRow(clone);

		if (row instanceof HTMLSpanElement) {
			const toggle = getDirectToggleButton(clone);

			for (const child of Array.from(row.childNodes)) {
				if (child !== toggle) {
					child.remove();
				}
			}

			row.append(document.createTextNode(cloneLabel));
		}

		for (const childItem of Array.from(clone.querySelectorAll("li"))) {
			if (childItem instanceof HTMLLIElement) {
				childItem.removeAttribute("data-selected");
				childItem.removeAttribute("data-drop-target");

				const childLabel = getNodeLabel(childItem);

				if (childLabel !== null) {
					childItem.setAttribute("data-label", childLabel);
				}
			}
		}

		item.parentElement?.insertBefore(clone, item.nextSibling);

		this.enhanceTree();
		this.selectItem(clone);
	}

	/**
	 * @summary Removes a node of its list parente.
	 * @param item Parameter.
	 * @internal
	 */
	private deleteItemFromDom(item: HTMLLIElement): void {
		if (item.parentElement instanceof HTMLUListElement) {
			item.remove();
		}
	}

	/**
	 * @summary API documentation summary.
	 * @param item Parameter.
	 * @returns Return value.
	 * @internal
	 */
	private getSortableItem(item: HTMLLIElement): HTMLLIElement | null {
		if (getDirectChildList(item) instanceof HTMLUListElement) {
			return item;
		}

		const parentItem = item.parentElement?.closest("li");
		return parentItem instanceof HTMLLIElement ? parentItem : null;
	}

	/**
	 * @summary API documentation summary.
	 * @param item Parameter.
	 * @internal
	 */
	private sortChildrenOfItem(item: HTMLLIElement): void {
		const childList = getDirectChildList(item);

		if (!(childList instanceof HTMLUListElement)) {
			return;
		}

		this.sortChildList(childList);
	}

	/**
	 * @summary API documentation summary.
	 * @param childList Parameter.
	 * @internal
	 */
	private sortChildList(childList: HTMLUListElement): void {
		const children = Array.from(childList.children).filter(
			(child): child is HTMLLIElement => child instanceof HTMLLIElement,
		);

		children.sort((left, right) => {
			const leftLabel = getNodeLabel(left) ?? "";
			const rightLabel = getNodeLabel(right) ?? "";

			return leftLabel.localeCompare(rightLabel, undefined, {
				sensitivity: "base",
				numeric: true,
			});
		});

		childList.append(...children);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private sortAllItems(): void {
		for (const childList of this.querySelectorAll<HTMLUListElement>(
			":scope > ul",
		)) {
			this.sortChildList(childList);
		}

		for (const item of this.getAllItems()) {
			this.sortChildrenOfItem(item);
		}
	}

	/**
	 * @summary API documentation summary.
	 * @param actions Parameter.
	 * @param scope Parameter.
	 * @param target Parameter.
	 * @param x Parameter.
	 * @param y Parameter.
	 * @internal
	 */
	private openContextMenu(
		actions: TpTreeContextAction[],
		scope: TpTreeContextScope,
		target: TpTreeNodeTarget | null,
		x: number,
		y: number,
	): void {
		this.closeContextMenu();

		const menu = document.createElement("div");
		menu.setAttribute("data-tp-tree-contextmenu", "");
		menu.style.left = `${String(x)}px`;
		menu.style.top = `${String(y)}px`;

		for (const action of actions) {
			if (action.separatorBefore) {
				const separator = document.createElement("div");
				separator.setAttribute("data-tp-tree-contextmenu-separator", "");
				menu.append(separator);
			}

			const button = document.createElement("button");
			button.type = "button";
			button.setAttribute("data-tp-tree-contextmenu-action", "");
			button.setAttribute("data-action-id", action.id);

			if (action.disabled) {
				button.disabled = true;
			}

			if (action.tone === "danger") {
				button.setAttribute("data-tone", "danger");
			}

			const label = document.createElement("span");
			label.setAttribute("data-tp-tree-contextmenu-label", "");
			label.textContent = action.label;
			button.append(label);

			if (
				typeof action.shortcutLabel === "string" &&
				action.shortcutLabel !== ""
			) {
				const shortcut = document.createElement("span");
				shortcut.setAttribute("data-tp-tree-contextmenu-shortcut", "");
				shortcut.textContent = action.shortcutLabel;
				button.append(shortcut);
			}

			button.addEventListener("click", () => {
				this.handleContextActionSelection(action.id, scope, target);
			});

			menu.append(button);
		}

		document.body.append(menu);

		const rect = menu.getBoundingClientRect();
		const nextLeft = Math.min(x, window.innerWidth - rect.width - 8);
		const nextTop = Math.min(y, window.innerHeight - rect.height - 8);

		menu.style.left = `${String(Math.max(8, nextLeft))}px`;
		menu.style.top = `${String(Math.max(8, nextTop))}px`;

		this.contextMenuEl = menu;
		this.openMenuState = { scope, target };

		this.dispatchEvent(
			new CustomEvent<TpTreeContextOpenDetail>("tp-tree-context-open", {
				bubbles: true,
				detail: {
					scope,
					target,
				},
			}),
		);
	}

	/**
	 * @summary API documentation summary.
	 * @param actionId Parameter.
	 * @param scope Parameter.
	 * @param target Parameter.
	 * @internal
	 */
	private handleContextActionSelection(
		actionId: string,
		scope: TpTreeContextScope,
		target: TpTreeNodeTarget | null,
	): void {
		this.dispatchEvent(
			new CustomEvent<TpTreeContextActionDetail>("tp-tree-context-action", {
				bubbles: true,
				detail: {
					actionId,
					scope,
					target,
				},
			}),
		);

		if (scope === "global") {
			this.handleGlobalContextAction(actionId);
			this.closeContextMenu();
			return;
		}

		if (target === null) {
			this.closeContextMenu();
			return;
		}

		this.handleNodeContextAction(actionId, target);
		this.closeContextMenu();
	}

	/**
	 * @summary API documentation summary.
	 * @param actionId Parameter.
	 * @internal
	 */
	private handleGlobalContextAction(actionId: string): void {
		switch (actionId) {
			case "expand-all":
				this.expandAll();
				break;
			case "collapse-all":
				this.collapseAll();
				break;
			case "sort-all":
				this.sortAllItems();
				break;
			case "toggle-guides":
				this.toggleGuides();
				break;
			default:
				break;
		}
	}

	/**
	 * @summary API documentation summary.
	 * @param actionId Parameter.
	 * @param target Parameter.
	 * @internal
	 */
	private handleNodeContextAction(
		actionId: string,
		target: TpTreeNodeTarget,
	): void {
		switch (actionId) {
			case "expand-all":
			case "collapse-all":
			case "sort-all":
			case "toggle-guides":
				this.handleGlobalContextAction(actionId);
				return;

			case "expand":
				this.expandNode(target.element);
				return;

			case "collapse":
				this.collapseNode(target.element);
				return;

			case "rename":
				this.beginRename(target.element);
				return;

			case "add-leaf":
				this.addItemToDom(target.element, false);
				this.dispatchEvent(
					new CustomEvent<TpTreeNodeAddRequestDetail>(
						"tp-tree-node-add-request",
						{
							bubbles: true,
							detail: {
								target,
								position: "inside",
								actionId,
							},
						},
					),
				);
				return;

			case "add-node":
				this.addItemToDom(target.element, true);
				this.dispatchEvent(
					new CustomEvent<TpTreeNodeAddRequestDetail>(
						"tp-tree-node-add-request",
						{
							bubbles: true,
							detail: {
								target,
								position: "inside",
								actionId,
							},
						},
					),
				);
				return;

			case "clone":
				this.dispatchEvent(
					new CustomEvent<TpTreeNodeCloneRequestDetail>(
						"tp-tree-node-clone-request",
						{
							bubbles: true,
							detail: {
								target,
							},
						},
					),
				);
				this.cloneItemInDom(target.element);
				return;

			case "delete":
				this.dispatchEvent(
					new CustomEvent<TpTreeNodeDeleteRequestDetail>(
						"tp-tree-node-delete-request",
						{
							bubbles: true,
							detail: {
								target,
							},
						},
					),
				);
				this.deleteItemFromDom(target.element);
				return;

			case "sort": {
				const sortableItem = this.getSortableItem(target.element);

				if (sortableItem !== null) {
					this.sortChildrenOfItem(sortableItem);
				}

				return;
			}

			default:
				return;
		}
	}
}

/**
 * @summary API documentation summary.
 */
if (!customElements.get("tp-tree")) {
	customElements.define("tp-tree", TpTree);
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
