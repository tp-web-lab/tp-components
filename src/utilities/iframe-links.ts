/** Resolve fragment links in a preview, then in the containing documentation. */
export function connectIframeLinks(
	host: HTMLElement,
	frameDocument: Document,
): () => void {
	const handleClick = (event: MouseEvent): void => {
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			event.altKey
		)
			return;
		const element = event.target as Element | null;
		const link = element?.closest?.("a[href]");
		const href = link?.getAttribute("href") ?? "";
		if (
			!href.startsWith("#") ||
			href.length < 2 ||
			link?.hasAttribute("download") ||
			link?.hasAttribute("target")
		)
			return;
		let id: string;
		try {
			id = decodeURIComponent(href.slice(1));
		} catch {
			return;
		}
		const target =
			frameDocument.getElementById(id) ?? host.ownerDocument.getElementById(id);
		if (!target) return;
		event.preventDefault();
		target.scrollIntoView({ block: "start" });
	};
	frameDocument.addEventListener("click", handleClick);
	return () => frameDocument.removeEventListener("click", handleClick);
}
