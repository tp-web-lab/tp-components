import { afterEach, expect, it, vi } from "vitest";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { choosePlaygroundFile } from "../playground/playground-local-file.js";
import { TpGraphGeometry } from "./graph-geometry.js";

vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(),
	saveBlob: vi.fn(),
}));
vi.mock("../playground/playground-local-file.js", () => ({
	choosePlaygroundFile: vi.fn(),
}));
afterEach(() => {
	document.body.replaceChildren();
	vi.resetAllMocks();
});
async function mount() {
	const g = new TpGraphGeometry();
	g.value = "point A = (0, 0)";
	document.body.append(g);
	await Promise.resolve();
	return g;
}
async function click(g: TpGraphGeometry, action: string) {
	const button = g.querySelector<HTMLElement>(`[data-source-file="${action}"]`);
	if (!button) throw Error("Missing action");
	button.click();
	await vi.waitFor(() => expect(button.hasAttribute("disabled")).toBe(false));
}
it("saves unapplied editor text, reuses a destination and preserves it on Save as cancellation", async () => {
	const g = await mount();
	const editor = g.querySelector<TpCodeEditor>("tp-code-editor");
	if (!editor) throw Error("Missing editor");
	editor.setValue("point B = (2, 3)");
	const target = { filename: "lesson.txt" };
	vi.mocked(chooseSaveTarget).mockResolvedValue(target);
	await click(g, "save");
	expect(g.value).toBe("point A = (0, 0)");
	expect(saveBlob).toHaveBeenCalledWith(expect.any(Blob), target);
	expect(chooseSaveTarget).toHaveBeenCalledWith(
		expect.objectContaining({
			suggestedName: "construction.txt",
			extension: ".txt",
		}),
	);
	const blob = vi.mocked(saveBlob).mock.calls[0]?.[0];
	const reader = new FileReader();
	const content = new Promise((resolve) => {
		reader.onload = () => resolve(reader.result);
	});
	if (!blob) throw Error("Missing saved data");
	reader.readAsText(blob);
	expect(await content).toBe("point B = (2, 3)");
	await click(g, "save");
	expect(chooseSaveTarget).toHaveBeenCalledTimes(1);
	vi.mocked(chooseSaveTarget).mockResolvedValue(null);
	await click(g, "save-as");
	expect(saveBlob).toHaveBeenCalledTimes(2);
	await click(g, "save");
	expect(chooseSaveTarget).toHaveBeenCalledTimes(2);
	const other = { filename: "other.txt" };
	vi.mocked(chooseSaveTarget).mockResolvedValue(other);
	await click(g, "save-as");
	await click(g, "save");
	expect(vi.mocked(saveBlob).mock.calls.at(-1)?.[1]).toBe(other);
});
it("loads valid files atomically with undo, leaves invalid files intact and resets save destination", async () => {
	const g = await mount();
	vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "old.txt" });
	await click(g, "save");
	vi.mocked(choosePlaygroundFile).mockResolvedValue({
		name: "loaded.txt",
		text: async () => "point B = (3, 4)",
	} as File);
	await click(g, "load");
	expect(g.value).toBe("point B = (3, 4)");
	g.undo();
	expect(g.value).toBe("point A = (0, 0)");
	g.redo();
	await click(g, "save");
	expect(chooseSaveTarget).toHaveBeenLastCalledWith(
		expect.objectContaining({ suggestedName: "loaded.txt" }),
	);
	vi.mocked(choosePlaygroundFile).mockResolvedValue({
		name: "bad.txt",
		text: async () => "invalid",
	} as File);
	await click(g, "load");
	expect(g.value).toBe("point B = (3, 4)");
	expect(g.querySelector("[data-status]")?.textContent).toContain(
		"Unable to load",
	);
	vi.mocked(choosePlaygroundFile).mockResolvedValue(null);
	await click(g, "load");
	expect(g.value).toBe("point B = (3, 4)");
});
it("keeps save available in readonly and reports write failures", async () => {
	const g = await mount();
	g.setAttribute("readonly", "");
	await Promise.resolve();
	expect(
		g.querySelector('[data-source-file="load"]')?.hasAttribute("disabled"),
	).toBe(true);
	vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "test.txt" });
	vi.mocked(saveBlob).mockRejectedValue(new Error("Disk full"));
	await click(g, "save");
	expect(g.querySelector("[data-status]")?.textContent).toContain("Disk full");
	expect(g.value).toBe("point A = (0, 0)");
});
