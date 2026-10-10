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
export declare class TpTypescriptProject extends TpProject {
    /** Import map used by the project. */
    importmap?: Record<string, unknown>;
    /** Creates a new TypeScript project. */
    constructor(init?: TpTypescriptProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpTypescriptProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpTypescriptProjectInit;
}
