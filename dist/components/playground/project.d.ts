/**
 * @module components/playground/project
 * @summary Base project model shared by playground components.
 */
import type { TpFile } from '../filesystem/filesystem.types.js';
/** Serializable project state. */
export interface TpProjectInit {
    /** Project name. */
    name?: string;
    /** Entry file path. */
    entry?: string;
    /** Test file path. */
    test?: string;
    /** Project files. */
    files?: readonly TpFile[];
}
/** Base project model used by playground implementations. */
export declare class TpProject {
    /** Project name. */
    name: string;
    /** Entry file path. */
    entry?: string;
    /** Test file path. */
    test?: string;
    /** Project files. */
    files: TpFile[];
    /** Creates a new project. */
    constructor(init?: TpProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpProject;
    /** Finds a file by exact path. */
    findFile(path: string): TpFile | undefined;
    /** Replaces the project file list. */
    setFiles(files: readonly TpFile[]): void;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpProjectInit;
    /** Restores a project from unknown JSON input. */
    static fromJSON(value: unknown): TpProject | null;
}
