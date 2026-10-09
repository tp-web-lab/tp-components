/**
 * @module components/python-playground/python-test-document
 * @summary Python test document builder.
 */

import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpProject } from '../playground/project.js';

import {
  createCommonRuntimeScript,
  createConsoleBridgeScript,
  findProjectFile,
  resolveEntryFile,
} from '../playground/playground-build-utils.js';
import { createPyodideRuntimeScript } from './python-runtime-script.js';

/** Options for building a Python test document. */
export interface BuildPythonTestDocumentOptions {
  defaultTest?: string;
  libs?: string[];
}

/** Removes script tags from an HTML fragment. */
function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

/** Builds the Python test execution document. */
export async function buildPythonTestDocument(
  project: TpProject,
  options: BuildPythonTestDocumentOptions = {},
): Promise<TpExecutionDocument> {
  const explicitTestPath = project.test;

  const testFile =
    typeof explicitTestPath === 'string' && explicitTestPath !== ''
      ? findProjectFile(project, explicitTestPath)
      : resolveEntryFile(project, {
          entry: options.defaultTest,
          priorityPaths: ['/main.test.py', '/main.spec.py'],
          extensions: ['.test.py', '.tests.py', '.spec.py'],
          fallbackToFirstFile: false,
          ignoreProjectEntry: true,
        });

  if (testFile === undefined) {
    throw new Error(
      typeof explicitTestPath === 'string' && explicitTestPath !== ''
        ? `Test file not found: ${explicitTestPath}.`
        : 'No Python test file found.',
    );
  }

  const htmlFile = findProjectFile(project, '/index.html');
  const body = htmlFile ? stripScripts(htmlFile.content) : '';

  const filesJson = JSON.stringify(
    Object.fromEntries(project.files.map((file) => [file.path, file.content])),
  );

  const testPathJson = JSON.stringify(testFile.path);
  const libsJson = JSON.stringify(options.libs ?? []);

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

test_path = Path(tp_test_path)

spec = importlib.util.spec_from_file_location("tp_test_module", test_path)

if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load test module: {test_path}")

module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

suite = unittest.defaultTestLoader.loadTestsFromModule(module)

class TpTestResult(unittest.TestResult):
    def __init__(self):
        super().__init__()
        self.current_class = None
        self.pass_count = 0

    def _class_name(self, test):
        return test.__class__.__name__

    def _method_name(self, test):
        return getattr(test, "_testMethodName", str(test))

    def startTest(self, test):
        class_name = self._class_name(test)

        if self.current_class != class_name:
            if self.current_class is not None:
                tp_console.groupEnd()

            self.current_class = class_name
            tp_console.group(class_name)

        super().startTest(test)

    def addSuccess(self, test):
        super().addSuccess(test)
        self.pass_count += 1
        tp_console.info("%c✓ " + self._method_name(test), "color: green")

    def addFailure(self, test, err):
        super().addFailure(test, err)
        error_type, error_value, _ = err
        tp_console.error(
            "%c✗ " + self._method_name(test),
            "color: red; font-weight: bold;",
            f"{error_type.__name__}: {error_value}",
        )

    def addError(self, test, err):
        super().addError(test, err)
        error_type, error_value, _ = err
        tp_console.error(
            "%c⚠ " + self._method_name(test),
            "color: red; font-weight: bold;",
            f"{error_type.__name__}: {error_value}",
        )

    def stopTestRun(self):
        if self.current_class is not None:
            tp_console.groupEnd()

result = TpTestResult()
suite.run(result)
result.stopTestRun()

print("")

if result.wasSuccessful():
    print(f"Tests passed: {result.testsRun}")
else:
    passed = result.pass_count
    print(
        f"Tests finished: {passed} passed, "
        f"{len(result.failures)} failed, "
        f"{len(result.errors)} errors"
    )
`;

  return {
    html: `
<!doctype html>
<html>
<head></head>
<body>
  ${body}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}
  ${createPyodideRuntimeScript()}

  <script>
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

      pyodide.setStdout({ batched: (text) => console.log(text) });
      pyodide.setStderr({ batched: (text) => console.error(text) });
      resetProjectDirectory(pyodide);
      pyodide.FS.chdir('/project');

      const files = ${filesJson};
      const testPath = ${testPathJson}.replace(/^\\//, '');

      try {
        writeProjectFiles(pyodide, files);

        pyodide.globals.set('tp_test_path', testPath);
        pyodide.globals.set('tp_project_paths', Object.keys(files));
        pyodide.globals.set('tp_window', window);

        pyodide.runPython(${JSON.stringify(setupPython)});

        const source = files['/' + testPath] ?? files[testPath] ?? '';

        await pyodide.loadPackagesFromImports(source);
        pyodide.globals.set('tp_console', console);

        await pyodide.runPythonAsync(${JSON.stringify(runPythonTests)});
      } catch (error) {
        console.error(error?.message ?? error);
      }
    }

    void main();
  </script>
</body>
</html>
`,
  };
}
