import { TP_COLOR_PRESETS } from "../components/color/color-presets.js";

const inheritedRoots = new WeakSet<Element>();
const inheritedThemeRoots = new WeakSet<Element>();
const themes = ["tp-light", "tp-dark"];

/** Keep a viewer document in the nearest enclosing brand and theme scopes. */
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
	// Explicit settings remain independent; brand and theme inherit separately.
	const inheritColor =
		inheritedRoots.has(root) ||
		!TP_COLOR_PRESETS.some((preset) => root.classList.contains(preset));
	const inheritTheme =
		inheritedThemeRoots.has(root) ||
		!themes.some((theme) => root.classList.contains(theme));
	if (inheritColor) inheritedRoots.add(root);
	if (inheritTheme) inheritedThemeRoots.add(root);
	const update = (): void => {
		const preset = ancestors
			.map((element) =>
				TP_COLOR_PRESETS.find((value) => element.classList.contains(value)),
			)
			.find(Boolean);
		if (inheritColor) {
			root.classList.remove(...TP_COLOR_PRESETS);
			if (preset) root.classList.add(preset);
		}
		if (inheritTheme) {
			const theme = ancestors
				.map((element) =>
					themes.find((value) => element.classList.contains(value)),
				)
				.find(Boolean);
			root.classList.remove(...themes);
			if (theme) {
				root.classList.add(theme);
				const body = target.body;
				const defaultTheme = body?.dataset.tpDefaultTheme;
				if (defaultTheme) {
					body.classList.remove(defaultTheme);
					delete body.dataset.tpDefaultTheme;
				}
			}
		}
	};
	const observer = new MutationObserver(update);
	for (const element of ancestors)
		observer.observe(element, { attributes: true, attributeFilter: ["class"] });
	update();
	return () => observer.disconnect();
}
