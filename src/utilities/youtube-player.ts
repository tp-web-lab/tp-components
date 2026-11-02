/** Minimal types for the official YouTube IFrame Player API. */
export interface YouTubePlayer {
	playVideo(): void;
	pauseVideo(): void;
	seekTo(seconds: number, allowSeekAhead: boolean): void;
	getCurrentTime(): number;
	getDuration(): number;
	getPlayerState(): number;
	mute(): void;
	unMute(): void;
	getIframe(): HTMLIFrameElement;
	destroy(): void;
}

export interface YouTubePlayerEvent {
	target: YouTubePlayer;
	data?: number;
}

export interface YouTubeAPI {
	Player: new (
		element: HTMLElement,
		options: {
			videoId: string;
			width: string;
			height: string;
			playerVars: Record<string, string | number>;
			events: {
				onReady(event: YouTubePlayerEvent): void;
				onStateChange(event: YouTubePlayerEvent): void;
				onError(event: YouTubePlayerEvent): void;
				onAutoplayBlocked(event: YouTubePlayerEvent): void;
			};
		},
	) => YouTubePlayer;
}

declare global {
	interface Window {
		YT?: YouTubeAPI;
		onYouTubeIframeAPIReady?: () => void;
	}
}

let pending: Promise<YouTubeAPI> | undefined;

/** Load the shared YouTube API once; failed requests can be retried. */
export function loadYouTubeAPI(): Promise<YouTubeAPI> {
	if (window.YT?.Player) return Promise.resolve(window.YT);
	if (pending) return pending;
	pending = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		const previous = window.onYouTubeIframeAPIReady;
		const timeout = window.setTimeout(fail, 15000);
		function fail(): void {
			window.clearTimeout(timeout);
			window.onYouTubeIframeAPIReady = previous;
			script.remove();
			pending = undefined;
			reject(new Error("YouTube could not be loaded."));
		}
		window.onYouTubeIframeAPIReady = () => {
			window.clearTimeout(timeout);
			window.onYouTubeIframeAPIReady = previous;
			if (window.YT?.Player) resolve(window.YT);
			else {
				fail();
				return;
			}
			previous?.();
		};
		script.src = "https://www.youtube.com/iframe_api";
		script.addEventListener("error", fail, { once: true });
		document.head.append(script);
	});
	return pending;
}
