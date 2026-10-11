import { t as e } from "./base.js";
import "./icon-button.js";
import "./dragdrop.js";
//#region src/components/tree/tree.css?inline
var t = "tp-tree{--tp-tree-toggle-size:1rem;--tp-tree-toggle-half-size:.5rem;--tp-tree-row-padding-block:.125rem;--tp-tree-guide-inline-start:calc(-.8rem + 1px);--tp-tree-guide-midline:calc(var(--tp-tree-row-padding-block,.125rem) + var(--tp-tree-toggle-half-size,.5rem));box-sizing:border-box;inline-size:100%;color:inherit;display:block;position:relative}tp-tree ul,tp-tree li{box-sizing:border-box;margin:0;padding:0}tp-tree ul{min-inline-size:0;list-style:none}tp-tree li{min-inline-size:0;display:block;position:relative}tp-tree li>[data-tp-tree-row]:hover{background:var(--tp-brand-fill-soft);color:var(--tp-brand-text-on-soft)}tp-tree [data-tp-tree-row]{inline-size:fit-content;min-inline-size:0;max-inline-size:100%;padding:var(--tp-tree-row-padding-block,.125rem) .25rem;border-radius:.25rem;align-items:center;gap:.35rem;line-height:1;display:flex}tp-tree tp-icon-button[data-tp-tree-toggle]{--tp-icon-button-size:var(--tp-tree-toggle-size,1rem);--tp-icon-button-icon-size:var(--tp-tree-toggle-size,1rem);--tp-icon-button-radius:0;--tp-icon-button-hover-background:transparent;flex:none;align-self:center;margin:0;padding:0;transform:translateY(-1px)}tp-tree tp-icon-button[data-tp-tree-toggle] tp-icon{inline-size:var(--tp-tree-toggle-size);block-size:var(--tp-tree-toggle-size)}tp-tree[selectable] li[data-selected]>[data-tp-tree-row]{background:color-mix(in oklab, currentColor 12%, transparent);outline:1px solid color-mix(in oklab, currentColor 25%, transparent)}tp-tree li>ul{margin-inline-start:1rem;padding-inline-start:.5rem}tp-tree[guides] li>ul{border-inline-start:none;margin-inline-start:.55rem;padding-inline-start:.9rem}tp-tree[guides] li>ul>li:before{content:\"\";inline-size:.8rem;block-size:var(--tp-tree-guide-midline,calc(var(--tp-tree-row-padding-block,.125rem) + var(--tp-tree-toggle-half-size,.5rem)));border-inline-start:1px solid color-mix(in oklab, currentColor 18%, transparent);border-block-end:1px solid color-mix(in oklab, currentColor 18%, transparent);position:absolute;inset-block-start:0;inset-inline-start:var(--tp-tree-guide-inline-start,calc(-.8rem + 1px))}tp-tree[guides] li>ul>li:not(:last-child):after{content:\"\";border-inline-start:1px solid color-mix(in oklab, currentColor 18%, transparent);position:absolute;inset-block-start:var(--tp-tree-guide-midline);inset-block-end:-.1rem;inset-inline-start:var(--tp-tree-guide-inline-start)}tp-tree li[draggable=true]>[data-tp-tree-row]{cursor:grab}tp-tree li[data-drop-target=before]>[data-tp-tree-row]{box-shadow:inset 0 2px 0 color-mix(in oklab, currentColor 45%, transparent)}tp-tree li[data-drop-target=inside]>[data-tp-tree-row]{outline:1px dashed color-mix(in oklab, currentColor 45%, transparent);background:color-mix(in oklab, currentColor 8%, transparent)}tp-tree li[data-drop-target=after]>[data-tp-tree-row]{box-shadow:inset 0 -2px 0 color-mix(in oklab, currentColor 45%, transparent)}[data-tp-tree-contextmenu]{z-index:1000;border:1px solid color-mix(in oklab, currentColor 18%, Canvas);color:canvastext;background:canvas;border-radius:.5rem;flex-direction:column;min-inline-size:12rem;max-inline-size:min(24rem,100vw - 1rem);padding:.25rem;display:flex;position:fixed;box-shadow:0 6px 18px #0000002e,0 2px 4px #00000014}[data-tp-tree-contextmenu-action]{appearance:none;color:inherit;cursor:pointer;text-align:start;inline-size:100%;font:inherit;background:0 0;border:none;border-radius:.35rem;justify-content:space-between;align-items:center;gap:1rem;padding:.45rem .6rem;display:flex}[data-tp-tree-contextmenu-action]:hover:not(:disabled){background:color-mix(in oklab, currentColor 10%, transparent)}[data-tp-tree-contextmenu-action]:disabled{opacity:.45;cursor:default}[data-tp-tree-contextmenu-action][data-tone=danger]{color:var(--tp-danger-seed)}[data-tp-tree-contextmenu-shortcut]{opacity:.65;white-space:nowrap;font-size:.875em}[data-tp-tree-contextmenu-separator]{background:color-mix(in oklab, currentColor 14%, transparent);block-size:1px;margin:.25rem 0}";
//#endregion
//#region src/components/tree/tree.ts
function n(e) {
	for (let t of Array.from(e.children)) if (t instanceof HTMLUListElement) return t;
	return null;
}
function r(e) {
	for (let t of Array.from(e.children)) if (t instanceof HTMLSpanElement && t.hasAttribute("data-tp-tree-row")) return t;
	return null;
}
function i(e) {
	let t = r(e);
	if (!(t instanceof HTMLSpanElement)) return null;
	for (let e of Array.from(t.children)) if (e instanceof HTMLElement && e.hasAttribute("data-tp-tree-toggle")) return e;
	return null;
}
function a(e) {
	let t = e.getAttribute("data-label");
	if (typeof t == "string" && t !== "") return t;
	let n = r(e);
	if (!(n instanceof HTMLSpanElement)) return null;
	let i = n.cloneNode(!0);
	if (!(i instanceof HTMLSpanElement)) return null;
	for (let e of Array.from(i.querySelectorAll("button"))) e.remove();
	for (let e of Array.from(i.querySelectorAll("[data-tp-tree-rename-input]"))) e.remove();
	let a = i.textContent?.trim() ?? "";
	return a === "" ? null : a;
}
function o(e) {
	let t = r(e);
	if (t instanceof HTMLSpanElement) return t;
	let i = document.createElement("span");
	i.setAttribute("data-tp-tree-row", "");
	let a = n(e), o = Array.from(e.childNodes).filter((e) => e !== a);
	for (let e of o) i.append(e);
	return a instanceof HTMLUListElement ? e.insertBefore(i, a) : e.append(i), i;
}
function s(e) {
	if (!(e instanceof HTMLElement)) return null;
	let t = e.closest("li");
	return t instanceof HTMLLIElement ? t : null;
}
function c(e) {
	for (let t of e.composedPath()) if (t instanceof HTMLLIElement) return t;
	return null;
}
function l(e) {
	for (let t of e.composedPath()) if (t instanceof HTMLElement && t.hasAttribute("data-tp-tree-toggle")) return t;
	return null;
}
function u(e, t) {
	return e instanceof HTMLElement && t instanceof Node && e.contains(t);
}
var d = class d extends e {
	static styleId = "tp-tree-styles";
	contextMenuConfig = null;
	selectedItem = null;
	contextMenuEl = null;
	openMenuState = null;
	dragController = null;
	dragTargetItem = null;
	mutationObserver = null;
	renamingItem = null;
	static get observedAttributes() {
		return [
			"selectable",
			"guides",
			"editable",
			"draggable",
			"level"
		];
	}
	get selectable() {
		return this.hasAttribute("selectable");
	}
	set selectable(e) {
		if (e) {
			this.setAttribute("selectable", "");
			return;
		}
		this.removeAttribute("selectable");
	}
	get guides() {
		return this.hasAttribute("guides");
	}
	set guides(e) {
		if (e) {
			this.setAttribute("guides", "");
			return;
		}
		this.removeAttribute("guides");
	}
	get editable() {
		return this.hasAttribute("editable");
	}
	set editable(e) {
		if (e) {
			this.setAttribute("editable", "");
			return;
		}
		this.removeAttribute("editable");
	}
	get draggableNodes() {
		return this.hasAttribute("draggable");
	}
	set draggableNodes(e) {
		if (e) {
			this.setAttribute("draggable", "");
			return;
		}
		this.removeAttribute("draggable");
	}
	get level() {
		let e = this.getAttribute("level");
		if (e === null) return 1;
		let t = Number(e);
		return Number.isInteger(t) && t >= 0 ? t : 1;
	}
	set level(e) {
		if (!Number.isInteger(e) || e < 0) throw TypeError("The \"level\" attribute must be an integer greater than or equal to 0.");
		this.setAttribute("level", String(e));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.enhanceTree(), this.ensureDragController(), this.observeMutations(), this.addEventListener("click", this.handleClick), this.addEventListener("dblclick", this.handleDoubleClick), this.addEventListener("contextmenu", this.handleContextMenu), document.addEventListener("click", this.handleDocumentClick, !0), document.addEventListener("keydown", this.handleDocumentKeyDown, !0), document.addEventListener("scroll", this.handleDocumentScroll, !0);
	}
	disconnectedCallback() {
		super.connectedCallback(), this.mutationObserver?.disconnect(), this.mutationObserver = null, this.closeContextMenu(), this.clearDragState(), this.dragController?.remove(), this.removeEventListener("click", this.handleClick), this.removeEventListener("dblclick", this.handleDoubleClick), this.removeEventListener("contextmenu", this.handleContextMenu), document.removeEventListener("click", this.handleDocumentClick, !0), document.removeEventListener("keydown", this.handleDocumentKeyDown, !0), document.removeEventListener("scroll", this.handleDocumentScroll, !0);
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "level" && this.resetLevelExpansionState(), this.enhanceTree());
	}
	setContextMenuConfig(e) {
		this.contextMenuConfig = e;
	}
	getSelectedItem() {
		return this.selectedItem;
	}
	expandAll() {
		for (let e of this.getAllItems()) n(e) instanceof HTMLUListElement && this.setItemExpanded(e, !0);
	}
	collapseAll() {
		for (let e of this.getAllItems()) n(e) instanceof HTMLUListElement && this.setItemExpanded(e, !1);
	}
	expandNode(e) {
		this.setItemExpanded(e, !0);
	}
	collapseNode(e) {
		this.setItemExpanded(e, !1);
	}
	sortNodeChildren(e) {
		this.sortChildrenOfItem(e);
	}
	sortAll() {
		this.sortAllItems();
	}
	toggleGuides() {
		this.guides = !this.guides;
	}
	openGlobalContextMenuAt(e, t) {
		let n = (this.contextMenuConfig ?? this.getDefaultContextMenuConfig()).globalActions.filter((e) => !e.hidden);
		n.length !== 0 && this.openContextMenu(n, "global", null, e, t);
	}
	openNodeContextMenuAt(e, t, n) {
		let r = this.contextMenuConfig ?? this.getDefaultContextMenuConfig(), i = this.getNodeTarget(e), a = typeof r.getNodeActions == "function" ? r.getNodeActions(i).filter((e) => !e.hidden) : [], o = r.globalActions.filter((e) => !e.hidden), s = [...a];
		if (a.length > 0 && o.length > 0) {
			let e = o.at(0);
			e !== void 0 && s.push({
				...e,
				separatorBefore: !0
			}), s.push(...o.slice(1));
		} else s.push(...o);
		s.length !== 0 && this.openContextMenu(s, "node", i, t, n);
	}
	closeContextMenu() {
		if (this.contextMenuEl instanceof HTMLDivElement && (this.contextMenuEl.remove(), this.contextMenuEl = null), this.openMenuState !== null) {
			let e = this.openMenuState.scope;
			this.openMenuState = null, this.dispatchEvent(new CustomEvent("tp-tree-context-close", {
				bubbles: !0,
				detail: { scope: e }
			}));
		}
	}
	beginRename(e) {
		let t = this.getNodeTarget(e);
		if (!this.getNodeCapabilities(t).renamable) return;
		let n = r(e);
		if (!(n instanceof HTMLSpanElement)) return;
		let a = n.querySelector("[data-tp-tree-rename-input]");
		if (a instanceof HTMLInputElement) {
			a.focus(), a.select();
			return;
		}
		let o = t.label ?? "", s = i(e), c = Array.from(n.childNodes).filter((e) => e !== s);
		if (c.length === 0) return;
		let l = document.createElement("span");
		l.setAttribute("data-tp-tree-rename-label", "");
		for (let e of c) l.append(e);
		n.append(l);
		let u = document.createElement("input");
		u.type = "text", u.value = o, u.setAttribute("data-tp-tree-rename-input", ""), l.replaceWith(u), this.renamingItem = e;
		let d = !1, f = (n) => {
			if (d || (d = !0, this.renamingItem !== e)) return;
			let r = u.value.trim(), i = n && r !== "" ? r : o, a = document.createElement("span");
			a.setAttribute("data-tp-tree-rename-label", ""), a.textContent = i, u.parentNode !== null && u.replaceWith(a), e.setAttribute("data-label", i), this.renamingItem = null, n && r !== "" && r !== o && this.dispatchEvent(new CustomEvent("tp-tree-node-rename-request", {
				bubbles: !0,
				detail: {
					target: t,
					oldLabel: o,
					newLabel: r
				}
			}));
		};
		u.addEventListener("keydown", (e) => {
			if (e instanceof KeyboardEvent) {
				if (e.key === "Enter") {
					e.preventDefault(), f(!0);
					return;
				}
				e.key === "Escape" && (e.preventDefault(), f(!1));
			}
		}), u.addEventListener("blur", () => {
			f(!0);
		}), u.focus(), u.select();
	}
	getDefaultContextMenuConfig() {
		return {
			globalActions: [
				{
					id: "expand-all",
					label: "Expand all"
				},
				{
					id: "collapse-all",
					label: "Collapse all"
				},
				{
					id: "sort-all",
					label: "Sort all"
				},
				{
					id: "toggle-guides",
					label: "Toggle guides"
				}
			],
			getNodeActions: () => this.editable ? [
				{
					id: "add-leaf",
					label: "Add leaf"
				},
				{
					id: "add-node",
					label: "Add node"
				},
				{
					id: "clone",
					label: "Clone"
				},
				{
					id: "rename",
					label: "Rename"
				},
				{
					id: "sort",
					label: "Sort"
				},
				{
					id: "delete",
					label: "Delete",
					tone: "danger"
				}
			] : [],
			getNodeCapabilities: () => ({
				renamable: this.editable,
				addable: this.editable,
				clonable: this.editable,
				deletable: this.editable,
				draggable: this.draggableNodes,
				droppable: this.draggableNodes
			})
		};
	}
	handleClick = (e) => {
		if (u(this.contextMenuEl, e.target)) return;
		let t = l(e);
		if (t instanceof HTMLElement) {
			let e = s(t);
			e instanceof HTMLLIElement && this.setItemExpanded(e, e.getAttribute("data-expanded") !== "true");
			return;
		}
		let n = c(e);
		!(n instanceof HTMLLIElement) || !this.selectable || this.selectItem(n);
	};
	handleDoubleClick = (e) => {
		let t = c(e);
		if (!(t instanceof HTMLLIElement) || !(n(t) instanceof HTMLUListElement)) return;
		let r = t.getAttribute("data-expanded") === "true";
		this.setItemExpanded(t, !r);
	};
	handleContextMenu = (e) => {
		e.preventDefault();
		let t = c(e);
		if (t instanceof HTMLLIElement) {
			this.openNodeContextMenuAt(t, e.clientX, e.clientY);
			return;
		}
		this.openGlobalContextMenuAt(e.clientX, e.clientY);
	};
	ensureDragController() {
		if (this.dragController === null) {
			let e = document.createElement("tp-dragdrop");
			e.setAttribute("data-tp-tree-dragdrop", ""), e.adapter = {
				root: this,
				getItem: (e) => {
					let t = c(e);
					return t instanceof HTMLLIElement && t.closest("tp-tree") === this ? t : null;
				},
				canStart: (e) => {
					let t = c(e);
					return t instanceof HTMLLIElement && t.closest("tp-tree") === this && e.dataTransfer !== null && this.getNodeCapabilities(this.getNodeTarget(t)).draggable === !0;
				},
				canDrop: (e) => e instanceof HTMLLIElement && e.closest("tp-tree") === this && (e === this.getRootItem() || this.getNodeCapabilities(this.getNodeTarget(e)).droppable === !0),
				getPosition: (e, t) => this.getEffectiveDropPosition(t, this.getDropPosition(t, e.clientY)),
				getData: (e) => this.getNodeTarget(e).nodeId ?? ""
			}, e.addEventListener("tp-dragdrop-over", this.handleControllerOver), e.addEventListener("tp-dragdrop-drop", this.handleControllerDrop), e.addEventListener("tp-dragdrop-end", this.handleControllerEnd), this.dragController = e;
		}
		this.dragController.parentElement !== this && this.append(this.dragController);
	}
	handleControllerOver = (e) => {
		let { target: t, position: n } = e.detail;
		t instanceof HTMLLIElement && n !== null && this.applyDragTarget(t, n);
	};
	handleControllerDrop = (e) => {
		let { source: t, target: n, position: r } = e.detail;
		if (!(t instanceof HTMLLIElement) || !(n instanceof HTMLLIElement) || t === n || t.contains(n)) {
			this.clearDragState();
			return;
		}
		let i = this.getEffectiveDropPosition(n, r ?? "inside"), a = this.getNodeTarget(t), o = this.getNodeTarget(n);
		this.moveItemInDom(t, n, i), this.dispatchEvent(new CustomEvent("tp-tree-node-move-request", {
			bubbles: !0,
			detail: {
				source: a,
				destination: o,
				position: i
			}
		})), this.enhanceTree(), this.clearDragState();
	};
	handleControllerEnd = () => {
		this.clearDragState();
	};
	handleDocumentClick = (e) => {
		u(this.contextMenuEl, e.target) || this.closeContextMenu();
	};
	handleDocumentKeyDown = (e) => {
		e instanceof KeyboardEvent && e.key === "Escape" && this.closeContextMenu();
	};
	handleDocumentScroll = () => {
		this.closeContextMenu();
	};
	ensureStyles() {
		if (document.getElementById(d.styleId)) return;
		let e = document.createElement("style");
		e.id = d.styleId, e.textContent = t, document.head.append(e);
	}
	observeMutations() {}
	getAllItems() {
		return Array.from(this.querySelectorAll("li")).filter((e) => e instanceof HTMLLIElement);
	}
	getRootItem() {
		let e = this.querySelector(":scope > ul");
		if (!(e instanceof HTMLUListElement)) return null;
		let t = e.querySelector(":scope > li");
		return t instanceof HTMLLIElement ? t : null;
	}
	getItemLevel(e) {
		let t = 1, n = e.parentElement?.closest("li");
		for (; n instanceof HTMLLIElement && this.contains(n);) t += 1, n = n.parentElement?.closest("li") ?? null;
		return t;
	}
	resetLevelExpansionState() {
		for (let e of this.getAllItems()) e.getAttribute("data-tp-tree-level-expanded") === "true" && (e.removeAttribute("data-expanded"), e.removeAttribute("data-tp-tree-level-expanded"));
	}
	enhanceTree() {
		for (let e of this.getAllItems()) {
			let t = o(e), r = n(e), a = this.getNodeTarget(e), s = this.getNodeCapabilities(a);
			if (e.setAttribute("data-tp-tree-item", ""), s.draggable ? e.setAttribute("draggable", "true") : e.removeAttribute("draggable"), r instanceof HTMLUListElement) {
				let n = i(e);
				n instanceof HTMLElement || (n = document.createElement("tp-icon-button"), n.setAttribute("data-tp-tree-toggle", ""), n.setAttribute("library", "tp"), n.setAttribute("size", "xxs"), n.setAttribute("name", "plus-box-outline"), n.setAttribute("label", "Toggle node"), t.prepend(n));
				let r = e.getAttribute("data-expanded"), a = r === null ? this.getItemLevel(e) <= this.level : r === "true";
				this.setItemExpanded(e, a), r === null && e.setAttribute("data-tp-tree-level-expanded", "true");
			} else i(e)?.remove(), e.removeAttribute("data-expanded"), e.removeAttribute("data-tp-tree-level-expanded");
		}
		this.selectedItem instanceof HTMLLIElement && !this.contains(this.selectedItem) && (this.selectedItem = null), this.updateSelectionDom();
	}
	getNodeTarget(e) {
		let t = n(e);
		return {
			element: e,
			nodeId: e.getAttribute("data-node-id") ?? e.getAttribute("data-path"),
			kind: e.getAttribute("data-kind"),
			label: a(e),
			hasChildren: t instanceof HTMLUListElement,
			expanded: e.getAttribute("data-expanded") === "true"
		};
	}
	getNodeCapabilities(e) {
		let t = this.contextMenuConfig ?? this.getDefaultContextMenuConfig();
		return typeof t.getNodeCapabilities == "function" ? t.getNodeCapabilities(e) : {};
	}
	selectItem(e) {
		this.selectedItem = e, this.updateSelectionDom(), this.dispatchEvent(new CustomEvent("tp-tree-select", {
			bubbles: !0,
			detail: { target: this.getNodeTarget(e) }
		}));
	}
	updateSelectionDom() {
		for (let e of this.getAllItems()) e === this.selectedItem ? e.setAttribute("data-selected", "") : e.removeAttribute("data-selected");
	}
	setItemExpanded(e, t) {
		let r = n(e), a = i(e);
		if (r instanceof HTMLUListElement && (e.setAttribute("data-expanded", t ? "true" : "false"), r.hidden = !t, a instanceof HTMLElement)) {
			a.setAttribute("aria-expanded", String(t)), a.setAttribute("name", t ? "minus-box-outline" : "plus-box-outline");
			let e = a.querySelector("button");
			e instanceof HTMLButtonElement && e.setAttribute("aria-expanded", String(t));
		}
	}
	getDropPosition(e, t) {
		let n = e.getBoundingClientRect(), r = t - n.top, i = n.height * .15, a = n.height * .85;
		return r <= i ? "before" : r >= a ? "after" : "inside";
	}
	getEffectiveDropPosition(e, t) {
		return e === this.getRootItem() ? "inside" : !(n(e) instanceof HTMLUListElement) && t === "inside" ? "after" : t;
	}
	applyDragTarget(e, t) {
		this.clearDragTargetMarker(), this.dragTargetItem = e, e.setAttribute("data-drop-target", t);
	}
	moveItemInDom(e, t, r) {
		if (e === t || e.contains(t)) return;
		if (r === "before") {
			t.parentElement?.insertBefore(e, t);
			return;
		}
		if (r === "after") {
			t.parentElement?.insertBefore(e, t.nextSibling);
			return;
		}
		let i = n(t);
		i instanceof HTMLUListElement && (i.append(e), this.setItemExpanded(t, !0));
	}
	clearDragTargetMarker() {
		this.dragTargetItem instanceof HTMLLIElement && this.dragTargetItem.removeAttribute("data-drop-target"), this.dragTargetItem = null;
	}
	clearDragState() {
		this.clearDragTargetMarker();
	}
	addItemToDom(e, t) {
		let r = n(e) instanceof HTMLUListElement ? e : e.parentElement?.closest("li") ?? e, i = n(r);
		i instanceof HTMLUListElement || (i = document.createElement("ul"), r.append(i));
		let a = document.createElement("li");
		if (a.textContent = t ? "New node" : "New leaf", t) {
			let e = document.createElement("ul"), t = document.createElement("li");
			t.textContent = "New leaf", e.append(t), a.append(e);
		}
		i.append(a), this.setItemExpanded(r, !0), this.enhanceTree(), this.selectItem(a);
	}
	cloneItemInDom(e) {
		let t = e.cloneNode(!0);
		if (!(t instanceof HTMLLIElement)) return;
		let n = `${a(e) ?? "Node"} clone`;
		t.setAttribute("data-label", n), t.removeAttribute("data-selected"), t.removeAttribute("data-drop-target");
		let o = r(t);
		if (o instanceof HTMLSpanElement) {
			let e = i(t);
			for (let t of Array.from(o.childNodes)) t !== e && t.remove();
			o.append(document.createTextNode(n));
		}
		for (let e of Array.from(t.querySelectorAll("li"))) if (e instanceof HTMLLIElement) {
			e.removeAttribute("data-selected"), e.removeAttribute("data-drop-target");
			let t = a(e);
			t !== null && e.setAttribute("data-label", t);
		}
		e.parentElement?.insertBefore(t, e.nextSibling), this.enhanceTree(), this.selectItem(t);
	}
	deleteItemFromDom(e) {
		e.parentElement instanceof HTMLUListElement && e.remove();
	}
	getSortableItem(e) {
		if (n(e) instanceof HTMLUListElement) return e;
		let t = e.parentElement?.closest("li");
		return t instanceof HTMLLIElement ? t : null;
	}
	sortChildrenOfItem(e) {
		let t = n(e);
		t instanceof HTMLUListElement && this.sortChildList(t);
	}
	sortChildList(e) {
		let t = Array.from(e.children).filter((e) => e instanceof HTMLLIElement);
		t.sort((e, t) => {
			let n = a(e) ?? "", r = a(t) ?? "";
			return n.localeCompare(r, void 0, {
				sensitivity: "base",
				numeric: !0
			});
		}), e.append(...t);
	}
	sortAllItems() {
		for (let e of this.querySelectorAll(":scope > ul")) this.sortChildList(e);
		for (let e of this.getAllItems()) this.sortChildrenOfItem(e);
	}
	openContextMenu(e, t, n, r, i) {
		this.closeContextMenu();
		let a = document.createElement("div");
		a.setAttribute("data-tp-tree-contextmenu", ""), a.style.left = `${String(r)}px`, a.style.top = `${String(i)}px`;
		for (let r of e) {
			if (r.separatorBefore) {
				let e = document.createElement("div");
				e.setAttribute("data-tp-tree-contextmenu-separator", ""), a.append(e);
			}
			let e = document.createElement("button");
			e.type = "button", e.setAttribute("data-tp-tree-contextmenu-action", ""), e.setAttribute("data-action-id", r.id), r.disabled && (e.disabled = !0), r.tone === "danger" && e.setAttribute("data-tone", "danger");
			let i = document.createElement("span");
			if (i.setAttribute("data-tp-tree-contextmenu-label", ""), i.textContent = r.label, e.append(i), typeof r.shortcutLabel == "string" && r.shortcutLabel !== "") {
				let t = document.createElement("span");
				t.setAttribute("data-tp-tree-contextmenu-shortcut", ""), t.textContent = r.shortcutLabel, e.append(t);
			}
			e.addEventListener("click", () => {
				this.handleContextActionSelection(r.id, t, n);
			}), a.append(e);
		}
		document.body.append(a);
		let o = a.getBoundingClientRect(), s = Math.min(r, window.innerWidth - o.width - 8), c = Math.min(i, window.innerHeight - o.height - 8);
		a.style.left = `${String(Math.max(8, s))}px`, a.style.top = `${String(Math.max(8, c))}px`, this.contextMenuEl = a, this.openMenuState = {
			scope: t,
			target: n
		}, this.dispatchEvent(new CustomEvent("tp-tree-context-open", {
			bubbles: !0,
			detail: {
				scope: t,
				target: n
			}
		}));
	}
	handleContextActionSelection(e, t, n) {
		if (this.dispatchEvent(new CustomEvent("tp-tree-context-action", {
			bubbles: !0,
			detail: {
				actionId: e,
				scope: t,
				target: n
			}
		})), t === "global") {
			this.handleGlobalContextAction(e), this.closeContextMenu();
			return;
		}
		if (n === null) {
			this.closeContextMenu();
			return;
		}
		this.handleNodeContextAction(e, n), this.closeContextMenu();
	}
	handleGlobalContextAction(e) {
		switch (e) {
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
			default: break;
		}
	}
	handleNodeContextAction(e, t) {
		switch (e) {
			case "expand-all":
			case "collapse-all":
			case "sort-all":
			case "toggle-guides":
				this.handleGlobalContextAction(e);
				return;
			case "expand":
				this.expandNode(t.element);
				return;
			case "collapse":
				this.collapseNode(t.element);
				return;
			case "rename":
				this.beginRename(t.element);
				return;
			case "add-leaf":
				this.addItemToDom(t.element, !1), this.dispatchEvent(new CustomEvent("tp-tree-node-add-request", {
					bubbles: !0,
					detail: {
						target: t,
						position: "inside",
						actionId: e
					}
				}));
				return;
			case "add-node":
				this.addItemToDom(t.element, !0), this.dispatchEvent(new CustomEvent("tp-tree-node-add-request", {
					bubbles: !0,
					detail: {
						target: t,
						position: "inside",
						actionId: e
					}
				}));
				return;
			case "clone":
				this.dispatchEvent(new CustomEvent("tp-tree-node-clone-request", {
					bubbles: !0,
					detail: { target: t }
				})), this.cloneItemInDom(t.element);
				return;
			case "delete":
				this.dispatchEvent(new CustomEvent("tp-tree-node-delete-request", {
					bubbles: !0,
					detail: { target: t }
				})), this.deleteItemFromDom(t.element);
				return;
			case "sort": {
				let e = this.getSortableItem(t.element);
				e !== null && this.sortChildrenOfItem(e);
				return;
			}
			default: return;
		}
	}
};
customElements.get("tp-tree") || customElements.define("tp-tree", d);
//#endregion
export { d as t };

//# sourceMappingURL=tree.js.map