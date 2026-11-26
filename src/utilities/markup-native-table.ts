import { tableCellBorders, tableWidthSpec } from "@tp/tp-utilities";
import {
	serializeTable,
	type TableAlignment,
	type TableData,
	type TableFormat,
	type TableVerticalAlignment,
	withTableBorders,
} from "../components/table-editor/table-markup.js";

/** Native tables when structural attributes have a lossless table-model equivalent. */
export function markupNativeTable(
	table: HTMLTableElement,
	format: TableFormat,
): string | undefined {
	table = table.cloneNode(true) as HTMLTableElement;
	const bodyHeadings = [...table.rows]
		.slice(1)
		.flatMap((row) => [...row.cells])
		.filter((cell) => cell.localName === "th");
	if (
		format === "asciidoc" &&
		bodyHeadings.length &&
		[...table.querySelectorAll("td,th")].every(
			(cell) => !cell.children.length && !cell.textContent?.includes("\n"),
		)
	) {
		const markers = [...table.querySelectorAll("th,td")].map((cell) =>
			bodyHeadings.includes(cell as HTMLTableCellElement),
		);
		for (const cell of bodyHeadings) {
			const replacement = table.ownerDocument.createElement("td");
			for (const attribute of cell.attributes)
				replacement.setAttribute(attribute.name, attribute.value);
			replacement.textContent = cell.textContent;
			cell.replaceWith(replacement);
		}
		const native = markupNativeTable(table, format);
		if (native?.includes("|===")) {
			let index = 0;
			return native
				.split("\n")
				.map((line) =>
					/^[\d.+<>^]*\|/.test(line) && !line.startsWith("|===")
						? line.replace("|", markers[index++] ? "h|" : "|")
						: line,
				)
				.join("\n");
		}
		return undefined;
	}

	const columnsMarkup = [
		...table.querySelectorAll<HTMLTableColElement>(":scope > colgroup > col"),
	];
	const columnWidths = columnsMarkup.map(
		(col) =>
			col.getAttribute("data-tp-column-width") ||
			col.style.width ||
			col.getAttribute("width") ||
			"auto",
	);
	const relative =
		columnWidths.length > 0 &&
		columnWidths.every((width) => /^\d+(?:\.\d+)?%$/.test(width));
	const tableWidth = table.style.width;
	const tableLayout = table.style.tableLayout;
	if (table.style.minWidth) return undefined;
	if (columnsMarkup.length) {
		try {
			tableWidthSpec(columnWidths.join(" "));
		} catch {
			return undefined;
		}
		if (
			[...table.style].some(
				(name) => !["width", "min-width", "table-layout"].includes(name),
			)
		)
			return undefined;
		table.removeAttribute("style");
	}
	if (columnsMarkup.length) {
		if (
			columnsMarkup.some(
				(col) =>
					[...col.attributes].some(
						(attr) =>
							!["width", "style", "data-tp-column-width"].includes(attr.name),
					) || [...col.style].some((name) => name !== "width"),
			)
		)
			return undefined;
		for (const group of table.querySelectorAll(":scope > colgroup")) {
			if (group.attributes.length) return undefined;
			group.remove();
		}
	}
	const borders: string[] = [];
	const merges: NonNullable<TableData["merges"]> = [];
	const grid: HTMLTableCellElement[][] = [];
	[...table.rows].forEach((row, r) => {
		grid[r] ??= [];
		let c = 0;
		for (const cell of [...row.cells]) {
			while (grid[r]?.[c]) c++;
			// Read declarations, not expanded CSSOM longhands: var() shorthands
			// have empty longhand values until computed by the browser.
			const declarations = (cell.getAttribute("style") || "").split(";");
			const retained: string[] = [];
			for (const declaration of declarations) {
				const match =
					/^\s*(border(?:-(?:top|right|bottom|left))?(?:-(?:width|style|color))?)\s*:\s*(.+)$/.exec(
						declaration,
					);
				if (!match || match[2]?.includes("!important")) {
					retained.push(declaration);
					continue;
				}
				borders.push(`${r + 1},${c + 1}/${match[1]}=${match[2]?.trim()}`);
			}
			cell.style.cssText = retained.join(";");
			if (cell.rowSpan > 1 || cell.colSpan > 1)
				merges.push({
					row: r,
					column: c,
					rowspan: cell.rowSpan,
					colspan: cell.colSpan,
				});
			for (let y = r; y < r + cell.rowSpan; y++) {
				const gridRow = grid[y] ?? [];
				grid[y] = gridRow;
				for (let x = c; x < c + cell.colSpan; x++) {
					const copy = cell.cloneNode(true) as HTMLTableCellElement;
					copy.removeAttribute("rowspan");
					copy.removeAttribute("colspan");
					gridRow[x] = copy;
				}
			}
			c += cell.colSpan;
		}
	});
	if (grid.length !== table.rows.length) return undefined;
	if (
		borders.length &&
		!["markdown", "asciidoc", "restructuredtext"].includes(format)
	)
		return undefined;
	[...table.rows].forEach((row, r) => {
		row.replaceChildren(...(grid[r] ?? []));
	});
	// A caption's generated anchor can name the native table. Its bottom
	// placement is already the shared TP caption presentation.
	const anchors = [table.id, table.caption?.id].filter(Boolean);
	const markdownCaptionAnchor =
		format === "markdown" &&
		!table.id &&
		/^[a-z][a-z0-9_]*$/.test(table.caption?.id ?? "");
	const nativeAnchor =
		format === "asciidoc" ||
		format === "restructuredtext" ||
		markdownCaptionAnchor;
	if (
		anchors.length > 1 ||
		anchors.some((id) => !/^[a-zA-Z][\w.-]*$/.test(id ?? ""))
	)
		return undefined;
	const rows = [...table.rows];
	const first = rows[0];
	const columns = first?.cells.length ?? 0;
	if (!first || !columns || rows.some((row) => row.cells.length !== columns))
		return undefined;
	// Keep arbitrary IDs, CSS, spans and custom attributes through the general converter.
	for (const element of [
		table,
		...table.querySelectorAll(
			"thead,tbody,tfoot,tr,th,td,caption,colgroup,col",
		),
	]) {
		for (const attr of [...element.attributes]) {
			if (
				nativeAnchor &&
				attr.name === "id" &&
				(element === table || element === table.caption)
			)
				continue;
			if (
				element === table.caption &&
				attr.name === "style" &&
				[...table.caption.style].every((name) => name === "caption-side") &&
				table.caption.style.captionSide === "bottom"
			)
				continue;
			if (
				element instanceof HTMLTableCellElement &&
				attr.name === "style" &&
				[...element.style].every((name) =>
					["text-align", "vertical-align"].includes(name),
				) &&
				["", "left", "center", "right"].includes(element.style.textAlign) &&
				["", "top", "middle", "bottom"].includes(element.style.verticalAlign)
			)
				continue;

			if (
				attr.name === "scope" &&
				element.localName === "th" &&
				attr.value === "col"
			)
				continue;
			if (
				attr.name === "class" &&
				attr.value
					.split(/\s+/)
					.every((name) =>
						/^(tableblock|frame-all|grid-all|stretch|title|halign-left|valign-top|tp-md-table)$/.test(
							name,
						),
					)
			)
				continue;
			return undefined;
		}
	}
	if (table.querySelector("colgroup,col,tfoot,table")) return undefined;
	const header = [...first.cells].every((cell) => cell.tagName === "TH");

	if (
		rows
			.slice(header ? 1 : 0)
			.some((row) => [...row.cells].some((cell) => cell.tagName === "TH"))
	)
		return undefined;
	const data: TableData = {
		cells: [],
		cellTypes: [],
		cellMathModes: [],
		...(merges.length ? { merges } : {}),
		header,
		caption: table.caption?.textContent ?? "",
		alignments: [...first.cells].map(
			(cell) => (cell.style.textAlign || "left") as TableAlignment,
		),
	};
	for (const row of rows) {
		if (
			[...row.cells].some(
				(cell, column) =>
					(cell.style.textAlign || "left") !== data.alignments[column],
			)
		)
			data.cellHorizontalAlignments = rows.map((item) =>
				[...item.cells].map(
					(cell) => (cell.style.textAlign || "left") as TableAlignment,
				),
			);
		if (
			[...row.cells].some(
				(cell) =>
					cell.style.verticalAlign && cell.style.verticalAlign !== "top",
			)
		)
			data.cellVerticalAlignments = rows.map((item) =>
				[...item.cells].map(
					(cell) =>
						(cell.style.verticalAlign || "top") as TableVerticalAlignment,
				),
			);

		const values: string[] = [];
		const types: NonNullable<TableData["cellTypes"]>[number] = [];
		const modes: NonNullable<TableData["cellMathModes"]>[number] = [];
		for (const cell of [...row.cells]) {
			const content = document.createElement("div");
			content.innerHTML = cell.innerHTML;
			for (const paragraph of content.querySelectorAll("p.tableblock"))
				paragraph.removeAttribute("class");
			const math = content.querySelector("tp-math");
			if (
				math &&
				content.textContent?.trim() === math.textContent?.trim() &&
				!content.querySelector("img,video,audio")
			) {
				values.push(math.getAttribute("value") ?? math.textContent ?? "");
				types.push("math");
				modes.push(
					math.getAttribute("mode") === "asciimath" ? "asciimath" : "latexmath",
				);
			} else {
				values.push(
					content.children.length
						? content.innerHTML
						: (content.textContent ?? ""),
				);
				types.push(content.children.length ? "rich" : "text");
				modes.push("latexmath");
			}
		}
		data.cells.push(values);
		data.cellTypes?.push(types);
		data.cellMathModes?.push(modes);
	}
	let source = serializeTable(data, format);
	if (borders.length) {
		try {
			tableCellBorders(borders.join("; "));
		} catch {
			return undefined;
		}
		source = withTableBorders(source, format, borders.join("; "));
	}
	if (format === "asciidoc") {
		if (data.caption)
			source = source.replace(/^\[(?=[^\n]*\bcols=)/m, '[caption="",');
	}
	if (columnWidths.length) {
		// Native proportional RST widths are sufficient only without an explicit table size.
		if (
			relative &&
			!tableWidth &&
			!tableLayout &&
			format === "restructuredtext" &&
			source.startsWith(".. list-table::")
		) {
			source = source.replace(
				/^(.*)\n/,
				`$1\n   :widths: ${columnWidths.map((width) => Number.parseFloat(width)).join(" ")}\n`,
			);
		} else if (
			relative &&
			!tableWidth &&
			!tableLayout &&
			format === "asciidoc"
		) {
			source = source.replace(/,?autowidth/g, "").replace(
				/cols="([^"]*)"/,
				(_match, columns: string) =>
					`cols="${columns
						.split(",")
						.map(
							(column, index) =>
								`${column}${Number.parseFloat(columnWidths[index] || "0")}`,
						)
						.join(",")}"`,
			);
		} else {
			const value = columnWidths.join(" ");
			const attributes = `column-widths="${value}"${tableWidth ? ` table-width="${tableWidth}"` : ""}${tableLayout ? ` table-layout="${tableLayout}"` : ""}`;
			if (format === "markdown")
				source =
					source.endsWith("}") && borders.length
						? `${source.slice(0, -1)} ${attributes}}`
						: `${source}\n{${attributes}}`;
			else if (format === "asciidoc")
				source = source.replace(/^\[/m, `[${attributes.replace(/" /g, '",')},`);
			else if (format === "restructuredtext") {
				if (
					!source.startsWith(".. list-table::") &&
					!source.startsWith(".. table::")
				)
					source = `.. table::\n\n${source
						.split("\n")
						.map((line) => `   ${line}`)
						.join("\n")}`;
				if (!/^\.\. (?:list-table|table)::/.test(source)) return undefined;
				source = source.replace(
					/^(.*)\n/,
					`$1\n   :column-widths: ${value}\n${tableWidth ? `   :table-width: ${tableWidth}\n` : ""}${tableLayout ? `   :table-layout: ${tableLayout}\n` : ""}`,
				);
			}
		}
	}
	const anchor = anchors[0];
	if (!anchor) return source;
	if (markdownCaptionAnchor && source.includes("|"))
		return source.replace(/^(\[[^\n]+\])$/m, `$1[${anchor}]`);
	if (format === "asciidoc" && source.includes("|==="))
		return `[[${anchor}]]\n${source}`;
	if (format === "restructuredtext" && source.startsWith(".. list-table::"))
		return source.replace(/^(.*)\n/, `$1\n   :name: ${anchor}\n`);
	return undefined;
}
