import { createTraceRuntime as createSharedRuntime } from "../trace/trace-runtime.js";
import TraceWorker from "./javascript-tracer-worker.js?worker";
export function createTraceRuntime(host, readSource) {
	return createSharedRuntime(host, readSource, {
		language: "javascript",
		title: "JavaScript",
		filename: "program.js",
		loading: "Loading JavaScript recorder…",
		createWorker: () => new TraceWorker(),
	});
}
