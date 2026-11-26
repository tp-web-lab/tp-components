import "../checkbox-list/checkbox-list.js";
import { afterEach, expect, it, vi } from "vitest";
import { TpTableEditor } from "./table-editor.js";
import { serializeTable, type TableData } from "./table-markup.js";
import { parseTableSource } from "./table-source.js";
import { tableXlsx } from "./table-xlsx.js";

afterEach(() => document.body.replaceChildren());
const data: TableData = {
	cells: [
		["A", "B"],
		["First", "Second"],
		["Third", "Fourth"],
	],
	header: true,
	caption: "",
	alignments: ["left", "right"],
	columnWidths: [180, 300],
	cellHorizontalAlignments: [
		["left", "right"],
		["center", "left"],
		["right", "center"],
	],
	cellVerticalAlignments: [
		["top", "top"],
		["middle", "bottom"],
		["bottom", "middle"],
	],
};
it.each(["html", "markdown", "asciidoc", "latex", "xlsx"] as const)(
	"preserves imported %s dimensions and per-cell alignments",
	async (format) => {
		const source =
			format === "xlsx" ? await tableXlsx(data) : serializeTable(data, format);
		const extension = {
			html: "html",
			markdown: "md",
			asciidoc: "adoc",
			latex: "tex",
			xlsx: "xlsx",
		}[format];
		const table = await parseTableSource(
			source,
			new URL(`https://example.org/table.${extension}`),
			new AbortController().signal,
		);
		const editor = new TpTableEditor();
		editor.append(table);
		document.body.append(editor);
		const imported = editor.getData();
		expect(imported.cellVerticalAlignments?.slice(1)).toEqual(
			data.cellVerticalAlignments?.slice(1),
		);
		expect(imported.cellHorizontalAlignments).toEqual(
			data.cellHorizontalAlignments,
		);
		const widths = imported.columnWidths;
		expect(widths).toHaveLength(2);
		if (format === "asciidoc")
			expect((widths?.[0] ?? 0) / (widths?.[1] ?? 1)).toBeCloseTo(180 / 300, 1);
		else {
			expect(widths?.[0]).toBeCloseTo(180, 0);
			expect(widths?.[1]).toBeCloseTo(300, 0);
		}
		const exported = new DOMParser().parseFromString(
			editor.getMarkup("html"),
			"text/html",
		);
		expect(exported.querySelectorAll("td")[0]?.style.textAlign).toBe("center");
		expect(exported.querySelectorAll("td")[1]?.style.verticalAlign).toBe(
			"bottom",
		);
		editor.addRow("before");
		editor.undo();
		expect(editor.getData().cellHorizontalAlignments).toEqual(
			imported.cellHorizontalAlignments,
		);
	},
);
it("reads HTML width attributes, col spans and legacy alignment", () => {
	const editor = new TpTableEditor();
	editor.innerHTML =
		'<table width="600"><colgroup><col span="2" width="50%"></colgroup><tr align="right" valign="bottom"><td>A</td><td>B</td></tr></table>';
	document.body.append(editor);
	expect(editor.getData().columnWidths).toEqual([300, 300]);
	expect(editor.getData().alignments).toEqual(["right", "right"]);
	expect(editor.getData().cellVerticalAlignments).toEqual([
		["bottom", "bottom"],
	]);
});

it.each([
	"heading",
	"plain",
	"bold-only",
	"gray-only",
	"colored",
	"theme-gray",
] as const)("recognizes XLSX heading styles: %s", async (kind) => {
	const XLSX = await import("xlsx");
	let bytes = await tableXlsx({ ...data, header: kind !== "plain" });
	if (!["heading", "plain"].includes(kind)) {
		const archive = XLSX.CFB.read(new Uint8Array(bytes), { type: "array" });
		const entry = XLSX.CFB.find(archive, "/xl/styles.xml");
		const styles = new DOMParser().parseFromString(
			new TextDecoder().decode(entry.content),
			"application/xml",
		);
		if (kind === "gray-only") styles.querySelector("fonts b")?.remove();
		if (kind === "bold-only")
			styles.querySelector("fills fgColor")?.setAttribute("rgb", "FFFFFFFF");
		if (kind === "colored")
			styles.querySelector("fills fgColor")?.setAttribute("rgb", "FFFF0000");
		if (kind === "theme-gray") {
			const color = styles.querySelector("fills fgColor");
			color?.removeAttribute("rgb");
			color?.setAttribute("theme", "0");
			color?.setAttribute("tint", "-0.2");
		}
		XLSX.CFB.utils.cfb_add(
			archive,
			"/xl/styles.xml",
			new TextEncoder().encode(new XMLSerializer().serializeToString(styles)),
		);
		bytes = Uint8Array.from(
			XLSX.CFB.write(archive, { fileType: "zip", type: "array" }),
		).buffer;
	}
	const table = await parseTableSource(
		bytes,
		new URL("https://example.org/table.xlsx"),
		new AbortController().signal,
	);
	const editor = new TpTableEditor();
	editor.append(table);
	document.body.append(editor);
	const expected = kind === "heading" || kind === "theme-gray";
	expect(editor.getData().header).toBe(expected);
	await vi.waitFor(() =>
		expect(
			editor.querySelector<HTMLInputElement>("[data-heading] input")?.checked,
		).toBe(expected),
	);
	expect(editor.getData().columnWidths).toEqual(data.columnWidths);
	expect(editor.getData().cellVerticalAlignments?.[1]).toEqual(
		data.cellVerticalAlignments?.[1],
	);
});

