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
import { TpBase } from "../base/base.js";
import "../frame/frame.js";
import "../button/button.js";
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
 * The custom `<tp-video-player>` element plays video files and YouTube videos.
 *
 * @summary Plays video files and YouTube videos.
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
 * <tp-video-player src="/docs/components/video-player/examples/clip-1.mp4" controls="" label="Moving shapes"></tp-video-player>
 */
export declare class TpVideoPlayer extends TpBase {
    private source;
    private video;
    private youtube;
    private youtubeReady;
    private generation;
    private pendingPlay;
    private pendingSeek;
    private readyTimer;
    private status;
    static get observedAttributes(): string[];
    get src(): string;
    set src(value: string);
    get poster(): string;
    set poster(value: string);
    get label(): string;
    set label(value: string);
    get controls(): boolean;
    set controls(value: boolean);
    get autoplay(): boolean;
    set autoplay(value: boolean);
    get muted(): boolean;
    set muted(value: boolean);
    get loop(): boolean;
    set loop(value: boolean);
    get preload(): "none" | "metadata" | "auto";
    set preload(value: "none" | "metadata" | "auto");
    /** Active provider inferred from src, or empty when no valid source is loaded. */
    get provider(): "native" | "youtube" | "";
    /** Current playback position in seconds; zero before metadata is available. */
    get currentTime(): number;
    /** Video duration in seconds; zero before metadata is available. */
    get duration(): number;
    /** Whether playback is currently paused or has not started. */
    get paused(): boolean;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Requests playback. YouTube requests made before readiness are queued; its autoplay-blocked event reports browser refusal.
     * @returns Native playback promise, or a resolved promise after queuing a YouTube request.
     */
    play(): Promise<void>;
    /** Pauses playback and cancels a queued playback request. */
    pause(): void;
    /**
     * Seeks to a nonnegative position, queuing the request while a provider loads.
     * @param seconds Position in seconds. Must be finite and nonnegative.
     */
    seekTo(seconds: number): void;
    private emit;
    private reportError;
    private release;
    private render;
    private applyOptions;
    private renderNative;
    private renderYouTube;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-video-player": TpVideoPlayer;
    }
}
