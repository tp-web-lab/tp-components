/**
 * @module components/audio-recorder
 * @summary Records microphone audio locally for replay and download.
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
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../button-group/button-group.js";
/**
 * The custom `<tp-audio-recorder>` element records audio for playback, download and optional speech transcription.
 *
 * @summary Records audio for playback, download and optional speech transcription.
 * @attr {string} legend = "Audio recorder" - Caption of the fieldset surrounding the controls.
 * @attr {string} transcript = "" - Safari only (temporary): CSS selector of the element receiving recognized speech; fields receive their value, other elements receive text.
 * @tagname tp-audio-recorder
 * @event tp-audio-recorded Emitted when a recording is ready.
 * @eventdetail tp-audio-recorded { blob: Blob }
 * @example
 * <tp-audio-recorder></tp-audio-recorder>
 *  @accessibility Groups recording controls in a native fieldset with a legend; Record, Stop and Clear use labelled buttons whose disabled state follows recording availability.
 * @accessibility Exposes recording and transcription messages through status regions and provides labelled native audio playback controls and a download link.
 * @accessibilityresponsibility Provide a meaningful legend and an alternative response method when microphone recording is unavailable or unsuitable; review any automatic transcript before using it as an equivalent text alternative.
 */
export declare class TpAudioRecorder extends TpBase {
    static get observedAttributes(): string[];
    /** CSS selector for the transcript destination. */
    get transcript(): string;
    set transcript(value: string);
    protected attributeChangedCallback(name: string): void;
    private transcriptStatus;
    private readonly transcription;
    private recorder;
    private stream;
    private generation;
    private url;
    private pending;
    private recordButton;
    private stopButton;
    private clearButton;
    private audio;
    private download;
    private status;
    private readonly onPageHide;
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    private render;
    private update;
    /** Starts local recording after an explicit action. */
    start(): Promise<void>;
    /** Finishes the recording or cancels a pending microphone request. */
    stop(): void;
    /** Removes the recording and optionally clears transcription. */
    clear(cancelTranscript?: boolean): void;
    private release;
}
