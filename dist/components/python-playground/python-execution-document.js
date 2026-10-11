import { E as e, f as t, n, t as r } from "../../chunks/playground-build-utils.js";
import { createPyodideRuntimeScript as i } from "./python-runtime-script.js";
//#region src/components/python-playground/python-execution-document.ts
async function a(a, o = {}) {
	let s = e(a, {
		entry: o.entry,
		priorityPaths: ["/main.py"],
		extensions: [".py"],
		fallbackToFirstFile: !1
	});
	if (s === void 0) throw Error("No Python entry file found.");
	let c = t(a, "/index.html")?.content ?? "", l = JSON.stringify(Object.fromEntries(a.files.map((e) => [e.path, e.content]))), u = JSON.stringify(s.path), d = JSON.stringify(o.libs ?? []), f = JSON.stringify(o.scope ?? "default");
	return { html: `
<!doctype html>
<html>
<head></head>
<body>
  ${c}
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

      await window.tpRunWithPyodide(async () => {
        const libs = ${d};

        if (libs.length > 0) {
          await window.tpLoadPyodidePackages(pyodide, libs);
        }

        pyodide.setStdout({ batched: (text) => console.log(text) });
        pyodide.setStderr({ batched: (text) => console.error(text) });
        resetProjectDirectory(pyodide);
        pyodide.FS.chdir('/project');

        const files = ${l};
        const entryPath = ${u}.replace(/^\\//, '');

        try {
          writeProjectFiles(pyodide, files);

          pyodide.globals.set('tp_entry_path', entryPath);
          pyodide.globals.set('tp_execution_scope', ${f});
          pyodide.globals.set('tp_project_paths', Object.keys(files));
          pyodide.globals.set('tp_window', window);

          pyodide.runPython(${JSON.stringify("\nimport sys\n\nif \"tp_execution_namespaces\" not in globals():\n    tp_execution_namespaces = {}\n\nif \"/project\" not in sys.path:\n    sys.path.insert(0, \"/project\")\n\nif \"\" not in sys.path:\n    sys.path.insert(0, \"\")\n\nimport types\n\nclass TpPreviewJsModule(types.ModuleType):\n    def __getattr__(self, name):\n        return getattr(tp_window, name)\n\nsys.modules[\"js\"] = TpPreviewJsModule(\"js\")\n\n# Matplotlib's browser backend keeps JavaScript references to the document in\n# which it was imported. The Pyodide runtime is shared between preview iframes,\n# so reload Matplotlib modules to bind a repeated run to the current iframe.\nfor module_name in tuple(sys.modules):\n    if module_name == \"matplotlib\" or module_name.startswith(\"matplotlib.\"):\n        sys.modules.pop(module_name, None)\n\nproject_modules = []\n\nfor path in tp_project_paths:\n    if not path.endswith(\".py\"):\n        continue\n\n    module_name = path.removeprefix(\"/\").removesuffix(\".py\").replace(\"/\", \".\")\n\n    if module_name == \"__init__\":\n        continue\n\n    if module_name.endswith(\".__init__\"):\n        module_name = module_name.removesuffix(\".__init__\")\n\n    project_modules.append(module_name)\n\nfor module_name in project_modules:\n    sys.modules.pop(module_name, None)\n")});

          const source = files['/' + entryPath] ?? files[entryPath] ?? '';

          await pyodide.loadPackagesFromImports(source, {
            messageCallback: (message) => {
              if (!/already loaded from|No new packages to load/.test(message)) {
                console.log(message);
              }
            },
            errorCallback: (message) => console.error(message),
          });

          if (/(?:from|import)\\s+matplotlib(?:\\.|\\s|$)/m.test(source)) {
            pyodide.runPython(${JSON.stringify("\nfrom io import StringIO\nimport matplotlib\n\nmatplotlib.use(\"svg\", force=True)\nimport matplotlib.pyplot as plt\n\ndef tp_show_matplotlib(*args, **kwargs):\n    container = tp_window.document.createElement(\"div\")\n    container.setAttribute(\"data-tp-python-plots\", \"\")\n    tp_window.document.body.appendChild(container)\n\n    for figure_number in plt.get_fignums():\n        figure = plt.figure(figure_number)\n        buffer = StringIO()\n        figure.savefig(buffer, format=\"svg\")\n        plot = tp_window.document.createElement(\"div\")\n        plot.setAttribute(\"data-tp-python-plot\", \"\")\n        plot.innerHTML = buffer.getvalue()\n        container.append(plot)\n\n    plt.close(\"all\")\n\nplt.show = tp_show_matplotlib\n")});
          }

          await pyodide.runPythonAsync(${JSON.stringify("\nfrom pathlib import Path\n\nentry = Path(tp_entry_path)\nnamespace = tp_execution_namespaces.setdefault(\n    tp_execution_scope,\n    {\"__name__\": \"__main__\", \"__builtins__\": __builtins__},\n)\nnamespace[\"__file__\"] = str(entry)\nexec(compile(entry.read_text(), str(entry), \"exec\"), namespace, namespace)\n")});
        } catch (error) {
          console.error(error?.message ?? error);
        }
      });
    }

    void main();
  <\/script>
</body>
</html>
` };
}
//#endregion
export { a as buildPythonExecutionDocument };

//# sourceMappingURL=python-execution-document.js.map