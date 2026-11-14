import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { required } from "../../test-helpers/required.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import type { TpScreen } from "../screen/screen.js";
import type { TpTabs } from "../tabs/tabs.js";
import { TpTableEditor } from "./table-editor.js";
import {
	serializeTable,
	type TableData,
	tableFormats,
} from "./table-markup.js";

function editor(): TpTableEditor {
	const element = new TpTableEditor();
	element.innerHTML =
		"<table><caption>Schedule</caption><thead><tr><th>Session</th><th>Room</th></tr></thead><tbody><tr><td>Practice</td><td>B2</td></tr></tbody></table>";
	document.body.append(element);
	return element;
}
beforeEach(() => {
	vi.spyOn(window, "prompt").mockImplementation(
		(_message, value) => value ?? "table",
	);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
describe("tp-table-editor", () => {
	it("opens the size picker in its own dropdown and closes it with the parent menu", () => {
		const element = editor();
		element.deleteTable();
		const menu = required(
			element.querySelector<TpDropdown>('[data-menu="structure"]'),
		);
		const picker = required(
			element.querySelector<TpDropdown>("[data-table-picker-overlay]"),
		);
		const item = required(
			element.querySelector<HTMLElement>("[data-table-picker]"),
		);
		menu.show();
		item.click();
		expect(picker.open).toBe(true);
		expect(menu.open).toBe(true);
		expect(item.getAttribute("aria-expanded")).toBe("true");
		menu.hide();
		expect(picker.open).toBe(false);
		expect(item.getAttribute("aria-expanded")).toBe("false");
		menu.show();
		item.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(picker.open).toBe(true);
		required(
			picker.querySelector<HTMLButtonElement>(
				'[data-table-rows="2"][data-table-columns="3"]',
			),
		).click();
		expect(element.rows).toBe(2);
		expect(element.columns).toBe(3);
		expect(menu.open).toBe(false);
		expect(picker.open).toBe(false);
	});

	it("toggles Heading with a checkbox and restores it with Undo", async () => {
		const element = editor();
		await Promise.resolve();
		const checkbox = required(
			element.querySelector<HTMLInputElement>("[data-heading] input"),
		);
		expect(checkbox.checked).toBe(true);
		checkbox.click();
		expect(element.noHeader).toBe(true);
		expect(element.querySelector(".tp-table-editor-surface th")).toBeNull();
		element.undo();
		expect(checkbox.checked).toBe(true);
		expect(element.noHeader).toBe(false);
		element.deleteTable();
		expect(checkbox.disabled).toBe(true);
		expect(checkbox.checked).toBe(false);
		element.undo();
		expect(checkbox.disabled).toBe(false);
		expect(checkbox.checked).toBe(true);
		const image = required(element.querySelector("tp-save-image"));
		expect(image.closest("tp-toolbar")).not.toBeNull();
		expect(
			image.parentElement?.previousElementSibling?.querySelector(
				'[data-trigger="type"]',
			),
		).not.toBeNull();
	});

	it("deletes and recreates the only table with undoable dimensions and settings", () => {
		const element = editor();
		const original = element.getData();
		const picker = required(element.querySelector("[data-table-picker]"));
		const menu = required(element.querySelector('[data-menu="structure"]'));
		const deletion = required(
			menu.querySelector('[data-choice="delete-table"]'),
		);
		expect(picker.getAttribute("aria-disabled")).toBe("true");
		expect(element.insertTable(4, 5)).toBe(false);
		menu.dispatchEvent(
			new CustomEvent("tp-menu-item-select", { detail: { item: deletion } }),
		);
		expect(element.rows).toBe(0);
		expect(element.columns).toBe(0);
		expect(element.querySelector(".tp-table-editor-surface table")).toBeNull();
		expect(picker.getAttribute("aria-disabled")).toBe("false");
		expect(deletion.getAttribute("aria-disabled")).toBe("true");
		for (const format of tableFormats)
			expect(element.getMarkup(format)).toBe("");
		expect(
			element.querySelector("[data-save-markup]")?.hasAttribute("disabled"),
		).toBe(true);
		element.addRow();
		element.addColumn();
		expect(element.getData().cells).toEqual([]);
		element.undo();
		expect(element.getData()).toEqual(original);
		element.redo();
		const cell = required(
			element.querySelector<HTMLButtonElement>(
				'[data-table-rows="2"][data-table-columns="4"]',
			),
		);
		cell.dispatchEvent(new Event("pointerover"));
		expect(element.querySelector("[data-table-picker-size]")?.textContent).toBe(
			"2 × 4",
		);
		expect(
			element.querySelectorAll("[data-table-grid-cell][data-selected]"),
		).toHaveLength(8);
		cell.click();
		expect(element.rows).toBe(2);
		expect(element.columns).toBe(4);
		expect(picker.getAttribute("aria-disabled")).toBe("true");
		expect(deletion.getAttribute("aria-disabled")).toBe("false");
		element.undo();
		expect(element.rows).toBe(0);
		element.redo();
		expect(element.columns).toBe(4);
		element.reset();
		expect(element.getData()).toEqual(original);
	});

	it("disables table creation and deletion in readonly mode", () => {
		const element = editor();
		element.deleteTable();
		element.readonly = true;
		expect(
			element
				.querySelector("[data-table-picker]")
				?.getAttribute("aria-disabled"),
		).toBe("true");
		expect(
			element.querySelector<HTMLButtonElement>("[data-table-grid-cell]")
				?.disabled,
		).toBe(true);
		element.querySelector<HTMLButtonElement>("[data-table-grid-cell]")?.click();
		expect(element.rows).toBe(0);
	});

	it("preserves math notation through structure changes and undo", () => {
		const element = editor();
		element.setData([["sqrt(x)"]]);
		element.setCellType(0, 0, "math");
		const field = required(element.querySelector("tp-mathfield"));
		field.mode = "asciimath";
		field.dispatchEvent(new Event("change", { bubbles: true }));
		expect(element.getMarkup("asciidoc")).toContain("asciimath:[sqrt(x)]");
		element.addRow("before");
		element.addColumn("before");
		expect(element.getData().cellMathModes?.[1]?.[1]).toBe("asciimath");
		element.undo();
		element.undo();
		element.undo();
		expect(element.querySelector("tp-mathfield")?.mode).toBe("latexmath");
		element.redo();
		expect(element.querySelector("tp-mathfield")?.mode).toBe("asciimath");
	});

	it("cancels Save as without downloading and uses the chosen filename", async () => {
		const element = editor();
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => {});
		vi.spyOn(window, "prompt").mockReturnValue(null);
		await element.download();
		await element.downloadSpreadsheet("xlsx");
		expect(click).not.toHaveBeenCalled();
		vi.mocked(window.prompt).mockReturnValue("schedule");
		vi.stubGlobal(
			"URL",
			Object.assign(class extends URL {}, {
				createObjectURL: vi.fn(() => "blob:table"),
				revokeObjectURL: vi.fn(),
			}),
		);
		let filename = "";
		click.mockImplementation(function (this: HTMLAnchorElement) {
			filename = this.download;
		});
		await element.download();
		expect(filename).toBe("schedule.md");
	});

	it("renders the latest export on demand and keeps edits made in Code", async () => {
		const element = editor();
		element.format = "html";
		const tabs = required(
			element.querySelector<TpTabs>(
				'[data-format-panel="html"] [data-markup-tabs]',
			),
		);
		const preview = required(
			element.querySelector('[data-format-panel="html"] [data-markup-preview]'),
		);
		expect(tabs.selected).toBe(0);
		expect(preview.children).toHaveLength(0);
		required(tabs.querySelectorAll<HTMLElement>('[role="tab"]')[1]).click();
		await vi.waitFor(() =>
			expect(preview.querySelector("td")?.textContent).toBe("Practice"),
		);
		required(tabs.querySelectorAll<HTMLElement>('[role="tab"]')[0]).click();
		element.setData([["Name"], ["Updated <text>"]]);
		required(tabs.querySelectorAll<HTMLElement>('[role="tab"]')[1]).click();
		await vi.waitFor(() =>
			expect(preview.querySelector("td")?.textContent).toBe("Updated <text>"),
		);
		element.setData([["Name"], ["Newest"]]);
		await vi.waitFor(() =>
			expect(preview.querySelector("td")?.textContent).toBe("Newest"),
		);
		const screen = required(
			element.querySelector<TpScreen>(
				'[data-format-panel="html"] tp-screen[data-table-screen]',
			),
		);
		expect(screen.disabled).toBe(false);
		expect(screen.srcdoc).toContain("Newest");
		expect(screen.srcdoc).not.toContain("<tp-table-editor");
		expect(screen.srcdoc).toContain("tp-loader");
		screen.show();
		expect(
			document
				.querySelector(".tp-screen-dialog iframe")
				?.getAttribute("srcdoc"),
		).toBe(screen.srcdoc);
		element.deleteTable();
		expect(screen.disabled).toBe(true);
	});

	it("initializes an empty authored table and ignores unchanged attributes", () => {
		const element = new TpTableEditor();
		element.innerHTML = "<table></table>";
		document.body.append(element);
		expect(element.rows).toBe(3);
		expect(element.columns).toBe(3);
		const onChange = vi.fn();
		element.addEventListener("tp-table-editor-change", onChange);
		element.rows = 3;
		expect(onChange).not.toHaveBeenCalled();
	});
	it("copies the selected export and downloads it with the matching extension", async () => {
		const element = editor();
		element.format = "asciidoc";
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		expect(await element.copy()).toBe(true);
		expect(writeText).toHaveBeenCalledWith(element.getMarkup());
		const createObjectURL = vi.fn().mockReturnValue("blob:table-test");
		const revokeObjectURL = vi.fn();
		vi.stubGlobal(
			"URL",
			Object.assign(class extends URL {}, { createObjectURL, revokeObjectURL }),
		);
		let filename = "";
		vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
			this: HTMLAnchorElement,
		) {
			filename = this.download;
		});
		vi.useFakeTimers();
		try {
			await element.download();
			expect(filename).toBe("table.adoc");
			expect(createObjectURL).toHaveBeenCalledOnce();
			vi.runAllTimers();
			expect(revokeObjectURL).toHaveBeenCalledWith("blob:table-test");
		} finally {
			vi.useRealTimers();
		}
	});

	it("imports a table and edits the focused cell without replacing its field", () => {
		const element = editor();
		const events = vi.fn();
		element.addEventListener("tp-table-editor-change", events);
		const input = required(
			element.querySelector<HTMLInputElement>(
				'[data-row="1"][data-column="0"] input',
			),
		);
		input.focus();
		input.value = "Review";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		expect(element.getData().cells).toEqual([
			["Session", "Room"],
			["Review", "B2"],
		]);
		expect(element.querySelector('[data-row="1"][data-column="0"] input')).toBe(
			input,
		);
		expect(events).toHaveBeenCalledOnce();
		expect(element.getMarkup()).toContain("Review");
		element.undo();
		expect(element.getData().cells[1]?.[0]).toBe("Practice");
		element.redo();
		expect(element.getData().cells[1]?.[0]).toBe("Review");
	});
	it("inserts after the selected cell, deletes and restores structure with undo", () => {
		const element = editor();
		required(
			element.querySelector<HTMLInputElement>(
				'[data-row="1"][data-column="1"] input',
			),
		).focus();
		element.addColumn();
		element.addRow();
		expect(element.getData().cells).toEqual([
			["Session", "Room", ""],
			["Practice", "B2", ""],
			["", "", ""],
		]);
		element.deleteColumn();
		element.deleteRow();
		expect(element.rows).toBe(2);
		expect(element.columns).toBe(2);
		element.undo();
		expect(element.rows).toBe(3);
		element.reset();
		expect(element.getData().caption).toBe("Schedule");
		expect(element.rows).toBe(2);
	});
	it("reflects public attributes, preserves text on resizing, and limits dimensions", () => {
		const element = editor();
		element.rows = 4;
		element.columns = 3;
		element.noHeader = true;
		element.caption = "A & B";
		expect(element.getData()).toMatchObject({
			header: false,
			caption: "A & B",
		});
		expect(element.querySelectorAll("th")).toHaveLength(0);
		expect(element.getData().cells[1]?.[1]).toBe("B2");
		expect(element.getAttribute("rows")).toBe("4");
		element.rows = 0;
		element.columns = 0;
		element.deleteRow();
		element.deleteColumn();
		expect(element.rows).toBe(1);
		expect(element.columns).toBe(1);
		element.rows = Infinity;
		expect(element.rows).toBe(3);
	});
	it("keeps a preconnection API table and returns independent snapshots", () => {
		const element = new TpTableEditor();
		element.setData([["A", "B"], ["C"]]);
		document.body.append(element);
		const data = element.getData();
		data.cells[0]?.splice(0, 1, "Changed");
		expect(element.getData().cells).toEqual([
			["A", "B"],
			["C", ""],
		]);
		element.remove();
		document.body.append(element);
		expect(element.getData().cells[1]).toEqual(["C", ""]);
		expect(() => element.setData([])).toThrow();
		expect(() => element.setData([Array<string>(31).fill("")])).toThrow();
	});
	it("disables edits in readonly while keeping format and export controls enabled", () => {
		const element = editor();
		element.readonly = true;
		expect(
			element
				.querySelector('[data-trigger="structure"]')
				?.hasAttribute("disabled"),
		).toBe(true);
		expect(
			required(element.querySelector<HTMLInputElement>('[data-row="0"] input'))
				.readOnly,
		).toBe(true);
		element.querySelector<HTMLElement>('[data-trigger="structure"]')?.click();
		expect(element.rows).toBe(2);
		expect(
			element.querySelector("[data-save-markup]")?.hasAttribute("disabled"),
		).toBe(false);
		element.readonly = false;
		expect(
			required(element.querySelector<HTMLInputElement>('[data-row="0"] input'))
				.readOnly,
		).toBe(false);
	});
	it("selects formats and column alignment through the visible controls", () => {
		const element = editor();
		element
			.querySelector<HTMLElement>('[data-menu="align"] [data-choice="right"]')
			?.click();
		expect(element.getData().alignments[0]).toBe("right");
		required(
			element.querySelectorAll<HTMLElement>(
				"[data-format-tabs] > [data-tp-tablist] > [data-tp-tab]",
			)[2],
		).click();
		expect(element.format).toBe("latex");
		expect(element.getMarkup()).toContain("{|r|l|}");
	});
	it("reports clipboard failure without claiming success", async () => {
		const element = editor();
		vi.stubGlobal("navigator", {
			clipboard: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
		});
		expect(await element.copy()).toBe(false);
		expect(
			element.querySelector(".tp-table-editor-status")?.textContent,
		).toContain("Copy unavailable");
	});
});
describe("RST serialization", () => {
	it("uses native list-tables without Unicode-dependent border padding and escapes directives", () => {
		const source = serializeTable(
			{
				cells: [
					["Text"],
					["Économie 😀 中文"],
					[".. raw:: html"],
					["1. A list?"],
				],
				header: true,
				caption: "",
				alignments: ["left"],
			},
			"restructuredtext",
		);
		expect(source).toContain(".. list-table::\n   :header-rows: 1");
		expect(source).toContain("   * - Économie 😀 中文");
		expect(source).toContain(String.raw`\.\. raw\:\: html`);
		expect(source).toContain(String.raw`1\. A list\?`);
	});
	it("adds a required empty body row when only headings exist", () => {
		expect(
			serializeTable(
				{ cells: [["Title"]], header: true, caption: "", alignments: ["left"] },
				"restructuredtext",
			),
		).toBe(".. list-table::\n   :header-rows: 1\n\n   * - Title\n   * -");
	});
});

