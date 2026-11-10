import "../icon-button/icon-button.js";

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
		icon = document.createElement("tp-icon-button");
		icon.setAttribute("data-document-logo", "");
		icon.setAttribute("section", "start");
		icon.setAttribute("size", "m");
		icon.style.setProperty("--tp-icon-button-icon-size", "2em");
		icon.addEventListener("click", (event) => {
			const destination = (event.currentTarget as HTMLElement).dataset.logoHref;
			if (destination && !event.defaultPrevented)
				toolbar.ownerDocument.defaultView?.location.assign(destination);
		});
		icon.style.flexShrink = "0";
	}
	if (icon.getAttribute("src") !== source) icon.setAttribute("src", source);
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
	icon.setAttribute("label", destination ? "Visit associated website" : "Logo");
	icon.setAttribute(
		"data-help-description",
		"Open the website associated with this document.",
	);
	const start =
		toolbar.querySelector<HTMLElement>("[data-toolbar-start]") ?? toolbar;
	if (start.firstElementChild !== icon) start.prepend(icon);
}
