/**
 * @module components/slide-note
 * @summary Collapsible speaker notes with speech playback and presentation docking.
 */
/**
 * @tp-dependency tp-text-to-speech
 * @summary Reads textual component content aloud with the Web Speech API.
 */
import { TpTextToSpeech } from "../text-to-speech/text-to-speech.js";
/**
 * The custom `<tp-slide-note>` element displays collapsible speaker notes for a presentation.
 *
 * @tagname tp-slide-note
 * @summary Displays collapsible speaker notes for a presentation.
 * @attr {boolean} open = false - Expands the notes panel; closing it does not stop narration.
 * @cssprop --tp-slide-note-width = 36rem - Maximum width of docked notes.
 * @cssprop --tp-slide-note-gap = .5rem - Space between docked notes and the presentation menu.
 * @keyboard {Enter / Space} Expands or collapses the focused notes summary.
 * @example
 * <tp-slide-note legend="Speaker notes" lang="en-GB" show-text="">
 *   <script type="tp/txt">Introduce the idea. [trigger=clic] Explain the next step.</script>
 * </tp-slide-note>
 */
export declare class TpSlideNote extends TpTextToSpeech {
    static get observedAttributes(): string[];
    /** Whether the speaker notes are expanded. */
    get open(): boolean;
    set open(value: boolean);
    private panel;
    private anchor;
    private resizeObserver;
    private deckObserver;
    private frame;
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    /** Keeps the shared speech controls and their source intact inside a native disclosure. */
    protected render(): void;
    private readonly schedulePosition;
    private positionNotes;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-slide-note": TpSlideNote;
    }
}
