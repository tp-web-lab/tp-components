import { afterEach, expect, it, vi } from "vitest";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { choosePlaygroundFile } from "../playground/playground-local-file.js";
import { TpXYPlot } from "./xy-plot.js";

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
	vi.unstubAllGlobals();
});
const original =
	'xyFunctionGraph\n title "Original"\n functions [["f", "x*x"]]';
async function mount() {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const plot = new TpXYPlot();
	plot.settings = true;

	plot.textContent = original;
	document.body.append(plot);
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-preview svg")).not.toBeNull(),
	);
	plot.querySelector<HTMLElement>(".tp-xy-plot-settings-button")?.click();
	await vi.waitFor(() =>
		expect(plot.querySelector(".tp-xy-plot-settings-source")).not.toBeNull(),
	);
	const editor = plot.querySelector<TpCodeEditor>(
		".tp-xy-plot-settings-source",
	);
	if (!editor) throw Error("Missing editor");
	return { plot, editor };
}
it("updates labels without replacing the SVG or the source draft", async () => {
	const { plot, editor } = await mount();
	const svg = plot.querySelector(".tp-xy-plot-preview svg");
	editor.setValue(`${original}\n# draft`);
	plot.label = "<img src=x> Label";
	expect(
		[...plot.querySelectorAll("[data-xy-label]")].map((e) => e.textContent),
	).toEqual([plot.label, plot.label]);
	expect(plot.querySelector("[data-xy-label] img")).toBeNull();
	expect(plot.querySelector(".tp-xy-plot-preview svg")).toBe(svg);
	expect(editor.getValue()).toContain("# draft");
	plot.removeAttribute("label");
	expect(plot.querySelector("[data-xy-label]")?.textContent).toBe("Original");
});
it("edits definition inside details, toggles F1, applies atomically and resets drafts", async () => {
	const { plot, editor } = await mount();
	expect(editor.closest("details")?.querySelector("summary")?.textContent).toBe(
		"Graph definition",
	);
	expect(editor.hasAttribute("readonly")).toBe(false);
	plot.querySelector<HTMLElement>('[data-source-action="toolbar"]')?.click();
	expect(editor.toolbar).toBe(true);
	const replacement =
		'xyFunctionGraph\n title "Changed"\n functions [["f", "x"]]';
	editor.setValue(replacement);
	plot.querySelector<HTMLElement>('[data-source-action="play"]')?.click();
	expect(
		plot.querySelector(".tp-xy-plot-toolbar [data-xy-label]")?.textContent,
	).toBe("Changed");
	expect(
		plot.querySelector<HTMLElement & { value: string }>(
			'[data-directive="title"]',
		)?.value,
	).toBe("Changed");
	const svg = plot.querySelector(".tp-xy-plot-preview")?.innerHTML;
	editor.setValue("invalid definition");
	plot.querySelector<HTMLElement>('[data-source-action="play"]')?.click();
	expect(plot.querySelector(".tp-xy-plot-preview")?.innerHTML).toBe(svg);
	plot.querySelector<HTMLElement>('[data-source-action="reset"]')?.click();
	expect(editor.getValue()).toBe(replacement);
});
it("saves drafts with a label filename, reuses the target, and loads validated files", async () => {
	const { plot, editor } = await mount();
	plot.label = "Courbe étudiée";
	const item = (action: string) =>
		plot.querySelector<HTMLElement>(`[data-source-file="${action}"]`);
	async function fileAction(action: string) {
		item(action)?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
		);
		await vi.waitFor(() =>
			expect(item(action)?.getAttribute("aria-disabled")).toBe("false"),
		);
	}
	vi.mocked(chooseSaveTarget).mockResolvedValue({
		filename: "courbe-etudiee.txt",
	});
	editor.setValue(`${original}\n`);
	await fileAction("save");
	expect(chooseSaveTarget).toHaveBeenLastCalledWith(
		expect.objectContaining({
			suggestedName: "courbe-etudiee.txt",
			extension: ".txt",
		}),
	);
	await fileAction("save");
	expect(chooseSaveTarget).toHaveBeenCalledTimes(1);
	expect(saveBlob).toHaveBeenCalledTimes(2);
	vi.mocked(chooseSaveTarget).mockResolvedValue(null);
	await fileAction("save-as");
	expect(saveBlob).toHaveBeenCalledTimes(2);
	plot.removeAttribute("label");
	vi.mocked(choosePlaygroundFile).mockResolvedValue({
		name: "loaded.txt",
		text: async () => original.replace("Original", "Loaded"),
	} as File);
	await fileAction("load");
	expect(
		plot.querySelector(".tp-xy-plot-toolbar [data-xy-label]")?.textContent,
	).toBe("Loaded");
	vi.mocked(choosePlaygroundFile).mockResolvedValue({
		name: "bad.txt",
		text: async () => "invalid",
	} as File);
	await fileAction("load");
	expect(
		plot.querySelector(".tp-xy-plot-toolbar [data-xy-label]")?.textContent,
	).toBe("Loaded");
});

