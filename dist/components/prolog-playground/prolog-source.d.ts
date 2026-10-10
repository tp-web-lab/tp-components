/**
 * @module components/prolog-playground/prolog-source
 * @summary Source helpers for in-memory Prolog playground projects.
 */
import type { TpFile } from '../filesystem/filesystem.types.js';
/** DOM helper module injected by the Prolog playground runtime. */
export declare const PROLOG_DOM_MODULE_SOURCE: string;
/** Returns the module name declared by a Prolog file, when present. */
export declare function getDeclaredPrologModuleName(source: string): string | null;
/** Returns the local module names represented by project files. */
export declare function getLocalPrologModuleNames(files: readonly TpFile[]): Set<string>;
/** Returns whether a source imports the playground DOM module. */
export declare function usesPrologDomModule(source: string): boolean;
/**
 * Adapts local Prolog modules for the iframe runtime.
 *
 * Scryer can consult strings, but it cannot resolve arbitrary project files
 * from `use_module/1` inside the browser iframe. Local project modules are
 * therefore flattened into the user module while built-in libraries are kept.
 */
export declare function flattenLocalPrologModules(source: string, localModules: ReadonlySet<string>): string;