describe("table markup exports", () => {
	const data: TableData = {
		cells: [
			["Name", "Value"],
			["A & B", "<script> *x* | _ # $ % \\ {z}"],
		],
		caption: "Example & test",
		header: true,
		alignments: ["left", "right"],
	};
	it.each(tableFormats)("exports %s without modifying data", (format) => {
		const before = structuredClone(data);
		expect(serializeTable(data, format)).not.toBe("");
		expect(data).toEqual(before);
	});
	it("escapes literal HTML and preserves header and alignment", () => {
		const doc = new DOMParser().parseFromString(
			serializeTable(data, "html"),
			"text/html",
		);
		expect(doc.querySelector("script")).toBeNull();
		expect(doc.querySelectorAll("th")).toHaveLength(2);
		expect(doc.querySelectorAll("td")[1]?.textContent).toBe(data.cells[1]?.[1]);
	});
	it("escapes table delimiters and LaTeX special characters", () => {
		expect(serializeTable(data, "markdown")).toContain("&#124;");
		expect(serializeTable(data, "asciidoc")).toContain("&#124;");
		const tex = serializeTable(data, "latex");
		expect(tex).toContain("\\textbackslash{}");
		expect(tex).toContain("\\% ");
		expect(tex).toContain("\\{z\\}");
	});
	it("does not discard the first data row in a headerless table", () => {
		const plain = { ...data, header: false };
		expect(serializeTable(plain, "markdown")).toContain(
			"|  |  |\n| :--- | ---: |\n| Name | Value |",
		);
		expect(serializeTable(plain, "html")).not.toContain("<th");
		expect(serializeTable(plain, "latex")).toContain("Name & Value");
	});
});

