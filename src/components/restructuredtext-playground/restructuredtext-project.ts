/**
 * @module components/restructuredtext-playground/restructuredtext-project
 * @summary reStructuredText project model and extension metadata.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';
import type { TpMarkupExtensionId } from '../markup-playground/markup-extension.types.js';

/** Describes a reStructuredText extension. */
export interface TpRestructuredTextExtension {
  /** Extension identifier. */
  id: TpMarkupExtensionId;
  /** Extension label. */
  label: string;
  /** Extension script URL. */
  url: string;
  /** Whether the extension is enabled. */
  enabled?: boolean;
}

/** Serializable reStructuredText project state. */
export interface TpRestructuredTextProjectInit extends TpProjectInit {
  /** Python packages to preload in the runtime. */
  libs?: string[];
  /** Registered extensions. */
  extensions?: TpRestructuredTextExtension[];
}

/** reStructuredText playground project model. */
export class TpRestructuredTextProject extends TpProject {
  /** Python packages to preload in the runtime. */
  public libs?: string[];
  /** Registered extensions. */
  public extensions?: TpRestructuredTextExtension[];

  /** Creates a new reStructuredText project. */
  public constructor(init: TpRestructuredTextProjectInit = {}) {
    super(init);
    this.libs = init.libs;
    this.extensions = init.extensions;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpRestructuredTextProject {
    return new TpRestructuredTextProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      libs: this.libs !== undefined ? [...this.libs] : undefined,
      files: this.files.map((file) => ({ ...file })),
      extensions: this.extensions?.map((extension) => ({ ...extension })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpRestructuredTextProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      libs: this.libs !== undefined ? [...this.libs] : undefined,
      files: this.files.map((file) => ({ ...file })),
      extensions: this.extensions?.map((extension) => ({ ...extension })),
    };
  }
}