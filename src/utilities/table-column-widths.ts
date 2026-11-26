/** Resolve explicitly weighted table columns; browsers treat mixed calc() col widths as auto. */
const installed = new WeakSet<Document>();
export function ensureTableColumnWidths(doc: Document): void {
	const view = doc.defaultView;
	if (!view || installed.has(doc) || typeof ResizeObserver === "undefined")
		return;
	installed.add(doc);
	const tables = new Set<HTMLTableElement>();
	const parents = new Set<HTMLElement>();
	let frame = 0;
	const measure = (
		value: string,
		table: HTMLTableElement,
		available: number,
	): number => {
		if (value.endsWith("%"))
			return (available * Number.parseFloat(value)) / 100;
		const probe = doc.createElement("span");
		probe.style.cssText = `position:fixed;visibility:hidden;display:block;box-sizing:content-box;padding:0;border:0;margin:0;width:${value};font:${view.getComputedStyle(table).font};`;
		doc.body.append(probe);
		const width = probe.getBoundingClientRect().width;
		probe.remove();
		return width;
	};
	const update = () => {
		frame = 0;
		for (const parent of parents) {
			if (
				![...tables].some(
					(table) => table.isConnected && table.parentElement === parent,
				)
			) {
				observer.unobserve(parent);
				parents.delete(parent);
			}
		}
		for (const table of tables) {
			if (!table.isConnected) {
				observer.unobserve(table);
				tables.delete(table);
				continue;
			}
			const cols = [
				...table.querySelectorAll<HTMLTableColElement>(
					":scope > colgroup > col",
				),
			];
			const specs = cols.map(
				(col) => col.getAttribute("data-tp-column-width") || "auto",
			);
			const weights = specs.map((value) =>
				value.endsWith("*") ? Number(value.slice(0, -1) || 1) : 0,
			);
			const total = weights.reduce((a, b) => a + b, 0);
			if (!total) continue;
			let parent = table.parentElement;
			while (parent && !parent.clientWidth) parent = parent.parentElement;
			let available = cols.reduce(
				(sum, col) => sum + col.getBoundingClientRect().width,
				0,
			);
			if (parent && table.style.width && table.style.width !== "auto") {
				const parentStyle = view.getComputedStyle(parent);
				const parentWidth =
					parent.clientWidth -
					Number.parseFloat(parentStyle.paddingLeft || "0") -
					Number.parseFloat(parentStyle.paddingRight || "0");
				const style = view.getComputedStyle(table);
				const borders =
					(Number.parseFloat(style.borderLeftWidth || "0") +
						Number.parseFloat(style.borderRightWidth || "0")) /
					(style.borderCollapse === "collapse" ? 2 : 1);
				available = measure(table.style.width, table, parentWidth) - borders;
			}
			if (!available) continue;
			const fixed = specs.reduce(
				(sum, value, index) =>
					sum +
					(weights[index]
						? 0
						: value === "auto"
							? cols[index]?.getBoundingClientRect().width || 0
							: measure(value, table, available)),
				0,
			);
			cols.forEach((col, index) => {
				if (!weights[index]) return;
				const width = `${(Math.max(0, available - fixed) * (weights[index] || 0)) / total}px`;
				if (
					!col.style.width.endsWith("px") ||
					Math.abs(
						Number.parseFloat(col.style.width) - Number.parseFloat(width),
					) > 0.01
				)
					col.style.width = width;
			});
		}
	};
	const schedule = () => {
		if (!frame) frame = view.requestAnimationFrame(update);
	};
	const observer = new ResizeObserver(schedule);
	const scan = (root: ParentNode) => {
		for (const col of root.querySelectorAll('col[data-tp-column-width$="*"]')) {
			const table = col.closest("table");
			if (table && !tables.has(table)) {
				tables.add(table);
				observer.observe(table);
				if (table.parentElement) {
					parents.add(table.parentElement);
					observer.observe(table.parentElement);
				}
			}
		}
		schedule();
	};
	new MutationObserver((records) => {
		for (const record of records) {
			if (record.type === "attributes") {
				if (
					!(record.target instanceof HTMLTableColElement) ||
					record.attributeName === "data-tp-column-width"
				)
					schedule();
			} else {
				for (const node of record.addedNodes)
					if (
						node instanceof Element &&
						(node.matches("table,colgroup,col") || node.querySelector("table"))
					)
						scan(node.parentElement || node);
				if (
					[...record.removedNodes].some(
						(node) =>
							node instanceof Element &&
							(node.matches("table") || node.querySelector("table")),
					)
				)
					schedule();
			}
		}
	}).observe(doc.documentElement, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: ["style", "class", "data-tp-column-width"],
	});
	view.addEventListener("resize", schedule);
	doc.fonts?.addEventListener("loadingdone", schedule);
	scan(doc);
}
