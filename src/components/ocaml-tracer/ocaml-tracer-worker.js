import { compactTraceSteps } from "../trace/visible-steps.js";
self.onmessage = async ({ data }) => {
	const code = data.code;
	let stdout = "",
		trace = [];
	const bytes = new TextEncoder().encode(code);
	const offset = (byte) =>
		new TextDecoder().decode(bytes.slice(0, byte)).length;
	self.tpOcamlWrite = (value) => {
		stdout += value;
	};
	self.tpOcamlSnapshot = (step) => {
		step.stdout = stdout;
		step.source_range = {
			start: offset(step.source_range.start),
			end: offset(step.source_range.end),
		};
		if (step.source_range.start === step.source_range.end)
			delete step.source_range;
		trace.push(step);
	};
	self.tpOcamlTraceDone = () => {};
	self.tpOcamlTraceError = (message) => {
		trace.push({
			...trace.at(-1),
			event: message.includes("Instruction limit")
				? "instruction_limit_reached"
				: "exception",
			exception_msg: message,
			stdout,
		});
	};
	try {
		await import(/* @vite-ignore */ data.runtimeUrl);
		self.postMessage({ type: "ready", version: self.tpOcaml.version });
		self.tpOcamlTrace(code);
		self.postMessage({
			type: "trace",
			result: {
				version: 1,
				language: "ocaml",
				code,
				trace: compactTraceSteps(trace),
			},
		});
	} catch (error) {
		self.postMessage({ type: "error", message: String(error) });
	}
};
