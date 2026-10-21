import "../callout/callout.js";
/** Live sentence reconstruction, independent of whether answers are typed or selected. */
export declare class AnswerReading {
    private readonly form;
    private readonly reading;
    private readonly callout;
    private readonly observer;
    private readonly onEdit;
    constructor(form: HTMLElement);
    destroy(): void;
    /** Preserves rich formulas and images while removing field frames and controls. */
    private updateReading;
    /** Keeps only the visual SVG and its accessible label, not MathJax rerendering sources. */
    private normalizeReadingMath;
}
/** Freezes rendered tp-math copies whose inline source lives only in the original instance. */
export declare function preserveRenderedMath(content: DocumentFragment): void;
