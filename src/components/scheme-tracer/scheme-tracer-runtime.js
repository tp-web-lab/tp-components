import { createTraceRuntime as createSharedRuntime } from "../trace/trace-runtime.js";
import TraceWorker from "./scheme-tracer-worker.js?worker";
export function createTraceRuntime(host, readSource) {
	return createSharedRuntime(host, readSource, {
		language: "scheme",
		title: "Scheme",
		filename: "program.scm",
		loading: "Loading Scheme recorder…",
		createWorker: () => new TraceWorker(),
	});
}
