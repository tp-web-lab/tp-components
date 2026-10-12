import { afterEach, describe, expect, it, vi } from "vitest";
import { saveBlob } from "../../utilities/save-file.js";
import { TP_COLOR_PRESETS } from "../color/color-presets.js";
import type { TpSaveImage } from "../save-image/save-image.js";
import { parseGeometry, serializeGeometry } from "./geometry.js";
import { TpGraphGeometry } from "./graph-geometry.js";

vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(
		async ({ suggestedName }: { suggestedName: string }) => ({
			filename: suggestedName,
		}),
	),
	saveBlob: vi.fn(async () => undefined),
}));
const source =
	"point A = (0, 0)\npoint B = (3, 4)\nsegment s = segment(A, B)\npoint M = midpoint(s)";
function mount(): TpGraphGeometry {
	const editor = new TpGraphGeometry();
	editor.value = source;
	document.body.append(editor);
	return editor;
}
function click(editor: TpGraphGeometry, selector: string): void {
	const control = editor.querySelector<HTMLElement>(selector);
	if (!control) throw new Error(selector);
	control.click();
}
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.clearAllMocks();
});
describe("geometry appearance and export", () => {
	it("round-trips all palette colors, dashed/dotted/hidden styles and legacy hidden", () => {
		for (const preset of TP_COLOR_PRESETS) {
			const objects = parseGeometry(
				`${source}\ncircle c = circle(A, 2) style=dashed color=${preset.slice(3)}\nline d = line(A, B) style=hidden\ncomment n = comment(A, "style=dotted # color=blue") color=red`,
			);
			expect(parseGeometry(serializeGeometry(objects))).toEqual(objects);
			expect(objects[4]).toMatchObject({
				stroke: "dashed",
				color: preset.slice(3),
			});
			expect(objects[5]?.hidden).toBe(true);
		}
		expect(
			serializeGeometry(parseGeometry("point A = (0, 0) style=solid")),
		).toBe("point A = (0, 0)");
	});
	it.each([
		"style=wavy",
		"color=notacolor",
		"color=red color=blue",
		"style=dashed style=dotted",
		'color="<script>"',
	])("rejects invalid appearance %s", (suffix) => {
		expect(() =>
			parseGeometry(`${source}\nline d = line(A, B) ${suffix}`),
		).toThrow();
	});
	it("changes the selected object, hides without deleting dependencies, restores and undoes", () => {
		const editor = mount();
		click(editor, '[data-object="s"]');
		click(editor, '[data-stroke="dashed"]');
		click(editor, '[data-color="blue"]');
		expect(editor.value).toContain("segment(A, B) style=dashed color=blue");
		expect(
			editor.querySelector('[data-id="s"]')?.classList.contains("tp-blue"),
		).toBe(true);
		click(editor, '[data-stroke="hidden"]');
		expect(editor.querySelector('[data-id="s"]')).toBeNull();
		expect(editor.analyze().values.get("M")).toMatchObject({
			kind: "point",
			point: { x: 1.5, y: 2 },
		});
		expect(editor.querySelector('[data-object="s"]')).not.toBeNull();
		click(editor, '[data-stroke="solid"]');
		expect(editor.querySelector('[data-id="s"]')).not.toBeNull();
		expect(editor.value).toContain("segment(A, B) color=blue");
		editor.undo();
		expect(editor.querySelector('[data-id="s"]')).toBeNull();
		editor.redo();
		expect(editor.querySelector('[data-id="s"]')).not.toBeNull();
	});
	it("supports menu keyboard actions and resets color to automatic", () => {
		const editor = mount();
		click(editor, '[data-object="s"]');
		editor
			.querySelector('[data-stroke="dotted"]')
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
			);
		expect(editor.value).toContain("style=dotted");
		editor
			.querySelector('[data-color="red"]')
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: " ", bubbles: true }),
			);
		expect(editor.value).toContain("color=red");
		click(editor, '[data-color=""]');
		expect(editor.value).not.toContain("color=");
	});
	it("keeps editing disabled in readonly while offering image export", () => {
		const editor = mount();
		editor.setAttribute("readonly", "");
		click(editor, '[data-object="s"]');
		const before = editor.value;
		click(editor, '[data-stroke="hidden"]');
		expect(editor.value).toBe(before);
		expect(
			editor
				.querySelector('[data-action="style-menu"]')
				?.hasAttribute("disabled"),
		).toBe(true);
		expect(
			editor.querySelector("tp-save-image")?.hasAttribute("disabled"),
		).toBe(false);
	});
	it("exports a standalone view without selection, hit areas, controls or hidden objects", () => {
		const editor = mount();
		editor.grid = true;
		editor.value +=
			'\ncircle c = circle(A, 2) hidden\ncomment note = comment(B, "<safe> & text")';
		click(editor, '[data-object="s"]');
		const before = editor.value;
		const svg = editor.exportSvg();
		const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
		expect(doc.querySelector("parsererror")).toBeNull();
		expect(doc.documentElement.getAttribute("viewBox")).toBe("0 0 900 560");
		expect(doc.documentElement.getAttribute("width")).toBe("900");
		expect(doc.querySelectorAll("circle")).toHaveLength(3); // A, B and M only
		expect(svg).not.toMatch(
			/is-selected|point-hit|shape-hit|data-id|tp-button|visibility: hidden/,
		);
		expect(doc.querySelector("text")?.textContent).toBe("A");
		expect(doc.documentElement.textContent).toContain("<safe> & text");
		expect(editor.value).toBe(before);
		expect(editor.querySelectorAll("svg[data-geometry-canvas]")).toHaveLength(
			1,
		);
		expect(
			editor.querySelector('[data-id="s"]')?.classList.contains("is-selected"),
		).toBe(true);
	});
	it("anchors each save dropdown to its own construction and exports SVG by default first", async () => {
		const first = mount(),
			second = mount();
		second.value = "point X = (1, 1)";
		const controls = [first, second].map((editor) =>
			editor.querySelector<TpSaveImage>("tp-save-image"),
		);
		expect(controls[0]?.anchor).not.toBe(controls[1]?.anchor);
		expect(
			first
				.querySelector("tp-save-image tp-dropdown [data-format]")
				?.getAttribute("data-format"),
		).toBe("svg");
		const exported = vi.spyOn(second, "exportSvg");
		await controls[1]?.save("svg");
		expect(exported).toHaveBeenCalledOnce();
		expect(saveBlob).toHaveBeenCalledWith(
			expect.objectContaining({ type: "image/svg+xml" }),
			{ filename: "geometry.svg" },
		);
	});
});
