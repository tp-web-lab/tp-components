/**
 * @module components/playground/playground-build-utils
 * @summary Shared utilities for building playground execution documents.
 */

import { init, parse } from "es-module-lexer";
import ts from "typescript";
import { resolveSpecifier } from "../../utilities/importmap/importmap-resolver.js";
import type { ImportMap } from "../../utilities/importmap/importmap-types.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpProject } from "./project.js";

const CSS_MODULE_QUERY = "?tp-css-module";

/**
 * Supported source kinds for utility helpers.
 *
 * @summary Represents a simple source-file family.
 */
export type TpSourceKind =
	| "javascript"
	| "typescript"
	| "python"
	| "html"
	| "css"
	| "json"
	| "markdown"
	| "prolog"
	| "text";

/**
 * Returns whether a module specifier should be left untouched.
 *
 * @summary Detects an external or special import.
 * @param value Source specifier.
 * @returns `true` when no local rewrite should be applied.
 */
export function isExternalModuleSpecifier(value: string): boolean {
	return (
		value.startsWith("http://") ||
		value.startsWith("https://") ||
		value.startsWith("data:") ||
		value.startsWith("blob:") ||
		value.startsWith("npm:") ||
		value.startsWith("#")
	);
}

/**
 * Resolves a simple relative path against a source file.
 *
 * @summary Resolves a local path such as `./x` or `../x`.
 * @param fromPath Current file path.
 * @param relativePath Relative reference.
 * @returns Logical absolute path in the project.
 */
export function resolveProjectRelativePath(
	fromPath: string,
	relativePath: string,
): string {
	if (relativePath.startsWith("/")) {
		return relativePath;
	}

	const fromSegments = fromPath.split("/").filter(Boolean);
	fromSegments.pop();

	const relativeSegments = relativePath.split("/").filter(Boolean);
	const outputSegments = [...fromSegments];

	for (const segment of relativeSegments) {
		if (segment === ".") {
			continue;
		}

		if (segment === "..") {
			outputSegments.pop();
			continue;
		}

		outputSegments.push(segment);
	}

	return `/${outputSegments.join("/")}`;
}

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

function rewriteLocalCssModuleImportAttributes(code: string): string {
	return code.replace(
		/import\s+([A-Za-z_$][\w$]*)\s+from\s+(['"])((?:\.{1,2}\/|\/)[^'"]+\.css)\2\s+(?:with|assert)\s*\{\s*type\s*:\s*(['"])css\4\s*\}\s*;?/g,
		(_match, binding: string, quote: string, specifier: string) =>
			`import ${binding} from ${quote}${specifier}${CSS_MODULE_QUERY}${quote};`,
	);
}

function splitProjectPathQuery(path: string): {
	pathname: string;
	query: string;
} {
	const queryStart = path.indexOf("?");

	if (queryStart < 0) {
		return { pathname: path, query: "" };
	}

	return {
		pathname: path.slice(0, queryStart),
		query: path.slice(queryStart),
	};
}

function createCssStyleSheetModule(css: string): string {
	return `const sheet = new CSSStyleSheet();
sheet.replaceSync(${toJavascriptLiteral(css)});
export default sheet;
`;
}

/**
 * Parses ES module dependencies from JavaScript source.
 *
 * @summary Returns static imports, dynamic imports, and re-exports.
 * @param code JavaScript source code.
 * @returns Detected dependencies.
 */
export async function parseModuleDependencies(
	code: string,
): Promise<TpModuleDependency[]> {
	await init;

	const [imports] = parse(code);
	const dependencies: TpModuleDependency[] = [];

	for (const entry of imports) {
		if (entry.n === undefined) {
			continue;
		}

		dependencies.push({
			start: entry.s,
			end: entry.e,
			specifier: code.slice(entry.s, entry.e),
			isDynamic: entry.d > -1,
		});
	}

	return dependencies;
}

/**
 * Rewrites local imports in a JavaScript module.
 *
 * @summary Replaces local specifiers with their Blob URLs.
 * @param code Module source code.
 * @param fromPath Logical path of the source module.
 * @param resolver Resolves a logical local path to a final URL.
 * @returns Rewritten code.
 */
