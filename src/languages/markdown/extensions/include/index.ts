/**
 * @module markdown/extensions/include
 * @summary Markdown extension for recursive file inclusion.
 *
 * This extension adds support for `::include{...}` directives inside Markdown
 * documents. Included files are resolved from an in-memory virtual file system
 * and expanded before Markdown rendering.
 *
 * Features:
 *
 * - relative and absolute path resolution
 * - recursive include expansion
 * - circular include detection
 * - virtual file system support
 *
 * Example:
 *
 * ```md
 * ::include{./chapter1.md}
 * ```
 */

import type MarkdownIt from 'markdown-it';

/**
 * Configuration options for the include extension.
 */
export interface TpMarkdownIncludeOptions {
  /**
   * Virtual file system used to resolve include targets.
   *
   * Keys are file paths and values are file contents.
   */
  files?: Record<string, string>;

  /**
   * Default entry path used as the base directory when no rendering path
   * is available in the environment.
   */
  entryPath?: string;
}

/**
 * Rendering environment used during include expansion.
 */
interface TpMarkdownEnvironment {
  /**
   * Current source file path.
   */
  path?: string;

  /**
   * Additional renderer-specific properties.
   */
  [key: string]: unknown;
}

/**
 * Registers the Markdown include extension.
 *
 * The extension overrides the default markdown-it render method in order
 * to expand include directives before the Markdown source is parsed.
 *
 * @param md - markdown-it instance.
 * @param options - Include extension configuration.
 */
export default function tpMarkdownInclude(
  md: MarkdownIt,
  options: TpMarkdownIncludeOptions = {},
): void {
  const files = options.files ?? {};
  const entryPath = options.entryPath ?? '/index.md';

  const originalRender = md.render.bind(md);

  md.render = (
    source: string,
    env: TpMarkdownEnvironment = {},
  ): string => {
    const fromPath =
      typeof env.path === 'string' && env.path !== ''
        ? env.path
        : entryPath;

    return originalRender(
      expandIncludes(source, fromPath, files),
      env,
    );
  };
}

/**
 * Resolves a relative include path against a source file path.
 *
 * Supports:
 *
 * - absolute paths
 * - relative paths
 * - `.` and `..` segments
 *
 * @param fromPath - Current source file path.
 * @param targetPath - Include target path.
 * @returns Normalized absolute path.
 */
function resolvePath(
  fromPath: string,
  targetPath: string,
): string {
  if (targetPath.startsWith('/')) {
    return targetPath;
  }

  const fromParts = fromPath.split('/').filter(Boolean);
  fromParts.pop();

  const outputParts = [...fromParts];

  for (const part of targetPath.split('/')) {
    if (part === '' || part === '.') {
      continue;
    }

    if (part === '..') {
      outputParts.pop();
      continue;
    }

    outputParts.push(part);
  }

  return `/${outputParts.join('/')}`;
}

/**
 * Expands all `::include{...}` directives recursively.
 *
 * Circular references are detected and replaced with warning messages.
 * Missing include targets also produce warning blocks.
 *
 * @param source - Markdown source content.
 * @param fromPath - Current source file path.
 * @param files - Virtual file system.
 * @param seen - Set of already expanded file paths.
 * @returns Expanded Markdown source.
 */
function expandIncludes(
  source: string,
  fromPath: string,
  files: Record<string, string>,
  seen: Set<string> = new Set<string>(),
): string {
  return source.replace(
    /^::include\{(.+?)\}\s*$/gm,
    (_match: string, rawTarget: string): string => {
      const target = rawTarget.trim();
      const path = resolvePath(fromPath, target);

      if (seen.has(path)) {
        return `> Circular include ignored: \`${path}\``;
      }

      const content = files[path];

      if (typeof content !== 'string') {
        return `> Include not found: \`${path}\``;
      }

      seen.add(path);

      const expanded = expandIncludes(
        content,
        path,
        files,
        seen,
      );

      seen.delete(path);

      return expanded;
    },
  );
}