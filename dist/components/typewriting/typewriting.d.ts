/** @module components/typewriting */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * @summary progressively reveals text one letter or one word at a time.
 * @tagname tp-typewriting
 * @attr {number} speed = 20 - Letters per second, or words per second with word; zero pauses the reveal.
 * @attr {number} delay = 0 - Milliseconds before the first reveal and between repetitions.
 * @attr {boolean} loop = false - Repeats the reveal after the complete text has been displayed.
 * @attr {boolean} word = false - Reveals whole words instead of Unicode grapheme clusters.
 * @accessibility Complete text remains available to assistive technology without repeated live announcements. Reduced motion reveals everything immediately.
 * @accessibility Keyboard focus or a pointer press reveals all text and stops repetition.
 * @keyboard {Tab} Focus the component to reveal all text and stop the animation.
 * @example
 * <tp-typewriting speed="20">
 *   <p>Welcome to <strong>tp-components</strong>. Make your words appear progressively.</p>
 * </tp-typewriting>
 */
export declare class TpTypewriting extends TpBase {
    /** Text fragments in document order; opacity preserves layout and accessible text. */
    private units;
    /** Pending reveal or initialization task. */
    private timer;
    /** Number of fragments already revealed. */
    private position;
    /** Original author tab position, restored after the animation. */
    private authorTabindex;
    /** Whether this instance temporarily added a keyboard focus stop. */
    private ownsTabindex;
    /** Current operating-system motion preference. */
    private motion;
    /** Speech controller currently owning the reveal instead of the local clock. */
    private speechController;
    /** UTF-16 end offsets matching the exact utterance text. */
    private speechEnds;
    /** Exact text used to resolve the current spoken word. */
    private speechText;
    /** Whether a reliable word boundary has arrived for this reading. */
    private speechBoundarySeen;
    /** Reader interruption prevents later speech events from hiding content again. */
    private speechDismissed;
    /** Watches late or replaced author content, never individual reveal attributes. */
    private readonly observer;
    /** Ends animation when the reader interacts with this content. */
    private readonly finish;
    /** Restarts when the operating-system motion preference changes. */
    private readonly motionChanged;
    /** Attributes controlling timing and segmentation. */
    static get observedAttributes(): string[];
    /** Reads a nonnegative finite timing, falling back for missing or invalid values. */
    private timing;
    /** Letters or words revealed per second. */
    get speed(): number;
    /** Sets the reveal rate; higher values reveal text faster. */
    set speed(value: number);
    /** Initial and inter-cycle delay in milliseconds. */
    get delay(): number;
    /** Sets the initial and inter-cycle delay. */
    set delay(value: number);
    /** Whether the animation repeats. */
    get loop(): boolean;
    /** Enables repetition using boolean presence. */
    set loop(value: boolean);
    /** Whether whole words are revealed together. */
    get word(): boolean;
    /** Switches between word and grapheme segmentation. */
    set word(value: boolean);
    /** Installs shared base styles, motion handling and reader interruption. */
    protected connectedCallback(): void;
    /** Cancels work, restores visible content and releases all subscriptions. */
    disconnectedCallback(): void;
    /** Restarts the connected animation when settings change. */
    protected attributeChangedCallback(): void;
    /** Gives a speech component ownership; content remains visible until a word boundary arrives. */
    attachSpeech(controller: HTMLElement): void;
    /** Releases ownership without letting an obsolete controller affect a newer one. */
    detachSpeech(controller: HTMLElement): void;
    /** Returns the exact readable text, including separators between block elements. */
    getSpeechText(): string;
    /** Prepares a reading; unsupported boundary reporting leaves the complete text visible. */
    beginSpeech(controller: HTMLElement): void;
    /** Reveals through the word at a Web Speech UTF-16 character offset. */
    revealSpeech(controller: HTMLElement, charIndex: number): void;
    /** Restores the complete text after speech ends, stops or fails. */
    endSpeech(controller: HTMLElement): void;
    /** Maps eligible text nodes to one utterance without reading controls or hidden source code. */
    private speechSnapshot;
    /** Watches content changes while avoiding self-generated wrapping mutations. */
    private observe;
    /** Clears the current timer. */
    private cancel;
    /** Coalesces changes until declarative content has arrived. */
    private schedule;
    /** Removes only owned fragment wrappers, retaining author elements and listeners. */
    private unwrap;
    /** Restores the author's focus policy after finishing. */
    private restoreFocus;
    /** Builds visual fragments without duplicating semantic or interactive content. */
    private prepare;
    /** Reveals one fragment, then optionally starts a new cycle after a readable pause. */
    private tick;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-typewriting": TpTypewriting;
    }
}
