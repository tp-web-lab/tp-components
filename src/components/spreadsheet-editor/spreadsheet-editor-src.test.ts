import { afterEach, describe, expect, it, vi } from "vitest";
import * as XLSX from "xlsx";
import "./spreadsheet-editor.js";

// jsdom's File lacks the modern Blob readers used by browser imports.
function mockReaders(): void {
	vi.spyOn(File.prototype, "text").mockImplementation(function (this: File) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			reader.onerror = reject;
			reader.readAsText(this);
		});
	});
	vi.spyOn(File.prototype, "arrayBuffer").mockImplementation(function (
		this: File,
	) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as ArrayBuffer);
			reader.onerror = reject;
			reader.readAsArrayBuffer(this);
		});
	});
}
function response(contents: string | ArrayBuffer) {
	return {
		ok: true,
		arrayBuffer: async () =>
			typeof contents === "string"
				? new TextEncoder().encode(contents).buffer
				: contents,
	};
}
function editorWithSource(src: string) {
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 1;
	editor.columns = 1;
	editor.value = '[["fallback"]]';
	editor.src = src;
	document.body.append(editor);
	return editor;
}
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
describe("spreadsheet src", () => {
	it.each([
		["csv", "2,3,=SUM(A1:B1)"],
		["json", '{"data":[[2,3,"=SUM(A1:B1)"]]}'],
	])(
		"loads %s and evaluates imported formulas",
		async (extension, contents) => {
			mockReaders();
			const fetcher = vi.fn().mockResolvedValue(response(contents));
			vi.stubGlobal("fetch", fetcher);
			const editor = editorWithSource(`data/sheet.${extension}?v=1#sheet`);
			const imported = vi.fn();
			editor.addEventListener("tp-spreadsheet-editor-import", imported);
			await vi.waitFor(() =>
				expect(editor.getData()).toEqual([["2", "3", "=SUM(A1:B1)"]]),
			);
			expect(
				editor.querySelector<HTMLInputElement>('[data-cell="C1"]')?.value,
			).toBe("5");
			expect(imported).toHaveBeenCalledOnce();
			expect(fetcher).toHaveBeenCalledWith(
				new URL(editor.src, document.baseURI).href,
				expect.objectContaining({ signal: expect.any(AbortSignal) }),
			);
		},
	);
	it("loads the first XLSX sheet and preserves formulas", async () => {
		mockReaders();
		const sheet = XLSX.utils.aoa_to_sheet([[2, 3, 0]]);
		sheet.C1 = { t: "n", f: "SUM(A1:B1)", v: 5 };
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, sheet, "First");
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(
					response(XLSX.write(workbook, { type: "array", bookType: "xlsx" })),
				),
		);
		const editor = editorWithSource("sheet.xlsx");
		await vi.waitFor(() =>
			expect(editor.getData()).toEqual([["2", "3", "=SUM(A1:B1)"]]),
		);
	});
	it("ignores obsolete requests and cancels when src is removed", async () => {
		mockReaders();
		let finish: ((value: ReturnType<typeof response>) => void) | undefined;
		const fetcher = vi
			.fn()
			.mockImplementationOnce(
				() =>
					new Promise((resolve) => {
						finish = resolve;
					}),
			)
			.mockResolvedValue(response('[["new"]]'));
		vi.stubGlobal("fetch", fetcher);
		const editor = editorWithSource("old.json");
		editor.src = "new.json";
		await vi.waitFor(() => expect(editor.getData()).toEqual([["new"]]));
		finish?.(response('[["old"]]'));
		expect(fetcher.mock.calls[0]?.[1].signal.aborted).toBe(true);
		editor.removeAttribute("src");
		expect(fetcher.mock.calls[1]?.[1].signal.aborted).toBe(true);
		expect(editor.getData()).toEqual([["new"]]);
	});
	it.each([response("invalid json"), { ok: false, status: 404 }])(
		"preserves data and reports loading errors",
		async (result) => {
			mockReaders();
			vi.stubGlobal("fetch", vi.fn().mockResolvedValue(result));
			const editor = editorWithSource("bad.json");
			const failed = vi.fn();
			editor.addEventListener("tp-spreadsheet-editor-error", failed);
			await vi.waitFor(() => expect(failed).toHaveBeenCalledOnce());
			expect(editor.getData()).toEqual([["fallback"]]);
		},
	);
});
