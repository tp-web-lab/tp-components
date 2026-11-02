import{t as e}from"../../chunks/tool-loading.js";import{E as t,f as n,n as r,t as i}from"../../chunks/playground-build-utils.js";import{createPyodideRuntimeScript as a}from"./python-runtime-script.js";function o(e){return e.replace(/<script\b[\s\S]*?<\/script>/gi,``)}async function s(s,c={}){let l=s.test,u=typeof l==`string`&&l!==``?n(s,l):t(s,{entry:c.defaultTest,priorityPaths:[`/main.test.py`,`/main.spec.py`],extensions:[`.test.py`,`.tests.py`,`.spec.py`],fallbackToFirstFile:!1,ignoreProjectEntry:!0});if(u===void 0)throw Error(typeof l==`string`&&l!==``?`Test file not found: ${l}.`:`No Python test file found.`);let d=n(s,`/index.html`),f=d?o(d.content):``,p=JSON.stringify(Object.fromEntries(s.files.map(e=>[e.path,e.content]))),m=JSON.stringify(u.path),h=JSON.stringify(c.libs??[]);return{html:`
<!doctype html>
<html>
<head></head>
<body>
  ${f}
  ${i()}
  ${r()}
  ${a()}

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

      const libs = ${h};

      if (libs.length > 0) {
        await window.tpLoadPyodidePackages(pyodide, libs);
      }

      pyodide.setStdout({ batched: (text) => console.log(text) });
      pyodide.setStderr({ batched: (text) => console.error(text) });
      resetProjectDirectory(pyodide);
      pyodide.FS.chdir('/project');

      const files = ${p};
      const testPath = ${m}.replace(/^\\//, '');

      try {
        writeProjectFiles(pyodide, files);

        pyodide.globals.set('tp_test_path', testPath);
        pyodide.globals.set('tp_project_paths', Object.keys(files));
        pyodide.globals.set('tp_window', window);

        pyodide.runPython(${JSON.stringify(`
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
`)});

        const source = files['/' + testPath] ?? files[testPath] ?? '';

        await pyodide.loadPackagesFromImports(source);
 for (const name of Object.keys(pyodide.loadedPackages ?? {})) {
 (${e.toString()})("python-" + name, name);
 }
        pyodide.globals.set('tp_console', console);

        await pyodide.runPythonAsync(${JSON.stringify(`
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
`)});
      } catch (error) {
        console.error(error?.message ?? error);
      }
    }

    void main();
  <\/script>
</body>
</html>
`}}export{s as buildPythonTestDocument};
//# sourceMappingURL=python-test-document.js.map