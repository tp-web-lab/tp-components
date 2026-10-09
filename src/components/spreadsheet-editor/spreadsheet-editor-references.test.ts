import { afterEach, expect, it } from "vitest";
import { cellCoordinates } from "./spreadsheet-editor.js";
import "./spreadsheet-editor.js";

afterEach(() => document.body.replaceChildren());
it.each(["B2", "$B$2", "$B2", "B$2", "$b$2"])("resolves %s", (reference) => {
	expect(cellCoordinates(reference)).toEqual([1, 1]);
});
it.each(["$$B2", "B$$2", "$B$0", "B2$", "$2"])(
	"rejects malformed reference %s",
	(reference) => {
		expect(cellCoordinates(reference)).toBeNull();
	},
);
it("evaluates absolute and mixed references and ranges while retaining formulas", () => {
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 2;
	editor.columns = 3;
	editor.value = JSON.stringify([
		["2", "3", "=$A$1+$B1+A$2"],
		["4", "5", "=SUM($A$1:B$2)"],
	]);
	document.body.append(editor);
	expect(
		editor.querySelector<HTMLInputElement>('[data-cell="C1"]')?.value,
	).toBe("9");
	expect(
		editor.querySelector<HTMLInputElement>('[data-cell="C2"]')?.value,
	).toBe("14");
	expect(editor.getData()[0]?.[2]).toBe("=$A$1+$B1+A$2");
});
it("detects cycles across absolute and relative aliases", () => {
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 1;
	editor.columns = 2;
	editor.value = '[["=$B$1","=A$1"]]';
	document.body.append(editor);
	expect(
		editor.querySelector<HTMLInputElement>('[data-cell="A1"]')?.value,
	).toBe("#CYCLE!");
	expect(
		editor.querySelector<HTMLInputElement>('[data-cell="B1"]')?.value,
	).toBe("#CYCLE!");
});
