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
    Player: new (element: HTMLElement, options: {
        videoId?: string;
        width?: string;
        height?: string;
        playerVars?: Record<string, string | number>;
        events: {
            onReady(event: YouTubePlayerEvent): void;
            onStateChange(event: YouTubePlayerEvent): void;
            onError(event: YouTubePlayerEvent): void;
            onAutoplayBlocked(event: YouTubePlayerEvent): void;
        };
    }) => YouTubePlayer;
}
declare global {
    interface Window {
        YT?: YouTubeAPI;
        onYouTubeIframeAPIReady?: () => void;
    }
}
/** Load the shared YouTube API once; failed requests can be retried. */
export declare function loadYouTubeAPI(): Promise<YouTubeAPI>;
