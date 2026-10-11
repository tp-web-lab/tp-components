//#region src/components/python-playground/python-runtime-script.ts
var e = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/", t = `${e}pyodide.js`, n = 3;
function r() {
	let r = `
(() => {
  const runtimeOwner = window;
  const runtimeKey = '__tpPythonPlaygroundPyodideRuntime';

  const runtime = {
    version: ${n},
    executionQueue: Promise.resolve(),
    executionWindow: null,
    executionDocument: null,
    loadPromise: null,
    pyodidePromise: null,
    loadedPackages: new Set(),
  };
  runtimeOwner[runtimeKey] = runtime;

  function ensureRuntime() {
    return runtime;
  }

  function loadPyodideScript() {
    const runtime = ensureRuntime();

    if (typeof runtimeOwner.loadPyodide === 'function') {
      return Promise.resolve();
    }

    if (runtime.loadPromise !== null) {
      return runtime.loadPromise;
    }

    runtime.loadPromise = new Promise((resolve, reject) => {
      const script = runtimeOwner.document.createElement('script');

      script.src = ${JSON.stringify(t)};
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        runtime.loadPromise = null;
        reject(new Error('Unable to load Pyodide script.'));
      };

      runtimeOwner.document.head.append(script);
    });

    return runtime.loadPromise;
  }

  runtime.load = function load() {
    const runtime = ensureRuntime();

    if (runtime.pyodidePromise !== null) {
      return runtime.pyodidePromise;
    }

    runtime.pyodidePromise = (async () => {
      await loadPyodideScript();
      return runtimeOwner.loadPyodide({
        indexURL: ${JSON.stringify(e)},
      });
    })().catch((error) => {
      runtime.pyodidePromise = null;
      throw error;
    });

    return runtime.pyodidePromise;
  };

  runtime.loadPackages = async function loadPackages(
    pyodide,
    packages,
    messageCallback,
    errorCallback,
  ) {
    const runtime = ensureRuntime();
    const missingPackages = packages.filter(
      (name) => !runtime.loadedPackages.has(name),
    );

    if (missingPackages.length === 0) {
      return;
    }

    await pyodide.loadPackage(missingPackages, {
      messageCallback,
      errorCallback,
    });

    for (const name of missingPackages) {
      runtime.loadedPackages.add(name);
    }

  };

  runtime.run = function run(callback, sourceWindow, sourceDocument) {
    const runtime = ensureRuntime();
    const execute = async () => {
      // A queued preview may have been replaced before its turn arrived.
      if (sourceWindow.document !== sourceDocument) return;
      runtime.executionWindow = sourceWindow;
      runtime.executionDocument = sourceDocument;
      try {
        return await callback();
      } finally {
        runtime.executionWindow = null;
        runtime.executionDocument = null;
      }
    };
    const execution = runtime.executionQueue.then(execute, execute);

    runtime.executionQueue = execution.catch(() => undefined);
    return execution;
  };
})();
`;
	return `
<script>
(() => {
  const runtimeOwner = window.parent !== window ? window.parent : window;
  const runtimeKey = '__tpPythonPlaygroundPyodideRuntime';
  const previous = runtimeOwner[runtimeKey];
  // A callback in a discarded iframe can remain pending forever. Its Python
  // instance must not hold up the next project, nor run concurrently with it.
  const abandonedExecution = previous?.executionDocument &&
    previous.executionWindow.document !== previous.executionDocument;
  if (previous?.version !== ${n} || abandonedExecution) {
    const installer = runtimeOwner.document.createElement('script');
    installer.textContent = ${JSON.stringify(r)};
    runtimeOwner.document.head.append(installer);
    installer.remove();
  }
  const runtime = runtimeOwner[runtimeKey];

  window.tpLoadPyodide = function tpLoadPyodide() {
    if (runtime.pyodidePromise === null) console.info('Loading Pyodide...');
    return runtime.load();
  };

  window.tpLoadPyodidePackages = function tpLoadPyodidePackages(pyodide, packages) {
    return runtime.loadPackages(pyodide, packages, (message) => {
      if (!/already loaded from|No new packages to load/.test(message)) {
        console.log(message);
      }
    }, (message) => console.error(message));
  };

  window.tpRunWithPyodide = function tpRunWithPyodide(callback) {
    return runtime.run(callback, window, document);
  };
})();
<\/script>
`;
}
//#endregion
export { r as createPyodideRuntimeScript };

//# sourceMappingURL=python-runtime-script.js.map