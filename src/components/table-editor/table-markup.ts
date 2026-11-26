import { nativeMarkup } from "../../utilities/native-markup.js";
import { type TableCellBorders, tableBorderCss } from "./table-borders.js";
import { tableLatexBorders } from "./table-latex-borders.js";
import { tableRichLatex } from "./table-rich-latex.js";
import { tableRichMarkdown } from "./table-rich-markdown.js";
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
export type TableCellType =
	| "text"
	| "number"
	| "date"
	| "time"
	| "math"
	| "rich";
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
export type TableVerticalAlignment = "top" | "middle" | "bottom";
export interface TableData {
	/** Imported XLSX edges, including covered cells. */
	cellBorders?: TableCellBorders[][];
	/** Imported per-cell alignment overrides; column commands replace a whole column. */
	cellHorizontalAlignments?: TableAlignment[][];
	/** Vertical position of cell contents; absent entries use top. */
	cellVerticalAlignments?: TableVerticalAlignment[][];
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
/** Text fallback for formats without rich cell content. */
export function tableRichText(value: string): string {
	const template = document.createElement("template");
	template.innerHTML = value;
	for (const media of template.content.querySelectorAll("img,video,audio")) {
		media.replaceWith(
			media.getAttribute("alt") ||
				media.getAttribute("src") ||
				media.querySelector("source")?.getAttribute("src") ||
				"",
		);
	}
	for (const br of template.content.querySelectorAll("br"))
		br.replaceWith("\n");
	for (const block of template.content.querySelectorAll(
		"p,div,li,h1,h2,h3,blockquote",
	))
		block.append("\n");
	return template.content.textContent?.trim() ?? "";
}
export function tableSpreadsheetCells(data: TableData): string[][] {
	return data.cells.map((row, r) =>
		row.map((value, c) =>
			data.cellTypes?.[r]?.[c] === "rich" ? tableRichText(value) : value,
		),
	);
}
/** Normalize a single-line caption. */
export function tableText(value: string): string {
	return value.replace(/[\r\n\t]+/g, " ");
}
/** Preserve line breaks in literal cell contents. */
export function tableCellText(value: string): string {
	return value.replace(/\r\n?/g, "\n").replaceAll("\t", " ");
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
/** Add explicit borders without replacing a native table by HTML directives. */
export function withTableBorders(
	source: string,
	format: TableFormat,
	borders: string,
): string {
	if (
		!borders ||
		/(?:^\s*:cell-borders:|^[{[][^\n]*cell-borders=")/m.test(source)
	)
		return source;
	if (format === "markdown" && !source.startsWith("|")) return source;
	if (format === "asciidoc" && !source.includes("|===")) return source;
	if (format === "restructuredtext" && source.startsWith(".. html-table::"))
		return source;
	if (format === "markdown") return `${source}\n{cell-borders="${borders}"}`;
	if (format === "asciidoc")
		return source.replace(/^\[/m, `[cell-borders="${borders}",`);
	if (format === "restructuredtext") {
		if (!/^\.\. (?:list-table|table)::/.test(source))
			source = `.. table::\n\n${source
				.split("\n")
				.map((line) => `   ${line}`)
				.join("\n")}`;
		return source.replace(/^(.*)\n/, `$1\n   :cell-borders: ${borders}\n`);
	}
	return source;
}
/** Serialize cell content, structure and explicit table formatting. */
export function serializeTable(data: TableData, format: TableFormat): string {
	const source = serializeTableContent(data, format);
	if (
		!data.cellBorders ||
		!["markdown", "asciidoc", "restructuredtext"].includes(format)
	)
		return source;
	const borders = data.cells
		.flatMap((row, r) =>
			row.flatMap((_value, c) =>
				tableCellCovered(data, r, c)
					? []
					: tableBorderCss(data, r, c)
							.split(";")
							.map((rule) => `${r + 1},${c + 1}/${rule.replace(":", "=")}`),
			),
		)
		.join("; ");
	return withTableBorders(source, format, borders);
}
function serializeTableContent(data: TableData, format: TableFormat): string {
	const { header, caption, alignments } = data;
	const rstCellOptions = data.cells.flatMap((row, r) =>
		row.flatMap((_value, c) => {
			if (tableCellCovered(data, r, c)) return [];
			const horizontal =
				data.cellHorizontalAlignments?.[r]?.[c] ?? alignments[c] ?? "left";
			const vertical = data.cellVerticalAlignments?.[r]?.[c] ?? "top";
			return horizontal === "left" && vertical === "top"
				? []
				: [`${r + 1},${c + 1}=${horizontal}/${vertical}`];
		}),
	);
	const decorateRst = (source: string): string => {
		if (!rstCellOptions.length) return source;
		if (!/^\.\. (?:list-table|table)::/.test(source))
			source = `.. table::\n\n${source
				.split("\n")
				.map((line) => `   ${line}`)
				.join("\n")}`;
		return source.replace(
			/^(.*)\n/,
			`$1\n   :cell-alignments: ${rstCellOptions.join("; ")}\n`,
		);
	};
	const cells = data.cells.map((row, r) =>
		row.map((value, c) => {
			if (data.cellTypes?.[r]?.[c] !== "rich") return value;
			const template = document.createElement("template");
			template.innerHTML = value;
			for (const media of template.content.querySelectorAll<HTMLElement>(
				"img,video,audio",
			))
				for (const dimension of ["width", "height"]) {
					const size = media.getAttribute(dimension);
					if (
						size &&
						/^\d+(?:\.\d+)?$/.test(size) &&
						!media.style.getPropertyValue(dimension)
					)
						media.style.setProperty(dimension, `${size}px`);
				}
			return template.innerHTML;
		}),
	);
	const rich = data.cellTypes?.some((row) => row.includes("rich"));
	const richPackages = rich
		? [
				"\\usepackage{graphicx}",
				"\\usepackage{hyperref}",
				"\\usepackage{multimedia}",
				"\\usepackage{listings,enumitem,amsmath,csquotes}",
				"\\usepackage{xcolor}",
				"\\usepackage[normalem]{ulem}",
			]
		: [];
	const multiline = cells.some((row) =>
		row.some((value) => value.includes("\n")),
	);
	const vertical = (row: number, column: number): TableVerticalAlignment =>
		data.cellVerticalAlignments?.[row]?.[column] ?? "top";
	const styled =
		!!data.cellVerticalAlignments || !!data.cellHorizontalAlignments;
	const horizontal = (r: number, c: number) =>
		data.cellHorizontalAlignments?.[r]?.[c] ?? alignments[c] ?? "left";
	const widths = data.columnWidths?.map((width) =>
		Number.isFinite(width) && width > 0 ? width : 160,
	);

	const richMarkdown =
		format === "markdown"
			? cells.map((row, r) =>
					row.map((value, c) =>
						data.cellTypes?.[r]?.[c] === "rich"
							? tableRichMarkdown(data.cells[r]?.[c] ?? value)
							: "",
					),
				)
			: [];
	const complexRichMarkdown = richMarkdown.some((row, r) =>
		row.some(
			(value, c) => data.cellTypes?.[r]?.[c] === "rich" && value === undefined,
		),
	);
	if (
		(widths || (format === "markdown" && complexRichMarkdown)) &&
		(format === "markdown" || format === "restructuredtext")
	)
		return nativeMarkup(
			format === "markdown" ? "md" : "rst",
			serializeTable(data, "html"),
		);

	const cell = (value: string, row: number, column: number): string => {
		if (data.cellTypes?.[row]?.[column] === "rich") {
			if (format === "html") return value;
			if (format === "restructuredtext") {
				const source: string = nativeMarkup("rst", value);
				const fragment = document.createElement("template");
				fragment.innerHTML = value;
				return fragment.content.querySelector("br") &&
					!fragment.content.querySelector(
						"p,div,ul,ol,table,pre,img,audio,video,script",
					)
					? source
							.split("\n")
							.map((line) => `| ${line}`)
							.join("\n")
					: source;
			}
			if (format === "markdown") return richMarkdown[row]?.[column] ?? "";
			if (format === "asciidoc")
				return nativeMarkup("adoc", value).replaceAll("|", "\\|");
			if (format === "latex") return tableRichLatex(value, latex);
			value = tableRichText(value);
		}
		const escapeText = {
			html: escapeTableHtml,
			markdown,
			asciidoc,
			restructuredtext: rst,
			latex,
		}[format];
		if (data.cellTypes?.[row]?.[column] !== "math" || !value)
			return value
				.split("\n")
				.map(escapeText)
				.join(
					format === "html" || format === "markdown"
						? "<br>"
						: format === "asciidoc"
							? " +\n"
							: format === "latex"
								? "\\newline{}"
								: "\n",
				);
		const mode = data.cellMathModes?.[row]?.[column] ?? "latexmath";
		const display =
			mode === "latexmath" && value.startsWith("\\[") && value.endsWith("\\]");
		const wrapped =
			mode === "latexmath" &&
			((value.startsWith("\\(") && value.endsWith("\\)")) || display);
		const source = tableText(wrapped ? value.slice(2, -2).trim() : value);
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
					const vertical = `;vertical-align:${data.cellVerticalAlignments?.[index]?.[column] ?? "top"}`;
					return `<${tag}${span}${data.cellTypes?.[index]?.[column] === "rich" ? ' data-type="rich"' : ""}${tag === "th" ? ' scope="col"' : ""} style="text-align:${horizontal(index, column)}${vertical}${data.cellBorders ? `;${tableBorderCss(data, index, column)}` : ""}">${cell(value, index, column)}</${tag}>`;
				})
				.join("")}</tr>`;
		return [
			widths
				? `<table style="table-layout:fixed;width:${widths.reduce((a, b) => a + b, 0)}px;min-width:${widths.reduce((a, b) => a + b, 0)}px">`
				: "<table>",
			...(widths
				? [
						`<colgroup>${widths.map((width) => `<col style="width:${width}px">`).join("")}</colgroup>`,
					]
				: []),
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
	if (
		(data.merges?.length ||
			multiline ||
			styled ||
			widths ||
			rich ||
			data.cellBorders) &&
		format === "latex"
	) {
		const borders = tableLatexBorders(data);
		const rows = cells.map(
			(values, row) =>
				`${values
					.map((value, column) => {
						if (tableCellCovered(data, row, column)) return "";
						const merge = tableMergeAt(data, row, column);
						const align =
							horizontal(row, column) === "right"
								? "r"
								: horizontal(row, column) === "center"
									? "c"
									: "l";
						const valign =
							vertical(row, column) === "bottom"
								? "b"
								: vertical(row, column) === "middle"
									? "m"
									: "t";
						return `\\SetCell${merge ? `[r=${merge.rowspan},c=${merge.colspan}]` : ""}{halign=${align},valign=${valign}} {${cell(value, row, column)}}`;
					})
					.join(" & ")} \\\\`,
		);
		return [
			...richPackages,
			"\\usepackage{tabularray}",
			...(data.cellBorders
				? ["\\usepackage{xcolor}", ...borders.definitions]
				: []),
			...(caption ? ["\\begin{table}"] : []),
			"\\begin{tblr}{",
			`  colspec={${alignments.map((value, column) => `Q[${value === "right" ? "r" : value === "center" ? "c" : "l"}${widths ? `,wd=${(widths[column] ?? 160) * 0.75}pt` : ""}]`).join(" ")}},`,
			`  ${[...(data.cellBorders ? borders.rules : ["hlines", "vlines"]), ...(header ? ["row{1}={font=\\bfseries}"] : [])].join(",\n  ")}`,
			"}",
			...rows,
			"\\end{tblr}",
			...(caption ? [`\\caption{${latex(caption)}}`, "\\end{table}"] : []),
		].join("\n");
	}
	if (data.merges?.length && format === "restructuredtext") {
		// Draw each visible cell's rectangle; missing internal rules express grid-table spans.
		const values = cells.map((values, row) =>
			values.map((value, column) => {
				const content = cell(value, row, column);
				return data.cellTypes?.[row]?.[column] !== "rich" &&
					value.includes("\n")
					? content
							.split("\n")
							.map((line) => `| ${line}`)
							.join("\n")
					: content;
			}),
		);
		if (header && values.length === 1) values.push(alignments.map(() => ""));
		const widths = alignments.map((_, column) =>
			Math.max(
				3,
				...values.map((row, index) =>
					tableCellCovered(data, index, column)
						? 0
						: Math.max(
								...(row[column] ?? "").split("\n").map((line) => line.length),
							) + 2,
				),
			),
		);
		const xs = [0];
		for (const width of widths) xs.push((xs.at(-1) ?? 0) + width + 1);
		const ys = [0];
		for (const row of values)
			ys.push(
				(ys.at(-1) ?? 0) +
					Math.max(1, ...row.map((value) => value.split("\n").length)) +
					1,
			);
		const grid = Array.from({ length: (ys.at(-1) ?? 0) + 1 }, () =>
			Array<string>((xs.at(-1) ?? 0) + 1).fill(" "),
		);
		values.forEach((values, row) => {
			values.forEach((value, column) => {
				if (tableCellCovered(data, row, column)) return;
				const merge = tableMergeAt(data, row, column);
				const left = xs[column] ?? 0,
					right = xs[column + (merge?.colspan ?? 1)] ?? 0;
				const top = ys[row] ?? 0,
					bottom = ys[row + (merge?.rowspan ?? 1)] ?? 0;
				for (const y of [top, bottom]) {
					for (let x = left + 1; x < right; x++)
						if (grid[y]?.[x] !== "+")
							grid[y]?.splice(x, 1, header && y === ys[1] ? "=" : "-");
					grid[y]?.splice(left, 1, "+");
					grid[y]?.splice(right, 1, "+");
				}
				for (let y = top + 1; y < bottom; y++) {
					grid[y]?.splice(left, 1, grid[y]?.[left] === "+" ? "+" : "|");
					grid[y]?.splice(right, 1, grid[y]?.[right] === "+" ? "+" : "|");
				}
				value.split("\n").forEach((line, lineIndex) => {
					for (let i = 0; i < line.length; i++)
						grid[top + 1 + lineIndex]?.splice(left + 2 + i, 1, line[i] ?? "");
				});
			});
		});
		const lines = grid.map((row) => row.join(""));
		return decorateRst(
			caption
				? `.. table:: ${rst(caption)}\n\n${lines.map((line) => `   ${line}`).join("\n")}`
				: lines.join("\n"),
		);
	}

	if (format === "markdown") {
		const row = (values: string[], index: number): string => {
			let result = "|";
			values.forEach((value, column) => {
				const merge = tableMergeAt(data, index, column);
				if (merge && column !== merge.column) return;
				const content =
					merge && index !== merge.row
						? "^^"
						: `${styled && index >= 0 ? `[${data.cellHorizontalAlignments ? `${horizontal(index, column) === "right" ? "-:" : horizontal(index, column) === "center" ? ":-:" : ":-"},` : ""}${vertical(index, column) === "bottom" ? "v" : vertical(index, column) === "middle" ? "=" : "^"}] ` : ""}${cell(value, index, column)}`;
				result += ` ${content} ${"|".repeat(merge?.colspan ?? 1)}`;
			});
			return result;
		};
		return [
			...(header ? [row(cells[0] ?? [], 0)] : []),
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
			`[cols="${alignments.map((value, column) => `${value === "center" ? "^" : value === "right" ? ">" : "<"}${widths ? (widths[column] ?? 160) : ""}`).join(",")}",options="${[header ? "header" : "noheader", ...(!widths ? ["autowidth"] : [])].join(",")}"]`,
			"|===",
			...cells.flatMap((row, index) => [
				row
					.map((value, column) => {
						if (tableCellCovered(data, index, column)) return "";
						const merge = tableMergeAt(data, index, column);
						const span = merge ? `${merge.colspan}.${merge.rowspan}+` : "";
						const valign = vertical(index, column);
						const alignment =
							valign === "middle" ? ".^" : valign === "bottom" ? ".>" : ".<";
						return `${span}${data.cellHorizontalAlignments ? (horizontal(index, column) === "right" ? ">" : horizontal(index, column) === "center" ? "^" : "<") : ""}${alignment}${data.cellTypes?.[index]?.[column] === "rich" ? "a" : ""}|${cell(value, index, column)}`;
					})
					.filter(Boolean)
					.join("\n"),
				"",
			]),
			"|===",
		].join("\n");
	}
	if (format === "restructuredtext") {
		const rows = cells.map((row, r) =>
			row.map((value, c) => {
				const content = cell(value, r, c);
				return data.cellTypes?.[r]?.[c] !== "rich" && value.includes("\n")
					? content
							.split("\n")
							.map((line) => `| ${line}`)
							.join("\n")
					: content;
			}),
		);
		if (header && rows.length === 1) rows.push(alignments.map(() => ""));
		return decorateRst(
			[
				`.. list-table::${caption ? ` ${rst(caption)}` : ""}`,
				`   :header-rows: ${header ? 1 : 0}`,
				"",
				...rows.flatMap((row) =>
					row.flatMap((content, c) => {
						const lines = content.split("\n");
						if (lines[0]?.startsWith(".. ")) lines.unshift("");
						return [
							`   ${c === 0 ? "* -" : "  -"}${lines[0] ? ` ${lines[0]}` : ""}`,
							...lines.slice(1).map((line) => (line ? `       ${line}` : "")),
							"",
						];
					}),
				),
			].join("\n"),
		);
	}

	const columns = alignments
		.map((value) => (value === "center" ? "c" : value === "right" ? "r" : "l"))
		.join("|");
	return [
		...(caption ? ["\\begin{table}"] : []),
		`\\begin{tabular}{|${columns}|}`,
		"\\hline",
		...cells.flatMap((row, index) => [
			`${row.map((value, column) => (header && index === 0 && !["math", "rich"].includes(data.cellTypes?.[index]?.[column] ?? "text") ? `\\textbf{${latex(tableText(value))}}` : cell(value, index, column))).join(" & ")} \\\\`,
			"\\hline",
		]),
		"\\end{tabular}",
		...(caption ? [`\\caption{${latex(caption)}}`, "\\end{table}"] : []),
	].join("\n");
}
