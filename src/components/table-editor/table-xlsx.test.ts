import { expect, it } from "vitest";
import { tableXlsx } from "./table-xlsx.js";

it("writes all horizontal and vertical alignments to actual XLSX cell styles", async () => {
	const XLSX = await import("xlsx");
	const cells = [
		["0012", "=literal", "économie"],
		["First\nSecond", "x^2", "Last"],
		["Merged", "", ""],
	];
	const bytes = await tableXlsx({
		cells,
		caption: "",
		columnWidths: [180, 250, 300],
		header: false,
		alignments: ["left", "center", "right"],
		cellVerticalAlignments: [
			["top", "middle", "bottom"],
			["middle", "bottom", "top"],
			["bottom", "top", "middle"],
		],
		merges: [{ row: 2, column: 0, rowspan: 1, colspan: 2 }],
	});
	const archive = XLSX.CFB.read(new Uint8Array(bytes), { type: "array" });
	const xml = (path: string) =>
		new DOMParser().parseFromString(
			new TextDecoder().decode(XLSX.CFB.find(archive, `/${path}`).content),
			"application/xml",
		);
	const sheet = xml("xl/worksheets/sheet1.xml");
	const styles = xml("xl/styles.xml");
	expect(sheet.querySelector("parsererror")).toBeNull();
	expect(sheet.querySelectorAll("cols col")).toHaveLength(3);
	expect(
		Number(sheet.querySelector("cols col")?.getAttribute("width")),
	).toBeGreaterThan(20);
	expect(styles.querySelector("parsererror")).toBeNull();
	const formats = styles.getElementsByTagName("cellXfs")[0];
	const alignments = [
		["top", "center", "bottom"],
		["center", "bottom", "top"],
		["bottom", "top", "center"],
	];
	for (const cell of sheet.getElementsByTagName("c")) {
		const { r, c } = XLSX.utils.decode_cell(cell.getAttribute("r") ?? "A1");
		const style = formats?.children[Number(cell.getAttribute("s"))];
		const alignment = style?.getElementsByTagName("alignment")[0];
		expect(alignment?.getAttribute("horizontal")).toBe(
			["left", "center", "right"][c],
		);
		expect(alignment?.getAttribute("vertical")).toBe(alignments[r]?.[c]);
		expect(alignment?.getAttribute("wrapText")).toBe("1");
	}
	const workbook = XLSX.read(bytes, { type: "array" });
	const first = workbook.Sheets.Table;
	expect(first).toBeDefined();
	if (!first) throw new Error("Missing Table sheet");
	expect(XLSX.utils.sheet_to_json(first, { header: 1, raw: true })).toEqual(
		cells,
	);
	expect(first["!merges"]).toEqual([{ s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }]);
});

it.each([true, false])(
	"applies bold gray headings only when Heading is %s",
	async (header) => {
		const XLSX = await import("xlsx");
		const bytes = await tableXlsx({
			cells: [["Title"], ["Value"]],
			header,
			caption: "",
			alignments: ["right"],
			cellVerticalAlignments: [["middle"], ["bottom"]],
		});
		const archive = XLSX.CFB.read(new Uint8Array(bytes), { type: "array" });
		const xml = (path: string) =>
			new DOMParser().parseFromString(
				new TextDecoder().decode(XLSX.CFB.find(archive, `/${path}`).content),
				"application/xml",
			);
		const styles = xml("xl/styles.xml"),
			sheet = xml("xl/worksheets/sheet1.xml");
		const formats = styles.getElementsByTagName("cellXfs")[0];
		for (const [index, cell] of Array.from(
			sheet.getElementsByTagName("c"),
		).entries()) {
			const style = formats?.children[Number(cell.getAttribute("s"))];
			const font =
				styles.getElementsByTagName("fonts")[0]?.children[
					Number(style?.getAttribute("fontId"))
				];
			const fill =
				styles.getElementsByTagName("fills")[0]?.children[
					Number(style?.getAttribute("fillId"))
				];
			expect(!!font?.querySelector("b")).toBe(header && index === 0);
			expect(fill?.querySelector("fgColor")?.getAttribute("rgb") ?? null).toBe(
				header && index === 0 ? "FFE7E6E6" : null,
			);
			expect(
				style?.querySelector("alignment")?.getAttribute("horizontal"),
			).toBe("right");
		}
	},
);

it("borders empty cells and only the perimeter of merged cells", async () => {
	const XLSX = await import("xlsx");
	const bytes = await tableXlsx({
		cells: [
			["Merged", "", ""],
			["", "", ""],
		],
		header: false,
		caption: "",
		alignments: ["left", "left", "left"],
		merges: [{ row: 0, column: 0, rowspan: 2, colspan: 2 }],
	});
	const archive = XLSX.CFB.read(new Uint8Array(bytes), { type: "array" });
	const xml = (path: string) =>
		new DOMParser().parseFromString(
			new TextDecoder().decode(XLSX.CFB.find(archive, `/${path}`).content),
			"application/xml",
		);
	const styles = xml("xl/styles.xml"),
		sheet = xml("xl/worksheets/sheet1.xml");
	const formats = styles.getElementsByTagName("cellXfs")[0];
	const expected: Record<string, string[]> = {
		A1: ["left", "top"],
		B1: ["right", "top"],
		A2: ["left", "bottom"],
		B2: ["right", "bottom"],
		C1: ["left", "right", "top", "bottom"],
		C2: ["left", "right", "top", "bottom"],
	};
	expect(sheet.getElementsByTagName("c")).toHaveLength(6);
	for (const cell of sheet.getElementsByTagName("c")) {
		const format = formats?.children[Number(cell.getAttribute("s"))];
		expect(format?.getAttribute("applyBorder")).toBe("1");
		const border =
			styles.getElementsByTagName("borders")[0]?.children[
				Number(format?.getAttribute("borderId"))
			];
		expect(
			[...(border?.children ?? [])]
				.filter((side) => side.getAttribute("style") === "thin")
				.map((side) => side.localName),
		).toEqual(expected[cell.getAttribute("r") ?? ""]);
		for (const color of border?.getElementsByTagName("color") ?? [])
			expect(color.getAttribute("rgb")).toBe("FFBFBFBF");
	}
});
