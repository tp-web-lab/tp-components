/** Languages with an interactive prompt; SQL retains its specialized viewer. */
export const NOTEBOOK_INTERPRETERS = new Set([
	"javascript",
	"typescript",
	"python",
	"prolog",
	"scheme",
	"ocaml",
]);
export interface InterpreterCell {
	language: string;
	query?: string;
	files?: Array<{ filename?: string; content: string }>;
}
const extensions: Record<string, string> = {
	javascript: "js",
	typescript: "ts",
	python: "py",
	prolog: "pl",
	scheme: "scm",
	ocaml: "ml",
};
export function isQueryFile(filename = ""): boolean {
	return /(?:^|\/)(?:query|[^/]+\.query)\.[^/]+$/.test(filename);
}

/** Keep the prompt separate from the consulted program, including legacy query files. */
export function createNotebookInterpreter(
	cell: InterpreterCell,
	scope: string,
	index: number,
): HTMLElement {
	const element = document.createElement(`tp-${cell.language}`);
	element.setAttribute("mode", "simple");
	element.setAttribute("data-tp-notebook-interpreter", "");
	element.setAttribute("execution-scope", scope);
	element.setAttribute("execution-index", String(index));
	const files = cell.files ?? [];
	const program = files.filter((file) => !isQueryFile(file.filename));
	element.setAttribute(
		"query",
		cell.query ??
			files
				.filter((file) => isQueryFile(file.filename))
				.map((file) => file.content)
				.join("\n"),
	);
	element.setAttribute(
		"filename",
		program.length === 1 && program[0]?.filename
			? program[0].filename
			: `cell-${index + 1}.${extensions[cell.language]}`,
	);
	const script = document.createElement("script");
	script.type = `tp/${cell.language}`;
	script.textContent = program.map((file) => file.content).join("\n\n");
	element.append(script);
	return element;
}

/** A single execution entry point for notebook toolbar actions and keyboard shortcuts. */
export async function runNotebookCell(container: Element): Promise<void> {
	const interpreter = container.matches("[data-tp-notebook-interpreter]")
		? container
		: container.querySelector("[data-tp-notebook-interpreter]");
	if (interpreter) {
		await customElements.whenDefined(interpreter.localName);
		// Source editors initialize asynchronously. Do not drop an early Run all.
		while (
			interpreter.isConnected &&
			interpreter.getAttribute("aria-busy") === "true"
		)
			await new Promise((resolve) => setTimeout(resolve, 10));
		await (interpreter as HTMLElement & { run(): Promise<void> }).run();
		return;
	}
	container
		.querySelector<HTMLElement>('[data-tp-playground-run], [data-role="run"]')
		?.click();
}
