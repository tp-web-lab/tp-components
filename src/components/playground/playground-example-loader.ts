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
export interface TpPlaygroundExampleLoaderOptions<
  TProject extends TpProject,
> {
  /** Base URL of the examples catalog. */
  rootUrl?: string;
  /** Example category. */
  category: string;
  /** Example group. */
  group: string;
  /** Factory used to create a project from metadata and files. */
  createProject: (
    metadata: TpExampleProjectMetadata,
    files: readonly TpFile[],
  ) => TProject;
}

/** Infers an editor language from a file path. */
export function inferLanguage(path: string): string {
  if (path.endsWith('.adoc') || path.endsWith('.asciidoc')) return 'asciidoc';
  if (path.endsWith('.html') || path.endsWith('.htm')) return 'html';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.js') || path.endsWith('.mjs')) return 'javascript';
  if (path.endsWith('.ts')) return 'typescript';
  if (path.endsWith('.py')) return 'python';
  if (path.endsWith('.pl')) return 'prolog';
  if (path.endsWith('.sql')) return 'sql';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.rst')) return 'restructuredtext';
  if (path.endsWith('.abc')) return 'abc';
  return 'text';
}

/** Loads and caches example references and projects. */
export class TpPlaygroundExampleLoader<TProject extends TpProject> {
  private readonly rootUrl: string;

  private readonly category: string;

  private readonly group: string;

  private readonly createProject: (
    metadata: TpExampleProjectMetadata,
    files: readonly TpFile[],
  ) => TProject;

  private referencesCache: TpExampleReference[] | null = null;

  private readonly projectCache = new Map<string, TProject>();

  /** Creates a new loader. */
  public constructor(options: TpPlaygroundExampleLoaderOptions<TProject>) {
    this.rootUrl = options.rootUrl ?? '/examples';
    this.category = options.category;
    this.group = options.group;
    this.createProject = options.createProject;
  }

  /** Returns the available examples. */
  public async getExamples(): Promise<TpPlaygroundExample[]> {
    const references = await this.getReferences();

    return references.map((reference) => ({
      id: reference.id,
      label: reference.label,
    }));
  }

  /** Returns the resolved example references. */
  public async getReferences(): Promise<TpExampleReference[]> {
    if (this.referencesCache !== null) {
      return this.referencesCache;
    }

    const rootIndex = await this.fetchJson<TpExamplesRootIndex>(
      `${this.rootUrl}/index.json`,
    );

    const categoryGroups = rootIndex.groups[this.category];

    if (categoryGroups === undefined) {
      throw new Error(`Examples category not found: ${this.category}`);
    }

    const groupUrl = categoryGroups[this.group];

    if (typeof groupUrl !== 'string' || groupUrl === '') {
      throw new Error(
        `Examples group not found: ${this.category}/${this.group}`,
      );
    }

    const groupIndex = await this.fetchJson<TpExamplesGroupIndex>(
      `${groupUrl}/index.json`,
    );

    this.referencesCache = await Promise.all(
      groupIndex.examples.map((id) => this.loadReference(groupUrl, id)),
    );

    return this.referencesCache;
  }

  /** Loads a project by example identifier. */
  public async loadProject(id: string): Promise<TProject> {
    const cached = this.projectCache.get(id);

    if (cached !== undefined) {
      return cached.clone() as TProject;
    }

    const references = await this.getReferences();
    const reference = references.find((item) => item.id === id);

    if (reference === undefined) {
      throw new Error(`Example not found: ${id}`);
    }

    const filesIndex = await this.fetchJson<TpExampleFilesIndex>(
      `${reference.baseUrl}/.files.json`,
    );

    const files = await Promise.all(
      filesIndex.files.map((filename) =>
        this.loadFile(reference.baseUrl, filename),
      ),
    );

    const project = this.createProject(reference.metadata, files);

    this.projectCache.set(id, project.clone() as TProject);

    return project.clone() as TProject;
  }

  /** Clears all loader caches. */
  public clearCache(): void {
    this.referencesCache = null;
    this.projectCache.clear();
  }

  private async loadReference(
    groupUrl: string,
    id: string,
  ): Promise<TpExampleReference> {
    const baseUrl = `${groupUrl}/${id}`;

    const metadata = await this.fetchJson<TpExampleProjectMetadata>(
      `${baseUrl}/project.json`,
    );

    return {
      id: metadata.id ?? id,
      label: metadata.label ?? metadata.name ?? id,
      name: metadata.name ?? metadata.label ?? id,
      baseUrl,
      metadata,
    };
  }

  /** Loads a single file from an example. */
  private async loadFile(baseUrl: string, filename: string): Promise<TpFile> {
    const response = await fetch(`${baseUrl}/${filename}`);

    if (!response.ok) {
      throw new Error(`Unable to load example file: ${filename}`);
    }

    const path = filename.startsWith('/') ? filename : `/${filename}`;

    return {
      path,
      content: await response.text(),
      language: inferLanguage(path),
    };
  }

  /** Fetches JSON from a URL. */
  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unable to load JSON: ${url}`);
    }

    return (await response.json()) as T;
  }
}