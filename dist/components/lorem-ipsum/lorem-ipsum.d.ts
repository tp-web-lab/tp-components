/** @module components/lorem-ipsum */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
import { TpBase } from "../base/base.js";
import "../callout/callout.js";
import { type LoremType } from "./generator.js";
/**
 * @summary generates placeholder sentences, titles, paragraphs or lists.
 * @tagname tp-lorem-ipsum
 * @attr {"sentence"|"title"|"p"|"dl"|"ol"|"ul"} type = "p" - Generated structure; title and sentence produce plain text.
 * @attr {string} length = "3-5" - Number or inclusive range of paragraphs or list entries; ignored for title and sentence.
 * @attr {string} words-per-sentence = "4-16" - Number or inclusive range of words per sentence or title.
 * @attr {string} sentences-per-paragraph = "3-6" - Number or inclusive range of sentences per paragraph; applies only to p.
 * @attr {string} seed = "" - Integer seed for repeatable output; empty generates fresh random text.
 * @accessibility Uses native paragraphs and list semantics without announcing decorative placeholder updates.
 * @accessibilityresponsibility Replace placeholder text with meaningful content before publishing.
 * @example
 * <tp-lorem-ipsum length="1" words-per-sentence="8" sentences-per-paragraph="2" seed="42"></tp-lorem-ipsum>
 */
export declare class TpLoremIpsum extends TpBase {
    /** Pending render, coalescing consecutive attribute changes. */
    private timer;
    /** Attributes affecting generated content. */
    static get observedAttributes(): string[];
    /** Kind of generated content, falling back to paragraphs. */
    get type(): LoremType;
    /** Changes the output structure. */
    set type(value: LoremType);
    /** Paragraph or list-entry count or range. */
    get length(): string;
    /** Changes the paragraph or list-entry count. */
    set length(value: string);
    /** Word count or inclusive range. */
    get wordsPerSentence(): string;
    /** Changes the word count. */
    set wordsPerSentence(value: string);
    /** Sentence count per paragraph. */
    get sentencesPerParagraph(): string;
    /** Changes the paragraph sentence count. */
    set sentencesPerParagraph(value: string);
    /** Optional integer seed expressed as an attribute string. */
    get seed(): string;
    /** Changes the random seed; empty restores unseeded generation. */
    set seed(value: string);
    /** Installs layout only; typography comes from the library's native element styles. */
    protected connectedCallback(): void;
    /** Releases deferred work when detached. */
    disconnectedCallback(): void;
    /** Regenerates after changes to local settings, not inherited presentation settings. */
    protected attributeChangedCallback(name: string): void;
    /** Groups synchronous attribute changes into a single generation. */
    private schedule;
    /** Computes a conservative count bound before allocating generated content. */
    private upperBound;
    /** Generates new content; the same seed and parameters always reproduce the same output. */
    regenerate(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-lorem-ipsum": TpLoremIpsum;
    }
}