describe("spreadsheet and image exports", () => {
	it.each(["csv", "json", "xlsx"] as const)(
		"exports %s with literal strings and Unicode",
		async (format) => {
			const element = editor();
			const cells = [
				["Name", "Value"],
				['Économie, "quoted"', "0012"],
				["=1+2", "<unsafe>&"],
			];
			element.setData(cells);
			element.mergeCells(1, 0, 2, 0);
			const blobs: Blob[] = [];
			vi.stubGlobal(
				"URL",
				Object.assign(class extends URL {}, {
					createObjectURL: (blob: Blob) => {
						blobs.push(blob);
						return "blob:test";
					},
					revokeObjectURL: vi.fn(),
				}),
			);
			let filename = "";
			vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
				function (this: HTMLAnchorElement) {
					filename = this.download;
				},
			);
			await element.downloadSpreadsheet(format);
			expect(filename).toBe(`table.${format}`);
			const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as ArrayBuffer);
				reader.onerror = reject;
				reader.readAsArrayBuffer(required(blobs[0]));
			});
			if (format === "json")
				expect(JSON.parse(new TextDecoder().decode(bytes))).toEqual(cells);
			else {
				const XLSX = await import("xlsx");
				const workbook = XLSX.read(bytes, { type: "array", raw: true });
				const sheet = required(
					workbook.Sheets[required(workbook.SheetNames[0])],
				);
				expect(
					XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true }),
				).toEqual(cells);
				expect(sheet.A3.f).toBeUndefined();
				expect(sheet["!merges"]).toEqual(
					format === "xlsx"
						? [{ s: { r: 1, c: 0 }, e: { r: 2, c: 0 } }]
						: undefined,
				);
			}
		},
	);
	it("builds an escaped SVG with a centered caption and exposes it to tp-save-image", () => {
		const element = editor();
		element.setData([["<script>&", "0012"]]);
		element.caption = "A & B";
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
			font: "",
			measureText: (text: string) => ({ width: text.length * 8 }),
		} as CanvasRenderingContext2D);
		const svg = new DOMParser().parseFromString(
			element.exportSvg(),
			"image/svg+xml",
		);
		expect(svg.querySelector("parsererror,script")).toBeNull();
		expect(
			Array.from(svg.querySelectorAll("text"), (node) => node.textContent),
		).toEqual(["<script>&", "0012", "A & B"]);
		expect(
			svg.querySelector("text:last-child")?.getAttribute("text-anchor"),
		).toBe("middle");
		const save = required(element.querySelector("tp-save-image"));
		expect(document.querySelector(required(save.getAttribute("anchor")))).toBe(
			element,
		);
		expect(element.querySelector("select")).toBeNull();
	});
	it("keeps menu choices unchanged when readonly and gives instances distinct anchors", async () => {
		const element = editor();
		const other = editor();
		element.readonly = true;
		await Promise.resolve();
		element.querySelector<HTMLInputElement>("[data-heading] input")?.click();
		expect(element.noHeader).toBe(false);
		expect(
			element.querySelector("[data-heading] input")?.hasAttribute("disabled"),
		).toBe(true);
		expect(
			element.querySelector("[data-save-markup]")?.hasAttribute("disabled"),
		).toBe(false);
		expect(
			element.querySelector("tp-dropdown")?.getAttribute("anchor"),
		).not.toBe(other.querySelector("tp-dropdown")?.getAttribute("anchor"));
	});
});

