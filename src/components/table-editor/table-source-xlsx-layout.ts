import type * as Xlsx from "xlsx";
import {
	borderSides,
	importedTableBorders,
	type TableCellBorders,
} from "./table-borders.js";

/** Transfer workbook column dimensions and explicit cell alignment to inert HTML. */
export function xlsxTableLayout(
	table: HTMLTableElement,
	sheet: Xlsx.WorkSheet,
	source: ArrayBuffer,
	XLSX: typeof Xlsx,
): void {
	const archive = XLSX.CFB.read(new Uint8Array(source), { type: "array" });
	const xml = (path: string): XMLDocument | undefined => {
		const entry = XLSX.CFB.find(archive, `/${path}`);
		return entry
			? new DOMParser().parseFromString(
					new TextDecoder().decode(entry.content),
					"application/xml",
				)
			: undefined;
	};
	const workbook = xml("xl/workbook.xml");
	const id = workbook?.getElementsByTagName("sheet")[0]?.getAttribute("r:id");
	const relations = xml("xl/_rels/workbook.xml.rels");
	const target = Array.from(
		relations?.getElementsByTagName("Relationship") ?? [],
	)
		.find((rel) => rel.getAttribute("Id") === id)
		?.getAttribute("Target");
	const path = target
		? new URL(target, "https://xlsx.invalid/xl/workbook.xml").pathname.slice(1)
		: "xl/worksheets/sheet1.xml";
	const worksheet = xml(path);
	const styleDocument = xml("xl/styles.xml");
	const formats = styleDocument?.getElementsByTagName("cellXfs")[0];
	const fonts = styleDocument?.getElementsByTagName("fonts")[0];
	const fills = styleDocument?.getElementsByTagName("fills")[0];
	const theme = xml("xl/theme/theme1.xml");
	const grayFill = (fill: Element | undefined): boolean => {
		const pattern = fill?.getElementsByTagName("patternFill")[0];
		if (pattern?.getAttribute("patternType") !== "solid") return false;
		const color = pattern.getElementsByTagName("fgColor")[0];
		let rgb = color?.getAttribute("rgb")?.slice(-6);
		if (!rgb && color?.hasAttribute("theme")) {
			const names = [
				"lt1",
				"dk1",
				"lt2",
				"dk2",
				"accent1",
				"accent2",
				"accent3",
				"accent4",
				"accent5",
				"accent6",
				"hlink",
				"folHlink",
			];
			const name = names[Number(color.getAttribute("theme"))];
			const item = name
				? theme?.getElementsByTagNameNS("*", name)[0]?.firstElementChild
				: undefined;
			rgb =
				item?.getAttribute("lastClr") ?? item?.getAttribute("val") ?? undefined;
		}
		if (!rgb)
			rgb = (
				{ 22: "C0C0C0", 23: "808080", 55: "969696" } as Record<string, string>
			)[color?.getAttribute("indexed") ?? ""];
		if (!rgb || !/^[a-f\d]{6}$/i.test(rgb)) return false;
		const tint = Number(color?.getAttribute("tint") ?? 0);
		const channels = [0, 2, 4].map((i) => {
			const value = Number.parseInt(rgb.slice(i, i + 2), 16);
			return tint < 0 ? value * (1 + tint) : value + (255 - value) * tint;
		});
		return (
			Math.max(...channels) - Math.min(...channels) <= 16 &&
			Math.min(...channels) > 0 &&
			Math.max(...channels) < 250
		);
	};
	const headingCells: boolean[] = [];
	const styles = new Map(
		Array.from(worksheet?.getElementsByTagName("c") ?? []).map((cell) => [
			cell.getAttribute("r"),
			Number(cell.getAttribute("s") ?? "0"),
		]),
	);
	const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1");
	const borders = styleDocument?.getElementsByTagName("borders")[0];
	const matrix: TableCellBorders[][] = [];
	for (let r = range.s.r; r <= range.e.r; r++) {
		const row: TableCellBorders[] = [];
		for (let c = range.s.c; c <= range.e.c; c++) {
			const index = styles.get(XLSX.utils.encode_cell({ r, c })) ?? 0;
			const border =
				borders?.children[
					Number(formats?.children[index]?.getAttribute("borderId") ?? 0)
				];
			const edges: TableCellBorders = {};
			for (const side of borderSides) {
				const edge = border?.getElementsByTagName(side)[0];
				const style = edge?.getAttribute("style");
				if (!style || style === "none") continue;
				const color = edge?.getElementsByTagName("color")[0];
				let rgb = color?.getAttribute("rgb")?.slice(-6);
				if (!rgb && color?.hasAttribute("theme")) {
					const names = [
						"lt1",
						"dk1",
						"lt2",
						"dk2",
						"accent1",
						"accent2",
						"accent3",
						"accent4",
						"accent5",
						"accent6",
						"hlink",
						"folHlink",
					];
					const name = names[Number(color.getAttribute("theme"))];
					const item = name
						? theme?.getElementsByTagNameNS("*", name)[0]?.firstElementChild
						: undefined;
					rgb =
						item?.getAttribute("lastClr") ??
						item?.getAttribute("val") ??
						undefined;
				}
				if (!rgb && color?.hasAttribute("indexed")) {
					const index = Number(color.getAttribute("indexed"));
					const palette =
						"000000 FFFFFF FF0000 00FF00 0000FF FFFF00 FF00FF 00FFFF 000000 FFFFFF FF0000 00FF00 0000FF FFFF00 FF00FF 00FFFF 800000 008000 000080 808000 800080 008080 C0C0C0 808080 9999FF 993366 FFFFCC CCFFFF 660066 FF8080 0066CC CCCCFF 000080 FF00FF FFFF00 00FFFF 800080 800000 008080 0000FF 00CCFF CCFFFF CCFFCC FFFF99 99CCFF FF99CC CC99FF FFCC99 3366FF 33CCCC 99CC00 FFCC00 FF9900 FF6600 666699 969696 003366 339966 003300 333300 993300 993366 333399 333333".split(
							" ",
						);
					rgb =
						styleDocument
							?.getElementsByTagName("indexedColors")[0]
							?.children[index]?.getAttribute("rgb")
							?.slice(-6) ?? palette[index];
				}
				if (!rgb || !/^[a-f\d]{6}$/i.test(rgb)) rgb = "000000";
				const tint = Number(color?.getAttribute("tint") ?? 0);
				const baseRgb = rgb;
				rgb = [0, 2, 4]
					.map((i) => {
						const n = Number.parseInt(baseRgb.slice(i, i + 2), 16);
						return Math.round(
							Math.max(
								0,
								Math.min(255, tint < 0 ? n * (1 + tint) : n + (255 - n) * tint),
							),
						)
							.toString(16)
							.padStart(2, "0");
					})
					.join("")
					.toUpperCase();
				edges[side] = { style, color: `FF${rgb}` };
			}
			row.push(edges);
		}
		matrix.push(row);
	}
	importedTableBorders.set(table, matrix);
	const group = table.ownerDocument.createElement("colgroup");
	let hasWidth = false;
	for (let c = range.s.c; c <= range.e.c; c++) {
		const col = table.ownerDocument.createElement("col");
		const size = sheet["!cols"]?.[c];
		const width = size?.wpx;
		if (width !== undefined && Number.isFinite(width) && width > 0) {
			col.style.width = `${width}px`;
			hasWidth = true;
		}
		group.append(col);
	}
	if (hasWidth) table.prepend(group);
	const occupied = new Set<string>();
	for (const [rowIndex, row] of Array.from(table.rows).entries()) {
		const r = rowIndex + range.s.r;
		let c = range.s.c;
		for (const cell of Array.from(row.cells)) {
			while (occupied.has(`${r}:${c}`)) c++;
			const index = styles.get(XLSX.utils.encode_cell({ r, c }));
			const alignment =
				index === undefined
					? undefined
					: formats?.children[index]?.getElementsByTagName("alignment")[0];
			if (rowIndex === 0 && cell.textContent?.trim()) {
				const format =
					index === undefined ? undefined : formats?.children[index];
				const bold =
					fonts?.children[
						Number(format?.getAttribute("fontId") ?? 0)
					]?.getElementsByTagName("b")[0];
				const fill =
					fills?.children[Number(format?.getAttribute("fillId") ?? 0)];
				headingCells.push(
					!!bold &&
						!["0", "false", "off"].includes(bold.getAttribute("val") ?? "") &&
						grayFill(fill) &&
						cell.rowSpan === 1,
				);
			}
			const horizontal = alignment?.getAttribute("horizontal");
			const vertical = alignment?.getAttribute("vertical");
			if (horizontal && ["left", "center", "right"].includes(horizontal))
				cell.style.textAlign = horizontal;
			if (vertical && ["top", "center", "bottom"].includes(vertical))
				cell.style.verticalAlign = vertical === "center" ? "middle" : vertical;
			for (let y = r; y < r + cell.rowSpan; y++)
				for (let x = c; x < c + cell.colSpan; x++) occupied.add(`${y}:${x}`);
			c += cell.colSpan;
		}
	}
	if (headingCells.length && headingCells.every(Boolean)) {
		for (const cell of Array.from(table.rows[0]?.cells ?? [])) {
			const heading = table.ownerDocument.createElement("th");
			for (const attr of Array.from(cell.attributes))
				heading.setAttribute(attr.name, attr.value);
			heading.textContent = cell.textContent;
			heading.setAttribute("scope", "col");
			cell.replaceWith(heading);
		}
	}
}
