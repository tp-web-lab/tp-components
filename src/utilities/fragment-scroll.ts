/** Keep a fragment aligned while asynchronous content changes its position. */
export function followFragment(
	container: HTMLElement,
	target: HTMLElement,
): () => void {
	let frame = 0;
	let stopped = false;
	const align = (): void => {
		frame = 0;
		if (stopped || !container.contains(target)) return;
		const delta =
			target.getBoundingClientRect().top -
			container.getBoundingClientRect().top -
			container.clientTop;
		if (Math.abs(delta) > 0.5) container.scrollTop += delta;
	};
	const schedule = (): void => {
		if (!stopped && frame === 0) frame = requestAnimationFrame(align);
	};
	const observer =
		typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
	const stop = (): void => {
		stopped = true;
		observer?.disconnect();
		cancelAnimationFrame(frame);
		for (const type of ["wheel", "touchstart", "pointerdown", "keydown"]) {
			container.removeEventListener(type, stop);
		}
	};
	for (const type of ["wheel", "touchstart", "pointerdown", "keydown"]) {
		container.addEventListener(type, stop, { passive: true });
	}
	observer?.observe(container);
	for (const child of container.children) observer?.observe(child);
	align();
	return stop;
}
