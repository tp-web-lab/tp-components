import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { YouTubeAPI } from "./youtube-player.js";

beforeEach(() => {
	vi.resetModules();
	vi.useFakeTimers();
	delete window.YT;
	delete window.onYouTubeIframeAPIReady;
	document.head.replaceChildren();
});
afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	delete window.YT;
	delete window.onYouTubeIframeAPIReady;
});

it("shares a single request and preserves an existing readiness callback", async () => {
	const { loadYouTubeAPI } = await import("./youtube-player.js");
	const previous = vi.fn();
	window.onYouTubeIframeAPIReady = previous;
	const first = loadYouTubeAPI();
	expect(loadYouTubeAPI()).toBe(first);
	expect(document.head.querySelectorAll("script")).toHaveLength(1);
	const api = { Player: vi.fn() } as unknown as YouTubeAPI;
	window.YT = api;
	window.onYouTubeIframeAPIReady?.();
	await expect(first).resolves.toBe(api);
	expect(previous).toHaveBeenCalledOnce();
	expect(window.onYouTubeIframeAPIReady).toBe(previous);
});

it("times out, removes the failed script and permits a fresh request", async () => {
	const { loadYouTubeAPI } = await import("./youtube-player.js");
	const first = loadYouTubeAPI();
	const rejection = expect(first).rejects.toThrow(
		"YouTube could not be loaded",
	);
	vi.advanceTimersByTime(15000);
	await rejection;
	expect(document.head.querySelector("script")).toBeNull();
	const second = loadYouTubeAPI();
	expect(second).not.toBe(first);
	const secondRejection = expect(second).rejects.toThrow(
		"YouTube could not be loaded",
	);
	document.head.querySelector("script")?.dispatchEvent(new Event("error"));
	await secondRejection;
});

it("uses an already loaded API without inserting a script", async () => {
	const { loadYouTubeAPI } = await import("./youtube-player.js");
	const api = { Player: vi.fn() } as unknown as YouTubeAPI;
	window.YT = api;
	await expect(loadYouTubeAPI()).resolves.toBe(api);
	expect(document.head.querySelector("script")).toBeNull();
});
