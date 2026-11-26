/** Captures the laid-out table, including computed TP styles and rendered formulas. */
export async function tableImage(
	owner: HTMLElement,
	html: string,
): Promise<string> {
	const document = owner.ownerDocument;
	const host = document.createElement("div");
	host.className = "tp-table-editor-preview";
	host.setAttribute("data-markup-preview", "");
	host.setAttribute("aria-hidden", "true");
	host.style.cssText = `position:fixed;left:-100000px;top:0;pointer-events:none;width:${owner.clientWidth || 800}px;`;
	host.innerHTML = html;
	const table = host.querySelector("table");
	if (!table) throw new Error("No table to export.");
	// Use the same table layout as the HTML render tab, without editor controls.
	table.style.borderCollapse = "collapse";
	const formulas = Array.from(host.querySelectorAll("tp-math"));
	const jobs = formulas.map(
		(math) =>
			new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(
					() => finish(new Error("Formula rendering timed out.")),
					30000,
				);
				const rendered = () => finish();
				const failed = () =>
					finish(new Error("A formula could not be rendered."));
				const finish = (error?: Error) => {
					clearTimeout(timeout);
					math.removeEventListener("tp-math-rendered", rendered);
					math.removeEventListener("tp-math-error", failed);
					if (error) reject(error);
					else resolve();
				};
				math.addEventListener("tp-math-rendered", rendered);
				math.addEventListener("tp-math-error", failed);
			}),
	);
	try {
		owner.append(host);
		if (formulas.length) await import("../math/math.js");
		await Promise.all(jobs);
		await document.fonts?.ready;
		const bounds = table.getBoundingClientRect();
		const caption = table.caption?.getBoundingClientRect();
		const left = Math.min(bounds.left, caption?.left ?? bounds.left);
		const top = Math.min(bounds.top, caption?.top ?? bounds.top);
		const width =
			Math.ceil(
				Math.max(bounds.right, caption?.right ?? bounds.right) - left,
			) ||
			table.scrollWidth ||
			800;
		const height =
			Math.ceil(
				Math.max(bounds.bottom, caption?.bottom ?? bounds.bottom) - top,
			) ||
			table.scrollHeight ||
			1;
		const clone = table.cloneNode(true) as HTMLTableElement;
		const originalNodes = [table, ...table.querySelectorAll("*")];
		const clonedNodes = [clone, ...clone.querySelectorAll("*")];
		for (const [index, original] of originalNodes.entries()) {
			const target = clonedNodes[index] as HTMLElement | SVGElement | undefined;
			if (!target) continue;
			const computed = getComputedStyle(original);
			for (const property of Array.from(computed))
				target.style.setProperty(property, computed.getPropertyValue(property));
			target.style.setProperty("animation", "none");
			target.style.setProperty("transition", "none");
		}
		clone.style.margin = "0";
		// A computed table height includes its caption; fixing it would stretch
		// the row area and push the caption outside the captured viewport.
		clone.style.height = "auto";
		clone.style.blockSize = "auto";
		clone.style.width = `${width}px`;
		clone.style.maxWidth = "none";
		const wrapper = document.createElement("div");
		const ownerStyle = getComputedStyle(owner);
		wrapper.style.cssText = `width:${width}px;height:${height}px;background:${ownerStyle.backgroundColor};color:${ownerStyle.color};overflow:visible;`;
		wrapper.append(clone);
		const content = new XMLSerializer().serializeToString(wrapper);
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${content}</foreignObject></svg>`;
	} finally {
		host.remove();
	}
}
