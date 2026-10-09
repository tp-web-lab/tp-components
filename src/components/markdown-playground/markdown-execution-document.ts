/**
 * @module components/markdown-playground/markdown-execution-document
 * @summary Markdown execution document builder.
 */

import type { TpExecutionDocument } from '../playground/playground.js';

import {
  createCommonRuntimeScript,
  createConsoleBridgeScript,
  findProjectFile,
  resolveEntryFile,
} from '../playground/playground-build-utils.js';

import type { TpMarkdownProject } from './markdown-project.js';

/** Options for building a Markdown execution document. */
export interface BuildMarkdownExecutionDocumentOptions {
  entry?: string;
}

/** Escapes closing script tags for safe inline serialization. */
function toSafeScriptJson(value: unknown): string {
  return JSON.stringify(value).replaceAll('</script', '<\\/script');
}

/** Builds the Markdown execution document. */
export async function buildMarkdownExecutionDocument(
  project: TpMarkdownProject,
  options: BuildMarkdownExecutionDocumentOptions = {},
): Promise<TpExecutionDocument> {
  const entryFile = resolveEntryFile(project, {
    entry: options.entry,
    priorityPaths: ['/index.md', '/main.md'],
    extensions: ['.md', '.markdown'],
    fallbackToFirstFile: false,
  });

  if (entryFile === undefined) {
    throw new Error('No Markdown entry file found.');
  }

  const htmlFile = findProjectFile(project, '/index.html');
  const extraHtml = htmlFile?.content ?? '';
  const projectFiles = Object.fromEntries(
    project.files.map((file) => [file.path, file.content]),
  );
  const projectFilesJson = toSafeScriptJson(projectFiles);
  const entryPathJson = toSafeScriptJson(entryFile.path);

  return {
    html: `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  ${extraHtml}
  <style>
    body {
      font-family: system-ui, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 1rem;
    }

    tp-markdown {
      display: block;
      max-inline-size: 72rem;
    }
  </style>
</head>
<body>
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}

  <script>
    const tpMarkdownPlaygroundFiles = ${projectFilesJson};
    const tpMarkdownPlaygroundFetch = window.fetch.bind(window);

    window.fetch = (input, init) => {
      const requestUrl =
        input instanceof Request
          ? input.url
          : typeof input === 'string' || input instanceof URL
            ? String(input)
            : '';

      try {
        const url = new URL(requestUrl, window.location.href);
        const content = tpMarkdownPlaygroundFiles[url.pathname];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      } catch {
        const content = tpMarkdownPlaygroundFiles[requestUrl];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      }

      return tpMarkdownPlaygroundFetch(input, init);
    };

    document.addEventListener('tp-markdown-rendered', () => {
      if (typeof window.tpPlaygroundReportHeight === 'function') {
        window.tpPlaygroundReportHeight();
      }
    }, true);
  </script>

  <tp-markdown src=${entryPathJson}></tp-markdown>

  <script type="module">
    const isViteDev =
      window.parent?.document?.querySelector('script[src*="/@vite/client"]') !== null;

    async function importFirstAvailable(candidates, label) {
      let lastError = null;

      for (const candidate of candidates) {
        try {
          const url = new URL(candidate, window.parent.location.origin).href;
          await import(url);
          return;
        } catch (error) {
          lastError = error;
        }
      }

      throw new Error(\`Unable to load \${label}: \${String(lastError)}\`);
    }

    await importFirstAvailable(
      isViteDev
        ? [
            '/src/components/markdown/markdown.ts',
            '/components/markdown/markdown.js',
            '/dist/components/markdown/markdown.js',
          ]
        : [
            '/components/markdown/markdown.js',
            '/dist/components/markdown/markdown.js',
            '/src/components/markdown/markdown.ts',
          ],
      'tp-markdown',
    );

    await importFirstAvailable(
      isViteDev
        ? ['/src/tp-loader.ts', '/tp-loader.js', '/dist/tp-loader.js']
        : ['/tp-loader.js', '/dist/tp-loader.js', '/src/tp-loader.ts'],
      'tp-loader.js',
    );
  </script>
</body>
</html>
`,
  };
}
