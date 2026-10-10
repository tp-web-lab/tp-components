/**
 * @module components/question
 * @summary Base description-list container for question components.
 */
import "../badge/badge.js";
import "../button-group/button-group.js";
import "../callout/callout.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../switcher/switcher.js";
import "../tabs/tabs.js";
import { TpBase } from "../base/base.js";
/**
 * Payload emitted when submit is triggered.
 *
 * @summary Submit event payload.
 */
export interface TpQuestionSubmitDetail {
    value: unknown;
}
/**
 * `<tp-question>` is a base semantic container for question statements,
 * response widgets, feedback and solutions.
 *
 * The component enforces a `<dl><dt><dd>...</dd></dl>` source structure, then
 * renders an interactive layout with:
 * - `<details><summary>` from `Title`
 * - full-width prompt section
 * - input/output toggles at the end of the Prompt row; both panels start visible
 * - responsive two-panel area (form left, feedback/solution right)
 * - reset/submit actions and a message zone under the form
 *
 * Panel toggles preserve content and keep at least one panel visible, as in the viewers.
 *
 * @summary Semantic base container for question content.
 * @tagname tp-question
 * @attr {string} src = "" - URL of an external question definition.
 * @attr {boolean} open = false - Expands the question; absent by default, leaving only its title visible.
 * @event tp-question-submit - Fired when the submit icon button is activated.
 *   `detail: { value: unknown }`
 * @example
 * <tp-question>
 *     <dl>
 *       <dt>Title</dt><dd>Reflection</dd>
 *       <dt>Prompt</dt><dd>Describe one benefit of web components.</dd>
 *     <dt>Form</dt><dd><tp-textfield multiline="" rows="3" placeholder="Type your answer..."></tp-textfield></dd>
 *       <dt>Feedback</dt><dd>Think about encapsulation and reuse.</dd>
 *       <dt>Solution</dt><dd>They package reusable behavior behind a custom element.</dd>
 *     </dl>
 *   </tp-question>
 */
