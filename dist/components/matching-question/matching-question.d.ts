/** @module components/matching-question */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-matching
 * @summary associates rich content from two or more optionally titled lists without grading the groups.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
import { TpMatching } from "../matching/matching.js";
import { TpQuestion } from "../question/question.js";
/**
 * @summary checks groups across two or more optionally titled lists using tp-matching.
 * @tagname tp-matching-question
 * @attr {boolean} heading = false - Passes heading to the matching widget; the first list supplies column titles.
 * @accessibility Reuses tp-matching keyboard controls and TpQuestion feedback, solution tabs and panel toggles.
 * @keyboard {Tab / Shift+Tab} Moves between association controls, embedded content and question actions.
 * @keyboard {Enter / Space} Activates the focused selection, removal, Reset or Submit button.
 * @keyboard {Escape} Cancels the pending association selection.
 * @example
 * <tp-matching-question>
 *   <dl>
 *     <dt>Title</dt><dd>English and French</dd>
 *     <dt>Prompt</dt><dd>Match each English expression with its French translation.</dd>
 *     <dt>Form</dt><dd>
 *       <ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
 *       <ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
 *     </dd>
 *     <dt>Feedback</dt><dd>Distinguish greetings, thanks and farewells.</dd>
 *     <dt>Solution</dt><dd>Hello — Bonjour; Thank you — Merci; Goodbye — Au revoir.</dd>
 *   </dl>
 * </tp-matching-question>
 */
export declare class TpMatchingQuestion extends TpQuestion {
    static get observedAttributes(): string[];
    /** Whether the first list supplies column titles. @attr heading */
    get heading(): boolean;
    set heading(value: boolean);
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Feedback supplied by an external JSON definition. */
    private sourceFeedback;
    /** Invalidates pending source results after disconnection or reload. */
    private sourceVersion;
    /** Keeps the introductory help and its dismissed state for this question. */
    private selectionHelp;
    /** Creates the shared layout and loads an optional external definition. */
    protected connectedCallback(): void;
    /** Shows initial mouse and keyboard guidance in the Feedback panel. */
    private ensureSelectionHelp;
    /** Invalidates asynchronous results and releases inherited action listeners. */
    disconnectedCallback(): void;
    /** Wraps author lists or titled columns before TpQuestion builds its form panel. */
    protected beforeQuestionLayout(): void;
    /** Finds the reused matching widget instead of a surrounding author paragraph. */
    protected findResponseWidget(): TpMatching | null;
    /** Counts expected pairs from the original first list, regardless of display order. */
    private get pairCount();
    /** Requires a complete one-to-one association before allowing a graded attempt. */
    protected validateSubmit(value: unknown): string | null;
    /** Scores equal original ranks; correct answers omit the author's remedial feedback. */
    protected submitMessage(value: unknown): HTMLElement;
    /** Ignores successful source responses belonging to a disconnected question. */
    protected loadSrc(): Promise<void>;
    /** Validates external content and constructs the same matching widget as inline markup. */
    protected onSrcReady(data: unknown): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-matching-question": TpMatchingQuestion;
    }
}