export async function rewriteJavaScriptModuleImports(
	code: string,
	fromPath: string,
	resolver: (resolvedPath: string) => Promise<string>,
	importmap?: ImportMap,
): Promise<string> {
	const normalizedCode = rewriteLocalCssModuleImportAttributes(code);
	const dependencies = await parseModuleDependencies(normalizedCode);

	if (dependencies.length === 0) {
		return normalizedCode;
	}

	let output = "";
	let cursor = 0;

	for (const dependency of dependencies) {
		output += normalizedCode.slice(cursor, dependency.start);

		const rawSpecifier = dependency.specifier;

		if (isExternalModuleSpecifier(rawSpecifier)) {
			output += rawSpecifier;
			cursor = dependency.end;
			continue;
		}

		const isLocalSpecifier =
			rawSpecifier.startsWith("./") ||
			rawSpecifier.startsWith("../") ||
			rawSpecifier.startsWith("/");

		if (!isLocalSpecifier) {
			const resolvedSpecifier = resolveSpecifier(rawSpecifier, importmap);

			console.log("rewrite import", {
				fromPath,
				rawSpecifier,
				resolvedSpecifier,
			});

			output += resolvedSpecifier ?? rawSpecifier;
			cursor = dependency.end;
			continue;
		}

		const resolvedPath = resolveProjectRelativePath(fromPath, rawSpecifier);
		const nextUrl = await resolver(resolvedPath);

		output += nextUrl;
		cursor = dependency.end;
	}

	output += normalizedCode.slice(cursor);
	return output;
}

/**
 * Decodes HTML entities (&lt;, &gt;, &amp;, etc.).
 *
 * @summary Converts escaped HTML into real HTML.
 * @param value Escaped HTML text.
 * @returns Decoded HTML.
 */
export function decodeHtmlEntities(value: string): string {
	const textarea = document.createElement("textarea");
	textarea.innerHTML = value;
	return textarea.value;
}

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
export function toJavascriptLiteral(value: string): string {
	return JSON.stringify(value);
}

/**
 * Escapes a string for HTML text insertion.
 *
 * @summary Escapes special HTML characters.
 * @param value Source text.
 * @returns Escaped text.
 */
export function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

/**
 * Returns the last segment of a path.
 *
 * @summary Extracts the final file name.
 * @param path Source path.
 * @returns File name or original path.
 */
export function getBasename(path: string): string {
	return path.split("/").filter(Boolean).at(-1) ?? path;
}

/**
 * Returns whether a path has one of the provided extensions.
 *
 * @summary Checks a path extension.
 * @param path Path to test.
 * @param extensions Expected extensions.
 * @returns `true` when the path matches.
 */
export function hasExtension(
	path: string,
	extensions: readonly string[],
): boolean {
	return extensions.some((extension) => path.endsWith(extension));
}

/** Returns the MIME type for a project file. */
export function getProjectFileMimeType(file: TpFile): string {
	const path = file.path;

	if (path.endsWith(".html") || path.endsWith(".htm")) {
		return "text/html";
	}

	if (path.endsWith(".css")) {
		return "text/css";
	}

	if (path.endsWith(".js") || path.endsWith(".mjs") || path.endsWith(".cjs")) {
		return "text/javascript";
	}

	if (path.endsWith(".json")) {
		return "application/json";
	}

	if (path.endsWith(".svg")) {
		return "image/svg+xml";
	}

	return "text/plain";
}

/** Returns whether a file should be treated as a JavaScript module. */
export function isJavaScriptModuleFile(file: TpFile): boolean {
	return (
		file.path.endsWith(".js") ||
		file.path.endsWith(".mjs") ||
		file.path.endsWith(".cjs")
	);
}

/** Creates Blob URLs for non-module files. */
export function createStaticBlobUrls(
	files: readonly TpFile[],
): Map<string, string> {
	const urls = new Map<string, string>();

	for (const file of files) {
		if (isJavaScriptModuleFile(file)) {
			continue;
		}

		const blob = new Blob([file.content], {
			type: getProjectFileMimeType(file),
		});

		urls.set(file.path, URL.createObjectURL(blob));
	}

	return urls;
}

