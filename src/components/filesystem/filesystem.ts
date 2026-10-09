/**
 * @module components/filesystem
 * @summary In-memory file system component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
// tp-docgen:dependencies:end

import style from "./filesystem.css?inline";

import "../file-tree/file-tree.js";

import { TpBase } from "../base/base.js";

import type { TpFileTree } from "../file-tree/file-tree.js";

import type {
	TpFile,
	TpFilesystemAddRequestDetail,
	TpFilesystemChangeDetail,
	TpFilesystemMoveDetail,
	TpFilesystemPathDetail,
	TpFilesystemRenameDetail,
	TpFilesystemState,
	TpFilesystemTreeMoveRequestDetail,
	TpFilesystemTreeNode,
	TpFilesystemWriteDetail,
} from "./filesystem.types.js";

function normalizePath(path: string): string {
	const value = path.trim().replaceAll("\\", "/");

	if (value === "" || value === "/") {
		return "/untitled.txt";
	}

	return value.startsWith("/") ? value : `/${value}`;
}

function getPathName(path: string): string {
	return path.split("/").filter(Boolean).at(-1) ?? path;
}

function getParentPath(path: string): string {
	const parts = normalizePath(path).split("/").filter(Boolean);

	parts.pop();

	return parts.length === 0 ? "/" : `/${parts.join("/")}`;
}

function joinPath(parentPath: string | null, name: string): string {
	const cleanName = name.trim().replaceAll("\\", "/").replace(/^\/+/, "");

	if (parentPath === null || parentPath === "/") {
		return `/${cleanName}`;
	}

	return `${normalizePath(parentPath).replace(/\/$/, "")}/${cleanName}`;
}

function cloneFile(file: TpFile): TpFile {
	return {
		path: normalizePath(file.path),
		content: file.content,
		language: file.language,
		readonly: file.readonly,
	};
}

function cloneFiles(files: readonly TpFile[]): TpFile[] {
	return files.map((file) => cloneFile(file));
}

function createDirectoryNode(path: string): TpFilesystemTreeNode {
	return {
		kind: "directory",
		name: getPathName(path),
		path,
		children: [],
	};
}

function createFileNode(file: TpFile): TpFilesystemTreeNode {
	return {
		kind: "file",
		name: getPathName(file.path),
		path: file.path,
		children: [],
	};
}

function findChild(
	nodes: TpFilesystemTreeNode[],
	path: string,
): TpFilesystemTreeNode | undefined {
	return nodes.find((node) => node.path === path);
}

function filesToTreeNodes(files: readonly TpFile[]): TpFilesystemTreeNode[] {
	const roots: TpFilesystemTreeNode[] = [];

	for (const file of files) {
		const normalizedPath = normalizePath(file.path);
		const parts = normalizedPath.split("/").filter(Boolean);

		let currentChildren = roots;
		let currentPath = "";

		for (const [index, part] of parts.entries()) {
			currentPath = `${currentPath}/${part}`;
			const isFile = index === parts.length - 1;

			if (isFile) {
				if (findChild(currentChildren, currentPath) === undefined) {
					currentChildren.push(
						createFileNode({
							...file,
							path: currentPath,
						}),
					);
				}

				continue;
			}

			let directory = findChild(currentChildren, currentPath);

			if (directory === undefined) {
				directory = createDirectoryNode(currentPath);
				currentChildren.push(directory);
			}

			currentChildren = directory.children;
		}
	}

	return roots;
}

/**
 * @summary In-memory file system with a file tree UI.
 * @tagname tp-filesystem
 * @cssprop --tp-font-family Font family used by the file system.
 * @cssprop --tp-font-size Font size used by the file system.
 * @cssprop --tp-line-height Line height used by the file system.
 * @event tp-filesystem-active Emitted when the active file changes.
 * @eventdetail tp-filesystem-active { path: string }
 * @event tp-filesystem-add Emitted when a file is added.
 * @eventdetail tp-filesystem-add { path: string }
 * @event tp-filesystem-change Emitted when the file list changes.
 * @eventdetail tp-filesystem-change { files: TpFile[] }
 * @event tp-filesystem-delete Emitted when a file is deleted.
 * @eventdetail tp-filesystem-delete { path: string }
 * @event tp-filesystem-move Emitted when a file is moved.
 * @eventdetail tp-filesystem-move { oldPath: string; newPath: string }
 * @event tp-filesystem-open Emitted when a file is opened.
 * @eventdetail tp-filesystem-open { path: string }
 * @event tp-filesystem-rename Emitted when a file or directory is renamed.
 * @eventdetail tp-filesystem-rename { oldPath: string; newPath: string }
 * @event tp-filesystem-write Emitted when file content is written.
 * @eventdetail tp-filesystem-write { path: string; content: string }
 * @example
 * <tp-filesystem></tp-filesystem>
 */
