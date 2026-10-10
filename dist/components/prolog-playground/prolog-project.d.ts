/**
 * @module components/prolog-playground/prolog-project
 * @summary Prolog project model.
 */
import { TpProject, type TpProjectInit } from '../playground/project.js';
/** Serializable Prolog project state. */
export interface TpPrologProjectInit extends TpProjectInit {
    /** Query file path. */
    query?: string;
}
/** Prolog playground project model. */
export declare class TpPrologProject extends TpProject {
    /** Query file path. */
    query?: string;
    /** Creates a new Prolog project. */
    constructor(init?: TpPrologProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpPrologProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpPrologProjectInit;
}
