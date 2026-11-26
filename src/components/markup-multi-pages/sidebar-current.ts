import type { TpTree } from "../tree/tree.js";

/** Reveal the current page without changing other branches or the reading pane. */
export function revealCurrentSidebarPage(sidebar: HTMLElement): void {
	const link = sidebar.querySelector<HTMLAnchorElement>(
		'tp-tree a[aria-current="page"]',
	);
	const tree = link?.closest<TpTree>("tp-tree");
	if (!link || !tree) return;
	for (
		let item = link.closest("li");
		item && tree.contains(item);
		item = item.parentElement?.closest("li") ?? null
	) {
		if (
			item.querySelector(":scope > ul") &&
			item.getAttribute("data-expanded") !== "true"
		)
			tree.expandNode(item);
	}
	if (!sidebar.getClientRects().length) return;
	const view = sidebar.ownerDocument.defaultView;
	if (!view) return;
	for (
		let container = link.parentElement;
		container;
		container = container.parentElement
	) {
		const style = view.getComputedStyle(container);
		const bounds = container.getBoundingClientRect();
		const target = link.getBoundingClientRect();
		const top = bounds.top + container.clientTop;
		const left = bounds.left + container.clientLeft;
		const bottom = top + container.clientHeight;
		const right = left + container.clientWidth;
		if (
			/(auto|scroll)/.test(style.overflowY) &&
			container.scrollHeight > container.clientHeight
		) {
			if (target.top < top) container.scrollTop += target.top - top;
			else if (target.bottom > bottom)
				container.scrollTop += target.bottom - bottom;
		}
		if (
			/(auto|scroll)/.test(style.overflowX) &&
			container.scrollWidth > container.clientWidth
		) {
			if (target.width > container.clientWidth)
				container.scrollLeft +=
					style.direction === "rtl" ? target.right - right : target.left - left;
			else if (target.left < left) container.scrollLeft += target.left - left;
			else if (target.right > right)
				container.scrollLeft += target.right - right;
		}
		if (container === sidebar) break;
	}
}

/** Follow page selection, sidebar reopening and resizing; release observers on disconnect. */
export function observeCurrentSidebarPage(
	host: HTMLElement,
	sidebar: HTMLElement,
): () => void {
	const view = host.ownerDocument.defaultView;
	if (!view) return () => {};
	let frame: number | null = null;
	const schedule = () => {
		if (frame !== null) return;
		frame = view.requestAnimationFrame(() => {
			frame = null;
			if (host.isConnected) revealCurrentSidebarPage(sidebar);
		});
	};
	const selection = new MutationObserver(schedule);
	selection.observe(sidebar, {
		subtree: true,
		attributes: true,
		attributeFilter: ["aria-current"],
	});
	const menu = new MutationObserver(schedule);
	menu.observe(host, { attributes: true, attributeFilter: ["menu"] });
	const resize =
		typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
	resize?.observe(sidebar);
	schedule();
	return () => {
		selection.disconnect();
		menu.disconnect();
		resize?.disconnect();
		if (frame !== null) view.cancelAnimationFrame(frame);
	};
}
