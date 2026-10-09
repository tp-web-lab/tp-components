/**
 * @module components/html-playground/html-example-loader
 * @summary HTML example loading helpers.
 */
import { TpHtmlProject } from './html-project.js';
/** Loads an HTML project from a directory-based example package. */
export declare function loadHtmlProjectFromDirectory(baseUrl: string): Promise<TpHtmlProject>;
