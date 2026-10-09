/**
 * @module components/html-playground/html-project
 * @summary HTML project model and import map support.
 */
import { TpProject, type TpProjectInit } from '../playground/project.js';
/** Serializable HTML project state. */
export interface TpHtmlProjectInit extends TpProjectInit {
    /** Import map used by the project. */
    importmap?: Record<string, unknown>;
}
/** HTML playground project model. */
export declare class TpHtmlProject extends TpProject {
    /** Import map used by the project. */
    importmap?: Record<string, unknown>;
    /** Creates a new HTML project. */
    constructor(init?: TpHtmlProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpHtmlProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpHtmlProjectInit;
    /** Restores an HTML project from unknown JSON input. */
    static fromJSON(value: unknown): TpHtmlProject | null;
}
