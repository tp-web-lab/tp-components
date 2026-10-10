/** Minimal recognition result contract, including interim hypotheses. */
export interface RecognitionResult {
    readonly isFinal: boolean;
    readonly [index: number]: {
        readonly transcript: string;
    };
}
/** Browser result event: results contains the complete current session. */
export interface RecognitionResultEvent extends Event {
    readonly results: ArrayLike<RecognitionResult>;
}
/** Browser recognition error code. */
export interface RecognitionErrorEvent extends Event {
    readonly error: string;
}
/** Standard or prefixed browser recognition engine. */
export interface RecognitionEngine extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    abort(): void;
}
/** Constructor exposed by supporting browsers. */
export type RecognitionConstructor = new () => RecognitionEngine;
