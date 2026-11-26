import { reportToolLoaded } from "@tp/tp-utilities";
/**
 * @module components/python-playground/python-test-document
 * @summary Python test document builder.
 */

import type { TpExecutionDocument } from "../playground/playground.js";
import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	findProjectFile,
	resolveEntryFile,
} from "../playground/playground-build-utils.js";
import type { TpProject } from "../playground/project.js";
import {
	createTestReporter,
	testResultsHead,
} from "../playground/test-results.js";
import { createPyodideRuntimeScript } from "./python-runtime-script.js";

/** Options for building a Python test document. */
export interface BuildPythonTestDocumentOptions {
	defaultTest?: string;
	libs?: string[];
}

/** Removes script tags from an HTML fragment. */
function stripScripts(html: string): string {
	return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

/** Builds the Python test execution document. */
export async function buildPythonTestDocument(
	project: TpProject,
	options: BuildPythonTestDocumentOptions = {},
): Promise<TpExecutionDocument> {
	const explicitTestPath = project.test;

	const testFile =
		typeof explicitTestPath === "string" && explicitTestPath !== ""
			? findProjectFile(project, explicitTestPath)
			: resolveEntryFile(project, {
					entry: options.defaultTest,
					priorityPaths: ["/main.test.py", "/main.spec.py"],
					extensions: [".test.py", ".tests.py", ".spec.py"],
					fallbackToFirstFile: false,
					ignoreProjectEntry: true,
				});

	if (testFile === undefined) {
		throw new Error(
			typeof explicitTestPath === "string" && explicitTestPath !== ""
				? `Test file not found: ${explicitTestPath}.`
				: "No Python test file found.",
		);
	}

	const htmlFile = findProjectFile(project, "/index.html");
	const body = htmlFile ? stripScripts(htmlFile.content) : "";

	const json = (value: unknown) =>
		JSON.stringify(value).replaceAll("<", "\\u003c");
	const filesJson = json(
		Object.fromEntries(project.files.map((file) => [file.path, file.content])),
	);

	const testPathJson = json(testFile.path);
	const libsJson = json(options.libs ?? []);

	const setupPython = `
import sys

if "/project" not in sys.path:
    sys.path.insert(0, "/project")

if "" not in sys.path:
    sys.path.insert(0, "")

import types

class TpPreviewJsModule(types.ModuleType):
    def __getattr__(self, name):
        return getattr(tp_window, name)

sys.modules["js"] = TpPreviewJsModule("js")

project_modules = []

for path in tp_project_paths:
    if not path.endswith(".py"):
        continue

    module_name = path.removeprefix("/").removesuffix(".py").replace("/", ".")

    if module_name == "__init__":
        continue

    if module_name.endswith(".__init__"):
        module_name = module_name.removesuffix(".__init__")

    project_modules.append(module_name)

for module_name in project_modules:
    sys.modules.pop(module_name, None)
`;

	const runPythonTests = `
from pathlib import Path
import importlib.util
import unittest
import traceback

test_path = Path(tp_test_path)
spec = importlib.util.spec_from_file_location("tp_test_module", test_path)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load test module: {test_path}")
module = importlib.util.module_from_spec(spec)
sys.modules["tp_test_module"] = module
spec.loader.exec_module(module)
suite = unittest.defaultTestLoader.loadTestsFromModule(module)

class TpTestResult(unittest.TestResult):
    def __init__(self):
        super().__init__()
        self.subtest_parents = set()

    def report(self, test, status, details="", name=None):
        tp_report_result(test.__class__.__qualname__,
                         name or getattr(test, "_testMethodName", str(test)), status, details)

    def error_text(self, err):
        return "".join(traceback.format_exception(*err))

    def addSuccess(self, test):
        super().addSuccess(test)
        if test.id() not in self.subtest_parents:
            self.report(test, "passed")

    def addFailure(self, test, err):
        super().addFailure(test, err)
        self.report(test, "failed", self.error_text(err))

    def addError(self, test, err):
        super().addError(test, err)
        self.report(test, "failed", self.error_text(err))

    def addSkip(self, test, reason):
        super().addSkip(test, reason)
        parent = getattr(test, "test_case", None)
        if parent is not None:
            self.subtest_parents.add(parent.id())
        self.report(parent or test, "skipped", str(reason), str(test) if parent else None)

    def addExpectedFailure(self, test, err):
        super().addExpectedFailure(test, err)
        self.report(test, "expected-failure", self.error_text(err))

    def addUnexpectedSuccess(self, test):
        super().addUnexpectedSuccess(test)
        self.report(test, "failed", "Unexpected success: this test is marked expectedFailure.")

    def addSubTest(self, test, subtest, err):
        super().addSubTest(test, subtest, err)
        self.subtest_parents.add(test.id())
        self.report(test, "passed" if err is None else "failed",
                    "" if err is None else self.error_text(err), str(subtest))

result = TpTestResult()
result.startTestRun()
try:
    suite.run(result)
finally:
    result.stopTestRun()
`;

	return {
		html: `
<!doctype html>
<html>
<head>${testResultsHead()}</head>
<body>
  ${body}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}
  ${createPyodideRuntimeScript()}

  <script>
    const reporter = (${createTestReporter.toString()})(document.body, 'unittest');
    const output = document.createElement('pre');
    reporter.attachLog(output);
    function writeOutput(text, level) {
      output.append(document.createTextNode(text + '\\n'));
      console[level](text);
    }
    function removeProjectPath(pyodide, path) {
      const stat = pyodide.FS.stat(path);

      if (pyodide.FS.isDir(stat.mode)) {
        for (const item of pyodide.FS.readdir(path)) {
          if (item === '.' || item === '..') {
            continue;
          }

          removeProjectPath(pyodide, path + '/' + item);
        }

        if (path !== '/project') {
          pyodide.FS.rmdir(path);
        }

        return;
      }

      pyodide.FS.unlink(path);
    }

    function resetProjectDirectory(pyodide) {
      try {
        pyodide.FS.mkdir('/project');
      } catch {
        // already exists
      }

      for (const item of pyodide.FS.readdir('/project')) {
        if (item === '.' || item === '..') {
          continue;
        }

        removeProjectPath(pyodide, '/project/' + item);
      }
    }

    function ensureDirectory(pyodide, path) {
      const parts = path.split('/').filter(Boolean);
      let current = '';

      for (const part of parts) {
        current += current === '' ? part : '/' + part;

        try {
          pyodide.FS.mkdir(current);
        } catch {
          // already exists
        }
      }
    }

    function writeProjectFiles(pyodide, files) {
      for (const [path, content] of Object.entries(files)) {
        if (!path.endsWith('.py')) {
          continue;
        }

        const normalized = path.startsWith('/') ? path.slice(1) : path;
        const directory = normalized.includes('/')
          ? normalized.slice(0, normalized.lastIndexOf('/'))
          : '';

        if (directory !== '') {
          ensureDirectory(pyodide, directory);
        }

        pyodide.FS.writeFile(normalized, content);
      }
    }

    async function main() {
      const pyodide = await window.tpLoadPyodide();

      const libs = ${libsJson};

      if (libs.length > 0) {
        await window.tpLoadPyodidePackages(pyodide, libs);
      }

      pyodide.setStdout({ batched: (text) => writeOutput(text, "log") });
      pyodide.setStderr({ batched: (text) => writeOutput(text, "error") });
      resetProjectDirectory(pyodide);
      pyodide.FS.chdir('/project');

      const files = ${filesJson};
      const testPath = ${testPathJson}.replace(/^\\//, '');

      try {
        writeProjectFiles(pyodide, files);

        pyodide.globals.set('tp_test_path', testPath);
        pyodide.globals.set('tp_project_paths', Object.keys(files));
        pyodide.globals.set('tp_window', window);

        pyodide.runPython(${json(setupPython)});

        const source = files['/' + testPath] ?? files[testPath] ?? '';

        await pyodide.loadPackagesFromImports(source);
 for (const name of Object.keys(pyodide.loadedPackages ?? {})) {
 (${reportToolLoaded.toString()})("python-" + name, name);
 }
        pyodide.globals.set('tp_report_result', (suite, name, status, details) => {
          reporter.add({suite: String(suite), name: String(name), status: String(status), details: String(details)});
          const fullDetails = String(details ?? '');
          const reason = fullDetails.split(/\\r?\\n/).map(line => line.trim()).filter(Boolean).at(-1) ?? '';
          const label = (status === 'passed' ? '✓ ' : status === 'failed' ? '✗ ' : '– ') + suite + '.' + name + ' [' + status + ']';
          const concise = (label + (reason ? ' — ' + reason : '')).replace(/\\s+/g, ' ');
          output.append(document.createTextNode(label + (fullDetails ? '\\n' + fullDetails : '') + '\\n'));
          console[status === 'failed' ? 'error' : 'info'](concise);
        });

        await pyodide.runPythonAsync(${json(runPythonTests)});
        reporter.finish();
      } finally {
        pyodide.globals.delete('tp_report_result');
      }
    }

    void window.tpRunWithPyodide(main).catch(error => {
      reporter.error(error);
      writeOutput(error?.message ?? String(error), 'error');
    });
  </script>
</body>
</html>
`,
	};
}
