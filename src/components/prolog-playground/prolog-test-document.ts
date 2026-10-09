/**
 * @module components/prolog-playground/prolog-test-document
 * @summary Scryer Prolog test document builder.
 */

import type { TpExecutionDocument } from '../playground/playground.js';
import {
  createCommonRuntimeScript,
  createConsoleBridgeScript,
  findProjectFile,
  resolveEntryFile,
} from '../playground/playground-build-utils.js';
import type { TpPrologProject } from './prolog-project.js';
import {
  flattenLocalPrologModules,
  getLocalPrologModuleNames,
  PROLOG_DOM_MODULE_SOURCE,
  usesPrologDomModule,
} from './prolog-source.js';

const SCRYER_MODULE_URL = 'https://esm.sh/scryer';

/** Options for building a Prolog test document. */
export interface BuildPrologTestDocumentOptions {
  /** Default test file path. */
  defaultTest?: string;
}

function resolveTestFile(
  project: TpPrologProject,
  defaultTest?: string,
): { path: string; content: string } | undefined {
  if (typeof project.test === 'string' && project.test !== '') {
    return findProjectFile(project, project.test);
  }

  return resolveEntryFile(project, {
    entry: defaultTest,
    priorityPaths: ['/test.pl', '/program.test.pl'],
    extensions: ['.test.pl', '.tests.pl', '.spec.pl'],
    fallbackToFirstFile: false,
    ignoreProjectEntry: true,
  });
}

