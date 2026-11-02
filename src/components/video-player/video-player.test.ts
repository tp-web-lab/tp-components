import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	loadYouTubeAPI,
	type YouTubeAPI,
} from "../../utilities/youtube-player.js";
import { TpVideoPlayer } from "./video-player.js";
import { parseVideoSource } from "./video-source.js";

vi.mock("../../utilities/youtube-player.js", () => ({
	loadYouTubeAPI: vi.fn(),
}));

type Options = ConstructorParameters<YouTubeAPI["Player"]>[1];
const players: FakeYouTube[] = [];
class FakeYouTube {
	public readonly iframe = document.createElement("iframe");
	public readonly events: Options["events"];
	public playVideo = vi.fn();
	public pauseVideo = vi.fn();
	public seekTo = vi.fn();
	public getCurrentTime = () => 12;
	public getDuration = () => 100;
	public getPlayerState = () => 1;
	public mute = vi.fn();
	public unMute = vi.fn();
	public getIframe = () => this.iframe;
	public destroy = vi.fn(() => this.iframe.remove());
	public constructor(
		target: HTMLElement,
		public options: Options,
	) {
		this.events = options.events;
		target.replaceWith(this.iframe);
		players.push(this);
	}
	public ready(): void {
		this.events.onReady({ target: this });
	}
}
const tick = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
const mount = (src = "/clip.mp4"): TpVideoPlayer => {
	const element = document.createElement("tp-video-player");
	element.src = src;
	element.controls = true;
	document.body.append(element);
	return element;
};

beforeEach(() => {
	vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
	vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
	vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
	vi.mocked(loadYouTubeAPI).mockResolvedValue({ Player: FakeYouTube });
	players.length = 0;
});
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

describe("video source selection", () => {
	it.each([
		"https://youtu.be/4n0M4YRAVjc?t=5",
		"https://www.youtube.com/watch?v=4n0M4YRAVjc",
		"https://www.youtube-nocookie.com/embed/4n0M4YRAVjc",
		"https://m.youtube.com/shorts/4n0M4YRAVjc",
		"https://youtube.com/live/4n0M4YRAVjc",
	])("recognizes the YouTube source %s", (src) => {
		expect(parseVideoSource(src, document.baseURI)?.videoId).toBe(
			"4n0M4YRAVjc",
		);
	});
	it("rejects invalid YouTube IDs and unsafe link schemes without confusing other hosts", () => {
		expect(
			parseVideoSource("https://youtube.com/watch?v=bad", document.baseURI),
		).toBeNull();
		expect(
			parseVideoSource("javascript:alert(1)", document.baseURI),
		).toBeNull();
		expect(
			parseVideoSource(
				"https://youtube.com.evil.test/file.mp4",
				document.baseURI,
			)?.provider,
		).toBe("native");
	});
});

describe("native video playback", () => {
	it("registers, reuses library framing and reflects dynamic playback settings", () => {
		const element = mount();
		const video = element.querySelector("video");
		expect(element).toBeInstanceOf(TpVideoPlayer);
		expect(element.querySelector("tp-frame > video")).toBe(video);
		expect(video?.controls).toBe(true);
		expect(video?.playsInline).toBe(true);
		element.muted = true;
		element.loop = true;
		element.preload = "none";
		element.poster = "/poster.jpg";
		element.label = "Lesson video";
		expect(element.querySelector("video")).toBe(video);
		expect(video?.muted).toBe(true);
		expect(video?.loop).toBe(true);
		expect(video?.preload).toBe("none");
		expect(video?.getAttribute("aria-label")).toBe("Lesson video");
		element.controls = false;
		expect(video?.controls).toBe(false);
	});
	it("resolves native media and posters relative to their Markdown document", () => {
		const documentContent = document.createElement("div");
		documentContent.setAttribute(
			"data-tp-markdown-source",
			"https://example.test/course/lesson/index.md",
		);
		const element = document.createElement("tp-video-player");
		element.src = "../media/clip.mp4";
		element.poster = "../media/poster.svg";
		documentContent.append(element);
		document.body.append(documentContent);
		expect(element.querySelector("video")?.src).toBe(
			"https://example.test/course/media/clip.mp4",
		);
		expect(element.querySelector("video")?.poster).toBe(
			"https://example.test/course/media/poster.svg",
		);
	});

	it("plays, pauses, seeks after metadata and emits common lifecycle events", async () => {
		const element = mount();
		const video = element.querySelector("video");
		if (!video) throw new Error("Missing video");
		const ready = vi.fn();
		const ended = vi.fn();
		element.addEventListener("tp-video-player-ready", ready);
		element.addEventListener("tp-video-player-ended", ended);
		element.seekTo(4);
		Object.defineProperty(video, "readyState", { value: 1 });
		video.dispatchEvent(new Event("loadedmetadata"));
		expect(video.currentTime).toBe(4);
		expect(ready).toHaveBeenCalledOnce();
		await element.play();
		expect(video.play).toHaveBeenCalledOnce();
		element.pause();
		expect(video.pause).toHaveBeenCalled();
		video.dispatchEvent(new Event("ended"));
		expect(ended.mock.calls[0]?.[0].detail).toEqual({
			src: "/clip.mp4",
			provider: "native",
		});
		expect(() => element.seekTo(-1)).toThrow(RangeError);
		expect(() => element.seekTo(Number.NaN)).toThrow(RangeError);
	});
	it("reports loading errors and rejected playback requests", async () => {
		const element = mount();
		const error = vi.fn();
		element.addEventListener("tp-video-player-error", error);
		element.querySelector("video")?.dispatchEvent(new Event("error"));
		expect(error).toHaveBeenCalledOnce();
		vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(
			new DOMException("Blocked", "NotAllowedError"),
		);
		await expect(element.play()).rejects.toThrow("Blocked");
		expect(element.querySelector('[role="status"]')?.textContent).toBe(
			"Blocked",
		);
	});
	it("invalidates stale events and releases media when changing src or disconnecting", () => {
		const element = mount();
		const oldVideo = element.querySelector("video");
		const ended = vi.fn();
		element.addEventListener("tp-video-player-ended", ended);
		element.src = "/next.mp4";
		oldVideo?.dispatchEvent(new Event("ended"));
		expect(ended).not.toHaveBeenCalled();
		expect(oldVideo?.hasAttribute("src")).toBe(false);
		element.remove();
		expect(element.querySelector("video")?.hasAttribute("src")).toBe(false);
		document.body.append(element);
		expect(element.querySelector("video")?.src).toContain("/next.mp4");
	});
});

