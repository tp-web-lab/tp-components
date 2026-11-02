/**
 * @module components/text-to-speech
 * @summary Reads textual component content aloud with the Web Speech API.
 */
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../typewriting/typewriting.js";
/**
 * @tagname tp-text-to-speech
 * @summary Reads inline or external text aloud with browser speech synthesis.
 * @attr {string} legend = "Text to speech" - Caption of the fieldset surrounding the controls.
 * @attr {string} src = "" - Text file loaded relative to the containing document.
 * @attr {string} value = "" - Text supplied directly as an attribute.
 * @attr {string} for = "" - ID of an element supplying readable text; overrides local sources and synchronizes word boundaries when the target is tp-typewriting.
 * @attr {boolean} show-text = false - Displays the source text alongside the playback controls.
 * @attr {boolean} lite = false - Replaces playback controls with a single speak/stop icon button.
 * @attr {string} voice = "" - Preferred installed voice name or language tag.
 * @attr {number} rate = 1 - Speech rate from 0.1 to 10.
 * @attr {number} pause-between-lines = 0 - Silence in milliseconds between nonempty lines; an explicit [pause=...] overrides it at a line boundary.
 * @attr {number} pause-per-blank-line = 1000 - Additional milliseconds for each blank or whitespace-only line between spoken passages; consecutive blank lines accumulate.
 * @attr {number} pause-after-comma = 200 - Additional silence in milliseconds after commas at a word boundary; zero preserves browser prosody without adding a timer.
 * @attr {number} pause-after-semicolon = 400 - Additional silence in milliseconds after semicolons at a word boundary; zero preserves browser prosody without adding a timer.
 * @attr {number} pause-after-colon = 400 - Additional silence in milliseconds after colons at a word boundary; zero preserves browser prosody without adding a timer.
 * @attr {number} pause-after-sentence = 600 - Additional silence in milliseconds after sentence punctuation (. ! ? and ellipses) at a word boundary; zero preserves browser prosody without adding a timer.
 * @attr {number} pitch = 1 - Speech pitch from 0 to 2.
 * @attr {number} volume = 1 - Speech volume from 0 to 1.
 * @attr {boolean} autoplay = false - Starts reading after the source is loaded when browser policy permits it.
 * @event tp-text-to-speech-start Emitted when speech starts.
 * @eventdetail tp-text-to-speech-start { text: string }
 * @event tp-text-to-speech-end Emitted when the complete reading finishes.
 * @eventdetail tp-text-to-speech-end { text: string }
 * @event tp-text-to-speech-trigger Emitted when a named trigger command is reached during playback; commands are never spoken or shown.
 * @eventdetail tp-text-to-speech-trigger { name: string; offset: number }
 * @event tp-text-to-speech-pause Emitted when active playback is paused.
 * @eventdetail tp-text-to-speech-pause { }
 * @event tp-text-to-speech-resume Emitted when paused playback resumes.
 * @eventdetail tp-text-to-speech-resume { }
 * @event tp-text-to-speech-stop Emitted when active playback is cancelled, including source changes.
 * @eventdetail tp-text-to-speech-stop { }
 * @event tp-text-to-speech-ready Emitted when the current source is loaded and the controls are ready.
 * @eventdetail tp-text-to-speech-ready { }
 * @event tp-text-to-speech-error Emitted when loading or speech synthesis fails.
 * @eventdetail tp-text-to-speech-error { error: string }
 * @accessibility Uses labelled tp-button controls and announces its current state through a polite status region.
 * @accessibilityresponsibility Do not use synthesized speech as the only way to provide information; retain equivalent visible text.
 * @keyboard {Enter / Space} Activates the native button inside each tp-button control.
 * @example
 * <tp-text-to-speech lang="en-GB" show-text>
 *   <script type="tp/txt">
 *     Welcome to tp-components. This example uses the browser speech synthesis service.
 *   </script>
 * </tp-text-to-speech>
 */
