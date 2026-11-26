/* Disposable classic Worker. No Python Tutor service or third-party visualizer. */
const indexURL = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/";
self.onmessage = async ({ data }) => {
	try {
		importScripts(indexURL + "pyodide.js");
		const py = await loadPyodide({ indexURL });
		for (const name of ["pg_encoder.py", "pg_logger.py"]) {
			const response = await fetch(
				new URL("vendor/" + name, self.location.href),
			);
			if (!response.ok)
				throw Error(`Unable to load ${name}: ${response.status}`);
			py.FS.writeFile("/home/pyodide/" + name, await response.text());
		}
		py.globals.set("tp_source", data.code);
		self.postMessage({
			type: "ready",
			version: py.runPython("import sys; sys.version.split()[0]"),
		});
		const trace = py.runPython(`
import pg_logger, json
pg_logger.MAX_EXECUTED_LINES = 1000
_tp_trace = pg_logger.exec_script_str_local(
    tp_source, None, False, False,
    lambda code, trace: json.dumps({"code": code, "trace": trace}),
    allow_all_modules=False)
_tp_trace
`);
		self.postMessage({ type: "trace", result: JSON.parse(trace) });
	} catch (error) {
		self.postMessage({ type: "error", message: String(error) });
	}
};
