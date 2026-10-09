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
export declare class TpJavascriptProject extends TpProject {
    /** Import map used by the project. */
    importmap?: Record<string, unknown>;
    /** Creates a new JavaScript project. */
    constructor(init?: TpJavascriptProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpJavascriptProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpJavascriptProjectInit;
}
