/**
 * @module components/save-audio
 * @summary Downloads an anchored audio as MP3, OGG or WAV.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
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
 * Audio download controller with an embedded dropdown.
 *
 * @summary Saves audio from an associated component in several formats.
 * @tagname tp-save-audio
 * @attr {"mp3" | "ogg" | "wav"} format = "mp3" - Initially selected audio format.
 * @attr {string} anchor = "" - CSS selector of a component implementing saveAudio(format, filename).
 * @attr {string} name = "file-download" - Icon used by the trigger.
 * @attr {string} filename = "audio" - Download filename without its extension.
 * @attr {string} variant = "neutral" - Color variant forwarded to the trigger icon button: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Size preset forwarded to the trigger icon button: xxs, xs, s, m, l, xl or xxl.
 * @attr {boolean} disabled = false - Disables the trigger.
 * @event tp-save-audio-save Emitted after an audio file has been saved.
 * @eventdetail tp-save-audio-save { format: "mp3" | "ogg" | "wav"; filename: string; anchor: string; target: Element }
 * @event tp-save-audio-error Emitted when the target cannot be exported.
 * @eventdetail tp-save-audio-error { format: "mp3" | "ogg" | "wav"; error: unknown; anchor: string }
 * @example
 * <p>Audio saving is reserved for a future integration. No audio provider is currently connected.</p>
 * <tp-save-audio disabled></tp-save-audio>
 * @accessibility Provides a labelled icon trigger with aria-haspopup, aria-controls and synchronized aria-expanded; disables the trigger while saving or when disabled.
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
