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
		const stacked =
			get("heap").getBoundingClientRect().top >=
			get("frames").getBoundingClientRect().bottom;
		const gutter = `${Math.max(64, 36 + (stacked ? sources.length : internalSources.length) * 18)}px`;
		if (canvas.style.getPropertyValue("--reference-gutter") !== gutter)
			canvas.style.setProperty("--reference-gutter", gutter);
		// Reserve the exit lanes before measuring cards and routing their arrows.
		for (const card of get("heap").querySelectorAll(".sequence")) {
			const count = card.querySelectorAll("[data-reference]").length;
			const space = `${count * 10}px`;
			if (card.style.getPropertyValue("--reference-exit-space") !== space)
				card.style.setProperty("--reference-exit-space", space);
		}
		let laneIndex = 0;
		const bounds = canvas.getBoundingClientRect();
		svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
		const group = svg.querySelector("g");
		group.replaceChildren();
		const counts = new Map();
		const sequenceExits = new Map();
		for (const [index, source] of sources.entries()) {
			const target = host.querySelector(
				`[data-object="${CSS.escape(source.dataset.reference)}"]`,
			);
			if (!target) continue;
			source.id = `${prefix}reference-${index}`;
			const a = source.getBoundingClientRect(),
				b = target.getBoundingClientRect();
			const internal = !!source.closest('[data-role="heap"]');
			const routedRight = internal || stacked;
			const key = source.dataset.reference + (routedRight ? "right" : "left");
			const rank = counts.get(key) ?? 0;
			counts.set(key, rank + 1);
			const sequence = source.closest(".sequence");
			const x1 = (sequence ? a.left + a.width / 2 : a.right) - bounds.left,
				y1 = (sequence ? a.bottom : a.top + a.height / 2) - bounds.top;
			const x2 = (routedRight ? b.right : b.left) - bounds.left;
			const y2 = b.top - bounds.top + Math.min(18 + rank * 9, b.height - 8);
			// The path ends at the middle of the triangle base; its tip reaches the card.
			const baseX = x2 + (routedRight ? 8 : -8);
			const path = document.createElementNS(ns, "path");
			if (routedRight) {
				const heapRight =
					get("heap").getBoundingClientRect().right - bounds.left;
				const lane = heapRight + 24 + laneIndex++ * 18;
				let exit = y1;
				let departure = `M ${x1} ${y1}`;
				if (sequence) {
					const rank = sequenceExits.get(sequence) ?? 0;
					sequenceExits.set(sequence, rank + 1);
					exit =
						sequence.getBoundingClientRect().bottom -
						bounds.top +
						12 +
						rank * 10;
					departure += ` L ${x1} ${exit - 8} Q ${x1} ${exit}, ${x1 + 8} ${exit}`;
				}
				const direction = y2 >= exit ? 1 : -1;
				const radius = Math.min(8, Math.abs(y2 - exit) / 2);
				path.dataset.lane = String(lane);
				path.dataset.exit = String(exit);
				path.setAttribute(
					"d",
					`${departure} L ${lane - radius} ${exit} Q ${lane} ${exit}, ${lane} ${exit + direction * radius} L ${lane} ${y2 - direction * radius} Q ${lane} ${y2}, ${lane - radius} ${y2} L ${baseX} ${y2}`,
				);
			} else {
				const turn = x1 + (x2 - x1) * 0.55;
				path.setAttribute(
					"d",
					`M ${x1} ${y1} L ${x1 + 6} ${y1} C ${turn} ${y1}, ${turn} ${y2}, ${baseX - 6} ${y2} L ${baseX} ${y2}`,
				);
			}
			path.dataset.from = source.id;
			path.dataset.to = source.dataset.reference;
			path.setAttribute("marker-end", `url(#${prefix}reference-arrow)`);
			group.append(path);
		}
	}
	function highlight(event) {
		const source = event.target.closest?.(
			"[data-reference], [data-object-link]",
		);
		canvas.classList.toggle("highlight-reference", !!source?.dataset.reference);
		for (const edge of svg.querySelectorAll("g path"))
			edge.classList.toggle(
				"active",
				!!source && edge.dataset.from === source.id,
			);
		for (const target of canvas.querySelectorAll("[data-object]"))
			target.classList.toggle(
				"referenced",
				!!source &&
					target.dataset.object ===
						(source.dataset.reference ?? source.dataset.objectLink),
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
