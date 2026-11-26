/** Local SVG reference arrows. No upstream visualizer or external service. */
const ns = "http://www.w3.org/2000/svg";
export function createConnectors(host, prefix) {
	const get = (id) => host.querySelector(`[data-role="${id}"]`);
	const canvas = get("memory");
	const svg = document.createElementNS(ns, "svg");
	svg.classList.add("reference-arrows");
	svg.setAttribute("aria-hidden", "true");
	svg.innerHTML = `<defs><marker id="${prefix}reference-arrow" viewBox="0 0 8 8" refX="0" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M 0 0 L 8 4 L 0 8 z"/></marker></defs><g></g>`;
	canvas.append(svg);
	let pending;
	function scheduleArrows(clear = false) {
		cancelAnimationFrame(pending);
		if (clear === true) svg.querySelector("g").replaceChildren();
		pending = requestAnimationFrame(drawArrows);
	}
	function drawArrows() {
		const sources = [...canvas.querySelectorAll("[data-reference]")];
		const internalSources = sources.filter((source) =>
			source.closest('[data-role="heap"]'),
		);
		const gutter = `${Math.max(64, 36 + internalSources.length * 18)}px`;
		if (canvas.style.getPropertyValue("--reference-gutter") !== gutter)
			canvas.style.setProperty("--reference-gutter", gutter);
		const exits = new Map();
		let laneIndex = 0;
		const bounds = canvas.getBoundingClientRect();
		svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
		const group = svg.querySelector("g");
		group.replaceChildren();
		const counts = new Map();
		for (const [index, source] of sources.entries()) {
			const target = host.querySelector(
				`[data-object="${CSS.escape(source.dataset.reference)}"]`,
			);
			if (!target) continue;
			source.id = `${prefix}reference-${index}`;
			const a = source.getBoundingClientRect(),
				b = target.getBoundingClientRect();
			const internal = !!source.closest('[data-role="heap"]');
			const key = source.dataset.reference + (internal ? "right" : "left");
			const rank = counts.get(key) ?? 0;
			counts.set(key, rank + 1);
			const x1 = (internal ? a.left + a.width / 2 : a.right) - bounds.left,
				y1 = (internal ? a.bottom : a.top + a.height / 2) - bounds.top;
			const x2 = (internal ? b.right : b.left) - bounds.left;
			const y2 = b.top - bounds.top + Math.min(18 + rank * 9, b.height - 8);
			// The path ends at the middle of the triangle base; its tip reaches the card.
			const baseX = x2 + (internal ? 8 : -8);
			const path = document.createElementNS(ns, "path");
			if (internal) {
				const originElement = source.closest("[data-object]");
				const origin = originElement.getBoundingClientRect();
				const exitIndex = exits.get(originElement) ?? 0;
				exits.set(originElement, exitIndex + 1);
				const exit = origin.bottom - bounds.top + 12 + exitIndex * 10;
				const heapRight =
					get("heap").getBoundingClientRect().right - bounds.left;
				const lane = heapRight + 24 + laneIndex++ * 18;
				const direction = y2 >= exit ? 1 : -1;
				path.dataset.lane = String(lane);
				path.dataset.exit = String(exit);
				path.setAttribute(
					"d",
					`M ${x1} ${y1} L ${x1} ${exit - 8} Q ${x1} ${exit}, ${x1 + 8} ${exit} L ${lane - 8} ${exit} Q ${lane} ${exit}, ${lane} ${exit + direction * 8} L ${lane} ${y2 - direction * 8} Q ${lane} ${y2}, ${lane - 8} ${y2} L ${baseX} ${y2}`,
				);
			} else {
				const turn = x1 + (x2 - x1) * 0.55;
				path.setAttribute(
					"d",
					`M ${x1} ${y1} C ${turn} ${y1}, ${turn} ${y2}, ${baseX - 6} ${y2} L ${baseX} ${y2}`,
				);
			}
			path.dataset.from = source.id;
			path.dataset.to = source.dataset.reference;
			path.setAttribute("marker-end", `url(#${prefix}reference-arrow)`);
			group.append(path);
		}
	}
	function highlight(event) {
		const source = event.target.closest?.("[data-reference]");
		canvas.classList.toggle("highlight-reference", !!source);
		for (const edge of svg.querySelectorAll("g path"))
			edge.classList.toggle(
				"active",
				!!source && edge.dataset.from === source.id,
			);
		for (const target of canvas.querySelectorAll("[data-object]"))
			target.classList.toggle(
				"referenced",
				!!source && target.dataset.object === source.dataset.reference,
			);
	}
	canvas.addEventListener("pointerover", highlight);
	canvas.addEventListener("focusin", highlight);
	for (const event of ["pointerleave", "focusout"])
		canvas.addEventListener(event, () => {
			canvas.classList.remove("highlight-reference");
			for (const edge of svg.querySelectorAll(".active"))
				edge.classList.remove("active");
			for (const target of canvas.querySelectorAll(".referenced"))
				target.classList.remove("referenced");
		});
	const observer = new ResizeObserver(scheduleArrows);
	for (const node of [canvas, get("frames"), get("heap")])
		observer.observe(node);
	window.addEventListener("resize", scheduleArrows);
	document.fonts?.ready.then(scheduleArrows);

	return {
		scheduleArrows,
		destroy() {
			observer.disconnect();
			cancelAnimationFrame(pending);
			window.removeEventListener("resize", scheduleArrows);
		},
	};
}
