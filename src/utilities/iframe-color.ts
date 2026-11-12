import { TP_COLOR_PRESETS } from "../components/color/color-presets.js";

const inheritedRoots = new WeakSet<Element>();

/** Keep a viewer document in the nearest enclosing brand scope. */
export function syncIframeColor(
	host: HTMLElement,
	target: Document,
): () => void {
	const ancestors: Element[] = [];
	for (
		let element: Element | null = host;
		element;
		element = element.parentElement
	) {
		ancestors.push(element);
	}
	const root = target.documentElement;
	// An explicitly colored example remains independent of its viewer.
	if (
		!inheritedRoots.has(root) &&
		TP_COLOR_PRESETS.some((preset) => root.classList.contains(preset))
	)
		return () => {};
	inheritedRoots.add(root);
	const update = (): void => {
		const preset = ancestors
			.map((element) =>
				TP_COLOR_PRESETS.find((value) => element.classList.contains(value)),
			)
			.find(Boolean);
		root.classList.remove(...TP_COLOR_PRESETS);
		if (preset) root.classList.add(preset);
	};
	const observer = new MutationObserver(update);
	for (const element of ancestors)
		observer.observe(element, { attributes: true, attributeFilter: ["class"] });
	update();
	return () => observer.disconnect();
}
