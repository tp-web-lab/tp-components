const documents = new WeakMap<Document, Map<string, Map<number, string>>>();
/** Reconsult preceding executed cells in a fresh Prolog engine, without replaying their queries. */
export function prologNotebookSource(
	host: HTMLElement,
	source: string,
): string {
	const scope = host.getAttribute("execution-scope");
	if (!scope) return source;
	let scopes = documents.get(host.ownerDocument);
	if (!scopes) {
		scopes = new Map();
		documents.set(host.ownerDocument, scopes);
	}
	let cells = scopes.get(scope);
	if (!cells) {
		cells = new Map();
		scopes.set(scope, cells);
	}
	const index = Number(host.getAttribute("execution-index") ?? "0");
	cells.set(index, source);
	return [...cells]
		.filter(([position]) => position <= index)
		.sort(([a], [b]) => a - b)
		.map(([, code]) => code)
		.join("\n\n");
}
