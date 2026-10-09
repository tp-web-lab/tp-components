/**
 * @module components/restructuredtext-playground/restructuredtext-execution-document
 * @summary reStructuredText execution document builder.
 */

import type { TpExecutionDocument } from '../playground/playground.js';
import {
  createCommonRuntimeScript,
  createConsoleBridgeScript,
  findProjectFile,
  resolveEntryFile,
} from '../playground/playground-build-utils.js';
import type { TpRestructuredTextProject } from './restructuredtext-project.js';

/** Options for building a reStructuredText execution document. */
export interface BuildRestructuredTextExecutionDocumentOptions {
  entry?: string;
  libs?: string[];
}

/** Escapes closing script tags for safe inline serialization. */
function toSafeScriptJson(value: unknown): string {
  return JSON.stringify(value).replaceAll('</script', '<\\/script');
}

/** Removes inline scripts while preserving external resources from a custom HTML shell. */
function stripInlineScripts(html: string): string {
  return html.replace(/<script(?![^>]*\bsrc=)[\s\S]*?<\/script>/gi, '');
}

/** Builds the reStructuredText execution document. */
export async function buildRestructuredTextExecutionDocument(
  project: TpRestructuredTextProject,
  options: BuildRestructuredTextExecutionDocumentOptions = {},
): Promise<TpExecutionDocument> {
  const entryFile = resolveEntryFile(project, {
    entry: options.entry,
    priorityPaths: ['/index.rst', '/main.rst'],
    extensions: ['.rst', '.rest', '.txt'],
    fallbackToFirstFile: false,
  });

  if (entryFile === undefined) {
    throw new Error('No reStructuredText entry file found.');
  }

  const htmlFile = findProjectFile(project, '/index.html');
  const body = htmlFile === undefined
    ? '<main id="app"></main>'
    : stripInlineScripts(htmlFile.content);
  const filesJson = toSafeScriptJson(
    Object.fromEntries(project.files.map((file) => [file.path, file.content])),
  );
  const entryPathJson = toSafeScriptJson(entryFile.path);
  const extensionsJson = toSafeScriptJson(
    (project.extensions ?? []).filter((extension) => extension.enabled !== false),
  );

  return {
    html: `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: system-ui, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 1rem;
    }

    #app,
    tp-restructuredtext {
      display: block;
      max-inline-size: 72rem;
    }
  </style>
</head>
<body>
  ${body}
  <tp-restructuredtext
    id="tp-restructuredtext-playground-document"
    src=${entryPathJson}
  ></tp-restructuredtext>
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}

  <script type="module">
    const tpRestructuredTextPlaygroundFiles = ${filesJson};
    const tpRestructuredTextPlaygroundFetch = window.fetch.bind(window);

    window.fetch = (input, init) => {
      const requestUrl =
        input instanceof Request
          ? input.url
          : typeof input === 'string' || input instanceof URL
            ? String(input)
            : '';

      try {
        const url = new URL(requestUrl, window.location.href);
        const content = tpRestructuredTextPlaygroundFiles[url.pathname];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      } catch {
        const content = tpRestructuredTextPlaygroundFiles[requestUrl];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      }

      return tpRestructuredTextPlaygroundFetch(input, init);
    };

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

    async function loadRuntimeExtension(extension) {
      const response = await fetch(extension.url);

      if (!response.ok) {
        throw new Error('Unable to load extension: ' + extension.url);
      }

      const source = await response.text();
      if (source.trim().startsWith('<')) {
        throw new Error(
          'Extension URL returned HTML instead of JavaScript: ' + extension.url,
        );
      }

      const module = { exports: {} };
      const runner = new Function(
        'module',
        'exports',
        source + '\\nreturn module.exports;',
      );
      return runner(module, module.exports);
    }

    const documentElement = document.getElementById(
      'tp-restructuredtext-playground-document',
    );
    if (!(documentElement instanceof HTMLElement)) {
      throw new Error('Unable to initialize tp-restructuredtext.');
    }

    let app = document.getElementById('app');
    if (app === null) {
      app = document.createElement('main');
      app.id = 'app';
      document.body.append(app);
    }
    app.replaceChildren(documentElement);

    documentElement.addEventListener('tp-restructuredtext-rendered', async () => {
      const output = documentElement.querySelector('.tp-restructuredtext-output');
      if (output instanceof HTMLElement) {
        for (const extension of ${extensionsJson}) {
          const plugin = await loadRuntimeExtension(extension);
          if (typeof plugin === 'function') {
            await plugin(output, { extension, console });
          }
        }
      }

      if (typeof window.tpPlaygroundReportHeight === 'function') {
        window.tpPlaygroundReportHeight();
      }
    });

    await importFirstAvailable(
      isViteDev
        ? [
            '/src/components/restructuredtext/restructuredtext.ts',
            '/components/restructuredtext/restructuredtext.js',
            '/dist/components/restructuredtext/restructuredtext.js',
          ]
        : [
            '/components/restructuredtext/restructuredtext.js',
            '/dist/components/restructuredtext/restructuredtext.js',
            '/src/components/restructuredtext/restructuredtext.ts',
          ],
      'tp-restructuredtext',
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
