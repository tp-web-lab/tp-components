/** Pinned LIPS distribution, shared by interpreters and generated execution documents. */
export interface SchemeSession {
	readonly description: string;
	execute(code: string): Promise<string>;
	/** Give submitted code its own scope beneath protected test-framework bindings. */
	isolateProgram(): void;
	load(code: string): Promise<void>;
	set(name: string, value: unknown): void;
	bind(scope: Window, output: (text: string) => void): void;
	dispose(): void;
}
interface SchemeEnvironment {
	inherit(name: string): SchemeEnvironment;
	set(name: string, value: unknown): void;
}
interface Lips {
	version: string;
	bootstrap(url: string): Promise<void>;
	OutputPort: new (write: (value: unknown) => void) => unknown;
	Interpreter: new (
		name: string,
		bindings: Record<string, unknown>,
	) => {
		__env__: SchemeEnvironment;
		exec(
			code: string,
			options?: { env: SchemeEnvironment },
		): Promise<unknown[]>;
		set(name: string, value: unknown): void;
		get(name: string): (value: unknown, ...args: unknown[]) => unknown;
	};
}
/** Self-contained so the same implementation can run in exported documents. */
export async function createSchemeSession(
	host: HTMLElement,
	write: (text: string) => void,
): Promise<SchemeSession> {
	const base = "https://cdn.jsdelivr.net/npm/lips@1.0.0-beta.23.1/dist/";
	const frame = host.ownerDocument.createElement("iframe");
	frame.hidden = true;
	frame.dataset.tpGenerated = "";
	frame.title = "LIPS Scheme execution context";
	frame.srcdoc = "<!doctype html><html><head></head><body></body></html>";
	const ready = new Promise<void>((resolve) =>
		frame.addEventListener("load", () => resolve(), { once: true }),
	);
	host.append(frame);
	try {
		await ready;
		const scope = frame.contentWindow as (Window & { lips: Lips }) | null;
		if (!scope) throw new Error("Unable to create Scheme context");
		await new Promise<void>((resolve, reject) => {
			const script = scope.document.createElement("script");
			script.src = `${base}lips.min.js`;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error("Unable to load LIPS Scheme"));
			scope.document.head.append(script);
		});
		const lips = scope.lips;
		await lips.bootstrap(`${base}std.xcb`);
		let output = write;
		let repr: (value: unknown, quoted?: boolean) => unknown = String;
		const port = new lips.OutputPort((value) =>
			output(typeof value === "string" ? value : String(repr(value))),
		);
		const interpreter = new lips.Interpreter("tp-scheme", {
			stdout: port,
			stderr: port,
		});
		repr = interpreter.get("repr");
		let programEnvironment: SchemeEnvironment | undefined;
		const session: SchemeSession = {
			description: `Scheme · LIPS ${lips.version}`,
			async execute(code) {
				const values = await interpreter.exec(
					code,
					programEnvironment ? { env: programEnvironment } : undefined,
				);
				const result = String(repr(values.at(-1), true));
				return result === "#void" || result === "undefined" ? "" : result;
			},
			isolateProgram() {
				programEnvironment = interpreter.__env__.inherit(
					"tp-submitted-program",
				);
				// Native eval must resolve submitted definitions in the child scope,
				// while test-framework closures retain their original bindings.
				const evaluate = interpreter.get("eval");
				programEnvironment.set("eval", (code: unknown, environment?: unknown) =>
					evaluate(code, environment ?? programEnvironment),
				);
			},
			async load(code) {
				// Native load uses its own parser, so nested project files do not
				// overwrite the caller's pending expressions.
				const url = URL.createObjectURL(
					new Blob([code], { type: "text/plain" }),
				);
				try {
					await interpreter.get("load")(
						`${url}#project.scm`,
						programEnvironment,
					);
				} finally {
					URL.revokeObjectURL(url);
				}
			},
			set(name, value) {
				(programEnvironment ?? interpreter.__env__).set(name, value);
			},
			bind(win, callback) {
				output = callback;
				interpreter.set("window", win);
				interpreter.set("document", win.document);
				interpreter.set("parent", win.parent);
				interpreter.set("console", (win as Window & typeof globalThis).console);
			},
			dispose() {
				output = () => {};
				frame.remove();
			},
		};
		session.bind(host.ownerDocument.defaultView ?? window, write);
		return session;
	} catch (error) {
		frame.remove();
		throw error;
	}
}
