/** Sessions expose the real OCaml toplevel, with isolated bindings and a virtual filesystem. */
export interface OCamlSession {
	readonly description: string;
	execute(code: string): Promise<string>;
	set(name: string, value: unknown): void;
	file(name: string, content: string): void;
	bind(scope: Window, output: (text: string) => void): void;
	dispose(): void;
}
interface OCamlRuntime {
	version: string;
	compilerVersion: string;
	execute(code: string, print: boolean): { ok: boolean; output: string };
	file(name: string, content: string): void;
}
const moduleUrl = new URL(import.meta.url);
const root = new URL(
	moduleUrl.pathname.includes("/src/components/")
		? "../../../"
		: moduleUrl.pathname.includes("/components/")
			? "../../"
			: "../",
	moduleUrl,
);
export const OCAML_RUNTIME_URL = new URL("runtimes/ocaml/toplevel.js", root)
	.href;

/** Self-contained: also embedded in project previews and exported notebooks. */
export async function createOCamlSession(
	host: HTMLElement,
	write: (text: string) => void,
	runtimeUrl: string,
	runtimeConsole?: Console,
): Promise<OCamlSession> {
	const frame = host.ownerDocument.createElement("iframe");
	frame.hidden = true;
	frame.dataset.tpGenerated = "";
	frame.title = "OCaml execution context";
	frame.srcdoc = "<!doctype html><html><head></head><body></body></html>";
	const ready = new Promise<void>((resolve) =>
		frame.addEventListener("load", () => resolve(), { once: true }),
	);
	host.append(frame);
	try {
		await ready;
		const scope = frame.contentWindow as
			| (Window & {
					tpOcaml: OCamlRuntime;
					tpOcamlWrite: (text: string) => void;
					tpDocument: Document;
					tpWindow: Window;
			  })
			| null;
		if (!scope) throw new Error("Unable to create OCaml context");
		scope.tpOcamlWrite = write;
		if (runtimeConsole) Reflect.set(scope, "console", runtimeConsole);
		scope.tpDocument = host.ownerDocument;
		scope.tpWindow = host.ownerDocument.defaultView ?? window;
		await new Promise<void>((resolve, reject) => {
			const script = scope.document.createElement("script");
			script.src = runtimeUrl;
			script.onload = () => resolve();
			script.onerror = () =>
				reject(new Error("Unable to load Js_of_ocaml toplevel"));
			scope.document.head.append(script);
		});
		// JavaScript callbacks run in this hidden realm; forward their failures to
		// the console currently bound to the visible preview.
		scope.addEventListener("error", (event) => {
			if (event.message)
				Reflect.get(scope, "console").error(event.error ?? event.message);
		});
		scope.addEventListener("unhandledrejection", (event) => {
			Reflect.get(scope, "console").error(event.reason);
		});
		const runtime = scope.tpOcaml;
		if (!runtime) throw new Error("OCaml toplevel did not initialize");
		return {
			description: `OCaml ${runtime.version} · Js_of_ocaml ${runtime.compilerVersion}`,
			async execute(code) {
				const result = runtime.execute(code, true);
				if (!result.ok) throw new Error(result.output.trim());
				return result.output.trimEnd();
			},
			set(name, value) {
				Reflect.set(scope, name, value);
			},
			file(name, content) {
				runtime.file(name.startsWith("/") ? name : `/${name}`, content);
			},
			bind(win, output) {
				Reflect.set(
					scope,
					"console",
					(win as Window & typeof globalThis).console,
				);
				scope.tpDocument = win.document;
				scope.tpWindow = win;
				scope.tpOcamlWrite = output;
			},
			dispose() {
				scope.tpOcamlWrite = () => {};
				frame.remove();
			},
		};
	} catch (error) {
		frame.remove();
		throw error;
	}
}
