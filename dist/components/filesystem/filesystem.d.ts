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
     * @summary Replaces the in-memory files with copies, removes states for missing files, refreshes the tree and emits a change event.
     */
    setFiles(files: readonly TpFile[]): void;
    /**
     * @summary Returns copies of all in-memory file records; modifying the returned array does not update the component.
     */
    getFiles(): TpFile[];
    /**
     * @summary Replaces files and active, open and dirty paths together; removes paths that no longer exist, refreshes the tree and emits change.
     */
    setState(state: TpFilesystemState): void;
    /**
     * @summary Returns a snapshot of copied files and the current active, open and dirty paths.
     */
    getState(): TpFilesystemState;
    /**
     * @summary Returns the content of the normalized file path, or null when no file exists at that path.
     */
    readFile(path: string): string | null;
    /**
     * @summary Replaces an existing writable file content, marks it dirty and emits write/change events. Missing and readonly files are unchanged.
     */
    writeFile(path: string, content: string): void;
    /**
     * @summary Adds a copied file record and refreshes the tree; a duplicate normalized path is ignored.
     */
    addFile(file: TpFile): void;
    /**
     * @summary Deletes an existing writable file and clears its open/dirty state; missing or readonly files are unchanged.
     */
    deleteFile(path: string): void;
    /**
     * @summary Changes the normalized path of a writable file and updates its tracked states. Missing, readonly or unchanged source paths are ignored.
     */
    renameFile(oldPath: string, newPath: string): void;
    /**
     * @summary Renames oldPath to newPath using renameFile(), then emits a move notification with the normalized paths.
     */
    moveFile(oldPath: string, newPath: string): void;
    /**
     * @summary Marks an existing file as open and active. Set emitEvent to false to suppress open/active notifications.
     */
    openFile(path: string, emitEvent?: boolean): void;
    /**
     * @summary Removes path from the open files; if it was active, activates another open file or clears the active path.
     */
    closeFile(path: string): void;
    /**
     * @summary Sets an existing file as active, or clears it with null. Set emitEvent to false to suppress the active-file notification.
     */
    setActivePath(path: string | null, emitEvent?: boolean): void;
    /**
     * @summary Returns the active file path, or null when no file is active.
     */
    getActivePath(): string | null;
    /**
     * @summary Replaces the set of modified-file paths and refreshes the tree; unknown paths are discarded.
     */
    setDirtyPaths(paths: readonly string[]): void;
    /**
     * @summary Returns a new array of paths currently marked as modified.
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
