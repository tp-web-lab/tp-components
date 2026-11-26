import type { TableData } from "./table-markup.js";
export const borderSides = ["left", "right", "top", "bottom"] as const;
export type TableCellBorders = Partial<
	Record<(typeof borderSides)[number], { style: string; color: string }>
>;
export const importedTableBorders = new WeakMap<
	HTMLTableElement,
	TableCellBorders[][]
>();
const cssStyles: Record<string, string> = {
	thin: "1px solid",
	medium: "2px solid",
	thick: "3px solid",
	double: "3px double",
	hair: "1px solid",
	dotted: "1px dotted",
	dashed: "1px dashed",
	dashDot: "1px dashed",
	dashDotDot: "1px dashed",
	mediumDashed: "2px dashed",
	mediumDashDot: "2px dashed",
	mediumDashDotDot: "2px dashed",
	slantDashDot: "2px dashed",
};
/** CSS projection of workbook edges; the original Excel line style is retained for re-export. */
export function tableBorderCss(
	data: TableData,
	row: number,
	column: number,
): string {
	if (!data.cellBorders) return "";
	const merge = data.merges?.find((m) => m.row === row && m.column === column);
	return borderSides
		.map((side) => {
			const candidates: (TableCellBorders | undefined)[] = [];
			if (merge && (side === "top" || side === "bottom")) {
				const r = side === "top" ? row : row + merge.rowspan - 1;
				for (let c = column; c < column + merge.colspan; c++)
					candidates.push(data.cellBorders?.[r]?.[c]);
			} else if (merge) {
				const c = side === "left" ? column : column + merge.colspan - 1;
				for (let r = row; r < row + merge.rowspan; r++)
					candidates.push(data.cellBorders?.[r]?.[c]);
			} else candidates.push(data.cellBorders?.[row]?.[column]);
			const edge =
				candidates.map((cell) => cell?.[side]).find(Boolean) ??
				data.cellBorders?.[row]?.[column]?.[side];
			return `border-${side}:${edge && cssStyles[edge.style] ? `${cssStyles[edge.style]} #${edge.color.slice(-6)}` : "none"}`;
		})
		.join(";");
}