/** Builds the Scryer Prolog test execution document. */
export async function buildPrologTestDocument(
  project: TpPrologProject,
  options: BuildPrologTestDocumentOptions = {},
): Promise<TpExecutionDocument> {
  const testFile = resolveTestFile(project, options.defaultTest);

  if (testFile === undefined) {
    throw new Error('No Prolog test file found.');
  }

  const entryFile = resolveEntryFile(project, {
    entry: project.entry,
    priorityPaths: ['/program.pl', '/main.pl'],
    extensions: ['.pl'],
    fallbackToFirstFile: false,
  });

  if (entryFile === undefined) {
    throw new Error('No Prolog entry file found.');
  }

  const htmlFile = findProjectFile(project, '/index.html');
  const prologFiles = project.files.filter(
    (file) =>
      file.path.endsWith('.pl') &&
      file.path !== testFile.path &&
      file.path !== project.query,
  );
  const orderedSources = [
    ...prologFiles.filter((file) => file.path !== entryFile.path),
    entryFile,
  ];
  const localModules = getLocalPrologModuleNames(prologFiles);
  const usesDomModule = prologFiles.some((file) =>
    usesPrologDomModule(file.content),
  );
  const sourcesJson = JSON.stringify(
    [
      ...(usesDomModule
        ? [
            {
              path: '/library/dom.pl',
              content: PROLOG_DOM_MODULE_SOURCE,
            },
          ]
        : []),
      ...orderedSources.map((file) => ({
        path: file.path,
        content: flattenLocalPrologModules(file.content, localModules),
      })),
    ],
  );
  const testSourceJson = JSON.stringify(testFile.content);
  const body = htmlFile?.content ?? '<main id="prolog-test-output"></main>';

  return {
    html: `
<!doctype html>
<html>
<head>
  <style>
    body {
      box-sizing: border-box;
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 1rem;
    }

    pre[data-tp-prolog-test-output] {
      background: #111827;
      border-radius: 0.375rem;
      color: #f9fafb;
      margin-block: 0;
      overflow: auto;
      padding: 0.75rem;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  ${body}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}
  <script type="module">
    const sources = ${sourcesJson};
    const testSource = ${testSourceJson};
    const scryerModuleUrl = ${JSON.stringify(SCRYER_MODULE_URL)};
    const scryerInitWarning =
      'using deprecated parameters for the initialization function; pass a single object instead';

    async function loadScryer() {
      const originalWarn = console.warn;

      console.warn = (...args) => {
        if (args.some((arg) => String(arg).includes(scryerInitWarning))) {
          return;
        }

        originalWarn.apply(console, args);
      };

      try {
        const scryer = await import(scryerModuleUrl);
        await scryer.init();
        return scryer;
      } finally {
        console.warn = originalWarn;
      }
    }


    function ensureOutput() {
      let output = document.querySelector('[data-tp-prolog-test-output]');

      if (output instanceof HTMLElement) {
        return output;
      }

      const target =
        document.querySelector('#prolog-test-output') ?? document.body;
      output = document.createElement('pre');
      output.setAttribute('data-tp-prolog-test-output', '');
      target.append(output);
      return output;
    }

    function stringifyTerm(value) {
      if (value === null || value === undefined) {
        return String(value);
      }

      if (typeof value === 'string') {
        return value;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (typeof value.toString === 'function') {
        return value.toString();
      }

      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    function formatBindings(bindings) {
      if (bindings === null || bindings === undefined) {
        return 'true';
      }

      const entries =
        bindings instanceof Map
          ? Array.from(bindings.entries())
          : Object.entries(bindings);
      const visibleEntries = entries.filter(
        ([name]) => name !== 'TpPlaygroundResult',
      );

      if (visibleEntries.length === 0) {
        return 'true';
      }

      return visibleEntries
        .map(([name, value]) => name + ' = ' + stringifyTerm(value))
        .join(', ');
    }

    function formatPrologError(error) {
      if (error === null || error === undefined) {
        return 'Unknown Prolog error';
      }

      if (typeof error.toProlog === 'function') {
        return error.toProlog();
      }

      if (typeof error.toString === 'function') {
        return error.toString();
      }

      return String(error);
    }

    function stripComments(source) {
      return source
        .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '')
        .replace(/(^|\\n)\\s*%[^\\n]*/g, '$1');
    }

    function splitTopLevel(source) {
      const parts = [];
      let current = '';
      let quote = null;
      let escaped = false;
      let roundDepth = 0;
      let squareDepth = 0;

      for (const char of source) {
        if (escaped) {
          current += char;
          escaped = false;
          continue;
        }

        if (char === '\\\\') {
          current += char;
          escaped = true;
          continue;
        }

        if (quote !== null) {
          current += char;

          if (char === quote) {
            quote = null;
          }

          continue;
        }

        if (char === "'" || char === '"') {
          current += char;
          quote = char;
          continue;
        }

        if (char === '(') {
          roundDepth += 1;
        } else if (char === ')') {
          roundDepth -= 1;
        } else if (char === '[') {
          squareDepth += 1;
        } else if (char === ']') {
          squareDepth -= 1;
        }

        if (char === ',' && roundDepth === 0 && squareDepth === 0) {
          parts.push(current.trim());
          current = '';
          continue;
        }

        current += char;
      }

      const tail = current.trim();

      if (tail !== '') {
        parts.push(tail);
      }

      return parts;
    }

    function parseExpectedList(source) {
      const trimmed = source.trim();

      if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
        return [];
      }

      return splitTopLevel(trimmed.slice(1, -1)).map((item) =>
        item.trim().replace(/^["']|["']$/g, ''),
      );
    }

    function parseTestDirectives(source) {
      const tests = [];
      const cleanSource = stripComments(source);
      let index = 0;

      while (index < cleanSource.length) {
        const start = cleanSource.indexOf(':- test(', index);

        if (start < 0) {
          break;
        }

        let cursor = start + ':- test('.length;
        let quote = null;
        let escaped = false;
        let depth = 1;
        let body = '';

        while (cursor < cleanSource.length && depth > 0) {
          const char = cleanSource[cursor];

          if (escaped) {
            body += char;
            escaped = false;
            cursor += 1;
            continue;
          }

          if (char === '\\\\') {
            body += char;
            escaped = true;
            cursor += 1;
            continue;
          }

          if (quote !== null) {
            body += char;

            if (char === quote) {
              quote = null;
            }

            cursor += 1;
            continue;
          }

          if (char === "'" || char === '"') {
            body += char;
            quote = char;
            cursor += 1;
            continue;
          }

          if (char === '(') {
            depth += 1;
          } else if (char === ')') {
            depth -= 1;

            if (depth === 0) {
              cursor += 1;
              break;
            }
          }

          body += char;
          cursor += 1;
        }

        const args = splitTopLevel(body);

        if (args.length >= 2) {
          tests.push({
            name: args[0].trim(),
            goal: args[1].trim(),
            expected: args.length >= 3 ? parseExpectedList(args[2]) : [],
          });
        }

        index = cursor;
      }

      return tests;
    }

    function normalizeGoal(goal) {
      const normalized = goal.trim().replace(/\\.\\s*$/, '');
      return '(' + normalized + '), TpPlaygroundResult = true.';
    }

    async function main() {
      const output = ensureOutput();
      output.textContent = 'Loading Scryer Prolog...';

      const { Prolog } = await loadScryer();
      const prolog = new Prolog();

      for (const source of sources) {
        prolog.consultText(source.content);
      }

      const tests = parseTestDirectives(testSource);

      if (tests.length === 0) {
        output.textContent = 'No Prolog test directive found.';
        return;
      }

      const lines = [];
      let passed = 0;

      console.group('Prolog tests');

      for (const test of tests) {
        let answers = [];
        let actual = [];
        let errorMessage = '';

        try {
          answers = Array.from(prolog.query(normalizeGoal(test.goal)));
          actual = answers.map((answer) => formatBindings(answer.bindings));
        } catch (error) {
          errorMessage = formatPrologError(error);
        }

        const ok =
          errorMessage === '' &&
          (test.expected.length === 0
            ? answers.length > 0
            : test.expected.every((expected) => actual.includes(expected)));

        if (ok) {
          passed += 1;
          lines.push('✓ ' + test.name);
          console.info('✓ ' + test.name);
        } else {
          lines.push('✗ ' + test.name);
          lines.push('  goal: ' + test.goal);
          lines.push('  expected: ' + (test.expected.join('; ') || 'success'));
          lines.push(
            '  actual: ' + (errorMessage || actual.join('; ') || 'false'),
          );
          console.error('✗ ' + test.name, {
            goal: test.goal,
            expected: test.expected.length === 0 ? ['success'] : test.expected,
            actual: errorMessage || actual,
          });
        }
      }

      console.groupEnd();

      lines.push('');
      lines.push('Tests: ' + passed + '/' + tests.length + ' passed');
      output.textContent = lines.join('\\n');
      window.tpPlaygroundReportHeight?.();
    }

    main().catch((error) => {
      const output = ensureOutput();
      output.textContent = error?.message ?? String(error);
      console.error(error);
      window.tpPlaygroundReportHeight?.();
    });
  </script>
</body>
</html>
`,
  };
}
