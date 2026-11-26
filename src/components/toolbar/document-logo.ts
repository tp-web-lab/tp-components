import "../button/button.js";
import "../icon/icon.js";
import { hasTpIcon } from "../icon/icon-registry.js";

/** Keep an optional document logo before every toolbar control. */
export function updateDocumentLogo(
	toolbar: HTMLElement | null,
	source: string,
	href = "./",
): void {
	if (!toolbar) return;
	let icon = toolbar.querySelector<HTMLElement>("[data-document-logo]");
	if (!source.trim()) {
		icon?.remove();
		return;
	}
	if (!icon) {
		icon = document.createElement("tp-button");
		icon.setAttribute("data-document-logo", "");
		icon.setAttribute("section", "start");
		icon.setAttribute("size", "m");
		icon.append(document.createElement("tp-icon"));
		icon.style.flexShrink = "0";
	}
	const image = icon.querySelector("tp-icon");
	if (!image) return;
	const name = source.trim();
	if (hasTpIcon(name, "tp")) {
		image.removeAttribute("src");
		image.setAttribute("library", "tp");
		image.setAttribute("name", name);
	} else {
		image.removeAttribute("name");
		image.removeAttribute("library");
		if (image.getAttribute("src") !== source) image.setAttribute("src", source);
	}
	let destination = "";
	try {
		const url = new URL(href.trim() || "./", toolbar.ownerDocument.baseURI);
		if (["http:", "https:"].includes(url.protocol)) destination = url.href;
	} catch {
		/* An invalid destination leaves the logo inactive. */
	}
	icon.dataset.helpGroup = "Toolbar — left";
	icon.dataset.logoHref = destination;
	icon.toggleAttribute("disabled", !destination);
	if (destination) icon.setAttribute("href", destination);
	else icon.removeAttribute("href");
	icon.setAttribute(
		"aria-label",
		destination ? "Visit associated website" : "Logo",
	);
	icon.setAttribute(
		"data-help-description",
		"Open the website associated with this document.",
	);
	const start =
		toolbar.querySelector<HTMLElement>("[data-toolbar-start]") ?? toolbar;
	if (start.firstElementChild !== icon) start.prepend(icon);
}
