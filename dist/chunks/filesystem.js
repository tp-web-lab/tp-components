import { t as e } from "./base.js";
import "./file-tree.js";
//#region src/components/filesystem/filesystem.css?inline
var t = "tp-filesystem{font-family:var(--tp-font-family,system-ui, sans-serif);font-size:var(--tp-font-size,1rem);line-height:var(--tp-line-height,1.5);display:block}";
//#endregion
//#region src/components/filesystem/filesystem.ts
function n(e) {
	let t = e.trim().replaceAll("\\", "/");
	return t === "" || t === "/" ? "/untitled.txt" : t.startsWith("/") ? t : `/${t}`;
}
function r(e) {
	return e.split("/").filter(Boolean).at(-1) ?? e;
}
function i(e) {
	let t = n(e).split("/").filter(Boolean);
	return t.pop(), t.length === 0 ? "/" : `/${t.join("/")}`;
}
function a(e, t) {
	let r = t.trim().replaceAll("\\", "/").replace(/^\/+/, "");
	return e === null || e === "/" ? `/${r}` : `${n(e).replace(/\/$/, "")}/${r}`;
}
function o(e) {
	return {
		path: n(e.path),
		content: e.content,
		language: e.language,
		readonly: e.readonly
	};
}
function s(e) {
	return e.map((e) => o(e));
}
function c(e) {
	return {
		kind: "directory",
		name: r(e),
		path: e,
		children: []
	};
}
function l(e) {
	return {
		kind: "file",
		name: r(e.path),
		path: e.path,
		children: []
	};
}
function u(e, t) {
	return e.find((e) => e.path === t);
}
function d(e) {
	let t = [];
	for (let r of e) {
		let e = n(r.path).split("/").filter(Boolean), i = t, a = "";
		for (let [t, n] of e.entries()) {
			if (a = `${a}/${n}`, t === e.length - 1) {
				u(i, a) === void 0 && i.push(l({
					...r,
					path: a
				}));
				continue;
			}
			let o = u(i, a);
			o === void 0 && (o = c(a), i.push(o)), i = o.children;
		}
	}
	return t;
}
var f = class c extends e {
	static styleId = "tp-filesystem-styles";
	files = [];
	activePath = null;
	openPaths = /* @__PURE__ */ new Set();
	dirtyPaths = /* @__PURE__ */ new Set();
	treeEl = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(c.styleId, t), this.ensureTree(), this.syncTree();
	}
	disconnectedCallback() {
		this.unbindTreeEvents();
	}
	setFiles(e) {
		this.files = s(e), this.pruneState(), this.syncTree(), this.dispatchChange();
	}
	getFiles() {
		return s(this.files);
	}
	setState(e) {
		this.files = s(e.files), this.activePath = e.activePath ?? null, this.openPaths.clear();
		for (let t of e.openPaths ?? []) this.openPaths.add(n(t));
		this.dirtyPaths.clear();
		for (let t of e.dirtyPaths ?? []) this.dirtyPaths.add(n(t));
		this.pruneState(), this.syncTree(), this.dispatchChange();
	}
	getState() {
		return {
			files: this.getFiles(),
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths)
		};
	}
	readFile(e) {
		let t = n(e);
		return this.files.find((e) => e.path === t)?.content ?? null;
	}
	writeFile(e, t) {
		let r = n(e), i = this.files.find((e) => e.path === r);
		i === void 0 || i.readonly === !0 || (i.content = t, this.dirtyPaths.add(r), this.dispatchEvent(new CustomEvent("tp-filesystem-write", {
			bubbles: !0,
			detail: {
				path: r,
				content: t
			}
		})), this.syncTree(), this.dispatchChange());
	}
	addFile(e) {
		let t = o(e);
		this.files.some((e) => e.path === t.path) || (this.files = [...this.files, t], this.dispatchEvent(new CustomEvent("tp-filesystem-add", {
			bubbles: !0,
			detail: { path: t.path }
		})), this.syncTree(), this.dispatchChange());
	}
	deleteFile(e) {
		let t = n(e), r = this.files.find((e) => e.path === t);
		r === void 0 || r.readonly === !0 || (this.files = this.files.filter((e) => e.path !== t), this.openPaths.delete(t), this.dirtyPaths.delete(t), this.activePath === t && (this.activePath = Array.from(this.openPaths).at(-1) ?? null), this.dispatchEvent(new CustomEvent("tp-filesystem-delete", {
			bubbles: !0,
			detail: { path: t }
		})), this.syncTree(), this.dispatchChange());
	}
	renameFile(e, t) {
		let r = n(e), i = n(t);
		if (r === i) return;
		let a = this.files.find((e) => e.path === r);
		a === void 0 || a.readonly === !0 || this.files.some((e) => e.path === i) || (a.path = i, this.files = this.files, this.replacePathInSet(this.openPaths, r, i), this.replacePathInSet(this.dirtyPaths, r, i), this.activePath === r && (this.activePath = i), this.dispatchEvent(new CustomEvent("tp-filesystem-rename", {
			bubbles: !0,
			detail: {
				oldPath: r,
				newPath: i
			}
		})), this.syncTree(), this.dispatchChange());
	}
	moveFile(e, t) {
		let r = n(e), i = n(t);
		this.renameFile(r, i), this.dispatchEvent(new CustomEvent("tp-filesystem-move", {
			bubbles: !0,
			detail: {
				oldPath: r,
				newPath: i
			}
		}));
	}
	openFile(e, t = !0) {
		let r = n(e);
		this.hasFile(r) && (this.openPaths.add(r), this.activePath = r, t && (this.dispatchEvent(new CustomEvent("tp-filesystem-open", {
			bubbles: !0,
			detail: { path: r }
		})), this.dispatchActive(r)), this.syncTree());
	}
	closeFile(e) {
		let t = n(e);
		this.openPaths.delete(t), this.activePath === t && (this.activePath = Array.from(this.openPaths).at(-1) ?? null), this.syncTree();
	}
	setActivePath(e, t = !0) {
		if (e === null) {
			this.activePath = null, this.syncTree();
			return;
		}
		let r = n(e);
		this.hasFile(r) && (this.activePath = r, t && this.dispatchActive(r), this.syncTree());
	}
	getActivePath() {
		return this.activePath;
	}
	setDirtyPaths(e) {
		this.dirtyPaths.clear();
		for (let t of e) this.dirtyPaths.add(n(t));
		this.syncTree();
	}
	getDirtyPaths() {
		return Array.from(this.dirtyPaths);
	}
	ensureTree() {
		if (this.treeEl !== null) return;
		let e = document.createElement("tp-file-tree");
		e.setAttribute("data-tp-filesystem-tree", ""), this.treeEl = e, this.append(e), this.bindTreeEvents();
	}
	syncTree() {
		this.ensureTree(), this.treeEl?.setState({
			nodes: d(this.files),
			selectedPath: this.activePath,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths)
		});
	}
	bindTreeEvents() {
		this.unbindTreeEvents(), this.treeEl?.addEventListener("tp-file-tree-open", this.handleTreeOpen), this.treeEl?.addEventListener("tp-file-tree-active", this.handleTreeActive), this.treeEl?.addEventListener("tp-file-tree-add-request", this.handleTreeAddRequest), this.treeEl?.addEventListener("tp-file-tree-delete-request", this.handleTreeDeleteRequest), this.treeEl?.addEventListener("tp-file-tree-rename-request", this.handleTreeRenameRequest), this.treeEl?.addEventListener("tp-file-tree-move-request", this.handleTreeMoveRequest);
	}
	unbindTreeEvents() {
		this.treeEl?.removeEventListener("tp-file-tree-open", this.handleTreeOpen), this.treeEl?.removeEventListener("tp-file-tree-active", this.handleTreeActive), this.treeEl?.removeEventListener("tp-file-tree-add-request", this.handleTreeAddRequest), this.treeEl?.removeEventListener("tp-file-tree-delete-request", this.handleTreeDeleteRequest), this.treeEl?.removeEventListener("tp-file-tree-rename-request", this.handleTreeRenameRequest), this.treeEl?.removeEventListener("tp-file-tree-move-request", this.handleTreeMoveRequest);
	}
	handleTreeOpen = (e) => {
		this.openFile(e.detail.path);
	};
	handleTreeActive = (e) => {
		this.setActivePath(e.detail.path);
	};
	handleTreeAddRequest = (e) => {
		let t = window.prompt(e.detail.kind === "directory" ? "Folder name" : "File name", e.detail.kind === "directory" ? "folder" : "file.txt");
		if (!(t === null || t.trim() === "")) {
			if (e.detail.kind === "directory") {
				this.addFile({
					path: a(e.detail.path, `${t}/.gitkeep`),
					content: "",
					readonly: !0
				});
				return;
			}
			this.addFile({
				path: a(e.detail.path, t),
				content: ""
			});
		}
	};
	handleTreeDeleteRequest = (e) => {
		this.deleteFile(e.detail.path);
	};
	handleTreeRenameRequest = (e) => {
		let t = n(e.detail.path), r = a(i(t), e.detail.newName);
		if (this.files.some((e) => e.path === t)) {
			this.renameFile(t, r);
			return;
		}
		this.renameDirectory(t, r);
	};
	handleTreeMoveRequest = (e) => {
		let t = n(e.detail.sourcePath), o = e.detail.destinationPath === null ? "/" : n(e.detail.destinationPath), s = r(t), c = e.detail.position === "inside" ? a(o, s) : a(i(o), s);
		this.moveFile(t, c);
	};
	dispatchActive(e) {
		this.dispatchEvent(new CustomEvent("tp-filesystem-active", {
			bubbles: !0,
			detail: { path: e }
		}));
	}
	dispatchChange() {
		this.dispatchEvent(new CustomEvent("tp-filesystem-change", {
			bubbles: !0,
			detail: { files: this.getFiles() }
		}));
	}
	hasFile(e) {
		let t = n(e);
		return this.files.some((e) => e.path === t);
	}
	pruneState() {
		let e = new Set(this.files.map((e) => e.path));
		for (let t of Array.from(this.openPaths)) e.has(t) || this.openPaths.delete(t);
		for (let t of Array.from(this.dirtyPaths)) e.has(t) || this.dirtyPaths.delete(t);
		this.activePath !== null && !e.has(this.activePath) && (this.activePath = null);
	}
	renameDirectory(e, t) {
		let r = n(e), i = n(t), a = `${r}/`, o = `${i}/`;
		this.files.filter((e) => e.path.startsWith(a)).length !== 0 && (this.files = this.files.map((e) => e.path.startsWith(a) ? {
			...e,
			path: e.path.replace(a, o)
		} : e), this.openPaths.clear(), this.dirtyPaths.clear(), this.activePath?.startsWith(a) && (this.activePath = this.activePath.replace(a, o)), this.dispatchEvent(new CustomEvent("tp-filesystem-rename", {
			bubbles: !0,
			detail: {
				oldPath: r,
				newPath: i
			}
		})), this.syncTree(), this.dispatchChange());
	}
	replacePathInSet(e, t, n) {
		e.has(t) && (e.delete(t), e.add(n));
	}
};
customElements.get("tp-filesystem") || customElements.define("tp-filesystem", f);
//#endregion
export { f as t };

//# sourceMappingURL=filesystem.js.map