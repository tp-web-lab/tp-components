/** Pedagogical solution prompts and optional assistance. */
import "../button/button.js";
import "../tabs/tabs.js";
/** Reads source code through editor APIs, preserving Python indentation and comments. */
export declare function questionMaterialText(element: Element | null): string;
/** Split only the first slash so provider-specific model identifiers stay intact. */
export declare function questionAiAssistant(value: string | null): {
    assistant: string;
    model?: string;
    value: string;
};
/** Includes the current question and the contexts of its enclosing exercises. */
export declare function solutionPrompt(host: HTMLElement, panel: HTMLElement): string;
export declare class QuestionAi {
    private readonly host;
    private controller;
    constructor(host: HTMLElement);
    sync(): void;
    dispose(): void;
}
