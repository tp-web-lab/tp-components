/** Table serialization shared by the editor and its export actions. */
export const tableFormats = [
	"html",
	"markdown",
	"asciidoc",
	"restructuredtext",
	"latex",
] as const;
export type TableFormat = (typeof tableFormats)[number];
export type TableAlignment = "left" | "center" | "right";
export type TableCellType = "text" | "number" | "date" | "time" | "math";
export interface TableMerge {
	row: number;
	column: number;
	rowspan: number;
	colspan: number;
}
/** Returns the merged region containing a logical cell, if any. */
export function tableMergeAt(
	data: TableData,
	row: number,
	column: number,
): TableMerge | undefined {
	return data.merges?.find(
		(m) =>
			row >= m.row &&
			row < m.row + m.rowspan &&
			column >= m.column &&
			column < m.column + m.colspan,
	);
}
/** Covered cells retain their contents but are not rendered. */
export function tableCellCovered(
	data: TableData,
	row: number,
	column: number,
): boolean {
	const merge = tableMergeAt(data, row, column);
	return !!merge && (merge.row !== row || merge.column !== column);
}
export interface TableData {
	/** Non-overlapping rectangular merges; all underlying values and types are retained. */
	merges?: TableMerge[];
	/** User-sized editor columns in CSS pixels; omitted for automatic layout. */
	columnWidths?: number[];
	/** Optional editor field types; absent entries are text cells. */
	cellTypes?: TableCellType[][];
	/** Input notation of math cells; absent entries use LaTeX. */
	cellMathModes?: ("latexmath" | "asciimath")[][];
	cells: string[][];
	header: boolean;
	caption: string;
	alignments: TableAlignment[];
	/** Columns whose alignment was explicitly chosen rather than inferred. */
	explicitAlignments?: boolean[];
}
export const tableFileExtensions: Record<TableFormat, string> = {
	html: "html",
	markdown: "md",
	asciidoc: "adoc",
	restructuredtext: "rst",
	latex: "tex",
};
export function escapeTableHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}
/** Cells contain single-line literal text, never executable markup. */
export function tableText(value: string): string {
	return value.replace(/[\r\n\t]+/g, " ");
}
function markdown(value: string): string {
	return escapeTableHtml(value).replace(
		/[\\`*_[\]{}!#|~^]/g,
		(character) => `&#${character.charCodeAt(0)};`,
	);
}
function asciidoc(value: string): string {
	return escapeTableHtml(value).replace(
		/[\\*_[\]{}+`#|^~:]/g,
		(character) => `&#${character.charCodeAt(0)};`,
	);
}
function rst(value: string): string {
	return value.replace(/[!-/:-@[-`{-~]/g, (character) => `\\${character}`);
}

function latex(value: string): string {
	const escapes: Record<string, string> = {
		"\\": "\\textbackslash{}",
		"~": "\\textasciitilde{}",
		"^": "\\textasciicircum{}",
	};
	return value.replace(
		/[\\{}$&#%_~^]/g,
		(character) => escapes[character] ?? `\\${character}`,
	);
}
/** Serialize literal cell text, header, caption and supported column alignments. */
export function serializeTable(data: TableData, format: TableFormat): string {
	const { cells, header, caption, alignments } = data;
	const cell = (value: string, row: number, column: number): string => {
		const escapeText = {
			html: escapeTableHtml,
			markdown,
			asciidoc,
			restructuredtext: rst,
			latex,
		}[format];
		if (data.cellTypes?.[row]?.[column] !== "math" || !value)
			return escapeText(value);
		const mode = data.cellMathModes?.[row]?.[column] ?? "latexmath";
		const display =
			mode === "latexmath" && value.startsWith("\\[") && value.endsWith("\\]");
		const wrapped =
			mode === "latexmath" &&
			((value.startsWith("\\(") && value.endsWith("\\)")) || display);
		const source = wrapped ? value.slice(2, -2).trim() : value;
		if (format === "html")
			return `<tp-math mode="${mode}" value="${escapeTableHtml(source)}"${display ? " displaystyle" : ""}></tp-math>`;
		if (format === "markdown") {
			const ticks = "`".repeat(
				Math.max(
					0,
					...Array.from(source.matchAll(/`+/g), (match) => match[0].length),
				) + 1,
			);
			return `:tp-math:${ticks} ${source} ${ticks}{mode="${mode}"${display ? " displaystyle" : ""}}`;
		}
		if (format === "asciidoc")
			return `${mode}:[${source.replaceAll("|", "\\|").replaceAll("]", "\\]")}]`;
		if (format === "restructuredtext")
			return `:${mode === "latexmath" ? "math" : mode}:\`${source.replaceAll("`", "\\`")}\``;
		if (mode === "asciimath") {
			const delimiter = ["|", "!", ";", ":", "/", "@"].find(
				(char) => !source.includes(char),
			);
			if (!delimiter)
				throw new Error("No available delimiter for the AsciiMath source.");
			return `\\wcTpMath[mode=asciimath]{\\wcScript[type=tp/math]${delimiter}${source}${delimiter}}`;
		}
		return display ? `\\[${source}\\]` : `\\(${source}\\)`;
	};

	if (format === "html") {
		const row = (values: string[], index: number): string =>
			`    <tr>${values
				.map((value, column) => {
					if (tableCellCovered(data, index, column)) return "";
					const merge = tableMergeAt(data, index, column);
					const span = merge
						? ` rowspan="${merge.rowspan}" colspan="${merge.colspan}"`
						: "";
					const tag = header && index === 0 ? "th" : "td";
					return `<${tag}${span}${tag === "th" ? ' scope="col"' : ""} style="text-align:${alignments[column] ?? "left"}">${cell(value, index, column)}</${tag}>`;
				})
				.join("")}</tr>`;
		return [
			"<table>",
			...(caption ? [`  <caption>${escapeTableHtml(caption)}</caption>`] : []),
			...(header ? ["  <thead>", row(cells[0] ?? [], 0), "  </thead>"] : []),
			"  <tbody>",
			...cells
				.slice(header ? 1 : 0)
				.map((values, index) => row(values, index + (header ? 1 : 0))),
			"  </tbody>",
			"</table>",
		].join("\n");
	}
	if (data.merges?.length && format === "latex") {
		const rows = cells.map(
			(values, row) =>
				`\\wcTr{${values
					.map((value, column) => {
						if (tableCellCovered(data, row, column)) return "";
						const merge = tableMergeAt(data, row, column);
						const tag = header && row === 0 ? "Th" : "Td";
						return `\\wc${tag}[style=text-align:${alignments[column] ?? "left"}${merge ? `,rowspan=${merge.rowspan},colspan=${merge.colspan}` : ""}]{${cell(value, row, column)}}`;
					})
					.join("")}}`,
		);
		return `\\wcTable{${caption ? `\\wcCaption{${latex(caption)}}` : ""}\n${rows.join("\n")}\n}`;
	}
	if (data.merges?.length && format === "restructuredtext") {
		// Draw each visible cell's rectangle; missing internal rules express grid-table spans.
		const values = cells.map((values, row) =>
			values.map((value, column) => cell(value, row, column)),
		);
		if (header && values.length === 1) values.push(alignments.map(() => ""));
		const widths = alignments.map((_, column) =>
			Math.max(
				3,
				...values.map((row, index) =>
					tableCellCovered(data, index, column)
						? 0
						: (row[column]?.length ?? 0) + 2,
				),
			),
		);
		const xs = [0];
		for (const width of widths) xs.push((xs.at(-1) ?? 0) + width + 1);
		const grid = Array.from({ length: values.length * 2 + 1 }, () =>
			Array<string>((xs.at(-1) ?? 0) + 1).fill(" "),
		);
		values.forEach((values, row) => {
			values.forEach((value, column) => {
				if (tableCellCovered(data, row, column)) return;
				const merge = tableMergeAt(data, row, column);
				const left = xs[column] ?? 0,
					right = xs[column + (merge?.colspan ?? 1)] ?? 0;
				const top = row * 2,
					bottom = (row + (merge?.rowspan ?? 1)) * 2;
				for (const y of [top, bottom]) {
					for (let x = left + 1; x < right; x++)
						if (grid[y]?.[x] !== "+")
							grid[y]?.splice(x, 1, header && y === 2 ? "=" : "-");
					grid[y]?.splice(left, 1, "+");
					grid[y]?.splice(right, 1, "+");
				}
				for (let y = top + 1; y < bottom; y++) {
					grid[y]?.splice(left, 1, grid[y]?.[left] === "+" ? "+" : "|");
					grid[y]?.splice(right, 1, grid[y]?.[right] === "+" ? "+" : "|");
				}
				for (let i = 0; i < value.length; i++)
					grid[top + 1]?.splice(left + 2 + i, 1, value[i] ?? "");
			});
		});
		const lines = grid.map((row) => row.join(""));
		return caption
			? `.. table:: ${rst(caption)}\n\n${lines.map((line) => `   ${line}`).join("\n")}`
			: lines.join("\n");
	}

	if (format === "markdown") {
		const row = (values: string[], index: number): string => {
			let result = "|";
			values.forEach((value, column) => {
				const merge = tableMergeAt(data, index, column);
				if (merge && column !== merge.column) return;
				result += ` ${merge && index !== merge.row ? "^^" : cell(value, index, column)} ${"|".repeat(merge?.colspan ?? 1)}`;
			});
			return result;
		};
		return [
			row(
				header ? (cells[0] ?? []) : alignments.map(() => ""),
				header ? 0 : -1,
			),
			`| ${alignments.map((value) => (value === "center" ? ":---:" : value === "right" ? "---:" : ":---")).join(" | ")} |`,
			...cells
				.slice(header ? 1 : 0)
				.map((values, index) => row(values, index + (header ? 1 : 0))),
			...(caption ? [`[${markdown(caption)}]`] : []),
		].join("\n");
	}
	if (format === "asciidoc") {
		return [
			...(caption ? [`.${asciidoc(caption)}`] : []),
			`[cols="${alignments.map((value) => (value === "center" ? "^" : value === "right" ? ">" : "<")).join(",")}"${header ? ',options="header"' : ""}]`,
			"|===",
			...cells.flatMap((row, index) => [
				row
					.map((value, column) => {
						if (tableCellCovered(data, index, column)) return "";
						const merge = tableMergeAt(data, index, column);
						const span = merge ? `${merge.colspan}.${merge.rowspan}+` : "";
						return `${span}|${cell(value, index, column)}`;
					})
					.filter(Boolean)
					.join("\n"),
				"",
			]),
			"|===",
		].join("\n");
	}
	if (format === "restructuredtext") {
		const rows = cells.map((row, index) =>
			row.map((value, column) => cell(value, index, column)),
		);
		// Docutils requires at least one body row after a header.
		if (header && rows.length === 1) rows.push(alignments.map(() => ""));
		return [
			`.. list-table::${caption ? ` ${rst(caption)}` : ""}`,
			`   :header-rows: ${header ? 1 : 0}`,
			"",
			...rows.flatMap((row) =>
				row.map(
					(cell, index) =>
						`   ${index === 0 ? "* -" : "  -"}${cell ? ` ${cell}` : ""}`,
				),
			),
		].join("\n");
	}

	const columns = alignments
		.map((value) => (value === "center" ? "c" : value === "right" ? "r" : "l"))
		.join("|");
	return [
		...(caption ? ["\\begin{table}", "\\centering"] : []),
		`\\begin{tabular}{|${columns}|}`,
		"\\hline",
		...cells.flatMap((row, index) => [
			`${row.map((value, column) => (header && index === 0 && data.cellTypes?.[index]?.[column] !== "math" ? `\\textbf{${latex(value)}}` : cell(value, index, column))).join(" & ")} \\\\`,
			"\\hline",
		]),
		"\\end{tabular}",
		...(caption ? [`\\caption{${latex(caption)}}`, "\\end{table}"] : []),
	].join("\n");
}
