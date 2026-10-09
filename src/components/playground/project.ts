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
export class TpProject {
  /** Project name. */
  public name: string;

  /** Entry file path. */
  public entry?: string;

  /** Test file path. */
  public test?: string;

  /** Project files. */
  public files: TpFile[];

  /** Creates a new project. */
  public constructor(init: TpProjectInit = {}) {
    this.name = init.name ?? 'Untitled project';
    this.entry = init.entry;
    this.test = init.test;
    this.files = init.files?.map((file) => ({ ...file })) ?? [];
  }

  /** Returns a deep clone of the project. */
  public clone(): TpProject {
    return new TpProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Finds a file by exact path. */
  public findFile(path: string): TpFile | undefined {
    return this.files.find((file) => file.path === path);
  }

  /** Replaces the project file list. */
  public setFiles(files: readonly TpFile[]): void {
    this.files = files.map((file) => ({ ...file }));
  }

  /** Serializes the project to JSON-friendly data. */
  public toJSON(): TpProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      files: this.files.map((file) => ({ ...file })),
    };
  }

  /** Restores a project from unknown JSON input. */
  public static fromJSON(value: unknown): TpProject | null {
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const candidate = value as {
      name?: unknown;
      entry?: unknown;
      test?: unknown;
      files?: unknown;
    };

    if (!Array.isArray(candidate.files)) {
      return null;
    }

    const files = candidate.files
      .filter((file): file is TpFile => {
        if (typeof file !== 'object' || file === null) {
          return false;
        }

        const item = file as {
          path?: unknown;
          content?: unknown;
        };

        return (
          typeof item.path === 'string' &&
          typeof item.content === 'string'
        );
      })
      .map((file) => ({ ...file }));

    return new TpProject({
      name: typeof candidate.name === 'string' ? candidate.name : undefined,
      entry: typeof candidate.entry === 'string' ? candidate.entry : undefined,
      test: typeof candidate.test === 'string' ? candidate.test : undefined,
      files,
    });
  }
}