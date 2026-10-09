import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { required } from "../../test-helpers/required.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import {
	TpPythonPlayground,
	TpPythonProject,
} from "../python-playground/python-playground.js";
import { TpPlaygroundExampleLoader } from "./playground-example-loader.js";
import { choosePlaygroundFile } from "./playground-local-file.js";

vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(),
	saveBlob: vi.fn(),
}));

beforeEach(() => {
	vi.spyOn(
		TpPlaygroundExampleLoader.prototype,
		"getExamples",
	).mockResolvedValue([]);
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify({ examples: [] }))),
	);
	vi.mocked(chooseSaveTarget)
		.mockReset()
		.mockResolvedValue({ filename: "saved.py" });
	vi.mocked(saveBlob).mockReset().mockResolvedValue();
});

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

/** Dispatches the same event as the shared toolbar menu. */
function select(playground: TpPythonPlayground, action: string): void {
	const item = required(
		playground.querySelector<HTMLElement>(
			`[data-tp-playground-action="${action}"]`,
		),
	);
	item.dispatchEvent(
		new CustomEvent("tp-menu-item-select", { bubbles: true, detail: { item } }),
	);
}

/** Creates the empty state from the Project menu. */
function createEmptyPlayground(): TpPythonPlayground {
	const playground = new TpPythonPlayground();
	document.body.append(playground);
	select(playground, "clear-project");
	return playground;
}

/** Supplies a local file to the pending chooser without opening an OS dialog. */
function chooseFile(
	playground: TpPythonPlayground,
	name: string,
	content: string,
): void {
	const input = required(
		playground.querySelector<HTMLInputElement>(
			"[data-tp-playground-file-input]",
		),
	);
	const file = new File([content], name);
	Object.defineProperty(file, "text", { value: async () => content });
	Object.defineProperty(input, "files", { value: [file] });
	input.dispatchEvent(new Event("change"));
}

/** Reads a jsdom Blob using the browser API supported by the test environment. */
function blobText(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsText(blob);
	});
}