export declare class TpQuestion extends TpBase {
    static get observedAttributes(): string[];
    /** Whether the question is expanded. Boolean attributes use presence only. */
    get open(): boolean;
    /** Expands or collapses the question without discarding answers. */
    set open(value: boolean);
    /** Synchronizes declarative visibility changes with the native disclosure. */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Global stylesheet identifier for the component.
     *
     * @summary Identifier of the question stylesheet.
     * @internal
     */
    private static readonly styleId;
    /**
     * Reference to the reset action button.
     *
     * @summary Reset button element.
     * @internal
     */
    private resetButtonEl;
    /**
     * Reference to the submit action button.
     *
     * @summary Submit button element.
     * @internal
     */
    private submitButtonEl;
    /** Input/output visibility controls, retained across layout updates. */
    private panelToggleButtons;
    /** Unique suffix for accessible panel identifiers. */
    private static nextPanelId;
    /**
     * Reference to the message/status zone.
     *
     * @summary Message zone element.
     * @internal
     */
    private messageEl;
    /**
     * Reference to the normalized Solution tab. Accessible by default.
     *
     * @summary Solution tab handle.
     */
    protected solutionTabEl: HTMLElement | null;
    /**
     * Reference to tabs controlling Feedback/Solution.
     *
     * @summary Feedback tabs handle.
     * @internal
     */
    private feedbackTabsEl;
    /**
     * Runtime feedback output container inside the Feedback tab.
     *
     * @summary Dynamic feedback output root.
     * @internal
     */
    private feedbackOutputEl;
    private feedbackSourceEl;
    protected hasSpecificFeedback: boolean;
    protected srcMarkup: "markdown" | "html" | "none";
    /**
     * Number of times the user has clicked submit since the component connected.
     * Not reset by the reset button.
     *
     * @summary Submit attempt counter.
     */
    protected tries: number;
    /**
     * The last successfully submitted value. Used to detect no-change resubmissions.
     *
     * @summary Last submitted value.
     */
    private lastSubmittedValue;
    /**
     * URL to an external JSON file providing question data (items, answer, feedback).
     * When set, the answer is never exposed in the HTML source.
     *
     * @summary External question data URL.
     */
    get src(): string;
    /**
     * Fetches and parses JSON from `src`. Returns the parsed data, or `null` on
     * error (error is automatically displayed inside the form section).
     *
     * @summary Loads external question data.
     * @param src URL of the JSON file.
     * @returns Parsed JSON or `null`.
     */
    protected fetchSrc(src: string): Promise<unknown | null>;
    /**
     * Displays an error message inside the form section and logs it to the console.
     * Called automatically by `fetchSrc` on network failure; also available for
     * subclasses to report schema validation errors.
     *
     * @summary Renders a src-load error.
     * @param message Human-readable error description.
     */
    protected showSrcError(message: string): void;
    /**
     * Updates the question title (summary text) from src data.
     * No-op when the summary element is absent.
     *
     * @summary Sets the collapsible title from src.
     * @param text Plain text title.
     */
    protected updateSrcTitle(text: string, markup?: "html" | "markdown" | "none"): void;
    /**
     * Updates the prompt content from src data.
     * Sets the content as a `<tp-markdown>` element for markdown rendering.
     *
     * @summary Sets the prompt from src.
     * @param markdown Markdown or plain-text prompt.
     */
    protected updateSrcPrompt(markdown: string, markup?: "html" | "markdown" | "none"): void;
    /**
     * Updates the solution tab content from src data.
     * Sets the content as a `<tp-markdown>` element for markdown rendering.
     *
     * @summary Sets the solution from src.
     * @param markdown Markdown or plain-text solution.
     */
    protected updateSrcSolution(markdown: string, markup?: "html" | "markdown" | "none"): void;
    /** Displays the same kind of absence notice as the Feedback panel. */
    private showMissingSolution;
    /**
     * Normalizes src markup aliases to a concrete rendering mode.
     *
     * @summary Resolves the effective markup mode.
     * @param markup Raw markup value from JSON.
     * @returns Concrete rendering mode.
     */
    protected normalizeSrcMarkup(markup: string | undefined): "markdown" | "html" | "none";
    /**
     * Replaces a target element with content interpreted according to the src
     * markup mode.
     *
     * @summary Renders src content into a target node.
     * @param target Destination element.
     * @param content Raw string content from the JSON file.
     * @param markup Markup mode.
     */
    protected replaceWithSrcContent(target: HTMLElement, content: string, markup?: string): void;
    /**
     * Creates a node for src content according to the selected markup mode.
     *
     * @summary Builds the rendered node for JSON string content.
     * @param content Raw string content from the JSON file.
     * @param markup Markup mode.
     * @returns A node ready to append into the DOM.
     */
    protected createSrcContentNode(content: string, markup?: string): Node;
    /**
     * Creates a `<tp-markdown>` element for rendering markdown or inline web
     * component directives such as `:tp-icon:{...}`.
     *
     * @summary Wraps markdown text in a tp-markdown element.
     * @param markdown Markdown or plain-text content.
     * @returns Configured tp-markdown element.
     */
    protected createMarkdownElement(markdown: string): HTMLElement;
    /**
     * Returns the rendered form content container (populated after layout render).
     * Subclasses should target this element — not the source `<dd>` — when adding
     * or replacing form widgets from src data.
     *
     * @summary Rendered form content container.
     */
    protected get formContent(): HTMLElement | null;
    /**
     * Called after `fetchSrc` succeeds. Override in subclasses to validate and
     * apply the loaded JSON data. Default implementation is a no-op.
     *
     * @summary Hook invoked when external src data is ready.
     * @param _data Parsed JSON data from the `src` file.
     */
    protected onSrcReady(_data: unknown): Promise<void>;
    /**
     * Initiates the fetch → validate → apply pipeline when `src` is set.
     * Subclasses call this from their `connectedCallback` after `super.connectedCallback()`.
     *
     * @summary Triggers src loading when the src attribute is present.
     */
    protected loadSrc(): Promise<void>;
    /**
     * Connects the component and enforces normalized question structure.
     *
     * @summary Initializes question structure and styles.
     */
    protected connectedCallback(): void;
    /**
     * Allows subclasses to adapt their authored source before the shared
     * question layout is normalized.
     *
     * @summary Prepares subclass-specific question source.
     * @internal
     */
    protected beforeQuestionLayout(): void;
    /**
     * Cleans action listeners when disconnected.
     *
     * @summary Disconnects action listeners.
     */
    disconnectedCallback(): void;
    /**
     * Returns the `<dd>` node of the title section.
     *
     * @summary Returns the title content node.
     */
    get titleSection(): HTMLElement | null;
    /**
     * Returns the `<dd>` node of the statement section.
     *
     * @summary Returns the statement content node.
     */
    get statement(): HTMLElement | null;
    /**
     * Returns the `<dd>` node of the response section.
     *
     * @summary Returns the response content node.
     */
    get response(): HTMLElement | null;
    /**
     * Returns the `<dd>` node of the feedback section.
     *
     * @summary Returns the feedback content node.
     */
    get feedback(): HTMLElement | null;
    /**
     * Returns the `<dd>` node of the solution section.
     *
     * @summary Returns the solution content node.
     */
    get solution(): HTMLElement | null;
    /**
     * Ensures the host contains a single normalized `<dl>`.
     *
     * @summary Enforces the description-list question source structure.
     * @returns Normalized source `<dl>`.
     * @internal
     */
    private ensureDefinitionList;
    /**
     * Returns a single source `<dl>`, creating one when needed.
     *
     * @summary Creates or reuses the source description list.
     * @returns Root description list element.
     * @internal
     */
    private ensureSingleDl;
    /**
     * Normalizes `<dt>/<dd>` pairs and ensures required sections exist.
     *
     * @summary Normalizes section pairs in canonical order.
     * @param list Source description list.
     * @internal
     */
    private normalizeSections;
    /**
     * Builds the rendered details/panels/tabs UI from normalized sections.
     *
     * @summary Renders the interactive question layout.
     * @param list Normalized source list.
     * @internal
     */
    private renderQuestionLayout;
    private ensureQuestionPanels;
    /**
     * Attaches action listeners once.
     *
     * @summary Binds reset and submit actions.
     * @internal
     */
    private bindActions;
    /**
     * Detaches action listeners.
     *
     * @summary Unbinds reset and submit actions.
     * @internal
     */
    private unbindActions;
    /** Toggles one panel while keeping at least one visible, as in the viewers. */
    private handlePanelToggle;
    /** Hides panels without recreating their content and synchronizes native button ARIA. */
    private updatePanelVisibility;
    private clearMessage;
    /**
     * Resets the embedded response widget when available.
     *
     * @summary Handles reset action.
     * @internal
     */
    private handleResetClick;
    /**
     * Hook called after reset is applied. Override in subclasses for custom post-reset logic.
     *
     * @summary Post-reset hook for subclasses.
     */
    protected onReset(): void;
    /**
     * Hook called on every submit click with the current widget value.
     * Override in subclasses to react to the attempt and value.
     *
     * @summary Post-attempt hook for subclasses.
     * @param _value Current value from the response widget.
     */
    protected onSubmitAttempt(_value: unknown): void;
    /** Allows specialized asynchronous exercises to rerun an unchanged answer. */
    protected get allowRepeatedSubmission(): boolean;
    /** Reads the answer exposed by the response widget. */
    protected readResponseValue(): unknown;
    /**
     * Text displayed in the message area after a reset. Override in subclasses to customize.
     *
     * @summary Reset confirmation message.
     */
    protected get resetMessageText(): string;
    /**
     * Emits a submit event carrying the current widget value when available.
     *
     * @summary Handles submit action.
     * @internal
     */
    private handleSubmitClick;
    /**
     * Validates the submitted value. Return a warning string to block submission, or null to allow.
     * Override in subclasses to add specific validation.
     *
     * @summary Validates submitted value.
     * @param value Value from the response widget.
     * @returns Warning message or null.
     */
    protected validateSubmit(value: unknown): string | null;
    /**
     * Returns author-provided feedback after submission, or a generic confirmation when absent.
     * Override in subclasses to provide answer-specific feedback.
     *
     * @summary Submit confirmation message.
     * @param value Submitted value from the response widget.
     * @returns Message as string or HTMLElement.
     */
    protected submitMessage(_value: unknown): string | HTMLElement;
    /** Copies general feedback left after subclasses consume their per-item list. */
    protected createGeneralFeedback(): HTMLElement | null;
    /**
     * Ensures the Feedback tab is selected.
     *
     * @summary Activates Feedback panel before writing output.
     */
    protected activateFeedbackPanel(): void;
    /**
     * Selects Solution tab when available.
     *
     * @summary Opens the Solution panel.
     */
    protected openSolutionPanel(): void;
    /**
     * Creates a button opening the Solution tab.
     *
     * @summary Builds a "See more in the solution…" CTA button.
     * @returns Ready-to-use button.
     */
    protected createOpenSolutionButton(): HTMLButtonElement;
    /**
     * Builds the attempt metadata line with tries badge and current time.
     *
     * @summary Creates "<badge>N</badge> hh:mm:ss" line.
     * @returns Metadata line element.
     */
    protected createAttemptMetaLine(): HTMLDivElement;
    /**
     * Builds a single inline summary line containing tries badge, current time,
     * and score.
     *
     * @summary Creates "<badge>N</badge> hh:mm:ss n/t" line.
     * @param score Number of correct items.
     * @param total Total evaluated items.
     * @returns Summary line element.
     */
    protected createAttemptSummaryLine(score: number, total: number): HTMLDivElement;
    /**
     * Builds a score line in `n/t` format.
     *
     * @summary Creates score line.
     * @param score Number of correct items.
     * @param total Total evaluated items.
     * @returns Score line element.
     */
    protected createScoreLine(score: number, total: number): HTMLParagraphElement;
    /**
     * Renders the compact submit status in the left toolbar message area.
     *
     * @summary Displays "<badge>tries</badge> submitted".
     */
    private renderSubmitStatusMessage;
    /**
     * Reads and removes a direct feedback list from the Feedback tab.
     *
     * @summary Consumes author-provided per-item feedback list.
     * @returns List item HTML payloads, one per feedback item.
     */
    protected consumeFeedbackListItems(): string[];
    /**
     * Whether the result needs a notice about missing author feedback.
     *
     * @summary Controls the missing-feedback notice for a submission.
     */
    protected shouldShowMissingFeedback(): boolean;
    /** Displays the submission result, with a missing-feedback notice when appropriate. */
    protected renderFeedbackResult(content: string | HTMLElement): void;
    /**
     * Re-renders the feedback placeholder callout to reflect the current
     * `hasSpecificFeedback` state. Call after setting `hasSpecificFeedback`
     * from async src loading so the initial message is consistent.
     *
     * @summary Updates the initial feedback placeholder callout.
     */
    protected updateFeedbackPlaceholder(): void;
    /**
     * Finds the primary response widget inside the rendered form panel.
     *
     * @summary Returns the first embedded tp-* response element.
     * @returns Response widget element or `null`.
     * @internal
     */
    protected findResponseWidget(): HTMLElement | null;
    /**
     * Resolves a section definition from a heading text.
     *
     * @summary Matches a heading against known question sections.
     * @param heading Heading text from `<dt>`.
     * @returns Matching section definition or `null`.
     * @internal
     */
    private resolveSection;
    /**
     * Creates an empty `<dt>/<dd>` pair.
     *
     * @summary Creates a default section pair.
     * @param heading Section heading.
     * @returns Section pair nodes.
     * @internal
     */
    private createSectionPair;
    /**
     * Returns the `<dd>` element for a canonical section id.
     *
     * @summary Gets a normalized section content node.
     * @param listOrSectionId Description list or section id.
     * @param sectionId Section id (when first param is a list).
     * @returns Matching `<dd>` element or `null`.
     * @internal
     */
    private getSectionDd;
    /**
     * Ensures a unique element exists in this component.
     *
     * @summary Returns an existing element or creates it.
     * @param selector Selector used to find the node.
     * @param create Factory called when the node is absent.
     * @returns Existing or created node.
     * @internal
     */
    private ensureElement;
    /**
     * Ensures a specific child exists in a given parent.
     *
     * @summary Returns an existing child node or creates it.
     * @param parent Parent element.
     * @param selector Child selector.
     * @param tagName Tag used when creating.
     * @param attributes Attributes to set on creation.
     * @returns Existing or created child element.
     * @internal
     */
    private ensureChild;
    /**
     * Moves all child nodes from one container to another.
     *
     * @summary Moves section content into rendered containers.
     * @param from Source element.
     * @param to Target element.
     * @internal
     */
    private moveChildren;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-question": TpQuestion;
    }
}
