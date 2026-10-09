/**
 * @module components/markdown-playground/markdown-project
 * @summary Markdown project model and extension metadata.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';

/** Describes a Markdown extension. */
export interface TpMarkdownExtension {
  /** Extension identifier. */
  id: string;
  /** Extension label. */
  label: string;
  /** Extension script URL. */
  url: string;
  /** Whether the extension is enabled. */
  enabled?: boolean;
}

/** Serializable Markdown project state. */
export interface TpMarkdownProjectInit extends TpProjectInit {
  /** Registered extensions. */
  extensions?: TpMarkdownExtension[];
}

/** Markdown playground project model. */
export class TpMarkdownProject extends TpProject {
  /** Registered extensions. */
  public extensions?: TpMarkdownExtension[];

  /** Creates a new Markdown project. */
  public constructor(init: TpMarkdownProjectInit = {}) {
    super(init);
    this.extensions = init.extensions;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpMarkdownProject {
    return new TpMarkdownProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      extensions: this.extensions?.map((extension) => ({ ...extension })),
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpMarkdownProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      extensions: this.extensions?.map((extension) => ({ ...extension })),
      files: this.files.map((file) => ({ ...file })),
    };
  }
}