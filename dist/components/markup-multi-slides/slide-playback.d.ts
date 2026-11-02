/** @module components/markup-multi-slides/slide-playback */
import type { TpTextToSpeech } from "../text-to-speech/text-to-speech.js";
export type SlideAutoMode = "" | "notes" | "timing";
export type SlidePlaybackState = "stopped" | "playing" | "paused";
type AdvanceResult = "step" | "slide" | "end";
/** Coordinates one presentation's clock and current speaker notes. */
export declare class SlidePlayback {
    private readonly advance;
    private readonly changed;
    private readonly restartNotes;
    state: SlidePlaybackState;
    private mode;
    private duration;
    private page;
    private waitingPage;
    private reader;
    private ready;
    private narrated;
    private timer;
    private remaining;
    private startedAt;
    private commanding;
    constructor(advance: () => AdvanceResult, changed: () => void, restartNotes?: () => void);
    configure(mode: SlideAutoMode, duration: number): void;
    sync(page: Element | null, reader: TpTextToSpeech | null, ready: boolean): void;
    play(): void;
    pause(): void;
    stop(): void;
    dispose(): void;
    private run;
    private next;
    private clearTimer;
    private releaseReader;
    private listenReader;
    private trigger;
    private readyReader;
    private endReader;
    private startReader;
    private pauseReader;
    private resumeReader;
    private stopReader;
}
export {};