describe("cell context menu and field types", () => {
	function openMenu(element: TpTableEditor, row: number, column: number): void {
		required(
			element.querySelector(`[data-row="${row}"][data-column="${column}"]`),
		).dispatchEvent(
			new MouseEvent("contextmenu", {
				bubbles: true,
				cancelable: true,
				clientX: 20,
				clientY: 30,
			}),
		);
	}
	function action(element: TpTableEditor, name: string): void {
		required(
			element.querySelector<HTMLElement>(
				`tp-contextmenu [data-action="${name}"]`,
			),
		).click();
	}
	it("targets the right-clicked cell and inserts before/after without losing types", () => {
		const element = editor();
		element.setData([
			["1", "2"],
			["3", "4"],
		]);
		element.setCellType(1, 1, "number");
		openMenu(element, 0, 0);
		action(element, "row-before");
		expect(element.getData().cells).toEqual([
			["", ""],
			["1", "2"],
			["3", "4"],
		]);
		expect(element.getCellType(2, 1)).toBe("number");
		openMenu(element, 2, 0);
		action(element, "column-after");
		expect(element.getData().cells[2]).toEqual(["3", "", "4"]);
		expect(element.getCellType(2, 2)).toBe("number");
		action(element, "remove-row");
		expect(element.rows).toBe(2);
		element.undo();
		expect(element.getCellType(2, 2)).toBe("number");
		element.undo();
		expect(element.getCellType(2, 1)).toBe("number");
		element.redo();
		expect(element.getCellType(2, 2)).toBe("number");
		element.columns = 4;
		element.rows = 4;
		expect(element.getCellType(2, 2)).toBe("number");
		expect(element.getCellType(3, 3)).toBe("text");
	});
	it.each([
		["number", "12.5"],
		["date", "2026-11-14"],
		["time", "09:30"],
		["math", "x^2"],
	] as const)(
		"uses tp-%sfield and retains its value in exports",
		(type, value) => {
			const element = editor();
			element.setData([[value]]);
			openMenu(element, 0, 0);
			action(element, `type-${type}`);
			expect(element.getCellType(0, 0)).toBe(type);
			const field = required(element.querySelector(`tp-${type}field`));
			expect(field.value).toBe(value);
			expect(element.getData().cells).toEqual([[value]]);
			field.value = "";
			field.dispatchEvent(new Event("input", { bubbles: true }));
			expect(element.getData().cells).toEqual([[""]]);
			element.undo();
			expect(element.getData().cells).toEqual([[value]]);
			expect(element.getCellType(0, 0)).toBe(type);
			element.undo();
			expect(element.getCellType(0, 0)).toBe("text");
			expect(element.getData().cells).toEqual([[value]]);
		},
	);
	it("clears incompatible values undoably and validates indexes and types", () => {
		const element = editor();
		expect(element.setCellType(1, 0, "number")).toBe(true);
		expect(element.getData().cells[1]?.[0]).toBe("");
		expect(
			element.querySelector(".tp-table-editor-status")?.textContent,
		).toContain("Undo restores");
		element.undo();
		expect(element.getData().cells[1]?.[0]).toBe("Practice");
		expect(element.getCellType(1, 0)).toBe("text");
		expect(() => element.setCellType(-1, 0, "number")).toThrow(RangeError);
		expect(() => element.setCellType(0, 0, "unknown" as "text")).toThrow(
			TypeError,
		);
		element.setData([["2026-02-30"]]);
		expect(element.setCellType(0, 0, "date")).toBe(true);
		expect(element.getData().cells[0]?.[0]).toBe("");
		element.setData([["24:99"]]);
		expect(element.setCellType(0, 0, "time")).toBe(true);
		expect(element.getData().cells[0]?.[0]).toBe("");
	});
	it("supports keyboard opening and protects readonly and minimum dimensions", () => {
		const element = editor();
		element.setData([[""]]);
		const field = required(element.querySelector('[data-row="0"]'));
		field.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "F10",
				shiftKey: true,
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(element.querySelector("tp-contextmenu")?.hasAttribute("open")).toBe(
			true,
		);
		expect(
			element
				.querySelector('[data-action="remove-row"]')
				?.getAttribute("aria-disabled"),
		).toBe("true");
		action(element, "remove-row");
		expect(element.rows).toBe(1);
		element.readonly = true;
		openMenu(element, 0, 0);
		expect(element.querySelector("tp-contextmenu")?.hasAttribute("open")).toBe(
			false,
		);
		action(element, "type-number");
		expect(element.getCellType(0, 0)).toBe("text");
	});
	it("initializes authored field types and resets them with their values", () => {
		const element = new TpTableEditor();
		element.innerHTML =
			'<table><tr><td data-type="number">12</td><td data-type="date">2026-11-14</td></tr></table>';
		document.body.append(element);
		expect(element.getCellType(0, 0)).toBe("number");
		expect(element.getCellType(0, 1)).toBe("date");
		element.setCellType(0, 0, "text");
		element.reset();
		expect(element.getCellType(0, 0)).toBe("number");
		element.setData([["A"]]);
		expect(element.getCellType(0, 0)).toBe("text");
	});
});

