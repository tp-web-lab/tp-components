import type { InterpreterEngine } from "./interpreter.js";

interface Session {
	engine: Promise<InterpreterEngine>;
	owners: Set<HTMLElement>;
	write: (text: string) => void;
	queue: Promise<unknown>;
}
const documents = new WeakMap<Document, Map<string, Session>>();
const memberships = new WeakMap<HTMLElement, Set<Session>>();

/** Notebook cells share definitions, but route each execution's output to its cell. */
export async function scopedInterpreterEngine(
	host: HTMLElement,
	language: string,
	write: (text: string) => void,
	create: (
		write: (text: string) => void,
		host: HTMLElement,
	) => Promise<InterpreterEngine>,
): Promise<InterpreterEngine> {
	const scope = host.getAttribute("execution-scope");
	if (!scope) return create(write, host);
	let sessions = documents.get(host.ownerDocument);
	if (!sessions) {
		sessions = new Map();
		documents.set(host.ownerDocument, sessions);
	}
	const key = `${scope}:${language}`;
	let session = sessions.get(key);
	if (!session) {
		const current: Session = {
			engine: Promise.resolve(null as unknown as InterpreterEngine),
			owners: new Set(),
			write,
			queue: Promise.resolve(),
		};
		const realmHost = host.ownerDocument.createElement("div");
		realmHost.hidden = true;
		realmHost.dataset.tpGenerated = "";
		host.ownerDocument.body.append(realmHost);
		current.engine = create((text) => current.write(text), realmHost)
			.then((engine) => ({
				...engine,
				dispose() {
					engine.dispose();
					realmHost.remove();
				},
			}))
			.catch((error) => {
				realmHost.remove();
				sessions?.delete(key);
				throw error;
			});
		sessions.set(key, current);
		session = current;
	}
	const current = session;
	const notebook = host.closest("[data-tp-notebook-root]")?.parentElement;
	for (const owner of notebook ? [host, notebook] : [host]) {
		current.owners.add(owner);
		let owned = memberships.get(owner);
		if (!owned) {
			owned = new Set();
			memberships.set(owner, owned);
		}
		owned.add(current);
	}
	const engine = await current.engine;
	return {
		description: engine.description,
		execute(code) {
			const next = current.queue
				.catch(() => {})
				.then(() => {
					current.write = write;
					return engine.execute(code);
				});
			current.queue = next;
			return next;
		},
		// Reloading one cell must not discard definitions belonging to its neighbours.
		dispose() {},
	};
}

/** Release realms once no connected cell uses them. */
export function releaseInterpreterScope(host: HTMLElement): void {
	for (const session of memberships.get(host) ?? []) {
		session.owners.delete(host);
		if (!session.owners.size) {
			void session.engine.then(
				(engine) => engine.dispose(),
				() => {},
			);
			for (const [key, value] of documents.get(host.ownerDocument) ?? [])
				if (value === session) documents.get(host.ownerDocument)?.delete(key);
		}
	}
	memberships.delete(host);
}
