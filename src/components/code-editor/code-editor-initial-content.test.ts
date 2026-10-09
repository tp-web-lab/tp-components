import { afterEach, expect, it, vi } from "vitest";
import "./code-editor.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

it("preserves a project value assigned while the initial source is resolving", async () => {
	const editor = document.createElement("tp-code-editor");
	document.body.append(editor);
	editor.setValue("const answer = 42;");
	await vi.waitFor(() =>
		expect(editor.querySelector(".cm-editor")).not.toBeNull(),
	);
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(editor.getValue()).toBe("const answer = 42;");
});

it("does not replace a newer API value with a pending file response", async () => {
	let release: ((response: Response) => void) | undefined;
	const response = new Promise<Response>((resolve) => {
		release = resolve;
	});
	const fetchMock = vi.fn(() => response);
	vi.stubGlobal("fetch", fetchMock);
	const editor = document.createElement("tp-code-editor");
	editor.src = "/old-source.js";
	document.body.append(editor);
	await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
	editor.setValue("const answer = 42;");
	if (!release) throw new Error("Missing pending response");
	release(new Response("const stale = true;"));
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(editor.getValue()).toBe("const answer = 42;");
});
