import { createTraceRuntime as createSharedRuntime } from "../trace/trace-runtime.js";
import TraceWorker from "./typescript-tracer-worker.js?worker";
export function createTraceRuntime(host, readSource) {
	return createSharedRuntime(host, readSource, {
		language: "typescript",
		title: "TypeScript",
		filename: "program.ts",
		loading: "Loading TypeScript recorder…",
		createWorker: () => new TraceWorker(),
	});
}