/** Creates Blob URLs for JavaScript module files. */
export async function createJavaScriptModuleBlobUrls(
	files: readonly TpFile[],
	staticBlobUrls: ReadonlyMap<string, string>,
	importmap?: ImportMap,
): Promise<Map<string, string>> {
	const fileMap = new Map(files.map((file) => [file.path, file]));
	const moduleUrls = new Map<string, string>();
	const inProgress = new Map<string, Promise<string>>();

	const buildModule = async (path: string): Promise<string> => {
		const existingUrl = moduleUrls.get(path);

		if (existingUrl !== undefined) {
			return existingUrl;
		}

		const pending = inProgress.get(path);

		if (pending !== undefined) {
			return pending;
		}

		const task = (async (): Promise<string> => {
			const file = fileMap.get(path);

			if (file === undefined) {
				throw new Error(`Module not found: ${path}`);
			}

			const rewrittenCode = await rewriteJavaScriptModuleImports(
				file.content,
				file.path,
				async (resolvedPath: string): Promise<string> => {
					const { pathname, query } = splitProjectPathQuery(resolvedPath);

					if (query === CSS_MODULE_QUERY) {
						const existingUrl = moduleUrls.get(resolvedPath);

						if (existingUrl !== undefined) {
							return existingUrl;
						}

						const cssDependency = fileMap.get(pathname);

						if (cssDependency === undefined) {
							throw new Error(`CSS module not found: ${pathname}`);
						}

						const blob = new Blob(
							[createCssStyleSheetModule(cssDependency.content)],
							{
								type: "text/javascript",
							},
						);
						const url = URL.createObjectURL(blob);
						moduleUrls.set(resolvedPath, url);
						return url;
					}

					const staticUrl = staticBlobUrls.get(pathname);

					if (staticUrl !== undefined) {
						return staticUrl;
					}

					const dependency = fileMap.get(pathname);

					if (dependency === undefined) {
						throw new Error(`Dependency not found: ${pathname}`);
					}

					if (isJavaScriptModuleFile(dependency)) {
						return buildModule(pathname);
					}

					const blob = new Blob([dependency.content], {
						type: getProjectFileMimeType(dependency),
					});

					return URL.createObjectURL(blob);
				},
				importmap,
			);

			const blob = new Blob([rewrittenCode], {
				type: "text/javascript",
			});

			const url = URL.createObjectURL(blob);
			moduleUrls.set(path, url);
			return url;
		})();

		inProgress.set(path, task);

		try {
			return await task;
		} finally {
			inProgress.delete(path);
		}
	};

	for (const file of files) {
		if (isJavaScriptModuleFile(file)) {
			await buildModule(file.path);
		}
	}

	return moduleUrls;
}

/** Returns whether a file should be treated as a TypeScript module. */
export function isTypescriptModuleFile(file: TpFile): boolean {
	return file.path.endsWith(".ts") || file.path.endsWith(".tsx");
}

/** Converts a TypeScript path to its JavaScript output path. */
export function toJavaScriptPath(path: string): string {
	return path.replace(/\.tsx?$/, ".js");
}

/** Transpiles TypeScript source to JavaScript. */
export function transpileTypescript(source: string): string {
	return ts.transpileModule(source, {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.ESNext,
			jsx: ts.JsxEmit.ReactJSX,
			useDefineForClassFields: false,
		},
	}).outputText;
}

function resolveTypescriptDependency(
	resolvedPath: string,
	fileMap: ReadonlyMap<string, TpFile>,
): TpFile | undefined {
	const exact = fileMap.get(resolvedPath);

	if (exact !== undefined) {
		return exact;
	}

	if (resolvedPath.endsWith(".js")) {
		return (
			fileMap.get(resolvedPath.replace(/\.js$/, ".ts")) ??
			fileMap.get(resolvedPath.replace(/\.js$/, ".tsx"))
		);
	}

	return undefined;
}

