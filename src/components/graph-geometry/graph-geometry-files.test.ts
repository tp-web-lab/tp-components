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
		expect.objectContaining({ suggestedName: "construction.txt" }),
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

it("offers file actions in a keyboard-accessible menu and source controls in one row", async () => {
	const g = await mount();
	const editor = g.querySelector<TpCodeEditor>("tp-code-editor");
	if (!editor) throw Error("Missing editor");
	expect(g.querySelector(".tp-geometry-source tp-button-group")).toBeNull();
	expect(
		g.querySelector(".tp-geometry-source tp-button[data-action=apply]"),
	).toBeNull();
	g.querySelector<HTMLElement>('[data-action="source-toolbar"]')?.click();
	expect(editor.toolbar).toBe(true);
	g.querySelector<HTMLElement>('[data-action="source-toolbar"]')?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "F1", bubbles: true }),
	);
	expect(editor.toolbar).toBe(false);
	editor.setValue("point B = (2, 3)");
	g.querySelector<HTMLElement>('[data-action="source-reset"]')?.click();
	expect(editor.getValue()).toBe(g.value);
	const source = "<!-- my notes -->\npoint B = (2, 3)";
	editor.setValue(source);
	g.querySelector<HTMLElement>('[data-action="apply"]')?.click();
	expect([...g.analyze().values.keys()]).toEqual(["B"]);
	expect(editor.getValue()).toBe(source);
	vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "keyboard.txt" });
	g.querySelector('[data-source-file="save"]')?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledTimes(1));
});

it("suggests a slugified label, saves metadata, and restores it with undo", async () => {
	const g = await mount();
	g.label = "Médiatrice de AB !";
	vi.mocked(chooseSaveTarget).mockResolvedValue({
		filename: "mediatrice-de-ab.txt",
	});
	await click(g, "save");
	expect(chooseSaveTarget).toHaveBeenLastCalledWith(
		expect.objectContaining({ suggestedName: "mediatrice-de-ab.txt" }),
	);
	const blob = vi.mocked(saveBlob).mock.calls[0]?.[0];
	if (!blob) throw Error("Missing file");
	const reader = new FileReader();
	const content = new Promise((resolve) => {
		reader.onload = () => resolve(reader.result);
	});
	reader.readAsText(blob);
	expect(await content).toContain('label = "Médiatrice de AB !"');
	g.value = 'title = "Triangle rectangle"\npoint B = (2, 3)';
	expect(g.label).toBe("Triangle rectangle");
	await click(g, "save-as");
	expect(chooseSaveTarget).toHaveBeenLastCalledWith(
		expect.objectContaining({ suggestedName: "triangle-rectangle.txt" }),
	);
	g.undo();
	expect(g.label).toBe("Médiatrice de AB !");
	expect(g.value).toContain("point A");
	g.value = 'label = ""\npoint A = (0, 0)';
	await click(g, "save-as");
	expect(chooseSaveTarget).toHaveBeenLastCalledWith(
		expect.objectContaining({ suggestedName: "construction.txt" }),
	);
	const before = g.value;
	expect(() => {
		g.value = 'label = "Invalid"\nunknown';
	}).toThrow();
	expect(g.value).toBe(before);
});
it("uses a draft title for Save as without applying it", async () => {
	const g = await mount();
	g.querySelector<TpCodeEditor>("tp-code-editor")?.setValue(
		'title = "Étoile à 5 branches"\npoint A = (0, 0)',
	);
	vi.mocked(chooseSaveTarget).mockResolvedValue(null);
	await click(g, "save-as");
	expect(chooseSaveTarget).toHaveBeenCalledWith(
		expect.objectContaining({ suggestedName: "etoile-a-5-branches.txt" }),
	);
	expect(g.label).toBe("");
});
