/** One optional transcription session; recording remains independent of recognition. */
export declare class AudioTranscript {
    private readonly host;
    private readonly report;
    private engine;
    private stopping;
    constructor(host: HTMLElement, report: (message: string) => void);
    /** Explains the temporary Safari-only policy without blocking audio recording. */
    checkBrowser(): boolean;
    start(): void;
    /** Clears the configured destination and ignores late recognition results. */
    clear(): void;
    stop(): void;
    abort(): void;
}