describe("Type dropdown", () => {
	it("updates the selected cell, reflects its type and respects readonly", () => {
		const element = editor();
		const input = required(
			element.querySelector<HTMLInputElement>(
				'[data-row="1"][data-column="1"] input',
			),
		);
		input.focus();
		required(
			element.querySelector<HTMLElement>(
				'[data-menu="type"] [data-choice="number"]',
			),
		).click();
		expect(element.getCellType(1, 1)).toBe("number");
		expect(element.getData().cells[1]?.[1]).toBe("");
		expect(element.getCellType(0, 0)).toBe("text");
		expect(
			element
				.querySelector('[data-menu="type"] [data-choice="number"]')
				?.getAttribute("aria-current"),
		).toBe("true");
		element.undo();
		expect(element.getData().cells[1]?.[1]).toBe("B2");
		expect(element.getCellType(1, 1)).toBe("text");
		element.readonly = true;
		expect(
			element.querySelector('[data-trigger="type"]')?.hasAttribute("disabled"),
		).toBe(true);
		required(
			element.querySelector<HTMLElement>(
				'[data-menu="type"] [data-choice="math"]',
			),
		).click();
		expect(element.getCellType(1, 1)).toBe("text");
	});
});

it("resizes columns in one undoable drag and preserves widths through structural edits", () => {
	const editor = document.createElement("tp-table-editor");
	editor.setData([
		["A", "B"],
		["x^2", "20"],
	]);
	document.body.append(editor);
	const handle = editor.querySelector<HTMLElement>('[data-column-resize="0"]');
	if (!handle) throw new Error("Missing resize handle");
	handle.setPointerCapture = vi.fn();
	handle.dispatchEvent(
		new MouseEvent("pointerdown", { button: 0, clientX: 100 }),
	);
	handle.dispatchEvent(new MouseEvent("pointermove", { clientX: 140 }));
	handle.dispatchEvent(new MouseEvent("pointermove", { clientX: 180 }));
	handle.dispatchEvent(new MouseEvent("pointerup"));
	expect(editor.getData().columnWidths).toEqual([240, 160]);
	editor.undo();
	expect(editor.getData().columnWidths).toBeUndefined();
	editor.redo();
	expect(editor.getData().columnWidths).toEqual([240, 160]);
	editor.addColumn("before");
	expect(editor.getData().columnWidths).toEqual([160, 240, 160]);
	editor.deleteColumn();
	expect(editor.getData().columnWidths).toEqual([240, 160]);
	editor.setCellType(1, 0, "math");
	expect(editor.querySelector("col")?.style.width).toBe("240px");
	const current = editor.querySelector('[data-column-resize="0"]');
	current?.dispatchEvent(new MouseEvent("dblclick"));
	expect(editor.getData().columnWidths).toEqual([160, 160]);
	editor.setAttribute("readonly", "");
	expect(editor.querySelector("[data-column-resize]")).toBeNull();
});

