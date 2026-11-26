/** Execution hosts sharing the Run shortcut, including viewers, playgrounds and notebooks. */
const viewers = new WeakSet<HTMLElement>();

/** Capture Shift+Enter before the editor inserts a newline. */
export function createViewerRunShortcut(
	host: HTMLElement,
	run: (event: KeyboardEvent) => void,
): (event: KeyboardEvent) => void {
	viewers.add(host);
	return (event) => {
		if (
			event.key !== "Enter" ||
			!event.shiftKey ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey ||
			event.isComposing ||
			event.defaultPrevented
		)
			return;
		const owner = event
			.composedPath()
			.find((node) => node instanceof HTMLElement && viewers.has(node));
		if (owner !== host) return;
		event.preventDefault();
		event.stopPropagation();
		if (!event.repeat) run(event);
	};
}
