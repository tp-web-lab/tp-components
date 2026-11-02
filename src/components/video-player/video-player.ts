// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-frame
 * @summary displays content in a fixed-aspect-ratio frame.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../frame/frame.js";
import "../button/button.js";
import { getComponentSourceBaseUrl } from "../../utilities/source-url.js";
import {
	loadYouTubeAPI,
	type YouTubePlayer,
} from "../../utilities/youtube-player.js";
import style from "./video-player.css?inline";
import { parseVideoSource, type VideoSource } from "./video-source.js";

/** Details shared by playback lifecycle events. */
export interface TpVideoPlayerEventDetail {
	src: string;
	provider: "native" | "youtube" | "";
}

/** Details reported when media cannot load or play. */
export interface TpVideoPlayerErrorDetail extends TpVideoPlayerEventDetail {
	message: string;
	code?: number;
}

/**
 * @summary Plays native video files and YouTube videos with a common playback API.
 * @tagname tp-video-player
 * @attr {string} src = "" - Native media URL or YouTube watch, share, shorts, live or embed URL. Changing it loads the new video from the beginning.
 * @attr {string} poster = "" - Image shown before native video playback; YouTube supplies its own preview.
 * @attr {string} label = "Video" - Accessible name for the native video or YouTube iframe.
 * @attr {boolean} controls = false - Shows the provider's playback controls. YouTube may still display its initial Play button.
 * @attr {boolean} autoplay = false - Requests playback when the source loads; browser autoplay restrictions still apply.
 * @attr {boolean} muted = false - Mutes the video, including when changed during playback.
 * @attr {boolean} loop = false - Repeats the video; a looping video does not normally emit ended.
 * @attr {"none" | "metadata" | "auto"} preload = "metadata" - Native video preload hint. YouTube loading is controlled by its embedded player.
 * @event tp-video-player-ready Emitted when native metadata or the YouTube player is ready.
 * @eventdetail tp-video-player-ready { src: string; provider: "native" | "youtube" | "" }
 * @event tp-video-player-play Emitted when playback starts.
 * @eventdetail tp-video-player-play { src: string; provider: "native" | "youtube" | "" }
 * @event tp-video-player-pause Emitted when playback pauses.
 * @eventdetail tp-video-player-pause { src: string; provider: "native" | "youtube" | "" }
 * @event tp-video-player-ended Emitted when a non-looping video reaches its end.
 * @eventdetail tp-video-player-ended { src: string; provider: "native" | "youtube" | "" }
 * @event tp-video-player-error Emitted when a source is invalid, unavailable or playback fails.
 * @eventdetail tp-video-player-error { src: string; provider: "native" | "youtube" | ""; message: string; code?: number }
 * @event tp-video-player-autoplay-blocked Emitted when YouTube blocks a playback request. Native play() rejects its promise when blocked.
 * @eventdetail tp-video-player-autoplay-blocked { src: string; provider: "native" | "youtube" | "" }
 * @accessibility Retains native or YouTube controls and labels the active media surface.
 * @accessibilityresponsibility Supply captions in the video source/provider and a meaningful label.
 * @example
 * <tp-video-player src="/docs/components/video-player/examples/clip-1.mp4" controls label="Moving shapes"></tp-video-player>
 */