export declare class TpTextToSpeech extends TpBase {
    /** Counter ensuring that each settings trigger has a distinct anchor. */
    private static settingsSequence;
    /** Stable identifier shared by the settings trigger and its dropdown. */
    private readonly settingsId;
    /** Speech engine observed while the component is connected. */
    private observedSynthesis;
    /** Refreshes compatible voices when the browser publishes its voice catalogue. */
    private readonly onVoicesChanged;
    /** Attributes whose changes can update the source, rendering or speech. */
    static get observedAttributes(): string[];
    /** Shared reader for `src`, `value`, script and direct-text sources. */
    private readonly source;
    /** Text currently available to the speech engine. */
    private text;
    /** Strong reference retained while the browser is speaking. */
    private utterance;
    private playbackId;
    private playbackActive;
    private advancePlayback;
    private pauseTimer;
    private pauseRemaining;
    private pauseStarted;
    /** Silence between nonempty lines, in milliseconds. */
    get pauseBetweenLines(): number;
    set pauseBetweenLines(value: number);
    /** Additional milliseconds for each blank line between spoken passages. */
    get pausePerBlankLine(): number;
    set pausePerBlankLine(value: number);
    /** Additional milliseconds after commas. */
    get pauseAfterComma(): number;
    set pauseAfterComma(value: number);
    /** Additional milliseconds after semicolons. */
    get pauseAfterSemicolon(): number;
    set pauseAfterSemicolon(value: number);
    /** Additional milliseconds after colons. */
    get pauseAfterColon(): number;
    set pauseAfterColon(value: number);
    /** Additional milliseconds after sentence punctuation (. ! ? and ellipses). */
    get pauseAfterSentence(): number;
    set pauseAfterSentence(value: number);
    /** Sequence used to discard stale asynchronous loads. */
    private updateToken;
    /** Linked visual text, controlled only while this component owns it. */
    private linkedTypewriting;
    /** Document element supplying the current reading, whether animated or static. */
    private linkedTarget;
    /** Stops a reading when the linked author text changes. Visual reveal attributes are ignored. */
    private readonly linkedObserver;
    /** ID of any document element supplying the speech text. */
    get htmlFor(): string;
    /** Changes the linked text source. */
    set htmlFor(value: string);
    /** Resolves the reference without interpreting the ID as a CSS selector. */
    private resolveTarget;
    /** Preserves exact speech offsets for typewriting, and extracts readable text otherwise. */
    private readLinkedText;
    /** External text source URL. */
    get src(): string;
    /** Updates the external text source URL. */
    set src(value: string);
    /** Text supplied directly through the `value` attribute. */
    get value(): string;
    /** Updates the text supplied through the `value` attribute. */
    set value(value: string);
    /** Whether the source text is rendered visibly. */
    get showText(): boolean;
    /** Shows or hides the visible source text. */
    set showText(value: boolean);
    /** Whether only the compact speak/stop control is displayed. */
    get lite(): boolean;
    /** Enables or disables the compact playback control. */
    set lite(value: boolean);
    /** Preferred installed voice name or language tag. */
    get voice(): string;
    /** Updates the preferred voice. */
    set voice(value: string);
    /** Speech rate constrained to the Web Speech API range. */
    get rate(): number;
    /** Updates the speech rate. */
    set rate(value: number);
    /** Speech pitch constrained to the Web Speech API range. */
    get pitch(): number;
    /** Updates the speech pitch. */
    set pitch(value: number);
    /** Speech volume constrained to the Web Speech API range. */
    get volume(): number;
    /** Updates the speech volume. */
    set volume(value: number);
    /** Whether speech starts automatically after loading. */
    get autoplay(): boolean;
    /** Enables or disables automatic speech. */
    set autoplay(value: boolean);
    /** Initializes shared styles, source observation and rendering when connected. */
    protected connectedCallback(): void;
    /** Reacts to source and visible-text attribute changes after connection. */
    protected attributeChangedCallback(name: string): void;
    /** Releases source observation and speech synthesis when disconnected. */
    disconnectedCallback(): void;
    /** Uses the browser's voice for the language unless a voice is explicitly requested. */
    speak(): Promise<void>;
    /** Waits between utterances; user Pause freezes the remaining silence. */
    private schedulePause;
    /** Pauses speech or a scheduled silence. */
    pause(): void;
    /** Resumes speech or the remainder of a scheduled silence. */
    resume(): void;
    /** Cancels speech, queued segments and scheduled silence. */
    stop(): void;
    /** Returns text from the highest-priority declarative source. */
    private getText;
    /** Refreshes component state after resolving its current text. */
    private updateText;
    /** Renders visible text, playback controls and the status region. */
    protected render(): void;
    /** Lists voices in the lang family without changing the author's language. */
    private refreshVoiceMenu;
    /** Updates the machine-readable state and its announced message. */
    private setState;
    /** Waits for browsers that populate their voice list asynchronously. */
    private loadVoices;
    /** Uses the window that owns the component and its user activation. */
    private getSpeechGlobals;
    /** Reads a finite numeric attribute within an accepted range. */
    private numberAttribute;
    /** Displays and emits a component error. */
    private reportError;
    /** Emits a bubbling component event. */
    private emit;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-text-to-speech": TpTextToSpeech;
    }
}
