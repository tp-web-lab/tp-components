import { t as e } from "./base.js";
import "./icon.js";
import "./tree.js";
//#region src/components/file-tree/file-tree.css?inline
var t = "tp-file-tree{font-family:system-ui,sans-serif;display:block}tp-file-tree [data-tp-file-tree-row]{align-items:center;gap:.35rem;display:inline-flex}tp-file-tree [data-tp-file-tree-icon]{inline-size:var(--tp-file-tree-icon-size,1rem);block-size:var(--tp-file-tree-icon-size,1rem);flex:none}tp-file-tree [data-tp-file-tree-label]{text-overflow:ellipsis;white-space:nowrap;min-inline-size:0;overflow:hidden}tp-file-tree li[data-active-path]>[data-tp-tree-row],tp-file-tree li[data-active-path]>[data-tp-file-tree-row]{color:var(--tp-file-tree-active-color,inherit);font-weight:600}tp-file-tree li[data-active-path]>[data-tp-tree-row]{opacity:.9;text-decoration:underline;text-decoration-thickness:1px}tp-file-tree li[data-selected-path]>[data-tp-tree-row],tp-file-tree li[data-selected-path]>[data-tp-file-tree-row]{background:var(--tp-file-tree-selected-bg,color-mix(in srgb, currentColor 8%, transparent))}tp-file-tree li[data-open-path]>[data-tp-tree-row],tp-file-tree li[data-open-path]>[data-tp-file-tree-row]{color:var(--tp-file-tree-open-color,inherit)}tp-file-tree li[data-selected-path]:not([data-active-path])>[data-tp-tree-row],tp-file-tree li[data-selected-path]:not([data-active-path])>[data-tp-file-tree-row]{background:var(--tp-file-tree-selected-bg,color-mix(in srgb, currentColor 10%, transparent))}tp-file-tree li[data-active-path]>[data-tp-tree-row],tp-file-tree li[data-active-path]>[data-tp-file-tree-row]{background:0 0;text-decoration:underline}tp-file-tree li[data-dirty-path] [data-tp-file-tree-label]:after{color:var(--tp-file-tree-dirty-color,#d97706);content:\"●\";margin-inline-start:.35rem;font-size:.7em}";
//#endregion
//#region src/components/file-tree/file-tree.ts
function n(e) {
	return e.kind === "directory";
}
function r(e, t) {
	return e.kind === t.kind ? e.name.localeCompare(t.name, void 0, {
		sensitivity: "base",
		numeric: !0
	}) : e.kind === "directory" ? -1 : 1;
}
function i(e) {
	return {
		...e,
		children: e.children.map((e) => i(e)).sort(r)
	};
}
function a(e) {
	return [...e].map((e) => i(e)).sort(r);
}
function o(e) {
	let t = e.toLowerCase();
	return t.endsWith(".abc") ? "file_type_abc" : t.endsWith(".adoc") || t.endsWith(".asciidoc") ? "file_type_asciidoc" : t.endsWith(".html") || t.endsWith(".htm") ? "file_type_html" : t.endsWith(".js") || t.endsWith(".mjs") || t.endsWith(".cjs") ? "file_type_javascript" : t.endsWith(".ts") || t.endsWith(".tsx") ? "file_type_typescript" : t.endsWith(".css") ? "file_type_css" : t.endsWith(".json") ? "file_type_json" : t.endsWith(".md") ? "file_type_markdown" : t.endsWith(".pl") || t.endsWith(".prolog") ? "file_type_prolog" : t.endsWith(".py") ? "file_type_python" : t.endsWith(".rst") || t.endsWith(".rest") ? "file_type_restructuredtext" : t.endsWith(".sql") ? "file_type_sql" : "file_type_default";
}
var s = {
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
			id: "toggle-guides",
			label: "Toggle guides"
		}
	],
	getNodeActions: (e) => e.kind === "directory" ? [
		{
			id: "add-leaf",
			label: "Add file"
		},
		{
			id: "add-node",
			label: "Add folder"
		},
		{
			id: "clone",
			label: "Clone"
		},
		{
			id: "copy",
			label: "Copy path"
		},
		{
			id: "rename",
			label: "Rename"
		},
		{
			id: "delete",
			label: "Delete",
			tone: "danger"
		}
	] : e.kind === "file" ? [
		{
			id: "clone",
			label: "Clone"
		},
		{
			id: "copy",
			label: "Copy path"
		},
		{
			id: "rename",
			label: "Rename"
		},
		{
			id: "delete",
			label: "Delete",
			tone: "danger"
		}
	] : [],
	getNodeCapabilities: (e) => ({
		renamable: e.nodeId !== "/",
		draggable: e.nodeId !== "/",
		droppable: e.kind === "directory",
		addable: e.kind === "directory",
		clonable: e.nodeId !== "/",
		deletable: e.nodeId !== "/"
	})
}, c = class r extends e {
	static styleId = "tp-file-tree-styles";
	nodes = [];
	selectedPath = null;
	activePath = null;
	openPaths = /* @__PURE__ */ new Set();
	dirtyPaths = /* @__PURE__ */ new Set();
	treeEl = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.render(), this.bindEvents();
	}
	disconnectedCallback() {
		super.connectedCallback(), this.unbindEvents();
	}
	setState(e) {
		this.nodes = a(e.nodes), this.selectedPath = e.selectedPath ?? null, this.activePath = e.activePath ?? null, this.openPaths.clear();
		for (let t of e.openPaths ?? []) this.openPaths.add(t);
		this.dirtyPaths.clear();
		for (let t of e.dirtyPaths ?? []) this.dirtyPaths.add(t);
		this.render(), this.bindEvents(), this.treeEl?.expandAll();
	}
	setNodes(e) {
		this.setState({
			nodes: e,
			selectedPath: this.selectedPath,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths)
		});
	}
	getNodes() {
		return this.nodes.map((e) => i(e));
	}
	setSelectedPath(e) {
		this.setState({
			nodes: this.nodes,
			selectedPath: e,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths)
		});
	}
	setActivePath(e) {
		this.setState({
			nodes: this.nodes,
			selectedPath: this.selectedPath,
			activePath: e,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths)
		});
	}
	setOpenPaths(e) {
		this.setState({
			nodes: this.nodes,
			selectedPath: this.selectedPath,
			activePath: this.activePath,
			openPaths: e,
			dirtyPaths: Array.from(this.dirtyPaths)
		});
	}
	setDirtyPaths(e) {
		this.setState({
			nodes: this.nodes,
			selectedPath: this.selectedPath,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: e
		});
	}
	expandAll() {
		this.treeEl?.expandAll();
	}
	collapseAll() {
		this.treeEl?.collapseAll();
	}
	beginRenamePath(e) {
		let t = e.trim();
		if (t === "") return;
		let n = this.querySelector(`li[data-node-id="${CSS.escape(t)}"]`);
		n instanceof HTMLLIElement && this.treeEl?.beginRename(n);
	}
	ensureStyles() {
		if (document.getElementById(r.styleId)) return;
		let e = document.createElement("style");
		e.id = r.styleId, e.textContent = t, document.head.append(e);
	}
	bindEvents() {
		this.unbindEvents(), this.treeEl?.addEventListener("tp-tree-select", this.handleTreeSelect), this.treeEl?.addEventListener("tp-tree-context-action", this.handleTreeContextAction), this.treeEl?.addEventListener("tp-tree-node-add-request", this.handleTreeAddRequest), this.treeEl?.addEventListener("tp-tree-node-clone-request", this.handleTreeCloneRequest), this.treeEl?.addEventListener("tp-tree-node-delete-request", this.handleTreeDeleteRequest), this.treeEl?.addEventListener("tp-tree-node-rename-request", this.handleTreeRenameRequest), this.treeEl?.addEventListener("tp-tree-node-move-request", this.handleTreeMoveRequest);
	}
	unbindEvents() {
		this.treeEl?.removeEventListener("tp-tree-select", this.handleTreeSelect), this.treeEl?.removeEventListener("tp-tree-context-action", this.handleTreeContextAction), this.treeEl?.removeEventListener("tp-tree-node-add-request", this.handleTreeAddRequest), this.treeEl?.removeEventListener("tp-tree-node-clone-request", this.handleTreeCloneRequest), this.treeEl?.removeEventListener("tp-tree-node-delete-request", this.handleTreeDeleteRequest), this.treeEl?.removeEventListener("tp-tree-node-rename-request", this.handleTreeRenameRequest), this.treeEl?.removeEventListener("tp-tree-node-move-request", this.handleTreeMoveRequest);
	}
	handleTreeSelect = (e) => {
		let { target: t } = e.detail, n = t.nodeId;
		typeof n != "string" || n === "" || (this.selectedPath = n, this.dispatchEvent(new CustomEvent("tp-file-tree-select", {
			bubbles: !0,
			detail: { path: n }
		})), t.kind === "file" && (this.activePath = n, this.openPaths.add(n), this.dispatchEvent(new CustomEvent("tp-file-tree-active", {
			bubbles: !0,
			detail: { path: n }
		})), this.dispatchEvent(new CustomEvent("tp-file-tree-open", {
			bubbles: !0,
			detail: { path: n }
		}))));
	};
	handleTreeContextAction = (e) => {
		if (e.detail.scope === "global") {
			this.handleGlobalContextAction(e.detail.actionId);
			return;
		}
		if (e.detail.actionId !== "copy") return;
		let t = e.detail.target?.nodeId;
		typeof t != "string" || t === "" || this.dispatchEvent(new CustomEvent("tp-file-tree-copy-request", {
			bubbles: !0,
			detail: { path: t }
		}));
	};
	handleGlobalContextAction(e) {
		e !== "expand-all" && e !== "collapse-all" && e !== "toggle-guides" || this.dispatchEvent(new CustomEvent("tp-file-tree-global-action", {
			bubbles: !0,
			detail: { actionId: e }
		}));
	}
	handleTreeAddRequest = (e) => {
		let t = e.detail.target?.nodeId !== null && typeof e.detail.target?.nodeId == "string" ? e.detail.target.nodeId : null, n = e.detail.actionId === "add-node" ? "directory" : "file";
		this.dispatchEvent(new CustomEvent("tp-file-tree-add-request", {
			bubbles: !0,
			detail: {
				path: t,
				kind: n
			}
		}));
	};
	handleTreeCloneRequest = (e) => {
		let t = e.detail.target.nodeId;
		typeof t != "string" || t === "" || this.dispatchEvent(new CustomEvent("tp-file-tree-clone-request", {
			bubbles: !0,
			detail: { path: t }
		}));
	};
	handleTreeDeleteRequest = (e) => {
		let t = e.detail.target.nodeId;
		typeof t != "string" || t === "" || this.dispatchEvent(new CustomEvent("tp-file-tree-delete-request", {
			bubbles: !0,
			detail: { path: t }
		}));
	};
	handleTreeRenameRequest = (e) => {
		let t = e.detail.target.nodeId;
		typeof t != "string" || t === "" || this.dispatchEvent(new CustomEvent("tp-file-tree-rename-request", {
			bubbles: !0,
			detail: {
				path: t,
				newName: e.detail.newLabel
			}
		}));
	};
	handleTreeMoveRequest = (e) => {
		let t = e.detail.source.nodeId, n = e.detail.destination?.nodeId ?? null;
		typeof t != "string" || t === "" || this.dispatchEvent(new CustomEvent("tp-file-tree-move-request", {
			bubbles: !0,
			detail: {
				sourcePath: t,
				destinationPath: n,
				position: e.detail.position
			}
		}));
	};
	render() {
		this.unbindEvents(), this.innerHTML = "";
		let e = document.createElement("tp-tree");
		e.setAttribute("selectable", ""), e.setAttribute("guides", ""), e.setContextMenuConfig(s);
		let t = document.createElement("ul");
		t.append(this.renderRootNode()), e.append(t), this.append(e), this.treeEl = e, this.bindEvents(), e.expandAll();
	}
	renderRootNode() {
		let e = {
			kind: "directory",
			name: "/",
			path: "/",
			children: this.nodes
		};
		return this.renderNode(e, !0);
	}
	renderNode(e, t = !1) {
		let r = document.createElement("li");
		r.setAttribute("data-node-id", e.path), r.setAttribute("data-kind", e.kind), r.setAttribute("data-label", e.name), this.selectedPath === e.path && r.setAttribute("data-selected-path", ""), this.activePath === e.path && r.setAttribute("data-active-path", ""), this.openPaths.has(e.path) && r.setAttribute("data-open-path", ""), this.dirtyPaths.has(e.path) && r.setAttribute("data-dirty-path", "");
		let i = document.createElement("span");
		if (i.setAttribute("data-tp-file-tree-row", ""), t) {
			let e = document.createElement("span");
			e.setAttribute("data-tp-file-tree-label", ""), e.textContent = "/", i.append(e);
		} else {
			if (!n(e)) {
				let t = o(e.path);
				if (t !== null) {
					let e = document.createElement("tp-icon");
					e.setAttribute("library", "languages"), e.setAttribute("name", t), e.setAttribute("fallback-icon", "crosshairs-unknown"), e.setAttribute("data-tp-file-tree-icon", ""), i.append(e);
				}
			}
			let t = document.createElement("span");
			t.setAttribute("data-tp-file-tree-label", ""), t.textContent = e.name, i.append(t);
		}
		if (r.append(i), e.children.length > 0) {
			let t = document.createElement("ul");
			for (let n of e.children) t.append(this.renderNode(n));
			r.append(t);
		}
		return r;
	}
};
customElements.get("tp-file-tree") || customElements.define("tp-file-tree", c);
//#endregion
export { c as t };

//# sourceMappingURL=file-tree.js.map