/** Creates Blob URLs for TypeScript module files. */
export async function createTypescriptModuleBlobUrls(
	files: readonly TpFile[],
	staticBlobUrls: ReadonlyMap<string, string>,
	importmap?: ImportMap,
): Promise<Map<string, string>> {
	const fileMap = new Map(files.map((file) => [file.path, file]));
	const moduleUrls = new Map<string, string>();
	const inProgress = new Map<string, Promise<string>>();

	const buildModule = async (path: string): Promise<string> => {
		const existingUrl = moduleUrls.get(path);

		if (existingUrl !== undefined) {
			return existingUrl;
		}

		const pending = inProgress.get(path);

		if (pending !== undefined) {
			return pending;
		}

		const task = (async (): Promise<string> => {
			const file = fileMap.get(path);

			if (file === undefined) {
				throw new Error(`Module not found: ${path}`);
			}

			const source = isTypescriptModuleFile(file)
				? transpileTypescript(file.content)
				: file.content;

			const rewrittenCode = await rewriteJavaScriptModuleImports(
				source,
				toJavaScriptPath(file.path),
				async (resolvedPath: string): Promise<string> => {
					const dependency = resolveTypescriptDependency(resolvedPath, fileMap);
					if (
						dependency &&
						(isTypescriptModuleFile(dependency) ||
							isJavaScriptModuleFile(dependency))
					) {
						return buildModule(dependency.path);
					}
					const staticUrl = staticBlobUrls.get(resolvedPath);

					if (staticUrl !== undefined) {
						return staticUrl;
					}

					if (dependency === undefined) {
						throw new Error(`Dependency not found: ${resolvedPath}`);
					}

					return buildModule(dependency.path);
				},
				importmap,
			);

			const url = URL.createObjectURL(
				new Blob([rewrittenCode], {
					type: "text/javascript",
				}),
			);

			moduleUrls.set(path, url);
			return url;
		})();

		inProgress.set(path, task);

		try {
			return await task;
		} finally {
			inProgress.delete(path);
		}
	};

	for (const file of files) {
		if (
			isTypescriptModuleFile(file) ||
			file.path.endsWith(".js") ||
			file.path.endsWith(".mjs") ||
			file.path.endsWith(".cjs")
		) {
			await buildModule(file.path);
		}
	}

	return moduleUrls;
}
/**
 * Infers a simple source kind from a file path.
 *
 * @summary Infers a file content type.
 * @param path File path.
 * @returns File kind.
 */
export function inferSourceKind(path: string): TpSourceKind {
	if (hasExtension(path, [".ts", ".tsx"])) {
		return "typescript";
	}

	if (hasExtension(path, [".js", ".mjs", ".cjs"])) {
		return "javascript";
	}

	if (hasExtension(path, [".py"])) {
		return "python";
	}

	if (hasExtension(path, [".pl"])) {
		return "prolog";
	}

	if (hasExtension(path, [".html", ".htm"])) {
		return "html";
	}

	if (hasExtension(path, [".css"])) {
		return "css";
	}

	if (hasExtension(path, [".json"])) {
		return "json";
	}

	if (hasExtension(path, [".md"])) {
		return "markdown";
	}

	return "text";
}

/**
 * Finds a file by its exact path.
 *
 * @summary Returns a file from the project.
 * @param project Current project.
 * @param path Exact path to find.
 * @returns Found file or `undefined`.
 */
export function findProjectFile(
	project: TpProject,
	path: string,
): TpFile | undefined {
	return project.files.find((file) => file.path === path);
}

/**
 * Finds the first file matching a list of priority paths.
 *
 * @summary Returns the first file found in explicit order.
 * @param project Current project.
 * @param paths Priority candidate paths.
 * @returns Found file or `undefined`.
 */
export function findProjectFileByPriorityPaths(
	project: TpProject,
	paths: readonly string[],
): TpFile | undefined {
	for (const path of paths) {
		const file = findProjectFile(project, path);

		if (file !== undefined) {
			return file;
		}
	}

	return undefined;
}

/**
 * Finds the first file matching one of the provided extensions.
 *
 * @summary Returns the first file compatible with a list of extensions.
 * @param project Current project.
 * @param extensions Expected extensions.
 * @returns Found file or `undefined`.
 */
