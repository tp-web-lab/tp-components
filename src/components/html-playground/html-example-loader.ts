/**
 * @module components/html-playground/html-example-loader
 * @summary HTML example loading helpers.
 */

import { TpHtmlProject } from './html-project.js';
import type { TpFile } from '../filesystem/filesystem.types.js';

/** Metadata stored with HTML examples. */
interface HtmlExampleMetadata {
  id?: string;
  label?: string;
  name?: string;
  entry?: string;
  importmap?: Record<string, unknown>;
}

/** File manifest for HTML examples. */
interface HtmlExampleFilesManifest {
  files?: string[];
}

/** Joins a base URL and relative path. */
function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/** Normalizes a project path. */
function toProjectPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/** Infers the editor language for an HTML example file. */
function inferLanguage(path: string): string {
  if (path.endsWith('.html')) return 'html';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.js') || path.endsWith('.mjs')) return 'javascript';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  return 'text';
}

/** Fetches JSON from the given URL. */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load ${url}`);
  }

  return (await response.json()) as T;
}

/** Fetches text from the given URL. */
async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load ${url}`);
  }

  return response.text();
}

/** Loads an HTML project from a directory-based example package. */
export async function loadHtmlProjectFromDirectory(
  baseUrl: string,
): Promise<TpHtmlProject> {
  const metadata = await fetchJson<HtmlExampleMetadata>(
    joinUrl(baseUrl, 'project.json'),
  );

  const manifest = await fetchJson<HtmlExampleFilesManifest>(
    joinUrl(baseUrl, '.files.json'),
  );

  const files: TpFile[] = [];

  for (const path of manifest.files ?? []) {
    files.push({
      path: toProjectPath(path),
      content: await fetchText(joinUrl(baseUrl, path)),
      language: inferLanguage(path),
    });
  }

  return new TpHtmlProject({
    name: metadata.name ?? metadata.label ?? metadata.id ?? 'HTML project',
    entry: metadata.entry ?? '/index.html',
    importmap: metadata.importmap,
    files,
  });
}