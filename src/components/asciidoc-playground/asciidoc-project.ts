/**
 * @module components/asciidoc-playground/asciidoc-project
 * @summary AsciiDoc project model and extension metadata.
 */

import { TpProject, type TpProjectInit } from '../playground/project.js';

/** Describes an AsciiDoc extension. */
export interface TpAsciidocExtension {
  /** Extension identifier. */
  id: string;
  /** Extension label. */
  label: string;
  /** Extension script URL. */
  url: string;
  /** Optional global export name. */
  globalName?: string;
  /** Whether the extension is enabled. */
  enabled?: boolean;
}

/** Serializable AsciiDoc project state. */
export interface TpAsciidocProjectInit extends TpProjectInit {
  /** Document attributes passed to Asciidoctor. */
  attributes?: Record<string, string | boolean | number>;
  /** Registered extensions. */
  extensions?: TpAsciidocExtension[];
}

/** AsciiDoc playground project model. */
export class TpAsciidocProject extends TpProject {
  /** Document attributes passed to Asciidoctor. */
  public attributes?: Record<string, string | boolean | number>;

  /** Registered extensions. */
  public extensions?: TpAsciidocExtension[];

  /** Creates a new AsciiDoc project. */
  public constructor(init: TpAsciidocProjectInit = {}) {
    super(init);
    this.attributes = init.attributes;
    this.extensions = init.extensions;
  }

  /** Returns a deep clone of the project. */
  public override clone(): TpAsciidocProject {
    return new TpAsciidocProject({
      name: this.name,
      entry: this.entry,
      test: this.test,
      attributes:
        this.attributes !== undefined ? { ...this.attributes } : undefined,
      extensions: this.extensions?.map((extension) => ({ ...extension })),
      files: this.files.map((file) => ({ ...file })),
    });
  }

  /** Serializes the project to JSON-friendly data. */
  public override toJSON(): TpAsciidocProjectInit {
    return {
      name: this.name,
      entry: this.entry,
      test: this.test,
      attributes:
        this.attributes !== undefined ? { ...this.attributes } : undefined,
      extensions: this.extensions?.map((extension) => ({ ...extension })),
      files: this.files.map((file) => ({ ...file })),
    };
  }
}