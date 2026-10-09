import { afterEach, describe, expect, it } from "vitest";
import "./spreadsheet-editor.js";

function setup() {
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 2;
	editor.columns = 3;
	editor.value = JSON.stringify([
		["1", "2", "=SUM(A1:B1)"],
		["4", "5", "6"],
	]);
	document.body.append(editor);
	return editor;
}
function point(editor: HTMLElement, cell: string, shiftKey = false) {
	editor
		.querySelector(`[data-cell="${cell}"]`)
		?.dispatchEvent(
			new MouseEvent("pointerdown", { bubbles: true, button: 0, shiftKey }),
		);
}
function key(editor: HTMLElement, value: string, shiftKey = false) {
	const event = new KeyboardEvent("keydown", {
		key: value,
		shiftKey,
		bubbles: true,
		cancelable: true,
	});
	editor.querySelector('[data-cell="A1"]')?.dispatchEvent(event);
	return event;
}
afterEach(() => document.body.replaceChildren());
describe("spreadsheet range selection", () => {
	it("clears a rectangle, recalculates formulas and undoes in one step", () => {
		const editor = setup();
		point(editor, "A1");
		point(editor, "B2", true);
		expect(editor.querySelectorAll("[data-cell][data-selected]")).toHaveLength(
			4,
		);
		expect(key(editor, "Delete").defaultPrevented).toBe(true);
		expect(editor.getData()).toEqual([
			["", "", "=SUM(A1:B1)"],
			["", "", "6"],
		]);
		expect(
			editor.querySelector<HTMLInputElement>('[data-cell="C1"]')?.value,
		).toBe("0");
		editor.querySelector<HTMLElement>('[data-command="undo"]')?.click();
		expect(editor.getData()).toEqual([
			["1", "2", "=SUM(A1:B1)"],
			["4", "5", "6"],
		]);
		editor.querySelector<HTMLElement>('[data-command="redo"]')?.click();
		expect(editor.getData()[1]).toEqual(["", "", "6"]);
	});
	it("supports reverse ranges and the clear button", () => {
		const editor = setup();
		point(editor, "B2");
		point(editor, "A1", true);
		editor.querySelector<HTMLElement>('[data-command="clear-cells"]')?.click();
		expect(editor.getData()[0]).toEqual(["", "", "=SUM(A1:B1)"]);
	});
	it("extends and shrinks by keyboard, resets on click, and preserves single-cell editing", () => {
		const editor = setup();
		key(editor, "ArrowRight", true);
		key(editor, "ArrowDown", true);
		expect(editor.querySelectorAll("[data-cell][data-selected]")).toHaveLength(
			4,
		);
		key(editor, "ArrowLeft", true);
		expect(editor.querySelectorAll("[data-cell][data-selected]")).toHaveLength(
			2,
		);
		point(editor, "A1");
		expect(editor.querySelectorAll("[data-cell][data-selected]")).toHaveLength(
			1,
		);
		expect(key(editor, "Backspace").defaultPrevented).toBe(false);
	});
});