it("retains colored borders, blank cells and merged perimeter through XLSX import and re-export", async () => {
	const red = { style: "double", color: "FFFF0000" };
	const blue = { style: "dashed", color: "FF0000FF" };
	const green = { style: "medium", color: "FF008000" };
	const original: TableData = {
		cells: [
			["Merged", "", "Plain"],
			["", "", ""],
		],
		header: false,
		caption: "",
		alignments: ["left", "left", "left"],
		merges: [{ row: 0, column: 0, rowspan: 2, colspan: 2 }],
		cellBorders: [
			[{ left: red, top: blue }, { top: blue, right: green }, {}],
			[
				{ left: red, bottom: green },
				{ bottom: green, right: green },
				{ bottom: blue },
			],
		],
	};
	const load = async (bytes: ArrayBuffer) => {
		const table = await parseTableSource(
			bytes,
			new URL("https://example.org/borders.xlsx"),
			new AbortController().signal,
		);
		const editor = new TpTableEditor();
		editor.append(table);
		document.body.append(editor);
		return editor;
	};
	const editor = await load(await tableXlsx(original));
	expect(editor.getData().cellBorders).toEqual(original.cellBorders);
	expect(editor.getData().merges).toEqual(original.merges);
	const html = new DOMParser().parseFromString(
		editor.getMarkup("html"),
		"text/html",
	);
	const merged = html.querySelector("td");
	if (!merged) throw new Error("Missing merged cell");
	expect(merged.style.borderLeftStyle).toBe("double");
	expect(merged.style.borderRightWidth).toBe("2px");
	expect(merged.style.borderBottomColor).toBe("rgb(0, 128, 0)");
	expect(merged.style.borderTopStyle).toBe("dashed");
	editor.addRow("before");
	editor.undo();
	expect(editor.getData().cellBorders).toEqual(original.cellBorders);
	const reimported = await load(await tableXlsx(editor.getData()));
	expect(reimported.getData().cellBorders).toEqual(original.cellBorders);
	expect(reimported.getData().merges).toEqual(original.merges);
});

it("reads theme and indexed border colors and anchor-only merged borders", async () => {
	const XLSX = await import("xlsx");
	const bytes = await tableXlsx({
		cells: [
			["Merged", ""],
			["", ""],
		],
		header: false,
		caption: "",
		alignments: ["left", "left"],
		merges: [{ row: 0, column: 0, rowspan: 2, colspan: 2 }],
		cellBorders: [
			[
				{
					right: { style: "thick", color: "FF000000" },
					bottom: { style: "dotted", color: "FF000000" },
				},
				{},
			],
			[{}, {}],
		],
	});
	const archive = XLSX.CFB.read(new Uint8Array(bytes), { type: "array" });
	const entry = XLSX.CFB.find(archive, "/xl/styles.xml");
	const xml = new DOMParser().parseFromString(
		new TextDecoder().decode(entry.content),
		"application/xml",
	);
	const right = xml.querySelector('border right[style="thick"] color');
	const bottom = xml.querySelector('border bottom[style="dotted"] color');
	if (!right || !bottom) throw new Error("Missing border fixture");
	right.removeAttribute("rgb");
	right.setAttribute("indexed", "6");
	bottom.removeAttribute("rgb");
	bottom.setAttribute("theme", "1");
	XLSX.CFB.utils.cfb_add(
		archive,
		"/xl/styles.xml",
		new TextEncoder().encode(new XMLSerializer().serializeToString(xml)),
	);
	const source = Uint8Array.from(
		XLSX.CFB.write(archive, { fileType: "zip", type: "array" }),
	).buffer;
	const table = await parseTableSource(
		source,
		new URL("https://example.org/borders.xlsx"),
		new AbortController().signal,
	);
	const editor = new TpTableEditor();
	editor.append(table);
	document.body.append(editor);
	expect(editor.getData().cellBorders?.[0]?.[0]).toEqual({
		right: { style: "thick", color: "FFFF00FF" },
		bottom: { style: "dotted", color: "FF000000" },
	});
	const html = new DOMParser().parseFromString(
		editor.getMarkup("html"),
		"text/html",
	);
	expect(html.querySelector("td")?.style.borderRightStyle).toBe("solid");
	expect(html.querySelector("td")?.style.borderBottomStyle).toBe("dotted");
	const exported = await tableXlsx(editor.getData());
	const reimport = await parseTableSource(
		exported,
		new URL("https://example.org/borders.xlsx"),
		new AbortController().signal,
	);
	const second = new TpTableEditor();
	second.append(reimport);
	document.body.append(second);
	expect(second.getData().cellBorders).toEqual(editor.getData().cellBorders);
});