it("defaults numerical columns to right alignment and preserves an explicit choice", () => {
	const element = document.createElement("tp-table-editor");
	element.innerHTML =
		'<table><tr><th>Name</th><th>Count</th></tr><tr><td>Item</td><td data-type="number">20</td></tr></table>';
	document.body.append(element);
	expect(element.getData().alignments).toEqual(["left", "right"]);
	element.setCellType(1, 1, "text");
	expect(element.getData().alignments).toEqual(["left", "left"]);
	element.setCellType(1, 1, "number");
	expect(
		element.querySelector('[data-trigger="align"]')?.getAttribute("name"),
	).toBe("format-align-right");
	const menu = required(element.querySelector('[data-menu="align"]'));
	const item = required(menu.querySelector('[data-choice="center"]'));
	menu.dispatchEvent(
		new CustomEvent("tp-menu-item-select", { detail: { item } }),
	);
	element.setCellType(1, 1, "text");
	expect(element.getData().alignments).toEqual(["left", "center"]);
	expect(element.getMarkup("markdown")).toContain("| :--- | :---: |");
	element.undo();
	expect(element.getCellType(1, 1)).toBe("number");
	expect(element.getData().alignments[1]).toBe("center");
});

it.each(["left", "center", "right"] as const)(
	"aligns the context-menu column %s",
	(alignment) => {
		const element = editor();
		const field = required(
			element.querySelector('[data-row="1"][data-column="1"]'),
		);
		field.dispatchEvent(
			new MouseEvent("contextmenu", {
				bubbles: true,
				clientX: 20,
				clientY: 20,
			}),
		);
		const menu = required(element.querySelector("tp-contextmenu"));
		expect(menu.querySelectorAll("tp-divider")).toHaveLength(4);
		menu.dispatchEvent(
			new CustomEvent("tp-contextmenu-select", {
				detail: { action: `align-${alignment}` },
			}),
		);
		expect(element.getData().alignments).toEqual(["left", alignment]);
		expect(
			element.querySelector('[data-trigger="align"]')?.getAttribute("name"),
		).toBe(`format-align-${alignment}`);
		element.undo();
		expect(element.getData().alignments).toEqual(["left", "left"]);
	},
);

it("groups the structure commands in the end toolbar dropdown", () => {
	const element = editor();
	const menu = required(element.querySelector('[data-menu="structure"]'));
	expect(
		element.querySelector('[data-trigger="structure"]')?.getAttribute("name"),
	).toBe("plus-minus");
	expect(
		element.querySelector('[data-action="undo"]')?.getAttribute("section"),
	).toBe("end");
	const choose = (action: string): void => {
		const item = required(menu.querySelector(`[data-choice="${action}"]`));
		menu.dispatchEvent(
			new CustomEvent("tp-menu-item-select", { detail: { item } }),
		);
	};
	choose("add-row-before");
	expect(element.getData().cells[0]).toEqual(["", ""]);
	element.undo();
	choose("add-column-before");
	expect(element.getData().cells[0]).toEqual(["", "Session", "Room"]);
	element.undo();
	choose("add-row-after");
	choose("add-column-after");
	expect([element.rows, element.columns]).toEqual([3, 3]);
	choose("delete-row");
	choose("delete-column");
	expect([element.rows, element.columns]).toEqual([2, 2]);
	element.setData([["Only cell"]]);
	expect(
		menu
			.querySelector('[data-choice="delete-row"]')
			?.getAttribute("aria-disabled"),
	).toBe("true");
});

it("exposes five markup formats with independent Code/Render tabs and saves the selected language", () => {
	const element = editor();
	const tabs = required(element.querySelector<TpTabs>("[data-format-tabs]"));
	expect(tabs.selected).toBe(3);
	expect(element.querySelectorAll("[data-markup-tabs]")).toHaveLength(5);
	expect(element.querySelector('[data-menu="format"]')).toBeNull();
	expect(element.querySelector('[data-menu="download"]')).toBeNull();
	required(
		tabs.querySelectorAll<HTMLElement>(
			":scope > [data-tp-tablist] > [data-tp-tab]",
		)[2],
	).click();
	expect(element.format).toBe("latex");
	expect(
		element.querySelector('[data-format-panel="latex"] code')?.textContent,
	).toBe(element.getMarkup("latex"));
	const save = vi.spyOn(element, "download").mockResolvedValue();
	required(
		element.querySelector<HTMLElement>('[data-save-markup="latex"]'),
	).click();
	expect(save).toHaveBeenCalledOnce();
	element.format = "html";
	expect(tabs.selected).toBe(1);
});

