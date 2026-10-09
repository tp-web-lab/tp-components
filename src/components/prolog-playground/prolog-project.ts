/**
 * @module components/prolog-playground/prolog-project
 * @summary Prolog project model.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';

/** Serializable Prolog project state. */
export interface TpPrologProjectInit extends TpProjectInit {
  /** Query file path. */
  query?: string;
}

/** Prolog playground project model. */
export class TpPrologProject extends TpProject {
  /** Query file path. */
  public query?: string;

  /** Creates a new Prolog project. */
  public constructor(init: TpPrologProjectInit = {}) {
    super(init);
    this.query = init.query;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpPrologProject {
    return new TpPrologProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      query: this.query,
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpPrologProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      query: this.query,
      files: this.files.map((file) => ({ ...file })),
    };
  }
}
