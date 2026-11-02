export interface VideoSource {
    provider: "native" | "youtube";
    url: string;
    videoId?: string;
}
/** Resolve native media URLs and the supported YouTube watch/share/embed URLs. */
export declare function parseVideoSource(src: string, base: string): VideoSource | null;
