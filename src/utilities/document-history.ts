import { globalListTarget } from "./global-listof.js";
import { restoreElementScroll } from "./restore-element-scroll.js";

/** Browser history for light-DOM documents, including embedded guides. */
interface SavedElement {
	path: number[];
	tag: string;
	left: number;
	top: number;
	attributes?: Record<string, string | null>;
}
interface Snapshot {
	elements: SavedElement[];
	ancestors: SavedElement[];
	x: number;
	y: number;
}
interface Entry {
	href: string;
	snapshot?: Snapshot;
}
const snapshotKey = "tpDocumentSnapshots";
const stateKey = "tpDocumentHistory";
function pathTo(root: Element, node: Element): number[] {
	const path: number[] = [];
	while (node !== root && node.parentElement) {
		path.unshift([...node.parentElement.children].indexOf(node));
		node = node.parentElement;
	}
	return path;
}
function snapshot(root: HTMLElement): Snapshot {
	const elements: SavedElement[] = [];
	for (const node of [root, ...root.querySelectorAll<HTMLElement>("*")]) {
		const attributes: Record<string, string | null> = {};
		if (node.matches("tp-accordion"))
			attributes["open-indexes"] = node.getAttribute("open-indexes");
		if (node.matches("tp-toc,details"))
			attributes.open = node.getAttribute("open");
		if (node.matches("tp-global-listof"))
			attributes.merge = node.getAttribute("merge");
		if (
			node.scrollTop ||
			node.scrollLeft ||
			node.scrollHeight > node.clientHeight ||
			node.scrollWidth > node.clientWidth ||
			Object.keys(attributes).length
		)
			elements.push({
				path: pathTo(root, node),
				tag: node.localName,
				left: node.scrollLeft,
				top: node.scrollTop,
				attributes,
			});
	}
	const ancestors: Snapshot["ancestors"] = [];
	for (let node = root.parentElement; node; node = node.parentElement)
		ancestors.push({
			path: pathTo(document.documentElement, node),
			tag: node.localName,
			left: node.scrollLeft,
			top: node.scrollTop,
		});
	return { elements, ancestors, x: window.scrollX, y: window.scrollY };
}
function restore(root: HTMLElement, saved: Snapshot): () => void {
	let stopped = false,
		frame = 0;
	const apply = () => {
		frame = 0;
		if (stopped || !root.isConnected) return;
		for (const item of saved.elements) {
			let node: Element | undefined = root;
			for (const index of item.path) node = node?.children[index];
			if (!node || node.localName !== item.tag) continue;
			for (const [name, value] of Object.entries(item.attributes ?? {})) {
				if (node.getAttribute(name) === value) continue;
				if (value === null) node.removeAttribute(name);
				else node.setAttribute(name, value);
			}
			node.dispatchEvent(new Event("tp-scroll-restoration"));
			restoreElementScroll(node, item.left, item.top);
		}
		for (const item of saved.ancestors) {
			let node: Element | undefined = document.documentElement;
			for (const index of item.path) node = node?.children[index];
			if (node?.localName === item.tag) {
				restoreElementScroll(node, item.left, item.top);
			}
		}
		window.scrollTo(saved.x, saved.y);
	};
	const schedule = () => {
		if (!frame && !stopped) frame = window.setTimeout(apply, 0);
	};
	const observer = new MutationObserver(schedule);
	observer.observe(root, { childList: true, subtree: true, attributes: true });
	const resize =
		typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
	resize?.observe(root);
	const stop = () => {
		stopped = true;
		observer.disconnect();
		resize?.disconnect();
		clearTimeout(frame);
		clearTimeout(timer);
		for (const type of ["wheel", "touchstart", "pointerdown", "keydown"])
			window.removeEventListener(type, stop, true);
	};
	const timer = setTimeout(stop, 60000);
	for (const type of ["wheel", "touchstart", "pointerdown", "keydown"])
		window.addEventListener(type, stop, { capture: true, once: true });
	apply();
	schedule();
	return stop;
}
export class DocumentHistory {
	private readonly key: string;
	private sequence = 0;
	private entries = new Map<number, Entry>();
	private current = 0;
	private url = window.location.href;
	private skipHash = false;
	private stopRestore?: () => void;
	private generation = 0;
	public constructor(
		private root: HTMLElement,
		private navigate: (href: string) => Promise<void>,
	) {
		this.key = root.id
			? `id:${root.id}`
			: `${root.localName}:${[...document.querySelectorAll(root.localName)].indexOf(root)}`;
		const token = history.state?.[stateKey]?.[this.key];
		if (typeof token === "number") this.current = this.sequence = token;
		const saved = history.state?.[snapshotKey]?.[this.key] as Entry | undefined;
		if (saved) this.entries.set(this.current, saved);
		window.addEventListener("pagehide", this.saveCurrent);
		window.addEventListener("popstate", this.onPop);
	}
	private state(token: number): Record<string, unknown> {
		const state =
			history.state && typeof history.state === "object" ? history.state : {};
		return {
			...state,
			[stateKey]: { ...state[stateKey], [this.key]: token },
			[snapshotKey]: {
				...state[snapshotKey],
				[this.key]: this.entries.get(token),
			},
		};
	}
	private saveCurrent = (): void => {
		const entry = this.entries.get(this.current);
		if (!entry) return;
		entry.snapshot = snapshot(this.root);
		history.replaceState(this.state(this.current), "");
	};
	public go(href: string, initialHref: string, url?: string): void {
		this.stopRestore?.();
		const old = this.entries.get(this.current);
		if (old) old.snapshot = snapshot(this.root);
		else {
			this.entries.set(this.current, {
				href: initialHref,
				snapshot: snapshot(this.root),
			});
			history.replaceState(this.state(this.current), "");
		}
		history.replaceState(this.state(this.current), "");
		if (old?.href === href) {
			void this.navigate(href);
			return;
		}
		this.current = ++this.sequence;
		this.entries.set(this.current, { href });
		history.pushState(this.state(this.current), "", url);
		this.url = window.location.href;
		this.generation++;
		void this.navigate(href);
	}
	/** Local route retained when the host document is recreated. */
	public get currentHref(): string | null {
		return this.entries.get(this.current)?.href ?? null;
	}
	public consumeHashChange(): boolean {
		const skip = this.skipHash;
		this.skipHash = false;
		return skip;
	}
	private onPop = (): void => {
		const token = history.state?.[stateKey]?.[this.key];
		if (typeof token !== "number" || token === this.current) return;
		const entry =
			this.entries.get(token) ??
			(history.state?.[snapshotKey]?.[this.key] as Entry | undefined);
		if (!entry) return;
		this.entries.set(token, entry);
		this.sequence = Math.max(this.sequence, token);
		const old = this.entries.get(this.current);
		if (old) old.snapshot = snapshot(this.root);
		this.stopRestore?.();
		this.skipHash = this.url !== window.location.href;
		this.url = window.location.href;
		this.current = token;
		const generation = ++this.generation;
		void this.navigate(entry.href).then(() => {
			if (generation === this.generation && entry.snapshot)
				this.stopRestore = restore(this.root, entry.snapshot);
		});
	};
	public disconnect(): void {
		this.generation++;
		this.stopRestore?.();
		window.removeEventListener("popstate", this.onPop);
		window.removeEventListener("pagehide", this.saveCurrent);
	}
}
const standalone = new WeakMap<HTMLElement, DocumentHistory>();
/** Register anchor navigation even outside a multi-page shell. */
export function navigateDocumentAnchor(heading: Element, url: string): void {
	const host = heading.closest<
		HTMLElement & { navigateToFragment?: (fragment: string) => void }
	>(".tp-markdown-multi-pages-host, .tp-markup-multi-pages-host");
	if (host?.navigateToFragment) {
		host.navigateToFragment(`#${encodeURIComponent(heading.id)}`);
		return;
	}
	const root = heading.ownerDocument.body;
	let navigation = standalone.get(root);
	if (!navigation) {
		navigation = new DocumentHistory(root, async (href) => {
			const id = decodeURIComponent(href.slice(href.lastIndexOf("#") + 1));
			globalListTarget(root, id)?.scrollIntoView?.({ block: "start" });
		});
		standalone.set(root, navigation);
	}
	navigation.go(url, window.location.href, url);
}
