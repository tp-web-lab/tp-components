import { toolLoadedScript } from "@tp/tp-utilities";
/**
 * @module components/playground/browser-test-document
 * @summary Browser test document builder for playground projects.
 */

import type { ImportMap } from "../../utilities/importmap/importmap-types.js";
import type { TpExecutionDocument } from "./playground.js";

import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	createJavaScriptModuleBlobUrls,
	createStaticBlobUrls,
	createTypescriptModuleBlobUrls,
	findProjectFile,
	resolveEntryFile,
} from "./playground-build-utils.js";
import type { TpProject } from "./project.js";
import { createTestReporter, testResultsHead } from "./test-results.js";

/** Options for building a browser test document. */
export interface BuildBrowserTestDocumentOptions {
	kind?: "javascript" | "typescript";
	defaultTest?: string;
	importmap?: ImportMap;
}

function stripScripts(html: string): string {
	return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

/** Builds the browser-based test execution document. */
export async function buildBrowserTestDocument(
	project: TpProject,
	options: BuildBrowserTestDocumentOptions = {},
): Promise<TpExecutionDocument> {
	const allowedTestExtensions =
		options.kind === "typescript"
			? [
					".test.ts",
					".tests.ts",
					".spec.ts",
					".test.tsx",
					".tests.tsx",
					".spec.tsx",
					".test.js",
					".tests.js",
					".spec.js",
				]
			: [".test.js", ".tests.js", ".spec.js"];

	const explicitTestPath = project.test;

	const testFile =
		typeof explicitTestPath === "string" && explicitTestPath !== ""
			? findProjectFile(project, explicitTestPath)
			: resolveEntryFile(project, {
					entry: options.defaultTest,
					priorityPaths:
						options.kind === "typescript"
							? ["/main.test.ts", "/main.test.tsx", "/main.test.js"]
							: ["/main.test.js"],
					extensions: allowedTestExtensions,
					fallbackToFirstFile: false,
					ignoreProjectEntry: true,
				});

	if (testFile === undefined) {
		throw new Error(
			typeof explicitTestPath === "string" && explicitTestPath !== ""
				? `Test file not found: ${explicitTestPath}.`
				: "No test file found.",
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
export const assert = api.assert;
export const before = api.before;
export const after = api.after;
export const beforeEach = api.beforeEach;
export const afterEach = api.afterEach;
`;

	const tpTestUrl = URL.createObjectURL(
		new Blob([tpTestModule], { type: "text/javascript" }),
	);

	const importmap = {
		imports: {
			...(options.importmap?.imports ?? {}),
			"@tp/test": tpTestUrl,
		},
	};

	const staticBlobUrls = createStaticBlobUrls(project.files);
	const moduleBlobUrls =
		options.kind === "typescript"
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

	const htmlFile = findProjectFile(project, "/index.html");
	const body = htmlFile ? stripScripts(htmlFile.content) : "";

	const html = `
<!doctype html>
<html>
<head>${testResultsHead()}</head>
<body>
  ${body}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}
  <script type="importmap">${JSON.stringify(importmap).replaceAll("<", "\\u003c")}</script>
  <script type="module">
    const reporter = (${createTestReporter.toString()})(document.body, 'Mocha / Chai');
    const output = document.createElement('pre');
    reporter.attachLog(output);
    function display(value) {
      if (typeof value === 'string') return value;
      if (value instanceof Error) {
        const title = String(value);
        return value.stack?.includes(title) ? value.stack : title + (value.stack ? '\\n' + value.stack : '');
      }
      try { return JSON.stringify(value) ?? String(value); } catch { return String(value); }
    }
    for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
      const original = console[level].bind(console);
      console[level] = (...values) => {
        output.append(document.createTextNode(values.map(display).join(' ') + '\\n'));
        original(...values);
      };
    }
    async function loadScript(src) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Unable to load test library: ' + src));
        document.head.append(script);
      });
    }
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/mocha@10/mocha.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chai@4/chai.js');
      const { mocha, chai } = window;
      ${toolLoadedScript("mocha", "Mocha", "mocha.version")}
      ${toolLoadedScript("chai", "Chai", "chai.version")}
      mocha.setup('bdd');
      window.__tp_test__ = {
        describe: window.describe, it: window.it, expect: chai.expect, assert: chai.assert,
        before: window.before, after: window.after, beforeEach: window.beforeEach, afterEach: window.afterEach
      };
      function TpReporter(runner) {
        const add = (test, status, details = '') => reporter.add({
          suite: test.parent?.fullTitle() || 'Tests', name: test.title, status, details
        });
        runner.on('pass', test => { add(test, 'passed'); console.info('✓ ' + test.fullTitle()); });
        runner.on('pending', test => { add(test, 'skipped'); console.info('Skipped: ' + test.fullTitle()); });
        runner.on('fail', (test, error) => {
          const comparison = error.showDiff ? '\\nExpected: ' + display(error.expected) + '\\nActual: ' + display(error.actual) : '';
          add(test, 'failed', display(error) + comparison);
          console.error('✗ ' + test.fullTitle(), error);
        });
        runner.once('end', () => reporter.finish());
      }
      mocha.reporter(TpReporter);
      await import(${JSON.stringify(testUrl)});
      mocha.run();
    } catch (error) {
      reporter.error(error);
      console.error(error);
    }
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
