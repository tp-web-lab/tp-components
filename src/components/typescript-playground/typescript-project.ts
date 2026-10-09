/**
 * @module components/typescript-playground/typescript-project
 * @summary TypeScript project model and import map support.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';

/** Serializable TypeScript project state. */
export interface TpTypescriptProjectInit extends TpProjectInit {
  /** Import map used by the project. */
  importmap?: Record<string, unknown>;
}

/** TypeScript playground project model. */
export class TpTypescriptProject extends TpProject {
  /** Import map used by the project. */
  public importmap?: Record<string, unknown>;

  /** Creates a new TypeScript project. */
  public constructor(init: TpTypescriptProjectInit = {}) {
    super(init);
    this.importmap = init.importmap;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpTypescriptProject {
    return new TpTypescriptProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      importmap: this.importmap,
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpTypescriptProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      importmap: this.importmap,
      files: this.files.map((file) => ({ ...file })),
    };
  }
}