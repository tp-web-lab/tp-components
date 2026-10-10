/**
 * @module components/playground/playground-build-utils
 * @summary Shared utilities for building playground execution documents.
 */
import type { ImportMap } from "../../utilities/importmap/importmap-types.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpProject } from "./project.js";
/**
 * Supported source kinds for utility helpers.
 *
 * @summary Represents a simple source-file family.
 */
export type TpSourceKind = "javascript" | "typescript" | "python" | "html" | "css" | "json" | "markdown" | "prolog" | "text";
/**
 * Returns whether a module specifier should be left untouched.
 *
 * @summary Detects an external or special import.
 * @param value Source specifier.
 * @returns `true` when no local rewrite should be applied.
 */
export declare function isExternalModuleSpecifier(value: string): boolean;
/**
 * Resolves a simple relative path against a source file.
 *
 * @summary Resolves a local path such as `./x` or `../x`.
 * @param fromPath Current file path.
 * @param relativePath Relative reference.
 * @returns Logical absolute path in the project.
 */
export declare function resolveProjectRelativePath(fromPath: string, relativePath: string): string;
/**
 * Represents an ES module dependency found in source code.
 *
 * @summary Describes an import or re-export occurrence.
 */
export interface TpModuleDependency {
    /**
     * Start offset of the specifier in the source code.
     */
    start: number;
    /**
     * End offset of the specifier in the source code.
     */
    end: number;
    /**
     * Raw specifier value.
     */
    specifier: string;
    /**
     * Indicates whether the dependency comes from a dynamic import.
     */
    isDynamic: boolean;
}
/**
 * Parses ES module dependencies from JavaScript source.
 *
 * @summary Returns static imports, dynamic imports, and re-exports.
 * @param code JavaScript source code.
 * @returns Detected dependencies.
 */
export declare function parseModuleDependencies(code: string): Promise<TpModuleDependency[]>;
/**
 * Rewrites local imports in a JavaScript module.
 *
 * @summary Replaces local specifiers with their Blob URLs.
 * @param code Module source code.
 * @param fromPath Logical path of the source module.
 * @param resolver Resolves a logical local path to a final URL.
 * @returns Rewritten code.
 */
export declare function rewriteJavaScriptModuleImports(code: string, fromPath: string, resolver: (resolvedPath: string) => Promise<string>, importmap?: ImportMap): Promise<string>;
/**
 * Decodes HTML entities (&lt;, &gt;, &amp;, etc.).
 *
 * @summary Converts escaped HTML into real HTML.
 * @param value Escaped HTML text.
 * @returns Decoded HTML.
 */
export declare function decodeHtmlEntities(value: string): string;
/**
 * Serializes a JavaScript value into a safe inline literal.
 *
 * This helper relies on `JSON.stringify()` to produce a representation that is
 * safe to embed in a `<script>`.
 *
 * @summary Converts a value into a JavaScript literal.
 * @param value Value to serialize.
 * @returns Serialized string.
 */
export declare function toJavascriptLiteral(value: string): string;
/**
 * Escapes a string for HTML text insertion.
 *
 * @summary Escapes special HTML characters.
 * @param value Source text.
 * @returns Escaped text.
 */
export declare function escapeHtml(value: string): string;
/**
 * Returns the last segment of a path.
 *
 * @summary Extracts the final file name.
 * @param path Source path.
 * @returns File name or original path.
 */
export declare function getBasename(path: string): string;
/**
 * Returns whether a path has one of the provided extensions.
 *
 * @summary Checks a path extension.
 * @param path Path to test.
 * @param extensions Expected extensions.
 * @returns `true` when the path matches.
 */
export declare function hasExtension(path: string, extensions: readonly string[]): boolean;
/** Returns the MIME type for a project file. */
export declare function getProjectFileMimeType(file: TpFile): string;
/** Returns whether a file should be treated as a JavaScript module. */
export declare function isJavaScriptModuleFile(file: TpFile): boolean;
/** Creates Blob URLs for non-module files. */
export declare function createStaticBlobUrls(files: readonly TpFile[]): Map<string, string>;
/** Creates Blob URLs for JavaScript module files. */
export declare function createJavaScriptModuleBlobUrls(files: readonly TpFile[], staticBlobUrls: ReadonlyMap<string, string>, importmap?: ImportMap): Promise<Map<string, string>>;
/** Returns whether a file should be treated as a TypeScript module. */
export declare function isTypescriptModuleFile(file: TpFile): boolean;
/** Converts a TypeScript path to its JavaScript output path. */
export declare function toJavaScriptPath(path: string): string;
/** Transpiles TypeScript source to JavaScript. */
export declare function transpileTypescript(source: string): string;
/** Creates Blob URLs for TypeScript module files. */
export declare function createTypescriptModuleBlobUrls(files: readonly TpFile[], staticBlobUrls: ReadonlyMap<string, string>, importmap?: ImportMap): Promise<Map<string, string>>;
/**
 * Infers a simple source kind from a file path.
 *
 * @summary Infers a file content type.
 * @param path File path.
 * @returns File kind.
 */
export declare function inferSourceKind(path: string): TpSourceKind;
/**
 * Finds a file by its exact path.
 *
 * @summary Returns a file from the project.
 * @param project Current project.
 * @param path Exact path to find.
 * @returns Found file or `undefined`.
 */
