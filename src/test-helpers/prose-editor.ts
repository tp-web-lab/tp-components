import { afterEach, beforeEach, vi } from "vitest";
import { stubMathJaxRuntime } from "./mathjax.js";

export async function flush(): Promise<void> {
	for (let index = 0; index < 8; index += 1) {
		await Promise.resolve();
	}
	await new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}

export async function waitFor(
	predicate: () => boolean,
	timeout = 10_000,
): Promise<void> {
	const start = Date.now();

	while (!predicate()) {
		if (Date.now() - start > timeout) {
			throw new Error("Timed out waiting for the editor state");
		}

		await new Promise((resolve) => {
			setTimeout(resolve, 10);
		});
	}
}

export function getEditor(): HTMLElement & {
	focus: () => void;
	toggleToolbar: () => Promise<void>;
	getHTML: () => string;
	insertTable: (rows?: number, columns?: number) => boolean;
	setHTML: (value: string) => void;
	value: string;
} {
	const editor = document.querySelector("tp-prose-editor");

	if (editor === null) {
		throw new Error("tp-prose-editor not found");
	}

	return editor as HTMLElement & {
		focus: () => void;
		toggleToolbar: () => Promise<void>;
		getHTML: () => string;
		insertTable: (rows?: number, columns?: number) => boolean;
		setHTML: (value: string) => void;
		value: string;
	};
}

export function setupProseEditorTests(): void {
	Range.prototype.getClientRects = (): DOMRectList =>
		({
			item: () => null,
			length: 0,
			[Symbol.iterator]: function* (): IterableIterator<DOMRect> {},
		}) as unknown as DOMRectList;
	Range.prototype.getBoundingClientRect = (): DOMRect => ({
		bottom: 0,
		height: 0,
		left: 0,
		right: 0,
		top: 0,
		width: 0,
		x: 0,
		y: 0,
		toJSON: () => ({}),
	});

	beforeEach(() => {
		// jsdom has no layout; CodeMirror measurements belong to browser tests.
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		stubMathJaxRuntime();
	});
	afterEach(() => {
		document.body.innerHTML = "";
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});
}
