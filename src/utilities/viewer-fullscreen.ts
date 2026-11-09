import "../components/fullscreen/fullscreen.js";

let nextTarget = 0;

/** Target the entire viewer, regardless of the toolbar's internal wrappers. */
export function createViewerFullscreen(host: HTMLElement): HTMLElement {
	const target = `viewer-${++nextTarget}`;
	host.setAttribute("data-tp-viewer-fullscreen", target);
	const control = document.createElement("tp-fullscreen");
	control.setAttribute("anchor", `[data-tp-viewer-fullscreen="${target}"]`);
	control.setAttribute("size", "s");
	control.setAttribute("section", "end");
	return control;
}
