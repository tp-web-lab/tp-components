/** Presentation shared by markup and programming viewers. */
export type ViewerMode = "default" | "lite" | "simple";

/** Explicit mode wins over the historical boolean lite attribute. */
export function readViewerMode(host: HTMLElement): ViewerMode {
	const value = host.getAttribute("mode");
	if (value !== null)
		return value === "lite" || value === "simple" ? value : "default";
	return host.hasAttribute("lite") ? "lite" : "default";
}