export function findFirstFileByExtensions(
	project: TpProject,
	extensions: readonly string[],
): TpFile | undefined {
	return project.files.find((file) => hasExtension(file.path, extensions));
}

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
export function resolveEntryFile(
	project: TpProject,
	options: {
		/** Optional entry point. */
		entry?: string;

		/** Priority paths. */
		priorityPaths?: readonly string[];

		/** Compatible extensions. */
		extensions?: readonly string[];

		/** Allows falling back to the first project file. */
		fallbackToFirstFile?: boolean;
		ignoreProjectEntry?: boolean;
	},
): TpFile | undefined {
	const fromExplicitEntry =
		typeof options.entry === "string" && options.entry !== ""
			? findProjectFile(project, options.entry)
			: undefined;

	if (fromExplicitEntry !== undefined) {
		return fromExplicitEntry;
	}

	const fromProjectEntry =
		options.ignoreProjectEntry !== true &&
		typeof project.entry === "string" &&
		project.entry !== ""
			? findProjectFile(project, project.entry)
			: undefined;

	if (fromProjectEntry !== undefined) {
		return fromProjectEntry;
	}

	const fromPriorityPaths =
		Array.isArray(options.priorityPaths) && options.priorityPaths.length > 0
			? findProjectFileByPriorityPaths(project, options.priorityPaths)
			: undefined;

	if (fromPriorityPaths !== undefined) {
		return fromPriorityPaths;
	}

	const fromExtensions =
		Array.isArray(options.extensions) && options.extensions.length > 0
			? findFirstFileByExtensions(project, options.extensions)
			: undefined;

	if (fromExtensions !== undefined) {
		return fromExtensions;
	}

	if (options.fallbackToFirstFile) {
		return project.files.at(0);
	}

	return undefined;
}

/**
 * Resolves the content of an entry file.
 *
 * @summary Returns the content of the main file.
 * @param project Current project.
 * @param options Resolution options.
 * @returns Found file content.
 * @throws {Error} If no entry file is found.
 */
export function resolveEntryFileContent(
	project: TpProject,
	options: {
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
	},
): string {
	const file = resolveEntryFile(project, {
		entry: options.entry,
		priorityPaths: options.priorityPaths,
		extensions: options.extensions,
		fallbackToFirstFile: options.fallbackToFirstFile,
	});

	if (file === undefined) {
		throw new Error(options.notFoundMessage);
	}

	return file.content;
}

/**
 * Creates the shared runtime script for error and height reporting.
 *
 * @summary Generates the shared runtime instrumentation.
 * @returns Ready-to-inject `<script>` block.
 */
