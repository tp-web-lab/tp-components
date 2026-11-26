import encoder from "./vendor/pg_encoder.py?raw";
import logger from "./vendor/pg_logger.py?raw";
/* Disposable classic Worker. No Python Tutor service or third-party visualizer. */
const indexURL = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/";
self.onmessage = async ({ data }) => {
	try {
		const { loadPyodide } = await import(
			/* @vite-ignore */ indexURL + "pyodide.mjs"
		);
		const py = await loadPyodide({ indexURL });
		py.FS.writeFile("/home/pyodide/pg_encoder.py", encoder);
		py.FS.writeFile("/home/pyodide/pg_logger.py", logger);
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
