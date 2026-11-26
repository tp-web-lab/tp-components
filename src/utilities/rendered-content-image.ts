/** Snapshots a rendered document with its computed styles and embedded image resources. */
export async function renderedContentImage(root: HTMLElement): Promise<string> {
	await root.ownerDocument.fonts?.ready;
	await Promise.all(
		Array.from(root.querySelectorAll("img")).map((image) =>
			image.decode().catch(() => {}),
		),
	);
	const bounds = root.getBoundingClientRect();
	const width = Math.max(1, Math.ceil(bounds.width), root.scrollWidth);
	const height = Math.max(1, Math.ceil(bounds.height), root.scrollHeight);
	const view = root.ownerDocument.defaultView ?? window;
	const clone = root.cloneNode(true) as HTMLElement;
	const originals = [root, ...root.querySelectorAll("*")];
	const copies = [clone, ...clone.querySelectorAll("*")];
	for (const [index, original] of originals.entries()) {
		const copy = copies[index];
		if (!(copy instanceof view.HTMLElement || copy instanceof view.SVGElement))
			continue;
		const style = view.getComputedStyle(original);
		for (const property of Array.from(style))
			copy.style.setProperty(property, style.getPropertyValue(property));
		copy.style.animation = "none";
		copy.style.transition = "none";
		if (
			original instanceof view.HTMLImageElement &&
			copy instanceof view.HTMLImageElement &&
			!original.src.startsWith("data:")
		) {
			const response = await fetch(original.currentSrc || original.src);
			if (!response.ok)
				throw new Error("Unable to embed an image in the export.");
			const blob = await response.blob();
			copy.src = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result));
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(blob);
			});
			copy.removeAttribute("srcset");
		}
	}
	for (const script of clone.querySelectorAll("script")) script.remove();
	clone.style.margin = "0";
	clone.style.width = `${width}px`;
	clone.style.height = "auto";
	const content = new XMLSerializer().serializeToString(clone);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${content}</foreignObject></svg>`;
}
