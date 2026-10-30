import "../icon/icon.js";

/** Keep an optional document logo before every toolbar control. */
export function updateDocumentLogo(
	toolbar: HTMLElement | null,
	source: string,
): void {
	if (!toolbar) return;
	let icon = toolbar.querySelector<HTMLElement>("[data-document-logo]");
	if (!source.trim()) {
		icon?.remove();
		return;
	}
	if (!icon) {
		icon = document.createElement("tp-icon");
		icon.setAttribute("data-document-logo", "");
		icon.setAttribute("section", "start");
		icon.setAttribute("size", "2em");
		icon.style.flexShrink = "0";
	}
	if (icon.getAttribute("src") !== source) icon.setAttribute("src", source);
	const start =
		toolbar.querySelector<HTMLElement>("[data-toolbar-start]") ?? toolbar;
	if (start.firstElementChild !== icon) start.prepend(icon);
}
