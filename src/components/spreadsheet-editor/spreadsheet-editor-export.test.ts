import { afterEach, expect, it, vi } from "vitest";
import * as XLSX from "xlsx";
import "./spreadsheet-editor.js";

vi.mock("xlsx", async (original) => ({
	...(await original<typeof import("xlsx")>()),
	writeFileXLSX: vi.fn(),
}));
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
function setup() {
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 1;
	editor.columns = 4;
	editor.value = '[["2","=A1*3","=TRUE","=B1+1"]]';
	document.body.append(editor);
	return editor;
}
it("exports either formulas or typed calculated XLSX values without modifying the sheet", () => {
	const editor = setup();
	editor.exportFile("xlsx", "results", "values");
	const workbook = vi.mocked(XLSX.writeFileXLSX).mock.calls.at(-1)?.[0];
	expect(workbook?.Sheets.Sheet1?.B1).toEqual({ t: "n", v: 6 });
	expect(workbook?.Sheets.Sheet1?.C1).toEqual({ t: "b", v: true });
	expect(workbook?.Sheets.Sheet1?.D1).toEqual({ t: "n", v: 7 });
	editor.exportFile("xlsx");
	const formulas = vi.mocked(XLSX.writeFileXLSX).mock.calls.at(-1)?.[0];
	expect(formulas?.Sheets.Sheet1?.B1?.f).toBe("A1*3");
	expect(editor.getData()[0]?.[1]).toBe("=A1*3");
});
it.each(["csv", "json"] as const)(
	"exports calculated %s data from its menu action",
	async (format) => {
		const editor = setup();
		let exported: Blob | undefined;
		vi.stubGlobal(
			"URL",
			Object.assign(URL, {
				createObjectURL: vi.fn((blob: Blob) => {
					exported = blob;
					return "blob:test";
				}),
				revokeObjectURL: vi.fn(),
			}),
		);
		vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
		const item = editor.querySelector(
			`[data-file-action="${format}"][data-export-mode="values"]`,
		);
		item?.dispatchEvent(
			new CustomEvent("tp-menu-item-select", {
				bubbles: true,
				detail: { item },
			}),
		);
		expect(exported).toBeDefined();
		const text = await new Promise<string>((resolve) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			if (exported) reader.readAsText(exported);
		});
		if (format === "json") expect(JSON.parse(text)).toEqual([[2, 6, true, 7]]);
		else expect(text).toBe("2,6,true,7");
	},
);
