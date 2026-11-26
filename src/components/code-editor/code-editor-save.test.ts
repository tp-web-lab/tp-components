import { afterEach, describe, expect, it, vi } from "vitest";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import "./code-editor.js";

vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(),
	saveBlob: vi.fn(),
}));
afterEach(() => {
	document.body.replaceChildren();
	vi.resetAllMocks();
	vi.unstubAllGlobals();
});
async function create(language = "markdown", readonly = false) {
	const editor = document.createElement("tp-code-editor");
	editor.language = language;
	editor.readonly = readonly;
	editor.toolbar = true;
	editor.setValue("# Current source\n");
	document.body.append(editor);
	await vi.waitFor(() =>
		expect(editor.querySelector(".cm-content")).not.toBeNull(),
	);
	return editor;
}
describe("code editor Save as", () => {
	it("saves the current source from its toolbar with the language extension", async () => {
		vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "notes.md" });
		const editor = await create();
		editor.setValue("# Edited\n");
		editor.querySelector<HTMLElement>("[data-tp-code-editor-save]")?.click();
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledOnce());
		expect(chooseSaveTarget).toHaveBeenCalledWith(
			expect.objectContaining({ suggestedName: "source.md", extension: ".md" }),
		);
		const blob = vi.mocked(saveBlob).mock.calls[0]?.[0];
		const reader = new FileReader();
		const text = new Promise((resolve) => {
			reader.onload = () => resolve(reader.result);
		});
		if (!blob) throw new Error("Missing saved source");
		reader.readAsText(blob);
		expect(await text).toBe("# Edited\n");
	});
	it("places Save as first, followed by a divider and Undo, and supports cancellation", async () => {
		vi.mocked(chooseSaveTarget).mockResolvedValue(null);
		await create("latex");
		const item = document.querySelector<HTMLElement>(
			"[data-tp-code-editor-keyboard-action]",
		);
		expect(item?.dataset.tpCodeEditorKeyboardAction).toBe("save-as");
		expect(item?.nextElementSibling?.tagName).toBe("TP-DIVIDER");
		expect(
			item?.nextElementSibling?.nextElementSibling?.getAttribute(
				"data-tp-code-editor-keyboard-action",
			),
		).toBe("undo");
		item?.click();
		await vi.waitFor(() => expect(chooseSaveTarget).toHaveBeenCalledOnce());
		expect(chooseSaveTarget).toHaveBeenCalledWith(
			expect.objectContaining({ extension: ".tex" }),
		);
		expect(saveBlob).not.toHaveBeenCalled();
	});
	it("handles Ctrl+S with the toolbar hidden and in read-only mode", async () => {
		vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "source.py" });
		const editor = await create("python", true);
		editor.toolbar = false;
		const event = new KeyboardEvent("keydown", {
			key: "s",
			code: "KeyS",
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});
		editor.querySelector(".cm-content")?.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledOnce());
		expect(chooseSaveTarget).toHaveBeenCalledWith(
			expect.objectContaining({ extension: ".py" }),
		);
	});
	it("retains the loaded filename and reports save errors", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				headers: new Headers(),
				text: async () => "const x = 1;",
			}),
		);
		const editor = document.createElement("tp-code-editor");
		editor.src = "/examples/demo.js?version=2";
		document.body.append(editor);
		await vi.waitFor(() => expect(editor.getValue()).toContain("const x"));
		vi.mocked(chooseSaveTarget).mockRejectedValue(new Error("Unable to save"));
		const error = vi.fn();
		editor.addEventListener("tp-code-editor-error", error);
		editor.querySelector<HTMLElement>("[data-tp-code-editor-save]")?.click();
		await vi.waitFor(() => expect(error).toHaveBeenCalledOnce());
		expect(chooseSaveTarget).toHaveBeenCalledWith(
			expect.objectContaining({ suggestedName: "demo.js", extension: ".js" }),
		);
	});
});
