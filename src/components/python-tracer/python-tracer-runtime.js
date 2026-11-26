import { createTraceRuntime as createSharedRuntime } from "../trace/trace-runtime.js";
import TraceWorker from "./python-tracer-worker.js?worker";
export function createTraceRuntime(host, readSource) {
	return createSharedRuntime(host, readSource, {
		language: "python",
		title: "Python",
		filename: "program.py",
		loading: "Loading Pyodide…",
		createWorker: () => new TraceWorker(),
	});
}
