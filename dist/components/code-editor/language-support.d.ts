import type { Extension } from "@codemirror/state";
export declare function getLoadedLanguageSupport(language: string): Extension;
/** Share language downloads; a failed download remains retryable. */
export declare function loadLanguageSupport(language: string): Promise<Extension> | null;