export function createCommonRuntimeScript(): string {
	return `
<script>
function tpPostToParent(message) {
  const targetWindow = window.parent !== window ? window.parent : window.top;

  if (
    targetWindow !== null &&
    typeof targetWindow.postMessage === 'function'
  ) {
    targetWindow.postMessage(message, '*');
    return;
  }

  if (typeof Window.prototype.postMessage === 'function') {
    Window.prototype.postMessage.call(targetWindow, message, '*');
  }
}

window.addEventListener('error', (event) => {
  tpPostToParent({
    type: 'tp-playground-runtime-error',
    message: event.message
  });
});

function tpPlaygroundReportHeight() {
  const bodyHeight =
    document.body instanceof HTMLBodyElement ? document.body.scrollHeight : 0;

  const documentHeight = document.documentElement.scrollHeight;
  const height = Math.max(bodyHeight, documentHeight);

  tpPostToParent({
    type: 'tp-playground-content-height',
    height
  });
}

window.tpPlaygroundReportHeight = tpPlaygroundReportHeight;

window.addEventListener('load', () => {
  tpPlaygroundReportHeight();
});

if (typeof ResizeObserver !== 'undefined') {
  const observer = new ResizeObserver(() => {
    tpPlaygroundReportHeight();
  });

  observer.observe(document.documentElement);
}
</script>
`;
}

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
export function createConsoleBridgeScript(): string {
	return `
<script>
if (typeof window.tpPostToParent !== 'function') {
  window.tpPostToParent = function tpPostToParent(message) {
    const targetWindow = window.parent !== window ? window.parent : window.top;

    if (
      targetWindow !== null &&
      typeof targetWindow.postMessage === 'function'
    ) {
      targetWindow.postMessage(message, '*');
      return;
    }

    if (typeof Window.prototype.postMessage === 'function') {
      Window.prototype.postMessage.call(targetWindow, message, '*');
    }
  };
}

function tpConsoleSerialize(value, seen = new WeakSet()) {
  if (value === null) {
    return null;
  }

  if (value === undefined) {
    return { __tp_console_type: 'undefined' };
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'bigint') {
    return {
      __tp_console_type: 'bigint',
      value: String(value)
    };
  }

  if (typeof value === 'function') {
    return {
      __tp_console_type: 'function',
      name: value.name || '(anonymous)'
    };
  }

  if (value instanceof Date) {
    return {
      __tp_console_type: 'date',
      value: value.toISOString()
    };
  }

  if (value instanceof Error) {
    return {
      __tp_console_type: 'error',
      name: value.name,
      message: value.message,
      stack: typeof value.stack === 'string' ? value.stack : undefined
    };
  }

  if (typeof value !== 'object') {
    return String(value);
  }

  if (seen.has(value)) {
    return {
      __tp_console_type: 'circular'
    };
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => tpConsoleSerialize(item, seen));
  }

  const output = {};

  for (const [key, entryValue] of Object.entries(value)) {
    output[key] = tpConsoleSerialize(entryValue, seen);
  }

  return output;
}

function tpConsolePost(kind, args) {
  window.tpPostToParent({
    type: 'tp-playground-console-entry',
    kind,
    values: Array.from(args, (value) => tpConsoleSerialize(value))
  });

  window.tpPostToParent({
    type: 'tp-playground-console-change'
  });

  if (typeof window.tpPlaygroundReportHeight === 'function') {
    window.tpPlaygroundReportHeight();
  }
}

const originalLog = console.log.bind(console);
const originalInfo = console.info.bind(console);
const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);
const originalTable = console.table.bind(console);
const originalGroup = console.group.bind(console);
const originalGroupCollapsed = console.groupCollapsed.bind(console);
const originalGroupEnd = console.groupEnd.bind(console);
const originalAssert = console.assert.bind(console);
const originalCount = console.count.bind(console);
const originalCountReset = console.countReset.bind(console);
const originalTime = console.time.bind(console);
const originalTimeEnd = console.timeEnd.bind(console);
const originalTimeLog = console.timeLog.bind(console);

console.log = (...args) => {
  originalLog(...args);
  tpConsolePost('log', args);
};

console.info = (...args) => {
  originalInfo(...args);
  tpConsolePost('info', args);
};

console.warn = (...args) => {
  originalWarn(...args);
  tpConsolePost('warn', args);
};

console.error = (...args) => {
  originalError(...args);
  tpConsolePost('error', args);
};

window.addEventListener('error', (event) => {
  const error = event.error instanceof Error
    ? event.error
    : new Error(event.message || 'Uncaught JavaScript error');
  tpConsolePost('error', [error]);
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason ?? 'Unhandled promise rejection'));
  tpConsolePost('error', [reason]);
});

console.table = (...args) => {
  originalTable(...args);
  tpConsolePost('table', args);
};

console.group = (...args) => {
  originalGroup(...args);
  tpConsolePost('group', args);
};

console.groupCollapsed = (...args) => {
  originalGroupCollapsed(...args);
  tpConsolePost('group-collapsed', args);
};

console.groupEnd = () => {
  originalGroupEnd();
  tpConsolePost('group-end', []);
};

const tpCounts = new Map();
const tpTimers = new Map();

console.assert = (condition, ...args) => {
  originalAssert(condition, ...args);

  if (!condition) {
    tpConsolePost('assert', args.length > 0 ? args : ['Assertion failed']);
  }
};

console.count = (label = 'default') => {
  originalCount(label);

  const nextValue = (tpCounts.get(label) || 0) + 1;
  tpCounts.set(label, nextValue);

  tpConsolePost('count', [String(label) + ': ' + String(nextValue)]);
};

console.countReset = (label = 'default') => {
  originalCountReset(label);
  tpCounts.set(label, 0);
};

console.time = (label = 'default') => {
  originalTime(label);
  tpTimers.set(label, performance.now());
};

console.timeLog = (label = 'default', ...args) => {
  originalTimeLog(label, ...args);

  const start = tpTimers.get(label);

  if (start === undefined) {
    tpConsolePost('warn', ["Timer '" + String(label) + "' does not exist"]);
    return;
  }

  const duration = performance.now() - start;
  tpConsolePost('time', [
    String(label) + ': ' + duration.toFixed(2) + ' ms',
    ...args
  ]);
};

console.timeEnd = (label = 'default') => {
  originalTimeEnd(label);

  const start = tpTimers.get(label);

  if (start === undefined) {
    tpConsolePost('warn', ["Timer '" + String(label) + "' does not exist"]);
    return;
  }

  const duration = performance.now() - start;
  tpTimers.delete(label);

  tpConsolePost('time', [
    String(label) + ': ' + duration.toFixed(2) + ' ms'
  ]);
};

console.clear = () => {
  window.tpPostToParent({
    type: 'tp-playground-console-clear'
  });

  window.tpPostToParent({
    type: 'tp-playground-console-change'
  });
};
</script>
`;
}

