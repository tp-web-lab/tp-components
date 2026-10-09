import { afterEach, expect, it } from "vitest";
import "./spreadsheet-editor.js";

afterEach(() => document.body.replaceChildren());
it("resizes one column, preserves widths on edits and resets on double click", () => {
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 1;
	editor.columns = 2;
	document.body.append(editor);
	const handle = editor.querySelector<HTMLElement>('[data-column-resize="0"]');
	handle?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
	expect(editor.querySelectorAll("col")[1]?.style.width).toBe("120px");
	expect(editor.querySelectorAll("col")[2]?.style.width).toBe("112px");
	editor.value = '[["Updated"]]';
	expect(editor.querySelectorAll("col")[1]?.style.width).toBe("120px");
	const current = editor.querySelector<HTMLElement>('[data-column-resize="0"]');
	for (let i = 0; i < 30; i++)
		current?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
	expect(current?.getAttribute("aria-valuenow")).toBe("48");
	current?.dispatchEvent(new MouseEvent("dblclick"));
	expect(editor.querySelectorAll("col")[1]?.style.width).toBe("112px");
});

it("allows columns wider than the previous 1200 pixel limit", () => {
	const editor = document.createElement("tp-spreadsheet-editor");
	editor.rows = 1;
	editor.columns = 1;
	document.body.append(editor);
	const handle = editor.querySelector<HTMLElement>('[data-column-resize="0"]');
	for (let i = 0; i < 200; i++)
		handle?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
	expect(editor.querySelectorAll("col")[1]?.style.width).toBe("1712px");
	expect(editor.querySelector("table")?.style.width).toBe("1760px");
});
