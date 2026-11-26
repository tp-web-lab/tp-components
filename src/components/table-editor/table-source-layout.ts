/** Read explicit table layout without attaching imported content or loading its CSS. */
export function tableSourceLayout(
	table: HTMLTableElement,
	count: number,
	available: number,
): number[] | undefined {
	const pixels = (value: string, base: number): number | undefined => {
		const match = /^(\d+(?:\.\d+)?)(px|pt|pc|in|cm|mm|em|rem|%)?$/.exec(
			value.trim(),
		);
		if (!match) return undefined;
		const units: Record<string, number> = {
			px: 1,
			pt: 96 / 72,
			pc: 16,
			in: 96,
			cm: 96 / 2.54,
			mm: 96 / 25.4,
			em: 16,
			rem: 16,
			"%": base / 100,
		};
		const result = Number(match[1]) * (units[match[2] ?? "px"] ?? 1);
		return result > 0 && Number.isFinite(result) ? result : undefined;
	};
	const tableWidth =
		pixels(table.style.width || table.getAttribute("width") || "", available) ??
		available;
	const cols: HTMLTableColElement[] = [];
	for (const col of table.querySelectorAll<HTMLTableColElement>(
		":scope > colgroup > col, :scope > col",
	))
		for (let i = 0; i < Math.min(col.span || 1, count); i++) cols.push(col);
	const widths: (number | undefined)[] = Array.from({ length: count }, (_, c) =>
		pixels(
			cols[c]?.style.width || cols[c]?.getAttribute("width") || "",
			tableWidth,
		),
	);
	const occupied = new Set<string>();
	for (const [r, row] of Array.from(table.rows).entries()) {
		let c = 0;
		for (const cell of Array.from(row.cells)) {
			while (occupied.has(`${r}:${c}`)) c++;
			const width = pixels(
				cell.style.width || cell.getAttribute("width") || "",
				tableWidth,
			);
			if (width)
				for (let x = c; x < Math.min(count, c + cell.colSpan); x++)
					widths[x] ??= width / cell.colSpan;
			for (const [property, attribute, prefix, allowed] of [
				["textAlign", "align", "halign-", ["left", "center", "right"]],
				["verticalAlign", "valign", "valign-", ["top", "middle", "bottom"]],
			] as const) {
				const inherited = [cell, row, cols[c], table].filter(
					Boolean,
				) as HTMLElement[];
				const value = inherited
					.map(
						(el) =>
							el.style[property] ||
							el.getAttribute(attribute) ||
							allowed.find((value) => el.classList.contains(prefix + value)),
					)
					.find(Boolean);
				if (allowed.some((item) => item === value))
					cell.style[property] = value ?? "";
			}
			for (let y = r; y < r + (cell.rowSpan || table.rows.length - r); y++)
				for (let x = c; x < c + cell.colSpan; x++) occupied.add(`${y}:${x}`);
			c += cell.colSpan;
		}
	}
	if (!widths.some((width) => width !== undefined)) return undefined;
	const known = widths.reduce<number>((sum, width) => sum + (width ?? 0), 0);
	const missing = widths.filter((width) => width === undefined).length;
	const fallback =
		missing && tableWidth > known ? (tableWidth - known) / missing : 160;
	return widths.map((width) => Math.max(1, Math.round(width ?? fallback)));
}
