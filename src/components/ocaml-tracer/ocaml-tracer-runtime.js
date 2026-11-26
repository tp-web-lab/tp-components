import { createTraceRuntime as createSharedRuntime } from "../trace/trace-runtime.js";
import TraceWorker from "./ocaml-tracer-worker.js?worker";
export function createTraceRuntime(host, readSource) {
	const moduleUrl = new URL(import.meta.url);
	const root = new URL(
		moduleUrl.pathname.includes("/src/components/")
			? "../../../"
			: moduleUrl.pathname.includes("/components/")
				? "../../"
				: "../",
		moduleUrl,
	);
	return createSharedRuntime(host, readSource, {
		language: "ocaml",
		title: "OCaml",
		filename: "program.ml",
		loading: "Loading OCaml recorder…",
		createWorker: () => {
			const worker = new TraceWorker();
			const send = worker.postMessage.bind(worker);
			worker.postMessage = (data) =>
				send({
					...data,
					runtimeUrl: new URL("runtimes/ocaml/tracer.js", root).href,
				});
			return worker;
		},
	});
}
