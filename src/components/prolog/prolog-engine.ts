import { interpreterConsole } from "../interpreter/interpreter-console.js";
import {
	resultFormatter,
	SWIPL_BASE_URL,
} from "../prolog-playground/prolog-runtime.js";

/** Minimal asynchronous API of the pinned SWI-Prolog WASM distribution. */
export interface PrologEngine {
	prolog: {
		forEach(
			goal: string,
			input?: Record<string, unknown>,
		): Promise<Record<string, unknown>[]>;
		load_string(source: string, filename: string): Promise<unknown>;
	};
}
type Factory = (options: {
	arguments: string[];
	locateFile: (file: string) => string;
	on_output: (text: string) => void;
}) => Promise<PrologEngine>;
let factory: Promise<Factory> | undefined;
let consoleFactory: Promise<(console: Console) => Factory> | undefined;

/** Loads one shared script, then creates an independent interpreter per component. */
export async function createPrologEngine(
	output: (text: string) => void,
	captureConsole = false,
): Promise<PrologEngine> {
	factory ??= new Promise<Factory>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = `${SWIPL_BASE_URL}swipl-web.js`;
		script.onload = () =>
			resolve((globalThis as typeof globalThis & { SWIPL: Factory }).SWIPL);
		script.onerror = () => {
			script.remove();
			reject(new Error("Unable to load SWI-Prolog WASM."));
		};
		document.head.append(script);
	}).catch((error) => {
		factory = undefined;
		throw error;
	});
	let create = await factory;
	if (captureConsole) {
		// Bind a lexical console to this SWI instance. No page-global console patch:
		// library(wasm)'s direct eval resolves console in this factory's closure.
		consoleFactory ??= fetch(`${SWIPL_BASE_URL}swipl-web.js`)
			.then(async (response) => {
				if (!response.ok)
					throw new Error("Unable to load SWI-Prolog JavaScript bindings.");
				return new Function(
					"console",
					`${await response.text()}\nreturn SWIPL;`,
				) as (console: Console) => Factory;
			})
			.catch((error) => {
				consoleFactory = undefined;
				throw error;
			});
		create = (await consoleFactory)(interpreterConsole(output));
	}
	const runtime = await create({
		arguments: ["-q"],
		locateFile: (file) => SWIPL_BASE_URL + file,
		on_output: output,
	});
	await runtime.prolog.load_string(resultFormatter, "/tp-runtime.pl");
	return runtime;
}
