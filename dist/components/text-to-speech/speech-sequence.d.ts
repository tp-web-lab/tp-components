/** @module components/text-to-speech/speech-sequence */
export type SpeechStep = {
    text: string;
    offset: number;
    voice?: string;
} | {
    pause: number;
    explicit: boolean;
} | {
    trigger: string;
    offset: number;
};
/** Additional punctuation and blank-line silences, in milliseconds. */
export interface SpeechPauses {
    blankLine?: number;
    comma?: number;
    semicolon?: number;
    colon?: number;
    sentence?: number;
}
/** Browser timers accept nonnegative integer millisecond durations. */
export declare function pauseMilliseconds(value: string): number;
/** Returns only passages enabled for speech; display commands are independent. */
export declare function spokenSpeechText(source: string): string;
/** Hides selected transcript passages without changing what is read aloud. */
export declare function visibleSpeechText(source: string): string;
/** Retains source offsets for linked typewriting word boundaries. */
export declare function speechSequence(source: string, linePause: number, punctuation?: SpeechPauses): SpeechStep[];
