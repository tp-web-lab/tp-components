/**
 * @module components/playground/browser-test-document
 * @summary Browser test document builder for playground projects.
 */

import type { TpExecutionDocument } from './playground.js';
import type { TpProject } from './project.js';

import {
  createCommonRuntimeScript,
  createConsoleBridgeScript,
  createJavaScriptModuleBlobUrls,
  createStaticBlobUrls,
  createTypescriptModuleBlobUrls,
  findProjectFile,
  resolveEntryFile,
} from './playground-build-utils.js';
import type { ImportMap } from '../../utilities/importmap/importmap-types.js';

/** Options for building a browser test document. */
export interface BuildBrowserTestDocumentOptions {
  kind?: 'javascript' | 'typescript';
  defaultTest?: string;
  importmap?: ImportMap;
}

function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

/** Builds the browser-based test execution document. */
export async function buildBrowserTestDocument(
  project: TpProject,
  options: BuildBrowserTestDocumentOptions = {},
): Promise<TpExecutionDocument> {
  console.log('browser test project.test', project.test);
  const allowedTestExtensions =
    options.kind === 'typescript'
      ? ['.test.ts', '.tests.ts', '.spec.ts', '.test.tsx', '.tests.tsx', '.spec.tsx', '.test.js', '.tests.js', '.spec.js']
      : ['.test.js', '.tests.js', '.spec.js'];

  const explicitTestPath = project.test;

  const testFile =
    typeof explicitTestPath === 'string' && explicitTestPath !== ''
      ? findProjectFile(project, explicitTestPath)
      : resolveEntryFile(project, {
          entry: options.defaultTest,
          priorityPaths:
            options.kind === 'typescript'
              ? ['/main.test.ts', '/main.test.tsx', '/main.test.js']
              : ['/main.test.js'],
          extensions: allowedTestExtensions,
          fallbackToFirstFile: false,
          ignoreProjectEntry: true,
        });

  if (testFile === undefined) {
    throw new Error(
      typeof explicitTestPath === 'string' && explicitTestPath !== ''
        ? `Test file not found: ${explicitTestPath}.`
        : 'No test file found.',
    );
  }
  const tpTestModule = `
const api = window.__tp_test__;

if (!api) {
  throw new Error('Mocha/Chai test API is not initialized.');
}

export const describe = api.describe;
export const it = api.it;
export const expect = api.expect;
`;

  const tpTestUrl = URL.createObjectURL(
    new Blob([tpTestModule], { type: 'text/javascript' }),
  );

  const importmap = {
    imports: {
      ...(options.importmap?.imports ?? {}),
      '@tp/test': tpTestUrl,
    },
  };

  const staticBlobUrls = createStaticBlobUrls(project.files);
  const moduleBlobUrls =
    options.kind === 'typescript'
      ? await createTypescriptModuleBlobUrls(
          project.files,
          staticBlobUrls,
          importmap,
        )
      : await createJavaScriptModuleBlobUrls(
          project.files,
          staticBlobUrls,
          importmap,
        );
  const testUrl = moduleBlobUrls.get(testFile.path);

  if (testUrl === undefined) {
    throw new Error(`Test module not built: ${testFile.path}`);
  }

  const allBlobUrls = new Map<string, string>([
    ...staticBlobUrls.entries(),
    ...moduleBlobUrls.entries(),
  ]);

  const htmlFile = findProjectFile(project, '/index.html');
  const body = htmlFile ? stripScripts(htmlFile.content) : '';

  const html = `
<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mocha@10/mocha.css">
</head>
<body>
  ${body}
  <div id="mocha"></div>
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}

  <script src="https://cdn.jsdelivr.net/npm/mocha@10/mocha.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chai@4/chai.js"></script>

<script>
  mocha.setup('bdd');

  window.__tp_test__ = {
    describe: window.describe,
    it: window.it,
    expect: window.chai.expect
  };

  function TpConsoleReporter(runner) {
    let passCount = 0;
    let failCount = 0;
    const suiteTitles = [];

    runner.on('suite', (suite) => {
      if (suite.root) {
        return;
      }

      suiteTitles.push(suite.title);
      console.group(suite.title);
    });

    runner.on('suite end', (suite) => {
      if (suite.root) {
        return;
      }

      console.groupEnd();
    });

    runner.on('pass', (test) => {
      passCount += 1;
      console.info('%c✓ ' + test.title, 'color: green;');
    });

    runner.on('fail', (test, error) => {
      failCount += 1;
      console.error(
        '%c✗ ' + test.title,
        'color: red; font-weight: bold;',
        error,
      );
    });

    runner.once('end', () => {
      const suiteLabel =
        suiteTitles.length === 1 ? suiteTitles[0] : 'All tests';

      if (failCount === 0) {
        console.log(\`\${suiteLabel}: Tests passed: \${passCount}\`);
      } else {
        console.warn(
          \`\${suiteLabel}: Tests finished: \${passCount} passed, \${failCount} failed\`,
        );
      }
    });
  }

  mocha.reporter(TpConsoleReporter);
</script>
  <script type="importmap">
${JSON.stringify(importmap, null, 2)}
  </script>

  <script type="module">
    import ${JSON.stringify(testUrl)};
    mocha.run();
  </script>
</body>
</html>
`;

  return {
    html,
    cleanup: () => {
      URL.revokeObjectURL(tpTestUrl);
      for (const url of allBlobUrls.values()) {
        URL.revokeObjectURL(url);
      }
    },
  };
}