it("always exposes definition without settings, preserves drafts when settings change and shows titles only in toolbars", async () => {
	const { plot, editor } = await mount();
	plot.settings = false;
	const details = plot.querySelector(".tp-xy-plot-definition");
	expect(details).not.toBeNull();
	expect(details?.closest("[hidden]")).toBeNull();
	expect(plot.querySelector(".tp-xy-plot-settings-button")).toBeNull();
	editor.setValue("draft");
	plot.settings = true;
	expect(plot.querySelector(".tp-xy-plot-settings-source")).toBe(editor);
	expect(editor.getValue()).toBe("draft");
	expect(
		[...plot.querySelectorAll("svg text")].some(
			(e) => e.textContent === "Original",
		),
	).toBe(false);
	expect(plot.querySelector("[data-xy-label]")?.textContent).toBe("Original");
});

it("keeps export and theme before zoom and exports only the visible graph", async () => {
	const { plot } = await mount();
	const toolbar = plot.querySelector(".tp-xy-plot-toolbar");
	const zoom = toolbar?.querySelector(".tp-xy-plot-zoom-button");
	expect(zoom?.previousElementSibling?.tagName).toBe("TP-THEME");
	expect(zoom?.previousElementSibling?.previousElementSibling?.tagName).toBe(
		"TP-SAVE-IMAGE",
	);
	for (const control of plot.querySelectorAll(
		".tp-xy-plot-toolbar > tp-save-image, .tp-xy-plot-toolbar > tp-theme, .tp-xy-plot-dialog-header > tp-save-image, .tp-xy-plot-dialog-header > tp-theme",
	)) {
		expect(
			document.querySelector(control.getAttribute("anchor") ?? "missing"),
		).toBe(plot);
	}
	const exported = new DOMParser().parseFromString(
		plot.exportSvg(),
		"image/svg+xml",
	);
	expect(exported.querySelector("parsererror")).toBeNull();
	expect(exported.querySelector("svg")?.getAttribute("viewBox")).toBe(
		plot.querySelector(".tp-xy-plot-preview svg")?.getAttribute("viewBox"),
	);
	expect(exported.querySelector("tp-icon-button")).toBeNull();
	expect(exported.querySelector("path")).not.toBeNull();
});
it("moves the same source editor into zoom and restores it with its draft on toggle and close", async () => {
	const { plot, editor } = await mount();
	const dialog = plot.querySelector<HTMLDialogElement>(".tp-xy-plot-dialog");
	const details = editor.closest("details");
	const home = details?.parentElement;
	if (!dialog || !details) throw Error("Missing zoom/source");
	dialog.setAttribute("open", "");
	const toggle = dialog.querySelector<HTMLElement>("[data-xy-source-toggle]");
	editor.setValue("draft preserved");
	toggle?.click();
	await vi.waitFor(() => expect(dialog.contains(editor)).toBe(true));
	expect(dialog.hasAttribute("data-source-open")).toBe(true);
	expect(editor.getValue()).toBe("draft preserved");
	toggle?.click();
	expect(details.parentElement).toBe(home);
	expect(dialog.hasAttribute("data-source-open")).toBe(false);
	expect(editor.getValue()).toBe("draft preserved");
	toggle?.click();
	await vi.waitFor(() => expect(dialog.contains(editor)).toBe(true));
	dialog.removeAttribute("open");
	dialog.dispatchEvent(new Event("close"));
	expect(details.parentElement).toBe(home);
	expect(editor.getValue()).toBe("draft preserved");
});

it("toggles source in the normal view and navigates applied definitions with undo and redo", async () => {
	const { plot, editor } = await mount();
	const footer = plot.querySelector(".tp-xy-plot-footer");
	expect(
		[...(footer?.querySelectorAll("tp-icon-button") ?? [])].map((b) =>
			b.getAttribute("label"),
		),
	).toEqual(["Show graph definition", "Undo", "Redo", "Zoom out", "Zoom in"]);
	const toggle = footer?.querySelector<HTMLElement>("[data-xy-source-toggle]");
	editor.setValue("draft");
	toggle?.click();
	await vi.waitFor(() =>
		expect(plot.hasAttribute("data-source-open")).toBe(true),
	);
	toggle?.click();
	await vi.waitFor(() =>
		expect(plot.hasAttribute("data-source-open")).toBe(false),
	);
	expect(editor.getValue()).toBe("draft");
	const initial = plot.querySelector(".tp-xy-plot-preview")?.innerHTML;
	const original = plot.querySelector("[data-xy-label]")?.textContent;
	const undo = footer?.querySelector<HTMLElement>('[data-xy-history="undo"]');
	const redo = footer?.querySelector<HTMLElement>('[data-xy-history="redo"]');
	expect(undo?.hasAttribute("disabled")).toBe(true);
	editor.setValue(
		'xyFunctionGraph\n title "Changed"\n functions [["f", "x*x"]]',
	);
	plot.querySelector<HTMLElement>('[data-source-action="play"]')?.click();
	expect(plot.querySelector("[data-xy-label]")?.textContent).toBe("Changed");
	undo?.click();
	expect(plot.querySelector("[data-xy-label]")?.textContent).toBe(original);
	expect(plot.querySelector(".tp-xy-plot-preview")?.innerHTML).toBe(initial);
	expect(editor.getValue()).toContain('"Original"');
	redo?.click();
	expect(editor.getValue()).toContain('"Changed"');
	undo?.click();
	editor.setValue('xyFunctionGraph\n title "Branch"\n functions [["f", "x"]]');
	plot.querySelector<HTMLElement>('[data-source-action="play"]')?.click();
	expect(redo?.hasAttribute("disabled")).toBe(true);
	expect(plot.querySelector("[data-xy-label]")?.textContent).toBe("Branch");
});
