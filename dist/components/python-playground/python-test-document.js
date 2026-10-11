import { E as e, f as t, n, t as r } from "../../chunks/playground-build-utils.js";
import { createPyodideRuntimeScript as i } from "./python-runtime-script.js";
//#region src/components/python-playground/python-test-document.ts
function a(e) {
	return e.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}
async function o(o, s = {}) {
	let c = o.test, l = typeof c == "string" && c !== "" ? t(o, c) : e(o, {
		entry: s.defaultTest,
		priorityPaths: ["/main.test.py", "/main.spec.py"],
		extensions: [
			".test.py",
			".tests.py",
			".spec.py"
		],
		fallbackToFirstFile: !1,
		ignoreProjectEntry: !0
	});
	if (l === void 0) throw Error(typeof c == "string" && c !== "" ? `Test file not found: ${c}.` : "No Python test file found.");
	let u = t(o, "/index.html"), d = u ? a(u.content) : "", f = JSON.stringify(Object.fromEntries(o.files.map((e) => [e.path, e.content]))), p = JSON.stringify(l.path), m = JSON.stringify(s.libs ?? []);
	return { html: `
<!doctype html>
<html>
<head></head>
<body>
  ${d}
  ${r()}
  ${n()}
  ${i()}

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

      const libs = ${m};

      if (libs.length > 0) {
        await window.tpLoadPyodidePackages(pyodide, libs);
      }

      pyodide.setStdout({ batched: (text) => console.log(text) });
      pyodide.setStderr({ batched: (text) => console.error(text) });
      resetProjectDirectory(pyodide);
      pyodide.FS.chdir('/project');

      const files = ${f};
      const testPath = ${p}.replace(/^\\//, '');

      try {
        writeProjectFiles(pyodide, files);

        pyodide.globals.set('tp_test_path', testPath);
        pyodide.globals.set('tp_project_paths', Object.keys(files));
        pyodide.globals.set('tp_window', window);

        pyodide.runPython(${JSON.stringify("\nimport sys\n\nif \"/project\" not in sys.path:\n    sys.path.insert(0, \"/project\")\n\nif \"\" not in sys.path:\n    sys.path.insert(0, \"\")\n\nimport types\n\nclass TpPreviewJsModule(types.ModuleType):\n    def __getattr__(self, name):\n        return getattr(tp_window, name)\n\nsys.modules[\"js\"] = TpPreviewJsModule(\"js\")\n\nproject_modules = []\n\nfor path in tp_project_paths:\n    if not path.endswith(\".py\"):\n        continue\n\n    module_name = path.removeprefix(\"/\").removesuffix(\".py\").replace(\"/\", \".\")\n\n    if module_name == \"__init__\":\n        continue\n\n    if module_name.endswith(\".__init__\"):\n        module_name = module_name.removesuffix(\".__init__\")\n\n    project_modules.append(module_name)\n\nfor module_name in project_modules:\n    sys.modules.pop(module_name, None)\n")});

        const source = files['/' + testPath] ?? files[testPath] ?? '';

        await pyodide.loadPackagesFromImports(source);
        pyodide.globals.set('tp_console', console);

        await pyodide.runPythonAsync(${JSON.stringify("\nfrom pathlib import Path\nimport importlib.util\nimport unittest\n\ntest_path = Path(tp_test_path)\n\nspec = importlib.util.spec_from_file_location(\"tp_test_module\", test_path)\n\nif spec is None or spec.loader is None:\n    raise RuntimeError(f\"Unable to load test module: {test_path}\")\n\nmodule = importlib.util.module_from_spec(spec)\nspec.loader.exec_module(module)\n\nsuite = unittest.defaultTestLoader.loadTestsFromModule(module)\n\nclass TpTestResult(unittest.TestResult):\n    def __init__(self):\n        super().__init__()\n        self.current_class = None\n        self.pass_count = 0\n\n    def _class_name(self, test):\n        return test.__class__.__name__\n\n    def _method_name(self, test):\n        return getattr(test, \"_testMethodName\", str(test))\n\n    def startTest(self, test):\n        class_name = self._class_name(test)\n\n        if self.current_class != class_name:\n            if self.current_class is not None:\n                tp_console.groupEnd()\n\n            self.current_class = class_name\n            tp_console.group(class_name)\n\n        super().startTest(test)\n\n    def addSuccess(self, test):\n        super().addSuccess(test)\n        self.pass_count += 1\n        tp_console.info(\"%c✓ \" + self._method_name(test), \"color: green\")\n\n    def addFailure(self, test, err):\n        super().addFailure(test, err)\n        error_type, error_value, _ = err\n        tp_console.error(\n            \"%c✗ \" + self._method_name(test),\n            \"color: red; font-weight: bold;\",\n            f\"{error_type.__name__}: {error_value}\",\n        )\n\n    def addError(self, test, err):\n        super().addError(test, err)\n        error_type, error_value, _ = err\n        tp_console.error(\n            \"%c⚠ \" + self._method_name(test),\n            \"color: red; font-weight: bold;\",\n            f\"{error_type.__name__}: {error_value}\",\n        )\n\n    def stopTestRun(self):\n        if self.current_class is not None:\n            tp_console.groupEnd()\n\nresult = TpTestResult()\nsuite.run(result)\nresult.stopTestRun()\n\nprint(\"\")\n\nif result.wasSuccessful():\n    print(f\"Tests passed: {result.testsRun}\")\nelse:\n    passed = result.pass_count\n    print(\n        f\"Tests finished: {passed} passed, \"\n        f\"{len(result.failures)} failed, \"\n        f\"{len(result.errors)} errors\"\n    )\n")});
      } catch (error) {
        console.error(error?.message ?? error);
      }
    }

    void main();
  <\/script>
</body>
</html>
` };
}
//#endregion
export { o as buildPythonTestDocument };

//# sourceMappingURL=python-test-document.js.map