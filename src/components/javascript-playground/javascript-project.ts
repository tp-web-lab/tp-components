/**
 * @module components/javascript-playground/javascript-project
 * @summary JavaScript project model and import map support.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';

/** Serializable JavaScript project state. */
export interface TpJavascriptProjectInit extends TpProjectInit {
  /** Import map used by the project. */
  importmap?: Record<string, unknown>;
}

/** JavaScript playground project model. */
export class TpJavascriptProject extends TpProject {
  /** Import map used by the project. */
  public importmap?: Record<string, unknown>;

  /** Creates a new JavaScript project. */
  public constructor(init: TpJavascriptProjectInit = {}) {
    super(init);
    this.importmap = init.importmap;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpJavascriptProject {
    return new TpJavascriptProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      importmap: this.importmap,
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpJavascriptProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      importmap: this.importmap,
      files: this.files.map((file) => ({ ...file })),
    };
  }
}