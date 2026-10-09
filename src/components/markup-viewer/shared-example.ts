/** Last selected example per tab group and identical set of example labels. */
const selections = new WeakMap<Element, Map<string, string>>();

/** Limits synchronization to viewers in the same language tab group. */
function scopeOf(viewer: Element): Element {
	return viewer.closest("tp-tabs") ?? viewer;
}

/** Matches equivalent lists regardless of the order used by a language parser. */
function keyOf(labels: string[]): string {
	return JSON.stringify([...labels].sort());
}

/** Restores the selection for a viewer initialized after its sibling. */
export function sharedViewerExample(
	viewer: Element,
	labels: string[],
): string | undefined {
	return selections.get(scopeOf(viewer))?.get(keyOf(labels));
}

/** Updates initialized siblings and remembers the label for lazily loaded tabs. */
export function shareViewerExample(
	viewer: Element,
	select: HTMLSelectElement,
): void {
	const scope = scopeOf(viewer);
	const labels = [...select.options].map((option) => option.value);
	const key = keyOf(labels);
	let state = selections.get(scope);
	if (!state) {
		state = new Map();
		selections.set(scope, state);
	}
	state.set(key, select.value);
	for (const sibling of scope.querySelectorAll<HTMLSelectElement>(
		'select[aria-label="Example"]',
	)) {
		if (
			sibling === select ||
			sibling.closest("tp-tabs") !== viewer.closest("tp-tabs")
		)
			continue;
		if (
			keyOf([...sibling.options].map((option) => option.value)) !== key ||
			sibling.value === select.value
		)
			continue;
		sibling.value = select.value;
		sibling.dispatchEvent(new Event("change"));
	}
}
