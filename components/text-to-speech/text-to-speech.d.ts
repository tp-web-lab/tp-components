/**
 * @module components/text-to-speech
 * @summary Reads textual component content aloud with the Web Speech API.
 */
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import "../typewriting/typewriting.js";
/**
 * @tagname tp-text-to-speech
 * @summary Reads inline or external text aloud with browser speech synthesis.
 * @attr {string} src = "" - Text file loaded relative to the containing document.
 * @attr {string} value = "" - Text supplied directly as an attribute.
 * @attr {string} for = "" - ID of an element supplying readable text; overrides local sources and synchronizes word boundaries when the target is tp-typewriting.
 * @attr {boolean} show-text = false - Displays the source text alongside the playback controls.
 * @attr {boolean} lite = false - Replaces playback controls with a single speak/stop icon button.
 * @attr {string} voice = "" - Preferred installed voice name or language tag.
 * @attr {number} rate = 1 - Speech rate from 0.1 to 10.
 * @attr {number} pitch = 1 - Speech pitch from 0 to 2.
 * @attr {number} volume = 1 - Speech volume from 0 to 1.
 * @attr {boolean} autoplay = false - Starts reading after the source is loaded when browser policy permits it.
 * @event tp-text-to-speech-start Emitted when speech starts.
 * @eventdetail tp-text-to-speech-start { text: string }
 * @event tp-text-to-speech-end Emitted when speech ends or is stopped.
 * @eventdetail tp-text-to-speech-end { text: string }
 * @event tp-text-to-speech-error Emitted when loading or speech synthesis fails.
 * @eventdetail tp-text-to-speech-error { error: string }
 * @accessibility Uses labelled tp-button controls and announces its current state through a polite status region.
 * @accessibilityresponsibility Do not use synthesized speech as the only way to provide information; retain equivalent visible text.
 * @keyboard {Enter / Space} Activates the native button inside each tp-button control.
 * @example
 * <tp-text-to-speech lang="en" show-text>
 *   <script type="tp/txt">Welcome to tp-components.</script>
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
    /** Pauses the current reading. */
    pause(): void;
    /** Resumes a paused reading. */
    resume(): void;
    /** Stops the current reading. */
    stop(): void;
    /** Returns text from the highest-priority declarative source. */
    private getText;
    /** Refreshes component state after resolving its current text. */
    private updateText;
    /** Renders visible text, playback controls and the status region. */
    private render;
    /** Lists voices in the lang family without changing the author's language. */
    private refreshVoiceMenu;
    /** Updates the machine-readable state and its announced message. */
    private setState;
    /** Resolves an explicit voice name or locale, otherwise leaves the browser default. */
    private selectVoice;
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
