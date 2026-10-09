/**
 * @module components/python-playground/python-project
 * @summary Python project model and library support.
 */
import { TpProject, type TpProjectInit } from '../playground/project.js';
/** Serializable Python project state. */
export interface TpPythonProjectInit extends TpProjectInit {
    /** Python packages to preload in the runtime. */
    libs?: string[];
}
/** Python playground project model. */
export declare class TpPythonProject extends TpProject {
    /** Python packages to preload in the runtime. */
    libs?: string[];
    /** Creates a new Python project. */
    constructor(init?: TpPythonProjectInit);
    /** Returns a deep clone of the project. */
    clone(): TpPythonProject;
    /** Serializes the project to JSON-friendly data. */
    toJSON(): TpPythonProjectInit;
}