describe("YouTube playback", () => {
	it("queues play and seek, forwards events, keeps errors visible and supports muting", async () => {
		const element = mount("https://youtu.be/4n0M4YRAVjc");
		const ended = vi.fn();
		element.addEventListener("tp-video-player-ended", ended);
		await element.play();
		element.seekTo(7);
		await tick();
		const player = players[0];
		if (!player) throw new Error("Missing player");
		player.ready();
		expect(player.playVideo).toHaveBeenCalledOnce();
		expect(player.seekTo).toHaveBeenCalledWith(7, true);
		expect(player.getIframe().title).toBe("Video");
		expect(element.provider).toBe("youtube");
		expect(element.currentTime).toBe(12);
		expect(element.duration).toBe(100);
		element.muted = true;
		expect(player.mute).toHaveBeenCalledOnce();
		player.events.onStateChange({ target: player, data: 0 });
		expect(ended).toHaveBeenCalledOnce();
		player.events.onAutoplayBlocked({ target: player });
		expect(element.querySelector('[role="status"]')?.textContent).toContain(
			"Press Play",
		);
		player.events.onError({ target: player, data: 101 });
		expect(element.querySelector('[role="status"]')?.textContent).toContain(
			"unavailable",
		);
		expect(
			element.querySelector("tp-button[href]")?.getAttribute("href"),
		).toContain("watch?v=4n0M4YRAVjc");
	});
	it("cancels queued playback, ignores obsolete callbacks and destroys old embeds", async () => {
		const element = mount("https://youtu.be/4n0M4YRAVjc");
		await element.play();
		element.pause();
		await tick();
		const player = players[0];
		if (!player) throw new Error("Missing player");
		player.ready();
		expect(player.playVideo).not.toHaveBeenCalled();
		const ended = vi.fn();
		element.addEventListener("tp-video-player-ended", ended);
		element.src = "/clip.mp4";
		expect(player.destroy).toHaveBeenCalledOnce();
		player.events.onStateChange({ target: player, data: 0 });
		expect(ended).not.toHaveBeenCalled();
	});
	it("rebuilds looping embeds with a playlist only when looping is enabled", async () => {
		const element = mount("https://youtu.be/4n0M4YRAVjc");
		await tick();
		const initial = players[0];
		if (!initial) throw new Error("Missing player");
		initial.ready();
		element.loop = true;
		await tick();
		const looping = players.at(-1);
		if (!looping) throw new Error("Missing looping player");
		expect(initial.destroy).toHaveBeenCalledOnce();
		expect(looping.options.playerVars.loop).toBe(1);
		expect(looping.options.playerVars.playlist).toBe("4n0M4YRAVjc");
		element.loop = false;
		await tick();
		expect(players.at(-1)?.options.playerVars).not.toHaveProperty("playlist");
	});

	it("never mounts an iframe after disconnection or a later native source", async () => {
		let resolveAPI: ((value: YouTubeAPI) => void) | undefined;
		vi.mocked(loadYouTubeAPI).mockReturnValue(
			new Promise((resolve) => {
				resolveAPI = resolve;
			}),
		);
		const element = mount("https://youtu.be/4n0M4YRAVjc");
		element.remove();
		resolveAPI?.({ Player: FakeYouTube });
		await tick();
		expect(players).toHaveLength(0);
	});
	it("renders a readable error when the API fails", async () => {
		vi.mocked(loadYouTubeAPI).mockRejectedValue(new Error("Offline"));
		const element = mount("https://youtu.be/4n0M4YRAVjc");
		await tick();
		expect(element.querySelector('[role="status"]')?.textContent).toBe(
			"Offline",
		);
		expect(element.querySelector("tp-button[href]")).not.toBeNull();
	});
});
