import type { InterpreterEngine } from "../interpreter/interpreter.js";
import { interpreterConsole } from "../interpreter/interpreter-console.js";
import { createPyodideRuntimeScript } from "../python-playground/python-runtime-script.js";

interface Pyodide {
	version: string;
	runPython(code: string): unknown;
	runPythonAsync(code: string): Promise<unknown>;
	setStdout(options: { batched(text: string): void }): void;
	setStderr(options: { batched(text: string): void }): void;
}
/** Uses the existing Pyodide loader in an isolated realm for each interactive session. */
export async function createPythonEngine(
	host: HTMLElement,
	write: (text: string) => void,
): Promise<InterpreterEngine> {
	const frame = document.createElement("iframe");
	frame.hidden = true;
	frame.dataset.tpGenerated = "";
	frame.title = "Python execution context";
	frame.srcdoc = `<!doctype html><html><head></head><body>${createPyodideRuntimeScript({ isolated: true })}</body></html>`;
	const ready = new Promise<void>((resolve) =>
		frame.addEventListener("load", () => resolve(), { once: true }),
	);
	host.append(frame);
	try {
		await ready;
		const scope = frame.contentWindow as
			| (Window & { tpLoadPyodide(): Promise<Pyodide> })
			| null;
		if (!scope) throw new Error("Unable to create Python context");
		Reflect.set(scope, "console", interpreterConsole(write));
		const pyodide = await scope.tpLoadPyodide();
		pyodide.setStdout({ batched: (text) => write(`${text}\n`) });
		pyodide.setStderr({ batched: (text) => write(`${text}\n`) });
		const version = String(
			pyodide.runPython("import sys; sys.version.split()[0]"),
		);
		return {
			description: `Python ${version} · Pyodide ${pyodide.version}`,
			async execute(code: string): Promise<string> {
				// Format before crossing the Python/JavaScript boundary: preserve floats,
				// arbitrary-size integers and Python containers without creating result proxies.
				return String(
					await pyodide.runPythonAsync(
						`__import__("builtins").repr(await __import__("pyodide.code", fromlist=["eval_code_async"]).eval_code_async(${JSON.stringify(code)}, globals=__import__("builtins").globals()))`,
					),
				);
			},
			dispose() {
				frame.remove();
			},
		};
	} catch (error) {
		frame.remove();
		throw error;
	}
}