/**
 * Injects a fragment just before `</body>` if possible, otherwise appends it.
 *
 * @summary Inserts an HTML fragment at the end of the document.
 * @param html Source HTML document.
 * @param fragment Fragment to inject.
 * @returns Enriched document.
 */
export function injectBeforeBodyEnd(html: string, fragment: string): string {
	if (html.includes("</body>")) {
		return html.replace("</body>", `${fragment}</body>`);
	}

	return `${html}\n${fragment}`;
}

/**
 * Injects a fragment just before `</head>` if possible, otherwise prepends it.
 *
 * @summary Inserts an HTML fragment at the start of the document body.
 * @param html Source HTML document.
 * @param fragment Fragment to inject.
 * @returns Enriched document.
 */
export function injectBeforeHeadEnd(html: string, fragment: string): string {
	if (html.includes("</head>")) {
		return html.replace("</head>", `${fragment}</head>`);
	}

	return `${fragment}\n${html}`;
}

/**
 * Injects the shared runtime into an existing HTML document.
 *
 * @summary Adds error and height reporting to an HTML document.
 * @param html Source HTML document.
 * @returns Enriched document.
 */
export function injectCommonRuntime(html: string): string {
	return injectBeforeBodyEnd(html, createCommonRuntimeScript());
}

/**
 * Injects the console bridge into an existing HTML document.
 *
 * @summary Adds the console bridge between iframe and parent.
 * @param html Source HTML document.
 * @returns Enriched document.
 */
export function injectConsoleBridge(html: string): string {
	return injectBeforeBodyEnd(html, createConsoleBridgeScript());
}

/**
 * Builds a complete HTML page from a body and optional scripts.
 *
 * @summary Builds a complete `srcdoc`.
 * @param options Build options.
 * @returns Complete HTML document.
 */
export function createHtmlDocument(options: {
	/** Document title. */
	title: string;

	/** `<body>` content. */
	body?: string;

	/** Additional fragments inserted at the end of `<body>`. */
	trailingBodyFragments?: readonly string[];
}): string {
	const body = options.body ?? "";
	const trailingBodyFragments = options.trailingBodyFragments ?? [];
	const trailing = trailingBodyFragments.join("\n");

	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body>
${body}
${trailing}
  </body>
</html>`;
}

/**
 * Builds an HTML document ready to execute an inline ECMAScript module.
 *
 * @summary Creates an execution HTML shell for JS/TS.
 * @param options Build options.
 * @returns Complete HTML document.
 */
export function createModuleExecutionDocument(options: {
	title: string;
	moduleCode: string;
	showConsole: boolean;
	body?: string;
	importmap?: ImportMap;
}): string {
	const fragments: string[] = [createCommonRuntimeScript()];

	if (options.showConsole) {
		fragments.push(createConsoleBridgeScript());
	}

	if (options.importmap !== undefined) {
		fragments.push(`
<script type="importmap">
${JSON.stringify(options.importmap, null, 2)}
</script>
`);
	}

	fragments.push(`
<script type="module">
${options.moduleCode}
</script>
`);

	return createHtmlDocument({
		title: options.title,
		body: options.body ?? '    <main id="app"></main>',
		trailingBodyFragments: fragments,
	});
}

/**
 * Builds a minimal instrumented HTML document.
 *
 * @summary Creates an HTML document instrumented with the shared runtime.
 * @param options Build options.
 * @returns Complete HTML document.
 */
export function createInstrumentedHtmlDocument(options: {
	/** Document title. */
	title: string;

	/** Main HTML body. */
	body?: string;

	/** Enables the console bridge to the parent. */
	showConsole: boolean;
}): string {
	const fragments: string[] = [createCommonRuntimeScript()];

	if (options.showConsole) {
		fragments.push(createConsoleBridgeScript());
	}

	return createHtmlDocument({
		title: options.title,
		body: options.body,
		trailingBodyFragments: fragments,
	});
}
