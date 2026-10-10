/**
 * @module components/speech-to-text
 * @summary Transcribes microphone speech using browser speech recognition.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-stack
 * @summary Vertical stack layout component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import "../button/button.js";
import "../stack/stack.js";
import "../textfield/textfield.js";
/**
 * @tagname tp-speech-to-text
 * @summary transcribes microphone speech into editable text using the Web Speech API.
 * @attr {string} value = "" - Final transcript, editable without microphone access.
 * @attr {boolean} continuous = false - Requests multiple recognition results in one session.
 * @attr {boolean} interim-results = false - Displays provisional recognition separately from the final transcript.
 * @attr {boolean} disabled = false - Disables editing and recognition and stops any active session.
 * @event tp-speech-to-text-start Emitted when recognition starts listening.
 * @eventdetail tp-speech-to-text-start { value: string }
 * @event tp-speech-to-text-result Emitted when recognition updates its transcript.
 * @eventdetail tp-speech-to-text-result { value: string; interim: string }
 * @event tp-speech-to-text-end Emitted when recognition ends or is aborted.
 * @eventdetail tp-speech-to-text-end { value: string }
 * @event tp-speech-to-text-error Emitted when recognition fails or is unavailable.
 * @eventdetail tp-speech-to-text-error { error: string }
 * @accessibility Uses labelled native controls through tp-button and tp-textfield, with a polite status region and a keyboard-editable transcript.
 * @accessibilityresponsibility Explain microphone permission and possible remote audio processing; never require speech as the only input method.
 * @keyboard {Tab / Shift+Tab} Moves between playback controls and the transcript field.
 * @keyboard {Enter / Space} Activates a focused button.
 * @example
 * <tp-speech-to-text lang="en-US" interim-results></tp-speech-to-text>
 */
export declare class TpSpeechToText extends TpBase {
    /** Attributes affecting recognition configuration, editing and the transcript. */
    static get observedAttributes(): string[];
    /** The recognition session owned by this component, never a shared global session. */
    private recognition;
    /** Final text preceding the current recognition session. */
    private sessionPrefix;
    /** Current provisional recognition, not committed to value. */
    private interim;
    /** Prevents recursive updates when recognition writes its final transcript. */
    private writingResult;
    /** Current status retained across UI refreshes. */
    private status;
    /** Current lifecycle state, including pending permission and finalization. */
    private state;
    /** Final transcript, also usable as an initial value. */
    get value(): string;
    /** Replaces the final transcript and cancels any in-flight dictation. */
    set value(value: string);
    /** Whether the browser should continue after the first result. */
    get continuous(): boolean;
    /** Configures continuous recognition for the next session. */
    set continuous(value: boolean);
    /** Whether provisional hypotheses are displayed. */
    get interimResults(): boolean;
    /** Configures provisional recognition for the next session. */
    set interimResults(value: boolean);
    /** Whether all user input is disabled. */
    get disabled(): boolean;
    /** Disables input and aborts active recognition. */
    set disabled(value: boolean);
    /** Builds library controls using the shared speech-control styles, loaded once. */
    protected connectedCallback(): void;
    /** Aborts before applying author edits or recognition setting changes. */
    protected attributeChangedCallback(name: string): void;
    /** Releases the microphone and detaches all recognition listeners. */
    disconnectedCallback(): void;
    /** Starts recognition after an explicit user action; never retries automatically. */
    start(): void;
    /** Stops listening while allowing the browser to deliver a final result. */
    stop(): void;
    /** Cancels recognition, discarding provisional text but retaining final text. */
    abort(): void;
    /** Clears the transcript after cancelling active recognition. */
    clear(): void;
    /** Resolves the standard API or the browser-prefixed implementation. */
    private recognitionConstructor;
    /** Handles real listening, distinct from requesting microphone permission. */
    private readonly onStart;
    /** Rebuilds cumulative results to avoid duplication when interim results change. */
    private readonly onResult;
    /** Preserves the browser's error code for permission and service diagnostics. */
    private readonly onError;
    /** Ends the session without automatically opening the microphone again. */
    private readonly onEnd;
    /** Keeps manually edited text authoritative over pending recognition results. */
    private readonly onInput;
    /** Detaches recognition callbacks before cancellation to ignore stale events. */
    private release;
    /** Reports failures without removing the keyboard input alternative. */
    private fail;
    /** Synchronizes existing controls without replacing focused elements. */
    private updateUI;
    /** Emits component-scoped events without suppressing native editing events. */
    private emit;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-speech-to-text": TpSpeechToText;
    }
}