export class TpFilesystem extends TpBase {
	private static readonly styleId = "tp-filesystem-styles";

	private files: TpFile[] = [];

	private activePath: string | null = null;

	private readonly openPaths = new Set<string>();

	private readonly dirtyPaths = new Set<string>();

	private treeEl: TpFileTree | null = null;

	/**
	 * @summary Initializes the file system component.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpFilesystem.styleId, style);
		this.ensureTree();
		this.syncTree();
	}

	/**
	 * @summary Disconnects tree event listeners.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.unbindTreeEvents();
	}

	/**
	 * @summary Replaces all files.
	 * @param files Files to store.
	 */
	public setFiles(files: readonly TpFile[]): void {
		this.files = cloneFiles(files);
		this.pruneState();
		this.syncTree();
		this.dispatchChange();
	}

	/**
	 * @summary Returns all files.
	 * @returns Cloned files.
	 */
	public getFiles(): TpFile[] {
		return cloneFiles(this.files);
	}

	/**
	 * @summary Replaces the full file system state.
	 * @param state File system state.
	 */
	public setState(state: TpFilesystemState): void {
		this.files = cloneFiles(state.files);
		this.activePath = state.activePath ?? null;

		this.openPaths.clear();
		for (const path of state.openPaths ?? []) {
			this.openPaths.add(normalizePath(path));
		}

		this.dirtyPaths.clear();
		for (const path of state.dirtyPaths ?? []) {
			this.dirtyPaths.add(normalizePath(path));
		}

		this.pruneState();
		this.syncTree();
		this.dispatchChange();
	}

