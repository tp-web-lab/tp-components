/**
 * @module components/python-playground/python-project
 * @summary Python project model and library support.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';

/** Serializable Python project state. */
export interface TpPythonProjectInit extends TpProjectInit {
  /** Python packages to preload in the runtime. */
  libs?: string[];
}

/** Python playground project model. */
export class TpPythonProject extends TpProject {
  /** Python packages to preload in the runtime. */
  public libs?: string[];

  /** Creates a new Python project. */
  public constructor(init: TpPythonProjectInit = {}) {
    super(init);
    this.libs = init.libs;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpPythonProject {
    return new TpPythonProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      libs: this.libs !== undefined ? [...this.libs] : undefined,
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpPythonProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      libs: this.libs !== undefined ? [...this.libs] : undefined,
      files: this.files.map((file) => ({ ...file })),
    };
  }
}