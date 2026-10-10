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
export declare class TpRestructuredTextProject extends TpProject {
    /** Python packages to preload in the runtime. */
    libs?: string[];
    /** Registered extensions. */
    extensions?: TpRestructuredTextExtension[];
    /** Creates a new reStructuredText project. */
    constructor(init?: TpRestructuredTextProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpRestructuredTextProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpRestructuredTextProjectInit;
}
