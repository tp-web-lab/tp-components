import type { InterpreterEngine } from "../interpreter/interpreter.js";
import { createJavascriptEngine } from "../javascript/javascript-engine.js";

/** Erases TypeScript syntax, then delegates execution and session state to JavaScript. */
export async function createTypescriptEngine(
	host: HTMLElement,
	write: (text: string) => void,
): Promise<InterpreterEngine> {
	const ts = await import("typescript");
	const engine = await createJavascriptEngine(host, write);
	return {
		async execute(code: string): Promise<string> {
			const result = ts.transpileModule(code, {
				fileName: "input.ts",
				reportDiagnostics: true,
				compilerOptions: {
					target: ts.ScriptTarget.ESNext,
					module: ts.ModuleKind.ESNext,
					moduleDetection: ts.ModuleDetectionKind.Legacy,
					sourceMap: false,
				},
			});
			const errors =
				result.diagnostics?.filter(
					(diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
				) ?? [];
			if (errors.length) {
				throw new SyntaxError(
					errors
						.map((diagnostic) => {
							const location =
								diagnostic.file && diagnostic.start !== undefined
									? diagnostic.file.getLineAndCharacterOfPosition(
											diagnostic.start,
										)
									: undefined;
							return `${location ? `Line ${location.line + 1}, column ${location.character + 1}: ` : ""}${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
						})
						.join("\n"),
				);
			}
			return engine.execute(result.outputText);
		},
		dispose() {
			engine.dispose();
		},
	};
}