export declare function findProjectFile(project: TpProject, path: string): TpFile | undefined;
/**
 * Finds the first file matching a list of priority paths.
 *
 * @summary Returns the first file found in explicit order.
 * @param project Current project.
 * @param paths Priority candidate paths.
 * @returns Found file or `undefined`.
 */
export declare function findProjectFileByPriorityPaths(project: TpProject, paths: readonly string[]): TpFile | undefined;
/**
 * Finds the first file matching one of the provided extensions.
 *
 * @summary Returns the first file compatible with a list of extensions.
 * @param project Current project.
 * @param extensions Expected extensions.
 * @returns Found file or `undefined`.
 */
export declare function findFirstFileByExtensions(project: TpProject, extensions: readonly string[]): TpFile | undefined;
/**
 * Resolves an entry file using a simple strategy.
 *
 * Priority:
 * - `entry`
 * - `project.entry`
 * - explicit priority paths
 * - first compatible extension
 * - first project file
 *
 * @summary Resolves the main entry file.
 * @param project Current project.
 * @param options Resolution options.
 * @returns Entry file or `undefined`.
 */
export declare function resolveEntryFile(project: TpProject, options: {
    /** Optional entry point. */
    entry?: string;
    /** Priority paths. */
    priorityPaths?: readonly string[];
    /** Compatible extensions. */
    extensions?: readonly string[];
    /** Allows falling back to the first project file. */
    fallbackToFirstFile?: boolean;
    ignoreProjectEntry?: boolean;
}): TpFile | undefined;
/**
 * Resolves the content of an entry file.
 *
 * @summary Returns the content of the main file.
 * @param project Current project.
 * @param options Resolution options.
 * @returns Found file content.
 * @throws {Error} If no entry file is found.
 */
export declare function resolveEntryFileContent(project: TpProject, options: {
    /** Optional entry point. */
    entry?: string;
    /** Priority paths. */
    priorityPaths?: readonly string[];
    /** Compatible extensions. */
    extensions?: readonly string[];
    /** Error message when no file is found. */
    notFoundMessage: string;
    /** Allows falling back to the first project file. */
    fallbackToFirstFile?: boolean;
}): string;
/**
 * Creates the shared runtime script for error and height reporting.
 *
 * @summary Generates the shared runtime instrumentation.
 * @returns Ready-to-inject `<script>` block.
 */
export declare function createCommonRuntimeScript(): string;
/**
 * Creates a console bridge between the iframe and the parent.
 *
 * The bridge:
 * - remaps `console.log()`, `console.info()`, `console.warn()`, and `console.error()`
 * - serializes transferable values
 * - posts entries to the parent via `postMessage`
 *
 * @summary Generates a console runtime bridge.
 * @returns Ready-to-inject `<script>` block.
 */
export declare function createConsoleBridgeScript(): string;
/**
 * Injects a fragment just before `</body>` if possible, otherwise appends it.
 *
 * @summary Inserts an HTML fragment at the end of the document.
 * @param html Source HTML document.
 * @param fragment Fragment to inject.
 * @returns Enriched document.
 */
export declare function injectBeforeBodyEnd(html: string, fragment: string): string;
/**
 * Injects a fragment just before `</head>` if possible, otherwise prepends it.
 *
 * @summary Inserts an HTML fragment at the start of the document body.
 * @param html Source HTML document.
 * @param fragment Fragment to inject.
 * @returns Enriched document.
 */
export declare function injectBeforeHeadEnd(html: string, fragment: string): string;
/**
 * Injects the shared runtime into an existing HTML document.
 *
 * @summary Adds error and height reporting to an HTML document.
 * @param html Source HTML document.
 * @returns Enriched document.
 */
export declare function injectCommonRuntime(html: string): string;
/**
 * Injects the console bridge into an existing HTML document.
 *
 * @summary Adds the console bridge between iframe and parent.
 * @param html Source HTML document.
 * @returns Enriched document.
 */
export declare function injectConsoleBridge(html: string): string;
/**
 * Builds a complete HTML page from a body and optional scripts.
 *
 * @summary Builds a complete `srcdoc`.
 * @param options Build options.
 * @returns Complete HTML document.
 */
export declare function createHtmlDocument(options: {
    /** Document title. */
    title: string;
    /** `<body>` content. */
    body?: string;
    /** Additional fragments inserted at the end of `<body>`. */
    trailingBodyFragments?: readonly string[];
}): string;
/**
 * Builds an HTML document ready to execute an inline ECMAScript module.
 *
 * @summary Creates an execution HTML shell for JS/TS.
 * @param options Build options.
 * @returns Complete HTML document.
 */
export declare function createModuleExecutionDocument(options: {
    title: string;
    moduleCode: string;
    showConsole: boolean;
    body?: string;
    importmap?: ImportMap;
}): string;
/**
 * Builds a minimal instrumented HTML document.
 *
 * @summary Creates an HTML document instrumented with the shared runtime.
 * @param options Build options.
 * @returns Complete HTML document.
 */
export declare function createInstrumentedHtmlDocument(options: {
    /** Document title. */
    title: string;
    /** Main HTML body. */
    body?: string;
    /** Enables the console bridge to the parent. */
    showConsole: boolean;
}): string;