	/**
	 * @summary Returns the full file system state.
	 * @returns Current file system state.
	 */
	public getState(): TpFilesystemState {
		return {
			files: this.getFiles(),
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths),
		};
	}

	/**
	 * @summary Reads a file.
	 * @param path File path.
	 * @returns File content, or `null` when the file does not exist.
	 */
	public readFile(path: string): string | null {
		const normalizedPath = normalizePath(path);

		return (
			this.files.find((file) => file.path === normalizedPath)?.content ?? null
		);
	}

	/**
	 * @summary Writes file content.
	 * @param path File path.
	 * @param content New file content.
	 */
	public writeFile(path: string, content: string): void {
		const normalizedPath = normalizePath(path);
		const file = this.files.find((item) => item.path === normalizedPath);

		if (file === undefined || file.readonly === true) {
			return;
		}

		file.content = content;
		this.dirtyPaths.add(normalizedPath);

		this.dispatchEvent(
			new CustomEvent<TpFilesystemWriteDetail>("tp-filesystem-write", {
				bubbles: true,
				detail: {
					path: normalizedPath,
					content,
				},
			}),
		);

		this.syncTree();
		this.dispatchChange();
	}

	/**
	 * @summary Adds a file.
	 * @param file File to add.
	 */
	public addFile(file: TpFile): void {
		const nextFile = cloneFile(file);

		if (this.files.some((item) => item.path === nextFile.path)) {
			return;
		}

		this.files = [...this.files, nextFile];

		this.dispatchEvent(
			new CustomEvent<TpFilesystemPathDetail>("tp-filesystem-add", {
				bubbles: true,
				detail: {
					path: nextFile.path,
				},
			}),
		);

		this.syncTree();
		this.dispatchChange();
	}

	/**
	 * @summary Deletes a file.
	 * @param path File path.
	 */
	public deleteFile(path: string): void {
		const normalizedPath = normalizePath(path);
		const file = this.files.find((item) => item.path === normalizedPath);

		if (file === undefined || file.readonly === true) {
			return;
		}

		this.files = this.files.filter((item) => item.path !== normalizedPath);
		this.openPaths.delete(normalizedPath);
		this.dirtyPaths.delete(normalizedPath);

		if (this.activePath === normalizedPath) {
			this.activePath = Array.from(this.openPaths).at(-1) ?? null;
		}

		this.dispatchEvent(
			new CustomEvent<TpFilesystemPathDetail>("tp-filesystem-delete", {
				bubbles: true,
				detail: {
					path: normalizedPath,
				},
			}),
		);

		this.syncTree();
		this.dispatchChange();
	}

	/**
	 * @summary Renames a file.
	 * @param oldPath Current file path.
	 * @param newPath New file path.
	 */
	public renameFile(oldPath: string, newPath: string): void {
		const normalizedOldPath = normalizePath(oldPath);
		const normalizedNewPath = normalizePath(newPath);

		if (normalizedOldPath === normalizedNewPath) {
			return;
		}

		const file = this.files.find((item) => item.path === normalizedOldPath);

		if (file === undefined || file.readonly === true) {
			return;
		}

		if (this.files.some((item) => item.path === normalizedNewPath)) {
			return;
		}

		file.path = normalizedNewPath;
		this.files = this.files;

		this.replacePathInSet(this.openPaths, normalizedOldPath, normalizedNewPath);
		this.replacePathInSet(
			this.dirtyPaths,
			normalizedOldPath,
			normalizedNewPath,
		);

		if (this.activePath === normalizedOldPath) {
			this.activePath = normalizedNewPath;
		}

		this.dispatchEvent(
			new CustomEvent<TpFilesystemRenameDetail>("tp-filesystem-rename", {
				bubbles: true,
				detail: {
					oldPath: normalizedOldPath,
					newPath: normalizedNewPath,
				},
			}),
		);

		this.syncTree();
		this.dispatchChange();
	}

	/**
	 * @summary Moves a file.
	 * @param oldPath Current file path.
	 * @param newPath New file path.
	 */
	public moveFile(oldPath: string, newPath: string): void {
		const normalizedOldPath = normalizePath(oldPath);
		const normalizedNewPath = normalizePath(newPath);

		this.renameFile(normalizedOldPath, normalizedNewPath);

		this.dispatchEvent(
			new CustomEvent<TpFilesystemMoveDetail>("tp-filesystem-move", {
				bubbles: true,
				detail: {
					oldPath: normalizedOldPath,
					newPath: normalizedNewPath,
				},
			}),
		);
	}

	/**
	 * @summary Opens a file and makes it active.
	 * @param path File path.
	 * @param emitEvent Whether to emit open and active events.
	 */
	public openFile(path: string, emitEvent = true): void {
		const normalizedPath = normalizePath(path);

		if (!this.hasFile(normalizedPath)) {
			return;
		}

		this.openPaths.add(normalizedPath);
		this.activePath = normalizedPath;

		if (emitEvent) {
			this.dispatchEvent(
				new CustomEvent<TpFilesystemPathDetail>("tp-filesystem-open", {
					bubbles: true,
					detail: {
						path: normalizedPath,
					},
				}),
			);

			this.dispatchActive(normalizedPath);
		}

		this.syncTree();
	}

	/**
	 * @summary Closes an open file.
	 * @param path File path.
	 */
	public closeFile(path: string): void {
		const normalizedPath = normalizePath(path);

		this.openPaths.delete(normalizedPath);

		if (this.activePath === normalizedPath) {
			this.activePath = Array.from(this.openPaths).at(-1) ?? null;
		}

		this.syncTree();
	}

	/**
	 * @summary Sets the active file path.
	 * @param path Active file path, or `null`.
	 * @param emitEvent Whether to emit the active event.
	 */
	public setActivePath(path: string | null, emitEvent = true): void {
		if (path === null) {
			this.activePath = null;
			this.syncTree();
			return;
		}

		const normalizedPath = normalizePath(path);

		if (!this.hasFile(normalizedPath)) {
			return;
		}

		this.activePath = normalizedPath;

		if (emitEvent) {
			this.dispatchActive(normalizedPath);
		}

		this.syncTree();
	}

	/**
	 * @summary Returns the active file path.
	 * @returns Active file path, or `null`.
	 */
	public getActivePath(): string | null {
		return this.activePath;
	}

	/**
	 * @summary Replaces dirty file paths.
	 * @param paths Dirty file paths.
	 */
	public setDirtyPaths(paths: readonly string[]): void {
		this.dirtyPaths.clear();

		for (const path of paths) {
			this.dirtyPaths.add(normalizePath(path));
		}

		this.syncTree();
	}

	/**
	 * @summary Returns dirty file paths.
	 * @returns Dirty file paths.
	 */
	public getDirtyPaths(): string[] {
		return Array.from(this.dirtyPaths);
	}

	private ensureTree(): void {
		if (this.treeEl !== null) {
			return;
		}

		const tree = document.createElement("tp-file-tree") as TpFileTree;

		tree.setAttribute("data-tp-filesystem-tree", "");

		this.treeEl = tree;
		this.append(tree);
		this.bindTreeEvents();
	}

	private syncTree(): void {
		this.ensureTree();

		this.treeEl?.setState({
			nodes: filesToTreeNodes(this.files),
			selectedPath: this.activePath,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths),
		});
	}

	private bindTreeEvents(): void {
		this.unbindTreeEvents();

		this.treeEl?.addEventListener(
			"tp-file-tree-open",
			this.handleTreeOpen as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-file-tree-active",
			this.handleTreeActive as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-file-tree-add-request",
			this.handleTreeAddRequest as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-file-tree-delete-request",
			this.handleTreeDeleteRequest as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-file-tree-rename-request",
			this.handleTreeRenameRequest as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-file-tree-move-request",
			this.handleTreeMoveRequest as EventListener,
		);
	}

	private unbindTreeEvents(): void {
		this.treeEl?.removeEventListener(
			"tp-file-tree-open",
			this.handleTreeOpen as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-file-tree-active",
			this.handleTreeActive as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-file-tree-add-request",
			this.handleTreeAddRequest as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-file-tree-delete-request",
			this.handleTreeDeleteRequest as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-file-tree-rename-request",
			this.handleTreeRenameRequest as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-file-tree-move-request",
			this.handleTreeMoveRequest as EventListener,
		);
	}

	private readonly handleTreeOpen = (
		event: CustomEvent<TpFilesystemPathDetail>,
	): void => {
		this.openFile(event.detail.path);
	};

	private readonly handleTreeActive = (
		event: CustomEvent<TpFilesystemPathDetail>,
	): void => {
		this.setActivePath(event.detail.path);
	};

	private readonly handleTreeAddRequest = (
		event: CustomEvent<TpFilesystemAddRequestDetail>,
	): void => {
		const name = window.prompt(
			event.detail.kind === "directory" ? "Folder name" : "File name",
			event.detail.kind === "directory" ? "folder" : "file.txt",
		);

		if (name === null || name.trim() === "") {
			return;
		}

		if (event.detail.kind === "directory") {
			this.addFile({
				path: joinPath(event.detail.path, `${name}/.gitkeep`),
				content: "",
				readonly: true,
			});

			return;
		}

		this.addFile({
			path: joinPath(event.detail.path, name),
			content: "",
		});
	};

	private readonly handleTreeDeleteRequest = (
		event: CustomEvent<TpFilesystemPathDetail>,
	): void => {
		this.deleteFile(event.detail.path);
	};

	private readonly handleTreeRenameRequest = (
		event: CustomEvent<{ path: string; newName: string }>,
	): void => {
		const oldPath = normalizePath(event.detail.path);
		const newPath = joinPath(getParentPath(oldPath), event.detail.newName);

		const hasDirectFile = this.files.some((file) => file.path === oldPath);

		if (hasDirectFile) {
			this.renameFile(oldPath, newPath);
			return;
		}

		this.renameDirectory(oldPath, newPath);
	};

	private readonly handleTreeMoveRequest = (
		event: CustomEvent<TpFilesystemTreeMoveRequestDetail>,
	): void => {
		const sourcePath = normalizePath(event.detail.sourcePath);
		const destinationPath =
			event.detail.destinationPath === null
				? "/"
				: normalizePath(event.detail.destinationPath);

		const fileName = getPathName(sourcePath);
		const nextPath =
			event.detail.position === "inside"
				? joinPath(destinationPath, fileName)
				: joinPath(getParentPath(destinationPath), fileName);

		this.moveFile(sourcePath, nextPath);
	};

	private dispatchActive(path: string): void {
		this.dispatchEvent(
			new CustomEvent<TpFilesystemPathDetail>("tp-filesystem-active", {
				bubbles: true,
				detail: {
					path,
				},
			}),
		);
	}

	private dispatchChange(): void {
		this.dispatchEvent(
			new CustomEvent<TpFilesystemChangeDetail>("tp-filesystem-change", {
				bubbles: true,
				detail: {
					files: this.getFiles(),
				},
			}),
		);
	}

	private hasFile(path: string): boolean {
		const normalizedPath = normalizePath(path);

		return this.files.some((file) => file.path === normalizedPath);
	}

	private pruneState(): void {
		const paths = new Set(this.files.map((file) => file.path));

		for (const path of Array.from(this.openPaths)) {
			if (!paths.has(path)) {
				this.openPaths.delete(path);
			}
		}

		for (const path of Array.from(this.dirtyPaths)) {
			if (!paths.has(path)) {
				this.dirtyPaths.delete(path);
			}
		}

		if (this.activePath !== null && !paths.has(this.activePath)) {
			this.activePath = null;
		}
	}

	private renameDirectory(oldPath: string, newPath: string): void {
		const normalizedOldPath = normalizePath(oldPath);
		const normalizedNewPath = normalizePath(newPath);

		const oldPrefix = `${normalizedOldPath}/`;
		const newPrefix = `${normalizedNewPath}/`;

		const children = this.files.filter((file) =>
			file.path.startsWith(oldPrefix),
		);

		if (children.length === 0) {
			return;
		}

		this.files = this.files.map((file) => {
			if (!file.path.startsWith(oldPrefix)) {
				return file;
			}

			return {
				...file,
				path: file.path.replace(oldPrefix, newPrefix),
			};
		});

		this.openPaths.clear();
		this.dirtyPaths.clear();

		if (this.activePath?.startsWith(oldPrefix)) {
			this.activePath = this.activePath.replace(oldPrefix, newPrefix);
		}

		this.dispatchEvent(
			new CustomEvent<TpFilesystemRenameDetail>("tp-filesystem-rename", {
				bubbles: true,
				detail: {
					oldPath: normalizedOldPath,
					newPath: normalizedNewPath,
				},
			}),
		);

		this.syncTree();
		this.dispatchChange();
	}

	private replacePathInSet(
		set: Set<string>,
		oldPath: string,
		newPath: string,
	): void {
		if (!set.has(oldPath)) {
			return;
		}

		set.delete(oldPath);
		set.add(newPath);
	}
}

if (!customElements.get("tp-filesystem")) {
	customElements.define("tp-filesystem", TpFilesystem);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-filesystem": TpFilesystem;
	}

	interface HTMLElementEventMap {
		"tp-filesystem-open": CustomEvent<TpFilesystemPathDetail>;
		"tp-filesystem-active": CustomEvent<TpFilesystemPathDetail>;
		"tp-filesystem-add": CustomEvent<TpFilesystemPathDetail>;
		"tp-filesystem-delete": CustomEvent<TpFilesystemPathDetail>;
		"tp-filesystem-change": CustomEvent<TpFilesystemChangeDetail>;
		"tp-filesystem-write": CustomEvent<TpFilesystemWriteDetail>;
		"tp-filesystem-rename": CustomEvent<TpFilesystemRenameDetail>;
		"tp-filesystem-move": CustomEvent<TpFilesystemMoveDetail>;
	}
}
