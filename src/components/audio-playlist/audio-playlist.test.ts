import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./audio-playlist.js";

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
};
function getAudio(host: HTMLElement): HTMLAudioElement {
	const audio = host.querySelector("audio");
	if (!audio) throw new Error("Missing audio control");
	return audio;
}
function create(tag = "ol", random = false) {
	const host = document.createElement("tp-audio-playlist");
	host.toggleAttribute("random", random);
	host.innerHTML = `<${tag}>${[1, 2, 3].map((i) => `<li><a href="/track-${i}.wav">Track ${i}</a></li>`).join("")}</${tag}>`;
	document.body.append(host);
	return host;
}
function command(host: HTMLElement, label: string) {
	const button = [...host.querySelectorAll("tp-icon-button")].find(
		(b) => b.getAttribute("label") === label,
	);
	button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
describe("tp-audio-playlist", () => {
	beforeEach(() => {
		vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
		vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
		vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
	});
	afterEach(() => {
		document.body.replaceChildren();
		vi.restoreAllMocks();
	});
	it.each(["ul", "ol"])(
		"accepts %s, advances and stops at the end without autoplay",
		async (tag) => {
			const host = create(tag);
			const audio = getAudio(host);
			expect(audio.src).toContain("track-1.wav");
			expect(audio.play).not.toHaveBeenCalled();
			host.querySelectorAll("a")[1]?.click();
			expect(audio.src).toContain("track-2.wav");
			expect(audio.play).toHaveBeenCalledTimes(1);
			audio.dispatchEvent(new Event("ended"));
			expect(audio.src).toContain("track-3.wav");
			audio.dispatchEvent(new Event("ended"));
			expect(audio.play).toHaveBeenCalledTimes(2);
			expect(host.querySelector('[role="status"]')?.textContent).toContain(
				"finished",
			);
			command(host, "Previous");
			expect(audio.src).toContain("track-2.wav");
			expect(host.querySelector('a[aria-current="true"]')?.textContent).toBe(
				"Track 2",
			);
			await flush();
		},
	);
	it("shuffles without repeats and restores document order dynamically", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const host = create("ul", true);
		const audio = getAudio(host);
		const sources = [audio.src];
		audio.dispatchEvent(new Event("ended"));
		sources.push(audio.src);
		audio.dispatchEvent(new Event("ended"));
		sources.push(audio.src);
		expect(new Set(sources).size).toBe(3);
		expect(sources[0]).toContain("track-2.wav");
		host.removeAttribute("random");
		expect(audio.src).toContain("track-1.wav");
		command(host, "Next");
		expect(audio.src).toContain("track-2.wav");
		host.setAttribute("random", "");
		expect(audio.src).toContain("track-2.wav");
	});
	it("updates edited sources, handles removal and reconnects without duplicate controls", async () => {
		const host = create();
		const audio = getAudio(host);
		host.querySelector("a")?.setAttribute("href", "/changed.wav");
		await flush();
		expect(audio.src).toContain("changed.wav");
		host.querySelector("li")?.remove();
		await flush();
		expect(audio.src).toContain("track-2.wav");
		expect(audio.play).not.toHaveBeenCalled();
		host.querySelector("ol")?.remove();
		await flush();
		expect(audio.hasAttribute("src")).toBe(false);
		expect(audio.hidden).toBe(true);
		host.remove();
		document.body.append(host);
		expect(host.querySelectorAll("audio")).toHaveLength(1);
		expect(audio.pause).toHaveBeenCalled();
	});
	it("starts ordered and shuffled playlists from the top controls and updates the animated title", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const host = create();
		const audio = getAudio(host);
		expect(host.firstElementChild?.className).toBe(
			"tp-audio-playlist-controls",
		);
		command(host, "Random");
		expect(host.hasAttribute("random")).toBe(true);
		expect(audio.src).toContain("track-2.wav");
		expect(host.querySelector("tp-typewriting")?.textContent).toBe(
			"2. Track 2",
		);
		const sources = [audio.src];
		audio.dispatchEvent(new Event("ended"));
		sources.push(audio.src);
		audio.dispatchEvent(new Event("ended"));
		sources.push(audio.src);
		expect(new Set(sources).size).toBe(3);
		command(host, "Play");
		expect(host.hasAttribute("random")).toBe(false);
		expect(audio.src).toContain("track-1.wav");
		expect(host.querySelector("tp-typewriting")?.textContent).toBe(
			"1. Track 1",
		);
		expect(audio.play).toHaveBeenCalledTimes(4);
	});

	it("clears the previous media and seek position before loading a selected track", () => {
		const host = create();
		const audio = getAudio(host);
		audio.currentTime = 120;
		const loadedSources: (string | null)[] = [];
		vi.mocked(audio.load).mockImplementation(() => {
			loadedSources.push(audio.getAttribute("src"));
		});
		host.querySelectorAll("a")[1]?.click();
		expect(loadedSources[0]).toBeNull();
		expect(loadedSources[1]).toContain("track-2.wav");
		expect(audio.currentTime).toBe(0);
		audio.currentTime = 30;
		host.querySelectorAll("a")[1]?.click();
		expect(audio.currentTime).toBe(0);
		expect(audio.play).toHaveBeenCalledTimes(2);
	});

	it("shows elapsed progress independently of buffering and supports seeking and volume", () => {
		const host = create();
		const audio = getAudio(host);
		Object.defineProperty(audio, "duration", {
			configurable: true,
			value: 200,
		});
		Object.defineProperty(audio, "buffered", {
			value: { length: 1, start: () => 0, end: () => 200 },
		});
		audio.currentTime = 50;
		audio.dispatchEvent(new Event("timeupdate"));
		const position = host.querySelector<HTMLInputElement>(
			'[aria-label="Playback position"]',
		);
		if (!position) throw new Error("Missing position slider");
		expect(
			position.style.getPropertyValue("--tp-audio-playlist-progress"),
		).toBe("25%");
		expect(position.getAttribute("aria-valuetext")).toBe("0:50 / 3:20");
		position.value = "100";
		position.dispatchEvent(new Event("input"));
		expect(audio.currentTime).toBe(100);
		expect(
			position.style.getPropertyValue("--tp-audio-playlist-progress"),
		).toBe("50%");
		command(host, "Mute");
		expect(audio.muted).toBe(true);
		const volume = host.querySelector<HTMLInputElement>(
			'[aria-label="Volume"]',
		);
		if (!volume) throw new Error("Missing volume slider");
		volume.value = "0.5";
		volume.dispatchEvent(new Event("input"));
		expect(audio.volume).toBe(0.5);
		expect(audio.muted).toBe(false);
		Object.defineProperty(audio, "duration", {
			configurable: true,
			value: Number.NaN,
		});
		audio.dispatchEvent(new Event("emptied"));
		expect(position.disabled).toBe(true);
		expect(
			position.style.getPropertyValue("--tp-audio-playlist-progress"),
		).toBe("0%");
	});

	it("reports playback failures without skipping tracks", async () => {
		const host = create();
		const audio = getAudio(host);
		vi.mocked(audio.play).mockRejectedValue(new Error("blocked"));
		command(host, "Next");
		await flush();
		expect(host.querySelector('[role="status"]')?.textContent).toContain(
			"could not start",
		);
		audio.dispatchEvent(new Event("error"));
		expect(host.querySelector('[role="status"]')?.textContent).toContain(
			"Unable to load",
		);
		expect(audio.src).toContain("track-2.wav");
	});

	it("loads src relative to its source context, resolves tracks and restores inline content", async () => {
		const fetcher = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(
				new Response(
					'<ol><li><a href="song.wav" onclick="alert(1)"><b>Remote song</b></a></li></ol><script>bad()</script>',
				),
			);
		const host = create();
		host.setAttribute("data-tp-source", "https://example.org/course/page.html");
		host.setAttribute("src", "audio/list.html");
		await flush();
		expect(fetcher.mock.calls[0]?.[0]).toBe(
			"https://example.org/course/audio/list.html",
		);
		expect(getAudio(host).src).toBe(
			"https://example.org/course/audio/song.wav",
		);
		expect(getAudio(host).play).not.toHaveBeenCalled();
		expect(host.querySelector("script, [onclick], b")).toBeNull();
		expect(host.querySelector("ol:not([hidden]) a")?.textContent).toBe(
			"Remote song",
		);
		host.removeAttribute("src");
		await flush();
		expect(getAudio(host).src).toContain("track-1.wav");
		expect(host.querySelector("ol")?.hidden).toBe(false);
	});
	it("reports missing and malformed sources without playing the inline fallback", async () => {
		const fetcher = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(new Response("Missing", { status: 404 }));
		const host = create();
		host.setAttribute("src", "missing.html");
		await flush();
		expect(host.querySelector('[role="status"]')?.textContent).toContain(
			"Unable to load playlist",
		);
		expect(getAudio(host).hasAttribute("src")).toBe(false);
		fetcher.mockResolvedValue(new Response("<p>No list</p>"));
		host.setAttribute("src", "bad.html");
		await flush();
		expect(host.querySelector('[role="status"]')?.textContent).toContain(
			"Unable to load playlist",
		);
		fetcher.mockResolvedValue(new Response("<ul></ul>"));
		host.setAttribute("src", "empty.html");
		await flush();
		expect(host.querySelector('[role="status"]')?.textContent).toContain(
			"No audio tracks",
		);
	});
	it("ignores stale responses and responses arriving after disconnection", async () => {
		let finish: (response: Response) => void = () => {};
		const fetcher = vi.spyOn(globalThis, "fetch").mockImplementationOnce(
			() =>
				new Promise<Response>((resolve) => {
					finish = resolve;
				}),
		);
		fetcher.mockResolvedValue(
			new Response('<ul><li><a href="new.wav">New</a></li></ul>'),
		);
		const host = create();
		host.setAttribute("src", "old.html");
		host.setAttribute("src", "new.html");
		await flush();
		finish(new Response('<ul><li><a href="old.wav">Old</a></li></ul>'));
		await flush();
		expect(getAudio(host).src).toContain("new.wav");
		fetcher.mockImplementationOnce(
			() =>
				new Promise<Response>((resolve) => {
					finish = resolve;
				}),
		);
		host.setAttribute("src", "late.html");
		host.remove();
		finish(new Response('<ol><li><a href="late.wav">Late</a></li></ol>'));
		await flush();
		expect(host.textContent).not.toContain("Late");
	});
});
