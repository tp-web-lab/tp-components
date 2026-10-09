import { afterEach, expect, it, vi } from "vitest";
import { translateSpreadsheetFormula } from "./spreadsheet-editor.js";
import "./spreadsheet-editor.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
it("translates mixed references and ranges without altering strings, functions or exponents", () => {
	expect(
		translateSpreadsheetFormula(
			'=SUM(A1:$B$2)+$C3+D$4+LOG10(A1)+1E10+"A1"',
			2,
			1,
		),
	).toBe('=SUM(B3:$B$2)+$C5+E$4+LOG10(B3)+1E10+"A1"');
	expect(translateSpreadsheetFormula('="He said ""A1"""&A1', 1, 1)).toBe(
		'="He said ""A1"""&B2',
	);
	expect(translateSpreadsheetFormula("=A1+$A$1", -1, -1)).toBe("=#REF!+$A$1");
});
it("shifts a copied cell on every paste, keeps cut formulas unchanged and supports undo", async () => {
	let text = "";
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: {
			writeText: vi.fn(async (value: string) => {
				text = value;
			}),
			readText: vi.fn(async () => text),
		},
	});
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 3;
	editor.columns = 3;
	editor.value = '[["=$B$1+B$1+$B1+B1","2"]]';
	document.body.append(editor);
	const focus = (cell: string) =>
		editor.querySelector<HTMLInputElement>(`[data-cell="${cell}"]`)?.focus();
	const command = async (name: string) => {
		editor.querySelector<HTMLElement>(`[data-command="${name}"]`)?.click();
		await Promise.resolve();
		await Promise.resolve();
	};
	focus("A1");
	await command("copy");
	focus("B2");
	await command("paste");
	expect(editor.getData()[1]?.[1]).toBe("=$B$1+C$1+$B2+C2");
	focus("C3");
	await command("paste");
	expect(editor.getData()[2]?.[2]).toBe("=$B$1+D$1+$B3+D3");
	await command("undo");
	expect(editor.getData()[2]?.[2]).toBe("");
	focus("B2");
	await command("cut");
	focus("C3");
	await command("paste");
	expect(editor.getData()[2]?.[2]).toBe("=$B$1+C$1+$B2+C2");
	text = "=A1+99";
	focus("A2");
	await command("paste");
	expect(editor.getData()[1]?.[0]).toBe("=A1+99");
});
