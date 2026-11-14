import { afterEach, expect, it, vi } from "vitest";
import { TpCodeEditor } from "./code-editor.js";

afterEach(() => document.body.replaceChildren());

it("updates gutter labels from the requested start without changing the code", async () => {
	const editor = new TpCodeEditor();
	editor.language = "plaintext";
	editor.lineNumbers = true;
	editor.lineNumberStart = 100;
	editor.value = "first\nsecond\nthird";
	document.body.append(editor);
	const labels = () =>
		Array.from(
			editor.querySelectorAll(".cm-lineNumbers .cm-gutterElement"),
		).map((node) => node.textContent);
	await vi.waitFor(() => expect(labels()).toContain("100"));
	expect(labels()).toContain("102");
	editor.lineNumberStart = 42;
	await vi.waitFor(() => expect(labels()).toContain("42"));
	expect(labels()).toContain("44");
	expect(editor.getValue()).toBe("first\nsecond\nthird");
	editor.removeAttribute("line-number-start");
	await vi.waitFor(() => expect(labels()).toContain("1"));
	editor.lineNumbers = false;
	expect(editor.querySelector(".cm-lineNumbers")).toBeNull();
});

it.each(["", "0", "-1", "1.5", "abc", "Infinity", "9007199254740992"])(
	"falls back to one for invalid start %s",
	(value) => {
		const editor = new TpCodeEditor();
		editor.setAttribute("line-number-start", value);
		expect(editor.lineNumberStart).toBe(1);
	},
);
