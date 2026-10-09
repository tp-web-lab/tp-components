/** Cell contents grouped by row; original nodes can be moved without serialization. */
export type ContentTableRows = Node[][][];

/** Creates a semantic table, padding short rows and optionally promoting its first row. */
export function createContentTable(
	rows: ContentTableRows,
	heading: boolean,
	owner: Document,
): HTMLTableElement {
	const table = owner.createElement("table");
	const columns = Math.max(0, ...rows.map((row) => row.length));
	const body = owner.createElement("tbody");
	rows.forEach((row, index) => {
		const header = heading && index === 0;
		const tr = owner.createElement("tr");
		for (let column = 0; column < columns; column++) {
			const cell = owner.createElement(header ? "th" : "td");
			if (header) cell.setAttribute("scope", "col");
			cell.append(...(row[column] ?? []));
			tr.append(cell);
		}
		if (header) {
			const head = owner.createElement("thead");
			head.append(tr);
			table.append(head);
		} else body.append(tr);
	});
	table.append(body);
	return table;
}
