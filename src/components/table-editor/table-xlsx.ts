import { borderSides, type TableCellBorders } from "./table-borders.js";
import {
	type TableData,
	tableMergeAt,
	tableSpreadsheetCells,
} from "./table-markup.js";

/** Export table values, merges and cell alignment without changing literal strings. */
export async function tableXlsx(data: TableData): Promise<ArrayBuffer> {
	const XLSX = await import("xlsx");
	const sheet = XLSX.utils.aoa_to_sheet(tableSpreadsheetCells(data));
	if (data.columnWidths)
		sheet["!cols"] = data.columnWidths.map((wpx) => ({ wpx }));
	sheet["!merges"] = data.merges?.map((m) => ({
		s: { r: m.row, c: m.column },
		e: { r: m.row + m.rowspan - 1, c: m.column + m.colspan - 1 },
	}));
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, sheet, "Table");
	// SheetJS CE does not write cell alignment styles. Add standard OOXML styles
	// to its generated archive using the ZIP utilities bundled with SheetJS.
	const archive = XLSX.CFB.read(
		new Uint8Array(XLSX.write(workbook, { bookType: "xlsx", type: "array" })),
		{ type: "array" },
	);
	const readXml = (path: string): XMLDocument => {
		const entry = XLSX.CFB.find(archive, `/${path}`);
		if (!entry) throw new Error(`Missing XLSX entry: ${path}`);
		return new DOMParser().parseFromString(
			new TextDecoder().decode(entry.content),
			"application/xml",
		);
	};
	const styles = readXml("xl/styles.xml");
	const worksheet = readXml("xl/worksheets/sheet1.xml");
	const formats = styles.getElementsByTagName("cellXfs")[0];
	if (!formats) throw new Error("Missing XLSX cell styles");
	const namespace = styles.documentElement.namespaceURI;
	const fonts = styles.getElementsByTagName("fonts")[0];
	const fills = styles.getElementsByTagName("fills")[0];
	if (!fonts?.firstElementChild || !fills)
		throw new Error("Missing XLSX font or fill styles");
	const headingFontId = fonts.children.length;
	const headingFillId = fills.children.length;
	if (data.header) {
		const font = fonts.firstElementChild.cloneNode(true) as Element;
		font.append(styles.createElementNS(namespace, "b"));
		fonts.append(font);
		fonts.setAttribute("count", String(fonts.children.length));
		const fill = styles.createElementNS(namespace, "fill");
		const pattern = styles.createElementNS(namespace, "patternFill");
		pattern.setAttribute("patternType", "solid");
		const color = styles.createElementNS(namespace, "fgColor");
		color.setAttribute("rgb", "FFE7E6E6");
		pattern.append(color);
		fill.append(pattern);
		fills.append(fill);
		fills.setAttribute("count", String(fills.children.length));
	}
	const borders = styles.getElementsByTagName("borders")[0];
	if (!borders) throw new Error("Missing XLSX borders");
	const borderIds = new Map<string, number>();
	const borderFor = (sides: TableCellBorders["left"][]): number => {
		const key = JSON.stringify(sides);
		const existing = borderIds.get(key);
		if (existing !== undefined) return existing;
		const id = borders.children.length;
		const border = styles.createElementNS(namespace, "border");
		for (const [index, name] of borderSides.entries()) {
			const edge = styles.createElementNS(namespace, name);
			const value = sides[index];
			if (value) {
				edge.setAttribute("style", value.style);
				const color = styles.createElementNS(namespace, "color");
				color.setAttribute("rgb", value.color);
				edge.append(color);
			}
			border.append(edge);
		}
		borders.append(border);
		borderIds.set(key, id);
		return id;
	};
	const ids = new Map<string, number>();
	for (const cell of worksheet.getElementsByTagName("c")) {
		const { r, c } = XLSX.utils.decode_cell(cell.getAttribute("r") ?? "A1");
		const horizontal =
			data.cellHorizontalAlignments?.[r]?.[c] ?? data.alignments[c] ?? "left";
		const value = data.cellVerticalAlignments?.[r]?.[c] ?? "top";
		const vertical = value === "middle" ? "center" : value;
		const heading = data.header && r === 0;
		const merge = tableMergeAt(data, r, c);
		const perimeter = merge
			? [
					c === merge.column,
					c === merge.column + merge.colspan - 1,
					r === merge.row,
					r === merge.row + merge.rowspan - 1,
				]
			: [true, true, true, true];
		const borderId = borderFor(
			borderSides.map((side, index) =>
				data.cellBorders
					? data.cellBorders[r]?.[c]?.[side]
					: perimeter[index]
						? { style: "thin", color: "FFBFBFBF" }
						: undefined,
			),
		);
		const key = `${horizontal}:${vertical}:${heading}:${borderId}`;
		let id = ids.get(key);
		if (id === undefined) {
			id = formats.children.length;
			const format = styles.createElementNS(namespace, "xf");
			for (const name of ["numFmtId", "fontId", "fillId", "borderId", "xfId"])
				format.setAttribute(name, "0");
			format.setAttribute("applyAlignment", "1");
			format.setAttribute("borderId", String(borderId));
			format.setAttribute("applyBorder", "1");
			if (heading) {
				format.setAttribute("fontId", String(headingFontId));
				format.setAttribute("fillId", String(headingFillId));
				format.setAttribute("applyFont", "1");
				format.setAttribute("applyFill", "1");
			}
			const alignment = styles.createElementNS(namespace, "alignment");
			alignment.setAttribute("horizontal", horizontal);
			alignment.setAttribute("vertical", vertical);
			alignment.setAttribute("wrapText", "1");
			format.append(alignment);
			formats.append(format);
			ids.set(key, id);
		}
		cell.setAttribute("s", String(id));
	}
	formats.setAttribute("count", String(formats.children.length));
	borders.setAttribute("count", String(borders.children.length));
	for (const [path, doc] of [
		["xl/styles.xml", styles],
		["xl/worksheets/sheet1.xml", worksheet],
	] as const) {
		XLSX.CFB.utils.cfb_add(
			archive,
			`/${path}`,
			new TextEncoder().encode(new XMLSerializer().serializeToString(doc)),
		);
	}
	return Uint8Array.from(
		XLSX.CFB.write(archive, { fileType: "zip", type: "array" }),
	).buffer;
}