export class TpVideoPlayer extends TpBase {
	private source: VideoSource | null = null;
	private video: HTMLVideoElement | null = null;
	private youtube: YouTubePlayer | null = null;
	private youtubeReady = false;
	private generation = 0;
	private pendingPlay = false;
	private pendingSeek: number | null = null;
	private readyTimer: ReturnType<typeof setTimeout> | undefined;
	private status: HTMLParagraphElement | null = null;

	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"src",
			"poster",
			"label",
			"controls",
			"autoplay",
			"muted",
			"loop",
			"preload",
		];
	}

	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	public get poster(): string {
		return this.getAttribute("poster") ?? "";
	}
	public set poster(value: string) {
		this.setAttribute("poster", value);
	}
	public get label(): string {
		return this.getAttribute("label") || "Video";
	}
	public set label(value: string) {
		this.setAttribute("label", value);
	}
	public get controls(): boolean {
		return this.hasAttribute("controls");
	}
	public set controls(value: boolean) {
		this.toggleAttribute("controls", value);
	}
	public get autoplay(): boolean {
		return this.hasAttribute("autoplay");
	}
	public set autoplay(value: boolean) {
		this.toggleAttribute("autoplay", value);
	}
	public get muted(): boolean {
		return this.hasAttribute("muted");
	}
	public set muted(value: boolean) {
		this.toggleAttribute("muted", value);
	}
	public get loop(): boolean {
		return this.hasAttribute("loop");
	}
	public set loop(value: boolean) {
		this.toggleAttribute("loop", value);
	}
	public get preload(): "none" | "metadata" | "auto" {
		const value = this.getAttribute("preload");
		return value === "none" || value === "auto" ? value : "metadata";
	}
	public set preload(value: "none" | "metadata" | "auto") {
		this.setAttribute("preload", value);
	}

	/** Active provider inferred from src, or empty when no valid source is loaded. */
	public get provider(): "native" | "youtube" | "" {
		return this.source?.provider ?? "";
	}
	/** Current playback position in seconds; zero before metadata is available. */
	public get currentTime(): number {
		return (
			this.video?.currentTime ??
			(this.youtubeReady ? (this.youtube?.getCurrentTime() ?? 0) : 0)
		);
	}
	/** Video duration in seconds; zero before metadata is available. */
	public get duration(): number {
		return (
			this.video?.duration ||
			(this.youtubeReady ? (this.youtube?.getDuration() ?? 0) : 0)
		);
	}
	/** Whether playback is currently paused or has not started. */
	public get paused(): boolean {
		return (
			this.video?.paused ??
			(!this.youtubeReady || this.youtube?.getPlayerState() !== 1)
		);
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-video-player-styles", style);
		this.render();
	}

	protected disconnectedCallback(): void {
		this.release();
	}

	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (name === "dir" || name === "lang") {
			super.attributeChangedCallback(name, oldValue, newValue);
			return;
		}
		if (oldValue === newValue || !this.isConnected) return;
		if (
			name === "src" ||
			(this.provider === "youtube" && ["controls", "loop"].includes(name))
		)
			this.render();
		else {
			this.applyOptions();
			if (name === "autoplay" && this.autoplay)
				void this.play().catch(() => {});
		}
	}

	/**
	 * Requests playback. YouTube requests made before readiness are queued; its autoplay-blocked event reports browser refusal.
	 * @returns Native playback promise, or a resolved promise after queuing a YouTube request.
	 */
	public async play(): Promise<void> {
		this.pendingPlay = true;
		if (this.video) {
			try {
				await this.video.play();
			} catch (error) {
				this.reportError(
					error instanceof Error || error instanceof DOMException
						? error.message
						: "Playback was blocked.",
				);
				throw error;
			}
		} else if (this.youtubeReady) this.youtube?.playVideo();
	}

	/** Pauses playback and cancels a queued playback request. */
	public pause(): void {
		this.pendingPlay = false;
		this.video?.pause();
		if (this.youtubeReady) this.youtube?.pauseVideo();
	}

	/**
	 * Seeks to a nonnegative position, queuing the request while a provider loads.
	 * @param seconds Position in seconds. Must be finite and nonnegative.
	 */
	public seekTo(seconds: number): void {
		if (!Number.isFinite(seconds) || seconds < 0)
			throw new RangeError("seconds must be finite and nonnegative.");
		this.pendingSeek = seconds;
		if (this.video && this.video.readyState >= 1) {
			this.video.currentTime = seconds;
			this.pendingSeek = null;
		} else if (this.youtubeReady) {
			this.youtube?.seekTo(seconds, true);
			this.pendingSeek = null;
		}
	}

	private emit(
		name: string,
		extra: Partial<TpVideoPlayerErrorDetail> = {},
	): void {
		this.dispatchEvent(
			new CustomEvent(`tp-video-player-${name}`, {
				bubbles: true,
				detail: { src: this.src, provider: this.provider, ...extra },
			}),
		);
	}

	private reportError(message: string, code?: number): void {
		clearTimeout(this.readyTimer);
		if (this.status) {
			this.status.hidden = false;
			this.status.textContent = message;
		}
		this.emit("error", { message, code });
	}

	private release(): void {
		this.generation++;
		clearTimeout(this.readyTimer);
		this.youtubeReady = false;
		this.youtube?.destroy();
		this.youtube = null;
		if (this.video) {
			this.video.pause();
			this.video.removeAttribute("src");
			this.video.load();
			this.video = null;
		}
		this.pendingSeek = null;
	}

	private render(): void {
		this.release();
		this.source = parseVideoSource(this.src, getComponentSourceBaseUrl(this));
		this.pendingPlay = this.autoplay;
		this.setAttribute("data-provider", this.provider);
		this.replaceChildren();
		this.status = document.createElement("p");
		this.status.dataset.videoStatus = "";
		this.status.setAttribute("role", "status");
		this.status.hidden = true;
		const frame = document.createElement("tp-frame");
		this.append(frame, this.status);
		if (!this.source) {
			frame.hidden = true;
			if (this.src.trim())
				this.reportError("Use a video file URL or a valid YouTube video URL.");
			return;
		}
		const fallback = document.createElement("tp-button");
		fallback.setAttribute("href", this.source.url);
		fallback.setAttribute("target", "_blank");
		fallback.setAttribute("rel", "noopener");
		fallback.setAttribute(
			"data-help-description",
			"Open the current video source in a new browser tab.",
		);
		fallback.textContent =
			this.provider === "youtube" ? "Watch on YouTube" : "Open video";
		this.append(fallback);
		if (this.provider === "native") this.renderNative(frame);
		else void this.renderYouTube(frame, this.generation);
	}

	private applyOptions(): void {
		if (this.video) {
			this.video.controls = this.controls;
			this.video.autoplay = this.autoplay;
			this.video.muted = this.muted;
			this.video.defaultMuted = this.muted;
			this.video.loop = this.loop;
			this.video.preload = this.preload;
			try {
				this.video.poster = this.poster
					? new URL(this.poster, getComponentSourceBaseUrl(this)).href
					: "";
			} catch {
				this.video.poster = "";
			}
			this.video.setAttribute("aria-label", this.label);
		}
		if (this.youtubeReady && this.youtube) {
			if (this.muted) this.youtube.mute();
			else this.youtube.unMute();
			this.youtube.getIframe().title = this.label;
		}
	}

	private renderNative(frame: HTMLElement): void {
		const video = document.createElement("video");
		this.video = video;
		video.playsInline = true;
		video.src = this.source?.url ?? "";
		this.applyOptions();
		const generation = this.generation;
		for (const name of ["play", "pause", "ended"])
			video.addEventListener(name, () => {
				if (this.generation === generation) this.emit(name);
			});
		video.addEventListener("loadedmetadata", () => {
			if (this.generation !== generation) return;
			if (this.pendingSeek !== null) this.seekTo(this.pendingSeek);
			this.emit("ready");
		});
		video.addEventListener("error", () => {
			if (this.generation === generation)
				this.reportError(
					"This video file could not be loaded.",
					video.error?.code,
				);
		});
		frame.append(video);
	}

	private async renderYouTube(
		frame: HTMLElement,
		generation: number,
	): Promise<void> {
		const videoId = this.source?.videoId;
		if (!videoId) return;
		try {
			const api = await loadYouTubeAPI();
			if (generation !== this.generation || !this.isConnected) return;
			const target = document.createElement("div");
			frame.append(target);
			this.readyTimer = setTimeout(() => {
				if (generation === this.generation)
					this.reportError(
						"The YouTube player did not respond. Use Watch on YouTube.",
					);
			}, 15000);
			this.youtube = new api.Player(target, {
				videoId,
				width: "100%",
				height: "100%",
				playerVars: {
					origin: window.location.origin,
					playsinline: 1,
					controls: this.controls ? 1 : 0,
					...(this.loop ? { loop: 1, playlist: videoId } : {}),
					rel: 0,
				},
				events: {
					onReady: (event) => {
						if (generation !== this.generation) return;
						clearTimeout(this.readyTimer);
						this.youtube = event.target;
						this.youtubeReady = true;
						const iframe = this.youtube.getIframe();
						iframe.setAttribute(
							"allow",
							"autoplay; encrypted-media; picture-in-picture; fullscreen",
						);
						iframe.setAttribute("allowfullscreen", "");
						iframe.setAttribute(
							"referrerpolicy",
							"strict-origin-when-cross-origin",
						);
						this.applyOptions();
						if (this.pendingSeek !== null) this.seekTo(this.pendingSeek);
						if (this.pendingPlay) this.youtube.playVideo();
						this.emit("ready");
					},
					onStateChange: (event) => {
						if (generation !== this.generation || !this.youtubeReady) return;
						if (event.data === 1) this.emit("play");
						if (event.data === 2) this.emit("pause");
						if (event.data === 0) this.emit("ended");
					},
					onError: (event) => {
						if (generation === this.generation)
							this.reportError(
								"This YouTube video is unavailable or embedding is disabled. Use Watch on YouTube.",
								event.data,
							);
					},
					onAutoplayBlocked: () => {
						if (generation !== this.generation) return;
						if (this.status) {
							this.status.hidden = false;
							this.status.textContent =
								"Press Play in the YouTube player to continue.";
						}
						this.emit("autoplay-blocked");
					},
				},
			});
		} catch (error) {
			if (generation === this.generation)
				this.reportError(
					error instanceof Error || error instanceof DOMException
						? error.message
						: "YouTube could not be loaded.",
				);
		}
	}
}
if (!customElements.get("tp-video-player"))
	customElements.define("tp-video-player", TpVideoPlayer);
declare global {
	interface HTMLElementTagNameMap {
		"tp-video-player": TpVideoPlayer;
	}
}
