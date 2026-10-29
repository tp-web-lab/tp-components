import { isolateHistory, undo } from "@codemirror/commands";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, expect, it, vi } from "vitest";

const requests = vi.hoisted(
	() =>
		new Map<
			string,
			{ promise: Promise<Extension>; resolve: (extension: Extension) => void }
		>(),
);
vi.mock("./language-support.js", () => ({
	getLoadedLanguageSupport: () => [],
	loadLanguageSupport: (language: string) => {
		if (!requests.has(language)) {
			let resolve!: (extension: Extension) => void;
			const promise = new Promise<Extension>((done) => {
				resolve = done;
			});
			requests.set(language, { promise, resolve });
		}
		return requests.get(language)?.promise;
	},
}));

import "./code-editor.js";

afterEach(() => {
	document.body.replaceChildren();
	requests.clear();
});

async function mount() {
	const element = document.createElement("tp-code-editor");
	element.language = "javascript";
	element.value = "const answer = 1;";
	document.body.append(element);
	await vi.waitFor(() => expect(element.getValue()).toBe("const answer = 1;"));
	await new Promise((resolve) => setTimeout(resolve, 0));
	const dom = element.querySelector<HTMLElement>(".cm-editor");
	if (!dom) throw new Error("Missing editor");
	const view = EditorView.findFromDOM(dom);
	if (!view) throw new Error("Missing editor view");
	return { element, view, dom };
}

it("preserves editing, selection and undo history when a grammar arrives", async () => {
	const { element, view, dom } = await mount();
	view.dispatch({
		changes: { from: 15, to: 16, insert: "42" },
		annotations: isolateHistory.of("before"),
		selection: { anchor: 17 },
	});
	requests
		.get("javascript")
		?.resolve(
			EditorView.editorAttributes.of({ "data-test-language": "javascript" }),
		);
	await vi.waitFor(() => expect(dom.dataset.testLanguage).toBe("javascript"));
	expect(element.getValue()).toBe("const answer = 42;");
	expect(view.state.selection.main.anchor).toBe(17);
	expect(undo(view)).toBe(true);
	expect(element.getValue()).toBe("const answer = 1;");
});

it("ignores a grammar that arrives after a language switch", async () => {
	const { element, dom } = await mount();
	element.language = "python";
	await new Promise((resolve) => setTimeout(resolve, 0));
	requests
		.get("python")
		?.resolve(
			EditorView.editorAttributes.of({ "data-test-language": "python" }),
		);
	await vi.waitFor(() => expect(dom.dataset.testLanguage).toBe("python"));
	requests
		.get("javascript")
		?.resolve(
			EditorView.editorAttributes.of({ "data-test-language": "javascript" }),
		);
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(dom.dataset.testLanguage).toBe("python");
});
