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
export declare class TpAsciidocProject extends TpProject {
    /** Document attributes passed to Asciidoctor. */
    attributes?: Record<string, string | boolean | number>;
    /** Registered extensions. */
    extensions?: TpAsciidocExtension[];
    /** Creates a new AsciiDoc project. */
    constructor(init?: TpAsciidocProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpAsciidocProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpAsciidocProjectInit;
}
