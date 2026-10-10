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
export declare class TpMarkdownProject extends TpProject {
    /** Registered extensions. */
    extensions?: TpMarkdownExtension[];
    /** Creates a new Markdown project. */
    constructor(init?: TpMarkdownProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpMarkdownProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpMarkdownProjectInit;
}
