/**
 * @module tp-components/components/filesystem/filesystem.types
 * @summary Shared filesystem types used by playground components.
 */
import type { TpFileTreeMoveRequestDetail, TpFileTreeNode, TpFileTreeNodeKind } from '../file-tree/file-tree.js';
/** A file stored in a playground filesystem. */
export interface TpFile {
    /** File path. */
    path: string;
    /** File content. */
    content: string;
    /** Optional editor language. */
    language?: string;
    /** Whether the file is read-only. */
    readonly?: boolean;
}
/** Serializable filesystem state. */
export interface TpFilesystemState {
    /** Files in the filesystem. */
    files: readonly TpFile[];
    /** Currently active path. */
    activePath?: string | null;
    /** Open file paths. */
    openPaths?: readonly string[];
    /** Dirty file paths. */
    dirtyPaths?: readonly string[];
}
/** Payload for path-selection events. */
export interface TpFilesystemPathDetail {
    /** Selected path. */
    path: string;
}
/** Payload for filesystem change events. */
export interface TpFilesystemChangeDetail {
    /** Updated files. */
    files: TpFile[];
}
/** Payload for filesystem write events. */
export interface TpFilesystemWriteDetail {
    /** Written path. */
    path: string;
    /** Written content. */
    content: string;
}
/** Payload for filesystem rename events. */
export interface TpFilesystemRenameDetail {
    /** Previous path. */
    oldPath: string;
    /** New path. */
    newPath: string;
}
/** Payload for filesystem move events. */
export interface TpFilesystemMoveDetail {
    /** Previous path. */
    oldPath: string;
    /** New path. */
    newPath: string;
}
/** Payload for add-request events in the filesystem tree. */
export interface TpFilesystemAddRequestDetail {
    /** Parent path, if any. */
    path: string | null;
    /** Requested node kind. */
    kind: TpFileTreeNodeKind;
}
/** Alias for filesystem tree nodes. */
export type TpFilesystemTreeNode = TpFileTreeNode;
/** Alias for filesystem tree move request payloads. */
export type TpFilesystemTreeMoveRequestDetail = TpFileTreeMoveRequestDetail;
