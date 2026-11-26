import { tableBorderCss } from "./table-borders.js";
import {
	type TableData,
	tableCellCovered,
	tableMergeAt,
} from "./table-markup.js";
/** Native tabularray rules for the same visible edges as HTML, including merged cells. */
export function tableLatexBorders(data: TableData): {
	definitions: string[];
	rules: string[];
} {
	const colors = new Set<string>();
	const edges = new Map<
		string,
		{ width: number; style: string; color: string }
	>();
	for (const [r, row] of data.cells.entries())
		for (const c of row.keys()) {
			if (tableCellCovered(data, r, c)) continue;
			const merge = tableMergeAt(data, r, c);
			const rows = merge?.rowspan ?? 1,
				cols = merge?.colspan ?? 1;
			for (const declaration of tableBorderCss(data, r, c).split(";")) {
				const match =
					/^border-(top|bottom|left|right):(\d+)px (solid|dashed|dotted|double) #([\da-f]{6})$/i.exec(
						declaration,
					);
				if (!match) continue;
				const [, side, width, style, color] = match;
				if (!color || !style) continue;
				colors.add(color);
				const horizontal = side === "top" || side === "bottom";
				const boundary = horizontal
					? side === "top"
						? r
						: r + rows
					: side === "left"
						? c
						: c + cols;
				for (let i = 0; i < (horizontal ? cols : rows); i++) {
					const key = `${horizontal ? "h" : "v"}line{${boundary + 1}}`;
					const segment = (horizontal ? c : r) + i + 1;
					const id = `${key}|${segment}`;
					const previous = edges.get(id);
					const rank = (v: { width: number; style: string }) =>
						v.width * 10 +
						({ double: 4, solid: 3, dashed: 2, dotted: 1 }[v.style] ?? 0);
					const next = { width: Number(width), style, color };
					if (!previous || rank(next) >= rank(previous)) edges.set(id, next);
				}
			}
		}
	return {
		definitions: [...colors].map(
			(c) => `\\definecolor{tpBorder${c}}{HTML}{${c}}`,
		),
		rules: [...edges].flatMap(([id, edge]) => {
			const [key, segment] = id.split("|");
			const double = edge.style === "double";
			const style = `wd=${double ? 0.75 : edge.width * 0.75}pt,fg=tpBorder${edge.color},dash=${double ? "solid" : edge.style}`;
			return double
				? [
						`${key}={1}{${segment}}{${style}}`,
						`${key}={2}{${segment}}{${style}}`,
					]
				: [`${key}={${segment}}{${style}}`];
		}),
	};
}