describe("playground local file menus", () => {
	it("opens a source in an empty project and saves current edits, reusing or changing the destination", async () => {
		const playground = createEmptyPlayground();
		expect(
			playground
				.querySelector('[data-tp-playground-action="save-file"]')
				?.getAttribute("aria-disabled"),
		).toBe("true");
		select(playground, "open-source-file");
		expect(
			playground.querySelector("input[type=file]")?.getAttribute("accept"),
		).toBe(".py");
		chooseFile(playground, "hello.py", 'print("hello")');
		await vi.waitFor(() =>
			expect(playground.getProject().entry).toBe("/hello.py"),
		);
		expect(playground.getProject().findFile("/index.html")?.content).toBe(
			'<main id="app"></main>',
		);
		expect(
			playground
				.querySelector('[data-tp-playground-action="save-file"]')
				?.getAttribute("aria-disabled"),
		).toBe("false");
		const editor = required(playground.querySelector("tp-code-editor"));
		editor.setValue('print("edited")');
		editor.dispatchEvent(
			new CustomEvent("tp-code-editor-change", {
				detail: { value: editor.getValue() },
			}),
		);
		select(playground, "save-file");
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledTimes(1));
		expect(
			await blobText(required(vi.mocked(saveBlob).mock.calls[0]?.[0])),
		).toBe('print("edited")');
		expect(chooseSaveTarget).toHaveBeenCalledWith(
			expect.objectContaining({ suggestedName: "hello.py", extension: ".py" }),
		);
		select(playground, "save-file");
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledTimes(2));
		expect(chooseSaveTarget).toHaveBeenCalledTimes(1);
		vi.mocked(chooseSaveTarget).mockResolvedValueOnce({ filename: "copy.py" });
		select(playground, "save-file-as");
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledTimes(3));
		select(playground, "save-file");
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledTimes(4));
		expect(vi.mocked(saveBlob).mock.calls[3]?.[1]).toEqual({
			filename: "copy.py",
		});
		expect(chooseSaveTarget).toHaveBeenCalledTimes(2);
		playground.setProject(playground.getProject());
		select(playground, "save-file");
		await vi.waitFor(() => expect(chooseSaveTarget).toHaveBeenCalledTimes(3));
	});

	it("keeps the project on cancellation and invalid source selection", async () => {
		const playground = createEmptyPlayground();
		select(playground, "open-source-file");
		required(playground.querySelector("input[type=file]")).dispatchEvent(
			new Event("cancel"),
		);
		await Promise.resolve();
		expect(playground.querySelector("input[type=file]")).toBeNull();
		expect(playground.getProject().files).toEqual([]);
		select(playground, "save-file");
		expect(chooseSaveTarget).not.toHaveBeenCalled();
		select(playground, "open-source-file");
		chooseFile(playground, "wrong.js", "source");
		await vi.waitFor(() =>
			expect(playground.querySelector("tp-console")?.getValue()).toContain(
				"Unsupported python source file",
			),
		);
		expect(playground.getProject().files).toEqual([]);
	});

	it("imports and exports JSON with all files and Python metadata", async () => {
		const playground = createEmptyPlayground();
		const project = {
			name: "Imported",
			entry: "/main.py",
			libs: ["numpy"],
			files: [
				{ path: "/main.py", language: "python", content: "print(42)" },
				{ path: "/helper.py", content: "answer = 42" },
			],
		};
		select(playground, "import-disk");
		chooseFile(playground, "project.json", JSON.stringify(project));
		await vi.waitFor(() =>
			expect(playground.getProject().name).toBe("Imported"),
		);
		select(playground, "export-disk");
		await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledOnce());
		expect(
			JSON.parse(
				await blobText(required(vi.mocked(saveBlob).mock.calls[0]?.[0])),
			),
		).toMatchObject(project);
		select(playground, "import-disk");
		chooseFile(playground, "bad.json", "{}");
		await vi.waitFor(() =>
			expect(
				playground.querySelector("tp-console")?.getEntries()[0]?.kind,
			).toBe("error"),
		);
		expect(playground.getProject().name).toBe("Imported");
	});

	it("cancels obsolete choosers and ignores reads completing after a project change", async () => {
		const playground = createEmptyPlayground();
		select(playground, "open-source-file");
		const first = required(playground.querySelector("input[type=file]"));
		select(playground, "open-source-file");
		expect(first.isConnected).toBe(false);
		chooseFile(playground, "old.py", "old");
		playground.setProject(new TpPythonProject({ name: "Newer", files: [] }));
		await Promise.resolve();
		await Promise.resolve();
		expect(playground.getProject().name).toBe("Newer");
		select(playground, "open-source-file");
		const input = required(playground.querySelector("input[type=file]"));
		playground.remove();
		expect(input.isConnected).toBe(false);
		const controller = new AbortController();
		controller.abort();
		expect(
			await choosePlaygroundFile(playground, ".py", controller.signal),
		).toBeNull();
	});

	it("does not save cancelled destinations and reports disk errors", async () => {
		const playground = createEmptyPlayground();
		select(playground, "new-project");
		vi.mocked(chooseSaveTarget).mockResolvedValueOnce(null);
		select(playground, "save-file-as");
		await Promise.resolve();
		expect(saveBlob).not.toHaveBeenCalled();
		vi.mocked(saveBlob).mockRejectedValueOnce(new Error("Disk full"));
		select(playground, "save-file");
		await vi.waitFor(() =>
			expect(playground.querySelector("tp-console")?.getValue()).toContain(
				"Disk full",
			),
		);
		vi.mocked(chooseSaveTarget).mockRejectedValueOnce(
			new Error("Permission denied"),
		);
		select(playground, "export-disk");
		await vi.waitFor(() =>
			expect(playground.querySelector("tp-console")?.getValue()).toContain(
				"Permission denied",
			),
		);
	});
});
