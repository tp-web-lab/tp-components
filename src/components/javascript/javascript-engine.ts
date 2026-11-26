import type { InterpreterEngine } from "../interpreter/interpreter.js";

function format(value: unknown): string {
	if (typeof value === "string") return value;
	if (value === undefined) return "undefined";
	if (typeof value === "bigint") return `${value}n`;
	try {
		return JSON.stringify(value, null, 2) ?? String(value);
	} catch {
		return String(value);
	}
}

/** A separate browser realm preserves declarations without rewriting let or const. */
export async function createJavascriptEngine(
	host: HTMLElement,
	write: (text: string) => void,
): Promise<InterpreterEngine> {
	const ts = await import("typescript");
	const frame = document.createElement("iframe");
	frame.hidden = true;
	frame.dataset.tpGenerated = "";
	frame.title = "JavaScript execution context";
	frame.srcdoc = "<!doctype html><html><head></head><body></body></html>";
	const ready = new Promise<void>((resolve) =>
		frame.addEventListener("load", () => resolve(), { once: true }),
	);
	host.append(frame);
	await ready;
	const realm = frame.contentWindow;
	if (!realm) throw new Error("Unable to create JavaScript context");
	const scope = realm as Window & typeof globalThis & { __tpResult?: unknown };
	for (const name of ["log", "info", "warn", "error", "debug"] as const) {
		scope.console[name] = (...values: unknown[]) =>
			write(`${values.map(format).join(" ")}\n`);
	}
	const onError = (event: ErrorEvent) => {
		event.preventDefault();
		write(`ERROR: ${event.message}\n`);
	};
	scope.addEventListener("error", onError);
	scope.addEventListener("unhandledrejection", (event) => {
		event.preventDefault();
		write(`ERROR: ${format(event.reason)}\n`);
	});
	return {
		async execute(code: string): Promise<string> {
			const source = ts.createSourceFile(
				"input.js",
				code,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.JS,
			);
			const last = source.statements.at(-1);
			let executable = code;
			if (last && ts.isExpressionStatement(last)) {
				const expression = last.expression.getText(source);
				// Await is supported for prompt expressions; declarations remain in the realm's global lexical scope.
				const hasAwait = (node: import("typescript").Node): boolean =>
					ts.isAwaitExpression(node) || !!ts.forEachChild(node, hasAwait);
				executable =
					code.slice(0, last.getStart(source)) +
					`globalThis.__tpResult = ${hasAwait(last) ? `(async () => (${expression}))()` : `(${expression})`};`;
			}
			scope.__tpResult = undefined;
			let failure: string | undefined;
			const capture = (event: ErrorEvent) => {
				event.preventDefault();
				failure = event.message;
			};
			scope.removeEventListener("error", onError);
			scope.addEventListener("error", capture);
			const script = scope.document.createElement("script");
			const url = URL.createObjectURL(
				new Blob([executable], { type: "text/javascript" }),
			);
			script.src = url;
			script.crossOrigin = "anonymous";
			const loaded = new Promise<void>((resolve, reject) => {
				script.onload = () => resolve();
				script.onerror = () => reject(new Error("Unable to execute command"));
			});
			try {
				scope.document.body.append(script);
				await loaded;
				if (failure) throw new Error(failure);
				return format(await scope.__tpResult);
			} finally {
				script.remove();
				URL.revokeObjectURL(url);
				scope.removeEventListener("error", capture);
				scope.addEventListener("error", onError);
			}
		},
		dispose() {
			frame.remove();
		},
	};
}
