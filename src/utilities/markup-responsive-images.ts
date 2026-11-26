/** Resolve srcset URLs without splitting commas embedded in a URL (notably data URLs). */
export function resolveImageCandidates(source: string, base: string): string {
	const candidates: string[] = [];
	let cursor = 0;
	while (cursor < source.length) {
		while (cursor < source.length && /[\t\n\f\r ,]/.test(source[cursor] || ""))
			cursor++;
		const start = cursor;
		while (cursor < source.length && !/[\t\n\f\r ]/.test(source[cursor] || ""))
			cursor++;
		let url = source.slice(start, cursor);
		if (!url) break;
		let descriptors = "";
		if (url.endsWith(",")) url = url.replace(/,+$/, "");
		else {
			const descriptorStart = cursor;
			let depth = 0;
			while (cursor < source.length) {
				const char = source[cursor];
				if (char === "(") depth++;
				else if (char === ")") depth = Math.max(0, depth - 1);
				else if (char === "," && depth === 0) break;
				cursor++;
			}
			descriptors = source.slice(descriptorStart, cursor).trim();
			if (source[cursor] === ",") cursor++;
		}
		const resolved = /^[a-z][\w+.-]*:/i.test(url)
			? url
			: new URL(url, base).href;
		candidates.push(resolved + (descriptors ? ` ${descriptors}` : ""));
	}
	return candidates.join(", ");
}
