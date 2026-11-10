import {
	deleteCharBackward,
	deleteCharForward,
	indentMore,
	undo,
} from "@codemirror/commands";
import { EditorView } from "@codemirror/view";
import { afterEach, expect, it, vi } from "vitest";
import "./code-editor.js";

async function mount() {
	document.body.innerHTML =
		'<tp-code-editor readonly value="Keep this source"></tp-code-editor>';
	const host = document.querySelector("tp-code-editor");
	if (!host) throw new Error("Missing code editor");
	await vi.waitFor(() =>
		expect(host.querySelector(".cm-editor")).not.toBeNull(),
	);
	const element = host.querySelector<HTMLElement>(".cm-editor");
	const view = element && EditorView.findFromDOM(element);
	if (!view) throw new Error("Missing CodeMirror view");
	return { host, view };
}

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

it("blocks deletion, indentation and custom editing transactions but allows selection and external values", async () => {
	const { host, view } = await mount();
	expect(view.state.readOnly).toBe(true);
	view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } });
	deleteCharBackward(view);
	deleteCharForward(view);
	indentMore(view);
	view.dispatch({
		changes: { from: 0, to: view.state.doc.length, insert: "" },
	});
	expect(host.getValue()).toBe("Keep this source");
	expect(view.state.selection.main.to).toBe("Keep this source".length);
	host.setValue("Updated by the viewer");
	expect(view.state.doc.toString()).toBe("Updated by the viewer");
	undo(view);
	expect(view.state.doc.toString()).toBe("Updated by the viewer");
});

it("blocks Backspace and Delete at editor boundaries without emitting navigation intent", async () => {
	const { host, view } = await mount();
	const listener = vi.fn();
	host.addEventListener("tp-code-editor-boundary", listener);
	for (const [key, anchor] of [
		["Backspace", 0],
		["Delete", view.state.doc.length],
	] as const) {
		view.dispatch({ selection: { anchor } });
		view.contentDOM.dispatchEvent(
			new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
		);
	}
	expect(host.getValue()).toBe("Keep this source");
	expect(listener).not.toHaveBeenCalled();
});

it("re-enables editing when readonly is removed and locks it again when restored", async () => {
	const { host } = await mount();
	host.readonly = false;
	await vi.waitFor(() =>
		expect(
			host.querySelector(".cm-content")?.getAttribute("contenteditable"),
		).toBe("true"),
	);
	let view = EditorView.findFromDOM(
		host.querySelector(".cm-editor") as HTMLElement,
	);
	if (!view) throw new Error("Missing editable view");
	view.dispatch({ selection: { anchor: view.state.doc.length } });
	deleteCharBackward(view);
	expect(host.getValue()).toBe("Keep this sourc");
	host.readonly = true;
	await vi.waitFor(() =>
		expect(
			host.querySelector(".cm-content")?.getAttribute("contenteditable"),
		).toBe("false"),
	);
	view = EditorView.findFromDOM(
		host.querySelector(".cm-editor") as HTMLElement,
	);
	if (!view) throw new Error("Missing readonly view");
	view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } });
	deleteCharForward(view);
	expect(host.getValue()).toBe("Keep this sourc");
});

it("offers only reading commands in readonly palettes and restores editing commands dynamically", async () => {
	const { host } = await mount();
	const editing = [
		"undo",
		"redo",
		"cut",
		"paste",
		"indent",
		"dedent",
		"replace",
		"toggle-line-comment",
		"toggle-block-comment",
	];
	const reading = [
		"copy",
		"select-all",
		"search",
		"goto-line",
		"fold-code",
		"unfold-code",
	];
	for (const readonly of [true, false, true]) {
		host.readonly = readonly;
		const palette = document.querySelector(
			"[data-tp-code-editor-keyboard-dropdown]",
		);
		expect(palette).not.toBeNull();
		for (const action of editing) {
			expect(
				Boolean(
					palette?.querySelector(
						`[data-tp-code-editor-keyboard-action="${action}"]`,
					),
				),
			).toBe(!readonly);
		}
		for (const action of reading)
			expect(
				palette?.querySelector(
					`[data-tp-code-editor-keyboard-action="${action}"]`,
				),
			).not.toBeNull();
		expect(
			palette
				?.querySelector("ul > :first-child")
				?.hasAttribute("data-tp-dropdown-divider"),
		).toBe(false);
		expect(
			palette?.querySelector(
				"[data-tp-dropdown-divider] + [data-tp-dropdown-divider]",
			),
		).toBeNull();
	}
});

it("measures virtualized document lines and follows their reduced height", async () => {
	const { host, view } = await mount();
	const height = vi.spyOn(view, "contentHeight", "get");
	height.mockReturnValue(2400);
	expect(host.getContentHeight()).toBeGreaterThanOrEqual(2400);
	height.mockReturnValue(120);
	expect(host.getContentHeight()).toBeLessThan(2400);
});
