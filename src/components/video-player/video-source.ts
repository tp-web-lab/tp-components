export interface VideoSource {
	provider: "native" | "youtube";
	url: string;
	videoId?: string;
}

/** Resolve native media URLs and the supported YouTube watch/share/embed URLs. */
export function parseVideoSource(
	src: string,
	base: string,
): VideoSource | null {
	if (!src.trim()) return null;
	let url: URL;
	try {
		url = new URL(src, base);
	} catch {
		return null;
	}
	if (!["http:", "https:", "blob:"].includes(url.protocol)) return null;
	const host = url.hostname.toLowerCase();
	if (
		host === "youtu.be" ||
		[
			"youtube.com",
			"www.youtube.com",
			"m.youtube.com",
			"youtube-nocookie.com",
			"www.youtube-nocookie.com",
		].includes(host)
	) {
		const id =
			host === "youtu.be"
				? url.pathname.split("/")[1]
				: url.pathname === "/watch"
					? url.searchParams.get("v")
					: /^\/(embed|shorts|live)\//.test(url.pathname)
						? url.pathname.split("/")[2]
						: null;
		if (!id || !/^[\w-]{11}$/.test(id)) return null;
		return {
			provider: "youtube",
			videoId: id,
			url: `https://www.youtube.com/watch?v=${id}`,
		};
	}
	return { provider: "native", url: url.href };
}