it("lazily displays spreadsheet sources including the actual XLSX worksheet and refreshes edits", async () => {
	const element = editor();
	const details = required(
		element.querySelector<HTMLDetailsElement>("[data-spreadsheet-details]"),
	);
	expect(details.open).toBe(false);
	expect(details.querySelector("pre")).toBeNull();
	details.open = true;
	details.dispatchEvent(new Event("toggle"));
	const tabs = required(
		details.querySelector<TpTabs>("[data-spreadsheet-tabs]"),
	);
	await vi.waitFor(() =>
		expect(
			details.querySelector('[data-spreadsheet-panel="csv"] code')?.textContent,
		).toContain("Practice"),
	);
	required(
		tabs.querySelectorAll<HTMLElement>(
			":scope > [data-tp-tablist] > [data-tp-tab]",
		)[1],
	).click();
	await vi.waitFor(() =>
		expect(
			JSON.parse(
				details.querySelector('[data-spreadsheet-panel="json"] code')
					?.textContent ?? "null",
			),
		).toEqual(element.getData().cells),
	);
	element.setData([["Name"], ["A & <B>"]]);
	await vi.waitFor(() =>
		expect(
			details.querySelector('[data-spreadsheet-panel="json"] code')
				?.textContent,
		).toContain("A & <B>"),
	);
	required(
		tabs.querySelectorAll<HTMLElement>(
			":scope > [data-tp-tablist] > [data-tp-tab]",
		)[2],
	).click();
	await vi.waitFor(() =>
		expect(
			details.querySelector('[data-spreadsheet-panel="xlsx"] code')
				?.textContent,
		).toContain("<worksheet"),
	);
	const xml =
		required(details.querySelector('[data-spreadsheet-panel="xlsx"] code'))
			.textContent ?? "";
	expect(xml).toContain("A &amp; &lt;B&gt;");
	const parsed = new DOMParser().parseFromString(xml, "application/xml");
	expect(parsed.querySelector("parsererror")).toBeNull();
	expect(parsed.querySelector('c[r="A2"] v')?.textContent).toBe("A & <B>");
	const save = vi.spyOn(element, "downloadSpreadsheet").mockResolvedValue();
	required(
		details.querySelector<HTMLElement>('[data-save-spreadsheet="xlsx"]'),
	).click();
	expect(save).toHaveBeenCalledWith("xlsx");
	element.deleteTable();
	await vi.waitFor(() =>
		expect(
			details.querySelector('[data-spreadsheet-panel="xlsx"] code')
				?.textContent,
		).toBe(""),
	);
	expect(
		details
			.querySelector('[data-save-spreadsheet="xlsx"]')
			?.hasAttribute("disabled"),
	).toBe(true);
});

