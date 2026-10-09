/**
 * @module components/python-playground/python-execution-document
 * @summary Python execution document builder.
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

/** Options for building a Python execution document. */
export interface BuildPythonExecutionDocumentOptions {
  entry?: string;
  libs?: string[];
  scope?: string;
}

/** Builds the Python execution document. */
export async function buildPythonExecutionDocument(
  project: TpProject,
  options: BuildPythonExecutionDocumentOptions = {},
): Promise<TpExecutionDocument> {
  const entryFile = resolveEntryFile(project, {
    entry: options.entry,
    priorityPaths: ['/main.py'],
    extensions: ['.py'],
    fallbackToFirstFile: false,
  });

  if (entryFile === undefined) {
    throw new Error('No Python entry file found.');
  }

  const htmlFile = findProjectFile(project, '/index.html');
  const body = htmlFile?.content ?? '';

  const filesJson = JSON.stringify(
    Object.fromEntries(project.files.map((file) => [file.path, file.content])),
  );

  const entryPathJson = JSON.stringify(entryFile.path);
  const libsJson = JSON.stringify(options.libs ?? []);
  const scopeJson = JSON.stringify(options.scope ?? 'default');

  const setupPython = `
import sys

if "tp_execution_namespaces" not in globals():
    tp_execution_namespaces = {}

if "/project" not in sys.path:
    sys.path.insert(0, "/project")

if "" not in sys.path:
    sys.path.insert(0, "")

import types

class TpPreviewJsModule(types.ModuleType):
    def __getattr__(self, name):
        return getattr(tp_window, name)

sys.modules["js"] = TpPreviewJsModule("js")

# Matplotlib's browser backend keeps JavaScript references to the document in
# which it was imported. The Pyodide runtime is shared between preview iframes,
# so reload Matplotlib modules to bind a repeated run to the current iframe.
for module_name in tuple(sys.modules):
    if module_name == "matplotlib" or module_name.startswith("matplotlib."):
        sys.modules.pop(module_name, None)

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

  const runPython = `
from pathlib import Path

entry = Path(tp_entry_path)
namespace = tp_execution_namespaces.setdefault(
    tp_execution_scope,
    {"__name__": "__main__", "__builtins__": __builtins__},
)
namespace["__file__"] = str(entry)
exec(compile(entry.read_text(), str(entry), "exec"), namespace, namespace)
`;

  const setupMatplotlib = `
from io import StringIO
import matplotlib

matplotlib.use("svg", force=True)
import matplotlib.pyplot as plt

def tp_show_matplotlib(*args, **kwargs):
    container = tp_window.document.createElement("div")
    container.setAttribute("data-tp-python-plots", "")
    tp_window.document.body.appendChild(container)

    for figure_number in plt.get_fignums():
        figure = plt.figure(figure_number)
        buffer = StringIO()
        figure.savefig(buffer, format="svg")
        plot = tp_window.document.createElement("div")
        plot.setAttribute("data-tp-python-plot", "")
        plot.innerHTML = buffer.getvalue()
        container.append(plot)

    plt.close("all")

plt.show = tp_show_matplotlib
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

      await window.tpRunWithPyodide(async () => {
        const libs = ${libsJson};

        if (libs.length > 0) {
          await window.tpLoadPyodidePackages(pyodide, libs);
        }

        pyodide.setStdout({ batched: (text) => console.log(text) });
        pyodide.setStderr({ batched: (text) => console.error(text) });
        resetProjectDirectory(pyodide);
        pyodide.FS.chdir('/project');

        const files = ${filesJson};
        const entryPath = ${entryPathJson}.replace(/^\\//, '');

        try {
          writeProjectFiles(pyodide, files);

          pyodide.globals.set('tp_entry_path', entryPath);
          pyodide.globals.set('tp_execution_scope', ${scopeJson});
          pyodide.globals.set('tp_project_paths', Object.keys(files));
          pyodide.globals.set('tp_window', window);

          pyodide.runPython(${JSON.stringify(setupPython)});

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
            pyodide.runPython(${JSON.stringify(setupMatplotlib)});
          }

          await pyodide.runPythonAsync(${JSON.stringify(runPython)});
        } catch (error) {
          console.error(error?.message ?? error);
        }
      });
    }

    void main();
  </script>
</body>
</html>
`,
  };
}
