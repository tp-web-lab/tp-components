/**
 * @module components/save-audio
 * @summary Downloads an anchored audio as MP3, OGG or WAV.
 */
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
export type TpSaveAudioFormat = "mp3" | "ogg" | "wav";
export interface AudioSaveTarget {
    saveAudio(format: TpSaveAudioFormat, filename: string): Promise<boolean>;
}
/**
 * The custom `<tp-save-audio>` element saves the associated audio in its original format.
 *
 * @summary Saves the associated audio in its original format.
 * @tagname tp-save-audio
 * @attr {"mp3" | "ogg" | "wav"} format = "mp3" - Initially selected audio format.
 * @attr {string} anchor = "" - CSS selector of an audio element or a component implementing saveAudio(format, filename).
 * @attr {string} name = "save-audio" - Icon used by the trigger.
 * @attr {string} filename = "audio" - Download filename without its extension.
 * @attr {string} variant = "neutral" - Color variant forwarded to the trigger icon button: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Size preset forwarded to the trigger icon button: xxs, xs, s, m, l, xl or xxl.
 * @attr {boolean} disabled = false - Disables the trigger.
 * @event tp-save-audio-save Emitted after an audio file has been saved.
 * @eventdetail tp-save-audio-save { format: "mp3" | "ogg" | "wav"; filename: string; anchor: string; target: Element }
 * @event tp-save-audio-error Emitted when the target cannot be exported.
 * @eventdetail tp-save-audio-error { format: "mp3" | "ogg" | "wav"; error: unknown; anchor: string }
 * @example
 * <p>Listen to the sound of breaking glass, then save the MP3 file.</p>
 * <audio id="save-audio-example" controls="" preload="metadata" aria-label="Sound of breaking glass">
 *   <source src="/docs/medias/audios/glass-break.mp3" type="audio/mpeg">
 * </audio>
 * <tp-save-audio anchor="#save-audio-example" filename="glass-break"></tp-save-audio>
 *  @accessibility Provides a labelled icon trigger with aria-haspopup, aria-controls and synchronized aria-expanded; disables the trigger while saving or when disabled.
 * @accessibility Format entries are focusable and respond to Enter or Space; decorative checkmarks are hidden and the most recently saved format is marked with aria-current.
 * @accessibilityresponsibility Provide an informative trigger label, a compatible audio target and an accessible text alternative for audio content. Present tp-save-audio-error feedback to the user when export fails.
 */
export declare class TpSaveAudio extends TpBase {
    private static readonly styleId;
    private static nextId;
    private dropdownEl;
    target: AudioSaveTarget | null;
    private saving;
    get format(): TpSaveAudioFormat;
    set format(value: TpSaveAudioFormat);
    static get observedAttributes(): string[];
    get anchor(): string;
    set anchor(value: string);
    get name(): string;
    set name(value: string);
    get filename(): string;
    set filename(value: string);
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    get size(): TpSizeType;
    set size(value: TpSizeType);
    get disabled(): boolean;
    set disabled(value: boolean);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    /**
     * @summary Requests the anchored component to save mp3, ogg or wav audio using filename. Resolves after completion or cancellation; does nothing when disabled or already saving. Invalid formats and incompatible targets reject.
     */
    save(format?: TpSaveAudioFormat): Promise<void>;
    /** Resolve only a source actually supplied in the selected format; never relabel audio bytes. */
    private audioSource;
    private saveNativeAudio;
    private ensureControl;
    private readonly syncExpanded;
    private syncCurrentFormat;
    private readonly handleTriggerClick;
    private resolveTarget;
    private safeFilename;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-save-audio": TpSaveAudio;
    }
}
