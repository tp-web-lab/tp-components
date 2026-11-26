/** Restore an observed position without accumulating fractional-zoom rounding. */
export function restoreElementScroll(
	element: Element,
	left: number,
	top: number,
): void {
	for (const [axis, target] of [
		["scrollLeft", left],
		["scrollTop", top],
	] as const) {
		if (element[axis] === target) continue;
		element[axis] = target;
		const error = target - element[axis];
		// WebKit can return one CSS pixel less than was assigned at fractional zoom.
		// Correct only small rounding errors, not a viewport whose content is still loading.
		if (error !== 0 && Math.abs(error) <= 2) element[axis] = target + error;
	}
}
