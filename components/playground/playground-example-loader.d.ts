/**
 * @module components/playground/playground-example-loader
 * @summary Example catalog loading utilities for playground projects.
 */
import type { TpFile } from '../filesystem/filesystem.types.js';
import type { TpProject } from './project.js';
/** Describes a playground example. */
export interface TpPlaygroundExample {
    /** Example identifier. */
    id: string;
    /** Example label. */
    label: string;
}
/** Root catalog index for playground examples. */
export interface TpExamplesRootIndex {
    /** Example groups keyed by category and group. */
    groups: Record<string, Record<string, string>>;
}
/** Group catalog index for playground examples. */
export interface TpExamplesGroupIndex {
    /** Example identifiers included in the group. */
    examples: string[];
}
/** File manifest for a single example. */
export interface TpExampleFilesIndex {
    /** Paths of files to load. */
    files: string[];
}
/** Project metadata associated with an example. */
export interface TpExampleProjectMetadata {
    /** Optional example identifier. */
    id?: string;
    /** Optional display label. */
    label?: string;
    /** Optional project name. */
    name?: string;
    /** Optional entry file. */
    entry?: string;
    /** Optional test file. */
    test?: string;
    /** Optional import map. */
    importmap?: Record<string, unknown>;
}
/** Resolved reference to an example project. */
export interface TpExampleReference {
    /** Example identifier. */
    id: string;
    /** Example label. */
    label: string;
    /** Example project name. */
    name: string;
    /** Base URL for the example. */
    baseUrl: string;
    /** Example metadata. */
    metadata: TpExampleProjectMetadata;
}
/** Options for the example loader. */
export interface TpPlaygroundExampleLoaderOptions<TProject extends TpProject> {
    /** Base URL of the examples catalog. */
    rootUrl?: string;
    /** Example category. */
    category: string;
    /** Example group. */
    group: string;
    /** Factory used to create a project from metadata and files. */
    createProject: (metadata: TpExampleProjectMetadata, files: readonly TpFile[]) => TProject;
}
/** Infers an editor language from a file path. */
export declare function inferLanguage(path: string): string;
/** Loads and caches example references and projects. */
export declare class TpPlaygroundExampleLoader<TProject extends TpProject> {
    private readonly rootUrl;
    private readonly category;
    private readonly group;
    private readonly createProject;
    private referencesCache;
    private readonly projectCache;
    /** Creates a new loader. */
    constructor(options: TpPlaygroundExampleLoaderOptions<TProject>);
    /** Returns the available examples. */
    getExamples(): Promise<TpPlaygroundExample[]>;
    /** Returns the resolved example references. */
    getReferences(): Promise<TpExampleReference[]>;
    /** Loads a project by example identifier. */
    loadProject(id: string): Promise<TProject>;
    /** Clears all loader caches. */
    clearCache(): void;
    private loadReference;
    /** Loads a single file from an example. */
    private loadFile;
    /** Fetches JSON from a URL. */
    private fetchJson;
}
