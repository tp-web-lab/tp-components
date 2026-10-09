/**
 * @module components/html-playground/html-project
 * @summary HTML project model and import map support.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';

/** Serializable HTML project state. */
export interface TpHtmlProjectInit extends TpProjectInit {
  /** Import map used by the project. */
  importmap?: Record<string, unknown>;
}

/** HTML playground project model. */
export class TpHtmlProject extends TpProject {
  /** Import map used by the project. */
  public importmap?: Record<string, unknown>;

  /** Creates a new HTML project. */
  public constructor(init: TpHtmlProjectInit = {}) {
    super(init);
    this.importmap = init.importmap;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpHtmlProject {
    return new TpHtmlProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      importmap: this.importmap,
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpHtmlProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      importmap: this.importmap,
      files: this.files.map((file) => ({ ...file })),
    };
  }

  /** Restores an HTML project from unknown JSON input. */
  public static override fromJSON(value: unknown): TpHtmlProject | null {
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const candidate = value as {
      name?: unknown;
      entry?: unknown;
      test?: unknown;
      importmap?: unknown;
      files?: unknown;
    };

    if (!Array.isArray(candidate.files)) {
      return null;
    }

    const files = candidate.files
      .filter((file) => {
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
      .map((file) => {
        const item = file as {
          path: string;
          content: string;
          language?: unknown;
          readonly?: unknown;
        };

        return {
          path: item.path,
          content: item.content,
          language:
            typeof item.language === 'string' ? item.language : undefined,
          readonly:
            typeof item.readonly === 'boolean' ? item.readonly : undefined,
        };
      });

    return new TpHtmlProject({
      name: typeof candidate.name === 'string' ? candidate.name : undefined,
      entry: typeof candidate.entry === 'string' ? candidate.entry : undefined,
      test: typeof candidate.test === 'string' ? candidate.test : undefined,
      importmap:
        typeof candidate.importmap === 'object' &&
        candidate.importmap !== null
          ? (candidate.importmap as Record<string, unknown>)
          : undefined,
      files,
    });
  }
}