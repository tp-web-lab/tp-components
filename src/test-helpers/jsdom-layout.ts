import { afterEach, beforeEach, vi } from "vitest";

/** jsdom 30 cannot resolve these CSS calculations during CodeMirror measurements.
 * Supply deterministic layout fixtures; Playwright verifies real resizing.
 */
export function useFixedJSDOMLayout() {
	const styles = new Map<HTMLElement, string>();
	beforeEach(() => {
		const original = window.getComputedStyle;
		vi.spyOn(window, "getComputedStyle").mockImplementation(
			(element, pseudo) => {
				if (
					element instanceof HTMLElement &&
					element.matches(".tp-geometry-board, tp-splitter > dl")
				) {
					if (!styles.has(element)) styles.set(element, element.style.cssText);
					if (element.matches(".tp-geometry-board"))
						element.style.blockSize = "420px";
					else {
						element.style.gridTemplateColumns = "200px 12px 200px";
						element.style.gridTemplateRows = "200px";
					}
				}
				return original(element, pseudo);
			},
		);
	});
	afterEach(() => {
		vi.restoreAllMocks();
		for (const [element, style] of styles) element.style.cssText = style;
		styles.clear();
	});
}
