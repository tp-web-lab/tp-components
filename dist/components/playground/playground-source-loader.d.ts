/**
 * @module components/playground/playground-source-loader
 * @summary Shared loading of JSON projects and single-language source files.
 */
import { type TpPlaygroundProjectData } from "./playground-project-loader.js";
/** File-picker filter matching the source formats accepted by src. */
export declare function playgroundSourceAccept(language: string): string;
/** Wraps compatible source files; JSON and extensionless URLs keep project loading. */
export declare function loadPlaygroundSource(url: string, language: string): Promise<TpPlaygroundProjectData>;
/** Creates the same single-file project for disk imports and source URLs. */
export declare function createSingleSourceProject(filename: string, content: string, language: string): TpPlaygroundProjectData;