describe("merged cells", () => {
	it("merges and splits without changing hidden values or types, with undo and redo", () => {
		const element = editor();
		element.setData([
			["A", "B"],
			["x", "20"],
			["y", "30"],
		]);
		element.setCellType(1, 1, "number");
		const original = element.getData();
		expect(element.mergeCells(1, 0, 2, 1)).toBe(true);
		expect(element.getData().cells).toEqual(original.cells);
		expect(
			element.querySelectorAll(".tp-table-editor-surface td"),
		).toHaveLength(1);
		expect(
			element
				.querySelector(".tp-table-editor-surface td")
				?.getAttribute("rowspan"),
		).toBe("2");
		const merged = element.getData();
		element.undo();
		expect(element.getData()).toEqual(original);
		element.redo();
		expect(element.getData()).toEqual(merged);
		expect(element.splitCell(2, 1)).toBe(true);
		expect(element.getData().cells).toEqual(original.cells);
		expect(element.getCellType(1, 1)).toBe("number");
		expect(
			element.querySelectorAll(".tp-table-editor-surface td"),
		).toHaveLength(4);
		element.undo();
		expect(element.getData()).toEqual(merged);
	});
	it("selects with Shift-click and exposes merge/split in both menus", () => {
		const element = editor();
		const first = required(
			element.querySelector<HTMLElement>(
				'[data-grid-row="1"][data-grid-column="0"]',
			),
		);
		const last = required(
			element.querySelector<HTMLElement>(
				'[data-grid-row="1"][data-grid-column="1"]',
			),
		);
		first.dispatchEvent(
			new MouseEvent("mousedown", { bubbles: true, button: 0 }),
		);
		last.dispatchEvent(
			new MouseEvent("mousedown", { bubbles: true, button: 0, shiftKey: true }),
		);
		expect(element.querySelectorAll("[data-range-selected]")).toHaveLength(2);
		const menu = required(element.querySelector('[data-menu="structure"]'));
		const item = required(menu.querySelector('[data-choice="merge-cells"]'));
		expect(item.getAttribute("aria-disabled")).toBe("false");
		menu.dispatchEvent(
			new CustomEvent("tp-menu-item-select", { detail: { item } }),
		);
		expect(element.getData().merges).toEqual([
			{ row: 1, column: 0, rowspan: 1, colspan: 2 },
		]);
		const cell = required(
			element.querySelector<HTMLElement>(
				'[data-grid-row="1"][data-grid-column="0"]',
			),
		);
		cell.dispatchEvent(
			new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
		);
		expect(
			element
				.querySelector('[data-action="split-cell"]')
				?.getAttribute("aria-disabled"),
		).toBe("false");
	});
	it("rejects invalid rectangles and merges crossing the heading boundary", () => {
		const element = editor();
		expect(element.mergeCells(0, 0, 1, 1)).toBe(false);
		expect(element.mergeCells(-1, 0, 1, 1)).toBe(false);
		expect(element.mergeCells(1, 0, 1, 0)).toBe(false);
		expect(element.mergeCells(1, 0, 99, 1)).toBe(false);
		expect(element.mergeCells(1, 0, 1, 1)).toBe(true);
		expect(element.mergeCells(1, 0, 1, 1)).toBe(false);
	});
	it("expands existing merges and keeps them valid across structural edits", () => {
		const element = editor();
		element.setData([
			["A", "B", "C"],
			["a", "b", "c"],
			["d", "e", "f"],
			["g", "h", "i"],
		]);
		element.mergeCells(1, 0, 2, 1);
		element.mergeCells(2, 1, 3, 2);
		expect(element.getData().merges).toEqual([
			{ row: 1, column: 0, rowspan: 3, colspan: 3 },
		]);
		element.addRow();
		expect(element.getData().merges?.[0]?.rowspan).toBe(4);
		element.deleteRow();
		expect(element.getData().merges?.[0]?.rowspan).toBe(3);
		element.addColumn();
		expect(element.getData().merges?.[0]?.colspan).toBe(4);
		element.deleteColumn();
		expect(element.getData().merges?.[0]?.colspan).toBe(3);
		element.rows = 2;
		element.columns = 2;
		expect(element.getData().merges).toEqual([
			{ row: 1, column: 0, rowspan: 1, colspan: 2 },
		]);
	});
	it("imports HTML spans with logical column positions and typed fields", () => {
		const element = new TpTableEditor();
		element.innerHTML =
			'<table><tr><th colspan="2">Title</th><th>C</th></tr><tr><td rowspan="2">A</td><td data-type="number">12</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table>';
		document.body.append(element);
		expect(element.getData().cells).toEqual([
			["Title", "", "C"],
			["A", "12", "B"],
			["", "C", "D"],
		]);
		expect(element.getCellType(1, 1)).toBe("number");
		expect(element.getData().merges).toHaveLength(2);
		expect(
			element.querySelectorAll(".tp-table-editor-surface col"),
		).toHaveLength(3);
		expect(element.querySelectorAll("[data-column-resize]")).toHaveLength(2);
	});
	it("keeps cell values in CSV/JSON and stores spans in XLSX worksheet XML", async () => {
		const element = editor();
		element.mergeCells(1, 0, 1, 1);
		const details = required(
			element.querySelector<HTMLDetailsElement>("[data-spreadsheet-details]"),
		);
		details.open = true;
		details.dispatchEvent(new Event("toggle"));
		const tabs = required(
			details.querySelector<TpTabs>("[data-spreadsheet-tabs]"),
		);
		required(
			tabs.querySelectorAll<HTMLElement>(
				":scope > [data-tp-tablist] > [data-tp-tab]",
			)[2],
		).click();
		await vi.waitFor(() =>
			expect(
				details.querySelector('[data-spreadsheet-panel="xlsx"] code')
					?.textContent,
			).toContain('<mergeCell ref="A2:B2"'),
		);
		expect(
			details.querySelector('[data-spreadsheet-panel="xlsx"] code')
				?.textContent,
		).toContain("B2");
	});
});

it("exports only visible merged cells to SVG with the correct rectangle dimensions", () => {
	const element = editor();
	element.setData([
		["A", "B"],
		["Shown", "hidden"],
		["hidden2", "hidden3"],
	]);
	element.mergeCells(1, 0, 2, 1);
	vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
		measureText: () => ({ width: 20 }),
		font: "",
	} as unknown as CanvasRenderingContext2D);
	const root = new DOMParser().parseFromString(
		element.exportSvg(),
		"image/svg+xml",
	);
	expect(root.querySelector('rect[height="72"]')?.getAttribute("width")).toBe(
		"160",
	);
	const labels = Array.from(
		root.querySelectorAll("text"),
		(node) => node.textContent,
	);
	expect(labels).toContain("Shown");
	expect(labels).not.toContain("hidden");
});
it("extends the selection by keyboard and disables interactive merges when readonly", () => {
	const element = editor();
	const cell = required(
		element.querySelector<HTMLElement>(
			'[data-grid-row="1"][data-grid-column="0"]',
		),
	);
	cell.querySelector("input")?.focus();
	cell.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "ArrowRight",
			altKey: true,
			shiftKey: true,
			bubbles: true,
			cancelable: true,
		}),
	);
	expect(element.querySelectorAll("[data-range-selected]")).toHaveLength(2);
	element.readonly = true;
	expect(
		element
			.querySelector('[data-choice="merge-cells"]')
			?.getAttribute("aria-disabled"),
	).toBe("true");
	const menu = required(element.querySelector('[data-menu="structure"]'));
	const item = required(menu.querySelector('[data-choice="merge-cells"]'));
	menu.dispatchEvent(
		new CustomEvent("tp-menu-item-select", { detail: { item } }),
	);
	expect(element.getData().merges).toBeUndefined();
});
it("separates a merge that crosses a newly enabled heading and undo restores it", () => {
	const element = editor();
	element.noHeader = true;
	element.mergeCells(0, 0, 1, 1);
	const merged = element.getData();
	element.noHeader = false;
	expect(element.getData().merges).toEqual([]);
	element.undo();
	expect(element.getData()).toEqual(merged);
});
