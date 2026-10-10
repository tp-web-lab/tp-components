/**
 * @module components/filesystem
 * @summary In-memory file system component.
 */
import "../file-tree/file-tree.js";
import { TpBase } from "../base/base.js";
import type { TpFile, TpFilesystemChangeDetail, TpFilesystemMoveDetail, TpFilesystemPathDetail, TpFilesystemRenameDetail, TpFilesystemState, TpFilesystemWriteDetail } from "./filesystem.types.js";
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
export declare class TpFilesystem extends TpBase {
    private static readonly styleId;
    private files;
    private activePath;
    private readonly openPaths;
    private readonly dirtyPaths;
    private treeEl;
    /**
     * @summary Initializes the file system component.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary Disconnects tree event listeners.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary Replaces all files.
     * @param files Files to store.
     */
    setFiles(files: readonly TpFile[]): void;
    /**
     * @summary Returns all files.
     * @returns Cloned files.
     */
    getFiles(): TpFile[];
    /**
     * @summary Replaces the full file system state.
     * @param state File system state.
     */
    setState(state: TpFilesystemState): void;
    /**
     * @summary Returns the full file system state.
     * @returns Current file system state.
     */
    getState(): TpFilesystemState;
    /**
     * @summary Reads a file.
     * @param path File path.
     * @returns File content, or `null` when the file does not exist.
     */
    readFile(path: string): string | null;
    /**
     * @summary Writes file content.
     * @param path File path.
     * @param content New file content.
     */
    writeFile(path: string, content: string): void;
    /**
     * @summary Adds a file.
     * @param file File to add.
     */
    addFile(file: TpFile): void;
    /**
     * @summary Deletes a file.
     * @param path File path.
     */
    deleteFile(path: string): void;
    /**
     * @summary Renames a file.
     * @param oldPath Current file path.
     * @param newPath New file path.
     */
    renameFile(oldPath: string, newPath: string): void;
    /**
     * @summary Moves a file.
     * @param oldPath Current file path.
     * @param newPath New file path.
     */
    moveFile(oldPath: string, newPath: string): void;
    /**
     * @summary Opens a file and makes it active.
     * @param path File path.
     * @param emitEvent Whether to emit open and active events.
     */
    openFile(path: string, emitEvent?: boolean): void;
    /**
     * @summary Closes an open file.
     * @param path File path.
     */
    closeFile(path: string): void;
    /**
     * @summary Sets the active file path.
     * @param path Active file path, or `null`.
     * @param emitEvent Whether to emit the active event.
     */
    setActivePath(path: string | null, emitEvent?: boolean): void;
    /**
     * @summary Returns the active file path.
     * @returns Active file path, or `null`.
     */
    getActivePath(): string | null;
    /**
     * @summary Replaces dirty file paths.
     * @param paths Dirty file paths.
     */
    setDirtyPaths(paths: readonly string[]): void;
    /**
     * @summary Returns dirty file paths.
     * @returns Dirty file paths.
     */
    getDirtyPaths(): string[];
    private ensureTree;
    private syncTree;
    private bindTreeEvents;
    private unbindTreeEvents;
    private readonly handleTreeOpen;
    private readonly handleTreeActive;
    private readonly handleTreeAddRequest;
    private readonly handleTreeDeleteRequest;
    private readonly handleTreeRenameRequest;
    private readonly handleTreeMoveRequest;
    private dispatchActive;
    private dispatchChange;
    private hasFile;
    private pruneState;
    private renameDirectory;
    private replacePathInSet;
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
